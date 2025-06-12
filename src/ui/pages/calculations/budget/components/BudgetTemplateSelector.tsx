// src/ui/pages/calculations/budget/components/BudgetTemplateSelector.tsx

import React, { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  SparklesIcon,
  CheckBadgeIcon,
  StarIcon,
  DocumentDuplicateIcon,
  BuildingOfficeIcon,
  HomeIcon,
  TruckIcon,
  WrenchScrewdriverIcon
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";

import { 
  ProjectType, 
  GeographicalZone, 
  BudgetTemplateScope 
} from "../../shared/types/budget.types";

import type { BudgetTemplate } from "../../shared/types/budget.types";
import { useBudgetTemplates } from "../../shared/hooks/useBudgetGeneration";

interface BudgetTemplateSelectorProps {
  calculationResultId?: string;
  selectedTemplate: BudgetTemplate | null;
  onTemplateSelect: (template: BudgetTemplate) => void;
  loading?: boolean;
}

const BudgetTemplateSelector: React.FC<BudgetTemplateSelectorProps> = ({
  calculationResultId,
  selectedTemplate,
  onTemplateSelect,
  loading: externalLoading = false
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<'recommended' | 'all' | 'trending'>('recommended');
  
  // Estados de filtros
  const [filters, setFilters] = useState({
    projectType: undefined as ProjectType | undefined,
    geographicalZone: undefined as GeographicalZone | undefined,
    scope: undefined as BudgetTemplateScope | undefined,
    verified: undefined as boolean | undefined
  });

  // Hook para manejo de plantillas
  const { 
    templates, 
    loading, 
    error, 
    fetchTemplates, 
    getRecommendations,
    getTrending 
  } = useBudgetTemplates();

  const [recommendedTemplates, setRecommendedTemplates] = useState<BudgetTemplate[]>([]);
  const [trendingTemplates, setTrendingTemplates] = useState<BudgetTemplate[]>([]);

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Cargar plantillas generales
        await fetchTemplates(filters);

        // Cargar recomendaciones si hay calculationResultId
        if (calculationResultId && activeTab === 'recommended') {
          const recommendations = await getRecommendations(
            ProjectType.RESIDENTIAL_SINGLE, // TODO: Obtener del cálculo
            GeographicalZone.QUITO, // TODO: Obtener del usuario
            calculationResultId
          );
          setRecommendedTemplates(recommendations);
        }

        // Cargar trending
        if (activeTab === 'trending') {
          const trending = await getTrending(20);
          setTrendingTemplates(trending);
        }
      } catch (error) {
        console.error('Error loading templates:', error);
      }
    };

    loadInitialData();
  }, [activeTab, filters, calculationResultId, fetchTemplates, getRecommendations, getTrending]);

  // Obtener plantillas para mostrar según el tab activo
  const getDisplayTemplates = () => {
    switch (activeTab) {
      case 'recommended':
        return recommendedTemplates;
      case 'trending':
        return trendingTemplates;
      case 'all':
      default:
        return templates;
    }
  };

  // Filtrar plantillas por búsqueda
  const filteredTemplates = getDisplayTemplates().filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Iconos para tipos de proyecto
  const getProjectTypeIcon = (projectType: ProjectType) => {
    switch (projectType) {
      case ProjectType.RESIDENTIAL_SINGLE:
      case ProjectType.RESIDENTIAL_MULTI:
        return HomeIcon;
      case ProjectType.COMMERCIAL_SMALL:
      case ProjectType.COMMERCIAL_LARGE:
        return BuildingOfficeIcon;
      case ProjectType.INDUSTRIAL:
        return TruckIcon;
      default:
        return WrenchScrewdriverIcon;
    }
  };

  // Labels amigables para tipos de proyecto
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

  // Renderizar card de plantilla
  const renderTemplateCard = (template: BudgetTemplate) => {
    const isSelected = selectedTemplate?.id === template.id;
    const ProjectIcon = getProjectTypeIcon(template.projectType);

    return (
      <div
        key={template.id}
        onClick={() => onTemplateSelect(template)}
        className={`
          relative cursor-pointer transition-all duration-200 transform hover:scale-105
          ${isSelected 
            ? "ring-2 ring-emerald-500 ring-offset-2 shadow-lg" 
            : "hover:shadow-lg"
          }
        `}
      >
        <div className={`
          bg-white rounded-2xl border-2 p-6 h-full
          ${isSelected 
            ? "border-emerald-500 bg-emerald-50" 
            : "border-gray-200 hover:border-gray-300"
          }
        `}>
          {/* Header de la card */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`
                w-12 h-12 rounded-xl flex items-center justify-center
                ${isSelected 
                  ? "bg-emerald-500 text-white" 
                  : "bg-gray-100 text-gray-600"
                }
              `}>
                <ProjectIcon className="h-6 w-6" />
              </div>
              
              <div>
                <h3 className={`font-semibold text-lg ${isSelected ? "text-emerald-900" : "text-gray-900"}`}>
                  {template.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {getProjectTypeLabel(template.projectType)}
                </p>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-col gap-2">
              {template.isVerified && (
                <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  <CheckBadgeIcon className="h-3 w-3" />
                  Verificado
                </div>
              )}
              
              {template.scope === BudgetTemplateScope.SYSTEM && (
                <div className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                  Oficial
                </div>
              )}
            </div>
          </div>

          {/* Descripción */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {template.description}
          </p>

          {/* Información adicional */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Zona geográfica:</span>
              <span className="font-medium text-gray-700">{template.geographicalZone}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Usos:</span>
              <span className="font-medium text-gray-700">{template.usageCount}</span>
            </div>

            {template.rating > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Valoración:</span>
                <div className="flex items-center gap-1">
                  <StarSolidIcon className="h-4 w-4 text-yellow-400" />
                  <span className="font-medium text-gray-700">{template.rating.toFixed(1)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          {template.tags.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {template.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
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

          {/* Indicador de selección */}
          {isSelected && (
            <div className="absolute top-3 right-3">
              <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                <CheckBadgeIcon className="h-4 w-4 text-white" />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Renderizar filtros
  const renderFilters = () => {
    if (!showFilters) return null;

    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Tipo de proyecto */}
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">Todos</option>
              {Object.values(ProjectType).map(type => (
                <option key={type} value={type}>
                  {getProjectTypeLabel(type)}
                </option>
              ))}
            </select>
          </div>

          {/* Zona geográfica */}
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">Todas</option>
              {Object.values(GeographicalZone).map(zone => (
                <option key={zone} value={zone}>{zone}</option>
              ))}
            </select>
          </div>

          {/* Alcance */}
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">Todos</option>
              <option value={BudgetTemplateScope.SYSTEM}>Oficiales</option>
              <option value={BudgetTemplateScope.COMPANY}>Empresariales</option>
              <option value={BudgetTemplateScope.PERSONAL}>Personales</option>
              <option value={BudgetTemplateScope.SHARED}>Compartidas</option>
            </select>
          </div>

          {/* Solo verificadas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verificación
            </label>
            <select
              value={filters.verified === undefined ? '' : filters.verified.toString()}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                verified: e.target.value === '' ? undefined : e.target.value === 'true'
              }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
              verified: undefined
            })}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Limpiar filtros
          </button>
        </div>
      </div>
    );
  };

  const isLoading = loading || externalLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Seleccionar Plantilla de Presupuesto
        </h2>
        <p className="text-gray-600">
          Elige una plantilla base para generar tu presupuesto de manera rápida y precisa
        </p>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar plantillas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`
            px-4 py-3 rounded-xl border transition-all duration-200 flex items-center gap-2
            ${showFilters 
              ? "bg-emerald-50 border-emerald-300 text-emerald-700" 
              : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }
          `}
        >
          <FunnelIcon className="h-5 w-5" />
          Filtros
        </button>
      </div>

      {/* Filtros */}
      {renderFilters()}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { key: 'recommended', label: 'Recomendadas', icon: SparklesIcon, count: recommendedTemplates.length },
            { key: 'all', label: 'Todas', icon: DocumentDuplicateIcon, count: templates.length },
            { key: 'trending', label: 'Populares', icon: StarIcon, count: trendingTemplates.length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`
                flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-all duration-200
                ${activeTab === tab.key
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              {tab.count > 0 && (
                <span className={`
                  px-2 py-0.5 text-xs rounded-full
                  ${activeTab === tab.key
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-gray-100 text-gray-600"
                  }
                `}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenido */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Cargando plantillas...</p>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => fetchTemplates(filters)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="text-center py-12">
          <DocumentDuplicateIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron plantillas
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || Object.values(filters).some(Boolean)
              ? "Intenta ajustar los filtros o términos de búsqueda"
              : "No hay plantillas disponibles en esta categoría"
            }
          </p>
          {(searchTerm || Object.values(filters).some(Boolean)) && (
            <button
              onClick={() => {
                setSearchTerm("");
                setFilters({
                  projectType: undefined,
                  geographicalZone: undefined,
                  scope: undefined,
                  verified: undefined
                });
              }}
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(renderTemplateCard)}
        </div>
      )}

      {/* Información adicional */}
      {selectedTemplate && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <CheckBadgeIcon className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-emerald-900">
                Plantilla seleccionada: {selectedTemplate.name}
              </h4>
              <p className="text-emerald-700 text-sm mt-1">
                Esta plantilla se aplicará como base para tu presupuesto. Podrás personalizar 
                todos los valores en los siguientes pasos.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetTemplateSelector;