import React, {useState, useEffect} from "react";
import {
	DocumentArrowDownIcon,
	ChartBarIcon,
	BookOpenIcon,
	ShareIcon,
	BeakerIcon,
	CalculatorIcon,
} from "@heroicons/react/24/outline";
import {Link} from "react-router-dom";

// Importar componentes personalizados
import ComparisonSelector from "./components/ComparisonSelector";
import ComparisonTable from "./components/ComparisonTable";
import ResultsChart from "./components/ResultsChart";

// Importar hook personalizado
import useComparison from "../shared/hooks/useComparison";
import type {CalculationResult} from "../shared/hooks/useComparison";

// Datos de ejemplo (para la demo)
const mockCalculations: CalculationResult[] = [
	{
		id: "calc-001",
		name: "Demanda Eléctrica - Casa Modelo A",
		templateName: "Demanda Eléctrica Residencial",
		templateCategory: "electrical",
		projectName: "Urbanización Los Álamos",
		createdDate: "2024-03-15T10:30:00Z",
		author: "Ing. Carlos Mendoza",
		necReference: "NEC-SB-IE 1.1",
		parameters: {
			houseArea: {value: 150, unit: "m²", label: "Área de vivienda"},
			lightingCircuits: {value: 3, unit: "und", label: "Circuitos iluminación"},
			outletCircuits: {
				value: 4,
				unit: "und",
				label: "Circuitos tomacorrientes",
			},
			specialLoads: {value: 2000, unit: "W", label: "Cargas especiales"},
		},
		results: {
			primary: {label: "Demanda Total", value: "8,450", unit: "W"},
			secondary: [
				{label: "Corriente Total", value: "38.4", unit: "A"},
				{label: "Factor de Demanda", value: "0.65"},
				{label: "Tablero Recomendado", value: "50", unit: "A"},
			],
		},
		compliance: {
			status: "compliant",
			notes: ["Cumple con factores de demanda NEC", "Dimensionamiento seguro"],
		},
		tags: ["residencial", "estándar", "unifamiliar"],
	},
	{
		id: "calc-002",
		name: "Demanda Eléctrica - Casa Modelo B",
		templateName: "Demanda Eléctrica Residencial",
		templateCategory: "electrical",
		projectName: "Urbanización Los Álamos",
		createdDate: "2024-03-15T14:20:00Z",
		author: "Ing. Carlos Mendoza",
		necReference: "NEC-SB-IE 1.1",
		parameters: {
			houseArea: {value: 200, unit: "m²", label: "Área de vivienda"},
			lightingCircuits: {value: 4, unit: "und", label: "Circuitos iluminación"},
			outletCircuits: {
				value: 6,
				unit: "und",
				label: "Circuitos tomacorrientes",
			},
			specialLoads: {value: 3500, unit: "W", label: "Cargas especiales"},
		},
		results: {
			primary: {label: "Demanda Total", value: "11,850", unit: "W"},
			secondary: [
				{label: "Corriente Total", value: "53.9", unit: "A"},
				{label: "Factor de Demanda", value: "0.58"},
				{label: "Tablero Recomendado", value: "70", unit: "A"},
			],
		},
		compliance: {
			status: "compliant",
			notes: ["Cumple con factores de demanda NEC", "Requiere conductor 6 AWG"],
		},
		tags: ["residencial", "ampliada", "cargas_especiales"],
	},
	{
		id: "calc-003",
		name: "Viga Principal - Opción Conservadora",
		templateName: "Diseño de Vigas de Hormigón Armado",
		templateCategory: "structural",
		projectName: "Torre Residencial Centro",
		createdDate: "2024-03-14T16:10:00Z",
		author: "Ing. María Vásquez",
		necReference: "NEC-SE-HM 9.2",
		parameters: {
			beamWidth: {value: 30, unit: "cm", label: "Ancho de viga"},
			beamHeight: {value: 60, unit: "cm", label: "Altura de viga"},
			concreteStrength: {value: 28, unit: "MPa", label: "f'c hormigón"},
			steelGrade: {value: 420, unit: "MPa", label: "fy acero"},
		},
		results: {
			primary: {label: "Refuerzo Requerido", value: "4φ20 + 2φ16", unit: ""},
			secondary: [
				{label: "Área de Acero", value: "15.6", unit: "cm²"},
				{label: "Cuantía", value: "0.87", unit: "%"},
				{label: "Momento Resistente", value: "285", unit: "kN·m"},
			],
		},
		compliance: {
			status: "compliant",
			notes: [
				"Diseño cumple con cuantías mínimas",
				"Factor de seguridad adecuado",
			],
		},
		tags: ["estructural", "conservador", "residencial"],
	},
	{
		id: "calc-004",
		name: "Viga Principal - Opción Optimizada",
		templateName: "Diseño de Vigas de Hormigón Armado",
		templateCategory: "structural",
		projectName: "Torre Residencial Centro",
		createdDate: "2024-03-14T17:25:00Z",
		author: "Ing. María Vásquez",
		necReference: "NEC-SE-HM 9.2",
		parameters: {
			beamWidth: {value: 25, unit: "cm", label: "Ancho de viga"},
			beamHeight: {value: 65, unit: "cm", label: "Altura de viga"},
			concreteStrength: {value: 32, unit: "MPa", label: "f'c hormigón"},
			steelGrade: {value: 420, unit: "MPa", label: "fy acero"},
		},
		results: {
			primary: {label: "Refuerzo Requerido", value: "3φ20 + 2φ16", unit: ""},
			secondary: [
				{label: "Área de Acero", value: "13.4", unit: "cm²"},
				{label: "Cuantía", value: "0.83", unit: "%"},
				{label: "Momento Resistente", value: "295", unit: "kN·m"},
			],
		},
		compliance: {
			status: "compliant",
			notes: [
				"Diseño optimizado",
				"Menor uso de materiales",
				"Cumple normativa",
			],
		},
		tags: ["estructural", "optimizado", "eficiente"],
	},
];

