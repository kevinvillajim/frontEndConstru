// src/ui/pages/calculations/shared/hooks/useTemplates.tsx

import {useState, useEffect, useCallback, useMemo} from "react";
import {templateApplicationService} from "../../../../../core/application/ServiceFactory";
import {CalculationTemplate} from "../../../../../core/domain/models/calculations/CalculationTemplate";
import type {
	TemplateFilters as DomainTemplateFilters,
	PaginatedResult,
} from "../../../../../core/domain/repositories/CalculationTemplateRepository";

// ==================== IMPORTAR TIPOS EXISTENTES ====================
import type {
	MyCalculationTemplate,
	PublicCalculationTemplate,
	CalculationTemplate as UICalculationTemplate, // Renombrar para evitar conflicto
	TemplateCreateData,
	TemplateUpdateData,
	TemplateFilters as UITemplateFilters,
	TemplateSearchOptions,
	TemplateListResponse,
	TemplateValidationResponse,
	TemplateOperationResult,
	TemplateSuggestion,
	CalculationExecution,
	UseTemplateOptions,
	TemplateFormState,
	TemplateFormErrors,
	TemplateStats,
	TemplateCategoryType,
	ParameterValidation,
	ParameterValues,
	FormFieldValue,
} from "../types/template.types";

// ==================== INTERFACES DEL HOOK (mantener existentes) ====================
export interface UseTemplatesReturn {
	// Estados principales
	templates: MyCalculationTemplate[];
	publicTemplates: PublicCalculationTemplate[];
	currentTemplate: MyCalculationTemplate | null;
	loading: boolean;
	error: string | null;

	// Estados de formulario
	formState: TemplateFormState | null;
	formErrors: TemplateFormErrors;
	isDirty: boolean;
	isValid: boolean;

	// Operaciones CRUD
	createTemplate: (
		data: TemplateCreateData
	) => Promise<TemplateOperationResult>;
	updateTemplate: (
		id: string,
		data: TemplateUpdateData
	) => Promise<TemplateOperationResult>;
	deleteTemplate: (id: string) => Promise<TemplateOperationResult>;
	duplicateTemplate: (
		id: string,
		newName?: string
	) => Promise<TemplateOperationResult>;

	// Búsqueda y filtrado
	searchTemplates: (
		options: TemplateSearchOptions
	) => Promise<TemplateListResponse>;
	getTemplate: (id: string) => Promise<MyCalculationTemplate | null>;
	getPublicTemplates: (
		options?: TemplateSearchOptions
	) => Promise<TemplateListResponse>;
	getMyTemplates: (
		options?: TemplateSearchOptions
	) => Promise<TemplateListResponse>;

	// Validación
	validateTemplate: (
		template: Partial<MyCalculationTemplate>
	) => Promise<TemplateValidationResponse>;
	validateParameters: (parameters: ParameterValues) => ParameterValidation;

	// Formularios
	initializeForm: (template?: MyCalculationTemplate) => void;
	updateFormField: (field: string, value: FormFieldValue) => void;
	resetForm: () => void;
	saveForm: () => Promise<TemplateOperationResult>;

	// Sugerencias
	getSuggestions: (templateId: string) => Promise<TemplateSuggestion[]>;
	submitSuggestion: (
		suggestion: Partial<TemplateSuggestion>
	) => Promise<TemplateSuggestion>;
	createSuggestion: (
		suggestion: Omit<TemplateSuggestion, "id" | "createdAt">
	) => Promise<TemplateOperationResult>;
	voteSuggestion: (
		suggestionId: string,
		vote: "up" | "down"
	) => Promise<TemplateOperationResult>;

	// Ejecución
	executeTemplate: (
		templateId: string,
		parameters: ParameterValues
	) => Promise<TemplateOperationResult>;
	getExecutionHistory: (templateId?: string) => Promise<CalculationExecution[]>;

	// Utilidades para compatibilidad con CalculationTemplate (legacy)
	getFilteredTemplates: (
		filters?: UITemplateFilters
	) => UICalculationTemplate[];
	getTemplateStats: (templates: UICalculationTemplate[]) => TemplateStats;
	getRelatedTemplates: (
		templateId: string,
		limit?: number
	) => UICalculationTemplate[];
	toggleFavorite: (templateId: string) => void;
	categories: TemplateCategoryType[];
	isLoading: boolean;

