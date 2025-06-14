// src/ui/pages/calculations/budget/BudgetHistory.tsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ClockIcon,
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EllipsisVerticalIcon,
  DocumentTextIcon,
  PencilIcon,
  DocumentDuplicateIcon,
  TrashIcon,
  EyeIcon,
  ArrowTopRightOnSquareIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  PlusIcon
} from "@heroicons/react/24/outline";

// Hooks y tipos
import { useBudgets } from "../shared/hooks/useBudgetComparison";
import { BudgetStatus, BudgetType } from "../shared/types/budget.types";
import type { CalculationBudget, BudgetFilters } from "../shared/types/budget.types";


const BudgetHistory: React.FC = () => {
  const { budgetId } = useParams();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBudgets, setSelectedBudgets] = useState<Set<string>>(new Set());
  const [showActions, setShowActions] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  
  // Estados de filtros
  const [filters, setFilters] = useState<BudgetFilters>({
    status: undefined,
    budgetType: undefined,
    dateFrom: undefined,
    dateTo: undefined,
    searchTerm: ""
  });

  // Hook de presupuestos
  const { budgets, loading, error, pagination, fetchBudgets, deleteBudget, duplicateBudget } = useBudgets();

  // Cargar presupuestos al montar
  useEffect(() => {
    loadBudgets();
  }, [filters]);

  // Actualizar búsqueda con debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, searchTerm }));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const loadBudgets = () => {
    fetchBudgets(filters, pagination.page);
  };

  // Obtener color de estado
  const getStatusColor = (status: BudgetStatus) => {
    const colors = {
      [BudgetStatus.DRAFT]: 'bg-gray-100 text-gray-800',
      [BudgetStatus.REVIEW]: 'bg-yellow-100 text-yellow-800',
      [BudgetStatus.APPROVED]: 'bg-green-100 text-green-800',
      [BudgetStatus.REVISED]: 'bg-blue-100 text-blue-800',
      [BudgetStatus.FINAL]: 'bg-purple-100 text-purple-800',
      [BudgetStatus.ARCHIVED]: 'bg-red-100 text-red-800'
    };
    return colors[status] || colors[BudgetStatus.DRAFT];
  };

  // Obtener label de estado
  const getStatusLabel = (status: BudgetStatus) => {
    const labels = {
      [BudgetStatus.DRAFT]: 'Borrador',
      [BudgetStatus.REVIEW]: 'En Revisión',
      [BudgetStatus.APPROVED]: 'Aprobado',
      [BudgetStatus.REVISED]: 'Revisado',
      [BudgetStatus.FINAL]: 'Final',
      [BudgetStatus.ARCHIVED]: 'Archivado'
    };
    return labels[status] || status;
  };

  // Obtener label de tipo
  const getTypeLabel = (type: BudgetType) => {
    const labels = {
      [BudgetType.MATERIALS_ONLY]: 'Solo Materiales',
      [BudgetType.COMPLETE_PROJECT]: 'Proyecto Completo',
      [BudgetType.LABOR_MATERIALS]: 'Materiales + M.O.',
      [BudgetType.PROFESSIONAL_ESTIMATE]: 'Estimación Profesional'
    };
    return labels[type] || type;
  };

  // Manejo de acciones
  const handleEdit = (budget: CalculationBudget) => {
    navigate(`/calculations/budget/generator/${budget.id}`);
  };

  const handleDuplicate = async (budget: CalculationBudget) => {
    try {
      const newName = `${budget.name} (Copia)`;
      await duplicateBudget(budget.id, newName);
      // TODO: Mostrar toast de éxito
    } catch (error) {
      // TODO: Mostrar toast de error
    }
  };

  const handleDelete = async (budget: CalculationBudget) => {
    if (window.confirm(`¿Estás seguro de eliminar "${budget.name}"?`)) {
      try {
        await deleteBudget(budget.id);
        // TODO: Mostrar toast de éxito
      } catch (error) {
        // TODO: Mostrar toast de error
      }
    }
  };

  const handleExport = (budget: CalculationBudget) => {
    navigate(`/calculations/budget/export/${budget.id}`);
  };

  // Renderizar filtros
  const renderFilters = () => {
    if (!showFilters) return null;

    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={filters.status || ''}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                status: e.target.value as BudgetStatus || undefined
              }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos</option>
              {Object.values(BudgetStatus).map(status => (
                <option key={status} value={status}>
                  {getStatusLabel(status)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo
            </label>
            <select
              value={filters.budgetType || ''}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                budgetType: e.target.value as BudgetType || undefined
              }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos</option>
              {Object.values(BudgetType).map(type => (
                <option key={type} value={type}>
                  {getTypeLabel(type)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Desde
            </label>
            <input
              type="date"
              value={filters.dateFrom || ''}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                dateFrom: e.target.value || undefined
              }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hasta
            </label>
            <input
              type="date"
              value={filters.dateTo || ''}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                dateTo: e.target.value || undefined
              }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => setFilters({
              status: undefined,
              budgetType: undefined,
              dateFrom: undefined,
              dateTo: undefined,
              searchTerm: ""
            })}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Limpiar filtros
          </button>
        </div>
      </div>
    );
  };

  // Renderizar acciones de un presupuesto
  const renderBudgetActions = (budget: CalculationBudget) => (
    <div className="relative">
      <button
        onClick={() => setShowActions(showActions === budget.id ? null : budget.id)}
        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <EllipsisVerticalIcon className="h-5 w-5" />
      </button>

      {showActions === budget.id && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg border border-gray-200 shadow-lg z-10">
          <div className="py-1">
            <button
              onClick={() => {
                // TODO: Ver detalles del presupuesto
                setShowActions(null);
              }}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <EyeIcon className="h-4 w-4" />
              Ver Detalles
            </button>

            {budget.status === BudgetStatus.DRAFT && (
              <button
                onClick={() => {
                  handleEdit(budget);
                  setShowActions(null);
                }}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <PencilIcon className="h-4 w-4" />
                Editar
              </button>
            )}

            <button
              onClick={() => {
                handleDuplicate(budget);
                setShowActions(null);
              }}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <DocumentDuplicateIcon className="h-4 w-4" />
              Duplicar
            </button>

            <button
              onClick={() => {
                handleExport(budget);
                setShowActions(null);
              }}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              Exportar
            </button>

            <div className="border-t border-gray-100 my-1"></div>

            <button
              onClick={() => {
                handleDelete(budget);
                setShowActions(null);
              }}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <TrashIcon className="h-4 w-4" />
              Eliminar
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Renderizar card de presupuesto
  const renderBudgetCard = (budget: CalculationBudget) => (
    <div
      key={budget.id}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{budget.name}</h3>
          {budget.description && (
            <p className="text-gray-600 text-sm mb-2">{budget.description}</p>
          )}
          
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" />
              {new Date(budget.updatedAt).toLocaleDateString('es-EC')}
            </div>
            <div className="flex items-center gap-1">
              <CurrencyDollarIcon className="h-4 w-4" />
              ${budget.summary.grandTotal.toLocaleString('es-EC')}
            </div>
          </div>
        </div>

        {renderBudgetActions(budget)}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(budget.status)}`}>
            {getStatusLabel(budget.status)}
          </span>
          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
            {getTypeLabel(budget.budgetType)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport(budget)}
            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <ArrowTopRightOnSquareIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => navigate(`/calculations/budget/comparison/new?budgets=${budget.id}`)}
            className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors"
          >
            <DocumentDuplicateIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  // Renderizar lista de presupuestos
  const renderBudgetList = () => (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">
                Nombre
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">
                Estado
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">
                Tipo
              </th>
              <th className="text-right px-6 py-3 text-sm font-medium text-gray-900">
                Total
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">
                Fecha
              </th>
              <th className="text-center px-6 py-3 text-sm font-medium text-gray-900">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {budgets.map((budget) => (
              <tr key={budget.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <h4 className="font-medium text-gray-900">{budget.name}</h4>
                    {budget.description && (
                      <p className="text-sm text-gray-600 line-clamp-1">{budget.description}</p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(budget.status)}`}>
                    {getStatusLabel(budget.status)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-700">
                    {getTypeLabel(budget.budgetType)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="font-medium text-gray-900">
                    ${budget.summary.grandTotal.toLocaleString('es-EC')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600">
                    {new Date(budget.updatedAt).toLocaleDateString('es-EC')}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  {renderBudgetActions(budget)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Renderizar paginación
  const renderPagination = () => {
    if (pagination.pages <= 1) return null;

    return (
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Mostrando {(pagination.page - 1) * pagination.limit + 1} a{" "}
          {Math.min(pagination.page * pagination.limit, pagination.total)} de{" "}
          {pagination.total} resultados
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchBudgets(filters, pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
              const pageNum = pagination.page - 2 + i;
              if (pageNum < 1 || pageNum > pagination.pages) return null;
              
              return (
                <button
                  key={pageNum}
                  onClick={() => fetchBudgets(filters, pageNum)}
                  className={`px-3 py-2 text-sm rounded-lg ${
                    pageNum === pagination.page
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => fetchBudgets(filters, pagination.page + 1)}
            disabled={pagination.page >= pagination.pages}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/calculations/budget")}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                  <ClockIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Historial de Presupuestos
                  </h1>
                  <p className="text-sm text-gray-600">
                    Gestiona, revisa y exporta tus presupuestos anteriores
                  </p>
                </div>
              </div>
            </div>

            <Link
              to="/calculations/budget/generator"
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
              Nuevo Presupuesto
            </Link>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar presupuestos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`
              px-4 py-3 rounded-xl border transition-all duration-200 flex items-center gap-2
              ${showFilters 
                ? "bg-blue-50 border-blue-300 text-blue-700" 
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }
            `}
          >
            <FunnelIcon className="h-5 w-5" />
            Filtros
          </button>

          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 text-sm ${
                viewMode === 'list' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Lista
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 text-sm ${
                viewMode === 'grid' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Tarjetas
            </button>
          </div>
        </div>

        {/* Filtros */}
        {renderFilters()}

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-800">Error al cargar presupuestos</h4>
                <p className="text-red-700 text-sm mt-1">{error}</p>
                <button
                  onClick={loadBudgets}
                  className="text-red-800 hover:text-red-900 font-medium text-sm mt-2 underline"
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Contenido */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Cargando presupuestos...</p>
            </div>
          </div>
        ) : budgets.length === 0 ? (
          <div className="text-center py-12">
            <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay presupuestos
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || Object.values(filters).some(Boolean)
                ? "No se encontraron presupuestos con los filtros aplicados"
                : "Aún no has creado ningún presupuesto"
              }
            </p>
            <Link
              to="/calculations/budget/generator"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              Crear Primer Presupuesto
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Lista o grid de presupuestos */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {budgets.map(renderBudgetCard)}
              </div>
            ) : (
              renderBudgetList()
            )}

            {/* Paginación */}
            {renderPagination()}
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetHistory;