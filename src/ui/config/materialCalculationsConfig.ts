// src/ui/config/materialCalculationsConfig.ts
// Configuración completa para el módulo de cálculos de materiales

import type {MaterialCalculationType} from "../pages/calculations/shared/types/material.types";

export const MATERIAL_CALCULATIONS_CONFIG = {
	// Configuración de la aplicación
	app: {
		name: "Cálculos de Materiales",
		version: "1.0.0",
		description: "Sistema profesional de cálculo de materiales de construcción",
		supportEmail: "soporte@constru.ec",
		documentationUrl: "/docs/material-calculations",
		maxConcurrentCalculations: 5,
		enableOfflineMode: false,
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
			featured: "/templates/featured",
			byType: "/templates/by-type",
			preview: "/templates/:id/preview",
		},
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
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
		pagination: {
			defaultLimit: 20,
			maxLimit: 100,
			showSizeSelector: true,
			showPageInfo: true,
		},
		layout: {
			sidebarWidth: 280,
			headerHeight: 64,
			footerHeight: 60,
			contentMaxWidth: "7xl",
		},
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
		allowedFileTypes: ["js", "json", "csv", "xlsx"],
		maxFileSize: 5 * 1024 * 1024, // 5MB
		parameterValidation: {
			number: {
				min: -Infinity,
				max: Infinity,
				precision: 10,
			},
			string: {
				minLength: 0,
				maxLength: 255,
			},
			array: {
				maxItems: 50,
			},
		},
	},

	// Configuración de exportación
	export: {
		supportedFormats: ["pdf", "excel", "csv", "json"] as const,
		maxExportItems: 100,
		defaultFormat: "pdf" as const,
		includeCharts: true,
		includeMetadata: true,
		compressionEnabled: true,
		templateOptions: {
			pdf: {
				orientation: "portrait",
				format: "A4",
				margin: 20,
			},
			excel: {
				sheetName: "Resultados de Materiales",
				includeFormulas: false,
			},
		},
	},

	// Configuración de gamificación
	gamification: {
		enabled: true,
		pointsPerCalculation: 10,
		pointsPerTemplateCreated: 50,
		pointsPerTemplateShared: 25,
		pointsPerTemplateRated: 5,
		pointsPerFavorite: 2,
		pointsPerComparison: 15,
		badges: {
			firstCalculation: {points: 10, name: "Primera Vez", icon: "🎯"},
			powerUser: {points: 500, name: "Usuario Avanzado", icon: "⚡"},
			templateMaster: {points: 200, name: "Maestro de Plantillas", icon: "🏆"},
			collaborator: {points: 100, name: "Colaborador", icon: "🤝"},
			precisionist: {points: 150, name: "Precisión", icon: "🎯"},
			explorer: {points: 75, name: "Explorador", icon: "🗺️"},
		},
		leaderboard: {
			enabled: true,
			updateInterval: 3600000, // 1 hora
			maxEntries: 100,
		},
	},

	// Configuración de caching
	cache: {
		templatesCacheDuration: 300000, // 5 minutos
		resultsCacheDuration: 600000, // 10 minutos
		analyticsCacheDuration: 900000, // 15 minutos
		userDataCacheDuration: 180000, // 3 minutos
		maxCacheSize: 50 * 1024 * 1024, // 50MB
		enableServiceWorker: true,
		offlineSupport: false,
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
		enableAdvancedSearch: true,
		enableBulkOperations: true,
		enableVersionControl: false,
		enableAuditLog: true,
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
		maxNotifications: 5,
		defaultDuration: 5000,
		enableSound: false,
		enableBrowserNotifications: true,
	},

	// Configuración regional
	regional: {
		supportedRegions: ["costa", "sierra", "oriente"] as const,
		defaultRegion: "sierra" as const,
		wasteFactors: {
			costa: {
				STEEL_STRUCTURES: 0.05,
				CERAMIC_FINISHES: 0.1,
				CONCRETE_FOUNDATIONS: 0.08,
				ELECTRICAL_INSTALLATIONS: 0.06,
				MELAMINE_FURNITURE: 0.12,
			},
			sierra: {
				STEEL_STRUCTURES: 0.04,
				CERAMIC_FINISHES: 0.08,
				CONCRETE_FOUNDATIONS: 0.06,
				ELECTRICAL_INSTALLATIONS: 0.05,
				MELAMINE_FURNITURE: 0.1,
			},
			oriente: {
				STEEL_STRUCTURES: 0.06,
				CERAMIC_FINISHES: 0.12,
				CONCRETE_FOUNDATIONS: 0.1,
				ELECTRICAL_INSTALLATIONS: 0.08,
				MELAMINE_FURNITURE: 0.15,
			},
		},
		currencies: ["USD", "EUR"] as const,
		defaultCurrency: "USD" as const,
		locale: "es-EC",
		timezone: "America/Guayaquil",
	},

	// Configuración de logging
	logging: {
		level: "info" as const,
		enableConsoleLogging: true,
		enableRemoteLogging: false,
		enableUserAnalytics: true,
		enablePerformanceMetrics: true,
		enableErrorReporting: true,
		sensitiveFields: ["password", "token", "apiKey", "secret"],
	},

	// Configuración de seguridad
	security: {
		enableCSRFProtection: true,
		enableRateLimiting: true,
		maxRequestsPerMinute: 100,
		enableInputSanitization: true,
		allowedDomains: ["localhost", "constru.ec", "*.constru.ec"],
		contentSecurityPolicy: {
			defaultSrc: ["'self'"],
			scriptSrc: ["'self'", "'unsafe-eval'"],
			styleSrc: ["'self'", "'unsafe-inline'"],
			imgSrc: ["'self'", "data:", "https:"],
		},
	},

	// Configuración de performance
	performance: {
		enableLazyLoading: true,
		enableCodeSplitting: true,
		enableImageOptimization: true,
		enableGzipCompression: true,
		maxBundleSize: 500 * 1024, // 500KB
		enableServiceWorker: true,
		preloadCriticalResources: true,
		enableMemoryOptimization: true,
	},

	// Configuración de debugging
	debug: {
		enabled: process.env.NODE_ENV === "development",
		enableReduxDevTools: process.env.NODE_ENV === "development",
		enableReactDevTools: process.env.NODE_ENV === "development",
		enablePerformanceProfiler: false,
		verboseLogging: process.env.NODE_ENV === "development",
		showRenderTimes: false,
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
		enableVoiceNavigation: false,
		fontSize: {
			min: 12,
			max: 24,
			default: 14,
		},
	},

	// Configuración de temas
	themes: {
		default: "light" as const,
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
		materialTypeColors: {
			STEEL_STRUCTURES: {
				light: "#64748B",
				dark: "#94A3B8",
			},
			CERAMIC_FINISHES: {
				light: "#059669",
				dark: "#10B981",
			},
			CONCRETE_FOUNDATIONS: {
				light: "#78716C",
				dark: "#A8A29E",
			},
			ELECTRICAL_INSTALLATIONS: {
				light: "#D97706",
				dark: "#F59E0B",
			},
			MELAMINE_FURNITURE: {
				light: "#EA580C",
				dark: "#FB923C",
			},
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
		maxFavoritesPerUser: 100,
		maxSearchResultsPerPage: 50,
		maxFileUploadsPerDay: 20,
		maxConcurrentExecutions: 3,
	},

	// Configuración de search
	search: {
		enableFuzzySearch: true,
		minSearchLength: 2,
		maxSearchResults: 50,
		searchDebounceMs: 300,
		enableSearchHighlighting: true,
		searchFields: ["name", "description", "tags", "type", "targetProfessions"],
		searchWeights: {
			name: 3,
			description: 2,
			tags: 2,
			type: 1,
			targetProfessions: 1,
		},
	},

	// Configuración de analytics
	analytics: {
		enableUserTracking: true,
		enablePerformanceTracking: true,
		enableErrorTracking: true,
		enableFeatureUsageTracking: true,
		sampleRate: 0.1, // 10% de muestreo
		enableHeatmaps: false,
		enableSessionRecording: false,
		trackingTimeout: 30000,
		batchSize: 10,
		flushInterval: 60000, // 1 minuto
	},
} as const;

