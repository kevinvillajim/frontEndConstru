 // src/ui/pages/calculations/shared/utils/scheduleHelpers.ts
 export const calculateCriticalPath = (activities: ScheduleActivity[]): ScheduleActivity[] => {
    // Implementation of critical path calculation
    // This is a simplified version - in production you'd use a proper CPM algorithm
    
    const criticalActivities: ScheduleActivity[] = [];
    
    // Find activities with zero total float (simplified)
    activities.forEach(activity => {
      const hasSuccessors = activities.some(a => a.dependencies.includes(activity.id));
      const hasPredecessors = activity.dependencies.length > 0;
      
      // Simplified critical path determination
      if (activity.priority === "critical" || 
          (hasSuccessors && hasPredecessors) ||
          activity.duration > 10) {
        criticalActivities.push({
          ...activity,
          isCriticalPath: true
        });
      }
    });
    
    return criticalActivities;
  };
  
  export const calculateProjectDuration = (activities: ScheduleActivity[]): number => {
    if (activities.length === 0) return 0;
    
    const earliestStart = Math.min(...activities.map(a => a.startDate.getTime()));
    const latestEnd = Math.max(...activities.map(a => a.endDate.getTime()));
    
    return Math.ceil((latestEnd - earliestStart) / (1000 * 60 * 60 * 24));
  };
  
  export const calculateResourceUtilization = (
    activities: ScheduleActivity[],
    resourceId: string
  ): number => {
    const resourceActivities = activities.filter(a => 
      a.assignedResources.some(r => r.id === resourceId)
    );
    
    const totalAssignedHours = resourceActivities.reduce((sum, activity) => {
      const resource = activity.assignedResources.find(r => r.id === resourceId);
      return sum + (resource ? activity.duration * 8 : 0); // 8 hours per day
    }, 0);
    
    const projectDuration = calculateProjectDuration(activities);
    const totalAvailableHours = projectDuration * 8; // 8 hours per day
    
    return totalAvailableHours > 0 ? (totalAssignedHours / totalAvailableHours) * 100 : 0;
  };
  
  export const detectScheduleConflicts = (activities: ScheduleActivity[]): string[] => {
    const conflicts: string[] = [];
    
    // Check for resource conflicts
    const resourceAssignments = new Map<string, ScheduleActivity[]>();
    
    activities.forEach(activity => {
      activity.assignedResources.forEach(resource => {
        if (!resourceAssignments.has(resource.id)) {
          resourceAssignments.set(resource.id, []);
        }
        resourceAssignments.get(resource.id)!.push(activity);
      });
    });
    
    resourceAssignments.forEach((assignments, resourceId) => {
      // Check for overlapping assignments
      for (let i = 0; i < assignments.length; i++) {
        for (let j = i + 1; j < assignments.length; j++) {
          const activity1 = assignments[i];
          const activity2 = assignments[j];
          
          if (activity1.startDate < activity2.endDate && 
              activity2.startDate < activity1.endDate) {
            conflicts.push(
              `Conflicto de recurso: ${resourceId} asignado a "${activity1.name}" y "${activity2.name}" simultáneamente`
            );
          }
        }
      }
    });
    
    return conflicts;
  };
  
  export const formatDuration = (days: number): string => {
    if (days < 7) {
      return `${days} día${days !== 1 ? 's' : ''}`;
    } else if (days < 30) {
      const weeks = Math.floor(days / 7);
      const remainingDays = days % 7;
      return `${weeks} semana${weeks !== 1 ? 's' : ''}${remainingDays > 0 ? ` y ${remainingDays} día${remainingDays !== 1 ? 's' : ''}` : ''}`;
    } else {
      const months = Math.floor(days / 30);
      const remainingDays = days % 30;
      return `${months} mes${months !== 1 ? 'es' : ''}${remainingDays > 0 ? ` y ${remainingDays} día${remainingDays !== 1 ? 's' : ''}` : ''}`;
    }
  };