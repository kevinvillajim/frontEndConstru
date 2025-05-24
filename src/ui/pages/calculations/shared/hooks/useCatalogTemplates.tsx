// src/ui/pages/calculations/shared/hooks/useCatalogTemplates.tsx

import {useState, useEffect, useCallback, useMemo} from "react";
import {templateApplicationService} from "../../../../../core/application/ServiceFactory";
import type {
	CalculationTemplate as UITemplate,
	DatabaseTemplate,
	TemplateFilters,
	SortOption,
} from "../types/template.types";

// ==================== TIPOS ====================
interface CatalogStats {
	total: number;
	verifiedCount: number;
	avgRating: number;
	totalUsage: number;
}

interface UseCatalogTemplatesOptions {
	autoLoad?: boolean;
	includePersonal?: boolean;
	onlyVerified?: boolean;
}

interface UseCatalogTemplatesReturn {
	templates: UITemplate[];
	categories: any[];
	isLoading: boolean;
	error: string | null;
	stats: CatalogStats;
	toggleFavorite: (templateId: string) => Promise<void>;
	refreshTemplates: () => Promise<void>;
	clearError: () => void;
	setCurrentUserId: (userId: string) => void;
}

interface UseCatalogSearchReturn {
	searchTerm: string;
	activeFilters: TemplateFilters;
	sortBy: SortOption;
	templates: UITemplate[];
	setSearchTerm: (term: string) => void;
	setSortBy: (sort: SortOption) => void;
	updateFilter: (key: keyof TemplateFilters, value: any) => void;
	clearFilters: () => void;
	hasActiveFilters: boolean;
}

// ==================== CONVERSIÓN DE DATOS ====================
const convertAPIToUITemplate = (apiTemplate: any): UITemplate => {
	// Calcular si es nuevo (últimos 30 días)
	const thirtyDaysAgo = new Date();
	thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
	const isNew =
		new Date(apiTemplate.createdAt || apiTemplate.created_at) > thirtyDaysAgo;

	// Calcular trending y popular
	const usageCount = apiTemplate.usageCount || apiTemplate.usage_count || 0;
	const avgRating = parseFloat(
		apiTemplate.averageRating || apiTemplate.average_rating || "0"
	);
	const isPopular = usageCount > 100;
	const isTrending = usageCount > 50 && avgRating > 4.0;

	// Función para obtener color basado en tipo
	const getCategoryColor = (type: string) => {
		switch (type?.toLowerCase()) {
			case "structural":
			case "foundation":
				return "from-blue-600 to-blue-500";
			case "electrical":
			case "installation":
				return "from-yellow-600 to-yellow-500";
			case "architectural":
			case "architecture":
				return "from-green-600 to-green-500";
			case "hydraulic":
			case "plumbing":
				return "from-cyan-600 to-cyan-500";
			case "mechanical":
			case "hvac":
				return "from-purple-600 to-purple-500";
			case "geotechnical":
				return "from-gray-600 to-gray-500";
			case "fire_safety":
				return "from-red-600 to-red-500";
			case "efficiency":
				return "from-green-600 to-green-500";
			case "telecommunications":
				return "from-indigo-600 to-indigo-500";
			case "material_estimation":
				return "from-orange-600 to-orange-500";
			case "area_volume":
				return "from-purple-600 to-purple-500";
			default:
				return "from-primary-600 to-secondary-500";
		}
	};

	// Mapear profesión
	const targetProfession =
		apiTemplate.targetProfession || apiTemplate.target_profession;
	const profession = targetProfession ? [targetProfession] : [];

	return {
		id: apiTemplate.id,
		name: apiTemplate.name,
		description: apiTemplate.description,
		version: apiTemplate.version?.toString() || "1.0",
		category: apiTemplate.type,
		subcategory: apiTemplate.type,
		profession: profession,
		targetProfession: targetProfession,
		tags: Array.isArray(apiTemplate.tags) ? apiTemplate.tags : [],
		difficulty: "intermediate", // Por defecto
		estimatedTime: "10-15 min", // Por defecto
		necReference: apiTemplate.necReference || apiTemplate.nec_reference,
		nec_reference: apiTemplate.necReference || apiTemplate.nec_reference,
		requirements: [], // Puedes agregar lógica para esto
		parameters: [], // Puedes agregar lógica para esto
		verified: apiTemplate.isVerified ?? apiTemplate.is_verified ?? false,
		is_verified: apiTemplate.isVerified ?? apiTemplate.is_verified ?? false,
		isPublic: (apiTemplate.shareLevel || apiTemplate.share_level) === "public",
		isNew: isNew,
		trending: isTrending,
		popular: isPopular,
		rating: avgRating,
		average_rating: avgRating,
		usageCount: usageCount,
		usage_count: usageCount,
		lastUpdated: apiTemplate.updatedAt || apiTemplate.updated_at,
		isFavorite: false, // Por defecto
		color: getCategoryColor(apiTemplate.type),
		icon: null,
		allowSuggestions: true,
		createdBy: apiTemplate.createdBy || apiTemplate.created_by,
		created_by: apiTemplate.createdBy || apiTemplate.created_by,
		contributors: [],
		type: apiTemplate.type,
		formula: apiTemplate.formula,
	};
};

