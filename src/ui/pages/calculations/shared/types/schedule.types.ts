// src/ui/pages/calculations/shared/types/schedule.types.ts
export interface ScheduleActivity {
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
  
  export interface Resource {
    id: string;
    name: string;
    type: "person" | "equipment" | "material";
    availability: number;
    cost: number;
  }
  
  export interface Schedule {
    id: string;
    name: string;
    description: string;
    projectId: string;
    budgetId?: string;
    status: "draft" | "active" | "paused" | "completed" | "archived";
    activities: ScheduleActivity[];
    startDate: Date;
    endDate: Date;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
  }
  
  export interface ScheduleTemplate {
    id: string;
    name: string;
    description: string;
    projectType: string;
    geographicalZone: string;
    estimatedDuration: number;
    baseActivities: number;
    complexity: "simple" | "moderate" | "complex";
    verified: boolean;
    usageCount: number;
  }
  
 
  
  
  // src/ui/pages/calculations/core/CalculationsHub.tsx - Actualización para incluir Schedule
  // Añadir al componente existente la sección de Schedule:
  
  const SCHEDULE_SECTION = {
    id: "schedule",
    name: "Cronogramas Inteligentes",
    description: "Cronogramas optimizados integrados con presupuestos",
    icon: CalendarDaysIcon,
    route: "/calculations/schedule",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-700",
    badge: "Integrado",
    isMain: true,
    features: [
      "Generación automática desde presupuestos",
      "Vista Gantt interactiva y optimizada",
      "Gestión avanzada de recursos",
      "Análisis de ruta crítica",
      "Seguimiento en tiempo real",
      "Optimización con IA",
      "Análisis de escenarios hipotéticos",
    ]
  };
  
  // README.md - Documentación del Módulo Schedule
  export const SCHEDULE_MODULE_DOCUMENTATION = `
  # Módulo de Cronogramas - CONSTRU
  
  ## Descripción General
  El módulo de cronogramas proporciona herramientas avanzadas para la planificación, visualización y optimización de cronogramas de construcción, integrado naturalmente con el sistema de presupuestación.
  
  ## Componentes Principales
  
  ### 1. CalculationScheduleHub
  **Archivo:** \`src/ui/pages/calculations/schedule/CalculationScheduleHub.tsx\`
  - Centro principal de gestión de cronogramas
  - Dashboard con métricas en tiempo real
  - Navegación rápida a todas las funcionalidades
  - Integración con presupuestos aprobados
  
  ### 2. ScheduleGenerator
  **Archivo:** \`src/ui/pages/calculations/schedule/ScheduleGenerator.tsx\`
  - Wizard paso a paso para generación de cronogramas
  - Integración directa con presupuestos aprobados
  - Selección de templates por tipo de proyecto
  - Configuración avanzada de parámetros regionales
  
  ### 3. ScheduleGanttView
  **Archivo:** \`src/ui/pages/calculations/schedule/ScheduleGanttView.tsx\`
  - Vista Gantt completa e interactiva
  - Drag & drop para ajustes rápidos
  - Visualización de dependencias
  - Zoom temporal configurable
  - Indicadores de ruta crítica
  
  ### 4. ScheduleResourceView
  **Archivo:** \`src/ui/pages/calculations/schedule/ScheduleResourceView.tsx\`
  - Gestión completa de recursos
  - Detección automática de conflictos
  - Optimización de asignaciones
  - Dashboard de utilización
  
  ### 5. ProgressTracker
  **Archivo:** \`src/ui/pages/calculations/schedule/ProgressTracker.tsx\`
  - Captura de progreso desde campo
  - Subida de fotografías con geolocalización
  - Funcionamiento offline básico
  - Alertas automáticas de desviación
  
  ### 6. ScheduleOptimizer
  **Archivo:** \`src/ui/pages/calculations/schedule/ScheduleOptimizer.tsx\`
  - Optimización automática mediante algoritmos avanzados
  - Configuración de objetivos personalizables
  - Comparación de escenarios
  - Recomendaciones basadas en IA
  
  ### 7. CriticalPathView
  **Archivo:** \`src/ui/pages/calculations/schedule/CriticalPathView.tsx\`
  - Análisis detallado de ruta crítica
  - Identificación de holguras
  - Recomendaciones de optimización
  - Simulación de cambios
  
  ### 8. WhatIfAnalyzer
  **Archivo:** \`src/ui/pages/calculations/schedule/WhatIfAnalyzer.tsx\`
  - Análisis de escenarios hipotéticos
  - Simulación de cambios
  - Comparación de impactos
  - Recomendaciones automáticas
  
  ## Componentes Especializados
  
  ### Gantt Components
  - **GanttChart:** Componente Gantt reutilizable y optimizado
  - **GanttTimeline:** Línea temporal configurable
  - **GanttTaskBar:** Barras de tareas customizables
  - **GanttResourcePanel:** Panel de gestión de recursos
  
  ### Monitoring Components
  - **ResourceMonitor:** Monitor en tiempo real de recursos
  - **ScheduleAlerts:** Sistema de alertas contextuales
  
  ## Hooks Especializados
  
  ### useScheduleGeneration
  **Archivo:** \`src/ui/pages/calculations/shared/hooks/useScheduleGeneration.tsx\`
  - Lógica de generación desde presupuesto
  - Estado del wizard paso a paso
  - Validaciones temporales
  
  ### useGanttInteractions
  **Archivo:** \`src/ui/pages/calculations/shared/hooks/useGanttInteractions.tsx\`
  - Manejo de interacciones Gantt
  - Drag & drop optimizado
  - Zoom y navegación
  
  ### useProgressTracking
  **Archivo:** \`src/ui/pages/calculations/shared/hooks/useProgressTracking.tsx\`
  - Captura y sincronización de avances
  - Estado offline/online
  - Validaciones de consistencia
  
  ### useBudgetScheduleIntegration
  **Archivo:** \`src/ui/pages/calculations/shared/hooks/useBudgetScheduleIntegration.tsx\`
  - Integración bidireccional presupuesto-cronograma
  - Sincronización automática
  - Resolución de conflictos
  
  ## Rutas y Navegación
  
  ### Router Principal
  **Archivo:** \`src/ui/pages/calculations/schedule/CalculationScheduleRouter.tsx\`
  
  #### Rutas Principales:
  - \`/calculations/schedule\` - Hub principal
  - \`/calculations/schedule/generator\` - Generador de cronogramas
  - \`/calculations/schedule/gantt/:scheduleId\` - Vista Gantt
  - \`/calculations/schedule/resources/:scheduleId\` - Gestión de recursos
  - \`/calculations/schedule/tracking/:scheduleId\` - Seguimiento
  - \`/calculations/schedule/analytics/:scheduleId\` - Analytics
  - \`/calculations/schedule/optimizer/:scheduleId\` - Optimizador
  - \`/calculations/schedule/critical-path/:scheduleId\` - Ruta crítica
  - \`/calculations/schedule/what-if/:scheduleId\` - Análisis hipotético
  - \`/calculations/schedule/integration/:projectId\` - Workspace integrado
  
  ## Integración con Módulos Existentes
  
  ### Budget Module
  - Generación automática de cronogramas desde presupuestos aprobados
  - Sincronización bidireccional de datos
  - Alertas de desviación presupuestaria
  
  ### Materials Module
  - Sincronización de necesidades de materiales
  - Optimización de pedidos según cronograma
  
  ### Analytics (Paso 8)
  - Integración con ScheduleAnalyticsDashboard
  - Métricas de performance de cronogramas
  - Reportes avanzados
  
  ## Características Técnicas
  
  ### Performance
  - Renderizado optimizado para cronogramas grandes (1000+ actividades)
  - Lazy loading de componentes pesados
  - Memoización de cálculos complejos
  
  ### Responsive Design
  - Adaptado para pantallas grandes (cronogramas)
  - Funcionalidad táctil para móviles
  - Zoom optimizado para diferentes dispositivos
  
  ### Offline Capabilities
  - Captura de progreso sin conexión
  - Sincronización automática al recuperar conexión
  - Estado persistente en localStorage
  
  ### Export/Import
  - Exportación a MS Project, PDF, imagen
  - Importación desde templates externos
  - Integración con sistemas empresariales
  
  ## Estado de Implementación
  
  ✅ **Completado:**
  - Estructura de rutas y navegación
  - Componentes principales de UI
  - Hooks especializados
  - Componentes Gantt básicos
  - Sistema de alertas y monitoreo
  - Integración con router principal
  
  🚧 **En Desarrollo (Paso 8):**
  - Analytics avanzados
  - Reportes de performance
  - Optimizaciones de IA
  - Integraciones empresariales
  
  📋 **Próximos Pasos:**
  - Testing de componentes Gantt
  - Optimización de performance
  - Documentación de API
  - Guías de usuario
  
  ## Notas de Desarrollo
  
  ### Principios de Diseño
  1. **Integración Natural:** Flujo continuo entre presupuestos y cronogramas
  2. **Simplicidad Funcional:** Interfaces complejas pero intuitivas
  3. **Performance First:** Optimización para grandes volúmenes de datos
  4. **Mobile Ready:** Funcionalidad completa en dispositivos móviles
  
  ### Compatibilidad
  - Compatible con todos los módulos existentes
  - Integración sin interrupciones con el workflow actual
  - Rutas legacy soportadas para migración gradual
  
  ### Consideraciones Futuras
  - Integración con sistemas ERP externos
  - Sincronización con Microsoft Project
  - APIs para integraciones terceros
  - Análisis predictivo con machine learning
  `;
