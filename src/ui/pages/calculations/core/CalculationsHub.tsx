// src/ui/pages/calculations/core/CalculationsHub.tsx
import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {
	PlusIcon,
	ClockIcon,
	BookmarkIcon,
	UserGroupIcon,
	ArrowTrendingUpIcon,
	CalculatorIcon,
	FolderIcon,
	ChartBarIcon,
	SparklesIcon,
	ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import CalculationsLayout from "./CalculationsLayout";
import {useCalculations} from "../shared/hooks/useCalculations";
import type {
	QuickStat,
	RecentActivity,
	NavigationItem,
} from "../shared/types/calculation.types";

const CalculationsHub: React.FC = () => {
	const {
		templates,
		savedCalculations,
		loading,
		error,
		fetchTemplates,
		fetchSavedCalculations,
		getRecommendations,
		clearError,
	} = useCalculations();

	const [quickStats, setQuickStats] = useState<QuickStat[]>([]);
	const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
	const [recommendedTemplates, setRecommendedTemplates] = useState([]);
	const [recommendationsError, setRecommendationsError] = useState<
		string | null
	>(null);

	// Navegación principal simplificada a 4 secciones
	const navigationItems: NavigationItem[] = [
		{
			id: "catalog",
			name: "Catálogo de Plantillas",
			description: "Plantillas verificadas y aprobadas por la comunidad",
			icon: CalculatorIcon,
			route: "/calculations/catalog",
			badge: templates.filter((t) => t.isNew).length,
		},
		{
			id: "my-templates",
			name: "Mis Plantillas",
			description: "Plantillas personalizadas creadas por ti",
			icon: FolderIcon,
			route: "/calculations/templates",
		},
		{
			id: "comparison",
			name: "Comparar Cálculos",
			description: "Compara resultados y analiza diferencias",
			icon: ChartBarIcon,
			route: "/calculations/comparison",
			badge: savedCalculations.length,
		},
		{
			id: "collaboration",
			name: "Colaboración",
			description: "Espacio colaborativo y cálculos en tendencia",
			icon: SparklesIcon,
			route: "/calculations/collaboration",
			isNew: true,
		},
	];

	// useEffect(() => {
	// 	// Cargar datos iniciales con manejo de errores mejorado
	// 	const loadInitialData = async () => {
	// 		try {
	// 			// Usar Promise.allSettled para que los errores no bloqueen otras cargas
	// 			const results = await Promise.allSettled([
	// 				fetchTemplates({searchTerm: ""}).catch((err) => {
	// 					console.warn("⚠️ Templates endpoint failed:", err.message);
	// 					return [];
	// 				}),
	// 				fetchSavedCalculations().catch((err) => {
	// 					console.warn("⚠️ Saved calculations endpoint failed:", err.message);
	// 					return [];
	// 				}),
	// 			]);

	// 			// Log resultados para debugging
	// 			results.forEach((result, index) => {
	// 				const operation = index === 0 ? "Templates" : "Saved Calculations";
	// 				if (result.status === "rejected") {
	// 					console.warn(`${operation} loading failed:`, result.reason);
	// 				} else {
	// 					console.log(`✅ ${operation} loaded successfully`);
	// 				}
	// 			});

	// 			// Cargar recomendaciones por separado para no bloquear la interfaz
	// 			// Usar setTimeout para asegurar que no bloquee el render inicial
	// 			setTimeout(() => {
	// 				loadRecommendations();
	// 			}, 100);
	// 		} catch (error) {
	// 			console.error("Error in loadInitialData:", error);
	// 			// No establecer error crítico para problemas de carga inicial
	// 		}
	// 	};

	// 	loadInitialData();
	// }, [fetchTemplates, fetchSavedCalculations]);

	useEffect(() => {
		// Actualizar estadísticas rápidas cuando cambien los datos
		const stats: QuickStat[] = [
			{
				label: "Cálculos Guardados",
				value: savedCalculations.length,
				change: 12,
				icon: BookmarkIcon,
				color: "bg-blue-500",
			},
			{
				label: "Plantillas Usadas",
				value: templates.filter((t) => t.usageCount > 0).length,
				change: 8,
				icon: CalculatorIcon,
				color: "bg-green-500",
			},
			{
				label: "Tiempo Ahorrado",
				value: "24h",
				change: 15,
				icon: ClockIcon,
				color: "bg-purple-500",
			},
			{
				label: "Colaboraciones",
				value: 3,
				change: 2,
				icon: UserGroupIcon,
				color: "bg-pink-500",
			},
		];
		setQuickStats(stats);

		// Simular actividad reciente
		const activities: RecentActivity[] = [
			{
				id: "1",
				type: "calculation",
				title: "Demanda Eléctrica Residencial",
				description: "Casa modelo A - Urbanización Los Álamos",
				timestamp: "2024-03-15T10:30:00Z",
				status: "completed",
			},
			{
				id: "2",
				type: "template",
				title: "Plantilla personalizada creada",
				description: "Cálculo de vigas especiales",
				timestamp: "2024-03-14T16:20:00Z",
				status: "draft",
			},
			{
				id: "3",
				type: "collaboration",
				title: "Cálculo compartido con equipo",
				description: "Análisis sísmico - Torre residencial",
				timestamp: "2024-03-14T14:15:00Z",
				status: "shared",
			},
		];
		setRecentActivity(activities);
	}, [savedCalculations, templates]);

	const loadRecommendations = async () => {
		try {
			setRecommendationsError(null);
			console.log("🔍 Loading recommendations...");

			const recommendations = await getRecommendations({limit: 3});

			if (recommendations && recommendations.length > 0) {
				setRecommendedTemplates(recommendations);
				console.log("✅ Recommendations loaded:", recommendations.length);
			} else {
				console.log("ℹ️ No recommendations available");
				setRecommendedTemplates([]);
			}
		} catch (error) {
			console.warn("⚠️ Recommendations failed:", error);
			setRecommendationsError(
				"Las recomendaciones no están disponibles temporalmente"
			);
			setRecommendedTemplates([]);
		}
	};

	const formatTimeAgo = (timestamp: string) => {
		const date = new Date(timestamp);
		const now = new Date();
		const diffInHours =
			Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);

		if (diffInHours < 1) return "Hace unos minutos";
		if (diffInHours < 24) return `Hace ${Math.floor(diffInHours)} horas`;
		return `Hace ${Math.floor(diffInHours / 24)} días`;
	};

	const getStatusColor = (status?: string) => {
		switch (status) {
			case "completed":
				return "bg-green-100 text-green-700";
			case "draft":
				return "bg-yellow-100 text-yellow-700";
			case "shared":
				return "bg-blue-100 text-blue-700";
			default:
				return "bg-gray-100 text-gray-700";
		}
	};

	const headerActions = (
		<Link
			to="/calculations/catalog"
			className="px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-500 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] flex items-center gap-2"
		>
			<PlusIcon className="h-5 w-5" />
			Nuevo Cálculo
		</Link>
	);

	// Mostrar mensaje de error si hay problemas críticos
	if (error) {
		return (
			<CalculationsLayout headerActions={headerActions} loading={false}>
				<div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
					<div className="flex items-center gap-3">
						<ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
						<div>
							<h3 className="text-lg font-semibold text-red-900 mb-1">
								Error al cargar los datos
							</h3>
							<p className="text-red-700 text-sm">{error}</p>
							<button
								onClick={() => {
									clearError();
									window.location.reload();
								}}
								className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
							>
								Reintentar
							</button>
						</div>
					</div>
				</div>
			</CalculationsLayout>
		);
	}

	return (
		<CalculationsLayout headerActions={headerActions} loading={loading}>
			{/* Mostrar advertencia si hay errores en recomendaciones */}
			{recommendationsError && (
				<div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
					<div className="flex items-center gap-2">
						<ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
						<p className="text-yellow-800 text-sm">{recommendationsError}</p>
						<button
							onClick={loadRecommendations}
							className="ml-auto px-3 py-1 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700 transition-colors"
						>
							Reintentar
						</button>
					</div>
				</div>
			)}

			{/* Estadísticas rápidas */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				{quickStats.map((stat, index) => (
					<div
						key={index}
						className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-200"
					>
						<div className="flex items-center justify-between mb-4">
							<div
								className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}
							>
								<stat.icon className="h-6 w-6 text-white" />
							</div>
							{stat.change && (
								<div className="flex items-center gap-1 text-sm text-green-600">
									<ArrowTrendingUpIcon className="h-4 w-4" />
									<span className="font-medium">+{stat.change}%</span>
								</div>
							)}
						</div>
						<div>
							<div className="text-2xl font-bold text-gray-900 mb-1">
								{stat.value}
							</div>
							<div className="text-sm text-gray-600">{stat.label}</div>
						</div>
					</div>
				))}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Navegación principal - 4 secciones */}
				<div className="lg:col-span-2">
					<div className="mb-6">
						<h2 className="text-xl font-semibold text-gray-900 mb-2">
							Herramientas de Cálculo
						</h2>
						<p className="text-gray-600">
							Accede a todas las funcionalidades del módulo de cálculos
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{navigationItems.map((item) => (
							<Link
								key={item.id}
								to={item.route}
								className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:border-primary-200 transition-all duration-200 group"
							>
								<div className="flex items-start justify-between mb-4">
									<div className="p-3 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl group-hover:from-primary-100 group-hover:to-secondary-100 transition-colors">
										<item.icon className="h-6 w-6 text-primary-600" />
									</div>
									<div className="flex items-center gap-2">
										{item.badge && item.badge > 0 && (
											<span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
												{item.badge}
											</span>
										)}
										{item.isNew && (
											<span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
												Nuevo
											</span>
										)}
									</div>
								</div>
								<div>
									<h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors">
										{item.name}
									</h3>
									<p className="text-gray-600 text-sm leading-relaxed">
										{item.description}
									</p>
								</div>
							</Link>
						))}
					</div>
				</div>

				{/* Sidebar derecho */}
				<div className="space-y-6">
					{/* Actividad reciente */}
					<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-semibold text-gray-900">
								Actividad Reciente
							</h3>
							<Link
								to="/calculations/comparison"
								className="text-primary-600 hover:text-primary-700 text-sm font-medium"
							>
								Ver todo
							</Link>
						</div>

						<div className="space-y-4">
							{recentActivity.slice(0, 3).map((activity) => (
								<div key={activity.id} className="flex items-start gap-3">
									<div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
										{activity.type === "calculation" && (
											<CalculatorIcon className="h-5 w-5 text-gray-600" />
										)}
										{activity.type === "template" && (
											<FolderIcon className="h-5 w-5 text-gray-600" />
										)}
										{activity.type === "collaboration" && (
											<UserGroupIcon className="h-5 w-5 text-gray-600" />
										)}
									</div>
									<div className="flex-1">
										<div className="flex items-center gap-2 mb-1">
											<h4 className="font-medium text-gray-900 text-sm">
												{activity.title}
											</h4>
											{activity.status && (
												<span
													className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}
												>
													{activity.status}
												</span>
											)}
										</div>
										<p className="text-xs text-gray-600 mb-1">
											{activity.description}
										</p>
										<p className="text-xs text-gray-500">
											{formatTimeAgo(activity.timestamp)}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Acceso rápido a nuevo cálculo */}
					<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
						<div className="text-center">
							<div className="w-12 h-12 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
								<PlusIcon className="h-6 w-6 text-primary-600" />
							</div>
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								¿Listo para calcular?
							</h3>
							<p className="text-gray-600 text-sm mb-4">
								Explora el catálogo y encuentra la plantilla perfecta para tu
								proyecto
							</p>
							<Link
								to="/calculations/catalog"
								className="w-full bg-gradient-to-r from-primary-600 to-secondary-500 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2"
							>
								<CalculatorIcon className="h-4 w-4" />
								Explorar Catálogo
							</Link>
						</div>
					</div>
				</div>
			</div>
		</CalculationsLayout>
	);
};

export default CalculationsHub;