	// Utilidades
	refreshTemplates: () => Promise<void>;
	clearError: () => void;
	setCurrentTemplate: (template: MyCalculationTemplate | null) => void;
}

// ==================== CONFIGURACIÓN ====================
const DEFAULT_OPTIONS: UseTemplateOptions = {
	autoLoad: true,
	defaultFilters: {},
	includePublic: true,
	includePersonal: true,
};

const INITIAL_FORM_STATE: TemplateFormState = {
	data: {
		name: "",
		description: "",
		longDescription: "",
		category: "",
		subcategory: "",
		targetProfessions: [],
		difficulty: "basic",
		estimatedTime: "",
		necReference: "",
		tags: [],
		isPublic: false,
		parameters: [],
		formula: "",
		requirements: [],
		applicationCases: [],
		limitations: [],
	},
	errors: {},
	isSubmitting: false,
	isDirty: false,
	currentStep: 0,
	totalSteps: 5,
};

// ==================== CONVERSIÓN DE TIPOS ====================
/**
 * Convierte Domain CalculationTemplate a UI MyCalculationTemplate
 */
const convertDomainToMyTemplate = (
	domain: CalculationTemplate
): MyCalculationTemplate => {
	// Calcular si es nuevo (últimos 30 días)
	const thirtyDaysAgo = new Date();
	thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
	const isNew = domain.createdAt > thirtyDaysAgo;

	return {
		id: domain.id,
		name: domain.name,
		description: domain.description,
		longDescription: domain.description, // Fallback
		category: domain.type, // Mapear type a category
		subcategory: domain.type,
		targetProfessions: domain.targetProfession ? [domain.targetProfession] : [],
		difficulty: domain.getDifficultyLevel(),
		estimatedTime: domain.getEstimatedTime(),
		necReference: domain.necReference,
		tags: domain.tags || [],
		isPublic: domain.isPublic(),
		parameters: domain.parameters || [],
		formula: domain.formula || "",
		requirements: [], // No existe en DB, array vacío
		applicationCases: [], // No existe en DB, array vacío
		limitations: [], // No existe en DB, array vacío
		version: domain.version,
		usageCount: domain.usageCount,
		createdAt: domain.createdAt.toISOString(),
		lastModified: domain.updatedAt.toISOString(),
		isActive: domain.isActive,
		status: domain.isActive ? "published" : "draft",
		sharedWith: [], // No existe en DB, array vacío
		isFavorite: false, // Por defecto false, se carga después
		author: {
			id: domain.createdBy || "unknown",
			name: "Usuario",
			email: "user@example.com",
		},
		contributors: [], // No existe en DB, array vacío
		totalRatings: domain.ratingCount,
		averageRating: domain.averageRating,
		isNew: isNew,
	};
};

/**
 * Convierte Domain CalculationTemplate a UI PublicCalculationTemplate
 */
const convertDomainToPublicTemplate = (
	domain: CalculationTemplate
): PublicCalculationTemplate => {
	// Calcular si es nuevo (últimos 30 días)
	const thirtyDaysAgo = new Date();
	thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
	const isNew = domain.createdAt > thirtyDaysAgo;

	return {
		id: domain.id,
		name: domain.name,
		description: domain.description,
		category: domain.type, // Mapear type a category
		subcategory: domain.type,
		targetProfessions: domain.targetProfession ? [domain.targetProfession] : [],
		difficulty: domain.getDifficultyLevel(),
		estimatedTime: domain.getEstimatedTime(),
		necReference: domain.necReference,
		tags: domain.tags || [],
		parameters: domain.parameters || [],
		version: domain.version,
		usageCount: domain.usageCount,
		createdAt: domain.createdAt.toISOString(),
		lastModified: domain.updatedAt.toISOString(),
		verified: domain.isVerified,
		featured: domain.isFeatured,
		author: {
			id: domain.createdBy || "unknown",
			name: "Sistema CONSTRU",
			email: "system@constru.com",
		},
		communityRating: {
			average: domain.averageRating,
			count: domain.ratingCount,
			distribution: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}, // No existe en DB, valores por defecto
		},
		isFavorite: false, // Por defecto false, se carga después
		isNew: isNew,
	};
};

