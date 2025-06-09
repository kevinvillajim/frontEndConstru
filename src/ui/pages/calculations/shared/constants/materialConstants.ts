// src/ui/pages/calculations/shared/constants/materialConstants.ts
// Constantes centralizadas para el sistema de cálculos de materiales

import type {MaterialCalculationType} from "../types/material.types";

// Constantes de API
export const API_ENDPOINTS = {
	BASE: "/api/material-calculations",
	TEMPLATES: "/api/material-calculations/templates",
	EXECUTE: "/api/material-calculations/execute",
	RESULTS: "/api/material-calculations/results",
	TRENDING: "/api/material-calculations/trending",
	ANALYTICS: "/api/material-calculations/analytics",
	FEATURED: "/api/material-calculations/templates/featured",
	BY_TYPE: "/api/material-calculations/templates/by-type",
	PREVIEW: "/api/material-calculations/templates/:id/preview",
} as const;

// Constantes de UI
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

// Rutas de navegación
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

// Configuración de categorías
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
		subCategories: ["Perfiles", "Placas", "Conexiones", "Soldaduras"],
	},
	{
		id: "CERAMIC_FINISHES" as MaterialCalculationType,
		name: "Cerámicos",
		description: "Acabados cerámicos y porcelanato",
		icon: "🔲",
		color: "text-emerald-600 bg-emerald-50 border-emerald-200",
		activeColor: "text-emerald-700 bg-emerald-100 border-emerald-300",
		subCategories: ["Cerámicos", "Porcelanato", "Adhesivos", "Fragüe"],
	},
	{
		id: "CONCRETE_FOUNDATIONS" as MaterialCalculationType,
		name: "Hormigón",
		description: "Fundiciones y estructuras de hormigón",
		icon: "🏗️",
		color: "text-stone-600 bg-stone-50 border-stone-200",
		activeColor: "text-stone-700 bg-stone-100 border-stone-300",
		subCategories: ["f'c=150", "f'c=210", "f'c=240", "Aditivos"],
	},
	{
		id: "ELECTRICAL_INSTALLATIONS" as MaterialCalculationType,
		name: "Eléctrico",
		description: "Instalaciones y sistemas eléctricos",
		icon: "⚡",
		color: "text-yellow-600 bg-yellow-50 border-yellow-200",
		activeColor: "text-yellow-700 bg-yellow-100 border-yellow-300",
		subCategories: ["Conductores", "Tuberías", "Tomacorrientes", "Iluminación"],
	},
	{
		id: "MELAMINE_FURNITURE" as MaterialCalculationType,
		name: "Muebles",
		description: "Muebles de melamina y carpintería",
		icon: "🗄️",
		color: "text-orange-600 bg-orange-50 border-orange-200",
		activeColor: "text-orange-700 bg-orange-100 border-orange-300",
		subCategories: ["Planchas", "Herrajes", "Tapacanto", "Accesorios"],
	},
] as const;

// Opciones de ordenamiento
export const SORT_OPTIONS = [
	{id: "featured", name: "Destacadas", field: "isFeatured", order: "desc"},
	{id: "popular", name: "Más Populares", field: "usageCount", order: "desc"},
	{id: "recent", name: "Más Recientes", field: "createdAt", order: "desc"},
	{
		id: "rating",
		name: "Mejor Valoradas",
		field: "averageRating",
		order: "desc",
	},
	{id: "name-asc", name: "Nombre A-Z", field: "name", order: "asc"},
	{id: "name-desc", name: "Nombre Z-A", field: "name", order: "desc"},
] as const;

// Períodos de tiempo para analytics
export const TIME_PERIODS = [
	{id: "daily", name: "Hoy", description: "Últimas 24 horas"},
	{id: "weekly", name: "Semana", description: "Últimos 7 días"},
	{id: "monthly", name: "Mes", description: "Últimos 30 días"},
	{id: "quarterly", name: "Trimestre", description: "Últimos 3 meses"},
	{id: "yearly", name: "Año", description: "Últimos 12 meses"},
] as const;

// Filtros de tiempo para historial
export const TIME_FILTERS = [
	{id: "today", name: "Hoy"},
	{id: "week", name: "Esta semana"},
	{id: "month", name: "Este mes"},
	{id: "quarter", name: "Últimos 3 meses"},
	{id: "year", name: "Este año"},
	{id: "all", name: "Todo el tiempo"},
] as const;

// Estados de resultados
export const RESULT_STATUS = [
	{id: "all", name: "Todos", color: "gray"},
	{id: "successful", name: "Exitosos", color: "green"},
	{id: "failed", name: "Con errores", color: "red"},
] as const;

// Niveles de dificultad
export const DIFFICULTY_LEVELS = [
	{
		id: "basic",
		name: "Básico",
		description: "Fácil de usar, pocos parámetros",
		color: "bg-green-50 text-green-700",
		icon: "🟢",
	},
	{
		id: "intermediate",
		name: "Intermedio",
		description: "Requiere conocimiento técnico",
		color: "bg-yellow-50 text-yellow-700",
		icon: "🟡",
	},
	{
		id: "advanced",
		name: "Avanzado",
		description: "Para usuarios expertos",
		color: "bg-red-50 text-red-700",
		icon: "🔴",
	},
] as const;

// Profesiones objetivo
export const TARGET_PROFESSIONS = [
	{id: "architect", name: "Arquitecto", icon: "🏛️"},
	{id: "civil_engineer", name: "Ingeniero Civil", icon: "🏗️"},
	{id: "constructor", name: "Constructor", icon: "👷"},
	{id: "electrician", name: "Electricista", icon: "⚡"},
	{id: "contractor", name: "Contratista", icon: "📋"},
	{id: "designer", name: "Diseñador", icon: "✏️"},
] as const;

// Regiones de Ecuador
export const ECUADOR_REGIONS = [
	{
		id: "costa",
		name: "Costa",
		description: "Región costera del Ecuador",
		icon: "🏖️",
		wasteFactorMultiplier: 1.2,
	},
	{
		id: "sierra",
		name: "Sierra",
		description: "Región andina del Ecuador",
		icon: "🏔️",
		wasteFactorMultiplier: 1.0,
	},
	{
		id: "oriente",
		name: "Oriente",
		description: "Región amazónica del Ecuador",
		icon: "🌳",
		wasteFactorMultiplier: 1.5,
	},
] as const;

// Monedas soportadas
export const SUPPORTED_CURRENCIES = [
	{code: "USD", name: "Dólar Estadounidense", symbol: "$"},
	{code: "EUR", name: "Euro", symbol: "€"},
] as const;

// Tipos de comparación
export const COMPARISON_TYPES = [
	{
		id: "template",
		name: "Por Plantilla",
		description: "Comparar diferentes plantillas",
	},
	{
		id: "parameters",
		name: "Por Parámetros",
		description: "Comparar diferentes parámetros",
	},
	{
		id: "results",
		name: "Por Resultados",
		description: "Comparar diferentes resultados",
	},
] as const;

// Colores para comparaciones
export const COMPARISON_COLORS = [
	{id: "blue", class: "bg-blue-500", rgb: "59, 130, 246"},
	{id: "emerald", class: "bg-emerald-500", rgb: "16, 185, 129"},
	{id: "amber", class: "bg-amber-500", rgb: "245, 158, 11"},
	{id: "purple", class: "bg-purple-500", rgb: "139, 92, 246"},
] as const;

// Formatos de exportación
export const EXPORT_FORMATS = [
	{
		id: "pdf",
		name: "PDF",
		description: "Documento portátil",
		mimeType: "application/pdf",
		extension: ".pdf",
		icon: "📄",
	},
	{
		id: "excel",
		name: "Excel",
		description: "Hoja de cálculo",
		mimeType:
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		extension: ".xlsx",
		icon: "📊",
	},
	{
		id: "csv",
		name: "CSV",
		description: "Valores separados por comas",
		mimeType: "text/csv",
		extension: ".csv",
		icon: "📋",
	},
	{
		id: "json",
		name: "JSON",
		description: "Formato de datos JavaScript",
		mimeType: "application/json",
		extension: ".json",
		icon: "🔧",
	},
] as const;

