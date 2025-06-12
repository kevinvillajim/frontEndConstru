// src/ui/pages/calculations/budget/components/BudgetReviewPanel.tsx

import React, { useState } from "react";
import {
  EyeIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  CurrencyDollarIcon,
  Cog6ToothIcon,
  ClockIcon,
  BuildingOfficeIcon
} from "@heroicons/react/24/outline";

import type { 
  BudgetTemplate, 
  BudgetConfiguration 
} from "../../shared/types/budget.types";

interface BudgetReviewPanelProps {
  selectedTemplate: BudgetTemplate | null;
  budgetName: string;
  budgetDescription: string;
  configuration: Partial<BudgetConfiguration>;
  onGenerate: () => Promise<any>;
  generating: boolean;
  error: string | null;
}

const BudgetReviewPanel: React.FC<BudgetReviewPanelProps> = ({
  selectedTemplate,
  budgetName,
  budgetDescription,
  configuration,
  onGenerate,
  generating,
  error
}) => {
  const [showEstimate, setShowEstimate] = useState(false);

  // Calcular estimación rápida del presupuesto
  const calculateEstimate = () => {
    if (!selectedTemplate) return null;

    // Estimación base simplificada
    const baseAmount = 50000; // Base estimada para demostración
    let total = baseAmount;

    // Aplicar contingencia
    if (configuration.contingencyPercentage) {
      total += (total * configuration.contingencyPercentage) / 100;
    }

    // Aplicar impuestos
    if (configuration.taxPercentage) {
      total += (total * configuration.taxPercentage) / 100;
    }

    // Factores adicionales según configuración
    if (configuration.includeProfessionalFees) {
      total += total * 0.15; // 15% estimado para honorarios
    }

    if (configuration.includeIndirectCosts) {
      total += total * 0.08; // 8% estimado para costos indirectos
    }

    return {
      baseAmount,
      contingency: (baseAmount * (configuration.contingencyPercentage || 0)) / 100,
      taxes: (baseAmount * (configuration.taxPercentage || 0)) / 100,
      professionalFees: configuration.includeProfessionalFees ? baseAmount * 0.15 : 0,
      indirectCosts: configuration.includeIndirectCosts ? baseAmount * 0.08 : 0,
      total
    };
  };

  const estimate = calculateEstimate();

  // Renderizar resumen de configuración
  const renderConfigurationSummary = () => (
    <div className="space-y-6">
      {/* Información básica */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <DocumentTextIcon className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Información Básica</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Presupuesto
            </label>
            <p className="text-gray-900 font-medium">{budgetName}</p>
          </div>
          
          {budgetDescription && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <p className="text-gray-700">{budgetDescription}</p>
            </div>
          )}
        </div>
      </div>

      {/* Plantilla seleccionada */}
      {selectedTemplate && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <BuildingOfficeIcon className="h-6 w-6 text-emerald-600" />
            <h3 className="text-lg font-semibold text-gray-900">Plantilla Seleccionada</h3>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <BuildingOfficeIcon className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 mb-1">{selectedTemplate.name}</h4>
              <p className="text-gray-600 text-sm mb-2">{selectedTemplate.description}</p>
              
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                  {selectedTemplate.projectType}
                </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  {selectedTemplate.geographicalZone}
                </span>
                {selectedTemplate.isVerified && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                    Verificada
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Configuración técnica */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Cog6ToothIcon className="h-6 w-6 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Configuración Técnica</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Mano de obra:</span>
              <span className={`font-medium ${configuration.includeLabor ? 'text-green-600' : 'text-gray-500'}`}>
                {configuration.includeLabor ? 'Incluida' : 'Excluida'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Honorarios profesionales:</span>
              <span className={`font-medium ${configuration.includeProfessionalFees ? 'text-green-600' : 'text-gray-500'}`}>
                {configuration.includeProfessionalFees ? 'Incluidos' : 'Excluidos'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Costos indirectos:</span>
              <span className={`font-medium ${configuration.includeIndirectCosts ? 'text-green-600' : 'text-gray-500'}`}>
                {configuration.includeIndirectCosts ? 'Incluidos' : 'Excluidos'}
              </span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Contingencia:</span>
              <span className="font-medium text-gray-900">
                {configuration.contingencyPercentage || 0}%
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Impuestos:</span>
              <span className="font-medium text-gray-900">
                {configuration.taxPercentage || 0}%
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Zona geográfica:</span>
              <span className="font-medium text-gray-900">
                {configuration.geographicalZone || 'QUITO'}
              </span>
            </div>
          </div>
        </div>

        {/* Elementos personalizados */}
        {(configuration.customMaterials?.length || configuration.customLaborCosts?.length) && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Elementos Personalizados</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {configuration.customMaterials && configuration.customMaterials.length > 0 && (
                <div>
                  <span className="text-sm text-gray-700">Materiales personalizados:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {configuration.customMaterials.length} elementos
                  </span>
                </div>
              )}
              
              {configuration.customLaborCosts && configuration.customLaborCosts.length > 0 && (
                <div>
                  <span className="text-sm text-gray-700">Mano de obra personalizada:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {configuration.customLaborCosts.length} elementos
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Estimación rápida */}
      {estimate && (
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <CurrencyDollarIcon className="h-6 w-6 text-emerald-600" />
              <h3 className="text-lg font-semibold text-emerald-900">Estimación Aproximada</h3>
            </div>
            <button
              onClick={() => setShowEstimate(!showEstimate)}
              className="text-emerald-700 hover:text-emerald-800 font-medium text-sm"
            >
              {showEstimate ? 'Ocultar detalles' : 'Ver detalles'}
            </button>
          </div>
          
          {showEstimate ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-emerald-700">Costo base:</span>
                <span className="font-medium text-emerald-900">
                  ${estimate.baseAmount.toLocaleString('es-EC', { minimumFractionDigits: 2 })}
                </span>
              </div>
              
              {estimate.contingency > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-emerald-700">Contingencia ({configuration.contingencyPercentage}%):</span>
                  <span className="font-medium text-emerald-900">
                    ${estimate.contingency.toLocaleString('es-EC', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}
              
              {estimate.professionalFees > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-emerald-700">Honorarios profesionales:</span>
                  <span className="font-medium text-emerald-900">
                    ${estimate.professionalFees.toLocaleString('es-EC', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}
              
              {estimate.indirectCosts > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-emerald-700">Costos indirectos:</span>
                  <span className="font-medium text-emerald-900">
                    ${estimate.indirectCosts.toLocaleString('es-EC', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}
              
              {estimate.taxes > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-emerald-700">Impuestos ({configuration.taxPercentage}%):</span>
                  <span className="font-medium text-emerald-900">
                    ${estimate.taxes.toLocaleString('es-EC', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}
              
              <div className="pt-3 border-t border-emerald-300">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-emerald-900">Total estimado:</span>
                  <span className="font-bold text-xl text-emerald-900">
                    ${estimate.total.toLocaleString('es-EC', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="font-bold text-2xl text-emerald-900 mb-1">
                ${estimate.total.toLocaleString('es-EC', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-emerald-700 text-sm">
                Estimación aproximada del presupuesto total
              </p>
            </div>
          )}
          
          <div className="mt-4 p-3 bg-emerald-200/50 rounded-lg">
            <p className="text-emerald-800 text-xs">
              <strong>Nota:</strong> Esta es una estimación aproximada. Los valores finales 
              se calcularán con precisión basados en los cálculos técnicos reales.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // Renderizar checklist de validación
  const renderValidationChecklist = () => {
    const checks = [
      {
        id: 'template',
        label: 'Plantilla seleccionada',
        valid: !!selectedTemplate,
        required: true
      },
      {
        id: 'name',
        label: 'Nombre del presupuesto',
        valid: budgetName.trim().length >= 3,
        required: true
      },
      {
        id: 'percentages',
        label: 'Porcentajes configurados',
        valid: (configuration.contingencyPercentage || 0) >= 0 && 
               (configuration.taxPercentage || 0) >= 0,
        required: true
      },
      {
        id: 'zone',
        label: 'Zona geográfica definida',
        valid: !!configuration.geographicalZone,
        required: true
      },
      {
        id: 'description',
        label: 'Descripción agregada',
        valid: !!budgetDescription?.trim(),
        required: false
      }
    ];

    const requiredChecks = checks.filter(check => check.required);
    const validRequired = requiredChecks.filter(check => check.valid).length;
    const totalRequired = requiredChecks.length;
    const allValid = validRequired === totalRequired;

    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircleIcon className={`h-6 w-6 ${allValid ? 'text-green-600' : 'text-gray-400'}`} />
          <h3 className="text-lg font-semibold text-gray-900">Verificación</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            allValid 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {validRequired}/{totalRequired} requeridos
          </span>
        </div>
        
        <div className="space-y-3">
          {checks.map((check) => (
            <div key={check.id} className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                check.valid 
                  ? 'bg-green-100 text-green-600' 
                  : check.required 
                  ? 'bg-red-100 text-red-600' 
                  : 'bg-gray-100 text-gray-400'
              }`}>
                {check.valid ? (
                  <CheckCircleIcon className="h-3 w-3" />
                ) : check.required ? (
                  <ExclamationTriangleIcon className="h-3 w-3" />
                ) : (
                  <div className="w-2 h-2 bg-gray-400 rounded-full" />
                )}
              </div>
              
              <span className={`text-sm ${
                check.valid ? 'text-gray-900' : check.required ? 'text-red-600' : 'text-gray-500'
              }`}>
                {check.label}
                {check.required && <span className="text-red-500 ml-1">*</span>}
              </span>
            </div>
          ))}
        </div>
        
        {!allValid && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              Complete todos los elementos requeridos para generar el presupuesto.
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <EyeIcon className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Revisión Final
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Revisa toda la configuración antes de generar tu presupuesto profesional. 
          Asegúrate de que todos los datos sean correctos.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Panel principal con resumen */}
          <div className="lg:col-span-2 space-y-6">
            {renderConfigurationSummary()}
          </div>

          {/* Panel lateral con validación */}
          <div className="space-y-6">
            {renderValidationChecklist()}

            {/* Información del proceso */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <ClockIcon className="h-6 w-6 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Proceso de Generación</h3>
              </div>
              
              <div className="space-y-3 text-sm text-blue-800">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Aplicación de plantilla base</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Cálculo de cantidades</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Aplicación de precios actuales</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Cálculo de totales</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Generación de documento</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                <p className="text-blue-800 text-xs">
                  Tiempo estimado: 30-60 segundos
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-800">Error al generar presupuesto</h4>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Botón de generación */}
        <div className="text-center">
          <button
            onClick={onGenerate}
            disabled={generating || !selectedTemplate || budgetName.trim().length < 3}
            className={`
              inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105
              ${generating || !selectedTemplate || budgetName.trim().length < 3
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 shadow-lg hover:shadow-xl"
              }
            `}
          >
            {generating ? (
              <>
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generando Presupuesto...
              </>
            ) : (
              <>
                <SparklesIcon className="h-6 w-6" />
                Generar Presupuesto
              </>
            )}
          </button>
          
          <p className="text-gray-600 text-sm mt-3">
            El presupuesto se generará y estará listo para revisar y exportar
          </p>
        </div>
      </div>
    </div>
  );
};

export default BudgetReviewPanel;