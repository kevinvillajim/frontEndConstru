// src/ui/pages/calculations/budget/BudgetTemplateManager.tsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  DocumentDuplicateIcon,
  ArrowLeftIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  EyeIcon,
  CheckBadgeIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";

import { 
  ProjectType, 
  GeographicalZone, 
  BudgetTemplateScope,
} from "../shared/types/budget.types";

import type { 
  BudgetTemplate, 
  BudgetTemplateFilters,
} from "../shared/types/budget.types";

import { useBudgetTemplates } from "../shared/hooks/useBudgetGeneration";

const BudgetTemplateManager: React.FC = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showActions, setShowActions] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Estados de filtros
  const [filters, setFilters] = useState<BudgetTemplateFilters>({
    projectType: undefined,
    geographicalZone: undefined,
    scope: undefined,
    verified: undefined,
    searchTerm: ""
  });

  // Hook de plantillas
  const { templates, loading, error, fetchTemplates } = useBudgetTemplates();

  // Cargar plantillas al montar
  useEffect(() => {
    loadTemplates();
  }, [filters]);

  // Actualizar búsqueda con debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, searchTerm }));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const loadTemplates = () => {
    fetchTemplates(filters);
  };

  // Obtener color de scope
  const getScopeColor = (scope: BudgetTemplateScope) => {
    const colors = {
      [BudgetTemplateScope.SYSTEM]: 'bg-purple-100 text-purple-800',
      [BudgetTemplateScope.COMPANY]: 'bg-blue-100 text-blue-800',
      [BudgetTemplateScope.PERSONAL]: 'bg-green-100 text-green-800',
      [BudgetTemplateScope.SHARED]: 'bg-yellow-100 text-yellow-800'
    };
    return colors[scope] || colors[BudgetTemplateScope.PERSONAL];
  };

  // Obtener label de scope
  const getScopeLabel = (scope: BudgetTemplateScope) => {
    const labels = {
      [BudgetTemplateScope.SYSTEM]: 'Oficial',
      [BudgetTemplateScope.COMPANY]: 'Empresarial',
      [BudgetTemplateScope.PERSONAL]: 'Personal',
      [BudgetTemplateScope.SHARED]: 'Compartida'
    };
    return labels[scope] || scope;
  };

  // Obtener label de tipo de proyecto
  const getProjectTypeLabel = (projectType: ProjectType) => {
    const labels = {
      [ProjectType.RESIDENTIAL_SINGLE]: "Casa Unifamiliar",
      [ProjectType.RESIDENTIAL_MULTI]: "Multifamiliar",
      [ProjectType.COMMERCIAL_SMALL]: "Comercial Pequeño",
      [ProjectType.COMMERCIAL_LARGE]: "Comercial Grande",
      [ProjectType.INDUSTRIAL]: "Industrial",
      [ProjectType.INFRASTRUCTURE]: "Infraestructura",
      [ProjectType.RENOVATION]: "Renovación",
      [ProjectType.SPECIALIZED]: "Especializado"
    };
    return labels[projectType] || projectType;
  };

  // Manejo de acciones
  const handleEdit = (template: BudgetTemplate) => {
    navigate(`/calculations/budget/templates/edit/${template.id}`);
  };

  const handleDuplicate = async (template: BudgetTemplate) => {
    try {
      // TODO: Implementar duplicación
      console.log('Duplicating template:', template.id);
    } catch (error) {
      console.error('Error duplicating template:', error);
    }
  };

  const handleDelete = async (template: BudgetTemplate) => {
    if (window.confirm(`¿Estás seguro de eliminar "${template.name}"?`)) {
      try {
        // TODO: Implementar eliminación
        console.log('Deleting template:', template.id);
      } catch (error) {
        console.error('Error deleting template:', error);
      }
    }
  };

  const handleExport = (template: BudgetTemplate) => {
    // TODO: Implementar exportación
    console.log('Exporting template:', template.id);
  };

  const handleImport = () => {
    // TODO: Implementar importación
    console.log('Importing template');
  };

  // Renderizar filtros
  const renderFilters = () => {
    if (!showFilters) return null;

    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Proyecto
            </label>
            <select
              value={filters.projectType || ''}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                projectType: e.target.value as ProjectType || undefined
              }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos</option>
              {Object.values(ProjectType).map(type => (
                <option key={type} value={type}>
                  {getProjectTypeLabel(type)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zona Geográfica
            </label>
            <select
              value={filters.geographicalZone || ''}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                geographicalZone: e.target.value as GeographicalZone || undefined
              }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todas</option>
              {Object.values(GeographicalZone).map(zone => (
                <option key={zone} value={zone}>{zone}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alcance
            </label>
            <select
              value={filters.scope || ''}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                scope: e.target.value as BudgetTemplateScope || undefined
              }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos</option>
              {Object.values(BudgetTemplateScope).map(scope => (
                <option key={scope} value={scope}>
                  {getScopeLabel(scope)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Solo Verificadas
            </label>
            <select
              value={filters.verified === undefined ? '' : filters.verified.toString()}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                verified: e.target.value === '' ? undefined : e.target.value === 'true'
              }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todas</option>
              <option value="true">Solo verificadas</option>
              <option value="false">No verificadas</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => setFilters({
              projectType: undefined,
              geographicalZone: undefined,
              scope: undefined,
              verified: undefined,
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

  // Renderizar acciones de plantilla
  const renderTemplateActions = (template: BudgetTemplate) => (
    <div className="relative">
      <button
        onClick={() => setShowActions(showActions === template.id ? null : template.id)}
        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <EllipsisVerticalIcon className="h-5 w-5" />
      </button>

      {showActions === template.id && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg border border-gray-200 shadow-lg z-10">
          <div className="py-1">
            <button
              onClick={() => {
                // TODO: Ver detalles
                setShowActions(null);
              }}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <EyeIcon className="h-4 w-4" />
              Ver Detalles
            </button>

            {template.scope === BudgetTemplateScope.PERSONAL && (
              <button
                onClick={() => {
                  handleEdit(template);
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
                handleDuplicate(template);
                setShowActions(null);
              }}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <DocumentDuplicateIcon className="h-4 w-4" />
              Duplicar
            </button>

            <button
              onClick={() => {
                handleExport(template);
                setShowActions(null);
              }}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <DocumentArrowDownIcon className="h-4 w-4" />
              Exportar
            </button>

            {template.scope === BudgetTemplateScope.PERSONAL && (
              <>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={() => {
                    handleDelete(template);
                    setShowActions(null);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <TrashIcon className="h-4 w-4" />
                  Eliminar
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // Renderizar card de plantilla
  const renderTemplateCard = (template: BudgetTemplate) => (
    <div
      key={template.id}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
            {template.isVerified && (
              <CheckBadgeIcon className="h-5 w-5 text-blue-600" />
            )}
          </div>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{template.description}</p>
          
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScopeColor(template.scope)}`}>
              {getScopeLabel(template.scope)}
            </span>
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              {getProjectTypeLabel(template.projectType)}
            </span>
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              {template.geographicalZone}
            </span>
          </div>
        </div>

        {renderTemplateActions(template)}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-4">
          <span>Usos: {template.usageCount}</span>
          {template.rating > 0 && (
            <div className="flex items-center gap-1">
              <StarSolidIcon className="h-4 w-4 text-yellow-400" />
              <span>{template.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        
        <span>v{template.version}</span>
      </div>

      {/* Tags */}
      {template.tags.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {template.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {template.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{template.tags.length - 3}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // Renderizar lista de plantillas
  const renderTemplateList = () => (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">
                Nombre
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">
                Tipo
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">
                Alcance
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">
                Zona
              </th>
              <th className="text-center px-6 py-3 text-sm font-medium text-gray-900">
                Usos
              </th>
              <th className="text-center px-6 py-3 text-sm font-medium text-gray-900">
                Rating
              </th>
              <th className="text-center px-6 py-3 text-sm font-medium text-gray-900">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {templates.map((template) => (
              <tr key={template.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{template.name}</h4>
                      <p className="text-sm text-gray-600 line-clamp-1">{template.description}</p>
                    </div>
                    {template.isVerified && (
                      <CheckBadgeIcon className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-700">
                    {getProjectTypeLabel(template.projectType)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScopeColor(template.scope)}`}>
                    {getScopeLabel(template.scope)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-700">{template.geographicalZone}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm text-gray-700">{template.usageCount}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  {template.rating > 0 ? (
                    <div className="flex items-center justify-center gap-1">
                      <StarSolidIcon className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-gray-700">{template.rating.toFixed(1)}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  {renderTemplateActions(template)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

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
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <DocumentDuplicateIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Plantillas de Presupuesto
                  </h1>
                  <p className="text-sm text-gray-600">
                    Gestiona tus plantillas empresariales y personales
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleImport}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <DocumentArrowUpIcon className="h-4 w-4" />
                Importar
              </button>
              
              <button
                onClick={() => navigate("/calculations/budget/templates/create")}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="h-4 w-4" />
                Nueva Plantilla
              </button>
            </div>
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
              placeholder="Buscar plantillas..."
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
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 text-sm ${
                viewMode === 'grid' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Tarjetas
            </button>
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
                <h4 className="font-medium text-red-800">Error al cargar plantillas</h4>
                <p className="text-red-700 text-sm mt-1">{error}</p>
                <button
                  onClick={loadTemplates}
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
              <p className="text-gray-600">Cargando plantillas...</p>
            </div>
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-12">
            <DocumentDuplicateIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay plantillas
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || Object.values(filters).some(Boolean)
                ? "No se encontraron plantillas con los filtros aplicados"
                : "Aún no has creado ninguna plantilla personalizada"
              }
            </p>
            <button
              onClick={() => navigate("/calculations/budget/templates/create")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              Crear Primera Plantilla
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Grid o lista de plantillas */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map(renderTemplateCard)}
              </div>
            ) : (
              renderTemplateList()
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetTemplateManager;