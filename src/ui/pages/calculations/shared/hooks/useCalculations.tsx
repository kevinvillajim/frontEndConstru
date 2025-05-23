// src/ui/pages/calculations/shared/hooks/useCalculations.tsx
import {useState, useCallback} from "react";
import type {
	CalculationTemplate,
	CalculationResult,
	CalculationsFilters,
	RecommendationContext,
	SaveCalculationRequest,
} from "../types/calculation.types";
import endpoints from "../../../../../utils/endpoints";

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
				`${endpoints.calculations.templates.list}?${queryParams}`,
				{
					method: "GET",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			if (!response.ok) {
				throw new Error(
					`Error al obtener plantillas: ${response.status} ${response.statusText}`
				);
			}

			const data = await response.json();
			setTemplates(data.data.templates || []);
			return data.data.templates || [];
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Error desconocido";
			setError(errorMessage);
			console.error("Error fetching templates:", err);
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
				const response = await fetch(endpoints.calculations.execute, {
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
					throw new Error(
						`Error al ejecutar cálculo: ${response.status} ${response.statusText}`
					);
				}

				const data = await response.json();
				return data.data;
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : "Error al ejecutar cálculo";
				setError(errorMessage);
				console.error("Error executing calculation:", err);
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
				const response = await fetch(endpoints.calculations.saveResult, {
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(result),
				});

				if (!response.ok) {
					throw new Error(
						`Error al guardar resultado: ${response.status} ${response.statusText}`
					);
				}

				const data = await response.json();

				// Actualizar la lista local de cálculos guardados
				setSavedCalculations((prev) => [...prev, data.data]);

				return data.data;
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : "Error al guardar resultado";
				setError(errorMessage);
				console.error("Error saving calculation result:", err);
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
			// NOTA: El endpoint /api/calculations/saved NO EXISTE en la documentación de la API
			// Esto es una implementación temporal hasta que se agregue al backend

			// Opción 1: Intentar usar un endpoint que puede existir
			// Opción 2: Usar datos mock temporales
			// Opción 3: Simplemente devolver array vacío sin hacer llamada

			// Por ahora, usamos datos mock para evitar el error
			console.warn(
				"⚠️ Endpoint /api/calculations/saved no implementado. Usando datos mock."
			);

			// Simulamos datos de ejemplo
			const mockCalculations: CalculationResult[] = [
				{
					id: "mock-1",
					templateId: "template-1",
					name: "Cálculo de Demanda Eléctrica - Casa Modelo A",
					parameters: {area: 120, tipo: "residencial"},
					results: {
						mainResult: {
							label: "Demanda Total",
							value: "15.2",
							unit: "kW",
						},
						breakdown: [
							{label: "Iluminación", value: "2.4", unit: "kW"},
							{label: "Tomacorrientes", value: "8.8", unit: "kW"},
							{label: "Equipos especiales", value: "4.0", unit: "kW"},
						],
						recommendations: [
							{
								type: "info",
								title: "Cumple con NEC",
								description:
									"El cálculo cumple con las normativas ecuatorianas",
							},
						],
						compliance: {
							isCompliant: true,
							necReference: "NEC-2018 Sección 220",
							notes: ["Cálculo verificado según normativa vigente"],
						},
					},
					createdAt: "2024-03-15T10:30:00Z",
					lastModified: "2024-03-15T10:30:00Z",
					usedInProject: true,
					projectId: "project-1",
				},
			];

			// Simular delay de red
			await new Promise((resolve) => setTimeout(resolve, 500));

			setSavedCalculations(mockCalculations);
			return mockCalculations;

			/* 
			// Código para cuando el endpoint esté implementado:
			const response = await fetch(endpoints.calculations.savedCalculations, {
				method: "GET",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error(`Error al obtener cálculos guardados: ${response.status} ${response.statusText}`);
			}

			const data = await response.json();
			const calculations = data.data || [];
			setSavedCalculations(calculations);
			return calculations;
			*/
		} catch (err) {
			const errorMessage =
				err instanceof Error
					? err.message
					: "Error al obtener cálculos guardados";
			console.error("Error fetching saved calculations:", err);

			// No establecer error para endpoints no implementados
			// setError(errorMessage);

			// Devolver array vacío en caso de error
			setSavedCalculations([]);
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
					queryParams.append("currentTemplateId", context.templateId);
				if (context?.projectId)
					queryParams.append("projectId", context.projectId);
				if (context?.limit)
					queryParams.append("limit", context.limit.toString());

				// Usar el endpoint correcto de recomendaciones
				const url = `/api/recommendations/templates?${queryParams}`;

				const response = await fetch(url, {
					method: "GET",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
				});

				if (!response.ok) {
					console.warn(
						`Error al obtener recomendaciones: ${response.status} ${response.statusText}`
					);
					return [];
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
				endpoints.calculations.templates.getById(templateId),
				{
					method: "GET",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			if (!response.ok) {
				throw new Error(
					`Error al obtener plantilla: ${response.status} ${response.statusText}`
				);
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
			// Este endpoint no está definido en la documentación
			// Necesitarás agregarlo al backend
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
				console.warn(
					`Error al cambiar favorito: ${response.status} ${response.statusText}`
				);
				return false;
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
