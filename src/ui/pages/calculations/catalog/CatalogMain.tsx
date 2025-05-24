// src/ui/pages/calculations/catalog/CatalogPage.tsx
import React from "react";
import {useNavigate} from "react-router-dom";
import CalculationsCatalog from "./CalculationsCatalog";
import type {CalculationTemplate} from "../shared/types/template.types";

/**
 * Wrapper para CalculationsCatalog que maneja la navegación
 * Separa la lógica de navegación del componente de presentación
 */
const CatalogPage: React.FC = () => {
	const navigate = useNavigate();

	const handleTemplateSelect = (template: CalculationTemplate) => {
		// Navegar a la interfaz de cálculo con el ID de la plantilla
		navigate(`/calculations/catalog/template/${template.id}`);
	};

	const handlePreviewTemplate = (template: CalculationTemplate) => {
		// Aquí podrías implementar lógica adicional para preview
		// Por ahora, reutilizamos la misma lógica de selección
		console.log("Previewing template:", template.name);
	};

	return (
		<CalculationsCatalog
			onTemplateSelect={handleTemplateSelect}
			onPreviewTemplate={handlePreviewTemplate}
		/>
	);
};

export default CatalogPage;
