// src/ui/config/materialCalculationsConfig.ts

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

	// Configuración de API - CORREGIDA
	api: {
		baseUrl: "/api/material-calculation", // ← CORREGIDO: singular
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
		maxParameterNameLength: 50,
		maxTemplateNameLength: 100,
		minParameterValue: -999999,
		maxParameterValue: 999999,
		maxDecimalPlaces: 6,
		requiredFields: ["name", "description", "formula", "type"],
		parameterTypes: ["number", "string", "boolean", "enum", "date"],
	},

	// Configuración de tipos de materiales
	materialTypes: [
		{
			id: "STEEL_STRUCTURES" as MaterialCalculationType,
			name: "Estructuras de Acero",
			description: "Cálculos para estructuras metálicas",
			icon: "🔩",
			category: "structural",
			subcategories: ["beams", "columns", "connections", "frames", "trusses"],
		},
		{
			id: "CONCRETE" as MaterialCalculationType,
			name: "Hormigón",
			description: "Cálculos para hormigón armado y simple",
			icon: "🏗️",
			category: "structural",
			subcategories: [
				"mix_design",
				"reinforcement",
				"slabs",
				"foundations",
				"beams_columns",
			],
		},
		{
			id: "WOOD" as MaterialCalculationType,
			name: "Madera",
			description: "Estructuras y elementos de madera",
			icon: "🌳",
			category: "structural",
			subcategories: ["beams", "columns", "connections", "floors", "roofs"],
		},
		{
			id: "MASONRY" as MaterialCalculationType,
			name: "Mampostería",
			description: "Muros y elementos de mampostería",
			icon: "🧱",
			category: "structural",
			subcategories: [
				"load_bearing_walls",
				"partition_walls",
				"foundations",
				"arches",
				"retaining_walls",
			],
		},
		{
			id: "THERMAL_INSULATION" as MaterialCalculationType,
			name: "Aislamiento Térmico",
			description: "Materiales de aislamiento térmico",
			icon: "🌡️",
			category: "building_envelope",
			subcategories: ["walls", "roofs", "floors", "windows", "thermal_bridges"],
		},
		{
			id: "WATERPROOFING" as MaterialCalculationType,
			name: "Impermeabilización",
			description: "Materiales impermeabilizantes",
			icon: "💧",
			category: "building_envelope",
			subcategories: [
				"roofs",
				"foundations",
				"bathrooms",
				"terraces",
				"facades",
			],
		},
		{
			id: "FINISHING" as MaterialCalculationType,
			name: "Acabados",
			description: "Materiales de acabado y revestimiento",
			icon: "🎨",
			category: "finishes",
			subcategories: [
				"flooring",
				"wall_coverings",
				"ceiling",
				"paint",
				"tiles",
			],
		},
		{
			id: "ELECTRICAL" as MaterialCalculationType,
			name: "Instalaciones Eléctricas",
			description: "Materiales y cálculos eléctricos",
			icon: "⚡",
			category: "mep",
			subcategories: [
				"wiring",
				"lighting",
				"power_distribution",
				"grounding",
				"protection",
			],
		},
		{
			id: "PLUMBING" as MaterialCalculationType,
			name: "Fontanería",
			description: "Materiales y cálculos hidráulicos",
			icon: "🔧",
			category: "mep",
			subcategories: [
				"water_supply",
				"drainage",
				"hot_water",
				"fixtures",
				"pressure_systems",
			],
		},
		{
			id: "HVAC" as MaterialCalculationType,
			name: "HVAC",
			description: "Calefacción, ventilación y aire acondicionado",
			icon: "❄️",
			category: "mep",
			subcategories: [
				"heating",
				"cooling",
				"ventilation",
				"ductwork",
				"controls",
			],
		},
	],

	// Configuración de estados
	states: {
		calculation: {
			IDLE: "idle",
			LOADING: "loading",
			SUCCESS: "success",
			ERROR: "error",
		},
		template: {
			DRAFT: "draft",
			ACTIVE: "active",
			ARCHIVED: "archived",
			FEATURED: "featured",
		},
		result: {
			TEMPORARY: "temporary",
			SAVED: "saved",
			SHARED: "shared",
			ARCHIVED: "archived",
		},
	},

	// Configuración de filtros
	filters: {
		defaultSort: "name",
		sortOptions: [
			{value: "name", label: "Nombre A-Z"},
			{value: "-name", label: "Nombre Z-A"},
			{value: "createdAt", label: "Más antiguos"},
			{value: "-createdAt", label: "Más recientes"},
			{value: "usageCount", label: "Menos usados"},
			{value: "-usageCount", label: "Más usados"},
			{value: "rating", label: "Peor valorados"},
			{value: "-rating", label: "Mejor valorados"},
		],
		limitOptions: [10, 20, 50, 100],
		defaultLimit: 20,
	},

	// Configuración de notificaciones
	notifications: {
		autoHideDelay: 5000,
		maxVisible: 3,
		types: {
			success: {icon: "✅", color: "green"},
			error: {icon: "❌", color: "red"},
			warning: {icon: "⚠️", color: "yellow"},
			info: {icon: "ℹ️", color: "blue"},
		},
	},

	// Configuración de cache
	cache: {
		templatesCacheDuration: 5 * 60 * 1000, // 5 minutos
		resultsCacheDuration: 2 * 60 * 1000, // 2 minutos
		analyticsCacheDuration: 10 * 60 * 1000, // 10 minutos
		maxCacheSize: 50,
	},
};
