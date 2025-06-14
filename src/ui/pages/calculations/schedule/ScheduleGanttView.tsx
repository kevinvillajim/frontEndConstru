// src/ui/pages/calculations/schedule/ScheduleGanttView.tsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CalendarDaysIcon,
  ArrowLeftIcon,
  ZoomInIcon,
  ZoomOutIcon,
  PrinterIcon,
  ShareIcon,
  CogIcon,
  PlayIcon,
  PauseIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  EyeSlashIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import { LoadingSpinner, Badge, ProgressBar } from "../shared/components/SharedComponents";
import { useGanttInteractions } from "../shared/hooks/useGanttInteractions";

// Types
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
  assignedResources: Resource[];
  isCriticalPath: boolean;
  actualStartDate?: Date;
  actualEndDate?: Date;
  notes?: string;
  color?: string;
}

interface Resource {
  id: string;
  name: string;
  type: "person" | "equipment" | "material";
  availability: number;
  cost: number;
}

interface TimelineSettings {
  viewMode: "days" | "weeks" | "months";
  startDate: Date;
  endDate: Date;
  zoom: number;
  showWeekends: boolean;
  showMilestones: boolean;
  showCriticalPath: boolean;
}

interface FilterSettings {
  phases: string[];
  categories: string[];
  statuses: string[];
  priorities: string[];
  resources: string[];
  showOnlyCritical: boolean;
  showCompleted: boolean;
}

const VIEW_MODES = [
  { value: "days", label: "Días", scale: 1 },
  { value: "weeks", label: "Semanas", scale: 7 },
  { value: "months", label: "Meses", scale: 30 },
];

const STATUS_COLORS = {
  not_started: "bg-gray-400",
  in_progress: "bg-blue-500",
  completed: "bg-green-500",
  delayed: "bg-red-500",
  paused: "bg-yellow-500",
};

const PRIORITY_COLORS = {
  low: "border-l-gray-400",
  medium: "border-l-blue-400",
  high: "border-l-orange-400",
  critical: "border-l-red-500",
};

