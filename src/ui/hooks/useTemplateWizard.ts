// src/ui/hooks/useTemplateWizard.ts
import { useState, useCallback } from "react";
import type { ProjectTemplate, TemplateCustomization } from "./useProjectTemplates";

type WizardStep = 'select' | 'customize' | 'preview';

interface WizardState {
	currentStep: WizardStep;
	selectedTemplate: ProjectTemplate | null;
	customization: Partial<TemplateCustomization>;
	isAnimating: boolean;
}

export const useTemplateWizard = () => {
	const [state, setState] = useState<WizardState>({
		currentStep: 'select',
		selectedTemplate: null,
		customization: {},
		isAnimating: false,
	});

	const setIsAnimating = useCallback((isAnimating: boolean) => {
		setState(prev => ({ ...prev, isAnimating }));
	}, []);

	const setCurrentStep = useCallback((currentStep: WizardStep) => {
		setState(prev => ({ ...prev, currentStep }));
	}, []);

	const setSelectedTemplate = useCallback((selectedTemplate: ProjectTemplate | null) => {
		setState(prev => ({ ...prev, selectedTemplate }));
	}, []);

	const setCustomization = useCallback((customization: Partial<TemplateCustomization>) => {
		setState(prev => ({ ...prev, customization }));
	}, []);

	const handleStepTransition = useCallback((newStep: WizardStep) => {
		setState(prev => ({ ...prev, isAnimating: true }));
		
		setTimeout(() => {
			setState(prev => ({ 
				...prev, 
				currentStep: newStep, 
				isAnimating: false 
			}));
		}, 300);
	}, []);

	const selectTemplate = useCallback((template: ProjectTemplate) => {
		setState(prev => ({ 
			...prev, 
			selectedTemplate: template,
			customization: {
				selectedPhases: [...template.defaultSettings.phases],
				selectedMaterials: [...template.defaultSettings.materials],
				selectedFormulas: [...template.defaultSettings.formulas],
				selectedTeamRoles: [...template.defaultSettings.teamRoles],
				additionalFeatures: [],
				priority: 'medium' as const,
				teamSize: 5,
			}
		}));
		handleStepTransition('customize');
	}, [handleStepTransition]);

	const updateCustomization = useCallback((data: Partial<TemplateCustomization>) => {
		setState(prev => ({
			...prev,
			customization: { ...prev.customization, ...data }
		}));
		handleStepTransition('preview');
	}, [handleStepTransition]);

	const goBack = useCallback(() => {
		const { currentStep } = state;
		if (currentStep === 'customize') {
			handleStepTransition('select');
		} else if (currentStep === 'preview') {
			handleStepTransition('customize');
		}
	}, [state.currentStep, handleStepTransition]);

	const reset = useCallback(() => {
		setState({
			currentStep: 'select',
			selectedTemplate: null,
			customization: {},
			isAnimating: false,
		});
	}, []);

	const getStepInfo = useCallback((step: WizardStep) => {
		const stepInfo = {
			select: {
				title: 'Elige tu Plantilla',
				description: 'Selecciona el tipo de proyecto que mejor se adapte a tus necesidades',
			},
			customize: {
				title: 'Personaliza tu Proyecto', 
				description: 'Ajusta los detalles específicos para tu proyecto',
			},
			preview: {
				title: 'Confirma y Crea',
				description: 'Revisa todos los detalles antes de crear tu proyecto',
			},
		};

		return stepInfo[step];
	}, []);

	return {
		// Estado actual
		currentStep: state.currentStep,
		selectedTemplate: state.selectedTemplate,
		customization: state.customization,
		isAnimating: state.isAnimating,
		
		// Setters individuales (para compatibilidad)
		setIsAnimating,
		setCurrentStep,
		setSelectedTemplate,
		setCustomization,
		
		// Acciones del wizard
		selectTemplate,
		updateCustomization,
		goBack,
		reset,
		getStepInfo,
		handleStepTransition,
	};
};