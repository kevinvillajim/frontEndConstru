// src/ui/pages/calculations/schedule/CalculationScheduleHub.tsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ClockIcon,
  PlayIcon,
  PlusIcon,
  ChartBarIcon,
  CogIcon,
  DocumentChartBarIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  BoltIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { Badge, LoadingSpinner, ProgressBar } from "../shared/components/SharedComponents";

// Types
interface ScheduleProject {
  id: string;
  name: string;
  client: string;
  status: "planning" | "active" | "paused" | "completed" | "delayed";
  progress: number;
  startDate: Date;
  endDate: Date;
  totalActivities: number;
  completedActivities: number;
  criticalPath: boolean;
  budgetId?: string;
  lastUpdated: Date;
}

interface QuickStat {
  label: string;
  value: string;
  change: string;
  icon: React.ComponentType<any>;
  color: string;
}

interface RecentScheduleActivity {
  id: string;
  type: "created" | "updated" | "completed" | "delayed" | "optimized";
  title: string;
  project: string;
  time: string;
  status: "success" | "warning" | "error" | "info";
}

// Main Sections for Schedule Hub
const SCHEDULE_SECTIONS = [
  {
    id: "generator",
    name: "Generar Cronograma",
    description: "Crear cronograma desde presupuesto aprobado",
    icon: PlusIcon,
    route: "/calculations/schedule/generator",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
    badge: "Desde Budget",
    isMain: true,
  },
  {
    id: "gantt",
    name: "Vista Gantt",
    description: "Visualización y edición interactiva de cronogramas",
    icon: ChartBarIcon,
    route: "/calculations/schedule/gantt",
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-700",
    badge: "Interactivo",
    isMain: true,
  },
  {
    id: "resources",
    name: "Gestión de Recursos",
    description: "Optimizar asignación de personal y equipos",
    icon: UserGroupIcon,
    route: "/calculations/schedule/resources",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-700",
    badge: "Optimización",
    isMain: true,
  },
  {
    id: "tracking",
    name: "Seguimiento",
    description: "Captura de progreso y alertas en tiempo real",
    icon: ClockIcon,
    route: "/calculations/schedule/tracking",
    color: "from-amber-500 to-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-700",
    badge: "Real-time",
    isMain: true,
  },
];

// Quick Stats
const QUICK_STATS: QuickStat[] = [
  {
    label: "Proyectos Activos",
    value: "12",
    change: "+3",
    icon: BuildingOfficeIcon,
    color: "from-blue-500 to-blue-600",
  },
  {
    label: "Actividades Completadas",
    value: "247",
    change: "+18",
    icon: ClockIcon,
    color: "from-green-500 to-green-600",
  },
  {
    label: "Eficiencia Promedio",
    value: "87%",
    change: "+5%",
    icon: ArrowTrendingUpIcon,
    color: "from-purple-500 to-purple-600",
  },
  {
    label: "Tiempo Ahorrado",
    value: "32h",
    change: "+12h",
    icon: BoltIcon,
    color: "from-amber-500 to-amber-600",
  },
];

// Mock Data
const MOCK_PROJECTS: ScheduleProject[] = [
  {
    id: "proj-1",
    name: "Edificio Residencial Norte",
    client: "Inmobiliaria ABC",
    status: "active",
    progress: 67,
    startDate: new Date(2024, 0, 15),
    endDate: new Date(2024, 11, 20),
    totalActivities: 156,
    completedActivities: 104,
    criticalPath: true,
    budgetId: "budget-1",
    lastUpdated: new Date(2024, 5, 13),
  },
  {
    id: "proj-2",
    name: "Centro Comercial Plaza",
    client: "Desarrollos Comerciales",
    status: "delayed",
    progress: 42,
    startDate: new Date(2024, 1, 1),
    endDate: new Date(2024, 10, 15),
    totalActivities: 203,
    completedActivities: 85,
    criticalPath: true,
    budgetId: "budget-2",
    lastUpdated: new Date(2024, 5, 12),
  },
  {
    id: "proj-3",
    name: "Casa Unifamiliar Premium",
    client: "Cliente Privado",
    status: "active",
    progress: 89,
    startDate: new Date(2024, 2, 10),
    endDate: new Date(2024, 7, 30),
    totalActivities: 89,
    completedActivities: 79,
    criticalPath: false,
    lastUpdated: new Date(2024, 5, 14),
  },
];

const RECENT_ACTIVITY: RecentScheduleActivity[] = [
  {
    id: "1",
    type: "completed",
    title: "Actividad completada: Estructura nivel 5",
    project: "Edificio Residencial Norte",
    time: "Hace 15 minutos",
    status: "success",
  },
  {
    id: "2",
    type: "delayed",
    title: "Retraso detectado en instalaciones eléctricas",
    project: "Centro Comercial Plaza",
    time: "Hace 1 hora",
    status: "warning",
  },
  {
    id: "3",
    type: "optimized",
    title: "Cronograma optimizado automáticamente",
    project: "Casa Unifamiliar Premium",
    time: "Hace 2 horas",
    status: "info",
  },
];

