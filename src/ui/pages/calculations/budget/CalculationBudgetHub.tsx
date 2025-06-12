// src/ui/pages/calculations/budget/CalculationBudgetHub.tsx

import React from "react";
import { useLocation } from "react-router-dom";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import CalculationBudgetRouter from "./CalculationBudgetRouter";

const CalculationBudgetHub: React.FC = () => {
  const location = useLocation();

  // Solo mostrar breadcrumb si no estamos en la página principal
  const showBreadcrumb =
    location.pathname !== "/calculations/budget" &&
    location.pathname !== "/calculations/budget/";

  const renderBreadcrumb = () => {
    if (!showBreadcrumb) return null;

    // Determinar el nombre de la sección actual
    const path = location.pathname;
    let sectionName = "Presupuestos";

    if (path.includes("/generator")) {
      sectionName = "Generador";
    } else if (path.includes("/templates")) {
      sectionName = "Plantillas";
    } else if (path.includes("/comparison")) {
      sectionName = "Comparación";
    } else if (path.includes("/settings")) {
      sectionName = "Configuración";
    } else if (path.includes("/history")) {
      sectionName = "Historial";
    } else if (path.includes("/export")) {
      sectionName = "Exportar";
    }

    return (
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center text-sm">
            <div className="flex items-center gap-2">
              <CurrencyDollarIcon className="h-4 w-4 text-emerald-600" />
              <span className="text-gray-500">Cálculos</span>
            </div>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-500">Presupuestos</span>
            {sectionName !== "Presupuestos" && (
              <>
                <span className="mx-2 text-gray-400">/</span>
                <span className="font-medium text-gray-900">{sectionName}</span>
              </>
            )}
          </nav>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderBreadcrumb()}

      {/* Contenido principal manejado por el router */}
      <CalculationBudgetRouter />
    </div>
  );
};

export default CalculationBudgetHub;