// Tipos de datos de parámetros
export const PARAMETER_DATA_TYPES = [
	{
		id: "number",
		name: "Número",
		description: "Valores numéricos",
		icon: "🔢",
		validation: ["min", "max", "step", "precision"],
	},
	{
		id: "string",
		name: "Texto",
		description: "Cadenas de texto",
		icon: "📝",
		validation: ["minLength", "maxLength", "pattern"],
	},
	{
		id: "boolean",
		name: "Booleano",
		description: "Verdadero o falso",
		icon: "✅",
		validation: [],
	},
	{
		id: "enum",
		name: "Selección",
		description: "Lista de opciones predefinidas",
		icon: "📋",
		validation: ["allowedValues"],
	},
	{
		id: "array",
		name: "Array",
		description: "Lista de valores",
		icon: "📋",
		validation: ["minItems", "maxItems", "itemType"],
	},
] as const;

// Unidades de medida más comunes
export const COMMON_UNITS = [
	// Longitud
	{category: "length", unit: "m", name: "metros"},
	{category: "length", unit: "cm", name: "centímetros"},
	{category: "length", unit: "mm", name: "milímetros"},
	{category: "length", unit: "ft", name: "pies"},
	{category: "length", unit: "in", name: "pulgadas"},

	// Área
	{category: "area", unit: "m²", name: "metros cuadrados"},
	{category: "area", unit: "cm²", name: "centímetros cuadrados"},
	{category: "area", unit: "ft²", name: "pies cuadrados"},

	// Volumen
	{category: "volume", unit: "m³", name: "metros cúbicos"},
	{category: "volume", unit: "l", name: "litros"},
	{category: "volume", unit: "ft³", name: "pies cúbicos"},

	// Peso
	{category: "weight", unit: "kg", name: "kilogramos"},
	{category: "weight", unit: "g", name: "gramos"},
	{category: "weight", unit: "t", name: "toneladas"},
	{category: "weight", unit: "lb", name: "libras"},

	// Cantidad
	{category: "quantity", unit: "pcs", name: "piezas"},
	{category: "quantity", unit: "units", name: "unidades"},
	{category: "quantity", unit: "box", name: "cajas"},
	{category: "quantity", unit: "bag", name: "sacos"},

	// Precio
	{category: "currency", unit: "USD", name: "dólares"},
	{category: "currency", unit: "EUR", name: "euros"},

	// Tiempo
	{category: "time", unit: "min", name: "minutos"},
	{category: "time", unit: "h", name: "horas"},
	{category: "time", unit: "days", name: "días"},

	// Porcentaje
	{category: "percentage", unit: "%", name: "porcentaje"},
] as const;

// Iconos para diferentes acciones
export const ACTION_ICONS = {
	// CRUD
	create: "PlusIcon",
	read: "EyeIcon",
	update: "PencilIcon",
	delete: "TrashIcon",

	// Navegación
	back: "ArrowLeftIcon",
	forward: "ArrowRightIcon",
	up: "ArrowUpIcon",
	down: "ArrowDownIcon",

	// Funcionalidades
	search: "MagnifyingGlassIcon",
	filter: "FunnelIcon",
	sort: "AdjustmentsHorizontalIcon",
	export: "ArrowDownTrayIcon",
	import: "ArrowUpTrayIcon",
	share: "ShareIcon",
	copy: "DocumentDuplicateIcon",

	// Estados
	success: "CheckCircleIcon",
	error: "ExclamationTriangleIcon",
	warning: "ExclamationTriangleIcon",
	info: "InformationCircleIcon",
	loading: "ArrowPathIcon",

	// Contenido
	document: "DocumentTextIcon",
	chart: "ChartBarIcon",
	calendar: "CalendarIcon",
	clock: "ClockIcon",
	star: "StarIcon",
	bookmark: "BookmarkIcon",
	tag: "TagIcon",

	// Usuario
	user: "UserIcon",
	users: "UserGroupIcon",
	profile: "UserCircleIcon",

	// Configuración
	settings: "CogIcon",
	tools: "WrenchScrewdriverIcon",

	// Materiales específicos
	materials: "BeakerIcon",
	template: "DocumentTextIcon",
	calculation: "CalculatorIcon",
	result: "ChartBarIcon",
	comparison: "ArrowsRightLeftIcon",
	trending: "FireIcon",
	analytics: "ChartBarIcon",
} as const;