const CalculationComparison: React.FC = () => {
	// Usar nuestro hook personalizado para manejar la comparación
	const {
		selectedCalculations,
		addCalculation,
		removeCalculation,
		compareValues,
		formatDate,
		getCategoryInfo,
		getComplianceColor,
	} = useComparison({
		maxSelections: 4,
		initialCalculations: [mockCalculations[0], mockCalculations[1]],
	});

	// Estado para mostrar/ocultar el selector de guardados
	const [showSavedSelector, setShowSavedSelector] = useState(false);

	// Simular carga de datos disponibles (en un caso real se obtendría de una API)
	useEffect(() => {
		// Simular una carga de datos
		setTimeout(() => {
			// Aquí cargaríamos los datos de la API
		}, 500);
	}, []);

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white border-b border-gray-200">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
						<div>
							<h1 className="text-3xl font-bold text-gray-900 tracking-tight">
								Comparación de Cálculos
							</h1>
							<p className="text-gray-600 mt-1">
								Analiza y compara diferentes cálculos técnicos lado a lado
							</p>
						</div>

						<div className="flex items-center gap-3">
							<button
								onClick={() => setShowSavedSelector(true)}
								className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
							>
								<CalculatorIcon className="h-4 w-4" />
								Mis Cálculos
							</button>
							<button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
								<DocumentArrowDownIcon className="h-4 w-4" />
								Exportar Comparación
							</button>
							<button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2">
								<ShareIcon className="h-4 w-4" />
								Compartir
							</button>
						</div>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Selector de cálculos */}
				<ComparisonSelector
					selectedCalculations={selectedCalculations}
					availableCalculations={mockCalculations}
					addCalculation={addCalculation}
					removeCalculation={removeCalculation}
					formatDate={formatDate}
					getCategoryInfo={getCategoryInfo}
					getComplianceColor={getComplianceColor}
					maxSelections={4}
				/>

				{/* Comparaciones */}
				{selectedCalculations.length >= 2 ? (
					<>
						{/* Gráfico de resultados primarios */}
						<ResultsChart
							calculations={selectedCalculations}
							compareValues={compareValues}
						/>

						{/* Tabla de parámetros */}
						<ComparisonTable
							calculations={selectedCalculations}
							title="Comparación de Parámetros"
							icon={BeakerIcon}
							dataType="parameters"
							compareValues={compareValues}
						/>

						{/* Tabla de resultados secundarios */}
						<ComparisonTable
							calculations={selectedCalculations}
							title="Comparación de Resultados"
							icon={ChartBarIcon}
							dataType="results"
							compareValues={compareValues}
						/>

						{/* Resumen de cumplimiento normativo */}
						<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
							<h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
								<BookOpenIcon className="h-6 w-6 text-primary-600" />
								Cumplimiento Normativo
							</h3>

							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
								{selectedCalculations.map((calc, index) => (
									<div
										key={calc.id}
										className={`p-4 rounded-lg border ${getComplianceColor(calc.compliance.status)} border-current`}
									>
										<div className="text-center mb-3">
											<div className="text-sm font-medium text-gray-600 mb-1">
												Cálculo {index + 1}
											</div>
											<div
												className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getComplianceColor(
													calc.compliance.status
												)}`}
											>
												<span className="capitalize">
													{calc.compliance.status === "compliant" && "Cumple"}
													{calc.compliance.status === "warning" &&
														"Advertencia"}
													{calc.compliance.status === "non-compliant" &&
														"No Cumple"}
												</span>
											</div>
										</div>

										<div className="space-y-1">
											{calc.compliance.notes.map((note, noteIndex) => (
												<div key={noteIndex} className="text-xs text-gray-600">
													• {note}
												</div>
											))}
										</div>

										<div className="mt-3 pt-3 border-t border-current border-opacity-20">
											<div className="text-xs text-gray-600 text-center">
												{calc.necReference}
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</>
				) : (
					// Estado cuando no hay suficientes cálculos
					<div className="text-center py-16">
						<div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<CalculatorIcon className="h-12 w-12 text-gray-400" />
						</div>
						<h3 className="text-lg font-medium text-gray-900 mb-2">
							Selecciona al menos 2 cálculos para comparar
						</h3>
						<p className="text-gray-600 mb-6">
							Agrega cálculos para ver una comparación detallada de parámetros y
							resultados.
						</p>
						<button
							onClick={() => setShowSavedSelector(true)}
							className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2 mx-auto"
						>
							<CalculatorIcon className="h-4 w-4" />
							Explorar Mis Cálculos
						</button>
					</div>
				)}
			</div>

			{/* Modal de selección de cálculos guardados (se implementaría con SavedCalculations.tsx) */}
			{showSavedSelector && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
						<div className="border-b border-gray-200 p-6">
							<div className="flex items-center justify-between">
								<h3 className="text-xl font-semibold text-gray-900">
									Seleccionar desde Mis Cálculos Guardados
								</h3>
								<button
									onClick={() => setShowSavedSelector(false)}
									className="p-2 hover:bg-gray-100 rounded-full transition-colors"
								>
									<ChartBarIcon className="h-5 w-5 text-gray-500" />
								</button>
							</div>
						</div>

						<div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
							<div className="text-center py-12">
								<CalculatorIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
								<h3 className="text-lg font-medium text-gray-900 mb-2">
									Integración con Mis Cálculos
								</h3>
								<p className="text-gray-600 mb-6">
									Aquí se integraría el componente SavedCalculations para
									seleccionar cálculos guardados para comparar.
								</p>
								<Link
									to="/calculations/comparison/saved"
									className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors inline-block"
								>
									Ver Mis Cálculos Guardados
								</Link>
							</div>
						</div>

						<div className="border-t border-gray-200 p-6 flex justify-end gap-3">
							<button
								onClick={() => setShowSavedSelector(false)}
								className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
							>
								Cancelar
							</button>
							<button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
								Agregar Seleccionados
							</button>
						</div>
					</div>
				</div>
			)}

			<style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
		</div>
	);
};

export default CalculationComparison;
