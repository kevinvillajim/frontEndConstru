// src/ui/pages/calculations/shared/hooks/useCalculations.tsx
import {useState, useCallback} from "react";
import {
	CalculationTemplate,
	CalculationResult,
	CalculationsFilters,
	RecommendationContext,
	SaveCalculationRequest,
} from "../types/calculation.types";

export const useCalculations = () => {
	const [templates, setTemplates] = useState<CalculationTemplate[]>([]);
	const [savedCalculations, setSavedCalculations] = useState<
		CalculationResult[]
	>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Obtener plantillas disponibles
	const fetchTemplates = useCallback(async (filters?: CalculationsFilters) => {
		setLoading(true);
		setError(null);

		try {
			const queryParams = new URLSearchParams();
			if (filters?.category) queryParams.append("types", filters.category);
			if (filters?.profession)
				queryParams.append("targetProfessions", filters.profession);
			if (filters?.searchTerm)
				queryParams.append("searchTerm", filters.searchTerm);
			if (filters?.difficulty)
				queryParams.append("difficulty", filters.difficulty);

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
			return data.data.templates || [];
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Error desconocido";
			setError(errorMessage);
			throw new Error(errorMessage);
		} finally {
			setLoading(false);
		}
	}, []);

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
				const errorMessage =
					err instanceof Error ? err.message : "Error al ejecutar cálculo";
				setError(errorMessage);
				throw new Error(errorMessage);
			} finally {
				setLoading(false);
			}
		},
		[]
	);

	// Guardar resultado de cálculo
	const saveCalculationResult = useCallback(
		async (result: SaveCalculationRequest) => {
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
				const errorMessage =
					err instanceof Error ? err.message : "Error al guardar resultado";
				setError(errorMessage);
				throw new Error(errorMessage);
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
			const calculations = data.data || [];
			setSavedCalculations(calculations);
			return calculations;
		} catch (err) {
			const errorMessage =
				err instanceof Error
					? err.message
					: "Error al obtener cálculos guardados";
			setError(errorMessage);
			return [];
		} finally {
			setLoading(false);
		}
	}, []);

	// Obtener recomendaciones de plantillas
	const getRecommendations = useCallback(
		async (context?: RecommendationContext) => {
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

	// Obtener plantilla específica
	const getTemplate = useCallback(async (templateId: string) => {
		try {
			const response = await fetch(
				`/api/calculations/templates/${templateId}`,
				{
					method: "GET",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			if (!response.ok) {
				throw new Error("Error al obtener plantilla");
			}

			const data = await response.json();
			return data.data;
		} catch (err) {
			console.error("Error getting template:", err);
			return null;
		}
	}, []);

	// Marcar/desmarcar como favorito
	const toggleFavorite = useCallback(async (templateId: string) => {
		try {
			const response = await fetch(
				`/api/calculations/templates/${templateId}/favorite`,
				{
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			if (!response.ok) {
				throw new Error("Error al cambiar favorito");
			}

			// Actualizar estado local
			setTemplates((prev) =>
				prev.map((template) =>
					template.id === templateId
						? {...template, isFavorite: !template.isFavorite}
						: template
				)
			);

			return true;
		} catch (err) {
			console.error("Error toggling favorite:", err);
			return false;
		}
	}, []);

	return {
		// Estado
		templates,
		savedCalculations,
		loading,
		error,

		// Acciones principales
		fetchTemplates,
		executeCalculation,
		saveCalculationResult,
		fetchSavedCalculations,
		getRecommendations,

		// Acciones adicionales
		getTemplate,
		toggleFavorite,

		// Helpers
		clearError: () => setError(null),
		setLoading,
	};
};
