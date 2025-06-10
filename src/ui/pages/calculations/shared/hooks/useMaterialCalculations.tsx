// src/ui/pages/calculations/shared/hooks/useMaterialCalculations.tsx
// 🚨 CORRECCIÓN CRÍTICA: Cambiado API_BASE de /material-calculations a /material-calculation

import {useState, useCallback} from "react";
import type {
	MaterialCalculationTemplate,
	MaterialCalculationResult,
	MaterialCalculationFilters,
	MaterialExecutionRequest,
	MaterialTrendingTemplate,
	MaterialCalculationType,
} from "../types/material.types";

// 🔧 CORREGIDO: Cambiado de plural a singular para coincidir con backend
const API_BASE = "/api/material-calculation"; // ← ESTA ERA LA LÍNEA PROBLEMÁTICA

// Hook para plantillas de materiales
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

				const response = await fetch(`${API_BASE}/templates?${queryParams}`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("authToken")}`,
						"Content-Type": "application/json",
					},
				});

				if (!response.ok) {
					throw new Error("Error al cargar plantillas de materiales");
				}

				const data = await response.json();

				if (data.success) {
					setTemplates(data.data.templates || []);
					setPagination(
						data.data.pagination || {
							total: 0,
							page: 1,
							limit: 20,
							pages: 0,
						}
					);
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
				const response = await fetch(`${API_BASE}/templates/${id}`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("authToken")}`,
						"Content-Type": "application/json",
					},
				});

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
			const response = await fetch(`${API_BASE}/templates/featured`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("authToken")}`,
					"Content-Type": "application/json",
				},
			});
			const data = await response.json();

			if (data.success) {
				return data.data;
			}
			return [];
		} catch {
			setError("Error al cargar plantillas destacadas");
			return [];
		} finally {
			setLoading(false);
		}
	}, []);

	const getTemplatesByType = useCallback(
		async (
			type: MaterialCalculationType
		): Promise<MaterialCalculationTemplate[]> => {
			try {
				const response = await fetch(`${API_BASE}/templates/by-type/${type}`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("authToken")}`,
						"Content-Type": "application/json",
					},
				});
				const data = await response.json();

				return data.success ? data.data : [];
			} catch (err) {
				console.error("Error al cargar plantillas por tipo:", err);
				return [];
			}
		},
		[]
	);

	const getTemplatePreview = useCallback(async (templateId: string) => {
		try {
			const response = await fetch(
				`${API_BASE}/templates/${templateId}/preview`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("authToken")}`,
						"Content-Type": "application/json",
					},
				}
			);
			const data = await response.json();

			return data.success ? data.data : null;
		} catch (err) {
			console.error("Error al obtener preview:", err);
			return null;
		}
	}, []);

	return {
		templates,
		loading,
		error,
		pagination,
		fetchTemplates,
		fetchTemplateById,
		getFeaturedTemplates,
		getTemplatesByType,
		getTemplatePreview,
	};
};

// Hook para ejecución de cálculos
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

	const clearResult = useCallback(() => {
		setResult(null);
		setError(null);
	}, []);

	return {
		executing,
		result,
		error,
		executeCalculation,
		clearResult,
	};
};

// Hook para trending y analytics
export const useMaterialTrending = () => {
	const [trending, setTrending] = useState<MaterialTrendingTemplate[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchTrending = useCallback(
		async (
			period: "daily" | "weekly" | "monthly" | "yearly" = "weekly",
			limit: number = 10
		) => {
			setLoading(true);
			setError(null);

			try {
				const queryParams = new URLSearchParams({
					period,
					limit: limit.toString(),
				});

				const response = await fetch(`${API_BASE}/trending?${queryParams}`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("authToken")}`,
						"Content-Type": "application/json",
					},
				});

				if (!response.ok) {
					throw new Error("Error al cargar tendencias");
				}

				const data = await response.json();

				if (data.success) {
					setTrending(data.data);
				} else {
					throw new Error(data.message || "Error desconocido");
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : "Error desconocido");
				setTrending([]);
			} finally {
				setLoading(false);
			}
		},
		[]
	);

	const getAnalyticsOverview = useCallback(
		async (period: string = "monthly") => {
			try {
				const response = await fetch(
					`${API_BASE}/analytics/overview?period=${period}`,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem("authToken")}`,
							"Content-Type": "application/json",
						},
					}
				);
				const data = await response.json();

				return data.success ? data.data : null;
			} catch (err) {
				console.error("Error al obtener analytics:", err);
				return null;
			}
		},
		[]
	);

	const getAnalyticsByType = useCallback(async () => {
		try {
			const response = await fetch(`${API_BASE}/analytics/by-type`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("authToken")}`,
					"Content-Type": "application/json",
				},
			});
			const data = await response.json();

			return data.success ? data.data : null;
		} catch (err) {
			console.error("Error al obtener analytics por tipo:", err);
			return null;
		}
	}, []);

	return {
		trending,
		loading,
		error,
		fetchTrending,
		getAnalyticsOverview,
		getAnalyticsByType,
	};
};

