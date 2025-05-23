import type {ComponentType, SVGProps} from "react";

// ==================== TIPOS BÁSICOS ====================
export type DifficultyLevel = "basic" | "intermediate" | "advanced";
export type TemplateDifficulty = "basic" | "intermediate" | "advanced"; // Alias para compatibilidad
export type TemplateCategory =
	| "structural"
	| "electrical"
	| "architectural"
	| "hydraulic"
	| "custom";
export type TemplateStatus = "draft" | "active" | "archived" | "under_review";
export type ParameterType = "number" | "select" | "text" | "boolean" | "date";
export type SortOption =
	| "popular"
	| "rating"
	| "trending"
	| "recent"
	| "name"
	| "date"
	| "usage"
	| "category";

// Tipos para sugerencias
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

// Tipos para valores de parámetros
export type ParameterValue = string | number | boolean | Date | null;
export type ParameterValues = Record<string, ParameterValue>;

// Tipo para condiciones de parámetros
export type ParameterCondition = {
	operator:
		| "eq"
		| "neq"
		| "gt"
		| "lt"
		| "gte"
		| "lte"
		| "contains"
		| "startsWith"
		| "endsWith";
	value: string | number | boolean | null;
};

// ==================== PARÁMETROS ====================
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
		condition: ParameterCondition; // Reemplazado "any" con tipo específico
		action: "show" | "hide" | "require" | "disable";
	}[];
}

// Alias para compatibilidad
export type CalculationParameter = TemplateParameter;

// ==================== FÓRMULAS Y VALIDACIÓN ====================
export interface CalculationFormula {
	expression: string;
	variables: Record<string, string>;
	description?: string;
	units?: string;
}

export interface ValidationRule {
	field: string;
	type: "required" | "min" | "max" | "pattern" | "custom";
	value?: string | number | boolean | RegExp | null; // Reemplazado "any" con tipos específicos
	message: string;
	condition?: string;
}

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

// ==================== REFERENCIAS Y EJEMPLOS ====================
export interface NormReference {
	code: string;
	section: string;
	description: string;
	url?: string;
}

// Tipo para resultados de cálculos
export type CalculationOutput = {
	mainResult: number | string;
	additionalData?: Record<string, ParameterValue>;
	isValid: boolean;
};

export interface TemplateExample {
	name: string;
	description: string;
	inputs: ParameterValues; // Reemplazado "Record<string, any>" con tipo específico
	expectedOutput: CalculationOutput; // Reemplazado "any" con tipo específico
}

// ==================== RESULTADOS DE CÁLCULO ====================
// Tipos para gráficos
export type ChartDataPoint = {
	x: number | string;
	y: number;
	label?: string;
	color?: string;
	[key: string]: unknown; // Para propiedades adicionales específicas
};

export type ChartConfig = {
	xAxis?: {
		title?: string;
		min?: number;
		max?: number;
		tickInterval?: number;
	};
	yAxis?: {
		title?: string;
		min?: number;
		max?: number;
		tickInterval?: number;
	};
	legend?: {
		show: boolean;
		position?: "top" | "bottom" | "left" | "right";
	};
	colors?: string[];
	[key: string]: unknown; // Para configuraciones adicionales
};

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
		data: ChartDataPoint[]; // Reemplazado "any[]" con tipo específico
		config?: ChartConfig; // Reemplazado "any" con tipo específico
	}>;
}

// ==================== PLANTILLA BASE ====================
interface BaseTemplate {
	id: string;
	name: string;
	description: string;
	longDescription?: string;
	category: TemplateCategory;
	subcategory: string;
	targetProfessions: string[];
	difficulty: TemplateDifficulty;
	tags: string[];
	estimatedTime?: string;
	necReference?: string;
	parameters: TemplateParameter[];
	formula?: string;
	requirements?: string[];
	applicationCases?: string[];
	limitations?: string[];
	version: string;
	usageCount: number;
	createdAt: string;
	lastModified: string;
	isFavorite?: boolean;
}

// ==================== PLANTILLA PERSONAL ====================
export interface MyCalculationTemplate extends BaseTemplate {
	isPublic: boolean;
	isActive: boolean;
	status: TemplateStatus;
	sharedWith: string[];
	rating?: {
		min: number;
		max: number;
	};
	totalRatings?: number;
	publishedAt?: string;
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

// ==================== PLANTILLA PÚBLICA ====================
export interface PublicCalculationTemplate extends BaseTemplate {
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
	author: {
		id: string;
		name: string;
		profession?: string;
	};
	isPublic: true; // Siempre true para plantillas públicas
	isActive: boolean;
	status: string;
	sharedWith: string[];
}

// ==================== PLANTILLA LEGACY (Para compatibilidad) ====================
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

// ==================== DATOS PARA OPERACIONES ====================
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

export interface TemplateUpdateData extends Partial<TemplateCreateData> {
	version?: string;
	status?: TemplateStatus;
}

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

// ==================== FILTROS Y BÚSQUEDA ====================
export interface TemplateFilters {
	search?: string;
	category?: TemplateCategory | string | null;
	subcategory?: string | null;
	difficulty?: TemplateDifficulty | DifficultyLevel | null;
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

// ==================== RESPUESTAS DE API ====================
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

export interface TemplateValidationResponse {
	isValid: boolean;
	errors: Array<{
		type: string;
		message: string;
		field?: string;
	}>;
	warnings: Array<{
		type: string;
		message: string;
		field?: string;
	}>;
	suggestions?: string[];
}

// Tipo para valores de campos de formulario
export type FormFieldValue =
	| string
	| number
	| boolean
	| string[]
	| TemplateParameter[]
	| null;

export interface TemplateOperationResult {
	success: boolean;
	data?: unknown; // Reemplazado "any" con "unknown" para mayor seguridad
	error?: string;
	message?: string;
}

// ==================== SUGERENCIAS ====================
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

// ==================== EJECUCIÓN Y HISTORIAL ====================
export interface CalculationExecution {
	id: string;
	templateId: string;
	parameters: ParameterValues; // Reemplazado "Record<string, any>" con tipo específico
	result?: CalculationResult;
	status: "pending" | "calculating" | "completed" | "error";
	error?: string;
	startedAt: string;
	completedAt?: string;
	duration?: number;
}

export interface CalculationHistory {
	id: string;
	templateId: string;
	templateName: string;
	templateVersion: string;

	// Datos de entrada
	inputParameters: ParameterValues; // Reemplazado "Record<string, any>" con tipo específico

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

// ==================== VALIDACIÓN DE PARÁMETROS ====================
export interface ParameterValidation {
	isValid: boolean;
	errors: Record<string, string>;
	warnings: Record<string, string>;
}

// ==================== ESTADÍSTICAS ====================
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
	mostCommonInputs?: ParameterValues; // Reemplazado "Record<string, any>" con tipo específico
	errorRate?: number;
	averageCalculationTime?: number;
}

// ==================== CATEGORÍAS Y SUBCATEGORÍAS ====================
export interface TemplateSubcategory {
	id: string;
	name: string;
	description?: string;
	count: number;
	icon?: ComponentType<SVGProps<SVGSVGElement>>;
}

export interface TemplateCategoryType {
	id: TemplateCategory;
	name: string;
	description?: string;
	icon?: ComponentType<SVGProps<SVGSVGElement>>;
	color: string;
	count: number;
	subcategories?: TemplateSubcategory[];
	featured?: boolean;
}

// ==================== OPCIONES DE HOOKS ====================
export interface UseTemplateOptions {
	autoLoad?: boolean;
	defaultFilters?: TemplateFilters;
	includePublic?: boolean;
	includePersonal?: boolean;
}

// ==================== ESTADOS DE FORMULARIO ====================
export interface TemplateFormState {
	data: TemplateFormData;
	errors: Record<string, string>;
	isSubmitting: boolean;
	isDirty: boolean;
	currentStep: number;
	totalSteps: number;
}

export interface TemplateFormErrors {
	[key: string]: string;
}

// ==================== CONTEXTOS Y CONFIGURACIÓN ====================
export interface TemplateUsageContext {
	projectId?: string;
	projectName?: string;
	calculationName?: string;
	collaborators?: string[];
	shared?: boolean;
	autoSave?: boolean;
}

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

export interface TemplateWizardState {
	currentStep: "select" | "configure" | "calculate" | "results";
	selectedTemplate: CalculationTemplate | null;
	parameters: ParameterValues;
	results: CalculationResult | null;
	validation: ParameterValidation;
	isCalculating: boolean;
	history: CalculationHistory[];
}

// ==================== PROPS DE COMPONENTES ====================
export interface BaseTemplateProps {
	template: CalculationTemplate;
	onSelect?: (template: CalculationTemplate) => void;
	onPreview?: (template: CalculationTemplate) => void;
	onToggleFavorite?: (templateId: string) => void;
	className?: string;
}

export interface DisplayConfig {
	compact?: boolean;
	showPreview?: boolean;
	showFavorites?: boolean;
	showMetrics?: boolean;
	animationDelay?: number;
}

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

// ==================== CONSTANTES ====================
export const TEMPLATE_CATEGORIES: Record<
	TemplateCategory,
	TemplateCategoryType
> = {
	structural: {
		id: "structural",
		name: "Estructural",
		description: "Análisis y diseño estructural",
		color: "bg-blue-50 border-blue-200 text-blue-700",
		count: 0,
	},
	electrical: {
		id: "electrical",
		name: "Eléctrico",
		description: "Instalaciones eléctricas",
		color: "bg-yellow-50 border-yellow-200 text-yellow-700",
		count: 0,
	},
	architectural: {
		id: "architectural",
		name: "Arquitectónico",
		description: "Diseño arquitectónico",
		color: "bg-green-50 border-green-200 text-green-700",
		count: 0,
	},
	hydraulic: {
		id: "hydraulic",
		name: "Hidráulico",
		description: "Sistemas hidráulicos",
		color: "bg-cyan-50 border-cyan-200 text-cyan-700",
		count: 0,
	},
	custom: {
		id: "custom",
		name: "Personalizada",
		description: "Plantillas personalizadas",
		color: "bg-purple-50 border-purple-200 text-purple-700",
		count: 0,
	},
};

export const DEFAULT_PARAMETER_VALUES: Record<ParameterType, ParameterValue> = {
	number: 0,
	text: "",
	select: "",
	boolean: false,
	date: new Date().toISOString().split("T")[0],
};

// ==================== ALIASES PARA COMPATIBILIDAD ====================
export type Template = MyCalculationTemplate;
export type PublicTemplate = PublicCalculationTemplate;
export type Category = TemplateCategoryType;
export type Filters = TemplateFilters;
export type Result = CalculationResult;
export type Parameter = TemplateParameter;
