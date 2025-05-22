import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
	ChartBarIcon,
	DocumentTextIcon,
	CubeIcon,
	CalculatorIcon,
	BellIcon,
	CalendarIcon,
	CurrencyDollarIcon,
	UserGroupIcon,
	ArrowTrendingUpIcon,
	ExclamationTriangleIcon,
	MapPinIcon,
	ChevronRightIcon,
	EyeIcon,
	ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import { useAuth } from "../../ui/context/AuthContext";

// Tipos de datos para el dashboard
interface DashboardStats {
	totalProjects: number;
	activeProjects: number;
	completedProjects: number;
	totalBudget: number;
	totalSpent: number;
	teamMembers: number;
	upcomingDeadlines: number;
}

interface Project {
	id: string;
	name: string;
	progress: number;
	status: string;
	dueDate: string;
	budget: number;
	location: string;
	isFavorite: boolean;
}

interface Notification {
	id: string;
	title: string;
	message: string;
	type: "info" | "warning" | "success" | "error";
	createdAt: string;
	isRead: boolean;
}

interface QuickAction {
	title: string;
	description: string;
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
	href: string;
	color: string;
}

const Dashboard = () => {
	const { user } = useAuth();
	const navigate = useNavigate();
	
	// Estados del dashboard
	const [stats, setStats] = useState<DashboardStats>({
		totalProjects: 0,
		activeProjects: 0,
		completedProjects: 0,
		totalBudget: 0,
		totalSpent: 0,
		teamMembers: 0,
		upcomingDeadlines: 0,
	});
	
	const [recentProjects, setRecentProjects] = useState<Project[]>([]);
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	// Mock data - en producción esto vendría de la API
	useEffect(() => {
		// Simular carga de datos
		setTimeout(() => {
			setStats({
				totalProjects: 12,
				activeProjects: 8,
				completedProjects: 4,
				totalBudget: 2850000,
				totalSpent: 1420000,
				teamMembers: 24,
				upcomingDeadlines: 3,
			});

			setRecentProjects([
				{
					id: "1",
					name: "Torre Residencial Quito Centro",
					progress: 65,
					status: "in_progress",
					dueDate: "2025-06-30",
					budget: 850000,
					location: "Quito, Pichincha",
					isFavorite: true,
				},
				{
					id: "2",
					name: "Centro Comercial La Aurora",
					progress: 25,
					status: "planning",
					dueDate: "2025-12-15",
					budget: 1200000,
					location: "Cuenca, Azuay",
					isFavorite: false,
				},
				{
					id: "3",
					name: "Oficinas Corporativas Amazonas",
					progress: 40,
					status: "on_hold",
					dueDate: "2025-08-15",
					budget: 950000,
					location: "Quito, Pichincha",
					isFavorite: true,
				},
			]);

			setNotifications([
				{
					id: "1",
					title: "Material entregado",
					message: "Cemento para Torre Residencial Quito Centro",
					type: "success",
					createdAt: "2025-05-20T10:30:00Z",
					isRead: false,
				},
				{
					id: "2",
					title: "Retraso en cronograma",
					message: "Fase de cimentación tiene 2 días de retraso",
					type: "warning",
					createdAt: "2025-05-20T09:15:00Z",
					isRead: false,
				},
				{
					id: "3",
					title: "Presupuesto aprobado",
					message: "Centro Comercial La Aurora - Fase 1",
					type: "info",
					createdAt: "2025-05-19T16:45:00Z",
					isRead: true,
				},
			]);

			setIsLoading(false);
		}, 1000);
	}, []);

	const quickActions: QuickAction[] = [
		{
			title: "Nuevo Proyecto",
			description: "Crear un proyecto de construcción",
			icon: DocumentTextIcon,
			href: "/proyectos/crear",
			color: "bg-primary-600 hover:bg-primary-700",
		},
		{
			title: "Calculadoras",
			description: "Herramientas de cálculo técnico",
			icon: CalculatorIcon,
			href: "/calculadoras",
			color: "bg-secondary-500 hover:bg-secondary-600",
		},
		{
			title: "Materiales",
			description: "Explorar catálogo de materiales",
			icon: CubeIcon,
			href: "/materiales",
			color: "bg-green-600 hover:bg-green-700",
		},
		{
			title: "Presupuestos",
			description: "Generar cotizaciones",
			icon: CurrencyDollarIcon,
			href: "/presupuestos",
			color: "bg-blue-600 hover:bg-blue-700",
		},
	];

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("es-EC", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0,
		}).format(amount);
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("es-EC", {
			day: "numeric",
			month: "short",
		});
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "planning":
				return "bg-blue-100 text-blue-800";
			case "in_progress":
				return "bg-green-100 text-green-800";
			case "on_hold":
				return "bg-yellow-100 text-yellow-800";
			case "completed":
				return "bg-primary-100 text-primary-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case "planning":
				return "Planificación";
			case "in_progress":
				return "En Progreso";
			case "on_hold":
				return "Pausado";
			case "completed":
				return "Completado";
			default:
				return status;
		}
	};

	const getNotificationIcon = (type: string) => {
		switch (type) {
			case "warning":
				return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
			case "success":
				return <ChartBarIcon className="h-5 w-5 text-green-500" />;
			case "error":
				return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
			default:
				return <BellIcon className="h-5 w-5 text-blue-500" />;
		}
	};

	const budgetUtilization = Math.round((stats.totalSpent / stats.totalBudget) * 100);

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header de bienvenida */}
			<div className="bg-white border-b border-gray-200">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
						<div className="flex-1">
							<h1 className="text-3xl font-bold text-gray-900 mb-2">
								Bienvenido de vuelta, {user?.firstName}
							</h1>
							<p className="text-gray-600 max-w-2xl">
								Tu centro de control para gestionar proyectos de construcción, 
								calcular materiales y supervisar el progreso de obra.
							</p>
						</div>
						<div className="flex items-center gap-3">
							<button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
								<BellIcon className="h-4 w-4" />
								Notificaciones
								{notifications.filter(n => !n.isRead).length > 0 && (
									<span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
										{notifications.filter(n => !n.isRead).length}
									</span>
								)}
							</button>
						</div>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Estadísticas principales */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group animate-fade-in">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600 mb-1">
									Proyectos Activos
								</p>
								<p className="text-3xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
									{stats.activeProjects}
								</p>
								<p className="text-xs text-gray-500 mt-1">
									de {stats.totalProjects} proyectos totales
								</p>
							</div>
							<div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
								<DocumentTextIcon className="h-6 w-6 text-primary-600" />
							</div>
						</div>
					</div>

					<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group animate-fade-in" style={{animationDelay: '0.1s'}}>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600 mb-1">
									Presupuesto Total
								</p>
								<p className="text-3xl font-bold text-gray-900 group-hover:text-secondary-600 transition-colors">
									{formatCurrency(stats.totalBudget)}
								</p>
								<p className="text-xs text-gray-500 mt-1">
									{budgetUtilization}% utilizado
								</p>
							</div>
							<div className="h-12 w-12 bg-secondary-100 rounded-lg flex items-center justify-center group-hover:bg-secondary-200 transition-colors">
								<CurrencyDollarIcon className="h-6 w-6 text-secondary-600" />
							</div>
						</div>
					</div>

					<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group animate-fade-in" style={{animationDelay: '0.2s'}}>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600 mb-1">
									Miembros del Equipo
								</p>
								<p className="text-3xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
									{stats.teamMembers}
								</p>
								<p className="text-xs text-gray-500 mt-1">
									en {stats.activeProjects} proyectos
								</p>
							</div>
							<div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
								<UserGroupIcon className="h-6 w-6 text-green-600" />
							</div>
						</div>
					</div>

					<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group animate-fade-in" style={{animationDelay: '0.3s'}}>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600 mb-1">
									Fechas Próximas
								</p>
								<p className="text-3xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
									{stats.upcomingDeadlines}
								</p>
								<p className="text-xs text-gray-500 mt-1">
									próximos 30 días
								</p>
							</div>
							<div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
								<CalendarIcon className="h-6 w-6 text-red-600" />
							</div>
						</div>
					</div>
				</div>

				{/* Grid principal */}
				<div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
					{/* Columna izquierda - Proyectos recientes */}
					<div className="xl:col-span-2 space-y-8">
						{/* Acciones rápidas */}
						<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-slide-up">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-xl font-semibold text-gray-900">
									Acciones Rápidas
								</h2>
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
								{quickActions.map((action, index) => (
									<Link
										key={index}
										to={action.href}
										className="group p-4 rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
									>
										<div className={`h-10 w-10 ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
											<action.icon className="h-5 w-5 text-white" />
										</div>
										<h3 className="font-medium text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
											{action.title}
										</h3>
										<p className="text-sm text-gray-500">
											{action.description}
										</p>
									</Link>
								))}
							</div>
						</div>

						{/* Proyectos recientes */}
						<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-slide-up" style={{animationDelay: '0.1s'}}>
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-xl font-semibold text-gray-900">
									Proyectos Recientes
								</h2>
								<Link
									to="/proyectos"
									className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors group"
								>
									Ver todos
									<ChevronRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
								</Link>
							</div>
							<div className="space-y-4">
								{recentProjects.map((project, index) => (
									<div
										key={project.id}
										className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-md transition-all duration-300 group cursor-pointer"
										onClick={() => navigate(`/proyectos/${project.id}`)}
										style={{animationDelay: `${index * 0.1}s`}}
									>
										<div className="flex items-start justify-between mb-3">
											<div className="flex-1">
												<div className="flex items-center gap-3 mb-2">
													<h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
														{project.name}
													</h3>
													{project.isFavorite && (
														<StarSolidIcon className="h-4 w-4 text-secondary-500" />
													)}
												</div>
												<div className="flex items-center gap-4 text-sm text-gray-500">
													<div className="flex items-center gap-1">
														<MapPinIcon className="h-4 w-4" />
														{project.location}
													</div>
													<div className="flex items-center gap-1">
														<CalendarIcon className="h-4 w-4" />
														{formatDate(project.dueDate)}
													</div>
													<div className="flex items-center gap-1">
														<CurrencyDollarIcon className="h-4 w-4" />
														{formatCurrency(project.budget)}
													</div>
												</div>
											</div>
											<div className="flex items-center gap-3">
												<span
													className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}
												>
													{getStatusText(project.status)}
												</span>
												<button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
													<EyeIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" />
												</button>
											</div>
										</div>
										<div className="mb-2">
											<div className="flex items-center justify-between text-sm mb-1">
												<span className="text-gray-600">Progreso</span>
												<span className="font-semibold text-primary-600">
													{project.progress}%
												</span>
											</div>
											<div className="w-full bg-gray-200 rounded-full h-2">
												<div
													className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-500 ease-out"
													style={{ width: `${project.progress}%` }}
												></div>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Columna derecha - Notificaciones y widgets */}
					<div className="space-y-8">
						{/* Progreso presupuestario */}
						<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-slide-up" style={{animationDelay: '0.2s'}}>
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-lg font-semibold text-gray-900">
									Uso de Presupuesto
								</h3>
								<ArrowTrendingUpIcon className="h-5 w-5 text-gray-400" />
							</div>
							<div className="space-y-4">
								<div>
									<div className="flex items-center justify-between text-sm mb-2">
										<span className="text-gray-600">Total utilizado</span>
										<span className="font-semibold text-gray-900">
											{budgetUtilization}%
										</span>
									</div>
									<div className="w-full bg-gray-200 rounded-full h-3">
										<div
											className={`h-3 rounded-full transition-all duration-500 ${
												budgetUtilization > 80
													? "bg-gradient-to-r from-red-500 to-red-600"
													: budgetUtilization > 60
													? "bg-gradient-to-r from-yellow-500 to-yellow-600"
													: "bg-gradient-to-r from-green-500 to-green-600"
											}`}
											style={{ width: `${budgetUtilization}%` }}
										></div>
									</div>
								</div>
								<div className="grid grid-cols-2 gap-4 pt-2">
									<div>
										<p className="text-xs text-gray-500 mb-1">Gastado</p>
										<p className="font-semibold text-gray-900">
											{formatCurrency(stats.totalSpent)}
										</p>
									</div>
									<div>
										<p className="text-xs text-gray-500 mb-1">Disponible</p>
										<p className="font-semibold text-gray-900">
											{formatCurrency(stats.totalBudget - stats.totalSpent)}
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* Notificaciones recientes */}
						<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-slide-up" style={{animationDelay: '0.3s'}}>
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-lg font-semibold text-gray-900">
									Notificaciones
								</h3>
								<Link
									to="/notificaciones"
									className="text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors"
								>
									Ver todas
								</Link>
							</div>
							<div className="space-y-3">
								{notifications.slice(0, 3).map((notification, index) => (
									<div
										key={notification.id}
										className={`p-3 rounded-lg border transition-all duration-300 hover:shadow-sm ${
											notification.isRead
												? "bg-gray-50 border-gray-200"
												: "bg-blue-50 border-blue-200"
										}`}
										style={{animationDelay: `${index * 0.1}s`}}
									>
										<div className="flex items-start gap-3">
											{getNotificationIcon(notification.type)}
											<div className="flex-1 min-w-0">
												<p className="font-medium text-gray-900 text-sm">
													{notification.title}
												</p>
												<p className="text-gray-600 text-xs mt-1">
													{notification.message}
												</p>
												<p className="text-gray-400 text-xs mt-1">
													Hace {Math.floor(Math.random() * 5) + 1} horas
												</p>
											</div>
											{!notification.isRead && (
												<div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
											)}
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Widget de acceso rápido */}
						<div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl p-6 text-white animate-slide-up" style={{animationDelay: '0.4s'}}>
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-lg font-semibold">
									¿Nuevo en CONSTRU?
								</h3>
								<ArrowTopRightOnSquareIcon className="h-5 w-5 opacity-80" />
							</div>
							<p className="text-primary-100 text-sm mb-4">
								Descubre todas las herramientas disponibles para optimizar 
								tus proyectos de construcción.
							</p>
							<Link
								to="/recursos/guias"
								className="inline-flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105"
							>
								Ver Guías
								<ChevronRightIcon className="h-4 w-4" />
							</Link>
						</div>
					</div>
				</div>
			</div>

			{/* Estilos CSS personalizados */}
			<style>{`
				@keyframes fadeIn {
					from {
						opacity: 0;
						transform: translateY(10px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				@keyframes slideUp {
					from {
						opacity: 0;
						transform: translateY(30px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				.animate-fade-in {
					animation: fadeIn 0.6s ease-out forwards;
					opacity: 0;
				}

				.animate-slide-up {
					animation: slideUp 0.8s ease-out forwards;
					opacity: 0;
				}

				/* Smooth hover effects */
				.group:hover .group-hover\\:scale-110 {
					transform: scale(1.1);
				}

				.group:hover .group-hover\\:translate-x-1 {
					transform: translateX(0.25rem);
				}

				/* Progress bar animations */
				.bg-gradient-to-r {
					background: linear-gradient(
						to right,
						var(--tw-gradient-stops)
					);
				}

				/* Card hover effects */
				.hover\\:shadow-md:hover {
					box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
				}

				.hover\\:-translate-y-1:hover {
					transform: translateY(-0.25rem);
				}
			`}</style>
		</div>
	);
};

export default Dashboard;