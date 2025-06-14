// src/ui/pages/calculations/budget/BudgetGenerator.tsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  CurrencyDollarIcon,
  EyeIcon,
  SparklesIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";

// Importar hooks personalizados
import { useBudgetGeneration, useBudgetTemplates } from "../shared/hooks/useBudgetGeneration";
import { ProjectType, GeographicalZone } from "../shared/types/budget.types";

// Importar componentes especializados (se implementarán después)
import BudgetTemplateSelector from "./components/BudgetTemplateSelector";
import BudgetConfigurationForm from "./components/BudgetConfigurationForm";
import BudgetAdvancedSettings from "./components/BudgetAdvancedSettings";
import BudgetReviewPanel from "./components/BudgetReviewPanel";

const BudgetGenerator: React.FC = () => {
  const { calculationResultId, templateId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Estado del generador
  const [isLoading, setIsLoading] = useState(false);
  
  // Hook principal de generación de presupuestos
  const budgetGeneration = useBudgetGeneration({
    calculationResultId,
    onBudgetCreated: (budget) => {
      // Navegar al presupuesto creado
      navigate(`/calculations/budget/history/${budget.id}`, {
        state: { budgetCreated: true }
      });
    },
    autoAdvance: true
  });

  // Hook para plantillas
  const { getRecommendations, loading: templatesLoading } = useBudgetTemplates();

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      
      try {
        // Si venimos de un templateId específico, cargarlo
        if (templateId) {
          // TODO: Cargar template específico
        }
        
        // Si hay calculationResultId, obtener recomendaciones
        if (calculationResultId) {
          const recommendations = await getRecommendations(
            ProjectType.RESIDENTIAL_SINGLE, // TODO: obtener del cálculo
            GeographicalZone.QUITO, // TODO: obtener del usuario o cálculo
            calculationResultId
          );
          
          // Auto-seleccionar la primera recomendación si solo hay una
          if (recommendations.length === 1) {
            budgetGeneration.setSelectedTemplate(recommendations[0]);
          }
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [calculationResultId, templateId, getRecommendations, budgetGeneration.setSelectedTemplate]);

  // Renderizar indicador de pasos
  const renderStepIndicator = () => (
    <div className="bg-white border-b border-gray-200 px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          {budgetGeneration.stepTitles.map((title, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === budgetGeneration.stepInfo.current;
            const isCompleted = stepNumber < budgetGeneration.stepInfo.current;
            const isAccessible = stepNumber <= budgetGeneration.stepInfo.current;

            return (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`flex items-center cursor-pointer ${
                    isAccessible ? "opacity-100" : "opacity-50"
                  }`}
                  onClick={() => isAccessible && budgetGeneration.goToStep(stepNumber)}
                >
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200
                      ${isCompleted
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : isActive
                        ? "bg-emerald-100 border-emerald-500 text-emerald-700"
                        : "bg-gray-100 border-gray-300 text-gray-500"
                      }
                    `}
                  >
                    {isCompleted ? (
                      <CheckIcon className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-semibold">{stepNumber}</span>
                    )}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <div
                      className={`text-sm font-medium ${
                        isActive ? "text-emerald-700" : "text-gray-700"
                      }`}
                    >
                      {title}
                    </div>
                  </div>
                </div>

                {stepNumber < budgetGeneration.stepTitles.length && (
                  <div
                    className={`hidden sm:block w-12 h-0.5 mx-4 ${
                      stepNumber < budgetGeneration.stepInfo.current
                        ? "bg-emerald-500"
                        : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Barra de progreso */}
        <div className="mt-6">
          <div className="bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${budgetGeneration.stepInfo.percentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Paso {budgetGeneration.stepInfo.current} de {budgetGeneration.stepInfo.total}</span>
            <span>{Math.round(budgetGeneration.stepInfo.percentage)}% completado</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Renderizar contenido del paso actual
  const renderStepContent = () => {
    const { currentStep } = budgetGeneration;

    switch (currentStep) {
      case 1:
        return (
          <BudgetTemplateSelector
            calculationResultId={calculationResultId}
            selectedTemplate={budgetGeneration.selectedTemplate}
            onTemplateSelect={budgetGeneration.setSelectedTemplate}
            loading={templatesLoading}
          />
        );

      case 2:
        return (
          <BudgetConfigurationForm
            budgetName={budgetGeneration.budgetName}
            budgetDescription={budgetGeneration.budgetDescription}
            onNameChange={budgetGeneration.setBudgetName}
            onDescriptionChange={budgetGeneration.setBudgetDescription}
            validationErrors={budgetGeneration.validationErrors}
          />
        );

      case 3:
        return (
          <BudgetAdvancedSettings
            configuration={budgetGeneration.configuration}
            onConfigurationChange={budgetGeneration.updateConfiguration}
            selectedTemplate={budgetGeneration.selectedTemplate}
            validationErrors={budgetGeneration.validationErrors}
          />
        );

      case 4:
        return (
          <BudgetReviewPanel
            selectedTemplate={budgetGeneration.selectedTemplate}
            budgetName={budgetGeneration.budgetName}
            budgetDescription={budgetGeneration.budgetDescription}
            configuration={budgetGeneration.configuration}
            onGenerate={budgetGeneration.generateBudget}
            generating={budgetGeneration.generating}
            error={budgetGeneration.error}
          />
        );

      default:
        return null;
    }
  };

  // Renderizar botones de navegación
  const renderNavigationButtons = () => (
    <div className="bg-white border-t border-gray-200 px-4 py-6">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <button
          onClick={budgetGeneration.prevStep}
          disabled={!budgetGeneration.stepInfo.canGoBack}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200
            ${budgetGeneration.stepInfo.canGoBack
              ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              : "text-gray-400 cursor-not-allowed"
            }
          `}
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Anterior
        </button>

        <div className="flex items-center gap-4">
          {/* Botón de vista previa (solo en pasos 3 y 4) */}
          {(budgetGeneration.currentStep === 3 || budgetGeneration.currentStep === 4) && (
            <button
              onClick={() => {
                // TODO: Mostrar vista previa del presupuesto
              }}
              className="flex items-center gap-2 px-6 py-3 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl font-medium transition-all duration-200"
            >
              <EyeIcon className="h-5 w-5" />
              Vista Previa
            </button>
          )}

          {/* Botón principal */}
          {budgetGeneration.stepInfo.isLast ? (
            <button
              onClick={budgetGeneration.generateBudget}
              disabled={!budgetGeneration.isValid || budgetGeneration.generating}
              className={`
                flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all duration-200
                ${budgetGeneration.isValid && !budgetGeneration.generating
                  ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 shadow-lg hover:shadow-xl"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }
              `}
            >
              {budgetGeneration.generating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <SparklesIcon className="h-5 w-5" />
                  Generar Presupuesto
                </>
              )}
            </button>
          ) : (
            <button
              onClick={budgetGeneration.nextStep}
              disabled={!budgetGeneration.stepInfo.canProceed}
              className={`
                flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all duration-200
                ${budgetGeneration.stepInfo.canProceed
                  ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 shadow-lg hover:shadow-xl"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }
              `}
            >
              Siguiente
              <ArrowRightIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Mostrar errores si los hay
  const renderErrorAlert = () => {
    if (!budgetGeneration.error) return null;

    return (
      <div className="max-w-4xl mx-auto mb-6 px-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error al generar presupuesto</h3>
              <p className="text-sm text-red-700 mt-1">{budgetGeneration.error}</p>
              <button
                onClick={budgetGeneration.clearError}
                className="text-sm text-red-800 hover:text-red-900 font-medium mt-2 underline"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando generador de presupuestos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header con título */}
      <div className="bg-white border-b border-gray-200 px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/calculations/budget")}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <CurrencyDollarIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Generador de Presupuestos
                </h1>
                {calculationResultId && (
                  <p className="text-sm text-gray-600">
                    Creando desde cálculo técnico
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Indicador de pasos */}
      {renderStepIndicator()}

      {/* Contenido principal */}
      <div className="flex-1 py-8">
        {renderErrorAlert()}
        
        <div className="max-w-4xl mx-auto px-4">
          {renderStepContent()}
        </div>
      </div>

      {/* Botones de navegación */}
      {renderNavigationButtons()}
    </div>
  );
};

export default BudgetGenerator;