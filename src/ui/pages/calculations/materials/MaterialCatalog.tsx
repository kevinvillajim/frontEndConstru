// src/ui/pages/calculations/materials/MaterialCatalog.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { 
  MaterialCalculationType, 
  type MaterialCalculationTemplate,
  type MaterialCalculationFilters
} from '../shared/types/material.types';
import { 
  MATERIAL_CATEGORIES,
  MATERIAL_UI_CONFIG 
} from '../shared/types/material.types';
import { useMaterialTemplates } from '../shared/hooks/useMaterialCalculations';

interface MaterialCatalogProps {
  onTemplateSelect: (template: MaterialCalculationTemplate) => void;
  selectedCategory?: MaterialCalculationType;
}

const MaterialCatalog: React.FC<MaterialCatalogProps> = ({ 
  onTemplateSelect, 
  selectedCategory 
}) => {
  const [filters, setFilters] = useState<MaterialCalculationFilters>({
    type: selectedCategory,
    sortBy: 'usage',
    sortOrder: 'desc'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { 
    templates, 
    loading, 
    error, 
    pagination, 
    fetchTemplates 
  } = useMaterialTemplates();

  useEffect(() => {
    const searchFilters = {
      ...filters,
      searchTerm: searchTerm.trim() || undefined
    };
    fetchTemplates(searchFilters);
  }, [filters, searchTerm, fetchTemplates]);

  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      if (filters.type && template.type !== filters.type) return false;
      if (filters.isFeatured && !template.isFeatured) return false;
      if (filters.minRating && template.averageRating < filters.minRating) return false;
      return true;
    });
  }, [templates, filters]);

  const MaterialTemplateCard: React.FC<{ template: MaterialCalculationTemplate }> = ({ template }) => {
    const categoryConfig = MATERIAL_CATEGORIES[template.type];
    
    return (
      <div 
        className={`
          bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700
          ${MATERIAL_UI_CONFIG.cardHover} ${MATERIAL_UI_CONFIG.defaultTransition}
          cursor-pointer p-6 group
        `}
        onClick={() => onTemplateSelect(template)}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`
              w-12 h-12 rounded-lg flex items-center justify-center
              ${categoryConfig.color} bg-opacity-20 group-hover:bg-opacity-30 transition-all
            `}>
              <span className="text-2xl">{categoryConfig.icon}</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {template.name}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700">
                  {categoryConfig.name}
                </span>
                {template.isVerified && (
                  <span className="inline-flex items-center text-green-600 dark:text-green-400">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verificada
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center space-x-1 mb-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.floor(template.averageRating)
                      ? 'text-yellow-400'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {template.averageRating.toFixed(1)} ({template.ratingCount})
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {template.description}
        </p>

        {/* Tags */}
        {template.tags && template.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {template.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {template.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                +{template.tags.length - 3} más
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{template.usageCount}</span>
            </div>
            
            {template.author && (
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{template.author.name}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                // Implementar favoritos
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            
            <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
              Usar Plantilla
            </button>
          </div>
        </div>
      </div>
    );
  };

  const FilterBar: React.FC = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
        {/* Búsqueda */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar plantillas de materiales..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Filtros */}
        <div className="flex items-center space-x-4">
          {/* Categoría */}
          <select
            value={filters.type || ''}
            onChange={(e) => setFilters({ ...filters, type: e.target.value as MaterialCalculationType || undefined })}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas las categorías</option>
            {Object.values(MaterialCalculationType).map((type) => (
              <option key={type} value={type}>
                {MATERIAL_CATEGORIES[type].name}
              </option>
            ))}
          </select>

          {/* Destacadas */}
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filters.isFeatured || false}
              onChange={(e) => setFilters({ ...filters, isFeatured: e.target.checked || undefined })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Destacadas</span>
          </label>

          {/* Ordenar */}
          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-');
              setFilters({ 
                ...filters, 
                sortBy: sortBy as MaterialCalculationFilters['sortBy'], 
                sortOrder: sortOrder as MaterialCalculationFilters['sortOrder'] 
              });
            }}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="usage-desc">Más usadas</option>
            <option value="rating-desc">Mejor calificadas</option>
            <option value="date-desc">Más recientes</option>
            <option value="name-asc">Nombre A-Z</option>
          </select>

          {/* Vista */}
          <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'} transition-colors`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'} transition-colors`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="text-red-500 text-xl mb-4">⚠️ Error al cargar plantillas</div>
        <p className="text-gray-600 dark:text-gray-400">{error}</p>
        <button 
          onClick={() => fetchTemplates(filters)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FilterBar />
      
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No se encontraron plantillas
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Intenta ajustar los filtros o términos de búsqueda
          </p>
        </div>
      ) : (
        <>
          {/* Resultados header */}
          <div className="flex items-center justify-between">
            <div className="text-gray-600 dark:text-gray-400">
              {pagination.total} plantillas encontradas
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Página {pagination.page} de {pagination.pages}
            </div>
          </div>

          {/* Grid de plantillas */}
          <div className={`
            ${viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'space-y-4'
            }
          `}>
            {filteredTemplates.map((template) => (
              <MaterialTemplateCard key={template.id} template={template} />
            ))}
          </div>

          {/* Paginación */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-8">
              {[...Array(pagination.pages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setFilters({ ...filters })} // Implementar cambio de página
                  className={`
                    px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${pagination.page === index + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MaterialCatalog;