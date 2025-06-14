// src/ui/pages/calculations/schedule/ScheduleResourceView.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  UserGroupIcon,
  WrenchScrewdriverIcon,
  CubeIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  AdjustmentsHorizontalIcon,
  BoltIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { LoadingSpinner, ProgressBar, Badge, Alert } from "../shared/components/SharedComponents";

// Types
interface Resource {
  id: string;
  name: string;
  type: "person" | "equipment" | "material";
  category: string;
  capacity: number;
  costPerHour: number;
  availability: ResourceAvailability[];
  skills?: string[];
  location?: string;
  status: "available" | "busy" | "unavailable" | "maintenance";
}

interface ResourceAvailability {
  startDate: Date;
  endDate: Date;
  capacity: number;
  activityId?: string;
  activityName?: string;
}

interface ResourceAssignment {
  id: string;
  resourceId: string;
  activityId: string;
  activityName: string;
  startDate: Date;
  endDate: Date;
  allocatedCapacity: number;
  status: "planned" | "active" | "completed" | "delayed";
  priority: "low" | "medium" | "high" | "critical";
}

interface ResourceConflict {
  id: string;
  type: "overallocation" | "unavailable" | "skill_mismatch" | "cost_exceeded";
  severity: "low" | "medium" | "high" | "critical";
  resourceId: string;
  resourceName: string;
  affectedActivities: string[];
  description: string;
  suggestions: string[];
}

interface OptimizationSuggestion {
  id: string;
  type: "reallocation" | "substitute" | "schedule_change" | "capacity_increase";
  impact: "low" | "medium" | "high";
  description: string;
  savings: {
    time: number;
    cost: number;
  };
  resources: string[];
  activities: string[];
}

const RESOURCE_TYPES = [
  { value: "person", label: "Personal", icon: UserGroupIcon, color: "blue" },
  { value: "equipment", label: "Equipos", icon: WrenchScrewdriverIcon, color: "green" },
  { value: "material", label: "Materiales", icon: CubeIcon, color: "purple" },
];

const STATUS_COLORS = {
  available: "text-green-600 bg-green-100",
  busy: "text-blue-600 bg-blue-100",
  unavailable: "text-red-600 bg-red-100",
  maintenance: "text-yellow-600 bg-yellow-100",
};

