// src/ui/pages/calculations/budget/components/BudgetConfigurationForm.tsx

import React from "react";
import {
  DocumentTextIcon,
  InformationCircleIcon,
  LightBulbIcon
} from "@heroicons/react/24/outline";

interface BudgetConfigurationFormProps {
  budgetName: string;
  budgetDescription: string;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
  validationErrors: Record<string, string>;
}

const BudgetConfigurationForm: React.FC<BudgetConfigurationFormProps> = ({
  budgetName,
  budgetDescription,
  onNameChange,
  onDescriptionChange,
  validationErrors
}) => {
  // Sugerencias de nombres basadas en la fecha actual
  const generateNameSuggestions = () => {
    const today = new Date();
    const monthNames = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    
    const month = monthNames[today.getMonth()];
    const year = today.getFullYear();
    
    return [
      `Presupuesto ${month} ${year}`,
      `Proyecto ${today.getDate()}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${year}`,
      `Cotización ${today.toLocaleDateString('es-EC')}`,
      `Estimación ${month.slice(0, 3)} ${year}`
    ];
  };

  const nameSuggestions = generateNameSuggestions();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <DocumentTextIcon className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Configuración Básica
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Define el nombre y descripción de tu presupuesto. Esta información 
          aparecerá en el documento final que entregarás a tu cliente.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Nombre del presupuesto */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Nombre del Presupuesto *
          </label>
          <input
            type="text"
            value={budgetName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Ej: Presupuesto Casa Residencial 180m²"
            className={`
              w-full px-4 py-3 border rounded-xl text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
              ${validationErrors.name 
                ? "border-red-300 bg-red-50" 
                : "border-gray-300 hover:border-gray-400"
              }
            `}
          />
          
          {validationErrors.name && (
            <div className="mt-2 flex items-center gap-2 text-red-600">
              <InformationCircleIcon className="h-4 w-4" />
              <span className="text-sm">{validationErrors.name}</span>
            </div>
          )}

          {/* Sugerencias de nombres */}
          {!budgetName && (
            <div className="mt-3">
              <div className="flex items-center gap-2 mb-2">
                <LightBulbIcon className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium text-gray-700">Sugerencias:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {nameSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => onNameChange(suggestion)}
                    className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Descripción del presupuesto */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Descripción (Opcional)
          </label>
          <textarea
            value={budgetDescription}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Describe brevemente el proyecto, ubicación, características especiales, etc."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-all duration-200 resize-none"
          />
          
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-500">
              <InformationCircleIcon className="h-4 w-4" />
              <span className="text-sm">
                Esta descripción aparecerá en el encabezado del documento
              </span>
            </div>
            <span className="text-sm text-gray-400">
              {budgetDescription.length}/500
            </span>
          </div>
        </div>

        {/* Información adicional */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <InformationCircleIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">
                Consejos para un buen presupuesto
              </h4>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Usa nombres descriptivos que identifiquen claramente el proyecto</li>
                <li>• Incluye la ubicación o zona geográfica si es relevante</li>
                <li>• Menciona el área o características principales del proyecto</li>
                <li>• Mantén la descripción profesional y concisa</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Ejemplos */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <h4 className="font-medium text-gray-900 mb-3">Ejemplos de nombres efectivos:</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-gray-700 text-sm">
                <strong>Casa Unifamiliar 120m² - Urbanización Los Arrayanes</strong>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-gray-700 text-sm">
                <strong>Edificio Comercial 3 Pisos - Centro Norte Quito</strong>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-gray-700 text-sm">
                <strong>Renovación Oficinas 450m² - Edificio Metropolitan</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Características del presupuesto */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white border border-gray-200 rounded-xl">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <DocumentTextIcon className="h-6 w-6 text-emerald-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-1">Profesional</h4>
            <p className="text-sm text-gray-600">
              Formato profesional listo para entregar al cliente
            </p>
          </div>

          <div className="text-center p-4 bg-white border border-gray-200 rounded-xl">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="font-medium text-gray-900 mb-1">Rápido</h4>
            <p className="text-sm text-gray-600">
              Generación automática desde tus cálculos técnicos
            </p>
          </div>

          <div className="text-center p-4 bg-white border border-gray-200 rounded-xl">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-medium text-gray-900 mb-1">Preciso</h4>
            <p className="text-sm text-gray-600">
              Basado en cálculos técnicos y precios actualizados
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetConfigurationForm;