// src/ui/pages/system/SystemHealthMonitor.tsx
import React, {useState, useEffect, useCallback} from "react";
import {
	HeartIcon,
	ExclamationTriangleIcon,
	CheckCircleIcon,
	XCircleIcon,
	ClockIcon,
	ChartBarIcon,
	CpuChipIcon,
	ServerIcon,
	CloudIcon,
	BugAntIcon,
	ArrowPathIcon,
	EyeIcon,
	CogIcon,
	BellIcon,
	ShieldCheckIcon,
	DatabaseIcon,
	GlobeAltIcon,
	DevicePhoneMobileIcon,
	DocumentTextIcon,
	CurrencyDollarIcon,
	CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import {
	LoadingSpinner,
	Badge,
	ProgressBar,
	Alert,
} from "../shared/components/SharedComponents";

interface SystemHealth {
	overall: "healthy" | "warning" | "critical" | "degraded";
	score: number; // 0-100
	lastCheck: Date;
	modules: ModuleHealth[];
	performance: PerformanceMetrics;
	security: SecurityStatus;
	infrastructure: InfrastructureStatus;
	integration: IntegrationStatus;
	alerts: SystemAlert[];
	recommendations: SystemRecommendation[];
}

interface ModuleHealth {
	name: string;
	id:
		| "calculations"
		| "budget"
		| "schedule"
		| "mobile"
		| "integration"
		| "exports"
		| "auth";
	status: "healthy" | "warning" | "critical" | "offline";
	uptime: number; // percentage
	responseTime: number; // ms
	errorRate: number; // percentage
	lastError?: Date;
	metrics: {
		requests: number;
		errors: number;
		avgResponseTime: number;
		peakLoad: number;
	};
	dependencies: string[];
}

interface PerformanceMetrics {
	overallScore: number;
	frontendMetrics: {
		loadTime: number;
		fcp: number; // First Contentful Paint
		lcp: number; // Largest Contentful Paint
		cls: number; // Cumulative Layout Shift
		fid: number; // First Input Delay
	};
	backendMetrics: {
		avgResponseTime: number;
		peakResponseTime: number;
		throughput: number; // requests per second
		errorRate: number;
	};
	databaseMetrics: {
		queryTime: number;
		connectionPool: number;
		slowQueries: number;
	};
	resourceUsage: {
		cpu: number;
		memory: number;
		disk: number;
		network: number;
	};
}

interface SecurityStatus {
	overall: "secure" | "at_risk" | "vulnerable";
	lastScan: Date;
	vulnerabilities: {
		critical: number;
		high: number;
		medium: number;
		low: number;
	};
	authentication: {
		failedLogins: number;
		suspiciousActivity: number;
		mfaAdoption: number;
	};
	dataProtection: {
		encryption: boolean;
		backups: boolean;
		gdprCompliant: boolean;
	};
}

interface InfrastructureStatus {
	servers: ServerStatus[];
	database: {
		status: "healthy" | "warning" | "critical";
		connections: number;
		replication: boolean;
		backupStatus: "current" | "outdated" | "failed";
	};
	cdn: {
		status: "healthy" | "warning" | "critical";
		cacheHitRate: number;
		bandwidth: number;
	};
	monitoring: {
		uptime: number;
		alertsActive: number;
	};
}

interface ServerStatus {
	id: string;
	name: string;
	region: string;
	status: "online" | "warning" | "offline";
	cpu: number;
	memory: number;
	disk: number;
	uptime: number;
}

interface IntegrationStatus {
	totalIntegrations: number;
	healthyIntegrations: number;
	failedIntegrations: number;
	integrations: Integration[];
	syncHealth: {
		calculationsBudget: "synced" | "partial" | "failed";
		budgetSchedule: "synced" | "partial" | "failed";
		mobileDesktop: "synced" | "partial" | "failed";
		externalApis: "synced" | "partial" | "failed";
	};
}

interface Integration {
	id: string;
	name: string;
	type: "internal" | "external" | "api" | "database";
	status: "healthy" | "warning" | "failed";
	lastSync: Date;
	syncFrequency: number;
	errorCount: number;
}

interface SystemAlert {
	id: string;
	type:
		| "performance"
		| "security"
		| "integration"
		| "infrastructure"
		| "business";
	severity: "info" | "warning" | "critical" | "emergency";
	title: string;
	description: string;
	module?: string;
	timestamp: Date;
	acknowledged: boolean;
	resolved: boolean;
	actions: AlertAction[];
}

interface AlertAction {
	id: string;
	label: string;
	type: "investigate" | "fix" | "escalate" | "ignore";
	automated: boolean;
}

interface SystemRecommendation {
	id: string;
	category: "performance" | "security" | "usability" | "cost" | "scalability";
	priority: "low" | "medium" | "high" | "critical";
	title: string;
	description: string;
	impact: string;
	effort: "low" | "medium" | "high";
	roi: number;
	status: "new" | "planned" | "in_progress" | "completed" | "dismissed";
}

// Custom Hook
const useSystemHealth = () => {
	const [healthData, setHealthData] = useState<SystemHealth | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [autoRefresh, setAutoRefresh] = useState(true);
	const [refreshInterval, setRefreshInterval] = useState(30); // seconds

	const fetchHealthData = useCallback(async () => {
		try {
			// Simulate API call - in real implementation, this would fetch from multiple endpoints
			await new Promise((resolve) => setTimeout(resolve, 1000));

			const mockHealthData: SystemHealth = {
				overall: "healthy",
				score: 94,
				lastCheck: new Date(),
				modules: [
					{
						name: "Cálculos Técnicos",
						id: "calculations",
						status: "healthy",
						uptime: 99.8,
						responseTime: 145,
						errorRate: 0.02,
						metrics: {
							requests: 1542,
							errors: 3,
							avgResponseTime: 145,
							peakLoad: 89,
						},
						dependencies: ["database", "cache"],
					},
					{
						name: "Presupuestos",
						id: "budget",
						status: "healthy",
						uptime: 99.9,
						responseTime: 98,
						errorRate: 0.01,
						metrics: {
							requests: 987,
							errors: 1,
							avgResponseTime: 98,
							peakLoad: 67,
						},
						dependencies: ["calculations", "database", "pricing_api"],
					},
					{
						name: "Cronogramas",
						id: "schedule",
						status: "warning",
						uptime: 98.5,
						responseTime: 234,
						errorRate: 0.08,
						lastError: new Date(Date.now() - 3600000),
						metrics: {
							requests: 743,
							errors: 6,
							avgResponseTime: 234,
							peakLoad: 92,
						},
						dependencies: ["budget", "resource_optimizer", "weather_api"],
					},
					{
						name: "Aplicación Móvil",
						id: "mobile",
						status: "healthy",
						uptime: 99.7,
						responseTime: 189,
						errorRate: 0.03,
						metrics: {
							requests: 2341,
							errors: 7,
							avgResponseTime: 189,
							peakLoad: 78,
						},
						dependencies: ["sync_service", "offline_storage"],
					},
					{
						name: "Integración",
						id: "integration",
						status: "healthy",
						uptime: 99.6,
						responseTime: 156,
						errorRate: 0.04,
						metrics: {
							requests: 1876,
							errors: 8,
							avgResponseTime: 156,
							peakLoad: 84,
						},
						dependencies: ["message_queue", "event_bus"],
					},
					{
						name: "Exportaciones",
						id: "exports",
						status: "healthy",
						uptime: 99.4,
						responseTime: 1240,
						errorRate: 0.05,
						metrics: {
							requests: 234,
							errors: 1,
							avgResponseTime: 1240,
							peakLoad: 45,
						},
						dependencies: ["file_storage", "pdf_service"],
					},
				],
				performance: {
					overallScore: 91,
					frontendMetrics: {
						loadTime: 1.8,
						fcp: 1.2,
						lcp: 2.1,
						cls: 0.05,
						fid: 12,
					},
					backendMetrics: {
						avgResponseTime: 167,
						peakResponseTime: 1240,
						throughput: 45.7,
						errorRate: 0.034,
					},
					databaseMetrics: {
						queryTime: 23,
						connectionPool: 75,
						slowQueries: 2,
					},
					resourceUsage: {
						cpu: 34,
						memory: 68,
						disk: 45,
						network: 23,
					},
				},
				security: {
					overall: "secure",
					lastScan: new Date(Date.now() - 86400000),
					vulnerabilities: {
						critical: 0,
						high: 1,
						medium: 3,
						low: 8,
					},
					authentication: {
						failedLogins: 12,
						suspiciousActivity: 2,
						mfaAdoption: 78,
					},
					dataProtection: {
						encryption: true,
						backups: true,
						gdprCompliant: true,
					},
				},
				infrastructure: {
					servers: [
						{
							id: "web-01",
							name: "Web Server 01",
							region: "us-east-1",
							status: "online",
							cpu: 45,
							memory: 72,
							disk: 38,
							uptime: 99.8,
						},
						{
							id: "api-01",
							name: "API Server 01",
							region: "us-east-1",
							status: "online",
							cpu: 62,
							memory: 81,
							disk: 34,
							uptime: 99.9,
						},
					],
					database: {
						status: "healthy",
						connections: 45,
						replication: true,
						backupStatus: "current",
					},
					cdn: {
						status: "healthy",
						cacheHitRate: 94.2,
						bandwidth: 1240,
					},
					monitoring: {
						uptime: 99.7,
						alertsActive: 3,
					},
				},
				integration: {
					totalIntegrations: 12,
					healthyIntegrations: 10,
					failedIntegrations: 1,
					integrations: [
						{
							id: "ipco-pricing",
							name: "IPCO Pricing API",
							type: "external",
							status: "healthy",
							lastSync: new Date(Date.now() - 1800000),
							syncFrequency: 3600,
							errorCount: 0,
						},
						{
							id: "weather-service",
							name: "Weather Service",
							type: "external",
							status: "warning",
							lastSync: new Date(Date.now() - 7200000),
							syncFrequency: 3600,
							errorCount: 3,
						},
						{
							id: "mobile-sync",
							name: "Mobile Sync Service",
							type: "internal",
							status: "healthy",
							lastSync: new Date(Date.now() - 300000),
							syncFrequency: 300,
							errorCount: 0,
						},
					],
					syncHealth: {
						calculationsBudget: "synced",
						budgetSchedule: "synced",
						mobileDesktop: "synced",
						externalApis: "partial",
					},
				},
				alerts: [
					{
						id: "alert-1",
						type: "performance",
						severity: "warning",
						title: "Tiempo de respuesta elevado en módulo Schedule",
						description:
							"El módulo de cronogramas está respondiendo un 40% más lento de lo normal",
						module: "schedule",
						timestamp: new Date(Date.now() - 3600000),
						acknowledged: false,
						resolved: false,
						actions: [
							{
								id: "action-1",
								label: "Investigar causa",
								type: "investigate",
								automated: false,
							},
							{
								id: "action-2",
								label: "Reiniciar servicio",
								type: "fix",
								automated: true,
							},
						],
					},
					{
						id: "alert-2",
						type: "integration",
						severity: "warning",
						title: "Weather API intermitente",
						description:
							"La integración con el servicio meteorológico está fallando intermitentemente",
						timestamp: new Date(Date.now() - 7200000),
						acknowledged: true,
						resolved: false,
						actions: [
							{
								id: "action-3",
								label: "Verificar credenciales API",
								type: "investigate",
								automated: false,
							},
						],
					},
					{
						id: "alert-3",
						type: "security",
						severity: "info",
						title: "Escaneo de seguridad completado",
						description:
							"Se encontraron 12 vulnerabilidades menores que requieren revisión",
						timestamp: new Date(Date.now() - 86400000),
						acknowledged: true,
						resolved: false,
						actions: [],
					},
				],
				recommendations: [
					{
						id: "rec-1",
						category: "performance",
						priority: "high",
						title: "Optimizar consultas de cronograma",
						description:
							"Implementar caché para consultas complejas de cronograma para reducir tiempo de respuesta",
						impact:
							"Reducción del 60% en tiempo de respuesta del módulo Schedule",
						effort: "medium",
						roi: 8.5,
						status: "new",
					},
					{
						id: "rec-2",
						category: "scalability",
						priority: "medium",
						title: "Implementar auto-scaling",
						description:
							"Configurar escalado automático para manejo de picos de carga",
						impact: "Mejor manejo de cargas variables y reducción de costos",
						effort: "high",
						roi: 6.2,
						status: "planned",
					},
					{
						id: "rec-3",
						category: "usability",
						priority: "medium",
						title: "Mejorar notificaciones móviles",
						description:
							"Implementar notificaciones push más contextuales para la app móvil",
						impact: "Aumento del 25% en participación de usuarios móviles",
						effort: "low",
						roi: 4.8,
						status: "in_progress",
					},
				],
			};

			setHealthData(mockHealthData);
		} catch (error) {
			console.error("Error fetching health data:", error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const acknowledgeAlert = async (alertId: string) => {
		if (!healthData) return;

		setHealthData({
			...healthData,
			alerts: healthData.alerts.map((alert) =>
				alert.id === alertId ? {...alert, acknowledged: true} : alert
			),
		});
	};

	const executeAction = async (alertId: string, actionId: string) => {
		console.log(`Executing action ${actionId} for alert ${alertId}`);
		// Simulate action execution
		await new Promise((resolve) => setTimeout(resolve, 1000));
	};

	const updateRecommendationStatus = async (
		recId: string,
		status: SystemRecommendation["status"]
	) => {
		if (!healthData) return;

		setHealthData({
			...healthData,
			recommendations: healthData.recommendations.map((rec) =>
				rec.id === recId ? {...rec, status} : rec
			),
		});
	};

	// Auto refresh effect
	useEffect(() => {
		fetchHealthData();

		if (autoRefresh) {
			const interval = setInterval(fetchHealthData, refreshInterval * 1000);
			return () => clearInterval(interval);
		}
	}, [fetchHealthData, autoRefresh, refreshInterval]);

	return {
		healthData,
		isLoading,
		autoRefresh,
		setAutoRefresh,
		refreshInterval,
		setRefreshInterval,
		fetchHealthData,
		acknowledgeAlert,
		executeAction,
		updateRecommendationStatus,
	};
};

// Components
const HealthOverview: React.FC<{health: SystemHealth}> = ({health}) => {
	const getOverallStatusColor = (status: string) => {
		switch (status) {
			case "healthy":
				return "text-green-600 bg-green-50";
			case "warning":
				return "text-yellow-600 bg-yellow-50";
			case "critical":
				return "text-red-600 bg-red-50";
			case "degraded":
				return "text-orange-600 bg-orange-50";
			default:
				return "text-gray-600 bg-gray-50";
		}
	};

	const getOverallIcon = (status: string) => {
		switch (status) {
			case "healthy":
				return CheckCircleIcon;
			case "warning":
				return ExclamationTriangleIcon;
			case "critical":
				return XCircleIcon;
			case "degraded":
				return ClockIcon;
			default:
				return HeartIcon;
		}
	};

	const OverallIcon = getOverallIcon(health.overall);

	return (
		<div
			className={`rounded-2xl border-2 p-6 ${getOverallStatusColor(health.overall)} border-current`}
		>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<div className="w-16 h-16 rounded-full bg-white/50 flex items-center justify-center">
						<OverallIcon className="h-8 w-8" />
					</div>
					<div>
						<h2 className="text-2xl font-bold capitalize">{health.overall}</h2>
						<p className="opacity-90">Sistema General</p>
					</div>
				</div>

				<div className="text-right">
					<div className="text-4xl font-bold">{health.score}</div>
					<div className="text-sm opacity-90">Health Score</div>
				</div>
			</div>

			<div className="mt-4 pt-4 border-t border-current/20">
				<div className="text-sm opacity-90">
					Última verificación: {health.lastCheck.toLocaleTimeString()}
				</div>
			</div>
		</div>
	);
};

const ModuleStatusGrid: React.FC<{
	modules: ModuleHealth[];
	onViewDetails: (module: ModuleHealth) => void;
}> = ({modules, onViewDetails}) => {
	const getModuleIcon = (id: string) => {
		switch (id) {
			case "calculations":
				return CpuChipIcon;
			case "budget":
				return CurrencyDollarIcon;
			case "schedule":
				return CalendarDaysIcon;
			case "mobile":
				return DevicePhoneMobileIcon;
			case "integration":
				return GlobeAltIcon;
			case "exports":
				return DocumentTextIcon;
			default:
				return ServerIcon;
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "healthy":
				return "bg-green-100 text-green-800 border-green-200";
			case "warning":
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
			case "critical":
				return "bg-red-100 text-red-800 border-red-200";
			case "offline":
				return "bg-gray-100 text-gray-800 border-gray-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{modules.map((module) => {
				const ModuleIcon = getModuleIcon(module.id);

				return (
					<div
						key={module.id}
						className="bg-white rounded-xl border border-gray-200 p-4"
					>
						<div className="flex items-center justify-between mb-3">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
									<ModuleIcon className="h-5 w-5 text-blue-600" />
								</div>
								<div>
									<h3 className="font-medium text-gray-900">{module.name}</h3>
									<div
										className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(module.status)}`}
									>
										{module.status}
									</div>
								</div>
							</div>

							<button
								onClick={() => onViewDetails(module)}
								className="text-gray-400 hover:text-gray-600"
							>
								<EyeIcon className="h-4 w-4" />
							</button>
						</div>

						<div className="space-y-2">
							<div className="flex justify-between text-sm">
								<span className="text-gray-600">Uptime</span>
								<span className="font-medium">{module.uptime}%</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-gray-600">Response Time</span>
								<span className="font-medium">{module.responseTime}ms</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-gray-600">Error Rate</span>
								<span className="font-medium">{module.errorRate}%</span>
							</div>
						</div>

						{module.lastError && (
							<div className="mt-3 p-2 bg-red-50 rounded-lg">
								<div className="text-xs text-red-600">
									Último error: {module.lastError.toLocaleString()}
								</div>
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
};

const AlertsPanel: React.FC<{
	alerts: SystemAlert[];
	onAcknowledge: (alertId: string) => void;
	onExecuteAction: (alertId: string, actionId: string) => void;
}> = ({alerts, onAcknowledge, onExecuteAction}) => {
	const unacknowledgedAlerts = alerts.filter((alert) => !alert.acknowledged);

	const getSeverityColor = (severity: string) => {
		switch (severity) {
			case "emergency":
				return "bg-red-100 text-red-800 border-red-200";
			case "critical":
				return "bg-red-100 text-red-800 border-red-200";
			case "warning":
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
			case "info":
				return "bg-blue-100 text-blue-800 border-blue-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	return (
		<div className="bg-white rounded-xl border border-gray-200 p-6">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
					<BellIcon className="h-5 w-5 text-blue-600" />
					Alertas del Sistema
				</h3>
				{unacknowledgedAlerts.length > 0 && (
					<Badge variant="danger">{unacknowledgedAlerts.length} nuevas</Badge>
				)}
			</div>

			<div className="space-y-3">
				{alerts.slice(0, 5).map((alert) => (
					<div
						key={alert.id}
						className={`p-4 rounded-lg border ${alert.acknowledged ? "opacity-60" : ""}`}
					>
						<div className="flex items-start justify-between mb-2">
							<div className="flex-1">
								<div className="flex items-center gap-2 mb-1">
									<span
										className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(alert.severity)}`}
									>
										{alert.severity}
									</span>
									{alert.module && (
										<span className="text-xs text-gray-500">
											{alert.module}
										</span>
									)}
								</div>
								<h4 className="font-medium text-gray-900">{alert.title}</h4>
								<p className="text-sm text-gray-600">{alert.description}</p>
								<div className="text-xs text-gray-500 mt-1">
									{alert.timestamp.toLocaleString()}
								</div>
							</div>

							{!alert.acknowledged && (
								<button
									onClick={() => onAcknowledge(alert.id)}
									className="ml-3 px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700"
								>
									Reconocer
								</button>
							)}
						</div>

						{alert.actions.length > 0 && (
							<div className="flex gap-2 mt-3">
								{alert.actions.map((action) => (
									<button
										key={action.id}
										onClick={() => onExecuteAction(alert.id, action.id)}
										className={`px-3 py-1 text-xs rounded-lg border ${
											action.automated
												? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
												: "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
										}`}
									>
										{action.label}
										{action.automated && " (Auto)"}
									</button>
								))}
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

const RecommendationsPanel: React.FC<{
	recommendations: SystemRecommendation[];
	onUpdateStatus: (
		recId: string,
		status: SystemRecommendation["status"]
	) => void;
}> = ({recommendations, onUpdateStatus}) => {
	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case "critical":
				return "bg-red-100 text-red-800";
			case "high":
				return "bg-orange-100 text-orange-800";
			case "medium":
				return "bg-yellow-100 text-yellow-800";
			case "low":
				return "bg-green-100 text-green-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	return (
		<div className="bg-white rounded-xl border border-gray-200 p-6">
			<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
				<CogIcon className="h-5 w-5 text-blue-600" />
				Recomendaciones del Sistema
			</h3>

			<div className="space-y-4">
				{recommendations
					.filter((rec) => rec.status !== "dismissed")
					.slice(0, 5)
					.map((rec) => (
						<div key={rec.id} className="p-4 bg-gray-50 rounded-lg">
							<div className="flex items-start justify-between mb-2">
								<div className="flex-1">
									<div className="flex items-center gap-2 mb-2">
										<Badge
											variant="outline"
											className={getPriorityColor(rec.priority)}
										>
											{rec.priority}
										</Badge>
										<Badge variant="secondary">{rec.category}</Badge>
										<Badge
											variant={
												rec.status === "completed"
													? "success"
													: rec.status === "in_progress"
														? "primary"
														: rec.status === "planned"
															? "warning"
															: "secondary"
											}
										>
											{rec.status.replace("_", " ")}
										</Badge>
									</div>
									<h4 className="font-medium text-gray-900">{rec.title}</h4>
									<p className="text-sm text-gray-600 mb-2">
										{rec.description}
									</p>
									<div className="text-sm text-green-600 font-medium mb-1">
										Impacto: {rec.impact}
									</div>
									<div className="flex items-center gap-4 text-xs text-gray-500">
										<span>Esfuerzo: {rec.effort}</span>
										<span>ROI: {rec.roi}x</span>
									</div>
								</div>
							</div>

							{rec.status === "new" && (
								<div className="flex gap-2 mt-3">
									<button
										onClick={() => onUpdateStatus(rec.id, "planned")}
										className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700"
									>
										Planificar
									</button>
									<button
										onClick={() => onUpdateStatus(rec.id, "dismissed")}
										className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-lg hover:bg-gray-300"
									>
										Descartar
									</button>
								</div>
							)}
						</div>
					))}
			</div>
		</div>
	);
};

// Main Component
const SystemHealthMonitor: React.FC = () => {
	const {
		healthData,
		isLoading,
		autoRefresh,
		setAutoRefresh,
		refreshInterval,
		setRefreshInterval,
		fetchHealthData,
		acknowledgeAlert,
		executeAction,
		updateRecommendationStatus,
	} = useSystemHealth();

	const [selectedModule, setSelectedModule] = useState<ModuleHealth | null>(
		null
	);
	const [showModuleDetails, setShowModuleDetails] = useState(false);

	const handleViewModuleDetails = (module: ModuleHealth) => {
		setSelectedModule(module);
		setShowModuleDetails(true);
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<LoadingSpinner />
			</div>
		);
	}

	if (!healthData) {
		return (
			<div className="text-center py-12">
				<p className="text-gray-500">
					No se pudo cargar la información del sistema
				</p>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto p-6">
			{/* Header */}
			<div className="flex items-center justify-between mb-8">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">
						Monitor de Salud del Sistema
					</h1>
					<p className="text-gray-600 mt-1">
						Estado general del sistema integrado Budget-Schedule
					</p>
				</div>

				<div className="flex items-center gap-4">
					<div className="flex items-center gap-2">
						<label className="text-sm text-gray-600">Auto-actualizar</label>
						<button
							onClick={() => setAutoRefresh(!autoRefresh)}
							className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
								autoRefresh ? "bg-blue-600" : "bg-gray-200"
							}`}
						>
							<span
								className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
									autoRefresh ? "translate-x-6" : "translate-x-1"
								}`}
							/>
						</button>
					</div>

					<button
						onClick={fetchHealthData}
						className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
					>
						<ArrowPathIcon className="h-4 w-4" />
						Actualizar
					</button>
				</div>
			</div>

			{/* Health Overview */}
			<div className="mb-8">
				<HealthOverview health={healthData} />
			</div>

			{/* Performance Metrics */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
				<div className="bg-white rounded-xl border border-gray-200 p-4">
					<div className="flex items-center gap-3 mb-2">
						<ChartBarIcon className="h-5 w-5 text-blue-600" />
						<span className="text-sm font-medium text-gray-600">
							Performance
						</span>
					</div>
					<div className="text-2xl font-bold text-gray-900">
						{healthData.performance.overallScore}
					</div>
					<div className="text-sm text-gray-500">Overall Score</div>
				</div>

				<div className="bg-white rounded-xl border border-gray-200 p-4">
					<div className="flex items-center gap-3 mb-2">
						<ServerIcon className="h-5 w-5 text-green-600" />
						<span className="text-sm font-medium text-gray-600">Uptime</span>
					</div>
					<div className="text-2xl font-bold text-gray-900">
						{healthData.infrastructure.monitoring.uptime}%
					</div>
					<div className="text-sm text-gray-500">Sistema General</div>
				</div>

				<div className="bg-white rounded-xl border border-gray-200 p-4">
					<div className="flex items-center gap-3 mb-2">
						<ShieldCheckIcon className="h-5 w-5 text-purple-600" />
						<span className="text-sm font-medium text-gray-600">Seguridad</span>
					</div>
					<div className="text-2xl font-bold text-gray-900 capitalize">
						{healthData.security.overall}
					</div>
					<div className="text-sm text-gray-500">Estado General</div>
				</div>

				<div className="bg-white rounded-xl border border-gray-200 p-4">
					<div className="flex items-center gap-3 mb-2">
						<GlobeAltIcon className="h-5 w-5 text-orange-600" />
						<span className="text-sm font-medium text-gray-600">
							Integraciones
						</span>
					</div>
					<div className="text-2xl font-bold text-gray-900">
						{healthData.integration.healthyIntegrations}/
						{healthData.integration.totalIntegrations}
					</div>
					<div className="text-sm text-gray-500">Saludables</div>
				</div>
			</div>

			{/* Module Status */}
			<div className="mb-8">
				<h2 className="text-lg font-semibold text-gray-900 mb-4">
					Estado de Módulos
				</h2>
				<ModuleStatusGrid
					modules={healthData.modules}
					onViewDetails={handleViewModuleDetails}
				/>
			</div>

			{/* Alerts and Recommendations */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<AlertsPanel
					alerts={healthData.alerts}
					onAcknowledge={acknowledgeAlert}
					onExecuteAction={executeAction}
				/>

				<RecommendationsPanel
					recommendations={healthData.recommendations}
					onUpdateStatus={updateRecommendationStatus}
				/>
			</div>
		</div>
	);
};

export default SystemHealthMonitor;
