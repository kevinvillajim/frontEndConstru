// src/ui/pages/calculations/shared/types/template.types.ts

// ==================== TIPOS BASE DESDE BACKEND ====================
export interface TemplateParameter {
	name: string;
	label: string;
	type: "number" | "text" | "select" | "boolean";
	unit?: string;
	required: boolean;
	min?: number;
	max?: number;
	options?: string[];
	defaultValue?: any;
	placeholder?: string;
	tooltip?: string;
	validation?: {
		pattern?: string;
		message?: string;
	};
}

// ==================== TEMPLATE PRINCIPAL UNIFICADO ====================
export interface CalculationTemplate {
	id: string;
	name: string;
	description: string;
	type: string;
	targetProfession: string;
	formula: string;
	necReference: string;
	isActive: boolean;
	version: number;
	parentTemplateId?: string;
	source: "system" | "user" | "community" | "improved";
	createdBy?: string;
	isVerified: boolean;
	verifiedBy?: string;
	verifiedAt?: string;
	isFeatured: boolean;
	usageCount: number;
	averageRating: number;
	ratingCount: number;
	tags?: string[];
	shareLevel: "private" | "organization" | "public";
	difficulty?: string;
	estimatedTime?: number;
	complianceLevel?: string;
	parameters?: TemplateParameter[];
	createdAt: string;
	updatedAt: string;

	// Campos computados para UI
	trending?: boolean;
	popular?: boolean;
	isNew?: boolean;
	isFavorite?: boolean;
	color?: string;
	icon?: any;

	// Para compatibilidad con componentes existentes
	category?: string;
	subcategory?: string;
	profession?: string[];
	verified?: boolean;
	rating?: number;
	lastUpdated?: string;
	requirements?: string[];
}

// ==================== CATEGORÍAS ====================
export interface TemplateCategory {
	id: string;
	name: string;
	description: string;
	color: string;
	count: number;
	subcategories?: Array<{
		id: string;
		name: string;
		description?: string;
		count: number;
	}>;
}

// ==================== FILTROS ====================
export interface TemplateFilters {
	searchTerm?: string;
	category?: string | null;
	subcategory?: string | null;
	targetProfession?: string;
	difficulty?: "basic" | "intermediate" | "advanced" | null;
	showOnlyFavorites?: boolean;
	showOnlyVerified?: boolean;
	showOnlyFeatured?: boolean;
	tags?: string[];
	sortBy?: SortOption;
	limit?: number;
	page?: number;
}

export type SortOption = "popular" | "rating" | "trending" | "recent" | "name";

// ==================== RESPUESTAS DE API ====================
export interface PaginatedResult<T> {
	data: T[];
	pagination: {
		total: number;
		page: number;
		limit: number;
		pages: number;
	};
}

export interface CalculationResult {
	id?: string;
	calculationTemplateId: string;
	projectId?: string;
	userId: string;
	inputParameters: Record<string, any>;
	results: Record<string, any>;
	isSaved: boolean;
	name?: string;
	notes?: string;
	executionTimeMs?: number;
	wasSuccessful: boolean;
	errorMessage?: string;
	usedInProject: boolean;
	ledToMaterialOrder: boolean;
	ledToBudget: boolean;
	createdAt?: string;
	updatedAt?: string;
}

// ==================== ESTADÍSTICAS ====================
export interface CatalogStats {
	total: number;
	verifiedCount: number;
	avgRating: number;
	totalUsage: number;
	trendingCount?: number;
	popularCount?: number;
}

// ==================== OPCIONES DE HOOKS ====================
export interface UseCatalogTemplatesOptions {
	autoLoad?: boolean;
	onlyVerified?: boolean;
	includePersonal?: boolean;
}

export interface UseCatalogSearchReturn {
	searchTerm: string;
	activeFilters: TemplateFilters;
	sortBy: SortOption;
	templates: CalculationTemplate[];
	setSearchTerm: (term: string) => void;
	setSortBy: (sort: SortOption) => void;
	updateFilter: (key: keyof TemplateFilters, value: any) => void;
	clearFilters: () => void;
	hasActiveFilters: boolean;
}