// Hook para resultados y historial
export const useMaterialResults = () => {
	const [results, setResults] = useState<MaterialCalculationResult[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchResults = useCallback(
		async (filters?: {
			projectId?: string;
			templateId?: string;
			limit?: number;
		}) => {
			setLoading(true);
			setError(null);

			try {
				const queryParams = new URLSearchParams();
				if (filters?.projectId)
					queryParams.append("projectId", filters.projectId);
				if (filters?.templateId)
					queryParams.append("templateId", filters.templateId);
				if (filters?.limit)
					queryParams.append("limit", filters.limit.toString());

				const response = await fetch(`${API_BASE}/results?${queryParams}`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("authToken")}`,
						"Content-Type": "application/json",
					},
				});

				if (!response.ok) {
					throw new Error("Error al cargar resultados");
				}

				const data = await response.json();

				if (data.success) {
					setResults(data.data.results || []);
				} else {
					throw new Error(data.message || "Error desconocido");
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : "Error desconocido");
				setResults([]);
			} finally {
				setLoading(false);
			}
		},
		[]
	);

	const deleteResult = useCallback(async (resultId: string) => {
		try {
			const response = await fetch(`${API_BASE}/results/${resultId}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${localStorage.getItem("authToken")}`,
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error("Error al eliminar resultado");
			}

			// Actualizar la lista local
			setResults((prev) => prev.filter((result) => result.id !== resultId));
			return true;
		} catch (err) {
			console.error("Error al eliminar resultado:", err);
			return false;
		}
	}, []);

	const toggleSaveResult = useCallback(async (resultId: string) => {
		try {
			const response = await fetch(`${API_BASE}/results/${resultId}/save`, {
				method: "PUT",
				headers: {
					Authorization: `Bearer ${localStorage.getItem("authToken")}`,
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error("Error al guardar/desguardar resultado");
			}

			const data = await response.json();

			// Actualizar la lista local
			setResults((prev) =>
				prev.map((result) =>
					result.id === resultId
						? {...result, isSaved: data.data.isSaved}
						: result
				)
			);

			return data.data.isSaved;
		} catch (err) {
			console.error("Error al guardar/desguardar resultado:", err);
			return false;
		}
	}, []);

	const toggleShareResult = useCallback(async (resultId: string) => {
		try {
			const response = await fetch(`${API_BASE}/results/${resultId}/share`, {
				method: "PUT",
				headers: {
					Authorization: `Bearer ${localStorage.getItem("authToken")}`,
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error("Error al compartir/descompartir resultado");
			}

			const data = await response.json();

			// Actualizar la lista local
			setResults((prev) =>
				prev.map((result) =>
					result.id === resultId
						? {...result, isShared: data.data.isShared}
						: result
				)
			);

			return data.data.isShared;
		} catch (err) {
			console.error("Error al compartir/descompartir resultado:", err);
			return false;
		}
	}, []);

	return {
		results,
		loading,
		error,
		fetchResults,
		deleteResult,
		toggleSaveResult,
		toggleShareResult,
	};
};

// Hook combinado para facilitar el uso
export const useMaterialCalculations = () => {
	const templates = useMaterialTemplates();
	const execution = useMaterialCalculationExecution();
	const trending = useMaterialTrending();
	const results = useMaterialResults();

	return {
		templates,
		execution,
		trending,
		results,
	};
};