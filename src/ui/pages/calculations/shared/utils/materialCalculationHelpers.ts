// src/ui/pages/calculations/shared/utils/materialCalculationHelpers.ts
// Utilidades y helpers para cálculos de materiales

import type {
	MaterialCalculationType,
	MaterialCalculationResult,
	MaterialQuantity,
	MaterialParameter,
	MaterialCalculationTemplate,
} from "../types/material.types";

import {
	MATERIAL_CATEGORIES,
	ECUADOR_REGIONS,
	SUPPORTED_CURRENCIES,
	DIFFICULTY_LEVELS,
	TARGET_PROFESSIONS,
	SYSTEM_LIMITS,
} from "../constants/materialConstants";

import {getWasteFactor} from "../../config/materialCalculationsConfig";

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
	currency: string = "USD",
	locale: string = "es-EC"
): string => {
	return new Intl.NumberFormat(locale, {
		style: "currency",
		currency: currency,
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
	options?: Intl.DateTimeFormatOptions,
	locale: string = "es-EC"
): string => {
	const defaultOptions: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	};

	return new Intl.DateTimeFormat(locale, {
		...defaultOptions,
		...options,
	}).format(new Date(date));
};

/**
 * Formatea una cantidad de material con su unidad
 */
export const formatMaterialQuantity = (
	quantity: number,
	unit: string,
	decimals: number = 2
): string => {
	return `${formatNumber(quantity, decimals)} ${unit}`;
};

/**
 * Formatea un porcentaje
 */
export const formatPercentage = (
	value: number,
	decimals: number = 1
): string => {
	return `${formatNumber(value * 100, decimals)}%`;
};

/**
 * Formatea tiempo de ejecución
 */
export const formatExecutionTime = (timeMs: number): string => {
	if (timeMs < 1000) {
		return `${timeMs}ms`;
	} else if (timeMs < 60000) {
		return `${(timeMs / 1000).toFixed(1)}s`;
	} else {
		const minutes = Math.floor(timeMs / 60000);
		const seconds = Math.floor((timeMs % 60000) / 1000);
		return `${minutes}m ${seconds}s`;
	}
};

// === VALIDADORES ===

/**
 * Valida si un email es válido
 */
export const isValidEmail = (email: string): boolean => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

/**
 * Valida si un nombre de plantilla es válido
 */
export const isValidTemplateName = (name: string): boolean => {
	return (
		name.length >= 5 &&
		name.length <= 100 &&
		/^[a-zA-Z0-9\s\-_áéíóúÁÉÍÓÚñÑ]+$/.test(name)
	);
};

/**
 * Valida si un nombre de parámetro es válido
 */
export const isValidParameterName = (name: string): boolean => {
	return (
		name.length >= 2 &&
		name.length <= 50 &&
		/^[a-zA-Z][a-zA-Z0-9_]*$/.test(name)
	);
};

/**
 * Valida si un valor numérico está dentro del rango permitido
 */
export const isNumberInRange = (
	value: number,
	min?: number,
	max?: number
): boolean => {
	if (min !== undefined && value < min) return false;
	if (max !== undefined && value > max) return false;
	return true;
};

/**
 * Valida si una fórmula JavaScript es sintácticamente correcta
 */
export const validateFormulaJavaScript = (
	formula: string
): {isValid: boolean; error?: string} => {
	try {
		// Crear una función temporal para validar la sintaxis
		new Function("return " + formula);
		return {isValid: true};
	} catch (error) {
		return {
			isValid: false,
			error:
				error instanceof Error
					? error.message
					: "Error de sintaxis desconocido",
		};
	}
};

/**
 * Valida los parámetros de entrada de un cálculo
 */
export const validateCalculationParameters = (
	parameters: MaterialParameter[],
	inputValues: Record<string, any>
): {isValid: boolean; errors: Record<string, string>} => {
	const errors: Record<string, string> = {};

	parameters.forEach((param) => {
		const value = inputValues[param.name];

		// Validar campos requeridos
		if (
			param.isRequired &&
			(value === undefined || value === null || value === "")
		) {
			errors[param.name] = `${param.name} es requerido`;
			return;
		}

		// Validar tipos de datos
		if (value !== undefined && value !== null && value !== "") {
			switch (param.dataType) {
				case "number":
					const numValue = Number(value);
					if (isNaN(numValue)) {
						errors[param.name] = `${param.name} debe ser un número válido`;
					} else if (
						!isNumberInRange(
							numValue,
							param.minValue || undefined,
							param.maxValue || undefined
						)
					) {
						errors[param.name] =
							`${param.name} debe estar entre ${param.minValue || "-∞"} y ${param.maxValue || "∞"}`;
					}
					break;

				case "string":
					if (typeof value !== "string") {
						errors[param.name] = `${param.name} debe ser texto`;
					}
					break;

				case "boolean":
					if (typeof value !== "boolean") {
						errors[param.name] = `${param.name} debe ser verdadero o falso`;
					}
					break;

				case "enum":
					if (param.allowedValues && !param.allowedValues.includes(value)) {
						errors[param.name] =
							`${param.name} debe ser uno de: ${param.allowedValues.join(", ")}`;
					}
					break;
			}
		}
	});

	return {
		isValid: Object.keys(errors).length === 0,
		errors,
	};
};

// === CALCULADORES ===

/**
 * Calcula la cantidad total incluyendo desperdicios
 */
export const calculateWithWaste = (
	baseQuantity: number,
	wastePercentage: number
): number => {
	return baseQuantity * (1 + wastePercentage / 100);
};

/**
 * Calcula el factor de desperdicio según la región y tipo de material
 */
export const calculateRegionalWasteFactor = (
	region: string,
	materialType: MaterialCalculationType
): number => {
	const regionConfig = ECUADOR_REGIONS.find((r) => r.id === region);
	const baseFactor = getWasteFactor(region as any, materialType);
	const multiplier = regionConfig?.wasteFactorMultiplier || 1;

	return baseFactor * multiplier;
};

/**
 * Calcula el costo total de un material
 */
export const calculateMaterialCost = (
	quantity: number,
	unitPrice: number,
	includeWaste: boolean = false,
	wastePercentage: number = 0
): number => {
	const finalQuantity = includeWaste
		? calculateWithWaste(quantity, wastePercentage)
		: quantity;

	return finalQuantity * unitPrice;
};

/**
 * Calcula el costo total de una lista de materiales
 */
export const calculateTotalCost = (
	materials: MaterialQuantity[],
	currency: string = "USD"
): number => {
	return materials.reduce((total, material) => {
		return total + (material.totalPrice || 0);
	}, 0);
};

/**
 * Calcula la diferencia porcentual entre dos valores
 */
export const calculatePercentageDifference = (
	oldValue: number,
	newValue: number
): number => {
	if (oldValue === 0) return newValue === 0 ? 0 : 100;
	return ((newValue - oldValue) / oldValue) * 100;
};

/**
 * Calcula un score de tendencia basado en métricas
 */
export const calculateTrendScore = (
	usageCount: number,
	uniqueUsers: number,
	successRate: number,
	averageRating: number,
	recentGrowth: number
): number => {
	const usageWeight = 0.3;
	const usersWeight = 0.2;
	const successWeight = 0.2;
	const ratingWeight = 0.15;
	const growthWeight = 0.15;

	// Normalizar valores a una escala de 0-100
	const normalizedUsage = Math.min(usageCount / 1000, 1) * 100;
	const normalizedUsers = Math.min(uniqueUsers / 100, 1) * 100;
	const normalizedSuccess = successRate * 100;
	const normalizedRating = (averageRating / 5) * 100;
	const normalizedGrowth = Math.min(Math.max(recentGrowth, -100), 100) + 100; // -100 a 100 -> 0 a 200

	return (
		normalizedUsage * usageWeight +
		normalizedUsers * usersWeight +
		normalizedSuccess * successWeight +
		normalizedRating * ratingWeight +
		(normalizedGrowth / 2) * growthWeight // Dividir por 2 para normalizar a 0-100
	);
};

// === UTILIDADES DE DATOS ===

/**
 * Obtiene la configuración de una categoría de material
 */
export const getMaterialCategoryConfig = (
	type: MaterialCalculationType | "all"
) => {
	return (
		MATERIAL_CATEGORIES.find((cat) => cat.id === type) || MATERIAL_CATEGORIES[0]
	);
};

/**
 * Obtiene la configuración de nivel de dificultad
 */
export const getDifficultyConfig = (difficulty: string) => {
	return (
		DIFFICULTY_LEVELS.find((d) => d.id === difficulty) || DIFFICULTY_LEVELS[0]
	);
};

/**
 * Obtiene la configuración de una profesión
 */
export const getProfessionConfig = (profession: string) => {
	return TARGET_PROFESSIONS.find((p) => p.id === profession);
};

/**
 * Obtiene la configuración de una región
 */
export const getRegionConfig = (region: string) => {
	return ECUADOR_REGIONS.find((r) => r.id === region) || ECUADOR_REGIONS[1]; // Sierra por defecto
};

/**
 * Obtiene la configuración de una moneda
 */
export const getCurrencyConfig = (currency: string) => {
	return (
		SUPPORTED_CURRENCIES.find((c) => c.code === currency) ||
		SUPPORTED_CURRENCIES[0]
	);
};

// === FILTROS Y BÚSQUEDA ===

/**
 * Filtra plantillas por término de búsqueda
 */
export const filterTemplatesBySearch = (
	templates: MaterialCalculationTemplate[],
	searchTerm: string
): MaterialCalculationTemplate[] => {
	if (!searchTerm.trim()) return templates;

	const term = searchTerm.toLowerCase();

	return templates.filter(
		(template) =>
			template.name.toLowerCase().includes(term) ||
			template.description.toLowerCase().includes(term) ||
			template.tags?.some((tag) => tag.toLowerCase().includes(term)) ||
			template.type.toLowerCase().includes(term)
	);
};

/**
 * Filtra resultados por rango de fechas
 */
export const filterResultsByDateRange = (
	results: MaterialCalculationResult[],
	startDate: Date,
	endDate: Date
): MaterialCalculationResult[] => {
	return results.filter((result) => {
		const resultDate = new Date(result.createdAt);
		return resultDate >= startDate && resultDate <= endDate;
	});
};

/**
 * Ordena elementos por múltiples criterios
 */
export const sortByMultipleCriteria = <T>(
	items: T[],
	criteria: Array<{
		key: keyof T;
		direction: "asc" | "desc";
	}>
): T[] => {
	return [...items].sort((a, b) => {
		for (const criterion of criteria) {
			const {key, direction} = criterion;
			const aVal = a[key];
			const bVal = b[key];

			let comparison = 0;

			if (aVal < bVal) comparison = -1;
			else if (aVal > bVal) comparison = 1;

			if (comparison !== 0) {
				return direction === "asc" ? comparison : -comparison;
			}
		}

		return 0;
	});
};

// === UTILIDADES DE URL Y NAVEGACIÓN ===

/**
 * Construye una URL con parámetros de consulta
 */
export const buildUrlWithParams = (
	baseUrl: string,
	params: Record<string, string | number | boolean | undefined>
): string => {
	const url = new URL(baseUrl, window.location.origin);

	Object.entries(params).forEach(([key, value]) => {
		if (value !== undefined && value !== null && value !== "") {
			url.searchParams.set(key, String(value));
		}
	});

	return url.pathname + url.search;
};

/**
 * Extrae parámetros de consulta de la URL
 */
export const getUrlParams = (): Record<string, string> => {
	const params: Record<string, string> = {};
	const searchParams = new URLSearchParams(window.location.search);

	for (const [key, value] of searchParams.entries()) {
		params[key] = value;
	}

	return params;
};

// === UTILIDADES DE ALMACENAMIENTO ===

/**
 * Guarda datos en localStorage con manejo de errores
 */
export const saveToLocalStorage = (key: string, data: any): boolean => {
	try {
		localStorage.setItem(key, JSON.stringify(data));
		return true;
	} catch (error) {
		console.error("Error saving to localStorage:", error);
		return false;
	}
};

/**
 * Carga datos de localStorage con manejo de errores
 */
export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
	try {
		const item = localStorage.getItem(key);
		return item ? JSON.parse(item) : defaultValue;
	} catch (error) {
		console.error("Error loading from localStorage:", error);
		return defaultValue;
	}
};

