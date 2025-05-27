// src/ui/pages/calculations/catalog/CatalogMain.tsx
import React from "react";
import {useNavigate} from "react-router-dom";
import CalculationsCatalog from "./CalculationsCatalog";
import type {CalculationTemplate} from "../shared/types/template.types";

/**
 * Wrapper para CalculationsCatalog que maneja la navegación programática
 * Separa la lógica de navegación del componente de presentación
 */
const CatalogMain: React.FC = () => {
	const navigate = useNavigate();

	const handleTemplateSelect = (template: CalculationTemplate) => {
		// Navegar usando la estructura de rutas definida
		navigate(`/calculations/catalog/template/${template.id}`);
	};

	const handlePreviewTemplate = (template: CalculationTemplate) => {
		// Para preview, podrías implementar un modal en el futuro
		// Por ahora, navegar a la interfaz completa de cálculo
		console.log("Previewing template:", template.name);
		navigate(`/calculations/catalog/template/${template.id}`);
	};

	return (
		<CalculationsCatalog
			onTemplateSelect={handleTemplateSelect}
			onPreviewTemplate={handlePreviewTemplate}
		/>
	);
};

export default CatalogMain;
