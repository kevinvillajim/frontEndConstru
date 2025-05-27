// src/ui/pages/calculations/shared/hooks/useCatalogTemplates.tsx

import {useState, useEffect, useCallback, useMemo} from "react";
import {templateApplicationService} from "../../../../../core/application/ServiceFactory";
import type {
	CalculationTemplate,
	TemplateFilters,
	SortOption,
	CatalogStats,
	UseCatalogTemplatesOptions,
	UseCatalogSearchReturn,
	TemplateCategory,
} from "../types/template.types";
import {TEMPLATE_CATEGORIES} from "../types/template.types";
import {useAuth} from "../../../../context/AuthContext";

// ==================== HOOK PRINCIPAL ====================
export const useCatalogTemplates = (
	options: UseCatalogTemplatesOptions = {}
) => {
	const {user} = useAuth();
	const [templates, setTemplates] = useState<CalculationTemplate[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [currentUserId, setCurrentUserId] = useState<string | null>(null);

	// Cargar templates
	const refreshTemplates = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);

			const result = await templateApplicationService.getTemplates({
				showOnlyVerified: options.onlyVerified ?? true,
				showOnlyFeatured: false,
				limit: 100,
			});

			if (result.data) {
				// ✅ CARGAR FAVORITOS SI HAY USUARIO
				if (user) {
					const favorites = await templateApplicationService.getUserFavorites(
						user.id
					);
					const favoriteIds = new Set(favorites.map((f) => f.id));

					const templatesWithFavorites = result.data.map((template) => ({
						...template,
						isFavorite: favoriteIds.has(template.id),
					}));

					setTemplates(templatesWithFavorites);
				} else {
					setTemplates(result.data);
				}
			}
		} catch (err) {
			console.error("Error loading templates:", err);
			setError("Error cargando plantillas");
		} finally {
			setIsLoading(false);
		}
	}, [options.onlyVerified, user]);

	// Toggle favorite
	const toggleFavorite = useCallback(
		async (templateId: string) => {
			if (!user) {
				console.warn("User not authenticated, cannot toggle favorite");
				return;
			}

			try {
				const newIsFavorite = await templateApplicationService.toggleFavorite(
					user.id,
					templateId
				);

				// Actualizar estado local
				setTemplates((prev) =>
					prev.map((template) =>
						template.id === templateId
							? {...template, isFavorite: newIsFavorite}
							: template
					)
				);
			} catch (error) {
				console.error("Error toggling favorite:", error);
			}
		},
		[user]
	);

	// Cargar al inicializar
	useEffect(() => {
		if (options.autoLoad !== false) {
			refreshTemplates();
		}
	}, [refreshTemplates, options.autoLoad]);

	// Calcular categorías con conteos
	const categoriesWithCounts = useMemo(() => {
		return TEMPLATE_CATEGORIES.map((category) => ({
			...category,
			count: templates.filter(
				(t) => t.type === category.id || t.category === category.id
			).length,
			subcategories: category.subcategories?.map((sub) => ({
				...sub,
				count: templates.filter(
					(t) =>
						(t.type === category.id || t.category === category.id) &&
						(t.subcategory === sub.id || t.type === sub.id)
				).length,
			})),
		}));
	}, [templates]);

	// Calcular estadísticas
	const stats = useMemo((): CatalogStats => {
		return {
			total: templates.length,
			verifiedCount: templates.filter((t) => t.isVerified || t.verified).length,
			avgRating:
				templates.length > 0
					? templates.reduce(
							(sum, t) => sum + (t.averageRating || t.rating || 0),
							0
						) / templates.length
					: 0,
			totalUsage: templates.reduce((sum, t) => sum + (t.usageCount || 0), 0),
			trendingCount: templates.filter((t) => t.trending).length,
			popularCount: templates.filter((t) => t.popular).length,
		};
	}, [templates]);

	const clearError = useCallback(() => setError(null), []);

	return {
		templates,
		categories: categoriesWithCounts,
		isLoading,
		error,
		stats,
		toggleFavorite,
		refreshTemplates,
		clearError,
		setCurrentUserId,
	};
};

