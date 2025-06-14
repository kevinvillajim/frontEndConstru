// src/ui/pages/calculations/schedule/ResourceUtilizationCharts.tsx
import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import {
	UsersIcon,
	WrenchwIcon,
	TruckIcon,
	CurrencyDollarIcon,
	ClockIcon,
	ChartBarIcon,
	AdjustmentsHorizontalIcon,
	ExclamationTriangleIcon,
	CheckCircleIcon,
	ArrowTrendingUpIcon,
	ArrowTrendingDownIcon,
	FunnelIcon,
	CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import {useResourceUtilization} from "../shared/hooks/useResourceUtilization";
import {
	LoadingSpinner,
	ProgressBar,
	Badge,
} from "../shared/components/SharedComponents";

interface ResourceData {
	id: string;
	name: string;
	type: "labor" | "equipment" | "material";
	capacity: number;
	allocated: number;
	utilized: number;
	cost: number;
	efficiency: number;
	status: "optimal" | "underutilized" | "overallocated" | "critical";
}

interface TimeSlot {
	date: string;
	utilization: number;
	capacity: number;
	efficiency: number;
}

interface CostAnalysis {
	budgeted: number;
	actual: number;
	variance: number;
	trend: "up" | "down" | "neutral";
}

const ResourceCard: React.FC<{resource: ResourceData}> = ({resource}) => {
	const getStatusColor = (status: string) => {
		switch (status) {
			case "optimal":
				return "border-green-200 bg-green-50";
			case "underutilized":
				return "border-yellow-200 bg-yellow-50";
			case "overallocated":
				return "border-red-200 bg-red-50";
			case "critical":
				return "border-red-300 bg-red-100";
			default:
				return "border-gray-200 bg-gray-50";
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case "optimal":
				return "Óptimo";
			case "underutilized":
				return "Subutilizado";
			case "overallocated":
				return "Sobreasignado";
			case "critical":
				return "Crítico";
			default:
				return "Normal";
		}
	};

	const getTypeIcon = (type: string) => {
		switch (type) {
			case "labor":
				return <UsersIcon className="h-5 w-5" />;
			case "equipment":
				return <WrenchIcon className="h-5 w-5" />;
			case "material":
				return <TruckIcon className="h-5 w-5" />;
			default:
				return <UsersIcon className="h-5 w-5" />;
		}
	};

	const utilizationPercentage =
		resource.capacity > 0 ? (resource.utilized / resource.capacity) * 100 : 0;

	return (
		<div
			className={`border rounded-xl p-6 transition-all hover:shadow-lg ${getStatusColor(resource.status)}`}
		>
			<div className="flex items-start justify-between mb-4">
				<div className="flex items-center gap-3">
					<div className="p-2 bg-white rounded-lg shadow-sm">
						{getTypeIcon(resource.type)}
					</div>
					<div>
						<h3 className="font-semibold text-gray-900">{resource.name}</h3>
						<p className="text-sm text-gray-600 capitalize">{resource.type}</p>
					</div>
				</div>
				<Badge
					variant={
						resource.status === "optimal"
							? "success"
							: resource.status === "underutilized"
								? "warning"
								: resource.status === "overallocated"
									? "error"
									: "error"
					}
				>
					{getStatusText(resource.status)}
				</Badge>
			</div>

			<div className="space-y-4">
				{/* Utilization Progress */}
				<div>
					<div className="flex justify-between items-center mb-2">
						<span className="text-sm font-medium text-gray-700">
							Utilización
						</span>
						<span className="text-sm text-gray-600">
							{resource.utilized} / {resource.capacity}
						</span>
					</div>
					<ProgressBar
						progress={utilizationPercentage}
						max={120}
						color={
							utilizationPercentage > 100
								? "red"
								: utilizationPercentage > 85
									? "yellow"
									: "green"
						}
						showPercentage={true}
					/>
				</div>

				{/* Efficiency */}
				<div>
					<div className="flex justify-between items-center mb-2">
						<span className="text-sm font-medium text-gray-700">
							Eficiencia
						</span>
						<span className="text-sm text-gray-600">
							{resource.efficiency}%
						</span>
					</div>
					<ProgressBar
						progress={resource.efficiency}
						color={
							resource.efficiency >= 90
								? "green"
								: resource.efficiency >= 70
									? "yellow"
									: "red"
						}
						showPercentage={false}
					/>
				</div>

				{/* Cost Information */}
				<div className="bg-white rounded-lg p-3 border">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<CurrencyDollarIcon className="h-4 w-4 text-gray-500" />
							<span className="text-sm text-gray-600">Costo actual</span>
						</div>
						<span className="font-semibold text-gray-900">
							${resource.cost.toLocaleString()}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

const UtilizationChart: React.FC<{data: TimeSlot[]; title: string}> = ({
	data,
	title,
}) => {
	if (!data || data.length === 0) {
		return (
			<div className="bg-white rounded-xl border p-6">
				<h3 className="font-semibold text-gray-900 mb-4">{title}</h3>
				<div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
					<p className="text-gray-500">No hay datos disponibles</p>
				</div>
			</div>
		);
	}

	const maxValue = Math.max(
		...data.map((d) => Math.max(d.utilization, d.capacity))
	);

	return (
		<div className="bg-white rounded-xl border p-6">
			<h3 className="font-semibold text-gray-900 mb-4">{title}</h3>
			<div className="space-y-3">
				{data.map((slot, index) => (
					<div key={index} className="flex items-center gap-4">
						<div className="w-20 text-sm text-gray-600">
							{new Date(slot.date).toLocaleDateString("es-EC", {
								month: "short",
								day: "numeric",
							})}
						</div>
						<div className="flex-1">
							<div className="relative h-6 bg-gray-100 rounded-full overflow-hidden">
								<div
									className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
									style={{width: `${(slot.capacity / maxValue) * 100}%`}}
								/>
								<div
									className="absolute top-0 left-0 h-full bg-green-600 rounded-full"
									style={{width: `${(slot.utilization / maxValue) * 100}%`}}
								/>
							</div>
						</div>
						<div className="w-16 text-sm text-gray-600 text-right">
							{((slot.utilization / slot.capacity) * 100).toFixed(0)}%
						</div>
					</div>
				))}
			</div>
			<div className="mt-4 flex items-center gap-4 text-xs">
				<div className="flex items-center gap-2">
					<div className="w-3 h-3 bg-blue-500 rounded"></div>
					<span>Capacidad</span>
				</div>
				<div className="flex items-center gap-2">
					<div className="w-3 h-3 bg-green-600 rounded"></div>
					<span>Utilización</span>
				</div>
			</div>
		</div>
	);
};

const CostAnalysisCard: React.FC<{analysis: CostAnalysis; title: string}> = ({
	analysis,
	title,
}) => {
	const variancePercentage =
		analysis.budgeted > 0 ? (analysis.variance / analysis.budgeted) * 100 : 0;
	const isOverBudget = analysis.variance > 0;

	return (
		<div className="bg-white rounded-xl border p-6">
			<h3 className="font-semibold text-gray-900 mb-4">{title}</h3>

			<div className="space-y-4">
				<div className="grid grid-cols-2 gap-4">
					<div className="bg-blue-50 rounded-lg p-4">
						<div className="text-sm text-blue-600 font-medium mb-1">
							Presupuestado
						</div>
						<div className="text-xl font-bold text-blue-900">
							${analysis.budgeted.toLocaleString()}
						</div>
					</div>
					<div className="bg-gray-50 rounded-lg p-4">
						<div className="text-sm text-gray-600 font-medium mb-1">Real</div>
						<div className="text-xl font-bold text-gray-900">
							${analysis.actual.toLocaleString()}
						</div>
					</div>
				</div>

				<div
					className={`rounded-lg p-4 ${isOverBudget ? "bg-red-50" : "bg-green-50"}`}
				>
					<div className="flex items-center justify-between">
						<div>
							<div
								className={`text-sm font-medium mb-1 ${isOverBudget ? "text-red-600" : "text-green-600"}`}
							>
								Variación
							</div>
							<div
								className={`text-lg font-bold ${isOverBudget ? "text-red-900" : "text-green-900"}`}
							>
								{isOverBudget ? "+" : ""}${analysis.variance.toLocaleString()}
							</div>
						</div>
						<div className="flex items-center gap-1">
							{analysis.trend === "up" ? (
								<ArrowTrendingUpIcon
									className={`h-5 w-5 ${isOverBudget ? "text-red-600" : "text-green-600"}`}
								/>
							) : analysis.trend === "down" ? (
								<ArrowTrendingDownIcon
									className={`h-5 w-5 ${isOverBudget ? "text-green-600" : "text-red-600"}`}
								/>
							) : null}
							<span
								className={`font-medium ${isOverBudget ? "text-red-600" : "text-green-600"}`}
							>
								{Math.abs(variancePercentage).toFixed(1)}%
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const ResourceUtilizationCharts: React.FC = () => {
	const {projectId} = useParams<{projectId: string}>();
	const {
		resources,
		utilizationHistory,
		costAnalysis,
		optimizationSuggestions,
		loadResourceData,
		optimizeResourceAllocation,
		isLoading,
	} = useResourceUtilization();

	const [selectedResourceType, setSelectedResourceType] = useState<
		"all" | "labor" | "equipment" | "material"
	>("all");
	const [selectedTimeRange, setSelectedTimeRange] = useState<
		"week" | "month" | "quarter"
	>("month");
	const [showOptimizations, setShowOptimizations] = useState(false);

	useEffect(() => {
		if (projectId) {
			loadResourceData(projectId, selectedTimeRange);
		}
	}, [projectId, selectedTimeRange, loadResourceData]);

	const filteredResources = resources.filter(
		(resource) =>
			selectedResourceType === "all" || resource.type === selectedResourceType
	);

	const handleOptimizeResources = async () => {
		if (!projectId) return;
		await optimizeResourceAllocation(projectId);
		setShowOptimizations(true);
	};

	const renderHeader = () => (
		<div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-4">
					<div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
						<ChartBarIcon className="h-6 w-6 text-white" />
					</div>
					<div>
						<h1 className="text-2xl font-bold text-gray-900">
							Utilización de Recursos
						</h1>
						<p className="text-gray-600">
							Análisis de eficiencia temporal y optimización de asignaciones
						</p>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<select
						value={selectedTimeRange}
						onChange={(e) =>
							setSelectedTimeRange(e.target.value as typeof selectedTimeRange)
						}
						className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					>
						<option value="week">Esta semana</option>
						<option value="month">Este mes</option>
						<option value="quarter">Este trimestre</option>
					</select>

					<button
						onClick={handleOptimizeResources}
						className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
					>
						<AdjustmentsHorizontalIcon className="h-4 w-4" />
						Optimizar
					</button>
				</div>
			</div>

			<div className="flex gap-2">
				{[
					{key: "all", label: "Todos los recursos", icon: ChartBarIcon},
					{key: "labor", label: "Mano de obra", icon: UsersIcon},
					{key: "equipment", label: "Equipos", icon: WrenchIcon},
					{key: "material", label: "Materiales", icon: TruckIcon},
				].map((type) => (
					<button
						key={type.key}
						onClick={() =>
							setSelectedResourceType(type.key as typeof selectedResourceType)
						}
						className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
							selectedResourceType === type.key
								? "bg-blue-100 text-blue-700 border border-blue-200"
								: "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
						}`}
					>
						<type.icon className="h-4 w-4" />
						{type.label}
					</button>
				))}
			</div>
		</div>
	);

	const renderSummaryCards = () => {
		const totalResources = filteredResources.length;
		const optimalResources = filteredResources.filter(
			(r) => r.status === "optimal"
		).length;
		const underutilizedResources = filteredResources.filter(
			(r) => r.status === "underutilized"
		).length;
		const overallocatedResources = filteredResources.filter(
			(r) => r.status === "overallocated"
		).length;

		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				<div className="bg-white rounded-xl border p-6">
					<div className="flex items-center gap-3 mb-3">
						<div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
							<ChartBarIcon className="h-5 w-5 text-blue-600" />
						</div>
						<div>
							<div className="text-sm text-gray-600">Total Recursos</div>
							<div className="text-2xl font-bold text-gray-900">
								{totalResources}
							</div>
						</div>
					</div>
				</div>

				<div className="bg-white rounded-xl border p-6">
					<div className="flex items-center gap-3 mb-3">
						<div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
							<CheckCircleIcon className="h-5 w-5 text-green-600" />
						</div>
						<div>
							<div className="text-sm text-gray-600">Óptimos</div>
							<div className="text-2xl font-bold text-green-900">
								{optimalResources}
							</div>
						</div>
					</div>
					<div className="text-xs text-gray-500">
						{totalResources > 0
							? ((optimalResources / totalResources) * 100).toFixed(0)
							: 0}
						% del total
					</div>
				</div>

				<div className="bg-white rounded-xl border p-6">
					<div className="flex items-center gap-3 mb-3">
						<div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
							<ClockIcon className="h-5 w-5 text-yellow-600" />
						</div>
						<div>
							<div className="text-sm text-gray-600">Subutilizados</div>
							<div className="text-2xl font-bold text-yellow-900">
								{underutilizedResources}
							</div>
						</div>
					</div>
					<div className="text-xs text-gray-500">Oportunidad de mejora</div>
				</div>

				<div className="bg-white rounded-xl border p-6">
					<div className="flex items-center gap-3 mb-3">
						<div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
							<ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
						</div>
						<div>
							<div className="text-sm text-gray-600">Sobreasignados</div>
							<div className="text-2xl font-bold text-red-900">
								{overallocatedResources}
							</div>
						</div>
					</div>
					<div className="text-xs text-gray-500">Requiere atención</div>
				</div>
			</div>
		);
	};

	const renderResourceGrid = () => (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
			{filteredResources.map((resource) => (
				<ResourceCard key={resource.id} resource={resource} />
			))}
		</div>
	);

	const renderUtilizationCharts = () => (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
			<UtilizationChart
				data={utilizationHistory.labor || []}
				title="Utilización de Mano de Obra"
			/>
			<UtilizationChart
				data={utilizationHistory.equipment || []}
				title="Utilización de Equipos"
			/>
		</div>
	);

	const renderCostAnalysis = () => (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
			<CostAnalysisCard
				analysis={
					costAnalysis.labor || {
						budgeted: 0,
						actual: 0,
						variance: 0,
						trend: "neutral",
					}
				}
				title="Costos de Mano de Obra"
			/>
			<CostAnalysisCard
				analysis={
					costAnalysis.equipment || {
						budgeted: 0,
						actual: 0,
						variance: 0,
						trend: "neutral",
					}
				}
				title="Costos de Equipos"
			/>
			<CostAnalysisCard
				analysis={
					costAnalysis.materials || {
						budgeted: 0,
						actual: 0,
						variance: 0,
						trend: "neutral",
					}
				}
				title="Costos de Materiales"
			/>
		</div>
	);

	const renderOptimizationSuggestions = () => {
		if (!showOptimizations || !optimizationSuggestions?.length) return null;

		return (
			<div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
				<h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
					<AdjustmentsHorizontalIcon className="h-5 w-5 text-purple-600" />
					Sugerencias de Optimización
				</h2>
				<div className="space-y-4">
					{optimizationSuggestions.map((suggestion, index) => (
						<div
							key={index}
							className="bg-purple-50 rounded-lg p-4 border border-purple-200"
						>
							<div className="flex items-start gap-3">
								<div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
									<span className="text-purple-600 font-semibold text-sm">
										{index + 1}
									</span>
								</div>
								<div className="flex-1">
									<h3 className="font-medium text-purple-900 mb-1">
										{suggestion.title}
									</h3>
									<p className="text-purple-700 text-sm mb-2">
										{suggestion.description}
									</p>
									<div className="flex items-center gap-4 text-xs">
										<span className="text-purple-600">
											<strong>Impacto:</strong> {suggestion.impact}
										</span>
										<span className="text-purple-600">
											<strong>Esfuerzo:</strong> {suggestion.effort}
										</span>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	};

	if (isLoading) {
		return (
			<div className="max-w-7xl mx-auto px-4 py-8">
				<div className="flex items-center justify-center h-64">
					<div className="text-center">
						<LoadingSpinner size="lg" className="mx-auto mb-4" />
						<p className="text-gray-600">Cargando análisis de recursos...</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto px-4 py-8">
			{renderHeader()}
			{renderSummaryCards()}
			{renderOptimizationSuggestions()}
			{renderResourceGrid()}
			{renderUtilizationCharts()}
			{renderCostAnalysis()}
		</div>
	);
};

export default ResourceUtilizationCharts;
