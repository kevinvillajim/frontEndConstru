// src/ui/pages/calculations/shared/hooks/useCatalogTemplates.tsx

import {useState, useEffect, useCallback, useMemo} from "react";
import {useTemplates} from "./useTemplates";
import type {
	CalculationTemplate as UICalculationTemplate,
	TemplateFilters as UITemplateFilters,
	TemplateCategoryType,
} from "../types/template.types";

// ==================== INTERFACE DEL HOOK ====================
export interface UseCatalogTemplatesReturn {
	// Estados principales
	templates: UICalculationTemplate[];
	categories: TemplateCategoryType[];
	isLoading: boolean;
	error: string | null;
	stats: {
		verifiedCount: number;
		avgRating: number;
		totalUsage: number;
	};

	// Filtrado y búsqueda
	getFilteredTemplates: (
		filters?: UITemplateFilters
	) => UICalculationTemplate[];

	// Acciones
	toggleFavorite: (templateId: string) => Promise<void>;
	refreshTemplates: () => Promise<void>;
	clearError: () => void;

	// Estado de usuario
	setCurrentUserId: (userId: string) => void;
}

// ==================== CONFIGURACIÓN ====================
interface UseCatalogTemplatesOptions {
	autoLoad?: boolean;
	includePersonal?: boolean;
	onlyVerified?: boolean;
}

const DEFAULT_OPTIONS: UseCatalogTemplatesOptions = {
	autoLoad: true,
	includePersonal: false, // Por defecto solo plantillas públicas en catálogo
	onlyVerified: true,
};

// ==================== HOOK PRINCIPAL ====================
export const useCatalogTemplates = (
	options: UseCatalogTemplatesOptions = {}
): UseCatalogTemplatesReturn => {
	const config = {...DEFAULT_OPTIONS, ...options};

	// Estado local
	const [currentUserId, setCurrentUserId] = useState<string>("");

	// Hook principal de templates
	const {
		publicTemplates,
		templates: myTemplates,
		loading,
		error,
		getFilteredTemplates: baseGetFilteredTemplates,
		getTemplateStats,
		toggleFavorite: baseToggleFavorite,
		refreshTemplates: baseRefreshTemplates,
		clearError: baseClearError,
		categories,
	} = useTemplates({
		autoLoad: config.autoLoad,
		includePublic: true,
		includePersonal: config.includePersonal,
	});

	// ==================== DATOS COMPUTADOS ====================

	// Templates combinados para el catálogo
	const allTemplates = useMemo(() => {
		let combined = [...publicTemplates];

		if (config.includePersonal) {
			// Agregar templates personales que sean públicos
			const publicPersonalTemplates = myTemplates.filter((t) => t.isPublic);
			combined = [...combined, ...publicPersonalTemplates];
		}

		// Filtrar solo verificados si es necesario
		if (config.onlyVerified) {
			combined = combined.filter((template) =>
				"verified" in template ? template.verified : false
			);
		}

		return combined;
	}, [
		publicTemplates,
		myTemplates,
		config.includePersonal,
		config.onlyVerified,
	]);

	// Convertir a formato UI (esto usa la función del hook principal)
	const uiTemplates = useMemo(() => {
		return baseGetFilteredTemplates(); // Sin filtros adicionales, solo conversión
	}, [baseGetFilteredTemplates]);

	// Estadísticas computadas
	const stats = useMemo(() => {
		if (uiTemplates.length === 0) {
			return {verifiedCount: 0, avgRating: 0, totalUsage: 0};
		}

		const templateStats = getTemplateStats(uiTemplates);
		return {
			verifiedCount: templateStats.verifiedCount,
			avgRating: templateStats.avgRating,
			totalUsage: templateStats.totalUsage,
		};
	}, [uiTemplates, getTemplateStats]);

	// Categorías con conteos actualizados
	const categoriesWithCounts = useMemo(() => {
		return categories.map((category) => ({
			...category,
			count: uiTemplates.filter(
				(template) =>
					template.category === category.id ||
					template.subcategory === category.id
			).length,
		}));
	}, [categories, uiTemplates]);

	// ==================== FUNCIONES ESPECIALIZADAS ====================

	// Filtrado optimizado para catálogo
	const getFilteredTemplates = useCallback(
		(filters?: UITemplateFilters): UICalculationTemplate[] => {
			return baseGetFilteredTemplates(filters);
		},
		[baseGetFilteredTemplates]
	);

	// Toggle favorite con manejo de usuario actual
	const toggleFavorite = useCallback(
		async (templateId: string): Promise<void> => {
			if (!currentUserId) {
				console.warn("No current user ID set for favorites");
				return;
			}

			try {
				await baseToggleFavorite(templateId);
			} catch (error) {
				console.error("Error toggling favorite:", error);
				throw error;
			}
		},
		[currentUserId, baseToggleFavorite]
	);

	// Refresh especializado para catálogo
	const refreshTemplates = useCallback(async (): Promise<void> => {
		try {
			await baseRefreshTemplates();
		} catch (error) {
			console.error("Error refreshing catalog templates:", error);
			throw error;
		}
	}, [baseRefreshTemplates]);

	// ==================== EFECTOS ====================

	// Cargar favoritos cuando cambie el usuario
	useEffect(() => {
		if (currentUserId && config.autoLoad) {
			// Aquí podrías cargar favoritos específicos del usuario si es necesario
			// loadUserFavorites(currentUserId);
		}
	}, [currentUserId, config.autoLoad]);

	// ==================== RETORNO ====================
	return {
		// Estados principales
		templates: uiTemplates,
		categories: categoriesWithCounts,
		isLoading: loading,
		error,
		stats,

		// Filtrado y búsqueda
		getFilteredTemplates,

		// Acciones
		toggleFavorite,
		refreshTemplates,
		clearError: baseClearError,

		// Estado de usuario
		setCurrentUserId,
	};
};

