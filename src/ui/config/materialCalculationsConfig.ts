// src/ui/config/materialCalculationsConfig.ts
// Configuración específica para el módulo de materiales

export const MATERIAL_CALCULATIONS_CONFIG = {
	// Configuración de la aplicación
	app: {
		name: "Cálculos de Materiales",
		version: "1.0.0",
		description: "Sistema profesional de cálculo de materiales de construcción",
		supportEmail: "soporte@constru.ec",
		documentationUrl: "/docs/material-calculations",
	},

	// Configuración de API
	api: {
		baseUrl: "/api/material-calculations",
		timeout: 30000,
		retries: 3,
		endpoints: {
			templates: "/templates",
			execute: "/execute",
			trending: "/trending",
			results: "/results",
			analytics: "/analytics",
		},
	},

	// Configuración de UI
	ui: {
		maxResultsPerPage: 20,
		maxComparisonItems: 4,
		maxTemplateParameters: 20,
		debounceSearchMs: 300,
		animationDuration: 200,
		cardHoverScale: 1.02,
		maxToastDuration: 5000,
		autoSaveInterval: 30000, // 30 segundos
	},

	// Configuración de validación
	validation: {
		maxFormulaLength: 10000,
		maxDescriptionLength: 500,
		maxNotesLength: 1000,
		minParameterName: 2,
		maxParameterName: 50,
		maxTemplateNameLength: 100,
		minTemplateNameLength: 5,
		allowedFileTypes: ["js", "json", "csv"],
		maxFileSize: 5 * 1024 * 1024, // 5MB
	},

	// Configuración de exportación
	export: {
		supportedFormats: ["pdf", "excel", "csv", "json"],
		maxExportItems: 100,
		defaultFormat: "pdf",
		includeCharts: true,
		includeMetadata: true,
	},

	// Configuración de gamificación
	gamification: {
		enabled: true,
		pointsPerCalculation: 10,
		pointsPerTemplateCreated: 50,
		pointsPerTemplateShared: 25,
		pointsPerTemplateRated: 5,
		pointsPerFavorite: 2,
		badges: {
			firstCalculation: {points: 10, name: "Primera Vez"},
			powerUser: {points: 500, name: "Usuario Avanzado"},
			templateMaster: {points: 200, name: "Maestro de Plantillas"},
			collaborator: {points: 100, name: "Colaborador"},
		},
	},

	// Configuración de caching
	cache: {
		templatesCacheDuration: 300000, // 5 minutos
		resultsCacheDuration: 600000, // 10 minutos
		analyticsCacheDuration: 900000, // 15 minutos
		userDataCacheDuration: 180000, // 3 minutos
		maxCacheSize: 50 * 1024 * 1024, // 50MB
	},

	// Configuración de features
	features: {
		enableAdvancedAnalytics: true,
		enableTemplateSharing: true,
		enableCollaboration: true,
		enableExport: true,
		enableComparison: true,
		enableTrending: true,
		enableOfflineMode: false,
		enableRealtimeUpdates: false,
		enableMobileOptimization: true,
	},

	// Configuración de notificaciones
	notifications: {
		showCalculationComplete: true,
		showTemplateCreated: true,
		showErrorMessages: true,
		showSuccessMessages: true,
		autoHideSuccess: true,
		autoHideError: false,
		position: "top-right" as const,
	},

	// Configuración de analytics y tracking
	analytics: {
		trackUserInteractions: true,
		trackCalculationTime: true,
		trackErrorRates: true,
		trackFeatureUsage: true,
		sendUsageStatistics: false, // Privacidad del usuario
		trackingBatchSize: 10,
		trackingFlushInterval: 60000, // 1 minuto
	},

	// Configuración regional
	regional: {
		defaultCurrency: "USD",
		defaultRegion: "ecuador",
		supportedRegions: ["costa", "sierra", "oriente"],
		defaultUnits: {
			length: "m",
			area: "m²",
			volume: "m³",
			weight: "kg",
			currency: "USD",
		},
		wasteFactors: {
			costa: {
				ladrillo: 0.08,
				cemento: 0.05,
				ceramico: 0.12,
			},
			sierra: {
				ladrillo: 0.05,
				cemento: 0.03,
				ceramico: 0.1,
			},
			oriente: {
				ladrillo: 0.12,
				cemento: 0.08,
				ceramico: 0.15,
			},
		},
	},

	// Configuración de rendimiento
	performance: {
		enableLazyLoading: true,
		enableVirtualization: true,
		maxConcurrentCalculations: 3,
		calculationTimeout: 30000,
		enableCompressionForExports: true,
		optimizeImagesForMobile: true,
	},

	// Configuración de desarrollo
	development: {
		enableDebugMode: process.env.NODE_ENV === "development",
		enableDevTools: process.env.NODE_ENV === "development",
		showPerformanceMetrics: false,
		enableMockData: process.env.NODE_ENV === "development",
		logLevel: process.env.NODE_ENV === "development" ? "debug" : "error",
	},

	// Configuración de accesibilidad
	accessibility: {
		enableHighContrast: false,
		enableReducedMotion: false,
		enableScreenReader: true,
		keyboardNavigationEnabled: true,
		focusIndicatorEnabled: true,
		ariaLabelsEnabled: true,
	},

	// Configuración de temas
	themes: {
		default: "light",
		supportsDarkMode: true,
		autoDetectSystemTheme: true,
		customColors: {
			primary: "#3B82F6",
			secondary: "#8B5CF6",
			success: "#10B981",
			warning: "#F59E0B",
			error: "#EF4444",
			info: "#3B82F6",
		},
	},

	// Límites del sistema
	limits: {
		maxTemplatesPerUser: 50,
		maxResultsPerUser: 200,
		maxComparisonsPerUser: 20,
		maxParametersPerTemplate: 20,
		maxCalculationsPerDay: 100,
		maxExportsPerDay: 10,
	},
} as const;

// Tipos derivados de la configuración
export type MaterialCalculationsConfig = typeof MATERIAL_CALCULATIONS_CONFIG;
export type FeatureFlags = keyof typeof MATERIAL_CALCULATIONS_CONFIG.features;
export type SupportedRegion =
	(typeof MATERIAL_CALCULATIONS_CONFIG.regional.supportedRegions)[number];
export type SupportedFormat =
	(typeof MATERIAL_CALCULATIONS_CONFIG.export.supportedFormats)[number];

// Helper para acceder a configuración de features
export const isFeatureEnabled = (feature: FeatureFlags): boolean => {
	return MATERIAL_CALCULATIONS_CONFIG.features[feature];
};

// Helper para obtener configuración regional
export const getRegionalConfig = (region: SupportedRegion) => {
	return (
		MATERIAL_CALCULATIONS_CONFIG.regional.wasteFactors[region] ||
		MATERIAL_CALCULATIONS_CONFIG.regional.wasteFactors.sierra
	); // fallback
};

// Helper para obtener límites
export const getLimit = (
	limitType: keyof typeof MATERIAL_CALCULATIONS_CONFIG.limits
): number => {
	return MATERIAL_CALCULATIONS_CONFIG.limits[limitType];
};

// Helper para configuración de API
export const getApiConfig = () => {
	return MATERIAL_CALCULATIONS_CONFIG.api;
};

// Helper para configuración de UI
export const getUIConfig = () => {
	return MATERIAL_CALCULATIONS_CONFIG.ui;
};
