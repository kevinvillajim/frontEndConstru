// src/ui/pages/calculations/schedule/CalculationScheduleRouter.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Import main schedule components
import CalculationScheduleHub from "./CalculationScheduleHub";
import ScheduleGenerator from "./ScheduleGenerator";
import ScheduleGanttView from "./ScheduleGanttView";
import ScheduleResourceView from "./ScheduleResourceView";
import ProgressTracker from "./ProgressTracker";
import ScheduleOptimizer from "./ScheduleOptimizer";
import CriticalPathView from "./CriticalPathView";
import WhatIfAnalyzer from "./WhatIfAnalyzer";

// Import integration components (already created in step 8)
import BudgetScheduleWorkspace from "../integration/BudgetScheduleWorkspace";
import ScheduleAnalyticsDashboard from "./ScheduleAnalyticsDashboard";

// Temporary placeholder components until implementation
const PlaceholderComponent: React.FC<{ title: string; description: string; route: string }> = ({ title, description, route }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="max-w-md mx-auto text-center bg-white rounded-xl p-8 border border-gray-200">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl">🚧</span>
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
      <p className="text-gray-600 mb-6">{description}</p>
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">Ruta:</h3>
          <code className="text-sm text-blue-800">{route}</code>
        </div>
      </div>
      <button
        onClick={() => window.history.back()}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Volver
      </button>
    </div>
  </div>
);

const ScheduleTemplates: React.FC = () => (
  <PlaceholderComponent
    title="Templates de Cronograma"
    description="Gestión de plantillas de cronograma personalizadas y verificadas"
    route="/calculations/schedule/templates"
  />
);

const ScheduleReports: React.FC = () => (
  <PlaceholderComponent
    title="Reportes de Cronograma"
    description="Generación de reportes de performance y avance de cronogramas"
    route="/calculations/schedule/reports"
  />
);

const ScheduleSettings: React.FC = () => (
  <PlaceholderComponent
    title="Configuración de Cronogramas"
    description="Configuraciones globales para cronogramas y optimización"
    route="/calculations/schedule/settings"
  />
);

const CalculationScheduleRouter: React.FC = () => {
  return (
    <Routes>
      {/* ==============================================
          RUTA PRINCIPAL - HUB DE CRONOGRAMAS
          ============================================== */}
      <Route index element={<CalculationScheduleHub />} />

      {/* ==============================================
          GENERACIÓN - WIZARD DE CREACIÓN
          ============================================== */}
      <Route path="generator" element={<ScheduleGenerator />} />
      <Route path="generator/:budgetId" element={<ScheduleGenerator />} />

      {/* ==============================================
          VISUALIZACIÓN - VISTAS PRINCIPALES
          ============================================== */}
      <Route path="gantt" element={<ScheduleGanttView />} />
      <Route path="gantt/:scheduleId" element={<ScheduleGanttView />} />
      
      <Route path="resources" element={<ScheduleResourceView />} />
      <Route path="resources/:scheduleId" element={<ScheduleResourceView />} />

      {/* ==============================================
          SEGUIMIENTO - TRACKING Y PROGRESO
          ============================================== */}
      <Route path="tracking" element={<ProgressTracker />} />
      <Route path="tracking/:scheduleId" element={<ProgressTracker />} />
      
      {/* ==============================================
          ANÁLISIS - HERRAMIENTAS AVANZADAS
          ============================================== */}
      <Route path="analytics" element={<ScheduleAnalyticsDashboard />} />
      <Route path="analytics/:scheduleId" element={<ScheduleAnalyticsDashboard />} />
      
      <Route path="optimizer" element={<ScheduleOptimizer />} />
      <Route path="optimizer/:scheduleId" element={<ScheduleOptimizer />} />
      
      <Route path="critical-path" element={<CriticalPathView />} />
      <Route path="critical-path/:scheduleId" element={<CriticalPathView />} />
      
      <Route path="what-if" element={<WhatIfAnalyzer />} />
      <Route path="what-if/:scheduleId" element={<WhatIfAnalyzer />} />

      {/* ==============================================
          INTEGRACIÓN - WORKSPACE COMBINADO
          ============================================== */}
      <Route path="integration" element={<BudgetScheduleWorkspace />} />
      <Route path="integration/:projectId" element={<BudgetScheduleWorkspace />} />

      {/* ==============================================
          GESTIÓN - TEMPLATES Y CONFIGURACIÓN
          ============================================== */}
      <Route path="templates" element={<ScheduleTemplates />} />
      <Route path="templates/:templateId" element={<ScheduleTemplates />} />
      
      <Route path="reports" element={<ScheduleReports />} />
      <Route path="settings" element={<ScheduleSettings />} />

      {/* ==============================================
          PROYECTOS - VISTA POR PROYECTO
          ============================================== */}
      <Route path="projects" element={<CalculationScheduleHub />} />
      <Route path="projects/:projectId" element={<ScheduleGanttView />} />

      {/* ==============================================
          REDIRECCIONES Y RUTAS LEGACY
          ============================================== */}
      <Route path="main" element={<Navigate to="/calculations/schedule" replace />} />
      <Route path="hub" element={<Navigate to="/calculations/schedule" replace />} />
      <Route path="dashboard" element={<Navigate to="/calculations/schedule/analytics" replace />} />

      {/* ==============================================
          FALLBACK - RUTA NO ENCONTRADA
          ============================================== */}
      <Route 
        path="*" 
        element={<Navigate to="/calculations/schedule" replace />} 
      />
    </Routes>
  );
};

export default CalculationScheduleRouter;