// Mensajes de estado
export const STATUS_MESSAGES = {
	loading: {
		templates: "Cargando plantillas...",
		results: "Cargando resultados...",
		calculation: "Ejecutando cálculo...",
		analytics: "Cargando analytics...",
		export: "Generando exportación...",
	},
	success: {
		templateCreated: "Plantilla creada exitosamente",
		templateUpdated: "Plantilla actualizada exitosamente",
		templateDeleted: "Plantilla eliminada exitosamente",
		calculationExecuted: "Cálculo ejecutado exitosamente",
		resultSaved: "Resultado guardado exitosamente",
		exported: "Exportación completada exitosamente",
	},
	error: {
		templateNotFound: "Plantilla no encontrada",
		calculationFailed: "Error en el cálculo",
		networkError: "Error de conexión",
		validationError: "Error de validación",
		unauthorized: "No autorizado",
		exportFailed: "Error en la exportación",
		generic: "Ha ocurrido un error inesperado",
	},
	empty: {
		templates: "No se encontraron plantillas",
		results: "No hay resultados disponibles",
		comparisons: "No hay comparaciones guardadas",
		favorites: "No tienes plantillas favoritas",
		history: "No hay historial de cálculos",
	},
} as const;

// Configuración de validación
export const VALIDATION_RULES = {
	templateName: {
		minLength: 5,
		maxLength: 100,
		pattern: /^[a-zA-Z0-9\s\-_áéíóúÁÉÍÓÚñÑ]+$/,
	},
	templateDescription: {
		minLength: 10,
		maxLength: 500,
	},
	parameterName: {
		minLength: 2,
		maxLength: 50,
		pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
	},
	email: {
		pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
	},
	password: {
		minLength: 8,
		maxLength: 128,
		requireUppercase: true,
		requireLowercase: true,
		requireNumbers: true,
		requireSpecialChars: false,
	},
} as const;

// Configuración de paginación por defecto
export const DEFAULT_PAGINATION = {
	page: 1,
	limit: 20,
	maxLimit: 100,
	showTotal: true,
	showSizeChanger: true,
	pageSizeOptions: [10, 20, 50, 100],
} as const;

// Configuración de debounce para diferentes acciones
export const DEBOUNCE_CONFIG = {
	search: 300,
	autoSave: 1000,
	filter: 200,
	resize: 100,
	scroll: 50,
} as const;

// Límites del sistema
export const SYSTEM_LIMITS = {
	maxFileSize: 5 * 1024 * 1024, // 5MB
	maxTemplatesPerUser: 50,
	maxResultsPerUser: 200,
	maxComparisonItems: 4,
	maxParametersPerTemplate: 20,
	maxCalculationsPerDay: 100,
	maxExportsPerDay: 10,
	maxSearchResults: 100,
	maxBulkOperations: 50,
} as const;

export type MaterialCategory = (typeof MATERIAL_CATEGORIES)[number];
export type SortOption = (typeof SORT_OPTIONS)[number];
export type TimePeriod = (typeof TIME_PERIODS)[number];
export type TimeFilter = (typeof TIME_FILTERS)[number];
export type ResultStatus = (typeof RESULT_STATUS)[number];
export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[number];
export type TargetProfession = (typeof TARGET_PROFESSIONS)[number];
export type EcuadorRegion = (typeof ECUADOR_REGIONS)[number];
export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];
export type ComparisonType = (typeof COMPARISON_TYPES)[number];
export type ComparisonColor = (typeof COMPARISON_COLORS)[number];
export type ExportFormat = (typeof EXPORT_FORMATS)[number];
export type ParameterDataType = (typeof PARAMETER_DATA_TYPES)[number];
export type CommonUnit = (typeof COMMON_UNITS)[number];
