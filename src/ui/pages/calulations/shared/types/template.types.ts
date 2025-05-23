import type {ComponentType, SVGProps} from "react";

// Tipos básicos
export type DifficultyLevel = "basic" | "intermediate" | "advanced";
export type SortOption = "popular" | "rating" | "trending" | "recent" | "name";
export type ParameterType = "number" | "select" | "text" | "boolean" | "date";

// Parámetro de cálculo
export interface CalculationParameter {
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
	parameters: CalculationParameter[];

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

// Subcategoría de plantillas
export interface TemplateSubcategory {
	id: string;
	name: string;
	description?: string;
	count: number;
	icon?: ComponentType<SVGProps<SVGSVGElement>>;
}

// Categoría de plantillas
export interface TemplateCategory {
	id: string;
	name: string;
	description?: string;
	icon: ComponentType<SVGProps<SVGSVGElement>>;
	color: string;
	count: number;
	subcategories?: TemplateSubcategory[];
	featured?: boolean;
}

// Filtros para plantillas
export interface TemplateFilters {
	category?: string | null;
	subcategory?: string | null;
	searchTerm: string;
	sortBy?: SortOption;
	showOnlyFavorites: boolean;
	showOnlyVerified: boolean;
	difficulty?: DifficultyLevel | null;
	profession?: string[];
	rating?: {
		min: number;
		max: number;
	};
	usageCount?: {
		min: number;
		max: number;
	};
}

// Estadísticas de plantillas
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
}

// Historial de cálculos
export interface CalculationHistory {
	id: string;
	templateId: string;
	templateName: string;
	parameters: Record<string, any>;
	results: CalculationResult;
	createdAt: string;
	updatedAt?: string;
	name?: string;
	notes?: string;
	projectId?: string;
	shared?: boolean;
	tags?: string[];
}

// Sugerencia de mejora
export interface TemplateSuggestion {
	id: string;
	templateId: string;
	type: "improvement" | "bug" | "feature" | "parameter";
	title: string;
	description: string;
	priority: "low" | "medium" | "high" | "critical";
	status: "pending" | "reviewed" | "approved" | "rejected" | "implemented";
	submittedBy: string;
	submittedAt: string;
	votes?: {
		up: number;
		down: number;
		userVote?: "up" | "down";
	};
	comments?: Array<{
		id: string;
		author: string;
		content: string;
		createdAt: string;
	}>;
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

// Validación de parámetros
export interface ParameterValidation {
	isValid: boolean;
	errors: Record<string, string>;
	warnings: Record<string, string>;
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

// Tipos para el contexto de React
export interface TemplateContextValue {
	templates: CalculationTemplate[];
	categories: TemplateCategory[];
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

export interface TemplateParameter {
	id: string;
	name: string;
	label: string;
	type: "number" | "select" | "text";
	unit?: string;
	required: boolean;
	defaultValue?: string | number;
	options?: string[];
	min?: number;
	max?: number;
	placeholder?: string;
	tooltip?: string;
	typicalRange?: string;
	validation?: {
		pattern?: string;
		message?: string;
	};
}

export interface TemplateFormula {
	expression: string;
	variables: Record<string, string>;
	description?: string;
	units?: string;
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

export interface MyCalculationTemplate {
	// Identificación
	id: string;
	name: string;
	description: string;
	longDescription?: string;

	// Categorización
	category:
		| "structural"
		| "electrical"
		| "architectural"
		| "hydraulic"
		| "custom";
	subcategory: string;
	targetProfessions: string[];
	difficulty: "basic" | "intermediate" | "advanced";
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
	formula?: string | TemplateFormula;
	validation?: TemplateValidation;

	// Estado y permisos
	isPublic: boolean;
	isActive: boolean;
	isFavorite: boolean;
	status: "draft" | "active" | "archived" | "under_review";
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
		profession?: string[];
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

// Datos para crear/editar plantilla
export interface TemplateFormData {
	name: string;
	description: string;
	longDescription: string;
	category: string;
	subcategory: string;
	targetProfessions: string[];
	difficulty: "basic" | "intermediate" | "advanced";
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

// Sugerencia de cambio para plantilla
export interface TemplateSuggestion {
	id: string;
	templateId: string;
	templateName: string;
	suggestionType:
		| "formula"
		| "parameters"
		| "description"
		| "requirements"
		| "necReference"
		| "other";
	title: string;
	description: string;
	currentValue?: string;
	proposedValue?: string;
	justification: string;
	priority: "low" | "medium" | "high" | "critical";
	affectsAccuracy: boolean;
	affectsCompliance: boolean;
	references?: string[];
	contactForFollowUp: boolean;

	// Estado de la sugerencia
	status: "pending" | "approved" | "rejected" | "implemented" | "reviewed";
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
	templateId: string;
	totalUsage: number;
	uniqueUsers: number;
	averageRating: number;
	totalRatings: number;
	usageByMonth: Record<string, number>;
	mostCommonInputs: Record<string, any>;
	errorRate: number;
	averageCalculationTime: number;

	// Comparación con plantillas similares
	categoryRanking?: number;
	difficultyComparison?: {
		easier: number;
		similar: number;
		harder: number;
	};
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
	status?: ("draft" | "active" | "archived")[];
	favorites?: boolean;
	sortBy?: SortOption;
	sortOrder?: "asc" | "desc";
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

// Export de tipos principales para facilitar importación
export type {
	CalculationTemplate as Template,
	TemplateCategory as Category,
	TemplateFilters as Filters,
	CalculationResult as Result,
	CalculationParameter as Parameter,
};
export type TemplateStatus = MyCalculationTemplate["status"];
export type TemplateDifficulty = MyCalculationTemplate["difficulty"];
export type TemplateCategory = MyCalculationTemplate["category"];
export type ParameterType = TemplateParameter["type"];
export type SuggestionType = TemplateSuggestion["suggestionType"];
export type SuggestionStatus = TemplateSuggestion["status"];
export type SuggestionPriority = TemplateSuggestion["priority"];