// ==================== CATEGORÍAS MOCK ====================
const MOCK_CATEGORIES = [
	{
		id: "structural",
		name: "Estructural",
		description: "Análisis y diseño estructural",
		color: "bg-blue-50 border-blue-200 text-blue-700",
		count: 0,
	},
	{
		id: "electrical",
		name: "Eléctrico",
		description: "Instalaciones eléctricas",
		color: "bg-yellow-50 border-yellow-200 text-yellow-700",
		count: 0,
	},
	{
		id: "architectural",
		name: "Arquitectónico",
		description: "Diseño arquitectónico",
		color: "bg-green-50 border-green-200 text-green-700",
		count: 0,
	},
	{
		id: "foundation",
		name: "Cimentaciones",
		description: "Diseño de cimentaciones",
		color: "bg-gray-50 border-gray-200 text-gray-700",
		count: 0,
	},
	{
		id: "installation",
		name: "Instalaciones",
		description: "Sistemas de instalaciones",
		color: "bg-cyan-50 border-cyan-200 text-cyan-700",
		count: 0,
	},
	{
		id: "efficiency",
		name: "Eficiencia",
		description: "Eficiencia energética",
		color: "bg-green-50 border-green-200 text-green-700",
		count: 0,
	},
	{
		id: "fire_safety",
		name: "Seguridad",
		description: "Seguridad contra incendios",
		color: "bg-red-50 border-red-200 text-red-700",
		count: 0,
	},
];

// ==================== HOOK PRINCIPAL ====================
export const useCatalogTemplates = (
	options: UseCatalogTemplatesOptions = {}
): UseCatalogTemplatesReturn => {
	const [templates, setTemplates] = useState<UITemplate[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [currentUserId, setCurrentUserId] = useState<string>("");

	// Cargar templates
	const refreshTemplates = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);

			// Usar el service para obtener templates públicos verificados
			const result = await templateApplicationService.getTemplates({
				shareLevel: "public",
				isVerified: options.onlyVerified ?? true,
				isActive: true,
				limit: 100,
			});

			if (result.data) {
				const convertedTemplates = result.data.map(convertAPIToUITemplate);
				setTemplates(convertedTemplates);
			}
		} catch (err) {
			console.error("Error loading templates:", err);
			setError("Error cargando plantillas");
		} finally {
			setIsLoading(false);
		}
	}, [options.onlyVerified]);

	// Cargar al inicializar
	useEffect(() => {
		if (options.autoLoad !== false) {
			refreshTemplates();
		}
	}, [refreshTemplates, options.autoLoad]);

	// Toggle favorite
	const toggleFavorite = useCallback(
		async (templateId: string) => {
			if (!currentUserId) return;

			try {
				await templateApplicationService.toggleFavorite(
					currentUserId,
					templateId
				);

				// Actualizar estado local
				setTemplates((prev) =>
					prev.map((template) =>
						template.id === templateId
							? {...template, isFavorite: !template.isFavorite}
							: template
					)
				);
			} catch (error) {
				console.error("Error toggling favorite:", error);
			}
		},
		[currentUserId]
	);

	// Calcular categorías con conteos
	const categoriesWithCounts = useMemo(() => {
		return MOCK_CATEGORIES.map((category) => ({
			...category,
			count: templates.filter((t) => t.category === category.id).length,
		}));
	}, [templates]);

	// Calcular estadísticas
	const stats = useMemo((): CatalogStats => {
		return {
			total: templates.length,
			verifiedCount: templates.filter((t) => t.verified).length,
			avgRating:
				templates.length > 0
					? templates.reduce((sum, t) => sum + t.rating, 0) / templates.length
					: 0,
			totalUsage: templates.reduce((sum, t) => sum + t.usageCount, 0),
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

	const updateFilter = useCallback((key: keyof TemplateFilters, value: any) => {
		setActiveFilters((prev) => ({...prev, [key]: value}));
	}, []);

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
				(template) => template.category === activeFilters.category
			);
		}

		// Filtrar por subcategoría
		if (activeFilters.subcategory) {
			filtered = filtered.filter(
				(template) => template.subcategory === activeFilters.subcategory
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
			filtered = filtered.filter((template) => template.verified);
		}

		// Filtrar solo destacados
		if (activeFilters.showOnlyFeatured) {
			filtered = filtered.filter(
				(template) => template.trending || template.popular
			);
		}

		// Ordenar
		switch (sortBy) {
			case "popular":
				filtered.sort((a, b) => b.usageCount - a.usageCount);
				break;
			case "rating":
				filtered.sort((a, b) => b.rating - a.rating);
				break;
			case "trending":
				filtered.sort((a, b) => {
					if (b.trending && !a.trending) return 1;
					if (!b.trending && a.trending) return -1;
					return b.usageCount - a.usageCount;
				});
				break;
			case "recent":
				filtered.sort(
					(a, b) =>
						new Date(b.lastUpdated).getTime() -
						new Date(a.lastUpdated).getTime()
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
