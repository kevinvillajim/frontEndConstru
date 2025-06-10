// src/ui/pages/calculations/materials/MaterialCalculationsRouter.tsx
import React from "react";
import {Routes, Route, Navigate} from "react-router-dom";

// Importar componentes principales
import MaterialCalculationsMain from "./MaterialCalculationsMain";
import MaterialCatalog from "./MaterialCatalog";
import MaterialCalculationInterface from "./MaterialCalculationInterface";
import MaterialTemplatesManager from "./MaterialTemplatesManager";
import MaterialResultsHistory from "./MaterialResultsHistory";
import MaterialCalculationComparison from "./MaterialCalculationComparison";
import MaterialTrendingAnalytics from "./MaterialTrendingAnalytics";

// Editor temporal hasta implementar el real
const MaterialTemplateEditor: React.FC = () => {
	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center">
			<div className="max-w-md mx-auto text-center bg-white rounded-xl p-8 border border-gray-200">
				<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
					<span className="text-2xl">🚧</span>
				</div>
				<h2 className="text-xl font-bold text-gray-900 mb-4">
					Editor en Desarrollo
				</h2>
				<p className="text-gray-600 mb-6">
					Próximamente podrás crear y editar plantillas personalizadas para
					cálculos de materiales.
				</p>
				<div className="space-y-4">
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
						<h3 className="font-medium text-blue-900 mb-2">
							Características que incluirá:
						</h3>
						<ul className="text-sm text-blue-800 space-y-1">
							<li>• Editor visual de parámetros de materiales</li>
							<li>• Validación de fórmulas JavaScript</li>
							<li>• Preview en tiempo real</li>
							<li>• Gestión de unidades de medida</li>
							<li>• Sistema de versionado</li>
							<li>• Factores de desperdicio configurables</li>
						</ul>
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
};

const MaterialCalculationsRouter: React.FC = () => {
	return (
		<Routes>
			{/* ==============================================
			    RUTA PRINCIPAL - HUB DE MATERIALES
			    ============================================== */}
			<Route index element={<MaterialCalculationsMain />} />

			{/* ==============================================
			    CATÁLOGO - PLANTILLAS PÚBLICAS
			    ============================================== */}
			<Route path="catalog" element={<MaterialCatalog />} />

			{/* Interfaz de cálculo específica con templateId */}
			<Route
				path="catalog/:templateId"
				element={<MaterialCalculationInterface />}
			/>
			<Route
				path="interface/:templateId"
				element={<MaterialCalculationInterface />}
			/>

			{/* ==============================================
			    MIS PLANTILLAS - GESTIÓN PERSONAL
			    ============================================== */}
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

			{/* ==============================================
			    HISTORIAL - RESULTADOS Y CÁLCULOS
			    ============================================== */}
			<Route path="results" element={<MaterialResultsHistory />} />
			<Route path="results/:resultId" element={<MaterialResultsHistory />} />

			{/* ==============================================
			    COMPARACIÓN - ANÁLISIS COMPARATIVO
			    ============================================== */}
			<Route path="comparison" element={<MaterialCalculationComparison />} />
			<Route
				path="comparison/:comparisonId"
				element={<MaterialCalculationComparison />}
			/>

			{/* ==============================================
			    TENDENCIAS - ANALYTICS Y ESTADÍSTICAS
			    ============================================== */}
			<Route path="trending" element={<MaterialTrendingAnalytics />} />
			<Route path="analytics" element={<MaterialTrendingAnalytics />} />

			{/* ==============================================
			    REDIRECCIONES Y RUTAS DE FALLBACK
			    ============================================== */}
			{/* Redirección de rutas legacy */}
			<Route
				path="main"
				element={<Navigate to="/calculations/materials" replace />}
			/>
			<Route
				path="hub"
				element={<Navigate to="/calculations/materials" replace />}
			/>

			{/* Fallback para rutas no encontradas */}
			<Route
				path="*"
				element={<Navigate to="/calculations/materials" replace />}
			/>
		</Routes>
	);
};

export default MaterialCalculationsRouter;
