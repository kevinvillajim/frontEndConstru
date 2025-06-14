// src/ui/pages/calculations/schedule/ScheduleOptimizer.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  BoltIcon,
  ArrowLeftIcon,
  ChartBarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  PlayIcon,
  PauseIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  AdjustmentsHorizontalIcon,
  ArrowPathIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import { LoadingSpinner, ProgressBar, Badge } from "../shared/components/SharedComponents";

// Types
interface OptimizationObjective {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  weight: number;
  priority: "low" | "medium" | "high" | "critical";
}

interface OptimizationConstraint {
  id: string;
  name: string;
  type: "resource" | "time" | "cost" | "quality" | "dependency";
  value: number;
  unit: string;
  flexible: boolean;
}

interface OptimizationResult {
  id: string;
  scenario: string;
  objectives: {
    timeReduction: number;
    costSavings: number;
    resourceEfficiency: number;
    qualityScore: number;
  };
  changes: OptimizationChange[];
  feasibility: number;
  riskScore: number;
  implementationComplexity: "low" | "medium" | "high";
}

interface OptimizationChange {
  id: string;
  type: "resource_reallocation" | "task_sequence" | "duration_adjustment" | "parallel_execution";
  description: string;
  impact: {
    time: number;
    cost: number;
    resources: string[];
  };
  confidence: number;
}

interface OptimizationProgress {
  step: string;
  progress: number;
  status: "running" | "completed" | "error";
  duration: number;
  results?: any;
}

const OPTIMIZATION_OBJECTIVES: OptimizationObjective[] = [
  {
    id: "minimize_duration",
    name: "Minimizar Duración",
    description: "Reducir el tiempo total del proyecto",
    icon: ClockIcon,
    weight: 100,
    priority: "high",
  },
  {
    id: "minimize_cost",
    name: "Minimizar Costos",
    description: "Optimizar el uso de recursos y reducir gastos",
    icon: CurrencyDollarIcon,
    weight: 80,
    priority: "high",
  },
  {
    id: "maximize_efficiency",
    name: "Maximizar Eficiencia",
    description: "Optimizar la utilización de recursos",
    icon: UserGroupIcon,
    weight: 70,
    priority: "medium",
  },
  {
    id: "balance_workload",
    name: "Balancear Carga",
    description: "Distribuir uniformemente el trabajo",
    icon: ChartBarIcon,
    weight: 60,
    priority: "medium",
  },
];

const OPTIMIZATION_ALGORITHMS = [
  {
    id: "genetic",
    name: "Algoritmo Genético",
    description: "Optimización evolutiva para problemas complejos",
    complexity: "high",
    accuracy: "very_high",
    duration: "5-10 min",
  },
  {
    id: "simulated_annealing",
    name: "Recocido Simulado",
    description: "Búsqueda local con escape de óptimos locales",
    complexity: "medium",
    accuracy: "high",
    duration: "3-7 min",
  },
  {
    id: "critical_path",
    name: "Optimización de Ruta Crítica",
    description: "Enfoque clásico basado en CPM",
    complexity: "low",
    accuracy: "medium",
    duration: "1-3 min",
  },
  {
    id: "resource_leveling",
    name: "Nivelación de Recursos",
    description: "Optimización de asignación de recursos",
    complexity: "medium",
    accuracy: "medium",
    duration: "2-5 min",
  },
];

const ScheduleOptimizer: React.FC = () => {
  const { scheduleId } = useParams();
  const navigate = useNavigate();

  const [objectives, setObjectives] = useState<OptimizationObjective[]>(OPTIMIZATION_OBJECTIVES);
  const [constraints, setConstraints] = useState<OptimizationConstraint[]>([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(OPTIMIZATION_ALGORITHMS[0]);
  const [optimizationProgress, setOptimizationProgress] = useState<OptimizationProgress[]>([]);
  const [results, setResults] = useState<OptimizationResult[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedResult, setSelectedResult] = useState<OptimizationResult | null>(null);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  useEffect(() => {
    loadScheduleData();
    initializeConstraints();
  }, [scheduleId]);

  const loadScheduleData = async () => {
    try {
      // Simulate loading schedule data
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Error loading schedule data:", error);
    }
  };

  const initializeConstraints = () => {
    const defaultConstraints: OptimizationConstraint[] = [
      {
        id: "max_duration",
        name: "Duración Máxima",
        type: "time",
        value: 365,
        unit: "días",
        flexible: true,
      },
      {
        id: "budget_limit",
        name: "Límite de Presupuesto",
        type: "cost",
        value: 2500000,
        unit: "USD",
        flexible: false,
      },
      {
        id: "min_workers",
        name: "Trabajadores Mínimos",
        type: "resource",
        value: 5,
        unit: "personas",
        flexible: true,
      },
      {
        id: "max_workers",
        name: "Trabajadores Máximos",
        type: "resource",
        value: 50,
        unit: "personas",
        flexible: false,
      },
    ];
    setConstraints(defaultConstraints);
  };

  const updateObjectiveWeight = (objectiveId: string, weight: number) => {
    setObjectives(prev => prev.map(obj => 
      obj.id === objectiveId ? { ...obj, weight } : obj
    ));
  };

  const updateConstraint = (constraintId: string, value: number) => {
    setConstraints(prev => prev.map(constraint => 
      constraint.id === constraintId ? { ...constraint, value } : constraint
    ));
  };

  const startOptimization = async () => {
    setIsOptimizing(true);
    setCurrentStep(0);
    setResults([]);
    
    const steps = [
      { step: "Análisis de Cronograma", duration: 2000 },
      { step: "Identificación de Dependencias", duration: 1500 },
      { step: "Cálculo de Ruta Crítica", duration: 1000 },
      { step: "Análisis de Recursos", duration: 2500 },
      { step: "Aplicación de Algoritmo", duration: 5000 },
      { step: "Evaluación de Resultados", duration: 1500 },
      { step: "Generación de Escenarios", duration: 2000 },
    ];

    try {
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i);
        
        // Initialize progress
        setOptimizationProgress(prev => [
          ...prev,
          {
            step: steps[i].step,
            progress: 0,
            status: "running",
            duration: 0,
          }
        ]);

        // Simulate progress
        const startTime = Date.now();
        const stepDuration = steps[i].duration;
        
        for (let progress = 0; progress <= 100; progress += 5) {
          await new Promise(resolve => setTimeout(resolve, stepDuration / 20));
          
          setOptimizationProgress(prev => prev.map((p, index) => 
            index === i ? { 
              ...p, 
              progress,
              duration: (Date.now() - startTime) / 1000
            } : p
          ));
        }

        // Mark step as completed
        setOptimizationProgress(prev => prev.map((p, index) => 
          index === i ? { 
            ...p, 
            status: "completed",
            duration: (Date.now() - startTime) / 1000
          } : p
        ));
      }

      // Generate optimization results
      const mockResults: OptimizationResult[] = [
        {
          id: "result-1",
          scenario: "Optimización Agresiva",
          objectives: {
            timeReduction: 23,
            costSavings: 8.5,
            resourceEfficiency: 15,
            qualityScore: 85,
          },
          changes: [
            {
              id: "change-1",
              type: "parallel_execution",
              description: "Ejecutar instalaciones eléctricas y plomería en paralelo",
              impact: { time: -15, cost: 2500, resources: ["Electricistas", "Plomeros"] },
              confidence: 88,
            },
            {
              id: "change-2",
              type: "resource_reallocation",
              description: "Reasignar 2 albañiles a actividades críticas",
              impact: { time: -8, cost: -1200, resources: ["Albañiles"] },
              confidence: 92,
            },
          ],
          feasibility: 85,
          riskScore: 35,
          implementationComplexity: "medium",
        },
        {
          id: "result-2",
          scenario: "Optimización Conservadora",
          objectives: {
            timeReduction: 12,
            costSavings: 12.8,
            resourceEfficiency: 22,
            qualityScore: 95,
          },
          changes: [
            {
              id: "change-3",
              type: "duration_adjustment",
              description: "Extender ligeramente actividades no críticas",
              impact: { time: 5, cost: -8500, resources: [] },
              confidence: 95,
            },
            {
              id: "change-4",
              type: "resource_reallocation",
              description: "Optimizar horarios de equipos pesados",
              impact: { time: -7, cost: -4200, resources: ["Grúa", "Montacargas"] },
              confidence: 90,
            },
          ],
          feasibility: 95,
          riskScore: 15,
          implementationComplexity: "low",
        },
        {
          id: "result-3",
          scenario: "Optimización Balanceada",
          objectives: {
            timeReduction: 18,
            costSavings: 10.2,
            resourceEfficiency: 18,
            qualityScore: 90,
          },
          changes: [
            {
              id: "change-5",
              type: "task_sequence",
              description: "Reordenar secuencia de acabados por niveles",
              impact: { time: -12, cost: -800, resources: ["Pintores", "Instaladores"] },
              confidence: 85,
            },
          ],
          feasibility: 90,
          riskScore: 25,
          implementationComplexity: "medium",
        },
      ];

      setResults(mockResults);
      setSelectedResult(mockResults[0]);
      
    } catch (error) {
      console.error("Error during optimization:", error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const applyOptimization = (resultId: string) => {
    const result = results.find(r => r.id === resultId);
    if (!result) return;

    // Simulate applying optimization
    console.log("Applying optimization result:", result);
    alert(`Optimización "${result.scenario}" aplicada exitosamente`);
    
    // Navigate to Gantt view to show results
    navigate(`/calculations/schedule/gantt/${scheduleId}?optimized=true`);
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "low": return "text-green-600 bg-green-100";
      case "medium": return "text-yellow-600 bg-yellow-100";
      case "high": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getComplexityText = (complexity: string) => {
    switch (complexity) {
      case "low": return "Baja";
      case "medium": return "Media";
      case "high": return "Alta";
      default: return "Desconocida";
    }
  };

  const getRiskColor = (risk: number) => {
    if (risk <= 20) return "text-green-600";
    if (risk <= 40) return "text-yellow-600";
    return "text-red-600";
  };

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
                  Optimizador de Cronogramas
                </h1>
                <p className="text-gray-600">
                  Optimización inteligente mediante algoritmos avanzados
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <AdjustmentsHorizontalIcon className="h-4 w-4 inline mr-2" />
                Configuración Avanzada
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Optimization Objectives */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Objetivos de Optimización
              </h2>
              
              <div className="space-y-4">
                {objectives.map((objective) => {
                  const Icon = objective.icon;
                  return (
                    <div key={objective.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5 text-blue-600" />
                          <span className="font-medium text-gray-900">{objective.name}</span>
                        </div>
                        <span className="text-sm text-gray-600">{objective.weight}%</span>
                      </div>
                      <p className="text-xs text-gray-600">{objective.description}</p>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={objective.weight}
                        onChange={(e) => updateObjectiveWeight(objective.id, parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Algorithm Selection */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Algoritmo de Optimización
              </h2>
              
              <div className="space-y-3">
                {OPTIMIZATION_ALGORITHMS.map((algorithm) => (
                  <div
                    key={algorithm.id}
                    className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedAlgorithm.id === algorithm.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedAlgorithm(algorithm)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900">{algorithm.name}</h3>
                      <Badge className={getComplexityColor(algorithm.complexity)}>
                        {getComplexityText(algorithm.complexity)}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{algorithm.description}</p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Precisión: {algorithm.accuracy.replace('_', ' ')}</span>
                      <span>Duración: {algorithm.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Constraints */}
            {showAdvancedSettings && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Restricciones
                </h2>
                
                <div className="space-y-4">
                  {constraints.map((constraint) => (
                    <div key={constraint.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{constraint.name}</span>
                        <Badge variant={constraint.flexible ? "secondary" : "warning"}>
                          {constraint.flexible ? "Flexible" : "Fija"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={constraint.value}
                          onChange={(e) => updateConstraint(constraint.id, parseFloat(e.target.value))}
                          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <span className="text-sm text-gray-600">{constraint.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Start Optimization */}
            <button
              onClick={startOptimization}
              disabled={isOptimizing}
              className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isOptimizing ? (
                <div className="flex items-center justify-center gap-2">
                  <LoadingSpinner size="sm" />
                  Optimizando...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <BoltIcon className="h-5 w-5" />
                  Iniciar Optimización
                </div>
              )}
            </button>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Optimization Progress */}
            {isOptimizing && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Progreso de Optimización
                </h2>
                
                <div className="space-y-4">
                  {optimizationProgress.map((step, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        step.status === "completed" ? "bg-green-100 text-green-600" :
                        step.status === "running" ? "bg-blue-100 text-blue-600" :
                        "bg-gray-100 text-gray-400"
                      }`}>
                        {step.status === "completed" ? (
                          <CheckCircleIcon className="h-5 w-5" />
                        ) : step.status === "running" ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <ClockIcon className="h-5 w-5" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-gray-900">{step.step}</h3>
                          {step.duration > 0 && (
                            <span className="text-sm text-gray-500">{step.duration.toFixed(1)}s</span>
                          )}
                        </div>
                        {step.status === "running" && (
                          <ProgressBar progress={step.progress} size="sm" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Optimization Results */}
            {results.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Resultados de Optimización
                </h2>
                
                <div className="grid gap-6">
                  {results.map((result) => (
                    <div
                      key={result.id}
                      className={`p-6 border-2 rounded-xl transition-all cursor-pointer ${
                        selectedResult?.id === result.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedResult(result)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{result.scenario}</h3>
                        <div className="flex items-center gap-2">
                          <Badge className={getComplexityColor(result.implementationComplexity)}>
                            Complejidad: {getComplexityText(result.implementationComplexity)}
                          </Badge>
                          <div className={`text-sm font-medium ${getRiskColor(result.riskScore)}`}>
                            Riesgo: {result.riskScore}%
                          </div>
                        </div>
                      </div>

                      {/* Metrics */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                          <ClockIcon className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                          <div className="text-lg font-bold text-gray-900">
                            -{result.objectives.timeReduction}%
                          </div>
                          <div className="text-xs text-gray-600">Tiempo</div>
                        </div>
                        
                        <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                          <CurrencyDollarIcon className="h-6 w-6 text-green-600 mx-auto mb-1" />
                          <div className="text-lg font-bold text-gray-900">
                            -{result.objectives.costSavings}%
                          </div>
                          <div className="text-xs text-gray-600">Costo</div>
                        </div>
                        
                        <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                          <UserGroupIcon className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                          <div className="text-lg font-bold text-gray-900">
                            +{result.objectives.resourceEfficiency}%
                          </div>
                          <div className="text-xs text-gray-600">Eficiencia</div>
                        </div>
                        
                        <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                          <TrophyIcon className="h-6 w-6 text-yellow-600 mx-auto mb-1" />
                          <div className="text-lg font-bold text-gray-900">
                            {result.objectives.qualityScore}%
                          </div>
                          <div className="text-xs text-gray-600">Calidad</div>
                        </div>
                      </div>

                      {/* Changes */}
                      <div className="space-y-2 mb-4">
                        <h4 className="font-medium text-gray-900">Cambios Principales:</h4>
                        {result.changes.slice(0, 2).map((change) => (
                          <div key={change.id} className="text-sm text-gray-600 flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            {change.description}
                            <Badge variant="secondary" className="text-xs">
                              {change.confidence}% confianza
                            </Badge>
                          </div>
                        ))}
                      </div>

                      {/* Feasibility */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Factibilidad:</span>
                          <ProgressBar progress={result.feasibility} size="sm" className="w-20" />
                          <span className="text-sm font-medium">{result.feasibility}%</span>
                        </div>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            applyOptimization(result.id);
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          Aplicar Optimización
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {!isOptimizing && results.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <BoltIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Optimizador Listo
                </h3>
                <p className="text-gray-600">
                  Configura los objetivos y restricciones, luego inicia la optimización
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleOptimizer;