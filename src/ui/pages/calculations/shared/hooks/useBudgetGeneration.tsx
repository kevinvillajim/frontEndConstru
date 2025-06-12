// src/ui/pages/calculations/shared/hooks/useBudgetGeneration.tsx

import { useState, useCallback, useEffect } from 'react';
import {
  GeographicalZone,
  ProjectType,
  BudgetType
} from '../types/budget.types';
import type {  CalculationBudget,
    BudgetTemplate,
    CreateBudgetRequest,
    BudgetConfiguration,} from '../types/budget.types';
import ApiClient from '../../../../../../src/core/adapters/api/ApiClient';

interface UseBudgetGenerationState {
  // Estado del wizard
  currentStep: number;
  totalSteps: number;
  canProceed: boolean;
  canGoBack: boolean;
  
  // Datos de configuración
  selectedTemplate: BudgetTemplate | null;
  budgetName: string;
  budgetDescription: string;
  configuration: Partial<BudgetConfiguration>;
  
  // Estado de la generación
  generating: boolean;
  generated: CalculationBudget | null;
  error: string | null;
  
  // Validaciones
  validationErrors: Record<string, string>;
  isValid: boolean;
}

interface UseBudgetGenerationOptions {
  calculationResultId?: string;
  projectId?: string;
  onBudgetCreated?: (budget: CalculationBudget) => void;
  autoAdvance?: boolean;
}

export const useBudgetGeneration = (options: UseBudgetGenerationOptions = {}) => {
  const {
    calculationResultId,
    projectId,
    onBudgetCreated,
    autoAdvance = true
  } = options;

  const [state, setState] = useState<UseBudgetGenerationState>({
    currentStep: 1,
    totalSteps: 4,
    canProceed: false,
    canGoBack: false,
    selectedTemplate: null,
    budgetName: '',
    budgetDescription: '',
    configuration: {
      includeLabor: true,
      includeProfessionalFees: true,
      includeIndirectCosts: true,
      contingencyPercentage: 5,
      taxPercentage: 12,
      geographicalZone: GeographicalZone.QUITO,
      currency: 'USD',
      customMaterials: [],
      customLaborCosts: []
    },
    generating: false,
    generated: null,
    error: null,
    validationErrors: {},
    isValid: false
  });

  // Validar estado actual
  const validateCurrentStep = useCallback(() => {
    const errors: Record<string, string> = {};
    
    switch (state.currentStep) {
      case 1: // Selección de template
        if (!state.selectedTemplate) {
          errors.template = 'Debe seleccionar una plantilla';
        }
        break;
        
      case 2: // Configuración básica
        if (!state.budgetName.trim()) {
          errors.name = 'El nombre del presupuesto es requerido';
        } else if (state.budgetName.length < 3) {
          errors.name = 'El nombre debe tener al menos 3 caracteres';
        }
        break;
        
      case 3: // Configuración avanzada
        if (state.configuration.contingencyPercentage !== undefined) {
          if (state.configuration.contingencyPercentage < 0 || state.configuration.contingencyPercentage > 50) {
            errors.contingency = 'El porcentaje de contingencia debe estar entre 0 y 50%';
          }
        }
        if (state.configuration.taxPercentage !== undefined) {
          if (state.configuration.taxPercentage < 0 || state.configuration.taxPercentage > 30) {
            errors.tax = 'El porcentaje de impuestos debe estar entre 0 y 30%';
          }
        }
        break;
        
      case 4: // Revisión final
        // Validar que todos los pasos anteriores estén completos
        if (!state.selectedTemplate || !state.budgetName.trim()) {
          errors.general = 'Hay errores en pasos anteriores que deben corregirse';
        }
        break;
    }

    const isValid = Object.keys(errors).length === 0;
    const canProceed = isValid && state.currentStep < state.totalSteps;
    const canGoBack = state.currentStep > 1;

    setState(prev => ({
      ...prev,
      validationErrors: errors,
      isValid,
      canProceed,
      canGoBack
    }));

    return isValid;
  }, [state.currentStep, state.selectedTemplate, state.budgetName, state.configuration]);

  // Efectos para validación automática
  useEffect(() => {
    validateCurrentStep();
  }, [validateCurrentStep]);

  // Acciones del wizard
  const actions = {
    // Navegación
    nextStep: useCallback(() => {
      if (validateCurrentStep() && state.currentStep < state.totalSteps) {
        setState(prev => ({
          ...prev,
          currentStep: prev.currentStep + 1
        }));
      }
    }, [validateCurrentStep, state.currentStep, state.totalSteps]),

    prevStep: useCallback(() => {
      if (state.currentStep > 1) {
        setState(prev => ({
          ...prev,
          currentStep: prev.currentStep - 1
        }));
      }
    }, [state.currentStep]),

    goToStep: useCallback((step: number) => {
      if (step >= 1 && step <= state.totalSteps) {
        setState(prev => ({
          ...prev,
          currentStep: step
        }));
      }
    }, [state.totalSteps]),

    // Configuración de datos
    setSelectedTemplate: useCallback((template: BudgetTemplate | null) => {
      setState(prev => ({
        ...prev,
        selectedTemplate: template,
        // Auto-configurar algunas opciones basadas en el template
        configuration: template ? {
          ...prev.configuration,
          geographicalZone: template.geographicalZone,
          ...template.wasteFactors && { wasteFactors: template.wasteFactors }
        } : prev.configuration
      }));

      if (autoAdvance && template && state.currentStep === 1) {
        setTimeout(() => actions.nextStep(), 500);
      }
    }, [autoAdvance, state.currentStep]),

    setBudgetName: useCallback((name: string) => {
      setState(prev => ({
        ...prev,
        budgetName: name
      }));
    }, []),

    setBudgetDescription: useCallback((description: string) => {
      setState(prev => ({
        ...prev,
        budgetDescription: description
      }));
    }, []),

    updateConfiguration: useCallback((updates: Partial<BudgetConfiguration>) => {
      setState(prev => ({
        ...prev,
        configuration: {
          ...prev.configuration,
          ...updates
        }
      }));
    }, []),

    // Generación del presupuesto
    generateBudget: useCallback(async () => {
      if (!validateCurrentStep()) {
        return;
      }

      setState(prev => ({
        ...prev,
        generating: true,
        error: null
      }));

      try {
        const budgetType = state.configuration.includeLabor 
          ? BudgetType.COMPLETE_PROJECT 
          : BudgetType.MATERIALS_ONLY;

        const request: CreateBudgetRequest = {
          name: state.budgetName,
          description: state.budgetDescription || undefined,
          projectId,
          budgetType,
          calculationResultId,
          budgetTemplateId: state.selectedTemplate?.id,
          configuration: state.configuration
        };

        const response = await ApiClient.post<CalculationBudget>('/api/calculation-budgets', request);
        
        setState(prev => ({
          ...prev,
          generated: response,
          generating: false
        }));

        onBudgetCreated?.(response);
        
        return response;
      } catch (error) {
        setState(prev => ({
          ...prev,
          generating: false,
          error: error instanceof Error ? error.message : 'Error al generar el presupuesto'
        }));
        throw error;
      }
    }, [validateCurrentStep, state.budgetName, state.budgetDescription, state.selectedTemplate, state.configuration, projectId, calculationResultId, onBudgetCreated]),

    // Reset del wizard
    reset: useCallback(() => {
      setState({
        currentStep: 1,
        totalSteps: 4,
        canProceed: false,
        canGoBack: false,
        selectedTemplate: null,
        budgetName: '',
        budgetDescription: '',
        configuration: {
          includeLabor: true,
          includeProfessionalFees: true,
          includeIndirectCosts: true,
          contingencyPercentage: 5,
          taxPercentage: 12,
          geographicalZone: GeographicalZone.QUITO,
          currency: 'USD',
          customMaterials: [],
          customLaborCosts: []
        },
        generating: false,
        generated: null,
        error: null,
        validationErrors: {},
        isValid: false
      });
    }, []),

    // Manejo de errores
    clearError: useCallback(() => {
      setState(prev => ({
        ...prev,
        error: null
      }));
    }, [])
  };

  // Información de estado para el UI
  const stepInfo = {
    current: state.currentStep,
    total: state.totalSteps,
    percentage: (state.currentStep / state.totalSteps) * 100,
    isFirst: state.currentStep === 1,
    isLast: state.currentStep === state.totalSteps,
    canProceed: state.canProceed,
    canGoBack: state.canGoBack
  };

  const stepTitles = [
    'Seleccionar Plantilla',
    'Configuración Básica',
    'Configuración Avanzada',
    'Revisión y Generación'
  ];

  return {
    // Estado
    ...state,
    stepInfo,
    stepTitles,
    
    // Acciones
    ...actions,
    
    // Utilidades
    validateCurrentStep,
    isStepValid: (step: number) => {
      // Lógica para validar un paso específico
      const currentStep = state.currentStep;
      setState(prev => ({ ...prev, currentStep: step }));
      const valid = validateCurrentStep();
      setState(prev => ({ ...prev, currentStep }));
      return valid;
    }
  };
};

// Hook para gestión de plantillas de presupuesto
export const useBudgetTemplates = () => {
  const [templates, setTemplates] = useState<BudgetTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = useCallback(async (filters?: {
    projectType?: ProjectType;
    geographicalZone?: GeographicalZone;
    verified?: boolean;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filters?.projectType) params.append('projectType', filters.projectType);
      if (filters?.geographicalZone) params.append('geographicalZone', filters.geographicalZone);
      if (filters?.verified !== undefined) params.append('verified', filters.verified.toString());

      const response = await ApiClient.get<{ templates: BudgetTemplate[] }>(
        `/api/budget-templates?${params.toString()}`
      );
      
      setTemplates(response.templates || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar plantillas');
    } finally {
      setLoading(false);
    }
  }, []);

  const getRecommendations = useCallback(async (
    projectType: ProjectType,
    geographicalZone: GeographicalZone,
    calculationResultId?: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        projectType,
        geographicalZone
      });
      
      if (calculationResultId) {
        params.append('calculationResultId', calculationResultId);
      }

      const response = await ApiClient.get<{ templates: BudgetTemplate[] }>(
        `/api/budget-templates/recommendations?${params.toString()}`
      );
      
      return response.templates || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener recomendaciones');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getTrending = useCallback(async (limit: number = 10) => {
    try {
      const response = await ApiClient.get<{ templates: BudgetTemplate[] }>(
        `/api/budget-templates/trending?limit=${limit}`
      );
      
      return response.templates || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener plantillas trending');
      return [];
    }
  }, []);

  return {
    templates,
    loading,
    error,
    fetchTemplates,
    getRecommendations,
    getTrending,
    clearError: () => setError(null)
  };
};