// ==================== CATEGORÍAS ESTÁTICAS ====================
export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
	{
		id: "structural",
		name: "Estructural",
		description: "Cálculos de estructuras de hormigón, acero y madera",
		color: "bg-blue-100 text-blue-700 border-blue-200",
		count: 0,
		subcategories: [
			{id: "concrete", name: "Hormigón Armado", count: 0},
			{id: "steel", name: "Estructuras de Acero", count: 0},
			{id: "wood", name: "Estructuras de Madera", count: 0},
		],
	},
	{
		id: "electrical",
		name: "Eléctrico",
		description: "Instalaciones eléctricas y sistemas de potencia",
		color: "bg-yellow-100 text-yellow-700 border-yellow-200",
		count: 0,
		subcategories: [
			{id: "power", name: "Sistemas de Potencia", count: 0},
			{id: "lighting", name: "Iluminación", count: 0},
			{id: "protection", name: "Protecciones", count: 0},
		],
	},
	{
		id: "architectural",
		name: "Arquitectónico",
		description: "Cálculos arquitectónicos y de diseño",
		color: "bg-green-100 text-green-700 border-green-200",
		count: 0,
		subcategories: [
			{id: "areas", name: "Áreas y Volúmenes", count: 0},
			{id: "accessibility", name: "Accesibilidad", count: 0},
		],
	},
	{
		id: "hydraulic",
		name: "Hidráulico",
		description: "Sistemas hidráulicos y sanitarios",
		color: "bg-cyan-100 text-cyan-700 border-cyan-200",
		count: 0,
		subcategories: [
			{id: "water", name: "Agua Potable", count: 0},
			{id: "drainage", name: "Drenajes", count: 0},
		],
	},
	{
		id: "mechanical",
		name: "Mecánico",
		description: "Sistemas mecánicos y HVAC",
		color: "bg-purple-100 text-purple-700 border-purple-200",
		count: 0,
		subcategories: [
			{id: "hvac", name: "Climatización", count: 0},
			{id: "ventilation", name: "Ventilación", count: 0},
		],
	},
	{
		id: "geotechnical",
		name: "Geotécnico",
		description: "Estudios de suelos y cimentaciones",
		color: "bg-stone-100 text-stone-700 border-stone-200",
		count: 0,
		subcategories: [
			{id: "foundations", name: "Cimentaciones", count: 0},
			{id: "soil", name: "Mecánica de Suelos", count: 0},
		],
	},
];

// ==================== FUNCIONES HELPER ====================
export const mapBackendTemplate = (backendData: any): CalculationTemplate => {
	// Calcular si es nuevo (últimos 30 días)
	const thirtyDaysAgo = new Date();
	thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
	const isNewValue =
		backendData.createdAt && new Date(backendData.createdAt) > thirtyDaysAgo;

	// Calcular trending y popular
	const usageCount = backendData.usageCount || backendData.usage_count || 0;
	const avgRating =
		backendData.averageRating || backendData.average_rating || 0;
	const isPopular = usageCount > 100;
	const isTrending = usageCount > 50 && avgRating > 4.0;

	return {
		id: backendData.id,
		name: backendData.name,
		description: backendData.description,
		type: backendData.type,
		targetProfession:
			backendData.targetProfession || backendData.target_profession,
		formula: backendData.formula,
		necReference: backendData.necReference || backendData.nec_reference,
		isActive: backendData.isActive ?? backendData.is_active ?? true,
		version: parseInt(backendData.version) || 1,
		parentTemplateId:
			backendData.parentTemplateId || backendData.parent_template_id,
		source: backendData.source || "system",
		createdBy: backendData.createdBy || backendData.created_by,
		isVerified: backendData.isVerified ?? backendData.is_verified ?? false,
		verifiedBy: backendData.verifiedBy || backendData.verified_by,
		verifiedAt: backendData.verifiedAt || backendData.verified_at,
		isFeatured: backendData.isFeatured ?? backendData.is_featured ?? false,
		usageCount,
		averageRating: avgRating,
		ratingCount: backendData.ratingCount || backendData.rating_count || 0,
		tags: Array.isArray(backendData.tags) ? backendData.tags : [],
		shareLevel: backendData.shareLevel || backendData.share_level || "private",
		difficulty: backendData.difficulty || "intermediate",
		estimatedTime: backendData.estimatedTime || backendData.estimated_time,
		complianceLevel:
			backendData.complianceLevel || backendData.compliance_level,
		parameters: backendData.parameters || [],
		createdAt: backendData.createdAt || backendData.created_at,
		updatedAt: backendData.updatedAt || backendData.updated_at,

		// Campos computados
		trending: isTrending,
		popular: isPopular,
		isNew: isNewValue,
		isFavorite: false, // Se carga por separado

		// Para compatibilidad
		category: backendData.type,
		subcategory: backendData.type,
		profession: backendData.targetProfession
			? [backendData.targetProfession]
			: [],
		verified: backendData.isVerified ?? backendData.is_verified ?? false,
		rating: avgRating,
		lastUpdated: backendData.updatedAt || backendData.updated_at,
		requirements: [], // Se puede llenar desde parámetros si es necesario
	};
};

export const getCategoryColor = (category: string): string => {
	const categoryConfig = TEMPLATE_CATEGORIES.find((c) => c.id === category);
	return categoryConfig?.color || "bg-gray-100 text-gray-700 border-gray-200";
};