const CalculationScheduleHub: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ScheduleProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setProjects(MOCK_PROJECTS);
    } catch (error) {
      console.error("Error loading schedule data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: ScheduleProject["status"]) => {
    switch (status) {
      case "active": return "text-green-600 bg-green-100";
      case "delayed": return "text-red-600 bg-red-100";
      case "completed": return "text-blue-600 bg-blue-100";
      case "paused": return "text-yellow-600 bg-yellow-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = (status: ScheduleProject["status"]) => {
    switch (status) {
      case "active": return "Activo";
      case "delayed": return "Retrasado";
      case "completed": return "Completado";
      case "paused": return "Pausado";
      case "planning": return "Planificación";
      default: return "Desconocido";
    }
  };

  const getActivityIcon = (type: RecentScheduleActivity["type"]) => {
    switch (type) {
      case "created": return PlusIcon;
      case "updated": return CogIcon;
      case "completed": return PlayIcon;
      case "delayed": return ExclamationTriangleIcon;
      case "optimized": return BoltIcon;
      default: return ClockIcon;
    }
  };

  const getActivityColor = (status: RecentScheduleActivity["status"]) => {
    switch (status) {
      case "success": return "text-green-600";
      case "warning": return "text-amber-600";
      case "error": return "text-red-600";
      default: return "text-blue-600";
    }
  };

  if (isLoading) {
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Centro de Cronogramas
              </h1>
              <p className="text-gray-600 mt-2">
                Gestiona cronogramas inteligentes integrados con presupuestos
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/calculations/schedule/integration"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <DocumentChartBarIcon className="h-4 w-4" />
                Workspace Integrado
              </Link>
              <Link
                to="/calculations/schedule/generator"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="h-4 w-4" />
                Nuevo Cronograma
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {QUICK_STATS.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600 font-medium">{stat.change}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} p-3 flex items-center justify-center`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {SCHEDULE_SECTIONS.map((section) => (
            <Link
              key={section.id}
              to={section.route}
              className={`group relative ${section.bgColor} ${section.borderColor} border-2 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105`}
              onMouseEnter={() => setSelectedSection(section.id)}
              onMouseLeave={() => setSelectedSection(null)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${section.color} p-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <section.icon className="h-6 w-6 text-white" />
                </div>
                <Badge variant="secondary" className="text-xs">
                  {section.badge}
                </Badge>
              </div>
              
              <h3 className={`text-lg font-semibold ${section.textColor} mb-2 group-hover:text-opacity-80 transition-colors`}>
                {section.name}
              </h3>
              
              <p className="text-gray-600 text-sm leading-relaxed">
                {section.description}
              </p>

              {/* Hover indicator */}
              <div className={`absolute inset-0 bg-gradient-to-r ${section.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projects List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Proyectos Activos
                  </h2>
                  <Link
                    to="/calculations/schedule/projects"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Ver todos
                  </Link>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {projects.map((project) => (
                  <div key={project.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900">{project.name}</h3>
                        <Badge className={getStatusColor(project.status)}>
                          {getStatusText(project.status)}
                        </Badge>
                        {project.criticalPath && (
                          <div className="flex items-center gap-1 text-red-600">
                            <ExclamationTriangleIcon className="h-4 w-4" />
                            <span className="text-xs font-medium">Ruta Crítica</span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Link
                          to={`/calculations/schedule/gantt/${project.id}`}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Link>
                        {project.budgetId && (
                          <Link
                            to={`/calculations/schedule/integration/${project.id}`}
                            className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                          >
                            <DocumentChartBarIcon className="h-4 w-4" />
                          </Link>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{project.client}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progreso: {project.completedActivities}/{project.totalActivities} actividades</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <ProgressBar 
                        progress={project.progress} 
                        color={project.status === "delayed" ? "red" : project.progress >= 80 ? "green" : "blue"}
                      />
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-500 mt-3">
                      <span>Actualizado: {project.lastUpdated.toLocaleDateString('es-EC')}</span>
                      <span>Fin: {project.endDate.toLocaleDateString('es-EC')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-2xl border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Actividad Reciente
                </h2>
              </div>
              <div className="p-6 space-y-4">
                {RECENT_ACTIVITY.map((activity) => {
                  const Icon = getActivityIcon(activity.type);
                  return (
                    <div key={activity.id} className="flex gap-3">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center`}>
                        <Icon className={`h-4 w-4 ${getActivityColor(activity.status)}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-600">{activity.project}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Acciones Rápidas
              </h2>
              <div className="space-y-3">
                <Link
                  to="/calculations/schedule/analytics"
                  className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <ChartBarIcon className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium">Analytics Dashboard</span>
                </Link>
                <Link
                  to="/calculations/schedule/optimizer"
                  className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <BoltIcon className="h-5 w-5 text-amber-600" />
                  <span className="text-sm font-medium">Optimización Automática</span>
                </Link>
                <Link
                  to="/calculations/schedule/reports"
                  className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <DocumentChartBarIcon className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium">Reportes de Performance</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculationScheduleHub;