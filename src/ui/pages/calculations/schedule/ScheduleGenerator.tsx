// src/ui/pages/calculations/schedule/ScheduleGenerator.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  DocumentTextIcon,
  CalendarDaysIcon,
  ClockIcon,
  BuildingOfficeIcon,
  WrenchScrewdriverIcon,
  UserGroupIcon,
  BoltIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";
import { LoadingSpinner, ProgressBar, Badge, Alert } from "../shared/components/SharedComponents";
import { useScheduleGeneration } from "../shared/hooks/useScheduleGeneration";

// Types
interface BudgetForSchedule {
  id: string;
  name: string;
  projectId: string;
  projectName: string;
  status: "approved" | "final";
  totalCost: number;
  items: BudgetItem[];
  approvedAt: Date;
  currency: string;
}

interface BudgetItem {
  id: string;
  category: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalCost: number;
  laborHours?: number;
  materialType?: string;
  dependencies?: string[];
}

interface ScheduleTemplate {
  id: string;
  name: string;
  description: string;
  projectType: string;
  geographicalZone: string;
  estimatedDuration: number;
  baseActivities: number;
  complexity: "simple" | "moderate" | "complex";
  verified: boolean;
  usageCount: number;
}

interface GenerationConfig {
  templateId: string;
  projectType: string;
  geographicalZone: string;
  startDate: Date;
  workingDays: number[];
  workingHours: {
    start: string;
    end: string;
  };
  weatherFactors: boolean;
  holidaysRegion: string;
  bufferPercentage: number;
  resourceOptimization: boolean;
  criticalPathFocus: boolean;
  phaseBreakdown: boolean;
}

interface GenerationStep {
  id: string;
  name: string;
  description: string;
  status: "pending" | "active" | "completed" | "error";
  progress: number;
  result?: any;
  duration?: number;
}

const PROJECT_TYPES = [
  { value: "RESIDENTIAL_SINGLE", label: "Casa Unifamiliar" },
  { value: "RESIDENTIAL_MULTI", label: "Edificio Residencial" },
  { value: "COMMERCIAL_SMALL", label: "Comercial Pequeño" },
  { value: "COMMERCIAL_LARGE", label: "Comercial Grande" },
  { value: "INDUSTRIAL", label: "Industrial" },
  { value: "INFRASTRUCTURE", label: "Infraestructura" },
  { value: "RENOVATION", label: "Renovación" },
];

const GEOGRAPHICAL_ZONES = [
  { value: "QUITO", label: "Quito" },
  { value: "GUAYAQUIL", label: "Guayaquil" },
  { value: "CUENCA", label: "Cuenca" },
  { value: "COSTA", label: "Costa" },
  { value: "SIERRA", label: "Sierra" },
  { value: "ORIENTE", label: "Oriente" },
];

const WORKING_DAYS = [
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sábado" },
  { value: 0, label: "Domingo" },
];

