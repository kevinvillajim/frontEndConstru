import {useState, useEffect, useMemo, useCallback} from "react";
import {
	BuildingOffice2Icon,
	BoltIcon,
	AcademicCapIcon,
	BeakerIcon,
	WrenchScrewdriverIcon,
	CubeIcon,
} from "@heroicons/react/24/outline";
import type {
	CalculationTemplate,
	TemplateCategory,
	TemplateFilters,
	SortOption,
	TemplateStats,
} from "../types/template.types";

// Mock data mejorado con plantillas solo verificadas/aprobadas
const APPROVED_TEMPLATES: CalculationTemplate[] = [
	// ESTRUCTURAL - Solo plantillas aprobadas oficialmente
	{
		id: "str-seismic-static",
		name: "Análisis Sísmico Estático",
		description:
			"Cálculo de fuerzas sísmicas según NEC-SE-DS para estructuras regulares con verificación automática",
		category: "structural",
		subcategory: "seismic",
		profession: ["Ingeniero Civil", "Ingeniero Estructural"],
		difficulty: "advanced",
		estimatedTime: "25-35 min",
		necReference: "NEC-SE-DS, Cap. 2",
		verified: true,
		rating: 4.9,
		usageCount: 1256,
		isFavorite: false,
		isNew: false,
		trending: true,
		popular: true,
		icon: BuildingOffice2Icon,
		color: "from-blue-500 to-indigo-600",
		tags: ["sísmico", "fuerzas", "análisis", "estructura", "NEC"],
		lastUpdated: "2024-03-15",
		requirements: [
			"Geometría y dimensiones de la estructura",
			"Cargas permanentes y variables",
			"Zona sísmica según mapa ecuatoriano",
			"Tipo de suelo y perfil estratigráfico",
		],
		parameters: [
			{
				id: "zone",
				name: "seismicZone",
				label: "Zona sísmica",
				type: "select",
				required: true,
				options: ["I", "II", "III", "IV", "V", "VI"],
				tooltip: "Zona sísmica según mapa de zonificación NEC",
			},
			{
				id: "soil_type",
				name: "soilType",
				label: "Tipo de suelo",
				type: "select",
				required: true,
				options: ["A", "B", "C", "D", "E", "F"],
				tooltip: "Clasificación del perfil del suelo",
			},
			{
				id: "structure_height",
				name: "structureHeight",
				label: "Altura estructura",
				type: "number",
				unit: "m",
				required: true,
				min: 3,
				max: 200,
				tooltip: "Altura total de la estructura desde la base",
			},
		],
		isPublic: true,
		allowSuggestions: true,
		createdBy: "NEC Ecuador - Comité Técnico",
	},
	{
		id: "str-concrete-beam",
		name: "Diseño de Vigas de Hormigón Armado",
		description:
			"Cálculo completo de vigas rectangulares y T con verificación por flexión, corte y deflexión",
		category: "structural",
		subcategory: "concrete",
		profession: ["Ingeniero Civil", "Ingeniero Estructural"],
		difficulty: "advanced",
		estimatedTime: "20-30 min",
		necReference: "NEC-SE-HM, Cap. 9",
		verified: true,
		rating: 4.8,
		usageCount: 2134,
		isFavorite: false,
		isNew: false,
		trending: false,
		popular: true,
		icon: BuildingOffice2Icon,
		color: "from-gray-500 to-slate-600",
		tags: ["hormigón", "vigas", "armado", "flexión", "cortante"],
		lastUpdated: "2024-02-28",
		requirements: [
			"Dimensiones de la viga (base, altura)",
			"Cargas aplicadas (permanentes y variables)",
			"Resistencia del hormigón (f'c)",
			"Tipo y grado del acero de refuerzo",
		],
		parameters: [],
		isPublic: true,
		allowSuggestions: true,
		createdBy: "Universidad Central del Ecuador",
	},

	// ELÉCTRICO - Solo plantillas verificadas
	{
		id: "elec-residential-demand",
		name: "Demanda Eléctrica Residencial",
		description:
			"Cálculo preciso de demanda eléctrica para viviendas según factores de demanda NEC actualizados",
		category: "electrical",
		subcategory: "demand",
		profession: ["Ingeniero Eléctrico", "Arquitecto"],
		difficulty: "basic",
		estimatedTime: "8-12 min",
		necReference: "NEC-SB-IE, Sección 1.1",
		verified: true,
		rating: 4.9,
		usageCount: 3421,
		isFavorite: true,
		isNew: false,
		trending: true,
		popular: true,
		icon: BoltIcon,
		color: "from-yellow-500 to-orange-600",
		tags: ["demanda", "residencial", "factores", "carga", "vivienda"],
		lastUpdated: "2024-03-10",
		requirements: [
			"Área total de la vivienda",
			"Número y tipo de circuitos",
			"Cargas especiales instaladas",
			"Tipo de calentamiento (eléctrico/gas)",
		],
		parameters: [
			{
				id: "house_area",
				name: "houseArea",
				label: "Área de vivienda",
				type: "number",
				unit: "m²",
				required: true,
				min: 50,
				max: 500,
				tooltip: "Área total construida de la vivienda",
			},
		],
		isPublic: true,
		allowSuggestions: true,
		createdBy: "Colegio de Ingenieros Eléctricos del Ecuador",
	},

	// ARQUITECTÓNICO - Solo plantillas aprobadas
	{
		id: "arch-area-calculation",
		name: "Cálculo de Áreas Arquitectónicas",
		description:
			"Cómputo automatizado de áreas útiles, construidas y computables según normativa NEC actualizada",
		category: "architectural",
		subcategory: "areas",
		profession: ["Arquitecto"],
		difficulty: "basic",
		estimatedTime: "5-10 min",
		necReference: "NEC-HS-A, Art. 15",
		verified: true,
		rating: 4.7,
		usageCount: 5445,
		isFavorite: true,
		isNew: false,
		trending: false,
		popular: true,
		icon: AcademicCapIcon,
		color: "from-green-500 to-emerald-600",
		tags: ["áreas", "útil", "construida", "computable", "arquitectura"],
		lastUpdated: "2024-02-20",
		requirements: [
			"Planta arquitectónica con cotas",
			"Espesores de muros definidos",
			"Identificación de voladizos",
			"Clasificación de espacios por uso",
		],
		parameters: [],
		isPublic: true,
		allowSuggestions: true,
		createdBy: "Colegio de Arquitectos del Ecuador",
	},

	// HIDRÁULICO - Solo plantillas verificadas
	{
		id: "hydr-pipe-sizing",
		name: "Dimensionamiento de Tuberías",
		description:
			"Cálculo optimizado de diámetros por velocidad, pérdida de carga y presión disponible",
		category: "hydraulic",
		subcategory: "piping",
		profession: ["Ingeniero Mecánico", "Ingeniero Civil"],
		difficulty: "intermediate",
		estimatedTime: "15-25 min",
		necReference: "NEC-HS-HI, Cap. 3",
		verified: true,
		rating: 4.6,
		usageCount: 867,
		isFavorite: false,
		isNew: true,
		trending: true,
		popular: false,
		icon: BeakerIcon,
		color: "from-cyan-500 to-blue-600",
		tags: ["tuberías", "diámetro", "velocidad", "pérdidas", "hidráulica"],
		lastUpdated: "2024-03-05",
		requirements: [
			"Caudal de diseño requerido",
			"Material y rugosidad de tubería",
			"Longitud total y accesorios",
			"Presión disponible en el sistema",
		],
		parameters: [],
		isPublic: true,
		allowSuggestions: true,
		createdBy: "Instituto Ecuatoriano de Normalización",
	},
];

const CATEGORIES: TemplateCategory[] = [
	{
		id: "structural",
		name: "Estructural",
		description: "Análisis y diseño estructural",
		icon: BuildingOffice2Icon,
		color: "bg-blue-50 border-blue-200 text-blue-700",
		count: 0, // Se calculará dinámicamente
		subcategories: [
			{
				id: "seismic",
				name: "Análisis Sísmico",
				count: 0,
				description: "Cálculos sísmicos NEC",
			},
			{
				id: "concrete",
				name: "Hormigón Armado",
				count: 0,
				description: "Diseño en hormigón",
			},
			{
				id: "steel",
				name: "Acero Estructural",
				count: 0,
				description: "Diseño en acero",
			},
			{
				id: "foundations",
				name: "Cimentaciones",
				count: 0,
				description: "Fundaciones y zapatas",
			},
		],
	},
	{
		id: "electrical",
		name: "Eléctrico",
		description: "Instalaciones eléctricas",
		icon: BoltIcon,
		color: "bg-yellow-50 border-yellow-200 text-yellow-700",
		count: 0,
		subcategories: [
			{
				id: "demand",
				name: "Demanda Eléctrica",
				count: 0,
				description: "Cálculo de cargas",
			},
			{
				id: "conductors",
				name: "Conductores",
				count: 0,
				description: "Dimensionamiento",
			},
			{
				id: "grounding",
				name: "Puesta a Tierra",
				count: 0,
				description: "Sistemas de protección",
			},
			{
				id: "lighting",
				name: "Iluminación",
				count: 0,
				description: "Diseño lumotécnico",
			},
		],
	},
	{
		id: "architectural",
		name: "Arquitectónico",
		description: "Diseño arquitectónico",
		icon: AcademicCapIcon,
		color: "bg-green-50 border-green-200 text-green-700",
		count: 0,
		subcategories: [
			{
				id: "areas",
				name: "Áreas",
				count: 0,
				description: "Cálculo de superficies",
			},
			{
				id: "circulation",
				name: "Circulación",
				count: 0,
				description: "Escaleras y rampas",
			},
			{
				id: "environmental",
				name: "Confort",
				count: 0,
				description: "Ventilación e iluminación",
			},
			{
				id: "accessibility",
				name: "Accesibilidad",
				count: 0,
				description: "Diseño universal",
			},
		],
	},
	{
		id: "hydraulic",
		name: "Hidráulico",
		description: "Sistemas hidráulicos",
		icon: BeakerIcon,
		color: "bg-cyan-50 border-cyan-200 text-cyan-700",
		count: 0,
		subcategories: [
			{
				id: "piping",
				name: "Tuberías",
				count: 0,
				description: "Redes de distribución",
			},
			{
				id: "pumps",
				name: "Bombeo",
				count: 0,
				description: "Sistemas de impulsión",
			},
			{
				id: "drainage",
				name: "Desagües",
				count: 0,
				description: "Evacuación de aguas",
			},
			{
				id: "irrigation",
				name: "Riego",
				count: 0,
				description: "Sistemas de riego",
			},
		],
	},
];

