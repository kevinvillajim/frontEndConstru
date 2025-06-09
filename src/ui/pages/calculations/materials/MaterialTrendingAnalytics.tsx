// src/ui/pages/calculations/materials/MaterialTrendingAnalytics.tsx

import React, {useState, useEffect} from "react";
import {
	MaterialCalculationType,
	MATERIAL_CATEGORIES,
	MATERIAL_UI_CONFIG,
} from "../shared/types/material.types";

import type {MaterialTrendingTemplate} from "../shared/types/material.types";
import {
	useMaterialTrending,
	useMaterialAnalytics,
} from "../shared/hooks/useMaterialCalculations";

interface MaterialTrendingAnalyticsProps {
	onTemplateSelect: (templateId: string) => void;
}

const MaterialTrendingAnalytics: React.FC<MaterialTrendingAnalyticsProps> = ({
	onTemplateSelect,
}) => {
	const [selectedPeriod, setSelectedPeriod] = useState<
		"daily" | "weekly" | "monthly" | "yearly"
	>("weekly");
	const [selectedCategory, setSelectedCategory] = useState<
		MaterialCalculationType | "all"
	>("all");
	const [viewMode, setViewMode] = useState<
		"trending" | "analytics" | "insights"
	>("trending");

	const {
		loading: trendingLoading,
		fetchTrending,
	} = useMaterialTrending();
	const {
		fetchAnalyticsOverview,
		fetchAnalyticsByType,
	} = useMaterialAnalytics();

	useEffect(() => {
		fetchTrending(
			selectedPeriod,
			selectedCategory === "all" ? undefined : selectedCategory
		);
		fetchAnalyticsOverview(selectedPeriod);
		fetchAnalyticsByType();
	}, [
		selectedPeriod,
		selectedCategory,
		fetchTrending,
		fetchAnalyticsOverview,
		fetchAnalyticsByType,
	]);

	// Datos de ejemplo para demostración
	const mockTrendingData: MaterialTrendingTemplate[] = [
		{
			template: {
				id: "1",
				name: "Pared de Ladrillo King Kong",
				description:
					"Cálculo estándar para paredes de ladrillo con mortero y enlucido",
				type: MaterialCalculationType.WALLS_MASONRY,
				formula: "",
				parameters: [],
				isActive: true,
				isVerified: true,
				isFeatured: true,
				usageCount: 1247,
				averageRating: 4.8,
				ratingCount: 156,
				author: {
					id: "1",
					name: "Ing. Carlos Mendez",
					profession: "Ingeniero Civil",
				},
				createdAt: "2024-01-01T00:00:00Z",
				updatedAt: "2024-01-15T00:00:00Z",
			},
			stats: {
				totalUsage: 1247,
				uniqueUsers: 234,
				averageRating: 4.8,
				successRate: 98.5,
				trendScore: 92.4,
				rankPosition: 1,
			},
			growthRate: 23.5,
			isRising: true,
		},
		{
			template: {
				id: "2",
				name: "Escalera de Hormigón Armado",
				description: "Cálculo completo para escaleras con armadura y acabados",
				type: MaterialCalculationType.STAIRS,
				formula: "",
				parameters: [],
				isActive: true,
				isVerified: true,
				isFeatured: true,
				usageCount: 892,
				averageRating: 4.6,
				ratingCount: 98,
				author: {id: "2", name: "Arq. Maria Lopez", profession: "Arquitecta"},
				createdAt: "2024-01-05T00:00:00Z",
				updatedAt: "2024-01-20T00:00:00Z",
			},
			stats: {
				totalUsage: 892,
				uniqueUsers: 178,
				averageRating: 4.6,
				successRate: 96.2,
				trendScore: 87.1,
				rankPosition: 2,
			},
			growthRate: 18.7,
			isRising: true,
		},
		{
			template: {
				id: "3",
				name: "Piso Cerámico 60x60",
				description: "Cálculo para cerámicos grandes con adhesivo y fragüe",
				type: MaterialCalculationType.CERAMIC_FINISHES,
				formula: "",
				parameters: [],
				isActive: true,
				isVerified: true,
				isFeatured: false,
				usageCount: 756,
				averageRating: 4.4,
				ratingCount: 87,
				author: {
					id: "3",
					name: "Tec. Juan Ramirez",
					profession: "Técnico en Construcción",
				},
				createdAt: "2024-01-10T00:00:00Z",
				updatedAt: "2024-01-18T00:00:00Z",
			},
			stats: {
				totalUsage: 756,
				uniqueUsers: 142,
				averageRating: 4.4,
				successRate: 94.8,
				trendScore: 82.3,
				rankPosition: 3,
			},
			growthRate: -2.1,
			isRising: false,
		},
	];

	const mockAnalytics = {
		totalCalculations: 15847,
		uniqueUsers: 1234,
		popularCategory: "Paredes y Muros",
		averageSuccessRate: 96.2,
		topGrowthCategory: "Instalaciones Eléctricas",
		weeklyGrowth: 12.3,
		categoryStats: [
			{
				category: "Paredes y Muros",
				usage: 4521,
				growth: 8.2,
				successRate: 97.1,
			},
			{category: "Escaleras", usage: 2847, growth: 15.6, successRate: 95.8},
			{
				category: "Acabados Cerámicos",
				usage: 3102,
				growth: 6.4,
				successRate: 94.2,
			},
			{category: "Contrapisos", usage: 2156, growth: 11.1, successRate: 98.5},
			{
				category: "Instalaciones Eléctricas",
				usage: 1892,
				growth: 22.7,
				successRate: 93.6,
			},
			{category: "Hormigón", usage: 1329, growth: 9.8, successRate: 96.9},
		],
	};

	const TrendingCard: React.FC<{
		item: MaterialTrendingTemplate;
		rank: number;
	}> = ({item, rank}) => {
		const categoryConfig = MATERIAL_CATEGORIES[item.template.type];

		return (
			<div
				className={`
        bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700
        ${MATERIAL_UI_CONFIG.cardHover} ${MATERIAL_UI_CONFIG.defaultTransition}
        cursor-pointer p-6 relative overflow-hidden
      `}
				onClick={() => onTemplateSelect(item.template.id)}
			>
				{/* Ranking badge */}
				<div
					className={`
          absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
          ${
						rank === 1
							? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
							: rank === 2
								? "bg-gradient-to-r from-gray-300 to-gray-500 text-white"
								: rank === 3
									? "bg-gradient-to-r from-amber-600 to-amber-800 text-white"
									: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
					}
        `}
				>
					{rank}
				</div>

				{/* Growth indicator */}
				<div
					className={`
          absolute top-0 left-0 w-full h-1
          ${item.isRising ? "bg-gradient-to-r from-green-400 to-green-600" : "bg-gradient-to-r from-red-400 to-red-600"}
        `}
				/>

				<div className="flex items-start space-x-4 mb-4">
					<div
						className={`
            w-12 h-12 rounded-lg flex items-center justify-center
            ${categoryConfig.color} bg-opacity-20
          `}
					>
						<span className="text-2xl">{categoryConfig.icon}</span>
					</div>

					<div className="flex-1">
						<h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">
							{item.template.name}
						</h3>
						<p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
							{item.template.description}
						</p>
						<div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
							<span>{categoryConfig.name}</span>
							<span>•</span>
							<span>por {item.template.author?.name}</span>
						</div>
					</div>
				</div>

				{/* Stats */}
				<div className="grid grid-cols-3 gap-4 mb-4">
					<div className="text-center">
						<div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
							{item.stats.totalUsage.toLocaleString()}
						</div>
						<div className="text-xs text-gray-500 dark:text-gray-400">Usos</div>
					</div>

					<div className="text-center">
						<div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
							{item.stats.uniqueUsers}
						</div>
						<div className="text-xs text-gray-500 dark:text-gray-400">
							Usuarios
						</div>
					</div>

					<div className="text-center">
						<div className="text-2xl font-bold text-green-600 dark:text-green-400">
							{item.stats.successRate}%
						</div>
						<div className="text-xs text-gray-500 dark:text-gray-400">
							Éxito
						</div>
					</div>
				</div>

				{/* Growth */}
				<div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
					<div className="flex items-center space-x-2">
						<div
							className={`
              flex items-center space-x-1 text-sm
              ${item.isRising ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}
            `}
						>
							<svg
								className={`w-4 h-4 ${item.isRising ? "" : "rotate-180"}`}
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fillRule="evenodd"
									d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
									clipRule="evenodd"
								/>
							</svg>
							<span>{Math.abs(item.growthRate)}%</span>
						</div>
						<span className="text-gray-500 dark:text-gray-400 text-sm">
							vs. período anterior
						</span>
					</div>

					<div className="flex items-center space-x-1">
						<svg
							className="w-4 h-4 text-yellow-400"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
						</svg>
						<span className="text-sm text-gray-600 dark:text-gray-300">
							{item.stats.averageRating}
						</span>
					</div>
				</div>
			</div>
		);
	};

	const AnalyticsOverview: React.FC = () => {
		return (
			<div className="space-y-6">
				{/* KPIs principales */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					<div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-blue-100 text-sm">Total Cálculos</p>
								<p className="text-3xl font-bold">
									{mockAnalytics.totalCalculations.toLocaleString()}
								</p>
							</div>
							<div className="text-4xl opacity-80">🧮</div>
						</div>
						<div className="mt-4 flex items-center text-blue-100 text-sm">
							<svg
								className="w-4 h-4 mr-1"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fillRule="evenodd"
									d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
									clipRule="evenodd"
								/>
							</svg>
							+{mockAnalytics.weeklyGrowth}% esta semana
						</div>
					</div>

					<div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-purple-100 text-sm">Usuarios Activos</p>
								<p className="text-3xl font-bold">
									{mockAnalytics.uniqueUsers.toLocaleString()}
								</p>
							</div>
							<div className="text-4xl opacity-80">👥</div>
						</div>
						<div className="mt-4 text-purple-100 text-sm">
							Profesionales de la construcción
						</div>
					</div>

					<div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-green-100 text-sm">Tasa de Éxito</p>
								<p className="text-3xl font-bold">
									{mockAnalytics.averageSuccessRate}%
								</p>
							</div>
							<div className="text-4xl opacity-80">✅</div>
						</div>
						<div className="mt-4 text-green-100 text-sm">
							Cálculos completados exitosamente
						</div>
					</div>

					<div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-orange-100 text-sm">Categoría Popular</p>
								<p className="text-xl font-bold">
									{mockAnalytics.popularCategory}
								</p>
							</div>
							<div className="text-4xl opacity-80">🏆</div>
						</div>
						<div className="mt-4 text-orange-100 text-sm">
							Más utilizada este período
						</div>
					</div>
				</div>

				{/* Estadísticas por categoría */}
				<div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
					<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
						Rendimiento por Categoría
					</h3>

					<div className="space-y-4">
						{mockAnalytics.categoryStats.map((stat, index) => {
							const categoryType = Object.values(MaterialCalculationType).find(
								(type) => MATERIAL_CATEGORIES[type].name === stat.category
							);
							const categoryConfig = categoryType
								? MATERIAL_CATEGORIES[categoryType]
								: null;

							return (
								<div
									key={index}
									className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
								>
									<div
										className={`
                    w-10 h-10 rounded-lg flex items-center justify-center
                    ${categoryConfig?.color || "bg-gray-500"} bg-opacity-20
                  `}
									>
										<span className="text-xl">
											{categoryConfig?.icon || "📊"}
										</span>
									</div>

									<div className="flex-1">
										<div className="flex items-center justify-between mb-2">
											<h4 className="font-medium text-gray-900 dark:text-white">
												{stat.category}
											</h4>
											<div className="flex items-center space-x-4 text-sm">
												<span className="text-gray-600 dark:text-gray-400">
													{stat.usage.toLocaleString()} usos
												</span>
												<span
													className={`
                          ${stat.growth > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}
                        `}
												>
													{stat.growth > 0 ? "+" : ""}
													{stat.growth}%
												</span>
											</div>
										</div>

										<div className="flex items-center space-x-4">
											<div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
												<div
													className="bg-blue-600 h-2 rounded-full transition-all duration-500"
													style={{
														width: `${(stat.usage / Math.max(...mockAnalytics.categoryStats.map((s) => s.usage))) * 100}%`,
													}}
												/>
											</div>
											<span className="text-sm text-gray-600 dark:text-gray-400">
												{stat.successRate}% éxito
											</span>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		);
	};

	const InsightsPanel: React.FC = () => {
		const insights = [
			{
				type: "trend",
				title: "Crecimiento en Instalaciones Eléctricas",
				description:
					"Las plantillas de instalaciones eléctricas han mostrado un crecimiento del 22.7% este período, posiblemente debido a nuevas normativas.",
				icon: "⚡",
				color: "bg-yellow-500",
				action: "Ver plantillas eléctricas",
			},
			{
				type: "opportunity",
				title: "Oportunidad en Muebles de Melamina",
				description:
					"Pocas plantillas disponibles para carpintería. Crear contenido en esta área podría ser muy exitoso.",
				icon: "🗄️",
				color: "bg-orange-500",
				action: "Crear plantilla",
			},
			{
				type: "success",
				title: "Alta Precisión en Cálculos de Paredes",
				description:
					"Las plantillas de paredes mantienen una tasa de éxito del 97.1%, indicando alta confiabilidad.",
				icon: "🧱",
				color: "bg-green-500",
				action: "Ver mejores prácticas",
			},
			{
				type: "alert",
				title: "Revisar Plantillas de Cerámicos",
				description:
					"La tasa de éxito en cerámicos (94.2%) es menor al promedio. Podrían necesitar optimización.",
				icon: "🔲",
				color: "bg-red-500",
				action: "Analizar problemas",
			},
		];

		return (
			<div className="space-y-6">
				<div className="text-center mb-8">
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
						Insights Inteligentes
					</h2>
					<p className="text-gray-600 dark:text-gray-300">
						Análisis automático de tendencias y oportunidades de mejora
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{insights.map((insight, index) => (
						<div
							key={index}
							className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
						>
							<div className="flex items-start space-x-4">
								<div
									className={`
                  w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl
                  ${insight.color}
                `}
								>
									{insight.icon}
								</div>

								<div className="flex-1">
									<h3 className="font-semibold text-gray-900 dark:text-white mb-2">
										{insight.title}
									</h3>
									<p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
										{insight.description}
									</p>

									<button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
										{insight.action} →
									</button>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Recomendaciones personalizadas */}
				<div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
						🎯 Recomendaciones Personalizadas
					</h3>

					<div className="space-y-3">
						<div className="flex items-center space-x-3">
							<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
							<span className="text-gray-700 dark:text-gray-300">
								Basado en tu actividad, te recomendamos explorar plantillas de{" "}
								<strong>escaleras</strong>
							</span>
						</div>
						<div className="flex items-center space-x-3">
							<div className="w-2 h-2 bg-purple-500 rounded-full"></div>
							<span className="text-gray-700 dark:text-gray-300">
								Considera crear una plantilla personalizada para{" "}
								<strong>contrapisos con arcilla expandida</strong>
							</span>
						</div>
						<div className="flex items-center space-x-3">
							<div className="w-2 h-2 bg-green-500 rounded-full"></div>
							<span className="text-gray-700 dark:text-gray-300">
								Tus cálculos de paredes tienen alta precisión, ¡perfecto para
								compartir conocimiento!
							</span>
						</div>
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className="space-y-6">
			{/* Header con controles */}
			<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
				<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
					<div>
						<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
							Tendencias y Analytics
						</h1>
						<p className="text-gray-600 dark:text-gray-300 mt-1">
							Descubre las plantillas más populares y análisis de uso
						</p>
					</div>

					<div className="flex items-center space-x-4">
						{/* Período */}
						<select
							value={selectedPeriod}
							onChange={(e) => setSelectedPeriod(e.target.value as "daily" | "weekly" | "monthly" | "yearly")}
							className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
						>
							<option value="daily">Último día</option>
							<option value="weekly">Última semana</option>
							<option value="monthly">Último mes</option>
							<option value="yearly">Último año</option>
						</select>

						{/* Categoría */}
						<select
							value={selectedCategory}
							onChange={(e) => setSelectedCategory(e.target.value as MaterialCalculationType | "all")}
							className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
						>
							<option value="all">Todas las categorías</option>
							{Object.values(MaterialCalculationType).map((type) => (
								<option key={type} value={type}>
									{MATERIAL_CATEGORIES[type].name}
								</option>
							))}
						</select>
					</div>
				</div>

				{/* Tabs de vista */}
				<div className="flex space-x-6 mt-6 border-b border-gray-200 dark:border-gray-700">
					{[
						{id: "trending", label: "Tendencias", icon: "📈"},
						{id: "analytics", label: "Analytics", icon: "📊"},
						{id: "insights", label: "Insights", icon: "💡"},
					].map((tab) => (
						<button
							key={tab.id}
							onClick={() => setViewMode(tab.id as "trending" | "analytics" | "insights")}
							className={`
                flex items-center space-x-2 pb-4 border-b-2 font-medium transition-colors
                ${
									viewMode === tab.id
										? "border-blue-500 text-blue-600 dark:text-blue-400"
										: "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
								}
              `}
						>
							<span>{tab.icon}</span>
							<span>{tab.label}</span>
						</button>
					))}
				</div>
			</div>

			{/* Contenido según vista */}
			{viewMode === "trending" && (
				<div>
					{trendingLoading ? (
						<div className="flex items-center justify-center py-20">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
						</div>
					) : (
						<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
							{mockTrendingData.map((item, index) => (
								<TrendingCard
									key={item.template.id}
									item={item}
									rank={index + 1}
								/>
							))}
						</div>
					)}
				</div>
			)}

			{viewMode === "analytics" && <AnalyticsOverview />}
			{viewMode === "insights" && <InsightsPanel />}
		</div>
	);
};

export default MaterialTrendingAnalytics;
