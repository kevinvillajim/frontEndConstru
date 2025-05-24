// src/ui/pages/calculations/shared/hooks/useCatalogTemplates.tsx

import {useState, useEffect, useCallback, useMemo, useRef} from "react";
import {templateApplicationService} from "../../../../../core/application/ServiceFactory";
import {CalculationTemplate} from "../../../../../core/domain/models/calculations/CalculationTemplate";
import type {
	TemplateFilters as DomainTemplateFilters,
	PaginatedResult,
} from "../../../../../core/domain/repositories/CalculationTemplateRepository";

import type {
	CalculationTemplate as UITemplate,
	TemplateFilters as UITemplateFilters,
	TemplateCategoryType,
	TemplateStats,
} from "../types/template.types";

// ==================== INTERFACES ====================
export interface UseCatalogTemplatesOptions {
	autoLoad?: boolean;
	includePersonal?: boolean;
	onlyVerified?: boolean;
}

export interface UseCatalogTemplatesReturn {
	templates: UITemplate[];
	categories: TemplateCategoryType[];
	isLoading: boolean;
	error: string | null;
	stats: TemplateStats;
	toggleFavorite: (templateId: string) => Promise<void>;
	refreshTemplates: () => Promise<void>;
	clearError: () => void;
	setCurrentUserId: (userId: string) => void;
}

export interface UseCatalogSearchReturn {
	searchTerm: string;
	activeFilters: UITemplateFilters;
	sortBy: UITemplateFilters["sortBy"];
	templates: UITemplate[];
	setSearchTerm: (term: string) => void;
	setSortBy: (sort: UITemplateFilters["sortBy"]) => void;
	updateFilter: (key: keyof UITemplateFilters, value: any) => void;
	clearFilters: () => void;
	hasActiveFilters: boolean;
}

// ==================== CONVERSIÓN DE TIPOS ====================
const convertDomainToUI = (domain: CalculationTemplate): UITemplate => {
	const thirtyDaysAgo = new Date();
	thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
	const isNew = domain.createdAt > thirtyDaysAgo;
	const usageCount = domain.usageCount || 0;
	const rating = domain.averageRating || 0;

	return {
		id: domain.id,
		name: domain.name,
		description: domain.description,
		version: domain.version,
		category: domain.type,
		subcategory: domain.type,
		profession: domain.targetProfession ? [domain.targetProfession] : [],
		targetProfession: domain.targetProfession,
		tags: domain.tags || [],
		difficulty: domain.getDifficultyLevel(),
		estimatedTime: domain.getEstimatedTime(),
		necReference: domain.necReference,
		nec_reference: domain.necReference,
		requirements: [], // Placeholder
		parameters: domain.parameters || [],
		verified: domain.isVerified,
		is_verified: domain.isVerified,
		isPublic: domain.isPublic(),
		isNew: isNew,
		trending: domain.isTrending(),
		popular: usageCount > 100,
		rating: rating,
		average_rating: rating,
		usageCount: usageCount,
		usage_count: usageCount,
		lastUpdated: domain.updatedAt.toISOString(),
		isFavorite: false, // Se carga por separado
		color: getCategoryColor(domain.type),
		icon: null,
		allowSuggestions: true,
		createdBy: domain.createdBy,
		created_by: domain.createdBy,
		contributors: [],
		type: domain.type,
		formula: domain.formula,
	};
};

const getCategoryColor = (category: string): string => {
	switch (category?.toLowerCase()) {
		case "structural":
		case "foundation":
			return "from-blue-600 to-blue-500";
		case "electrical":
		case "installation":
			return "from-yellow-600 to-yellow-500";
		case "architectural":
			return "from-green-600 to-green-500";
		case "hydraulic":
		case "plumbing":
			return "from-cyan-600 to-cyan-500";
		case "mechanical":
			return "from-purple-600 to-purple-500";
		case "geotechnical":
			return "from-gray-600 to-gray-500";
		default:
			return "from-primary-600 to-secondary-500";
	}
};