/**
 * Convierte UI filters a Domain filters
 */
const convertUIFiltersToDomain = (
	uiFilters?: UITemplateFilters
): DomainTemplateFilters => {
	if (!uiFilters) return {};

	return {
		searchTerm: uiFilters.searchTerm || undefined,
		type: uiFilters.category || undefined,
		targetProfession: uiFilters.targetProfession || undefined,
		isVerified: uiFilters.showOnlyVerified,
		isFeatured: uiFilters.showOnlyFeatured,
		isActive: true, // Solo templates activos
		tags: uiFilters.tags || undefined,
		difficulty: uiFilters.difficulty || undefined,
		sortBy:
			uiFilters.sortBy === "popular"
				? "usage_count"
				: uiFilters.sortBy === "rating"
					? "average_rating"
					: uiFilters.sortBy === "recent"
						? "created_at"
						: uiFilters.sortBy === "name"
							? "name"
							: "usage_count",
		sortOrder: "DESC",
		limit: 50,
	};
};

// ==================== CATEGORÍAS MOCK ====================
const MOCK_CATEGORIES: TemplateCategoryType[] = [
	{
		id: "structural",
		name: "Estructural",
		description: "Análisis y diseño estructural",
		color: "bg-blue-50 border-blue-200 text-blue-700",
		count: 15,
	},
	{
		id: "electrical",
		name: "Eléctrico",
		description: "Instalaciones eléctricas",
		color: "bg-yellow-50 border-yellow-200 text-yellow-700",
		count: 12,
	},
	{
		id: "architectural",
		name: "Arquitectónico",
		description: "Diseño arquitectónico",
		color: "bg-green-50 border-green-200 text-green-700",
		count: 8,
	},
	{
		id: "hydraulic",
		name: "Hidráulico",
		description: "Sistemas hidráulicos",
		color: "bg-cyan-50 border-cyan-200 text-cyan-700",
		count: 6,
	},
	{
		id: "custom",
		name: "Personalizada",
		description: "Plantillas personalizadas",
		color: "bg-purple-50 border-purple-200 text-purple-700",
		count: 3,
	},
];

// ==================== HOOK PRINCIPAL ====================
export const useTemplates = (
	options: UseTemplateOptions = {}
): UseTemplatesReturn => {
	const config = {...DEFAULT_OPTIONS, ...options};

	// ==================== ESTADOS ====================
	const [templates, setTemplates] = useState<MyCalculationTemplate[]>([]);
	const [publicTemplates, setPublicTemplates] = useState<
		PublicCalculationTemplate[]
	>([]);
	const [currentTemplate, setCurrentTemplate] =
		useState<MyCalculationTemplate | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Estados de formulario
	const [formState, setFormState] = useState<TemplateFormState | null>(null);
	const [formErrors, setFormErrors] = useState<TemplateFormErrors>({});
	const [isDirty, setIsDirty] = useState(false);
	const [originalFormState, setOriginalFormState] =
		useState<TemplateFormState | null>(null);

	// ==================== VALIDACIÓN ====================
	const isValid = useMemo(() => {
		if (!formState) return false;
		return (
			Object.keys(formErrors).length === 0 &&
			formState.data.name.trim() !== "" &&
			formState.data.description.trim() !== "" &&
			formState.data.category !== ""
		);
	}, [formState, formErrors]);

	// ==================== UTILIDADES ====================
	const handleError = useCallback((error: unknown, context: string) => {
		console.error(`Error in ${context}:`, error);
		const message =
			error instanceof Error
				? error.message
				: typeof error === "string"
					? error
					: "Error desconocido";
		setError(`${context}: ${message}`);
	}, []);

	const clearError = useCallback(() => {
		setError(null);
	}, []);

	// ==================== OPERACIONES CRUD ====================
	const createTemplate = useCallback(
		async (data: TemplateCreateData): Promise<TemplateOperationResult> => {
			try {
				setLoading(true);
				clearError();

				// Crear CalculationTemplate domain object
				const domainTemplate = new CalculationTemplate(
					"", // ID se genera en el backend
					data.name,
					data.description,
					data.category,
					data.targetProfessions[0] || "architect",
					data.formula || "",
					data.necReference || "",
					"1.0.0",
					data.parameters || [],
					true, // isActive
					false, // isVerified (nuevas plantillas no están verificadas)
					false, // isFeatured
					0, // usageCount
					0, // averageRating
					0, // ratingCount
					data.isPublic ? "public" : "private",
					data.tags || []
				);

				const result =
					await templateApplicationService.createTemplate(domainTemplate);
				const newTemplate = convertDomainToMyTemplate(result);

				setTemplates((prev) => [newTemplate, ...prev]);

				return {success: true, data: newTemplate};
			} catch (error) {
				handleError(error, "Crear plantilla");
				return {
					success: false,
					error:
						error instanceof Error ? error.message : "Error al crear plantilla",
				};
			} finally {
				setLoading(false);
			}
		},
		[handleError, clearError]
	);

	const updateTemplate = useCallback(
		async (
			id: string,
			data: TemplateUpdateData
		): Promise<TemplateOperationResult> => {
			try {
				setLoading(true);
				clearError();

				const result = await templateApplicationService.updateTemplate(
					id,
					data
				);
				const updatedTemplate = convertDomainToMyTemplate(result);

				setTemplates((prev) =>
					prev.map((t) => (t.id === id ? updatedTemplate : t))
				);

				if (currentTemplate?.id === id) {
					setCurrentTemplate(updatedTemplate);
				}

				return {success: true, data: updatedTemplate};
			} catch (error) {
				handleError(error, "Actualizar plantilla");
				return {
					success: false,
					error:
						error instanceof Error
							? error.message
							: "Error al actualizar plantilla",
				};
			} finally {
				setLoading(false);
			}
		},
		[currentTemplate, handleError, clearError]
	);

	const deleteTemplate = useCallback(
		async (id: string): Promise<TemplateOperationResult> => {
			try {
				setLoading(true);
				clearError();

				await templateApplicationService.deleteTemplate(id);

				setTemplates((prev) => prev.filter((t) => t.id !== id));

				if (currentTemplate?.id === id) {
					setCurrentTemplate(null);
				}

				return {success: true};
			} catch (error) {
				handleError(error, "Eliminar plantilla");
				return {
					success: false,
					error:
						error instanceof Error
							? error.message
							: "Error al eliminar plantilla",
				};
			} finally {
				setLoading(false);
			}
		},
		[currentTemplate, handleError, clearError]
	);

	const duplicateTemplate = useCallback(
		async (id: string, newName?: string): Promise<TemplateOperationResult> => {
			try {
				const original = templates.find((t) => t.id === id);
				if (!original) {
					return {success: false, error: "Plantilla no encontrada"};
				}

				const duplicateData: TemplateCreateData = {
					name: newName || `${original.name} (Copia)`,
					description: original.description,
					longDescription: original.longDescription,
					category: original.category,
					subcategory: original.subcategory,
					targetProfessions: original.targetProfessions,
					difficulty: original.difficulty,
					estimatedTime: original.estimatedTime,
					necReference: original.necReference,
					tags: original.tags,
					isPublic: false, // Las copias no son públicas por defecto
					parameters: original.parameters,
					formula: original.formula,
					requirements: original.requirements,
					applicationCases: original.applicationCases,
					limitations: original.limitations,
				};

				return await createTemplate(duplicateData);
			} catch (error) {
				return {
					success: false,
					error:
						error instanceof Error
							? error.message
							: "Error al duplicar plantilla",
				};
			}
		},
		[templates, createTemplate]
	);

	// ==================== BÚSQUEDA Y FILTRADO ====================
	const getTemplate = useCallback(
		async (id: string): Promise<MyCalculationTemplate | null> => {
			try {
				setLoading(true);
				const domainTemplate =
					await templateApplicationService.getTemplateById(id);

				if (domainTemplate) {
					return convertDomainToMyTemplate(domainTemplate);
				}

				return null;
			} catch (error) {
				handleError(error, "Obtener plantilla");
				return null;
			} finally {
				setLoading(false);
			}
		},
		[handleError]
	);

	const searchTemplates = useCallback(
		async (options: TemplateSearchOptions): Promise<TemplateListResponse> => {
			try {
				setLoading(true);
				const domainFilters = convertUIFiltersToDomain(options.filters);

				if (options.query) {
					domainFilters.searchTerm = options.query;
				}

				const result = await templateApplicationService.searchTemplates(
					options.query || "",
					domainFilters
				);

				const convertedTemplates = result.data.map(convertDomainToMyTemplate);

				return {
					templates: convertedTemplates,
					pagination: result.pagination,
					filters: options.filters || {},
				};
			} catch (error) {
				handleError(error, "Buscar plantillas");
				return {
					templates: [],
					pagination: {page: 1, limit: 10, total: 0, pages: 0},
					filters: {},
				};
			} finally {
				setLoading(false);
			}
		},
		[handleError]
	);

	const getPublicTemplates = useCallback(
		async (options?: TemplateSearchOptions): Promise<TemplateListResponse> => {
			try {
				setLoading(true);
				const domainFilters: DomainTemplateFilters = {
					...convertUIFiltersToDomain(options?.filters),
					shareLevel: "public",
					isVerified: true, // Solo plantillas públicas verificadas
				};

				const result =
					await templateApplicationService.getTemplates(domainFilters);
				const convertedTemplates = result.data.map(
					convertDomainToPublicTemplate
				);

				return {
					templates: convertedTemplates,
					pagination: result.pagination,
					filters: options?.filters || {},
				};
			} catch (error) {
				handleError(error, "Obtener plantillas públicas");
				return {
					templates: [],
					pagination: {page: 1, limit: 10, total: 0, pages: 0},
					filters: {},
				};
			} finally {
				setLoading(false);
			}
		},
		[handleError]
	);

	const getMyTemplates = useCallback(
		async (options?: TemplateSearchOptions): Promise<TemplateListResponse> => {
			try {
				setLoading(true);
				const domainFilters: DomainTemplateFilters = {
					...convertUIFiltersToDomain(options?.filters),
					// createdBy se obtendría del contexto de auth
					// createdBy: currentUserId
				};

				const result =
					await templateApplicationService.getTemplates(domainFilters);
				const convertedTemplates = result.data.map(convertDomainToMyTemplate);

				return {
					templates: convertedTemplates,
					pagination: result.pagination,
					filters: options?.filters || {},
				};
			} catch (error) {
				handleError(error, "Obtener mis plantillas");
				return {
					templates: [],
					pagination: {page: 1, limit: 10, total: 0, pages: 0},
					filters: {},
				};
			} finally {
				setLoading(false);
			}
		},
		[handleError]
	);

	// ==================== CARGAR TEMPLATES ====================
	const refreshTemplates = useCallback(async () => {
		if (!config.autoLoad) return;

		try {
			setLoading(true);
			clearError();

			// Cargar plantillas en paralelo
			const [publicResult, myResult] = await Promise.all([
				config.includePublic
					? getPublicTemplates()
					: Promise.resolve({
							templates: [],
							pagination: {page: 1, limit: 10, total: 0, pages: 0},
							filters: {},
						}),
				config.includePersonal
					? getMyTemplates()
					: Promise.resolve({
							templates: [],
							pagination: {page: 1, limit: 10, total: 0, pages: 0},
							filters: {},
						}),
			]);

			if (config.includePublic) {
				setPublicTemplates(
					publicResult.templates as PublicCalculationTemplate[]
				);
			}

			if (config.includePersonal) {
				setTemplates(myResult.templates as MyCalculationTemplate[]);
			}
		} catch (error) {
			handleError(error, "Refrescar plantillas");
		} finally {
			setLoading(false);
		}
	}, [config, getPublicTemplates, getMyTemplates, handleError, clearError]);

	// ==================== RESTO DE MÉTODOS (implementación simplificada) ====================
	const validateTemplate = useCallback(
		async (
			template: Partial<MyCalculationTemplate>
		): Promise<TemplateValidationResponse> => {
			const errors: Array<{type: string; message: string; field?: string}> = [];
			const warnings: Array<{type: string; message: string; field?: string}> =
				[];

			if (!template.name?.trim()) {
				errors.push({
					type: "required",
					message: "El nombre es requerido",
					field: "name",
				});
			}

			if (!template.description?.trim()) {
				errors.push({
					type: "required",
					message: "La descripción es requerida",
					field: "description",
				});
			}

			if (!template.category) {
				errors.push({
					type: "required",
					message: "La categoría es requerida",
					field: "category",
				});
			}

			return {
				isValid: errors.length === 0,
				errors,
				warnings,
			};
		},
		[]
	);

	const validateParameters = useCallback(
		(parameters: ParameterValues): ParameterValidation => {
			const errors: Record<string, string> = {};
			const warnings: Record<string, string> = {};

			if (!parameters || typeof parameters !== "object") {
				errors.general = "Parámetros inválidos";
			}

			return {
				isValid: Object.keys(errors).length === 0,
				errors,
				warnings,
			};
		},
		[]
	);

	// ==================== FORMULARIOS ====================
	const initializeForm = useCallback((template?: MyCalculationTemplate) => {
		const initialState: TemplateFormState = template
			? {
					data: {
						name: template.name,
						description: template.description,
						longDescription: template.longDescription || "",
						category: template.category,
						subcategory: template.subcategory,
						targetProfessions: template.targetProfessions,
						difficulty: template.difficulty,
						estimatedTime: template.estimatedTime || "",
						necReference: template.necReference || "",
						tags: template.tags,
						isPublic: template.isPublic,
						parameters: template.parameters,
						formula: template.formula || "",
						requirements: template.requirements || [],
						applicationCases: template.applicationCases || [],
						limitations: template.limitations || [],
					},
					errors: {},
					isSubmitting: false,
					isDirty: false,
					currentStep: 0,
					totalSteps: 5,
				}
			: INITIAL_FORM_STATE;

		setFormState(initialState);
		setOriginalFormState(JSON.parse(JSON.stringify(initialState)));
		setFormErrors({});
		setIsDirty(false);
	}, []);

	const updateFormField = useCallback(
		(field: string, value: FormFieldValue) => {
			if (!formState) return;

			setFormState((prev) => {
				if (!prev) return prev;

				const keys = field.split(".");
				const newState = JSON.parse(JSON.stringify(prev));

				let current = newState;
				for (let i = 0; i < keys.length - 1; i++) {
					current = current[keys[i]];
				}
				current[keys[keys.length - 1]] = value;

				return newState;
			});

			setIsDirty(true);
		},
		[formState]
	);

	const resetForm = useCallback(() => {
		if (originalFormState) {
			setFormState(JSON.parse(JSON.stringify(originalFormState)));
			setFormErrors({});
			setIsDirty(false);
		}
	}, [originalFormState]);

	const saveForm = useCallback(async (): Promise<TemplateOperationResult> => {
		if (!formState) {
			return {success: false, error: "No hay datos para guardar"};
		}

		const templateData: TemplateCreateData = formState.data;
		const result = await createTemplate(templateData);

		if (result.success) {
			setIsDirty(false);
			setOriginalFormState(JSON.parse(JSON.stringify(formState)));
		}

		return result;
	}, [formState, createTemplate]);

	// ==================== MÉTODOS SIMPLIFICADOS ====================
	const getSuggestions = useCallback(
		async (templateId: string): Promise<TemplateSuggestion[]> => {
			// Implementación simplificada - en el futuro conectar con API
			return [];
		},
		[]
	);

	const submitSuggestion = useCallback(
		async (
			suggestion: Partial<TemplateSuggestion>
		): Promise<TemplateSuggestion> => {
			// Implementación simplificada
			throw new Error("No implementado aún");
		},
		[]
	);

	const createSuggestion = useCallback(
		async (
			suggestion: Omit<TemplateSuggestion, "id" | "createdAt">
		): Promise<TemplateOperationResult> => {
			return {success: false, error: "No implementado aún"};
		},
		[]
	);

	const voteSuggestion = useCallback(
		async (
			suggestionId: string,
			vote: "up" | "down"
		): Promise<TemplateOperationResult> => {
			return {success: false, error: "No implementado aún"};
		},
		[]
	);

	const executeTemplate = useCallback(
		async (
			templateId: string,
			parameters: ParameterValues
		): Promise<TemplateOperationResult> => {
			try {
				const result = await templateApplicationService.executeCalculation(
					templateId,
					parameters
				);
				return {success: true, data: result};
			} catch (error) {
				return {
					success: false,
					error:
						error instanceof Error
							? error.message
							: "Error al ejecutar plantilla",
				};
			}
		},
		[]
	);

	const getExecutionHistory = useCallback(
		async (templateId?: string): Promise<CalculationExecution[]> => {
			// Implementación simplificada
			return [];
		},
		[]
	);

	// ==================== UTILIDADES PARA COMPATIBILIDAD ====================
	const getFilteredTemplates = useCallback(
		(filters?: UITemplateFilters): UICalculationTemplate[] => {
			// Convertir templates a formato legacy para compatibilidad
			const allTemplates = [...templates, ...publicTemplates];

			// Aplicar filtros
			let filtered = allTemplates;

			if (filters?.searchTerm) {
				filtered = filtered.filter(
					(template) =>
						template.name
							.toLowerCase()
							.includes(filters.searchTerm!.toLowerCase()) ||
						template.description
							.toLowerCase()
							.includes(filters.searchTerm!.toLowerCase())
				);
			}

			if (filters?.category) {
				filtered = filtered.filter(
					(template) => template.category === filters.category
				);
			}

			if (filters?.difficulty) {
				filtered = filtered.filter(
					(template) => template.difficulty === filters.difficulty
				);
			}

			if (filters?.showOnlyFavorites) {
				filtered = filtered.filter((template) => template.isFavorite);
			}

			if (filters?.showOnlyVerified) {
				filtered = filtered.filter((template) =>
					"verified" in template ? template.verified : false
				);
			}

			// Convertir a formato legacy UICalculationTemplate
			return filtered.map(convertToLegacyTemplate);
		},
		[templates, publicTemplates]
	);

	const getTemplateStats = useCallback(
		(templates: UICalculationTemplate[]): TemplateStats => {
			return {
				total: templates.length,
				verifiedCount: templates.filter((t) => t.verified).length,
				avgRating:
					templates.reduce((sum, t) => sum + t.rating, 0) / templates.length ||
					0,
				totalUsage: templates.reduce((sum, t) => sum + t.usageCount, 0),
				trendingCount: templates.filter((t) => t.trending).length,
				popularCount: templates.filter((t) => t.popular).length,
			};
		},
		[]
	);

	const getRelatedTemplates = useCallback(
		(templateId: string, limit: number = 5): UICalculationTemplate[] => {
			const template = [...templates, ...publicTemplates].find(
				(t) => t.id === templateId
			);
			if (!template) return [];

			const related = [...templates, ...publicTemplates]
				.filter((t) => t.id !== templateId && t.category === template.category)
				.slice(0, limit);

			return related.map(convertToLegacyTemplate);
		},
		[templates, publicTemplates]
	);

	const toggleFavorite = useCallback(
		async (templateId: string) => {
			try {
				// Usar el service para toggle favorite
				const newIsFavorite = await templateApplicationService.toggleFavorite(
					"current-user",
					templateId
				);

				// Actualizar estado local
				setTemplates((prev) =>
					prev.map((t) =>
						t.id === templateId ? {...t, isFavorite: newIsFavorite} : t
					)
				);

				setPublicTemplates((prev) =>
					prev.map((t) =>
						t.id === templateId ? {...t, isFavorite: newIsFavorite} : t
					)
				);
			} catch (error) {
				handleError(error, "Toggle favorite");
			}
		},
		[handleError]
	);

	// ==================== HELPER PARA CONVERSIÓN LEGACY ====================
	const convertToLegacyTemplate = useCallback(
		(
			template: MyCalculationTemplate | PublicCalculationTemplate
		): UICalculationTemplate => {
			const isPublic = "verified" in template;

			// Función para obtener color basado en categoría
			const getCategoryColor = (category: string) => {
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

			// Calcular campos derivados
			const usageCount = template.usageCount || 0;
			const averageRating = isPublic
				? (template as PublicCalculationTemplate).communityRating?.average || 0
				: (template as MyCalculationTemplate).averageRating || 0;

			// Calcular trending y popular
			const isPopular = usageCount > 100;
			const isTrending = usageCount > 50 && averageRating > 4.0;

			return {
				id: template.id,
				name: template.name,
				description: template.description,
				version: template.version,
				category: template.category,
				subcategory: template.subcategory,
				profession: template.targetProfessions || [],
				tags: template.tags || [],
				difficulty: template.difficulty,
				estimatedTime: template.estimatedTime,
				necReference: template.necReference,
				requirements:
					"requirements" in template ? template.requirements || [] : [],
				parameters: template.parameters || [],
				verified: isPublic
					? (template as PublicCalculationTemplate).verified
					: false,
				isPublic: isPublic,
				isNew: template.isNew || false,
				trending: isTrending,
				popular: isPopular,
				rating: averageRating,
				usageCount: usageCount,
				lastUpdated: template.lastModified,
				isFavorite: template.isFavorite || false,
				color: getCategoryColor(template.category),
				icon: null, // Se maneja en TemplateCard con getCategoryIcon
				allowSuggestions: true,
				createdBy: template.author?.id,
				contributors: [],
				type: template.category, // Agregar type para TemplateCard

				// Campos adicionales que pueden venir directamente de la API
				nec_reference: template.necReference, // Para compatibilidad
				usage_count: usageCount, // Para compatibilidad
				average_rating: averageRating, // Para compatibilidad
				is_verified: isPublic
					? (template as PublicCalculationTemplate).verified
					: false,
			};
		},
		[]
	);

	// ==================== EFECTOS ====================
	useEffect(() => {
		if (config.autoLoad) {
			refreshTemplates();
		}
	}, [config.autoLoad, refreshTemplates]);

	// ==================== RETORNO ====================
	return {
		// Estados principales
		templates,
		publicTemplates,
		currentTemplate,
		loading,
		error,

		// Estados de formulario
		formState,
		formErrors,
		isDirty,
		isValid,

		// Operaciones CRUD
		createTemplate,
		updateTemplate,
		deleteTemplate,
		duplicateTemplate,

		// Búsqueda y filtrado
		searchTemplates,
		getTemplate,
		getPublicTemplates,
		getMyTemplates,

		// Validación
		validateTemplate,
		validateParameters,

		// Formularios
		initializeForm,
		updateFormField,
		resetForm,
		saveForm,

		// Sugerencias
		getSuggestions,
		submitSuggestion,
		createSuggestion,
		voteSuggestion,

		// Ejecución
		executeTemplate,
		getExecutionHistory,

		// Utilidades para compatibilidad
		getFilteredTemplates,
		getTemplateStats,
		getRelatedTemplates,
		toggleFavorite,
		categories: MOCK_CATEGORIES,
		isLoading: loading,

		// Utilidades
		refreshTemplates,
		clearError,
		setCurrentTemplate,
	};
};

// ==================== HOOKS ESPECÍFICOS ====================
export const useTemplateForm = (template?: MyCalculationTemplate) => {
	const {
		formState,
		formErrors,
		isDirty,
		isValid,
		initializeForm,
		updateFormField,
		resetForm,
		saveForm,
	} = useTemplates();

	useEffect(() => {
		initializeForm(template);
	}, [template, initializeForm]);

	return {
		formState,
		formErrors,
		isDirty,
		isValid,
		updateFormField,
		resetForm,
		saveForm,
	};
};

export const useTemplateSearch = () => {
	const {searchTemplates, getPublicTemplates, getMyTemplates} = useTemplates();

	return {
		searchTemplates,
		getPublicTemplates,
		getMyTemplates,
	};
};

export default useTemplates;
