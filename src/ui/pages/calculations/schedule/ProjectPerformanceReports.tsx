// src/ui/pages/calculations/schedule/ProjectPerformanceReports.tsx
import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import {
	DocumentTextIcon,
	ChartBarIcon,
	ExclamationTriangleIcon,
	LightBulbIcon,
	ArrowDownTrayIcon,
	CalendarDaysIcon,
	BuildingOfficeIcon,
	UsersIcon,
	CurrencyDollarIcon,
	ClockIcon,
	ArrowTrendingUpIcon,
	ArrowTrendingDownIcon,
	CheckCircleIcon,
	InformationCircleIcon,
	FlagIcon,
} from "@heroicons/react/24/outline";
import {useProjectReports} from "../shared/hooks/useProjectReports";
import {
	LoadingSpinner,
	Alert,
	Badge,
	ProgressBar,
} from "../shared/components/SharedComponents";

interface ReportMetric {
	label: string;
	value: string | number;
	trend?: "up" | "down" | "neutral";
	status?: "good" | "warning" | "critical";
	target?: string | number;
}

interface ProductivityMetric {
	trade: string;
	planned: number;
	actual: number;
	efficiency: number;
	trend: "up" | "down" | "neutral";
}

interface Bottleneck {
	id: string;
	activity: string;
	impact: "high" | "medium" | "low";
	delay: number;
	cause: string;
	recommendation: string;
}

interface Recommendation {
	id: string;
	category: "schedule" | "resources" | "quality" | "cost";
	priority: "high" | "medium" | "low";
	title: string;
	description: string;
	expectedImpact: string;
	effort: "low" | "medium" | "high";
}

const MetricCard: React.FC<{metric: ReportMetric}> = ({metric}) => {
	const getStatusColor = (status?: string) => {
		switch (status) {
			case "good":
				return "text-green-600 bg-green-50 border-green-200";
			case "warning":
				return "text-yellow-600 bg-yellow-50 border-yellow-200";
			case "critical":
				return "text-red-600 bg-red-50 border-red-200";
			default:
				return "text-blue-600 bg-blue-50 border-blue-200";
		}
	};

	const getTrendIcon = (trend?: string) => {
		switch (trend) {
			case "up":
				return <ArrowTrendingUpIcon className="h-4 w-4 text-green-600" />;
			case "down":
				return <ArrowTrendingDownIcon className="h-4 w-4 text-red-600" />;
			default:
				return null;
		}
	};

	return (
		<div className={`border rounded-lg p-4 ${getStatusColor(metric.status)}`}>
			<div className="flex items-center justify-between mb-2">
				<span className="text-sm font-medium">{metric.label}</span>
				{getTrendIcon(metric.trend)}
			</div>
			<div className="text-2xl font-bold mb-1">{metric.value}</div>
			{metric.target && (
				<div className="text-xs opacity-75">Meta: {metric.target}</div>
			)}
		</div>
	);
};

const ProductivityChart: React.FC<{data: ProductivityMetric[]}> = ({data}) => (
	<div className="space-y-4">
		{data.map((item, index) => (
			<div key={index} className="bg-gray-50 rounded-lg p-4">
				<div className="flex items-center justify-between mb-3">
					<h4 className="font-medium text-gray-900">{item.trade}</h4>
					<div className="flex items-center gap-2">
						<Badge
							variant={
								item.efficiency >= 100
									? "success"
									: item.efficiency >= 85
										? "warning"
										: "error"
							}
						>
							{item.efficiency}% eficiencia
						</Badge>
						{item.trend === "up" && (
							<ArrowTrendingUpIcon className="h-4 w-4 text-green-600" />
						)}
						{item.trend === "down" && (
							<ArrowTrendingDownIcon className="h-4 w-4 text-red-600" />
						)}
					</div>
				</div>

				<div className="grid grid-cols-2 gap-4 mb-3">
					<div>
						<span className="text-sm text-gray-600">Planificado</span>
						<div className="font-semibold">{item.planned} unidades/día</div>
					</div>
					<div>
						<span className="text-sm text-gray-600">Real</span>
						<div className="font-semibold">{item.actual} unidades/día</div>
					</div>
				</div>

				<ProgressBar
					progress={item.efficiency}
					max={120}
					color={
						item.efficiency >= 100
							? "green"
							: item.efficiency >= 85
								? "yellow"
								: "red"
					}
					showPercentage={false}
				/>
			</div>
		))}
	</div>
);