const ScheduleResourceView: React.FC = () => {
  const { scheduleId } = useParams();
  const navigate = useNavigate();
  
  const [resources, setResources] = useState<Resource[]>([]);
  const [assignments, setAssignments] = useState<ResourceAssignment[]>([]);
  const [conflicts, setConflicts] = useState<ResourceConflict[]>([]);
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [selectedResourceType, setSelectedResourceType] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"list" | "timeline" | "utilization">("list");
  const [timeRange, setTimeRange] = useState<{ start: Date; end: Date }>({
    start: new Date(),
    end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  });

  useEffect(() => {
    loadResourceData();
  }, [scheduleId]);

  const loadResourceData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResources: Resource[] = [
        {
          id: "res-1",
          name: "Juan Pérez",
          type: "person",
          category: "Maestro de Obra",
          capacity: 8,
          costPerHour: 25,
          skills: ["Supervisión", "Hormigón", "Estructural"],
          location: "Quito",
          status: "busy",
          availability: [
            {
              startDate: new Date(2024, 6, 1),
              endDate: new Date(2024, 6, 15),
              capacity: 8,
              activityId: "act-1",
              activityName: "Excavación y Cimentación",
            },
          ],
        },
        {
          id: "res-2",
          name: "Grúa Torre GT-200",
          type: "equipment",
          category: "Grúas",
          capacity: 12,
          costPerHour: 180,
          location: "Obra Norte",
          status: "available",
          availability: [],
        },
        {
          id: "res-3",
          name: "Cuadrilla Albañilería",
          type: "person",
          category: "Albañiles",
          capacity: 40,
          costPerHour: 18,
          skills: ["Mampostería", "Acabados", "Instalaciones"],
          status: "available",
          availability: [],
        },
        {
          id: "res-4",
          name: "Cemento Premium",
          type: "material",
          category: "Cemento",
          capacity: 1000,
          costPerHour: 0.45,
          status: "available",
          availability: [],
        },
      ];

      const mockAssignments: ResourceAssignment[] = [
        {
          id: "assign-1",
          resourceId: "res-1",
          activityId: "act-1",
          activityName: "Excavación y Cimentación",
          startDate: new Date(2024, 6, 1),
          endDate: new Date(2024, 6, 15),
          allocatedCapacity: 8,
          status: "active",
          priority: "critical",
        },
        {
          id: "assign-2",
          resourceId: "res-2",
          activityId: "act-2",
          activityName: "Estructura Nivel 1-3",
          startDate: new Date(2024, 6, 16),
          endDate: new Date(2024, 7, 10),
          allocatedCapacity: 12,
          status: "planned",
          priority: "high",
        },
      ];

      const mockConflicts: ResourceConflict[] = [
        {
          id: "conflict-1",
          type: "overallocation",
          severity: "high",
          resourceId: "res-1",
          resourceName: "Juan Pérez",
          affectedActivities: ["act-1", "act-3"],
          description: "Maestro de obra asignado a múltiples actividades simultáneamente",
          suggestions: [
            "Reagendar actividad de instalaciones eléctricas",
            "Asignar maestro de obra adicional",
            "Extender duración de actividades secuencialmente",
          ],
        },
      ];

      const mockSuggestions: OptimizationSuggestion[] = [
        {
          id: "sugg-1",
          type: "reallocation",
          impact: "high",
          description: "Reasignar grúa torre a múltiples actividades para optimizar uso",
          savings: { time: 5, cost: 3200 },
          resources: ["res-2"],
          activities: ["act-2", "act-4"],
        },
        {
          id: "sugg-2",
          type: "substitute",
          impact: "medium",
          description: "Sustituir parte de cuadrilla especializada por personal general",
          savings: { time: 0, cost: 1800 },
          resources: ["res-3"],
          activities: ["act-4"],
        },
      ];

      setResources(mockResources);
      setAssignments(mockAssignments);
      setConflicts(mockConflicts);
      setSuggestions(mockSuggestions);
    } catch (error) {
      console.error("Error loading resource data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredResources = resources.filter(resource => 
    selectedResourceType === "all" || resource.type === selectedResourceType
  );

  const getResourceUtilization = (resource: Resource) => {
    const totalAssignments = assignments.filter(a => a.resourceId === resource.id);
    const totalAllocated = totalAssignments.reduce((sum, a) => sum + a.allocatedCapacity, 0);
    const timeSpan = (timeRange.end.getTime() - timeRange.start.getTime()) / (1000 * 60 * 60); // hours
    const totalCapacity = resource.capacity * (timeSpan / 24); // assuming daily capacity
    
    return Math.min((totalAllocated / totalCapacity) * 100, 100);
  };

  const getResourceTypeIcon = (type: string) => {
    const resourceType = RESOURCE_TYPES.find(rt => rt.value === type);
    return resourceType?.icon || UserGroupIcon;
  };

  const getResourceTypeColor = (type: string) => {
    const resourceType = RESOURCE_TYPES.find(rt => rt.value === type);
    return resourceType?.color || "gray";
  };

  const getConflictColor = (severity: ResourceConflict["severity"]) => {
    switch (severity) {
      case "critical": return "border-red-500 bg-red-50";
      case "high": return "border-orange-500 bg-orange-50";
      case "medium": return "border-yellow-500 bg-yellow-50";
      default: return "border-blue-500 bg-blue-50";
    }
  };

  const applyOptimization = (suggestionId: string) => {
    const suggestion = suggestions.find(s => s.id === suggestionId);
    if (!suggestion) return;

    // Simulate applying optimization
    console.log("Applying optimization:", suggestion);
    
    // Remove suggestion after applying
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
    
    // Show success message (you could implement a toast notification here)
    alert(`Optimización aplicada: ${suggestion.description}`);
  };

  const exportResourceReport = () => {
    console.log("Exporting resource report...");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/calculations/schedule")}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Gestión de Recursos
                </h1>
                <p className="text-gray-600">
                  Optimización y asignación de recursos para cronogramas
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* View Mode Selector */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                {[
                  { value: "list", label: "Lista" },
                  { value: "timeline", label: "Timeline" },
                  { value: "utilization", label: "Utilización" },
                ].map((mode) => (
                  <button
                    key={mode.value}
                    onClick={() => setViewMode(mode.value as any)}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      viewMode === mode.value
                        ? "bg-blue-500 text-white"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>

              <button
                onClick={exportResourceReport}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Exportar Reporte
              </button>

              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <BoltIcon className="h-4 w-4 inline mr-2" />
                Optimizar Automático
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Resource Type Filter */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Filtros de Recursos</h2>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Total: {filteredResources.length} recursos</span>
              <span>Conflictos: {conflicts.length}</span>
              <span>Optimizaciones: {suggestions.length}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setSelectedResourceType("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedResourceType === "all"
                  ? "bg-gray-900 text-white"
                  : "text-gray-700 bg-gray-100 hover:bg-gray-200"
              }`}
            >
              Todos ({resources.length})
            </button>
            {RESOURCE_TYPES.map((type) => {
              const count = resources.filter(r => r.type === type.value).length;
              const Icon = type.icon;
              
              return (
                <button
                  key={type.value}
                  onClick={() => setSelectedResourceType(type.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedResourceType === type.value
                      ? `bg-${type.color}-500 text-white`
                      : `text-${type.color}-700 bg-${type.color}-100 hover:bg-${type.color}-200`
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {type.label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Resource List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Conflicts Alert */}
            {conflicts.length > 0 && (
              <Alert variant="warning" className="mb-6">
                <ExclamationTriangleIcon className="h-5 w-5" />
                <div>
                  <strong>Conflictos de Recursos Detectados</strong>
                  <p className="text-sm mt-1">
                    Se encontraron {conflicts.length} conflictos que requieren atención.
                  </p>
                </div>
              </Alert>
            )}

            {/* Resource Cards */}
            <div className="space-y-4">
              {filteredResources.map((resource) => {
                const Icon = getResourceTypeIcon(resource.type);
                const utilization = getResourceUtilization(resource);
                const resourceConflicts = conflicts.filter(c => c.resourceId === resource.id);
                
                return (
                  <div
                    key={resource.id}
                    className={`bg-white rounded-2xl border-2 p-6 transition-all cursor-pointer ${
                      selectedResource?.id === resource.id
                        ? "border-blue-500 shadow-lg"
                        : resourceConflicts.length > 0
                        ? "border-red-200 hover:border-red-300"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedResource(resource)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl bg-${getResourceTypeColor(resource.type)}-100 flex items-center justify-center`}>
                          <Icon className={`h-6 w-6 text-${getResourceTypeColor(resource.type)}-600`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{resource.name}</h3>
                          <p className="text-sm text-gray-600">{resource.category}</p>
                          {resource.location && (
                            <p className="text-xs text-gray-500">{resource.location}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={STATUS_COLORS[resource.status]}>
                          {resource.status === "available" && "Disponible"}
                          {resource.status === "busy" && "Ocupado"}
                          {resource.status === "unavailable" && "No disponible"}
                          {resource.status === "maintenance" && "Mantenimiento"}
                        </Badge>
                        {resourceConflicts.length > 0 && (
                          <div className="flex items-center gap-1 text-red-600">
                            <ExclamationTriangleIcon className="h-4 w-4" />
                            <span className="text-xs font-medium">{resourceConflicts.length}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-gray-500">Capacidad</span>
                        <div className="font-medium">
                          {resource.capacity} {resource.type === "person" ? "h/día" : resource.type === "equipment" ? "h/día" : "unidades"}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Costo</span>
                        <div className="font-medium">
                          ${resource.costPerHour}/{resource.type === "material" ? "unidad" : "hora"}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Utilización</span>
                        <div className="font-medium">{utilization.toFixed(1)}%</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Utilización en período</span>
                        <span className="font-medium">{utilization.toFixed(1)}%</span>
                      </div>
                      <ProgressBar
                        progress={utilization}
                        color={utilization > 90 ? "red" : utilization > 70 ? "yellow" : "green"}
                      />
                    </div>

                    {resource.skills && resource.skills.length > 0 && (
                      <div className="mt-4">
                        <span className="text-sm text-gray-500 mb-2 block">Habilidades:</span>
                        <div className="flex flex-wrap gap-1">
                          {resource.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {resourceConflicts.length > 0 && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2 text-red-700 text-sm font-medium mb-1">
                          <ExclamationTriangleIcon className="h-4 w-4" />
                          Conflictos detectados
                        </div>
                        {resourceConflicts.map((conflict) => (
                          <div key={conflict.id} className="text-xs text-red-600">
                            {conflict.description}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Selected Resource Details */}
            {selectedResource && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Detalles del Recurso
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-gray-500">Asignaciones Actuales</span>
                    <div className="mt-2 space-y-2">
                      {assignments
                        .filter(a => a.resourceId === selectedResource.id)
                        .map((assignment) => (
                          <div
                            key={assignment.id}
                            className="p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="font-medium text-sm">{assignment.activityName}</div>
                            <div className="text-xs text-gray-600">
                              {assignment.startDate.toLocaleDateString('es-EC')} - {assignment.endDate.toLocaleDateString('es-EC')}
                            </div>
                            <div className="text-xs text-gray-500">
                              Capacidad: {assignment.allocatedCapacity}/{selectedResource.capacity}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Optimization Suggestions */}
            {suggestions.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BoltIcon className="h-5 w-5 text-yellow-600" />
                  Sugerencias de Optimización
                </h3>
                
                <div className="space-y-4">
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-medium text-sm">{suggestion.description}</div>
                        <Badge 
                          variant={suggestion.impact === "high" ? "success" : 
                                  suggestion.impact === "medium" ? "warning" : "secondary"}
                          className="text-xs"
                        >
                          {suggestion.impact === "high" && "Alto Impacto"}
                          {suggestion.impact === "medium" && "Medio Impacto"}
                          {suggestion.impact === "low" && "Bajo Impacto"}
                        </Badge>
                      </div>
                      
                      <div className="text-xs text-gray-600 mb-3">
                        <div>Ahorro de tiempo: {suggestion.savings.time} días</div>
                        <div>Ahorro de costo: ${suggestion.savings.cost.toLocaleString()}</div>
                      </div>
                      
                      <button
                        onClick={() => applyOptimization(suggestion.id)}
                        className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Aplicar Optimización
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resource Conflicts */}
            {conflicts.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
                  Conflictos de Recursos
                </h3>
                
                <div className="space-y-4">
                  {conflicts.map((conflict) => (
                    <div
                      key={conflict.id}
                      className={`p-4 border-2 rounded-lg ${getConflictColor(conflict.severity)}`}
                    >
                      <div className="font-medium text-sm mb-2">{conflict.description}</div>
                      <div className="text-xs text-gray-600 mb-3">
                        Recurso: {conflict.resourceName}
                      </div>
                      
                      <div className="text-xs mb-3">
                        <div className="font-medium mb-1">Sugerencias:</div>
                        <ul className="list-disc list-inside space-y-1">
                          {conflict.suggestions.map((suggestion, index) => (
                            <li key={index}>{suggestion}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <button className="w-full px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        Resolver Conflicto
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleResourceView;