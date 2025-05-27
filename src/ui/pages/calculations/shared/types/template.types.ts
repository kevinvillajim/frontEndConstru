// src/ui/pages/calculations/shared/types/template.types.ts

// ==================== TIPOS BASE DESDE BACKEND ====================
export interface BackendTemplateParameter {
	id: string;
	name: string;
	description: string;
	dataType: "number" | "string" | "enum" | "boolean";
	scope: "input" | "output";
	displayOrder: number;
	isRequired: boolean;
	defaultValue?: string | null;
	minValue?: number | null;
	maxValue?: number | null;
	regexPattern?: string | null;
	unitOfMeasure?: string | null;
	allowedValues?: string | null; // JSON array como string
	helpText?: string;
	dependsOnParameters?: string | null;
	formula?: string | null;
	calculationTemplateId: string;
	createdAt: string;
	updatedAt: string;
}

// Tipo legacy para compatibilidad con componentes existentes
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

// Template del backend
export interface BackendCalculationTemplate {
	id: string;
	name: string;
	description: string;
	type: string;
	targetProfession: string;
	formula: string;
	necReference: string;
	isActive: boolean;
	version: number;
	parentTemplateId?: string | null;
	source: "system" | "user" | "community" | "improved";
	createdBy?: string | null;
	isVerified: boolean;
	verifiedBy?: string | null;
	verifiedAt?: string | null;
	isFeatured: boolean;
	usageCount: number;
	averageRating: string; // Viene como string del backend
	ratingCount: number;
	tags?: string[] | null;
	shareLevel: "private" | "organization" | "public";
	createdAt: string;
	updatedAt: string;
	parameters?: BackendTemplateParameter[];
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
	estimatedTime?: string;
	complianceLevel?: string;
	parameters?: BackendTemplateParameter[];
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

// Tipos específicos para mis plantillas vs plantillas públicas
export interface MyCalculationTemplate extends CalculationTemplate {
	longDescription?: string;
	applicationCases?: string[];
	limitations?: string[];
	sharedWith?: string[];
	author?: {
		id: string;
		name: string;
		email: string;
	};
	contributors?: Array<{
		id: string;
		name: string;
		contributionType: string;
	}>;
	totalRatings: number;
	status: "draft" | "published" | "archived";
}

export interface PublicCalculationTemplate extends CalculationTemplate {
	featured: boolean;
	author?: {
		id: string;
		name: string;
		email: string;
	};
	communityRating?: {
		average: number;
		count: number;
		distribution: {[key: number]: number};
	};
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

export interface TemplateCategoryType {
	id: string;
	name: string;
	description: string;
	color: string;
	count: number;
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

// Resultado de cálculo del backend
export interface BackendCalculationResult {
	id?: string;
	calculationTemplateId: string;
	projectId?: string;
	userId?: string;
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

export interface CalculationResult {
	id?: string;
	calculationTemplateId: string;
	templateName?: string;
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

export interface TemplateStats {
	total: number;
	verifiedCount: number;
	avgRating: number;
	totalUsage: number;
	trendingCount: number;
	popularCount: number;
}

// ==================== TIPOS PARA HOOKS ====================
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

// ==================== TIPOS PARA PLANTILLAS PERSONALES ====================
export interface TemplateCreateData {
	name: string;
	description: string;
	longDescription?: string;
	category: string;
	subcategory?: string;
	targetProfessions: string[];
	difficulty: "basic" | "intermediate" | "advanced";
	estimatedTime?: string;
	necReference?: string;
	tags: string[];
	isPublic: boolean;
	parameters: BackendTemplateParameter[];
	formula: string;
	requirements?: string[];
	applicationCases?: string[];
	limitations?: string[];
}

export interface TemplateUpdateData extends Partial<TemplateCreateData> {
	id?: never; // No permitir actualizar el ID
}

export interface TemplateSearchOptions {
	query?: string;
	filters?: TemplateFilters;
	page?: number;
	limit?: number;
}

export interface TemplateListResponse {
	templates: (MyCalculationTemplate | PublicCalculationTemplate)[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		pages: number;
	};
	filters: TemplateFilters;
}

export interface TemplateValidationResponse {
	isValid: boolean;
	errors: Array<{type: string; message: string; field?: string}>;
	warnings: Array<{type: string; message: string; field?: string}>;
}

export interface TemplateOperationResult {
	success: boolean;
	data?: any;
	error?: string;
}

// ==================== TIPOS PARA SUGERENCIAS ====================
export interface TemplateSuggestion {
	id: string;
	templateId: string;
	authorId: string;
	title: string;
	description: string;
	type: "improvement" | "bug_fix" | "new_feature";
	status: "pending" | "approved" | "rejected" | "implemented";
	votes: {up: number; down: number};
	createdAt: string;
	reviewedBy?: string;
	reviewedAt?: string;
	implementedAt?: string;
}

// ==================== TIPOS PARA EJECUCIÓN ====================
export interface CalculationExecution {
	id: string;
	templateId: string;
	userId: string;
	parameters: Record<string, any>;
	results?: CalculationResult;
	status: "pending" | "running" | "completed" | "failed";
	startedAt: string;
	completedAt?: string;
	duration?: number;
	error?: string;
}

// ==================== TIPOS PARA OPCIONES DE HOOKS ====================
export interface UseTemplateOptions {
	autoLoad?: boolean;
	defaultFilters?: TemplateFilters;
	includePublic?: boolean;
	includePersonal?: boolean;
}

export interface TemplateFormState {
	data: TemplateCreateData;
	errors: Record<string, string>;
	isSubmitting: boolean;
	isDirty: boolean;
	currentStep: number;
	totalSteps: number;
}

export interface TemplateFormErrors {
	[key: string]: string;
}

// ==================== TIPOS PARA VALIDACIÓN ====================
export interface ParameterValidation {
	isValid: boolean;
	errors: Record<string, string>;
	warnings: Record<string, string>;
}

export interface ParameterValues {
	[parameterName: string]: any;
}

export type FormFieldValue = string | number | boolean | string[] | undefined;

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
		id: "foundation",
		name: "Geotécnico",
		description: "Estudios de suelos y cimentaciones",
		color: "bg-stone-100 text-stone-700 border-stone-200",
		count: 0,
		subcategories: [
			{id: "foundations", name: "Cimentaciones", count: 0},
			{id: "soil", name: "Mecánica de Suelos", count: 0},
		],
	},
	{
		id: "installation",
		name: "Instalaciones",
		description: "Sistemas hidráulicos y sanitarios",
		color: "bg-cyan-100 text-cyan-700 border-cyan-200",
		count: 0,
		subcategories: [
			{id: "water", name: "Agua Potable", count: 0},
			{id: "drainage", name: "Drenajes", count: 0},
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
];

// ==================== FUNCIONES HELPER ====================
export const mapBackendTemplate = (
	backendData: BackendCalculationTemplate
): CalculationTemplate => {
	// Calcular si es nuevo (últimos 30 días)
	const thirtyDaysAgo = new Date();
	thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
	const isNewValue =
		backendData.createdAt && new Date(backendData.createdAt) > thirtyDaysAgo;

	// Convertir rating de string a número de manera segura
	const averageRating = parseFloat(backendData.averageRating) || 0;

	// Calcular trending y popular
	const usageCount = backendData.usageCount || 0;
	const isPopular = usageCount > 100;
	const isTrending = usageCount > 50 && averageRating > 4.0;

	// Mapear dificultad basada en el tipo o características
	const getDifficulty = (type: string, profession: string): string => {
		switch (type) {
			case "foundation":
			case "structural":
				return "advanced";
			case "electrical":
			case "installation":
				return "intermediate";
			default:
				return "basic";
		}
	};

	return {
		id: backendData.id,
		name: backendData.name,
		description: backendData.description,
		type: backendData.type,
		targetProfession: backendData.targetProfession,
		formula: backendData.formula,
		necReference: backendData.necReference,
		isActive: backendData.isActive,
		version: backendData.version,
		parentTemplateId: backendData.parentTemplateId || undefined,
		source: backendData.source,
		createdBy: backendData.createdBy || undefined,
		isVerified: backendData.isVerified,
		verifiedBy: backendData.verifiedBy || undefined,
		verifiedAt: backendData.verifiedAt || undefined,
		isFeatured: backendData.isFeatured,
		usageCount,
		averageRating,
		ratingCount: backendData.ratingCount,
		tags: backendData.tags || [],
		shareLevel: backendData.shareLevel,
		difficulty: getDifficulty(backendData.type, backendData.targetProfession),
		estimatedTime: "10-15 min", // Por defecto
		parameters: backendData.parameters || [],
		createdAt: backendData.createdAt,
		updatedAt: backendData.updatedAt,

		// Campos computados
		trending: isTrending,
		popular: isPopular,
		isNew: isNewValue,
		isFavorite: false, // Se carga por separado

		// Para compatibilidad
		category: backendData.type,
		subcategory: backendData.type,
		profession: [backendData.targetProfession],
		verified: backendData.isVerified,
		rating: averageRating,
		lastUpdated: backendData.updatedAt,
		requirements: [], // Se puede llenar desde parámetros si es necesario
	};
};

export const getCategoryColor = (category: string): string => {
	const categoryConfig = TEMPLATE_CATEGORIES.find((c) => c.id === category);
	return categoryConfig?.color || "bg-gray-100 text-gray-700 border-gray-200";
};
