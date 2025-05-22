import React from "react";
import { useNavigate } from "react-router-dom";
import {
	ArrowLeftIcon,
	SparklesIcon,
	ChevronRightIcon,
} from "@heroicons/react/24/outline";
import TemplateSelector from "./TemplateSelector";
import TemplateCustomizer from "./TemplateCustomizer";
import ProjectPreview from "./ProjectPreview";

import { useTemplateWizard } from "../../../hooks/useTemplateWizard";
import { useProjectTemplates } from "../../../hooks/useProjectTemplates";
import type { ProjectTemplate } from "../../../hooks/useProjectTemplates";

// Configuración de plantillas
import { PROJECT_TEMPLATES } from "../../../config/projectTemplatesConfig";

// Re-exportar el tipo para uso en otros componentes
export type { ProjectTemplate };

const ProjectTemplatesPage: React.FC = () => {
	const navigate = useNavigate();
	const {
		currentStep,
		selectedTemplate,
		customization,
		isAnimating,
		selectTemplate,
		updateCustomization,
		goBack,
		getStepInfo,
	} = useTemplateWizard();

	const { createProjectFromTemplate, isLoading } = useProjectTemplates();

	const handleTemplateSelect = (template: ProjectTemplate) => {
		selectTemplate(template);
	};

	const handleCustomizationComplete = (data: any) => {
		updateCustomization(data);
	};

	const handleCreateProject = async () => {
		if (!selectedTemplate || !customization) return;

		try {
			const result = await createProjectFromTemplate(
				selectedTemplate, 
				customization as any // Cast necesario por tipos parciales
			);
			
			// Navegar al proyecto creado o a la lista de proyectos
			navigate('/projects', {
				state: {
					message: `Proyecto "${customization.projectName}" creado exitosamente`,
					projectId: result.id
				}
			});
		} catch (error) {
			console.error('Error creating project:', error);
			// Aquí podrías mostrar un toast de error
		}
	};

	const handleBack = () => {
		if (currentStep === 'select') {
			navigate('/projects');
		} else {
			goBack();
		}
	};

	const getStepTitle = () => {
		const stepInfo = getStepInfo(currentStep);
		return stepInfo.title;
	};

	const getStepDescription = () => {
		const stepInfo = getStepInfo(currentStep);
		return stepInfo.description;
	};

	const getProgressSteps = () => ['select', 'customize', 'preview'] as const;

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-primary-50">
			{/* Header elegante */}
			<div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<button
								onClick={handleBack}
								className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-105"
								disabled={isLoading}
							>
								<ArrowLeftIcon className="h-5 w-5 text-gray-600" />
							</button>
							<div className="flex items-center gap-3">
								<div className="h-10 w-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
									<SparklesIcon className="h-5 w-5 text-white" />
								</div>
								<div>
									<h1 className="text-2xl font-bold text-gray-900 tracking-tight">
										{getStepTitle()}
									</h1>
									<p className="text-gray-600 text-sm">
										{getStepDescription()}
									</p>
								</div>
							</div>
						</div>

						{/* Progress indicator */}
						<div className="hidden md:flex items-center gap-3">
							{getProgressSteps().map((step, index) => {
								const isActive = step === currentStep;
								const isCompleted = getProgressSteps().indexOf(currentStep) > index;
								
								return (
									<div key={step} className="flex items-center">
										<div
											className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
												isActive
													? 'bg-primary-600 text-white scale-110'
													: isCompleted
													? 'bg-primary-100 text-primary-600'
													: 'bg-gray-200 text-gray-500'
											}`}
										>
											{index + 1}
										</div>
										{index < getProgressSteps().length - 1 && (
											<ChevronRightIcon className={`h-4 w-4 mx-2 transition-colors duration-300 ${
												isCompleted ? 'text-primary-600' : 'text-gray-400'
											}`} />
										)}
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>

			{/* Contenido principal con transiciones */}
			<div className={`transition-all duration-300 ${
				isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
			}`}>
				{currentStep === 'select' && (
					<TemplateSelector
						templates={PROJECT_TEMPLATES}
						onTemplateSelect={handleTemplateSelect}
					/>
				)}

				{currentStep === 'customize' && selectedTemplate && (
					<TemplateCustomizer
						template={selectedTemplate}
						onCustomizationComplete={handleCustomizationComplete}
						onBack={handleBack}
					/>
				)}

				{currentStep === 'preview' && selectedTemplate && (
					<ProjectPreview
						template={selectedTemplate}
						customization={customization as any}
						onCreateProject={handleCreateProject}
						onBack={handleBack}
					/>
				)}
			</div>

			{/* Loading overlay */}
			{isLoading && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
					<div className="bg-white rounded-xl p-8 flex flex-col items-center gap-4">
						<div className="animate-spin h-8 w-8 border-2 border-primary-600 border-t-transparent rounded-full"></div>
						<p className="text-gray-900 font-medium">Creando proyecto...</p>
					</div>
				</div>
			)}

			{/* Background decorativo arquitectónico */}
			<div className="fixed inset-0 pointer-events-none overflow-hidden opacity-5">
				<div className="absolute top-20 right-10 w-64 h-64">
					<svg viewBox="0 0 100 100" className="w-full h-full">
						<defs>
							<pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
								<path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
							</pattern>
						</defs>
						<rect width="100" height="100" fill="url(#grid)" />
						<rect x="20" y="20" width="60" height="40" fill="none" stroke="currentColor" strokeWidth="1"/>
						<line x1="20" y1="35" x2="80" y2="35" stroke="currentColor" strokeWidth="0.5"/>
					</svg>
				</div>
				<div className="absolute bottom-20 left-10 w-48 h-48 rotate-45 opacity-30">
					<div className="w-full h-full border-2 border-primary-300 transform rotate-12"></div>
				</div>
			</div>
		</div>
	);
};

export default ProjectTemplatesPage;