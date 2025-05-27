// src/ui/pages/calculations/shared/hooks/useCalculations.tsx
import {useState, useCallback} from "react";
import type {
	CalculationTemplate,
	CalculationResult,
	BackendCalculationResult,
	TemplateFilters,
	BackendCalculationTemplate,
	mapBackendTemplate,
} from "../types/template.types";
import endpoints from "../../../../../utils/endpoints";

interface CalculationsFilters {
	category?: string;
	profession?: string;
	difficulty?: string;
	searchTerm?: string;
}

interface RecommendationContext {
	templateId?: string;
	projectId?: string;
	limit?: number;
}

interface SaveCalculationRequest {
	id: string;
	name: string;
	notes?: string;
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

	// Obtener plantillas disponibles con tipado correcto
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

			// Solo plantillas activas y verificadas
			queryParams.append("isActive", "true");
			queryParams.append("isVerified", "true");

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

			if (data.success && data.data?.templates) {
				// Mapear las plantillas del backend al formato esperado
				const mappedTemplates = data.data.templates.map(
					(template: BackendCalculationTemplate) => mapBackendTemplate(template)
				);
				setTemplates(mappedTemplates);
				return mappedTemplates;
			}

			throw new Error("Formato de respuesta inválido");
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

	// Ejecutar un cálculo usando la API real
	const executeCalculation = useCallback(
		async (
			templateId: string,
			parameters: Record<string, any>,
			projectId?: string
		): Promise<CalculationResult> => {
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
					const errorData = await response.json().catch(() => ({}));
					throw new Error(
						errorData.message ||
							`Error al ejecutar cálculo: ${response.status} ${response.statusText}`
					);
				}

				const data = await response.json();

				if (!data.success) {
					throw new Error(data.message || "Error en la ejecución del cálculo");
				}

				// Mapear el resultado del backend al formato esperado
				const backendResult: BackendCalculationResult = data.data;
				const result: CalculationResult = {
					id: backendResult.id,
					calculationTemplateId: backendResult.calculationTemplateId,
					templateName: "", // Se puede obtener del template si es necesario
					projectId: backendResult.projectId,
					userId: backendResult.userId || "current-user",
					inputParameters: backendResult.inputParameters,
					results: backendResult.results,
					isSaved: backendResult.isSaved,
					name: backendResult.name,
					notes: backendResult.notes,
					executionTimeMs: backendResult.executionTimeMs,
					wasSuccessful: backendResult.wasSuccessful,
					errorMessage: backendResult.errorMessage,
					usedInProject: backendResult.usedInProject,
					ledToMaterialOrder: backendResult.ledToMaterialOrder,
					ledToBudget: backendResult.ledToBudget,
					createdAt: backendResult.createdAt,
					updatedAt: backendResult.updatedAt,
				};

				return result;
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
		async (result: SaveCalculationRequest): Promise<CalculationResult> => {
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
					const errorData = await response.json().catch(() => ({}));
					throw new Error(
						errorData.message ||
							`Error al guardar resultado: ${response.status} ${response.statusText}`
					);
				}

				const data = await response.json();

				if (!data.success) {
					throw new Error(data.message || "Error al guardar el resultado");
				}

				// Mapear el resultado guardado
				const savedResult: CalculationResult = data.data;

				// Actualizar la lista local de cálculos guardados
				setSavedCalculations((prev) => [savedResult, ...prev]);

				return savedResult;
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
			// Primero intentar con el endpoint que puede existir en el futuro
			const response = await fetch(endpoints.calculations.savedCalculations, {
				method: "GET",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (response.ok) {
				const data = await response.json();
				if (data.success && data.data) {
					const calculations = data.data.map(
						(calc: BackendCalculationResult) => ({
							...calc,
							templateName: calc.templateName || "Plantilla",
							userId: calc.userId || "current-user",
						})
					);
					setSavedCalculations(calculations);
					return calculations;
				}
			}

			// Si el endpoint no existe, devolver array vacío sin error
			console.warn(
				"Endpoint de cálculos guardados no disponible. Funcionalidad pendiente de implementación."
			);
			setSavedCalculations([]);
			return [];
		} catch (err) {
			console.warn("Error obteniendo cálculos guardados:", err);
			// No establecer error para endpoints no implementados
			setSavedCalculations([]);
			return [];
		} finally {
			setLoading(false);
		}
	}, []);

	// Obtener recomendaciones de plantillas
	const getRecommendations = useCallback(
		async (context?: RecommendationContext): Promise<CalculationTemplate[]> => {
			try {
				const queryParams = new URLSearchParams();
				if (context?.templateId)
					queryParams.append("currentTemplateId", context.templateId);
				if (context?.projectId)
					queryParams.append("projectId", context.projectId);
				if (context?.limit)
					queryParams.append("limit", context.limit.toString());

				const response = await fetch(
					`${endpoints.calculations.recommendations}?${queryParams}`,
					{
						method: "GET",
						credentials: "include",
						headers: {
							"Content-Type": "application/json",
						},
					}
				);

				if (!response.ok) {
					console.warn(
						`Error al obtener recomendaciones: ${response.status} ${response.statusText}`
					);
					return [];
				}

				const data = await response.json();

				if (data.success && data.data) {
					return data.data.map((template: BackendCalculationTemplate) =>
						mapBackendTemplate(template)
					);
				}

				return [];
			} catch (err) {
				console.error("Error getting recommendations:", err);
				return [];
			}
		},
		[]
	);

	// Obtener plantilla específica
	const getTemplate = useCallback(
		async (templateId: string): Promise<CalculationTemplate | null> => {
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

				if (data.success && data.data) {
					return mapBackendTemplate(data.data);
				}

				return null;
			} catch (err) {
				console.error("Error getting template:", err);
				return null;
			}
		},
		[]
	);

	// Marcar/desmarcar como favorito
	const toggleFavorite = useCallback(
		async (templateId: string): Promise<boolean> => {
			try {
				const response = await fetch(
					endpoints.calculations.templates.toggleFavorite(templateId),
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

				const data = await response.json();

				if (data.success && data.data) {
					const newIsFavorite = data.data.isFavorite;

					// Actualizar estado local
					setTemplates((prev) =>
						prev.map((template) =>
							template.id === templateId
								? {...template, isFavorite: newIsFavorite}
								: template
						)
					);

					return newIsFavorite;
				}

				return false;
			} catch (err) {
				console.error("Error toggling favorite:", err);
				return false;
			}
		},
		[]
	);

	// Obtener vista previa de una plantilla
	const getTemplatePreview = useCallback(
		async (templateId: string): Promise<any> => {
			try {
				const response = await fetch(
					endpoints.calculations.templates.preview(templateId),
					{
						method: "GET",
						credentials: "include",
						headers: {
							"Content-Type": "application/json",
						},
					}
				);

				if (!response.ok) {
					console.warn(
						`Error al obtener vista previa: ${response.status} ${response.statusText}`
					);
					return null;
				}

				const data = await response.json();
				return data.success ? data.data : null;
			} catch (err) {
				console.error("Error getting template preview:", err);
				return null;
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

		// Acciones principales
		fetchTemplates,
		executeCalculation,
		saveCalculationResult,
		fetchSavedCalculations,
		getRecommendations,

		// Acciones adicionales
		getTemplate,
		toggleFavorite,
		getTemplatePreview,

		// Helpers
		clearError: () => setError(null),
		setLoading,
	};
};
