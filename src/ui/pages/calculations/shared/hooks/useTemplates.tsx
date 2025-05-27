// src/ui/pages/calculations/shared/hooks/useTemplates.tsx

import {useState, useEffect, useCallback, useMemo, useRef} from "react";
import {templateApplicationService} from "../../../../../core/application/ServiceFactory";
import endpoints from "../../../../../utils/endpoints";
import type {
	TemplateFilters as DomainTemplateFilters,
	PaginatedResult,
} from "../../../../../core/domain/repositories/CalculationTemplateRepository";

// IMPORTAR TIPOS EXISTENTES
import type {
	MyCalculationTemplate,
	PublicCalculationTemplate,
	CalculationTemplate as UICalculationTemplate,
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

// ==================== INTERFACES DEL HOOK ====================
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
	autoLoad: false,
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
const convertBackendToMyTemplate = (
	backendData: any
): MyCalculationTemplate => {
	const thirtyDaysAgo = new Date();
	thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
	const isNew = backendData.createdAt
		? new Date(backendData.createdAt) > thirtyDaysAgo
		: false;

	// Función para obtener la dificultad basada en el tipo y parámetros
	const getDifficultyFromTemplate = (
		template: any
	): "basic" | "intermediate" | "advanced" => {
		if (template.difficulty) {
			return template.difficulty;
		}

		const paramCount = template.parameters?.length || 0;
		const isComplexType = ["foundation", "structural", "electrical"].includes(
			template.type
		);

		if (paramCount <= 3 && !isComplexType) return "basic";
		if (paramCount <= 8 || !isComplexType) return "intermediate";
		return "advanced";
	};

	// Función para estimar tiempo basado en la dificultad y parámetros
	const getEstimatedTimeFromTemplate = (template: any): string => {
		if (template.estimatedTime) {
			return template.estimatedTime.toString();
		}

		const difficulty = getDifficultyFromTemplate(template);

		if (difficulty === "basic") return "5-10 min";
		if (difficulty === "intermediate") return "10-20 min";
		return "20-30 min";
	};

	// Convertir parámetros del backend al formato UI
	const convertParameters = (backendParams: any[]): any[] => {
		if (!Array.isArray(backendParams)) return [];

		return backendParams
			.filter((param) => param.scope === "input")
			.sort(
				(a, b) =>
					(a.display_order || a.displayOrder || 0) -
					(b.display_order || b.displayOrder || 0)
			)
			.map((param) => {
				// Parsear allowed_values si existe
				let options = undefined;
				if (param.allowed_values || param.allowedValues) {
					try {
						const allowedValuesStr =
							param.allowed_values || param.allowedValues;
						if (typeof allowedValuesStr === "string") {
							options = JSON.parse(allowedValuesStr).filter(
								(option) => option !== ""
							); // Filtrar opciones vacías
						} else if (Array.isArray(allowedValuesStr)) {
							options = allowedValuesStr.filter((option) => option !== "");
						}
					} catch (e) {
						console.warn(
							`Error parsing allowed_values for parameter ${param.name}:`,
							e
						);
					}
				}

				// Determinar el tipo correcto
				let inputType = param.dataType || param.data_type || "text";
				if (inputType === "enum") {
					inputType = "select";
				}

				return {
					name: param.name,
					label: param.description || param.name, // Usar description como label principal
					type: inputType,
					unit: param.unit_of_measure || param.unitOfMeasure,
					required: param.is_required || param.isRequired || false,
					min: param.min_value || param.minValue,
					max: param.max_value || param.maxValue,
					options: options,
					defaultValue: param.default_value || param.defaultValue,
					placeholder:
						param.default_value?.toString() || param.defaultValue?.toString(),
					tooltip: param.help_text || param.helpText,
					validation:
						param.regex_pattern || param.regexPattern
							? {
									pattern: param.regex_pattern || param.regexPattern,
									message: "Formato inválido",
								}
							: undefined,
				};
			});
	};

	return {
		id: backendData.id,
		name: backendData.name,
		description: backendData.description,
		longDescription: backendData.description,
		category: backendData.type,
		subcategory: backendData.type,
		targetProfessions: backendData.targetProfession
			? [backendData.targetProfession]
			: [],
		difficulty: getDifficultyFromTemplate(backendData),
		estimatedTime: getEstimatedTimeFromTemplate(backendData),
		necReference: backendData.necReference || "NEC",
		tags: Array.isArray(backendData.tags) ? backendData.tags : [],
		isPublic: backendData.shareLevel === "public",
		parameters: convertParameters(backendData.parameters || []),
		formula: backendData.formula || "",
		requirements: [],
		applicationCases: [],
		limitations: [],
		version: backendData.version?.toString() || "1.0",
		usageCount: backendData.usageCount || 0,
		createdAt: backendData.createdAt,
		lastModified: backendData.updatedAt,
		isActive: backendData.isActive !== false,
		status: backendData.isActive ? "published" : "draft",
		sharedWith: [],
		isFavorite: false,
		author: {
			id: backendData.createdBy || "system",
			name: backendData.createdBy ? "Usuario" : "Sistema CONSTRU",
			email: backendData.createdBy ? "user@constru.com" : "system@constru.com",
		},
		contributors: [],
		totalRatings: backendData.ratingCount || 0,
		averageRating: parseFloat(backendData.averageRating || "0"),
		isNew: isNew,
	};
};

const convertBackendToPublicTemplate = (
	backendData: any
): PublicCalculationTemplate => {
	const baseTemplate = convertBackendToMyTemplate(backendData);

	return {
		...baseTemplate,
		verified: backendData.isVerified || false,
		featured: backendData.isFeatured || false,
		author: {
			id: backendData.createdBy || "system",
			name: "Sistema CONSTRU",
			email: "system@constru.com",
		},
		communityRating: {
			average: parseFloat(backendData.averageRating || "0"),
			count: backendData.ratingCount || 0,
			distribution: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0},
		},
	};
};

