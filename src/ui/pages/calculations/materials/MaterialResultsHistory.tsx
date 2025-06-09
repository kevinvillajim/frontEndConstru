// src/ui/pages/calculations/materials/MaterialResultsHistory.tsx
import React, {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {
	MagnifyingGlassIcon,
	ClockIcon,
	DocumentTextIcon,
	TrashIcon,
	ArrowDownTrayIcon,
	EyeIcon,
	DocumentDuplicateIcon,
	ChartBarIcon,
	CalendarIcon,
	CurrencyDollarIcon,
	BeakerIcon,
	FunnelIcon,
	CheckCircleIcon,
	ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import {useMaterialResults} from "../shared/hooks/useMaterialCalculations";
import type {MaterialCalculationResult} from "../shared/types/material.types";

const FILTER_OPTIONS = {
	timeRange: [
		{id: "today", name: "Hoy"},
		{id: "week", name: "Esta semana"},
		{id: "month", name: "Este mes"},
		{id: "quarter", name: "Últimos 3 meses"},
		{id: "year", name: "Este año"},
		{id: "all", name: "Todo el tiempo"},
	],
	status: [
		{id: "all", name: "Todos"},
		{id: "successful", name: "Exitosos"},
		{id: "failed", name: "Con errores"},
	],
	sortBy: [
		{id: "recent", name: "Más recientes"},
		{id: "oldest", name: "Más antiguos"},
		{id: "template", name: "Por plantilla"},
		{id: "cost", name: "Por costo"},
	],
};

const MaterialResultsHistory: React.FC = () => {
	const navigate = useNavigate();
	const {resultId} = useParams<{resultId?: string}>();
	const {results, loading, error, fetchResults, deleteResult} =
		useMaterialResults();

	const [searchTerm, setSearchTerm] = useState("");
	const [selectedTimeRange, setSelectedTimeRange] = useState("month");
	const [selectedStatus, setSelectedStatus] = useState("all");
	const [sortBy, setSortBy] = useState("recent");
	const [showFilters, setShowFilters] = useState(false);
	const [selectedResult, setSelectedResult] =
		useState<MaterialCalculationResult | null>(null);
	const [filteredResults, setFilteredResults] = useState<
		MaterialCalculationResult[]
	>([]);

	useEffect(() => {
		fetchResults({
			limit: 50,
		});
	}, [fetchResults]);

	useEffect(() => {
		let filtered = [...results];

		// Filtrar por búsqueda
		if (searchTerm) {
			filtered = filtered.filter(
				(result) =>
					result.templateName
						.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					result.notes?.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		// Filtrar por estado
		if (selectedStatus !== "all") {
			filtered = filtered.filter((result) =>
				selectedStatus === "successful"
					? result.wasSuccessful
					: !result.wasSuccessful
			);
		}

		// Filtrar por rango de tiempo
		if (selectedTimeRange !== "all") {
			const now = new Date();
			const timeRanges = {
				today: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
				week: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
				month: new Date(now.getFullYear(), now.getMonth(), 1),
				quarter: new Date(now.getFullYear(), now.getMonth() - 3, 1),
				year: new Date(now.getFullYear(), 0, 1),
			};

			const cutoffDate =
				timeRanges[selectedTimeRange as keyof typeof timeRanges];
			if (cutoffDate) {
				filtered = filtered.filter(
					(result) => new Date(result.createdAt) >= cutoffDate
				);
			}
		}

		// Ordenar
		filtered.sort((a, b) => {
			switch (sortBy) {
				case "recent":
					return (
						new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
					);
				case "oldest":
					return (
						new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
					);
				case "template":
					return a.templateName.localeCompare(b.templateName);
				case "cost":
					return (b.totalEstimatedCost || 0) - (a.totalEstimatedCost || 0);
				default:
					return 0;
			}
		});

		setFilteredResults(filtered);
	}, [results, searchTerm, selectedTimeRange, selectedStatus, sortBy]);

	// Si hay un resultId en la URL, mostrar ese resultado específico
	useEffect(() => {
		if (resultId && results.length > 0) {
			const result = results.find((r) => r.id === resultId);
			setSelectedResult(result || null);
		}
	}, [resultId, results]);

	const handleDeleteResult = async (id: string) => {
		if (
			window.confirm("¿Estás seguro de que quieres eliminar este resultado?")
		) {
			const success = await deleteResult(id);
			if (success && selectedResult?.id === id) {
				setSelectedResult(null);
				navigate("/calculations/materials/results");
			}
		}
	};

	const handleViewResult = (result: MaterialCalculationResult) => {
		setSelectedResult(result);
		navigate(`/calculations/materials/results/${result.id}`);
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

	const renderFilters = () => (
		<div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
			<div className="flex flex-col lg:flex-row gap-4">
				{/* Búsqueda */}
				<div className="flex-1">
					<div className="relative">
						<MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
						<input
							type="text"
							placeholder="Buscar en historial..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
						/>
					</div>
				</div>

				{/* Controles */}
				<div className="flex gap-3">
					<select
						value={selectedTimeRange}
						onChange={(e) => setSelectedTimeRange(e.target.value)}
						className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
					>
						{FILTER_OPTIONS.timeRange.map((option) => (
							<option key={option.id} value={option.id}>
								{option.name}
							</option>
						))}
					</select>

					<select
						value={sortBy}
						onChange={(e) => setSortBy(e.target.value)}
						className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
					>
						{FILTER_OPTIONS.sortBy.map((option) => (
							<option key={option.id} value={option.id}>
								{option.name}
							</option>
						))}
					</select>

					<button
						onClick={() => setShowFilters(!showFilters)}
						className={`inline-flex items-center gap-2 px-4 py-3 border rounded-lg transition-colors ${
							showFilters
								? "border-primary-300 bg-primary-50 text-primary-700"
								: "border-gray-300 text-gray-700 hover:bg-gray-50"
						}`}
					>
						<FunnelIcon className="h-4 w-4" />
						Filtros
					</button>
				</div>
			</div>

			{/* Filtros expandibles */}
			{showFilters && (
				<div className="mt-6 pt-6 border-t border-gray-200">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Estado
							</label>
							<div className="space-y-2">
								{FILTER_OPTIONS.status.map((status) => (
									<label key={status.id} className="flex items-center">
										<input
											type="radio"
											name="status"
											value={status.id}
											checked={selectedStatus === status.id}
											onChange={(e) => setSelectedStatus(e.target.value)}
											className="h-4 w-4 text-primary-600 focus:ring-primary-500"
										/>
										<span className="ml-2 text-sm text-gray-700">
											{status.name}
										</span>
									</label>
								))}
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Rango de Costos
							</label>
							<div className="flex gap-2">
								<input
									type="number"
									placeholder="Mín"
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
								/>
								<input
									type="number"
									placeholder="Máx"
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
								/>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);

	const renderResultCard = (result: MaterialCalculationResult) => (
		<div
			key={result.id}
			className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-200 cursor-pointer"
			onClick={() => handleViewResult(result)}
		>
			{/* Header */}
			<div className="flex items-start justify-between mb-4">
				<div className="flex-1">
					<div className="flex items-center gap-2 mb-2">
						<h3 className="font-semibold text-gray-900">
							{result.templateName}
						</h3>
						{result.wasSuccessful ? (
							<CheckCircleIcon className="h-5 w-5 text-green-600" />
						) : (
							<ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
						)}
					</div>
					<div className="flex items-center gap-4 text-sm text-gray-500">
						<span className="flex items-center gap-1">
							<CalendarIcon className="h-4 w-4" />
							{formatDate(result.createdAt)}
						</span>
						<span className="flex items-center gap-1">
							<ClockIcon className="h-4 w-4" />
							{result.executionTime}ms
						</span>
						{result.totalEstimatedCost && (
							<span className="flex items-center gap-1">
								<CurrencyDollarIcon className="h-4 w-4" />
								{formatCurrency(result.totalEstimatedCost, result.currency)}
							</span>
						)}
					</div>
				</div>
			</div>

			{/* Materials summary */}
			<div className="mb-4">
				<p className="text-sm text-gray-600 mb-2">
					{result.materialQuantities.length} material
					{result.materialQuantities.length !== 1 ? "es" : ""} calculado
					{result.materialQuantities.length !== 1 ? "s" : ""}
				</p>
				<div className="flex flex-wrap gap-1">
					{result.materialQuantities.slice(0, 3).map((material, index) => (
						<span
							key={index}
							className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-600"
						>
							{material.name}
						</span>
					))}
					{result.materialQuantities.length > 3 && (
						<span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-600">
							+{result.materialQuantities.length - 3} más
						</span>
					)}
				</div>
			</div>

			{/* Actions */}
			<div
				className="flex items-center gap-2"
				onClick={(e) => e.stopPropagation()}
			>
				<button
					onClick={() => handleViewResult(result)}
					className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
				>
					<EyeIcon className="h-4 w-4" />
					Ver Detalles
				</button>
				<button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
					<DocumentDuplicateIcon className="h-4 w-4" />
				</button>
				<button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
					<ArrowDownTrayIcon className="h-4 w-4" />
				</button>
				<button
					onClick={() => handleDeleteResult(result.id)}
					className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
				>
					<TrashIcon className="h-4 w-4" />
				</button>
			</div>
		</div>
	);

	const renderResultDetail = () => {
		if (!selectedResult) return null;

		return (
			<div className="bg-white rounded-xl border border-gray-200 p-6">
				<div className="flex items-center justify-between mb-6">
					<div>
						<h2 className="text-xl font-bold text-gray-900">
							{selectedResult.templateName}
						</h2>
						<p className="text-gray-600">
							Resultado del {formatDate(selectedResult.createdAt)}
						</p>
					</div>
					<button
						onClick={() => {
							setSelectedResult(null);
							navigate("/calculations/materials/results");
						}}
						className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
					>
						Cerrar
					</button>
				</div>

				{/* Metadata */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
					<div className="bg-gray-50 rounded-lg p-4">
						<p className="text-sm text-gray-600">Estado</p>
						<div className="flex items-center gap-1 mt-1">
							{selectedResult.wasSuccessful ? (
								<CheckCircleIcon className="h-4 w-4 text-green-600" />
							) : (
								<ExclamationTriangleIcon className="h-4 w-4 text-red-600" />
							)}
							<span
								className={`text-sm font-medium ${
									selectedResult.wasSuccessful
										? "text-green-700"
										: "text-red-700"
								}`}
							>
								{selectedResult.wasSuccessful ? "Exitoso" : "Error"}
							</span>
						</div>
					</div>

					<div className="bg-gray-50 rounded-lg p-4">
						<p className="text-sm text-gray-600">Tiempo</p>
						<p className="text-lg font-bold text-gray-900">
							{selectedResult.executionTime}ms
						</p>
					</div>

					<div className="bg-gray-50 rounded-lg p-4">
						<p className="text-sm text-gray-600">Materiales</p>
						<p className="text-lg font-bold text-gray-900">
							{selectedResult.materialQuantities.length}
						</p>
					</div>

					{selectedResult.totalEstimatedCost && (
						<div className="bg-gray-50 rounded-lg p-4">
							<p className="text-sm text-gray-600">Costo Total</p>
							<p className="text-lg font-bold text-gray-900">
								{formatCurrency(
									selectedResult.totalEstimatedCost,
									selectedResult.currency
								)}
							</p>
						</div>
					)}
				</div>

				{/* Materials */}
				<div className="mb-6">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">
						Materiales Calculados
					</h3>
					<div className="space-y-3">
						{selectedResult.materialQuantities.map((material, index) => (
							<div
								key={index}
								className="bg-gray-50 rounded-lg p-4 flex justify-between items-center"
							>
								<div>
									<h4 className="font-medium text-gray-900">{material.name}</h4>
									{material.description && (
										<p className="text-sm text-gray-600">
											{material.description}
										</p>
									)}
								</div>
								<div className="text-right">
									<p className="font-bold text-gray-900">
										{material.quantity} {material.unit}
									</p>
									{material.totalPrice && (
										<p className="text-sm text-gray-600">
											{formatCurrency(
												material.totalPrice,
												selectedResult.currency
											)}
										</p>
									)}
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Input Parameters */}
				{Object.keys(selectedResult.inputParameters).length > 0 && (
					<div className="mb-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">
							Parámetros de Entrada
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{Object.entries(selectedResult.inputParameters).map(
								([key, value]) => (
									<div key={key} className="bg-gray-50 rounded-lg p-4">
										<p className="text-sm text-gray-600 capitalize">
											{key.replace(/([A-Z])/g, " $1")}
										</p>
										<p className="font-medium text-gray-900">{String(value)}</p>
									</div>
								)
							)}
						</div>
					</div>
				)}

				{/* Notes */}
				{selectedResult.notes && (
					<div>
						<h3 className="text-lg font-semibold text-gray-900 mb-4">Notas</h3>
						<div className="bg-gray-50 rounded-lg p-4">
							<p className="text-gray-700">{selectedResult.notes}</p>
						</div>
					</div>
				)}
			</div>
		);
	};

	const renderStatsCards = () => (
		<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
			<div className="bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 rounded-xl p-6">
				<div className="flex items-center">
					<div className="flex-shrink-0">
						<DocumentTextIcon className="h-8 w-8 text-primary-600" />
					</div>
					<div className="ml-4">
						<p className="text-sm font-medium text-primary-700">Total</p>
						<p className="text-2xl font-bold text-primary-900">
							{results.length}
						</p>
					</div>
				</div>
			</div>

			<div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-6">
				<div className="flex items-center">
					<div className="flex-shrink-0">
						<CheckCircleIcon className="h-8 w-8 text-emerald-600" />
					</div>
					<div className="ml-4">
						<p className="text-sm font-medium text-emerald-700">Exitosos</p>
						<p className="text-2xl font-bold text-emerald-900">
							{results.filter((r) => r.wasSuccessful).length}
						</p>
					</div>
				</div>
			</div>

			<div className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-6">
				<div className="flex items-center">
					<div className="flex-shrink-0">
						<ClockIcon className="h-8 w-8 text-amber-600" />
					</div>
					<div className="ml-4">
						<p className="text-sm font-medium text-amber-700">Esta Semana</p>
						<p className="text-2xl font-bold text-amber-900">
							{
								results.filter((r) => {
									const week = new Date();
									week.setDate(week.getDate() - 7);
									return new Date(r.createdAt) >= week;
								}).length
							}
						</p>
					</div>
				</div>
			</div>

			<div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
				<div className="flex items-center">
					<div className="flex-shrink-0">
						<CurrencyDollarIcon className="h-8 w-8 text-purple-600" />
					</div>
					<div className="ml-4">
						<p className="text-sm font-medium text-purple-700">Costo Total</p>
						<p className="text-2xl font-bold text-purple-900">
							{formatCurrency(
								results.reduce(
									(sum, r) => sum + (r.totalEstimatedCost || 0),
									0
								),
								"USD"
							)}
						</p>
					</div>
				</div>
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
			{!selectedResult && (
				<>
					{renderStatsCards()}
					{renderFilters()}
				</>
			)}

			{selectedResult ? (
				renderResultDetail()
			) : (
				<>
					{filteredResults.length === 0 ? (
						<div className="text-center py-12">
							<BeakerIcon className="mx-auto h-12 w-12 text-gray-400" />
							<h3 className="mt-4 text-lg font-medium text-gray-900">
								No hay resultados
							</h3>
							<p className="mt-2 text-gray-600">
								{searchTerm
									? "No se encontraron resultados con esos criterios"
									: "Aún no tienes cálculos guardados"}
							</p>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{filteredResults.map(renderResultCard)}
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default MaterialResultsHistory;
