import type {ComponentType, SVGProps} from "react";

// Tipos básicos
export type DifficultyLevel = "basic" | "intermediate" | "advanced";
export type SortOption =
	| "popular"
	| "rating"
	| "trending"
	| "recent"
	| "name"
	| "date"
	| "usage"
	| "category";
export type ParameterType = "number" | "select" | "text" | "boolean" | "date";
export type TemplateStatus = "draft" | "active" | "archived" | "under_review";
export type TemplateDifficulty = "basic" | "intermediate" | "advanced";
export type TemplateCategory =
	| "structural"
	| "electrical"
	| "architectural"
	| "hydraulic"
	| "custom";
export type SuggestionType =
	| "formula"
	| "parameters"
	| "description"
	| "requirements"
	| "necReference"
	| "other";
export type SuggestionStatus =
	| "pending"
	| "approved"
	| "rejected"
	| "implemented"
	| "reviewed";
export type SuggestionPriority = "low" | "medium" | "high" | "critical";

// Parámetro de cálculo
export interface TemplateParameter {
	id: string;
	name: string;
	label: string;
	type: ParameterType;
	unit?: string;
	required: boolean;
	defaultValue?: string | number | boolean;
	options?: string[];
	min?: number;
	max?: number;
	step?: number;
	placeholder?: string;
	tooltip?: string;
	typicalRange?: string;
	validation?: {
		pattern?: string;
		message?: string;
	};
	dependencies?: {
		dependsOn: string;
		condition: any;
		action: "show" | "hide" | "require" | "disable";
	}[];
}

// Alias para compatibilidad
export type CalculationParameter = TemplateParameter;

// Fórmula de cálculo
export interface CalculationFormula {
	expression: string;
	variables: Record<string, string>;
	description?: string;
	units?: string;
}

// Regla de validación
export interface ValidationRule {
	field: string;
	type: "required" | "min" | "max" | "pattern" | "custom";
	value?: any;
	message: string;
	condition?: string;
}

// Referencia normativa
export interface NormReference {
	code: string;
	section: string;
	description: string;
	url?: string;
}

// Ejemplo de plantilla
export interface TemplateExample {
	name: string;
	description: string;
	inputs: Record<string, any>;
	expectedOutput: any;
}

// Validación de plantilla
export interface TemplateValidation {
	parameterValidations: Record<
		string,
		{
			required?: boolean;
			min?: number;
			max?: number;
			pattern?: string;
			customValidator?: string;
			errorMessage?: string;
		}
	>;
	crossValidations?: Array<{
		condition: string;
		errorMessage: string;
	}>;
}

// Resultado de cálculo
export interface CalculationResult {
	mainResult: {
		label: string;
		value: string | number;
		unit: string;
		significance?: "primary" | "secondary";
	};
	breakdown: Array<{
		label: string;
		value: string | number;
		unit?: string;
		factor?: string;
		description?: string;
		category?: string | null;
	}>;
	recommendations: Array<{
		type: "success" | "warning" | "info" | "error";
		title: string;
		description: string;
		action?: {
			label: string;
			callback: () => void;
		};
	}>;
	compliance: {
		isCompliant: boolean;
		necReference: string;
		notes: string[];
		violations?: string[];
	};
	charts?: Array<{
		type: "line" | "bar" | "pie" | "scatter";
		title: string;
		data: any[];
		config?: any;
	}>;
}

// Plantilla de cálculo principal
export interface CalculationTemplate {
	// Identificación
	id: string;
	name: string;
	description: string;
	version?: string;

	// Categorización
	category: string;
	subcategory: string;
	profession: string[];
	tags: string[];

	// Metadatos técnicos
	difficulty: DifficultyLevel;
	estimatedTime: string;
	necReference: string;
	requirements: string[];
	parameters: TemplateParameter[];

	// Estado y verificación
	verified: boolean;
	isPublic?: boolean;
	isNew?: boolean;
	trending?: boolean;
	popular?: boolean;

	// Métricas
	rating: number;
	usageCount: number;
	lastUpdated: string;

	// Personalización y favoritos
	isFavorite?: boolean;
	color: string;
	icon: ComponentType<SVGProps<SVGSVGElement>>;

	// Colaboración
	allowSuggestions?: boolean;
	createdBy?: string;
	contributors?: string[];

	// Configuración avanzada
	settings?: {
		autoSave?: boolean;
		allowExport?: boolean;
		showSteps?: boolean;
		includeCharts?: boolean;
	};
}

// Alias para compatibilidad
export type Template = CalculationTemplate;

// Plantilla personal del usuario
export interface MyCalculationTemplate {
	// Identificación
	id: string;
	name: string;
	description: string;
	longDescription?: string;

	// Categorización
	category: TemplateCategory;
	subcategory: string;
	targetProfessions: string[];
	difficulty: TemplateDifficulty;
	tags: string[];

	// Metadatos técnicos
	estimatedTime?: string;
	necReference?: string;
	version: string;
	requirements?: string[];
	applicationCases?: string[];
	limitations?: string[];

	// Configuración
	parameters: TemplateParameter[];
	formula?: string | CalculationFormula;
	validation?: TemplateValidation;

	// Estado y permisos
	isPublic: boolean;
	isActive: boolean;
	isFavorite: boolean;
	status: TemplateStatus;
	sharedWith: string[];

	// Estadísticas
	usageCount: number;
	rating?: {min: number; max: number};
	totalRatings?: number;

	// Fechas
	createdAt: string;
	lastModified: string;
	publishedAt?: string;

	// Colaboración
	author?: {
		id: string;
		name: string;
		profession?: string;
	};
	contributors?: Array<{
		id: string;
		name: string;
		contribution: string;
		date: string;
	}>;
	changeLog?: Array<{
		version: string;
		changes: string[];
		date: string;
		author: string;
	}>;
}

// Plantilla pública del catálogo
export interface PublicCalculationTemplate
	extends Omit<MyCalculationTemplate, "isFavorite" | "sharedWith"> {
	verified: boolean;
	verifiedBy?: {
		id: string;
		name: string;
		credentials: string;
		date: string;
	};
	downloadCount: number;
	communityRating: {
		average: number;
		count: number;
		distribution: Record<number, number>;
	};
	lastReviewed?: string;
	reviewComments?: string;
}

// Alias para compatibilidad
export type PublicTemplate = PublicCalculationTemplate;

// Subcategoría de plantillas
export interface TemplateSubcategory {
	id: string;
	name: string;
	description?: string;
	count: number;
	icon?: ComponentType<SVGProps<SVGSVGElement>>;
}

// Categoría de plantillas
export interface TemplateCategoryType {
	id: string;
	name: string;
	description?: string;
	icon: ComponentType<SVGProps<SVGSVGElement>>;
	color: string;
	count: number;
	subcategories?: TemplateSubcategory[];
	featured?: boolean;
}

// Datos para crear plantilla
export interface TemplateCreateData {
	name: string;
	description: string;
	longDescription?: string;
	category: TemplateCategory;
	subcategory: string;
	targetProfessions: string[];
	difficulty: TemplateDifficulty;
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

// Datos para actualizar plantilla
export interface TemplateUpdateData extends Partial<TemplateCreateData> {
	version?: string;
	status?: TemplateStatus;
}

// Datos para formulario de plantilla
export interface TemplateFormData {
	name: string;
	description: string;
	longDescription: string;
	category: string;
	subcategory: string;
	targetProfessions: string[];
	difficulty: TemplateDifficulty;
	estimatedTime: string;
	necReference: string;
	tags: string[];
	isPublic: boolean;
	parameters: TemplateParameter[];
	formula: string;
	requirements: string[];
	applicationCases: string[];
	limitations: string[];
}

// Filtros para búsqueda de plantillas
export interface TemplateFilters {
	search?: string;
	category?: string | null;
	subcategory?: string | null;
	difficulty?: DifficultyLevel | null;
	profession?: string[];
	verified?: boolean;
	rating?: {min: number; max: number};
	tags?: string[];
	dateRange?: {
		from: string;
		to: string;
	};
	usageRange?: {
		min: number;
		max: number;
	};
	status?: TemplateStatus[];
	favorites?: boolean;
	sortBy?: SortOption;
	sortOrder?: "asc" | "desc";

