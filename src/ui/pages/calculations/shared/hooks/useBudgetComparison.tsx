// src/ui/pages/calculations/shared/hooks/useBudgetComparison.tsx

import { useState, useCallback, useEffect } from 'react';
import type {
  CalculationBudget,
  BudgetComparison,
  ComparisonAnalysis,
  BudgetFilters,
} from '../types/budget.types';
import ApiClient from '../../../../../../src/core/adapters/api/ApiClient';

interface UseBudgetComparisonState {
  // Presupuestos disponibles
  availableBudgets: CalculationBudget[];
  selectedBudgets: CalculationBudget[];
  
  // Comparación actual
  comparison: BudgetComparison | null;
  analysis: ComparisonAnalysis | null;
  
  // Estados de carga
  loadingBudgets: boolean;
  loadingComparison: boolean;
  
  // Errores
  error: string | null;
  
  // Configuración
  maxComparisons: number;
  comparisonName: string;
}

export const useBudgetComparison = (projectId?: string) => {
  const [state, setState] = useState<UseBudgetComparisonState>({
    availableBudgets: [],
    selectedBudgets: [],
    comparison: null,
    analysis: null,
    loadingBudgets: false,
    loadingComparison: false,
    error: null,
    maxComparisons: 4,
    comparisonName: ''
  });

  // Cargar presupuestos disponibles
  const loadAvailableBudgets = useCallback(async (filters?: BudgetFilters) => {
    setState(prev => ({ ...prev, loadingBudgets: true, error: null }));

    try {
      const params = new URLSearchParams();
      if (projectId) params.append('projectId', projectId);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.budgetType) params.append('budgetType', filters.budgetType);
      if (filters?.searchTerm) params.append('search', filters.searchTerm);
      
      // Solo presupuestos aprobados o finales para comparación
      params.append('status', 'approved,final');

      const response = await ApiClient.get<{ budgets: CalculationBudget[] }>(
        `/api/calculation-budgets?${params.toString()}`
      );

      setState(prev => ({
        ...prev,
        availableBudgets: response.budgets || [],
        loadingBudgets: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loadingBudgets: false,
        error: error instanceof Error ? error.message : 'Error al cargar presupuestos'
      }));
    }
  }, [projectId]);

  // Seleccionar/deseleccionar presupuesto para comparación
  const toggleBudgetSelection = useCallback((budget: CalculationBudget) => {
    setState(prev => {
      const isSelected = prev.selectedBudgets.some(b => b.id === budget.id);
      
      if (isSelected) {
        // Deseleccionar
        return {
          ...prev,
          selectedBudgets: prev.selectedBudgets.filter(b => b.id !== budget.id)
        };
      } else {
        // Seleccionar si no se ha alcanzado el máximo
        if (prev.selectedBudgets.length >= prev.maxComparisons) {
          return {
            ...prev,
            error: `Solo se pueden comparar hasta ${prev.maxComparisons} presupuestos`
          };
        }
        
        return {
          ...prev,
          selectedBudgets: [...prev.selectedBudgets, budget],
          error: null
        };
      }
    });
  }, []);

  // Limpiar selección
  const clearSelection = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedBudgets: [],
      comparison: null,
      analysis: null,
      error: null
    }));
  }, []);

  // Realizar comparación
  const performComparison = useCallback(async () => {
    if (state.selectedBudgets.length < 2) {
      setState(prev => ({
        ...prev,
        error: 'Debe seleccionar al menos 2 presupuestos para comparar'
      }));
      return;
    }

    setState(prev => ({ ...prev, loadingComparison: true, error: null }));

    try {
      const budgetIds = state.selectedBudgets.map(b => b.id);
      
      const response = await ApiClient.post<BudgetComparison>('/api/calculation-budgets/compare', {
        budgetIds,
        name: state.comparisonName || `Comparación ${new Date().toLocaleDateString()}`,
        type: 'version_comparison'
      });

      setState(prev => ({
        ...prev,
        comparison: response,
        analysis: response.analysis,
        loadingComparison: false
      }));

      return response;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loadingComparison: false,
        error: error instanceof Error ? error.message : 'Error al realizar la comparación'
      }));
    }
  }, [state.selectedBudgets, state.comparisonName]);

  // Análisis de diferencias por categoría
  const getCategoryDifferences = useCallback(() => {
    if (!state.analysis) return [];

    return state.analysis.costDifferences.map(diff => ({
      category: diff.category,
      values: diff.differences.map(d => ({
        budgetId: d.budgetId,
        value: d.value,
        percentage: d.percentage,
        budget: state.selectedBudgets.find(b => b.id === d.budgetId)
      })),
      maxDifference: Math.max(...diff.differences.map(d => Math.abs(d.percentage))),
      avgValue: diff.differences.reduce((sum, d) => sum + d.value, 0) / diff.differences.length
    }));
  }, [state.analysis, state.selectedBudgets]);

  // Análisis de variaciones significativas
  const getSignificantChanges = useCallback(() => {
    if (!state.analysis) return [];

    return state.analysis.significantChanges.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
  }, [state.analysis]);

  // Resumen de totales
  const getTotalsSummary = useCallback(() => {
    return state.selectedBudgets.map(budget => ({
      budgetId: budget.id,
      budgetName: budget.name,
      total: budget.summary.grandTotal,
      materialsTotal: budget.summary.materialsTotal,
      laborTotal: budget.summary.laborTotal,
      indirectCostsTotal: budget.summary.indirectCostsTotal,
      professionalFeesTotal: budget.summary.professionalFeesTotal
    }));
  }, [state.selectedBudgets]);

  // Calcular estadísticas de comparación
  const getComparisonStats = useCallback(() => {
    const totals = getTotalsSummary();
    if (totals.length === 0) return null;

    const grandTotals = totals.map(t => t.total);
    const min = Math.min(...grandTotals);
    const max = Math.max(...grandTotals);
    const avg = grandTotals.reduce((sum, total) => sum + total, 0) / grandTotals.length;
    const variance = ((max - min) / avg) * 100;

    return {
      min: { value: min, budget: totals.find(t => t.total === min) },
      max: { value: max, budget: totals.find(t => t.total === max) },
      average: avg,
      variance: variance,
      totalDifference: max - min,
      count: totals.length
    };
  }, [getTotalsSummary]);

  // Exportar comparación
  const exportComparison = useCallback(async (format: 'pdf' | 'excel' = 'pdf') => {
    if (!state.comparison) {
      setState(prev => ({ ...prev, error: 'No hay comparación para exportar' }));
      return;
    }

    try {
      const response = await ApiClient.post(`/api/calculation-budgets/comparison/${state.comparison.id}/export`, {
        format,
        includeAnalysis: true,
        includeRecommendations: true
      }, {
        responseType: 'blob'
      });

      // Crear URL para descarga
      const blob = new Blob([response], { 
        type: format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `comparacion-presupuestos-${state.comparison.id}.${format}`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error al exportar la comparación'
      }));
    }
  }, [state.comparison]);

  // Guardar comparación
  const saveComparison = useCallback(async () => {
    if (!state.comparison) return;

    try {
      const response = await ApiClient.put(`/api/calculation-budgets/comparison/${state.comparison.id}`, {
        name: state.comparisonName || state.comparison.name
      });

      setState(prev => ({
        ...prev,
        comparison: response
      }));

      return response;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error al guardar la comparación'
      }));
    }
  }, [state.comparison, state.comparisonName]);

  // Cargar presupuestos al montar el componente
  useEffect(() => {
    loadAvailableBudgets();
  }, [loadAvailableBudgets]);

  return {
    // Estado
    ...state,
    
    // Computed properties
    canCompare: state.selectedBudgets.length >= 2,
    hasMaxSelection: state.selectedBudgets.length >= state.maxComparisons,
    
    // Acciones principales
    loadAvailableBudgets,
    toggleBudgetSelection,
    clearSelection,
    performComparison,
    exportComparison,
    saveComparison,
    
    // Análisis y datos procesados
    getCategoryDifferences,
    getSignificantChanges,
    getTotalsSummary,
    getComparisonStats,
    
    // Utilidades
    setComparisonName: (name: string) => setState(prev => ({ ...prev, comparisonName: name })),
    clearError: () => setState(prev => ({ ...prev, error: null })),
    
    // Seleccionar presupuestos específicos
    selectBudgets: (budgets: CalculationBudget[]) => {
      if (budgets.length > state.maxComparisons) {
        setState(prev => ({
          ...prev,
          error: `Solo se pueden comparar hasta ${prev.maxComparisons} presupuestos`
        }));
        return;
      }
      
      setState(prev => ({
        ...prev,
        selectedBudgets: budgets,
        error: null
      }));
    },
    
    // Verificar si un presupuesto está seleccionado
    isBudgetSelected: (budgetId: string) => state.selectedBudgets.some(b => b.id === budgetId)
  };
};

// Hook para gestión general de presupuestos
export const useBudgets = (projectId?: string) => {
  const [budgets, setBudgets] = useState<CalculationBudget[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  const fetchBudgets = useCallback(async (filters?: BudgetFilters, page: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (projectId) params.append('projectId', projectId);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.budgetType) params.append('budgetType', filters.budgetType);
      if (filters?.searchTerm) params.append('search', filters.searchTerm);
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.append('dateTo', filters.dateTo);
      
      params.append('page', page.toString());
      params.append('limit', pagination.limit.toString());

      const response = await ApiClient.get<{
        budgets: CalculationBudget[];
        pagination: typeof pagination;
      }>(`/api/calculation-budgets?${params.toString()}`);

      setBudgets(response.budgets || []);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar presupuestos');
    } finally {
      setLoading(false);
    }
  }, [projectId, pagination.limit]);

  const createBudget = useCallback(async (budgetData: Omit<CalculationBudget, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    try {
      const response = await ApiClient.post<CalculationBudget>('/api/calculation-budgets', budgetData);
      setBudgets(prev => [response, ...prev]);
      return response;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al crear presupuesto');
      throw error;
    }
  }, []);

  const updateBudget = useCallback(async (budgetId: string, updates: Partial<CalculationBudget>) => {
    try {
      const response = await ApiClient.put<CalculationBudget>(`/api/calculation-budgets/${budgetId}`, updates);
      setBudgets(prev => prev.map(b => b.id === budgetId ? response : b));
      return response;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al actualizar presupuesto');
      throw error;
    }
  }, []);

  const deleteBudget = useCallback(async (budgetId: string) => {
    try {
      await ApiClient.delete(`/api/calculation-budgets/${budgetId}`);
      setBudgets(prev => prev.filter(b => b.id !== budgetId));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al eliminar presupuesto');
      throw error;
    }
  }, []);

  const duplicateBudget = useCallback(async (budgetId: string, newName: string) => {
    try {
      const response = await ApiClient.post<CalculationBudget>(`/api/calculation-budgets/${budgetId}/clone`, {
        name: newName
      });
      setBudgets(prev => [response, ...prev]);
      return response;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al duplicar presupuesto');
      throw error;
    }
  }, []);

  return {
    budgets,
    loading,
    error,
    pagination,
    fetchBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
    duplicateBudget,
    clearError: () => setError(null)
  };
};