// src/ui/utils/materialCalculationHelpers.ts
// Utilidades específicas para cálculos de materiales

export class MaterialCalculationHelpers {
	/**
	 * Formatea números para mostrar en la UI
	 */
	static formatNumber(value: number, decimals: number = 2): string {
		if (isNaN(value) || !isFinite(value)) return "0";

		if (Math.abs(value) >= 1000000) {
			return (value / 1000000).toFixed(1) + "M";
		} else if (Math.abs(value) >= 1000) {
			return (value / 1000).toFixed(1) + "K";
		}

		return value.toLocaleString("es-EC", {
			minimumFractionDigits: 0,
			maximumFractionDigits: decimals,
		});
	}

	/**
	 * Formatea costos en formato de moneda
	 */
	static formatCurrency(value: number, currency: string = "USD"): string {
		return new Intl.NumberFormat("es-EC", {
			style: "currency",
			currency: currency,
			minimumFractionDigits: 2,
		}).format(value);
	}

	/**
	 * Calcula porcentaje de diferencia entre dos valores
	 */
	static calculatePercentageDifference(value1: number, value2: number): number {
		if (value2 === 0) return value1 === 0 ? 0 : 100;
		return ((value1 - value2) / value2) * 100;
	}

	/**
	 * Valida parámetros de entrada
	 */
	static validateParameter(
		value: any,
		type: string,
		constraints?: any
	): {isValid: boolean; error?: string} {
		if (value === null || value === undefined || value === "") {
			return {isValid: false, error: "Valor requerido"};
		}

		switch (type) {
			case "number":
				const numValue = parseFloat(value);
				if (isNaN(numValue)) {
					return {isValid: false, error: "Debe ser un número válido"};
				}
				if (constraints?.min !== undefined && numValue < constraints.min) {
					return {isValid: false, error: `Valor mínimo: ${constraints.min}`};
				}
				if (constraints?.max !== undefined && numValue > constraints.max) {
					return {isValid: false, error: `Valor máximo: ${constraints.max}`};
				}
				break;

			case "string":
				if (constraints?.minLength && value.length < constraints.minLength) {
					return {
						isValid: false,
						error: `Mínimo ${constraints.minLength} caracteres`,
					};
				}
				if (constraints?.maxLength && value.length > constraints.maxLength) {
					return {
						isValid: false,
						error: `Máximo ${constraints.maxLength} caracteres`,
					};
				}
				break;

			case "enum":
				if (
					constraints?.allowedValues &&
					!constraints.allowedValues.includes(value)
				) {
					return {isValid: false, error: "Valor no válido"};
				}
				break;
		}

		return {isValid: true};
	}

	/**
	 * Genera un resumen de materiales por categoría
	 */
	static summarizeMaterialsByCategory(
		materials: any[]
	): Record<string, {count: number; totalCost: number}> {
		return materials.reduce((summary, material) => {
			const category = material.materialType || "Sin categoría";

			if (!summary[category]) {
				summary[category] = {count: 0, totalCost: 0};
			}

			summary[category].count += material.quantity || 0;
			summary[category].totalCost += material.totalCost || 0;

			return summary;
		}, {});
	}

	/**
	 * Calcula estadísticas de comparación
	 */
	static calculateComparisonStats(results: MaterialCalculationResult[]): {
		cheapest: MaterialCalculationResult;
		mostExpensive: MaterialCalculationResult;
		averageCost: number;
		costVariation: number;
	} {
		if (results.length === 0) {
			throw new Error("No hay resultados para comparar");
		}

		const costs = results.map((r) => r.totalCost || 0);
		const cheapest = results.find((r) => r.totalCost === Math.min(...costs))!;
		const mostExpensive = results.find(
			(r) => r.totalCost === Math.max(...costs)
		)!;
		const averageCost =
			costs.reduce((sum, cost) => sum + cost, 0) / costs.length;
		const costVariation =
			((Math.max(...costs) - Math.min(...costs)) / averageCost) * 100;

		return {
			cheapest,
			mostExpensive,
			averageCost,
			costVariation,
		};
	}

	/**
	 * Genera recomendaciones basadas en el uso
	 */
	static generateRecommendations(
		userHistory: any[],
		availableTemplates: MaterialCalculationTemplate[]
	): {
		recommended: MaterialCalculationTemplate[];
		trending: MaterialCalculationTemplate[];
		similar: MaterialCalculationTemplate[];
	} {
		// Lógica simplificada de recomendación
		const userCategories = Array.from(
			new Set(userHistory.map((h) => h.templateType))
		);

		const recommended = availableTemplates
			.filter((t) => userCategories.includes(t.type))
			.sort((a, b) => b.averageRating - a.averageRating)
			.slice(0, 5);

		const trending = availableTemplates
			.filter((t) => t.isFeatured)
			.sort((a, b) => b.usageCount - a.usageCount)
			.slice(0, 5);

		const similar = availableTemplates
			.filter((t) => !recommended.includes(t) && !trending.includes(t))
			.sort((a, b) => b.averageRating - a.averageRating)
			.slice(0, 5);

		return {recommended, trending, similar};
	}

	/**
	 * Valida fórmula JavaScript
	 */
	static validateFormula(
		formula: string,
		parameters: string[]
	): {isValid: boolean; error?: string} {
		try {
			// Verificar sintaxis básica
			new Function(...parameters, formula);

			// Verificar que no use métodos peligrosos
			const dangerousPatterns = [
				/eval\s*\(/,
				/Function\s*\(/,
				/setTimeout\s*\(/,
				/setInterval\s*\(/,
				/require\s*\(/,
				/import\s+/,
				/export\s+/,
				/window\./,
				/document\./,
				/localStorage\./,
				/sessionStorage\./,
			];

			for (const pattern of dangerousPatterns) {
				if (pattern.test(formula)) {
					return {
						isValid: false,
						error: "La fórmula contiene código no permitido",
					};
				}
			}

			return {isValid: true};
		} catch (error) {
			return {isValid: false, error: `Error de sintaxis: ${error.message}`};
		}
	}

	/**
	 * Calcula factores de desperdicio regionales
	 */
	static calculateRegionalWasteFactor(
		materialType: string,
		region: string
	): number {
		// Factores de desperdicio por tipo de material y región
		const wasteFactors: Record<string, Record<string, number>> = {
			ladrillo: {
				costa: 0.08,
				sierra: 0.05,
				oriente: 0.12,
			},
			cemento: {
				costa: 0.05,
				sierra: 0.03,
				oriente: 0.08,
			},
			ceramico: {
				costa: 0.12,
				sierra: 0.1,
				oriente: 0.15,
			},
		};

		const regionNormalized = region.toLowerCase();
		const materialNormalized = materialType.toLowerCase();

		return wasteFactors[materialNormalized]?.[regionNormalized] || 0.1; // 10% por defecto
	}

	/**
	 * Convierte unidades
	 */
	static convertUnits(value: number, fromUnit: string, toUnit: string): number {
		const conversions: Record<string, Record<string, number>> = {
			m: {cm: 100, mm: 1000, ft: 3.28084},
			cm: {m: 0.01, mm: 10, ft: 0.0328084},
			m2: {cm2: 10000, ft2: 10.7639},
			m3: {cm3: 1000000, ft3: 35.3147, l: 1000},
			kg: {g: 1000, lb: 2.20462, t: 0.001},
		};

		const factor = conversions[fromUnit]?.[toUnit];
		return factor ? value * factor : value;
	}
}

// src/ui/pages/calculations/materials/components/SharedComponents.tsx
// Componentes compartidos para el módulo de materiales

import React from "react";

export const LoadingSpinner: React.FC<{size?: "sm" | "md" | "lg"}> = ({
	size = "md",
}) => {
	const sizeClasses = {
		sm: "h-4 w-4",
		md: "h-8 w-8",
		lg: "h-12 w-12",
	};

	return (
		<div
			className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]}`}
		/>
	);
};

export const EmptyState: React.FC<{
	icon: string;
	title: string;
	description: string;
	action?: {
		label: string;
		onClick: () => void;
	};
}> = ({icon, title, description, action}) => (
	<div className="text-center py-12">
		<div className="text-6xl mb-4">{icon}</div>
		<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
			{title}
		</h3>
		<p className="text-gray-600 dark:text-gray-300 mb-6">{description}</p>
		{action && (
			<button
				onClick={action.onClick}
				className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
			>
				{action.label}
			</button>
		)}
	</div>
);

export const ErrorBoundary: React.FC<{children: React.ReactNode}> = ({
	children,
}) => {
	const [hasError, setHasError] = React.useState(false);

	React.useEffect(() => {
		const handleError = () => setHasError(true);
		window.addEventListener("error", handleError);
		return () => window.removeEventListener("error", handleError);
	}, []);

	if (hasError) {
		return (
			<EmptyState
				icon="⚠️"
				title="Error en la Aplicación"
				description="Ha ocurrido un error inesperado. Por favor, recarga la página."
				action={{
					label: "Recargar Página",
					onClick: () => window.location.reload(),
				}}
			/>
		);
	}

	return <>{children}</>;
};

export const FeatureFlag: React.FC<{
	feature: string;
	children: React.ReactNode;
	fallback?: React.ReactNode;
}> = ({feature, children, fallback = null}) => {
	// En una implementación real, esto consultaría un servicio de feature flags
	const enabledFeatures = [
		"material-comparison",
		"advanced-analytics",
		"template-sharing",
	];

	return enabledFeatures.includes(feature) ? <>{children}</> : <>{fallback}</>;
};

// Hook personalizado para manejo de errores
export const useErrorHandler = () => {
	const [error, setError] = React.useState<string | null>(null);

	const handleError = React.useCallback((error: any) => {
		console.error("Error en cálculos de materiales:", error);
		setError(error.message || "Error desconocido");
	}, []);

	const clearError = React.useCallback(() => {
		setError(null);
	}, []);

	return {error, handleError, clearError};
};

// Hook para persistencia local
export const useLocalStorage = <T,>(key: string, initialValue: T) => {
	const [storedValue, setStoredValue] = React.useState<T>(() => {
		try {
			const item = window.localStorage.getItem(key);
			return item ? JSON.parse(item) : initialValue;
		} catch (error) {
			console.error(`Error loading from localStorage key "${key}":`, error);
			return initialValue;
		}
	});

	const setValue = React.useCallback(
		(value: T | ((val: T) => T)) => {
			try {
				const valueToStore =
					value instanceof Function ? value(storedValue) : value;
				setStoredValue(valueToStore);
				window.localStorage.setItem(key, JSON.stringify(valueToStore));
			} catch (error) {
				console.error(`Error saving to localStorage key "${key}":`, error);
			}
		},
		[key, storedValue]
	);

	return [storedValue, setValue] as const;
};
