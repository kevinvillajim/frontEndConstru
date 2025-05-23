import React, {useState} from "react";
import {
	MagnifyingGlassIcon,
	PlusIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import type {CalculationResult} from "../../shared/hooks/useComparison";

interface ComparisonSelectorProps {
	selectedCalculations: CalculationResult[];
	availableCalculations: CalculationResult[];
	addCalculation: (calculation: CalculationResult) => boolean;
	removeCalculation: (calculationId: string) => void;
	formatDate: (dateString: string) => string;
	getCategoryInfo: (category: string) => {
		id: string;
		name: string;
		icon: string;
		color: string;
	};
	getComplianceColor: (status: string) => string;
	maxSelections?: number;
}

const ComparisonSelector: React.FC<ComparisonSelectorProps> = ({
	selectedCalculations,
	availableCalculations,
	addCalculation,
	removeCalculation,
	formatDate,
	getCategoryInfo,
	getComplianceColor,
	maxSelections = 4,
}) => {
	const [showSelector, setShowSelector] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [filterCategory, setFilterCategory] = useState<string>("");

	// Filtrar cálculos disponibles
	const filteredCalculations = availableCalculations.filter((calc) => {
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

	// Categorías para filtrar
	const categories = [
		{id: "", name: "Todas las categorías"},
		{id: "structural", name: "🏗️ Estructural"},
		{id: "electrical", name: "⚡ Eléctrico"},
		{id: "architectural", name: "🏛️ Arquitectónico"},
		{id: "hydraulic", name: "🚰 Hidráulico"},
	];

	// Manejar la selección de cálculo
	const handleSelect = (calculation: CalculationResult) => {
		if (addCalculation(calculation)) {
			setShowSelector(false);
		}
	};

	return (
		<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-xl font-semibold text-gray-900">
					Cálculos Seleccionados ({selectedCalculations.length}/{maxSelections})
				</h2>
				<button
					onClick={() => setShowSelector(true)}
					disabled={selectedCalculations.length >= maxSelections}
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
									<span>{formatDate(calc.createdDate)}</span>
								</div>

								<div className="flex items-center gap-1">
									<span>{calc.author}</span>
								</div>

								<div
									className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getComplianceColor(
										calc.compliance.status
									)}`}
								>
									<span className="capitalize">
										{calc.compliance.status === "compliant" && "Cumple"}
										{calc.compliance.status === "warning" && "Advertencia"}
										{calc.compliance.status === "non-compliant" && "No Cumple"}
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
				{selectedCalculations.length < maxSelections && (
					<button
						onClick={() => setShowSelector(true)}
						className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-gray-500 hover:border-primary-500 hover:text-primary-600 transition-colors flex flex-col items-center justify-center min-h-[200px]"
					>
						<PlusIcon className="h-8 w-8 mb-2" />
						<span className="text-sm font-medium">Agregar Cálculo</span>
					</button>
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
									{categories.map((cat) => (
										<option key={cat.id} value={cat.id}>
											{cat.name}
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
											onClick={() => handleSelect(calc)}
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
															<span className="capitalize">
																{calc.compliance.status === "compliant" &&
																	"Cumple"}
																{calc.compliance.status === "warning" &&
																	"Advertencia"}
																{calc.compliance.status === "non-compliant" &&
																	"No Cumple"}
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
		</div>
	);
};

export default ComparisonSelector;
