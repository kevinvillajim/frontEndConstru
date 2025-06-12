// src/ui/pages/calculations/budget/BudgetComparison.tsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChartBarIcon,
  ArrowLeftIcon,
  XMarkIcon,
  DocumentArrowDownIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from "@heroicons/react/24/outline";

// Hooks personalizados
import { useBudgetComparison } from "../shared/hooks/useBudgetComparison";

// Tipos
import { BudgetStatus } from "../shared/types/budget.types";
import type { CalculationBudget } from "../shared/types/budget.types";


const BudgetComparison: React.FC = () => {
  const { comparisonId } = useParams();
  const navigate = useNavigate();
  
  const [showFilters, setShowFilters] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  
  // Hook de comparación
  const comparison = useBudgetComparison();

  // Cargar datos al montar
  useEffect(() => {
    comparison.loadAvailableBudgets();
  }, []);

  // Cargar comparación específica si viene de URL
  useEffect(() => {
    if (comparisonId) {
      // TODO: Cargar comparación específica
    }
  }, [comparisonId]);

  // Toggle categoría expandida
  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  // Renderizar selector de presupuestos
  const renderBudgetSelector = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Seleccionar Presupuestos para Comparar
        </h3>
        <span className="text-sm text-gray-500">
          {comparison.selectedBudgets.length}/{comparison.maxComparisons} seleccionados
        </span>
      </div>

      {/* Filtros */}
      <div className="mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <span>Filtros</span>
          {showFilters ? (
            <ChevronUpIcon className="h-4 w-4" />
          ) : (
            <ChevronDownIcon className="h-4 w-4" />
          )}
        </button>

        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => {
                // TODO: Aplicar filtro de estado
              }}
            >
              <option value="">Todos los estados</option>
              <option value="approved">Aprobados</option>
              <option value="final">Finales</option>
            </select>

            <select
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => {
                // TODO: Aplicar filtro de tipo
              }}
            >
              <option value="">Todos los tipos</option>
              <option value="complete_project">Proyecto Completo</option>
              <option value="materials_only">Solo Materiales</option>
            </select>

            <input
              type="text"
              placeholder="Buscar por nombre..."
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => {
                // TODO: Aplicar filtro de búsqueda
              }}
            />
          </div>
        )}
      </div>

      {/* Lista de presupuestos */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {comparison.loadingBudgets ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Cargando presupuestos...</p>
          </div>
        ) : comparison.availableBudgets.length === 0 ? (
          <div className="text-center py-8">
            <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              No hay presupuestos disponibles
            </h4>
            <p className="text-gray-600 mb-4">
              Necesitas al menos 2 presupuestos aprobados para hacer comparaciones
            </p>
            <button
              onClick={() => navigate("/calculations/budget/generator")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Crear Presupuesto
            </button>
          </div>
        ) : (
          comparison.availableBudgets.map((budget) => (
            <div
              key={budget.id}
              onClick={() => comparison.toggleBudgetSelection(budget)}
              className={`
                p-4 border rounded-lg cursor-pointer transition-all duration-200
                ${comparison.isBudgetSelected(budget.id)
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }
                ${comparison.hasMaxSelection && !comparison.isBudgetSelected(budget.id)
                  ? "opacity-50 cursor-not-allowed"
                  : ""
                }
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">{budget.name}</h4>
                  {budget.description && (
                    <p className="text-sm text-gray-600 mb-2">{budget.description}</p>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Total: ${budget.summary.grandTotal.toLocaleString('es-EC')}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      budget.status === BudgetStatus.APPROVED 
                        ? 'bg-green-100 text-green-800'
                        : budget.status === BudgetStatus.FINAL
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {budget.status}
                    </span>
                    <span>{new Date(budget.updatedAt).toLocaleDateString('es-EC')}</span>
                  </div>
                </div>

                {comparison.isBudgetSelected(budget.id) && (
                  <CheckCircleIcon className="h-5 w-5 text-blue-600 flex-shrink-0" />
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Presupuestos seleccionados */}
      {comparison.selectedBudgets.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Presupuestos Seleccionados</h4>
            <button
              onClick={comparison.clearSelection}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Limpiar selección
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {comparison.selectedBudgets.map((budget) => (
              <div
                key={budget.id}
                className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                <span>{budget.name}</span>
                <button
                  onClick={() => comparison.toggleBudgetSelection(budget)}
                  className="hover:bg-blue-200 rounded-full p-1"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={comparison.performComparison}
            disabled={!comparison.canCompare || comparison.loadingComparison}
            className={`
              w-full px-4 py-3 rounded-lg font-medium transition-all duration-200
              ${comparison.canCompare && !comparison.loadingComparison
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }
            `}
          >
            {comparison.loadingComparison ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analizando...
              </div>
            ) : (
              "Realizar Comparación"
            )}
          </button>
        </div>
      )}
    </div>
  );

  // Renderizar estadísticas de comparación
  const renderComparisonStats = () => {
    const stats = comparison.getComparisonStats();
    if (!stats) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <ArrowTrendingDownIcon className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Mínimo</h4>
              <p className="text-2xl font-bold text-green-600">
                ${stats.min.value.toLocaleString('es-EC')}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-600">{stats.min.budget?.budgetName}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <ArrowTrendingUpIcon className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Máximo</h4>
              <p className="text-2xl font-bold text-red-600">
                ${stats.max.value.toLocaleString('es-EC')}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-600">{stats.max.budget?.budgetName}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <ChartBarIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Promedio</h4>
              <p className="text-2xl font-bold text-blue-600">
                ${stats.average.toLocaleString('es-EC')}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-600">Entre {stats.count} presupuestos</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Variación</h4>
              <p className="text-2xl font-bold text-purple-600">
                {stats.variance.toFixed(1)}%
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            ${stats.totalDifference.toLocaleString('es-EC')} diferencia
          </p>
        </div>
      </div>
    );
  };

  // Renderizar tabla de comparación
  const renderComparisonTable = () => {
    const categoryDifferences = comparison.getCategoryDifferences();
    const totalsSummary = comparison.getTotalsSummary();

    if (categoryDifferences.length === 0) return null;

    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Comparación Detallada por Categorías
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">
                  Categoría
                </th>
                {totalsSummary.map((budget) => (
                  <th key={budget.budgetId} className="text-right px-6 py-3 text-sm font-medium text-gray-900">
                    {budget.budgetName}
                  </th>
                ))}
                <th className="text-right px-6 py-3 text-sm font-medium text-gray-900">
                  Variación
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* Totales principales */}
              <tr className="bg-gray-50 font-medium">
                <td className="px-6 py-4 text-gray-900">Total General</td>
                {totalsSummary.map((budget) => (
                  <td key={budget.budgetId} className="text-right px-6 py-4 text-gray-900">
                    ${budget.total.toLocaleString('es-EC')}
                  </td>
                ))}
                <td className="text-right px-6 py-4 text-purple-600 font-semibold">
                  {comparison.getComparisonStats()?.variance.toFixed(1)}%
                </td>
              </tr>

              {/* Subtotales por componente */}
              <tr>
                <td className="px-6 py-4 text-gray-700">Materiales</td>
                {totalsSummary.map((budget) => (
                  <td key={budget.budgetId} className="text-right px-6 py-4 text-gray-700">
                    ${budget.materialsTotal.toLocaleString('es-EC')}
                  </td>
                ))}
                <td className="text-right px-6 py-4 text-gray-500">-</td>
              </tr>

              <tr>
                <td className="px-6 py-4 text-gray-700">Mano de Obra</td>
                {totalsSummary.map((budget) => (
                  <td key={budget.budgetId} className="text-right px-6 py-4 text-gray-700">
                    ${budget.laborTotal.toLocaleString('es-EC')}
                  </td>
                ))}
                <td className="text-right px-6 py-4 text-gray-500">-</td>
              </tr>

              <tr>
                <td className="px-6 py-4 text-gray-700">Costos Indirectos</td>
                {totalsSummary.map((budget) => (
                  <td key={budget.budgetId} className="text-right px-6 py-4 text-gray-700">
                    ${budget.indirectCostsTotal.toLocaleString('es-EC')}
                  </td>
                ))}
                <td className="text-right px-6 py-4 text-gray-500">-</td>
              </tr>

              <tr>
                <td className="px-6 py-4 text-gray-700">Honorarios Profesionales</td>
                {totalsSummary.map((budget) => (
                  <td key={budget.budgetId} className="text-right px-6 py-4 text-gray-700">
                    ${budget.professionalFeesTotal.toLocaleString('es-EC')}
                  </td>
                ))}
                <td className="text-right px-6 py-4 text-gray-500">-</td>
              </tr>

              {/* Categorías detalladas */}
              {categoryDifferences.map((category) => (
                <tr
                  key={category.category}
                  className={`cursor-pointer hover:bg-gray-50 ${
                    expandedCategories.has(category.category) ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => toggleCategory(category.category)}
                >
                  <td className="px-6 py-4 text-gray-700">
                    <div className="flex items-center gap-2">
                      {expandedCategories.has(category.category) ? (
                        <ChevronUpIcon className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                      )}
                      {category.category}
                    </div>
                  </td>
                  {category.values.map((value) => (
                    <td key={value.budgetId} className="text-right px-6 py-4 text-gray-700">
                      ${value.value.toLocaleString('es-EC')}
                    </td>
                  ))}
                  <td className={`text-right px-6 py-4 font-medium ${
                    category.maxDifference > 20 ? 'text-red-600' : 
                    category.maxDifference > 10 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {category.maxDifference.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Renderizar cambios significativos
  const renderSignificantChanges = () => {
    const significantChanges = comparison.getSignificantChanges();
    if (significantChanges.length === 0) return null;

    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Cambios Significativos
        </h3>
        
        <div className="space-y-4">
          {significantChanges.slice(0, 10).map((change, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-l-4 ${
                change.type === 'cost_increase' ? 'border-red-500 bg-red-50' :
                change.type === 'cost_decrease' ? 'border-green-500 bg-green-50' :
                'border-blue-500 bg-blue-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    {change.description}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Categoría: {change.category}
                  </p>
                  {change.recommendation && (
                    <p className="text-sm text-blue-700">
                      <strong>Recomendación:</strong> {change.recommendation}
                    </p>
                  )}
                </div>
                <div className={`text-right ${
                  change.impact > 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  <div className="font-bold">
                    {change.impact > 0 ? '+' : ''}${Math.abs(change.impact).toLocaleString('es-EC')}
                  </div>
                  <div className="text-xs">
                    {change.impact > 0 ? 'Aumento' : 'Disminución'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Renderizar acciones de exportación
  const renderExportActions = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Acciones de Comparación
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => comparison.exportComparison('pdf')}
          className="flex items-center gap-3 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <DocumentArrowDownIcon className="h-5 w-5" />
          Exportar PDF
        </button>
        
        <button
          onClick={() => comparison.exportComparison('excel')}
          className="flex items-center gap-3 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <DocumentArrowDownIcon className="h-5 w-5" />
          Exportar Excel
        </button>
        
        <button
          onClick={comparison.saveComparison}
          className="flex items-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <CheckCircleIcon className="h-5 w-5" />
          Guardar Comparación
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/calculations/budget")}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <ChartBarIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Comparación de Presupuestos
                </h1>
                <p className="text-sm text-gray-600">
                  Analiza diferencias entre presupuestos y optimiza costos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {comparison.error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-800">Error</h4>
                <p className="text-red-700 text-sm mt-1">{comparison.error}</p>
                <button
                  onClick={comparison.clearError}
                  className="text-red-800 hover:text-red-900 font-medium text-sm mt-2 underline"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {!comparison.comparison ? (
          // Selector de presupuestos
          renderBudgetSelector()
        ) : (
          // Resultados de comparación
          <div className="space-y-8">
            {renderComparisonStats()}
            {renderComparisonTable()}
            {renderSignificantChanges()}
            {renderExportActions()}
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetComparison;