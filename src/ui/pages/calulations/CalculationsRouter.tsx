import React, {useState} from "react";
import {
	CalculatorIcon,
	DocumentTextIcon,
	FolderIcon,
	SparklesIcon,
} from "@heroicons/react/24/outline";
import CalculationsCatalog from "./CalculationsCatalog";
import MyTemplates from "./templates/MyTemplates";
import SavedCalculations from "./SavedCalculations";
import CalculationInterface from "./catalog/CalculationInterface";
import TemplateEditor from "./templates/TemplateEditor";
import SuggestTemplateChange from "./SuggestTemplateChange";

// Tipos para navegación
interface CalculationTemplate {
	id: string;
	name: string;
	description: string;
	category: string;
	subcategory: string;
	profession: string[];
	difficulty: "basic" | "intermediate" | "advanced";
	estimatedTime: string;
	necReference: string;
	verified: boolean;
	rating: number;
	usageCount: number;
	isFavorite: boolean;
	isNew: boolean;
	tags: string[];
	lastUpdated: string;
	requirements: string[];
	isPublic?: boolean;
	createdBy?: string;
}

type ViewType =
	| "catalog"
	| "my-templates"
	| "saved-calculations"
	| "template-interface"
	| "template-editor"
	| "suggest-change";

interface NavigationState {
	currentView: ViewType;
	selectedTemplate?: CalculationTemplate;
	editingTemplate?: CalculationTemplate;
	suggestingTemplate?: CalculationTemplate;
}

const CalculationsRouter: React.FC = () => {
	const [navigation, setNavigation] = useState<NavigationState>({
		currentView: "catalog",
	});

	// Navegación entre vistas
	const navigateToView = (
		view: ViewType,
		options?: {
			template?: CalculationTemplate;
			editMode?: boolean;
		}
	) => {
		setNavigation({
			currentView: view,
			selectedTemplate: options?.template,
			editingTemplate: options?.editMode ? options.template : undefined,
			suggestingTemplate:
				view === "suggest-change" ? options?.template : undefined,
		});
	};

	// Manejar selección de plantilla para usar
	const handleSelectTemplate = (template: CalculationTemplate) => {
		navigateToView("template-interface", {template});
	};

	// Manejar edición de plantilla
	const handleEditTemplate = (template: CalculationTemplate) => {
		navigateToView("template-editor", {template, editMode: true});
	};

	// Manejar sugerencia de cambio
	const handleSuggestChange = (template: CalculationTemplate) => {
		navigateToView("suggest-change", {template});
	};

	// Volver al catálogo
	const handleBackToCatalog = () => {
		navigateToView("catalog");
	};

	// Volver a mis plantillas
	const handleBackToMyTemplates = () => {
		navigateToView("my-templates");
	};

	// Crear nueva plantilla
	const handleCreateNewTemplate = () => {
		navigateToView("template-editor");
	};

	// Navegación principal
	const navigationItems = [
		{
			id: "catalog",
			name: "Catálogo de Plantillas",
			icon: CalculatorIcon,
			description: "Plantillas verificadas y colaborativas",
		},
		{
			id: "my-templates",
			name: "Mis Plantillas",
			icon: FolderIcon,
			description: "Plantillas personalizadas creadas por ti",
		},
		{
			id: "saved-calculations",
			name: "Cálculos Guardados",
			icon: DocumentTextIcon,
			description: "Historial de cálculos realizados",
		},
	];

	const renderCurrentView = () => {
		switch (navigation.currentView) {
			case "catalog":
				return (
					<CalculationsCatalog
						onSelectTemplate={handleSelectTemplate}
						onSuggestChange={handleSuggestChange}
					/>
				);

			case "my-templates":
				return (
					<MyTemplates
						onEditTemplate={handleEditTemplate}
						onSelectTemplate={handleSelectTemplate}
						onCreateNew={handleCreateNewTemplate}
					/>
				);

			case "saved-calculations":
				return <SavedCalculations onSelectTemplate={handleSelectTemplate} />;

			case "template-interface":
				return (
					<CalculationInterface
						template={navigation.selectedTemplate!}
						onBack={handleBackToCatalog}
						onSuggestChange={handleSuggestChange}
					/>
				);

			case "template-editor":
				return (
					<TemplateEditor
						template={navigation.editingTemplate}
						onSave={(template) => {
							console.log("Template saved:", template);
							navigateToView("my-templates");
						}}
						onCancel={handleBackToMyTemplates}
					/>
				);

			case "suggest-change":
				return (
					<SuggestTemplateChange
						template={navigation.suggestingTemplate!}
						onSubmit={(suggestion) => {
							console.log("Suggestion submitted:", suggestion);
							handleBackToCatalog();
						}}
						onCancel={handleBackToCatalog}
					/>
				);

			default:
				return <CalculationsCatalog onSelectTemplate={handleSelectTemplate} />;
		}
	};

	// Si estamos en una vista específica (no navegación principal), renderizar directamente
	if (
		["template-interface", "template-editor", "suggest-change"].includes(
			navigation.currentView
		)
	) {
		return <div className="min-h-screen bg-gray-50">{renderCurrentView()}</div>;
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header Principal */}
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

						{/* Navegación secundaria */}
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
					<span>Cálculos Técnicos</span>
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