const ScheduleGanttView: React.FC = () => {
  const { scheduleId } = useParams();
  const navigate = useNavigate();
  const ganttContainerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const {
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
  } = useGanttInteractions(scheduleId);

  const [timelineSettings, setTimelineSettings] = useState<TimelineSettings>({
    viewMode: "days",
    startDate: new Date(),
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    zoom: 100,
    showWeekends: true,
    showMilestones: true,
    showCriticalPath: true,
  });

  const [filterSettings, setFilterSettings] = useState<FilterSettings>({
    phases: [],
    categories: [],
    statuses: [],
    priorities: [],
    resources: [],
    showOnlyCritical: false,
    showCompleted: true,
  });

  const [showFilters, setShowFilters] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (scheduleId) {
      loadSchedule();
    }
  }, [scheduleId]);

  useEffect(() => {
    if (activities.length > 0) {
      const minDate = new Date(Math.min(...activities.map(a => a.startDate.getTime())));
      const maxDate = new Date(Math.max(...activities.map(a => a.endDate.getTime())));
      
      setTimelineSettings(prev => ({
        ...prev,
        startDate: minDate,
        endDate: maxDate,
      }));
    }
  }, [activities]);

  const filteredActivities = useCallback(() => {
    return activities.filter(activity => {
      if (filterSettings.showOnlyCritical && !activity.isCriticalPath) return false;
      if (!filterSettings.showCompleted && activity.status === "completed") return false;
      if (filterSettings.phases.length > 0 && !filterSettings.phases.includes(activity.phase)) return false;
      if (filterSettings.categories.length > 0 && !filterSettings.categories.includes(activity.category)) return false;
      if (filterSettings.statuses.length > 0 && !filterSettings.statuses.includes(activity.status)) return false;
      if (filterSettings.priorities.length > 0 && !filterSettings.priorities.includes(activity.priority)) return false;
      
      return true;
    });
  }, [activities, filterSettings]);

  const generateTimelineColumns = useCallback(() => {
    const { startDate, endDate, viewMode } = timelineSettings;
    const columns = [];
    const scale = VIEW_MODES.find(vm => vm.value === viewMode)?.scale || 1;
    
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      columns.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + scale);
    }
    
    return columns;
  }, [timelineSettings]);

  const getActivityPosition = (activity: ScheduleActivity) => {
    const { startDate, endDate } = timelineSettings;
    const totalDuration = endDate.getTime() - startDate.getTime();
    
    const activityStart = activity.startDate.getTime() - startDate.getTime();
    const activityDuration = activity.endDate.getTime() - activity.startDate.getTime();
    
    const left = (activityStart / totalDuration) * 100;
    const width = (activityDuration / totalDuration) * 100;
    
    return { left: `${left}%`, width: `${width}%` };
  };

  const handleActivityDrag = (activity: ScheduleActivity, deltaX: number) => {
    const totalWidth = ganttContainerRef.current?.scrollWidth || 1000;
    const dayPixels = totalWidth / generateTimelineColumns().length;
    const daysDelta = Math.round(deltaX / dayPixels);
    
    if (daysDelta !== 0) {
      const newStartDate = new Date(activity.startDate);
      newStartDate.setDate(newStartDate.getDate() + daysDelta);
      
      const newEndDate = new Date(activity.endDate);
      newEndDate.setDate(newEndDate.getDate() + daysDelta);
      
      updateActivity(activity.id, {
        startDate: newStartDate,
        endDate: newEndDate,
      });
    }
  };

  const handleActivityResize = (activity: ScheduleActivity, deltaWidth: number) => {
    const totalWidth = ganttContainerRef.current?.scrollWidth || 1000;
    const dayPixels = totalWidth / generateTimelineColumns().length;
    const daysDelta = Math.round(deltaWidth / dayPixels);
    
    if (daysDelta !== 0) {
      const newEndDate = new Date(activity.endDate);
      newEndDate.setDate(newEndDate.getDate() + daysDelta);
      
      updateActivityDuration(activity.id, newEndDate);
    }
  };

  const handleZoom = (direction: "in" | "out") => {
    setTimelineSettings(prev => ({
      ...prev,
      zoom: direction === "in" 
        ? Math.min(prev.zoom + 20, 200)
        : Math.max(prev.zoom - 20, 50)
    }));
  };

  const getStatusIcon = (status: ScheduleActivity["status"]) => {
    switch (status) {
      case "completed": return CheckCircleIcon;
      case "in_progress": return PlayIcon;
      case "delayed": return ExclamationTriangleIcon;
      case "paused": return PauseIcon;
      default: return ClockIcon;
    }
  };

  const getStatusColor = (status: ScheduleActivity["status"]) => {
    switch (status) {
      case "completed": return "text-green-600";
      case "in_progress": return "text-blue-600";
      case "delayed": return "text-red-600";
      case "paused": return "text-yellow-600";
      default: return "text-gray-600";
    }
  };

  const exportGantt = () => {
    // Implementation for exporting Gantt chart
    console.log("Exporting Gantt chart...");
  };

  const shareGantt = () => {
    // Implementation for sharing Gantt chart
    console.log("Sharing Gantt chart...");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const timelineColumns = generateTimelineColumns();
  const displayActivities = filteredActivities();

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'min-h-screen'} bg-gray-50 flex flex-col`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {!isFullscreen && (
                <button
                  onClick={() => navigate("/calculations/schedule")}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                </button>
              )}
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {schedule?.name || "Cronograma"}
                </h1>
                <p className="text-sm text-gray-600">
                  Vista Gantt interactiva • {displayActivities.length} actividades
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* View Mode Selector */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                {VIEW_MODES.map((mode) => (
                  <button
                    key={mode.value}
                    onClick={() => setTimelineSettings(prev => ({ ...prev, viewMode: mode.value as any }))}
                    className={`px-3 py-1 text-sm font-medium transition-colors ${
                      timelineSettings.viewMode === mode.value
                        ? "bg-blue-500 text-white"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>

              {/* Zoom Controls */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => handleZoom("out")}
                  className="p-2 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <ZoomOutIcon className="h-4 w-4" />
                </button>
                <div className="px-3 py-2 text-sm text-gray-600 border-x border-gray-300">
                  {timelineSettings.zoom}%
                </div>
                <button
                  onClick={() => handleZoom("in")}
                  className="p-2 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <ZoomInIcon className="h-4 w-4" />
                </button>
              </div>

              {/* Filters Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg transition-colors ${
                  showFilters ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FunnelIcon className="h-4 w-4" />
              </button>

              {/* Settings */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-lg transition-colors ${
                  showSettings ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <CogIcon className="h-4 w-4" />
              </button>

              {/* Export */}
              <button
                onClick={exportGantt}
                className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <PrinterIcon className="h-4 w-4" />
              </button>

              {/* Share */}
              <button
                onClick={shareGantt}
                className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ShareIcon className="h-4 w-4" />
              </button>

              {/* Fullscreen Toggle */}
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isFullscreen ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filterSettings.showOnlyCritical}
                    onChange={(e) => setFilterSettings(prev => ({
                      ...prev,
                      showOnlyCritical: e.target.checked
                    }))}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Solo ruta crítica</span>
                </label>
              </div>
              
              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filterSettings.showCompleted}
                    onChange={(e) => setFilterSettings(prev => ({
                      ...prev,
                      showCompleted: e.target.checked
                    }))}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Mostrar completadas</span>
                </label>
              </div>

              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={timelineSettings.showWeekends}
                    onChange={(e) => setTimelineSettings(prev => ({
                      ...prev,
                      showWeekends: e.target.checked
                    }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Mostrar fines de semana</span>
                </label>
              </div>

              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={timelineSettings.showCriticalPath}
                    onChange={(e) => setTimelineSettings(prev => ({
                      ...prev,
                      showCriticalPath: e.target.checked
                    }))}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Resaltar ruta crítica</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Gantt Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Activity List Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto">
          <div className="sticky top-0 bg-gray-50 border-b border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900">Actividades</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {displayActivities.map((activity) => {
              const StatusIcon = getStatusIcon(activity.status);
              
              return (
                <div
                  key={activity.id}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedActivity?.id === activity.id
                      ? "bg-blue-50 border-r-2 border-blue-500"
                      : "hover:bg-gray-50"
                  } ${activity.isCriticalPath && timelineSettings.showCriticalPath ? "bg-red-50" : ""}`}
                  onClick={() => selectActivity(activity)}
                >
                  <div className={`border-l-4 pl-3 ${PRIORITY_COLORS[activity.priority]}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">{activity.name}</h4>
                      <StatusIcon className={`h-4 w-4 ${getStatusColor(activity.status)}`} />
                    </div>
                    
                    <div className="text-xs text-gray-600 mb-2">
                      {activity.phase} • {activity.category}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Progreso</span>
                        <span className="font-medium">{activity.progress}%</span>
                      </div>
                      <ProgressBar progress={activity.progress} size="sm" />
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>{activity.startDate.toLocaleDateString('es-EC', { month: 'short', day: 'numeric' })}</span>
                      <span>{activity.duration}d</span>
                    </div>
                    
                    {activity.isCriticalPath && (
                      <Badge variant="error" className="text-xs mt-2">
                        Crítica
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gantt Chart Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Timeline Header */}
          <div 
            ref={timelineRef}
            className="bg-gray-50 border-b border-gray-200 p-4 overflow-x-auto"
            style={{ zoom: `${timelineSettings.zoom}%` }}
          >
            <div className="flex" style={{ minWidth: '1000px' }}>
              {timelineColumns.map((date, index) => (
                <div
                  key={index}
                  className="flex-1 text-center border-r border-gray-300 last:border-r-0 px-2 py-1"
                >
                  <div className="text-xs font-medium text-gray-900">
                    {timelineSettings.viewMode === "days" && date.toLocaleDateString('es-EC', { weekday: 'short' })}
                    {timelineSettings.viewMode === "weeks" && `Sem ${Math.ceil(date.getDate() / 7)}`}
                    {timelineSettings.viewMode === "months" && date.toLocaleDateString('es-EC', { month: 'short' })}
                  </div>
                  <div className="text-xs text-gray-600">
                    {timelineSettings.viewMode === "days" && date.getDate()}
                    {timelineSettings.viewMode === "weeks" && date.toLocaleDateString('es-EC', { month: 'short', day: 'numeric' })}
                    {timelineSettings.viewMode === "months" && date.toLocaleDateString('es-EC', { month: 'short', year: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gantt Bars Area */}
          <div 
            ref={ganttContainerRef}
            className="flex-1 overflow-auto relative"
            style={{ zoom: `${timelineSettings.zoom}%` }}
          >
            <div className="relative" style={{ minWidth: '1000px', minHeight: `${displayActivities.length * 60}px` }}>
              {/* Background Grid */}
              <div className="absolute inset-0 flex">
                {timelineColumns.map((date, index) => (
                  <div
                    key={index}
                    className={`flex-1 border-r border-gray-200 ${
                      !timelineSettings.showWeekends && (date.getDay() === 0 || date.getDay() === 6)
                        ? "bg-gray-100"
                        : ""
                    }`}
                  />
                ))}
              </div>

              {/* Activity Bars */}
              {displayActivities.map((activity, index) => {
                const position = getActivityPosition(activity);
                
                return (
                  <div
                    key={activity.id}
                    className="absolute h-12 flex items-center px-2"
                    style={{
                      top: `${index * 60 + 8}px`,
                      ...position,
                    }}
                  >
                    <div
                      className={`w-full h-8 rounded-lg border shadow-sm cursor-pointer transition-all ${
                        activity.isCriticalPath && timelineSettings.showCriticalPath
                          ? "border-red-300 shadow-red-100"
                          : "border-gray-300"
                      } ${
                        selectedActivity?.id === activity.id
                          ? "ring-2 ring-blue-500 ring-opacity-50"
                          : ""
                      }`}
                      style={{ backgroundColor: activity.color || STATUS_COLORS[activity.status] }}
                      onClick={() => selectActivity(activity)}
                    >
                      {/* Progress Overlay */}
                      <div
                        className="h-full bg-black bg-opacity-20 rounded-lg transition-all"
                        style={{ width: `${activity.progress}%` }}
                      />
                      
                      {/* Activity Label */}
                      <div className="absolute inset-0 flex items-center px-2">
                        <span className="text-white text-xs font-medium truncate">
                          {activity.name}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Dependencies Lines */}
              {timelineSettings.showCriticalPath && displayActivities.map((activity) =>
                activity.dependencies.map((depId) => {
                  const dependency = activities.find(a => a.id === depId);
                  if (!dependency) return null;
                  
                  const activityIndex = displayActivities.indexOf(activity);
                  const depIndex = displayActivities.indexOf(dependency);
                  
                  if (activityIndex === -1 || depIndex === -1) return null;
                  
                  return (
                    <svg
                      key={`${activity.id}-${depId}`}
                      className="absolute pointer-events-none"
                      style={{
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                      }}
                    >
                      <line
                        x1={`${getActivityPosition(dependency).left}`}
                        y1={depIndex * 60 + 30}
                        x2={`${getActivityPosition(activity).left}`}
                        y2={activityIndex * 60 + 30}
                        stroke="#6366f1"
                        strokeWidth="2"
                        markerEnd="url(#arrowhead)"
                      />
                      <defs>
                        <marker
                          id="arrowhead"
                          markerWidth="10"
                          markerHeight="7"
                          refX="9"
                          refY="3.5"
                          orient="auto"
                        >
                          <polygon
                            points="0 0, 10 3.5, 0 7"
                            fill="#6366f1"
                          />
                        </marker>
                      </defs>
                    </svg>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Activity Detail Panel */}
      {selectedActivity && (
        <div className="bg-white border-t border-gray-200 p-6">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-2">
                <h3 className="font-semibold text-gray-900 mb-2">{selectedActivity.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{selectedActivity.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Fecha inicio:</span>
                    <div className="font-medium">{selectedActivity.startDate.toLocaleDateString('es-EC')}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Fecha fin:</span>
                    <div className="font-medium">{selectedActivity.endDate.toLocaleDateString('es-EC')}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Duración:</span>
                    <div className="font-medium">{selectedActivity.duration} días</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Progreso:</span>
                    <div className="font-medium">{selectedActivity.progress}%</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Recursos Asignados</h4>
                <div className="space-y-1">
                  {selectedActivity.assignedResources.map((resource) => (
                    <div key={resource.id} className="text-sm text-gray-600">
                      {resource.name} ({resource.type})
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Dependencias</h4>
                <div className="space-y-1">
                  {selectedActivity.dependencies.map((depId) => {
                    const dep = activities.find(a => a.id === depId);
                    return dep ? (
                      <div key={depId} className="text-sm text-gray-600">
                        {dep.name}
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleGanttView;