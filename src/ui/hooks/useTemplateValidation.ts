// src/ui/hooks/useTemplateValidation.ts
import { useMemo } from "react";
import type { TemplateCustomization } from "../hooks/useProjectTemplates";

export const useTemplateValidation = (customization: Partial<TemplateCustomization>) => {
	const validation = useMemo(() => {
		const errors: Record<string, string> = {};
		let isValid = true;

		// Validaciones básicas
		if (!customization.projectName?.trim()) {
			errors.projectName = "El nombre del proyecto es requerido";
			isValid = false;
		} else if (customization.projectName.length < 3) {
			errors.projectName = "El nombre debe tener al menos 3 caracteres";
			isValid = false;
		}

		if (!customization.clientName?.trim()) {
			errors.clientName = "El nombre del cliente es requerido";
			isValid = false;
		}

		if (!customization.location?.trim()) {
			errors.location = "La ubicación es requerida";
			isValid = false;
		}

		if (!customization.startDate) {
			errors.startDate = "La fecha de inicio es requerida";
			isValid = false;
		}

		if (!customization.endDate) {
			errors.endDate = "La fecha de finalización es requerida";
			isValid = false;
		} else if (customization.startDate && customization.endDate) {
			const startDate = new Date(customization.startDate);
			const endDate = new Date(customization.endDate);
			if (endDate <= startDate) {
				errors.endDate = "La fecha de finalización debe ser posterior a la de inicio";
				isValid = false;
			}
		}

		if (!customization.budget || customization.budget <= 0) {
			errors.budget = "El presupuesto debe ser mayor a 0";
			isValid = false;
		}

		if (!customization.teamSize || customization.teamSize < 1) {
			errors.teamSize = "Debe tener al menos 1 miembro del equipo";
			isValid = false;
		}

		// Validaciones de selecciones
		if (!customization.selectedPhases?.length) {
			errors.phases = "Debe seleccionar al menos una fase";
			isValid = false;
		}

		if (!customization.selectedTeamRoles?.length) {
			errors.teamRoles = "Debe seleccionar al menos un rol del equipo";
			isValid = false;
		}

		return { isValid, errors };
	}, [customization]);

	const getFieldError = (fieldName: string) => validation.errors[fieldName];
	const hasError = (fieldName: string) => !!validation.errors[fieldName];

	return {
		isValid: validation.isValid,
		errors: validation.errors,
		getFieldError,
		hasError,
	};
};