	// Filtros específicos para catálogo público
	searchTerm?: string;
	showOnlyFavorites?: boolean;
	showOnlyVerified?: boolean;
}

// Opciones de búsqueda de plantillas
export interface TemplateSearchOptions {
	query?: string;
	filters?: TemplateFilters;
	pagination?: {
		page: number;
		limit: number;
	};
	sort?: {
		field: SortOption;
		order: "asc" | "desc";
	};
}

// Respuesta de API para lista de plantillas
export interface TemplateListResponse {
	templates: MyCalculationTemplate[] | PublicCalculationTemplate[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		pages: number;
	};
	filters: TemplateFilters;
	stats?: {
		totalByCategory: Record<string, number>;
		totalByDifficulty: Record<string, number>;
		averageRating: number;
	};
}

// Respuesta de validación de plantilla
export interface TemplateValidationResponse {
	isValid: boolean;
	errors: Record<string, string>;
	warnings: Record<string, string>;
	suggestions?: string[];
}

// Resultado de operación de plantilla
export interface TemplateOperationResult {
	success: boolean;
	data?: any;
	error?: string;
	message?: string;
}

// Sugerencia de cambio para plantilla
export interface TemplateSuggestion {
	id: string;
	templateId: string;
	templateName: string;
	suggestionType: SuggestionType;
	title: string;
	description: string;
	currentValue?: string;
	proposedValue?: string;
	justification: string;
	priority: SuggestionPriority;
	affectsAccuracy: boolean;
	affectsCompliance: boolean;
	references?: string[];
	contactForFollowUp: boolean;

	// Estado de la sugerencia
	status: SuggestionStatus;
	reviewComments?: string;
	reviewedBy?: string;
	reviewedAt?: string;

	// Autor
	authorId: string;
	authorName?: string;
	authorEmail?: string;
	createdAt: string;

	// Implementación
	implementedAt?: string;
	implementedInVersion?: string;
}

// Ejecución de cálculo
export interface CalculationExecution {
	id: string;
	templateId: string;
	parameters: Record<string, any>;
	result?: CalculationResult;
	status: "pending" | "calculating" | "completed" | "error";
	error?: string;
	startedAt: string;
	completedAt?: string;
	duration?: number;
}

// Historial de cálculo
export interface CalculationHistory {
	id: string;
	templateId: string;
	templateName: string;
	templateVersion: string;

	// Datos de entrada
	inputParameters: Record<string, any>;

	// Resultados
	results: CalculationResult;
	calculationTime: number; // en millisegundos

	// Metadatos
	createdAt: string;
	userId: string;
	projectId?: string;
	projectName?: string;
	notes?: string;
	tags?: string[];

	// Validación
	isValid: boolean;
	validationErrors?: string[];
	warnings?: string[];
}

// Estadísticas de plantilla
export interface TemplateStats {
	total: number;
	verifiedCount: number;
	avgRating: number;
	totalUsage: number;
	trendingCount: number;
	popularCount: number;
	byCategory?: {
		[categoryId: string]: {
			count: number;
			avgRating: number;
			totalUsage: number;
		};
	};
	byDifficulty?: {
		[difficulty in DifficultyLevel]: number;
	};

