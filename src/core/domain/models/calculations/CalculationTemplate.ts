// src/core/domain/models/calculations/CalculationTemplate.ts

// ==================== PARÁMETROS ====================
export interface TemplateParameter {
	name: string;
	label: string;
	type: "number" | "text" | "select" | "boolean";
	unit?: string;
	required: boolean;
	min?: number;
	max?: number;
	options?: string[];
	defaultValue?: unknown;
	placeholder?: string;
	tooltip?: string;
	validation?: {
		pattern?: string;
		message?: string;
	};
}

// ==================== TEMPLATE PRINCIPAL ====================
export interface CalculationTemplate {
	id: string;
	name: string;
	description: string;
	type: string;
	targetProfession: string;
	formula: string;
	necReference: string;
	isActive: boolean;
	version: number;
	parentTemplateId?: string;
	source: "system" | "user" | "community" | "improved";
	createdBy?: string;
	isVerified: boolean;
	verifiedBy?: string;
	verifiedAt?: string;
	isFeatured: boolean;
	usageCount: number;
	averageRating: number;
	ratingCount: number;
	tags?: string[];
	shareLevel: "private" | "organization" | "public";
	difficulty?: string;
	estimatedTime?: number;
	complianceLevel?: string;
	parameters?: TemplateParameter[];
	createdAt: string;
	updatedAt: string;

	// Métodos computados
	isNew?: () => boolean;
	getTrendingScore?: () => number;
	getPopularityScore?: () => number;
}

// ==================== RESULTADO DE CÁLCULO ====================
export interface CalculationResult {
	id?: string;
	calculationTemplateId: string;
	projectId?: string;
	userId: string;
	inputParameters: Record<string, unknown>;
	results: Record<string, unknown>;
	isSaved: boolean;
	name?: string;
	notes?: string;
	executionTimeMs?: number;
	wasSuccessful: boolean;
	errorMessage?: string;
	usedInProject: boolean;
	ledToMaterialOrder: boolean;
	ledToBudget: boolean;
	createdAt?: string;
	updatedAt?: string;
}

// ==================== VALIDACIÓN ====================
export interface TemplateValidationResult {
	isValid: boolean;
	errors: Array<{
		field: string;
		message: string;
		type: string;
	}>;
	warnings: Array<{
		field: string;
		message: string;
		type: string;
	}>;
}

// ==================== EJECUCIÓN ====================
export interface CalculationExecution {
	id: string;
	templateId: string;
	userId: string;
	parameters: Record<string, unknown>;
	results?: CalculationResult;
	status: "pending" | "running" | "completed" | "failed";
	startedAt: string;
	completedAt?: string;
	duration?: number;
	error?: string;
}

// ==================== CLASE DE DOMINIO ====================
export class CalculationTemplateEntity implements CalculationTemplate {
	constructor(
		public readonly id: string,
		public readonly name: string,
		public readonly description: string,
		public readonly type: string,
		public readonly targetProfession: string,
		public readonly formula: string,
		public readonly necReference: string,
		public readonly isActive: boolean,
		public readonly version: number,
		public readonly source: "system" | "user" | "community" | "improved",
		public readonly isVerified: boolean,
		public readonly isFeatured: boolean,
		public readonly usageCount: number,
		public readonly averageRating: number,
		public readonly ratingCount: number,
		public readonly shareLevel: "private" | "organization" | "public",
		public readonly createdAt: string,
		public readonly updatedAt: string,
		public readonly parentTemplateId?: string,
		public readonly createdBy?: string,
		public readonly verifiedBy?: string,
		public readonly verifiedAt?: string,
		public readonly tags?: string[],
		public readonly difficulty?: string,
		public readonly estimatedTime?: number,
		public readonly complianceLevel?: string,
		public readonly parameters?: TemplateParameter[]
	) {}

	// Método para verificar si es nuevo (últimos 30 días)
	isNew(): boolean {
		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
		return new Date(this.createdAt) > thirtyDaysAgo;
	}