// ==================== HOOK DE BÚSQUEDA ====================
export const useCatalogSearch = (): UseCatalogSearchReturn => {
	const [searchTerm, setSearchTerm] = useState("");
	const [sortBy, setSortBy] = useState<SortOption>("popular");
	const [activeFilters, setActiveFilters] = useState<TemplateFilters>({
		showOnlyVerified: true,
	});

	// Hook principal para obtener templates
	const {templates: allTemplates} = useCatalogTemplates({autoLoad: true});

	const updateFilter = useCallback(
		(key: keyof TemplateFilters, value: unknown) => {
			setActiveFilters((prev) => ({...prev, [key]: value}));
		},
		[]
	);

	const clearFilters = useCallback(() => {
		setSearchTerm("");
		setSortBy("popular");
		setActiveFilters({showOnlyVerified: true});
	}, []);

	// Aplicar filtros y búsqueda
	const templates = useMemo(() => {
		let filtered = allTemplates;

		// Filtrar por búsqueda
		if (searchTerm) {
			filtered = filtered.filter(
				(template) =>
					template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					template.description.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		// Filtrar por categoría
		if (activeFilters.category) {
			filtered = filtered.filter(
				(template) =>
					template.type === activeFilters.category ||
					template.category === activeFilters.category
			);
		}

		// Filtrar por subcategoría
		if (activeFilters.subcategory) {
			filtered = filtered.filter(
				(template) =>
					template.subcategory === activeFilters.subcategory ||
					template.type === activeFilters.subcategory
			);
		}

		// Filtrar por dificultad
		if (activeFilters.difficulty) {
			filtered = filtered.filter(
				(template) => template.difficulty === activeFilters.difficulty
			);
		}

		// Filtrar solo favoritos
		if (activeFilters.showOnlyFavorites) {
			filtered = filtered.filter((template) => template.isFavorite);
		}

		// Filtrar solo verificados
		if (activeFilters.showOnlyVerified) {
			filtered = filtered.filter(
				(template) => template.isVerified || template.verified
			);
		}

		// Filtrar solo destacados
		if (activeFilters.showOnlyFeatured) {
			filtered = filtered.filter(
				(template) =>
					template.trending || template.popular || template.isFeatured
			);
		}

		// Ordenar
		switch (sortBy) {
			case "popular":
				filtered.sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0));
				break;
			case "rating":
				filtered.sort(
					(a, b) =>
						(b.averageRating || b.rating || 0) -
						(a.averageRating || a.rating || 0)
				);
				break;
			case "trending":
				filtered.sort((a, b) => {
					if (b.trending && !a.trending) return 1;
					if (!b.trending && a.trending) return -1;
					return (b.usageCount || 0) - (a.usageCount || 0);
				});
				break;
			case "recent":
				filtered.sort(
					(a, b) =>
						new Date(b.updatedAt || b.lastUpdated || 0).getTime() -
						new Date(a.updatedAt || a.lastUpdated || 0).getTime()
				);
				break;
			case "name":
				filtered.sort((a, b) => a.name.localeCompare(b.name));
				break;
		}

		return filtered;
	}, [allTemplates, searchTerm, activeFilters, sortBy]);

	const hasActiveFilters = useMemo(() => {
		return (
			searchTerm !== "" ||
			activeFilters.category !== undefined ||
			activeFilters.subcategory !== undefined ||
			activeFilters.difficulty !== undefined ||
			activeFilters.showOnlyFavorites === true ||
			activeFilters.showOnlyFeatured === true ||
			activeFilters.showOnlyVerified !== true
		); // Solo cuenta como filtro activo si no está en true (default)
	}, [searchTerm, activeFilters]);

	return {
		searchTerm,
		activeFilters,
		sortBy,
		templates,
		setSearchTerm,
		setSortBy,
		updateFilter,
		clearFilters,
		hasActiveFilters,
	};
};
