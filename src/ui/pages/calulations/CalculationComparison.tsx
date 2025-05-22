import React, {useState, useMemo} from "react";
import {
	MagnifyingGlassIcon,
	PlusIcon,
	XMarkIcon,
	DocumentArrowDownIcon,
	ChartBarIcon,
	ExclamationTriangleIcon,
	CheckIcon,
	ArrowUpIcon,
	ArrowDownIcon,
	BeakerIcon,
	CalculatorIcon,
	CalendarIcon,
	UserIcon,
	BookOpenIcon,
	ShareIcon,
} from "@heroicons/react/24/outline";

// Tipos de datos
interface CalculationResult {
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

// Datos de ejemplo
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
	const [selectedCalculations, setSelectedCalculations] = useState<
		CalculationResult[]
	>([mockCalculations[0], mockCalculations[1]]);
	const [availableCalculations] =
		useState<CalculationResult[]>(mockCalculations);
	const [showSelector, setShowSelector] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [filterCategory, setFilterCategory] = useState<string>("");

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

	const filteredCalculations = useMemo(() => {
		return availableCalculations.filter((calc) => {
			const matchesSearch =
				calc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				calc.templateName.toLowerCase().includes(searchTerm.toLowerCase());

			const matchesCategory =
				!filterCategory || calc.templateCategory === filterCategory;
			const notSelected = !selectedCalculations.find(
				(selected) => selected.id === calc.id
			);

			return matchesSearch && matchesCategory && notSelected;
		});
	}, [availableCalculations, searchTerm, filterCategory, selectedCalculations]);

	const addCalculation = (calculation: CalculationResult) => {
		if (selectedCalculations.length < 4) {
			setSelectedCalculations([...selectedCalculations, calculation]);
		}
		setShowSelector(false);
	};

	const removeCalculation = (calculationId: string) => {
		setSelectedCalculations(
			selectedCalculations.filter((calc) => calc.id !== calculationId)
		);
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("es-EC", {
			day: "2-digit",
			month: "short",
			year: "numeric",
		});
	};

	const getCategoryInfo = (category: string) => {
		return categories.find((cat) => cat.id === category) || categories[0];
	};

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

