import { useState, useEffect, useCallback, useMemo } from 'react';
import type { 
  MyCalculationTemplate,
  PublicCalculationTemplate,
  CalculationTemplate, // Tipo legacy para compatibilidad
  TemplateCreateData,
  TemplateUpdateData,
  TemplateFilters,
  TemplateSearchOptions,
  TemplateListResponse,
  TemplateValidationResponse,
  TemplateOperationResult,
  TemplateSuggestion,
  CalculationExecution,
  UseTemplateOptions,
  TemplateFormState,
  TemplateFormErrors,
  TemplateStats,
  TemplateCategoryType,
  ParameterValidation,
  ParameterType,
  DEFAULT_PARAMETER_VALUES,
  FormFieldValue,
  ParameterValues
} from '../types/template.types';

// Definir nuestro propio tipo para las opciones de la API
type ApiRequestOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: string | FormData;
  credentials?: 'include' | 'omit' | 'same-origin';
  mode?: 'cors' | 'no-cors' | 'same-origin';
  cache?: 'default' | 'no-cache' | 'reload' | 'force-cache' | 'only-if-cached';
  redirect?: 'follow' | 'error' | 'manual';
  referrer?: string;
  referrerPolicy?: ReferrerPolicy;
  integrity?: string;
  keepalive?: boolean;
  signal?: AbortSignal;
};

// ==================== INTERFACES DEL HOOK ====================
export interface UseTemplatesReturn {
  // Estados principales
  templates: MyCalculationTemplate[];
  publicTemplates: PublicCalculationTemplate[];
  currentTemplate: MyCalculationTemplate | null;
  loading: boolean;
  error: string | null;
  
  // Estados de formulario
  formState: TemplateFormState | null;
  formErrors: TemplateFormErrors;
  isDirty: boolean;
  isValid: boolean;
  
  // Operaciones CRUD
  createTemplate: (data: TemplateCreateData) => Promise<TemplateOperationResult>;
  updateTemplate: (id: string, data: TemplateUpdateData) => Promise<TemplateOperationResult>;
  deleteTemplate: (id: string) => Promise<TemplateOperationResult>;
  duplicateTemplate: (id: string, newName?: string) => Promise<TemplateOperationResult>;
  
  // Búsqueda y filtrado
  searchTemplates: (options: TemplateSearchOptions) => Promise<TemplateListResponse>;
  getTemplate: (id: string) => Promise<MyCalculationTemplate | null>;
  getPublicTemplates: (options?: TemplateSearchOptions) => Promise<TemplateListResponse>;
  getMyTemplates: (options?: TemplateSearchOptions) => Promise<TemplateListResponse>;
  
  // Validación
  validateTemplate: (template: Partial<MyCalculationTemplate>) => Promise<TemplateValidationResponse>;
  validateParameters: (parameters: ParameterValues) => ParameterValidation;
  
  // Formularios
  initializeForm: (template?: MyCalculationTemplate) => void;
  updateFormField: (field: string, value: FormFieldValue) => void;
  resetForm: () => void;
  saveForm: () => Promise<TemplateOperationResult>;
  
  // Sugerencias
  getSuggestions: (templateId: string) => Promise<TemplateSuggestion[]>;
  submitSuggestion: (suggestion: Partial<TemplateSuggestion>) => Promise<TemplateSuggestion>;
  createSuggestion: (suggestion: Omit<TemplateSuggestion, 'id' | 'createdAt'>) => Promise<TemplateOperationResult>;
  voteSuggestion: (suggestionId: string, vote: 'up' | 'down') => Promise<TemplateOperationResult>;
  
  // Ejecución
  executeTemplate: (templateId: string, parameters: ParameterValues) => Promise<TemplateOperationResult>;
  getExecutionHistory: (templateId?: string) => Promise<CalculationExecution[]>;
  
  // Utilidades para compatibilidad con CalculationTemplate (legacy)
  getFilteredTemplates: (filters?: TemplateFilters) => CalculationTemplate[];
  getTemplateStats: (templates: CalculationTemplate[]) => TemplateStats;
  getRelatedTemplates: (templateId: string, limit?: number) => CalculationTemplate[];
  toggleFavorite: (templateId: string) => void;
  categories: TemplateCategoryType[];
  isLoading: boolean;
  
  // Utilidades
  refreshTemplates: () => Promise<void>;
  clearError: () => void;
  setCurrentTemplate: (template: MyCalculationTemplate | null) => void;
}

