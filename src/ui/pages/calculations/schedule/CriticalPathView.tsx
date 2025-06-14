// src/ui/pages/calculations/schedule/CriticalPathView.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  ClockIcon,
  BoltIcon,
  ArrowRightIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  PlayIcon,
  PauseIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import { LoadingSpinner, ProgressBar, Badge, Alert } from "../shared/components/SharedComponents";

// Types
interface CriticalPathActivity {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  earlyStart: Date;
  earlyFinish: Date;
  lateStart: Date;
  lateFinish: Date;
  totalFloat: number;
  freeFloat: number;
  isCritical: boolean;
  dependencies: string[];
  successors: string[];
  assignedResources: Resource[];
  progress: number;
  status: "not_started" | "in_progress" | "completed" | "delayed";
  riskLevel: "low" | "medium" | "high" | "critical";
}

interface Resource {
  id: string;
  name: string;
  type: "person" | "equipment" | "material";
  cost: number;
}

interface CriticalPathAnalysis {
  totalProjectDuration: number;
  criticalActivities: CriticalPathActivity[];
  nearCriticalActivities: CriticalPathActivity[];
  totalFloat: number;
  criticalityIndex: number;
  riskAssessment: {
    highRiskActivities: number;
    potentialDelays: number;
    recommendedActions: string[];
  };
  alternativePaths: {
    id: string;
    name: string;
    duration: number;
    activities: string[];
    feasibility: number;
  }[];
}

interface FloatOptimization {
  activityId: string;
  activityName: string;
  currentFloat: number;
  optimizedFloat: number;
  potentialSavings: {
    time: number;
    cost: number;
  };
  recommendation: string;
  confidence: number;
}

interface WhatIfScenario {
  id: string;
  name: string;
  description: string;
  changes: {
    activityId: string;
    type: "duration" | "resource" | "dependency";
    change: any;
  }[];
  impact: {
    totalDuration: number;
    criticalPathChange: boolean;
    newCriticalActivities: string[];
    costImpact: number;
  };
}

const CriticalPathView: React.FC = () => {
  const { scheduleId } = useParams();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState<CriticalPathAnalysis | null>(null);
  const [activities, setActivities] = useState<CriticalPathActivity[]>([]);
  const [floatOptimizations, setFloatOptimizations] = useState<FloatOptimization[]>([]);
  const [scenarios, setScenarios] = useState<WhatIfScenario[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<CriticalPathActivity | null>(null);
  const [viewMode, setViewMode] = useState<"network" | "table" | "timeline">("network");
  const [showFloatOptimization, setShowFloatOptimization] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    loadCriticalPathData();
  }, [scheduleId]);

  const loadCriticalPathData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockActivities: CriticalPathActivity[] = [
        {
          id: "act-1",
          name: "Excavación y Cimentación",
          description: "Excavación del terreno y construcción de cimientos",
          startDate: new Date(2024, 6, 1),
          endDate: new Date(2024, 6, 15),
          duration: 14,
          earlyStart: new Date(2024, 6, 1),
          earlyFinish: new Date(2024, 6, 15),
          lateStart: new Date(2024, 6, 1),
          lateFinish: new Date(2024, 6, 15),
          totalFloat: 0,
          freeFloat: 0,
          isCritical: true,
          dependencies: [],
          successors: ["act-2"],
          assignedResources: [
            { id: "res-1", name: "Cuadrilla Excavación", type: "person", cost: 2400 }
          ],
          progress: 85,
          status: "in_progress",
          riskLevel: "medium",
        },
        {
          id: "act-2",
          name: "Estructura Nivel 1-3",
          description: "Construcción de estructura de hormigón niveles 1 al 3",
          startDate: new Date(2024, 6, 16),
          endDate: new Date(2024, 7, 10),
          duration: 25,
          earlyStart: new Date(2024, 6, 16),
          earlyFinish: new Date(2024, 7, 10),
          lateStart: new Date(2024, 6, 16),
          lateFinish: new Date(2024, 7, 10),
          totalFloat: 0,
          freeFloat: 0,
          isCritical: true,
          dependencies: ["act-1"],
          successors: ["act-4"],
          assignedResources: [
            { id: "res-2", name: "Maestro de Obra", type: "person", cost: 3200 },
            { id: "res-3", name: "Grúa Torre", type: "equipment", cost: 4500 }
          ],
          progress: 45,
          status: "in_progress",
          riskLevel: "high",
        },
        {
          id: "act-3",
          name: "Instalaciones Eléctricas Nivel 1",
          description: "Instalación del sistema eléctrico en nivel 1",
          startDate: new Date(2024, 7, 1),
          endDate: new Date(2024, 7, 12),
          duration: 12,
          earlyStart: new Date(2024, 7, 1),
          earlyFinish: new Date(2024, 7, 12),
          lateStart: new Date(2024, 7, 8),
          lateFinish: new Date(2024, 7, 20),
          totalFloat: 7,
          freeFloat: 3,
          isCritical: false,
          dependencies: ["act-2"],
          successors: ["act-5"],
          assignedResources: [
            { id: "res-4", name: "Electricista Especializado", type: "person", cost: 1800 }
          ],
          progress: 20,
          status: "not_started",
          riskLevel: "low",
        },
        {
          id: "act-4",
          name: "Estructura Nivel 4-6",
          description: "Construcción de estructura niveles superiores",
          startDate: new Date(2024, 7, 11),
          endDate: new Date(2024, 8, 5),
          duration: 25,
          earlyStart: new Date(2024, 7, 11),
          earlyFinish: new Date(2024, 8, 5),
          lateStart: new Date(2024, 7, 11),
          lateFinish: new Date(2024, 8, 5),
          totalFloat: 0,
          freeFloat: 0,
          isCritical: true,
          dependencies: ["act-2"],
          successors: ["act-6"],
          assignedResources: [
            { id: "res-2", name: "Maestro de Obra", type: "person", cost: 3200 },
            { id: "res-3", name: "Grúa Torre", type: "equipment", cost: 4500 }
          ],
          progress: 0,
          status: "not_started",
          riskLevel: "high",
        },
      ];

      const mockAnalysis: CriticalPathAnalysis = {
        totalProjectDuration: 125,
        criticalActivities: mockActivities.filter(a => a.isCritical),
        nearCriticalActivities: mockActivities.filter(a => !a.isCritical && a.totalFloat <= 5),
        totalFloat: 0,
        criticalityIndex: 0.75,
        riskAssessment: {
          highRiskActivities: 2,
          potentialDelays: 8,
          recommendedActions: [
            "Reforzar supervisión en actividades de estructura",
            "Preparar recursos de contingencia para grúa",
            "Revisar secuencia de instalaciones eléctricas",
          ],
        },
        alternativePaths: [
          {
            id: "alt-1",
            name: "Ruta Alternativa - Instalaciones Paralelas",
            duration: 115,
            activities: ["act-1", "act-2", "act-3", "act-4"],
            feasibility: 85,
          },
        ],
      };

      const mockOptimizations: FloatOptimization[] = [
        {
          activityId: "act-3",
          activityName: "Instalaciones Eléctricas Nivel 1",
          currentFloat: 7,
          optimizedFloat: 3,
          potentialSavings: { time: 4, cost: 1200 },
          recommendation: "Adelantar inicio de instalaciones eléctricas para crear buffer",
          confidence: 88,
        },
      ];

      setActivities(mockActivities);
      setAnalysis(mockAnalysis);
      setFloatOptimizations(mockOptimizations);
    } catch (error) {
      console.error("Error loading critical path data:", error);
    } finally {
      setLoading(false);
    }
  };

  const recalculateCriticalPath = async () => {
    setIsCalculating(true);
    try {
      // Simulate recalculation
      await new Promise(resolve => setTimeout(resolve, 3000));
      await loadCriticalPathData();
    } catch (error) {
      console.error("Error recalculating critical path:", error);
    } finally {
      setIsCalculating(false);
    }
  };

  const getActivityStatusColor = (status: CriticalPathActivity["status"]) => {
    switch (status) {
      case "completed": return "text-green-600 bg-green-100";
      case "in_progress": return "text-blue-600 bg-blue-100";
      case "delayed": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getActivityStatusText = (status: CriticalPathActivity["status"]) => {
    switch (status) {
      case "completed": return "Completada";
      case "in_progress": return "En Progreso";
      case "delayed": return "Retrasada";
      case "not_started": return "No Iniciada";
      default: return "Desconocido";
    }
  };

  const getRiskColor = (risk: CriticalPathActivity["riskLevel"]) => {
    switch (risk) {
      case "critical": return "text-red-700 bg-red-100 border-red-300";
      case "high": return "text-red-600 bg-red-50 border-red-200";
      case "medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low": return "text-green-600 bg-green-50 border-green-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getRiskText = (risk: CriticalPathActivity["riskLevel"]) => {
    switch (risk) {
      case "critical": return "Crítico";
      case "high": return "Alto";
      case "medium": return "Medio";
      case "low": return "Bajo";
      default: return "Desconocido";
    }
  };

  const applyFloatOptimization = (optimizationId: string) => {
    const optimization = floatOptimizations.find(o => o.activityId === optimizationId);
    if (!optimization) return;

    console.log("Applying float optimization:", optimization);
    alert(`Optimización aplicada: ${optimization.recommendation}`);
    
    // Remove applied optimization
    setFloatOptimizations(prev => prev.filter(o => o.activityId !== optimizationId));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/calculations/schedule")}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Análisis de Ruta Crítica
                </h1>
                <p className="text-gray-600">
                  Identificación y optimización de actividades críticas
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* View Mode Selector */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                {[
                  { value: "network", label: "Red" },
                  { value: "table", label: "Tabla" },
                  { value: "timeline", label: "Timeline" },
                ].map((mode) => (
                  <button
                    key={mode.value}
                    onClick={() => setViewMode(mode.value as any)}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      viewMode === mode.value
                        ? "bg-blue-500 text-white"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowFloatOptimization(!showFloatOptimization)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <AdjustmentsHorizontalIcon className="h-4 w-4 inline mr-2" />
                Optimización Float
              </button>

              <button
                onClick={recalculateCriticalPath}
                disabled={isCalculating}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isCalculating ? (
                  <LoadingSpinner size="sm" className="inline mr-2" />
                ) : (
                  <BoltIcon className="h-4 w-4 inline mr-2" />
                )}
                Recalcular
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Critical Path Summary */}
        {analysis && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Resumen de Ruta Crítica
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="text-center p-4 bg-red-50 rounded-xl border border-red-200">
                <ExclamationTriangleIcon className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-900">{analysis.criticalActivities.length}</div>
                <div className="text-sm text-red-700">Actividades Críticas</div>
              </div>

              <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                <CalendarDaysIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-900">{analysis.totalProjectDuration}</div>
                <div className="text-sm text-blue-700">días de duración</div>
              </div>

              <div className="text-center p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <ChartBarIcon className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-900">{(analysis.criticalityIndex * 100).toFixed(0)}%</div>
                <div className="text-sm text-yellow-700">Índice de Criticidad</div>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                <ClockIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-900">{analysis.nearCriticalActivities.length}</div>
                <div className="text-sm text-green-700">Actividades Cuasi-críticas</div>
              </div>
            </div>

            {/* Risk Assessment */}
            {analysis.riskAssessment.recommendedActions.length > 0 && (
              <Alert variant="warning" className="mb-6">
                <ExclamationTriangleIcon className="h-5 w-5" />
                <div>
                  <strong>Recomendaciones de Riesgo:</strong>
                  <ul className="mt-2 text-sm space-y-1">
                    {analysis.riskAssessment.recommendedActions.map((action, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-amber-600">•</span>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </Alert>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Critical Activities Table */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Actividades de la Ruta Crítica
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actividad
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duración
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Float Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Progreso
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Riesgo
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {activities.map((activity) => (
                      <tr
                        key={activity.id}
                        className={`cursor-pointer transition-colors ${
                          selectedActivity?.id === activity.id ? "bg-blue-50" : "hover:bg-gray-50"
                        } ${activity.isCritical ? "border-l-4 border-red-500" : ""}`}
                        onClick={() => setSelectedActivity(activity)}
                      >
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">{activity.name}</div>
                            <div className="text-sm text-gray-600">{activity.description}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {activity.duration} días
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-sm font-medium ${
                            activity.totalFloat === 0 ? "text-red-600" : 
                            activity.totalFloat <= 3 ? "text-yellow-600" : "text-green-600"
                          }`}>
                            {activity.totalFloat} días
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <ProgressBar progress={activity.progress} size="sm" className="w-16" />
                            <span className="text-sm text-gray-600">{activity.progress}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={getActivityStatusColor(activity.status)}>
                            {getActivityStatusText(activity.status)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={getRiskColor(activity.riskLevel)}>
                            {getRiskText(activity.riskLevel)}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Network Diagram */}
            {viewMode === "network" && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Diagrama de Red
                </h3>
                
                <div className="relative overflow-x-auto">
                  <div className="flex items-center gap-8 min-w-max py-8">
                    {activities.filter(a => a.isCritical).map((activity, index) => (
                      <React.Fragment key={activity.id}>
                        <div
                          className={`relative p-4 border-2 rounded-xl min-w-48 cursor-pointer transition-all ${
                            activity.isCritical ? "border-red-500 bg-red-50" : "border-gray-300 bg-gray-50"
                          } ${selectedActivity?.id === activity.id ? "ring-2 ring-blue-500" : ""}`}
                          onClick={() => setSelectedActivity(activity)}
                        >
                          <div className="text-center">
                            <h4 className="font-semibold text-gray-900 mb-1">{activity.name}</h4>
                            <div className="text-sm text-gray-600 mb-2">
                              Duración: {activity.duration} días
                            </div>
                            <div className="text-xs text-gray-500">
                              Float: {activity.totalFloat} días
                            </div>
                            <ProgressBar progress={activity.progress} className="mt-2" />
                          </div>
                          
                          {/* Status indicator */}
                          <div className={`absolute -top-2 -right-2 w-4 h-4 rounded-full ${
                            activity.status === "completed" ? "bg-green-500" :
                            activity.status === "in_progress" ? "bg-blue-500" :
                            activity.status === "delayed" ? "bg-red-500" : "bg-gray-400"
                          }`} />
                        </div>
                        
                        {index < activities.filter(a => a.isCritical).length - 1 && (
                          <ArrowRightIcon className="h-6 w-6 text-red-500" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Selected Activity Details */}
            {selectedActivity && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Detalles de Actividad
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">{selectedActivity.name}</h4>
                    <p className="text-sm text-gray-600">{selectedActivity.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Inicio Temprano:</span>
                      <div className="font-medium">
                        {selectedActivity.earlyStart.toLocaleDateString('es-EC')}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Fin Temprano:</span>
                      <div className="font-medium">
                        {selectedActivity.earlyFinish.toLocaleDateString('es-EC')}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Inicio Tardío:</span>
                      <div className="font-medium">
                        {selectedActivity.lateStart.toLocaleDateString('es-EC')}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Fin Tardío:</span>
                      <div className="font-medium">
                        {selectedActivity.lateFinish.toLocaleDateString('es-EC')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Float Total:</span>
                      <div className={`font-medium ${
                        selectedActivity.totalFloat === 0 ? "text-red-600" : "text-green-600"
                      }`}>
                        {selectedActivity.totalFloat} días
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Float Libre:</span>
                      <div className="font-medium">{selectedActivity.freeFloat} días</div>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-gray-500 text-sm">Recursos Asignados:</span>
                    <div className="mt-1 space-y-1">
                      {selectedActivity.assignedResources.map((resource) => (
                        <div key={resource.id} className="flex justify-between text-sm">
                          <span>{resource.name}</span>
                          <span className="text-gray-500">${resource.cost}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Float Optimization */}
            {showFloatOptimization && floatOptimizations.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BoltIcon className="h-5 w-5 text-yellow-600" />
                  Optimización de Float
                </h3>
                
                <div className="space-y-4">
                  {floatOptimizations.map((optimization) => (
                    <div
                      key={optimization.activityId}
                      className="p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="font-medium text-sm mb-2">
                        {optimization.activityName}
                      </div>
                      
                      <div className="text-xs text-gray-600 mb-3">
                        {optimization.recommendation}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                        <div>
                          <span className="text-gray-500">Ahorro tiempo:</span>
                          <div className="font-medium">{optimization.potentialSavings.time} días</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Ahorro costo:</span>
                          <div className="font-medium">${optimization.potentialSavings.cost}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {optimization.confidence}% confianza
                        </Badge>
                        
                        <button
                          onClick={() => applyFloatOptimization(optimization.activityId)}
                          className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                          Aplicar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Alternative Paths */}
            {analysis?.alternativePaths && analysis.alternativePaths.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Rutas Alternativas
                </h3>
                
                <div className="space-y-3">
                  {analysis.alternativePaths.map((path) => (
                    <div key={path.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="font-medium text-sm">{path.name}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        Duración: {path.duration} días
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <ProgressBar progress={path.feasibility} size="sm" className="w-16" />
                        <span className="text-xs text-gray-500">{path.feasibility}% factible</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CriticalPathView;