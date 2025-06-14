// src/ui/pages/calculations/schedule/WhatIfAnalyzer.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  BeakerIcon,
  ArrowLeftIcon,
  PlayIcon,
  XMarkIcon,
  PlusIcon,
  ChartBarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { LoadingSpinner, ProgressBar, Badge, Alert } from "../shared/components/SharedComponents";

// Types
interface WhatIfScenario {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  changes: ScenarioChange[];
  results: ScenarioResults;
  createdAt: Date;
  status: "draft" | "running" | "completed" | "error";
}

interface ScenarioChange {
  id: string;
  type: "duration" | "resource" | "dependency" | "cost" | "start_date" | "remove_activity" | "add_activity";
  activityId: string;
  activityName: string;
  changeDescription: string;
  originalValue: any;
  newValue: any;
  confidence: number;
}

interface ScenarioResults {
  duration: {
    original: number;
    new: number;
    change: number;
    changePercent: number;
  };
  cost: {
    original: number;
    new: number;
    change: number;
    changePercent: number;
  };
  criticalPath: {
    changed: boolean;
    newCriticalActivities: string[];
    removedCriticalActivities: string[];
  };
  riskScore: number;
  feasibility: number;
  resourceUtilization: {
    peak: number;
    average: number;
    conflicts: number;
  };
  impactAnalysis: {
    positiveImpacts: string[];
    negativeImpacts: string[];
    recommendations: string[];
  };
}

interface ActivityTemplate {
  id: string;
  name: string;
  description: string;
  typicalDuration: number;
  category: string;
  requiredResources: string[];
  dependencies: string[];
}

interface ComparisonMetric {
  name: string;
  icon: React.ComponentType<any>;
  originalValue: number;
  scenarios: { [scenarioId: string]: number };
  unit: string;
  format: "number" | "currency" | "percentage" | "days";
  higherIsBetter: boolean;
}

const CHANGE_TYPES = [
  { value: "duration", label: "Duración", description: "Cambiar duración de actividad" },
  { value: "resource", label: "Recursos", description: "Modificar asignación de recursos" },
  { value: "dependency", label: "Dependencias", description: "Agregar/quitar dependencias" },
  { value: "start_date", label: "Fecha Inicio", description: "Cambiar fecha de inicio" },
  { value: "cost", label: "Costo", description: "Modificar costo de actividad" },
  { value: "remove_activity", label: "Eliminar", description: "Eliminar actividad del cronograma" },
  { value: "add_activity", label: "Agregar", description: "Agregar nueva actividad" },
];

