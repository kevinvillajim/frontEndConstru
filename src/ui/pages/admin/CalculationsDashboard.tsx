import React, {useState} from "react";
import {
	CalculatorIcon,
	ClockIcon,
	CheckBadgeIcon,
	ArrowTrendingUpIcon,
	ArrowTrendingDownIcon,
	CalendarIcon,
	CpuChipIcon,
	ArrowPathIcon,
	EyeIcon,
	DocumentTextIcon,
} from "@heroicons/react/24/outline";
import {
	StarIcon as StarSolidIcon,
	ChartBarIcon as ChartBarSolidIcon,
} from "@heroicons/react/24/solid";

// Tipos de datos
interface MetricCard {
	title: string;
	value: string | number;
	change: number;
	changeType: "increase" | "decrease" | "neutral";
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
	color: string;
}

interface CategoryUsage {
	category: string;
	name: string;
	icon: string;
	usage: number;
	growth: number;
	templates: number;
	avgTime: string;
	color: string;
}

interface PopularTemplate {
	id: string;
	name: string;
	category: string;
	usage: number;
	rating: number;
	avgTime: string;
	trend: "up" | "down" | "stable";
	necReference: string;
}

interface UsageData {
	period: string;
	calculations: number;
	templates: number;
	users: number;
}

// Datos mock
const mockMetrics: MetricCard[] = [
	{
		title: "Total Cálculos",
		value: "2,847",
		change: 12.5,
		changeType: "increase",
		icon: CalculatorIcon,
		color: "bg-blue-500",
	},
	{
		title: "Plantillas Activas",
		value: 156,
		change: 8.2,
		changeType: "increase",
		icon: DocumentTextIcon,
		color: "bg-green-500",
	},
	{
		title: "Tiempo Promedio",
		value: "8.5 min",
		change: -15.3,
		changeType: "decrease",
		icon: ClockIcon,
		color: "bg-yellow-500",
	},
	{
		title: "Tasa de Éxito",
		value: "96.8%",
		change: 2.1,
		changeType: "increase",
		icon: CheckBadgeIcon,
		color: "bg-emerald-500",
	},
];

const mockCategoryUsage: CategoryUsage[] = [
	{
		category: "structural",
		name: "Estructural",
		icon: "🏗️",
		usage: 1247,
		growth: 15.2,
		templates: 45,
		avgTime: "12.3 min",
		color: "bg-blue-50 border-blue-200 text-blue-700",
	},
	{
		category: "electrical",
		name: "Eléctrico",
		icon: "⚡",
		usage: 923,
		growth: 8.7,
		templates: 38,
		avgTime: "7.8 min",
		color: "bg-yellow-50 border-yellow-200 text-yellow-700",
	},
	{
		category: "architectural",
		name: "Arquitectónico",
		icon: "🏛️",
		usage: 567,
		growth: 22.1,
		templates: 31,
		avgTime: "5.2 min",
		color: "bg-green-50 border-green-200 text-green-700",
	},
	{
		category: "hydraulic",
		name: "Hidráulico",
		icon: "🚰",
		usage: 334,
		growth: 12.8,
		templates: 24,
		avgTime: "9.7 min",
		color: "bg-cyan-50 border-cyan-200 text-cyan-700",
	},
];

const mockPopularTemplates: PopularTemplate[] = [
	{
		id: "1",
		name: "Demanda Eléctrica Residencial",
		category: "Eléctrico",
		usage: 342,
		rating: 4.9,
		avgTime: "6.5 min",
		trend: "up",
		necReference: "NEC-SB-IE 1.1",
	},
	{
		id: "2",
		name: "Diseño de Vigas HA",
		category: "Estructural",
		usage: 298,
		rating: 4.8,
		avgTime: "15.2 min",
		trend: "up",
		necReference: "NEC-SE-HM 9.2",
	},
	{
		id: "3",
		name: "Cálculo de Áreas",
		category: "Arquitectónico",
		usage: 245,
		rating: 4.6,
		avgTime: "4.8 min",
		trend: "stable",
		necReference: "NEC-HS-A 15.1",
	},
	{
		id: "4",
		name: "Análisis Sísmico Estático",
		category: "Estructural",
		usage: 189,
		rating: 4.7,
		avgTime: "22.3 min",
		trend: "up",
		necReference: "NEC-SE-DS 2.1",
	},
	{
		id: "5",
		name: "Dimensionamiento Tuberías",
		category: "Hidráulico",
		usage: 156,
		rating: 4.5,
		avgTime: "11.2 min",
		trend: "down",
		necReference: "NEC-HS-HI 3.1",
	},
];

const mockUsageData: UsageData[] = [
	{period: "Ene", calculations: 186, templates: 12, users: 45},
	{period: "Feb", calculations: 205, templates: 15, users: 52},
	{period: "Mar", calculations: 237, templates: 18, users: 61},
	{period: "Abr", calculations: 298, templates: 22, users: 78},
	{period: "May", calculations: 342, templates: 28, users: 89},
	{period: "Jun", calculations: 387, templates: 31, users: 95},
];

const CalculationsDashboard: React.FC = () => {
	const [selectedPeriod, setSelectedPeriod] = useState("last30days");
	const [selectedMetric, setSelectedMetric] = useState("calculations");

	const periods = [
		{value: "last7days", label: "Últimos 7 días"},
		{value: "last30days", label: "Últimos 30 días"},
		{value: "last3months", label: "Últimos 3 meses"},
		{value: "lastyear", label: "Último año"},
	];

	const getChangeIcon = (changeType: string) => {
		switch (changeType) {
			case "increase":
				return <ArrowTrendingUpIcon className="h-4 w-4 text-green-600" />;
			case "decrease":
				return <ArrowTrendingDownIcon className="h-4 w-4 text-red-600" />;
			default:
				return <ArrowPathIcon className="h-4 w-4 text-gray-600" />;
		}
	};

	const getChangeColor = (changeType: string) => {
		switch (changeType) {
			case "increase":
				return "text-green-600";
			case "decrease":
				return "text-red-600";
			default:
				return "text-gray-600";
		}
	};

	const getTrendIcon = (trend: string) => {
		switch (trend) {
			case "up":
				return <ArrowTrendingUpIcon className="h-4 w-4 text-green-600" />;
			case "down":
				return <ArrowTrendingDownIcon className="h-4 w-4 text-red-600" />;
			default:
				return <ArrowPathIcon className="h-4 w-4 text-gray-600" />;
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white border-b border-gray-200">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
						<div>
							<h1 className="text-3xl font-bold text-gray-900 tracking-tight">
								Dashboard de Cálculos
							</h1>
							<p className="text-gray-600 mt-1">
								Métricas, análisis y tendencias de uso de cálculos técnicos
							</p>
						</div>

						<div className="flex items-center gap-3">
							<select
								value={selectedPeriod}
								onChange={(e) => setSelectedPeriod(e.target.value)}
								className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
							>
								{periods.map((period) => (
									<option key={period.value} value={period.value}>
										{period.label}
									</option>
								))}
							</select>
						</div>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Métricas principales */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					{mockMetrics.map((metric, index) => (
						<div
							key={index}
							className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-200"
						>
							<div className="flex items-center justify-between mb-4">
								<div
									className={`w-12 h-12 ${metric.color} rounded-xl flex items-center justify-center`}
								>
									<metric.icon className="h-6 w-6 text-white" />
								</div>
								<div
									className={`flex items-center gap-1 text-sm ${getChangeColor(metric.changeType)}`}
								>
									{getChangeIcon(metric.changeType)}
									<span className="font-medium">
										{Math.abs(metric.change)}%
									</span>
								</div>
							</div>
							<div>
								<div className="text-2xl font-bold text-gray-900 mb-1">
									{metric.value}
								</div>
								<div className="text-sm text-gray-600">{metric.title}</div>
							</div>
						</div>
					))}
				</div>

				{/* Gráfico de tendencias */}
				<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
					<div className="flex items-center justify-between mb-6">
						<h3 className="text-xl font-semibold text-gray-900">
							Tendencias de Uso
						</h3>
						<div className="flex gap-2">
							<button
								onClick={() => setSelectedMetric("calculations")}
								className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
									selectedMetric === "calculations"
										? "bg-primary-600 text-white"
										: "bg-gray-100 text-gray-600 hover:bg-gray-200"
								}`}
							>
								Cálculos
							</button>
							<button
								onClick={() => setSelectedMetric("templates")}
								className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
									selectedMetric === "templates"
										? "bg-primary-600 text-white"
										: "bg-gray-100 text-gray-600 hover:bg-gray-200"
								}`}
							>
								Plantillas
							</button>
							<button
								onClick={() => setSelectedMetric("users")}
								className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
									selectedMetric === "users"
										? "bg-primary-600 text-white"
										: "bg-gray-100 text-gray-600 hover:bg-gray-200"
								}`}
							>
								Usuarios
							</button>
						</div>
					</div>

					{/* Gráfico simple (representación visual) */}
					<div className="h-64 flex items-end justify-between gap-2 mb-4">
						{mockUsageData.map((data, index) => {
							const value =
								selectedMetric === "calculations"
									? data.calculations
									: selectedMetric === "templates"
										? data.templates
										: data.users;
							const maxValue = Math.max(
								...mockUsageData.map((d) =>
									selectedMetric === "calculations"
										? d.calculations
										: selectedMetric === "templates"
											? d.templates
											: d.users
								)
							);
							const height = (value / maxValue) * 100;

							return (
								<div key={index} className="flex-1 flex flex-col items-center">
									<div
										className="w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-lg transition-all duration-500 hover:from-primary-700 hover:to-primary-500 cursor-pointer group relative"
										style={{height: `${height}%`}}
									>
										<div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
											{value}
										</div>
									</div>
									<div className="text-xs text-gray-600 mt-2 font-medium">
										{data.period}
									</div>
								</div>
							);
						})}
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
					{/* Uso por categoría */}
					<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
						<h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
							<ChartBarSolidIcon className="h-5 w-5 text-primary-600" />
							Uso por Especialidad
						</h3>

						<div className="space-y-4">
							{mockCategoryUsage.map((category) => (
								<div
									key={category.category}
									className={`p-4 rounded-xl border ${category.color}`}
								>
									<div className="flex items-center justify-between mb-3">
										<div className="flex items-center gap-3">
											<span className="text-2xl">{category.icon}</span>
											<div>
												<h4 className="font-semibold">{category.name}</h4>
												<p className="text-sm opacity-70">
													{category.templates} plantillas
												</p>
											</div>
										</div>
										<div className="text-right">
											<div className="text-xl font-bold">
												{category.usage.toLocaleString()}
											</div>
											<div className="text-sm opacity-70">usos</div>
										</div>
									</div>

									<div className="flex items-center justify-between text-sm">
										<div className="flex items-center gap-1">
											<ArrowTrendingUpIcon className="h-4 w-4 text-green-600" />
											<span className="text-green-600 font-medium">
												+{category.growth}%
											</span>
										</div>
										<div className="flex items-center gap-1">
											<ClockIcon className="h-4 w-4 opacity-70" />
											<span className="opacity-70">{category.avgTime}</span>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Plantillas más populares */}
					<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
						<h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
							<StarSolidIcon className="h-5 w-5 text-yellow-500" />
							Plantillas Más Populares
						</h3>

						<div className="space-y-4">
							{mockPopularTemplates.map((template, index) => (
								<div
									key={template.id}
									className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors"
								>
									<div className="flex-1">
										<div className="flex items-center gap-2 mb-1">
											<span className="text-lg font-semibold text-gray-900">
												#{index + 1}
											</span>
											<h4 className="font-medium text-gray-900">
												{template.name}
											</h4>
											{getTrendIcon(template.trend)}
										</div>
										<div className="flex items-center gap-4 text-sm text-gray-600">
											<span>{template.category}</span>
											<div className="flex items-center gap-1">
												<StarSolidIcon className="h-3 w-3 text-yellow-400" />
												<span>{template.rating}</span>
											</div>
											<div className="flex items-center gap-1">
												<ClockIcon className="h-3 w-3" />
												<span>{template.avgTime}</span>
											</div>
										</div>
									</div>
									<div className="text-right">
										<div className="text-lg font-bold text-primary-600">
											{template.usage}
										</div>
										<div className="text-xs text-gray-500">usos</div>
									</div>
								</div>
							))}
						</div>

						<div className="mt-6 pt-4 border-t border-gray-100">
							<button className="w-full text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center justify-center gap-2 py-2">
								<EyeIcon className="h-4 w-4" />
								Ver Todas las Plantillas
							</button>
						</div>
					</div>
				</div>

				{/* Estadísticas adicionales */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{/* Rendimiento del sistema */}
					<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
							<CpuChipIcon className="h-5 w-5 text-primary-600" />
							Rendimiento
						</h3>

						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-600">
									Tiempo de Respuesta
								</span>
								<span className="font-medium text-green-600">1.2s</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-600">Disponibilidad</span>
								<span className="font-medium text-green-600">99.8%</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-600">
									Errores de Cálculo
								</span>
								<span className="font-medium text-yellow-600">0.2%</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-600">Uso de CPU</span>
								<span className="font-medium text-blue-600">45%</span>
							</div>
						</div>
					</div>

					{/* Cumplimiento normativo */}
					<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
							<CheckBadgeIcon className="h-5 w-5 text-green-600" />
							Cumplimiento NEC
						</h3>

						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-600">
									Cálculos Conformes
								</span>
								<span className="font-medium text-green-600">96.8%</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-600">Con Advertencias</span>
								<span className="font-medium text-yellow-600">2.9%</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-600">No Conformes</span>
								<span className="font-medium text-red-600">0.3%</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-600">
									Normativa Actualizada
								</span>
								<span className="font-medium text-green-600">Mar 2024</span>
							</div>
						</div>
					</div>

					{/* Actividad reciente */}
					<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
							<CalendarIcon className="h-5 w-5 text-primary-600" />
							Actividad Reciente
						</h3>

						<div className="space-y-3">
							<div className="flex items-start gap-3">
								<div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
								<div className="flex-1">
									<p className="text-sm text-gray-900">
										Nueva plantilla: "Análisis de Cargas Sísmicas"
									</p>
									<p className="text-xs text-gray-500">Hace 2 horas</p>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
								<div className="flex-1">
									<p className="text-sm text-gray-900">
										Actualización normativa NEC-SE-HM
									</p>
									<p className="text-xs text-gray-500">Hace 1 día</p>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
								<div className="flex-1">
									<p className="text-sm text-gray-900">
										Mantenimiento programado completado
									</p>
									<p className="text-xs text-gray-500">Hace 3 días</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CalculationsDashboard;
