// src/ui/pages/calculations/shared/hooks/useMaterialCalculations.tsx
import {useState, useCallback} from "react";
import ApiClient from "../../../../../core/adapters/api/ApiClient";

// ===============================================
// INTERFACES PRINCIPALES
// ===============================================

export interface MaterialTemplate {
	id: string;
	name: string;
	description: string;
	type: string;
	subCategory?: string;
	formula: string;
	materialOutputs: MaterialOutput[];
	parameters: MaterialParameter[];
	wasteFactors?: WasteFactor[];
	regionalFactors?: any;
	normativeReference?: string;
	isActive: boolean;
	isVerified: boolean;
	isFeatured: boolean;
	shareLevel: string;
	createdBy?: string;
	version: number;
	usageCount: number;
	averageRating: string;
	ratingCount: number;
	tags: string[];
	createdAt: string;
	updatedAt: string;
}

export interface MaterialOutput {
	materialName: string;
	unit: string;
	description: string;
	category: string;
	isMain: boolean;
}

export interface MaterialParameter {
	id: string;
	name: string;
	description: string;
	dataType: "number" | "string" | "enum" | "boolean";
	scope: "input" | "output";
	displayOrder: number;
	isRequired: boolean;
	defaultValue?: string | number | boolean;
	minValue?: number;
	maxValue?: number;
	unitOfMeasure?: string;
	allowedValues?: string[];
	helpText?: string;
}

export interface WasteFactor {
	materialType: string;
	minWaste: number;
	averageWaste: number;
	maxWaste: number;
	conditions: string[];
}

export interface MaterialCalculationRequest {
	templateId: string;
	templateType: "official" | "user";
	inputParameters: Record<string, string | number | boolean>;
	includeWaste?: boolean;
	regionalFactors?: RegionalFactor[];
	currency?: string;
	notes?: string;
	saveResult?: boolean;
}

export interface MaterialCalculationResult {
	id: string;
	templateId: string;
	templateType: string;
	inputParameters: Record<string, string | number | boolean>;
	outputParameters?: Record<string, string | number | boolean>;
	materialQuantities: MaterialQuantity[];
	totalCost?: number;
	currency: string;
	wasteIncluded: boolean;
	executionTime: number;
	createdAt: string;
}

export interface MaterialQuantity {
	name: string;
	quantity: number;
	unit: string;
	unitPrice?: number;
	totalPrice?: number;
}

export interface RegionalFactor {
	factor: string;
	value: number;
	description?: string;
}

export interface TemplateFilters {
	searchTerm?: string;
	category?: string;
	isActive?: boolean;
	isVerified?: boolean;
	isFeatured?: boolean;
	page?: number;
	limit?: number;
}

export interface UserTemplate {
	id: string;
	name: string;
	description: string;
	type: string;
	isPublic: boolean;
	usageCount: number;
	createdAt: string;
	updatedAt: string;
}

export interface CalculationHistory {
	id: string;
	templateName: string;
	calculationName: string;
	executedAt: string;
	result: MaterialCalculationResult;
}

export interface PaginationInfo {
	total: number;
	page: number;
	limit: number;
	pages: number;
}

export interface TemplateResponse {
	templates: MaterialTemplate[];
	pagination: PaginationInfo;
}

// ===============================================
// INTERFACES PARA TRENDING Y ANALYTICS
// ===============================================

export interface MaterialTrendingTemplate extends MaterialTemplate {
	trendScore: number;
	growthRate: number;
	periodRank: number;
}

export interface MaterialCalculationType {
	concrete: number;
	steel: number;
	masonry: number;
	finishes: number;
	insulation: number;
	other: number;
}

export interface MaterialAnalytics {
	period: string;
	totalCalculations: number;
	uniqueUsers: number;
	averageExecutionTime: number;
	successRate: number;
	topTemplates: MaterialTrendingTemplate[];
	calculationsByType: MaterialCalculationType;
	calculationsByRegion: Record<string, number>;
}

// ===============================================
// HOOK PRINCIPAL - MATERIAL CALCULATIONS
// ===============================================

export const useMaterialCalculations = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const getTemplates = useCallback(
		async (filters?: TemplateFilters): Promise<MaterialTemplate[]> => {
			try {
				setIsLoading(true);
				setError(null);

				// Construir parámetros de consulta
				const params = new URLSearchParams();
				if (filters?.searchTerm)
					params.append("searchTerm", filters.searchTerm);
				if (filters?.category) params.append("types", filters.category);
				if (filters?.isActive !== undefined)
					params.append("isActive", filters.isActive.toString());
				if (filters?.isVerified !== undefined)
					params.append("isVerified", filters.isVerified.toString());
				if (filters?.isFeatured !== undefined)
					params.append("isFeatured", filters.isFeatured.toString());
				if (filters?.page) params.append("page", filters.page.toString());
				if (filters?.limit) params.append("limit", filters.limit.toString());

				// Agregar valores por defecto
				if (!params.has("isActive")) params.append("isActive", "true");
				if (!params.has("page")) params.append("page", "1");
				if (!params.has("limit")) params.append("limit", "50");

				const response = await ApiClient.get(
					`/material-calculation/templates?${params.toString()}`
				);

				console.log("API Response:", response.data); // Debug

				if (response.data.success && response.data.data) {
					// ✅ CORREGIDO: Extraer templates del objeto data
					const templates = response.data.data.templates || [];
					console.log("Extracted templates:", templates); // Debug
					return templates;
				}

				return [];
			} catch (error: unknown) {
				console.error("Error fetching material templates:", error);
				const errorMessage =
					error instanceof Error
						? error.message
						: "Error al cargar las plantillas";
				setError(errorMessage);
				return [];
			} finally {
				setIsLoading(false);
			}
		},
		[]
	);

	const getTemplate = useCallback(
		async (templateId: string): Promise<MaterialTemplate | null> => {
			try {
				setIsLoading(true);
				setError(null);

				const response = await ApiClient.get(
					`/material-calculation/templates/${templateId}`
				);

				if (response.data.success && response.data.data) {
					return response.data.data;
				}

				return null;
			} catch (error: unknown) {
				console.error("Error fetching material template:", error);
				const errorMessage =
					error instanceof Error
						? error.message
						: "Error al cargar la plantilla";
				setError(errorMessage);
				return null;
			} finally {
				setIsLoading(false);
			}
		},
		[]
	);

	const executeCalculation = useCallback(
		async (
			request: MaterialCalculationRequest
		): Promise<MaterialCalculationResult | null> => {
			try {
				setIsLoading(true);
				setError(null);

				// Asegurar que tenemos un userId (puede ser temporal para demo)
				const calculationData = {
					...request,
					userId: "demo-user-id", // En producción, esto vendría del contexto de auth
				};

				const response = await ApiClient.post(
					"/material-calculation/execute",
					calculationData
				);

				if (response.data.success && response.data.data) {
					return response.data.data;
				}

				throw new Error(
					response.data.message || "Error en la ejecución del cálculo"
				);
			} catch (error: unknown) {
				console.error("Error executing material calculation:", error);
				let errorMessage = "Error al ejecutar el cálculo";

				if (error instanceof Error) {
					errorMessage = error.message;
				} else if (
					typeof error === "object" &&
					error !== null &&
					"response" in error
				) {
					const axiosError = error as {response?: {data?: {message?: string}}};
					errorMessage = axiosError.response?.data?.message || errorMessage;
				}

				setError(errorMessage);
				return null;
			} finally {
				setIsLoading(false);
			}
		},
		[]
	);

	const getTrendingTemplates = useCallback(
		async (
			period: string = "weekly",
			limit: number = 10
		): Promise<MaterialTemplate[]> => {
			try {
				setIsLoading(true);
				setError(null);

				const response = await ApiClient.get(
					`/material-calculation/trending?period=${period}&limit=${limit}`
				);

				if (response.data.success && response.data.data) {
					return response.data.data.templates || [];
				}

				return [];
			} catch (error: unknown) {
				console.error("Error fetching trending templates:", error);
				const errorMessage =
					error instanceof Error
						? error.message
						: "Error al cargar plantillas en tendencia";
				setError(errorMessage);
				return [];
			} finally {
				setIsLoading(false);
			}
		},
		[]
	);

	const getCalculationHistory = useCallback(
		async (
			templateId?: string,
			limit: number = 10
		): Promise<MaterialCalculationResult[]> => {
			try {
				setIsLoading(true);
				setError(null);

				const params = new URLSearchParams();
				if (templateId) params.append("templateId", templateId);
				params.append("limit", limit.toString());

				const response = await ApiClient.get(
					`/material-calculation/results?${params.toString()}`
				);

				if (response.data.success && response.data.data) {
					return response.data.data;
				}

				return [];
			} catch (error: unknown) {
				console.error("Error fetching calculation history:", error);
				const errorMessage =
					error instanceof Error
						? error.message
						: "Error al cargar el historial";
				setError(errorMessage);
				return [];
			} finally {
				setIsLoading(false);
			}
		},
		[]
	);

	const saveCalculationResult = useCallback(
		async (
			resultId: string,
			name?: string,
			notes?: string
		): Promise<boolean> => {
			try {
				setIsLoading(true);
				setError(null);

				const response = await ApiClient.put(
					`/material-calculation/results/${resultId}`,
					{
						isSaved: true,
						name,
						notes,
					}
				);

				return response.data.success;
			} catch (error: unknown) {
				console.error("Error saving calculation result:", error);
				const errorMessage =
					error instanceof Error
						? error.message
						: "Error al guardar el resultado";
				setError(errorMessage);
				return false;
			} finally {
				setIsLoading(false);
			}
		},
		[]
	);

	const deleteCalculationResult = useCallback(
		async (resultId: string): Promise<boolean> => {
			try {
				setIsLoading(true);
				setError(null);

				const response = await ApiClient.delete(
					`/material-calculation/results/${resultId}`
				);

				return response.data.success;
			} catch (error: unknown) {
				console.error("Error deleting calculation result:", error);
				const errorMessage =
					error instanceof Error
						? error.message
						: "Error al eliminar el resultado";
				setError(errorMessage);
				return false;
			} finally {
				setIsLoading(false);
			}
		},
		[]
	);

	const getTemplateAnalytics = useCallback(
		async (
			templateId: string,
			period?: string
		): Promise<Record<string, unknown> | null> => {
			try {
				setIsLoading(true);
				setError(null);

				const params = period ? `?period=${period}` : "";
				const response = await ApiClient.get(
					`/material-calculation/templates/${templateId}/analytics${params}`
				);

				if (response.data.success && response.data.data) {
					return response.data.data;
				}

				return null;
			} catch (error: unknown) {
				console.error("Error fetching template analytics:", error);
				const errorMessage =
					error instanceof Error ? error.message : "Error al cargar analytics";
				setError(errorMessage);
				return null;
			} finally {
				setIsLoading(false);
			}
		},
		[]
	);

	return {
		// Estados
		isLoading,
		error,

		// Métodos para plantillas
		getTemplates,
		getTemplate,
		getTrendingTemplates,
		getTemplateAnalytics,

		// Métodos para cálculos
		executeCalculation,
		getCalculationHistory,
		saveCalculationResult,
		deleteCalculationResult,

		// Método para limpiar errores
		clearError: () => setError(null),
	};
};

