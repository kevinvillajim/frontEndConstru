// src/ui/pages/calculations/CalculationsHub.tsx
import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {
	PlusIcon,
	ClockIcon,
	StarIcon,
	BookmarkIcon,
	UserGroupIcon,
	ArrowRightIcon,
	ChartBarIcon,
	CheckBadgeIcon,
	ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import {StarIcon as StarSolidIcon} from "@heroicons/react/24/solid";
import CalculationsNavigation from "../../components/calculations/CalculationsNavigation";
import {useCalculations} from "../../hooks/useCalculations";

interface QuickStat {
	label: string;
	value: string | number;
	change?: number;
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
	color: string;
}

interface RecentActivity {
	id: string;
	type: "calculation" | "template" | "collaboration";
	title: string;
	description: string;
	timestamp: string;
	status?: "completed" | "draft" | "shared";
}

const CalculationsHub: React.FC = () => {
	const {
		templates,
		savedCalculations,
		loading,
		fetchTemplates,
		fetchSavedCalculations,
		getRecommendations,
	} = useCalculations();

	const [quickStats, setQuickStats] = useState<QuickStat[]>([]);
	const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
	const [recommendedTemplates, setRecommendedTemplates] = useState([]);

	useEffect(() => {
		// Cargar datos iniciales
		fetchTemplates({searchTerm: ""});
		fetchSavedCalculations();
		loadRecommendations();
	}, [fetchTemplates, fetchSavedCalculations]);

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
				icon: CheckBadgeIcon,
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
			const recommendations = await getRecommendations({limit: 3});
			setRecommendedTemplates(recommendations);
		} catch (error) {
			console.error("Error loading recommendations:", error);
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

	const getActivityIcon = (type: string) => {
		switch (type) {
			case "calculation":
				return ChartBarIcon;
			case "template":
				return StarIcon;
			case "collaboration":
				return UserGroupIcon;
			default:
				return BookmarkIcon;
		}
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

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white border-b border-gray-200">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
						<div>
							<h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
								Centro de Cálculos Técnicos
							</h1>
							<p className="text-gray-600 flex items-center gap-2">
								<span>
									Biblioteca completa de herramientas de cálculo verificadas NEC
									Ecuador
								</span>
								<CheckBadgeIcon className="h-4 w-4 text-green-600" />
							</p>
						</div>

						<div className="flex items-center gap-3">
							<Link
								to="/calculations/interface"
								className="px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-500 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] flex items-center gap-2"
							>
								<PlusIcon className="h-5 w-5" />
								Nuevo Cálculo
							</Link>
						</div>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
					{/* Navegación principal */}
					<div className="lg:col-span-2">
						<div className="mb-6">
							<h2 className="text-xl font-semibold text-gray-900 mb-2">
								Herramientas de Cálculo
							</h2>
							<p className="text-gray-600">
								Accede a todas las funcionalidades del módulo de cálculos
							</p>
						</div>
						<CalculationsNavigation maxColumns={2} />
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
									to="/calculations/saved"
									className="text-primary-600 hover:text-primary-700 text-sm font-medium"
								>
									Ver todo
								</Link>
							</div>

							<div className="space-y-4">
								{recentActivity.map((activity) => {
									const ActivityIcon = getActivityIcon(activity.type);
									return (
										<div key={activity.id} className="flex items-start gap-3">
											<div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
												<ActivityIcon className="h-5 w-5 text-gray-600" />
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
									);
								})}
							</div>
						</div>

						{/* Plantillas recomendadas */}
						<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-lg font-semibold text-gray-900">
									Recomendadas para ti
								</h3>
								<Link
									to="/calculations"
									className="text-primary-600 hover:text-primary-700 text-sm font-medium"
								>
									Ver más
								</Link>
							</div>

							<div className="space-y-3">
								{recommendedTemplates
									.slice(0, 3)
									.map((template: any, index) => (
										<Link
											key={template.id || index}
											to={`/calculations/interface/${template.id || "demo"}`}
											className="block p-3 border border-gray-200 rounded-lg hover:border-primary-200 hover:bg-primary-50 transition-colors"
										>
											<div className="flex items-center justify-between">
												<div className="flex-1">
													<h4 className="font-medium text-gray-900 text-sm mb-1">
														{template.name || "Plantilla de Demostración"}
													</h4>
													<p className="text-xs text-gray-600">
														{template.description ||
															"Cálculo técnico especializado"}
													</p>
												</div>
												<div className="flex items-center gap-1">
													<StarSolidIcon className="h-3 w-3 text-yellow-400" />
													<span className="text-xs text-gray-500">
														{template.rating || "4.8"}
													</span>
												</div>
											</div>
										</Link>
									))}
							</div>

							<Link
								to="/calculations/interface"
								className="mt-4 w-full bg-gradient-to-r from-primary-600 to-secondary-500 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2"
							>
								<PlusIcon className="h-4 w-4" />
								Empezar Nuevo Cálculo
								<ArrowRightIcon className="h-4 w-4" />
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CalculationsHub;