// ==================== CONFIGURACIÓN DEL HOOK ====================
const DEFAULT_OPTIONS: UseTemplateOptions = {
  autoLoad: true,
  defaultFilters: {},
  includePublic: true,
  includePersonal: true
};

// ==================== ESTADO INICIAL ====================
const INITIAL_FORM_STATE: TemplateFormState = {
  data: {
    name: '',
    description: '',
    longDescription: '',
    category: '',
    subcategory: '',
    targetProfessions: [],
    difficulty: 'basic',
    estimatedTime: '',
    necReference: '',
    tags: [],
    isPublic: false,
    parameters: [],
    formula: '',
    requirements: [],
    applicationCases: [],
    limitations: []
  },
  errors: {},
  isSubmitting: false,
  isDirty: false,
  currentStep: 0,
  totalSteps: 5
};

// ==================== MOCK DATA ====================
const MOCK_CATEGORIES: TemplateCategoryType[] = [
  {
    id: 'structural',
    name: 'Estructural',
    description: 'Análisis y diseño estructural',
    color: 'bg-blue-50 border-blue-200 text-blue-700',
    count: 15
  },
  {
    id: 'electrical',
    name: 'Eléctrico',
    description: 'Instalaciones eléctricas',
    color: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    count: 12
  },
  {
    id: 'architectural',
    name: 'Arquitectónico',
    description: 'Diseño arquitectónico',
    color: 'bg-green-50 border-green-200 text-green-700',
    count: 8
  },
  {
    id: 'hydraulic',
    name: 'Hidráulico',
    description: 'Sistemas hidráulicos',
    color: 'bg-cyan-50 border-cyan-200 text-cyan-700',
    count: 6
  },
  {
    id: 'custom',
    name: 'Personalizada',
    description: 'Plantillas personalizadas',
    color: 'bg-purple-50 border-purple-200 text-purple-700',
    count: 3
  }
];

// ==================== CONVERSIÓN DE TIPOS ====================
const convertToLegacyTemplate = (template: MyCalculationTemplate | PublicCalculationTemplate): CalculationTemplate => {
  const isPublic = 'verified' in template;
  
  return {
    id: template.id,
    name: template.name,
    description: template.description,
    version: template.version,
    category: template.category,
    subcategory: template.subcategory,
    profession: template.targetProfessions,
    tags: template.tags,
    difficulty: template.difficulty,
    estimatedTime: template.estimatedTime || '10-15 min',
    necReference: template.necReference || '',
    requirements: template.requirements || [],
    parameters: template.parameters,
    verified: isPublic ? (template as PublicCalculationTemplate).verified : false,
    isPublic: isPublic,
    isNew: false,
    trending: false,
    popular: template.usageCount > 100,
    rating: isPublic 
      ? (template as PublicCalculationTemplate).communityRating.average 
      : template.totalRatings ? (template.totalRatings / 5) : 4.0,
    usageCount: template.usageCount,
    lastUpdated: template.lastModified,
    isFavorite: template.isFavorite,
    color: 'from-primary-600 to-secondary-500',
    icon: null as any, // Se asignará en el componente
    allowSuggestions: true,
    createdBy: template.author?.id,
    // Corregir el acceso a contributors para asegurar que existe en ambos tipos
    contributors: isPublic 
      ? [] // PublicCalculationTemplate no tiene contributors
      : (template as MyCalculationTemplate).contributors?.map(c => c.id) || []
  };
};

