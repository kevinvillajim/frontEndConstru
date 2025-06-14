// src/ui/pages/calculations/shared/hooks/useScheduleGeneration.tsx
import { useState, useCallback } from "react";

interface BudgetForSchedule {
  id: string;
  name: string;
  projectId: string;
  projectName: string;
  status: "approved" | "final";
  totalCost: number;
  items: any[];
  approvedAt: Date;
  currency: string;
}

interface ScheduleTemplate {
  id: string;
  name: string;
  description: string;
  projectType: string;
  geographicalZone: string;
  estimatedDuration: number;
  baseActivities: number;
  complexity: "simple" | "moderate" | "complex";
  verified: boolean;
  usageCount: number;
}

interface GenerationStep {
  id: string;
  name: string;
  description: string;
  status: "pending" | "active" | "completed" | "error";
  progress: number;
  result?: any;
  duration?: number;
}

interface GenerationConfig {
  templateId: string;
  projectType: string;
  geographicalZone: string;
  startDate: Date;
  workingDays: number[];
  workingHours: { start: string; end: string };
  weatherFactors: boolean;
  holidaysRegion: string;
  bufferPercentage: number;
  resourceOptimization: boolean;
  criticalPathFocus: boolean;
  phaseBreakdown: boolean;
}

interface GeneratedSchedule {
  id: string;
  totalDuration: number;
  totalActivities: number;
  resourcesRequired: number;
}

export const useScheduleGeneration = () => {
  const [availableBudgets, setAvailableBudgets] = useState<BudgetForSchedule[]>([]);
  const [scheduleTemplates, setScheduleTemplates] = useState<ScheduleTemplate[]>([]);
  const [generationSteps, setGenerationSteps] = useState<GenerationStep[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSchedule, setGeneratedSchedule] = useState<GeneratedSchedule | null>(null);

  const loadBudgets = useCallback(async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockBudgets: BudgetForSchedule[] = [
        {
          id: "budget-1",
          name: "Presupuesto Edificio Residencial",
          projectId: "proj-1",
          projectName: "Edificio Norte",
          status: "approved",
          totalCost: 2500000,
          items: [],
          approvedAt: new Date(2024, 5, 10),
          currency: "USD",
        },
        {
          id: "budget-2",
          name: "Presupuesto Centro Comercial",
          projectId: "proj-2",
          projectName: "Plaza Comercial",
          status: "final",
          totalCost: 3800000,
          items: [],
          approvedAt: new Date(2024, 5, 8),
          currency: "USD",
        },
      ];
      
      setAvailableBudgets(mockBudgets);
    } catch (error) {
      console.error("Error loading budgets:", error);
    }
  }, []);

  const loadTemplates = useCallback(async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockTemplates: ScheduleTemplate[] = [
        {
          id: "template-1",
          name: "Edificio Residencial Estándar",
          description: "Template optimizado para edificios residenciales de 8-15 pisos",
          projectType: "RESIDENTIAL_MULTI",
          geographicalZone: "QUITO",
          estimatedDuration: 365,
          baseActivities: 156,
          complexity: "moderate",
          verified: true,
          usageCount: 89,
        },
        {
          id: "template-2",
          name: "Centro Comercial Pequeño",
          description: "Template para centros comerciales hasta 5000m²",
          projectType: "COMMERCIAL_SMALL",
          geographicalZone: "GUAYAQUIL",
          estimatedDuration: 280,
          baseActivities: 123,
          complexity: "moderate",
          verified: true,
          usageCount: 34,
        },
        {
          id: "template-3",
          name: "Casa Unifamiliar Premium",
          description: "Template para casas unifamiliares de lujo",
          projectType: "RESIDENTIAL_SINGLE",
          geographicalZone: "CUENCA",
          estimatedDuration: 180,
          baseActivities: 78,
          complexity: "simple",
          verified: true,
          usageCount: 156,
        },
      ];
      
      setScheduleTemplates(mockTemplates);
    } catch (error) {
      console.error("Error loading templates:", error);
    }
  }, []);

  const generateSchedule = useCallback(async (budgetId: string, config: GenerationConfig) => {
    setIsGenerating(true);
    
    const steps: GenerationStep[] = [
      {
        id: "analysis",
        name: "Análisis de Presupuesto",
        description: "Analizando items del presupuesto y determinando actividades",
        status: "pending",
        progress: 0,
      },
      {
        id: "template",
        name: "Aplicación de Template",
        description: "Aplicando template seleccionado y ajustando parámetros",
        status: "pending",
        progress: 0,
      },
      {
        id: "dependencies",
        name: "Cálculo de Dependencias",
        description: "Determinando secuencia y dependencias entre actividades",
        status: "pending",
        progress: 0,
      },
      {
        id: "resources",
        name: "Asignación de Recursos",
        description: "Optimizando asignación de personal y equipos",
        status: "pending",
        progress: 0,
      },
      {
        id: "optimization",
        name: "Optimización Final",
        description: "Aplicando algoritmos de optimización y validación",
        status: "pending",
        progress: 0,
      },
    ];

    setGenerationSteps(steps);

    try {
      // Simulate step-by-step generation
      for (let i = 0; i < steps.length; i++) {
        // Update current step to active
        setGenerationSteps(prev => prev.map((step, index) => 
          index === i ? { ...step, status: "active" } : step
        ));

        // Simulate progress
        for (let progress = 0; progress <= 100; progress += 20) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setGenerationSteps(prev => prev.map((step, index) => 
            index === i ? { ...step, progress } : step
          ));
        }

        // Mark as completed
        setGenerationSteps(prev => prev.map((step, index) => 
          index === i ? { ...step, status: "completed", progress: 100, duration: 2 + Math.random() * 3 } : step
        ));
      }

      // Generate final result
      const result: GeneratedSchedule = {
        id: `schedule-${Date.now()}`,
        totalDuration: 280 + Math.floor(Math.random() * 100),
        totalActivities: 120 + Math.floor(Math.random() * 50),
        resourcesRequired: 15 + Math.floor(Math.random() * 10),
      };

      setGeneratedSchedule(result);
    } catch (error) {
      console.error("Error generating schedule:", error);
      // Mark last step as error
      setGenerationSteps(prev => prev.map((step, index) => 
        index === steps.length - 1 ? { ...step, status: "error" } : step
      ));
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const resetGeneration = useCallback(() => {
    setGenerationSteps([]);
    setIsGenerating(false);
    setGeneratedSchedule(null);
  }, []);

  return {
    availableBudgets,
    scheduleTemplates,
    generationSteps,
    isGenerating,
    generatedSchedule,
    loadBudgets,
    loadTemplates,
    generateSchedule,
    resetGeneration,
  };
};

