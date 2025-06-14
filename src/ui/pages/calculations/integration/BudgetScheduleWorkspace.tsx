// src/ui/pages/calculations/integration/BudgetScheduleWorkspace.tsx
import React, {useState, useEffect, useRef} from "react";
import {useParams} from "react-router-dom";
import {
	CurrencyDollarIcon,
	CalendarDaysIcon,
	ChartBarIcon,
	ExclamationTriangleIcon,
	ArrowPathIcon,
	LinkIcon,
	BeakerIcon,
	DocumentTextIcon,
	ClockIcon,
	TrendingUpIcon,
	TrendingDownIcon,
	CheckCircleIcon,
	XCircleIcon,
	PlayIcon,
	PauseIcon,
	AdjustmentsHorizontalIcon,
	BellIcon,
} from "@heroicons/react/24/outline";
import {useBudgetScheduleIntegration} from "../shared/hooks/useBudgetScheduleIntegration";
import {
	LoadingSpinner,
	ProgressBar,
	Alert,
	Badge,
} from "../shared/components/SharedComponents";

interface IntegratedProject {
	id: string;
	name: string;
	budget: {
		id: string;
		totalCost: number;
		spent: number;
		remaining: number;
		status: "draft" | "approved" | "active" | "overbudget";
		lastUpdated: Date;
	};
	schedule: {
		id: string;
		totalActivities: number;
		completedActivities: number;
		progress: number;
		startDate: Date;
		endDate: Date;
		status: "on_time" | "delayed" | "ahead" | "critical";
		lastUpdated: Date;
	};
	integration: {
		syncStatus: "synced" | "pending" | "conflict" | "error";
		lastSync: Date;
		conflicts: string[];
		automationEnabled: boolean;
	};
}

interface SyncConflict {
	id: string;
	type:
		| "cost_variance"
		| "schedule_change"
		| "resource_conflict"
		| "progress_mismatch";
	description: string;
	budgetImpact?: number;
	scheduleImpact?: number;
	severity: "low" | "medium" | "high" | "critical";
	resolution: "pending" | "resolved" | "ignored";
	suggestions: string[];
}

interface ChangeOrder {
	id: string;
	title: string;
	description: string;
	type: "addition" | "modification" | "deletion";
	budgetImpact: number;
	scheduleImpact: number;
	status:
		| "draft"
		| "pending_approval"
		| "approved"
		| "rejected"
		| "implemented";
	requestedBy: string;
	requestedAt: Date;
	approvedBy?: string;
	approvedAt?: Date;
	reason: string;
}

const SyncStatusIndicator: React.FC<{
	status: string;
	lastSync: Date;
	onForceSync: () => void;
}> = ({status, lastSync, onForceSync}) => {
	const getStatusColor = (status: string) => {
		switch (status) {
			case "synced":
				return "text-green-600 bg-green-100 border-green-200";
			case "pending":
				return "text-yellow-600 bg-yellow-100 border-yellow-200";
			case "conflict":
				return "text-red-600 bg-red-100 border-red-200";
			case "error":
				return "text-red-600 bg-red-100 border-red-200";
			default:
				return "text-gray-600 bg-gray-100 border-gray-200";
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case "synced":
				return "Sincronizado";
			case "pending":
				return "Pendiente";
			case "conflict":
				return "Conflicto";
			case "error":
				return "Error";
			default:
				return "Desconocido";
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "synced":
				return <CheckCircleIcon className="h-4 w-4" />;
			case "pending":
				return <ClockIcon className="h-4 w-4" />;
			case "conflict":
				return <ExclamationTriangleIcon className="h-4 w-4" />;
			case "error":
				return <XCircleIcon className="h-4 w-4" />;
			default:
				return <ClockIcon className="h-4 w-4" />;
		}
	};

	return (
		<div
			className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${getStatusColor(status)}`}
		>
			{getStatusIcon(status)}
			<div>
				<div className="text-sm font-medium">{getStatusText(status)}</div>
				<div className="text-xs opacity-75">
					Última sincronización: {lastSync.toLocaleString("es-EC")}
				</div>
			</div>
			<button
				onClick={onForceSync}
				className="ml-2 p-1 hover:bg-black hover:bg-opacity-10 rounded transition-colors"
				title="Forzar sincronización"
			>
				<ArrowPathIcon className="h-4 w-4" />
			</button>
		</div>
	);
};

const ConflictResolutionPanel: React.FC<{
	conflicts: SyncConflict[];
	onResolveConflict: (conflictId: string, resolution: any) => void;
	onIgnoreConflict: (conflictId: string) => void;
}> = ({conflicts, onResolveConflict, onIgnoreConflict}) => {
	const [selectedConflict, setSelectedConflict] = useState<string | null>(null);

	const getSeverityColor = (severity: string) => {
		switch (severity) {
			case "critical":
				return "border-red-500 bg-red-50";
			case "high":
				return "border-orange-500 bg-orange-50";
			case "medium":
				return "border-yellow-500 bg-yellow-50";
			case "low":
				return "border-blue-500 bg-blue-50";
			default:
				return "border-gray-500 bg-gray-50";
		}
	};

	const getTypeIcon = (type: string) => {
		switch (type) {
			case "cost_variance":
				return <CurrencyDollarIcon className="h-5 w-5" />;
			case "schedule_change":
				return <CalendarDaysIcon className="h-5 w-5" />;
			case "resource_conflict":
				return <ExclamationTriangleIcon className="h-5 w-5" />;
			case "progress_mismatch":
				return <ChartBarIcon className="h-5 w-5" />;
			default:
				return <ExclamationTriangleIcon className="h-5 w-5" />;
		}
	};

	if (conflicts.length === 0) {
		return (
			<div className="bg-green-50 border border-green-200 rounded-lg p-4">
				<div className="flex items-center gap-2 text-green-800">
					<CheckCircleIcon className="h-5 w-5" />
					<span className="font-medium">No hay conflictos pendientes</span>
				</div>
				<p className="text-green-700 text-sm mt-1">
					El presupuesto y cronograma están sincronizados correctamente.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
				<ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
				Conflictos de Sincronización ({conflicts.length})
			</h3>

			{conflicts.map((conflict) => (
				<div
					key={conflict.id}
					className={`border-2 rounded-lg p-4 ${getSeverityColor(conflict.severity)}`}
				>
					<div className="flex items-start justify-between mb-3">
						<div className="flex items-start gap-3">
							<div className="text-gray-600">{getTypeIcon(conflict.type)}</div>
							<div className="flex-1">
								<h4 className="font-medium text-gray-900 mb-1">
									{conflict.type.replace("_", " ").toUpperCase()}
								</h4>
								<p className="text-sm text-gray-700">{conflict.description}</p>
							</div>
						</div>
						<Badge
							variant={
								conflict.severity === "critical"
									? "error"
									: conflict.severity === "high"
										? "warning"
										: "info"
							}
						>
							{conflict.severity.toUpperCase()}
						</Badge>
					</div>

					{(conflict.budgetImpact || conflict.scheduleImpact) && (
						<div className="grid grid-cols-2 gap-4 mb-3">
							{conflict.budgetImpact && (
								<div className="bg-white bg-opacity-50 rounded p-2">
									<div className="text-xs text-gray-600">
										Impacto en Presupuesto
									</div>
									<div
										className={`font-medium ${conflict.budgetImpact > 0 ? "text-red-600" : "text-green-600"}`}
									>
										{conflict.budgetImpact > 0 ? "+" : ""}$
										{conflict.budgetImpact.toLocaleString()}
									</div>
								</div>
							)}
							{conflict.scheduleImpact && (
								<div className="bg-white bg-opacity-50 rounded p-2">
									<div className="text-xs text-gray-600">
										Impacto en Cronograma
									</div>
									<div
										className={`font-medium ${conflict.scheduleImpact > 0 ? "text-red-600" : "text-green-600"}`}
									>
										{conflict.scheduleImpact > 0 ? "+" : ""}
										{conflict.scheduleImpact} días
									</div>
								</div>
							)}
						</div>
					)}

					{conflict.suggestions.length > 0 && (
						<div className="mb-3">
							<div className="text-sm font-medium text-gray-900 mb-2">
								Sugerencias:
							</div>
							<ul className="list-disc list-inside space-y-1">
								{conflict.suggestions.map((suggestion, index) => (
									<li key={index} className="text-sm text-gray-700">
										{suggestion}
									</li>
								))}
							</ul>
						</div>
					)}

					<div className="flex gap-2">
						<button
							onClick={() => onResolveConflict(conflict.id, {})}
							className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
						>
							Resolver
						</button>
						<button
							onClick={() => onIgnoreConflict(conflict.id)}
							className="px-3 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
						>
							Ignorar
						</button>
					</div>
				</div>
			))}
		</div>
	);
};

const IntegratedKPIPanel: React.FC<{
	project: IntegratedProject;
}> = ({project}) => {
	const budgetUtilization =
		project.budget.totalCost > 0
			? (project.budget.spent / project.budget.totalCost) * 100
			: 0;

	const scheduleProgress = project.schedule.progress;

	const performanceIndex =
		scheduleProgress > 0 ? (scheduleProgress / budgetUtilization) * 100 : 100;

	const getPerformanceColor = (index: number) => {
		if (index >= 95) return "text-green-600";
		if (index >= 85) return "text-yellow-600";
		return "text-red-600";
	};

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			<div className="bg-white rounded-xl border border-gray-200 p-6">
				<div className="flex items-center gap-3 mb-4">
					<div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
						<CurrencyDollarIcon className="h-5 w-5 text-blue-600" />
					</div>
					<div>
						<div className="text-sm text-gray-600">Presupuesto</div>
						<div className="text-2xl font-bold text-gray-900">
							${project.budget.spent.toLocaleString()}
						</div>
					</div>
				</div>
				<div className="space-y-2">
					<div className="flex justify-between text-sm">
						<span>Utilizado</span>
						<span>{budgetUtilization.toFixed(1)}%</span>
					</div>
					<ProgressBar
						progress={budgetUtilization}
						color={
							budgetUtilization > 100
								? "red"
								: budgetUtilization > 85
									? "yellow"
									: "blue"
						}
					/>
					<div className="text-xs text-gray-500">
						Restante: ${project.budget.remaining.toLocaleString()}
					</div>
				</div>
			</div>

			<div className="bg-white rounded-xl border border-gray-200 p-6">
				<div className="flex items-center gap-3 mb-4">
					<div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
						<CalendarDaysIcon className="h-5 w-5 text-green-600" />
					</div>
					<div>
						<div className="text-sm text-gray-600">Cronograma</div>
						<div className="text-2xl font-bold text-gray-900">
							{scheduleProgress.toFixed(1)}%
						</div>
					</div>
				</div>
				<div className="space-y-2">
					<div className="flex justify-between text-sm">
						<span>Completado</span>
						<span>
							{project.schedule.completedActivities}/
							{project.schedule.totalActivities}
						</span>
					</div>
					<ProgressBar
						progress={scheduleProgress}
						color={
							scheduleProgress >= 85
								? "green"
								: scheduleProgress >= 70
									? "yellow"
									: "red"
						}
					/>
					<div className="text-xs text-gray-500">
						Estado: {project.schedule.status.replace("_", " ")}
					</div>
				</div>
			</div>

			<div className="bg-white rounded-xl border border-gray-200 p-6">
				<div className="flex items-center gap-3 mb-4">
					<div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
						<ChartBarIcon className="h-5 w-5 text-purple-600" />
					</div>
					<div>
						<div className="text-sm text-gray-600">Performance</div>
						<div
							className={`text-2xl font-bold ${getPerformanceColor(performanceIndex)}`}
						>
							{performanceIndex.toFixed(1)}%
						</div>
					</div>
				</div>
				<div className="space-y-2">
					<div className="flex justify-between text-sm">
						<span>Índice</span>
						<span className={getPerformanceColor(performanceIndex)}>
							{performanceIndex >= 95
								? "Excelente"
								: performanceIndex >= 85
									? "Bueno"
									: "Crítico"}
						</span>
					</div>
					<ProgressBar
						progress={Math.min(performanceIndex, 100)}
						color={
							performanceIndex >= 95
								? "green"
								: performanceIndex >= 85
									? "yellow"
									: "red"
						}
					/>
					<div className="text-xs text-gray-500">Progreso vs Gasto</div>
				</div>
			</div>

			<div className="bg-white rounded-xl border border-gray-200 p-6">
				<div className="flex items-center gap-3 mb-4">
					<div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
						<LinkIcon className="h-5 w-5 text-yellow-600" />
					</div>
					<div>
						<div className="text-sm text-gray-600">Integración</div>
						<div className="text-xl font-bold text-gray-900">
							{project.integration.syncStatus === "synced" ? "OK" : "ALERT"}
						</div>
					</div>
				</div>
				<div className="space-y-2">
					<div
						className={`text-sm font-medium ${
							project.integration.syncStatus === "synced"
								? "text-green-600"
								: "text-red-600"
						}`}
					>
						{project.integration.syncStatus === "synced"
							? "Sincronizado"
							: "Requiere atención"}
					</div>
					<div className="text-xs text-gray-500">
						Última sync: {project.integration.lastSync.toLocaleString("es-EC")}
					</div>
					{project.integration.conflicts.length > 0 && (
						<div className="text-xs text-red-600">
							{project.integration.conflicts.length} conflicto(s)
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

const ChangeOrderTracker: React.FC<{
	changeOrders: ChangeOrder[];
	onApproveChange: (changeId: string) => void;
	onRejectChange: (changeId: string) => void;
	onCreateChange: () => void;
}> = ({changeOrders, onApproveChange, onRejectChange, onCreateChange}) => {
	const pendingChanges = changeOrders.filter(
		(co) => co.status === "pending_approval"
	);
	const recentChanges = changeOrders.slice(0, 5);

	return (
		<div className="bg-white rounded-xl border border-gray-200 p-6">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
					<DocumentTextIcon className="h-5 w-5 text-blue-600" />
					Órdenes de Cambio
				</h3>
				<button
					onClick={onCreateChange}
					className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
				>
					<DocumentTextIcon className="h-4 w-4" />
					Nueva Orden
				</button>
			</div>

			{pendingChanges.length > 0 && (
				<div className="mb-6">
					<h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
						<BellIcon className="h-4 w-4 text-yellow-600" />
						Pendientes de Aprobación ({pendingChanges.length})
					</h4>
					<div className="space-y-3">
						{pendingChanges.map((change) => (
							<div
								key={change.id}
								className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
							>
								<div className="flex items-start justify-between mb-2">
									<div>
										<h5 className="font-medium text-gray-900">
											{change.title}
										</h5>
										<p className="text-sm text-gray-600">
											{change.description}
										</p>
									</div>
									<Badge variant="warning">Pendiente</Badge>
								</div>

								<div className="grid grid-cols-2 gap-4 mb-3">
									<div>
										<div className="text-xs text-gray-600">
											Impacto Presupuesto
										</div>
										<div
											className={`font-medium ${change.budgetImpact >= 0 ? "text-red-600" : "text-green-600"}`}
										>
											{change.budgetImpact >= 0 ? "+" : ""}$
											{change.budgetImpact.toLocaleString()}
										</div>
									</div>
									<div>
										<div className="text-xs text-gray-600">
											Impacto Cronograma
										</div>
										<div
											className={`font-medium ${change.scheduleImpact >= 0 ? "text-red-600" : "text-green-600"}`}
										>
											{change.scheduleImpact >= 0 ? "+" : ""}
											{change.scheduleImpact} días
										</div>
									</div>
								</div>

								<div className="flex gap-2">
									<button
										onClick={() => onApproveChange(change.id)}
										className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
									>
										Aprobar
									</button>
									<button
										onClick={() => onRejectChange(change.id)}
										className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
									>
										Rechazar
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			<div>
				<h4 className="font-medium text-gray-900 mb-3">Cambios Recientes</h4>
				<div className="space-y-2">
					{recentChanges.map((change) => (
						<div
							key={change.id}
							className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
						>
							<div className="flex-1">
								<div className="font-medium text-gray-900 text-sm">
									{change.title}
								</div>
								<div className="text-xs text-gray-600">
									{change.requestedBy} •{" "}
									{change.requestedAt.toLocaleDateString("es-EC")}
								</div>
							</div>
							<div className="text-right">
								<Badge
									variant={
										change.status === "approved"
											? "success"
											: change.status === "rejected"
												? "error"
												: change.status === "implemented"
													? "success"
													: "warning"
									}
								>
									{change.status.replace("_", " ").toUpperCase()}
								</Badge>
								<div className="text-xs text-gray-600 mt-1">
									${Math.abs(change.budgetImpact).toLocaleString()}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

const BudgetScheduleWorkspace: React.FC = () => {
	const {projectId} = useParams<{projectId: string}>();
	const {
		project,
		conflicts,
		changeOrders,
		loadIntegratedProject,
		forceSync,
		resolveConflict,
		ignoreConflict,
		approveChangeOrder,
		rejectChangeOrder,
		isLoading,
	} = useBudgetScheduleIntegration();

	const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
	const [showConflicts, setShowConflicts] = useState(true);

	useEffect(() => {
		if (projectId) {
			loadIntegratedProject(projectId);
		}
	}, [projectId, loadIntegratedProject]);

	// Auto-sync every 30 seconds if enabled
	useEffect(() => {
		if (!autoSyncEnabled || !projectId) return;

		const interval = setInterval(() => {
			forceSync(projectId);
		}, 30000);

		return () => clearInterval(interval);
	}, [autoSyncEnabled, projectId, forceSync]);

	const handleForceSync = () => {
		if (projectId) {
			forceSync(projectId);
		}
	};

	const handleCreateChangeOrder = () => {
		// Navigate to change order creation
		console.log("Create change order");
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<LoadingSpinner size="lg" className="mx-auto mb-4" />
					<p className="text-gray-600">Cargando workspace integrado...</p>
				</div>
			</div>
		);
	}

	if (!project) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<ExclamationTriangleIcon className="h-12 w-12 text-red-600 mx-auto mb-4" />
					<p className="text-gray-600">No se pudo cargar el proyecto</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white border-b border-gray-200 p-6">
				<div className="flex items-center justify-between mb-4">
					<div className="flex items-center gap-4">
						<div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-600 rounded-xl flex items-center justify-center">
							<LinkIcon className="h-6 w-6 text-white" />
						</div>
						<div>
							<h1 className="text-2xl font-bold text-gray-900">
								{project.name}
							</h1>
							<p className="text-gray-600">
								Workspace Integrado Presupuesto-Cronograma
							</p>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<div className="flex items-center gap-2">
							<span className="text-sm text-gray-600">Auto-sync</span>
							<button
								onClick={() => setAutoSyncEnabled(!autoSyncEnabled)}
								className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
									autoSyncEnabled ? "bg-blue-600" : "bg-gray-200"
								}`}
							>
								<span
									className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
										autoSyncEnabled ? "translate-x-6" : "translate-x-1"
									}`}
								/>
							</button>
						</div>

						<SyncStatusIndicator
							status={project.integration.syncStatus}
							lastSync={project.integration.lastSync}
							onForceSync={handleForceSync}
						/>
					</div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto p-6 space-y-8">
				{/* KPI Panel */}
				<IntegratedKPIPanel project={project} />

				{/* Conflicts Section */}
				{conflicts.length > 0 && showConflicts && (
					<div className="bg-white rounded-xl border border-gray-200 p-6">
						<ConflictResolutionPanel
							conflicts={conflicts}
							onResolveConflict={resolveConflict}
							onIgnoreConflict={ignoreConflict}
						/>
					</div>
				)}

				{/* Change Orders */}
				<ChangeOrderTracker
					changeOrders={changeOrders}
					onApproveChange={approveChangeOrder}
					onRejectChange={rejectChangeOrder}
					onCreateChange={handleCreateChangeOrder}
				/>

				{/* Integration Health */}
				<div className="bg-white rounded-xl border border-gray-200 p-6">
					<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
						<AdjustmentsHorizontalIcon className="h-5 w-5 text-blue-600" />
						Estado de la Integración
					</h3>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="text-center">
							<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
								<BeakerIcon className="h-8 w-8 text-blue-600" />
							</div>
							<h4 className="font-medium text-gray-900 mb-1">Cálculos</h4>
							<p className="text-sm text-gray-600">Conectado y actualizado</p>
						</div>

						<div className="text-center">
							<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
								<CurrencyDollarIcon className="h-8 w-8 text-green-600" />
							</div>
							<h4 className="font-medium text-gray-900 mb-1">Presupuesto</h4>
							<p className="text-sm text-gray-600">
								Sincronizado en tiempo real
							</p>
						</div>

						<div className="text-center">
							<div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
								<CalendarDaysIcon className="h-8 w-8 text-purple-600" />
							</div>
							<h4 className="font-medium text-gray-900 mb-1">Cronograma</h4>
							<p className="text-sm text-gray-600">Actualización automática</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BudgetScheduleWorkspace;