export const useTemplates = () => {
	const [templates, setTemplates] = useState<CalculationTemplate[]>([]);
	const [favorites, setFavorites] = useState<Set<string>>(new Set());
	const [isLoading, setIsLoading] = useState(true);

	// Simular carga inicial
	useEffect(() => {
		const loadTemplates = async () => {
			setIsLoading(true);

			// Simular llamada a API - solo plantillas aprobadas/verificadas
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Solo cargar plantillas verificadas
			const verifiedTemplates = APPROVED_TEMPLATES.filter(
				(template) => template.verified
			);
			setTemplates(verifiedTemplates);

			// Cargar favoritos del localStorage
			const savedFavorites = localStorage.getItem("template-favorites");
			if (savedFavorites) {
				setFavorites(new Set(JSON.parse(savedFavorites)));
			}

			setIsLoading(false);
		};

		loadTemplates();
	}, []);

	// Actualizar conteos de categorías
	const categories = useMemo(() => {
		return CATEGORIES.map((category) => ({
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

	// Marcar favoritos en templates
	const templatesWithFavorites = useMemo(() => {
		return templates.map((template) => ({
			...template,
			isFavorite: favorites.has(template.id),
		}));
	}, [templates, favorites]);

	// Función para filtrar y ordenar templates
	const getFilteredTemplates = useCallback(
		(filters: TemplateFilters) => {
			let filtered = templatesWithFavorites;

			// Solo plantillas verificadas (ya filtradas en la carga inicial)
			if (filters.showOnlyVerified) {
				filtered = filtered.filter((t) => t.verified);
			}

			// Filtro por categoría
			if (filters.category) {
				filtered = filtered.filter((t) => t.category === filters.category);
			}

			// Filtro por subcategoría
			if (filters.subcategory) {
				filtered = filtered.filter(
					(t) => t.subcategory === filters.subcategory
				);
			}

			// Filtro por favoritos
			if (filters.showOnlyFavorites) {
				filtered = filtered.filter((t) => t.isFavorite);
			}

			// Filtro por dificultad
			if (filters.difficulty) {
				filtered = filtered.filter((t) => t.difficulty === filters.difficulty);
			}

			// Filtro por búsqueda
			if (filters.searchTerm) {
				const searchLower = filters.searchTerm.toLowerCase();
				filtered = filtered.filter(
					(t) =>
						t.name.toLowerCase().includes(searchLower) ||
						t.description.toLowerCase().includes(searchLower) ||
						t.tags.some((tag) => tag.toLowerCase().includes(searchLower)) ||
						t.necReference.toLowerCase().includes(searchLower)
				);
			}

			// Ordenamiento
			filtered = [...filtered].sort((a, b) => {
				switch (filters.sortBy) {
					case "popular":
						return b.usageCount - a.usageCount;
					case "rating":
						return b.rating - a.rating;
					case "trending":
						if (a.trending && !b.trending) return -1;
						if (!a.trending && b.trending) return 1;
						return b.usageCount - a.usageCount;
					case "recent":
						return (
							new Date(b.lastUpdated).getTime() -
							new Date(a.lastUpdated).getTime()
						);
					case "name":
						return a.name.localeCompare(b.name);
					default:
						return 0;
				}
			});

			return filtered;
		},
		[templatesWithFavorites]
	);

	// Estadísticas de templates
	const getTemplateStats = useCallback(
		(templates: CalculationTemplate[]): TemplateStats => {
			return {
				total: templates.length,
				verifiedCount: templates.filter((t) => t.verified).length,
				avgRating:
					templates.length > 0
						? templates.reduce((sum, t) => sum + t.rating, 0) / templates.length
						: 0,
				totalUsage: templates.reduce((sum, t) => sum + t.usageCount, 0),
				trendingCount: templates.filter((t) => t.trending).length,
				popularCount: templates.filter((t) => t.popular).length,
			};
		},
		[]
	);

	// Toggle favorito
	const toggleFavorite = useCallback((templateId: string) => {
		setFavorites((prev) => {
			const newFavorites = new Set(prev);
			if (newFavorites.has(templateId)) {
				newFavorites.delete(templateId);
			} else {
				newFavorites.add(templateId);
			}

			// Guardar en localStorage
			localStorage.setItem(
				"template-favorites",
				JSON.stringify([...newFavorites])
			);

			return newFavorites;
		});
	}, []);

	// Obtener template por ID
	const getTemplateById = useCallback(
		(id: string) => {
			return templatesWithFavorites.find((t) => t.id === id);
		},
		[templatesWithFavorites]
	);

	// Obtener templates relacionados
	const getRelatedTemplates = useCallback(
		(templateId: string, limit = 3) => {
			const template = getTemplateById(templateId);
			if (!template) return [];

			return templatesWithFavorites
				.filter(
					(t) =>
						t.id !== templateId &&
						(t.category === template.category ||
							t.tags.some((tag) => template.tags.includes(tag)))
				)
				.sort((a, b) => b.rating - a.rating)
				.slice(0, limit);
		},
		[templatesWithFavorites, getTemplateById]
	);

	return {
		templates: templatesWithFavorites,
		categories,
		isLoading,
		favorites,
		toggleFavorite,
		getFilteredTemplates,
		getTemplateStats,
		getTemplateById,
		getRelatedTemplates,
	};
};

import {useState, useEffect, useCallback, useMemo} from "react";
import {
	MyCalculationTemplate,
	TemplateFilters,
	TemplateListResponse,
	TemplateSuggestion,
	TemplateStats,
} from "../types/template.types";

// API simulada - En producción reemplazar con llamadas reales
const mockApiDelay = (ms: number = 1000) =>
	new Promise((resolve) => setTimeout(resolve, ms));

const mockTemplateApi = {
	getMyTemplates: async (
		filters: TemplateFilters
	): Promise<TemplateListResponse> => {
		await mockApiDelay(800);
		// Aquí iría la llamada real a la API
		return {
			templates: [],
			pagination: {page: 1, limit: 20, total: 0, pages: 0},
			filters,
		};
	},

	createTemplate: async (
		templateData: Partial<MyCalculationTemplate>
	): Promise<MyCalculationTemplate> => {
		await mockApiDelay(1500);
		const newTemplate: MyCalculationTemplate = {
			id: `template-${Date.now()}`,
			name: templateData.name || "",
			description: templateData.description || "",
			category: templateData.category || "custom",
			subcategory: templateData.subcategory || "",
			targetProfessions: templateData.targetProfessions || [],
			difficulty: templateData.difficulty || "basic",
			tags: templateData.tags || [],
			isPublic: templateData.isPublic || false,
			isActive: true,
			isFavorite: false,
			status: "draft",
			sharedWith: [],
			usageCount: 0,
			version: "1.0",
			createdAt: new Date().toISOString(),
			lastModified: new Date().toISOString(),
			parameters: templateData.parameters || [],
			...templateData,
		};
		return newTemplate;
	},

	updateTemplate: async (
		templateId: string,
		updates: Partial<MyCalculationTemplate>
	): Promise<MyCalculationTemplate> => {
		await mockApiDelay(1200);
		// Simular actualización
		return {...updates, id: templateId} as MyCalculationTemplate;
	},

	deleteTemplate: async (templateId: string): Promise<void> => {
		await mockApiDelay(1000);
		// Simular eliminación
	},

	duplicateTemplate: async (
		templateId: string
	): Promise<MyCalculationTemplate> => {
		await mockApiDelay(1000);
		// Simular duplicación
		return {} as MyCalculationTemplate;
	},

	submitSuggestion: async (
		suggestion: Partial<TemplateSuggestion>
	): Promise<TemplateSuggestion> => {
		await mockApiDelay(1500);
		return {
			id: `suggestion-${Date.now()}`,
			templateId: suggestion.templateId || "",
			templateName: suggestion.templateName || "",
			suggestionType: suggestion.suggestionType || "other",
			title: suggestion.title || "",
			description: suggestion.description || "",
			justification: suggestion.justification || "",
			priority: suggestion.priority || "medium",
			affectsAccuracy: suggestion.affectsAccuracy || false,
			affectsCompliance: suggestion.affectsCompliance || false,
			contactForFollowUp: suggestion.contactForFollowUp || false,
			status: "pending",
			authorId: "current-user",
			createdAt: new Date().toISOString(),
			...suggestion,
		};
	},

	getTemplateStats: async (templateId: string): Promise<TemplateStats> => {
		await mockApiDelay(500);
		return {
			templateId,
			totalUsage: 0,
			uniqueUsers: 0,
			averageRating: 0,
			totalRatings: 0,
			usageByMonth: {},
			mostCommonInputs: {},
			errorRate: 0,
			averageCalculationTime: 0,
		};
	},
};

interface UseTemplatesOptions {
	autoLoad?: boolean;
	defaultFilters?: TemplateFilters;
}

interface UseTemplatesResult {
	// Estado
	templates: MyCalculationTemplate[];
	loading: boolean;
	error: string | null;
	filters: TemplateFilters;

	// Estadísticas
	stats: {
		total: number;
		active: number;
		draft: number;
		archived: number;
		favorites: number;
	};

	// Acciones de carga
	loadTemplates: () => Promise<void>;
	refreshTemplates: () => Promise<void>;

	// Filtros
	updateFilters: (newFilters: Partial<TemplateFilters>) => void;
	clearFilters: () => void;

	// CRUD de plantillas
	createTemplate: (
		templateData: Partial<MyCalculationTemplate>
	) => Promise<MyCalculationTemplate>;
	updateTemplate: (
		templateId: string,
		updates: Partial<MyCalculationTemplate>
	) => Promise<void>;
	deleteTemplate: (templateId: string) => Promise<void>;
	duplicateTemplate: (templateId: string) => Promise<MyCalculationTemplate>;

	// Acciones rápidas
	toggleFavorite: (templateId: string) => Promise<void>;
	toggleStatus: (templateId: string) => Promise<void>;

	// Sugerencias
	submitSuggestion: (
		suggestion: Partial<TemplateSuggestion>
	) => Promise<TemplateSuggestion>;

	// Utilidades
	getTemplateById: (templateId: string) => MyCalculationTemplate | undefined;
	getTemplateStats: (templateId: string) => Promise<TemplateStats>;
}

export const useTemplates = (
	options: UseTemplatesOptions = {}
): UseTemplatesResult => {
	const {autoLoad = true, defaultFilters = {}} = options;

	// Estado principal
	const [templates, setTemplates] = useState<MyCalculationTemplate[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [filters, setFilters] = useState<TemplateFilters>({
		sortBy: "date",
		sortOrder: "desc",
		...defaultFilters,
	});

	// Estadísticas calculadas
	const stats = useMemo(
		() => ({
			total: templates.length,
			active: templates.filter((t) => t.status === "active").length,
			draft: templates.filter((t) => t.status === "draft").length,
			archived: templates.filter((t) => t.status === "archived").length,
			favorites: templates.filter((t) => t.isFavorite).length,
		}),
		[templates]
	);

	// Cargar plantillas
	const loadTemplates = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const response = await mockTemplateApi.getMyTemplates(filters);
			setTemplates(response.templates as MyCalculationTemplate[]);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Error cargando plantillas"
			);
		} finally {
			setLoading(false);
		}
	}, [filters]);

	// Refrescar plantillas
	const refreshTemplates = useCallback(async () => {
		await loadTemplates();
	}, [loadTemplates]);

	// Actualizar filtros
	const updateFilters = useCallback((newFilters: Partial<TemplateFilters>) => {
		setFilters((prev) => ({...prev, ...newFilters}));
	}, []);

	// Limpiar filtros
	const clearFilters = useCallback(() => {
		setFilters({
			sortBy: "date",
			sortOrder: "desc",
			...defaultFilters,
		});
	}, [defaultFilters]);

	// Crear plantilla
	const createTemplate = useCallback(
		async (templateData: Partial<MyCalculationTemplate>) => {
			const newTemplate = await mockTemplateApi.createTemplate(templateData);
			setTemplates((prev) => [newTemplate, ...prev]);
			return newTemplate;
		},
		[]
	);

	// Actualizar plantilla
	const updateTemplate = useCallback(
		async (templateId: string, updates: Partial<MyCalculationTemplate>) => {
			await mockTemplateApi.updateTemplate(templateId, updates);
			setTemplates((prev) =>
				prev.map((template) =>
					template.id === templateId
						? {...template, ...updates, lastModified: new Date().toISOString()}
						: template
				)
			);
		},
		[]
	);

	// Eliminar plantilla
	const deleteTemplate = useCallback(async (templateId: string) => {
		await mockTemplateApi.deleteTemplate(templateId);
		setTemplates((prev) =>
			prev.filter((template) => template.id !== templateId)
		);
	}, []);

	// Duplicar plantilla
	const duplicateTemplate = useCallback(
		async (templateId: string) => {
			const originalTemplate = templates.find((t) => t.id === templateId);
			if (!originalTemplate) throw new Error("Plantilla no encontrada");

			const duplicatedData = {
				...originalTemplate,
				name: `${originalTemplate.name} (Copia)`,
				isPublic: false,
				status: "draft" as const,
				sharedWith: [],
				usageCount: 0,
				version: "1.0",
				isFavorite: false,
			};

			const newTemplate = await mockTemplateApi.createTemplate(duplicatedData);
			setTemplates((prev) => [newTemplate, ...prev]);
			return newTemplate;
		},
		[templates]
	);

	// Toggle favorito
	const toggleFavorite = useCallback(
		async (templateId: string) => {
			const template = templates.find((t) => t.id === templateId);
			if (!template) return;

			const updates = {isFavorite: !template.isFavorite};
			await updateTemplate(templateId, updates);
		},
		[templates, updateTemplate]
	);

	// Toggle estado activo/archivado
	const toggleStatus = useCallback(
		async (templateId: string) => {
			const template = templates.find((t) => t.id === templateId);
			if (!template) return;

			const newStatus = template.isActive ? "archived" : "active";
			const updates = {
				isActive: !template.isActive,
				status: newStatus as "active" | "archived",
			};
			await updateTemplate(templateId, updates);
		},
		[templates, updateTemplate]
	);

	// Enviar sugerencia
	const submitSuggestion = useCallback(
		async (suggestion: Partial<TemplateSuggestion>) => {
			return await mockTemplateApi.submitSuggestion(suggestion);
		},
		[]
	);

	// Obtener plantilla por ID
	const getTemplateById = useCallback(
		(templateId: string) => {
			return templates.find((template) => template.id === templateId);
		},
		[templates]
	);

	// Obtener estadísticas de plantilla
	const getTemplateStats = useCallback(async (templateId: string) => {
		return await mockTemplateApi.getTemplateStats(templateId);
	}, []);

	// Efectos
	useEffect(() => {
		if (autoLoad) {
			loadTemplates();
		}
	}, [autoLoad, loadTemplates]);

	// Recargar cuando cambien los filtros
	useEffect(() => {
		if (
			filters.search !== undefined ||
			filters.category ||
			filters.difficulty ||
			filters.status
		) {
			loadTemplates();
		}
	}, [filters, loadTemplates]);

	return {
		// Estado
		templates,
		loading,
		error,
		filters,
		stats,

		// Acciones de carga
		loadTemplates,
		refreshTemplates,

		// Filtros
		updateFilters,
		clearFilters,

		// CRUD
		createTemplate,
		updateTemplate,
		deleteTemplate,
		duplicateTemplate,

		// Acciones rápidas
		toggleFavorite,
		toggleStatus,

		// Sugerencias
		submitSuggestion,

		// Utilidades
		getTemplateById,
		getTemplateStats,
	};
};

// Hook específico para un template individual
export const useTemplate = (templateId: string) => {
	const [template, setTemplate] = useState<MyCalculationTemplate | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadTemplate = async () => {
			setLoading(true);
			setError(null);

			try {
				// Simular carga de template individual
				await mockApiDelay(500);
				// En producción: const template = await templateApi.getTemplate(templateId);
				setTemplate(null); // Por ahora null, en producción se cargaría la plantilla
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Error cargando plantilla"
				);
			} finally {
				setLoading(false);
			}
		};

		if (templateId) {
			loadTemplate();
		}
	}, [templateId]);

	return {template, loading, error};
};

export default useTemplates;