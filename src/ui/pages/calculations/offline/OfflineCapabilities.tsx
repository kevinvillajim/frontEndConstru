// src/ui/pages/calculations/offline/OfflineCapabilities.tsx
import React, {useState, useEffect, useCallback} from "react";
import {
	WifiIcon,
	SignalSlashIcon,
	CloudArrowUpIcon,
	CloudArrowDownIcon,
	ExclamationTriangleIcon,
	CheckCircleIcon,
	ClockIcon,
	ArrowPathIcon,
	TrashIcon,
	EyeIcon,
	CogIcon,
	ServerIcon,
	DevicePhoneMobileIcon,
	ComputerDesktopIcon,
	DocumentTextIcon,
	PhotoIcon,
	ArrowUpTrayIcon,
    BuildingOfficeIcon,
    DocumentChartBarIcon,
} from "@heroicons/react/24/outline";
import {
	LoadingSpinner,
	Badge,
	ProgressBar,
} from "../shared/components/SharedComponents";

// Types
interface OfflineAction {
	id: string;
	type: "create" | "update" | "delete" | "upload";
	entity:
		| "project"
		| "calculation"
		| "budget"
		| "schedule"
		| "document"
		| "progress";
	entityId: string;
	entityName: string;
	data: any;
	timestamp: Date;
	status: "pending" | "syncing" | "synced" | "failed" | "conflict";
	priority: "high" | "medium" | "low";
	retryCount: number;
	maxRetries: number;
	errorMessage?: string;
	conflictData?: any;
	size?: number;
}

interface OfflineStorage {
	totalSize: number;
	usedSize: number;
	availableSize: number;
	items: OfflineStorageItem[];
	lastCleanup: Date;
	autoCleanup: boolean;
	maxAge: number; // days
}

interface OfflineStorageItem {
	id: string;
	type: "calculation" | "project" | "template" | "media" | "document";
	name: string;
	size: number;
	lastAccessed: Date;
	isEssential: boolean;
	canDelete: boolean;
	syncStatus: "synced" | "pending" | "local_only";
}

interface SyncSettings {
	autoSync: boolean;
	syncInterval: number; // minutes
	wifiOnly: boolean;
	backgroundSync: boolean;
	conflictResolution: "manual" | "server_wins" | "client_wins" | "merge";
	maxRetries: number;
	retryInterval: number; // seconds
	compressionEnabled: boolean;
}

interface NetworkStatus {
	isOnline: boolean;
	connectionType: "wifi" | "cellular" | "ethernet" | "unknown";
	effectiveType: "slow-2g" | "2g" | "3g" | "4g" | "unknown";
	downlink: number; // Mbps
	rtt: number; // ms
	isReliable: boolean;
}

interface ConflictResolution {
	actionId: string;
	serverData: any;
	clientData: any;
	suggestions: string[];
	resolution?: "keep_server" | "keep_client" | "merge" | "manual";
	mergedData?: any;
}

// Custom Hook
const useOfflineCapabilities = () => {
	const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
		isOnline: navigator.onLine,
		connectionType: "unknown",
		effectiveType: "unknown",
		downlink: 0,
		rtt: 0,
		isReliable: true,
	});

	const [pendingActions, setPendingActions] = useState<OfflineAction[]>([]);
	const [offlineStorage, setOfflineStorage] = useState<OfflineStorage>({
		totalSize: 0,
		usedSize: 0,
		availableSize: 0,
		items: [],
		lastCleanup: new Date(),
		autoCleanup: true,
		maxAge: 7,
	});

	const [syncSettings, setSyncSettings] = useState<SyncSettings>({
		autoSync: true,
		syncInterval: 5,
		wifiOnly: false,
		backgroundSync: true,
		conflictResolution: "manual",
		maxRetries: 3,
		retryInterval: 30,
		compressionEnabled: true,
	});

	const [conflicts, setConflicts] = useState<ConflictResolution[]>([]);
	const [isSyncing, setIsSyncing] = useState(false);
	const [syncProgress, setSyncProgress] = useState(0);

	// Network monitoring
	useEffect(() => {
		const updateNetworkStatus = () => {
			const connection =
				(navigator as any).connection ||
				(navigator as any).mozConnection ||
				(navigator as any).webkitConnection;

			setNetworkStatus({
				isOnline: navigator.onLine,
				connectionType: connection?.type || "unknown",
				effectiveType: connection?.effectiveType || "unknown",
				downlink: connection?.downlink || 0,
				rtt: connection?.rtt || 0,
				isReliable:
					navigator.onLine &&
					(!connection || connection.effectiveType !== "slow-2g"),
			});
		};

		const handleOnline = () => updateNetworkStatus();
		const handleOffline = () => updateNetworkStatus();

		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);

		// Initial check
		updateNetworkStatus();

		return () => {
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
		};
	}, []);

	// Load initial data
	useEffect(() => {
		loadOfflineData();
	}, []);

	// Auto-sync when coming online
	useEffect(() => {
		if (
			networkStatus.isOnline &&
			syncSettings.autoSync &&
			pendingActions.length > 0
		) {
			syncPendingActions();
		}
	}, [networkStatus.isOnline]);

	const loadOfflineData = async () => {
		try {
			// Simulate loading offline data
			const mockActions: OfflineAction[] = [
				{
					id: "1",
					type: "update",
					entity: "progress",
					entityId: "prog-1",
					entityName: "Avance estructura nivel 2",
					data: {
						progress: 85,
						notes: "Completadas 15 columnas de 18",
						images: ["img1.jpg"],
					},
					timestamp: new Date(2024, 5, 13, 14, 30),
					status: "pending",
					priority: "high",
					retryCount: 0,
					maxRetries: 3,
					size: 1024000, // 1MB
				},
				{
					id: "2",
					type: "create",
					entity: "calculation",
					entityId: "calc-new-1",
					entityName: "Cálculo vigas nivel 3",
					data: {type: "structural", parameters: {span: 6, load: 500}},
					timestamp: new Date(2024, 5, 13, 10, 15),
					status: "failed",
					priority: "medium",
					retryCount: 2,
					maxRetries: 3,
					errorMessage: "Error de conectividad",
					size: 256000, // 256KB
				},
			];

			const mockStorage: OfflineStorage = {
				totalSize: 50000000, // 50MB
				usedSize: 12500000, // 12.5MB
				availableSize: 37500000, // 37.5MB
				items: [
					{
						id: "1",
						type: "project",
						name: "Edificio Plaza Norte",
						size: 5000000,
						lastAccessed: new Date(),
						isEssential: true,
						canDelete: false,
						syncStatus: "synced",
					},
					{
						id: "2",
						type: "template",
						name: "Plantillas NEC",
						size: 2500000,
						lastAccessed: new Date(2024, 5, 10),
						isEssential: true,
						canDelete: false,
						syncStatus: "synced",
					},
					{
						id: "3",
						type: "media",
						name: "Fotos de progreso",
						size: 4000000,
						lastAccessed: new Date(2024, 5, 12),
						isEssential: false,
						canDelete: true,
						syncStatus: "pending",
					},
				],
				lastCleanup: new Date(2024, 5, 10),
				autoCleanup: true,
				maxAge: 7,
			};

			setPendingActions(mockActions);
			setOfflineStorage(mockStorage);
		} catch (error) {
			console.error("Error loading offline data:", error);
		}
	};

	const syncPendingActions = useCallback(async () => {
		if (!networkStatus.isOnline || isSyncing) return;

		setIsSyncing(true);
		setSyncProgress(0);

		try {
			const actionsToSync = pendingActions.filter(
				(action) => action.status === "pending" || action.status === "failed"
			);

			for (let i = 0; i < actionsToSync.length; i++) {
				const action = actionsToSync[i];
				setSyncProgress(((i + 1) / actionsToSync.length) * 100);

				try {
					// Simulate sync
					await simulateSync(action);

					// Update action status
					setPendingActions((prev) =>
						prev.map((a) =>
							a.id === action.id ? {...a, status: "synced" as const} : a
						)
					);
				} catch (error) {
					// Handle sync error
					setPendingActions((prev) =>
						prev.map((a) =>
							a.id === action.id
								? {
										...a,
										status: "failed" as const,
										retryCount: a.retryCount + 1,
										errorMessage:
											error instanceof Error
												? error.message
												: "Error desconocido",
									}
								: a
						)
					);
				}
			}
		} finally {
			setIsSyncing(false);
			setSyncProgress(0);
		}
	}, [networkStatus.isOnline, isSyncing, pendingActions]);

	const simulateSync = async (action: OfflineAction) => {
		// Simulate network delay
		await new Promise((resolve) =>
			setTimeout(resolve, 1000 + Math.random() * 2000)
		);

		// Simulate random failures for demo
		if (Math.random() < 0.2) {
			throw new Error("Error de conectividad");
		}

		// Simulate conflicts for some actions
		if (Math.random() < 0.1) {
			const conflict: ConflictResolution = {
				actionId: action.id,
				serverData: {modified: new Date(), version: 2},
				clientData: action.data,
				suggestions: [
					"El servidor tiene una versión más reciente",
					"Considere fusionar los cambios manualmente",
				],
			};
			setConflicts((prev) => [...prev, conflict]);
			throw new Error("Conflicto de datos detectado");
		}
	};

	const retryAction = async (actionId: string) => {
		const action = pendingActions.find((a) => a.id === actionId);
		if (!action || action.retryCount >= action.maxRetries) return;

		try {
			await simulateSync(action);
			setPendingActions((prev) =>
				prev.map((a) =>
					a.id === actionId ? {...a, status: "synced" as const} : a
				)
			);
		} catch (error) {
			setPendingActions((prev) =>
				prev.map((a) =>
					a.id === actionId
						? {
								...a,
								retryCount: a.retryCount + 1,
								errorMessage:
									error instanceof Error ? error.message : "Error desconocido",
							}
						: a
				)
			);
		}
	};

	const removeAction = (actionId: string) => {
		setPendingActions((prev) => prev.filter((a) => a.id !== actionId));
	};

	const resolveConflict = (
		conflictActionId: string,
		resolution: ConflictResolution["resolution"],
		mergedData?: any
	) => {
		setConflicts((prev) => prev.filter((c) => c.actionId !== conflictActionId));

		// Update the action based on resolution
		setPendingActions((prev) =>
			prev.map((a) =>
				a.id === conflictActionId
					? {
							...a,
							data:
								resolution === "keep_client"
									? a.data
									: resolution === "merge"
										? mergedData
										: conflicts.find((c) => c.actionId === conflictActionId)
												?.serverData,
							status: "pending" as const,
						}
					: a
			)
		);
	};

	const clearOfflineStorage = async (itemId: string) => {
		setOfflineStorage((prev) => ({
			...prev,
			items: prev.items.filter((item) => item.id !== itemId),
			usedSize:
				prev.usedSize -
				(prev.items.find((item) => item.id === itemId)?.size || 0),
		}));
	};

	const updateSyncSettings = (newSettings: Partial<SyncSettings>) => {
		setSyncSettings((prev) => ({...prev, ...newSettings}));
	};

	return {
		networkStatus,
		pendingActions,
		offlineStorage,
		syncSettings,
		conflicts,
		isSyncing,
		syncProgress,
		syncPendingActions,
		retryAction,
		removeAction,
		resolveConflict,
		clearOfflineStorage,
		updateSyncSettings,
	};
};

// Components
const NetworkStatusIndicator: React.FC<{status: NetworkStatus}> = ({
	status,
}) => {
	const getConnectionIcon = () => {
		if (!status.isOnline) {
			return <SignalSlashIcon className="h-5 w-5 text-red-600" />;
		}

		switch (status.connectionType) {
			case "wifi":
				return <WifiIcon className="h-5 w-5 text-green-600" />;
			case "cellular":
				return <DevicePhoneMobileIcon className="h-5 w-5 text-blue-600" />;
			case "ethernet":
				return <ComputerDesktopIcon className="h-5 w-5 text-purple-600" />;
			default:
				return <ServerIcon className="h-5 w-5 text-gray-600" />;
		}
	};

	const getConnectionQuality = () => {
		if (!status.isOnline) return "Desconectado";

		if (status.effectiveType === "slow-2g" || status.effectiveType === "2g") {
			return "Conexión lenta";
		} else if (status.effectiveType === "3g") {
			return "Conexión moderada";
		} else if (status.effectiveType === "4g") {
			return "Conexión rápida";
		}

		return "Conexión estable";
	};

	return (
		<div
			className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
				status.isOnline
					? status.isReliable
						? "bg-green-50 border border-green-200"
						: "bg-yellow-50 border border-yellow-200"
					: "bg-red-50 border border-red-200"
			}`}
		>
			{getConnectionIcon()}
			<div>
				<div className="font-medium text-gray-900">
					{getConnectionQuality()}
				</div>
				<div className="text-sm text-gray-600">
					{status.isOnline ? (
						<>
							{status.connectionType !== "unknown" && (
								<span className="capitalize">{status.connectionType}</span>
							)}
							{status.downlink > 0 && <span> • {status.downlink} Mbps</span>}
							{status.rtt > 0 && <span> • {status.rtt}ms</span>}
						</>
					) : (
						"Sin conexión a internet"
					)}
				</div>
			</div>
		</div>
	);
};

const PendingActionsList: React.FC<{
	actions: OfflineAction[];
	onRetry: (actionId: string) => void;
	onRemove: (actionId: string) => void;
	onViewDetails: (actionId: string) => void;
}> = ({actions, onRetry, onRemove, onViewDetails}) => {
	const getStatusColor = (status: OfflineAction["status"]) => {
		switch (status) {
			case "pending":
				return "bg-blue-100 text-blue-800";
			case "syncing":
				return "bg-yellow-100 text-yellow-800";
			case "synced":
				return "bg-green-100 text-green-800";
			case "failed":
				return "bg-red-100 text-red-800";
			case "conflict":
				return "bg-purple-100 text-purple-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getStatusIcon = (status: OfflineAction["status"]) => {
		switch (status) {
			case "pending":
				return ClockIcon;
			case "syncing":
				return ArrowPathIcon;
			case "synced":
				return CheckCircleIcon;
			case "failed":
				return ExclamationTriangleIcon;
			case "conflict":
				return ExclamationTriangleIcon;
			default:
				return ClockIcon;
		}
	};

	const getPriorityColor = (priority: OfflineAction["priority"]) => {
		switch (priority) {
			case "high":
				return "border-red-400";
			case "medium":
				return "border-yellow-400";
			case "low":
				return "border-blue-400";
			default:
				return "border-gray-400";
		}
	};

	if (actions.length === 0) {
		return (
			<div className="bg-white rounded-xl border border-gray-200 p-6">
				<div className="text-center py-8">
					<CheckCircleIcon className="h-12 w-12 text-green-400 mx-auto mb-4" />
					<p className="text-gray-600">No hay acciones pendientes</p>
					<p className="text-sm text-gray-500">
						Todos los cambios están sincronizados
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-xl border border-gray-200 p-6">
			<h3 className="text-lg font-semibold text-gray-900 mb-6">
				Acciones Pendientes ({actions.length})
			</h3>

			<div className="space-y-4">
				{actions.map((action) => {
					const StatusIcon = getStatusIcon(action.status);

					return (
						<div
							key={action.id}
							className={`p-4 rounded-lg border-l-4 ${getPriorityColor(action.priority)} bg-gray-50`}
						>
							<div className="flex items-start justify-between mb-3">
								<div className="flex items-start gap-3">
									<StatusIcon className="h-5 w-5 text-gray-600 mt-0.5" />
									<div>
										<h4 className="font-medium text-gray-900 mb-1">
											{action.entityName}
										</h4>
										<p className="text-sm text-gray-600">
											{action.type === "create"
												? "Crear"
												: action.type === "update"
													? "Actualizar"
													: action.type === "delete"
														? "Eliminar"
														: "Subir"}{" "}
											{action.entity}
										</p>
										<div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
											<span>{action.timestamp.toLocaleString("es-EC")}</span>
											{action.size && (
												<span>{(action.size / 1024).toFixed(0)} KB</span>
											)}
											{action.retryCount > 0 && (
												<span>
													Reintentos: {action.retryCount}/{action.maxRetries}
												</span>
											)}
										</div>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<Badge
										variant={
											action.priority === "high"
												? "error"
												: action.priority === "medium"
													? "warning"
													: "info"
										}
									>
										{action.priority === "high"
											? "Alta"
											: action.priority === "medium"
												? "Media"
												: "Baja"}
									</Badge>
									<span
										className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(action.status)}`}
									>
										{action.status === "pending"
											? "Pendiente"
											: action.status === "syncing"
												? "Sincronizando"
												: action.status === "synced"
													? "Sincronizado"
													: action.status === "failed"
														? "Error"
														: "Conflicto"}
									</span>
								</div>
							</div>

							{action.errorMessage && (
								<div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
									<p className="text-sm text-red-700">{action.errorMessage}</p>
								</div>
							)}

							<div className="flex gap-2">
								{(action.status === "failed" || action.status === "conflict") &&
									action.retryCount < action.maxRetries && (
										<button
											onClick={() => onRetry(action.id)}
											className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
										>
											<ArrowPathIcon className="h-4 w-4" />
											Reintentar
										</button>
									)}
								<button
									onClick={() => onViewDetails(action.id)}
									className="flex items-center gap-2 px-3 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
								>
									<EyeIcon className="h-4 w-4" />
									Ver Detalles
								</button>
								<button
									onClick={() => onRemove(action.id)}
									className="flex items-center gap-2 px-3 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-sm"
								>
									<TrashIcon className="h-4 w-4" />
									Eliminar
								</button>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

const StorageManager: React.FC<{
	storage: OfflineStorage;
	onClearItem: (itemId: string) => void;
}> = ({storage, onClearItem}) => {
	const formatBytes = (bytes: number) => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
	};

	const getItemIcon = (type: OfflineStorageItem["type"]) => {
		switch (type) {
			case "project":
				return BuildingOfficeIcon;
			case "calculation":
				return DocumentChartBarIcon;
			case "template":
				return DocumentTextIcon;
			case "media":
				return PhotoIcon;
			case "document":
				return DocumentTextIcon;
			default:
				return DocumentTextIcon;
		}
	};

	const usagePercentage = (storage.usedSize / storage.totalSize) * 100;

	return (
		<div className="bg-white rounded-xl border border-gray-200 p-6">
			<h3 className="text-lg font-semibold text-gray-900 mb-6">
				Gestión de Almacenamiento
			</h3>

			{/* Storage Overview */}
			<div className="mb-6">
				<div className="flex items-center justify-between mb-2">
					<span className="text-sm font-medium text-gray-700">
						Uso del almacenamiento
					</span>
					<span className="text-sm text-gray-600">
						{formatBytes(storage.usedSize)} de {formatBytes(storage.totalSize)}
					</span>
				</div>
				<ProgressBar
					progress={usagePercentage}
					className="h-3 mb-4"
					color={
						usagePercentage > 80
							? "red"
							: usagePercentage > 60
								? "yellow"
								: "green"
					}
				/>

				<div className="grid grid-cols-3 gap-4 text-center">
					<div>
						<div className="text-2xl font-bold text-green-600">
							{formatBytes(storage.availableSize)}
						</div>
						<div className="text-sm text-gray-600">Disponible</div>
					</div>
					<div>
						<div className="text-2xl font-bold text-blue-600">
							{storage.items.length}
						</div>
						<div className="text-sm text-gray-600">Elementos</div>
					</div>
					<div>
						<div className="text-2xl font-bold text-purple-600">
							{Math.round(
								(Date.now() - storage.lastCleanup.getTime()) /
									(1000 * 60 * 60 * 24)
							)}
						</div>
						<div className="text-sm text-gray-600">Días desde limpieza</div>
					</div>
				</div>
			</div>

			{/* Storage Items */}
			<div className="space-y-3">
				<div className="flex items-center justify-between mb-4">
					<h4 className="font-medium text-gray-900">Elementos almacenados</h4>
					<button className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
						Limpiar automáticamente
					</button>
				</div>

				{storage.items.map((item) => {
					const Icon = getItemIcon(item.type);

					return (
						<div
							key={item.id}
							className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
						>
							<div className="flex items-center gap-3">
								<Icon className="h-5 w-5 text-gray-600" />
								<div>
									<div className="font-medium text-gray-900">{item.name}</div>
									<div className="text-sm text-gray-600">
										{formatBytes(item.size)} • Acceso:{" "}
										{item.lastAccessed.toLocaleDateString("es-EC")}
									</div>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<Badge
									variant={
										item.syncStatus === "synced"
											? "success"
											: item.syncStatus === "pending"
												? "warning"
												: "info"
									}
								>
									{item.syncStatus === "synced"
										? "Sincronizado"
										: item.syncStatus === "pending"
											? "Pendiente"
											: "Solo local"}
								</Badge>
								{item.isEssential && <Badge variant="info">Esencial</Badge>}
								{item.canDelete && (
									<button
										onClick={() => onClearItem(item.id)}
										className="p-1 text-red-600 hover:text-red-700 transition-colors"
									>
										<TrashIcon className="h-4 w-4" />
									</button>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

const SyncSettings: React.FC<{
	settings: SyncSettings;
	onUpdateSettings: (newSettings: Partial<SyncSettings>) => void;
}> = ({settings, onUpdateSettings}) => {
	return (
		<div className="bg-white rounded-xl border border-gray-200 p-6">
			<h3 className="text-lg font-semibold text-gray-900 mb-6">
				Configuración de Sincronización
			</h3>

			<div className="space-y-6">
				{/* Auto Sync */}
				<div className="flex items-center justify-between">
					<div>
						<div className="font-medium text-gray-900">
							Sincronización automática
						</div>
						<div className="text-sm text-gray-600">
							Sincronizar cambios cuando hay conexión
						</div>
					</div>
					<button
						onClick={() => onUpdateSettings({autoSync: !settings.autoSync})}
						className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
							settings.autoSync ? "bg-blue-600" : "bg-gray-200"
						}`}
					>
						<span
							className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
								settings.autoSync ? "translate-x-6" : "translate-x-1"
							}`}
						/>
					</button>
				</div>

				{/* WiFi Only */}
				<div className="flex items-center justify-between">
					<div>
						<div className="font-medium text-gray-900">Solo con WiFi</div>
						<div className="text-sm text-gray-600">
							Sincronizar únicamente cuando esté conectado a WiFi
						</div>
					</div>
					<button
						onClick={() => onUpdateSettings({wifiOnly: !settings.wifiOnly})}
						className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
							settings.wifiOnly ? "bg-blue-600" : "bg-gray-200"
						}`}
					>
						<span
							className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
								settings.wifiOnly ? "translate-x-6" : "translate-x-1"
							}`}
						/>
					</button>
				</div>

				{/* Background Sync */}
				<div className="flex items-center justify-between">
					<div>
						<div className="font-medium text-gray-900">
							Sincronización en segundo plano
						</div>
						<div className="text-sm text-gray-600">
							Continuar sincronización cuando la app esté en segundo plano
						</div>
					</div>
					<button
						onClick={() =>
							onUpdateSettings({backgroundSync: !settings.backgroundSync})
						}
						className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
							settings.backgroundSync ? "bg-blue-600" : "bg-gray-200"
						}`}
					>
						<span
							className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
								settings.backgroundSync ? "translate-x-6" : "translate-x-1"
							}`}
						/>
					</button>
				</div>

				{/* Sync Interval */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Intervalo de sincronización (minutos)
					</label>
					<select
						value={settings.syncInterval}
						onChange={(e) =>
							onUpdateSettings({syncInterval: parseInt(e.target.value)})
						}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					>
						<option value={1}>1 minuto</option>
						<option value={5}>5 minutos</option>
						<option value={10}>10 minutos</option>
						<option value={30}>30 minutos</option>
						<option value={60}>1 hora</option>
					</select>
				</div>

				{/* Conflict Resolution */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Resolución de conflictos
					</label>
					<select
						value={settings.conflictResolution}
						onChange={(e) =>
							onUpdateSettings({
								conflictResolution: e.target
									.value as SyncSettings["conflictResolution"],
							})
						}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					>
						<option value="manual">Resolución manual</option>
						<option value="server_wins">Servidor gana</option>
						<option value="client_wins">Cliente gana</option>
						<option value="merge">Fusionar automáticamente</option>
					</select>
				</div>

				{/* Max Retries */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Máximo número de reintentos
					</label>
					<input
						type="number"
						min="1"
						max="10"
						value={settings.maxRetries}
						onChange={(e) =>
							onUpdateSettings({maxRetries: parseInt(e.target.value)})
						}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>

				{/* Compression */}
				<div className="flex items-center justify-between">
					<div>
						<div className="font-medium text-gray-900">Compresión de datos</div>
						<div className="text-sm text-gray-600">
							Comprimir datos para reducir uso de ancho de banda
						</div>
					</div>
					<button
						onClick={() =>
							onUpdateSettings({
								compressionEnabled: !settings.compressionEnabled,
							})
						}
						className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
							settings.compressionEnabled ? "bg-blue-600" : "bg-gray-200"
						}`}
					>
						<span
							className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
								settings.compressionEnabled ? "translate-x-6" : "translate-x-1"
							}`}
						/>
					</button>
				</div>
			</div>
		</div>
	);
};

const OfflineCapabilities: React.FC = () => {
	const {
		networkStatus,
		pendingActions,
		offlineStorage,
		syncSettings,
		conflicts,
		isSyncing,
		syncProgress,
		syncPendingActions,
		retryAction,
		removeAction,
		resolveConflict,
		clearOfflineStorage,
		updateSyncSettings,
	} = useOfflineCapabilities();

	const [selectedTab, setSelectedTab] = useState<
		"status" | "actions" | "storage" | "settings"
	>("status");

	const renderHeader = () => (
		<div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-4">
					<div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-600 rounded-xl flex items-center justify-center">
						{networkStatus.isOnline ? (
							<CloudArrowUpIcon className="h-6 w-6 text-white" />
						) : (
							<CloudArrowDownIcon className="h-6 w-6 text-white" />
						)}
					</div>
					<div>
						<h1 className="text-2xl font-bold text-gray-900">
							Capacidades Offline
						</h1>
						<p className="text-gray-600">
							Gestión de sincronización y almacenamiento local
						</p>
					</div>
				</div>

				<div className="flex items-center gap-3">
					{isSyncing && (
						<div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
							<LoadingSpinner size="sm" />
							<span className="text-sm text-blue-700">
								Sincronizando... {Math.round(syncProgress)}%
							</span>
						</div>
					)}
					<button
						onClick={syncPendingActions}
						disabled={
							!networkStatus.isOnline ||
							isSyncing ||
							pendingActions.length === 0
						}
						className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<ArrowPathIcon className="h-4 w-4" />
						Sincronizar Ahora
					</button>
				</div>
			</div>

			{/* Status Overview */}
			<NetworkStatusIndicator status={networkStatus} />

			{/* Navigation Tabs */}
			<div className="flex gap-1 bg-gray-100 rounded-lg p-1 mt-6">
				{[
					{key: "status", label: "Estado", icon: WifiIcon},
					{
						key: "actions",
						label: "Acciones",
						icon: ArrowUpTrayIcon,
						count: pendingActions.filter((a) => a.status !== "synced").length,
					},
					{key: "storage", label: "Almacenamiento", icon: ServerIcon},
					{key: "settings", label: "Configuración", icon: CogIcon},
				].map(({key, label, icon: Icon, count}) => (
					<button
						key={key}
						onClick={() => setSelectedTab(key as typeof selectedTab)}
						className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
							selectedTab === key
								? "bg-white text-blue-600 shadow-sm"
								: "text-gray-600 hover:text-gray-900"
						}`}
					>
						<Icon className="h-4 w-4" />
						{label}
						{count !== undefined && count > 0 && (
							<span
								className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
									selectedTab === key
										? "bg-blue-100 text-blue-600"
										: "bg-gray-200 text-gray-600"
								}`}
							>
								{count}
							</span>
						)}
					</button>
				))}
			</div>
		</div>
	);

	const renderStatus = () => (
		<div className="space-y-6">
			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="bg-white rounded-xl border border-gray-200 p-6">
					<div className="flex items-center gap-3 mb-4">
						<div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
							<ClockIcon className="h-5 w-5 text-blue-600" />
						</div>
						<div>
							<div className="text-2xl font-bold text-gray-900">
								{pendingActions.filter((a) => a.status !== "synced").length}
							</div>
							<div className="text-sm text-gray-600">Acciones pendientes</div>
						</div>
					</div>
					<div className="text-sm text-gray-600">
						{pendingActions.filter((a) => a.status === "failed").length}{" "}
						fallidas
					</div>
				</div>

				<div className="bg-white rounded-xl border border-gray-200 p-6">
					<div className="flex items-center gap-3 mb-4">
						<div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
							<ServerIcon className="h-5 w-5 text-green-600" />
						</div>
						<div>
							<div className="text-2xl font-bold text-gray-900">
								{(
									(offlineStorage.usedSize / offlineStorage.totalSize) *
									100
								).toFixed(1)}
								%
							</div>
							<div className="text-sm text-gray-600">Almacenamiento usado</div>
						</div>
					</div>
					<div className="text-sm text-gray-600">
						{offlineStorage.items.length} elementos
					</div>
				</div>

				<div className="bg-white rounded-xl border border-gray-200 p-6">
					<div className="flex items-center gap-3 mb-4">
						<div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
							<ExclamationTriangleIcon className="h-5 w-5 text-purple-600" />
						</div>
						<div>
							<div className="text-2xl font-bold text-gray-900">
								{conflicts.length}
							</div>
							<div className="text-sm text-gray-600">Conflictos</div>
						</div>
					</div>
					<div className="text-sm text-gray-600">
						Requieren resolución manual
					</div>
				</div>
			</div>

			{/* Conflicts Resolution */}
			{conflicts.length > 0 && (
				<div className="bg-white rounded-xl border border-gray-200 p-6">
					<h3 className="text-lg font-semibold text-gray-900 mb-6">
						Conflictos de Datos ({conflicts.length})
					</h3>
					<div className="space-y-4">
						{conflicts.map((conflict) => (
							<div
								key={conflict.actionId}
								className="p-4 bg-purple-50 border border-purple-200 rounded-lg"
							>
								<div className="flex items-start justify-between mb-3">
									<div>
										<h4 className="font-medium text-gray-900 mb-1">
											Conflicto de sincronización detectado
										</h4>
										<p className="text-sm text-gray-600">
											Los datos locales y del servidor difieren
										</p>
									</div>
								</div>

								{conflict.suggestions.length > 0 && (
									<div className="mb-4">
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
										onClick={() =>
											resolveConflict(conflict.actionId, "keep_server")
										}
										className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
									>
										Usar versión del servidor
									</button>
									<button
										onClick={() =>
											resolveConflict(conflict.actionId, "keep_client")
										}
										className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
									>
										Usar versión local
									</button>
									<button
										onClick={() => resolveConflict(conflict.actionId, "merge")}
										className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
									>
										Fusionar cambios
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);

	return (
		<div className="max-w-7xl mx-auto px-4 py-8">
			{renderHeader()}

			{selectedTab === "status" && renderStatus()}
			{selectedTab === "actions" && (
				<PendingActionsList
					actions={pendingActions}
					onRetry={retryAction}
					onRemove={removeAction}
					onViewDetails={(id) => console.log("View details:", id)}
				/>
			)}
			{selectedTab === "storage" && (
				<StorageManager
					storage={offlineStorage}
					onClearItem={clearOfflineStorage}
				/>
			)}
			{selectedTab === "settings" && (
				<SyncSettings
					settings={syncSettings}
					onUpdateSettings={updateSyncSettings}
				/>
			)}
		</div>
	);
};

export default OfflineCapabilities;
