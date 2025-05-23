// core/domain/models/calculations/CalculationTemplate.ts

export interface TemplateParameter {
	name: string;
	label: string;
	type: "number" | "text" | "select" | "boolean";
	unit?: string;
	required: boolean;
	min?: number;
	max?: number;
	options?: string[];
	defaultValue?: any;
	placeholder?: string;
	tooltip?: string;
	validation?: {
		pattern?: string;
		message?: string;
	};
}

export interface CalculationResult {
	[key: string]: any;
	calculationId?: string;
	templateId?: string;
	timestamp?: string;
	inputs?: Record<string, any>;
	outputs?: Record<string, any>;
	metadata?: {
		executionTime?: number;
		necCompliance?: boolean;
		warnings?: string[];
		recommendations?: string[];
	};
}

export class CalculationTemplate {
	constructor(
		public readonly id: string,
		public readonly name: string,
		public readonly description: string,
		public readonly type: string,
		public readonly targetProfession: string,
		public readonly formula: string,
		public readonly necReference: string,
		public readonly version: string,
		public readonly parameters: TemplateParameter[],
		public readonly isActive: boolean = true,
		public readonly isVerified: boolean = false,
		public readonly isFeatured: boolean = false,
		public readonly usageCount: number = 0,
		public readonly averageRating: number = 0,
		public readonly ratingCount: number = 0,
		public readonly shareLevel:
			| "private"
			| "public"
			| "organization" = "private",
		public readonly tags: string[] = [],
		public readonly createdBy?: string,
		public readonly createdAt: Date = new Date(),
		public readonly updatedAt: Date = new Date()
	) {}

	// Métodos de dominio
	public isPublic(): boolean {
		return this.shareLevel === "public";
	}

	public canBeUsedBy(profession: string): boolean {
		return this.targetProfession === profession || this.shareLevel === "public";
	}

	public getDifficultyLevel(): "basic" | "intermediate" | "advanced" {
		// Lógica de dominio para determinar dificultad
		if (
			this.type.includes("advanced") ||
			this.targetProfession === "civil_engineer"
		) {
			return "advanced";
		} else if (this.type.includes("intermediate") || this.usageCount > 50) {
			return "intermediate";
		}
		return "basic";
	}

	public isTrending(): boolean {
		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

		return (
			this.usageCount > 100 &&
			this.averageRating > 4 &&
			this.updatedAt > thirtyDaysAgo
		);
	}

	public isNew(): boolean {
		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

		return this.createdAt > thirtyDaysAgo;
	}

	public hasValidParameters(): boolean {
		return (
			this.parameters.length > 0 &&
			this.parameters.every((param) => param.name && param.label && param.type)
		);
	}

	public getEstimatedTime(): string {
		// Lógica de dominio para estimar tiempo
		const paramCount = this.parameters.length;
		const complexityFactor = this.getDifficultyLevel() === "advanced" ? 2 : 1;

		const minutes = Math.max(5, paramCount * 2 * complexityFactor);

		if (minutes <= 10) return "5-10 min";
		if (minutes <= 20) return "10-20 min";
		if (minutes <= 30) return "20-30 min";
		return "30+ min";
	}

	public executeFormula(parameters: Record<string, any>): CalculationResult {
		// Validar parámetros requeridos
		const missingParams = this.parameters
			.filter(
				(param) => param.required && !parameters.hasOwnProperty(param.name)
			)
			.map((param) => param.name);

		if (missingParams.length > 0) {
			throw new Error(
				`Missing required parameters: ${missingParams.join(", ")}`
			);
		}

		// Validar tipos y rangos
		for (const param of this.parameters) {
			const value = parameters[param.name];
			if (value !== undefined && value !== null) {
				if (param.type === "number") {
					const numValue = Number(value);
					if (isNaN(numValue)) {
						throw new Error(`Parameter ${param.name} must be a number`);
					}
					if (param.min !== undefined && numValue < param.min) {
						throw new Error(`Parameter ${param.name} must be >= ${param.min}`);
					}
					if (param.max !== undefined && numValue > param.max) {
						throw new Error(`Parameter ${param.name} must be <= ${param.max}`);
					}
				}
			}
		}

		try {
			// Ejecutar fórmula de manera segura
			const startTime = Date.now();
			const func = new Function(...Object.keys(parameters), this.formula);
			const result = func(...Object.values(parameters));
			const executionTime = Date.now() - startTime;

			return {
				calculationId: `calc_${Date.now()}`,
				templateId: this.id,
				timestamp: new Date().toISOString(),
				inputs: parameters,
				outputs: result,
				metadata: {
					executionTime,
					necCompliance: this.isVerified,
					warnings: [],
					recommendations: [],
				},
			};
		} catch (error) {
			throw new Error(`Formula execution failed: ${error.message}`);
		}
	}

	public validateParameter(
		paramName: string,
		value: any
	): {isValid: boolean; error?: string} {
		const param = this.parameters.find((p) => p.name === paramName);

		if (!param) {
			return {isValid: false, error: "Parameter not found"};
		}

		if (
			param.required &&
			(value === undefined || value === null || value === "")
		) {
			return {isValid: false, error: "This field is required"};
		}

		if (value !== undefined && value !== null && value !== "") {
			switch (param.type) {
				case "number":
					const numValue = Number(value);
					if (isNaN(numValue)) {
						return {isValid: false, error: "Must be a valid number"};
					}
					if (param.min !== undefined && numValue < param.min) {
						return {isValid: false, error: `Minimum value is ${param.min}`};
					}
					if (param.max !== undefined && numValue > param.max) {
						return {isValid: false, error: `Maximum value is ${param.max}`};
					}
					break;

				case "text":
					if (param.validation?.pattern) {
						const regex = new RegExp(param.validation.pattern);
						if (!regex.test(String(value))) {
							return {
								isValid: false,
								error: param.validation.message || "Invalid format",
							};
						}
					}
					break;

				case "select":
					if (param.options && !param.options.includes(String(value))) {
						return {isValid: false, error: "Please select a valid option"};
					}
					break;
			}
		}

		return {isValid: true};
	}

	// Factory methods
	static fromAPIData(data: any): CalculationTemplate {
		return new CalculationTemplate(
			data.id,
			data.name,
			data.description,
			data.type,
			data.targetProfession || data.target_profession,
			data.formula,
			data.necReference || data.nec_reference,
			data.version,
			data.parameters || [],
			data.isActive ?? data.is_active ?? true,
			data.isVerified ?? data.is_verified ?? false,
			data.isFeatured ?? data.is_featured ?? false,
			data.usageCount ?? data.usage_count ?? 0,
			data.averageRating ?? data.average_rating ?? 0,
			data.ratingCount ?? data.rating_count ?? 0,
			data.shareLevel ?? data.share_level ?? "private",
			data.tags || [],
			data.createdBy ?? data.created_by,
			data.createdAt
				? new Date(data.createdAt)
				: new Date(data.created_at || Date.now()),
			data.updatedAt
				? new Date(data.updatedAt)
				: new Date(data.updated_at || Date.now())
		);
	}

	toAPIData(): any {
		return {
			id: this.id,
			name: this.name,
			description: this.description,
			type: this.type,
			target_profession: this.targetProfession,
			formula: this.formula,
			nec_reference: this.necReference,
			version: this.version,
			parameters: this.parameters,
			is_active: this.isActive,
			is_verified: this.isVerified,
			is_featured: this.isFeatured,
			usage_count: this.usageCount,
			average_rating: this.averageRating,
			rating_count: this.ratingCount,
			share_level: this.shareLevel,
			tags: this.tags,
			created_by: this.createdBy,
			created_at: this.createdAt.toISOString(),
			updated_at: this.updatedAt.toISOString(),
		};
	}
}
