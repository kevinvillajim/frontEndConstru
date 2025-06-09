// src/ui/pages/calculations/materials/MaterialResultsHistory.tsx

import React, {useState, useEffect} from "react";
import {
	MaterialCalculationType,
	MATERIAL_CATEGORIES,
	MATERIAL_UI_CONFIG,
} from "../shared/types/material.types";
import type {MaterialCalculationResult} from "../shared/types/material.types"
import {useMaterialResults} from "../shared/hooks/useMaterialCalculations";

interface MaterialResultsHistoryProps {
	onResultSelect: (result: MaterialCalculationResult) => void;
	onTemplateSelect: (templateId: string) => void;
}

const MaterialResultsHistory: React.FC<MaterialResultsHistoryProps> = ({
	onResultSelect,
	onTemplateSelect,
}) => {
	const [filters, setFilters] = useState({
		templateType: undefined as "official" | "user" | undefined,
		materialType: undefined as MaterialCalculationType | undefined,
		dateFrom: undefined as Date | undefined,
		dateTo: undefined as Date | undefined,
		isSaved: undefined as boolean | undefined,
		searchTerm: "",
	});

	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [sortBy, setSortBy] = useState<"date" | "name" | "cost">("date");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

	const {
		// results,
		loading,
		// error,
		// fetchUserResults,
		// toggleSaveResult,
		// toggleShareResult,
	} = useMaterialResults();

	// Datos de ejemplo para demostración
	const [mockResults, setMockResults] = useState<MaterialCalculationResult[]>([
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
			notes: "Cálculo para sala principal",
		},
		{
			id: "2",
			templateId: "t2",
			templateName: "Escalera de Hormigón 12 Peldaños",
			templateType: MaterialCalculationType.STAIRS,
			inputParameters: {huella: 30, contrahuella: 18, ancho: 120},
			results: {
				volumenHormigon: 2.35,
				acero: 28.5,
				encofrado: 15.2,
				peldanos: 12,
			},
			materialQuantities: [
				{
					materialType: "Hormigón f'c=210",
					quantity: 2.35,
					unit: "m³",
					unitCost: 120,
					totalCost: 282,
				},
				{
					materialType: "Acero de refuerzo",
					quantity: 28.5,
					unit: "kg",
					unitCost: 1.85,
					totalCost: 52.73,
				},
				{
					materialType: "Encofrado",
					quantity: 15.2,
					unit: "m²",
					unitCost: 12,
					totalCost: 182.4,
				},
			],
			totalCost: 517.13,
			executionTime: 180,
			wasSuccessful: true,
			createdAt: "2024-01-14T15:20:00Z",
			userId: "user1",
			isSaved: false,
			isShared: true,
			notes: "Escalera acceso segundo piso",
		},
		{
			id: "3",
			templateId: "t3",
			templateName: "Piso Cerámico 60x60cm",
			templateType: MaterialCalculationType.CERAMIC_FINISHES,
			inputParameters: {area: 25, dimensionPieza: "60x60", patron: "recto"},
			results: {
				cantidadPiezas: 72,
				adhesivo: 8.5,
				fragüe: 2.1,
				areaTotal: 25,
			},
			materialQuantities: [
				{
					materialType: "Cerámico 60x60cm",
					quantity: 72,
					unit: "piezas",
					unitCost: 4.5,
					totalCost: 324,
				},
				{
					materialType: "Adhesivo cerámico",
					quantity: 8.5,
					unit: "kg",
					unitCost: 1.2,
					totalCost: 10.2,
				},
				{
					materialType: "Fragüe",
					quantity: 2.1,
					unit: "kg",
					unitCost: 2.8,
					totalCost: 5.88,
				},
			],
			totalCost: 340.08,
			executionTime: 120,
			wasSuccessful: true,
			createdAt: "2024-01-12T09:45:00Z",
			userId: "user1",
			isSaved: true,
			isShared: false,
			notes: "Piso para área social",
		},
	]);

	useEffect(() => {
		// En implementación real, cargar desde API
		// fetchUserResults(filters);
	}, [filters]);

	const filteredResults = mockResults.filter((result) => {
		if (filters.templateType && result.templateType !== filters.templateType)
			return false;
		if (filters.materialType && result.templateType !== filters.materialType)
			return false;
		if (filters.isSaved !== undefined && result.isSaved !== filters.isSaved)
			return false;
		if (filters.searchTerm) {
			const searchLower = filters.searchTerm.toLowerCase();
			return (
				result.templateName.toLowerCase().includes(searchLower) ||
				result.notes?.toLowerCase().includes(searchLower)
			);
		}
		return true;
	});

	const sortedResults = [...filteredResults].sort((a, b) => {
		let comparison = 0;

		switch (sortBy) {
			case "date":
				comparison =
					new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
				break;
			case "name":
				comparison = a.templateName.localeCompare(b.templateName);
				break;
			case "cost":
				comparison = (a.totalCost || 0) - (b.totalCost || 0);
				break;
		}

		return sortOrder === "desc" ? -comparison : comparison;
	});

	const handleToggleSave = async (resultId: string, isSaved: boolean) => {
		setMockResults((prev) =>
			prev.map((r) => (r.id === resultId ? {...r, isSaved} : r))
		);
		// await toggleSaveResult(resultId, isSaved);
	};

	const handleDeleteResult = (resultId: string) => {
		if (confirm("¿Estás seguro de que quieres eliminar este resultado?")) {
			setMockResults((prev) => prev.filter((r) => r.id !== resultId));
		}
	};

	const ResultCard: React.FC<{result: MaterialCalculationResult}> = ({
		result,
	}) => {
		const categoryConfig = MATERIAL_CATEGORIES[result.templateType];

		return (
			<div
				className={`
        bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700
        ${MATERIAL_UI_CONFIG.cardHover} ${MATERIAL_UI_CONFIG.defaultTransition}
        cursor-pointer p-6 group
      `}
			>
				{/* Header */}
				<div className="flex items-start justify-between mb-4">
					<div className="flex items-center space-x-3">
						<div
							className={`
              w-12 h-12 rounded-lg flex items-center justify-center
              ${categoryConfig.color} bg-opacity-20 group-hover:bg-opacity-30 transition-all
            `}
						>
							<span className="text-2xl">{categoryConfig.icon}</span>
						</div>
						<div className="flex-1">
							<h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
								{result.templateName}
							</h3>
							<div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
								<span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700">
									{categoryConfig.name}
								</span>
								<span>•</span>
								<span>{new Date(result.createdAt).toLocaleDateString()}</span>
							</div>
						</div>
					</div>

					<div className="flex items-center space-x-2">
						<button
							onClick={(e) => {
								e.stopPropagation();
								handleToggleSave(result.id, !result.isSaved);
							}}
							className={`p-2 rounded-lg transition-colors ${
								result.isSaved
									? "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20"
									: "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
							}`}
						>
							<svg
								className="w-5 h-5"
								fill={result.isSaved ? "currentColor" : "none"}
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
								/>
							</svg>
						</button>

						<div className="relative group">
							<button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
								<svg
									className="w-5 h-5"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
								</svg>
							</button>

							<div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
								<div className="py-2">
									<button
										onClick={() => onResultSelect(result)}
										className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
									>
										Ver Detalles
									</button>
									<button
										onClick={() => onTemplateSelect(result.templateId)}
										className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
									>
										Usar Plantilla
									</button>
									<button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
										Duplicar Cálculo
									</button>
									<button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
										Exportar PDF
									</button>
									<hr className="my-1" />
									<button
										onClick={() => handleDeleteResult(result.id)}
										className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
									>
										Eliminar
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Content */}
				<div className="mb-4">
					{result.notes && (
						<p className="text-gray-600 dark:text-gray-300 text-sm mb-3 italic">
							"{result.notes}"
						</p>
					)}

					<div className="grid grid-cols-2 gap-3">
						{Object.entries(result.results)
							.slice(0, 4)
							.map(([key, value]) => (
								<div
									key={key}
									className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3"
								>
									<div className="text-xs text-gray-500 dark:text-gray-400 mb-1 truncate">
										{key}
									</div>
									<div className="font-medium text-gray-900 dark:text-white">
										{typeof value === "number" ? value.toLocaleString() : value}
									</div>
								</div>
							))}
					</div>
				</div>

				{/* Footer */}
				<div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
					<div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
						<div className="flex items-center space-x-1">
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<span>{result.executionTime}ms</span>
						</div>

						<div className="flex items-center space-x-1">
							<span
								className={`w-2 h-2 rounded-full ${result.wasSuccessful ? "bg-green-500" : "bg-red-500"}`}
							/>
							<span>{result.wasSuccessful ? "Exitoso" : "Error"}</span>
						</div>

						{result.isShared && (
							<div className="flex items-center space-x-1">
								<svg
									className="w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
									/>
								</svg>
								<span>Compartido</span>
							</div>
						)}
					</div>

					<div className="font-semibold text-green-600 dark:text-green-400">
						{result.totalCost ? `$${result.totalCost.toFixed(2)}` : "N/A"}
					</div>
				</div>
			</div>
		);
	};

	const FilterPanel: React.FC = () => (
		<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
			<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
				Filtros y Búsqueda
			</h3>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						Buscar
					</label>
					<input
						type="text"
						value={filters.searchTerm}
						onChange={(e) =>
							setFilters((prev) => ({...prev, searchTerm: e.target.value}))
						}
						placeholder="Buscar por nombre o notas..."
						className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						Categoría
					</label>
					<select
						value={filters.materialType || ""}
						onChange={(e) =>
							setFilters((prev) => ({
								...prev,
								materialType: (e.target.value as any) || undefined,
							}))
						}
						className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
					>
						<option value="">Todas las categorías</option>
						{Object.values(MaterialCalculationType).map((type) => (
							<option key={type} value={type}>
								{MATERIAL_CATEGORIES[type].name}
							</option>
						))}
					</select>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						Estado
					</label>
					<select
						value={
							filters.isSaved === undefined
								? ""
								: filters.isSaved
									? "saved"
									: "unsaved"
						}
						onChange={(e) => {
							const value = e.target.value;
							setFilters((prev) => ({
								...prev,
								isSaved: value === "" ? undefined : value === "saved",
							}));
						}}
						className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
					>
						<option value="">Todos</option>
						<option value="saved">Guardados</option>
						<option value="unsaved">No guardados</option>
					</select>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						Ordenar por
					</label>
					<div className="flex space-x-2">
						<select
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value as any)}
							className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
						>
							<option value="date">Fecha</option>
							<option value="name">Nombre</option>
							<option value="cost">Costo</option>
						</select>
						<button
							onClick={() =>
								setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
							}
							className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
						>
							{sortOrder === "asc" ? "↑" : "↓"}
						</button>
					</div>
				</div>
			</div>

			<div className="flex items-center justify-between">
				<div className="text-sm text-gray-600 dark:text-gray-400">
					{sortedResults.length} resultados encontrados
				</div>

				<div className="flex items-center space-x-3">
					<span className="text-sm text-gray-600 dark:text-gray-400">
						Vista:
					</span>
					<div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
						<button
							onClick={() => setViewMode("grid")}
							className={`p-2 ${viewMode === "grid" ? "bg-blue-600 text-white" : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"} transition-colors`}
						>
							<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
								<path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
							</svg>
						</button>
						<button
							onClick={() => setViewMode("list")}
							className={`p-2 ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"} transition-colors`}
						>
							<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
								<path
									fillRule="evenodd"
									d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
									clipRule="evenodd"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>
		</div>
	);

	if (loading) {
		return (
			<div className="flex items-center justify-center py-20">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
							Historial de Resultados
						</h1>
						<p className="text-gray-600 dark:text-gray-300 mt-1">
							Revisa y gestiona tus cálculos anteriores
						</p>
					</div>

					<div className="flex items-center space-x-3">
						<button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
							Exportar Todo
						</button>
						<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
							Nuevo Cálculo
						</button>
					</div>
				</div>
			</div>

			<FilterPanel />

			{/* Results */}
			{sortedResults.length === 0 ? (
				<div className="text-center py-20">
					<div className="text-6xl mb-4">📊</div>
					<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
						{filters.searchTerm ||
						filters.materialType ||
						filters.isSaved !== undefined
							? "No se encontraron resultados"
							: "No tienes cálculos aún"}
					</h3>
					<p className="text-gray-600 dark:text-gray-300 mb-6">
						{filters.searchTerm ||
						filters.materialType ||
						filters.isSaved !== undefined
							? "Intenta ajustar los filtros de búsqueda"
							: "Realiza tu primer cálculo para ver el historial aquí"}
					</p>

					{!filters.searchTerm &&
						!filters.materialType &&
						filters.isSaved === undefined && (
							<button
								onClick={() => onTemplateSelect("")}
								className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
							>
								Comenzar Primer Cálculo
							</button>
						)}
				</div>
			) : (
				<div
					className={`
          ${
						viewMode === "grid"
							? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
							: "space-y-4"
					}
        `}
				>
					{sortedResults.map((result) => (
						<ResultCard key={result.id} result={result} />
					))}
				</div>
			)}
		</div>
	);
};

export default MaterialResultsHistory;