// ==================== HOOK ESPECÍFICO PARA BÚSQUEDA EN CATÁLOGO ====================
export const useCatalogSearch = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [activeFilters, setActiveFilters] = useState<UITemplateFilters>({});
	const [sortBy, setSortBy] = useState<UITemplateFilters["sortBy"]>("popular");

	const {getFilteredTemplates, isLoading} = useCatalogTemplates();

	// Filtros combinados
	const combinedFilters = useMemo(
		(): UITemplateFilters => ({
			...activeFilters,
			searchTerm: searchTerm || undefined,
			sortBy,
		}),
		[activeFilters, searchTerm, sortBy]
	);

	// Templates filtrados
	const filteredTemplates = useMemo(() => {
		return getFilteredTemplates(combinedFilters);
	}, [getFilteredTemplates, combinedFilters]);

	// Funciones de control
	const updateFilter = useCallback(
		(key: keyof UITemplateFilters, value: any) => {
			setActiveFilters((prev) => ({
				...prev,
				[key]: value,
			}));
		},
		[]
	);

	const clearFilters = useCallback(() => {
		setSearchTerm("");
		setActiveFilters({});
		setSortBy("popular");
	}, []);

	const hasActiveFilters = useMemo(() => {
		return (
			searchTerm !== "" ||
			Object.keys(activeFilters).some(
				(key) => activeFilters[key as keyof UITemplateFilters] != null
			)
		);
	}, [searchTerm, activeFilters]);

	return {
		// Estado
		searchTerm,
		activeFilters: combinedFilters,
		sortBy,
		isLoading,
		hasActiveFilters,

		// Resultados
		templates: filteredTemplates,

		// Acciones
		setSearchTerm,
		setSortBy,
		updateFilter,
		clearFilters,
	};
};

// ==================== HOOK PARA CATEGORÍAS ====================
export const useCatalogCategories = () => {
	const {categories, getFilteredTemplates} = useCatalogTemplates();
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
		null
	);

	// Templates de la categoría seleccionada
	const categoryTemplates = useMemo(() => {
		if (!selectedCategory) return [];

		const filters: UITemplateFilters = {
			category: selectedCategory,
			subcategory: selectedSubcategory || undefined,
		};

		return getFilteredTemplates(filters);
	}, [selectedCategory, selectedSubcategory, getFilteredTemplates]);

	// Información de la categoría seleccionada
	const selectedCategoryInfo = useMemo(() => {
		if (!selectedCategory) return null;
		return categories.find((cat) => cat.id === selectedCategory) || null;
	}, [selectedCategory, categories]);

	// Funciones de control
	const selectCategory = useCallback((categoryId: string | null) => {
		setSelectedCategory(categoryId);
		setSelectedSubcategory(null); // Reset subcategory when category changes
	}, []);

	const selectSubcategory = useCallback((subcategoryId: string | null) => {
		setSelectedSubcategory(subcategoryId);
	}, []);

	const clearSelection = useCallback(() => {
		setSelectedCategory(null);
		setSelectedSubcategory(null);
	}, []);

	return {
		// Estado
		categories,
		selectedCategory,
		selectedSubcategory,
		selectedCategoryInfo,

		// Resultados
		templates: categoryTemplates,

		// Acciones
		selectCategory,
		selectSubcategory,
		clearSelection,
	};
};

export default useCatalogTemplates;