	// Método para calcular puntuación de tendencia
	getTrendingScore(): number {
		const usageWeight = 0.6;
		const ratingWeight = 0.3;
		const newWeight = 0.1;

		const normalizedUsage = Math.min(this.usageCount / 1000, 1);
		const normalizedRating = this.averageRating / 5;
		const isNewScore = this.isNew() ? 1 : 0;

		return (
			normalizedUsage * usageWeight +
			normalizedRating * ratingWeight +
			isNewScore * newWeight
		);
	}

	// Método para calcular puntuación de popularidad
	getPopularityScore(): number {
		return this.usageCount + this.averageRating * 10;
	}

	// Método para validar parámetros
	validateParameter(
		paramName: string,
		value: unknown
	): TemplateValidationResult {
		const errors: Array<{field: string; message: string; type: string}> = [];
		const warnings: Array<{field: string; message: string; type: string}> = [];

		const param = this.parameters?.find((p) => p.name === paramName);
		if (!param) {
			errors.push({
				field: paramName,
				message: "Parameter not found in template",
				type: "missing_parameter",
			});
			return {isValid: false, errors, warnings};
		}

		// Validación de requerido
		if (
			param.required &&
			(value === undefined || value === null || value === "")
		) {
			errors.push({
				field: paramName,
				message: "This field is required",
				type: "required",
			});
		}

		// Validación por tipo
		if (value !== undefined && value !== null && value !== "") {
			switch (param.type) {
				case "number":
					{ const numValue = Number(value);
					if (isNaN(numValue)) {
						errors.push({
							field: paramName,
							message: "Must be a valid number",
							type: "invalid_type",
						});
					} else {
						if (param.min !== undefined && numValue < param.min) {
							errors.push({
								field: paramName,
								message: `Minimum value is ${param.min}`,
								type: "min_value",
							});
						}
						if (param.max !== undefined && numValue > param.max) {
							errors.push({
								field: paramName,
								message: `Maximum value is ${param.max}`,
								type: "max_value",
							});
						}
					}
					break; }

				case "text":
					if (param.validation?.pattern) {
						const regex = new RegExp(param.validation.pattern);
						if (!regex.test(String(value))) {
							errors.push({
								field: paramName,
								message: param.validation.message || "Invalid format",
								type: "pattern_mismatch",
							});
						}
					}
					break;

				case "select":
					if (param.options && !param.options.includes(String(value))) {
						errors.push({
							field: paramName,
							message: "Value must be one of the allowed options",
							type: "invalid_option",
						});
					}
					break;
			}
		}

		return {
			isValid: errors.length === 0,
			errors,
			warnings,
		};
	}

	// Método para ejecutar la fórmula (simplificado)
	executeFormula(parameters: Record<string, unknown>): CalculationResult {
		try {
			// Validar todos los parámetros
			const allErrors: Array<{field: string; message: string; type: string}> =
				[];

			if (this.parameters) {
				for (const param of this.parameters) {
					const validation = this.validateParameter(
						param.name,
						parameters[param.name]
					);
					allErrors.push(...validation.errors);
				}
			}

			if (allErrors.length > 0) {
				return {
					calculationTemplateId: this.id,
					userId: "", // Se llenará desde el contexto
					inputParameters: parameters,
					results: {},
					isSaved: false,
					wasSuccessful: false,
					errorMessage: `Validation errors: ${allErrors.map((e) => e.message).join(", ")}`,
					usedInProject: false,
					ledToMaterialOrder: false,
					ledToBudget: false,
				};
			}

			// Aquí se ejecutaría la fórmula real
			// Por ahora retornamos un resultado de ejemplo
			const results = {
				calculatedAt: new Date().toISOString(),
				parameters: parameters,
				// Los resultados reales se calcularían ejecutando this.formula
			};

			return {
				calculationTemplateId: this.id,
				userId: "", // Se llenará desde el contexto
				inputParameters: parameters,
				results,
				isSaved: false,
				wasSuccessful: true,
				usedInProject: false,
				ledToMaterialOrder: false,
				ledToBudget: false,
			};
		} catch (error) {
			return {
				calculationTemplateId: this.id,
				userId: "",
				inputParameters: parameters,
				results: {},
				isSaved: false,
				wasSuccessful: false,
				errorMessage:
					error instanceof Error
						? error.message
						: "Unknown error during calculation",
				usedInProject: false,
				ledToMaterialOrder: false,
				ledToBudget: false,
			};
		}
	}
}
