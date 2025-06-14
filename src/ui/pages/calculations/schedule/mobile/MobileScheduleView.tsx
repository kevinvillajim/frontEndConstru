// src/ui/pages/calculations/schedule/mobile/MobileScheduleView.tsx
import React, {useState, useEffect, useRef} from "react";
import {useParams} from "react-router-dom";
import {
	CalendarDaysIcon,
	ClockIcon,
	UserGroupIcon,
	ExclamationTriangleIcon,
	CheckCircleIcon,
	FunnelIcon,
	MagnifyingGlassIcon,
	ArrowsUpDownIcon,
	EllipsisVerticalIcon,
	PlayIcon,
	PauseIcon,
	StopIcon,
	BellIcon,
	BellSlashIcon,
} from "@heroicons/react/24/outline";
import {useScheduleData} from "../../shared/hooks/useScheduleData";
import {usePushNotifications} from "../../shared/hooks/usePushNotifications";
import {useSwipeGestures} from "../../shared/hooks/useSwipeGestures";

interface ScheduleActivity {
	id: string;
	name: string;
	startDate: Date;
	endDate: Date;
	duration: number;
	progress: number;
	status: "not_started" | "in_progress" | "completed" | "delayed" | "on_hold";
	priority: "low" | "medium" | "high" | "critical";
	assignedTo: string[];
	dependencies: string[];
	trade: string;
	location: string;
	isFloating: boolean;
	totalFloat: number;
}

interface FilterOptions {
	status: string[];
	trade: string[];
	priority: string[];
	assignedTo: string[];
	showOnlyDelayed: boolean;
	showOnlyCritical: boolean;
}

const ActivityCard: React.FC<{
	activity: ScheduleActivity;
	onActivityAction: (action: string, activityId: string) => void;
	isExpanded: boolean;
	onToggleExpand: () => void;
}> = ({activity, onActivityAction, isExpanded, onToggleExpand}) => {
	const cardRef = useRef<HTMLDivElement>(null);

	const getStatusColor = (status: string) => {
		switch (status) {
			case "completed":
				return "bg-green-100 border-green-300 text-green-800";
			case "in_progress":
				return "bg-blue-100 border-blue-300 text-blue-800";
			case "delayed":
				return "bg-red-100 border-red-300 text-red-800";
			case "on_hold":
				return "bg-yellow-100 border-yellow-300 text-yellow-800";
			default:
				return "bg-gray-100 border-gray-300 text-gray-800";
		}
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case "critical":
				return "bg-red-600";
			case "high":
				return "bg-orange-500";
			case "medium":
				return "bg-yellow-500";
			default:
				return "bg-gray-400";
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "completed":
				return <CheckCircleIcon className="h-4 w-4" />;
			case "in_progress":
				return <PlayIcon className="h-4 w-4" />;
			case "delayed":
				return <ExclamationTriangleIcon className="h-4 w-4" />;
			case "on_hold":
				return <PauseIcon className="h-4 w-4" />;
			default:
				return <StopIcon className="h-4 w-4" />;
		}
	};

	const formatDate = (date: Date) => {
		return new Intl.DateTimeFormat("es-EC", {
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		}).format(date);
	};

	// Touch gesture handlers
	const {onTouchStart, onTouchMove, onTouchEnd} = useSwipeGestures({
		onSwipeLeft: () => onActivityAction("complete", activity.id),
		onSwipeRight: () => onActivityAction("hold", activity.id),
		threshold: 100,
	});

	return (
		<div
			ref={cardRef}
			className="bg-white rounded-xl border border-gray-200 shadow-sm mb-3 overflow-hidden"
			onTouchStart={onTouchStart}
			onTouchMove={onTouchMove}
			onTouchEnd={onTouchEnd}
		>
			<div className="p-4" onClick={onToggleExpand}>
				<div className="flex items-start justify-between mb-3">
					<div className="flex items-start gap-3 flex-1">
						<div
							className={`w-1 h-12 rounded-full ${getPriorityColor(activity.priority)}`}
						/>
						<div className="flex-1 min-w-0">
							<h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">
								{activity.name}
							</h3>
							<div className="flex items-center gap-2 text-xs text-gray-600">
								<span className="bg-gray-100 px-2 py-1 rounded-full">
									{activity.trade}
								</span>
								<span>•</span>
								<span>{activity.location}</span>
							</div>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<div
							className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}
						>
							<div className="flex items-center gap-1">
								{getStatusIcon(activity.status)}
								<span className="capitalize">
									{activity.status.replace("_", " ")}
								</span>
							</div>
						</div>
						<button
							onClick={(e) => {
								e.stopPropagation();
								// Show action menu
							}}
							className="p-1 text-gray-400 hover:text-gray-600"
						>
							<EllipsisVerticalIcon className="h-4 w-4" />
						</button>
					</div>
				</div>

				<div className="space-y-2">
					<div className="flex justify-between text-xs text-gray-600">
						<span>Inicio: {formatDate(activity.startDate)}</span>
						<span>Fin: {formatDate(activity.endDate)}</span>
					</div>

					<div className="flex justify-between text-xs text-gray-600 mb-2">
						<span>Progreso: {activity.progress}%</span>
						<span>Duración: {activity.duration} días</span>
					</div>

					<div className="w-full bg-gray-200 rounded-full h-2">
						<div
							className={`h-2 rounded-full transition-all duration-300 ${
								activity.progress === 100
									? "bg-green-500"
									: activity.status === "delayed"
										? "bg-red-500"
										: "bg-blue-500"
							}`}
							style={{width: `${activity.progress}%`}}
						/>
					</div>
				</div>

				{activity.assignedTo.length > 0 && (
					<div className="mt-3 flex items-center gap-2">
						<UserGroupIcon className="h-4 w-4 text-gray-400" />
						<div className="flex gap-1">
							{activity.assignedTo.slice(0, 3).map((person, index) => (
								<div
									key={index}
									className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white font-medium"
								>
									{person.charAt(0)}
								</div>
							))}
							{activity.assignedTo.length > 3 && (
								<div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-xs text-white font-medium">
									+{activity.assignedTo.length - 3}
								</div>
							)}
						</div>
					</div>
				)}
			</div>

			{isExpanded && (
				<div className="border-t border-gray-100 p-4 bg-gray-50">
					<div className="space-y-3">
						{/* Float Information */}
						{activity.isFloating && (
							<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
								<div className="flex items-center gap-2 text-yellow-800">
									<ClockIcon className="h-4 w-4" />
									<span className="text-sm font-medium">
										Holgura: {activity.totalFloat} días
									</span>
								</div>
							</div>
						)}

						{/* Dependencies */}
						{activity.dependencies.length > 0 && (
							<div>
								<div className="text-sm font-medium text-gray-700 mb-2">
									Dependencias:
								</div>
								<div className="space-y-1">
									{activity.dependencies.map((dep, index) => (
										<div
											key={index}
											className="text-xs text-gray-600 bg-white rounded px-2 py-1"
										>
											{dep}
										</div>
									))}
								</div>
							</div>
						)}

						{/* Quick Actions */}
						<div className="grid grid-cols-3 gap-2 pt-2">
							<button
								onClick={() => onActivityAction("start", activity.id)}
								disabled={activity.status === "completed"}
								className="flex items-center justify-center gap-1 p-2 bg-green-100 text-green-700 rounded-lg text-xs font-medium disabled:opacity-50"
							>
								<PlayIcon className="h-3 w-3" />
								Iniciar
							</button>
							<button
								onClick={() => onActivityAction("hold", activity.id)}
								disabled={activity.status === "completed"}
								className="flex items-center justify-center gap-1 p-2 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-medium disabled:opacity-50"
							>
								<PauseIcon className="h-3 w-3" />
								Pausar
							</button>
							<button
								onClick={() => onActivityAction("complete", activity.id)}
								disabled={activity.status === "completed"}
								className="flex items-center justify-center gap-1 p-2 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium disabled:opacity-50"
							>
								<CheckCircleIcon className="h-3 w-3" />
								Completar
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

const FilterPanel: React.FC<{
	filters: FilterOptions;
	onFiltersChange: (filters: FilterOptions) => void;
	availableOptions: {
		trades: string[];
		workers: string[];
	};
	isOpen: boolean;
	onClose: () => void;
}> = ({filters, onFiltersChange, availableOptions, isOpen, onClose}) => {
	if (!isOpen) return null;

	const handleFilterChange = (key: keyof FilterOptions, value: any) => {
		onFiltersChange({
			...filters,
			[key]: value,
		});
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
			<div className="bg-white rounded-t-3xl w-full max-h-[80vh] overflow-y-auto">
				<div className="p-4 border-b border-gray-200">
					<div className="flex items-center justify-between">
						<h2 className="text-lg font-semibold">Filtros</h2>
						<button onClick={onClose} className="text-gray-500 p-1">
							<FunnelIcon className="h-6 w-6" />
						</button>
					</div>
				</div>

				<div className="p-4 space-y-6">
					{/* Status Filter */}
					<div>
						<h3 className="font-medium text-gray-900 mb-3">Estado</h3>
						<div className="grid grid-cols-2 gap-2">
							{[
								"not_started",
								"in_progress",
								"completed",
								"delayed",
								"on_hold",
							].map((status) => (
								<label key={status} className="flex items-center gap-2">
									<input
										type="checkbox"
										checked={filters.status.includes(status)}
										onChange={(e) => {
											const newStatus = e.target.checked
												? [...filters.status, status]
												: filters.status.filter((s) => s !== status);
											handleFilterChange("status", newStatus);
										}}
										className="rounded text-blue-600 focus:ring-blue-500"
									/>
									<span className="text-sm capitalize">
										{status.replace("_", " ")}
									</span>
								</label>
							))}
						</div>
					</div>

					{/* Trade Filter */}
					<div>
						<h3 className="font-medium text-gray-900 mb-3">Trade</h3>
						<div className="grid grid-cols-2 gap-2">
							{availableOptions.trades.map((trade) => (
								<label key={trade} className="flex items-center gap-2">
									<input
										type="checkbox"
										checked={filters.trade.includes(trade)}
										onChange={(e) => {
											const newTrades = e.target.checked
												? [...filters.trade, trade]
												: filters.trade.filter((t) => t !== trade);
											handleFilterChange("trade", newTrades);
										}}
										className="rounded text-blue-600 focus:ring-blue-500"
									/>
									<span className="text-sm">{trade}</span>
								</label>
							))}
						</div>
					</div>

					{/* Priority Filter */}
					<div>
						<h3 className="font-medium text-gray-900 mb-3">Prioridad</h3>
						<div className="grid grid-cols-2 gap-2">
							{["low", "medium", "high", "critical"].map((priority) => (
								<label key={priority} className="flex items-center gap-2">
									<input
										type="checkbox"
										checked={filters.priority.includes(priority)}
										onChange={(e) => {
											const newPriorities = e.target.checked
												? [...filters.priority, priority]
												: filters.priority.filter((p) => p !== priority);
											handleFilterChange("priority", newPriorities);
										}}
										className="rounded text-blue-600 focus:ring-blue-500"
									/>
									<span className="text-sm capitalize">{priority}</span>
								</label>
							))}
						</div>
					</div>

					{/* Quick Filters */}
					<div>
						<h3 className="font-medium text-gray-900 mb-3">Filtros Rápidos</h3>
						<div className="space-y-2">
							<label className="flex items-center gap-2">
								<input
									type="checkbox"
									checked={filters.showOnlyDelayed}
									onChange={(e) =>
										handleFilterChange("showOnlyDelayed", e.target.checked)
									}
									className="rounded text-red-600 focus:ring-red-500"
								/>
								<span className="text-sm">Solo actividades con atraso</span>
							</label>
							<label className="flex items-center gap-2">
								<input
									type="checkbox"
									checked={filters.showOnlyCritical}
									onChange={(e) =>
										handleFilterChange("showOnlyCritical", e.target.checked)
									}
									className="rounded text-red-600 focus:ring-red-500"
								/>
								<span className="text-sm">Solo ruta crítica</span>
							</label>
						</div>
					</div>

					{/* Reset Button */}
					<button
						onClick={() =>
							onFiltersChange({
								status: [],
								trade: [],
								priority: [],
								assignedTo: [],
								showOnlyDelayed: false,
								showOnlyCritical: false,
							})
						}
						className="w-full p-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
					>
						Limpiar Filtros
					</button>
				</div>
			</div>
		</div>
	);
};

const MobileScheduleView: React.FC = () => {
	const {projectId} = useParams<{projectId: string}>();
	const {activities, loadActivities, updateActivityStatus, isLoading} =
		useScheduleData();
	const {subscribeToNotifications, unsubscribeFromNotifications, isSubscribed} =
		usePushNotifications();

	const [searchTerm, setSearchTerm] = useState("");
	const [sortBy, setSortBy] = useState<
		"startDate" | "priority" | "progress" | "name"
	>("startDate");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
	const [showFilters, setShowFilters] = useState(false);
	const [expandedActivity, setExpandedActivity] = useState<string | null>(null);
	const [filters, setFilters] = useState<FilterOptions>({
		status: [],
		trade: [],
		priority: [],
		assignedTo: [],
		showOnlyDelayed: false,
		showOnlyCritical: false,
	});

	useEffect(() => {
		if (projectId) {
			loadActivities(projectId);
		}
	}, [projectId, loadActivities]);

	const handleActivityAction = async (action: string, activityId: string) => {
		let newStatus: string;
		switch (action) {
			case "start":
				newStatus = "in_progress";
				break;
			case "complete":
				newStatus = "completed";
				break;
			case "hold":
				newStatus = "on_hold";
				break;
			default:
				return;
		}

		await updateActivityStatus(activityId, newStatus);
	};

	const handleNotificationToggle = async () => {
		if (isSubscribed) {
			await unsubscribeFromNotifications();
		} else {
			await subscribeToNotifications();
		}
	};

	// Filter and sort activities
	const filteredActivities = activities
		.filter((activity) => {
			if (
				searchTerm &&
				!activity.name.toLowerCase().includes(searchTerm.toLowerCase())
			) {
				return false;
			}

			if (
				filters.status.length > 0 &&
				!filters.status.includes(activity.status)
			) {
				return false;
			}

			if (filters.trade.length > 0 && !filters.trade.includes(activity.trade)) {
				return false;
			}

			if (
				filters.priority.length > 0 &&
				!filters.priority.includes(activity.priority)
			) {
				return false;
			}

			if (filters.showOnlyDelayed && activity.status !== "delayed") {
				return false;
			}

			if (filters.showOnlyCritical && activity.totalFloat > 0) {
				return false;
			}

			return true;
		})
		.sort((a, b) => {
			let comparison = 0;

			switch (sortBy) {
				case "startDate":
					comparison = a.startDate.getTime() - b.startDate.getTime();
					break;
				case "priority":
					const priorityValues = {low: 1, medium: 2, high: 3, critical: 4};
					comparison = priorityValues[a.priority] - priorityValues[b.priority];
					break;
				case "progress":
					comparison = a.progress - b.progress;
					break;
				case "name":
					comparison = a.name.localeCompare(b.name);
					break;
			}

			return sortOrder === "asc" ? comparison : -comparison;
		});

	const availableOptions = {
		trades: [...new Set(activities.map((a) => a.trade))],
		workers: [...new Set(activities.flatMap((a) => a.assignedTo))],
	};

	const activeFiltersCount =
		filters.status.length +
		filters.trade.length +
		filters.priority.length +
		(filters.showOnlyDelayed ? 1 : 0) +
		(filters.showOnlyCritical ? 1 : 0);

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Cargando cronograma...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white border-b border-gray-200 sticky top-0 z-30">
				<div className="p-4">
					<div className="flex items-center justify-between mb-4">
						<div>
							<h1 className="text-lg font-semibold text-gray-900">
								Cronograma
							</h1>
							<p className="text-sm text-gray-600">
								{filteredActivities.length} actividades
							</p>
						</div>
						<button
							onClick={handleNotificationToggle}
							className={`p-2 rounded-lg transition-colors ${
								isSubscribed
									? "bg-blue-100 text-blue-600"
									: "bg-gray-100 text-gray-600"
							}`}
						>
							{isSubscribed ? (
								<BellIcon className="h-5 w-5" />
							) : (
								<BellSlashIcon className="h-5 w-5" />
							)}
						</button>
					</div>

					{/* Search Bar */}
					<div className="relative mb-4">
						<MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
						<input
							type="text"
							placeholder="Buscar actividades..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>

					{/* Filter and Sort Controls */}
					<div className="flex items-center gap-2">
						<button
							onClick={() => setShowFilters(true)}
							className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
								activeFiltersCount > 0
									? "bg-blue-100 border-blue-300 text-blue-700"
									: "bg-white border-gray-300 text-gray-700"
							}`}
						>
							<FunnelIcon className="h-4 w-4" />
							<span className="text-sm">Filtros</span>
							{activeFiltersCount > 0 && (
								<span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
									{activeFiltersCount}
								</span>
							)}
						</button>

						<button
							onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
							className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-700"
						>
							<ArrowsUpDownIcon className="h-4 w-4" />
							<span className="text-sm capitalize">{sortBy}</span>
						</button>
					</div>
				</div>
			</div>

			{/* Activities List */}
			<div className="p-4">
				{filteredActivities.length === 0 ? (
					<div className="text-center py-12">
						<CalendarDaysIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
						<h3 className="text-lg font-medium text-gray-900 mb-2">
							No se encontraron actividades
						</h3>
						<p className="text-gray-600">
							Intenta ajustar los filtros o términos de búsqueda
						</p>
					</div>
				) : (
					<div className="space-y-3">
						{filteredActivities.map((activity) => (
							<ActivityCard
								key={activity.id}
								activity={activity}
								onActivityAction={handleActivityAction}
								isExpanded={expandedActivity === activity.id}
								onToggleExpand={() =>
									setExpandedActivity(
										expandedActivity === activity.id ? null : activity.id
									)
								}
							/>
						))}
					</div>
				)}
			</div>

			{/* Filter Panel */}
			<FilterPanel
				filters={filters}
				onFiltersChange={setFilters}
				availableOptions={availableOptions}
				isOpen={showFilters}
				onClose={() => setShowFilters(false)}
			/>
		</div>
	);
};

export default MobileScheduleView;