/**
 * Elimina datos de localStorage
 */
export const removeFromLocalStorage = (key: string): boolean => {
	try {
		localStorage.removeItem(key);
		return true;
	} catch (error) {
		console.error("Error removing from localStorage:", error);
		return false;
	}
};

// === UTILIDADES DE ARCHIVOS ===

/**
 * Convierte bytes a formato legible
 */
export const formatFileSize = (bytes: number): string => {
	if (bytes === 0) return "0 Bytes";

	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Valida el tipo y tamaño de archivo
 */
export const validateFile = (
	file: File,
	allowedTypes: string[] = ["json", "csv", "xlsx"],
	maxSize: number = SYSTEM_LIMITS.maxFileSize
): {isValid: boolean; error?: string} => {
	// Validar tipo
	const fileExtension = file.name.split(".").pop()?.toLowerCase();
	if (!fileExtension || !allowedTypes.includes(fileExtension)) {
		return {
			isValid: false,
			error: `Tipo de archivo no permitido. Tipos permitidos: ${allowedTypes.join(", ")}`,
		};
	}

	// Validar tamaño
	if (file.size > maxSize) {
		return {
			isValid: false,
			error: `El archivo es demasiado grande. Tamaño máximo: ${formatFileSize(maxSize)}`,
		};
	}

	return {isValid: true};
};

// === UTILIDADES DE RENDIMIENTO ===

/**
 * Función de debounce
 */
export const debounce = <T extends (...args: any[]) => void>(
	func: T,
	delay: number
): ((...args: Parameters<T>) => void) => {
	let timeoutId: NodeJS.Timeout;

	return (...args: Parameters<T>) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => func(...args), delay);
	};
};

/**
 * Función de throttle
 */
export const throttle = <T extends (...args: any[]) => void>(
	func: T,
	delay: number
): ((...args: Parameters<T>) => void) => {
	let lastCall = 0;

	return (...args: Parameters<T>) => {
		const now = Date.now();
		if (now - lastCall >= delay) {
			lastCall = now;
			func(...args);
		}
	};
};

/**
 * Genera un ID único
 */
export const generateUniqueId = (): string => {
	return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Copia texto al portapapeles
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch (error) {
		console.error("Error copying to clipboard:", error);
		return false;
	}
};

/**
 * Trunca texto con elipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
	if (text.length <= maxLength) return text;
	return text.substring(0, maxLength - 3) + "...";
};

/**
 * Capitaliza la primera letra de cada palabra
 */
export const capitalizeWords = (text: string): string => {
	return text.replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Convierte camelCase a formato legible
 */
export const camelCaseToWords = (text: string): string => {
	return text
		.replace(/([A-Z])/g, " $1")
		.replace(/^./, (str) => str.toUpperCase())
		.trim();
};
