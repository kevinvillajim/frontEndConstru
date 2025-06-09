// src/ui/pages/calculations/shared/hooks/useMaterialCalculations.tsx

import {useState, useCallback} from "react";
import type {
	MaterialCalculationTemplate,
	MaterialCalculationResult,
	MaterialCalculationFilters,
	MaterialExecutionRequest,
	MaterialTrendingTemplate,
	MaterialCalculationType,
} from "../types/material.types";

const API_BASE = "/api/material-calculations";

export const useMaterialTemplates = () => {
	const [templates, setTemplates] = useState<MaterialCalculationTemplate[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [pagination, setPagination] = useState({
		total: 0,
		page: 1,
		limit: 20,
		pages: 0,
	});

	const fetchTemplates = useCallback(
		async (filters?: MaterialCalculationFilters) => {
			setLoading(true);
			setError(null);

			try {
				const queryParams = new URLSearchParams();

				if (filters?.type) queryParams.append("type", filters.type);
				if (filters?.subCategory)
					queryParams.append("subCategory", filters.subCategory);
				if (filters?.isFeatured)
					queryParams.append("isFeatured", filters.isFeatured.toString());
				if (filters?.searchTerm)
					queryParams.append("searchTerm", filters.searchTerm);
				if (filters?.tags?.length)
					queryParams.append("tags", filters.tags.join(","));
				if (filters?.minRating)
					queryParams.append("minRating", filters.minRating.toString());
				if (filters?.sortBy) queryParams.append("sortBy", filters.sortBy);
				if (filters?.sortOrder)
					queryParams.append("sortOrder", filters.sortOrder);

				const response = await fetch(`${API_BASE}/templates?${queryParams}`);

				if (!response.ok) {
					throw new Error("Error al cargar plantillas de materiales");
				}

				const data = await response.json();

				if (data.success) {
					setTemplates(data.data.templates);
					setPagination(data.data.pagination);
				} else {
					throw new Error(data.message || "Error desconocido");
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : "Error desconocido");
				setTemplates([]);
			} finally {
				setLoading(false);
			}
		},
		[]
	);

	const fetchTemplateById = useCallback(
		async (id: string): Promise<MaterialCalculationTemplate | null> => {
			try {
				const response = await fetch(`${API_BASE}/templates/${id}`);

				if (!response.ok) {
					throw new Error("Plantilla no encontrada");
				}

				const data = await response.json();
				return data.success ? data.data : null;
			} catch (err) {
				console.error("Error al cargar plantilla:", err);
				return null;
			}
		},
		[]
	);

	const getFeaturedTemplates = useCallback(async () => {
		setLoading(true);
		try {
			const response = await fetch(`${API_BASE}/templates/featured`);
			const data = await response.json();

			if (data.success) {
				return data.data;
			}
			return [];
		} catch (err) {
			setError("Error al cargar plantillas destacadas");
			return [];
			console.log(err);
		} finally {
			setLoading(false);
		}
	}, []);

	const getTemplatesByType = useCallback(
		async (type: MaterialCalculationType) => {
			try {
				const response = await fetch(`${API_BASE}/templates/by-type/${type}`);
				const data = await response.json();

				return data.success ? data.data : [];
			} catch (err) {
				console.error("Error al cargar plantillas por tipo:", err);
				return [];
			}
		},
		[]
	);

	return {
		templates,
		loading,
		error,
		pagination,
		fetchTemplates,
		fetchTemplateById,
		getFeaturedTemplates,
		getTemplatesByType,
	};
};

export const useMaterialCalculationExecution = () => {
	const [executing, setExecuting] = useState(false);
	const [result, setResult] = useState<MaterialCalculationResult | null>(null);
	const [error, setError] = useState<string | null>(null);

	const executeCalculation = useCallback(
		async (request: MaterialExecutionRequest) => {
			setExecuting(true);
			setError(null);
			setResult(null);

			try {
				const response = await fetch(`${API_BASE}/execute`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("authToken")}`,
					},
					body: JSON.stringify(request),
				});

				if (!response.ok) {
					throw new Error("Error al ejecutar cálculo");
				}

				const data = await response.json();

				if (data.success) {
					setResult(data.data);
					return data.data;
				} else {
					throw new Error(data.message || "Error en la ejecución");
				}
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : "Error desconocido";
				setError(errorMessage);
				throw err;
			} finally {
				setExecuting(false);
			}
		},
		[]
	);

	const getTemplatePreview = useCallback(async (templateId: string) => {
		try {
			const response = await fetch(
				`${API_BASE}/templates/${templateId}/preview`
			);
			const data = await response.json();

			return data.success ? data.data : null;
		} catch (err) {
			console.error("Error al cargar vista previa:", err);
			return null;
		}
	}, []);

	return {
		executing,
		result,
		error,
		executeCalculation,
		getTemplatePreview,
		clearResult: () => setResult(null),
		clearError: () => setError(null),
	};
};

export const useMaterialTrending = () => {
	const [trending, setTrending] = useState<MaterialTrendingTemplate[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchTrending = useCallback(
		async (
			period: "daily" | "weekly" | "monthly" | "yearly" = "weekly",
			materialType?: MaterialCalculationType,
			limit: number = 10
		) => {
			setLoading(true);
			setError(null);

			try {
				const queryParams = new URLSearchParams({
					period,
					limit: limit.toString(),
				});

				if (materialType) {
					queryParams.append("materialType", materialType);
				}

				const response = await fetch(`${API_BASE}/trending?${queryParams}`);

				if (!response.ok) {
					throw new Error("Error al cargar tendencias");
				}

				const data = await response.json();

				if (data.success) {
					setTrending(data.data);
					return data.data;
				} else {
					throw new Error(data.message || "Error desconocido");
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : "Error desconocido");
				return [];
			} finally {
				setLoading(false);
			}
		},
		[]
	);

	return {
		trending,
		loading,
		error,
		fetchTrending,
	};
};

export const useMaterialResults = () => {
	const [results, setResults] = useState<MaterialCalculationResult[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchUserResults = useCallback(
		async (filters?: {
			templateType?: "official" | "user";
			materialType?: MaterialCalculationType;
			dateFrom?: Date;
			dateTo?: Date;
			isSaved?: boolean;
			page?: number;
			limit?: number;
		}) => {
			setLoading(true);
			setError(null);

			try {
				const queryParams = new URLSearchParams();

				if (filters?.templateType)
					queryParams.append("templateType", filters.templateType);
				if (filters?.materialType)
					queryParams.append("materialType", filters.materialType);
				if (filters?.dateFrom)
					queryParams.append("dateFrom", filters.dateFrom.toISOString());
				if (filters?.dateTo)
					queryParams.append("dateTo", filters.dateTo.toISOString());
				if (filters?.isSaved !== undefined)
					queryParams.append("isSaved", filters.isSaved.toString());
				if (filters?.page) queryParams.append("page", filters.page.toString());
				if (filters?.limit)
					queryParams.append("limit", filters.limit.toString());

				const response = await fetch(`${API_BASE}/results?${queryParams}`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("authToken")}`,
					},
				});

				if (!response.ok) {
					throw new Error("Error al cargar resultados");
				}

				const data = await response.json();

				if (data.success) {
					setResults(data.data.results);
					return data.data;
				} else {
					throw new Error(data.message || "Error desconocido");
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : "Error desconocido");
				return {
					results: [],
					pagination: {total: 0, page: 1, limit: 20, pages: 0},
				};
			} finally {
				setLoading(false);
			}
		},
		[]
	);

	const toggleSaveResult = useCallback(
		async (resultId: string, isSaved: boolean) => {
			try {
				const response = await fetch(`${API_BASE}/results/${resultId}/save`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("authToken")}`,
					},
					body: JSON.stringify({isSaved}),
				});

				if (!response.ok) {
					throw new Error("Error al actualizar resultado");
				}

				const data = await response.json();
				return data.success;
			} catch (err) {
				console.error("Error al guardar resultado:", err);
				return false;
			}
		},
		[]
	);

	const toggleShareResult = useCallback(
		async (resultId: string, isShared: boolean) => {
			try {
				const response = await fetch(`${API_BASE}/results/${resultId}/share`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("authToken")}`,
					},
					body: JSON.stringify({isShared}),
				});

				if (!response.ok) {
					throw new Error("Error al compartir resultado");
				}

				const data = await response.json();
				return data.success;
			} catch (err) {
				console.error("Error al compartir resultado:", err);
				return false;
			}
		},
		[]
	);

	return {
		results,
		loading,
		error,
		fetchUserResults,
		toggleSaveResult,
		toggleShareResult,
	};
};

export const useMaterialAnalytics = () => {
	interface AnalyticsData {
		// Define the structure of your analytics data here
		// Example:
		totalUsers: number;
		totalCalculations: number;
		period: string;
	}

	const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchAnalyticsOverview = useCallback(
		async (period: string = "monthly") => {
			setLoading(true);
			setError(null);

			try {
				const response = await fetch(
					`${API_BASE}/analytics/overview?period=${period}`
				);

				if (!response.ok) {
					throw new Error("Error al cargar analytics");
				}

				const data = await response.json();

				if (data.success) {
					setAnalytics(data.data);
					return data.data;
				} else {
					throw new Error(data.message || "Error desconocido");
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : "Error desconocido");
				return null;
			} finally {
				setLoading(false);
			}
		},
		[]
	);

	const fetchAnalyticsByType = useCallback(async () => {
		try {
			const response = await fetch(`${API_BASE}/analytics/by-type`);
			const data = await response.json();

			return data.success ? data.data : null;
		} catch (err) {
			console.error("Error al cargar analytics por tipo:", err);
			return null;
		}
	}, []);

	return {
		analytics,
		loading,
		error,
		fetchAnalyticsOverview,
		fetchAnalyticsByType,
	};
};
