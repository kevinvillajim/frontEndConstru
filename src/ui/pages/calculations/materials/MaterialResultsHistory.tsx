// src/ui/pages/calculations/materials/MaterialResultsHistory.tsx
import React, {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {
	ClockIcon,
	DocumentTextIcon,
	EyeIcon,
	TrashIcon,
	ShareIcon,
	MagnifyingGlassIcon,
	FunnelIcon,
	PlayIcon,
} from "@heroicons/react/24/outline";
import {
	useMaterialResults,
	type CalculationHistory,
	type MaterialCalculationResult,
} from "../shared/hooks/useMaterialCalculations";

interface ResultCardProps {
	result: CalculationHistory;
	onView: (result: CalculationHistory) => void;
	onDelete: (result: CalculationHistory) => void;
	onShare: (result: CalculationHistory) => void;
}

const ResultCard: React.FC<ResultCardProps> = ({
	result,
	onView,
	onDelete,
	onShare,
}) => {
	return (
		<div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
			{/* Header */}
			<div className="p-6 pb-4">
				<div className="flex items-start justify-between mb-4">
					<div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
						<DocumentTextIcon className="h-6 w-6 text-white" />
					</div>

					<div className="flex items-center gap-2">
						<div className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200">
							Completado
						</div>
					</div>
				</div>

				<div className="mb-4">
					<h3 className="text-lg font-bold text-gray-900 group-hover:text-amber-700 transition-colors line-clamp-2 mb-2">
						{result.calculationName}
					</h3>
					<p className="text-sm text-gray-600 mb-2">
						Plantilla: {result.templateName}
					</p>
					<p className="text-xs text-gray-500">
						Ejecutado el{" "}
						{new Date(result.executedAt).toLocaleDateString("es-EC", {
							year: "numeric",
							month: "long",
							day: "numeric",
							hour: "2-digit",
							minute: "2-digit",
						})}
					</p>
				</div>

				{/* Métricas del resultado */}
				<div className="flex items-center justify-between text-sm text-gray-500 mb-4">
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-1">
							<ClockIcon className="h-4 w-4" />
							<span>{result.result.executionTime}ms</span>
						</div>

						{result.result.totalCost && (
							<div className="flex items-center gap-1 text-green-600">
								<span className="font-medium">
									${result.result.totalCost.toLocaleString("es-EC")}
								</span>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Footer con acciones */}
			<div className="px-6 pb-6">
				<div className="flex items-center gap-2">
					<button
						onClick={() => onView(result)}
						className="flex-1 px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
					>
						<EyeIcon className="h-4 w-4" />
						Ver Detalles
					</button>

					<button
						onClick={() => onShare(result)}
						className="p-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors"
						title="Compartir"
					>
						<ShareIcon className="h-4 w-4" />
					</button>

					<button
						onClick={() => onDelete(result)}
						className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-400 transition-colors"
						title="Eliminar"
					>
						<TrashIcon className="h-4 w-4" />
					</button>
				</div>
			</div>
		</div>
	);
};

const MaterialResultsHistory: React.FC = () => {
	const navigate = useNavigate();
	const {resultId} = useParams<{resultId?: string}>();
	const {getResults, getResult, deleteResult, isLoading} = useMaterialResults();

	// Estados
	const [results, setResults] = useState<CalculationHistory[]>([]);
	const [filteredResults, setFilteredResults] = useState<CalculationHistory[]>(
		[]
	);
	const [selectedResult, setSelectedResult] =
		useState<MaterialCalculationResult | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [dateFilter, setDateFilter] = useState<
		"all" | "today" | "week" | "month"
	>("all");
	const [showFilters, setShowFilters] = useState(false);

	// Cargar resultados
	useEffect(() => {
		const loadResults = async () => {
			const data = await getResults();
			setResults(data);
		};

		loadResults();
	}, [getResults]);

	// Cargar resultado específico si hay resultId en la URL
	useEffect(() => {
		if (resultId) {
			const loadSpecificResult = async () => {
				const result = await getResult(resultId);
				setSelectedResult(result);
			};

			loadSpecificResult();
		}
	}, [resultId, getResult]);

	// Filtrar resultados
	useEffect(() => {
		let filtered = [...results];

		// Filtro por búsqueda
		if (searchTerm) {
			filtered = filtered.filter(
				(result) =>
					result.calculationName
						.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					result.templateName.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		// Filtro por fecha
		if (dateFilter !== "all") {
			const now = new Date();
			const cutoffDate = new Date();

			switch (dateFilter) {
				case "today":
					cutoffDate.setHours(0, 0, 0, 0);
					break;
				case "week":
					cutoffDate.setDate(now.getDate() - 7);
					break;
				case "month":
					cutoffDate.setMonth(now.getMonth() - 1);
					break;
			}

			filtered = filtered.filter(
				(result) => new Date(result.executedAt) >= cutoffDate
			);
		}

		// Ordenar por fecha más reciente
		filtered.sort(
			(a, b) =>
				new Date(b.executedAt).getTime() - new Date(a.executedAt).getTime()
		);

		setFilteredResults(filtered);
	}, [results, searchTerm, dateFilter]);

	const handleView = (result: CalculationHistory) => {
		navigate(`/calculations/materials/results/${result.id}`);
	};

	const handleDelete = async (result: CalculationHistory) => {
		if (
			window.confirm(
				`¿Estás seguro de que quieres eliminar "${result.calculationName}"?`
			)
		) {
			const success = await deleteResult(result.id);
			if (success) {
				setResults((prev) => prev.filter((r) => r.id !== result.id));
			}
		}
	};

	const handleShare = (result: CalculationHistory) => {
		// Implementar funcionalidad de compartir
		console.log("Sharing result:", result);
		// Por ejemplo, copiar link al clipboard
		navigator.clipboard.writeText(
			`${window.location.origin}/calculations/materials/results/${result.id}`
		);
	};

	const renderHeader = () => (
		<div className="bg-white border-b border-gray-200">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
							<ClockIcon className="h-6 w-6 text-white" />
						</div>
						<div>
							<h1 className="text-2xl font-bold text-gray-900">
								Historial de Resultados
							</h1>
							<p className="text-gray-600">
								{filteredResults.length} cálculos ejecutados
							</p>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<button
							onClick={() => setShowFilters(!showFilters)}
							className={`
								px-4 py-2 rounded-lg border transition-colors flex items-center gap-2
								${
									showFilters
										? "border-amber-300 bg-amber-50 text-amber-700"
										: "border-gray-300 text-gray-700 hover:bg-gray-50"
								}
							`}
						>
							<FunnelIcon className="h-4 w-4" />
							Filtros
						</button>
					</div>
				</div>
			</div>
		</div>
	);

	const renderFilters = () => (
		<div
			className={`bg-gray-50 border-b border-gray-200 transition-all duration-300 ${showFilters ? "max-h-96" : "max-h-0 overflow-hidden"}`}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Búsqueda */}
					<div>
						<label className="block text-sm font-medium text-gray-900 mb-2">
							Buscar resultados
						</label>
						<div className="relative">
							<MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
							<input
								type="text"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								placeholder="Buscar por nombre o plantilla..."
								className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
							/>
						</div>
					</div>

					{/* Filtro de fecha */}
					<div>
						<label className="block text-sm font-medium text-gray-900 mb-2">
							Período
						</label>
						<div className="flex gap-2">
							{[
								{value: "all", label: "Todos"},
								{value: "today", label: "Hoy"},
								{value: "week", label: "Esta semana"},
								{value: "month", label: "Este mes"},
							].map((option) => (
								<button
									key={option.value}
									onClick={() =>
										setDateFilter(option.value as typeof dateFilter)
									}
									className={`
										px-4 py-2 rounded-lg border transition-all duration-200 text-sm font-medium
										${
											dateFilter === option.value
												? "border-amber-300 bg-amber-50 text-amber-700"
												: "border-gray-300 text-gray-700 hover:bg-gray-50"
										}
									`}
								>
									{option.label}
								</button>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);

	const renderResultsGrid = () => {
		if (isLoading) {
			return (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{[...Array(6)].map((_, index) => (
						<div
							key={index}
							className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse"
						>
							<div className="w-12 h-12 bg-gray-200 rounded-xl mb-4"></div>
							<div className="h-4 bg-gray-200 rounded mb-2"></div>
							<div className="h-3 bg-gray-200 rounded mb-4"></div>
							<div className="h-10 bg-gray-200 rounded"></div>
						</div>
					))}
				</div>
			);
		}

		if (filteredResults.length === 0) {
			return (
				<div className="text-center py-12">
					<div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<ClockIcon className="h-12 w-12 text-amber-600" />
					</div>
					<h3 className="text-lg font-medium text-gray-900 mb-2">
						{results.length === 0
							? "No hay resultados aún"
							: "No se encontraron resultados"}
					</h3>
					<p className="text-gray-600 mb-6">
						{results.length === 0
							? "Ejecuta algunos cálculos para ver tu historial de resultados"
							: "Intenta ajustar los filtros o términos de búsqueda"}
					</p>
					{results.length === 0 && (
						<button
							onClick={() => navigate("/calculations/materials/catalog")}
							className="inline-flex items-center px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
						>
							<PlayIcon className="h-4 w-4 mr-2" />
							Explorar Plantillas
						</button>
					)}
				</div>
			);
		}

		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{filteredResults.map((result) => (
					<ResultCard
						key={result.id}
						result={result}
						onView={handleView}
						onDelete={handleDelete}
						onShare={handleShare}
					/>
				))}
			</div>
		);
	};

	const renderResultDetail = () => {
		if (!selectedResult) return null;

		return (
			<div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 p-8 mb-8">
				<div className="flex items-center gap-3 mb-6">
					<DocumentTextIcon className="h-8 w-8 text-amber-600" />
					<div>
						<h2 className="text-2xl font-bold text-gray-900">
							Detalle del Resultado
						</h2>
						<p className="text-gray-600">
							Ejecutado el{" "}
							{new Date(selectedResult.createdAt).toLocaleDateString("es-EC")}
						</p>
					</div>
				</div>

				{/* Contenido del resultado - puedes expandir esto según necesites */}
				<div className="space-y-6">
					{selectedResult.materialQuantities &&
						selectedResult.materialQuantities.length > 0 && (
							<div>
								<h3 className="text-lg font-semibold text-gray-900 mb-3">
									Materiales Calculados
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{selectedResult.materialQuantities.map((material, index) => (
										<div
											key={index}
											className="bg-amber-50 rounded-xl p-4 border border-amber-100"
										>
											<div className="font-medium text-gray-900">
												{material.name}
											</div>
											<div className="text-sm text-gray-600">
												{material.quantity.toLocaleString("es-EC")}{" "}
												{material.unit}
											</div>
											{material.totalPrice && (
												<div className="text-sm font-medium text-amber-600 mt-1">
													$
													{material.totalPrice.toLocaleString("es-EC", {
														minimumFractionDigits: 2,
													})}
												</div>
											)}
										</div>
									))}
								</div>
							</div>
						)}

					{selectedResult.totalCost && (
						<div className="pt-4 border-t border-gray-200">
							<div className="text-sm text-gray-600">Costo Total Estimado</div>
							<div className="text-3xl font-bold text-amber-600">
								$
								{selectedResult.totalCost.toLocaleString("es-EC", {
									minimumFractionDigits: 2,
								})}{" "}
								{selectedResult.currency}
							</div>
						</div>
					)}
				</div>

				<div className="mt-8 pt-6 border-t border-gray-200">
					<button
						onClick={() => {
							setSelectedResult(null);
							navigate("/calculations/materials/results");
						}}
						className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
					>
						Volver al Historial
					</button>
				</div>
			</div>
		);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{renderHeader()}
			{renderFilters()}

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{selectedResult ? renderResultDetail() : renderResultsGrid()}
			</div>
		</div>
	);
};

export default MaterialResultsHistory;
