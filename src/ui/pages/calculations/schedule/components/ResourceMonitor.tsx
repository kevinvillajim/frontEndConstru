// src/ui/pages/calculations/schedule/components/ResourceMonitor.tsx
import React, { useState, useEffect } from "react";
import {
  UserGroupIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BellIcon,
  CogIcon,
  PlayIcon,
  PauseIcon,
} from "@heroicons/react/24/outline";
import { Badge, ProgressBar, Alert } from "../../shared/components/SharedComponents";

interface ResourceMonitorData {
  id: string;
  name: string;
  type: "person" | "equipment" | "material";
  currentUtilization: number;
  plannedUtilization: number;
  cost: number;
  status: "available" | "busy" | "overloaded" | "unavailable";
  location?: string;
  currentActivity?: string;
  nextActivity?: string;
  alerts: ResourceAlert[];
  performance: {
    efficiency: number;
    qualityScore: number;
    reliabilityScore: number;
    trend: "up" | "down" | "stable";
  };
  schedule: {
    startTime: string;
    endTime: string;
    breaks: { start: string; end: string; type: string }[];
  };
}

interface ResourceAlert {
  id: string;
  type: "overallocation" | "conflict" | "maintenance" | "availability" | "performance";
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  timestamp: Date;
  autoResolvable: boolean;
  actions?: AlertAction[];
}

interface AlertAction {
  id: string;
  label: string;
  type: "resolve" | "escalate" | "postpone" | "reassign";
  handler: () => void;
}

interface ResourceMonitorProps {
  resources: ResourceMonitorData[];
  onResourceClick?: (resource: ResourceMonitorData) => void;
  onAlertAction?: (alertId: string, actionType: string) => void;
  onConfigChange?: (config: MonitorConfig) => void;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface MonitorConfig {
  alertThresholds: {
    utilizationCritical: number;
    utilizationWarning: number;
    efficiencyWarning: number;
    qualityWarning: number;
  };
  notifications: {
    enabled: boolean;
    types: string[];
    channels: string[];
  };
  display: {
    groupBy: "type" | "location" | "status";
    sortBy: "name" | "utilization" | "alerts" | "performance";
    showInactive: boolean;
  };
}

export const ResourceMonitor: React.FC<ResourceMonitorProps> = ({
  resources,
  onResourceClick,
  onAlertAction,
  onConfigChange,
  autoRefresh = true,
  refreshInterval = 30000,
}) => {
  const [config, setConfig] = useState<MonitorConfig>({
    alertThresholds: {
      utilizationCritical: 95,
      utilizationWarning: 85,
      efficiencyWarning: 70,
      qualityWarning: 80,
    },
    notifications: {
      enabled: true,
      types: ["critical", "high"],
      channels: ["app", "email"],
    },
    display: {
      groupBy: "type",
      sortBy: "utilization",
      showInactive: false,
    },
  });

  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLive, setIsLive] = useState(autoRefresh);
  const [expandedResources, setExpandedResources] = useState<Set<string>>(new Set());

  // Auto-refresh effect
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setLastUpdate(new Date());
      // Here you would refresh data from API
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [isLive, refreshInterval]);

  // Calculate summary statistics
  const summary = {
    total: resources.length,
    available: resources.filter(r => r.status === "available").length,
    busy: resources.filter(r => r.status === "busy").length,
    overloaded: resources.filter(r => r.status === "overloaded").length,
    unavailable: resources.filter(r => r.status === "unavailable").length,
    criticalAlerts: resources.reduce((sum, r) => sum + r.alerts.filter(a => a.severity === "critical").length, 0),
    avgUtilization: resources.reduce((sum, r) => sum + r.currentUtilization, 0) / resources.length,
    totalCost: resources.reduce((sum, r) => sum + r.cost, 0),
  };

  const getStatusColor = (status: ResourceMonitorData["status"]) => {
    switch (status) {
      case "available": return "text-green-600 bg-green-100";
      case "busy": return "text-blue-600 bg-blue-100";
      case "overloaded": return "text-red-600 bg-red-100";
      case "unavailable": return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = (status: ResourceMonitorData["status"]) => {
    switch (status) {
      case "available": return "Disponible";
      case "busy": return "Ocupado";
      case "overloaded": return "Sobrecargado";
      case "unavailable": return "No disponible";
    }
  };

  const getAlertColor = (severity: ResourceAlert["severity"]) => {
    switch (severity) {
      case "critical": return "text-red-600 bg-red-100";
      case "high": return "text-orange-600 bg-orange-100";
      case "medium": return "text-yellow-600 bg-yellow-100";
      case "low": return "text-blue-600 bg-blue-100";
    }
  };

  const getPerformanceTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up": return <ArrowTrendingUpIcon className="h-4 w-4 text-green-600" />;
      case "down": return <ArrowTrendingDownIcon className="h-4 w-4 text-red-600" />;
      case "stable": return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  const groupedResources = resources.reduce((groups, resource) => {
    const key = config.display.groupBy === "type" ? resource.type :
                config.display.groupBy === "location" ? (resource.location || "Sin ubicación") :
                resource.status;
    
    if (!groups[key]) groups[key] = [];
    groups[key].push(resource);
    return groups;
  }, {} as Record<string, ResourceMonitorData[]>);

  const toggleResourceExpansion = (resourceId: string) => {
    const newExpanded = new Set(expandedResources);
    if (newExpanded.has(resourceId)) {
      newExpanded.delete(resourceId);
    } else {
      newExpanded.add(resourceId);
    }
    setExpandedResources(newExpanded);
  };

  return (
    <div className="resource-monitor bg-white rounded-2xl border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <UserGroupIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Monitor de Recursos</h2>
            <p className="text-sm text-gray-600">
              Actualizado: {lastUpdate.toLocaleTimeString('es-EC')}
              {isLive && <span className="ml-2 text-green-600">● En vivo</span>}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              isLive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
            }`}
          >
            {isLive ? <PlayIcon className="h-4 w-4" /> : <PauseIcon className="h-4 w-4" />}
            {isLive ? "En vivo" : "Pausado"}
          </button>
          
          <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
            <CogIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{summary.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-900">{summary.available}</div>
          <div className="text-sm text-green-700">Disponibles</div>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-900">{summary.busy}</div>
          <div className="text-sm text-blue-700">Ocupados</div>
        </div>
        
        <div className="bg-red-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-900">{summary.overloaded}</div>
          <div className="text-sm text-red-700">Sobrecargados</div>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-900">{summary.criticalAlerts}</div>
          <div className="text-sm text-yellow-700">Alertas Críticas</div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-900">{summary.avgUtilization.toFixed(0)}%</div>
          <div className="text-sm text-purple-700">Utilización Media</div>
        </div>
      </div>

      {/* Critical Alerts */}
      {summary.criticalAlerts > 0 && (
        <Alert variant="error" className="mb-6">
          <ExclamationTriangleIcon className="h-5 w-5" />
          <div>
            <strong>Alertas Críticas Detectadas</strong>
            <p className="text-sm mt-1">
              {summary.criticalAlerts} alertas críticas requieren atención inmediata.
            </p>
          </div>
        </Alert>
      )}

      {/* Resource Groups */}
      <div className="space-y-6">
        {Object.entries(groupedResources).map(([groupName, groupResources]) => (
          <div key={groupName} className="space-y-3">
            <h3 className="font-medium text-gray-900 border-b border-gray-200 pb-2">
              {groupName} ({groupResources.length})
            </h3>
            
            <div className="grid gap-4">
              {groupResources.map((resource) => (
                <div
                  key={resource.id}
                  className={`border rounded-lg transition-all cursor-pointer ${
                    resource.alerts.some(a => a.severity === "critical")
                      ? "border-red-300 bg-red-50"
                      : resource.status === "overloaded"
                      ? "border-orange-300 bg-orange-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => onResourceClick?.(resource)}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium text-gray-900">{resource.name}</h4>
                        <Badge className={getStatusColor(resource.status)}>
                          {getStatusText(resource.status)}
                        </Badge>
                        {resource.alerts.length > 0 && (
                          <div className="flex items-center gap-1 text-orange-600">
                            <BellIcon className="h-4 w-4" />
                            <span className="text-xs font-medium">{resource.alerts.length}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {getPerformanceTrendIcon(resource.performance.trend)}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleResourceExpansion(resource.id);
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {expandedResources.has(resource.id) ? "▼" : "▶"}
                        </button>
                      </div>
                    </div>

                    {/* Utilization Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Utilización</span>
                        <span className="font-medium">{resource.currentUtilization.toFixed(1)}%</span>
                      </div>
                      <ProgressBar
                        progress={resource.currentUtilization}
                        color={
                          resource.currentUtilization > config.alertThresholds.utilizationCritical ? "red" :
                          resource.currentUtilization > config.alertThresholds.utilizationWarning ? "yellow" :
                          "green"
                        }
                      />
                    </div>

                    {/* Quick Info */}
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Actividad Actual:</span>
                        <div className="font-medium truncate">
                          {resource.currentActivity || "Sin asignar"}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Eficiencia:</span>
                        <div className="font-medium">{resource.performance.efficiency}%</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Costo:</span>
                        <div className="font-medium">${resource.cost}/h</div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedResources.has(resource.id) && (
                      <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                        {/* Performance Metrics */}
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Métricas de Rendimiento</h5>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Calidad:</span>
                              <div className="font-medium">{resource.performance.qualityScore}%</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Confiabilidad:</span>
                              <div className="font-medium">{resource.performance.reliabilityScore}%</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Ubicación:</span>
                              <div className="font-medium">{resource.location || "N/A"}</div>
                            </div>
                          </div>
                        </div>

                        {/* Schedule */}
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Horario</h5>
                          <div className="text-sm text-gray-600">
                            {resource.schedule.startTime} - {resource.schedule.endTime}
                            {resource.schedule.breaks.length > 0 && (
                              <span className="ml-2">
                                ({resource.schedule.breaks.length} descansos)
                              </span>
                            )}
                          </div>
                          {resource.nextActivity && (
                            <div className="text-sm text-gray-600 mt-1">
                              Próxima actividad: {resource.nextActivity}
                            </div>
                          )}
                        </div>

                        {/* Alerts */}
                        {resource.alerts.length > 0 && (
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">
                              Alertas ({resource.alerts.length})
                            </h5>
                            <div className="space-y-2">
                              {resource.alerts.map((alert) => (
                                <div
                                  key={alert.id}
                                  className={`p-3 rounded-lg border ${
                                    alert.severity === "critical" ? "border-red-300 bg-red-50" :
                                    alert.severity === "high" ? "border-orange-300 bg-orange-50" :
                                    alert.severity === "medium" ? "border-yellow-300 bg-yellow-50" :
                                    "border-blue-300 bg-blue-50"
                                  }`}
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <Badge className={getAlertColor(alert.severity)}>
                                          {alert.severity.toUpperCase()}
                                        </Badge>
                                        <span className="text-xs text-gray-500">
                                          {alert.timestamp.toLocaleTimeString('es-EC')}
                                        </span>
                                      </div>
                                      <p className="text-sm text-gray-900">{alert.message}</p>
                                    </div>
                                    
                                    {alert.actions && alert.actions.length > 0 && (
                                      <div className="flex gap-1 ml-3">
                                        {alert.actions.map((action) => (
                                          <button
                                            key={action.id}
                                            onClick={() => {
                                              action.handler();
                                              onAlertAction?.(alert.id, action.type);
                                            }}
                                            className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                                          >
                                            {action.label}
                                          </button>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {resources.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <UserGroupIcon className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay recursos para monitorear
          </h3>
          <p className="text-gray-600">
            Los recursos aparecerán aquí cuando se asignen a actividades del cronograma
          </p>
        </div>
      )}
    </div>
  );
};

