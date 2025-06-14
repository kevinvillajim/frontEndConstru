// src/ui/pages/calculations/shared/hooks/useBudgetScheduleIntegration.tsx
import { useState, useCallback } from "react";
  
interface BudgetScheduleProject {
  id: string;
  name: string;
  budget: {
    id: string;
    totalCost: number;
    spent: number;
    remaining: number;
    status: "draft" | "approved" | "active" | "overbudget";
    lastUpdated: Date;
  };
  schedule: {
    id: string;
    totalActivities: number;
    completedActivities: number;
    progress: number;
    startDate: Date;
    endDate: Date;
    status: "on_time" | "delayed" | "ahead" | "critical";
    lastUpdated: Date;
  };
  integration: {
    syncStatus: "synced" | "pending" | "conflict" | "error";
    lastSync: Date;
    conflicts: string[];
    automationEnabled: boolean;
  };
}

export const useBudgetScheduleIntegration = () => {
  const [projects, setProjects] = useState<BudgetScheduleProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState<BudgetScheduleProject | null>(null);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockProjects: BudgetScheduleProject[] = [
        {
          id: "proj-1",
          name: "Edificio Residencial Norte",
          budget: {
            id: "budget-1",
            totalCost: 2500000,
            spent: 1800000,
            remaining: 700000,
            status: "active",
            lastUpdated: new Date(2024, 6, 13),
          },
          schedule: {
            id: "schedule-1",
            totalActivities: 156,
            completedActivities: 104,
            progress: 67,
            startDate: new Date(2024, 0, 15),
            endDate: new Date(2024, 11, 20),
            status: "on_time",
            lastUpdated: new Date(2024, 6, 14),
          },
          integration: {
            syncStatus: "synced",
            lastSync: new Date(2024, 6, 14, 10, 30),
            conflicts: [],
            automationEnabled: true,
          },
        },
        {
          id: "proj-2",
          name: "Centro Comercial Plaza",
          budget: {
            id: "budget-2",
            totalCost: 3800000,
            spent: 2100000,
            remaining: 1700000,
            status: "active",
            lastUpdated: new Date(2024, 6, 12),
          },
          schedule: {
            id: "schedule-2",
            totalActivities: 203,
            completedActivities: 85,
            progress: 42,
            startDate: new Date(2024, 1, 1),
            endDate: new Date(2024, 10, 15),
            status: "delayed",
            lastUpdated: new Date(2024, 6, 13),
          },
          integration: {
            syncStatus: "conflict",
            lastSync: new Date(2024, 6, 13, 15, 45),
            conflicts: [
              "Desfase entre progreso físico (42%) y financiero (55%)",
              "Actividad de instalaciones eléctricas no refleja gasto real"
            ],
            automationEnabled: false,
          },
        },
      ];
      
      setProjects(mockProjects);
    } catch (error) {
      console.error("Error loading projects:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const syncProject = useCallback(async (projectId: string) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId
        ? {
            ...project,
            integration: {
              ...project.integration,
              syncStatus: "pending",
            }
          }
        : project
    ));

    // Simulate sync process
    await new Promise(resolve => setTimeout(resolve, 2000));

    setProjects(prev => prev.map(project => 
      project.id === projectId
        ? {
            ...project,
            integration: {
              ...project.integration,
              syncStatus: "synced",
              lastSync: new Date(),
              conflicts: [],
            }
          }
        : project
    ));
  }, []);

  const resolveConflict = useCallback(async (projectId: string, conflictIndex: number) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId
        ? {
            ...project,
            integration: {
              ...project.integration,
              conflicts: project.integration.conflicts.filter((_, index) => index !== conflictIndex),
            }
          }
        : project
    ));
  }, []);

  return {
    projects,
    selectedProject,
    loading,
    loadProjects,
    syncProject,
    resolveConflict,
    setSelectedProject,
  };
};