// ===============================================
// HOOK PARA PLANTILLAS DE USUARIO
// ===============================================

export const useMaterialTemplates = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const getUserTemplates = useCallback(async (): Promise<UserTemplate[]> => {
		try {
			setIsLoading(true);
			setError(null);

			const response = await ApiClient.get("/user-material-templates");

			if (response.data.success && response.data.data) {
				return response.data.data;
			}

			return [];
		} catch (error: unknown) {
			console.error("Error fetching user templates:", error);
			const errorMessage =
				error instanceof Error
					? error.message
					: "Error al cargar plantillas del usuario";
			setError(errorMessage);
			return [];
		} finally {
			setIsLoading(false);
		}
	}, []);

	const createTemplate = useCallback(
		async (
			templateData: Partial<UserTemplate>
		): Promise<UserTemplate | null> => {
			try {
				setIsLoading(true);
				setError(null);

				const response = await ApiClient.post(
					"/user-material-templates",
					templateData
				);

				if (response.data.success && response.data.data) {
					return response.data.data;
				}

				return null;
			} catch (error: unknown) {
				console.error("Error creating template:", error);
				const errorMessage =
					error instanceof Error
						? error.message
						: "Error al crear la plantilla";
				setError(errorMessage);
				return null;
			} finally {
				setIsLoading(false);
			}
		},
		[]
	);

	const updateTemplate = useCallback(
		async (
			id: string,
			templateData: Partial<UserTemplate>
		): Promise<boolean> => {
			try {
				setIsLoading(true);
				setError(null);

				const response = await ApiClient.put(
					`/user-material-templates/${id}`,
					templateData
				);

				return response.data.success;
			} catch (error: unknown) {
				console.error("Error updating template:", error);
				const errorMessage =
					error instanceof Error
						? error.message
						: "Error al actualizar la plantilla";
				setError(errorMessage);
				return false;
			} finally {
				setIsLoading(false);
			}
		},
		[]
	);

	const deleteTemplate = useCallback(async (id: string): Promise<boolean> => {
		try {
			setIsLoading(true);
			setError(null);

			const response = await ApiClient.delete(`/user-material-templates/${id}`);

			return response.data.success;
		} catch (error: unknown) {
			console.error("Error deleting template:", error);
			const errorMessage =
				error instanceof Error
					? error.message
					: "Error al eliminar la plantilla";
			setError(errorMessage);
			return false;
		} finally {
			setIsLoading(false);
		}
	}, []);

	return {
		isLoading,
		error,
		getUserTemplates,
		createTemplate,
		updateTemplate,
		deleteTemplate,
		clearError: () => setError(null),
	};
};

// ===============================================
// HOOK PARA RESULTADOS
// ===============================================

export const useMaterialResults = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [results, setResults] = useState<CalculationHistory[]>([]);

	const getResults = useCallback(async (): Promise<CalculationHistory[]> => {
		try {
			setIsLoading(true);
			setError(null);

			const response = await ApiClient.get("/material-calculation/results");

			if (response.data.success && response.data.data) {
				const resultsData = response.data.data;
				setResults(resultsData);
				return resultsData;
			}

			setResults([]);
			return [];
		} catch (error: unknown) {
			console.error("Error fetching results:", error);
			const errorMessage =
				error instanceof Error
					? error.message
					: "Error al cargar los resultados";
			setError(errorMessage);
			setResults([]);
			return [];
		} finally {
			setIsLoading(false);
		}
	}, []);

	const getResult = useCallback(
		async (id: string): Promise<MaterialCalculationResult | null> => {
			try {
				setIsLoading(true);
				setError(null);

				const response = await ApiClient.get(
					`/material-calculation/results/${id}`
				);

				if (response.data.success && response.data.data) {
					return response.data.data;
				}

				return null;
			} catch (error: unknown) {
				console.error("Error fetching result:", error);
				const errorMessage =
					error instanceof Error
						? error.message
						: "Error al cargar el resultado";
				setError(errorMessage);
				return null;
			} finally {
				setIsLoading(false);
			}
		},
		[]
	);

	const deleteResult = useCallback(async (id: string): Promise<boolean> => {
		try {
			setIsLoading(true);
			setError(null);

			const response = await ApiClient.delete(
				`/material-calculation/results/${id}`
			);

			if (response.data.success) {
				// Actualizar state local
				setResults((prev) => prev.filter((result) => result.id !== id));
				return true;
			}

			return false;
		} catch (error: unknown) {
			console.error("Error deleting result:", error);
			const errorMessage =
				error instanceof Error
					? error.message
					: "Error al eliminar el resultado";
			setError(errorMessage);
			return false;
		} finally {
			setIsLoading(false);
		}
	}, []);

	const fetchResults = useCallback(
		async (filters?: {limit?: number}): Promise<CalculationHistory[]> => {
			return getResults();
		},
		[getResults]
	);

	return {
		isLoading,
		error,
		results,
		getResults,
		getResult,
		deleteResult,
		fetchResults,
		clearError: () => setError(null),
	};
};

// ===============================================
// HOOK PARA TRENDING Y ANALYTICS
// ===============================================

export const useMaterialTrending = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [trending, setTrending] = useState<MaterialTrendingTemplate[]>([]);

	const fetchTrending = useCallback(
		async (
			period: "daily" | "weekly" | "monthly" | "yearly" = "weekly",
			limit: number = 10
		): Promise<void> => {
			try {
				setIsLoading(true);
				setError(null);

				const params = new URLSearchParams();
				params.append("period", period);
				params.append("limit", limit.toString());

				const response = await ApiClient.get(
					`/material-calculation/trending?${params.toString()}`
				);

				if (response.data.success && response.data.data) {
					setTrending(response.data.data.templates || []);
				} else {
					setTrending([]);
				}
			} catch (error: unknown) {
				console.error("Error fetching material trending:", error);
				const errorMessage =
					error instanceof Error
						? error.message
						: "Error al cargar plantillas en tendencia";
				setError(errorMessage);
				setTrending([]);
			} finally {
				setIsLoading(false);
			}
		},
		[]
	);

	const getAnalyticsOverview = useCallback(
		async (period: string): Promise<MaterialAnalytics> => {
			try {
				setError(null);

				const response = await ApiClient.get(
					`/material-calculation/analytics/overview?period=${period}`
				);

				if (response.data.success && response.data.data) {
					return response.data.data;
				}

				// Mock data if API fails
				return {
					period,
					totalCalculations: 0,
					uniqueUsers: 0,
					averageExecutionTime: 0,
					successRate: 0,
					topTemplates: [],
					calculationsByType: {
						concrete: 0,
						steel: 0,
						masonry: 0,
						finishes: 0,
						insulation: 0,
						other: 0,
					},
					calculationsByRegion: {},
				};
			} catch (error: unknown) {
				console.error("Error fetching analytics overview:", error);
				const errorMessage =
					error instanceof Error ? error.message : "Error al cargar analytics";
				setError(errorMessage);

				// Return mock data
				return {
					period,
					totalCalculations: 0,
					uniqueUsers: 0,
					averageExecutionTime: 0,
					successRate: 0,
					topTemplates: [],
					calculationsByType: {
						concrete: 0,
						steel: 0,
						masonry: 0,
						finishes: 0,
						insulation: 0,
						other: 0,
					},
					calculationsByRegion: {},
				};
			}
		},
		[]
	);

	return {
		// Estados
		isLoading,
		error,
		trending,

		// Métodos
		fetchTrending,
		getAnalyticsOverview,

		// Método para limpiar errores
		clearError: () => setError(null),
	};
};
