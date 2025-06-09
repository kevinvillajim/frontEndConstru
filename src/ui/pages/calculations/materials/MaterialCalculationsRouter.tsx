// src/ui/pages/calculations/materials/MaterialCalculationsRouter.tsx

import React, {useState} from "react";
import type {
	MaterialCalculationTemplate,
	MaterialCalculationResult,
} from "../shared/types/material.types";
import MaterialCalculationsHub from "./MaterialCalculationsHub";
import MaterialCatalog from "./MaterialCatalog";
import MaterialCalculationInterface from "./MaterialCalculationInterface";
import MaterialTemplatesManager from "./MaterialTemplatesManager";
import MaterialTrendingAnalytics from "./MaterialTrendingAnalytics";
import MaterialResultsHistory from "./MaterialResultsHistory";

import MaterialCalculationComparison from "./MaterialCalculationComparison";

type ViewState =
	| {type: "hub"}
	| {type: "catalog"; selectedCategory?: string}
	| {type: "calculator"; template: MaterialCalculationTemplate}
	| {type: "result"; result: MaterialCalculationResult}
	| {type: "templates"}
	| {type: "trending"}
	| {type: "results"}
	| {type: "comparison"}
	| {type: "settings"};

const MaterialCalculationsRouter: React.FC = () => {
	const [viewState, setViewState] = useState<ViewState>({type: "hub"});
	const [navigationHistory, setNavigationHistory] = useState<ViewState[]>([]);

	const navigate = (newState: ViewState, addToHistory: boolean = true) => {
		if (addToHistory) {
			setNavigationHistory((prev) => [...prev, viewState]);
		}
		setViewState(newState);
	};

	const goBack = () => {
		if (navigationHistory.length > 0) {
			const previousState = navigationHistory[navigationHistory.length - 1];
			setNavigationHistory((prev) => prev.slice(0, -1));
			setViewState(previousState);
		} else {
			setViewState({type: "hub"});
		}
	};

	const handleTemplateSelect = (template: MaterialCalculationTemplate) => {
		navigate({type: "calculator", template});
	};

	const handleCalculationResult = (result: MaterialCalculationResult) => {
		navigate({type: "result", result});
	};

	const handleTemplateSelectById = (templateId: string) => {
		// En una implementación real, aquí cargarías la plantilla por ID
		console.log("Loading template:", templateId);
		// navigate({ type: 'calculator', template: loadedTemplate });
	};

	const BreadcrumbNavigation: React.FC = () => {
		const getBreadcrumbs = (): {label: string; onClick?: () => void}[] => {
			const breadcrumbs = [
				{
					label: "Cálculos de Materiales",
					onClick: () => navigate({type: "hub"}, false),
				},
			];

			switch (viewState.type) {
				case "catalog":
					breadcrumbs.push({label: "Catálogo de Plantillas"});
					break;
				case "calculator":
					breadcrumbs.push(
						{
							label: "Catálogo",
							onClick: () => navigate({type: "catalog"}, false),
						},
						{label: viewState.template.name}
					);
					break;
				case "result":
					breadcrumbs.push({label: "Resultado del Cálculo"});
					break;
				case "templates":
					breadcrumbs.push({label: "Mis Plantillas"});
					break;
				case "trending":
					breadcrumbs.push({label: "Tendencias y Analytics"});
					break;
				case "results":
					breadcrumbs.push({label: "Historial de Resultados"});
					break;
				case "comparison":
					breadcrumbs.push({label: "Comparador de Cálculos"});
					break;
				case "settings":
					breadcrumbs.push({label: "Configuración"});
					break;
			}

			return breadcrumbs;
		};

		const breadcrumbs = getBreadcrumbs();

		if (breadcrumbs.length <= 1) return null;

		return (
			<nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
				{breadcrumbs.map((crumb, index) => (
					<React.Fragment key={index}>
						{index > 0 && (
							<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
								<path
									fillRule="evenodd"
									d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
									clipRule="evenodd"
								/>
							</svg>
						)}
						<button
							onClick={crumb.onClick}
							className={`
                ${
									crumb.onClick
										? "hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
										: "text-gray-900 dark:text-white font-medium cursor-default"
								}
              `}
						>
							{crumb.label}
						</button>
					</React.Fragment>
				))}
			</nav>
		);
	};

	const QuickActionBar: React.FC = () => {
		if (viewState.type === "hub") return null;

		const getQuickActions = () => {
			switch (viewState.type) {
				case "catalog":
					return [
						{
							label: "Crear Plantilla",
							icon: "📝",
							onClick: () => navigate({type: "templates"}),
							color: "bg-blue-600 hover:bg-blue-700",
						},
						{
							label: "Ver Tendencias",
							icon: "📈",
							onClick: () => navigate({type: "trending"}),
							color: "bg-purple-600 hover:bg-purple-700",
						},
					];
				case "calculator":
					return [
						{
							label: "Ver Resultados",
							icon: "📊",
							onClick: () => navigate({type: "results"}),
							color: "bg-green-600 hover:bg-green-700",
						},
					];
				case "result":
					return [
						{
							label: "Nuevo Cálculo",
							icon: "🧮",
							onClick: () => navigate({type: "catalog"}),
							color: "bg-blue-600 hover:bg-blue-700",
						},
						{
							label: "Ver Historial",
							icon: "📚",
							onClick: () => navigate({type: "results"}),
							color: "bg-gray-600 hover:bg-gray-700",
						},
					];
				default:
					return [];
			}
		};

		const actions = getQuickActions();
		if (actions.length === 0) return null;

		return (
			<div className="flex items-center space-x-3 mb-6">
				{actions.map((action, index) => (
					<button
						key={index}
						onClick={action.onClick}
						className={`
              px-4 py-2 ${action.color} text-white rounded-lg text-sm font-medium
              transition-colors flex items-center space-x-2
            `}
					>
						<span>{action.icon}</span>
						<span>{action.label}</span>
					</button>
				))}
			</div>
		);
	};

	const renderView = () => {
		switch (viewState.type) {
			case "hub":
				return (
					<MaterialCalculationsHub
						onNavigate={navigate}
						onTemplateSelect={handleTemplateSelect}
					/>
				);

			case "catalog":
				return (
					<MaterialCatalog
						onTemplateSelect={handleTemplateSelect}
						selectedCategory={viewState.selectedCategory}
					/>
				);

			case "calculator":
				return (
					<MaterialCalculationInterface
						template={viewState.template}
						onResult={handleCalculationResult}
						onBack={goBack}
					/>
				);

			case "result":
				return (
					<MaterialResultDisplay
						result={viewState.result}
						onNewCalculation={() => navigate({type: "catalog"})}
						onViewHistory={() => navigate({type: "results"})}
					/>
				);

			case "templates":
				return (
					<MaterialTemplatesManager onTemplateSelect={handleTemplateSelect} />
				);

			case "trending":
				return (
					<MaterialTrendingAnalytics
						onTemplateSelect={handleTemplateSelectById}
					/>
				);

			case "results":
				return (
					<MaterialResultsHistory
						onResultSelect={(result) => navigate({type: "result", result})}
						onTemplateSelect={handleTemplateSelectById}
					/>
				);

			case "comparison":
				return (
					<MaterialCalculationComparison
						onNewComparison={() => navigate({type: "comparison"})}
					/>
				);

			case "settings":
				return <MaterialCalculationSettings onBack={goBack} />;

			default:
				return <div>Vista no encontrada</div>;
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			<div className="max-w-7xl mx-auto px-4 py-6">
				<BreadcrumbNavigation />
				<QuickActionBar />
				{renderView()}
			</div>
		</div>
	);
};

// Componente para mostrar resultados (simplificado)
const MaterialResultDisplay: React.FC<{
	result: MaterialCalculationResult;
	onNewCalculation: () => void;
	onViewHistory: () => void;
}> = ({result, onNewCalculation, onViewHistory}) => {
	return (
		<div className="space-y-6">
			<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
				<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
					Resultado del Cálculo
				</h2>
				<p className="text-gray-600 dark:text-gray-300 mb-6">
					{result.templateName}
				</p>

				{/* Mostrar resultados aquí */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
					{Object.entries(result.results).map(([key, value]) => (
						<div
							key={key}
							className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
						>
							<div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
								{key}
							</div>
							<div className="text-xl font-semibold text-gray-900 dark:text-white">
								{typeof value === "number" ? value.toLocaleString() : value}
							</div>
						</div>
					))}
				</div>

				<div className="flex space-x-4">
					<button
						onClick={onNewCalculation}
						className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
					>
						Nuevo Cálculo
					</button>
					<button
						onClick={onViewHistory}
						className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
					>
						Ver Historial
					</button>
				</div>
			</div>
		</div>
	);
};

// Componente de configuración (simplificado)
const MaterialCalculationSettings: React.FC<{
	onBack: () => void;
}> = ({onBack}) => {
	return (
		<div className="space-y-6">
			<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
				<div className="flex items-center space-x-4 mb-6">
					<button
						onClick={onBack}
						className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
					>
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 19l-7-7 7-7"
							/>
						</svg>
					</button>
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
						Configuración de Cálculos
					</h2>
				</div>

				<div className="space-y-6">
					<div>
						<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
							Preferencias de Cálculo
						</h3>
						<div className="space-y-4">
							<label className="flex items-center space-x-3">
								<input
									type="checkbox"
									className="w-5 h-5 text-blue-600 rounded"
								/>
								<span className="text-gray-700 dark:text-gray-300">
									Incluir factor de desperdicio por defecto
								</span>
							</label>
							<label className="flex items-center space-x-3">
								<input
									type="checkbox"
									className="w-5 h-5 text-blue-600 rounded"
								/>
								<span className="text-gray-700 dark:text-gray-300">
									Guardar resultados automáticamente
								</span>
							</label>
							<label className="flex items-center space-x-3">
								<input
									type="checkbox"
									className="w-5 h-5 text-blue-600 rounded"
								/>
								<span className="text-gray-700 dark:text-gray-300">
									Mostrar vista previa antes de calcular
								</span>
							</label>
						</div>
					</div>

					<div>
						<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
							Unidades por Defecto
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Longitud
								</label>
								<select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg">
									<option>Metros (m)</option>
									<option>Centímetros (cm)</option>
									<option>Pies (ft)</option>
								</select>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Área
								</label>
								<select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg">
									<option>Metros cuadrados (m²)</option>
									<option>Pies cuadrados (ft²)</option>
								</select>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

// Componente de historial (simplificado)
const MaterialResultsHistory: React.FC<{
	onResultSelect: (result: MaterialCalculationResult) => void;
	onTemplateSelect: (templateId: string) => void;
}> = ({onResultSelect, onTemplateSelect}) => {
	return (
		<div className="space-y-6">
			<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
				<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
					Historial de Resultados
				</h2>

				<div className="text-center py-20">
					<div className="text-6xl mb-4">📊</div>
					<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
						Historial de Cálculos
					</h3>
					<p className="text-gray-600 dark:text-gray-300">
						Aquí aparecerán tus cálculos anteriores
					</p>
				</div>
			</div>
		</div>
	);
};

export default MaterialCalculationsRouter;
