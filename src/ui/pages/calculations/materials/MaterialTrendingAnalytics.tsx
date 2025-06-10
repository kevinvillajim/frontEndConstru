// src/ui/pages/calculations/materials/MaterialTrendingAnalytics.tsx
import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {
	FireIcon,
	ChartBarIcon,
	GlobeAltIcon,
	ClockIcon,
	UserGroupIcon,
	StarIcon,
	PlayIcon,
	ArrowRightIcon,
	ArrowTrendingDownIcon,
	ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import {useMaterialTrending} from "../shared/hooks/useMaterialCalculations";
import type {
	MaterialAnalytics,
} from "../shared/types/material.types";

const TIME_PERIODS = [
	{id: "daily", name: "Hoy", description: "Últimas 24 horas"},
	{id: "weekly", name: "Semana", description: "Últimos 7 días"},
	{id: "monthly", name: "Mes", description: "Últimos 30 días"},
	{id: "yearly", name: "Año", description: "Últimos 12 meses"},
];

const MATERIAL_TYPES = [
	{id: "all", name: "Todos los Tipos", emoji: "🔍"},
	{id: "STEEL_STRUCTURES", name: "Acero", emoji: "🔩"},
	{id: "CERAMIC_FINISHES", name: "Cerámicos", emoji: "🔲"},
	{id: "CONCRETE_FOUNDATIONS", name: "Hormigón", emoji: "🏗️"},
	{id: "ELECTRICAL_INSTALLATIONS", name: "Eléctrico", emoji: "⚡"},
	{id: "MELAMINE_FURNITURE", name: "Muebles", emoji: "🗄️"},
];

const MaterialTrendingAnalytics: React.FC = () => {
	const navigate = useNavigate();
	const {
		trending,
		loading,
		error,
		fetchTrending,
		getAnalyticsOverview,
		getAnalyticsByType,
	} = useMaterialTrending();

	const [selectedPeriod, setSelectedPeriod] = useState<
		"daily" | "weekly" | "monthly" | "yearly"
	>("weekly");
	const [selectedType, setSelectedType] = useState("all");
	const [analytics, setAnalytics] = useState<MaterialAnalytics | null>(null);
	const [typeAnalytics, setTypeAnalytics] = useState<any>(null);

	useEffect(() => {
		fetchTrending(selectedPeriod, 10);
		loadAnalytics();
	}, [selectedPeriod, fetchTrending]);

	const loadAnalytics = async () => {
		try {
			const [overview, byType] = await Promise.all([
				getAnalyticsOverview(selectedPeriod),
				getAnalyticsByType(),
			]);
			setAnalytics(overview);
			setTypeAnalytics(byType);
		} catch (error) {
			console.error("Error loading analytics:", error);
		}
	};

	const handleUseTemplate = (templateId: string) => {
		navigate(`/calculations/materials/interface/${templateId}`);
	};

	const renderPeriodSelector = () => (
		<div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
			<h2 className="text-lg font-semibold text-gray-900 mb-4">
				Período de Análisis
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				{TIME_PERIODS.map((period) => (
					<button
						key={period.id}
						onClick={() =>
							setSelectedPeriod(
								period.id as "daily" | "weekly" | "monthly" | "yearly"
							)
						}
						className={`p-4 rounded-lg border-2 transition-all duration-200 ${
							selectedPeriod === period.id
								? "border-primary-500 bg-primary-50 text-primary-700"
								: "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
						}`}
					>
						<div className="text-center">
							<p className="font-medium">{period.name}</p>
							<p className="text-sm text-gray-600">{period.description}</p>
						</div>
					</button>
				))}
			</div>
		</div>
	);

	const renderAnalyticsCards = () => {
		if (!analytics) return null;

		return (
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
				<div className="bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 rounded-xl p-6">
					<div className="flex items-center">
						<div className="flex-shrink-0">
							<ChartBarIcon className="h-8 w-8 text-primary-600" />
						</div>
						<div className="ml-4">
							<p className="text-sm font-medium text-primary-700">
								Total Cálculos
							</p>
							<p className="text-2xl font-bold text-primary-900">
								{analytics.totalCalculations.toLocaleString()}
							</p>
							{analytics.comparisons && (
								<div className="flex items-center mt-1">
									{analytics.comparisons.previousPeriod.calculations >
									analytics.totalCalculations ? (
										<ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
									) : (
										<ArrowTrendingDownIcon className="h-4 w-4 text-green-500 mr-1" />
									)}
									<span className="text-xs text-gray-600">
										vs período anterior
									</span>
								</div>
							)}
						</div>
					</div>
				</div>

				<div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-6">
					<div className="flex items-center">
						<div className="flex-shrink-0">
							<UserGroupIcon className="h-8 w-8 text-emerald-600" />
						</div>
						<div className="ml-4">
							<p className="text-sm font-medium text-emerald-700">
								Usuarios Únicos
							</p>
							<p className="text-2xl font-bold text-emerald-900">
								{analytics.uniqueUsers.toLocaleString()}
							</p>
							{analytics.comparisons && (
								<div className="flex items-center mt-1">
									{analytics.comparisons.previousPeriod.users >
									analytics.uniqueUsers ? (
										<ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
									) : (
										<ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
									)}
									<span className="text-xs text-gray-600">
										vs período anterior
									</span>
								</div>
							)}
						</div>
					</div>
				</div>

				<div className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-6">
					<div className="flex items-center">
						<div className="flex-shrink-0">
							<ClockIcon className="h-8 w-8 text-amber-600" />
						</div>
						<div className="ml-4">
							<p className="text-sm font-medium text-amber-700">
								Tiempo Promedio
							</p>
							<p className="text-2xl font-bold text-amber-900">
								{analytics.averageExecutionTime}ms
							</p>
							<span className="text-xs text-gray-600">por cálculo</span>
						</div>
					</div>
				</div>

				<div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
					<div className="flex items-center">
						<div className="flex-shrink-0">
							<StarIcon className="h-8 w-8 text-green-600" />
						</div>
						<div className="ml-4">
							<p className="text-sm font-medium text-green-700">
								Tasa de Éxito
							</p>
							<p className="text-2xl font-bold text-green-900">
								{(analytics.successRate * 100).toFixed(1)}%
							</p>
							{analytics.comparisons && (
								<div className="flex items-center mt-1">
									{analytics.comparisons.previousPeriod.successRate >
									analytics.successRate ? (
										<ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
									) : (
										<ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
									)}
									<span className="text-xs text-gray-600">
										vs período anterior
									</span>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		);
	};

	const renderTrendingTemplates = () => (
		<div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-2">
					<FireIcon className="h-6 w-6 text-orange-500" />
					<h2 className="text-lg font-semibold text-gray-900">
						Plantillas en Tendencia -{" "}
						{TIME_PERIODS.find((p) => p.id === selectedPeriod)?.name}
					</h2>
				</div>
				<button
					onClick={() => navigate("/calculations/materials")}
					className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
				>
					Ver todas
					<ArrowRightIcon className="h-4 w-4" />
				</button>
			</div>

			{trending.length === 0 ? (
				<div className="text-center py-8">
					<FireIcon className="mx-auto h-12 w-12 text-gray-400" />
					<h3 className="mt-4 text-lg font-medium text-gray-900">
						No hay datos de tendencias
					</h3>
					<p className="mt-2 text-gray-600">
						Los datos de tendencias aparecerán cuando haya suficiente actividad
					</p>
				</div>
			) : (
				<div className="space-y-4">
					{trending.slice(0, 5).map((item, index) => (
						<div
							key={item.id}
							className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
						>
							{/* Ranking */}
							<div className="flex-shrink-0">
								<div
									className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
										index === 0
											? "bg-yellow-400 text-yellow-900"
											: index === 1
												? "bg-gray-300 text-gray-800"
												: index === 2
													? "bg-orange-400 text-orange-900"
													: "bg-gray-200 text-gray-700"
									}`}
								>
									{index + 1}
								</div>
							</div>

							{/* Template info */}
							<div className="flex-1">
								<h3 className="font-medium text-gray-900">
									{item.templateName}
								</h3>
								<div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
									<span className="flex items-center gap-1">
										<PlayIcon className="h-4 w-4" />
										{item.usageCount} usos
									</span>
									<span className="flex items-center gap-1">
										<UserGroupIcon className="h-4 w-4" />
										{item.uniqueUsers} usuarios
									</span>
									<span className="flex items-center gap-1">
										<StarIcon className="h-4 w-4" />
										{(item.successRate * 100).toFixed(1)}% éxito
									</span>
									<span className="flex items-center gap-1">
										<ArrowTrendingUpIcon className="h-4 w-4" />
										{item.trendScore.toFixed(1)} puntos
									</span>
								</div>
							</div>

							{/* Actions */}
							<div className="flex-shrink-0">
								<button
									onClick={() => handleUseTemplate(item.templateId)}
									className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
								>
									<PlayIcon className="h-4 w-4" />
									Usar
								</button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);

	const renderTypeAnalytics = () => {
		if (!analytics?.calculationsByType) return null;

		return (
			<div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
				<h2 className="text-lg font-semibold text-gray-900 mb-6">
					Distribución por Tipo de Material
				</h2>
				<div className="space-y-4">
					{Object.entries(analytics.calculationsByType).map(([type, count]) => {
						const typeConfig = MATERIAL_TYPES.find((t) => t.id === type);
						const percentage = (count / analytics.totalCalculations) * 100;

						return (
							<div key={type} className="flex items-center gap-4">
								<div className="flex items-center gap-2 min-w-0 flex-1">
									<span className="text-lg">{typeConfig?.emoji || "📊"}</span>
									<span className="font-medium text-gray-900 truncate">
										{typeConfig?.name || type}
									</span>
								</div>
								<div className="flex items-center gap-3">
									<div className="w-24 bg-gray-200 rounded-full h-2">
										<div
											className="bg-primary-600 h-2 rounded-full transition-all duration-300"
											style={{width: `${percentage}%`}}
										/>
									</div>
									<span className="text-sm font-medium text-gray-900 w-12 text-right">
										{percentage.toFixed(1)}%
									</span>
									<span className="text-sm text-gray-500 w-16 text-right">
										{count.toLocaleString()}
									</span>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		);
	};

	const renderTopTemplates = () => {
		if (!analytics?.topTemplates?.length) return null;

		return (
			<div className="bg-white rounded-xl border border-gray-200 p-6">
				<h2 className="text-lg font-semibold text-gray-900 mb-6">
					Plantillas Más Populares
				</h2>
				<div className="space-y-4">
					{analytics.topTemplates.map((template, index) => (
						<div
							key={template.templateId}
							className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
						>
							<div className="flex items-center gap-3">
								<span className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-medium">
									{index + 1}
								</span>
								<div>
									<h3 className="font-medium text-gray-900">
										{template.templateName}
									</h3>
									<div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
										<span>{template.usageCount} usos</span>
										<span className="flex items-center gap-1">
											<StarIcon className="h-4 w-4" />
											{template.averageRating.toFixed(1)}
										</span>
									</div>
								</div>
							</div>
							<button
								onClick={() => handleUseTemplate(template.templateId)}
								className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
							>
								<PlayIcon className="h-4 w-4" />
								Usar
							</button>
						</div>
					))}
				</div>
			</div>
		);
	};

	const renderRegionalAnalytics = () => {
		if (!analytics?.calculationsByRegion) return null;

		return (
			<div className="bg-white rounded-xl border border-gray-200 p-6">
				<h2 className="text-lg font-semibold text-gray-900 mb-6">
					Distribución Regional
				</h2>
				<div className="space-y-4">
					{Object.entries(analytics.calculationsByRegion).map(
						([region, count]) => {
							const percentage = (count / analytics.totalCalculations) * 100;

							return (
								<div key={region} className="flex items-center gap-4">
									<div className="flex items-center gap-2 min-w-0 flex-1">
										<GlobeAltIcon className="h-5 w-5 text-gray-400" />
										<span className="font-medium text-gray-900 capitalize">
											{region}
										</span>
									</div>
									<div className="flex items-center gap-3">
										<div className="w-24 bg-gray-200 rounded-full h-2">
											<div
												className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
												style={{width: `${percentage}%`}}
											/>
										</div>
										<span className="text-sm font-medium text-gray-900 w-12 text-right">
											{percentage.toFixed(1)}%
										</span>
										<span className="text-sm text-gray-500 w-16 text-right">
											{count.toLocaleString()}
										</span>
									</div>
								</div>
							);
						}
					)}
				</div>
			</div>
		);
	};

	if (loading && !analytics) {
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
						onClick={() => {
							fetchTrending(selectedPeriod);
							loadAnalytics();
						}}
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
			{renderPeriodSelector()}
			{renderAnalyticsCards()}
			{renderTrendingTemplates()}

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<div className="space-y-8">{renderTypeAnalytics()}</div>
				<div className="space-y-8">
					{renderTopTemplates()}
					{renderRegionalAnalytics()}
				</div>
			</div>
		</div>
	);
};

export default MaterialTrendingAnalytics;