	// Estadísticas específicas de plantilla
	templateId?: string;
	uniqueUsers?: number;
	averageRating?: number;
	totalRatings?: number;
	usageByMonth?: Record<string, number>;
	mostCommonInputs?: Record<string, any>;
	errorRate?: number;
	averageCalculationTime?: number;
}

// Validación de parámetros
export interface ParameterValidation {
	isValid: boolean;
	errors: Record<string, string>;
	warnings: Record<string, string>;
}

// Opciones para hook useTemplates
export interface UseTemplateOptions {
	autoLoad?: boolean;
	defaultFilters?: TemplateFilters;
	includePublic?: boolean;
	includePersonal?: boolean;
}

// Estado del formulario de plantilla
export interface TemplateFormState {
	data: TemplateFormData;
	errors: Record<string, string>;
	isSubmitting: boolean;
	isDirty: boolean;
	currentStep: number;
	totalSteps: number;
}

// Errores del formulario
export interface TemplateFormErrors {
	[key: string]: string;
}

// Contexto de uso de plantillas
export interface TemplateUsageContext {
	projectId?: string;
	projectName?: string;
	calculationName?: string;
	collaborators?: string[];
	shared?: boolean;
	autoSave?: boolean;
}

// Configuración de exportación
export interface ExportConfig {
	format: "pdf" | "excel" | "word" | "json";
	includeParameters: boolean;
	includeResults: boolean;
	includeCharts: boolean;
	includeNotes: boolean;
	template?: "standard" | "detailed" | "summary";
	branding?: {
		logo?: string;
		company?: string;
		engineer?: string;
	};
}

// Estado del wizard de plantillas
export interface TemplateWizardState {
	currentStep: "select" | "configure" | "calculate" | "results";
	selectedTemplate: CalculationTemplate | null;
	parameters: Record<string, any>;
	results: CalculationResult | null;
	validation: ParameterValidation;
	isCalculating: boolean;
	history: CalculationHistory[];
}

// Props comunes para componentes
export interface BaseTemplateProps {
	template: CalculationTemplate;
	onSelect?: (template: CalculationTemplate) => void;
	onPreview?: (template: CalculationTemplate) => void;
	onToggleFavorite?: (templateId: string) => void;
	className?: string;
}

// Configuración de visualización
export interface DisplayConfig {
	compact?: boolean;
	showPreview?: boolean;
	showFavorites?: boolean;
	showMetrics?: boolean;
	animationDelay?: number;
}

// Contexto de React para plantillas
export interface TemplateContextValue {
	templates: CalculationTemplate[];
	categories: TemplateCategoryType[];
	filters: TemplateFilters;
	isLoading: boolean;
	error?: string;

	// Acciones
	setFilters: (filters: Partial<TemplateFilters>) => void;
	toggleFavorite: (templateId: string) => void;
	getTemplateById: (id: string) => CalculationTemplate | undefined;
	getFilteredTemplates: () => CalculationTemplate[];
	refreshTemplates: () => Promise<void>;
}

// Constantes
export const TEMPLATE_CATEGORIES: Record<
	TemplateCategory,
	TemplateCategoryType
> = {
	structural: {
		id: "structural",
		name: "Estructural",
		description: "Análisis y diseño estructural",
		icon: null as any, // Se asignará en el componente
		color: "bg-blue-50 border-blue-200 text-blue-700",
		count: 0,
	},
	electrical: {
		id: "electrical",
		name: "Eléctrico",
		description: "Instalaciones eléctricas",
		icon: null as any,
		color: "bg-yellow-50 border-yellow-200 text-yellow-700",
		count: 0,
	},
	architectural: {
		id: "architectural",
		name: "Arquitectónico",
		description: "Diseño arquitectónico",
		icon: null as any,
		color: "bg-green-50 border-green-200 text-green-700",
		count: 0,
	},
	hydraulic: {
		id: "hydraulic",
		name: "Hidráulico",
		description: "Sistemas hidráulicos",
		icon: null as any,
		color: "bg-cyan-50 border-cyan-200 text-cyan-700",
		count: 0,
	},
	custom: {
		id: "custom",
		name: "Personalizada",
		description: "Plantillas personalizadas",
		icon: null as any,
		color: "bg-purple-50 border-purple-200 text-purple-700",
		count: 0,
	},
};

export const DEFAULT_PARAMETER_VALUES: Record<ParameterType, any> = {
	number: 0,
	text: "",
	select: "",
	boolean: false,
	date: new Date().toISOString().split("T")[0],
};

// Exports para compatibilidad
export type {
	TemplateCategoryType as Category,
	TemplateFilters as Filters,
	CalculationResult as Result,
	TemplateParameter as Parameter,
};
