// src/ui/pages/calculations/materials/MaterialCalculationsRouter.tsx
import React from "react";
import {Routes, Route, Navigate} from "react-router-dom";

// Componentes principales
import MaterialCalculationsMain from "./MaterialCalculationsMain";
import MaterialCalculationInterface from "./MaterialCalculationInterface";
import MaterialTemplatesManager from "./MaterialTemplatesManager";
import MaterialCatalog from "./MaterialCatalog";
import MaterialResultsHistory from "./MaterialResultsHistory";
import MaterialCalculationComparison from "./MaterialCalculationComparison";
import MaterialTrendingAnalytics from "./MaterialTrendingAnalytics";

// Componente temporal para crear plantillas (se debería crear después)
const MaterialTemplateEditor: React.FC = () => {
	return (
		<div className="max-w-4xl mx-auto px-4 py-8">
			<div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
				<h2 className="text-2xl font-bold text-gray-900 mb-4">
					Editor de Plantillas de Materiales
				</h2>
				<p className="text-gray-600 mb-6">
					Esta funcionalidad está en desarrollo. Próximamente podrás crear y
					editar plantillas personalizadas para cálculos de materiales.
				</p>
				<div className="space-y-4">
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
						<h3 className="font-medium text-blue-900 mb-2">
							Características que incluirá:
						</h3>
						<ul className="text-sm text-blue-800 space-y-1">
							<li>• Editor visual de parámetros</li>
							<li>• Validación de fórmulas JavaScript</li>
							<li>• Preview en tiempo real</li>
							<li>• Gestión de unidades de medida</li>
							<li>• Sistema de versionado</li>
						</ul>
					</div>
				</div>
				<button
					onClick={() => window.history.back()}
					className="mt-6 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
				>
					Volver
				</button>
			</div>
		</div>
	);
};

const MaterialCalculationsRouter: React.FC = () => {
	return (
		<Routes>
			{/* Ruta principal - Hub de materiales */}
			<Route index element={<MaterialCalculationsMain />} />

			{/* Catálogo de plantillas públicas */}
			<Route path="catalog" element={<MaterialCatalog />} />

			{/* Interfaz de cálculo específica */}
			<Route
				path="interface/:templateId"
				element={<MaterialCalculationInterface />}
			/>

			{/* Gestión de plantillas personales */}
			<Route path="templates" element={<MaterialTemplatesManager />} />
			<Route path="templates/create" element={<MaterialTemplateEditor />} />
			<Route
				path="templates/edit/:templateId"
				element={<MaterialTemplateEditor />}
			/>
			<Route
				path="templates/duplicate/:templateId"
				element={<MaterialTemplateEditor />}
			/>

			{/* Historial de resultados */}
			<Route path="results" element={<MaterialResultsHistory />} />
			<Route path="results/:resultId" element={<MaterialResultsHistory />} />

			{/* Comparación de cálculos */}
			<Route path="comparison" element={<MaterialCalculationComparison />} />
			<Route
				path="comparison/:comparisonId"
				element={<MaterialCalculationComparison />}
			/>

			{/* Analytics y tendencias */}
			<Route path="trending" element={<MaterialTrendingAnalytics />} />
			<Route path="analytics" element={<MaterialTrendingAnalytics />} />

			{/* Redirección por defecto */}
			<Route
				path="*"
				element={<Navigate to="/calculations/materials" replace />}
			/>
		</Routes>
	);
};

export default MaterialCalculationsRouter;