// ==================== CATEGORÍAS MOCK ====================
const MOCK_CATEGORIES: TemplateCategoryType[] = [
	{
		id: "structural",
		name: "Estructural",
		description: "Análisis y diseño estructural",
		color: "bg-blue-50 border-blue-200 text-blue-700",
		count: 0,
		subcategories: [
			{id: "beams", name: "Vigas", count: 0},
			{id: "columns", name: "Columnas", count: 0},
			{id: "slabs", name: "Losas", count: 0},
		],
	},
	{
		id: "electrical",
		name: "Eléctrico",
		description: "Instalaciones eléctricas",
		color: "bg-yellow-50 border-yellow-200 text-yellow-700",
		count: 0,
		subcategories: [
			{id: "circuits", name: "Circuitos", count: 0},
			{id: "demand", name: "Demanda", count: 0},
		],
	},
	{
		id: "hydraulic",
		name: "Hidráulico",
		description: "Sistemas hidráulicos",
		color: "bg-cyan-50 border-cyan-200 text-cyan-700",
		count: 0,
		subcategories: [
			{id: "pipes", name: "Tuberías", count: 0},
			{id: "pumps", name: "Bombas", count: 0},
		],
	},
	{
		id: "geotechnical",
		name: "Geotécnico",
		description: "Mecánica de suelos",
		color: "bg-stone-50 border-stone-200 text-stone-700",
		count: 0,
		subcategories: [
			{id: "foundations", name: "Cimentaciones", count: 0},
			{id: "soil", name: "Suelos", count: 0},
		],
	},
];

// ==================== HOOK PRINCIPAL DE CATÁLOGO ====================
export const useCatalogTemplates = (
	options: UseCatalogTemplatesOptions = {}
): UseCatalogTemplatesReturn => {
	const {
		autoLoad = true,
		includePersonal = false,
		onlyVerified = true,
	} = options;

	// Estados
	const [templates, setTemplates] = useState<UITemplate[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [currentUserId, setCurrentUserId] = useState<string>("");

	// Refs para evitar bucles infinitos
	const loadingRef = useRef(false);
	const abortControllerRef = useRef<AbortController | null>(null);

	// Categorías con conteos
	const categories = useMemo(() => {
		return MOCK_CATEGORIES.map((category) => ({
			...category,
			count: templates.filter((t) => t.category === category.id).length,
			subcategories: category.subcategories?.map((sub) => ({
				...sub,
				count: templates.filter(
					(t) => t.category === category.id && t.subcategory === sub.id
				).length,
			})),
		}));
	}, [templates]);

	// Estadísticas
	const stats = useMemo((): TemplateStats => {
		return {
			total: templates.length,
			verifiedCount: templates.filter((t) => t.verified).length,
			avgRating:
				templates.length > 0
					? templates.reduce((sum, t) => sum + (t.rating || 0), 0) /
						templates.length
					: 0,
			totalUsage: templates.reduce((sum, t) => sum + (t.usageCount || 0), 0),
			trendingCount: templates.filter((t) => t.trending).length,
			popularCount: templates.filter((t) => t.popular).length,
		};
	}, [templates]);

	// Cargar templates (con prevención de bucle infinito)
	const loadTemplates = useCallback(async () => {
		if (loadingRef.current) return;

		try {
			loadingRef.current = true;
			setIsLoading(true);
			setError(null);

			// Cancelar request anterior si existe
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}

			// Crear nuevo AbortController
			abortControllerRef.current = new AbortController();

			const filters: DomainTemplateFilters = {
				isActive: true,
				sortBy: "usage_count",
				sortOrder: "DESC",
				limit: 50,
			};

			if (onlyVerified) {
				filters.isVerified = true;
				filters.shareLevel = "public";
			}

			console.log("Loading templates with filters:", filters);

			const result = await templateApplicationService.getTemplates(filters);

			// Verificar si la operación fue cancelada
			if (abortControllerRef.current?.signal.aborted) {
				return;
			}

			const convertedTemplates = result.data.map(convertDomainToUI);

			// Cargar favoritos si hay usuario
			if (currentUserId) {
				try {
					const favorites =
						await templateApplicationService.getUserFavorites(currentUserId);
					const favoriteIds = new Set(favorites.map((f) => f.id));

					convertedTemplates.forEach((template) => {
						template.isFavorite = favoriteIds.has(template.id);
					});
				} catch (favError) {
					console.warn("Error loading favorites:", favError);
				}
			}

			setTemplates(convertedTemplates);
		} catch (err) {
			if (err.name === "AbortError") {
				console.log("Request was cancelled");
				return;
			}

			console.error("Error loading templates:", err);
			setError(
				err instanceof Error ? err.message : "Error al cargar plantillas"
			);
		} finally {
			loadingRef.current = false;
			setIsLoading(false);
		}
	}, [onlyVerified, currentUserId]);

	// Refresh templates (wrapper para loadTemplates)
	const refreshTemplates = useCallback(() => {
		return loadTemplates();
	}, [loadTemplates]);

	// Toggle favorite
	const toggleFavorite = useCallback(
		async (templateId: string) => {
			if (!currentUserId) {
				console.warn("No user ID available for toggle favorite");
				return;
			}

			try {
				const newIsFavorite = await templateApplicationService.toggleFavorite(
					currentUserId,
					templateId
				);

				setTemplates((prev) =>
					prev.map((t) =>
						t.id === templateId ? {...t, isFavorite: newIsFavorite} : t
					)
				);
			} catch (error) {
				console.error("Error toggling favorite:", error);
				setError("Error al actualizar favorito");
			}
		},
		[currentUserId]
	);

	// Clear error
	const clearError = useCallback(() => {
		setError(null);
	}, []);

	// Efecto principal - solo se ejecuta cuando cambian las opciones críticas
	useEffect(() => {
		if (autoLoad) {
			loadTemplates();
		}

		// Cleanup function
		return () => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
		};
	}, [autoLoad, onlyVerified]); // Solo dependencias estables

	// Cleanup al desmontar
	useEffect(() => {
		return () => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
		};
	}, []);

	return {
		templates,
		categories,
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
	const [sortBy, setSortBy] = useState<UITemplateFilters["sortBy"]>("popular");
	const [activeFilters, setActiveFilters] = useState<UITemplateFilters>({});

	// Usar el hook principal para obtener templates
	const {templates: allTemplates} = useCatalogTemplates({
		autoLoad: true,
		onlyVerified: true,
	});

	// Update filter
	const updateFilter = useCallback(
		(key: keyof UITemplateFilters, value: any) => {
			setActiveFilters((prev) => ({
				...prev,
				[key]: value,
			}));
		},
		[]
	);

	// Clear filters
	const clearFilters = useCallback(() => {
		setActiveFilters({});
		setSearchTerm("");
		setSortBy("popular");
	}, []);

	// Check if has active filters
	const hasActiveFilters = useMemo(() => {
		return (
			searchTerm !== "" ||
			Object.keys(activeFilters).some((key) => {
				const value = activeFilters[key as keyof UITemplateFilters];
				return value !== undefined && value !== null && value !== "";
			})
		);
	}, [searchTerm, activeFilters]);

	// Apply filters and search
	const templates = useMemo(() => {
		let filtered = [...allTemplates];

		// Apply search term
		if (searchTerm.trim()) {
			const searchLower = searchTerm.toLowerCase();
			filtered = filtered.filter(
				(template) =>
					template.name.toLowerCase().includes(searchLower) ||
					template.description.toLowerCase().includes(searchLower) ||
					template.tags?.some((tag) =>
						tag.toLowerCase().includes(searchLower)
					) ||
					template.necReference?.toLowerCase().includes(searchLower)
			);
		}

		// Apply category filter
		if (activeFilters.category) {
			filtered = filtered.filter(
				(template) => template.category === activeFilters.category
			);
		}

		// Apply subcategory filter
		if (activeFilters.subcategory) {
			filtered = filtered.filter(
				(template) => template.subcategory === activeFilters.subcategory
			);
		}

		// Apply difficulty filter
		if (activeFilters.difficulty) {
			filtered = filtered.filter(
				(template) => template.difficulty === activeFilters.difficulty
			);
		}

		// Apply favorites filter
		if (activeFilters.showOnlyFavorites) {
			filtered = filtered.filter((template) => template.isFavorite);
		}

		// Apply verified filter
		if (activeFilters.showOnlyVerified) {
			filtered = filtered.filter((template) => template.verified);
		}

		// Apply featured filter
		if (activeFilters.showOnlyFeatured) {
			filtered = filtered.filter((template) => template.trending); // Using trending as featured
		}

		// Apply sorting
		switch (sortBy) {
			case "popular":
				filtered.sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0));
				break;
			case "rating":
				filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
				break;
			case "trending":
				filtered.sort((a, b) => {
					if (a.trending && !b.trending) return -1;
					if (!a.trending && b.trending) return 1;
					return (b.usageCount || 0) - (a.usageCount || 0);
				});
				break;
			case "recent":
				filtered.sort(
					(a, b) =>
						new Date(b.lastUpdated || 0).getTime() -
						new Date(a.lastUpdated || 0).getTime()
				);
				break;
			case "name":
				filtered.sort((a, b) => a.name.localeCompare(b.name));
				break;
			default:
				break;
		}

		return filtered;
	}, [allTemplates, searchTerm, activeFilters, sortBy]);

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
