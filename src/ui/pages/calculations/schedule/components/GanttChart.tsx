// src/ui/pages/calculations/schedule/components/GanttChart.tsx
import React, { useRef, useEffect, useState, useCallback } from "react";
import { 
  ArrowRightIcon, 
  ZoomInIcon, 
  ZoomOutIcon,
  PrinterIcon,
  PhotoIcon 
} from "@heroicons/react/24/outline";

interface GanttActivity {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  dependencies: string[];
  isCritical: boolean;
  color?: string;
}

interface GanttChartProps {
  activities: GanttActivity[];
  onActivityClick?: (activity: GanttActivity) => void;
  onActivityDrag?: (activityId: string, newStartDate: Date, newEndDate: Date) => void;
  onActivityResize?: (activityId: string, newEndDate: Date) => void;
  viewMode?: "days" | "weeks" | "months";
  zoom?: number;
  showDependencies?: boolean;
  showCriticalPath?: boolean;
  readOnly?: boolean;
  className?: string;
}

export const GanttChart: React.FC<GanttChartProps> = ({
  activities,
  onActivityClick,
  onActivityDrag,
  onActivityResize,
  viewMode = "days",
  zoom = 100,
  showDependencies = true,
  showCriticalPath = true,
  readOnly = false,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [draggedActivity, setDraggedActivity] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Calculate date range
  const startDate = new Date(Math.min(...activities.map(a => a.startDate.getTime())));
  const endDate = new Date(Math.max(...activities.map(a => a.endDate.getTime())));
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  // Calculate dimensions
  const dayWidth = (zoom / 100) * 30; // Base 30px per day
  const activityHeight = 40;
  const headerHeight = 60;
  const totalWidth = totalDays * dayWidth;
  const totalHeight = activities.length * (activityHeight + 10) + headerHeight;

  // Generate time columns
  const generateTimeColumns = useCallback(() => {
    const columns = [];
    const current = new Date(startDate);
    const scale = viewMode === "days" ? 1 : viewMode === "weeks" ? 7 : 30;
    
    while (current <= endDate) {
      columns.push(new Date(current));
      current.setDate(current.getDate() + scale);
    }
    return columns;
  }, [startDate, endDate, viewMode]);

  // Calculate activity position
  const getActivityPosition = useCallback((activity: GanttActivity) => {
    const activityStart = activity.startDate.getTime() - startDate.getTime();
    const activityDuration = activity.endDate.getTime() - activity.startDate.getTime();
    
    const left = (activityStart / (1000 * 60 * 60 * 24)) * dayWidth;
    const width = (activityDuration / (1000 * 60 * 60 * 24)) * dayWidth;
    
    return { left, width };
  }, [startDate, dayWidth]);

  // Draw dependencies on canvas
  useEffect(() => {
    if (!showDependencies || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = totalWidth;
    canvas.height = totalHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw dependency lines
    activities.forEach((activity, index) => {
      activity.dependencies.forEach(depId => {
        const dependency = activities.find(a => a.id === depId);
        if (!dependency) return;

        const depIndex = activities.findIndex(a => a.id === depId);
        const activityPos = getActivityPosition(activity);
        const depPos = getActivityPosition(dependency);

        const depY = headerHeight + depIndex * (activityHeight + 10) + activityHeight / 2;
        const activityY = headerHeight + index * (activityHeight + 10) + activityHeight / 2;

        ctx.strokeStyle = activity.isCritical && showCriticalPath ? '#ef4444' : '#6366f1';
        ctx.lineWidth = 2;
        ctx.setLineDash(activity.isCritical && showCriticalPath ? [] : [5, 5]);

        ctx.beginPath();
        ctx.moveTo(depPos.left + depPos.width, depY);
        ctx.lineTo(activityPos.left, activityY);
        ctx.stroke();

        // Arrow head
        const angle = Math.atan2(activityY - depY, activityPos.left - (depPos.left + depPos.width));
        const arrowLength = 10;
        ctx.beginPath();
        ctx.moveTo(activityPos.left, activityY);
        ctx.lineTo(
          activityPos.left - arrowLength * Math.cos(angle - Math.PI / 6),
          activityY - arrowLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(activityPos.left, activityY);
        ctx.lineTo(
          activityPos.left - arrowLength * Math.cos(angle + Math.PI / 6),
          activityY - arrowLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();
      });
    });
  }, [activities, totalWidth, totalHeight, headerHeight, activityHeight, getActivityPosition, showDependencies, showCriticalPath]);

  // Handle mouse events for drag and drop
  const handleMouseDown = (e: React.MouseEvent, activityId: string) => {
    if (readOnly) return;
    
    setDraggedActivity(activityId);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!draggedActivity || readOnly) return;

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left - dragOffset.x;
    const newStartDay = Math.round(x / dayWidth);
    
    if (newStartDay >= 0 && newStartDay < totalDays) {
      const activity = activities.find(a => a.id === draggedActivity);
      if (activity && onActivityDrag) {
        const duration = activity.endDate.getTime() - activity.startDate.getTime();
        const newStartDate = new Date(startDate.getTime() + newStartDay * 24 * 60 * 60 * 1000);
        const newEndDate = new Date(newStartDate.getTime() + duration);
        onActivityDrag(draggedActivity, newStartDate, newEndDate);
      }
    }
  }, [draggedActivity, dragOffset, dayWidth, totalDays, startDate, activities, onActivityDrag, readOnly]);

  const handleMouseUp = useCallback(() => {
    setDraggedActivity(null);
  }, []);

  useEffect(() => {
    if (draggedActivity) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggedActivity, handleMouseMove, handleMouseUp]);

  // Export functionality
  const exportAsImage = () => {
    const container = containerRef.current;
    if (!container) return;

    // Implementation would use html2canvas or similar library
    console.log("Exporting Gantt chart as image...");
  };

  const timeColumns = generateTimeColumns();

  return (
    <div ref={containerRef} className={`gantt-chart relative overflow-auto border border-gray-200 rounded-lg bg-white ${className}`}>
      {/* Export controls */}
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <button
          onClick={exportAsImage}
          className="p-2 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 transition-colors"
          title="Exportar como imagen"
        >
          <PhotoIcon className="h-4 w-4 text-gray-600" />
        </button>
        <button
          onClick={() => window.print()}
          className="p-2 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 transition-colors"
          title="Imprimir"
        >
          <PrinterIcon className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      {/* Canvas for dependencies */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 pointer-events-none z-0"
        style={{ width: totalWidth, height: totalHeight }}
      />

      {/* Content */}
      <div className="relative z-10" style={{ width: totalWidth, height: totalHeight }}>
        {/* Timeline header */}
        <div className="sticky top-0 bg-gray-50 border-b border-gray-200 z-20" style={{ height: headerHeight }}>
          <div className="flex">
            {timeColumns.map((date, index) => (
              <div
                key={index}
                className="flex-shrink-0 border-r border-gray-300 px-2 py-2 text-center"
                style={{ width: dayWidth * (viewMode === "days" ? 1 : viewMode === "weeks" ? 7 : 30) }}
              >
                <div className="text-xs font-medium text-gray-900">
                  {viewMode === "days" && date.toLocaleDateString('es-EC', { weekday: 'short' })}
                  {viewMode === "weeks" && `Sem ${Math.ceil(date.getDate() / 7)}`}
                  {viewMode === "months" && date.toLocaleDateString('es-EC', { month: 'short' })}
                </div>
                <div className="text-xs text-gray-600">
                  {viewMode === "days" && date.getDate()}
                  {viewMode === "weeks" && date.toLocaleDateString('es-EC', { month: 'short', day: 'numeric' })}
                  {viewMode === "months" && date.toLocaleDateString('es-EC', { month: 'short', year: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity rows */}
        <div style={{ paddingTop: headerHeight }}>
          {activities.map((activity, index) => {
            const position = getActivityPosition(activity);
            const isDragging = draggedActivity === activity.id;
            
            return (
              <div
                key={activity.id}
                className="relative"
                style={{ height: activityHeight + 10, marginBottom: 10 }}
              >
                {/* Background grid */}
                <div className="absolute inset-0 flex">
                  {timeColumns.map((_, colIndex) => (
                    <div
                      key={colIndex}
                      className="flex-shrink-0 border-r border-gray-100"
                      style={{ width: dayWidth * (viewMode === "days" ? 1 : viewMode === "weeks" ? 7 : 30) }}
                    />
                  ))}
                </div>

                {/* Activity bar */}
                <div
                  className={`absolute top-1 rounded-lg shadow-sm border transition-all duration-200 cursor-pointer ${
                    activity.isCritical && showCriticalPath
                      ? "border-red-300 shadow-red-100"
                      : "border-gray-300"
                  } ${isDragging ? "opacity-75 scale-105" : "hover:shadow-md"}`}
                  style={{
                    left: position.left,
                    width: position.width,
                    height: activityHeight - 8,
                    backgroundColor: activity.color || (activity.isCritical && showCriticalPath ? '#fef2f2' : '#f8fafc'),
                  }}
                  onMouseDown={(e) => handleMouseDown(e, activity.id)}
                  onClick={() => onActivityClick?.(activity)}
                >
                  {/* Progress bar */}
                  <div
                    className="h-full rounded-lg transition-all"
                    style={{
                      width: `${activity.progress}%`,
                      backgroundColor: activity.color || (activity.isCritical && showCriticalPath ? '#ef4444' : '#3b82f6'),
                      opacity: 0.7,
                    }}
                  />

                  {/* Activity label */}
                  <div className="absolute inset-0 flex items-center px-2">
                    <span className="text-xs font-medium text-gray-900 truncate">
                      {activity.name}
                    </span>
                  </div>

                  {/* Progress percentage */}
                  <div className="absolute top-0 right-1 text-xs text-gray-600 mt-1">
                    {activity.progress}%
                  </div>

                  {/* Resize handles */}
                  {!readOnly && (
                    <>
                      <div className="absolute left-0 top-0 w-2 h-full cursor-ew-resize opacity-0 hover:opacity-100 bg-blue-500 rounded-l-lg" />
                      <div className="absolute right-0 top-0 w-2 h-full cursor-ew-resize opacity-0 hover:opacity-100 bg-blue-500 rounded-r-lg" />
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

