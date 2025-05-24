// src/ui/pages/calculations/shared/types/template.types.ts

import type {ComponentType} from "react";

// ==================== TIPOS BASE DESDE LA DB ====================
/**
 * Estructura real de la base de datos
 */
export interface DatabaseTemplate {
	id: string;
	name: string;
	description: string;
	type: string;
	targetProfession: string; // En DB es target_profession
	formula: string;
	nec_reference: string;
	is_active: boolean;
	version: string;
	parent_template_id?: string;
	source?: string;
	created_by?: string;
	is_verified: boolean;
	verified_by?: string;
	verified_at?: string;
	is_featured: boolean;
	usage_count: number;
	average_rating: number;
	rating_count: number;
	share_level: "private" | "public" | "organization";
	created_at: string;
	updated_at: string;
	tags?: string[] | null;
}

// ==================== PARÁMETROS Y RESULTADOS ====================
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

export interface CalculationResult {
	id?: string;
	templateId?: string;
	timestamp?: string;
	inputs?: Record<string, any>;
	outputs?: Record<string, any>;
	metadata?: {
		executionTime?: number;
		necCompliance?: boolean;
		warnings?: string[];
		recommendations?: string[];
	};
	[key: string]: any;
}

// ==================== TEMPLATES PARA UI ====================
/**
 * Template para UI - compatibilidad con componentes existentes
 * Campos opcionales para mapear diferencias entre DB y UI
 */
export interface CalculationTemplate {
	id: string;
	name: string;
	description: string;
	version?: string;
	category: string;
	subcategory?: string;
	profession?: string[];
	targetProfession?: string; // Para compatibilidad con DB
	tags?: string[];
	difficulty?: "basic" | "intermediate" | "advanced";
	estimatedTime?: string;
	necReference?: string;
	nec_reference?: string; // Para compatibilidad con DB
	requirements?: string[];
	parameters?: TemplateParameter[];
	verified?: boolean;
	is_verified?: boolean; // Para compatibilidad con DB
	isPublic?: boolean;
	isNew?: boolean;
	trending?: boolean;
	popular?: boolean;
	rating?: number;
	average_rating?: number; // Para compatibilidad con DB
	usageCount?: number;
	usage_count?: number; // Para compatibilidad con DB
	lastUpdated?: string;
	isFavorite?: boolean;
	color?: string;
	icon?: ComponentType<any> | null;
	allowSuggestions?: boolean;
	createdBy?: string;
	created_by?: string; // Para compatibilidad con DB
	contributors?: string[];
	type?: string; // Para TemplateCard
	formula?: string;
}

/**
 * Plantilla personal del usuario
 */
export interface MyCalculationTemplate {
	id: string;
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
	parameters: TemplateParameter[];
	formula?: string;
	requirements?: string[];
	applicationCases?: string[];
	limitations?: string[];
	version: string;
	usageCount: number;
	createdAt: string;
	lastModified: string;
	isActive: boolean;
	status: "draft" | "published" | "archived";
	sharedWith: string[];
	isFavorite: boolean;
	author?: {
		id: string;
		name: string;
		email: string;
	};
	contributors?: Array<{
		id: string;
		name: string;
		role: "editor" | "viewer";
	}>;
	totalRatings?: number;
	averageRating?: number;
	isNew?: boolean;
}

/**
 * Plantilla pública verificada
 */
export interface PublicCalculationTemplate {
	id: string;
	name: string;
	description: string;
	category: string;
	subcategory?: string;
	targetProfessions: string[];
	difficulty: "basic" | "intermediate" | "advanced";
	estimatedTime?: string;
	necReference?: string;
	tags: string[];
	parameters: TemplateParameter[];
	version: string;
	usageCount: number;
	createdAt: string;
	lastModified: string;
	verified: boolean;
	featured: boolean;
	author?: {
		id: string;
		name: string;
		email: string;
	};
	communityRating: {
		average: number;
		count: number;
		distribution: {
			1: number;
			2: number;
			3: number;
			4: number;
			5: number;
		};
	};
	isFavorite: boolean;
	isNew?: boolean;
}

// ==================== CATEGORÍAS ====================
export interface TemplateCategoryType {
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

// ==================== FILTROS Y BÚSQUEDA ====================
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
}

export type SortOption = "popular" | "rating" | "trending" | "recent" | "name";

export interface TemplateSearchOptions {
	query?: string;
	filters?: TemplateFilters;
	page?: number;
	limit?: number;
}

export interface TemplateListResponse {
	templates: (MyCalculationTemplate | PublicCalculationTemplate)[];
	pagination: {
		total: number;
		page: number;
		limit: number;
		pages: number;
	};
	filters: TemplateFilters;
}

// ==================== OPERACIONES ====================
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
	parameters: TemplateParameter[];
	formula?: string;
	requirements?: string[];
	applicationCases?: string[];
	limitations?: string[];
}

export interface TemplateUpdateData extends Partial<TemplateCreateData> {
	version?: string;
	isActive?: boolean;
}

export interface TemplateOperationResult {
	success: boolean;
	data?: any;
	error?: string;
}

export interface TemplateValidationResponse {
	isValid: boolean;
	errors: Array<{type: string; message: string; field?: string}>;
	warnings: Array<{type: string; message: string; field?: string}>;
}

// ==================== SUGERENCIAS ====================
export interface TemplateSuggestion {
	id: string;
	templateId: string;
	templateName: string;
	suggestionType: "improvement" | "correction" | "addition" | "other";
	title: string;
	description: string;
	currentValue?: string;
	proposedValue?: string;
	justification: string;
	priority: "low" | "medium" | "high";
	affectsAccuracy: boolean;
	affectsCompliance: boolean;
	references?: string[];
	contactForFollowUp: boolean;
	status: "pending" | "approved" | "rejected" | "implemented";
	authorId: string;
	authorName: string;
	createdAt: string;
}

// ==================== EJECUCIÓN ====================
export interface CalculationExecution {
	id: string;
	templateId: string;
	parameters: Record<string, any>;
	results?: CalculationResult;
	status: "pending" | "running" | "completed" | "failed";
	startedAt: string;
	completedAt?: string;
	duration?: number;
	error?: string;
}

// ==================== FORMULARIOS ====================
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

export type FormFieldValue =
	| string
	| number
	| boolean
	| string[]
	| TemplateParameter[];

// ==================== HOOKS ====================
export interface UseTemplateOptions {
	autoLoad?: boolean;
	defaultFilters?: TemplateFilters;
	includePublic?: boolean;
	includePersonal?: boolean;
}

// ==================== ESTADÍSTICAS ====================
export interface TemplateStats {
	total: number;
	verifiedCount: number;
	avgRating: number;
	totalUsage: number;
	trendingCount: number;
	popularCount: number;
}

// ==================== PARÁMETROS Y VALIDACIÓN ====================
export type ParameterType = "number" | "text" | "select" | "boolean";

export interface ParameterValidation {
	isValid: boolean;
	errors: Record<string, string>;
	warnings: Record<string, string>;
}

export type ParameterValues = Record<string, any>;

export const DEFAULT_PARAMETER_VALUES: ParameterValues = {};

// ==================== EXPORTS PARA COMPATIBILIDAD ====================
export type {
	CalculationTemplate as UITemplate,
	TemplateFilters as UITemplateFilters,
};

// Función helper para mapear DB a UI
export const mapDatabaseToUI = (
	dbTemplate: DatabaseTemplate
): CalculationTemplate => {
	// Calcular si es nuevo (últimos 30 días)
	const thirtyDaysAgo = new Date();
	thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
	const isNew = new Date(dbTemplate.created_at) > thirtyDaysAgo;

	// Calcular trending y popular
	const isPopular = dbTemplate.usage_count > 100;
	const isTrending =
		dbTemplate.usage_count > 50 && dbTemplate.average_rating > 4.0;

	return {
		id: dbTemplate.id,
		name: dbTemplate.name,
		description: dbTemplate.description,
		version: dbTemplate.version,
		category: dbTemplate.type,
		subcategory: dbTemplate.type,
		profession: dbTemplate.targetProfession
			? [dbTemplate.targetProfession]
			: [],
		targetProfession: dbTemplate.targetProfession,
		tags: Array.isArray(dbTemplate.tags) ? dbTemplate.tags : [],
		difficulty: "basic", // Por defecto, podría calcularse
		estimatedTime: "10-15 min", // Por defecto
		necReference: dbTemplate.nec_reference,
		nec_reference: dbTemplate.nec_reference,
		requirements: [], // No existe en DB
		parameters: [], // Vendría por separado
		verified: dbTemplate.is_verified,
		is_verified: dbTemplate.is_verified,
		isPublic: dbTemplate.share_level === "public",
		isNew: isNew,
		trending: isTrending,
		popular: isPopular,
		rating: dbTemplate.average_rating,
		average_rating: dbTemplate.average_rating,
		usageCount: dbTemplate.usage_count,
		usage_count: dbTemplate.usage_count,
		lastUpdated: dbTemplate.updated_at,
		isFavorite: false, // Se carga por separado
		color: getCategoryColor(dbTemplate.type),
		icon: null,
		allowSuggestions: true,
		createdBy: dbTemplate.created_by,
		created_by: dbTemplate.created_by,
		contributors: [],
		type: dbTemplate.type,
		formula: dbTemplate.formula,
	};
};

// Helper para colores de categoría
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
