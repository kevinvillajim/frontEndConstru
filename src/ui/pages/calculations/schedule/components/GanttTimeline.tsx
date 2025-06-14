// src/ui/pages/calculations/schedule/components/GanttTimeline.tsx
import React, { useMemo } from "react";
import { CalendarDaysIcon, ClockIcon } from "@heroicons/react/24/outline";

interface Milestone {
  id: string;
  name: string;
  date: Date;
  type: "critical" | "important" | "normal";
  completed: boolean;
}

interface GanttTimelineProps {
  startDate: Date;
  endDate: Date;
  viewMode: "days" | "weeks" | "months";
  zoom: number;
  milestones?: Milestone[];
  showWeekends?: boolean;
  showHolidays?: boolean;
  holidays?: Date[];
  onDateClick?: (date: Date) => void;
  className?: string;
}

export const GanttTimeline: React.FC<GanttTimelineProps> = ({
  startDate,
  endDate,
  viewMode,
  zoom,
  milestones = [],
  showWeekends = true,
  showHolidays = true,
  holidays = [],
  onDateClick,
  className = "",
}) => {
  const timeColumns = useMemo(() => {
    const columns = [];
    const current = new Date(startDate);
    const scale = viewMode === "days" ? 1 : viewMode === "weeks" ? 7 : 30;
    
    while (current <= endDate) {
      const isWeekend = current.getDay() === 0 || current.getDay() === 6;
      const isHoliday = holidays.some(holiday => 
        holiday.toDateString() === current.toDateString()
      );
      
      columns.push({
        date: new Date(current),
        isWeekend,
        isHoliday,
        milestone: milestones.find(m => 
          m.date.toDateString() === current.toDateString()
        ),
      });
      
      current.setDate(current.getDate() + scale);
    }
    
    return columns;
  }, [startDate, endDate, viewMode, milestones, holidays]);

  const columnWidth = (zoom / 100) * 30 * (viewMode === "days" ? 1 : viewMode === "weeks" ? 7 : 30);

  const getMilestoneColor = (type: Milestone["type"]) => {
    switch (type) {
      case "critical": return "bg-red-500";
      case "important": return "bg-yellow-500";
      default: return "bg-blue-500";
    }
  };

  const formatHeaderDate = (date: Date) => {
    switch (viewMode) {
      case "days":
        return {
          primary: date.toLocaleDateString('es-EC', { weekday: 'short' }),
          secondary: date.getDate().toString(),
        };
      case "weeks":
        return {
          primary: `Semana ${Math.ceil(date.getDate() / 7)}`,
          secondary: date.toLocaleDateString('es-EC', { month: 'short', day: 'numeric' }),
        };
      case "months":
        return {
          primary: date.toLocaleDateString('es-EC', { month: 'short' }),
          secondary: date.toLocaleDateString('es-EC', { year: '2-digit' }),
        };
      default:
        return { primary: "", secondary: "" };
    }
  };

  return (
    <div className={`gantt-timeline bg-gray-50 border-b border-gray-200 ${className}`}>
      {/* Header row */}
      <div className="flex border-b border-gray-200">
        {timeColumns.map((column, index) => {
          const headerDate = formatHeaderDate(column.date);
          const isSpecialDay = (!showWeekends && column.isWeekend) || 
                              (showHolidays && column.isHoliday);
          
          return (
            <div
              key={index}
              className={`flex-shrink-0 relative border-r border-gray-300 text-center py-2 cursor-pointer transition-colors ${
                isSpecialDay 
                  ? "bg-gray-100 text-gray-500" 
                  : "hover:bg-blue-50"
              }`}
              style={{ width: columnWidth }}
              onClick={() => onDateClick?.(column.date)}
            >
              <div className="text-xs font-medium text-gray-900">
                {headerDate.primary}
              </div>
              <div className="text-xs text-gray-600">
                {headerDate.secondary}
              </div>

              {/* Milestone indicator */}
              {column.milestone && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1">
                  <div 
                    className={`w-3 h-3 rounded-full border-2 border-white shadow-sm ${
                      getMilestoneColor(column.milestone.type)
                    } ${column.milestone.completed ? '' : 'animate-pulse'}`}
                    title={column.milestone.name}
                  />
                </div>
              )}

              {/* Holiday indicator */}
              {showHolidays && column.isHoliday && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                </div>
              )}

              {/* Today indicator */}
              {column.date.toDateString() === new Date().toDateString() && (
                <div className="absolute inset-0 bg-blue-200 bg-opacity-30 border-l-2 border-blue-500" />
              )}
            </div>
          );
        })}
      </div>

      {/* Milestones legend */}
      {milestones.length > 0 && (
        <div className="p-2 bg-white border-b border-gray-200">
          <div className="flex items-center gap-4 text-xs">
            <span className="font-medium text-gray-700">Hitos:</span>
            {milestones.slice(0, 5).map((milestone) => (
              <div key={milestone.id} className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${getMilestoneColor(milestone.type)}`} />
                <span className="text-gray-600">{milestone.name}</span>
              </div>
            ))}
            {milestones.length > 5 && (
              <span className="text-gray-500">+{milestones.length - 5} más</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

