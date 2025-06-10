// src/ui/pages/calculations/shared/constants/materialConstants.ts

import type {MaterialCalculationType} from "../types/material.types";

// Constantes de API - CORREGIDAS para coincidir con backend
export const API_ENDPOINTS = {
	BASE: "/api/material-calculation", // ← CORREGIDO: singular
	TEMPLATES: "/api/material-calculation/templates", // ← CORREGIDO: singular
	EXECUTE: "/api/material-calculation/execute", // ← CORREGIDO: singular
	RESULTS: "/api/material-calculation/results", // ← CORREGIDO: singular
	TRENDING: "/api/material-calculation/trending", // ← CORREGIDO: singular
	ANALYTICS: "/api/material-calculation/analytics", // ← CORREGIDO: singular
	FEATURED: "/api/material-calculation/templates/featured", // ← CORREGIDO
	BY_TYPE: "/api/material-calculation/templates/by-type", // ← CORREGIDO
	PREVIEW: "/api/material-calculation/templates/:id/preview", // ← CORREGIDO
} as const;

// Constantes de UI (sin cambios)
export const UI_CONSTANTS = {
	DEBOUNCE_DELAY: 300,
	ANIMATION_DURATION: 200,
	CARD_HOVER_SCALE: 1.02,
	MAX_TOAST_DURATION: 5000,
	AUTO_SAVE_INTERVAL: 30000,
	SEARCH_MIN_LENGTH: 2,
	RESULTS_PER_PAGE: 20,
	MAX_COMPARISON_ITEMS: 4,
	MAX_TEMPLATE_PARAMETERS: 20,
} as const;

// Rutas de navegación (sin cambios)
export const ROUTES = {
	MATERIALS_BASE: "/calculations/materials",
	CATALOG: "/calculations/materials",
	TEMPLATES: "/calculations/materials/templates",
	TEMPLATE_CREATE: "/calculations/materials/templates/create",
	TEMPLATE_EDIT: "/calculations/materials/templates/edit/:id",
	TEMPLATE_DUPLICATE: "/calculations/materials/templates/duplicate/:id",
	INTERFACE: "/calculations/materials/interface/:id",
	RESULTS: "/calculations/materials/results",
	RESULT_DETAIL: "/calculations/materials/results/:id",
	COMPARISON: "/calculations/materials/comparison",
	TRENDING: "/calculations/materials/trending",
	ANALYTICS: "/calculations/materials/analytics",
} as const;

// Configuración de categorías (sin cambios)
export const MATERIAL_CATEGORIES = [
	{
		id: "all" as const,
		name: "Todas",
		description: "Todas las categorías de materiales",
		icon: "🔍",
		color: "text-gray-600 bg-gray-50 border-gray-200",
		activeColor: "text-primary-700 bg-primary-50 border-primary-200",
	},
	{
		id: "STEEL_STRUCTURES" as MaterialCalculationType,
		name: "Acero",
		description: "Estructuras y elementos de acero",
		icon: "🔩",
		color: "text-slate-600 bg-slate-50 border-slate-200",
		activeColor: "text-slate-700 bg-slate-100 border-slate-300",
	},
	{
		id: "CONCRETE" as MaterialCalculationType,
		name: "Hormigón",
		description: "Cálculos para hormigón armado y simple",
		icon: "🏗️",
		color: "text-stone-600 bg-stone-50 border-stone-200",
		activeColor: "text-stone-700 bg-stone-100 border-stone-300",
	},
	{
		id: "WOOD" as MaterialCalculationType,
		name: "Madera",
		description: "Estructuras y elementos de madera",
		icon: "🌳",
		color: "text-amber-600 bg-amber-50 border-amber-200",
		activeColor: "text-amber-700 bg-amber-100 border-amber-300",
	},
	{
		id: "MASONRY" as MaterialCalculationType,
		name: "Mampostería",
		description: "Muros y elementos de mampostería",
		icon: "🧱",
		color: "text-red-600 bg-red-50 border-red-200",
		activeColor: "text-red-700 bg-red-100 border-red-300",
	},
	{
		id: "THERMAL_INSULATION" as MaterialCalculationType,
		name: "Aislamiento",
		description: "Materiales de aislamiento térmico",
		icon: "🌡️",
		color: "text-blue-600 bg-blue-50 border-blue-200",
		activeColor: "text-blue-700 bg-blue-100 border-blue-300",
	},
	{
		id: "WATERPROOFING" as MaterialCalculationType,
		name: "Impermeabilización",
		description: "Materiales impermeabilizantes",
		icon: "💧",
		color: "text-cyan-600 bg-cyan-50 border-cyan-200",
		activeColor: "text-cyan-700 bg-cyan-100 border-cyan-300",
	},
	{
		id: "FINISHING" as MaterialCalculationType,
		name: "Acabados",
		description: "Materiales de acabado y revestimiento",
		icon: "🎨",
		color: "text-purple-600 bg-purple-50 border-purple-200",
		activeColor: "text-purple-700 bg-purple-100 border-purple-300",
	},
	{
		id: "ELECTRICAL" as MaterialCalculationType,
		name: "Eléctrico",
		description: "Materiales y cálculos eléctricos",
		icon: "⚡",
		color: "text-yellow-600 bg-yellow-50 border-yellow-200",
		activeColor: "text-yellow-700 bg-yellow-100 border-yellow-300",
	},
	{
		id: "PLUMBING" as MaterialCalculationType,
		name: "Fontanería",
		description: "Materiales y cálculos hidráulicos",
		icon: "🔧",
		color: "text-indigo-600 bg-indigo-50 border-indigo-200",
		activeColor: "text-indigo-700 bg-indigo-100 border-indigo-300",
	},
	{
		id: "HVAC" as MaterialCalculationType,
		name: "HVAC",
		description: "Calefacción, ventilación y aire acondicionado",
		icon: "❄️",
		color: "text-teal-600 bg-teal-50 border-teal-200",
		activeColor: "text-teal-700 bg-teal-100 border-teal-300",
	},
] as const;

// Estados de cálculo
export const CALCULATION_STATES = {
	IDLE: "idle",
	LOADING: "loading",
	SUCCESS: "success",
	ERROR: "error",
} as const;

// Tipos de resultados
export const RESULT_TYPES = {
	QUANTITY: "quantity",
	COST: "cost",
	SPECIFICATION: "specification",
	COMPLIANCE: "compliance",
} as const;

// Configuración de validación
export const VALIDATION_CONFIG = {
	MAX_FORMULA_LENGTH: 10000,
	MAX_DESCRIPTION_LENGTH: 500,
	MAX_NOTES_LENGTH: 1000,
	MIN_PARAMETER_VALUE: -999999,
	MAX_PARAMETER_VALUE: 999999,
	MAX_DECIMAL_PLACES: 6,
} as const;