// ==================== CATEGORÍAS (basadas en los tipos del backend) ====================
const TEMPLATE_CATEGORIES: TemplateCategoryType[] = [
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
		id: "foundation",
		name: "Cimentaciones",
		description: "Diseño de cimentaciones",
		color: "bg-stone-50 border-stone-200 text-stone-700",
		count: 0,
	},
	{
		id: "installation",
		name: "Instalaciones",
		description: "Instalaciones hidráulicas y sanitarias",
		color: "bg-cyan-50 border-cyan-200 text-cyan-700",
		count: 0,
	},
	{
		id: "material_calculation",
		name: "Materiales",
		description: "Cálculo de materiales",
		color: "bg-green-50 border-green-200 text-green-700",
		count: 0,
	},
];

// ==================== UTILIDADES DE API ====================
const makeApiRequest = async (url: string, options: RequestInit = {}) => {
	try {
		const response = await fetch(url, {
			...options,
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				...options.headers,
			},
		});

		// Verificar si la respuesta es HTML (error de routing)
		const contentType = response.headers.get("content-type");
		if (contentType && contentType.includes("text/html")) {
			throw new Error(
				`Endpoint not found: ${url} (received HTML instead of JSON)`
			);
		}

		if (!response.ok) {
			const errorText = await response.text();
			let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

			try {
				const errorJson = JSON.parse(errorText);
				if (errorJson.message) {
					errorMessage = errorJson.message;
				}
			} catch {
				// Si no es JSON válido, usar el texto como está
				if (errorText) {
					errorMessage = errorText;
				}
			}

			throw new Error(errorMessage);
		}

		const result = await response.json();
		return result;
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
		throw new Error("Unknown API error occurred");
	}
};

// ==================== HOOK PRINCIPAL ====================
export const useTemplates = (
	options: UseTemplateOptions = {}
): UseTemplatesReturn => {
	const config = {...DEFAULT_OPTIONS, ...options};

	// Estados
	const hasLoadedInitially = useRef(false);
	const abortControllerRef = useRef<AbortController | null>(null);
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

	// Validación
	const isValid = useMemo(() => {
		if (!formState) return false;
		return (
			Object.keys(formErrors).length === 0 &&
			formState.data.name.trim() !== "" &&
			formState.data.description.trim() !== "" &&
			formState.data.category !== ""
		);
	}, [formState, formErrors]);

	// Utilidades
	const handleError = useCallback((error: unknown, context: string) => {
		console.error(`Error in ${context}:`, error);

		let message = "Error desconocido";

		if (error instanceof Error) {
			message = error.message;
		} else if (typeof error === "string") {
			message = error;
		}

		// Log adicional para debugging
		if (process.env.NODE_ENV === "development") {
			console.error("Full error details:", error);
		}

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

				const templatePayload = {
					name: data.name,
					description: data.description,
					type: data.category,
					targetProfession: data.targetProfessions[0] || "architect",
					formula: data.formula || "",
					necReference: data.necReference || "",
					shareLevel: data.isPublic ? "public" : "private",
					tags: data.tags || [],
					parameters: data.parameters || [],
				};

				const result = await makeApiRequest(
					endpoints.calculations.templates.create,
					{
						method: "POST",
						body: JSON.stringify(templatePayload),
					}
				);

				const newTemplate = convertBackendToMyTemplate(result.data);
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

				const result = await makeApiRequest(
					endpoints.calculations.templates.update(id),
					{
						method: "PUT",
						body: JSON.stringify(data),
					}
				);

				const updatedTemplate = convertBackendToMyTemplate(result.data);

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

				await makeApiRequest(endpoints.calculations.templates.delete(id), {
					method: "DELETE",
				});

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
					isPublic: false,
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
				clearError();

				const result = await makeApiRequest(
					endpoints.calculations.templates.getById(id)
				);

				if (result.success && result.data) {
					return convertBackendToMyTemplate(result.data);
				}

				return null;
			} catch (error) {
				handleError(error, "Obtener plantilla");
				return null;
			} finally {
				setLoading(false);
			}
		},
		[handleError, clearError]
	);

	const searchTemplates = useCallback(
		async (options: TemplateSearchOptions): Promise<TemplateListResponse> => {
			try {
				setLoading(true);
				clearError();

				const params = new URLSearchParams();

				if (options.query) {
					params.append("searchTerm", options.query);
				}

				if (options.filters?.category) {
					params.append("types", options.filters.category);
				}

				if (options.filters?.showOnlyVerified) {
					params.append("isVerified", "true");
				}

				const url = `${endpoints.calculations.templates.search}?${params.toString()}`;
				const result = await makeApiRequest(url);

				const convertedTemplates =
					result.data?.templates?.map(convertBackendToMyTemplate) || [];

				return {
					templates: convertedTemplates,
					pagination: result.data?.pagination || {
						page: 1,
						limit: 10,
						total: 0,
						pages: 0,
					},
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
		[handleError, clearError]
	);

	const getPublicTemplates = useCallback(
		async (options?: TemplateSearchOptions): Promise<TemplateListResponse> => {
			try {
				setLoading(true);
				clearError();

				const params = new URLSearchParams({
					isVerified: "true",
					shareLevel: "public",
				});

				if (options?.filters?.category) {
					params.append("types", options.filters.category);
				}

				const url = `${endpoints.calculations.templates.list}?${params.toString()}`;
				const result = await makeApiRequest(url);

				const convertedTemplates =
					result.data?.templates?.map(convertBackendToPublicTemplate) || [];

				return {
					templates: convertedTemplates,
					pagination: result.data?.pagination || {
						page: 1,
						limit: 10,
						total: 0,
						pages: 0,
					},
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
		[handleError, clearError]
	);

	const getMyTemplates = useCallback(
		async (options?: TemplateSearchOptions): Promise<TemplateListResponse> => {
			try {
				setLoading(true);
				clearError();

				const params = new URLSearchParams();

				if (options?.filters?.category) {
					params.append("types", options.filters.category);
				}

				const url = `${endpoints.calculations.templates.list}?${params.toString()}`;
				const result = await makeApiRequest(url);

				const convertedTemplates =
					result.data?.templates?.map(convertBackendToMyTemplate) || [];

				return {
					templates: convertedTemplates,
					pagination: result.data?.pagination || {
						page: 1,
						limit: 10,
						total: 0,
						pages: 0,
					},
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
		[handleError, clearError]
	);

	// ==================== CARGAR TEMPLATES ====================
	const refreshTemplates = useCallback(async () => {
		if (loadingRef.current) return;

		try {
			loadingRef.current = true;
			setLoading(true);
			clearError();

			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
			abortControllerRef.current = new AbortController();

			const promises = [];

			if (config.includePublic) {
				promises.push(getPublicTemplates());
			}

			if (config.includePersonal) {
				promises.push(getMyTemplates());
			}

			const results = await Promise.allSettled(promises);

			let publicResult: TemplateListResponse | null = null;
			let myResult: TemplateListResponse | null = null;

			if (
				config.includePublic &&
				results[0] &&
				results[0].status === "fulfilled"
			) {
				publicResult = results[0].value;
			}

			const personalIndex = config.includePublic ? 1 : 0;
			if (
				config.includePersonal &&
				results[personalIndex] &&
				results[personalIndex].status === "fulfilled"
			) {
				myResult = results[personalIndex].value;
			}

			if (publicResult && config.includePublic) {
				setPublicTemplates(
					publicResult.templates as PublicCalculationTemplate[]
				);
			}

			if (myResult && config.includePersonal) {
				setTemplates(myResult.templates as MyCalculationTemplate[]);
			}
		} catch (error) {
			if (error.name !== "AbortError") {
				handleError(error, "Refrescar plantillas");
			}
		} finally {
			loadingRef.current = false;
			setLoading(false);
		}
	}, [
		config.includePublic,
		config.includePersonal,
		getPublicTemplates,
		getMyTemplates,
		handleError,
		clearError,
	]);

	// ==================== RESTO DE MÉTODOS ====================
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

			return {isValid: errors.length === 0, errors, warnings};
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

			return {isValid: Object.keys(errors).length === 0, errors, warnings};
		},
		[]
	);

	// FORMULARIOS
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

	// MÉTODOS SIMPLIFICADOS
	const getSuggestions = useCallback(
		async (templateId: string): Promise<TemplateSuggestion[]> => {
			try {
				const result = await makeApiRequest(
					endpoints.calculations.templates.getSuggestions(templateId)
				);
				return result.data || [];
			} catch (error) {
				console.error("Error getting suggestions:", error);
				return [];
			}
		},
		[]
	);

	const submitSuggestion = useCallback(
		async (
			suggestion: Partial<TemplateSuggestion>
		): Promise<TemplateSuggestion> => {
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
				// Primero, intentar obtener la plantilla para validar que existe
				const template = await makeApiRequest(
					endpoints.calculations.templates.getById(templateId)
				);
				if (!template.success || !template.data) {
					throw new Error("Plantilla no encontrada");
				}

				// Ejecutar la fórmula localmente usando los datos del template
				const templateData = template.data;
				if (!templateData.formula) {
					throw new Error("La plantilla no tiene fórmula definida");
				}

				// Crear una función que evalúe la fórmula con los parámetros
				const executeFormula = (
					formula: string,
					params: Record<string, any>
				): any => {
					try {
						// Crear contexto con los parámetros
						const context = {...params};

						// Crear función que evalúe la fórmula
						const func = new Function(
							...Object.keys(context),
							`
							${formula}
							
							// Si la fórmula no retorna explícitamente, intentar capturar variables locales
							if (typeof result !== 'undefined') return result;
							
							// Capturar variables definidas en la fórmula
							const results = {};
							try {
								// Variables específicas por tipo de cálculo
								if (typeof incrementoEsfuerzoCalculado !== 'undefined') results.incrementoEsfuerzoCalculado = incrementoEsfuerzoCalculado;
								if (typeof asentamientoMetros !== 'undefined') results.asentamientoMetros = asentamientoMetros;
								if (typeof asentamientoCentimetros !== 'undefined') results.asentamientoCentimetros = asentamientoCentimetros;
								if (typeof evaluacion !== 'undefined') results.evaluacion = evaluacion;
								
								// Variables estructurales
								if (typeof maxMoment !== 'undefined') results.maxMoment = maxMoment;
								if (typeof requiredAs !== 'undefined') results.requiredAs = requiredAs;
								if (typeof barsCount !== 'undefined') results.barsCount = barsCount;
								
								// Variables eléctricas
								if (typeof demandaTotal !== 'undefined') results.demandaTotal = demandaTotal;
								if (typeof corrienteTotal !== 'undefined') results.corrienteTotal = corrienteTotal;
								
								// Variables hidráulicas
								if (typeof selectedDiameter !== 'undefined') results.selectedDiameter = selectedDiameter;
								if (typeof totalLength !== 'undefined') results.totalLength = totalLength;
								
								// Variables SPT
								if (typeof N60 !== 'undefined') results.N60 = N60;
								if (typeof N60corregido !== 'undefined') results.N60corregido = N60corregido;
								
							} catch (e) {
								console.warn('Error capturando variables:', e);
							}
							
							return results;
						`
						);

						return func.apply({}, Object.values(context));
					} catch (error) {
						console.error("Error ejecutando fórmula:", error);
						throw new Error("Error en el cálculo: " + error.message);
					}
				};

				// Ejecutar la fórmula
				const calculationResults = executeFormula(
					templateData.formula,
					parameters
				);

				return {
					success: true,
					data: {
						templateId,
						parameters,
						results: calculationResults,
						executedAt: new Date().toISOString(),
					},
				};
			} catch (error) {
				console.error("Error executing template:", error);
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
			return [];
		},
		[]
	);

	// UTILIDADES PARA COMPATIBILIDAD
	const getFilteredTemplates = useCallback(
		(filters?: UITemplateFilters): UICalculationTemplate[] => {
			const allTemplates = [...templates, ...publicTemplates];
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
				// Intentar usar el endpoint de favoritos si existe
				try {
					const result = await makeApiRequest(
						endpoints.calculations.templates.toggleFavorite(templateId),
						{
							method: "POST",
						}
					);

					const newIsFavorite = result.data?.isFavorite || false;

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
				} catch (apiError) {
					// Fallback a localStorage si el endpoint no existe
					console.warn(
						"Favorites endpoint not available, using localStorage fallback"
					);

					const favorites = JSON.parse(
						localStorage.getItem("template_favorites") || "[]"
					);
					const isFavorite = favorites.includes(templateId);

					if (isFavorite) {
						const newFavorites = favorites.filter((id) => id !== templateId);
						localStorage.setItem(
							"template_favorites",
							JSON.stringify(newFavorites)
						);
					} else {
						favorites.push(templateId);
						localStorage.setItem(
							"template_favorites",
							JSON.stringify(favorites)
						);
					}

					const newIsFavorite = !isFavorite;
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
				}
			} catch (error) {
				handleError(error, "Toggle favorite");
			}
		},
		[handleError]
	);

	// HELPER PARA CONVERSIÓN LEGACY
	const convertToLegacyTemplate = useCallback(
		(
			template: MyCalculationTemplate | PublicCalculationTemplate
		): UICalculationTemplate => {
			const isPublic = "verified" in template;
			const usageCount = template.usageCount || 0;
			const averageRating = isPublic
				? (template as PublicCalculationTemplate).communityRating?.average || 0
				: (template as MyCalculationTemplate).averageRating || 0;

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
				icon: null,
				allowSuggestions: true,
				createdBy: template.author?.id,
				contributors: [],
				type: template.category,
				nec_reference: template.necReference,
				usage_count: usageCount,
				average_rating: averageRating,
				is_verified: isPublic
					? (template as PublicCalculationTemplate).verified
					: false,
			};
		},
		[]
	);

	// EFECTOS CONTROLADOS
	useEffect(() => {
		if (config.autoLoad && !hasLoadedInitially.current) {
			hasLoadedInitially.current = true;
			refreshTemplates();
		}

		return () => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
		};
	}, []); // Solo se ejecuta una vez al montar

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
		categories: TEMPLATE_CATEGORIES,
		isLoading: loading,

		// Utilidades
		refreshTemplates,
		clearError,
		setCurrentTemplate,
	};
};

// HOOKS ESPECÍFICOS
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
	return {searchTemplates, getPublicTemplates, getMyTemplates};
};

export default useTemplates;