// ==================== HOOK PRINCIPAL ====================
export const useTemplates = (options: UseTemplateOptions = {}): UseTemplatesReturn => {
  const config = { ...DEFAULT_OPTIONS, ...options };
  
  // ==================== ESTADOS ====================
  const [templates, setTemplates] = useState<MyCalculationTemplate[]>([]);
  const [publicTemplates, setPublicTemplates] = useState<PublicCalculationTemplate[]>([]);
  const [currentTemplate, setCurrentTemplate] = useState<MyCalculationTemplate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estados de formulario
  const [formState, setFormState] = useState<TemplateFormState | null>(null);
  const [formErrors, setFormErrors] = useState<TemplateFormErrors>({});
  const [isDirty, setIsDirty] = useState(false);
  const [originalFormState, setOriginalFormState] = useState<TemplateFormState | null>(null);
  
  // ==================== VALIDACIÓN ====================
  const isValid = useMemo(() => {
    if (!formState) return false;
    return Object.keys(formErrors).length === 0 && 
           formState.data.name.trim() !== '' &&
           formState.data.description.trim() !== '' &&
           formState.data.category !== '';
  }, [formState, formErrors]);
  
  // ==================== UTILIDADES ====================
  const handleError = useCallback((error: unknown, context: string) => {
    console.error(`Error in ${context}:`, error);
    const message = error instanceof Error ? error.message : 
                    typeof error === 'string' ? error : 'Error desconocido';
    setError(`${context}: ${message}`);
  }, []);
  
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  // ==================== API CALLS (Simuladas) ====================
  const apiCall = useCallback(async <T>(
    endpoint: string, 
    options: ApiRequestOptions = {} as ApiRequestOptions
  ): Promise<T> => {
    try {
      setLoading(true);
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Aquí iría la llamada real a la API
      // const response = await fetch(`/api/templates${endpoint}`, options);
      // if (!response.ok) throw new Error(response.statusText);
      // return await response.json();
      
      // Por ahora retornamos datos mock
      return {} as T;
    } catch (err) {
      handleError(err, `API Call ${endpoint}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [handleError]);
  
  // ==================== OPERACIONES CRUD ====================
  const createTemplate = useCallback(async (data: TemplateCreateData): Promise<TemplateOperationResult> => {
    try {
      const newTemplate: MyCalculationTemplate = {
        id: `template_${Date.now()}`,
        ...data,
        version: '1.0.0',
        usageCount: 0,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        isActive: true,
        status: 'draft',
        sharedWith: [],
        isFavorite: false
      };
      
      setTemplates(prev => [...prev, newTemplate]);
      return { success: true, data: newTemplate };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error al crear plantilla'
      };
    }
  }, []);
  
  const updateTemplate = useCallback(async (id: string, data: TemplateUpdateData): Promise<TemplateOperationResult> => {
    try {
      setTemplates(prev => prev.map(t => {
        if (t.id === id) {
          const updated = { ...t, ...data, lastModified: new Date().toISOString() };
          if (currentTemplate?.id === id) {
            setCurrentTemplate(updated);
          }
          return updated;
        }
        return t;
      }));
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error al actualizar plantilla'
      };
    }
  }, [currentTemplate]);
  
  const deleteTemplate = useCallback(async (id: string): Promise<TemplateOperationResult> => {
    try {
      setTemplates(prev => prev.filter(t => t.id !== id));
      if (currentTemplate?.id === id) {
        setCurrentTemplate(null);
      }
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error al eliminar plantilla'
      };
    }
  }, [currentTemplate]);
  
  const duplicateTemplate = useCallback(async (id: string, newName?: string): Promise<TemplateOperationResult> => {
    try {
      const original = templates.find(t => t.id === id);
      if (!original) {
        return { success: false, error: 'Plantilla no encontrada' };
      }
      
      const duplicateData: TemplateCreateData = {
        name: newName || `${original.name} (Copia)`,
        description: original.description,
        longDescription: original.longDescription,
        category: original.category,
        subcategory: original.subcategory,
        targetProfessions: original.targetProfessions,
        difficulty: original.difficulty,
        estimatedTime: original.estimatedTime,
        necReference: original.necReference,
        tags: original.tags,
        isPublic: false, // Las copias no son públicas por defecto
        parameters: original.parameters,
        formula: original.formula,
        requirements: original.requirements,
        applicationCases: original.applicationCases,
        limitations: original.limitations
      };
      
      return await createTemplate(duplicateData);
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error al duplicar plantilla'
      };
    }
  }, [templates, createTemplate]);
  
  // ==================== BÚSQUEDA Y FILTRADO ====================
  const searchTemplates = useCallback(async (options: TemplateSearchOptions): Promise<TemplateListResponse> => {
    try {
      // Simular búsqueda - en realidad haría una llamada a la API
      const allTemplates = [...templates, ...publicTemplates];
      const filtered = allTemplates.filter(template => {
        if (options.query) {
          return template.name.toLowerCase().includes(options.query.toLowerCase()) ||
                 template.description.toLowerCase().includes(options.query.toLowerCase());
        }
        return true;
      });
      
      return { 
        templates: filtered,
        pagination: {
          page: 1,
          limit: 10,
          total: filtered.length,
          pages: Math.ceil(filtered.length / 10)
        },
        filters: options.filters || {}
      };
    } catch (error) {
      handleError(error, 'Búsqueda de plantillas');
      return { 
        templates: [], 
        pagination: { page: 1, limit: 10, total: 0, pages: 0 },
        filters: {}
      };
    }
  }, [templates, publicTemplates, handleError]);
  
  const getTemplate = useCallback(async (id: string): Promise<MyCalculationTemplate | null> => {
    try {
      return templates.find(t => t.id === id) || null;
    } catch (error) {
      handleError(error, 'Obtener plantilla');
      return null;
    }
  }, [templates, handleError]);
  
  const getPublicTemplates = useCallback(async (options?: TemplateSearchOptions): Promise<TemplateListResponse> => {
    try {
      return { 
        templates: publicTemplates,
        pagination: {
          page: 1,
          limit: 10,
          total: publicTemplates.length,
          pages: Math.ceil(publicTemplates.length / 10)
        },
        filters: options?.filters || {}
      };
    } catch (error) {
      handleError(error, 'Obtener plantillas públicas');
      return { 
        templates: [], 
        pagination: { page: 1, limit: 10, total: 0, pages: 0 },
        filters: {}
      };
    }
  }, [publicTemplates, handleError]);
  
  const getMyTemplates = useCallback(async (options?: TemplateSearchOptions): Promise<TemplateListResponse> => {
    try {
      return { 
        templates: templates,
        pagination: {
          page: 1,
          limit: 10,
          total: templates.length,
          pages: Math.ceil(templates.length / 10)
        },
        filters: options?.filters || {}
      };
    } catch (error) {
      handleError(error, 'Obtener mis plantillas');
      return { 
        templates: [], 
        pagination: { page: 1, limit: 10, total: 0, pages: 0 },
        filters: {}
      };
    }
  }, [templates, handleError]);
  
  // ==================== VALIDACIÓN ====================
  const validateTemplate = useCallback(async (template: Partial<MyCalculationTemplate>): Promise<TemplateValidationResponse> => {
    try {
      const errors: Array<{type: string; message: string; field?: string}> = [];
      const warnings: Array<{type: string; message: string; field?: string}> = [];
      
      if (!template.name?.trim()) {
        errors.push({ type: 'required', message: 'El nombre es requerido', field: 'name' });
      }
      
      if (!template.description?.trim()) {
        errors.push({ type: 'required', message: 'La descripción es requerida', field: 'description' });
      }
      
      if (!template.category) {
        errors.push({ type: 'required', message: 'La categoría es requerida', field: 'category' });
      }
      
      return { 
        isValid: errors.length === 0, 
        errors, 
        warnings 
      };
    } catch (error) {
      handleError(error, 'Validar plantilla');
      return { 
        isValid: false, 
        errors: [{ type: 'validation', message: 'Error de validación' }], 
        warnings: [] 
      };
    }
  }, [handleError]);
  
  const validateParameters = useCallback((parameters: ParameterValues): ParameterValidation => {
    const errors: Record<string, string> = {};
    const warnings: Record<string, string> = {};
    
    // Validaciones básicas
    if (!parameters || typeof parameters !== 'object') {
      errors.general = 'Parámetros inválidos';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      warnings
    };
  }, []);
  
  // ==================== FORMULARIOS ====================
  const initializeForm = useCallback((template?: MyCalculationTemplate) => {
    const initialState: TemplateFormState = template ? {
      data: {
        name: template.name,
        description: template.description,
        longDescription: template.longDescription || '',
        category: template.category,
        subcategory: template.subcategory,
        targetProfessions: template.targetProfessions,
        difficulty: template.difficulty,
        estimatedTime: template.estimatedTime || '',
        necReference: template.necReference || '',
        tags: template.tags,
        isPublic: template.isPublic,
        parameters: template.parameters,
        formula: template.formula || '',
        requirements: template.requirements || [],
        applicationCases: template.applicationCases || [],
        limitations: template.limitations || []
      },
      errors: {},
      isSubmitting: false,
      isDirty: false,
      currentStep: 0,
      totalSteps: 5
    } : INITIAL_FORM_STATE;
    
    setFormState(initialState);
    setOriginalFormState(JSON.parse(JSON.stringify(initialState)));
    setFormErrors({});
    setIsDirty(false);
  }, []);
  
  const updateFormField = useCallback((field: string, value: FormFieldValue) => {
    if (!formState) return;
    
    setFormState(prev => {
      if (!prev) return prev;
      
      const keys = field.split('.');
      const newState = JSON.parse(JSON.stringify(prev));
      
      let current = newState;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      
      return newState;
    });
    
    // Marcar como modificado
    setIsDirty(true);
  }, [formState]);
  
  const resetForm = useCallback(() => {
    if (originalFormState) {
      setFormState(JSON.parse(JSON.stringify(originalFormState)));
      setFormErrors({});
      setIsDirty(false);
    }
  }, [originalFormState]);
  
  const saveForm = useCallback(async (): Promise<TemplateOperationResult> => {
    if (!formState) {
      return { success: false, error: 'No hay datos para guardar' };
    }
    
    const templateData: TemplateCreateData = formState.data;
    const result = await createTemplate(templateData);
    
    if (result.success) {
      setIsDirty(false);
      setOriginalFormState(JSON.parse(JSON.stringify(formState)));
    }
    
    return result;
  }, [formState, createTemplate]);
  
  // ==================== SUGERENCIAS ====================
  const getSuggestions = useCallback(async (templateId: string): Promise<TemplateSuggestion[]> => {
    try {
      // Simular obtención de sugerencias
      return [];
    } catch (error) {
      handleError(error, 'Obtener sugerencias');
      return [];
    }
  }, [handleError]);

  const submitSuggestion = useCallback(async (suggestion: Partial<TemplateSuggestion>): Promise<TemplateSuggestion> => {
    try {
      // Simular envío de sugerencia
      const newSuggestion: TemplateSuggestion = {
        id: `suggestion_${Date.now()}`,
        templateId: suggestion.templateId || '',
        templateName: suggestion.templateName || '',
        suggestionType: suggestion.suggestionType || 'other',
        title: suggestion.title || '',
        description: suggestion.description || '',
        currentValue: suggestion.currentValue,
        proposedValue: suggestion.proposedValue,
        justification: suggestion.justification || '',
        priority: suggestion.priority || 'medium',
        affectsAccuracy: suggestion.affectsAccuracy || false,
        affectsCompliance: suggestion.affectsCompliance || false,
        references: suggestion.references || [],
        contactForFollowUp: suggestion.contactForFollowUp || false,
        status: 'pending',
        authorId: 'current-user',
        authorName: 'Usuario Actual',
        createdAt: new Date().toISOString()
      };
      
      return newSuggestion;
    } catch (error) {
      handleError(error, 'Enviar sugerencia');
      throw error;
    }
  }, [handleError]);
  
  const createSuggestion = useCallback(async (suggestion: Omit<TemplateSuggestion, 'id' | 'createdAt'>): Promise<TemplateOperationResult> => {
    try {
      const result = await submitSuggestion(suggestion);
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error al crear sugerencia'
      };
    }
  }, [submitSuggestion]);
  
  const voteSuggestion = useCallback(async (suggestionId: string, vote: 'up' | 'down'): Promise<TemplateOperationResult> => {
    try {
      // Simular votación
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error al votar sugerencia'
      };
    }
  }, []);
  
  // ==================== EJECUCIÓN ====================
  const executeTemplate = useCallback(async (templateId: string, parameters: ParameterValues): Promise<TemplateOperationResult> => {
    try {
      // Simular ejecución
      const execution: CalculationExecution = {
        id: `execution_${Date.now()}`,
        templateId,
        parameters,
        status: 'completed',
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        duration: 1000
      };
      
      return { success: true, data: execution };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error al ejecutar plantilla'
      };
    }
  }, []);
  
  const getExecutionHistory = useCallback(async (templateId?: string): Promise<CalculationExecution[]> => {
    try {
      // Simular historial
      return [];
    } catch (error) {
      handleError(error, 'Obtener historial de ejecuciones');
      return [];
    }
  }, [handleError]);
  
  // ==================== UTILIDADES PARA COMPATIBILIDAD ====================
  const getFilteredTemplates = useCallback((filters?: TemplateFilters): CalculationTemplate[] => {
    const allTemplates = [...templates, ...publicTemplates];
    let filtered = allTemplates;
    
    if (filters?.searchTerm) {
      filtered = filtered.filter(template => 
        template.name.toLowerCase().includes(filters.searchTerm!.toLowerCase()) ||
        template.description.toLowerCase().includes(filters.searchTerm!.toLowerCase())
      );
    }
    
    if (filters?.category) {
      filtered = filtered.filter(template => template.category === filters.category);
    }
    
    if (filters?.difficulty) {
      filtered = filtered.filter(template => template.difficulty === filters.difficulty);
    }
    
    if (filters?.showOnlyFavorites) {
      filtered = filtered.filter(template => template.isFavorite);
    }
    
    if (filters?.showOnlyVerified) {
      filtered = filtered.filter(template => 'verified' in template ? template.verified : false);
    }
    
    return filtered.map(convertToLegacyTemplate);
  }, [templates, publicTemplates]);
  
  const getTemplateStats = useCallback((templates: CalculationTemplate[]): TemplateStats => {
    return {
      total: templates.length,
      verifiedCount: templates.filter(t => t.verified).length,
      avgRating: templates.reduce((sum, t) => sum + t.rating, 0) / templates.length || 0,
      totalUsage: templates.reduce((sum, t) => sum + t.usageCount, 0),
      trendingCount: templates.filter(t => t.trending).length,
      popularCount: templates.filter(t => t.popular).length
    };
  }, []);
  
  const getRelatedTemplates = useCallback((templateId: string, limit: number = 5): CalculationTemplate[] => {
    const template = [...templates, ...publicTemplates].find(t => t.id === templateId);
    if (!template) return [];
    
    const related = [...templates, ...publicTemplates]
      .filter(t => t.id !== templateId && t.category === template.category)
      .slice(0, limit);
    
    return related.map(convertToLegacyTemplate);
  }, [templates, publicTemplates]);
  
  const toggleFavorite = useCallback((templateId: string) => {
    setTemplates(prev => prev.map(t => 
      t.id === templateId ? { ...t, isFavorite: !t.isFavorite } : t
    ));
    
    setPublicTemplates(prev => prev.map(t => 
      t.id === templateId ? { ...t, isFavorite: !t.isFavorite } : t
    ));
  }, []);
  
  // ==================== UTILIDADES ADICIONALES ====================
  const refreshTemplates = useCallback(async () => {
    try {
      // Simular refresco de datos
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      handleError(error, 'Refrescar plantillas');
    } finally {
      setLoading(false);
    }
  }, [handleError]);
  
  // ==================== EFECTOS ====================
  useEffect(() => {
    if (config.autoLoad) {
      refreshTemplates();
    }
  }, [config.autoLoad, refreshTemplates]);
  
  // ==================== RETORNO ====================
  return {
    // Estados principales
    templates,
    publicTemplates,
    currentTemplate,
    loading,
    error,
    
    // Estados de formulario
    formState,
    formErrors,
    isDirty,
    isValid,
    
    // Operaciones CRUD
    createTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    
    // Búsqueda y filtrado
    searchTemplates,
    getTemplate,
    getPublicTemplates,
    getMyTemplates,
    
    // Validación
    validateTemplate,
    validateParameters,
    
    // Formularios
    initializeForm,
    updateFormField,
    resetForm,
    saveForm,
    
    // Sugerencias
    getSuggestions,
    submitSuggestion,
    createSuggestion,
    voteSuggestion,
    
    // Ejecución
    executeTemplate,
    getExecutionHistory,
    
    // Utilidades para compatibilidad
    getFilteredTemplates,
    getTemplateStats,
    getRelatedTemplates,
    toggleFavorite,
    categories: MOCK_CATEGORIES,
    isLoading: loading,
    
    // Utilidades
    refreshTemplates,
    clearError,
    setCurrentTemplate
  };
};

// ==================== HOOK ESPECÍFICO PARA FORMULARIOS ====================
export const useTemplateForm = (template?: MyCalculationTemplate) => {
  const { 
    formState, 
    formErrors, 
    isDirty, 
    isValid,
    initializeForm,
    updateFormField,
    resetForm,
    saveForm
  } = useTemplates();
  
  useEffect(() => {
    initializeForm(template);
  }, [template, initializeForm]);
  
  return {
    formState,
    formErrors,
    isDirty,
    isValid,
    updateFormField,
    resetForm,
    saveForm
  };
};

// ==================== HOOK PARA BÚSQUEDA ====================
export const useTemplateSearch = () => {
  const { searchTemplates, getPublicTemplates, getMyTemplates } = useTemplates();
  
  return {
    searchTemplates,
    getPublicTemplates,
    getMyTemplates
  };
};

export default useTemplates;