const WhatIfAnalyzer: React.FC = () => {
  const { scheduleId } = useParams();
  const navigate = useNavigate();

  const [scenarios, setScenarios] = useState<WhatIfScenario[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<WhatIfScenario | null>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [activityTemplates, setActivityTemplates] = useState<ActivityTemplate[]>([]);
  const [showCreateScenario, setShowCreateScenario] = useState(false);
  const [showAddChange, setShowAddChange] = useState(false);
  const [newScenarioName, setNewScenarioName] = useState("");
  const [newScenarioDescription, setNewScenarioDescription] = useState("");
  const [newChange, setNewChange] = useState({
    type: "duration",
    activityId: "",
    changeDescription: "",
    newValue: "",
  });
  const [loading, setLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [comparisonMode, setComparisonMode] = useState(false);

  useEffect(() => {
    loadData();
  }, [scheduleId]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockActivities = [
        { id: "act-1", name: "Excavación y Cimentación", duration: 14, cost: 25000 },
        { id: "act-2", name: "Estructura Nivel 1-3", duration: 25, cost: 85000 },
        { id: "act-3", name: "Instalaciones Eléctricas", duration: 12, cost: 18000 },
        { id: "act-4", name: "Mampostería", duration: 15, cost: 22000 },
      ];

      const mockTemplates: ActivityTemplate[] = [
        {
          id: "template-1",
          name: "Instalación de Ascensor",
          description: "Instalación completa de sistema de ascensor",
          typicalDuration: 8,
          category: "Instalaciones",
          requiredResources: ["Técnico Especializado", "Herramientas Especiales"],
          dependencies: ["Estructura Completada"],
        },
        {
          id: "template-2",
          name: "Sistema de Seguridad",
          description: "Instalación de cámaras y sistema de acceso",
          typicalDuration: 5,
          category: "Tecnología",
          requiredResources: ["Técnico en Seguridad"],
          dependencies: ["Instalaciones Eléctricas"],
        },
      ];

      const mockScenarios: WhatIfScenario[] = [
        {
          id: "scenario-1",
          name: "Aceleración con Recursos Adicionales",
          description: "Añadir recursos para reducir duración del proyecto",
          isActive: false,
          status: "completed",
          createdAt: new Date(2024, 6, 10),
          changes: [
            {
              id: "change-1",
              type: "duration",
              activityId: "act-2",
              activityName: "Estructura Nivel 1-3",
              changeDescription: "Reducir duración añadiendo cuadrilla adicional",
              originalValue: 25,
              newValue: 18,
              confidence: 85,
            },
            {
              id: "change-2",
              type: "resource",
              activityId: "act-2",
              activityName: "Estructura Nivel 1-3",
              changeDescription: "Agregar cuadrilla de hormigón adicional",
              originalValue: "1 cuadrilla",
              newValue: "2 cuadrillas",
              confidence: 90,
            },
          ],
          results: {
            duration: { original: 125, new: 118, change: -7, changePercent: -5.6 },
            cost: { original: 150000, new: 165000, change: 15000, changePercent: 10 },
            criticalPath: {
              changed: true,
              newCriticalActivities: ["act-1", "act-3", "act-4"],
              removedCriticalActivities: ["act-2"],
            },
            riskScore: 35,
            feasibility: 88,
            resourceUtilization: { peak: 95, average: 78, conflicts: 1 },
            impactAnalysis: {
              positiveImpacts: [
                "Reducción significativa en tiempo total",
                "Mantenimiento de calidad en construcción",
              ],
              negativeImpacts: [
                "Incremento del 10% en costos",
                "Posible saturación de supervisión",
              ],
              recommendations: [
                "Considerar supervisor adicional",
                "Evaluar disponibilidad de recursos en el mercado",
              ],
            },
          },
        },
        {
          id: "scenario-2",
          name: "Optimización de Costos",
          description: "Reducir costos mediante optimización de secuencias",
          isActive: false,
          status: "completed",
          createdAt: new Date(2024, 6, 12),
          changes: [
            {
              id: "change-3",
              type: "dependency",
              activityId: "act-3",
              activityName: "Instalaciones Eléctricas",
              changeDescription: "Ejecutar en paralelo con mampostería",
              originalValue: "Secuencial",
              newValue: "Paralelo",
              confidence: 75,
            },
          ],
          results: {
            duration: { original: 125, new: 115, change: -10, changePercent: -8 },
            cost: { original: 150000, new: 142000, change: -8000, changePercent: -5.3 },
            criticalPath: {
              changed: false,
              newCriticalActivities: [],
              removedCriticalActivities: [],
            },
            riskScore: 25,
            feasibility: 92,
            resourceUtilization: { peak: 85, average: 72, conflicts: 0 },
            impactAnalysis: {
              positiveImpacts: [
                "Reducción en tiempo y costos",
                "Mejor utilización de recursos",
              ],
              negativeImpacts: [
                "Posible interferencia entre actividades",
              ],
              recommendations: [
                "Coordinar estrechamente actividades paralelas",
              ],
            },
          },
        },
      ];

      setActivities(mockActivities);
      setActivityTemplates(mockTemplates);
      setScenarios(mockScenarios);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const createScenario = () => {
    if (!newScenarioName.trim()) return;

    const newScenario: WhatIfScenario = {
      id: `scenario-${Date.now()}`,
      name: newScenarioName,
      description: newScenarioDescription,
      isActive: false,
      status: "draft",
      createdAt: new Date(),
      changes: [],
      results: {
        duration: { original: 125, new: 125, change: 0, changePercent: 0 },
        cost: { original: 150000, new: 150000, change: 0, changePercent: 0 },
        criticalPath: { changed: false, newCriticalActivities: [], removedCriticalActivities: [] },
        riskScore: 20,
        feasibility: 95,
        resourceUtilization: { peak: 80, average: 65, conflicts: 0 },
        impactAnalysis: { positiveImpacts: [], negativeImpacts: [], recommendations: [] },
      },
    };

    setScenarios(prev => [...prev, newScenario]);
    setSelectedScenario(newScenario);
    setNewScenarioName("");
    setNewScenarioDescription("");
    setShowCreateScenario(false);
  };

  const addChangeToScenario = () => {
    if (!selectedScenario || !newChange.activityId || !newChange.newValue) return;

    const activity = activities.find(a => a.id === newChange.activityId);
    if (!activity) return;

    const change: ScenarioChange = {
      id: `change-${Date.now()}`,
      type: newChange.type as any,
      activityId: newChange.activityId,
      activityName: activity.name,
      changeDescription: newChange.changeDescription || `Cambio de ${newChange.type} en ${activity.name}`,
      originalValue: newChange.type === "duration" ? activity.duration : activity.cost,
      newValue: newChange.newValue,
      confidence: 80,
    };

    setScenarios(prev => prev.map(scenario => 
      scenario.id === selectedScenario.id
        ? { ...scenario, changes: [...scenario.changes, change] }
        : scenario
    ));

    setSelectedScenario(prev => prev ? { ...prev, changes: [...prev.changes, change] } : null);
    setNewChange({ type: "duration", activityId: "", changeDescription: "", newValue: "" });
    setShowAddChange(false);
  };

  const removeChange = (changeId: string) => {
    if (!selectedScenario) return;

    const updatedScenario = {
      ...selectedScenario,
      changes: selectedScenario.changes.filter(c => c.id !== changeId),
    };

    setScenarios(prev => prev.map(scenario => 
      scenario.id === selectedScenario.id ? updatedScenario : scenario
    ));
    setSelectedScenario(updatedScenario);
  };

  const runAnalysis = async (scenarioId: string) => {
    setIsAnalyzing(true);
    
    // Update scenario status
    setScenarios(prev => prev.map(scenario => 
      scenario.id === scenarioId ? { ...scenario, status: "running" } : scenario
    ));

    try {
      // Simulate analysis
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Generate mock results based on changes
      const scenario = scenarios.find(s => s.id === scenarioId);
      if (!scenario) return;

      const mockResults: ScenarioResults = {
        duration: {
          original: 125,
          new: 125 - (scenario.changes.length * 3), // Simplified calculation
          change: -(scenario.changes.length * 3),
          changePercent: -((scenario.changes.length * 3) / 125) * 100,
        },
        cost: {
          original: 150000,
          new: 150000 + (scenario.changes.length * 5000),
          change: scenario.changes.length * 5000,
          changePercent: ((scenario.changes.length * 5000) / 150000) * 100,
        },
        criticalPath: {
          changed: scenario.changes.length > 1,
          newCriticalActivities: ["act-1", "act-3"],
          removedCriticalActivities: ["act-2"],
        },
        riskScore: Math.min(20 + (scenario.changes.length * 10), 90),
        feasibility: Math.max(95 - (scenario.changes.length * 5), 60),
        resourceUtilization: {
          peak: 80 + (scenario.changes.length * 5),
          average: 65 + (scenario.changes.length * 3),
          conflicts: Math.floor(scenario.changes.length / 2),
        },
        impactAnalysis: {
          positiveImpacts: ["Optimización de recursos", "Mejora en eficiencia"],
          negativeImpacts: ["Incremento en complejidad"],
          recommendations: ["Monitorear recursos críticos"],
        },
      };

      // Update scenario with results
      setScenarios(prev => prev.map(scenario => 
        scenario.id === scenarioId 
          ? { ...scenario, status: "completed", results: mockResults }
          : scenario
      ));

      if (selectedScenario?.id === scenarioId) {
        setSelectedScenario(prev => prev ? { ...prev, status: "completed", results: mockResults } : null);
      }

    } catch (error) {
      console.error("Error running analysis:", error);
      
      setScenarios(prev => prev.map(scenario => 
        scenario.id === scenarioId ? { ...scenario, status: "error" } : scenario
      ));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const deleteScenario = (scenarioId: string) => {
    setScenarios(prev => prev.filter(s => s.id !== scenarioId));
    if (selectedScenario?.id === scenarioId) {
      setSelectedScenario(null);
    }
  };

  const formatValue = (value: number, format: string, unit: string) => {
    switch (format) {
      case "currency":
        return `$${value.toLocaleString()}`;
      case "percentage":
        return `${value.toFixed(1)}%`;
      case "days":
        return `${value} ${unit}`;
      default:
        return `${value} ${unit}`;
    }
  };

  const getChangeIcon = (change: number, higherIsBetter: boolean) => {
    if (change === 0) return null;
    const isPositive = higherIsBetter ? change > 0 : change < 0;
    return isPositive ? (
      <ArrowUpIcon className="h-4 w-4 text-green-600" />
    ) : (
      <ArrowDownIcon className="h-4 w-4 text-red-600" />
    );
  };

  const getChangeColor = (change: number, higherIsBetter: boolean) => {
    if (change === 0) return "text-gray-600";
    const isPositive = higherIsBetter ? change > 0 : change < 0;
    return isPositive ? "text-green-600" : "text-red-600";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const comparisonMetrics: ComparisonMetric[] = [
    {
      name: "Duración Total",
      icon: ClockIcon,
      originalValue: 125,
      scenarios: scenarios.reduce((acc, s) => ({
        ...acc,
        [s.id]: s.results.duration.new
      }), {}),
      unit: "días",
      format: "days",
      higherIsBetter: false,
    },
    {
      name: "Costo Total",
      icon: CurrencyDollarIcon,
      originalValue: 150000,
      scenarios: scenarios.reduce((acc, s) => ({
        ...acc,
        [s.id]: s.results.cost.new
      }), {}),
      unit: "",
      format: "currency",
      higherIsBetter: false,
    },
    {
      name: "Riesgo",
      icon: ExclamationTriangleIcon,
      originalValue: 20,
      scenarios: scenarios.reduce((acc, s) => ({
        ...acc,
        [s.id]: s.results.riskScore
      }), {}),
      unit: "%",
      format: "percentage",
      higherIsBetter: false,
    },
    {
      name: "Factibilidad",
      icon: CheckCircleIcon,
      originalValue: 95,
      scenarios: scenarios.reduce((acc, s) => ({
        ...acc,
        [s.id]: s.results.feasibility
      }), {}),
      unit: "%",
      format: "percentage",
      higherIsBetter: true,
    },
  ];

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
                  Análisis "¿Qué Pasaría Si?"
                </h1>
                <p className="text-gray-600">
                  Simulación de escenarios hipotéticos y análisis de impacto
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setComparisonMode(!comparisonMode)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  comparisonMode
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                }`}
              >
                <ChartBarIcon className="h-4 w-4 inline mr-2" />
                Modo Comparación
              </button>

              <button
                onClick={() => setShowCreateScenario(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <BeakerIcon className="h-4 w-4 inline mr-2" />
                Nuevo Escenario
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Comparison View */}
        {comparisonMode && scenarios.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Comparación de Escenarios
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 pr-4 font-medium text-gray-900">Métrica</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Original</th>
                    {scenarios.map((scenario) => (
                      <th key={scenario.id} className="text-center py-3 px-4 font-medium text-gray-900">
                        {scenario.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonMetrics.map((metric) => {
                    const Icon = metric.icon;
                    return (
                      <tr key={metric.name} className="border-b border-gray-100">
                        <td className="py-4 pr-4">
                          <div className="flex items-center gap-2">
                            <Icon className="h-5 w-5 text-gray-400" />
                            <span className="font-medium text-gray-900">{metric.name}</span>
                          </div>
                        </td>
                        <td className="text-center py-4 px-4 font-medium">
                          {formatValue(metric.originalValue, metric.format, metric.unit)}
                        </td>
                        {scenarios.map((scenario) => {
                          const scenarioValue = metric.scenarios[scenario.id] || metric.originalValue;
                          const change = scenarioValue - metric.originalValue;
                          const changePercent = ((change / metric.originalValue) * 100);
                          
                          return (
                            <td key={scenario.id} className="text-center py-4 px-4">
                              <div className="space-y-1">
                                <div className="font-medium">
                                  {formatValue(scenarioValue, metric.format, metric.unit)}
                                </div>
                                {change !== 0 && (
                                  <div className={`text-xs flex items-center justify-center gap-1 ${
                                    getChangeColor(change, metric.higherIsBetter)
                                  }`}>
                                    {getChangeIcon(change, metric.higherIsBetter)}
                                    {changePercent > 0 ? "+" : ""}{changePercent.toFixed(1)}%
                                  </div>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Scenarios List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Escenarios</h2>
                <span className="text-sm text-gray-600">{scenarios.length} creados</span>
              </div>

              <div className="space-y-3">
                {scenarios.map((scenario) => (
                  <div
                    key={scenario.id}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedScenario?.id === scenario.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedScenario(scenario)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{scenario.name}</h3>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            scenario.status === "completed" ? "success" :
                            scenario.status === "running" ? "warning" :
                            scenario.status === "error" ? "error" : "secondary"
                          }
                          className="text-xs"
                        >
                          {scenario.status === "completed" && "Completado"}
                          {scenario.status === "running" && "Ejecutando"}
                          {scenario.status === "error" && "Error"}
                          {scenario.status === "draft" && "Borrador"}
                        </Badge>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteScenario(scenario.id);
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{scenario.changes.length} cambios</span>
                      <span className="text-gray-500">
                        {scenario.createdAt.toLocaleDateString('es-EC')}
                      </span>
                    </div>

                    {scenario.status === "completed" && (
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <div className={`text-center ${getChangeColor(scenario.results.duration.change, false)}`}>
                          <div className="font-medium">
                            {scenario.results.duration.change > 0 ? "+" : ""}
                            {scenario.results.duration.change} días
                          </div>
                          <div className="text-gray-500">Duración</div>
                        </div>
                        <div className={`text-center ${getChangeColor(scenario.results.cost.change, false)}`}>
                          <div className="font-medium">
                            {scenario.results.cost.changePercent > 0 ? "+" : ""}
                            {scenario.results.cost.changePercent.toFixed(1)}%
                          </div>
                          <div className="text-gray-500">Costo</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scenario Details */}
          <div className="lg:col-span-2">
            {selectedScenario ? (
              <div className="space-y-6">
                {/* Scenario Header */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{selectedScenario.name}</h2>
                      <p className="text-gray-600">{selectedScenario.description}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {selectedScenario.status === "draft" && (
                        <button
                          onClick={() => runAnalysis(selectedScenario.id)}
                          disabled={isAnalyzing || selectedScenario.changes.length === 0}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isAnalyzing ? (
                            <LoadingSpinner size="sm" className="inline mr-2" />
                          ) : (
                            <PlayIcon className="h-4 w-4 inline mr-2" />
                          )}
                          Ejecutar Análisis
                        </button>
                      )}
                      
                      <button
                        onClick={() => setShowAddChange(true)}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <PlusIcon className="h-4 w-4 inline mr-2" />
                        Agregar Cambio
                      </button>
                    </div>
                  </div>
                </div>

                {/* Changes */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Cambios Propuestos ({selectedScenario.changes.length})
                  </h3>
                  
                  {selectedScenario.changes.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No hay cambios definidos para este escenario
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedScenario.changes.map((change) => (
                        <div key={change.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="secondary" className="text-xs">
                                {CHANGE_TYPES.find(t => t.value === change.type)?.label}
                              </Badge>
                              <span className="font-medium text-gray-900">{change.activityName}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{change.changeDescription}</p>
                            <div className="text-xs text-gray-500">
                              {change.originalValue} → {change.newValue}
                              <span className="ml-2">
                                ({change.confidence}% confianza)
                              </span>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => removeChange(change.id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Results */}
                {selectedScenario.status === "completed" && (
                  <div className="space-y-6">
                    {/* Impact Summary */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Resumen de Impacto</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="text-center p-4 bg-blue-50 rounded-xl">
                          <ClockIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                          <div className={`text-2xl font-bold ${getChangeColor(selectedScenario.results.duration.change, false)}`}>
                            {selectedScenario.results.duration.change > 0 ? "+" : ""}
                            {selectedScenario.results.duration.change}
                          </div>
                          <div className="text-sm text-blue-700">días</div>
                        </div>
                        
                        <div className="text-center p-4 bg-green-50 rounded-xl">
                          <CurrencyDollarIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                          <div className={`text-2xl font-bold ${getChangeColor(selectedScenario.results.cost.changePercent, false)}`}>
                            {selectedScenario.results.cost.changePercent > 0 ? "+" : ""}
                            {selectedScenario.results.cost.changePercent.toFixed(1)}%
                          </div>
                          <div className="text-sm text-green-700">costo</div>
                        </div>
                        
                        <div className="text-center p-4 bg-yellow-50 rounded-xl">
                          <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-yellow-900">
                            {selectedScenario.results.riskScore}%
                          </div>
                          <div className="text-sm text-yellow-700">riesgo</div>
                        </div>
                        
                        <div className="text-center p-4 bg-purple-50 rounded-xl">
                          <CheckCircleIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-purple-900">
                            {selectedScenario.results.feasibility}%
                          </div>
                          <div className="text-sm text-purple-700">factibilidad</div>
                        </div>
                      </div>

                      {/* Impact Analysis */}
                      {selectedScenario.results.impactAnalysis && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2 text-green-700">
                              Impactos Positivos
                            </h4>
                            <ul className="space-y-1">
                              {selectedScenario.results.impactAnalysis.positiveImpacts.map((impact, index) => (
                                <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                                  <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                  {impact}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2 text-red-700">
                              Impactos Negativos
                            </h4>
                            <ul className="space-y-1">
                              {selectedScenario.results.impactAnalysis.negativeImpacts.map((impact, index) => (
                                <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                                  <ExclamationTriangleIcon className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                                  {impact}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <BeakerIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Selecciona un Escenario
                </h3>
                <p className="text-gray-600 mb-6">
                  Elige un escenario de la lista o crea uno nuevo para comenzar el análisis
                </p>
                <button
                  onClick={() => setShowCreateScenario(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <PlusIcon className="h-5 w-5 inline mr-2" />
                  Crear Primer Escenario
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Scenario Modal */}
      {showCreateScenario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Crear Nuevo Escenario
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Escenario
                </label>
                <input
                  type="text"
                  value={newScenarioName}
                  onChange={(e) => setNewScenarioName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Aceleración con recursos adicionales"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={newScenarioDescription}
                  onChange={(e) => setNewScenarioDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe el objetivo de este escenario..."
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateScenario(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={createScenario}
                disabled={!newScenarioName.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Crear Escenario
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Change Modal */}
      {showAddChange && selectedScenario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Agregar Cambio al Escenario
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Cambio
                </label>
                <select
                  value={newChange.type}
                  onChange={(e) => setNewChange(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {CHANGE_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label} - {type.description}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Actividad
                </label>
                <select
                  value={newChange.activityId}
                  onChange={(e) => setNewChange(prev => ({ ...prev, activityId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccionar actividad</option>
                  {activities.map((activity) => (
                    <option key={activity.id} value={activity.id}>
                      {activity.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nuevo Valor
                </label>
                <input
                  type="text"
                  value={newChange.newValue}
                  onChange={(e) => setNewChange(prev => ({ ...prev, newValue: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: 18 días, 2 cuadrillas, etc."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción del Cambio
                </label>
                <input
                  type="text"
                  value={newChange.changeDescription}
                  onChange={(e) => setNewChange(prev => ({ ...prev, changeDescription: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe el cambio propuesto..."
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddChange(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={addChangeToScenario}
                disabled={!newChange.activityId || !newChange.newValue}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Agregar Cambio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatIfAnalyzer;