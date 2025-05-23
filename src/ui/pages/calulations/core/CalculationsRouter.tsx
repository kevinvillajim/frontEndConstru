// src/ui/pages/calculations/core/CalculationsRouter.tsx
import React, {useState} from "react";
import {
	CalculatorIcon,
	FolderIcon,
	ChartBarIcon,
	SparklesIcon,
	HomeIcon,
} from "@heroicons/react/24/outline";
import CalculationsHub from "./CalculationsHub";
import type {NavigationItem} from "../shared/types/calculation.types";

// Importar componentes de las diferentes secciones (temporal para estructura)
// import CalculationsCatalog from "../catalog/CalculationsCatalog";
// import MyTemplates from "../templates/MyTemplates";
// import CalculationComparison from "../comparison/CalculationComparison";
// import CollaborationHub from "../collaboration/CollaborationHub";

type ViewType =
	| "hub"
	| "catalog"
	| "templates"
	| "comparison"
	| "collaboration";

interface NavigationState {
	currentView: ViewType;
	previousView?: ViewType;
	context?: Record<string, any>;
}

const CalculationsRouter: React.FC = () => {
	const [navigation, setNavigation] = useState<NavigationState>({
		currentView: "hub",
	});

	// Elementos de navegación principales
	const navigationItems: NavigationItem[] = [
		{
			id: "hub",
			name: "Inicio",
			description: "Centro principal de cálculos",
			icon: HomeIcon,
			route: "/calculations",
		},
		{
			id: "catalog",
			name: "Catálogo",
			description: "Plantillas verificadas",
			icon: CalculatorIcon,
			route: "/calculations/catalog",
		},
		{
			id: "templates",
			name: "Mis Plantillas",
			description: "Plantillas personales",
			icon: FolderIcon,
			route: "/calculations/templates",
		},
		{
			id: "comparison",
			name: "Comparar",
			description: "Análisis comparativo",
			icon: ChartBarIcon,
			route: "/calculations/comparison",
		},
		{
			id: "collaboration",
			name: "Colaboración",
			description: "Espacio colaborativo",
			icon: SparklesIcon,
			route: "/calculations/collaboration",
		},
	];

	// Navegación entre vistas
	const navigateToView = (view: ViewType, context?: Record<string, any>) => {
		setNavigation({
			currentView: view,
			previousView: navigation.currentView,
			context,
		});
	};

	// Volver a la vista anterior
	const goBack = () => {
		if (navigation.previousView) {
			navigateToView(navigation.previousView);
		} else {
			navigateToView("hub");
		}
	};

	// Renderizar la vista actual
	const renderCurrentView = () => {
		switch (navigation.currentView) {
			case "hub":
				return <CalculationsHub />;

			case "catalog":
				// Componente temporal mientras se implementa
				return (
					<div className="min-h-screen bg-gray-50 flex items-center justify-center">
						<div className="text-center">
							<CalculatorIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
							<h2 className="text-2xl font-bold text-gray-900 mb-2">
								Catálogo de Plantillas
							</h2>
							<p className="text-gray-600 mb-6">
								Próximamente: Plantillas verificadas y aprobadas por la
								comunidad
							</p>
							<button
								onClick={() => navigateToView("hub")}
								className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
							>
								Volver al Inicio
							</button>
						</div>
					</div>
				);
			// return <CalculationsCatalog onNavigate={navigateToView} />;

			case "templates":
				return (
					<div className="min-h-screen bg-gray-50 flex items-center justify-center">
						<div className="text-center">
							<FolderIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
							<h2 className="text-2xl font-bold text-gray-900 mb-2">
								Mis Plantillas
							</h2>
							<p className="text-gray-600 mb-6">
								Próximamente: Gestión de plantillas personalizadas
							</p>
							<button
								onClick={() => navigateToView("hub")}
								className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
							>
								Volver al Inicio
							</button>
						</div>
					</div>
				);
			// return <MyTemplates onNavigate={navigateToView} />;

			case "comparison":
				return (
					<div className="min-h-screen bg-gray-50 flex items-center justify-center">
						<div className="text-center">
							<ChartBarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
							<h2 className="text-2xl font-bold text-gray-900 mb-2">
								Comparar Cálculos
							</h2>
							<p className="text-gray-600 mb-6">
								Próximamente: Análisis comparativo de cálculos guardados
							</p>
							<button
								onClick={() => navigateToView("hub")}
								className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
							>
								Volver al Inicio
							</button>
						</div>
					</div>
				);
			// return <CalculationComparison onNavigate={navigateToView} />;

			case "collaboration":
				return (
					<div className="min-h-screen bg-gray-50 flex items-center justify-center">
						<div className="text-center">
							<SparklesIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
							<h2 className="text-2xl font-bold text-gray-900 mb-2">
								Colaboración
							</h2>
							<p className="text-gray-600 mb-6">
								Próximamente: Espacio colaborativo y cálculos en tendencia
							</p>
							<button
								onClick={() => navigateToView("hub")}
								className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
							>
								Volver al Inicio
							</button>
						</div>
					</div>
				);
			// return <CollaborationHub onNavigate={navigateToView} />;

			default:
				return <CalculationsHub />;
		}
	};

	// Si estamos en el hub, mostrar sin navegación adicional
	if (navigation.currentView === "hub") {
		return renderCurrentView();
	}

	// Para otras vistas, mostrar con navegación
	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header de navegación */}
			<div className="bg-white border-b border-gray-200 sticky top-0 z-40">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg">
								<CalculatorIcon className="h-6 w-6 text-white" />
							</div>
							<div>
								<h1 className="text-xl font-bold text-gray-900">
									Cálculos Técnicos
								</h1>
								<p className="text-sm text-gray-600">
									Herramientas profesionales de cálculo
								</p>
							</div>
						</div>

						{/* Navegación principal */}
						<div className="flex items-center gap-2">
							{navigationItems.map((item) => (
								<button
									key={item.id}
									onClick={() => navigateToView(item.id as ViewType)}
									className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
										navigation.currentView === item.id
											? "bg-primary-100 text-primary-700 border border-primary-200"
											: "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
									}`}
								>
									<item.icon className="h-4 w-4" />
									<span className="hidden md:inline">{item.name}</span>
								</button>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Breadcrumb */}
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
				<div className="flex items-center gap-2 text-sm text-gray-600">
					<button
						onClick={() => navigateToView("hub")}
						className="hover:text-gray-900 transition-colors"
					>
						Cálculos Técnicos
					</button>
					<span>/</span>
					<span className="text-gray-900 font-medium">
						{
							navigationItems.find((item) => item.id === navigation.currentView)
								?.name
						}
					</span>
				</div>
			</div>

			{/* Contenido Principal */}
			<div>{renderCurrentView()}</div>
		</div>
	);
};

export default CalculationsRouter;
