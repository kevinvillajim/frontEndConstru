// src/ui/pages/calculations/schedule/components/GanttResourcePanel.tsx
import React, { useState } from "react";
import {
  UserGroupIcon,
  WrenchScrewdriverIcon,
  CubeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Badge, ProgressBar } from "../../shared/components/SharedComponents";

interface Resource {
  id: string;
  name: string;
  type: "person" | "equipment" | "material";
  category: string;
  availability: number;
  cost: number;
  assignments: ResourceAssignment[];
  skills?: string[];
  location?: string;
}

interface ResourceAssignment {
  activityId: string;
  activityName: string;
  startDate: Date;
  endDate: Date;
  allocation: number;
}

interface GanttResourcePanelProps {
  resources: Resource[];
  activities: any[];
  onResourceAssign?: (resourceId: string, activityId: string, allocation: number) => void;
  onResourceUnassign?: (resourceId: string, activityId: string) => void;
  onResourceAdd?: (resource: Omit<Resource, 'id' | 'assignments'>) => void;
  isVisible: boolean;
  onToggle: () => void;
}

export const GanttResourcePanel: React.FC<GanttResourcePanelProps> = ({
  resources,
  activities,
  onResourceAssign,
  onResourceUnassign,
  onResourceAdd,
  isVisible,
  onToggle,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "person" | "equipment" | "material">("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [draggedResource, setDraggedResource] = useState<string | null>(null);

  const getResourceIcon = (type: Resource["type"]) => {
    switch (type) {
      case "person": return UserGroupIcon;
      case "equipment": return WrenchScrewdriverIcon;
      case "material": return CubeIcon;
    }
  };

  const getUtilization = (resource: Resource) => {
    const totalAssigned = resource.assignments.reduce((sum, assignment) => sum + assignment.allocation, 0);
    return Math.min((totalAssigned / resource.availability) * 100, 100);
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization > 100) return "red";
    if (utilization > 85) return "yellow";
    return "green";
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || resource.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const handleDragStart = (e: React.DragEvent, resourceId: string) => {
    setDraggedResource(resourceId);
    e.dataTransfer.setData("text/plain", resourceId);
  };

  const handleDragEnd = () => {
    setDraggedResource(null);
  };

  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        className="fixed right-4 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-3 rounded-l-lg shadow-lg hover:bg-blue-700 transition-colors z-40"
      >
        <UserGroupIcon className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 shadow-xl z-30 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Recursos</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddForm(true)}
            className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
          <button
            onClick={onToggle}
            className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 border-b border-gray-200 space-y-3">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar recursos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex gap-1">
          {[
            { value: "all", label: "Todos", icon: FunnelIcon },
            { value: "person", label: "Personal", icon: UserGroupIcon },
            { value: "equipment", label: "Equipos", icon: WrenchScrewdriverIcon },
            { value: "material", label: "Materiales", icon: CubeIcon },
          ].map((filter) => {
            const Icon = filter.icon;
            return (
              <button
                key={filter.value}
                onClick={() => setFilterType(filter.value as any)}
                className={`flex items-center gap-1 px-3 py-1 text-xs rounded-lg transition-colors ${
                  filterType === filter.value
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="h-3 w-3" />
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Resource List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-3">
          {filteredResources.map((resource) => {
            const Icon = getResourceIcon(resource.type);
            const utilization = getUtilization(resource);
            const isOverallocated = utilization > 100;
            
            return (
              <div
                key={resource.id}
                className={`p-3 border rounded-lg cursor-move transition-all ${
                  draggedResource === resource.id
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : isOverallocated
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
                draggable
                onDragStart={(e) => handleDragStart(e, resource.id)}
                onDragEnd={handleDragEnd}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <Icon className="h-4 w-4 text-gray-600 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-gray-900 truncate">{resource.name}</div>
                      <div className="text-xs text-gray-600">{resource.category}</div>
                    </div>
                  </div>
                  
                  <Badge
                    variant={resource.type === "person" ? "info" : resource.type === "equipment" ? "warning" : "secondary"}
                    className="text-xs"
                  >
                    {resource.type === "person" && "Personal"}
                    {resource.type === "equipment" && "Equipo"}
                    {resource.type === "material" && "Material"}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Utilización</span>
                    <span className={`font-medium ${
                      isOverallocated ? "text-red-600" : "text-gray-900"
                    }`}>
                      {utilization.toFixed(1)}%
                    </span>
                  </div>
                  <ProgressBar
                    progress={Math.min(utilization, 100)}
                    color={getUtilizationColor(utilization)}
                    size="sm"
                  />
                  
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Disponible: {resource.availability}</span>
                    <span>${resource.cost}/hora</span>
                  </div>
                </div>

                {resource.assignments.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <div className="text-xs text-gray-600 mb-1">Asignaciones:</div>
                    <div className="space-y-1">
                      {resource.assignments.slice(0, 2).map((assignment, index) => (
                        <div key={index} className="flex items-center justify-between text-xs">
                          <span className="truncate">{assignment.activityName}</span>
                          <span className="text-gray-500">{assignment.allocation}%</span>
                        </div>
                      ))}
                      {resource.assignments.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{resource.assignments.length - 2} más
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {resource.skills && resource.skills.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <div className="text-xs text-gray-600 mb-1">Habilidades:</div>
                    <div className="flex flex-wrap gap-1">
                      {resource.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {resource.skills.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{resource.skills.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {isOverallocated && (
                  <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-xs text-red-700">
                    ⚠️ Recurso sobreasignado
                  </div>
                )}
              </div>
            );
          })}

          {filteredResources.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <UserGroupIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No se encontraron recursos</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
              >
                Agregar primer recurso
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Resource Form */}
      {showAddForm && (
        <div className="absolute inset-0 bg-white z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Agregar Recurso</h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex-1 p-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Recurso
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Juan Pérez, Grúa Torre, Cemento Premium"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="person">Personal</option>
                  <option value="equipment">Equipo</option>
                  <option value="material">Material</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Albañil, Grúa, Cemento"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Disponibilidad
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="8"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Costo/hora
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="25"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  // Handle add resource logic here
                  setShowAddForm(false);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Agregar Recurso
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};