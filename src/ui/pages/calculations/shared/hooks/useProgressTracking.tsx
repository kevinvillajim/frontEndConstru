// src/ui/pages/calculations/shared/hooks/useProgressTracking.tsx
import { useState, useCallback } from "react";

interface ProgressEntry {
  id: string;
  activityId: string;
  date: Date;
  progress: number;
  description: string;
  photos: string[];
  worker: string;
  workerId: string;
  location: string;
  weather?: string;
  issues?: string;
  materials?: string[];
  equipment?: string[];
}

interface ProgressAlert {
  id: string;
  type: "delay" | "quality" | "safety" | "resource" | "weather";
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  activityId: string;
  timestamp: Date;
  resolved: boolean;
}

export const useProgressTracking = () => {
  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([]);
  const [alerts, setAlerts] = useState<ProgressAlert[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const submitProgress = useCallback(async (entry: Omit<ProgressEntry, "id">) => {
    setIsSubmitting(true);
    try {
      // Simulate API call with offline support
      if (isOnline) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        // Store locally for later sync
        localStorage.setItem("pendingProgress", JSON.stringify([
          ...JSON.parse(localStorage.getItem("pendingProgress") || "[]"),
          { ...entry, id: `temp-${Date.now()}` }
        ]));
      }

      const newEntry: ProgressEntry = {
        ...entry,
        id: `progress-${Date.now()}`,
      };

      setProgressEntries(prev => [...prev, newEntry]);

      // Check for potential alerts
      if (entry.progress < 50 && entry.description.toLowerCase().includes("retraso")) {
        const alert: ProgressAlert = {
          id: `alert-${Date.now()}`,
          type: "delay",
          severity: "medium",
          message: `Posible retraso detectado en actividad`,
          activityId: entry.activityId,
          timestamp: new Date(),
          resolved: false,
        };
        setAlerts(prev => [...prev, alert]);
      }

    } catch (error) {
      console.error("Error submitting progress:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [isOnline]);

  const uploadPhoto = useCallback(async (file: File) => {
    // Simulate photo upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    return `photo-${Date.now()}.jpg`;
  }, []);

  const resolveAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  }, []);

  const syncPendingProgress = useCallback(async () => {
    if (!isOnline) return;

    const pending = JSON.parse(localStorage.getItem("pendingProgress") || "[]");
    if (pending.length === 0) return;

    try {
      // Sync pending entries
      for (const entry of pending) {
        await submitProgress(entry);
      }
      
      localStorage.removeItem("pendingProgress");
    } catch (error) {
      console.error("Error syncing pending progress:", error);
    }
  }, [isOnline, submitProgress]);

  return {
    progressEntries,
    alerts,
    isSubmitting,
    isOnline,
    submitProgress,
    uploadPhoto,
    resolveAlert,
    syncPendingProgress,
  };
};