// src/hooks/useCalculations.ts
import {useState, useCallback} from "react";

// Tipos para cálculos
export interface CalculationTemplate {
	id: string;
	name: string;
	description: string;
	category: "structural" | "electrical" | "architectural" | "hydraulic";
	subcategory: string;
	profession: string[];
	difficulty: "basic" | "intermediate" | "advanced";
	estimatedTime: string;
	necReference: string;
	verified: boolean;
	rating: number;
	usageCount: number;
	isFavorite: boolean;
	isNew: boolean;
	tags: string[];
	parameters: CalculationParameter[];
	lastUpdated: string;
	version: string;
}

export interface CalculationParameter {
	id: string;
	name: string;
	label: string;
	type: "number" | "select" | "text" | "boolean";
	unit?: string;
	required: boolean;
	defaultValue?: string | number | boolean;
	minValue?: number;
	maxValue?: number;
	options?: string[];
	description: string;
	typicalRange?: string;
}

export interface CalculationResult {
	id: string;
	templateId: string;
	name: string;
	parameters: Record<string, any>;
	results: {
		mainResult: {
			label: string;
			value: string;
			unit: string;
		};
		breakdown: Array<{
			label: string;
			value: string;
			unit?: string;
			factor?: string;
		}>;
		recommendations: Array<{
			type: "warning" | "info" | "success";
			title: string;
			description: string;
		}>;
		compliance: {
			isCompliant: boolean;
			necReference: string;
			notes: string[];
		};
	};
	createdAt: string;
	lastModified: string;
	usedInProject?: boolean;
	projectId?: string;
}

export const useCalculations = () => {
	const [templates, setTemplates] = useState<CalculationTemplate[]>([]);
	const [savedCalculations, setSavedCalculations] = useState<
		CalculationResult[]
	>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Obtener plantillas disponibles
	const fetchTemplates = useCallback(
		async (filters?: {
			category?: string;
			profession?: string;
			difficulty?: string;
			searchTerm?: string;
		}) => {
			setLoading(true);
			setError(null);

			try {
				const queryParams = new URLSearchParams();
				if (filters?.category) queryParams.append("types", filters.category);
				if (filters?.profession)
					queryParams.append("targetProfessions", filters.profession);
				if (filters?.searchTerm)
					queryParams.append("searchTerm", filters.searchTerm);

				const response = await fetch(
					`/api/calculations/templates?${queryParams}`,
					{
						method: "GET",
						credentials: "include",
						headers: {
							"Content-Type": "application/json",
						},
					}
				);

				if (!response.ok) {
					throw new Error("Error al obtener plantillas");
				}

				const data = await response.json();
				setTemplates(data.data.templates || []);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Error desconocido");
			} finally {
				setLoading(false);
			}
		},
		[]
	);

	// Ejecutar un cálculo
	const executeCalculation = useCallback(
		async (
			templateId: string,
			parameters: Record<string, any>,
			projectId?: string
		) => {
			setLoading(true);
			setError(null);

			try {
				const response = await fetch("/api/calculations/execute", {
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						templateId,
						parameters,
						projectId,
					}),
				});

				if (!response.ok) {
					throw new Error("Error al ejecutar cálculo");
				}

				const data = await response.json();
				return data.data;
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Error al ejecutar cálculo"
				);
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[]
	);

	// Guardar resultado de cálculo
	const saveCalculationResult = useCallback(
		async (result: {
			id: string;
			name: string;
			notes?: string;
			usedInProject?: boolean;
			projectId?: string;
		}) => {
			setLoading(true);
			setError(null);

			try {
				const response = await fetch("/api/calculations/save-result", {
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(result),
				});

				if (!response.ok) {
					throw new Error("Error al guardar resultado");
				}

				const data = await response.json();

				// Actualizar la lista local de cálculos guardados
				setSavedCalculations((prev) => [...prev, data.data]);

				return data.data;
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Error al guardar resultado"
				);
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[]
	);

	// Obtener cálculos guardados
	const fetchSavedCalculations = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			// Simular llamada a API - adaptarás con tu endpoint real
			const response = await fetch("/api/calculations/saved", {
				method: "GET",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error("Error al obtener cálculos guardados");
			}

			const data = await response.json();
			setSavedCalculations(data.data || []);
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "Error al obtener cálculos guardados"
			);
		} finally {
			setLoading(false);
		}
	}, []);

	// Obtener recomendaciones de plantillas
	const getRecommendations = useCallback(
		async (context?: {
			templateId?: string;
			projectId?: string;
			limit?: number;
		}) => {
			try {
				const queryParams = new URLSearchParams();
				if (context?.templateId)
					queryParams.append("templateId", context.templateId);
				if (context?.projectId)
					queryParams.append("projectId", context.projectId);
				if (context?.limit)
					queryParams.append("limit", context.limit.toString());

				const response = await fetch(
					`/api/calculations/recommendations?${queryParams}`,
					{
						method: "GET",
						credentials: "include",
						headers: {
							"Content-Type": "application/json",
						},
					}
				);

				if (!response.ok) {
					throw new Error("Error al obtener recomendaciones");
				}

				const data = await response.json();
				return data.data || [];
			} catch (err) {
				console.error("Error getting recommendations:", err);
				return [];
			}
		},
		[]
	);

	return {
		// Estado
		templates,
		savedCalculations,
		loading,
		error,

		// Acciones
		fetchTemplates,
		executeCalculation,
		saveCalculationResult,
		fetchSavedCalculations,
		getRecommendations,

		// Helpers
		clearError: () => setError(null),
	};
};
