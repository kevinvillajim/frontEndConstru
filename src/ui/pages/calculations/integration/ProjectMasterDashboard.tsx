// src/ui/pages/calculations/integration/ProjectMasterDashboard.tsx
import React, {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {
	ChartBarIcon,
	CurrencyDollarIcon,
	CalendarDaysIcon,
	DocumentTextIcon,
	UsersIcon,
	BuildingOfficeIcon,
	ArrowDownTrayIcon,
	PrinterIcon,
	ShareIcon,
	CogIcon,
	ExclamationTriangleIcon,
	CheckCircleIcon,
	ClockIcon,
	EyeIcon,
	PencilIcon,
	TrashIcon,
	BellIcon,
	ArrowUpRightIcon,
} from "@heroicons/react/24/outline";
import {
	LoadingSpinner,
	StatCard,
	ProgressBar,
	Badge,
} from "../shared/components/SharedComponents";

// Types
interface ProjectMasterData {
	id: string;
	name: string;
	client: string;
	description: string;
	status: "planning" | "active" | "paused" | "completed" | "cancelled";
	startDate: Date;
	endDate: Date;
	progress: {
		overall: number;
		calculations: number;
		budget: number;
		schedule: number;
	};
	financial: {
		totalBudget: number;
		spent: number;
		committed: number;
		remaining: number;
		projectedFinal: number;
		variance: number;
	};
	schedule: {
		totalActivities: number;
		completedActivities: number;
		delayedActivities: number;
		criticalPath: boolean;
		nextMilestone: string;
		daysToCompletion: number;
	};
	team: {
		totalMembers: number;
		activeMembers: number;
		roles: string[];
	};
	risks: {
		high: number;
		medium: number;
		low: number;
	};
	recentActivity: ActivityItem[];
	alerts: Alert[];
	documents: ProjectDocument[];
	integrationHealth: {
		calculations: "healthy" | "warning" | "error";
		budget: "healthy" | "warning" | "error";
		schedule: "healthy" | "warning" | "error";
		lastSync: Date;
	};
}

interface ActivityItem {
	id: string;
	type: "calculation" | "budget" | "schedule" | "document" | "approval";
	description: string;
	timestamp: Date;
	user: string;
	status: "success" | "warning" | "error" | "info";
}

interface Alert {
	id: string;
	type: "budget" | "schedule" | "quality" | "approval" | "integration";
	severity: "high" | "medium" | "low";
	title: string;
	description: string;
	actionRequired: boolean;
	timestamp: Date;
}

interface ProjectDocument {
	id: string;
	name: string;
	type: "calculation" | "budget" | "schedule" | "report" | "contract";
	size: string;
	lastModified: Date;
	status: "draft" | "review" | "approved" | "final";
}

// Custom Hook
const useProjectMaster = () => {
	const [projectData, setProjectData] = useState<ProjectMasterData | null>(
		null
	);
	const [isLoading, setIsLoading] = useState(true);
	const [isExporting, setIsExporting] = useState(false);

	const loadProjectData = async (projectId: string) => {
		setIsLoading(true);
		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			const mockData: ProjectMasterData = {
				id: projectId,
				name: "Edificio Residencial Plaza Norte",
				client: "Inmobiliaria Constructora S.A.",
				description:
					"Construcción de edificio residencial de 12 pisos con 48 departamentos",
				status: "active",
				startDate: new Date(2024, 0, 15),
				endDate: new Date(2024, 11, 20),
				progress: {
					overall: 67,
					calculations: 85,
					budget: 72,
					schedule: 65,
				},
				financial: {
					totalBudget: 2500000,
					spent: 1800000,
					committed: 350000,
					remaining: 350000,
					projectedFinal: 2650000,
					variance: -6,
				},
				schedule: {
					totalActivities: 234,
					completedActivities: 152,
					delayedActivities: 8,
					criticalPath: true,
					nextMilestone: "Finalización estructura nivel 8",
					daysToCompletion: 125,
				},
				team: {
					totalMembers: 35,
					activeMembers: 28,
					roles: ["Arquitecto", "Ing. Civil", "Maestro de Obra", "Albañiles"],
				},
				risks: {
					high: 2,
					medium: 5,
					low: 12,
				},
				recentActivity: [
					{
						id: "1",
						type: "budget",
						description: "Actualización de precios de materiales - Cemento",
						timestamp: new Date(2024, 5, 13, 14, 30),
						user: "Ana García",
						status: "success",
					},
					{
						id: "2",
						type: "schedule",
						description: "Actividad retrasada: Instalación eléctrica nivel 6",
						timestamp: new Date(2024, 5, 13, 11, 15),
						user: "Sistema",
						status: "warning",
					},
					{
						id: "3",
						type: "calculation",
						description: "Nuevos cálculos estructurales nivel 9-12",
						timestamp: new Date(2024, 5, 12, 16, 45),
						user: "Carlos Mendoza",
						status: "success",
					},
				],
				alerts: [
					{
						id: "1",
						type: "budget",
						severity: "high",
						title: "Sobrecosto detectado",
						description: "El presupuesto actual supera en 6% lo planificado",
						actionRequired: true,
						timestamp: new Date(2024, 5, 13, 9, 0),
					},
					{
						id: "2",
						type: "schedule",
						severity: "medium",
						title: "Actividades en ruta crítica retrasadas",
						description: "8 actividades críticas presentan retrasos menores",
						actionRequired: true,
						timestamp: new Date(2024, 5, 12, 15, 30),
					},
				],
				documents: [
					{
						id: "1",
						name: "Presupuesto General v3.2",
						type: "budget",
						size: "2.4 MB",
						lastModified: new Date(2024, 5, 13, 14, 30),
						status: "approved",
					},
					{
						id: "2",
						name: "Cronograma Maestro",
						type: "schedule",
						size: "1.8 MB",
						lastModified: new Date(2024, 5, 12, 16, 15),
						status: "review",
					},
				],
				integrationHealth: {
					calculations: "healthy",
					budget: "warning",
					schedule: "healthy",
					lastSync: new Date(2024, 5, 13, 14, 30),
				},
			};

			setProjectData(mockData);
		} catch (error) {
			console.error("Error loading project data:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const exportProject = async (format: "pdf" | "excel" | "project") => {
		setIsExporting(true);
		try {
			// Simulate export
			await new Promise((resolve) => setTimeout(resolve, 2000));
			console.log(`Exporting project in ${format} format`);
		} finally {
			setIsExporting(false);
		}
	};

	return {
		projectData,
		isLoading,
		isExporting,
		loadProjectData,
		exportProject,
	};
};

// Components
const ProjectStatusBadge: React.FC<{status: ProjectMasterData["status"]}> = ({
	status,
}) => {
	const statusConfig = {
		planning: {color: "bg-blue-100 text-blue-800", label: "Planificación"},
		active: {color: "bg-green-100 text-green-800", label: "Activo"},
		paused: {color: "bg-yellow-100 text-yellow-800", label: "Pausado"},
		completed: {color: "bg-purple-100 text-purple-800", label: "Completado"},
		cancelled: {color: "bg-red-100 text-red-800", label: "Cancelado"},
	};

	const config = statusConfig[status];

	return (
		<span
			className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
		>
			{config.label}
		</span>
	);
};

const IntegrationHealthIndicator: React.FC<{
	health: ProjectMasterData["integrationHealth"];
}> = ({health}) => {
	const getHealthColor = (status: string) => {
		switch (status) {
			case "healthy":
				return "text-green-600 bg-green-100";
			case "warning":
				return "text-yellow-600 bg-yellow-100";
			case "error":
				return "text-red-600 bg-red-100";
			default:
				return "text-gray-600 bg-gray-100";
		}
	};

	const getHealthIcon = (status: string) => {
		switch (status) {
			case "healthy":
				return CheckCircleIcon;
			case "warning":
				return ExclamationTriangleIcon;
			case "error":
				return ExclamationTriangleIcon;
			default:
				return ClockIcon;
		}
	};

	return (
		<div className="bg-white rounded-xl border border-gray-200 p-6">
			<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
				<CogIcon className="h-5 w-5 text-blue-600" />
				Estado de Integración
			</h3>

			<div className="space-y-4">
				{Object.entries(health).map(([key, value]) => {
					if (key === "lastSync") return null;

					const Icon = getHealthIcon(value as string);
					const label =
						key === "calculations"
							? "Cálculos"
							: key === "budget"
								? "Presupuesto"
								: "Cronograma";

					return (
						<div key={key} className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div
									className={`w-8 h-8 rounded-full flex items-center justify-center ${getHealthColor(value as string)}`}
								>
									<Icon className="h-4 w-4" />
								</div>
								<span className="font-medium text-gray-900">{label}</span>
							</div>
							<Badge
								variant={
									value === "healthy"
										? "success"
										: value === "warning"
											? "warning"
											: "error"
								}
							>
								{value === "healthy"
									? "OK"
									: value === "warning"
										? "Atención"
										: "Error"}
							</Badge>
						</div>
					);
				})}

				<div className="pt-3 border-t border-gray-200">
					<div className="text-sm text-gray-600">
						Última sincronización: {health.lastSync.toLocaleString("es-EC")}
					</div>
				</div>
			</div>
		</div>
	);
};

const ProjectMasterDashboard: React.FC = () => {
	const {projectId} = useParams<{projectId: string}>();
	const navigate = useNavigate();
	const {projectData, isLoading, isExporting, loadProjectData, exportProject} =
		useProjectMaster();

	const [selectedView, setSelectedView] = useState<
		"overview" | "details" | "activity"
	>("overview");

	useEffect(() => {
		if (projectId) {
			loadProjectData(projectId);
		}
	}, [projectId]);

	if (isLoading) {
		return (
			<div className="max-w-7xl mx-auto px-4 py-8">
				<div className="flex items-center justify-center h-64">
					<div className="text-center">
						<LoadingSpinner size="lg" className="mx-auto mb-4" />
						<p className="text-gray-600">Cargando proyecto maestro...</p>
					</div>
				</div>
			</div>
		);
	}

	if (!projectData) {
		return (
			<div className="max-w-7xl mx-auto px-4 py-8">
				<div className="text-center py-12">
					<BuildingOfficeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
					<h3 className="text-lg font-medium text-gray-900 mb-2">
						Proyecto no encontrado
					</h3>
					<p className="text-gray-600">
						No se pudo cargar la información del proyecto.
					</p>
				</div>
			</div>
		);
	}

	const renderHeader = () => (
		<div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
			<div className="flex items-start justify-between mb-6">
				<div className="flex items-start gap-4">
					<div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
						<BuildingOfficeIcon className="h-8 w-8 text-white" />
					</div>
					<div>
						<h1 className="text-2xl font-bold text-gray-900 mb-1">
							{projectData.name}
						</h1>
						<p className="text-gray-600 mb-2">{projectData.client}</p>
						<div className="flex items-center gap-4">
							<ProjectStatusBadge status={projectData.status} />
							<span className="text-sm text-gray-500">
								{Math.round(
									(projectData.endDate.getTime() - new Date().getTime()) /
										(1000 * 60 * 60 * 24)
								)}{" "}
								días restantes
							</span>
						</div>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<button
						onClick={() => navigate(`/projects/${projectId}/edit`)}
						className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
					>
						<PencilIcon className="h-4 w-4" />
						Editar
					</button>
					<button
						onClick={() => exportProject("pdf")}
						disabled={isExporting}
						className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
					>
						{isExporting ? (
							<LoadingSpinner size="sm" />
						) : (
							<ArrowDownTrayIcon className="h-4 w-4" />
						)}
						Exportar
					</button>
				</div>
			</div>

			{/* Navigation Tabs */}
			<div className="flex gap-1 bg-gray-100 rounded-lg p-1">
				{[
					{key: "overview", label: "Resumen Ejecutivo", icon: ChartBarIcon},
					{key: "details", label: "Detalles Técnicos", icon: DocumentTextIcon},
					{key: "activity", label: "Actividad Reciente", icon: ClockIcon},
				].map(({key, label, icon: Icon}) => (
					<button
						key={key}
						onClick={() => setSelectedView(key as typeof selectedView)}
						className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
							selectedView === key
								? "bg-white text-blue-600 shadow-sm"
								: "text-gray-600 hover:text-gray-900"
						}`}
					>
						<Icon className="h-4 w-4" />
						{label}
					</button>
				))}
			</div>
		</div>
	);

	const renderOverview = () => (
		<div className="space-y-6">
			{/* KPI Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<StatCard
					title="Progreso General"
					value={`${projectData.progress.overall}%`}
					icon={ChartBarIcon}
					color="blue"
					trend={projectData.progress.overall >= 65 ? "up" : "down"}
					change={projectData.progress.overall >= 65 ? 5 : -2}
				/>
				<StatCard
					title="Presupuesto Utilizado"
					value={`$${(projectData.financial.spent / 1000).toFixed(0)}K`}
					icon={CurrencyDollarIcon}
					color={projectData.financial.variance > -10 ? "green" : "red"}
					trend={projectData.financial.variance > -10 ? "up" : "down"}
					change={projectData.financial.variance}
				/>
				<StatCard
					title="Actividades Completadas"
					value={`${projectData.schedule.completedActivities}/${projectData.schedule.totalActivities}`}
					icon={CalendarDaysIcon}
					color="purple"
					trend="up"
					change={12}
				/>
				<StatCard
					title="Equipo Activo"
					value={`${projectData.team.activeMembers}`}
					icon={UsersIcon}
					color="yellow"
					trend="neutral"
					change={0}
				/>
			</div>

			{/* Progress Breakdown */}
			<div className="bg-white rounded-2xl border border-gray-200 p-6">
				<h3 className="text-lg font-semibold text-gray-900 mb-6">
					Progreso por Módulo
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{[
						{key: "calculations", label: "Cálculos", color: "blue"},
						{key: "budget", label: "Presupuesto", color: "green"},
						{key: "schedule", label: "Cronograma", color: "purple"},
					].map(({key, label, color}) => (
						<div key={key} className="space-y-3">
							<div className="flex justify-between items-center">
								<span className="font-medium text-gray-900">{label}</span>
								<span className="text-sm font-bold text-gray-700">
									{
										projectData.progress[
											key as keyof typeof projectData.progress
										]
									}
									%
								</span>
							</div>
							<ProgressBar
								progress={
									projectData.progress[key as keyof typeof projectData.progress]
								}
								color={color as "blue" | "green" | "purple"}
								className="h-3"
							/>
							<button className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1">
								Ver detalles <ArrowUpRightIcon className="h-3 w-3" />
							</button>
						</div>
					))}
				</div>
			</div>

			{/* Alerts */}
			{projectData.alerts.length > 0 && (
				<div className="bg-white rounded-2xl border border-gray-200 p-6">
					<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
						<BellIcon className="h-5 w-5 text-yellow-600" />
						Alertas Activas ({projectData.alerts.length})
					</h3>
					<div className="space-y-4">
						{projectData.alerts.map((alert) => (
							<div
								key={alert.id}
								className={`p-4 rounded-lg border-l-4 ${
									alert.severity === "high"
										? "bg-red-50 border-red-400"
										: alert.severity === "medium"
											? "bg-yellow-50 border-yellow-400"
											: "bg-blue-50 border-blue-400"
								}`}
							>
								<div className="flex items-start justify-between mb-2">
									<h4 className="font-medium text-gray-900">{alert.title}</h4>
									<Badge
										variant={
											alert.severity === "high"
												? "error"
												: alert.severity === "medium"
													? "warning"
													: "info"
										}
									>
										{alert.severity === "high"
											? "Alta"
											: alert.severity === "medium"
												? "Media"
												: "Baja"}
									</Badge>
								</div>
								<p className="text-sm text-gray-700 mb-3">
									{alert.description}
								</p>
								{alert.actionRequired && (
									<button className="text-sm font-medium text-blue-600 hover:text-blue-700">
										Tomar acción →
									</button>
								)}
							</div>
						))}
					</div>
				</div>
			)}

			{/* Integration Health */}
			<IntegrationHealthIndicator health={projectData.integrationHealth} />
		</div>
	);

	const renderDetails = () => (
		<div className="space-y-6">
			{/* Financial Details */}
			<div className="bg-white rounded-2xl border border-gray-200 p-6">
				<h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
					<CurrencyDollarIcon className="h-5 w-5 text-green-600" />
					Análisis Financiero Detallado
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<div className="space-y-4">
						<div>
							<div className="text-sm text-gray-600 mb-1">
								Presupuesto Total
							</div>
							<div className="text-2xl font-bold text-gray-900">
								${projectData.financial.totalBudget.toLocaleString()}
							</div>
						</div>
						<div>
							<div className="text-sm text-gray-600 mb-1">Gastado</div>
							<div className="text-xl font-semibold text-red-600">
								${projectData.financial.spent.toLocaleString()}
							</div>
						</div>
						<div>
							<div className="text-sm text-gray-600 mb-1">Comprometido</div>
							<div className="text-xl font-semibold text-yellow-600">
								${projectData.financial.committed.toLocaleString()}
							</div>
						</div>
					</div>

					<div className="space-y-4">
						<div>
							<div className="text-sm text-gray-600 mb-1">Disponible</div>
							<div className="text-xl font-semibold text-green-600">
								${projectData.financial.remaining.toLocaleString()}
							</div>
						</div>
						<div>
							<div className="text-sm text-gray-600 mb-1">Proyección Final</div>
							<div className="text-xl font-semibold text-gray-900">
								${projectData.financial.projectedFinal.toLocaleString()}
							</div>
						</div>
						<div>
							<div className="text-sm text-gray-600 mb-1">Variación</div>
							<div
								className={`text-xl font-semibold ${
									projectData.financial.variance >= 0
										? "text-green-600"
										: "text-red-600"
								}`}
							>
								{projectData.financial.variance >= 0 ? "+" : ""}
								{projectData.financial.variance}%
							</div>
						</div>
					</div>

					<div className="space-y-4">
						<div className="bg-gray-50 rounded-lg p-4">
							<h4 className="font-medium text-gray-900 mb-2">
								Distribución del Gasto
							</h4>
							<div className="space-y-2">
								<div className="flex justify-between text-sm">
									<span>Utilizado</span>
									<span>
										{(
											(projectData.financial.spent /
												projectData.financial.totalBudget) *
											100
										).toFixed(1)}
										%
									</span>
								</div>
								<ProgressBar
									progress={
										(projectData.financial.spent /
											projectData.financial.totalBudget) *
										100
									}
									color="red"
									className="h-2"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Schedule Details */}
			<div className="bg-white rounded-2xl border border-gray-200 p-6">
				<h3 className="text-lg font-semibent text-gray-900 mb-6 flex items-center gap-2">
					<CalendarDaysIcon className="h-5 w-5 text-purple-600" />
					Estado del Cronograma
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-4">
						<div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
							<span className="text-sm font-medium text-gray-700">
								Total de Actividades
							</span>
							<span className="text-lg font-bold text-gray-900">
								{projectData.schedule.totalActivities}
							</span>
						</div>
						<div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
							<span className="text-sm font-medium text-green-700">
								Completadas
							</span>
							<span className="text-lg font-bold text-green-900">
								{projectData.schedule.completedActivities}
							</span>
						</div>
						<div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
							<span className="text-sm font-medium text-red-700">
								Retrasadas
							</span>
							<span className="text-lg font-bold text-red-900">
								{projectData.schedule.delayedActivities}
							</span>
						</div>
					</div>

					<div className="space-y-4">
						<div className="p-4 border border-gray-200 rounded-lg">
							<h4 className="font-medium text-gray-900 mb-2">Próximo Hito</h4>
							<p className="text-sm text-gray-600 mb-2">
								{projectData.schedule.nextMilestone}
							</p>
							<div className="text-sm text-gray-500">
								{projectData.schedule.daysToCompletion} días para finalización
							</div>
						</div>

						<div className="p-4 border border-gray-200 rounded-lg">
							<h4 className="font-medium text-gray-900 mb-2">Ruta Crítica</h4>
							<div className="flex items-center gap-2">
								{projectData.schedule.criticalPath ? (
									<>
										<ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
										<span className="text-sm text-yellow-700">
											Requiere atención especial
										</span>
									</>
								) : (
									<>
										<CheckCircleIcon className="h-5 w-5 text-green-600" />
										<span className="text-sm text-green-700">
											En buen estado
										</span>
									</>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Documents */}
			<div className="bg-white rounded-2xl border border-gray-200 p-6">
				<h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
					<DocumentTextIcon className="h-5 w-5 text-blue-600" />
					Documentos del Proyecto
				</h3>
				<div className="space-y-3">
					{projectData.documents.map((doc) => (
						<div
							key={doc.id}
							className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
						>
							<div className="flex items-center gap-3">
								<div
									className={`w-10 h-10 rounded-lg flex items-center justify-center ${
										doc.type === "budget"
											? "bg-green-100"
											: doc.type === "schedule"
												? "bg-purple-100"
												: doc.type === "calculation"
													? "bg-blue-100"
													: "bg-gray-100"
									}`}
								>
									<DocumentTextIcon
										className={`h-5 w-5 ${
											doc.type === "budget"
												? "text-green-600"
												: doc.type === "schedule"
													? "text-purple-600"
													: doc.type === "calculation"
														? "text-blue-600"
														: "text-gray-600"
										}`}
									/>
								</div>
								<div>
									<div className="font-medium text-gray-900">{doc.name}</div>
									<div className="text-sm text-gray-600">
										{doc.size} • Modificado{" "}
										{doc.lastModified.toLocaleDateString("es-EC")}
									</div>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<Badge
									variant={
										doc.status === "approved"
											? "success"
											: doc.status === "final"
												? "info"
												: doc.status === "review"
													? "warning"
													: "default"
									}
								>
									{doc.status === "approved"
										? "Aprobado"
										: doc.status === "final"
											? "Final"
											: doc.status === "review"
												? "En revisión"
												: "Borrador"}
								</Badge>
								<button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
									<EyeIcon className="h-4 w-4" />
								</button>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);

	const renderActivity = () => (
		<div className="bg-white rounded-2xl border border-gray-200 p-6">
			<h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
				<ClockIcon className="h-5 w-5 text-blue-600" />
				Actividad Reciente
			</h3>
			<div className="space-y-4">
				{projectData.recentActivity.map((activity) => (
					<div
						key={activity.id}
						className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
					>
						<div
							className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
								activity.status === "success"
									? "bg-green-100"
									: activity.status === "warning"
										? "bg-yellow-100"
										: activity.status === "error"
											? "bg-red-100"
											: "bg-blue-100"
							}`}
						>
							{activity.type === "budget" && (
								<CurrencyDollarIcon
									className={`h-5 w-5 ${
										activity.status === "success"
											? "text-green-600"
											: activity.status === "warning"
												? "text-yellow-600"
												: activity.status === "error"
													? "text-red-600"
													: "text-blue-600"
									}`}
								/>
							)}
							{activity.type === "schedule" && (
								<CalendarDaysIcon
									className={`h-5 w-5 ${
										activity.status === "success"
											? "text-green-600"
											: activity.status === "warning"
												? "text-yellow-600"
												: activity.status === "error"
													? "text-red-600"
													: "text-blue-600"
									}`}
								/>
							)}
							{activity.type === "calculation" && (
								<ChartBarIcon
									className={`h-5 w-5 ${
										activity.status === "success"
											? "text-green-600"
											: activity.status === "warning"
												? "text-yellow-600"
												: activity.status === "error"
													? "text-red-600"
													: "text-blue-600"
									}`}
								/>
							)}
						</div>
						<div className="flex-1">
							<div className="flex items-start justify-between mb-1">
								<p className="text-sm font-medium text-gray-900">
									{activity.description}
								</p>
								<span className="text-xs text-gray-500">
									{activity.timestamp.toLocaleString("es-EC")}
								</span>
							</div>
							<p className="text-xs text-gray-600">Por {activity.user}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);

	return (
		<div className="max-w-7xl mx-auto px-4 py-8">
			{renderHeader()}

			{selectedView === "overview" && renderOverview()}
			{selectedView === "details" && renderDetails()}
			{selectedView === "activity" && renderActivity()}
		</div>
	);
};

export default ProjectMasterDashboard;