const BottlenecksList: React.FC<{bottlenecks: Bottleneck[]}> = ({
	bottlenecks,
}) => (
	<div className="space-y-4">
		{bottlenecks.map((bottleneck) => (
			<div
				key={bottleneck.id}
				className="border border-red-200 rounded-lg p-4 bg-red-50"
			>
				<div className="flex items-start justify-between mb-3">
					<div className="flex-1">
						<h4 className="font-medium text-red-900 mb-1">
							{bottleneck.activity}
						</h4>
						<p className="text-sm text-red-700">{bottleneck.cause}</p>
					</div>
					<div className="flex items-center gap-2">
						<Badge
							variant={
								bottleneck.impact === "high"
									? "error"
									: bottleneck.impact === "medium"
										? "warning"
										: "info"
							}
						>
							{bottleneck.impact === "high"
								? "Alto"
								: bottleneck.impact === "medium"
									? "Medio"
									: "Bajo"}{" "}
							impacto
						</Badge>
						<span className="text-sm font-medium text-red-800">
							{bottleneck.delay} días de atraso
						</span>
					</div>
				</div>

				<div className="bg-white rounded p-3 border border-red-100">
					<div className="flex items-start gap-2">
						<LightBulbIcon className="h-4 w-4 text-yellow-600 mt-0.5" />
						<div>
							<span className="text-sm font-medium text-gray-900">
								Recomendación:
							</span>
							<p className="text-sm text-gray-700 mt-1">
								{bottleneck.recommendation}
							</p>
						</div>
					</div>
				</div>
			</div>
		))}
	</div>
);

