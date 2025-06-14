// src/ui/pages/calculations/schedule/components/GanttTaskBar.tsx
import React, { useState } from "react";
import { 
  CheckCircleIcon, 
  ClockIcon, 
  ExclamationTriangleIcon,
  PlayIcon,
  PauseIcon,
  UserIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

interface TaskBarProps {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  status: "not_started" | "in_progress" | "completed" | "delayed" | "paused";
  priority: "low" | "medium" | "high" | "critical";
  assignedResources?: string[];
  estimatedCost?: number;
  actualCost?: number;
  isCritical?: boolean;
  dependencies?: string[];
  notes?: string;
  color?: string;
  width: number;
  height: number;
  onClick?: () => void;
  onProgressChange?: (progress: number) => void;
  onStatusChange?: (status: TaskBarProps["status"]) => void;
  showDetails?: boolean;
  isSelected?: boolean;
  isDragging?: boolean;
  readOnly?: boolean;
}

export const GanttTaskBar: React.FC<TaskBarProps> = ({
  id,
  name,
  startDate,
  endDate,
  progress,
  status,
  priority,
  assignedResources = [],
  estimatedCost,
  actualCost,
  isCritical = false,
  dependencies = [],
  notes,
  color,
  width,
  height = 32,
  onClick,
  onProgressChange,
  onStatusChange,
  showDetails = false,
  isSelected = false,
  isDragging = false,
  readOnly = false,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const getStatusIcon = () => {
    switch (status) {
      case "completed": return CheckCircleIcon;
      case "in_progress": return PlayIcon;
      case "paused": return PauseIcon;
      case "delayed": return ExclamationTriangleIcon;
      default: return ClockIcon;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "completed": return "text-green-600";
      case "in_progress": return "text-blue-600";
      case "paused": return "text-yellow-600";
      case "delayed": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getPriorityColor = () => {
    switch (priority) {
      case "critical": return "border-l-red-500";
      case "high": return "border-l-orange-500";
      case "medium": return "border-l-yellow-500";
      default: return "border-l-green-500";
    }
  };

  const getBackgroundColor = () => {
    if (color) return color;
    if (isCritical) return "#fef2f2";
    switch (status) {
      case "completed": return "#f0fdf4";
      case "in_progress": return "#eff6ff";
      case "delayed": return "#fef2f2";
      case "paused": return "#fffbeb";
      default: return "#f8fafc";
    }
  };

  const getProgressColor = () => {
    if (isCritical) return "#ef4444";
    switch (status) {
      case "completed": return "#10b981";
      case "in_progress": return "#3b82f6";
      case "delayed": return "#ef4444";
      case "paused": return "#f59e0b";
      default: return "#6b7280";
    }
  };

  const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const StatusIcon = getStatusIcon();

  return (
    <div
      className={`relative group transition-all duration-200 ${
        isSelected ? "ring-2 ring-blue-500 ring-opacity-50" : ""
      } ${isDragging ? "opacity-75 scale-105" : ""}`}
      style={{ width, height }}
      onClick={onClick}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Main task bar */}
      <div
        className={`h-full rounded-lg border-2 border-l-4 shadow-sm cursor-pointer transition-all ${
          getPriorityColor()
        } ${isSelected ? "border-blue-500" : "border-gray-300"} hover:shadow-md`}
        style={{ backgroundColor: getBackgroundColor() }}
      >
        {/* Progress fill */}
        <div
          className="h-full rounded-lg transition-all duration-300"
          style={{
            width: `${progress}%`,
            backgroundColor: getProgressColor(),
            opacity: 0.6,
          }}
        />

        {/* Content overlay */}
        <div className="absolute inset-0 flex items-center justify-between px-2">
          <div className="flex items-center gap-1 min-w-0 flex-1">
            <StatusIcon className={`h-3 w-3 flex-shrink-0 ${getStatusColor()}`} />
            <span className="text-xs font-medium text-gray-900 truncate">
              {name}
            </span>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            {assignedResources.length > 0 && (
              <div className="flex items-center gap-0.5">
                <UserIcon className="h-3 w-3 text-gray-600" />
                <span className="text-xs text-gray-600">{assignedResources.length}</span>
              </div>
            )}
            <span className="text-xs font-medium text-gray-700">{progress}%</span>
          </div>
        </div>

        {/* Critical path indicator */}
        {isCritical && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
        )}

        {/* Resize handles */}
        {!readOnly && (
          <>
            <div className="absolute left-0 top-0 w-1 h-full cursor-ew-resize opacity-0 group-hover:opacity-50 bg-blue-500 rounded-l-lg" />
            <div className="absolute right-0 top-0 w-1 h-full cursor-ew-resize opacity-0 group-hover:opacity-50 bg-blue-500 rounded-r-lg" />
          </>
        )}
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
          <div className="bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg max-w-64">
            <div className="font-medium mb-1">{name}</div>
            <div className="space-y-1 text-gray-300">
              <div>Duración: {duration} días</div>
              <div>Progreso: {progress}%</div>
              <div>Estado: {status}</div>
              <div>
                {startDate.toLocaleDateString('es-EC')} - {endDate.toLocaleDateString('es-EC')}
              </div>
              {assignedResources.length > 0 && (
                <div>Recursos: {assignedResources.join(", ")}</div>
              )}
              {estimatedCost && (
                <div className="flex items-center gap-1">
                  <CurrencyDollarIcon className="h-3 w-3" />
                  Estimado: ${estimatedCost.toLocaleString()}
                  {actualCost && (
                    <span className="ml-1">
                      (Real: ${actualCost.toLocaleString()})
                    </span>
                  )}
                </div>
              )}
              {dependencies.length > 0 && (
                <div>Dependencias: {dependencies.length}</div>
              )}
              {notes && (
                <div className="border-t border-gray-700 mt-1 pt-1">
                  {notes}
                </div>
              )}
            </div>
            {/* Arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
          </div>
        </div>
      )}

      {/* Details panel */}
      {showDetails && isSelected && (
        <div className="absolute top-full left-0 mt-1 z-40 bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-64">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">{name}</h4>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                {isEditing ? "Guardar" : "Editar"}
              </button>
            </div>
            
            {isEditing ? (
              <div className="space-y-2">
                <div>
                  <label className="block text-xs text-gray-600">Progreso</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={(e) => onProgressChange?.(parseInt(e.target.value))}
                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-xs text-gray-600">{progress}%</div>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-600">Estado</label>
                  <select
                    value={status}
                    onChange={(e) => onStatusChange?.(e.target.value as any)}
                    className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="not_started">No iniciada</option>
                    <option value="in_progress">En progreso</option>
                    <option value="paused">Pausada</option>
                    <option value="completed">Completada</option>
                    <option value="delayed">Retrasada</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-1 text-xs text-gray-600">
                <div>Duración: {duration} días</div>
                <div>Estado: {status}</div>
                <div>Prioridad: {priority}</div>
                {assignedResources.length > 0 && (
                  <div>Recursos: {assignedResources.join(", ")}</div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