const ScheduleGenerator: React.FC = () => {
  const navigate = useNavigate();
  const { budgetId } = useParams();
  const [searchParams] = useSearchParams();
  
  const {
    availableBudgets,
    scheduleTemplates,
    generationSteps,
    isGenerating,
    generatedSchedule,
    loadBudgets,
    loadTemplates,
    generateSchedule,
    resetGeneration,
  } = useScheduleGeneration();

  const [selectedBudget, setSelectedBudget] = useState<BudgetForSchedule | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [config, setConfig] = useState<GenerationConfig>({
    templateId: "",
    projectType: "",
    geographicalZone: "QUITO",
    startDate: new Date(),
    workingDays: [1, 2, 3, 4, 5],
    workingHours: { start: "08:00", end: "17:00" },
    weatherFactors: true,
    holidaysRegion: "EC",
    bufferPercentage: 10,
    resourceOptimization: true,
    criticalPathFocus: true,
    phaseBreakdown: true,
  });

  useEffect(() => {
    loadBudgets();
    loadTemplates();
    
    // If budgetId is provided in URL, auto-select it
    const fromBudget = searchParams.get("fromBudget");
    if (budgetId || fromBudget) {
      // Auto-select budget and move to step 2
      setCurrentStep(2);
    }
  }, [budgetId, searchParams]);

  useEffect(() => {
    if (budgetId && availableBudgets.length > 0) {
      const budget = availableBudgets.find(b => b.id === budgetId);
      if (budget) {
        setSelectedBudget(budget);
        // Auto-detect project type from budget
        detectProjectType(budget);
      }
    }
  }, [budgetId, availableBudgets]);

  const detectProjectType = (budget: BudgetForSchedule) => {
    // Simple logic to detect project type based on budget items
    const hasStructural = budget.items.some(item => 
      item.category.toLowerCase().includes("estructura") ||
      item.description.toLowerCase().includes("concreto")
    );
    
    const hasMultipleFloors = budget.items.some(item =>
      item.description.toLowerCase().includes("piso") ||
      item.description.toLowerCase().includes("nivel")
    );

    let detectedType = "RESIDENTIAL_SINGLE";
    if (hasStructural && hasMultipleFloors) {
      detectedType = "RESIDENTIAL_MULTI";
    }

    setConfig(prev => ({ ...prev, projectType: detectedType }));
  };

  const handleBudgetSelect = (budget: BudgetForSchedule) => {
    setSelectedBudget(budget);
    detectProjectType(budget);
    setCurrentStep(2);
  };

  const handleTemplateSelect = (template: ScheduleTemplate) => {
    setConfig(prev => ({
      ...prev,
      templateId: template.id,
      projectType: template.projectType,
      geographicalZone: template.geographicalZone,
    }));
    setCurrentStep(3);
  };

  const handleConfigurationUpdate = (updates: Partial<GenerationConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const handleGenerate = async () => {
    if (!selectedBudget) return;
    
    try {
      await generateSchedule(selectedBudget.id, config);
      setCurrentStep(5);
    } catch (error) {
      console.error("Error generating schedule:", error);
    }
  };

  const getStepStatus = (step: number) => {
    if (step < currentStep) return "completed";
    if (step === currentStep) return "active";
    return "pending";
  };

  const getStepIcon = (step: number) => {
    const status = getStepStatus(step);
    if (status === "completed") return CheckCircleIcon;
    if (status === "active") return PlayIcon;
    return ClockIcon;
  };

  const renderStepIndicator = () => (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between">
        {[
          { num: 1, title: "Seleccionar Presupuesto" },
          { num: 2, title: "Elegir Template" },
          { num: 3, title: "Configuración" },
          { num: 4, title: "Generación" },
          { num: 5, title: "Resultado" },
        ].map((step, index) => {
          const Icon = getStepIcon(step.num);
          const status = getStepStatus(step.num);
          
          return (
            <React.Fragment key={step.num}>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  status === "completed" ? "bg-green-500 text-white" :
                  status === "active" ? "bg-blue-500 text-white" :
                  "bg-gray-200 text-gray-500"
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={`text-sm font-medium ${
                  status === "active" ? "text-blue-600" : "text-gray-600"
                }`}>
                  {step.title}
                </span>
              </div>
              {index < 4 && (
                <div className={`flex-1 h-px mx-4 ${
                  getStepStatus(step.num + 1) !== "pending" ? "bg-green-300" : "bg-gray-200"
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Seleccionar Presupuesto Base
      </h2>
      
      {selectedBudget && (
        <Alert variant="info" className="mb-6">
          <DocumentTextIcon className="h-5 w-5" />
          <div>
            <strong>Presupuesto preseleccionado:</strong> {selectedBudget.name}
            <br />
            <span className="text-sm">Puedes cambiarlo seleccionando otro de la lista</span>
          </div>
        </Alert>
      )}

      <div className="grid gap-4">
        {availableBudgets.map((budget) => (
          <div
            key={budget.id}
            className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
              selectedBudget?.id === budget.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
            onClick={() => handleBudgetSelect(budget)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{budget.name}</h3>
                <p className="text-sm text-gray-600">{budget.projectName}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span>Total: ${budget.totalCost.toLocaleString()}</span>
                  <span>Items: {budget.items.length}</span>
                  <span>Aprobado: {budget.approvedAt.toLocaleDateString('es-EC')}</span>
                </div>
              </div>
              <Badge variant={budget.status === "final" ? "success" : "warning"}>
                {budget.status === "final" ? "Final" : "Aprobado"}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {selectedBudget && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setCurrentStep(2)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continuar
          </button>
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Seleccionar Template de Cronograma
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scheduleTemplates.map((template) => (
          <div
            key={template.id}
            className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
              config.templateId === template.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
            onClick={() => handleTemplateSelect(template)}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-gray-900">{template.name}</h3>
              {template.verified && (
                <Badge variant="success" className="text-xs">Verificado</Badge>
              )}
            </div>
            
            <p className="text-sm text-gray-600 mb-4">{template.description}</p>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Duración estimada:</span>
                <span className="text-gray-900">{template.estimatedDuration} días</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Actividades base:</span>
                <span className="text-gray-900">{template.baseActivities}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Complejidad:</span>
                <Badge 
                  variant={template.complexity === "simple" ? "success" : 
                          template.complexity === "moderate" ? "warning" : "error"}
                  className="text-xs"
                >
                  {template.complexity === "simple" ? "Simple" :
                   template.complexity === "moderate" ? "Moderada" : "Compleja"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Uso:</span>
                <span className="text-gray-900">{template.usageCount} veces</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {config.templateId && (
        <div className="mt-6 flex justify-between">
          <button
            onClick={() => setCurrentStep(1)}
            className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4 inline mr-2" />
            Anterior
          </button>
          <button
            onClick={() => setCurrentStep(3)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continuar
          </button>
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Configuración del Cronograma
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Configuration */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Proyecto
            </label>
            <select
              value={config.projectType}
              onChange={(e) => handleConfigurationUpdate({ projectType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar tipo</option>
              {PROJECT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zona Geográfica
            </label>
            <select
              value={config.geographicalZone}
              onChange={(e) => handleConfigurationUpdate({ geographicalZone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {GEOGRAPHICAL_ZONES.map((zone) => (
                <option key={zone.value} value={zone.value}>
                  {zone.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Inicio
            </label>
            <input
              type="date"
              value={config.startDate.toISOString().split('T')[0]}
              onChange={(e) => handleConfigurationUpdate({ 
                startDate: new Date(e.target.value)
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Días Laborables
            </label>
            <div className="grid grid-cols-4 gap-2">
              {WORKING_DAYS.map((day) => (
                <label key={day.value} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.workingDays.includes(day.value)}
                    onChange={(e) => {
                      const days = e.target.checked
                        ? [...config.workingDays, day.value]
                        : config.workingDays.filter(d => d !== day.value);
                      handleConfigurationUpdate({ workingDays: days });
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-1 text-sm text-gray-700">{day.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Advanced Configuration */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora de Inicio
              </label>
              <input
                type="time"
                value={config.workingHours.start}
                onChange={(e) => handleConfigurationUpdate({
                  workingHours: { ...config.workingHours, start: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora de Fin
              </label>
              <input
                type="time"
                value={config.workingHours.end}
                onChange={(e) => handleConfigurationUpdate({
                  workingHours: { ...config.workingHours, end: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buffer de Contingencia (%)
            </label>
            <input
              type="number"
              min="0"
              max="50"
              value={config.bufferPercentage}
              onChange={(e) => handleConfigurationUpdate({ 
                bufferPercentage: parseInt(e.target.value) 
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.weatherFactors}
                onChange={(e) => handleConfigurationUpdate({ weatherFactors: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Considerar factores climáticos</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.resourceOptimization}
                onChange={(e) => handleConfigurationUpdate({ resourceOptimization: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Optimización de recursos</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.criticalPathFocus}
                onChange={(e) => handleConfigurationUpdate({ criticalPathFocus: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Enfoque en ruta crítica</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.phaseBreakdown}
                onChange={(e) => handleConfigurationUpdate({ phaseBreakdown: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Desglose por fases</span>
            </label>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={() => setCurrentStep(2)}
          className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4 inline mr-2" />
          Anterior
        </button>
        <button
          onClick={() => setCurrentStep(4)}
          disabled={!config.projectType}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Generar Cronograma
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Generando Cronograma
      </h2>

      {!isGenerating && (
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BoltIcon className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            ¿Listo para generar?
          </h3>
          <p className="text-gray-600 mb-6">
            Se creará un cronograma optimizado basado en tu presupuesto y configuración
          </p>
          <button
            onClick={handleGenerate}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlayIcon className="h-5 w-5 inline mr-2" />
            Iniciar Generación
          </button>
        </div>
      )}

      {isGenerating && (
        <div className="space-y-6">
          {generationSteps.map((step) => (
            <div key={step.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                step.status === "completed" ? "bg-green-100 text-green-600" :
                step.status === "active" ? "bg-blue-100 text-blue-600" :
                step.status === "error" ? "bg-red-100 text-red-600" :
                "bg-gray-100 text-gray-400"
              }`}>
                {step.status === "completed" ? (
                  <CheckCircleIcon className="h-5 w-5" />
                ) : step.status === "error" ? (
                  <ExclamationTriangleIcon className="h-5 w-5" />
                ) : (
                  <LoadingSpinner size="sm" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-gray-900">{step.name}</h4>
                  {step.duration && (
                    <span className="text-sm text-gray-500">{step.duration}s</span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{step.description}</p>
                {step.status === "active" && (
                  <ProgressBar progress={step.progress} className="mt-2" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderStep5 = () => (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircleIcon className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          ¡Cronograma Generado Exitosamente!
        </h2>
        <p className="text-gray-600">
          Tu cronograma optimizado está listo para usar
        </p>
      </div>

      {generatedSchedule && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <CalendarDaysIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-900">{generatedSchedule.totalDuration}</div>
            <div className="text-sm text-blue-700">días estimados</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <ClockIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-900">{generatedSchedule.totalActivities}</div>
            <div className="text-sm text-green-700">actividades</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <UserGroupIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-900">{generatedSchedule.resourcesRequired}</div>
            <div className="text-sm text-purple-700">recursos asignados</div>
          </div>
        </div>
      )}

      <div className="flex justify-center gap-4">
        <button
          onClick={() => navigate(`/calculations/schedule/gantt/${generatedSchedule?.id}`)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Ver en Gantt
        </button>
        <button
          onClick={() => navigate("/calculations/schedule")}
          className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Volver al Hub
        </button>
        <button
          onClick={() => {
            resetGeneration();
            setCurrentStep(1);
            setSelectedBudget(null);
          }}
          className="px-6 py-3 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          Generar Otro
        </button>
      </div>
    </div>
  );

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
                  Generador de Cronogramas
                </h1>
                <p className="text-gray-600">
                  Crea cronogramas inteligentes desde presupuestos aprobados
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderStepIndicator()}

        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
        {currentStep === 5 && renderStep5()}
      </div>
    </div>
  );
};

export default ScheduleGenerator;