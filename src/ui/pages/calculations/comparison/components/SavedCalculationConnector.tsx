import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {
	MagnifyingGlassIcon,
	ArrowPathIcon,
	ChartBarIcon,
	CheckIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import type {SavedCalculation} from "../../shared/hooks/useComparison";

interface SavedCalculationConnectorProps {
	savedCalculations: SavedCalculation[];
	onSelectCalculations: (calculationIds: string[]) => void;
	maxSelections?: number;
	onClose?: () => void;
}

const SavedCalculationConnector: React.FC<SavedCalculationConnectorProps> = ({
	savedCalculations,
	onSelectCalculations,
	maxSelections = 4,
	onClose,
}) => {
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState("");
	const [filterCategory, setFilterCategory] = useState<string>("");
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);

	// Categorías para filtrar
	const categories = [
		{id: "", name: "Todas las categorías"},
		{id: "structural", name: "🏗️ Estructural"},
		{id: "electrical", name: "⚡ Eléctrico"},
		{id: "architectural", name: "🏛️ Arquitectónico"},
		{id: "hydraulic", name: "🚰 Hidráulico"},
	];

	// Filtrar cálculos
	const filteredCalculations = savedCalculations.filter((calc) => {
		const matchesSearch =
			calc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			calc.templateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			calc.tags.some((tag) =>
				tag.toLowerCase().includes(searchTerm.toLowerCase())
			);

		const matchesCategory =
			!filterCategory || calc.templateCategory === filterCategory;

		return matchesSearch && matchesCategory;
	});

	// Manejar selección de cálculo
	const toggleSelection = (calculationId: string) => {
		setSelectedIds((prev) => {
			if (prev.includes(calculationId)) {
				return prev.filter((id) => id !== calculationId);
			} else {
				if (prev.length < maxSelections) {
					return [...prev, calculationId];
				}
				return prev;
			}
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

	// Simular carga de datos
	const refreshCalculations = () => {
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
		}, 1000);
	};

	// Confirmar selección y navegar a comparador
	const confirmSelection = () => {
		onSelectCalculations(selectedIds);

		if (onClose) {
			onClose();
		} else {
			navigate("/calculations/comparison");
		}
	};

	return (
		<div className="space-y-6">
			{/* Filtros y búsqueda */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
				<div className="flex flex-col lg:flex-row gap-4">
					<div className="flex-1">
						<div className="relative">
							<MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
							<input
								type="text"
								placeholder="Buscar en mis cálculos..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
							/>
						</div>
					</div>

					<div className="flex flex-wrap gap-3">
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

						<button
							onClick={refreshCalculations}
							className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
							disabled={loading}
						>
							<ArrowPathIcon
								className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
							/>
							{loading ? "Cargando..." : "Actualizar"}
						</button>

						<button
							onClick={confirmSelection}
							disabled={selectedIds.length === 0}
							className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
						>
							<ChartBarIcon className="h-4 w-4" />
							Comparar Seleccionados
							{selectedIds.length > 0 && ` (${selectedIds.length})`}
						</button>
					</div>
				</div>
			</div>

			{/* Lista de cálculos seleccionables */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{filteredCalculations.map((calculation) => {
					const isSelected = selectedIds.includes(calculation.id);
					const categoryIcon =
						calculation.templateCategory === "structural"
							? "🏗️"
							: calculation.templateCategory === "electrical"
								? "⚡"
								: calculation.templateCategory === "architectural"
									? "🏛️"
									: "🚰";

					return (
						<div
							key={calculation.id}
							onClick={() => toggleSelection(calculation.id)}
							className={`bg-white rounded-xl shadow-sm border cursor-pointer transition-all ${
								isSelected
									? "border-primary-300 ring-2 ring-primary-100"
									: "border-gray-200 hover:border-primary-200"
							}`}
						>
							<div className="p-5 relative">
								{/* Indicador de selección */}
								{isSelected && (
									<div className="absolute -top-3 -right-3 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center">
										<CheckIcon className="h-4 w-4" />
									</div>
								)}

								<div className="flex items-start justify-between mb-3">
									<div>
										<h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
											{calculation.name}
										</h3>
										<p className="text-sm text-gray-600 mb-2">
											{calculation.templateName}
										</p>
										<div className="flex items-center gap-2">
											<span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
												{categoryIcon}{" "}
												{calculation.templateCategory === "structural"
													? "Estructural"
													: calculation.templateCategory === "electrical"
														? "Eléctrico"
														: calculation.templateCategory === "architectural"
															? "Arquitectónico"
															: "Hidráulico"}
											</span>

											<span
												className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
													calculation.status === "completed"
														? "bg-green-100 text-green-700"
														: calculation.status === "draft"
															? "bg-yellow-100 text-yellow-700"
															: "bg-red-100 text-red-700"
												}`}
											>
												{calculation.status === "completed"
													? "Completado"
													: calculation.status === "draft"
														? "Borrador"
														: "Error"}
											</span>
										</div>
									</div>
								</div>

								{/* Resultado principal */}
								<div className="bg-gray-50 rounded-lg p-3 mb-3 text-center">
									<div className="text-lg font-bold text-primary-700">
										{calculation.results.mainValue}
									</div>
									<div className="text-xs text-gray-500">
										{calculation.results.unit}
									</div>
								</div>

								{/* Tags */}
								{calculation.tags.length > 0 && (
									<div className="flex flex-wrap gap-1 mb-3">
										{calculation.tags.slice(0, 3).map((tag, tagIndex) => (
											<span
												key={tagIndex}
												className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
											>
												{tag}
											</span>
										))}
										{calculation.tags.length > 3 && (
											<span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md">
												+{calculation.tags.length - 3}
											</span>
										)}
									</div>
								)}

								{/* Metadatos */}
								<div className="text-xs text-gray-500 flex justify-between">
									<div>NEC: {calculation.necReference}</div>
									<div>Modificado: {formatDate(calculation.lastModified)}</div>
								</div>
							</div>
						</div>
					);
				})}
			</div>

			{filteredCalculations.length === 0 && (
				<div className="text-center py-12 bg-white rounded-xl border border-gray-200">
					<MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
					<h3 className="text-lg font-medium text-gray-900 mb-2">
						No se encontraron cálculos
					</h3>
					<p className="text-gray-600 mb-6">
						{searchTerm || filterCategory
							? "Intenta ajustar los filtros de búsqueda."
							: "Aún no tienes cálculos guardados para comparar."}
					</p>
				</div>
			)}

			{/* Barra de acción flotante */}
			{selectedIds.length > 0 && (
				<div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white rounded-full px-6 py-3 shadow-lg flex items-center gap-3">
					<span>
						{selectedIds.length}{" "}
						{selectedIds.length === 1 ? "cálculo" : "cálculos"} seleccionado
						{selectedIds.length !== 1 ? "s" : ""}
					</span>
					<button
						onClick={() => setSelectedIds([])}
						className="p-1 text-gray-300 hover:text-white"
					>
						<XMarkIcon className="h-4 w-4" />
					</button>
					<button
						onClick={confirmSelection}
						className="bg-primary-600 hover:bg-primary-700 px-4 py-1 rounded-full text-sm flex items-center gap-1"
					>
						Comparar <ChartBarIcon className="h-3 w-3" />
					</button>
				</div>
			)}
		</div>
	);
};

export default SavedCalculationConnector;
