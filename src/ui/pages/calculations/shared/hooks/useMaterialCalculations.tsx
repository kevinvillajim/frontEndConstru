// src/ui/pages/calculations/shared/hooks/useMaterialCalculations.tsx
import {useState, useCallback} from "react";
import ApiClient from "../../../../../core/adapters/api/ApiClient";

export interface MaterialTemplate {
	id: string;
	name: string;
	description: string;
	type: string;
	formula: string;
	parameters: MaterialParameter[];
	necReference?: string;
	isActive: boolean;
	isVerified: boolean;
	isFeatured: boolean;
	usageCount: number;
	averageRating: string;
	ratingCount: number;
	createdAt: string;
	updatedAt: string;
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

				if (response.data.success && response.data.data) {
					return response.data.data;
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
		): Promise<MaterialCalculationResult> => {
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
				throw new Error(errorMessage);
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
					`/material-calculation/history?${params.toString()}`
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

	const getTrendingTemplates = useCallback(
		async (
			period: "daily" | "weekly" | "monthly" = "weekly",
			limit: number = 10
		): Promise<MaterialTemplate[]> => {
			try {
				setIsLoading(true);
				setError(null);

				const response = await ApiClient.get(
					`/material-calculation/trending?period=${period}&limit=${limit}`
				);

				if (response.data.success && response.data.data) {
					return response.data.data;
				}

				return [];
			} catch (error: unknown) {
				console.error("Error fetching trending templates:", error);
				const errorMessage =
					error instanceof Error
						? error.message
						: "Error al cargar plantillas trending";
				setError(errorMessage);
				return [];
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

// Hook específico para plantillas de usuario (mock implementation)
export const useMaterialTemplates = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const getUserTemplates = useCallback(async (): Promise<UserTemplate[]> => {
		// Mock implementation - replace with real API call
		return [];
	}, []);

	const createTemplate = useCallback(
		async (
			templateData: Partial<UserTemplate>
		): Promise<UserTemplate | null> => {
			// Mock implementation - replace with real API call
			console.log("Creating template:", templateData);
			return null;
		},
		[]
	);

	const updateTemplate = useCallback(
		async (
			id: string,
			templateData: Partial<UserTemplate>
		): Promise<boolean> => {
			// Mock implementation - replace with real API call
			console.log("Updating template:", id, templateData);
			return false;
		},
		[]
	);

	const deleteTemplate = useCallback(async (id: string): Promise<boolean> => {
		// Mock implementation - replace with real API call
		console.log("Deleting template:", id);
		return false;
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

// Hook específico para resultados (mock implementation)
export const useMaterialResults = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const getResults = useCallback(async (): Promise<CalculationHistory[]> => {
		// Mock implementation - replace with real API call
		return [];
	}, []);

	const getResult = useCallback(
		async (id: string): Promise<MaterialCalculationResult | null> => {
			// Mock implementation - replace with real API call
			console.log("Getting result:", id);
			return null;
		},
		[]
	);

	const deleteResult = useCallback(async (id: string): Promise<boolean> => {
		// Mock implementation - replace with real API call
		console.log("Deleting result:", id);
		return false;
	}, []);

	return {
		isLoading,
		error,
		getResults,
		getResult,
		deleteResult,
		clearError: () => setError(null),
	};
};