const RecommendationsList: React.FC<{recommendations: Recommendation[]}> = ({
	recommendations,
}) => {
	const getCategoryIcon = (category: string) => {
		switch (category) {
			case "schedule":
				return <CalendarDaysIcon className="h-4 w-4" />;
			case "resources":
				return <UsersIcon className="h-4 w-4" />;
			case "quality":
				return <CheckCircleIcon className="h-4 w-4" />;
			case "cost":
				return <CurrencyDollarIcon className="h-4 w-4" />;
			default:
				return <InformationCircleIcon className="h-4 w-4" />;
		}
	};

	const getCategoryColor = (category: string) => {
		switch (category) {
			case "schedule":
				return "text-blue-600 bg-blue-50";
			case "resources":
				return "text-green-600 bg-green-50";
			case "quality":
				return "text-purple-600 bg-purple-50";
			case "cost":
				return "text-yellow-600 bg-yellow-50";
			default:
				return "text-gray-600 bg-gray-50";
		}
	};

	return (
		<div className="space-y-4">
			{recommendations.map((rec) => (
				<div
					key={rec.id}
					className="border border-gray-200 rounded-lg p-4 bg-white"
				>
					<div className="flex items-start justify-between mb-3">
						<div className="flex items-start gap-3">
							<div
								className={`p-2 rounded-lg ${getCategoryColor(rec.category)}`}
							>
								{getCategoryIcon(rec.category)}
							</div>
							<div className="flex-1">
								<h4 className="font-medium text-gray-900 mb-1">{rec.title}</h4>
								<p className="text-sm text-gray-600">{rec.description}</p>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<Badge
								variant={
									rec.priority === "high"
										? "error"
										: rec.priority === "medium"
											? "warning"
											: "info"
								}
							>
								{rec.priority === "high"
									? "Alta"
									: rec.priority === "medium"
										? "Media"
										: "Baja"}{" "}
								prioridad
							</Badge>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4 text-sm">
						<div>
							<span className="text-gray-600">Impacto esperado:</span>
							<div className="font-medium text-gray-900">
								{rec.expectedImpact}
							</div>
						</div>
						<div>
							<span className="text-gray-600">Esfuerzo requerido:</span>
							<div className="font-medium text-gray-900">
								{rec.effort === "high"
									? "Alto"
									: rec.effort === "medium"
										? "Medio"
										: "Bajo"}
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

const ProjectPerformanceReports: React.FC = () => {
	const {projectId} = useParams<{projectId: string}>();
	const {
		performanceReport,
		generateReport,
		exportReport,
		isLoading,
		isExporting,
	} = useProjectReports();

	const [selectedReportType, setSelectedReportType] = useState<
		"executive" | "detailed" | "technical"
	>("executive");
	const [reportPeriod, setReportPeriod] = useState<
		"week" | "month" | "quarter"
	>("month");

	useEffect(() => {
		if (projectId) {
			generateReport(projectId, selectedReportType, reportPeriod);
		}
	}, [projectId, selectedReportType, reportPeriod, generateReport]);

	const handleExportReport = async (format: "pdf" | "excel") => {
		if (!projectId) return;
		await exportReport(projectId, selectedReportType, format);
	};

	const renderHeader = () => (
		<div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-4">
					<div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
						<DocumentTextIcon className="h-6 w-6 text-white" />
					</div>
					<div>
						<h1 className="text-2xl font-bold text-gray-900">
							Reportes de Performance
						</h1>
						<p className="text-gray-600">
							Análisis automático de productividad y recomendaciones
						</p>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<select
						value={reportPeriod}
						onChange={(e) =>
							setReportPeriod(e.target.value as typeof reportPeriod)
						}
						className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					>
						<option value="week">Esta semana</option>
						<option value="month">Este mes</option>
						<option value="quarter">Este trimestre</option>
					</select>

					<div className="flex gap-2">
						<button
							onClick={() => handleExportReport("pdf")}
							disabled={isExporting}
							className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
						>
							<ArrowDownTrayIcon className="h-4 w-4" />
							PDF
						</button>
						<button
							onClick={() => handleExportReport("excel")}
							disabled={isExporting}
							className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
						>
							<ArrowDownTrayIcon className="h-4 w-4" />
							Excel
						</button>
					</div>
				</div>
			</div>

			<div className="flex gap-2">
				{[
					{key: "executive", label: "Ejecutivo"},
					{key: "detailed", label: "Detallado"},
					{key: "technical", label: "Técnico"},
				].map((type) => (
					<button
						key={type.key}
						onClick={() =>
							setSelectedReportType(type.key as typeof selectedReportType)
						}
						className={`px-4 py-2 rounded-lg font-medium transition-colors ${
							selectedReportType === type.key
								? "bg-blue-100 text-blue-700 border border-blue-200"
								: "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
						}`}
					>
						{type.label}
					</button>
				))}
			</div>
		</div>
	);

	const renderExecutiveSummary = () => (
		<div className="space-y-6">
			{/* Key Metrics */}
			<div className="bg-white rounded-2xl border border-gray-200 p-6">
				<h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
					<ChartBarIcon className="h-5 w-5 text-blue-600" />
					Métricas Clave
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					{performanceReport?.keyMetrics?.map((metric, index) => (
						<MetricCard key={index} metric={metric} />
					)) || []}
				</div>
			</div>

			{/* Status Overview */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="bg-white rounded-2xl border border-gray-200 p-6">
					<h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
						<FlagIcon className="h-5 w-5 text-yellow-600" />
						Estado del Proyecto
					</h2>
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<span className="text-gray-700">Progreso general</span>
							<span className="font-semibold">
								{performanceReport?.overallProgress || 0}%
							</span>
						</div>
						<ProgressBar
							progress={performanceReport?.overallProgress || 0}
							color="blue"
							showPercentage={false}
						/>

						<div className="pt-3 space-y-2">
							<div className="flex items-center gap-2">
								<CheckCircleIcon className="h-4 w-4 text-green-600" />
								<span className="text-sm text-gray-700">
									{performanceReport?.completedActivities || 0} actividades
									completadas
								</span>
							</div>
							<div className="flex items-center gap-2">
								<ClockIcon className="h-4 w-4 text-yellow-600" />
								<span className="text-sm text-gray-700">
									{performanceReport?.inProgressActivities || 0} en progreso
								</span>
							</div>
							<div className="flex items-center gap-2">
								<ExclamationTriangleIcon className="h-4 w-4 text-red-600" />
								<span className="text-sm text-gray-700">
									{performanceReport?.delayedActivities || 0} con atraso
								</span>
							</div>
						</div>
					</div>
				</div>

				<div className="bg-white rounded-2xl border border-gray-200 p-6">
					<h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
						<LightBulbIcon className="h-5 w-5 text-yellow-600" />
						Alertas Importantes
					</h2>
					<div className="space-y-3">
						{performanceReport?.alerts?.map((alert, index) => (
							<Alert
								key={index}
								type={alert.type as "success" | "warning" | "error" | "info"}
								message={alert.message}
							/>
						)) || []}
					</div>
				</div>
			</div>
		</div>
	);

	const renderDetailedAnalysis = () => (
		<div className="space-y-6">
			{/* Productivity Analysis */}
			<div className="bg-white rounded-2xl border border-gray-200 p-6">
				<h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
					<UsersIcon className="h-5 w-5 text-green-600" />
					Análisis de Productividad por Trade
				</h2>
				<ProductivityChart
					data={performanceReport?.productivityMetrics || []}
				/>
			</div>

			{/* Bottlenecks */}
			<div className="bg-white rounded-2xl border border-gray-200 p-6">
				<h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
					<ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
					Cuellos de Botella Identificados
				</h2>
				<BottlenecksList bottlenecks={performanceReport?.bottlenecks || []} />
			</div>

			{/* Recommendations */}
			<div className="bg-white rounded-2xl border border-gray-200 p-6">
				<h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
					<LightBulbIcon className="h-5 w-5 text-yellow-600" />
					Recomendaciones de Mejora
				</h2>
				<RecommendationsList
					recommendations={performanceReport?.recommendations || []}
				/>
			</div>
		</div>
	);

	if (isLoading) {
		return (
			<div className="max-w-7xl mx-auto px-4 py-8">
				<div className="flex items-center justify-center h-64">
					<div className="text-center">
						<LoadingSpinner size="lg" className="mx-auto mb-4" />
						<p className="text-gray-600">Generando reporte de performance...</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto px-4 py-8">
			{renderHeader()}

			{selectedReportType === "executive" && renderExecutiveSummary()}
			{selectedReportType === "detailed" && renderDetailedAnalysis()}
			{selectedReportType === "technical" && (
				<div className="bg-white rounded-2xl border border-gray-200 p-6">
					<h2 className="text-lg font-semibold text-gray-900 mb-4">
						Reporte Técnico Detallado
					</h2>
					<div className="text-center text-gray-500 py-12">
						<BuildingOfficeIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
						<p>El reporte técnico incluirá análisis detallado de:</p>
						<ul className="mt-4 space-y-2 text-sm">
							<li>• Análisis de ruta crítica completo</li>
							<li>• Métricas de calidad por actividad</li>
							<li>• Análisis de recursos detallado</li>
							<li>• Proyecciones y escenarios</li>
						</ul>
					</div>
				</div>
			)}
		</div>
	);
};

export default ProjectPerformanceReports;