	// Análisis comparativo de parámetros
	const renderParameterComparison = () => {
		if (selectedCalculations.length < 2) return null;

		const allParameterKeys = Array.from(
			new Set(
				selectedCalculations.flatMap((calc) => Object.keys(calc.parameters))
			)
		);

		return (
			<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
				<h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
					<BeakerIcon className="h-6 w-6 text-primary-600" />
					Comparación de Parámetros
				</h3>

				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b border-gray-200">
								<th className="text-left py-3 px-4 font-medium text-gray-900">
									Parámetro
								</th>
								{selectedCalculations.map((calc, index) => (
									<th
										key={calc.id}
										className="text-center py-3 px-4 font-medium text-gray-900"
									>
										Cálculo {index + 1}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{allParameterKeys.map((paramKey) => {
								const values = selectedCalculations.map(
									(calc) => calc.parameters[paramKey]?.value || "-"
								);
								const comparisons = compareValues(
									values.filter((v) => v !== "-")
								);

								return (
									<tr
										key={paramKey}
										className="border-b border-gray-100 hover:bg-gray-50"
									>
										<td className="py-3 px-4 font-medium text-gray-700">
											{selectedCalculations.find(
												(calc) => calc.parameters[paramKey]
											)?.parameters[paramKey]?.label || paramKey}
										</td>
										{selectedCalculations.map((calc, index) => {
											const param = calc.parameters[paramKey];
											const comparison = comparisons[index];

											return (
												<td
													key={`${calc.id}-${paramKey}`}
													className="text-center py-3 px-4"
												>
													{param ? (
														<div
															className={`flex items-center justify-center gap-1 ${
																comparison === "highest"
																	? "text-green-600"
																	: comparison === "lowest"
																		? "text-red-600"
																		: "text-gray-700"
															}`}
														>
															<span className="font-medium">
																{param.value} {param.unit || ""}
															</span>
															{comparison === "highest" && (
																<ArrowUpIcon className="h-4 w-4" />
															)}
															{comparison === "lowest" && (
																<ArrowDownIcon className="h-4 w-4" />
															)}
														</div>
													) : (
														<span className="text-gray-400">-</span>
													)}
												</td>
											);
										})}
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
		);
	};

	// Análisis comparativo de resultados
	const renderResultsComparison = () => {
		if (selectedCalculations.length < 2) return null;

		const primaryValues = selectedCalculations.map(
			(calc) => calc.results.primary.value
		);
		const primaryComparisons = compareValues(primaryValues);

		// Obtener todas las claves de resultados secundarios
		const allSecondaryKeys = Array.from(
			new Set(
				selectedCalculations.flatMap((calc) =>
					calc.results.secondary.map((result) => result.label)
				)
			)
		);

		return (
			<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
				<h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
					<ChartBarIcon className="h-6 w-6 text-primary-600" />
					Comparación de Resultados
				</h3>

				{/* Resultado principal */}
				<div className="mb-6">
					<h4 className="text-lg font-medium text-gray-900 mb-4">
						Resultado Principal
					</h4>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						{selectedCalculations.map((calc, index) => {
							const comparison = primaryComparisons[index];

							return (
								<div
									key={calc.id}
									className={`p-4 rounded-lg border-2 ${
										comparison === "highest"
											? "border-green-200 bg-green-50"
											: comparison === "lowest"
												? "border-red-200 bg-red-50"
												: "border-gray-200 bg-gray-50"
									}`}
								>
									<div className="text-center">
										<div className="text-sm text-gray-600 mb-1">
											{calc.results.primary.label}
										</div>
										<div
											className={`text-2xl font-bold flex items-center justify-center gap-1 ${
												comparison === "highest"
													? "text-green-600"
													: comparison === "lowest"
														? "text-red-600"
														: "text-gray-900"
											}`}
										>
											<span>{calc.results.primary.value}</span>
											{comparison === "highest" && (
												<ArrowUpIcon className="h-5 w-5" />
											)}
											{comparison === "lowest" && (
												<ArrowDownIcon className="h-5 w-5" />
											)}
										</div>
										<div className="text-sm text-gray-500">
											{calc.results.primary.unit}
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>

				{/* Resultados secundarios */}
				<div>
					<h4 className="text-lg font-medium text-gray-900 mb-4">
						Resultados Secundarios
					</h4>
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b border-gray-200">
									<th className="text-left py-3 px-4 font-medium text-gray-900">
										Métrica
									</th>
									{selectedCalculations.map((calc, index) => (
										<th
											key={calc.id}
											className="text-center py-3 px-4 font-medium text-gray-900"
										>
											Cálculo {index + 1}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{allSecondaryKeys.map((resultKey) => {
									const values = selectedCalculations.map((calc) => {
										const result = calc.results.secondary.find(
											(r) => r.label === resultKey
										);
										return result?.value || "-";
									});
									const comparisons = compareValues(
										values.filter((v) => v !== "-")
									);

									return (
										<tr
											key={resultKey}
											className="border-b border-gray-100 hover:bg-gray-50"
										>
											<td className="py-3 px-4 font-medium text-gray-700">
												{resultKey}
											</td>
											{selectedCalculations.map((calc, index) => {
												const result = calc.results.secondary.find(
													(r) => r.label === resultKey
												);
												const comparison = comparisons[index];

												return (
													<td
														key={`${calc.id}-${resultKey}`}
														className="text-center py-3 px-4"
													>
														{result ? (
															<div
																className={`flex items-center justify-center gap-1 ${
																	comparison === "highest"
																		? "text-green-600"
																		: comparison === "lowest"
																			? "text-red-600"
																			: "text-gray-700"
																}`}
															>
																<span className="font-medium">
																	{result.value} {result.unit || ""}
																</span>
																{comparison === "highest" && (
																	<ArrowUpIcon className="h-4 w-4" />
																)}
																{comparison === "lowest" && (
																	<ArrowDownIcon className="h-4 w-4" />
																)}
															</div>
														) : (
															<span className="text-gray-400">-</span>
														)}
													</td>
												);
											})}
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		);
	};

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
				<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-xl font-semibold text-gray-900">
							Cálculos Seleccionados ({selectedCalculations.length}/4)
						</h2>
						<button
							onClick={() => setShowSelector(true)}
							disabled={selectedCalculations.length >= 4}
							className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
						>
							<PlusIcon className="h-4 w-4" />
							Agregar Cálculo
						</button>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						{selectedCalculations.map((calc, index) => {
							const categoryInfo = getCategoryInfo(calc.templateCategory);

							return (
								<div
									key={calc.id}
									className="border border-gray-200 rounded-xl p-4 relative group hover:shadow-lg transition-all duration-200"
								>
									<button
										onClick={() => removeCalculation(calc.id)}
										className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
									>
										<XMarkIcon className="h-4 w-4" />
									</button>

									<div className="mb-3">
										<div className="text-sm font-medium text-gray-500 mb-1">
											Cálculo {index + 1}
										</div>
										<h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
											{calc.name}
										</h3>
									</div>

									<div className="space-y-2 text-xs text-gray-600">
										<div className="flex items-center gap-1">
											<span className={categoryInfo.color}>
												{categoryInfo.icon}
											</span>
											<span>{categoryInfo.name}</span>
										</div>

										<div className="flex items-center gap-1">
											<CalendarIcon className="h-3 w-3" />
											<span>{formatDate(calc.createdDate)}</span>
										</div>

										<div className="flex items-center gap-1">
											<UserIcon className="h-3 w-3" />
											<span>{calc.author}</span>
										</div>

										<div
											className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getComplianceColor(
												calc.compliance.status
											)}`}
										>
											{calc.compliance.status === "compliant" && (
												<CheckIcon className="h-3 w-3" />
											)}
											{calc.compliance.status === "warning" && (
												<ExclamationTriangleIcon className="h-3 w-3" />
											)}
											{calc.compliance.status === "non-compliant" && (
												<XMarkIcon className="h-3 w-3" />
											)}
											<span className="capitalize">
												{calc.compliance.status.replace("-", " ")}
											</span>
										</div>
									</div>

									<div className="mt-3 pt-3 border-t border-gray-100">
										<div className="text-center">
											<div className="text-lg font-bold text-primary-700">
												{calc.results.primary.value}
											</div>
											<div className="text-xs text-gray-500">
												{calc.results.primary.unit}
											</div>
										</div>
									</div>
								</div>
							);
						})}

						{/* Placeholder para agregar más cálculos */}
						{selectedCalculations.length < 4 && (
							<button
								onClick={() => setShowSelector(true)}
								className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-gray-500 hover:border-primary-500 hover:text-primary-600 transition-colors flex flex-col items-center justify-center min-h-[200px]"
							>
								<PlusIcon className="h-8 w-8 mb-2" />
								<span className="text-sm font-medium">Agregar Cálculo</span>
							</button>
						)}
					</div>
				</div>

				{/* Comparaciones */}
				{selectedCalculations.length >= 2 && (
					<>
						{renderParameterComparison()}
						{renderResultsComparison()}

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
												{calc.compliance.status === "compliant" && (
													<CheckIcon className="h-4 w-4" />
												)}
												{calc.compliance.status === "warning" && (
													<ExclamationTriangleIcon className="h-4 w-4" />
												)}
												{calc.compliance.status === "non-compliant" && (
													<XMarkIcon className="h-4 w-4" />
												)}
												<span className="capitalize">
													{calc.compliance.status.replace("-", " ")}
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
				)}

				{/* Estado cuando no hay suficientes cálculos */}
				{selectedCalculations.length < 2 && (
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
							onClick={() => setShowSelector(true)}
							className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2 mx-auto"
						>
							<PlusIcon className="h-4 w-4" />
							Agregar Primer Cálculo
						</button>
					</div>
				)}
			</div>

			{/* Modal selector de cálculos */}
			{showSelector && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
						<div className="border-b border-gray-200 p-6">
							<div className="flex items-center justify-between">
								<h3 className="text-xl font-semibold text-gray-900">
									Seleccionar Cálculo para Comparar
								</h3>
								<button
									onClick={() => setShowSelector(false)}
									className="p-2 hover:bg-gray-100 rounded-full transition-colors"
								>
									<XMarkIcon className="h-5 w-5 text-gray-500" />
								</button>
							</div>

							<div className="flex gap-4 mt-4">
								<div className="flex-1">
									<div className="relative">
										<MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
										<input
											type="text"
											placeholder="Buscar cálculos..."
											value={searchTerm}
											onChange={(e) => setSearchTerm(e.target.value)}
											className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
										/>
									</div>
								</div>

								<select
									value={filterCategory}
									onChange={(e) => setFilterCategory(e.target.value)}
									className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
								>
									<option value="">Todas las categorías</option>
									{categories.map((cat) => (
										<option key={cat.id} value={cat.id}>
											{cat.icon} {cat.name}
										</option>
									))}
								</select>
							</div>
						</div>

						<div className="p-6 max-h-96 overflow-y-auto">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{filteredCalculations.map((calc) => {
									const categoryInfo = getCategoryInfo(calc.templateCategory);

									return (
										<div
											key={calc.id}
											onClick={() => addCalculation(calc)}
											className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200 cursor-pointer"
										>
											<div className="flex items-start justify-between mb-3">
												<div className="flex-1">
													<h4 className="font-semibold text-gray-900 mb-1">
														{calc.name}
													</h4>
													<p className="text-sm text-gray-600 mb-2">
														{calc.templateName}
													</p>
													<div className="flex items-center gap-2">
														<span className={`text-xs ${categoryInfo.color}`}>
															{categoryInfo.icon} {categoryInfo.name}
														</span>
														<div
															className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getComplianceColor(
																calc.compliance.status
															)}`}
														>
															{calc.compliance.status === "compliant" && (
																<CheckIcon className="h-3 w-3" />
															)}
															<span className="capitalize">
																{calc.compliance.status.replace("-", " ")}
															</span>
														</div>
													</div>
												</div>
											</div>

											<div className="flex items-center justify-between">
												<div className="text-sm text-gray-600">
													{formatDate(calc.createdDate)} • {calc.author}
												</div>
												<div className="text-right">
													<div className="font-bold text-primary-700">
														{calc.results.primary.value}
													</div>
													<div className="text-xs text-gray-500">
														{calc.results.primary.unit}
													</div>
												</div>
											</div>
										</div>
									);
								})}
							</div>

							{filteredCalculations.length === 0 && (
								<div className="text-center py-8 text-gray-500">
									No se encontraron cálculos disponibles para comparar.
								</div>
							)}
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
