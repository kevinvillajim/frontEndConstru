// src/ui/pages/calculations/budget/CalculationBudgetRouter.tsx

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Importar componentes principales (se implementarán después)
import CalculationBudgetMain from "./CalculationBudgetMain";
import BudgetGenerator from "./BudgetGenerator";
import BudgetComparison from "./BudgetComparison";
// import BudgetSettings from "./BudgetSettings";
// import BudgetHistory from "./BudgetHistory";
// import BudgetTemplateManager from "./BudgetTemplateManager";
// import BudgetExportCenter from "./BudgetExportCenter";

const CalculationBudgetRouter: React.FC = () => {
  return (
    <Routes>
      {/* ==============================================
          PÁGINA PRINCIPAL - DASHBOARD DE PRESUPUESTOS
          ============================================== */}
      <Route index element={<CalculationBudgetMain />} />
      <Route path="" element={<CalculationBudgetMain />} />

      {/* ==============================================
          GENERADOR DE PRESUPUESTOS - WIZARD
          ============================================== */}
      <Route path="generator" element={<BudgetGenerator />} />
      <Route 
        path="generator/:calculationResultId" 
        element={<BudgetGenerator />} 
      />
      <Route 
        path="generator/from-template/:templateId" 
        element={<BudgetGenerator />} 
      />

      {/* ==============================================
          GESTIÓN DE PLANTILLAS
          ============================================== */}
      {/* <Route path="templates" element={<BudgetTemplateManager />} />
      <Route path="templates/create" element={<BudgetTemplateManager />} />
      <Route 
        path="templates/edit/:templateId" 
        element={<BudgetTemplateManager />} 
      />
      <Route 
        path="templates/duplicate/:templateId" 
        element={<BudgetTemplateManager />} 
      /> */}

      {/* ==============================================
          HISTORIAL Y GESTIÓN DE PRESUPUESTOS
          ============================================== */}
      {/* <Route path="history" element={<BudgetHistory />} />
      <Route path="history/:budgetId" element={<BudgetHistory />} /> */}
      <Route path="history/:budgetId/edit" element={<BudgetGenerator />} />
      {/* <Route path="history/:budgetId/versions" element={<BudgetHistory />} /> */}

      {/* ==============================================
          COMPARACIÓN DE PRESUPUESTOS
          ============================================== */}
      <Route path="comparison" element={<BudgetComparison />} />
      <Route 
        path="comparison/:comparisonId" 
        element={<BudgetComparison />} 
      />
      <Route 
        path="comparison/new" 
        element={<BudgetComparison />} 
      />

      {/* ==============================================
          CENTRO DE EXPORTACIÓN
          ============================================== */}
      {/* <Route path="export" element={<BudgetExportCenter />} /> */}
      {/* <Route 
        path="export/:budgetId" 
        element={<BudgetExportCenter />} 
      /> */}

      {/* ==============================================
          CONFIGURACIÓN Y AJUSTES
          ============================================== */}
      {/* <Route path="settings" element={<BudgetSettings />} />
      <Route path="settings/templates" element={<BudgetSettings />} />
      <Route path="settings/branding" element={<BudgetSettings />} />
      <Route path="settings/regional" element={<BudgetSettings />} /> */}

      {/* ==============================================
          RUTAS DE INTEGRACIÓN CON OTROS MÓDULOS
          ============================================== */}
      {/* Crear presupuesto desde cálculo específico */}
      <Route 
        path="from-calculation/:calculationResultId" 
        element={<Navigate to="/calculations/budget/generator" replace />} 
      />
      
      {/* Crear presupuesto para proyecto específico */}
      <Route 
        path="for-project/:projectId" 
        element={<Navigate to="/calculations/budget/generator" replace />} 
      />

      {/* ==============================================
          REDIRECCIONES Y RUTAS DE FALLBACK
          ============================================== */}
      {/* Redirección de rutas legacy */}
      <Route 
        path="main" 
        element={<Navigate to="/calculations/budget" replace />} 
      />
      <Route 
        path="hub" 
        element={<Navigate to="/calculations/budget" replace />} 
      />
      <Route 
        path="create" 
        element={<Navigate to="/calculations/budget/generator" replace />} 
      />

      {/* Fallback para rutas no encontradas */}
      <Route 
        path="*" 
        element={<Navigate to="/calculations/budget" replace />} 
      />
    </Routes>
  );
};

export default CalculationBudgetRouter;