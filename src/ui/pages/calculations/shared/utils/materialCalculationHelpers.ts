// src/ui/pages/calculations/shared/utils/materialCalculationHelpers.ts
// CORRECCIÓN: Tipos any reemplazados, variables no utilizadas eliminadas, case declarations corregidas

import {
	type MaterialCalculationType,
	type MaterialCalculationResult,
	type MaterialQuantity,
	type MaterialParameter,
	type MaterialCalculationTemplate,
	ParameterDataType,
} from "../types/material.types";

import {
	MATERIAL_CATEGORIES,
	API_ENDPOINTS,
	UI_CONSTANTS,
} from "../constants/materialConstants";

// Tipos para funciones helper
type DateFormatOptions = Intl.DateTimeFormatOptions;
type ParameterValue = string | number | boolean | string[];
type WasteFactors = Record<string, number>;

// === CONSTANTES AUXILIARES ===

const ECUADOR_REGIONS = [
	{value: "costa", label: "Costa", factor: 1.0},
	{value: "sierra", label: "Sierra", factor: 1.05},
	{value: "oriente", label: "Oriente", factor: 1.15},
	{value: "galapagos", label: "Galápagos", factor: 1.25},
] as const;

const SUPPORTED_CURRENCIES = [
	{code: "USD", name: "Dólar Estadounidense", symbol: "$"},
	{code: "EUR", name: "Euro", symbol: "€"},
] as const;

const DIFFICULTY_LEVELS = [
	{value: "basic", label: "Básico", color: "green"},
	{value: "intermediate", label: "Intermedio", color: "yellow"},
	{value: "advanced", label: "Avanzado", color: "red"},
] as const;

const TARGET_PROFESSIONS = [
	"architect",
	"civil_engineer",
	"structural_engineer",
	"construction_manager",
	"quantity_surveyor",
] as const;

const SYSTEM_LIMITS = {
	MAX_PARAMETERS: 50,
	MAX_FORMULA_LENGTH: 10000,
	MAX_DESCRIPTION_LENGTH: 1000,
	MAX_RESULTS_PER_PAGE: 100,
} as const;

// === FORMATTERS ===

/**
 * Formatea una cantidad numérica con separadores de miles
 */
export const formatNumber = (
	value: number,
	decimals: number = 2,
	locale: string = "es-EC"
): string => {
	return new Intl.NumberFormat(locale, {
		minimumFractionDigits: 0,
		maximumFractionDigits: decimals,
	}).format(value);
};

/**
 * Formatea un valor monetario
 */
export const formatCurrency = (
	amount: number,
	currencyCode: string = "USD",
	locale: string = "es-EC"
): string => {
	return new Intl.NumberFormat(locale, {
		style: "currency",
		currency: currencyCode,
	}).format(amount);
};

/**
 * Formatea una fecha relativa (hace X tiempo)
 */
export const formatRelativeTime = (
	date: string | Date,
	locale: string = "es"
): string => {
	const rtf = new Intl.RelativeTimeFormat(locale, {numeric: "auto"});
	const now = new Date();
	const target = new Date(date);
	const diffInSeconds = (target.getTime() - now.getTime()) / 1000;

	if (Math.abs(diffInSeconds) < 60) {
		return rtf.format(Math.round(diffInSeconds), "second");
	} else if (Math.abs(diffInSeconds) < 3600) {
		return rtf.format(Math.round(diffInSeconds / 60), "minute");
	} else if (Math.abs(diffInSeconds) < 86400) {
		return rtf.format(Math.round(diffInSeconds / 3600), "hour");
	} else if (Math.abs(diffInSeconds) < 2592000) {
		return rtf.format(Math.round(diffInSeconds / 86400), "day");
	} else if (Math.abs(diffInSeconds) < 31536000) {
		return rtf.format(Math.round(diffInSeconds / 2592000), "month");
	} else {
		return rtf.format(Math.round(diffInSeconds / 31536000), "year");
	}
};

/**
 * Formatea una fecha en formato legible
 */
export const formatDate = (
	date: string | Date,
	options: DateFormatOptions = {
		year: "numeric",
		month: "long",
		day: "numeric",
	},
	locale: string = "es-EC"
): string => {
	return new Date(date).toLocaleDateString(locale, options);
};

/**
 * Formatea una duración en milisegundos a formato legible
 */
export const formatDuration = (durationMs: number): string => {
	if (durationMs < 1000) {
		return `${durationMs}ms`;
	} else if (durationMs < 60000) {
		return `${(durationMs / 1000).toFixed(1)}s`;
	} else {
		return `${(durationMs / 60000).toFixed(1)}min`;
	}
};

// === VALIDADORES ===

/**
 * Valida un parámetro individual
 */
export const validateParameter = (
	parameter: MaterialParameter,
	value: ParameterValue
): string | null => {
	// Validar campos requeridos
	if (
		parameter.isRequired &&
		(value === undefined || value === "" || value === null)
	) {
		return "Este campo es requerido";
	}

	// Si no hay valor y no es requerido, es válido
	if (value === undefined || value === "" || value === null) {
		return null;
	}

	// Validar por tipo de dato
	switch (parameter.dataType) {
		case ParameterDataType.NUMBER: {
			const numValue =
				typeof value === "number" ? value : parseFloat(value as string);

			if (isNaN(numValue)) {
				return "Debe ser un número válido";
			}

			if (parameter.minValue !== undefined && numValue < parameter.minValue) {
				return `Debe ser mayor o igual a ${parameter.minValue}`;
			}

			if (parameter.maxValue !== undefined && numValue > parameter.maxValue) {
				return `Debe ser menor o igual a ${parameter.maxValue}`;
			}
			break;
		}

		case ParameterDataType.STRING: {
			const strValue = value as string;

			if (
				parameter.regexPattern &&
				!new RegExp(parameter.regexPattern).test(strValue)
			) {
				return "Formato inválido";
			}
			break;
		}

		case ParameterDataType.ENUM: {
			const enumValue = value as string;

			if (
				parameter.allowedValues &&
				!parameter.allowedValues.includes(enumValue)
			) {
				return "Valor no válido para esta opción";
			}
			break;
		}

		case ParameterDataType.ARRAY: {
			const arrayValue = value as string[];

			if (!Array.isArray(arrayValue)) {
				return "Debe ser una lista válida";
			}
			break;
		}

		default:
			break;
	}

	return null;
};

/**
 * Valida todos los parámetros de entrada
 */
export const validateAllParameters = (
	parameters: MaterialParameter[],
	inputValues: Record<string, ParameterValue>
): Record<string, string> => {
	const errors: Record<string, string> = {};

	parameters
		.filter((p) => p.scope === "input")
		.forEach((param) => {
			const error = validateParameter(param, inputValues[param.name]);
			if (error) {
				errors[param.name] = error;
			}
		});

	return errors;
};

/**
 * Valida una fórmula JavaScript básica
 */
export const validateFormula = (
	formula: string
): {isValid: boolean; error?: string} => {
	try {
		// Validar longitud
		if (formula.length > SYSTEM_LIMITS.MAX_FORMULA_LENGTH) {
			return {
				isValid: false,
				error: `La fórmula excede el límite de ${SYSTEM_LIMITS.MAX_FORMULA_LENGTH} caracteres`,
			};
		}

		// Validar sintaxis básica JavaScript
		new Function(formula);

		return {isValid: true};
	} catch (error) {
		return {
			isValid: false,
			error: `Error de sintaxis: ${(error as Error).message}`,
		};
	}
};

// === CONVERTIDORES ===

/**
 * Convierte un valor por defecto según el tipo de dato
 */
export const parseParameterValue = (
	value: ParameterValue,
	dataType: ParameterDataType
): ParameterValue => {
	switch (dataType) {
		case ParameterDataType.NUMBER:
			return typeof value === "string"
				? parseFloat(value) || 0
				: (value as number);

		case ParameterDataType.BOOLEAN:
			return typeof value === "string"
				? value.toLowerCase() === "true"
				: Boolean(value);

		case ParameterDataType.ARRAY:
			if (typeof value === "string") {
				try {
					return JSON.parse(value);
				} catch {
					return value.split(",").map((v) => v.trim());
				}
			}
			return Array.isArray(value) ? value : [String(value)];

		default:
			return String(value);
	}
};

/**
 * Convierte valores de entrada para envío a API
 */
export const formatParametersForAPI = (
	parameters: MaterialParameter[],
	inputValues: Record<string, ParameterValue>
): Record<string, ParameterValue> => {
	const formatted: Record<string, ParameterValue> = {};

	parameters
		.filter((p) => p.scope === "input")
		.forEach((param) => {
			const value = inputValues[param.name];
			if (value !== undefined && value !== null && value !== "") {
				formatted[param.name] = parseParameterValue(value, param.dataType);
			}
		});

	return formatted;
};

// === UTILIDADES DE CÁLCULO ===

/**
 * Obtiene el factor de desperdicio para un tipo de material
 */
export const getWasteFactor = (
	materialType: MaterialCalculationType,
	region: string = "sierra"
): number => {
	const baseFactors: WasteFactors = {
		STEEL_STRUCTURES: 0.05,
		CONCRETE: 0.1,
		WOOD: 0.08,
		MASONRY: 0.06,
		THERMAL_INSULATION: 0.15,
		WATERPROOFING: 0.12,
		FINISHING: 0.2,
		ELECTRICAL: 0.1,
		PLUMBING: 0.08,
		HVAC: 0.1,
	};

	const regionMultipliers: Record<string, number> = {
		costa: 1.0,
		sierra: 1.1,
		oriente: 1.2,
		galapagos: 1.3,
	};

	const baseFactor = baseFactors[materialType] || 0.1;
	const regionMultiplier = regionMultipliers[region] || 1.0;

	return baseFactor * regionMultiplier;
};

/**
 * Calcula el costo total con desperdicios
 */
export const calculateTotalCost = (
	materialQuantities: MaterialQuantity[],
	includeWaste: boolean = true,
	wastePercentage?: number
): number => {
	return materialQuantities.reduce((total, material) => {
		const basePrice =
			material.totalPrice || material.quantity * (material.unitPrice || 0);

		if (includeWaste) {
			const wasteFactor = wastePercentage
				? wastePercentage / 100
				: (material.wastePercentage || 0) / 100;
			return total + basePrice * (1 + wasteFactor);
		}

		return total + basePrice;
	}, 0);
};

/**
 * Aplica factores regionales a precios
 */
export const applyRegionalFactors = (
	basePrice: number,
	region: string = "sierra"
): number => {
	const regionFactor =
		ECUADOR_REGIONS.find((r) => r.value === region)?.factor || 1.0;
	return basePrice * regionFactor;
};

// === UTILIDADES DE BÚSQUEDA Y FILTRADO ===

/**
 * Filtra plantillas por criterios de búsqueda
 */
export const filterTemplates = (
	templates: MaterialCalculationTemplate[],
	searchTerm: string,
	type?: MaterialCalculationType,
	tags?: string[]
): MaterialCalculationTemplate[] => {
	return templates.filter((template) => {
		// Filtro por término de búsqueda
		if (searchTerm) {
			const search = searchTerm.toLowerCase();
			const matchesName = template.name.toLowerCase().includes(search);
			const matchesDescription = template.description
				.toLowerCase()
				.includes(search);
			const matchesTags = template.tags?.some((tag) =>
				tag.toLowerCase().includes(search)
			);

			if (!matchesName && !matchesDescription && !matchesTags) {
				return false;
			}
		}

		// Filtro por tipo
		if (type && template.type !== type) {
			return false;
		}

		// Filtro por tags
		if (tags && tags.length > 0) {
			const hasMatchingTag = tags.some((tag) => template.tags?.includes(tag));
			if (!hasMatchingTag) {
				return false;
			}
		}

		return true;
	});
};

/**
 * Ordena plantillas por criterio especificado
 */
