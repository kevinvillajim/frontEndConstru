import React, {useState, useEffect} from "react";
import {useParams, useNavigate, Link} from "react-router-dom";
import {
	ArrowLeftIcon,
	ChartBarIcon,
	CalendarIcon,
	CurrencyDollarIcon,
	UserGroupIcon,
	ClockIcon,
	ExclamationTriangleIcon,
	CheckCircleIcon,
	ArrowTrendingUpIcon,
	ArrowTrendingDownIcon,
	EyeIcon,
	DocumentTextIcon,
} from "@heroicons/react/24/outline";

// Interfaces para los datos del dashboard
interface DashboardData {
	projectName: string;
	completionPercentage: number;
	progressData: {
		date: string;
		planned: number;
		actual: number;
	}[];
	taskStatusCounts: {
		pending: number;
		in_progress: number;
		completed: number;
		overdue: number;
	};
	phaseProgress: {
		name: string;
		progress: number;
		status: "completed" | "in_progress" | "pending";
		startDate: string;
		endDate: string;
	}[];
	budgetData: {
		totalBudget: number;
		spentAmount: number;
		remainingBudget: number;
		spentPercentage: number;
		monthlySpending: {
			month: string;
			planned: number;
			actual: number;
		}[];
	};
	criticalTasks: {
		id: string;
		name: string;
		assignee: string;
		dueDate: string;
		status: "overdue" | "due_soon" | "critical";
		priority: "high" | "medium" | "low";
	}[];
}

// Mock data - En producción vendría de la API
const mockDashboardData: DashboardData = {
	projectName: "Torre Residencial Quito Centro",
	completionPercentage: 65,
	progressData: [
		{date: "2024-01", planned: 10, actual: 8},
		{date: "2024-02", planned: 20, actual: 18},
		{date: "2024-03", planned: 35, actual: 32},
		{date: "2024-04", planned: 50, actual: 45},
		{date: "2024-05", planned: 65, actual: 65},
	],
	taskStatusCounts: {
		pending: 12,
		in_progress: 8,
		completed: 45,
		overdue: 3,
	},
	phaseProgress: [
		{
			name: "Planificación",
			progress: 100,
			status: "completed",
			startDate: "2024-01-15",
			endDate: "2024-02-15",
		},
		{
			name: "Cimentación",
			progress: 100,
			status: "completed",
			startDate: "2024-02-16",
			endDate: "2024-03-30",
		},
		{
			name: "Estructura",
			progress: 75,
			status: "in_progress",
			startDate: "2024-04-01",
			endDate: "2024-06-15",
		},
		{
			name: "Acabados",
			progress: 0,
			status: "pending",
			startDate: "2024-06-16",
			endDate: "2024-08-30",
		},
		{
			name: "Entrega",
			progress: 0,
			status: "pending",
			startDate: "2024-09-01",
			endDate: "2024-09-15",
		},
	],
	budgetData: {
		totalBudget: 850000,
		spentAmount: 420000,
		remainingBudget: 430000,
		spentPercentage: 49.4,
		monthlySpending: [
			{month: "Ene", planned: 50000, actual: 45000},
			{month: "Feb", planned: 75000, actual: 70000},
			{month: "Mar", planned: 90000, actual: 95000},
			{month: "Abr", planned: 85000, actual: 88000},
			{month: "May", planned: 80000, actual: 82000},
		],
	},
	criticalTasks: [
		{
			id: "1",
			name: "Finalizar estructura Piso 15",
			assignee: "Carlos Mendoza",
			dueDate: "2024-05-25",
			status: "due_soon",
			priority: "high",
		},
		{
			id: "2",
			name: "Inspección de seguridad",
			assignee: "Ana González",
			dueDate: "2024-05-20",
			status: "overdue",
			priority: "high",
		},
		{
			id: "3",
			name: "Instalación eléctrica Nivel 12",
			assignee: "Miguel Torres",
			dueDate: "2024-05-30",
			status: "critical",
			priority: "medium",
		},
	],
};

const ProjectDashboardPage: React.FC = () => {
	const {projectId} = useParams<{projectId: string}>();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [dashboardData, setDashboardData] = useState<DashboardData | null>(
		null
	);

	useEffect(() => {
		// Simular carga de datos del dashboard
		const loadDashboardData = async () => {
			try {
				// En producción: await api.get(`/dashboards/project/${projectId}`)
				await new Promise((resolve) => setTimeout(resolve, 1000));
				setDashboardData(mockDashboardData);
			} catch (error) {
				console.error("Error loading dashboard data:", error);
			} finally {
				setLoading(false);
			}
		};

		loadDashboardData();
	}, [projectId]);

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin h-8 w-8 border-2 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
					<p className="text-gray-600">Cargando dashboard...</p>
				</div>
			</div>
		);
	}

	if (!dashboardData) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
					<h2 className="text-xl font-semibold text-gray-900 mb-2">
						Error al cargar dashboard
					</h2>
					<p className="text-gray-600 mb-6">
						No se pudieron cargar los datos del dashboard.
					</p>
					<button
						onClick={() => navigate(`/projects/details/${projectId}`)}
						className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors"
					>
						Volver al Proyecto
					</button>
				</div>
			</div>
		);
	}

	const getTaskStatusColor = (status: string) => {
		switch (status) {
			case "overdue":
				return "text-red-600 bg-red-50";
			case "due_soon":
				return "text-yellow-600 bg-yellow-50";
			case "critical":
				return "text-orange-600 bg-orange-50";
			default:
				return "text-gray-600 bg-gray-50";
		}
	};

	const getPhaseStatusColor = (status: string) => {
		switch (status) {
			case "completed":
				return "bg-green-500";
			case "in_progress":
				return "bg-blue-500";
			case "pending":
				return "bg-gray-300";
			default:
				return "bg-gray-300";
		}
	};

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("es-EC", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0,
		}).format(amount);
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("es-EC", {
			day: "numeric",
			month: "short",
		});
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white border-b border-gray-200">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<button
								onClick={() => navigate(`/projects/details/${projectId}`)}
								className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
							>
								<ArrowLeftIcon className="h-5 w-5" />
							</button>
							<div>
								<h1 className="text-2xl font-bold text-gray-900">
									Dashboard del Proyecto
								</h1>
								<p className="text-gray-600">{dashboardData.projectName}</p>
							</div>
						</div>

						<div className="flex items-center gap-3">
							<Link
								to={`/projects/details/${projectId}`}
								className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
							>
								<EyeIcon className="h-4 w-4" />
								Ver Proyecto
							</Link>
							<button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors">
								<DocumentTextIcon className="h-4 w-4" />
								Generar Reporte
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Dashboard Content */}
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* KPI Cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-fade-in">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">
									Progreso Total
								</p>
								<p className="text-2xl font-bold text-green-600">
									{dashboardData.completionPercentage}%
								</p>
								<div className="flex items-center mt-2">
									<ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
									<span className="text-xs text-green-600">
										+5% esta semana
									</span>
								</div>
							</div>
							<div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
								<ChartBarIcon className="h-6 w-6 text-green-600" />
							</div>
						</div>
					</div>

					<div
						className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-fade-in"
						style={{animationDelay: "0.1s"}}
					>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">
									Tareas Pendientes
								</p>
								<p className="text-2xl font-bold text-blue-600">
									{dashboardData.taskStatusCounts.in_progress}
								</p>
								<div className="flex items-center mt-2">
									<ArrowTrendingDownIcon className="h-4 w-4 text-blue-500 mr-1" />
									<span className="text-xs text-blue-600">-2 desde ayer</span>
								</div>
							</div>
							<div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
								<ClockIcon className="h-6 w-6 text-blue-600" />
							</div>
						</div>
					</div>

					<div
						className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-fade-in"
						style={{animationDelay: "0.2s"}}
					>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">
									Presupuesto Usado
								</p>
								<p className="text-2xl font-bold text-secondary-600">
									{dashboardData.budgetData.spentPercentage.toFixed(1)}%
								</p>
								<div className="flex items-center mt-2">
									<span className="text-xs text-gray-600">
										{formatCurrency(dashboardData.budgetData.spentAmount)}
									</span>
								</div>
							</div>
							<div className="h-12 w-12 bg-secondary-100 rounded-lg flex items-center justify-center">
								<CurrencyDollarIcon className="h-6 w-6 text-secondary-600" />
							</div>
						</div>
					</div>

					<div
						className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-fade-in"
						style={{animationDelay: "0.3s"}}
					>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">
									Tareas Vencidas
								</p>
								<p className="text-2xl font-bold text-red-600">
									{dashboardData.taskStatusCounts.overdue}
								</p>
								<div className="flex items-center mt-2">
									<ExclamationTriangleIcon className="h-4 w-4 text-red-500 mr-1" />
									<span className="text-xs text-red-600">
										Requiere atención
									</span>
								</div>
							</div>
							<div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
								<ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
							</div>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Columna principal */}
					<div className="lg:col-span-2 space-y-8">
						{/* Progreso de Fases */}
						<div
							className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 animate-fade-in"
							style={{animationDelay: "0.4s"}}
						>
							<h2 className="text-xl font-semibold text-gray-900 mb-6">
								Progreso por Fases
							</h2>
							<div className="space-y-6">
								{dashboardData.phaseProgress.map((phase, index) => (
									<div key={index} className="relative">
										<div className="flex items-center justify-between mb-2">
											<div className="flex items-center gap-3">
												<div
													className={`w-3 h-3 rounded-full ${getPhaseStatusColor(phase.status)}`}
												></div>
												<span className="text-sm font-medium text-gray-900">
													{phase.name}
												</span>
											</div>
											<div className="flex items-center gap-4">
												<span className="text-xs text-gray-500">
													{formatDate(phase.startDate)} -{" "}
													{formatDate(phase.endDate)}
												</span>
												<span className="text-sm font-semibold text-primary-600">
													{phase.progress}%
												</span>
											</div>
										</div>
										<div className="relative">
											<div className="w-full bg-gray-200 rounded-full h-3">
												<div
													className={`h-3 rounded-full transition-all duration-1000 ${
														phase.status === "completed"
															? "bg-green-500"
															: phase.status === "in_progress"
																? "bg-blue-500"
																: "bg-gray-300"
													}`}
													style={{width: `${phase.progress}%`}}
												></div>
											</div>
											{phase.status === "in_progress" && (
												<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent h-3 rounded-full animate-shimmer"></div>
											)}
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Gráfico de Progreso vs Planificado */}
						<div
							className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 animate-fade-in"
							style={{animationDelay: "0.5s"}}
						>
							<h2 className="text-xl font-semibold text-gray-900 mb-6">
								Progreso vs Planificado
							</h2>
							<div className="space-y-4">
								{dashboardData.progressData.map((data, index) => (
									<div key={index} className="flex items-center gap-4">
										<div className="w-16 text-sm text-gray-600">
											{data.date}
										</div>
										<div className="flex-1 flex gap-2">
											<div className="flex-1">
												<div className="flex items-center justify-between mb-1">
													<span className="text-xs text-gray-500">
														Planificado
													</span>
													<span className="text-xs text-gray-700">
														{data.planned}%
													</span>
												</div>
												<div className="w-full bg-gray-200 rounded-full h-2">
													<div
														className="bg-gray-400 h-2 rounded-full"
														style={{width: `${data.planned}%`}}
													></div>
												</div>
											</div>
											<div className="flex-1">
												<div className="flex items-center justify-between mb-1">
													<span className="text-xs text-blue-600">Real</span>
													<span className="text-xs text-blue-700">
														{data.actual}%
													</span>
												</div>
												<div className="w-full bg-gray-200 rounded-full h-2">
													<div
														className="bg-blue-500 h-2 rounded-full"
														style={{width: `${data.actual}%`}}
													></div>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						{/* Tareas Críticas */}
						<div
							className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-fade-in"
							style={{animationDelay: "0.6s"}}
						>
							<h3 className="text-lg font-semibold text-gray-900 mb-4">
								Tareas Críticas
							</h3>
							<div className="space-y-4">
								{dashboardData.criticalTasks.map((task) => (
									<div
										key={task.id}
										className="border-l-4 border-red-500 pl-4 py-2"
									>
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<h4 className="text-sm font-medium text-gray-900">
													{task.name}
												</h4>
												<p className="text-xs text-gray-600 mt-1">
													Asignado a: {task.assignee}
												</p>
												<p className="text-xs text-gray-500">
													Vence: {formatDate(task.dueDate)}
												</p>
											</div>
											<span
												className={`px-2 py-1 rounded-full text-xs font-medium ${getTaskStatusColor(task.status)}`}
											>
												{task.status === "overdue"
													? "Vencida"
													: task.status === "due_soon"
														? "Próxima"
														: "Crítica"}
											</span>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Resumen Presupuestario */}
						<div
							className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-fade-in"
							style={{animationDelay: "0.7s"}}
						>
							<h3 className="text-lg font-semibold text-gray-900 mb-4">
								Resumen Presupuestario
							</h3>
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<span className="text-gray-600">Presupuesto Total</span>
									<span className="font-semibold text-gray-900">
										{formatCurrency(dashboardData.budgetData.totalBudget)}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-gray-600">Gastado</span>
									<span className="font-semibold text-red-600">
										{formatCurrency(dashboardData.budgetData.spentAmount)}
									</span>
								</div>
								<div className="flex items-center justify-between border-t pt-4">
									<span className="text-gray-600">Restante</span>
									<span className="font-semibold text-green-600">
										{formatCurrency(dashboardData.budgetData.remainingBudget)}
									</span>
								</div>

								<div className="mt-4">
									<div className="flex items-center justify-between mb-2">
										<span className="text-sm text-gray-600">Utilizado</span>
										<span className="text-sm font-medium">
											{dashboardData.budgetData.spentPercentage.toFixed(1)}%
										</span>
									</div>
									<div className="w-full bg-gray-200 rounded-full h-3">
										<div
											className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full relative overflow-hidden"
											style={{
												width: `${dashboardData.budgetData.spentPercentage}%`,
											}}
										>
											<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Estado de Tareas */}
						<div
							className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-fade-in"
							style={{animationDelay: "0.8s"}}
						>
							<h3 className="text-lg font-semibold text-gray-900 mb-4">
								Estado de Tareas
							</h3>
							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<div className="w-3 h-3 bg-green-500 rounded-full"></div>
										<span className="text-sm text-gray-600">Completadas</span>
									</div>
									<span className="font-semibold text-green-600">
										{dashboardData.taskStatusCounts.completed}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<div className="w-3 h-3 bg-blue-500 rounded-full"></div>
										<span className="text-sm text-gray-600">En Progreso</span>
									</div>
									<span className="font-semibold text-blue-600">
										{dashboardData.taskStatusCounts.in_progress}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<div className="w-3 h-3 bg-gray-400 rounded-full"></div>
										<span className="text-sm text-gray-600">Pendientes</span>
									</div>
									<span className="font-semibold text-gray-600">
										{dashboardData.taskStatusCounts.pending}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<div className="w-3 h-3 bg-red-500 rounded-full"></div>
										<span className="text-sm text-gray-600">Vencidas</span>
									</div>
									<span className="font-semibold text-red-600">
										{dashboardData.taskStatusCounts.overdue}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Estilos para animaciones */}
			<style>{`
				@keyframes fadeIn {
					from {
						opacity: 0;
						transform: translateY(20px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				@keyframes shimmer {
					0% {
						transform: translateX(-100%);
					}
					100% {
						transform: translateX(100%);
					}
				}

				.animate-fade-in {
					animation: fadeIn 0.5s ease-out forwards;
					opacity: 0;
				}

				.animate-shimmer {
					animation: shimmer 2s infinite;
				}
			`}</style>
		</div>
	);
};

export default ProjectDashboardPage;
