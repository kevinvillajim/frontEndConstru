// src/ui/pages/calculations/materials/index.ts
// Archivo de barrel para exportar todos los componentes

export {default as MaterialCalculationsMain} from "./MaterialCalculationsMain";
export {default as MaterialCalculationsHub} from "./MaterialCalculationsHub";
export {default as MaterialCatalog} from "./MaterialCatalog";
export {default as MaterialCalculationInterface} from "./MaterialCalculationInterface";
export {default as MaterialTemplatesManager} from "./MaterialTemplatesManager";
export {default as MaterialTrendingAnalytics} from "./MaterialTrendingAnalytics";
export {default as MaterialCalculationComparison} from "./MaterialCalculationComparison";
export {default as MaterialCalculationsRouter} from "./MaterialCalculationsRouter";

// Exportar tipos también
export * from "../shared/types/material.types";
export * from "../shared/hooks/useMaterialCalculations";

// src/ui/config/materialCalculationsConfig.ts
// Configuración específica para el módulo de materiales

export const MATERIAL_CALCULATIONS_CONFIG = {
	// Configuración de la aplicación
	app: {
		name: "Cálculos de Materiales",
		version: "1.0.0",
		description: "Sistema profesional de cálculo de materiales de construcción",
	},

	// Configuración de API
	api: {
		baseUrl: "/api/material-calculations",
		timeout: 30000,
		retries: 3,
	},

	// Configuración de UI
	ui: {
		maxResultsPerPage: 20,
		maxComparisonItems: 4,
		maxTemplateParameters: 20,
		debounceSearchMs: 300,
		animationDuration: 200,
	},

	// Configuración de validación
	validation: {
		maxFormulaLength: 10000,
		maxDescriptionLength: 500,
		maxNotesLength: 1000,
		minParameterName: 2,
		maxParameterName: 50,
	},

	// Configuración de exportación
	export: {
		supportedFormats: ["pdf", "excel", "csv"],
		maxExportItems: 100,
	},

	// Configuración de gamificación
	gamification: {
		enabled: true,
		pointsPerCalculation: 10,
		pointsPerTemplateCreated: 50,
		pointsPerTemplateShared: 25,
	},

	// Configuración de caching
	cache: {
		templatesCacheDuration: 300000, // 5 minutos
		resultsCacheDuration: 600000, // 10 minutos
		analyticsCacheDuration: 900000, // 15 minutos
	},
} as const;
