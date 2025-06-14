// src/ui/pages/calculations/schedule/ScheduleAnalyticsDashboard.tsx
import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import {
	ChartBarIcon,
	ClockIcon,
	CurrencyDollarIcon,
	ArrowTrendingUpIcon,
	ArrowTrendingDownIcon,
	ExclamationTriangleIcon,
	CheckCircleIcon,
	ArrowPathIcon,
	UsersIcon,
	DocumentChartBarIcon,
	ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import {useScheduleAnalytics} from "../shared/hooks/useScheduleAnalytics";
import {
	LoadingSpinner,
	StatCard,
	ProgressBar,
} from "../shared/components/SharedComponents";

interface KPICardProps {
	title: string;
	value: string;
	change: number;
	icon: React.ComponentType<{className?: string}>;
	trend: "up" | "down" | "neutral";
	color: "blue" | "green" | "yellow" | "red" | "purple";
}

const KPICard: React.FC<KPICardProps> = ({
	title,
	value,
	change,
	icon: Icon,
	trend,
	color,
}) => {
	const colorClasses = {
		blue: "from-blue-500 to-blue-600",
		green: "from-green-500 to-green-600",
		yellow: "from-yellow-500 to-yellow-600",
		red: "from-red-500 to-red-600",
		purple: "from-purple-500 to-purple-600",
	};

	const trendIcon =
		trend === "up"
			? ArrowTrendingUpIcon
			: trend === "down"
				? ArrowTrendingDownIcon
				: null;
	const trendColor =
		trend === "up"
			? "text-green-600"
			: trend === "down"
				? "text-red-600"
				: "text-gray-600";

	return (
		<div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
			<div className="flex items-center justify-between mb-4">
				<div
					className={`w-12 h-12 bg-gradient-to-r ${colorClasses[color]} rounded-xl flex items-center justify-center`}
				>
					<Icon className="h-6 w-6 text-white" />
				</div>
				{trendIcon && (
					<div className={`flex items-center gap-1 ${trendColor}`}>
						{React.createElement(trendIcon, {className: "h-4 w-4"})}
						<span className="text-sm font-medium">{Math.abs(change)}%</span>
					</div>
				)}
			</div>
			<div>
				<h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
				<div className="text-2xl font-bold text-gray-900">{value}</div>
			</div>
		</div>
	);
};

const ScheduleAnalyticsDashboard: React.FC = () => {
	const {projectId} = useParams<{projectId: string}>();
	const {
		analytics,
		kpis,
		performanceMetrics,
		loadAnalytics,
		exportReport,
		isLoading,
	} = useScheduleAnalytics();

	const [selectedPeriod, setSelectedPeriod] = useState<
		"week" | "month" | "quarter" | "year"
	>("month");
	const [selectedView, setSelectedView] = useState<
		"overview" | "performance" | "resources" | "costs"
	>("overview");
	const [isExporting, setIsExporting] = useState(false);

	useEffect(() => {
		if (projectId) {
			loadAnalytics(projectId, selectedPeriod);
		}
	}, [projectId, selectedPeriod, loadAnalytics]);

	const handleExportReport = async () => {
		if (!projectId) return;

		setIsExporting(true);
		try {
			await exportReport(projectId, selectedView, selectedPeriod);
		} finally {
			setIsExporting(false);
		}
	};

	const renderHeader = () => (
		<div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-4">
					<div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
						<ChartBarIcon className="h-6 w-6 text-white" />
					</div>
					<div>
						<h1 className="text-2xl font-bold text-gray-900">
							Analytics del Cronograma
						</h1>
						<p className="text-gray-600">
							Análisis detallado de performance y tendencias
						</p>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
						{[
							{key: "week", label: "Semana"},
							{key: "month", label: "Mes"},
							{key: "quarter", label: "Trimestre"},
							{key: "year", label: "Año"},
						].map((period) => (
							<button
								key={period.key}
								onClick={() =>
									setSelectedPeriod(period.key as typeof selectedPeriod)
								}
								className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
									selectedPeriod === period.key
										? "bg-white text-blue-600 shadow-sm"
										: "text-gray-600 hover:text-gray-900"
								}`}
							>
								{period.label}
							</button>
						))}
					</div>

					<button
						onClick={handleExportReport}
						disabled={isExporting}
						className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
					>
						{isExporting ? (
							<ArrowPathIcon className="h-4 w-4 animate-spin" />
						) : (
							<ArrowDownTrayIcon className="h-4 w-4" />
						)}
						Exportar
					</button>
				</div>
			</div>

			{/* Navigation Tabs */}
			<div className="flex gap-2">
				{[
					{key: "overview", label: "Resumen", icon: ChartBarIcon},
					{key: "performance", label: "Performance", icon: ArrowTrendingUpIcon},
					{key: "resources", label: "Recursos", icon: UsersIcon},
					{key: "costs", label: "Costos", icon: CurrencyDollarIcon},
				].map((tab) => (
					<button
						key={tab.key}
						onClick={() => setSelectedView(tab.key as typeof selectedView)}
						className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
							selectedView === tab.key
								? "bg-blue-100 text-blue-700 border border-blue-200"
								: "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
						}`}
					>
						<tab.icon className="h-4 w-4" />
						{tab.label}
					</button>
				))}
			</div>
		</div>
	);

	const renderKPIs = () => (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
			<KPICard
				title="Progreso General"
				value={`${kpis?.overallProgress || 0}%`}
				change={kpis?.progressChange || 0}
				icon={CheckCircleIcon}
				trend={kpis?.progressChange > 0 ? "up" : "down"}
				color="green"
			/>
			<KPICard
				title="Eficiencia"
				value={`${kpis?.efficiency || 0}%`}
				change={kpis?.efficiencyChange || 0}
				icon={ArrowTrendingUpIcon}
				trend={kpis?.efficiencyChange > 0 ? "up" : "down"}
				color="blue"
			/>
			<KPICard
				title="Atraso Promedio"
				value={`${kpis?.averageDelay || 0} días`}
				change={kpis?.delayChange || 0}
				icon={ClockIcon}
				trend={kpis?.delayChange < 0 ? "up" : "down"}
				color="yellow"
			/>
			<KPICard
				title="Variación de Costos"
				value={`${kpis?.costVariance || 0}%`}
				change={kpis?.costVarianceChange || 0}
				icon={CurrencyDollarIcon}
				trend={kpis?.costVarianceChange < 0 ? "up" : "down"}
				color="purple"
			/>
		</div>
	);

	const renderEarnedValueChart = () => (
		<div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
			<h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
				<DocumentChartBarIcon className="h-5 w-5 text-blue-600" />
				Earned Value Management
			</h2>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
				<div className="bg-blue-50 rounded-xl p-4">
					<div className="text-sm text-blue-600 font-medium mb-1">
						Planned Value (PV)
					</div>
					<div className="text-2xl font-bold text-blue-900">
						${performanceMetrics?.plannedValue?.toLocaleString() || 0}
					</div>
				</div>
				<div className="bg-green-50 rounded-xl p-4">
					<div className="text-sm text-green-600 font-medium mb-1">
						Earned Value (EV)
					</div>
					<div className="text-2xl font-bold text-green-900">
						${performanceMetrics?.earnedValue?.toLocaleString() || 0}
					</div>
				</div>
				<div className="bg-red-50 rounded-xl p-4">
					<div className="text-sm text-red-600 font-medium mb-1">
						Actual Cost (AC)
					</div>
					<div className="text-2xl font-bold text-red-900">
						${performanceMetrics?.actualCost?.toLocaleString() || 0}
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="space-y-4">
					<div>
						<div className="flex justify-between items-center mb-2">
							<span className="text-sm font-medium text-gray-700">
								Schedule Performance Index (SPI)
							</span>
							<span
								className={`text-sm font-bold ${
									(performanceMetrics?.spi || 0) >= 1
										? "text-green-600"
										: "text-red-600"
								}`}
							>
								{performanceMetrics?.spi?.toFixed(2) || 0}
							</span>
						</div>
						<ProgressBar
							progress={(performanceMetrics?.spi || 0) * 100}
							max={200}
							color={(performanceMetrics?.spi || 0) >= 1 ? "green" : "red"}
						/>
					</div>

					<div>
						<div className="flex justify-between items-center mb-2">
							<span className="text-sm font-medium text-gray-700">
								Cost Performance Index (CPI)
							</span>
							<span
								className={`text-sm font-bold ${
									(performanceMetrics?.cpi || 0) >= 1
										? "text-green-600"
										: "text-red-600"
								}`}
							>
								{performanceMetrics?.cpi?.toFixed(2) || 0}
							</span>
						</div>
						<ProgressBar
							progress={(performanceMetrics?.cpi || 0) * 100}
							max={200}
							color={(performanceMetrics?.cpi || 0) >= 1 ? "green" : "red"}
						/>
					</div>
				</div>

				<div className="bg-gray-50 rounded-xl p-4">
					<h3 className="font-medium text-gray-900 mb-3">Proyecciones</h3>
					<div className="space-y-2">
						<div className="flex justify-between">
							<span className="text-sm text-gray-600">
								Estimado al Completar (EAC)
							</span>
							<span className="text-sm font-medium text-gray-900">
								$
								{performanceMetrics?.estimateAtCompletion?.toLocaleString() ||
									0}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-sm text-gray-600">
								Variación al Completar (VAC)
							</span>
							<span
								className={`text-sm font-medium ${
									(performanceMetrics?.varianceAtCompletion || 0) >= 0
										? "text-green-600"
										: "text-red-600"
								}`}
							>
								$
								{performanceMetrics?.varianceAtCompletion?.toLocaleString() ||
									0}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-sm text-gray-600">
								Fecha Estimada de Finalización
							</span>
							<span className="text-sm font-medium text-gray-900">
								{performanceMetrics?.estimatedCompletionDate || "N/A"}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);

	const renderCriticalPathAnalysis = () => (
		<div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
			<h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
				<ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
				Análisis de Ruta Crítica
			</h2>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div>
					<h3 className="font-medium text-gray-900 mb-3">
						Actividades Críticas
					</h3>
					<div className="space-y-3">
						{analytics?.criticalActivities?.map((activity, index) => (
							<div
								key={index}
								className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200"
							>
								<div>
									<div className="font-medium text-red-900">
										{activity.name}
									</div>
									<div className="text-sm text-red-700">
										{activity.duration} días
									</div>
								</div>
								<div className="text-right">
									<div className="text-sm font-medium text-red-800">
										{activity.progress}%
									</div>
									<div className="text-xs text-red-600">{activity.status}</div>
								</div>
							</div>
						)) || []}
					</div>
				</div>

				<div>
					<h3 className="font-medium text-gray-900 mb-3">Métricas de Riesgo</h3>
					<div className="space-y-4">
						<div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
							<div className="flex items-center gap-2 mb-2">
								<ExclamationTriangleIcon className="h-4 w-4 text-yellow-600" />
								<span className="font-medium text-yellow-900">
									Actividades en Riesgo
								</span>
							</div>
							<div className="text-2xl font-bold text-yellow-900">
								{analytics?.riskActivities?.length || 0}
							</div>
						</div>

						<div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
							<div className="flex items-center gap-2 mb-2">
								<ClockIcon className="h-4 w-4 text-blue-600" />
								<span className="font-medium text-blue-900">
									Holgura Promedio
								</span>
							</div>
							<div className="text-2xl font-bold text-blue-900">
								{analytics?.averageFloat || 0} días
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);

	if (isLoading) {
		return (
			<div className="max-w-7xl mx-auto px-4 py-8">
				<div className="flex items-center justify-center h-64">
					<div className="text-center">
						<LoadingSpinner size="lg" className="mx-auto mb-4" />
						<p className="text-gray-600">
							Cargando analytics del cronograma...
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto px-4 py-8">
			{renderHeader()}

			{selectedView === "overview" && (
				<>
					{renderKPIs()}
					{renderEarnedValueChart()}
					{renderCriticalPathAnalysis()}
				</>
			)}

			{selectedView === "performance" && (
				<div className="space-y-6">
					{renderKPIs()}
					{renderEarnedValueChart()}

					<div className="bg-white rounded-2xl border border-gray-200 p-6">
						<h2 className="text-lg font-semibold text-gray-900 mb-4">
							Tendencias de Performance
						</h2>
						<div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
							<p className="text-gray-500">
								Gráfico de tendencias se renderizará aquí
							</p>
						</div>
					</div>
				</div>
			)}

			{selectedView === "resources" && (
				<div className="space-y-6">
					<div className="bg-white rounded-2xl border border-gray-200 p-6">
						<h2 className="text-lg font-semibold text-gray-900 mb-4">
							Utilización de Recursos
						</h2>
						<div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
							<p className="text-gray-500">
								Gráfico de recursos se renderizará aquí
							</p>
						</div>
					</div>
				</div>
			)}

			{selectedView === "costs" && (
				<div className="space-y-6">
					<div className="bg-white rounded-2xl border border-gray-200 p-6">
						<h2 className="text-lg font-semibold text-gray-900 mb-4">
							Análisis de Costos
						</h2>
						<div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
							<p className="text-gray-500">
								Gráfico de costos se renderizará aquí
							</p>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ScheduleAnalyticsDashboard;