export const sortTemplates = (
	templates: MaterialCalculationTemplate[],
	sortBy: string = "name",
	sortOrder: "asc" | "desc" = "asc"
): MaterialCalculationTemplate[] => {
	const sorted = [...templates].sort((a, b) => {
		let valueA: string | number;
		let valueB: string | number;

		switch (sortBy) {
			case "name":
				valueA = a.name;
				valueB = b.name;
				break;
			case "createdAt":
				valueA = new Date(a.createdAt).getTime();
				valueB = new Date(b.createdAt).getTime();
				break;
			case "usageCount":
				valueA = a.usageCount;
				valueB = b.usageCount;
				break;
			case "rating":
				valueA = a.averageRating;
				valueB = b.averageRating;
				break;
			default:
				valueA = a.name;
				valueB = b.name;
		}

		if (typeof valueA === "string" && typeof valueB === "string") {
			return sortOrder === "asc"
				? valueA.localeCompare(valueB)
				: valueB.localeCompare(valueA);
		}

		return sortOrder === "asc"
			? (valueA as number) - (valueB as number)
			: (valueB as number) - (valueA as number);
	});

	return sorted;
};

// === UTILIDADES DE EXPORTACIÓN ===

/**
 * Genera datos para exportación CSV
 */
export const generateCSVData = (
	results: MaterialCalculationResult[]
): string => {
	const headers = [
		"Fecha",
		"Plantilla",
		"Tipo",
		"Costo Total",
		"Moneda",
		"Región",
		"Incluye Desperdicios",
		"Tiempo de Ejecución (ms)",
		"Estado",
	];

	const rows = results.map((result) => [
		formatDate(result.createdAt),
		result.templateName,
		result.templateType,
		result.totalEstimatedCost?.toFixed(2) || "0.00",
		result.currency,
		result.regionalFactors,
		result.includeWaste ? "Sí" : "No",
		result.executionTime.toString(),
		result.wasSuccessful ? "Exitoso" : "Error",
	]);

	const csvContent = [headers, ...rows]
		.map((row) => row.map((cell) => `"${cell}"`).join(","))
		.join("\n");

	return csvContent;
};

/**
 * Genera resumen estadístico de resultados
 */
export const generateResultsSummary = (
	results: MaterialCalculationResult[]
): {
	totalCalculations: number;
	successfulCalculations: number;
	successRate: number;
	averageExecutionTime: number;
	totalCost: number;
	averageCost: number;
	calculationsByType: Record<string, number>;
} => {
	const totalCalculations = results.length;
	const successfulCalculations = results.filter((r) => r.wasSuccessful).length;
	const successRate =
		totalCalculations > 0
			? (successfulCalculations / totalCalculations) * 100
			: 0;

	const averageExecutionTime =
		totalCalculations > 0
			? results.reduce((sum, r) => sum + r.executionTime, 0) / totalCalculations
			: 0;

	const totalCost = results.reduce(
		(sum, r) => sum + (r.totalEstimatedCost || 0),
		0
	);
	const averageCost = totalCalculations > 0 ? totalCost / totalCalculations : 0;

	const calculationsByType: Record<string, number> = {};
	results.forEach((result) => {
		calculationsByType[result.templateType] =
			(calculationsByType[result.templateType] || 0) + 1;
	});

	return {
		totalCalculations,
		successfulCalculations,
		successRate,
		averageExecutionTime,
		totalCost,
		averageCost,
		calculationsByType,
	};
};

// === UTILIDADES DE CACHE ===

/**
 * Genera clave de cache para plantillas
 */
export const generateCacheKey = (
	type?: MaterialCalculationType,
	searchTerm?: string,
	tags?: string[]
): string => {
	const parts = ["material_templates"];

	if (type) parts.push(`type_${type}`);
	if (searchTerm)
		parts.push(`search_${searchTerm.toLowerCase().replace(/\s+/g, "_")}`);
	if (tags && tags.length > 0) parts.push(`tags_${tags.sort().join("_")}`);

	return parts.join("_");
};

/**
 * Verifica si el cache está vigente
 */
export const isCacheValid = (
	timestamp: number,
	durationMs: number
): boolean => {
	return Date.now() - timestamp < durationMs;
};

// === EXPORTACIONES ADICIONALES ===

export {
	ECUADOR_REGIONS,
	SUPPORTED_CURRENCIES,
	DIFFICULTY_LEVELS,
	TARGET_PROFESSIONS,
	SYSTEM_LIMITS,
};

// Re-exportar constantes útiles
export {MATERIAL_CATEGORIES, API_ENDPOINTS, UI_CONSTANTS};
