// src/ui/pages/calculations/materials/MaterialCalculationsHub.tsx
import React from "react";
import {useLocation} from "react-router-dom";
import {BeakerIcon} from "@heroicons/react/24/outline";
import MaterialCalculationsRouter from "./MaterialCalculationsRouter";

const MaterialCalculationsHub: React.FC = () => {
	const location = useLocation();

	// Solo mostrar breadcrumb si no estamos en la página principal
	const showBreadcrumb =
		location.pathname !== "/calculations/materials" &&
		location.pathname !== "/calculations/materials/";

	const renderBreadcrumb = () => {
		if (!showBreadcrumb) return null;

		// Determinar el nombre de la sección actual
		const path = location.pathname;
		let sectionName = "Materiales";

		if (path.includes("/catalog")) {
			sectionName = "Catálogo";
		} else if (path.includes("/templates")) {
			sectionName = "Mis Plantillas";
		} else if (path.includes("/results")) {
			sectionName = "Historial";
		} else if (path.includes("/comparison")) {
			sectionName = "Comparación";
		} else if (path.includes("/trending") || path.includes("/analytics")) {
			sectionName = "Tendencias";
		} else if (path.includes("/interface")) {
			sectionName = "Calculadora";
		}

		return (
			<div className="bg-white border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
					<nav className="flex items-center text-sm">
						<div className="flex items-center gap-2">
							<BeakerIcon className="h-4 w-4 text-blue-600" />
							<span className="text-gray-500">Cálculos</span>
						</div>
						<span className="mx-2 text-gray-400">/</span>
						<span className="text-gray-500">Materiales</span>
						{sectionName !== "Materiales" && (
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
			<MaterialCalculationsRouter />
		</div>
	);
};

export default MaterialCalculationsHub;
