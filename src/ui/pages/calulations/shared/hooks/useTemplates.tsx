// src/ui/pages/calculations/shared/hooks/useTemplates.tsx

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { 
  Template, 
  PublicTemplate, 
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
  TemplateFormErrors
} from '../types/template.types';

// ==================== INTERFACES DEL HOOK ====================
export interface UseTemplatesReturn {
  // Estados principales
  templates: Template[];
  publicTemplates: PublicTemplate[];
  currentTemplate: Template | null;
  loading: boolean;
  error: string | null;
  
  // Estados de formulario
  formState: TemplateFormState | null;
  formErrors: TemplateFormErrors;
  isDirty: boolean;
  isValid: boolean;
  
  // Operaciones CRUD
  createTemplate: (data: TemplateCreateData) => Promise<TemplateOperationResult<Template>>;
  updateTemplate: (id: string, data: TemplateUpdateData) => Promise<TemplateOperationResult<Template>>;
  deleteTemplate: (id: string) => Promise<TemplateOperationResult<void>>;
  duplicateTemplate: (id: string, newName?: string) => Promise<TemplateOperationResult<Template>>;
  
  // Búsqueda y filtrado
  searchTemplates: (options: TemplateSearchOptions) => Promise<TemplateListResponse>;
  getTemplate: (id: string) => Promise<Template | null>;
  getPublicTemplates: (options?: TemplateSearchOptions) => Promise<TemplateListResponse>;
  getMyTemplates: (options?: TemplateSearchOptions) => Promise<TemplateListResponse>;
  
  // Validación
  validateTemplate: (template: Partial<Template>) => Promise<TemplateValidationResponse>;
  validateParameters: (parameters: any) => TemplateValidationResponse;
  
  // Formularios
  initializeForm: (template?: Template) => void;
  updateFormField: (field: string, value: any) => void;
  resetForm: () => void;
  saveForm: () => Promise<TemplateOperationResult<Template>>;
  
  // Sugerencias
  getSuggestions: (templateId: string) => Promise<TemplateSuggestion[]>;
  createSuggestion: (suggestion: Omit<TemplateSuggestion, 'id' | 'suggestedAt'>) => Promise<TemplateOperationResult<TemplateSuggestion>>;
  voteSuggestion: (suggestionId: string, vote: 'up' | 'down') => Promise<TemplateOperationResult<void>>;
  
  // Ejecución
  executeTemplate: (templateId: string, parameters: Record<string, any>) => Promise<TemplateOperationResult<CalculationExecution>>;
  getExecutionHistory: (templateId?: string) => Promise<CalculationExecution[]>;
  
  // Utilidades
  refreshTemplates: () => Promise<void>;
  clearError: () => void;
  setCurrentTemplate: (template: Template | null) => void;
}

// ==================== CONFIGURACIÓN DEL HOOK ====================
const DEFAULT_OPTIONS: UseTemplateOptions = {
  autoSave: false,
  validateOnChange: true,
  loadExamples: false
};

// ==================== ESTADO INICIAL ====================
const INITIAL_FORM_STATE: TemplateFormState = {
  basic: {
    name: '',
    description: '',
    category: 'general',
    tags: [],
    isPublic: false
  },
  parameters: [],
  formulas: [],
  validation: [],
  ui: {
    layout: 'single-column',
    sections: []
  },
  norms: [],
  examples: []
};

// ==================== HOOK PRINCIPAL ====================
export const useTemplates = (options: UseTemplateOptions = {}): UseTemplatesReturn => {
  const config = { ...DEFAULT_OPTIONS, ...options };
  
  // ==================== ESTADOS ====================
  const [templates, setTemplates] = useState<Template[]>([]);
  const [publicTemplates, setPublicTemplates] = useState<PublicTemplate[]>([]);
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null);
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
           formState.basic.name.trim() !== '' &&
           formState.parameters.length > 0;
  }, [formState, formErrors]);
  
  // ==================== UTILIDADES ====================
  const handleError = useCallback((error: any, context: string) => {
    console.error(`Error in ${context}:`, error);
    const message = error?.message || error?.toString() || 'Error desconocido';
    setError(`${context}: ${message}`);
  }, []);
  
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  // ==================== API CALLS (Simuladas - Reemplazar con implementación real) ====================
  const apiCall = useCallback(async <T>(
    endpoint: string, 
    options: RequestInit = {}
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
  const createTemplate = useCallback(async (data: TemplateCreateData): Promise<TemplateOperationResult<Template>> => {
    try {
      const template = await apiCall<Template>('/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      setTemplates(prev => [...prev, template]);
      return { success: true, data: template };
    } catch (error) {
      return { 
        success: false, 
        errors: [error instanceof Error ? error.message : 'Error al crear plantilla'] 
      };
    }
  }, [apiCall]);
  
  const updateTemplate = useCallback(async (id: string, data: TemplateUpdateData): Promise<TemplateOperationResult<Template>> => {
    try {
      const template = await apiCall<Template>(`/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      setTemplates(prev => prev.map(t => t.id === id ? template : t));
      if (currentTemplate?.id === id) {
        setCurrentTemplate(template);
      }
      
      return { success: true, data: template };
    } catch (error) {
      return { 
        success: false, 
        errors: [error instanceof Error ? error.message : 'Error al actualizar plantilla'] 
      };
    }
  }, [apiCall, currentTemplate]);
  
  const deleteTemplate = useCallback(async (id: string): Promise<TemplateOperationResult<void>> => {
    try {
      await apiCall<void>(`/${id}`, { method: 'DELETE' });
      
      setTemplates(prev => prev.filter(t => t.id !== id));
      if (currentTemplate?.id === id) {
        setCurrentTemplate(null);
      }
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        errors: [error instanceof Error ? error.message : 'Error al eliminar plantilla'] 
      };
    }
  }, [apiCall, currentTemplate]);
  
  const duplicateTemplate = useCallback(async (id: string, newName?: string): Promise<TemplateOperationResult<Template>> => {
    try {
      const original = templates.find(t => t.id === id);
      if (!original) {
        return { success: false, errors: ['Plantilla no encontrada'] };
      }
      
      const duplicateData: TemplateCreateData = {
        ...original,
        name: newName || `${original.name} (Copia)`,
        isPublic: false // Las copias no son públicas por defecto
      };
      
      return await createTemplate(duplicateData);
    } catch (error) {
      return { 
        success: false, 
        errors: [error instanceof Error ? error.message : 'Error al duplicar plantilla'] 
      };
    }
  }, [templates, createTemplate]);
  
  // ==================== BÚSQUEDA Y FILTRADO ====================
  const searchTemplates = useCallback(async (options: TemplateSearchOptions): Promise<TemplateListResponse> => {
    try {
      return await apiCall<TemplateListResponse>('/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options)
      });
    } catch (error) {
      handleError(error, 'Búsqueda de plantillas');
      return { templates: [], total: 0, hasMore: false };
    }
  }, [apiCall, handleError]);
  
  const getTemplate = useCallback(async (id: string): Promise<Template | null> => {
    try {
      return await apiCall<Template>(`/${id}`);
    } catch (error) {
      handleError(error, 'Obtener plantilla');
      return null;
    }
  }, [apiCall, handleError]);
  
  const getPublicTemplates = useCallback(async (options?: TemplateSearchOptions): Promise<TemplateListResponse> => {
    try {
      const result = await apiCall<TemplateListResponse>('/public', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...options, filters: { ...options?.filters, isPublic: true } })
      });
      
      setPublicTemplates(result.templates as PublicTemplate[]);
      return result;
    } catch (error) {
      handleError(error, 'Obtener plantillas públicas');
      return { templates: [], total: 0, hasMore: false };
    }
  }, [apiCall, handleError]);
  
  const getMyTemplates = useCallback(async (options?: TemplateSearchOptions): Promise<TemplateListResponse> => {
    try {
      const result = await apiCall<TemplateListResponse>('/my-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options)
      });
      
      setTemplates(result.templates);
      return result;
    } catch (error) {
      handleError(error, 'Obtener mis plantillas');
      return { templates: [], total: 0, hasMore: false };
    }
  }, [apiCall, handleError]);
  
  // ==================== VALIDACIÓN ====================
  const validateTemplate = useCallback(async (template: Partial<Template>): Promise<TemplateValidationResponse> => {
    try {
      return await apiCall<TemplateValidationResponse>('/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(template)
      });
    } catch (error) {
      handleError(error, 'Validar plantilla');
      return { 
        isValid: false, 
        errors: [{ type: 'validation', message: 'Error de validación' }], 
        warnings: [] 
      };
    }
  }, [apiCall, handleError]);
  
  const validateParameters = useCallback((parameters: any): TemplateValidationResponse => {
    const errors: any[] = [];
    const warnings: any[] = [];
    
    // Validaciones básicas
    if (!parameters || typeof parameters !== 'object') {
      errors.push({ type: 'format', message: 'Parámetros inválidos' });
    }
    
    // Aquí irían más validaciones específicas...
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }, []);
  
  // ==================== FORMULARIOS ====================
  const initializeForm = useCallback((template?: Template) => {
    const initialState: TemplateFormState = template ? {
      basic: {
        name: template.name,
        description: template.description,
        category: template.category,
        tags: template.tags,
        isPublic: template.isPublic
      },
      parameters: template.parameters,
      formulas: template.formulas,
      validation: template.validation?.rules || [],
      ui: template.ui || { layout: 'single-column', sections: [] },
      norms: template.norms?.references || [],
      examples: template.examples || []
    } : INITIAL_FORM_STATE;
    
    setFormState(initialState);
    setOriginalFormState(JSON.parse(JSON.stringify(initialState)));
    setFormErrors({});
    setIsDirty(false);
  }, []);
  
  const updateFormField = useCallback((field: string, value: any) => {
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
    
    // Validar si está habilitado
    if (config.validateOnChange) {
      // Aquí iría la validación en tiempo real
    }
  }, [formState, config.validateOnChange]);
  
  const resetForm = useCallback(() => {
    if (originalFormState) {
      setFormState(JSON.parse(JSON.stringify(originalFormState)));
      setFormErrors({});
      setIsDirty(false);
    }
  }, [originalFormState]);
  
  const saveForm = useCallback(async (): Promise<TemplateOperationResult<Template>> => {
    if (!formState) {
      return { success: false, errors: ['No hay datos para guardar'] };
    }
    
    // Construir template desde formState
    const templateData: TemplateCreateData = {
      name: formState.basic.name,
      description: formState.basic.description,
      category: formState.basic.category,
      tags: formState.basic.tags,
      isPublic: formState.basic.isPublic,
      authorId: 'current-user', // Esto vendría del contexto de usuario
      authorName: 'Usuario Actual',
      parameters: formState.parameters,
      formulas: formState.formulas,
      validation: formState.validation.length > 0 ? { rules: formState.validation } : undefined,
      ui: formState.ui,
      norms: formState.norms.length > 0 ? { references: formState.norms, compliance: [] } : undefined,
      examples: formState.examples,
      version: '1.0.0'
    };
    
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
      return await apiCall<TemplateSuggestion[]>(`/${templateId}/suggestions`);
    } catch (error) {
      handleError(error, 'Obtener sugerencias');
      return [];
    }
  }, [apiCall, handleError]);
  
  const createSuggestion = useCallback(async (suggestion: Omit<TemplateSuggestion, 'id' | 'suggestedAt'>): Promise<TemplateOperationResult<TemplateSuggestion>> => {
    try {
      const result = await apiCall<TemplateSuggestion>('/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(suggestion)
      });
      
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        errors: [error instanceof Error ? error.message : 'Error al crear sugerencia'] 
      };
    }
  }, [apiCall]);
  
  const voteSuggestion = useCallback(async (suggestionId: string, vote: 'up' | 'down'): Promise<TemplateOperationResult<void>> => {
    try {
      await apiCall<void>(`/suggestions/${suggestionId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vote })
      });
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        errors: [error instanceof Error ? error.message : 'Error al votar sugerencia'] 
      };
    }
  }, [apiCall]);
  
  // ==================== EJECUCIÓN ====================
  const executeTemplate = useCallback(async (templateId: string, parameters: Record<string, any>): Promise<TemplateOperationResult<CalculationExecution>> => {
    try {
      const result = await apiCall<CalculationExecution>('/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId, parameters })
      });
      
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        errors: [error instanceof Error ? error.message : 'Error al ejecutar plantilla'] 
      };
    }
  }, [apiCall]);
  
  const getExecutionHistory = useCallback(async (templateId?: string): Promise<CalculationExecution[]> => {
    try {
      const endpoint = templateId ? `/executions?templateId=${templateId}` : '/executions';
      return await apiCall<CalculationExecution[]>(endpoint);
    } catch (error) {
      handleError(error, 'Obtener historial de ejecuciones');
      return [];
    }
  }, [apiCall, handleError]);
  
  // ==================== UTILIDADES ADICIONALES ====================
  const refreshTemplates = useCallback(async () => {
    try {
      await getMyTemplates();
    } catch (error) {
      handleError(error, 'Refrescar plantillas');
    }
  }, [getMyTemplates, handleError]);
  
  // ==================== EFECTOS ====================
  useEffect(() => {
    // Cargar plantillas iniciales
    refreshTemplates();
  }, []);
  
  // Auto-save si está habilitado
  useEffect(() => {
    if (config.autoSave && isDirty && isValid && formState) {
      const timeoutId = setTimeout(() => {
        saveForm();
      }, 2000); // Auto-save después de 2 segundos de inactividad
      
      return () => clearTimeout(timeoutId);
    }
  }, [config.autoSave, isDirty, isValid, formState, saveForm]);
  
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
    createSuggestion,
    voteSuggestion,
    
    // Ejecución
    executeTemplate,
    getExecutionHistory,
    
    // Utilidades
    refreshTemplates,
    clearError,
    setCurrentTemplate
  };
};

// ==================== HOOK ESPECÍFICO PARA FORMULARIOS ====================
export const useTemplateForm = (template?: Template) => {
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