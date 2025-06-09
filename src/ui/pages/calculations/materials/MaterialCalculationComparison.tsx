// src/ui/pages/calculations/materials/MaterialCalculationComparison.tsx

import React, {useState, useEffect} from "react";
import {
	MaterialCalculationType,
	MATERIAL_CATEGORIES,
	MATERIAL_UI_CONFIG,
} from "../shared/types/material.types";
import type {MaterialCalculationResult} from "../shared/types/material.types";

interface MaterialCalculationComparisonProps {
	onNewComparison: () => void;
}

interface ComparisonSet {
	id: string;
	name: string;
	results: MaterialCalculationResult[];
	createdAt: string;
	notes?: string;
}

const MaterialCalculationComparison: React.FC<
	MaterialCalculationComparisonProps
> = ({onNewComparison}) => {
	const [selectedResults, setSelectedResults] = useState<
		MaterialCalculationResult[]
	>([]);
	const [availableResults, setAvailableResults] = useState<
		MaterialCalculationResult[]
	>([]);
	const [savedComparisons, setSavedComparisons] = useState<ComparisonSet[]>([]);
	const [activeView, setActiveView] = useState<"create" | "saved">("create");
	const [comparisonName, setComparisonName] = useState("");
	const [comparisonNotes, setComparisonNotes] = useState("");

	// Datos de ejemplo
	useEffect(() => {
		const mockResults: MaterialCalculationResult[] = [
			{
				id: "1",
				templateId: "t1",
				templateName: "Pared de Ladrillo King Kong",
				templateType: MaterialCalculationType.WALLS_MASONRY,
				inputParameters: {largo: 5, alto: 3, espesor: 0.15},
				results: {
					cantidadLadrillos: 600,
					cemento: 15.5,
					arena: 0.48,
					areaNeta: 15,
				},
				materialQuantities: [
					{
						materialType: "Ladrillo King Kong",
						quantity: 600,
						unit: "unidades",
						unitCost: 0.35,
						totalCost: 210,
					},
					{
						materialType: "Cemento",
						quantity: 15.5,
						unit: "kg",
						unitCost: 0.18,
						totalCost: 2.79,
					},
					{
						materialType: "Arena fina",
						quantity: 0.48,
						unit: "m³",
						unitCost: 25,
						totalCost: 12,
					},
				],
				totalCost: 224.79,
				executionTime: 150,
				wasSuccessful: true,
				createdAt: "2024-01-15T10:30:00Z",
				userId: "user1",
				isSaved: true,
				isShared: false,
			},
			{
				id: "2",
				templateId: "t2",
				templateName: "Pared de Bloque de Hormigón",
				templateType: MaterialCalculationType.WALLS_MASONRY,
				inputParameters: {largo: 5, alto: 3, espesor: 0.2},
				results: {
					cantidadBloques: 75,
					cemento: 12.8,
					arena: 0.35,
					areaNeta: 15,
				},
				materialQuantities: [
					{
						materialType: "Bloque de Hormigón 20cm",
						quantity: 75,
						unit: "unidades",
						unitCost: 1.2,
						totalCost: 90,
					},
					{
						materialType: "Cemento",
						quantity: 12.8,
						unit: "kg",
						unitCost: 0.18,
						totalCost: 2.3,
					},
					{
						materialType: "Arena gruesa",
						quantity: 0.35,
						unit: "m³",
						unitCost: 28,
						totalCost: 9.8,
					},
				],
				totalCost: 102.1,
				executionTime: 145,
				wasSuccessful: true,
				createdAt: "2024-01-16T14:20:00Z",
				userId: "user1",
				isSaved: true,
				isShared: false,
			},
			{
				id: "3",
				templateId: "t3",
				templateName: "Pared de Ladrillo Pandereta",
				templateType: MaterialCalculationType.WALLS_MASONRY,
				inputParameters: {largo: 5, alto: 3, espesor: 0.09},
				results: {
					cantidadLadrillos: 525,
					cemento: 10.2,
					arena: 0.32,
					areaNeta: 15,
				},
				materialQuantities: [
					{
						materialType: "Ladrillo Pandereta",
						quantity: 525,
						unit: "unidades",
						unitCost: 0.28,
						totalCost: 147,
					},
					{
						materialType: "Cemento",
						quantity: 10.2,
						unit: "kg",
						unitCost: 0.18,
						totalCost: 1.84,
					},
					{
						materialType: "Arena fina",
						quantity: 0.32,
						unit: "m³",
						unitCost: 25,
						totalCost: 8,
					},
				],
				totalCost: 156.84,
				executionTime: 140,
				wasSuccessful: true,
				createdAt: "2024-01-17T09:15:00Z",
				userId: "user1",
				isSaved: true,
				isShared: false,
			},
		];

		setAvailableResults(mockResults);

		const mockComparisons: ComparisonSet[] = [
			{
				id: "comp1",
				name: "Comparación de Tipos de Pared",
				results: mockResults,
				createdAt: "2024-01-18T11:00:00Z",
				notes:
					"Análisis de diferentes opciones para pared de 15m² en proyecto residencial",
			},
		];

		setSavedComparisons(mockComparisons);
	}, []);

	const handleAddResult = (result: MaterialCalculationResult) => {
		if (selectedResults.length >= 4) {
			alert("Máximo 4 cálculos por comparación");
			return;
		}

		if (selectedResults.find((r) => r.id === result.id)) {
			alert("Este cálculo ya está en la comparación");
			return;
		}

		setSelectedResults((prev) => [...prev, result]);
	};

	const handleRemoveResult = (resultId: string) => {
		setSelectedResults((prev) => prev.filter((r) => r.id !== resultId));
	};

	const saveComparison = () => {
		if (!comparisonName.trim() || selectedResults.length < 2) {
			alert("Se necesita un nombre y al menos 2 cálculos para guardar");
			return;
		}

		const newComparison: ComparisonSet = {
			id: Date.now().toString(),
			name: comparisonName,
			results: selectedResults,
			createdAt: new Date().toISOString(),
			notes: comparisonNotes,
		};

		setSavedComparisons((prev) => [...prev, newComparison]);
		setComparisonName("");
		setComparisonNotes("");
		alert("Comparación guardada exitosamente");
	};

	const ResultCard: React.FC<{
		result: MaterialCalculationResult;
		onAdd?: () => void;
		onRemove?: () => void;
		isSelected?: boolean;
	}> = ({result, onAdd, onRemove, isSelected}) => {
		const categoryConfig = MATERIAL_CATEGORIES[result.templateType];

		return (
			<div
				className={`
        bg-white dark:bg-gray-800 rounded-lg border p-4
        ${
					isSelected
						? "border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800"
						: "border-gray-200 dark:border-gray-700"
				}
        ${MATERIAL_UI_CONFIG.cardHover} ${MATERIAL_UI_CONFIG.defaultTransition}
      `}
			>
				<div className="flex items-start justify-between mb-3">
					<div className="flex items-center space-x-3">
						<div
							className={`
              w-8 h-8 rounded-lg flex items-center justify-center text-sm
              ${categoryConfig.color} bg-opacity-20
            `}
						>
							{categoryConfig.icon}
						</div>
						<div>
							<h4 className="font-medium text-gray-900 dark:text-white text-sm">
								{result.templateName}
							</h4>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								{new Date(result.createdAt).toLocaleDateString()}
							</p>
						</div>
					</div>

					{onAdd && (
						<button
							onClick={onAdd}
							className="p-1 text-blue-600 hover:text-blue-700 transition-colors"
						>
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 4v16m8-8H4"
								/>
							</svg>
						</button>
					)}

					{onRemove && (
						<button
							onClick={onRemove}
							className="p-1 text-red-600 hover:text-red-700 transition-colors"
						>
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					)}
				</div>

				<div className="grid grid-cols-2 gap-2 text-xs">
					{Object.entries(result.results)
						.slice(0, 4)
						.map(([key, value]) => (
							<div
								key={key}
								className="bg-gray-50 dark:bg-gray-700 rounded p-2"
							>
								<div className="text-gray-600 dark:text-gray-400 truncate">
									{key}
								</div>
								<div className="font-medium text-gray-900 dark:text-white">
									{typeof value === "number" ? value.toLocaleString() : value}
								</div>
							</div>
						))}
				</div>

				{result.totalCost && (
					<div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
						<div className="flex justify-between items-center">
							<span className="text-sm text-gray-600 dark:text-gray-400">
								Total:
							</span>
							<span className="font-semibold text-green-600 dark:text-green-400">
								${result.totalCost.toFixed(2)}
							</span>
						</div>
					</div>
				)}
			</div>
		);
	};

	const ComparisonTable: React.FC<{results: MaterialCalculationResult[]}> = ({
		results,
	}) => {
		if (results.length === 0) return null;

		// Obtener todas las claves de resultados únicas
		const allKeys = Array.from(
			new Set(results.flatMap((r) => Object.keys(r.results)))
		);

		return (
			<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
				<div className="bg-gray-50 dark:bg-gray-700 px-6 py-4">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
						Tabla Comparativa
					</h3>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50 dark:bg-gray-700">
							<tr>
								<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
									Concepto
								</th>
								{results.map((result, index) => (
									<th
										key={result.id}
										className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
									>
										Opción {index + 1}
									</th>
								))}
							</tr>
						</thead>
						<tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
							<tr className="bg-blue-50 dark:bg-blue-900/20">
								<td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
									Plantilla
								</td>
								{results.map((result) => (
									<td
										key={result.id}
										className="px-4 py-3 text-sm text-center text-gray-900 dark:text-white"
									>
										{result.templateName}
									</td>
								))}
							</tr>

							{allKeys.map((key) => (
								<tr key={key}>
									<td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
										{key}
									</td>
									{results.map((result) => (
										<td
											key={result.id}
											className="px-4 py-3 text-sm text-center text-gray-900 dark:text-white"
										>
											{result.results[key] !== undefined
												? typeof result.results[key] === "number"
													? result.results[key].toLocaleString()
													: result.results[key]
												: "-"}
										</td>
									))}
								</tr>
							))}

							<tr className="bg-green-50 dark:bg-green-900/20 font-semibold">
								<td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
									Costo Total
								</td>
								{results.map((result) => (
									<td
										key={result.id}
										className="px-4 py-3 text-sm text-center text-green-600 dark:text-green-400"
									>
										{result.totalCost ? `$${result.totalCost.toFixed(2)}` : "-"}
									</td>
								))}
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		);
	};

	const CostComparisonChart: React.FC<{
		results: MaterialCalculationResult[];
	}> = ({results}) => {
		if (results.length === 0) return null;

		const maxCost = Math.max(...results.map((r) => r.totalCost || 0));

		return (
			<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
				<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
					Comparación de Costos
				</h3>

				<div className="space-y-4">
					{results.map((result, index) => (
						<div key={result.id}>
							<div className="flex items-center justify-between mb-2">
								<span className="text-sm font-medium text-gray-900 dark:text-white">
									{result.templateName}
								</span>
								<span className="text-sm font-semibold text-gray-900 dark:text-white">
									${result.totalCost?.toFixed(2) || "0.00"}
								</span>
							</div>

							<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
								<div
									className={`h-3 rounded-full transition-all duration-500 ${
										index === 0
											? "bg-blue-600"
											: index === 1
												? "bg-green-600"
												: index === 2
													? "bg-purple-600"
													: "bg-orange-600"
									}`}
									style={{
										width: `${((result.totalCost || 0) / maxCost) * 100}%`,
									}}
								/>
							</div>

							<div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
								<span>
									{result.totalCost
										? `${(((result.totalCost || 0) / maxCost) * 100).toFixed(1)}%`
										: "0%"}{" "}
									del máximo
								</span>
								<span>
									{index ===
										results.findIndex(
											(r) =>
												r.totalCost ===
												Math.min(
													...results.map((res) => res.totalCost || Infinity)
												)
										) && "🏆 Más económico"}
								</span>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
				<div className="flex items-center justify-between mb-4">
					<div>
						<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
							Comparador de Cálculos
						</h1>
						<p className="text-gray-600 dark:text-gray-300 mt-1">
							Compara diferentes opciones de materiales lado a lado
						</p>
					</div>

					<button
						onClick={onNewComparison}
						className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
					>
						Nueva Comparación
					</button>
				</div>

				{/* Tabs */}
				<div className="flex space-x-6 border-b border-gray-200 dark:border-gray-700">
					{[
						{id: "create", label: "Crear Comparación", icon: "🆕"},
						{id: "saved", label: "Comparaciones Guardadas", icon: "💾"},
					].map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveView(tab.id as any)}
							className={`
                flex items-center space-x-2 pb-4 border-b-2 font-medium transition-colors
                ${
									activeView === tab.id
										? "border-blue-500 text-blue-600 dark:text-blue-400"
										: "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
								}
              `}
						>
							<span>{tab.icon}</span>
							<span>{tab.label}</span>
						</button>
					))}
				</div>
			</div>

			{activeView === "create" && (
				<>
					{/* Selección de cálculos */}
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						{/* Lista de cálculos disponibles */}
						<div className="lg:col-span-1">
							<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
								<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
									Cálculos Disponibles
								</h3>

								<div className="space-y-3 max-h-96 overflow-y-auto">
									{availableResults
										.filter(
											(result) =>
												!selectedResults.find((s) => s.id === result.id)
										)
										.map((result) => (
											<ResultCard
												key={result.id}
												result={result}
												onAdd={() => handleAddResult(result)}
											/>
										))}
								</div>
							</div>
						</div>

						{/* Cálculos seleccionados */}
						<div className="lg:col-span-2">
							<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
								<div className="flex items-center justify-between mb-4">
									<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
										Comparación Actual ({selectedResults.length}/4)
									</h3>

									{selectedResults.length >= 2 && (
										<div className="flex items-center space-x-3">
											<input
												type="text"
												placeholder="Nombre de la comparación"
												value={comparisonName}
												onChange={(e) => setComparisonName(e.target.value)}
												className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
											/>
											<button
												onClick={saveComparison}
												className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
											>
												Guardar
											</button>
										</div>
									)}
								</div>

								{selectedResults.length === 0 ? (
									<div className="text-center py-12 text-gray-500 dark:text-gray-400">
										<div className="text-4xl mb-2">📊</div>
										<p>Selecciona al menos 2 cálculos para comparar</p>
									</div>
								) : (
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{selectedResults.map((result) => (
											<ResultCard
												key={result.id}
												result={result}
												onRemove={() => handleRemoveResult(result.id)}
												isSelected={true}
											/>
										))}
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Comparación visual */}
					{selectedResults.length >= 2 && (
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							<ComparisonTable results={selectedResults} />
							<CostComparisonChart results={selectedResults} />
						</div>
					)}

					{/* Notas */}
					{selectedResults.length >= 2 && (
						<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
								Notas y Observaciones
							</h3>
							<textarea
								value={comparisonNotes}
								onChange={(e) => setComparisonNotes(e.target.value)}
								placeholder="Agrega notas sobre esta comparación..."
								rows={4}
								className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
					)}
				</>
			)}

			{activeView === "saved" && (
				<div>
					{savedComparisons.length === 0 ? (
						<div className="text-center py-20">
							<div className="text-6xl mb-4">💾</div>
							<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
								No hay comparaciones guardadas
							</h3>
							<p className="text-gray-600 dark:text-gray-300">
								Crea tu primera comparación para verla aquí
							</p>
						</div>
					) : (
						<div className="space-y-6">
							{savedComparisons.map((comparison) => (
								<div
									key={comparison.id}
									className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
								>
									<div className="flex items-start justify-between mb-4">
										<div>
											<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
												{comparison.name}
											</h3>
											<p className="text-sm text-gray-500 dark:text-gray-400">
												{new Date(comparison.createdAt).toLocaleDateString()} •{" "}
												{comparison.results.length} opciones
											</p>
											{comparison.notes && (
												<p className="text-gray-600 dark:text-gray-300 mt-2">
													{comparison.notes}
												</p>
											)}
										</div>

										<div className="flex items-center space-x-2">
											<button
												onClick={() => {
													setSelectedResults(comparison.results);
													setActiveView("create");
												}}
												className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
											>
												Ver Comparación
											</button>
											<button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
												<svg
													className="w-5 h-5"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
													/>
												</svg>
											</button>
										</div>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
										{comparison.results.map((result) => (
											<ResultCard key={result.id} result={result} />
										))}
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default MaterialCalculationComparison;
