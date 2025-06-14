// src/ui/pages/calculations/schedule/components/ScheduleAlerts.tsx
import React, { useState, useEffect } from "react";
import {
  BellIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  XMarkIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  CogIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { Badge } from "../../shared/components/SharedComponents";

interface ScheduleAlert {
  id: string;
  type: "delay" | "resource_conflict" | "critical_path" | "budget_impact" | "weather" | "quality" | "safety";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  message: string;
  activityId?: string;
  activityName?: string;
  resourceId?: string;
  resourceName?: string;
  timestamp: Date;
  isRead: boolean;
  isResolved: boolean;
  isPredictive: boolean;
  impact: {
    timeImpact: number; // in days
    costImpact: number; // in currency
    qualityImpact: number; // percentage
  };
  recommendations: AlertRecommendation[];
  autoActions: AlertAutoAction[];
  relatedAlerts: string[];
}

interface AlertRecommendation {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  effort: "low" | "medium" | "high";
  confidence: number;
  estimatedBenefit: {
    time: number;
    cost: number;
    quality: number;
  };
}

interface AlertAutoAction {
  id: string;
  name: string;
  description: string;
  canExecute: boolean;
  requiresConfirmation: boolean;
  estimatedDuration: number;
}

interface ScheduleAlertsProps {
  alerts: ScheduleAlert[];
  onAlertRead?: (alertId: string) => void;
  onAlertResolve?: (alertId: string) => void;
  onAlertDismiss?: (alertId: string) => void;
  onRecommendationApply?: (alertId: string, recommendationId: string) => void;
  onAutoActionExecute?: (alertId: string, actionId: string) => void;
  isVisible: boolean;
  onToggleVisibility: () => void;
  maxHeight?: string;
}

export const ScheduleAlerts: React.FC<ScheduleAlertsProps> = ({
  alerts,
  onAlertRead,
  onAlertResolve,
  onAlertDismiss,
  onRecommendationApply,
  onAutoActionExecute,
  isVisible,
  onToggleVisibility,
  maxHeight = "400px",
}) => {
  const [filter, setFilter] = useState<"all" | "unread" | "critical" | "active">("active");
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Group alerts by severity and read status
  const groupedAlerts = {
    critical: alerts.filter(a => a.severity === "critical" && !a.isResolved),
    high: alerts.filter(a => a.severity === "high" && !a.isResolved),
    medium: alerts.filter(a => a.severity === "medium" && !a.isResolved),
    low: alerts.filter(a => a.severity === "low" && !a.isResolved),
    unread: alerts.filter(a => !a.isRead && !a.isResolved),
    resolved: alerts.filter(a => a.isResolved),
  };

  const filteredAlerts = (() => {
    switch (filter) {
      case "unread": return groupedAlerts.unread;
      case "critical": return groupedAlerts.critical;
      case "active": return alerts.filter(a => !a.isResolved);
      default: return alerts;
    }
  })();

  // Sound notification for new critical alerts
  useEffect(() => {
    if (soundEnabled && groupedAlerts.critical.some(a => !a.isRead)) {
      // Play notification sound
      const audio = new Audio("/notification.mp3");
      audio.play().catch(() => {
        // Handle audio play failure silently
      });
    }
  }, [groupedAlerts.critical, soundEnabled]);

  const getAlertIcon = (type: ScheduleAlert["type"]) => {
    switch (type) {
      case "delay": return ClockIcon;
      case "resource_conflict": return ExclamationTriangleIcon;
      case "critical_path": return ExclamationTriangleIcon;
      case "budget_impact": return ExclamationTriangleIcon;
      case "weather": return ExclamationTriangleIcon;
      case "quality": return ExclamationTriangleIcon;
      case "safety": return ExclamationTriangleIcon;
      default: return BellIcon;
    }
  };

  const getAlertColor = (severity: ScheduleAlert["severity"], isRead: boolean) => {
    const opacity = isRead ? "opacity-75" : "";
    switch (severity) {
      case "critical": return `text-red-600 bg-red-100 ${opacity}`;
      case "high": return `text-orange-600 bg-orange-100 ${opacity}`;
      case "medium": return `text-yellow-600 bg-yellow-100 ${opacity}`;
      case "low": return `text-blue-600 bg-blue-100 ${opacity}`;
    }
  };

  const getSeverityText = (severity: ScheduleAlert["severity"]) => {
    switch (severity) {
      case "critical": return "Crítico";
      case "high": return "Alto";
      case "medium": return "Medio";
      case "low": return "Bajo";
    }
  };

  const getTypeText = (type: ScheduleAlert["type"]) => {
    switch (type) {
      case "delay": return "Retraso";
      case "resource_conflict": return "Conflicto de Recursos";
      case "critical_path": return "Ruta Crítica";
      case "budget_impact": return "Impacto Presupuestario";
      case "weather": return "Condiciones Climáticas";
      case "quality": return "Calidad";
      case "safety": return "Seguridad";
      default: return "General";
    }
  };

  const handleAlertClick = (alert: ScheduleAlert) => {
    if (!alert.isRead) {
      onAlertRead?.(alert.id);
    }
    
    if (expandedAlert === alert.id) {
      setExpandedAlert(null);
    } else {
      setExpandedAlert(alert.id);
    }
  };

  const unreadCount = groupedAlerts.unread.length;
  const criticalCount = groupedAlerts.critical.length;

  if (!isVisible) {
    return (
      <button
        onClick={onToggleVisibility}
        className={`fixed bottom-4 right-4 p-3 rounded-full shadow-lg transition-all z-50 ${
          criticalCount > 0 ? "bg-red-600 text-white animate-pulse" :
          unreadCount > 0 ? "bg-orange-600 text-white" :
          "bg-blue-600 text-white"
        }`}
      >
        <BellIcon className="h-6 w-6" />
        {(unreadCount > 0 || criticalCount > 0) && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
            {criticalCount > 0 ? criticalCount : unreadCount}
          </div>
        )}
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white border border-gray-200 rounded-2xl shadow-xl z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <BellIcon className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">
            Alertas del Cronograma
          </h3>
          {unreadCount > 0 && (
            <Badge variant="error" className="text-xs">
              {unreadCount} nuevas
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-1 rounded transition-colors ${
              soundEnabled ? "text-blue-600" : "text-gray-400"
            }`}
            title={soundEnabled ? "Deshabilitar sonido" : "Habilitar sonido"}
          >
            {soundEnabled ? <EyeIcon className="h-4 w-4" /> : <EyeSlashIcon className="h-4 w-4" />}
          </button>
          
          <button className="p-1 text-gray-600 hover:text-gray-800 transition-colors">
            <CogIcon className="h-4 w-4" />
          </button>
          
          <button
            onClick={onToggleVisibility}
            className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-gray-200">
        {[
          { key: "active", label: "Activas", count: alerts.filter(a => !a.isResolved).length },
          { key: "critical", label: "Críticas", count: criticalCount },
          { key: "unread", label: "No leídas", count: unreadCount },
          { key: "all", label: "Todas", count: alerts.length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
              filter === tab.key
                ? "bg-blue-50 text-blue-700 border-b-2 border-blue-500"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
                filter === tab.key ? "bg-blue-200" : "bg-gray-200"
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Alert List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredAlerts.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <BellIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">No hay alertas {filter !== "all" ? filter : ""}</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredAlerts.map((alert) => {
              const Icon = getAlertIcon(alert.type);
              const isExpanded = expandedAlert === alert.id;
              
              return (
                <div
                  key={alert.id}
                  className={`border rounded-lg transition-all cursor-pointer ${
                    alert.severity === "critical" ? "border-red-300 bg-red-50" :
                    alert.severity === "high" ? "border-orange-300 bg-orange-50" :
                    alert.severity === "medium" ? "border-yellow-300 bg-yellow-50" :
                    "border-gray-200 bg-white"
                  } ${!alert.isRead ? "shadow-md" : ""}`}
                  onClick={() => handleAlertClick(alert)}
                >
                  <div className="p-3">
                    <div className="flex items-start gap-3">
                      <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                        alert.severity === "critical" ? "text-red-600" :
                        alert.severity === "high" ? "text-orange-600" :
                        alert.severity === "medium" ? "text-yellow-600" :
                        "text-blue-600"
                      }`} />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`text-sm font-medium ${
                            alert.isRead ? "text-gray-700" : "text-gray-900"
                          }`}>
                            {alert.title}
                          </h4>
                          
                          <div className="flex items-center gap-2">
                            {alert.isPredictive && (
                              <Badge variant="info" className="text-xs">
                                Predictiva
                              </Badge>
                            )}
                            <Badge className={getAlertColor(alert.severity, alert.isRead)}>
                              {getSeverityText(alert.severity)}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className={`text-xs mb-2 ${
                          alert.isRead ? "text-gray-600" : "text-gray-700"
                        }`}>
                          {alert.message}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{getTypeText(alert.type)}</span>
                          <span>{alert.timestamp.toLocaleTimeString('es-EC')}</span>
                        </div>
                        
                        {alert.activityName && (
                          <div className="mt-1 text-xs text-gray-600">
                            Actividad: {alert.activityName}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Impact Summary */}
                    {(alert.impact.timeImpact > 0 || alert.impact.costImpact > 0) && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <div className="flex gap-4 text-xs">
                          {alert.impact.timeImpact > 0 && (
                            <span className="text-red-600">
                              +{alert.impact.timeImpact} días
                            </span>
                          )}
                          {alert.impact.costImpact > 0 && (
                            <span className="text-red-600">
                              +${alert.impact.costImpact.toLocaleString()}
                            </span>
                          )}
                          {alert.impact.qualityImpact > 0 && (
                            <span className="text-red-600">
                              -{alert.impact.qualityImpact}% calidad
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-gray-200 space-y-3">
                        {/* Auto Actions */}
                        {alert.autoActions.length > 0 && (
                          <div>
                            <h5 className="text-xs font-medium text-gray-900 mb-2">
                              Acciones Automáticas
                            </h5>
                            <div className="space-y-1">
                              {alert.autoActions.map((action) => (
                                <button
                                  key={action.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onAutoActionExecute?.(alert.id, action.id);
                                  }}
                                  disabled={!action.canExecute}
                                  className="w-full text-left p-2 text-xs bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <div className="font-medium">{action.name}</div>
                                  <div className="text-gray-600">{action.description}</div>
                                  <div className="text-gray-500">
                                    Duración estimada: {action.estimatedDuration}min
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Recommendations */}
                        {alert.recommendations.length > 0 && (
                          <div>
                            <h5 className="text-xs font-medium text-gray-900 mb-2">
                              Recomendaciones
                            </h5>
                            <div className="space-y-1">
                              {alert.recommendations.slice(0, 2).map((rec) => (
                                <div
                                  key={rec.id}
                                  className="p-2 bg-gray-50 border border-gray-200 rounded"
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-medium">{rec.title}</span>
                                    <Badge
                                      variant={rec.priority === "high" ? "error" : 
                                              rec.priority === "medium" ? "warning" : "info"}
                                      className="text-xs"
                                    >
                                      {rec.priority}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-gray-600 mb-2">{rec.description}</p>
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">
                                      {rec.confidence}% confianza
                                    </span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onRecommendationApply?.(alert.id, rec.id);
                                      }}
                                      className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                    >
                                      Aplicar
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          {!alert.isResolved && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onAlertResolve?.(alert.id);
                              }}
                              className="flex-1 px-3 py-2 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                            >
                              <CheckCircleIcon className="h-3 w-3 inline mr-1" />
                              Resolver
                            </button>
                          )}
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onAlertDismiss?.(alert.id);
                            }}
                            className="flex-1 px-3 py-2 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                          >
                            <XMarkIcon className="h-3 w-3 inline mr-1" />
                            Descartar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};