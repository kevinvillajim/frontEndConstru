// src/ui/pages/calculations/shared/hooks/useGanttInteractions.tsx
import { useState, useCallback } from "react";

interface ScheduleActivity {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  progress: number;
  status: "not_started" | "in_progress" | "completed" | "delayed" | "paused";
  priority: "low" | "medium" | "high" | "critical";
  phase: string;
  category: string;
  dependencies: string[];
  assignedResources: any[];
  isCriticalPath: boolean;
  actualStartDate?: Date;
  actualEndDate?: Date;
  notes?: string;
  color?: string;
}

interface Schedule {
  id: string;
  name: string;
  description: string;
  projectId: string;
  status: string;
  activities: ScheduleActivity[];
}

export const useGanttInteractions = (scheduleId?: string) => {
  const [activities, setActivities] = useState<ScheduleActivity[]>([]);
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ScheduleActivity | null>(null);
  const [draggedActivity, setDraggedActivity] = useState<ScheduleActivity | null>(null);

  const loadSchedule = useCallback(async () => {
    if (!scheduleId) return;
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockActivities: ScheduleActivity[] = [
        {
          id: "act-1",
          name: "Excavación y Cimentación",
          description: "Excavación del terreno y construcción de cimientos",
          startDate: new Date(2024, 6, 1),
          endDate: new Date(2024, 6, 15),
          duration: 14,
          progress: 85,
          status: "in_progress",
          priority: "critical",
          phase: "Estructural",
          category: "Cimentación",
          dependencies: [],
          assignedResources: [],
          isCriticalPath: true,
          color: "#ef4444",
        },
        {
          id: "act-2",
          name: "Estructura Nivel 1-3",
          description: "Construcción de estructura de hormigón niveles 1 al 3",
          startDate: new Date(2024, 6, 16),
          endDate: new Date(2024, 7, 10),
          duration: 25,
          progress: 45,
          status: "in_progress",
          priority: "critical",
          phase: "Estructural",
          category: "Estructura",
          dependencies: ["act-1"],
          assignedResources: [],
          isCriticalPath: true,
          color: "#ef4444",
        },
        {
          id: "act-3",
          name: "Instalaciones Eléctricas Nivel 1",
          description: "Instalación del sistema eléctrico en nivel 1",
          startDate: new Date(2024, 7, 1),
          endDate: new Date(2024, 7, 12),
          duration: 12,
          progress: 0,
          status: "not_started",
          priority: "medium",
          phase: "Instalaciones",
          category: "Eléctrica",
          dependencies: ["act-2"],
          assignedResources: [],
          isCriticalPath: false,
          color: "#3b82f6",
        },
        {
          id: "act-4",
          name: "Mampostería Nivel 1",
          description: "Construcción de paredes y mampostería nivel 1",
          startDate: new Date(2024, 7, 5),
          endDate: new Date(2024, 7, 20),
          duration: 15,
          progress: 20,
          status: "in_progress",
          priority: "high",
          phase: "Acabados",
          category: "Mampostería",
          dependencies: ["act-2"],
          assignedResources: [],
          isCriticalPath: false,
          color: "#10b981",
        },
      ];

      const mockSchedule: Schedule = {
        id: scheduleId,
        name: "Cronograma Edificio Residencial Norte",
        description: "Cronograma principal para construcción de edificio residencial",
        projectId: "proj-1",
        status: "active",
        activities: mockActivities,
      };

      setActivities(mockActivities);
      setSchedule(mockSchedule);
    } catch (error) {
      console.error("Error loading schedule:", error);
    } finally {
      setLoading(false);
    }
  }, [scheduleId]);

  const updateActivity = useCallback((activityId: string, updates: Partial<ScheduleActivity>) => {
    setActivities(prev => prev.map(activity => 
      activity.id === activityId ? { ...activity, ...updates } : activity
    ));
  }, []);

  const updateActivityDuration = useCallback((activityId: string, newEndDate: Date) => {
    setActivities(prev => prev.map(activity => {
      if (activity.id === activityId) {
        const duration = Math.ceil((newEndDate.getTime() - activity.startDate.getTime()) / (1000 * 60 * 60 * 24));
        return { ...activity, endDate: newEndDate, duration };
      }
      return activity;
    }));
  }, []);

  const updateActivityProgress = useCallback((activityId: string, progress: number) => {
    const newStatus = progress === 100 ? "completed" : progress > 0 ? "in_progress" : "not_started";
    
    setActivities(prev => prev.map(activity => 
      activity.id === activityId ? { ...activity, progress, status: newStatus } : activity
    ));
  }, []);

  const selectActivity = useCallback((activity: ScheduleActivity) => {
    setSelectedActivity(activity);
  }, []);

  const startDrag = useCallback((activity: ScheduleActivity) => {
    setDraggedActivity(activity);
  }, []);

  const endDrag = useCallback(() => {
    setDraggedActivity(null);
  }, []);

  return {
    activities,
    schedule,
    loading,
    selectedActivity,
    draggedActivity,
    loadSchedule,
    updateActivity,
    updateActivityDuration,
    updateActivityProgress,
    selectActivity,
    startDrag,
    endDrag,
  };
};