// Tipos derivados de la configuración
export type MaterialCalculationsConfig = typeof MATERIAL_CALCULATIONS_CONFIG;
export type FeatureFlags = keyof typeof MATERIAL_CALCULATIONS_CONFIG.features;
export type SupportedRegion =
	(typeof MATERIAL_CALCULATIONS_CONFIG.regional.supportedRegions)[number];
export type SupportedFormat =
	(typeof MATERIAL_CALCULATIONS_CONFIG.export.supportedFormats)[number];
export type SupportedCurrency =
	(typeof MATERIAL_CALCULATIONS_CONFIG.regional.currencies)[number];
export type ThemeMode = typeof MATERIAL_CALCULATIONS_CONFIG.themes.default;
export type LogLevel = typeof MATERIAL_CALCULATIONS_CONFIG.debug.logLevel;

// Helper functions para acceder a configuración

export const isFeatureEnabled = (feature: FeatureFlags): boolean => {
	return MATERIAL_CALCULATIONS_CONFIG.features[feature];
};

export const getRegionalConfig = (region: SupportedRegion) => {
	return (
		MATERIAL_CALCULATIONS_CONFIG.regional.wasteFactors[region] ||
		MATERIAL_CALCULATIONS_CONFIG.regional.wasteFactors.sierra
	);
};

export const getLimit = (
	limitType: keyof typeof MATERIAL_CALCULATIONS_CONFIG.limits
): number => {
	return MATERIAL_CALCULATIONS_CONFIG.limits[limitType];
};

export const getApiConfig = () => {
	return MATERIAL_CALCULATIONS_CONFIG.api;
};

export const getUIConfig = () => {
	return MATERIAL_CALCULATIONS_CONFIG.ui;
};

export const getWasteFactor = (
	region: SupportedRegion,
	materialType: MaterialCalculationType
): number => {
	return (
		MATERIAL_CALCULATIONS_CONFIG.regional.wasteFactors[region]?.[
			materialType
		] || 0.08
	);
};

export const getThemeColors = (
	materialType: MaterialCalculationType,
	theme: ThemeMode = "light"
) => {
	return (
		MATERIAL_CALCULATIONS_CONFIG.themes.materialTypeColors[materialType]?.[
			theme
		] || MATERIAL_CALCULATIONS_CONFIG.themes.customColors.primary
	);
};

export const getSearchConfig = () => {
	return MATERIAL_CALCULATIONS_CONFIG.search;
};

export const getExportFormats = (): SupportedFormat[] => {
	return [...MATERIAL_CALCULATIONS_CONFIG.export.supportedFormats];
};

export const getSupportedCurrencies = (): SupportedCurrency[] => {
	return [...MATERIAL_CALCULATIONS_CONFIG.regional.currencies];
};

export const getSupportedRegions = (): SupportedRegion[] => {
	return [...MATERIAL_CALCULATIONS_CONFIG.regional.supportedRegions];
};

export const getNotificationConfig = () => {
	return MATERIAL_CALCULATIONS_CONFIG.notifications;
};

export const getCacheConfig = () => {
	return MATERIAL_CALCULATIONS_CONFIG.cache;
};

export const getSecurityConfig = () => {
	return MATERIAL_CALCULATIONS_CONFIG.security;
};

export const getPerformanceConfig = () => {
	return MATERIAL_CALCULATIONS_CONFIG.performance;
};

export const getAccessibilityConfig = () => {
	return MATERIAL_CALCULATIONS_CONFIG.accessibility;
};

export const getAnalyticsConfig = () => {
	return MATERIAL_CALCULATIONS_CONFIG.analytics;
};

export const getValidationRules = () => {
	return MATERIAL_CALCULATIONS_CONFIG.validation;
};

export const getGamificationConfig = () => {
	return MATERIAL_CALCULATIONS_CONFIG.gamification;
};

// Función para validar configuración en desarrollo
export const validateConfig = (): boolean => {
	if (process.env.NODE_ENV !== "development") {
		return true;
	}

	const errors: string[] = [];

	// Validar límites
	if (MATERIAL_CALCULATIONS_CONFIG.limits.maxTemplatesPerUser <= 0) {
		errors.push("maxTemplatesPerUser debe ser mayor a 0");
	}

	// Validar API
	if (!MATERIAL_CALCULATIONS_CONFIG.api.baseUrl) {
		errors.push("API baseUrl es requerida");
	}

	// Validar exportación
	if (MATERIAL_CALCULATIONS_CONFIG.export.supportedFormats.length === 0) {
		errors.push("Debe haber al menos un formato de exportación soportado");
	}

	if (errors.length > 0) {
		console.error("Errores de configuración:", errors);
		return false;
	}

	return true;
};

// Inicializar validación en desarrollo
if (process.env.NODE_ENV === "development") {
	validateConfig();
}

export default MATERIAL_CALCULATIONS_CONFIG;
