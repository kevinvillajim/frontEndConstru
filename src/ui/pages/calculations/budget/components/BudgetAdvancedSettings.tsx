// src/ui/pages/calculations/budget/components/BudgetAdvancedSettings.tsx

import React, { useState } from "react";
import {
  Cog6ToothIcon,
  InformationCircleIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
  TrashIcon
} from "@heroicons/react/24/outline";

import { 
  GeographicalZone,
} from "../../shared/types/budget.types";
import type { 
  BudgetConfiguration, 
  BudgetTemplate, 
  CustomMaterial,
  CustomLaborCost
} from "../../shared/types/budget.types";


interface BudgetAdvancedSettingsProps {
  configuration: Partial<BudgetConfiguration>;
  onConfigurationChange: (updates: Partial<BudgetConfiguration>) => void;
  selectedTemplate: BudgetTemplate | null;
  validationErrors: Record<string, string>;
}

const BudgetAdvancedSettings: React.FC<BudgetAdvancedSettingsProps> = ({
  configuration,
  onConfigurationChange,
  selectedTemplate,
  validationErrors
}) => {
  const [expandedSections, setExpandedSections] = useState({
    general: true,
    percentages: true,
    regional: false,
    materials: false,
    labor: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Valores por defecto de la configuración
  const config = {
    includeLabor: true,
    includeProfessionalFees: true,
    includeIndirectCosts: true,
    contingencyPercentage: 5,
    taxPercentage: 12,
    geographicalZone: GeographicalZone.QUITO,
    currency: 'USD',
    exchangeRate: 1,
    customMaterials: [],
    customLaborCosts: [],
    ...configuration
  };

  // Agregar material personalizado
  const addCustomMaterial = () => {
    const newMaterial: CustomMaterial = {
      description: '',
      unit: 'm²',
      quantity: 0,
      unitPrice: 0,
      category: 'Personalizado'
    };

    onConfigurationChange({
      customMaterials: [...(config.customMaterials || []), newMaterial]
    });
  };

  // Actualizar material personalizado
  const updateCustomMaterial = (index: number, updates: Partial<CustomMaterial>) => {
    const updatedMaterials = [...(config.customMaterials || [])];
    updatedMaterials[index] = { ...updatedMaterials[index], ...updates };
    
    onConfigurationChange({
      customMaterials: updatedMaterials
    });
  };

  // Eliminar material personalizado
  const removeCustomMaterial = (index: number) => {
    const updatedMaterials = (config.customMaterials || []).filter((_, i) => i !== index);
    onConfigurationChange({
      customMaterials: updatedMaterials
    });
  };

  // Agregar costo de mano de obra personalizado
  const addCustomLaborCost = () => {
    const newLaborCost: CustomLaborCost = {
      type: '',
      description: '',
      quantity: 0,
      rate: 0,
      unit: 'h'
    };

    onConfigurationChange({
      customLaborCosts: [...(config.customLaborCosts || []), newLaborCost]
    });
  };

  // Actualizar costo de mano de obra personalizado
  const updateCustomLaborCost = (index: number, updates: Partial<CustomLaborCost>) => {
    const updatedLaborCosts = [...(config.customLaborCosts || [])];
    updatedLaborCosts[index] = { ...updatedLaborCosts[index], ...updates };
    
    onConfigurationChange({
      customLaborCosts: updatedLaborCosts
    });
  };

  // Eliminar costo de mano de obra personalizado
  const removeCustomLaborCost = (index: number) => {
    const updatedLaborCosts = (config.customLaborCosts || []).filter((_, i) => i !== index);
    onConfigurationChange({
      customLaborCosts: updatedLaborCosts
    });
  };

  // Renderizar sección expandible
  const renderSection = (
    key: keyof typeof expandedSections,
    title: string,
    icon: React.ComponentType<{ className?: string }>,
    children: React.ReactNode,
    description?: string
  ) => {
    const Icon = icon;
    const isExpanded = expandedSections[key];

    return (
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <button
          onClick={() => toggleSection(key)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Icon className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">{title}</h3>
              {description && (
                <p className="text-sm text-gray-600">{description}</p>
              )}
            </div>
          </div>
          
          {isExpanded ? (
            <ChevronUpIcon className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          )}
        </button>

        {isExpanded && (
          <div className="px-6 pb-6 border-t border-gray-100">
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Cog6ToothIcon className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Configuración Avanzada
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Personaliza los parámetros técnicos del presupuesto según las características 
          específicas de tu proyecto y región.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Configuración General */}
        {renderSection(
          'general',
          'Configuración General',
          Cog6ToothIcon,
          <div className="pt-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Incluir mano de obra */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Incluir Mano de Obra</h4>
                  <p className="text-sm text-gray-600">Calcular costos de mano de obra en el presupuesto</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.includeLabor}
                    onChange={(e) => onConfigurationChange({ includeLabor: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Incluir honorarios profesionales */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Honorarios Profesionales</h4>
                  <p className="text-sm text-gray-600">Incluir honorarios de diseño y supervisión</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.includeProfessionalFees}
                    onChange={(e) => onConfigurationChange({ includeProfessionalFees: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Incluir costos indirectos */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Costos Indirectos</h4>
                  <p className="text-sm text-gray-600">Equipos, transporte, administración, etc.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.includeIndirectCosts}
                    onChange={(e) => onConfigurationChange({ includeIndirectCosts: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>,
          'Incluir o excluir componentes principales del presupuesto'
        )}

        {/* Porcentajes y Factores */}
        {renderSection(
          'percentages',
          'Porcentajes y Factores',
          CurrencyDollarIcon,
          <div className="pt-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contingencia */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Contingencia (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={config.contingencyPercentage}
                    onChange={(e) => onConfigurationChange({ 
                      contingencyPercentage: parseFloat(e.target.value) || 0 
                    })}
                    min="0"
                    max="50"
                    step="0.5"
                    className={`
                      w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                      ${validationErrors.contingency ? 'border-red-300' : 'border-gray-300'}
                    `}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-sm">%</span>
                  </div>
                </div>
                {validationErrors.contingency && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.contingency}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Reserva para imprevistos (recomendado: 5-10%)
                </p>
              </div>

              {/* Impuestos */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Impuestos (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={config.taxPercentage}
                    onChange={(e) => onConfigurationChange({ 
                      taxPercentage: parseFloat(e.target.value) || 0 
                    })}
                    min="0"
                    max="30"
                    step="0.1"
                    className={`
                      w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                      ${validationErrors.tax ? 'border-red-300' : 'border-gray-300'}
                    `}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-sm">%</span>
                  </div>
                </div>
                {validationErrors.tax && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.tax}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  IVA en Ecuador: 12% (estándar)
                </p>
              </div>
            </div>
          </div>,
          'Ajustar porcentajes de contingencia, impuestos y otros factores'
        )}

        {/* Configuración Regional */}
        {renderSection(
          'regional',
          'Configuración Regional',
          MapPinIcon,
          <div className="pt-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Zona geográfica */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Zona Geográfica
                </label>
                <select
                  value={config.geographicalZone}
                  onChange={(e) => onConfigurationChange({ 
                    geographicalZone: e.target.value as GeographicalZone 
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {Object.values(GeographicalZone).map(zone => (
                    <option key={zone} value={zone}>{zone}</option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Afecta precios de materiales y mano de obra
                </p>
              </div>

              {/* Moneda */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Moneda
                </label>
                <select
                  value={config.currency}
                  onChange={(e) => onConfigurationChange({ currency: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="USD">USD - Dólar Americano</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="COP">COP - Peso Colombiano</option>
                  <option value="PEN">PEN - Sol Peruano</option>
                </select>
              </div>
            </div>

            {/* Tipo de cambio */}
            {config.currency !== 'USD' && (
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Tipo de Cambio (USD → {config.currency})
                </label>
                <input
                  type="number"
                  value={config.exchangeRate}
                  onChange={(e) => onConfigurationChange({ 
                    exchangeRate: parseFloat(e.target.value) || 1 
                  })}
                  min="0.01"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Tasa para convertir precios de USD a {config.currency}
                </p>
              </div>
            )}
          </div>,
          'Configurar aspectos específicos de la región y moneda'
        )}

        {/* Materiales Personalizados */}
        {renderSection(
          'materials',
          'Materiales Personalizados',
          BuildingOfficeIcon,
          <div className="pt-4 space-y-4">
            {config.customMaterials && config.customMaterials.length > 0 ? (
              <div className="space-y-4">
                {config.customMaterials.map((material, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Descripción
                        </label>
                        <input
                          type="text"
                          value={material.description}
                          onChange={(e) => updateCustomMaterial(index, { description: e.target.value })}
                          placeholder="Material personalizado"
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Cantidad
                        </label>
                        <input
                          type="number"
                          value={material.quantity}
                          onChange={(e) => updateCustomMaterial(index, { 
                            quantity: parseFloat(e.target.value) || 0 
                          })}
                          min="0"
                          step="0.01"
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Precio Unit.
                          </label>
                          <input
                            type="number"
                            value={material.unitPrice}
                            onChange={(e) => updateCustomMaterial(index, { 
                              unitPrice: parseFloat(e.target.value) || 0 
                            })}
                            min="0"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        <button
                          onClick={() => removeCustomMaterial(index)}
                          className="mt-5 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BuildingOfficeIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>No hay materiales personalizados agregados</p>
              </div>
            )}

            <button
              onClick={addCustomMaterial}
              className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <PlusIcon className="h-5 w-5" />
              Agregar Material Personalizado
            </button>
          </div>,
          'Agregar materiales específicos no incluidos en el cálculo base'
        )}

        {/* Mano de Obra Personalizada */}
        {config.includeLabor && renderSection(
          'labor',
          'Mano de Obra Personalizada',
          UserGroupIcon,
          <div className="pt-4 space-y-4">
            {config.customLaborCosts && config.customLaborCosts.length > 0 ? (
              <div className="space-y-4">
                {config.customLaborCosts.map((laborCost, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Tipo
                        </label>
                        <input
                          type="text"
                          value={laborCost.type}
                          onChange={(e) => updateCustomLaborCost(index, { type: e.target.value })}
                          placeholder="Especialidad"
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Descripción
                        </label>
                        <input
                          type="text"
                          value={laborCost.description}
                          onChange={(e) => updateCustomLaborCost(index, { description: e.target.value })}
                          placeholder="Actividad específica"
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Cantidad
                        </label>
                        <input
                          type="number"
                          value={laborCost.quantity}
                          onChange={(e) => updateCustomLaborCost(index, { 
                            quantity: parseFloat(e.target.value) || 0 
                          })}
                          min="0"
                          step="0.01"
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Tarifa
                        </label>
                        <input
                          type="number"
                          value={laborCost.rate}
                          onChange={(e) => updateCustomLaborCost(index, { 
                            rate: parseFloat(e.target.value) || 0 
                          })}
                          min="0"
                          step="0.01"
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div className="flex items-end">
                        <button
                          onClick={() => removeCustomLaborCost(index)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <UserGroupIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>No hay costos de mano de obra personalizados</p>
              </div>
            )}

            <button
              onClick={addCustomLaborCost}
              className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <PlusIcon className="h-5 w-5" />
              Agregar Costo de Mano de Obra
            </button>
          </div>,
          'Agregar costos específicos de mano de obra especializada'
        )}

        {/* Resumen de configuración */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <InformationCircleIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-2">
                {selectedTemplate ? `Configuración basada en: ${selectedTemplate.name}` : 'Configuración personalizada'}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-blue-700 font-medium">Mano de obra:</span>
                  <span className="text-blue-800 ml-1">
                    {config.includeLabor ? 'Incluida' : 'Excluida'}
                  </span>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Contingencia:</span>
                  <span className="text-blue-800 ml-1">{config.contingencyPercentage}%</span>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Impuestos:</span>
                  <span className="text-blue-800 ml-1">{config.taxPercentage}%</span>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Zona:</span>
                  <span className="text-blue-800 ml-1">{config.geographicalZone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetAdvancedSettings;