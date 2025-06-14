// src/ui/pages/calculations/performance/PerformanceOptimizations.tsx
import React, {useState, useEffect, useMemo, useCallback, memo} from "react";
import {
	BoltIcon,
	ChartBarIcon,
	ClockIcon,
	CpuChipIcon,
	DocumentTextIcon,
	EyeIcon,
	ArrowPathIcon,
	CheckCircleIcon,
	ExclamationTriangleIcon,
	SignalIcon,
	ServerIcon,
	CogIcon,
	CloudIcon,
	DevicePhoneMobileIcon,
	ComputerDesktopIcon,
	GlobeAltIcon,
	BeakerIcon,
	RocketLaunchIcon,
	WrenchScrewdriverIcon,
	CubeIcon,
	TableCellsIcon,
	PhotoIcon,
	DocumentDuplicateIcon,
	MagnifyingGlassIcon,
	FunnelIcon,
	Bars3Icon,
	ListBulletIcon,
} from "@heroicons/react/24/outline";
import {
	LoadingSpinner,
	Badge,
	ProgressBar,
} from "../shared/components/SharedComponents";

// Types
interface PerformanceMetrics {
	loadTime: number;
	renderTime: number;
	memoryUsage: number;
	bundleSize: number;
	cacheHitRate: number;
	networkRequests: number;
	errorRate: number;
	userSatisfaction: number;
}

interface OptimizationSuggestion {
	id: string;
	title: string;
	description: string;
	impact: "high" | "medium" | "low";
	effort: "low" | "medium" | "high";
	category: "loading" | "rendering" | "memory" | "network" | "caching";
	estimatedImprovement: string;
	implemented: boolean;
	implementedAt?: Date;
}

interface VirtualListItem {
	id: string;
	name: string;
	description: string;
	size: number;
	type: string;
	date: Date;
	status: string;
}

interface CacheEntry {
	key: string;
	size: number;
	lastAccessed: Date;
	hitCount: number;
	expiry: Date;
	type: "api" | "image" | "document" | "calculation";
}

interface LazyComponentProps {
	componentName: string;
	loadingText?: string;
	errorText?: string;
	retryable?: boolean;
}

// Custom Hooks
const usePerformanceMetrics = () => {
	const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const collectMetrics = async () => {
			setIsLoading(true);
			try {
				// Simulate collecting real performance metrics
				await new Promise((resolve) => setTimeout(resolve, 1000));

				const mockMetrics: PerformanceMetrics = {
					loadTime: 2.3,
					renderTime: 45,
					memoryUsage: 67,
					bundleSize: 1.2,
					cacheHitRate: 85,
					networkRequests: 12,
					errorRate: 0.2,
					userSatisfaction: 4.2,
				};

				setMetrics(mockMetrics);
			} catch (error) {
				console.error("Error collecting metrics:", error);
			} finally {
				setIsLoading(false);
			}
		};

		collectMetrics();

		// Set up real-time monitoring
		const interval = setInterval(collectMetrics, 30000); // Update every 30 seconds

		return () => clearInterval(interval);
	}, []);

	return {metrics, isLoading};
};

const useVirtualList = <T,>(
	items: T[],
	itemHeight: number,
	containerHeight: number
) => {
	const [scrollTop, setScrollTop] = useState(0);

	const visibleItems = useMemo(() => {
		const startIndex = Math.floor(scrollTop / itemHeight);
		const endIndex = Math.min(
			startIndex + Math.ceil(containerHeight / itemHeight) + 1,
			items.length
		);

		return {
			startIndex,
			endIndex,
			items: items.slice(startIndex, endIndex),
			totalHeight: items.length * itemHeight,
			offsetY: startIndex * itemHeight,
		};
	}, [items, itemHeight, containerHeight, scrollTop]);

	const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
		setScrollTop(e.currentTarget.scrollTop);
	}, []);

	return {
		visibleItems,
		handleScroll,
	};
};

const useOptimizedSearch = <T,>(
	items: T[],
	searchFields: (keyof T)[],
	debounceMs: number = 300
) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [debouncedTerm, setDebouncedTerm] = useState("");

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedTerm(searchTerm);
		}, debounceMs);

		return () => clearTimeout(timer);
	}, [searchTerm, debounceMs]);

	const filteredItems = useMemo(() => {
		if (!debouncedTerm) return items;

		return items.filter((item) =>
			searchFields.some((field) => {
				const value = item[field];
				if (typeof value === "string") {
					return value.toLowerCase().includes(debouncedTerm.toLowerCase());
				}
				return false;
			})
		);
	}, [items, searchFields, debouncedTerm]);

	return {
		searchTerm,
		setSearchTerm,
		filteredItems,
		isSearching: searchTerm !== debouncedTerm,
	};
};

// Lazy Loading Component
const LazyComponent: React.FC<LazyComponentProps> = memo(
	({
		componentName,
		loadingText = "Cargando componente...",
		errorText = "Error al cargar componente",
		retryable = true,
	}) => {
		const [isLoading, setIsLoading] = useState(true);
		const [hasError, setHasError] = useState(false);
		const [Component, setComponent] = useState<React.ComponentType | null>(
			null
		);

		const loadComponent = useCallback(async () => {
			setIsLoading(true);
			setHasError(false);

			try {
				// Simulate dynamic import with delay
				await new Promise((resolve) =>
					setTimeout(resolve, 1000 + Math.random() * 2000)
				);

				// Mock component loading
				const MockComponent = () => (
					<div className="p-4 bg-green-50 border border-green-200 rounded-lg">
						<h3 className="font-medium text-green-900 mb-2">
							Componente cargado: {componentName}
						</h3>
						<p className="text-sm text-green-700">
							Este componente se cargó de forma dinámica para optimizar el
							rendimiento inicial.
						</p>
					</div>
				);

				setComponent(() => MockComponent);
			} catch (error) {
				setHasError(true);
			} finally {
				setIsLoading(false);
			}
		}, [componentName]);

		useEffect(() => {
			loadComponent();
		}, [loadComponent]);

		if (isLoading) {
			return (
				<div className="flex items-center justify-center p-8">
					<div className="text-center">
						<LoadingSpinner size="lg" className="mx-auto mb-4" />
						<p className="text-gray-600">{loadingText}</p>
					</div>
				</div>
			);
		}

		if (hasError) {
			return (
				<div className="p-8 text-center">
					<ExclamationTriangleIcon className="h-12 w-12 text-red-400 mx-auto mb-4" />
					<p className="text-gray-600 mb-4">{errorText}</p>
					{retryable && (
						<button
							onClick={loadComponent}
							className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
						>
							Reintentar
						</button>
					)}
				</div>
			);
		}

		return Component ? <Component /> : null;
	}
);

LazyComponent.displayName = "LazyComponent";

// Virtual List Component
const VirtualList: React.FC<{
	items: VirtualListItem[];
	height: number;
	itemHeight: number;
	onItemClick?: (item: VirtualListItem) => void;
}> = memo(({items, height, itemHeight, onItemClick}) => {
	const {visibleItems, handleScroll} = useVirtualList(
		items,
		itemHeight,
		height
	);

	return (
		<div
			className="overflow-auto border border-gray-200 rounded-lg"
			style={{height}}
			onScroll={handleScroll}
		>
			<div style={{height: visibleItems.totalHeight, position: "relative"}}>
				<div
					style={{
						transform: `translateY(${visibleItems.offsetY}px)`,
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
					}}
				>
					{visibleItems.items.map((item, index) => (
						<div
							key={item.id}
							className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
							style={{height: itemHeight}}
							onClick={() => onItemClick?.(item)}
						>
							<div className="flex items-center justify-between">
								<div className="flex-1 min-w-0">
									<h4 className="font-medium text-gray-900 truncate">
										{item.name}
									</h4>
									<p className="text-sm text-gray-600 truncate">
										{item.description}
									</p>
								</div>
								<div className="flex items-center gap-3 text-sm text-gray-500">
									<span>{(item.size / 1024).toFixed(1)} KB</span>
									<Badge
										variant={
											item.status === "active"
												? "success"
												: item.status === "pending"
													? "warning"
													: "default"
										}
									>
										{item.status}
									</Badge>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
});

VirtualList.displayName = "VirtualList";

// Optimized Search Component
const OptimizedSearch: React.FC<{
	items: VirtualListItem[];
	onResults: (results: VirtualListItem[]) => void;
}> = memo(({items, onResults}) => {
	const {searchTerm, setSearchTerm, filteredItems, isSearching} =
		useOptimizedSearch(items, ["name", "description", "type"], 300);

	useEffect(() => {
		onResults(filteredItems);
	}, [filteredItems, onResults]);

	return (
		<div className="relative">
			<div className="relative">
				<input
					type="text"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					placeholder="Buscar elementos..."
					className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
				/>
				<MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
				{isSearching && (
					<div className="absolute right-3 top-2.5">
						<LoadingSpinner size="sm" />
					</div>
				)}
			</div>

			{searchTerm && (
				<div className="mt-2 text-sm text-gray-600">
					{filteredItems.length} de {items.length} elementos
				</div>
			)}
		</div>
	);
});

OptimizedSearch.displayName = "OptimizedSearch";

// Cache Management Component
const CacheManager: React.FC<{
	cacheEntries: CacheEntry[];
	onClearCache: (keys: string[]) => void;
	onRefreshCache: (keys: string[]) => void;
}> = memo(({cacheEntries, onClearCache, onRefreshCache}) => {
	const [selectedEntries, setSelectedEntries] = useState<Set<string>>(
		new Set()
	);

	const totalSize = cacheEntries.reduce((sum, entry) => sum + entry.size, 0);
	const averageHitRate =
		cacheEntries.reduce((sum, entry) => sum + entry.hitCount, 0) /
		cacheEntries.length;

	const toggleEntry = (key: string) => {
		const newSelected = new Set(selectedEntries);
		if (newSelected.has(key)) {
			newSelected.delete(key);
		} else {
			newSelected.add(key);
		}
		setSelectedEntries(newSelected);
	};

	const selectAll = () => {
		setSelectedEntries(new Set(cacheEntries.map((entry) => entry.key)));
	};

	const clearSelection = () => {
		setSelectedEntries(new Set());
	};

	const formatBytes = (bytes: number) => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
	};

	const getTypeIcon = (type: CacheEntry["type"]) => {
		switch (type) {
			case "api":
				return ServerIcon;
			case "image":
				return PhotoIcon;
			case "document":
				return DocumentTextIcon;
			case "calculation":
				return ChartBarIcon;
			default:
				return CubeIcon;
		}
	};

	return (
		<div className="bg-white rounded-xl border border-gray-200 p-6">
			<div className="flex items-center justify-between mb-6">
				<div>
					<h3 className="text-lg font-semibold text-gray-900">
						Gestión de Caché
					</h3>
					<p className="text-sm text-gray-600">
						{cacheEntries.length} entradas • {formatBytes(totalSize)} total
					</p>
				</div>
				<div className="flex items-center gap-3">
					<div className="text-sm text-gray-600">
						Hit rate promedio: {averageHitRate.toFixed(1)}
					</div>
					<div className="flex gap-2">
						<button
							onClick={selectAll}
							className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
						>
							Seleccionar todo
						</button>
						<button
							onClick={clearSelection}
							className="px-3 py-1 text-sm text-gray-600 hover:text-gray-700 transition-colors"
						>
							Limpiar selección
						</button>
					</div>
				</div>
			</div>

			{/* Cache Statistics */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
				<div className="bg-blue-50 rounded-lg p-4">
					<div className="text-sm text-blue-600 font-medium mb-1">
						Total Entradas
					</div>
					<div className="text-2xl font-bold text-blue-900">
						{cacheEntries.length}
					</div>
				</div>
				<div className="bg-green-50 rounded-lg p-4">
					<div className="text-sm text-green-600 font-medium mb-1">
						Tamaño Total
					</div>
					<div className="text-2xl font-bold text-green-900">
						{formatBytes(totalSize)}
					</div>
				</div>
				<div className="bg-purple-50 rounded-lg p-4">
					<div className="text-sm text-purple-600 font-medium mb-1">
						Hit Rate
					</div>
					<div className="text-2xl font-bold text-purple-900">
						{averageHitRate.toFixed(1)}
					</div>
				</div>
				<div className="bg-yellow-50 rounded-lg p-4">
					<div className="text-sm text-yellow-600 font-medium mb-1">
						Expiradas
					</div>
					<div className="text-2xl font-bold text-yellow-900">
						{cacheEntries.filter((entry) => entry.expiry < new Date()).length}
					</div>
				</div>
			</div>

			{/* Selected Actions */}
			{selectedEntries.size > 0 && (
				<div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium text-blue-900">
							{selectedEntries.size} entrada(s) seleccionada(s)
						</span>
						<div className="flex gap-2">
							<button
								onClick={() => onRefreshCache(Array.from(selectedEntries))}
								className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
							>
								Refrescar
							</button>
							<button
								onClick={() => onClearCache(Array.from(selectedEntries))}
								className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
							>
								Limpiar
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Cache Entries */}
			<div className="space-y-2 max-h-96 overflow-y-auto">
				{cacheEntries.map((entry) => {
					const Icon = getTypeIcon(entry.type);
					const isExpired = entry.expiry < new Date();
					const isSelected = selectedEntries.has(entry.key);

					return (
						<div
							key={entry.key}
							className={`p-3 rounded-lg border cursor-pointer transition-colors ${
								isSelected
									? "border-blue-500 bg-blue-50"
									: "border-gray-200 hover:border-gray-300"
							}`}
							onClick={() => toggleEntry(entry.key)}
						>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<Icon className="h-5 w-5 text-gray-600" />
									<div className="min-w-0 flex-1">
										<div className="font-medium text-gray-900 truncate">
											{entry.key}
										</div>
										<div className="text-sm text-gray-600">
											{formatBytes(entry.size)} • {entry.hitCount} hits •
											{entry.type} • Acceso:{" "}
											{entry.lastAccessed.toLocaleDateString("es-EC")}
										</div>
									</div>
								</div>
								<div className="flex items-center gap-2">
									{isExpired && <Badge variant="error">Expirado</Badge>}
									<input
										type="checkbox"
										checked={isSelected}
										onChange={() => toggleEntry(entry.key)}
										className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
									/>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
});

CacheManager.displayName = "CacheManager";

// Performance Dashboard Component
const PerformanceDashboard: React.FC<{
	metrics: PerformanceMetrics;
	suggestions: OptimizationSuggestion[];
	onImplementSuggestion: (suggestionId: string) => void;
}> = memo(({metrics, suggestions, onImplementSuggestion}) => {
	const getMetricColor = (
		value: number,
		thresholds: {good: number; warning: number}
	) => {
		if (value <= thresholds.good) return "text-green-600";
		if (value <= thresholds.warning) return "text-yellow-600";
		return "text-red-600";
	};

	const getMetricBadge = (
		value: number,
		thresholds: {good: number; warning: number}
	) => {
		if (value <= thresholds.good) return "success";
		if (value <= thresholds.warning) return "warning";
		return "error";
	};

	const highImpactSuggestions = suggestions.filter(
		(s) => s.impact === "high" && !s.implemented
	);
	const implementedCount = suggestions.filter((s) => s.implemented).length;

	return (
		<div className="space-y-6">
			{/* Performance Metrics */}
			<div className="bg-white rounded-xl border border-gray-200 p-6">
				<h3 className="text-lg font-semibold text-gray-900 mb-6">
					Métricas de Rendimiento
				</h3>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					<div className="text-center">
						<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
							<ClockIcon className="h-8 w-8 text-blue-600" />
						</div>
						<div
							className={`text-2xl font-bold mb-1 ${getMetricColor(metrics.loadTime, {good: 2, warning: 5})}`}
						>
							{metrics.loadTime}s
						</div>
						<div className="text-sm text-gray-600 mb-2">Tiempo de Carga</div>
						<Badge
							variant={getMetricBadge(metrics.loadTime, {good: 2, warning: 5})}
						>
							{metrics.loadTime <= 2
								? "Excelente"
								: metrics.loadTime <= 5
									? "Bueno"
									: "Necesita mejora"}
						</Badge>
					</div>

					<div className="text-center">
						<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
							<CpuChipIcon className="h-8 w-8 text-green-600" />
						</div>
						<div
							className={`text-2xl font-bold mb-1 ${getMetricColor(metrics.memoryUsage, {good: 50, warning: 80})}`}
						>
							{metrics.memoryUsage}%
						</div>
						<div className="text-sm text-gray-600 mb-2">Uso de Memoria</div>
						<Badge
							variant={getMetricBadge(metrics.memoryUsage, {
								good: 50,
								warning: 80,
							})}
						>
							{metrics.memoryUsage <= 50
								? "Óptimo"
								: metrics.memoryUsage <= 80
									? "Aceptable"
									: "Alto"}
						</Badge>
					</div>

					<div className="text-center">
						<div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
							<ServerIcon className="h-8 w-8 text-purple-600" />
						</div>
						<div
							className={`text-2xl font-bold mb-1 ${getMetricColor(100 - metrics.cacheHitRate, {good: 20, warning: 40})}`}
						>
							{metrics.cacheHitRate}%
						</div>
						<div className="text-sm text-gray-600 mb-2">Cache Hit Rate</div>
						<Badge
							variant={getMetricBadge(100 - metrics.cacheHitRate, {
								good: 20,
								warning: 40,
							})}
						>
							{metrics.cacheHitRate >= 80
								? "Excelente"
								: metrics.cacheHitRate >= 60
									? "Bueno"
									: "Bajo"}
						</Badge>
					</div>

					<div className="text-center">
						<div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
							<SignalIcon className="h-8 w-8 text-yellow-600" />
						</div>
						<div
							className={`text-2xl font-bold mb-1 ${getMetricColor(metrics.errorRate, {good: 1, warning: 5})}`}
						>
							{metrics.errorRate}%
						</div>
						<div className="text-sm text-gray-600 mb-2">Tasa de Error</div>
						<Badge
							variant={getMetricBadge(metrics.errorRate, {good: 1, warning: 5})}
						>
							{metrics.errorRate <= 1
								? "Excelente"
								: metrics.errorRate <= 5
									? "Aceptable"
									: "Alto"}
						</Badge>
					</div>
				</div>
			</div>

			{/* Optimization Suggestions */}
			<div className="bg-white rounded-xl border border-gray-200 p-6">
				<div className="flex items-center justify-between mb-6">
					<div>
						<h3 className="text-lg font-semibold text-gray-900">
							Sugerencias de Optimización
						</h3>
						<p className="text-sm text-gray-600">
							{implementedCount} de {suggestions.length} implementadas
						</p>
					</div>
					<div className="text-right">
						<div className="text-sm text-gray-600">Prioridad Alta</div>
						<div className="text-xl font-bold text-red-600">
							{highImpactSuggestions.length}
						</div>
					</div>
				</div>

				<div className="space-y-4">
					{suggestions.slice(0, 5).map((suggestion) => (
						<div
							key={suggestion.id}
							className={`p-4 rounded-lg border-l-4 ${
								suggestion.impact === "high"
									? "border-red-400 bg-red-50"
									: suggestion.impact === "medium"
										? "border-yellow-400 bg-yellow-50"
										: "border-blue-400 bg-blue-50"
							} ${suggestion.implemented ? "opacity-60" : ""}`}
						>
							<div className="flex items-start justify-between mb-2">
								<div className="flex-1">
									<h4 className="font-medium text-gray-900 mb-1">
										{suggestion.title}
									</h4>
									<p className="text-sm text-gray-600 mb-3">
										{suggestion.description}
									</p>
									<div className="flex items-center gap-4 text-sm">
										<Badge
											variant={
												suggestion.impact === "high"
													? "error"
													: suggestion.impact === "medium"
														? "warning"
														: "info"
											}
										>
											Impacto{" "}
											{suggestion.impact === "high"
												? "Alto"
												: suggestion.impact === "medium"
													? "Medio"
													: "Bajo"}
										</Badge>
										<Badge
											variant={
												suggestion.effort === "low"
													? "success"
													: suggestion.effort === "medium"
														? "warning"
														: "error"
											}
										>
											Esfuerzo{" "}
											{suggestion.effort === "low"
												? "Bajo"
												: suggestion.effort === "medium"
													? "Medio"
													: "Alto"}
										</Badge>
										<span className="text-gray-600">
											Mejora estimada: {suggestion.estimatedImprovement}
										</span>
									</div>
								</div>
								<div className="flex items-center gap-2">
									{suggestion.implemented ? (
										<div className="flex items-center gap-2 text-green-600">
											<CheckCircleIcon className="h-5 w-5" />
											<span className="text-sm">Implementado</span>
										</div>
									) : (
										<button
											onClick={() => onImplementSuggestion(suggestion.id)}
											className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
										>
											Implementar
										</button>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
});

PerformanceDashboard.displayName = "PerformanceDashboard";

// Main Component
const PerformanceOptimizations: React.FC = () => {
	const {metrics, isLoading: metricsLoading} = usePerformanceMetrics();
	const [selectedTab, setSelectedTab] = useState<
		"dashboard" | "lazy" | "virtual" | "cache"
	>("dashboard");
	const [isOptimizing, setIsOptimizing] = useState(false);

	// Mock data
	const [suggestions] = useState<OptimizationSuggestion[]>([
		{
			id: "1",
			title: "Implementar Code Splitting",
			description:
				"Dividir el bundle en chunks más pequeños para mejorar el tiempo de carga inicial",
			impact: "high",
			effort: "medium",
			category: "loading",
			estimatedImprovement: "40% reducción en tiempo de carga",
			implemented: false,
		},
		{
			id: "2",
			title: "Optimizar Imágenes",
			description:
				"Comprimir y usar formatos modernos como WebP para las imágenes",
			impact: "medium",
			effort: "low",
			category: "loading",
			estimatedImprovement: "25% reducción en tamaño",
			implemented: true,
			implementedAt: new Date(2024, 4, 15),
		},
		{
			id: "3",
			title: "Implementar Virtual Scrolling",
			description:
				"Usar virtualización para listas largas y mejorar el rendimiento de renderizado",
			impact: "high",
			effort: "high",
			category: "rendering",
			estimatedImprovement: "60% menos uso de memoria",
			implemented: false,
		},
		{
			id: "4",
			title: "Caché Inteligente",
			description:
				"Mejorar la estrategia de caché para reducir las solicitudes de red",
			impact: "medium",
			effort: "medium",
			category: "caching",
			estimatedImprovement: "30% menos solicitudes",
			implemented: false,
		},
	]);

	const [virtualListItems] = useState<VirtualListItem[]>(() => {
		return Array.from({length: 10000}, (_, i) => ({
			id: `item-${i}`,
			name: `Elemento ${i + 1}`,
			description: `Descripción del elemento ${i + 1} con información adicional`,
			size: Math.floor(Math.random() * 100000) + 1000,
			type: ["document", "image", "calculation", "project"][
				Math.floor(Math.random() * 4)
			],
			date: new Date(
				2024,
				Math.floor(Math.random() * 6),
				Math.floor(Math.random() * 28) + 1
			),
			status: ["active", "pending", "completed"][Math.floor(Math.random() * 3)],
		}));
	});

	const [filteredItems, setFilteredItems] = useState(virtualListItems);

	const [cacheEntries] = useState<CacheEntry[]>([
		{
			key: "api/calculations/recent",
			size: 156000,
			lastAccessed: new Date(2024, 5, 13, 14, 30),
			hitCount: 45,
			expiry: new Date(2024, 5, 14, 14, 30),
			type: "api",
		},
		{
			key: "images/project-thumbnails",
			size: 2048000,
			lastAccessed: new Date(2024, 5, 13, 12, 15),
			hitCount: 23,
			expiry: new Date(2024, 5, 20, 12, 15),
			type: "image",
		},
		{
			key: "documents/budget-templates",
			size: 512000,
			lastAccessed: new Date(2024, 5, 12, 16, 45),
			hitCount: 67,
			expiry: new Date(2024, 5, 19, 16, 45),
			type: "document",
		},
		{
			key: "calculations/structural-nec",
			size: 324000,
			lastAccessed: new Date(2024, 5, 13, 10, 20),
			hitCount: 89,
			expiry: new Date(2024, 5, 16, 10, 20),
			type: "calculation",
		},
	]);

	const handleImplementSuggestion = async (suggestionId: string) => {
		setIsOptimizing(true);
		try {
			// Simulate implementation
			await new Promise((resolve) => setTimeout(resolve, 2000));
			console.log("Implementing suggestion:", suggestionId);
		} finally {
			setIsOptimizing(false);
		}
	};

	const handleClearCache = async (keys: string[]) => {
		console.log("Clearing cache keys:", keys);
		// Simulate cache clearing
		await new Promise((resolve) => setTimeout(resolve, 1000));
	};

	const handleRefreshCache = async (keys: string[]) => {
		console.log("Refreshing cache keys:", keys);
		// Simulate cache refresh
		await new Promise((resolve) => setTimeout(resolve, 1000));
	};

	if (metricsLoading) {
		return (
			<div className="max-w-7xl mx-auto px-4 py-8">
				<div className="flex items-center justify-center h-64">
					<div className="text-center">
						<LoadingSpinner size="lg" className="mx-auto mb-4" />
						<p className="text-gray-600">
							Analizando rendimiento del sistema...
						</p>
					</div>
				</div>
			</div>
		);
	}

	const renderHeader = () => (
		<div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-4">
					<div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
						<RocketLaunchIcon className="h-6 w-6 text-white" />
					</div>
					<div>
						<h1 className="text-2xl font-bold text-gray-900">
							Optimizaciones de Rendimiento
						</h1>
						<p className="text-gray-600">
							Análisis y mejoras de rendimiento del sistema
						</p>
					</div>
				</div>

				<div className="flex items-center gap-3">
					{isOptimizing && (
						<div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
							<LoadingSpinner size="sm" />
							<span className="text-sm text-blue-700">Optimizando...</span>
						</div>
					)}
					<button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
						<BeakerIcon className="h-4 w-4" />
						Ejecutar Tests
					</button>
					<button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
						<WrenchScrewdriverIcon className="h-4 w-4" />
						Optimizar Automático
					</button>
				</div>
			</div>

			{/* Overall Performance Score */}
			{metrics && (
				<div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
					<div className="flex items-center justify-between">
						<div>
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Puntuación de Rendimiento
							</h3>
							<p className="text-sm text-gray-600">
								Basado en métricas de tiempo de carga, memoria y experiencia de
								usuario
							</p>
						</div>
						<div className="text-right">
							<div className="text-4xl font-bold text-blue-600 mb-2">
								{Math.round((metrics.userSatisfaction / 5) * 100)}
							</div>
							<div className="text-sm text-gray-600">de 100 puntos</div>
						</div>
					</div>
					<div className="mt-4">
						<ProgressBar
							progress={(metrics.userSatisfaction / 5) * 100}
							className="h-3"
							color="blue"
						/>
					</div>
				</div>
			)}

			{/* Navigation Tabs */}
			<div className="flex gap-1 bg-gray-100 rounded-lg p-1 mt-6">
				{[
					{key: "dashboard", label: "Dashboard", icon: ChartBarIcon},
					{key: "lazy", label: "Lazy Loading", icon: CloudIcon},
					{key: "virtual", label: "Virtualización", icon: TableCellsIcon},
					{key: "cache", label: "Gestión de Caché", icon: ServerIcon},
				].map(({key, label, icon: Icon}) => (
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
					</button>
				))}
			</div>
		</div>
	);

	const renderDashboard = () => (
		<div>
			{metrics && (
				<PerformanceDashboard
					metrics={metrics}
					suggestions={suggestions}
					onImplementSuggestion={handleImplementSuggestion}
				/>
			)}
		</div>
	);

	const renderLazyLoading = () => (
		<div className="space-y-6">
			<div className="bg-white rounded-xl border border-gray-200 p-6">
				<h3 className="text-lg font-semibold text-gray-900 mb-4">
					Demostración de Lazy Loading
				</h3>
				<p className="text-gray-600 mb-6">
					Los siguientes componentes se cargan dinámicamente para optimizar el
					tiempo de carga inicial.
				</p>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<LazyComponent
						componentName="Módulo de Cálculos Avanzados"
						loadingText="Cargando módulo de cálculos..."
					/>
					<LazyComponent
						componentName="Generador de Reportes"
						loadingText="Cargando generador..."
					/>
					<LazyComponent
						componentName="Editor de Plantillas"
						loadingText="Cargando editor..."
					/>
					<LazyComponent
						componentName="Visualizador 3D"
						loadingText="Cargando visualizador..."
					/>
				</div>
			</div>
		</div>
	);

	const renderVirtualization = () => (
		<div className="space-y-6">
			<div className="bg-white rounded-xl border border-gray-200 p-6">
				<h3 className="text-lg font-semibold text-gray-900 mb-4">
					Lista Virtualizada
				</h3>
				<p className="text-gray-600 mb-6">
					Esta lista maneja eficientemente 10,000 elementos renderizando solo
					los visibles.
				</p>

				<div className="space-y-4">
					<OptimizedSearch
						items={virtualListItems}
						onResults={setFilteredItems}
					/>

					<VirtualList
						items={filteredItems}
						height={400}
						itemHeight={60}
						onItemClick={(item) => console.log("Clicked item:", item)}
					/>
				</div>

				<div className="mt-4 text-sm text-gray-600">
					Mostrando {filteredItems.length} de {virtualListItems.length}{" "}
					elementos
				</div>
			</div>
		</div>
	);

	const renderCache = () => (
		<CacheManager
			cacheEntries={cacheEntries}
			onClearCache={handleClearCache}
			onRefreshCache={handleRefreshCache}
		/>
	);

	return (
		<div className="max-w-7xl mx-auto px-4 py-8">
			{renderHeader()}

			{selectedTab === "dashboard" && renderDashboard()}
			{selectedTab === "lazy" && renderLazyLoading()}
			{selectedTab === "virtual" && renderVirtualization()}
			{selectedTab === "cache" && renderCache()}
		</div>
	);
};

export default PerformanceOptimizations;
