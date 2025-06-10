// src/ui/pages/calculations/materials/MaterialCalculationComparison.tsx
import React, {useState, useEffect} from "react";
import {
	PlusIcon,
	XMarkIcon,
	ArrowsRightLeftIcon,
	DocumentTextIcon,
	ShareIcon,
	ArrowDownTrayIcon,
	CheckCircleIcon,
	ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import {useMaterialResults} from "../shared/hooks/useMaterialCalculations";
import type {
	MaterialCalculationResult,
} from "../shared/types/material.types";

interface ComparisonItem {
	id: string;
	result: MaterialCalculationResult;
	color: string;
}

const COMPARISON_COLORS = [
	"bg-blue-500",
	"bg-emerald-500",
	"bg-amber-500",
	"bg-purple-500",
];

const MaterialCalculationComparison: React.FC = () => {
	const [results, setResults] = useState<CalculationHistory[]>([]);
	const {isLoading, error, getResults} = useMaterialResults();	const [comparisonItems, setComparisonItems] = useState<ComparisonItem[]>([]);
	const [showResultSelector, setShowResultSelector] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredResults, setFilteredResults] = useState<
		MaterialCalculationResult[]
	>([]);

	useEffect(() => {
		const loadResults = async () => {
			try {
				const data = await getResults();
				setResults(data);
			} catch (err) {
				console.error("Error loading results:", err);
			}
		};

		loadResults();
	}, [getResults]);

	useEffect(() => {
		if (!searchTerm) {
			setFilteredResults(results);
		} else {
			const filtered = results.filter(
				(result) =>
					result.templateName
						.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					result.notes?.toLowerCase().includes(searchTerm.toLowerCase())
			);
			setFilteredResults(filtered);
		}
	}, [searchTerm, results]);

	const addToComparison = (result: MaterialCalculationResult) => {
		if (comparisonItems.length >= 4) {
			alert("Solo puedes comparar hasta 4 cálculos a la vez");
			return;
		}

		if (comparisonItems.some((item) => item.id === result.id)) {
			alert("Este cálculo ya está en la comparación");
			return;
		}

		const newItem: ComparisonItem = {
			id: result.id,
			result,
			color: COMPARISON_COLORS[comparisonItems.length],
		};

		setComparisonItems([...comparisonItems, newItem]);
		setShowResultSelector(false);
	};

	const removeFromComparison = (id: string) => {
		setComparisonItems(comparisonItems.filter((item) => item.id !== id));
	};

	const clearComparison = () => {
		setComparisonItems([]);
	};

	const formatDate = (date: string | Date) => {
		return new Intl.DateTimeFormat("es-EC", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		}).format(new Date(date));
	};

	const formatCurrency = (amount: number, currency: string) => {
		return new Intl.NumberFormat("es-EC", {
			style: "currency",
			currency: currency,
		}).format(amount);
	};

	const renderResultSelector = () => (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
				<div className="flex items-center justify-between p-6 border-b border-gray-200">
					<h2 className="text-lg font-semibold text-gray-900">
						Seleccionar Resultado para Comparar
					</h2>
					<button
						onClick={() => setShowResultSelector(false)}
						className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
					>
						<XMarkIcon className="h-5 w-5" />
					</button>
				</div>

				<div className="p-6">
					<div className="mb-4">
						<input
							type="text"
							placeholder="Buscar resultados..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
						/>
					</div>

					<div className="max-h-96 overflow-y-auto space-y-3">
						{filteredResults
							.filter((r) => r.wasSuccessful)
							.map((result) => (
								<div
									key={result.id}
									className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
									onClick={() => addToComparison(result)}
								>
									<div className="flex-1">
										<h3 className="font-medium text-gray-900">
											{result.templateName}
										</h3>
										<div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
											<span>{formatDate(result.createdAt)}</span>
											<span>{result.materialQuantities.length} materiales</span>
											{result.totalEstimatedCost && (
												<span>
													{formatCurrency(
														result.totalEstimatedCost,
														result.currency
													)}
												</span>
											)}
										</div>
									</div>
									<div className="flex items-center gap-2">
										{result.wasSuccessful ? (
											<CheckCircleIcon className="h-5 w-5 text-green-600" />
										) : (
											<ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
										)}
										<button className="px-3 py-1 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700">
											Seleccionar
										</button>
									</div>
								</div>
							))}
					</div>
				</div>
			</div>
		</div>
	);

	const renderComparisonHeader = () => (
		<div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
			<div className="flex items-center justify-between mb-4">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">
						Comparación de Cálculos
					</h1>
					<p className="text-gray-600 mt-1">
						Compara hasta 4 resultados de cálculos de materiales
					</p>
				</div>
				<div className="flex items-center gap-3">
					<button
						onClick={() => setShowResultSelector(true)}
						disabled={comparisonItems.length >= 4}
						className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						<PlusIcon className="h-4 w-4" />
						Agregar Resultado
					</button>
					{comparisonItems.length > 0 && (
						<button
							onClick={clearComparison}
							className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
						>
							Limpiar Todo
						</button>
					)}
				</div>
			</div>

			{comparisonItems.length > 0 && (
				<div className="flex flex-wrap gap-2">
					{comparisonItems.map((item) => (
						<div
							key={item.id}
							className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg"
						>
							<div className={`w-3 h-3 rounded-full ${item.color}`} />
							<span className="text-sm font-medium text-gray-900">
								{item.result.templateName}
							</span>
							<button
								onClick={() => removeFromComparison(item.id)}
								className="p-1 text-gray-500 hover:text-gray-700 rounded"
							>
								<XMarkIcon className="h-3 w-3" />
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	);

	const renderEmptyState = () => (
		<div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
			<ArrowsRightLeftIcon className="mx-auto h-16 w-16 text-gray-400" />
			<h3 className="mt-4 text-lg font-medium text-gray-900">
				Comenzar Comparación
			</h3>
			<p className="mt-2 text-gray-600 max-w-sm mx-auto">
				Selecciona al menos 2 resultados de cálculos para comenzar a compararlos
			</p>
			<button
				onClick={() => setShowResultSelector(true)}
				className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
			>
				<PlusIcon className="h-5 w-5" />
				Agregar Primer Resultado
			</button>
		</div>
	);

	const renderGeneralComparison = () => (
		<div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
			<h2 className="text-lg font-semibold text-gray-900 mb-6">
				Comparación General
			</h2>

			<div className="overflow-x-auto">
				<table className="w-full">
					<thead>
						<tr className="border-b border-gray-200">
							<th className="text-left py-3 px-4 font-medium text-gray-900">
								Aspecto
							</th>
							{comparisonItems.map((item, index) => (
								<th key={item.id} className="text-center py-3 px-4">
									<div className="flex items-center justify-center gap-2">
										<div className={`w-3 h-3 rounded-full ${item.color}`} />
										<span className="font-medium text-gray-900">
											#{index + 1}
										</span>
									</div>
								</th>
							))}
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200">
						<tr>
							<td className="py-3 px-4 font-medium text-gray-900">Plantilla</td>
							{comparisonItems.map((item) => (
								<td key={item.id} className="py-3 px-4 text-center text-sm">
									{item.result.templateName}
								</td>
							))}
						</tr>
						<tr>
							<td className="py-3 px-4 font-medium text-gray-900">Fecha</td>
							{comparisonItems.map((item) => (
								<td key={item.id} className="py-3 px-4 text-center text-sm">
									{formatDate(item.result.createdAt)}
								</td>
							))}
						</tr>
						<tr>
							<td className="py-3 px-4 font-medium text-gray-900">
								Tiempo de Ejecución
							</td>
							{comparisonItems.map((item) => (
								<td key={item.id} className="py-3 px-4 text-center text-sm">
									{item.result.executionTime}ms
								</td>
							))}
						</tr>
						<tr>
							<td className="py-3 px-4 font-medium text-gray-900">
								Cantidad de Materiales
							</td>
							{comparisonItems.map((item) => (
								<td key={item.id} className="py-3 px-4 text-center text-sm">
									{item.result.materialQuantities.length}
								</td>
							))}
						</tr>
						<tr>
							<td className="py-3 px-4 font-medium text-gray-900">
								Costo Total
							</td>
							{comparisonItems.map((item) => (
								<td
									key={item.id}
									className="py-3 px-4 text-center text-sm font-medium"
								>
									{item.result.totalEstimatedCost
										? formatCurrency(
												item.result.totalEstimatedCost,
												item.result.currency
											)
										: "N/A"}
								</td>
							))}
						</tr>
						<tr>
							<td className="py-3 px-4 font-medium text-gray-900">Región</td>
							{comparisonItems.map((item) => (
								<td
									key={item.id}
									className="py-3 px-4 text-center text-sm capitalize"
								>
									{item.result.regionalFactors}
								</td>
							))}
						</tr>
						<tr>
							<td className="py-3 px-4 font-medium text-gray-900">
								Desperdicios Incluidos
							</td>
							{comparisonItems.map((item) => (
								<td key={item.id} className="py-3 px-4 text-center text-sm">
									{item.result.includeWaste ? (
										<CheckCircleIcon className="h-5 w-5 text-green-600 mx-auto" />
									) : (
										<XMarkIcon className="h-5 w-5 text-red-600 mx-auto" />
									)}
								</td>
							))}
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);

	const renderMaterialComparison = () => {
		// Obtener todos los materiales únicos
		const allMaterials = new Set<string>();
		comparisonItems.forEach((item) => {
			item.result.materialQuantities.forEach((material) => {
				allMaterials.add(material.name);
			});
		});

		return (
			<div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
				<h2 className="text-lg font-semibold text-gray-900 mb-6">
					Comparación de Materiales
				</h2>

				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b border-gray-200">
								<th className="text-left py-3 px-4 font-medium text-gray-900">
									Material
								</th>
								{comparisonItems.map((item, index) => (
									<th key={item.id} className="text-center py-3 px-4">
										<div className="flex items-center justify-center gap-2">
											<div className={`w-3 h-3 rounded-full ${item.color}`} />
											<span className="font-medium text-gray-900">
												#{index + 1}
											</span>
										</div>
									</th>
								))}
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200">
							{Array.from(allMaterials).map((materialName) => (
								<tr key={materialName}>
									<td className="py-3 px-4 font-medium text-gray-900">
										{materialName}
									</td>
									{comparisonItems.map((item) => {
										const material = item.result.materialQuantities.find(
											(m) => m.name === materialName
										);
										return (
											<td
												key={item.id}
												className="py-3 px-4 text-center text-sm"
											>
												{material ? (
													<div>
														<p className="font-medium">
															{material.quantity} {material.unit}
														</p>
														{material.totalPrice && (
															<p className="text-xs text-gray-500">
																{formatCurrency(
																	material.totalPrice,
																	item.result.currency
																)}
															</p>
														)}
													</div>
												) : (
													<span className="text-gray-400">-</span>
												)}
											</td>
										);
									})}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		);
	};

	const renderParameterComparison = () => {
		// Obtener todos los parámetros únicos
		const allParameters = new Set<string>();
		comparisonItems.forEach((item) => {
			Object.keys(item.result.inputParameters).forEach((param) => {
				allParameters.add(param);
			});
		});

		return (
			<div className="bg-white rounded-xl border border-gray-200 p-6">
				<h2 className="text-lg font-semibold text-gray-900 mb-6">
					Comparación de Parámetros
				</h2>

				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b border-gray-200">
								<th className="text-left py-3 px-4 font-medium text-gray-900">
									Parámetro
								</th>
								{comparisonItems.map((item, index) => (
									<th key={item.id} className="text-center py-3 px-4">
										<div className="flex items-center justify-center gap-2">
											<div className={`w-3 h-3 rounded-full ${item.color}`} />
											<span className="font-medium text-gray-900">
												#{index + 1}
											</span>
										</div>
									</th>
								))}
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200">
							{Array.from(allParameters).map((paramName) => (
								<tr key={paramName}>
									<td className="py-3 px-4 font-medium text-gray-900 capitalize">
										{paramName.replace(/([A-Z])/g, " $1")}
									</td>
									{comparisonItems.map((item) => {
										const value = item.result.inputParameters[paramName];
										return (
											<td
												key={item.id}
												className="py-3 px-4 text-center text-sm"
											>
												{value !== undefined ? (
													String(value)
												) : (
													<span className="text-gray-400">-</span>
												)}
											</td>
										);
									})}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		);
	};

	const renderComparisonActions = () => (
		<div className="bg-white rounded-xl border border-gray-200 p-6">
			<h2 className="text-lg font-semibold text-gray-900 mb-4">
				Acciones de Comparación
			</h2>
			<div className="flex flex-wrap gap-3">
				<button className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors">
					<ShareIcon className="h-4 w-4" />
					Compartir Comparación
				</button>
				<button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
					<ArrowDownTrayIcon className="h-4 w-4" />
					Exportar a PDF
				</button>
				<button className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors">
					<DocumentTextIcon className="h-4 w-4" />
					Guardar Comparación
				</button>
			</div>
		</div>
	);

	if (loading) {
		return (
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex items-center justify-center h-64">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
					<p className="text-red-800">Error: {error}</p>
					<button
						onClick={() => fetchResults({})}
						className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
					>
						Reintentar
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			{renderComparisonHeader()}

			{comparisonItems.length === 0 ? (
				renderEmptyState()
			) : (
				<div className="space-y-6">
					{renderGeneralComparison()}
					{renderMaterialComparison()}
					{renderParameterComparison()}
					{renderComparisonActions()}
				</div>
			)}

			{showResultSelector && renderResultSelector()}
		</div>
	);
};

export default MaterialCalculationComparison;
