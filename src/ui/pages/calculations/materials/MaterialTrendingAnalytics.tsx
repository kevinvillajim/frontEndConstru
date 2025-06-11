// src/ui/pages/calculations/materials/MaterialTrendingAnalytics.tsx
// CORRECCIÓN: Agregada validación segura para propiedades de analyticsData

import React, {useState, useEffect, useCallback} from "react";
import {
	ChartBarIcon,
	ArrowTrendingUpIcon,
	FireIcon,
	ClockIcon,
	UserGroupIcon,
	SparklesIcon,
	CalendarDaysIcon,
	AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import {useMaterialTrending} from "../shared/hooks/useMaterialCalculations";
import type {
	MaterialAnalytics,
	MaterialTrendingTemplate,
} from "../shared/types/material.types";
import {
	LoadingSpinner,
	StatCard,
	EmptyState,
} from "./components/SharedComponents";

const MaterialTrendingAnalytics: React.FC = () => {
	const {trending, loading, error, fetchTrending, getAnalyticsOverview} =
		useMaterialTrending();

	const [selectedPeriod, setSelectedPeriod] = useState<
		"daily" | "weekly" | "monthly" | "yearly"
	>("weekly");
	const [analyticsData, setAnalyticsData] = useState<MaterialAnalytics | null>(
		null
	);
	const [analyticsLoading, setAnalyticsLoading] = useState(false);

	// useCallback para loadAnalytics para evitar dependencias infinitas
	const loadAnalytics = useCallback(async () => {
		setAnalyticsLoading(true);
		try {
			const data = await getAnalyticsOverview(selectedPeriod);
			setAnalyticsData(data);
		} catch (err) {
			console.error("Error loading analytics:", err);
		} finally {
			setAnalyticsLoading(false);
		}
	}, [selectedPeriod, getAnalyticsOverview]);

	// useEffect con dependencias corregidas
	useEffect(() => {
		fetchTrending(selectedPeriod, 10);
		loadAnalytics();
	}, [selectedPeriod, fetchTrending, loadAnalytics]);

	const handlePeriodChange = (
		period: "daily" | "weekly" | "monthly" | "yearly"
	) => {
		setSelectedPeriod(period);
	};

	const periodOptions = [
		{value: "daily", label: "Diario", icon: CalendarDaysIcon},
		{value: "weekly", label: "Semanal", icon: ClockIcon},
		{value: "monthly", label: "Mensual", icon: ArrowTrendingUpIcon},
		{value: "yearly", label: "Anual", icon: ChartBarIcon},
	] as const;

	// FUNCIÓN AUXILIAR: Validación segura de datos
	const safeGetValue = (
		value: unknown,
		fallback: string | number = 0
	): string => {
		if (value === null || value === undefined) {
			return typeof fallback === "number" ? fallback.toString() : fallback;
		}
		if (typeof value === "number") {
			return value.toLocaleString();
		}
		return String(value);
	};

	const safeGetNumber = (value: unknown, fallback: number = 0): number => {
		if (value === null || value === undefined || isNaN(Number(value))) {
			return fallback;
		}
		return Number(value);
	};

	if (loading || analyticsLoading) {
		return (
			<div className="max-w-7xl mx-auto px-4 py-8">
				<div className="flex items-center justify-center min-h-[400px]">
					<div className="text-center">
						<LoadingSpinner size="lg" className="mx-auto mb-4" />
						<p className="text-gray-600">Cargando analytics y tendencias...</p>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="max-w-7xl mx-auto px-4 py-8">
				<EmptyState
					icon={ChartBarIcon}
					title="Error al cargar analytics"
					description={error}
					actionButton={
						<button
							onClick={() => {
								fetchTrending(selectedPeriod, 10);
								loadAnalytics();
							}}
							className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
						>
							Reintentar
						</button>
					}
				/>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto px-4 py-8">
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">
					Analytics y Tendencias
				</h1>
				<p className="text-gray-600">
					Descubre las plantillas más populares y analiza las tendencias de uso.
				</p>
			</div>

			{/* Selector de período */}
			<div className="mb-8">
				<div className="flex items-center space-x-1 bg-white rounded-lg border border-gray-200 p-1">
					{periodOptions.map((option) => {
						const Icon = option.icon;
						return (
							<button
								key={option.value}
								onClick={() => handlePeriodChange(option.value)}
								className={`
									flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors
									${
										selectedPeriod === option.value
											? "bg-primary-100 text-primary-700 border border-primary-200"
											: "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
									}
								`}
							>
								<Icon className="h-4 w-4 mr-2" />
								{option.label}
							</button>
						);
					})}
				</div>
			</div>

			{/* Estadísticas generales - CON VALIDACIÓN SEGURA */}
			{analyticsData && (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					<StatCard
						icon={ChartBarIcon}
						title="Total de Cálculos"
						value={safeGetValue(analyticsData.totalCalculations)}
						subtitle={`Período ${selectedPeriod}`}
						color="blue"
						trend={
							analyticsData.growthRates?.calculations !== undefined
								? {
										value: safeGetNumber(
											analyticsData.growthRates.calculations
										),
										isPositive:
											safeGetNumber(analyticsData.growthRates.calculations) > 0,
									}
								: undefined
						}
					/>
					<StatCard
						icon={UserGroupIcon}
						title="Usuarios Únicos"
						value={safeGetValue(analyticsData.uniqueUsers)}
						subtitle="Usuarios activos"
						color="green"
						trend={
							analyticsData.growthRates?.users !== undefined
								? {
										value: safeGetNumber(analyticsData.growthRates.users),
										isPositive:
											safeGetNumber(analyticsData.growthRates.users) > 0,
									}
								: undefined
						}
					/>
					<StatCard
						icon={SparklesIcon}
						title="Tasa de Éxito"
						value={`${safeGetNumber(analyticsData.successRate).toFixed(1)}%`}
						subtitle="Cálculos exitosos"
						color="purple"
					/>
					<StatCard
						icon={ClockIcon}
						title="Tiempo Promedio"
						value={`${safeGetNumber(analyticsData.averageExecutionTime).toFixed(0)}ms`}
						subtitle="Tiempo de ejecución"
						color="yellow"
					/>
				</div>
			)}

			{/* Grid principal */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Plantillas en tendencia */}
				<div className="lg:col-span-2">
					<div className="bg-white rounded-xl border border-gray-200 p-6">
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-xl font-semibold text-gray-900 flex items-center">
								<FireIcon className="h-6 w-6 text-orange-500 mr-2" />
								Plantillas Trending
							</h2>
							<span className="text-sm text-gray-500 capitalize">
								{selectedPeriod}
							</span>
						</div>

						{trending.length === 0 ? (
							<EmptyState
								icon={FireIcon}
								title="No hay datos de tendencia"
								description="No se encontraron plantillas en tendencia para el período seleccionado."
							/>
						) : (
							<div className="space-y-4">
								{trending.map((item, index) => (
									<TrendingTemplateCard
										key={`${item.templateId}-${item.period}`}
										template={item}
										rank={index + 1}
									/>
								))}
							</div>
						)}
					</div>
				</div>

				{/* Panel lateral */}
				<div className="space-y-6">
					{/* Top templates - CON VALIDACIÓN SEGURA */}
					{analyticsData?.topTemplates &&
						analyticsData.topTemplates.length > 0 && (
							<div className="bg-white rounded-xl border border-gray-200 p-6">
								<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
									<ArrowTrendingUpIcon className="h-5 w-5 text-primary-600 mr-2" />
									Top Templates
								</h3>
								<div className="space-y-3">
									{analyticsData.topTemplates
										.slice(0, 5)
										.map((template, index) => (
											<div
												key={template.templateId}
												className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
											>
												<div className="flex-1">
													<div className="font-medium text-sm text-gray-900 truncate">
														{template.templateName || "Sin nombre"}
													</div>
													<div className="text-xs text-gray-500">
														{safeGetValue(template.usageCount)} usos
													</div>
												</div>
												<div className="text-right">
													<div className="text-sm font-medium text-primary-600">
														#{index + 1}
													</div>
													<div className="flex items-center text-xs text-yellow-500">
														<span>★</span>
														<span className="ml-1">
															{safeGetNumber(template.averageRating).toFixed(1)}
														</span>
													</div>
												</div>
											</div>
										))}
								</div>
							</div>
						)}

					{/* Distribución por tipo - CON VALIDACIÓN SEGURA */}
					{analyticsData?.calculationsByType &&
						Object.keys(analyticsData.calculationsByType).length > 0 && (
							<div className="bg-white rounded-xl border border-gray-200 p-6">
								<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
									<AdjustmentsHorizontalIcon className="h-5 w-5 text-blue-600 mr-2" />
									Por Tipo de Material
								</h3>
								<div className="space-y-3">
									{Object.entries(analyticsData.calculationsByType).map(
										([type, count]) => {
											const totalCalculations = safeGetNumber(
												analyticsData.totalCalculations
											);
											const percentage =
												totalCalculations > 0
													? (safeGetNumber(count) / totalCalculations) * 100
													: 0;

											return (
												<div key={type} className="space-y-1">
													<div className="flex justify-between text-sm">
														<span className="text-gray-700 font-medium">
															{type.replace("_", " ")}
														</span>
														<span className="text-gray-600">
															{safeGetValue(count)} ({percentage.toFixed(1)}%)
														</span>
													</div>
													<div className="w-full bg-gray-200 rounded-full h-2">
														<div
															className="bg-blue-600 h-2 rounded-full transition-all duration-300"
															style={{width: `${percentage}%`}}
														/>
													</div>
												</div>
											);
										}
									)}
								</div>
							</div>
						)}
				</div>
			</div>
		</div>
	);
};

// Componente para cada template trending - CON VALIDACIÓN SEGURA
interface TrendingTemplateCardProps {
	template: MaterialTrendingTemplate;
	rank: number;
}

const TrendingTemplateCard: React.FC<TrendingTemplateCardProps> = ({
	template,
	rank,
}) => {
	const getRankColor = (position: number) => {
		if (position === 1) return "text-yellow-600 bg-yellow-50 border-yellow-200";
		if (position === 2) return "text-gray-600 bg-gray-50 border-gray-200";
		if (position === 3) return "text-orange-600 bg-orange-50 border-orange-200";
		return "text-blue-600 bg-blue-50 border-blue-200";
	};

	const getTrendIcon = (score: number) => {
		if (score > 80) return "🚀";
		if (score > 60) return "📈";
		if (score > 40) return "📊";
		return "📉";
	};

	// Validación segura de los datos del template
	const safeTemplate = {
		templateName: template.templateName || "Sin nombre",
		usageCount: template.usageCount || 0,
		uniqueUsers: template.uniqueUsers || 0,
		successRate: template.successRate || 0,
		trendScore: template.trendScore || 0,
	};

	return (
		<div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
			{/* Rank badge */}
			<div
				className={`
				w-8 h-8 rounded-full border flex items-center justify-center text-sm font-bold
				${getRankColor(rank)}
			`}
			>
				{rank}
			</div>

			{/* Template info */}
			<div className="flex-1 min-w-0">
				<div className="flex items-center space-x-2">
					<h4 className="font-medium text-gray-900 truncate">
						{safeTemplate.templateName}
					</h4>
					<span className="text-lg">
						{getTrendIcon(safeTemplate.trendScore)}
					</span>
				</div>
				<div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
					<span className="flex items-center">
						<ChartBarIcon className="h-4 w-4 mr-1" />
						{safeTemplate.usageCount.toLocaleString()} usos
					</span>
					<span className="flex items-center">
						<UserGroupIcon className="h-4 w-4 mr-1" />
						{safeTemplate.uniqueUsers.toLocaleString()} usuarios
					</span>
					<span className="flex items-center">
						<SparklesIcon className="h-4 w-4 mr-1" />
						{safeTemplate.successRate.toFixed(1)}% éxito
					</span>
				</div>
			</div>

			{/* Trend score */}
			<div className="text-right">
				<div className="text-lg font-bold text-primary-600">
					{safeTemplate.trendScore.toFixed(1)}
				</div>
				<div className="text-xs text-gray-500">Trend Score</div>
			</div>
		</div>
	);
};

export default MaterialTrendingAnalytics;
