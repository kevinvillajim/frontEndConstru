import {useState, useEffect, useMemo} from "react";

// Tipos de datos
export interface CalculationResult {
	id: string;
	name: string;
	templateName: string;
	templateCategory: "structural" | "electrical" | "architectural" | "hydraulic";
	projectName?: string;
	createdDate: string;
	author: string;
	necReference: string;
	parameters: Record<
		string,
		{value: string | number; unit?: string; label: string}
	>;
	results: {
		primary: {label: string; value: string; unit: string};
		secondary: Array<{label: string; value: string; unit?: string}>;
	};
	compliance: {
		status: "compliant" | "warning" | "non-compliant";
		notes: string[];
	};
	tags: string[];
}

export interface SavedCalculation {
	id: string;
	name: string;
	templateName: string;
	templateCategory: "structural" | "electrical" | "architectural" | "hydraulic";
	projectName?: string;
	projectId?: string;
	results: {
		mainValue: string;
		unit: string;
	};
	createdAt: string;
	lastModified: string;
	isFavorite: boolean;
	tags: string[];
	necReference: string;
	status: "completed" | "draft" | "error";
	usedInProject: boolean;
}

interface UseComparisonOptions {
	maxSelections?: number;
	initialCalculations?: CalculationResult[];
	onSelectionChange?: (calculations: CalculationResult[]) => void;
}

/**
 * Hook para manejar la comparación de cálculos
 */
export const useComparison = ({
	maxSelections = 4,
	initialCalculations = [],
	onSelectionChange,
}: UseComparisonOptions = {}) => {
	// Estado para los cálculos seleccionados
	const [selectedCalculations, setSelectedCalculations] =
		useState<CalculationResult[]>(initialCalculations);

	// Estado para los cálculos disponibles (mock)
	const [availableCalculations, setAvailableCalculations] = useState<
		CalculationResult[]
	>([]);

	// Estado para búsqueda y filtros
	const [searchTerm, setSearchTerm] = useState("");
	const [filterCategory, setFilterCategory] = useState<string>("");
	const [filterCompliance, setFilterCompliance] = useState<string>("");

	// Indicador de carga
	const [loading, setLoading] = useState(false);

	// Categorías con iconos y colores
	const categories = [
		{id: "structural", name: "Estructural", icon: "🏗️", color: "text-blue-600"},
		{id: "electrical", name: "Eléctrico", icon: "⚡", color: "text-yellow-600"},
		{
			id: "architectural",
			name: "Arquitectónico",
			icon: "🏛️",
			color: "text-green-600",
		},
		{id: "hydraulic", name: "Hidráulico", icon: "🚰", color: "text-cyan-600"},
	];

	// Efectos para cargar datos
	useEffect(() => {
		// En un entorno real, aquí cargaríamos los datos desde una API
		// Por ahora, simulamos la carga con un timeout
		setLoading(true);

		// Simulación de carga de datos
		const loadData = setTimeout(() => {
			// Aquí podríamos obtener los datos desde una API
			// Por ahora, usamos los datos de ejemplo
			setAvailableCalculations([
				// Aquí irían datos de ejemplo que normalmente vendrían de la API
			]);
			setLoading(false);
		}, 500);

		return () => clearTimeout(loadData);
	}, []);

	// Notificar cambios en la selección
	useEffect(() => {
		if (onSelectionChange) {
			onSelectionChange(selectedCalculations);
		}
	}, [selectedCalculations, onSelectionChange]);

	// Filtrar cálculos disponibles
	const filteredCalculations = useMemo(() => {
		return availableCalculations.filter((calc) => {
			const matchesSearch =
				calc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				calc.templateName.toLowerCase().includes(searchTerm.toLowerCase());

			const matchesCategory =
				!filterCategory || calc.templateCategory === filterCategory;

			const matchesCompliance =
				!filterCompliance || calc.compliance.status === filterCompliance;

			const notSelected = !selectedCalculations.find(
				(selected) => selected.id === calc.id
			);

			return (
				matchesSearch && matchesCategory && matchesCompliance && notSelected
			);
		});
	}, [
		availableCalculations,
		searchTerm,
		filterCategory,
		filterCompliance,
		selectedCalculations,
	]);

	// Añadir un cálculo a la comparación
	const addCalculation = (calculation: CalculationResult) => {
		if (selectedCalculations.length < maxSelections) {
			setSelectedCalculations([...selectedCalculations, calculation]);
			return true;
		}
		return false;
	};

	// Eliminar un cálculo de la comparación
	const removeCalculation = (calculationId: string) => {
		setSelectedCalculations(
			selectedCalculations.filter((calc) => calc.id !== calculationId)
		);
	};

	// Convertir cálculo guardado a formato de comparación
	const convertSavedToComparison = (
		savedCalc: SavedCalculation
	): CalculationResult => {
		return {
			id: savedCalc.id,
			name: savedCalc.name,
			templateName: savedCalc.templateName,
			templateCategory: savedCalc.templateCategory,
			projectName: savedCalc.projectName,
			createdDate: savedCalc.createdAt,
			author: "No especificado", // No tenemos este dato en SavedCalculation
			necReference: savedCalc.necReference,
			parameters: {}, // No tenemos estos datos en SavedCalculation
			results: {
				primary: {
					label: "Resultado Principal",
					value: savedCalc.results.mainValue,
					unit: savedCalc.results.unit,
				},
				secondary: [], // No tenemos estos datos en SavedCalculation
			},
			compliance: {
				status:
					savedCalc.status === "completed"
						? "compliant"
						: savedCalc.status === "draft"
							? "warning"
							: "non-compliant",
				notes: [],
			},
			tags: savedCalc.tags,
		};
	};

	// Comparar valores numéricos
	const compareValues = (values: Array<string | number>) => {
		if (values.length < 2) return [];

		const numericValues = values.map((v) =>
			typeof v === "string" ? parseFloat(v.replace(/[^0-9.-]/g, "")) : v
		);
		const maxValue = Math.max(...numericValues);
		const minValue = Math.min(...numericValues);

		return numericValues.map((value) => {
			if (value === maxValue && maxValue !== minValue) return "highest";
			if (value === minValue && maxValue !== minValue) return "lowest";
			return "equal";
		});
	};

	// Formatear fecha
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("es-EC", {
			day: "2-digit",
			month: "short",
			year: "numeric",
		});
	};

	// Obtener información de categoría
	const getCategoryInfo = (category: string) => {
		return categories.find((cat) => cat.id === category) || categories[0];
	};

	// Obtener color para estado de cumplimiento
	const getComplianceColor = (status: string) => {
		switch (status) {
			case "compliant":
				return "text-green-600 bg-green-50";
			case "warning":
				return "text-yellow-600 bg-yellow-50";
			case "non-compliant":
				return "text-red-600 bg-red-50";
			default:
				return "text-gray-600 bg-gray-50";
		}
	};

	return {
		selectedCalculations,
		availableCalculations,
		filteredCalculations,
		loading,
		searchTerm,
		setSearchTerm,
		filterCategory,
		setFilterCategory,
		filterCompliance,
		setFilterCompliance,
		addCalculation,
		removeCalculation,
		convertSavedToComparison,
		compareValues,
		formatDate,
		getCategoryInfo,
		getComplianceColor,
		categories,
	};
};

export default useComparison;
