// src/ui/pages/calculations/shared/types/material.types.ts

export enum MaterialCalculationType {
	STEEL_STRUCTURES = "STEEL_STRUCTURES",
	CERAMIC_FINISHES = "CERAMIC_FINISHES",
	CONCRETE_FOUNDATIONS = "CONCRETE_FOUNDATIONS",
	ELECTRICAL_INSTALLATIONS = "ELECTRICAL_INSTALLATIONS",
	MELAMINE_FURNITURE = "MELAMINE_FURNITURE",
}

export interface MaterialTemplateFilters {
	isFeatured?: boolean;
	type?: MaterialCalculationType;
	sortBy?: string;
	search?: string;
	tags?: string[];
	sortOrder: "asc"|"desc";
}

export enum ParameterDataType {
	NUMBER = "number",
	STRING = "string",
	BOOLEAN = "boolean",
	ENUM = "enum",
	ARRAY = "array",
}

export enum ParameterScope {
	INPUT = "input",
	OUTPUT = "output",
	INTERMEDIATE = "intermediate",
}

export interface MaterialParameter {
	id: string;
	name: string;
	description: string;
	dataType: ParameterDataType;
	scope: ParameterScope;
	displayOrder: number;
	isRequired: boolean;
	defaultValue?: string | number | boolean;
	minValue?: number;
	maxValue?: number;
	step?: number;
	regexPattern?: string;
	unitOfMeasure?: string;
	allowedValues?: string[];
	helpText?: string;
	dependsOnParameters?: string[];
	formula?: string;
	calculationTemplateId: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface MaterialCalculationTemplate {
	id: string;
	name: string;
	description: string;
	longDescription?: string;
	type: MaterialCalculationType;
	subCategory?: string;
	formula: string;
	targetProfessions?: string[];
	isActive: boolean;
	version: number;
	parentTemplateId?: string;
	source: "system" | "user" | "community";
	createdBy?: string;
	isVerified: boolean;
	verifiedBy?: string;
	verifiedAt?: Date;
	isFeatured: boolean;
	usageCount: number;
	averageRating: number;
	ratingCount: number;
	tags?: string[];
	shareLevel: "private" | "team" | "public";
	necReference?: string;
	difficulty?: "basic" | "intermediate" | "advanced";
	estimatedTime?: string;
	requirements?: string[];
	applicationCases?: string[];
	limitations?: string[];
	createdAt: Date;
	updatedAt: Date;
	parameters: MaterialParameter[];
}

export interface MaterialQuantity {
	id: string;
	name: string;
	description?: string;
	quantity: number;
	unit: string;
	unitPrice?: number;
	totalPrice?: number;
	category?: string;
	specifications?: string;
	supplier?: string;
	wastePercentage?: number;
	finalQuantity?: number;
}

export interface MaterialCalculationResult {
	id: string;
	templateId: string;
	templateName: string;
	templateType: MaterialCalculationType;
	userId: string;
	projectId?: string;
	inputParameters: Record<string, string | number | boolean>; // CORREGIDO: Era 'any'
	outputParameters: Record<string, string | number | boolean>; // CORREGIDO: Era 'any'
	materialQuantities: MaterialQuantity[];
	executionTime: number;
	wasSuccessful: boolean;
	errorMessage?: string;
	includeWaste: boolean;
	wastePercentage?: number;
	regionalFactors: string;
	currency: string;
	totalEstimatedCost?: number;
	notes?: string;
	version: number;
	metadata?: Record<string, unknown>;
	createdAt: Date;
	updatedAt: Date;
}

export interface MaterialExecutionRequest {
	templateId: string;
	templateType: MaterialCalculationType;
	inputParameters: Record<string, string | number | boolean>;
	projectId?: string;
	includeWaste?: boolean;
	regionalFactors?: string;
	currency?: string;
	notes?: string;
	saveResult?: boolean;
}

export interface MaterialCalculationFilters {
	type?: MaterialCalculationType;
	subCategory?: string;
	isFeatured?: boolean;
	searchTerm?: string;
	tags?: string[];
	minRating?: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
	page?: number;
	limit?: number;
}

export interface MaterialTrendingTemplate {
	id: string;
	templateId: string;
	templateName: string;
	templateType: MaterialCalculationType;
	period: "daily" | "weekly" | "monthly" | "yearly";
	periodStart: Date;
	periodEnd: Date;
	usageCount: number;
	uniqueUsers: number;
	successRate: number;
	averageExecutionTime: number;
	rankPosition: number;
	trendScore: number;
	template?: MaterialCalculationTemplate;
	createdAt: Date;
	updatedAt: Date;
}

export interface MaterialUsageLog {
	id: string;
	templateId: string;
	templateType: MaterialCalculationType;
	userId: string;
	projectId?: string;
	calculationResultId: string;
	usageDate: Date;
	executionTimeMs: number;
	wasSuccessful: boolean;
	totalMaterialsCalculated: number;
	wasteIncluded: boolean;
	regionUsed: string;
	ipAddress?: string;
	userAgent?: string;
	createdAt: Date;
}

export interface MaterialAnalytics {
	period: string;
	totalCalculations: number;
	uniqueUsers: number;
	averageExecutionTime: number;
	successRate: number;
	topTemplates: Array<{
		templateId: string;
		templateName: string;
		usageCount: number;
		averageRating: number;
	}>;
	calculationsByType: Record<MaterialCalculationType, number>;
	calculationsByRegion: Record<string, number>;
	growthRates?: {
		calculations: number;
		users: number;
		templates: number;
	};
	comparisons?: {
		previousPeriod: {
			calculations: number;
			users: number;
			successRate: number;
		};
	};
}

export interface MaterialComparison {
	id: string;
	name: string;
	description?: string;
	userId: string;
	results: MaterialCalculationResult[];
	comparisonType: "template" | "parameters" | "results";
	metadata?: Record<string, unknown>;
	isPublic: boolean;
	tags?: string[];
	createdAt: Date;
	updatedAt: Date;
}

// Configuración de UI para materiales
export const MATERIAL_UI_CONFIG = {
	// Transiciones y animaciones
	defaultTransition: "transition-all duration-200 ease-in-out",
	cardHover: "hover:shadow-lg hover:scale-[1.02]",
	buttonHover: "hover:shadow-md hover:scale-105",

	// Gradientes
	primaryGradient: "bg-gradient-to-r from-primary-600 to-primary-700",
	successGradient: "bg-gradient-to-r from-emerald-500 to-emerald-600",
	warningGradient: "bg-gradient-to-r from-amber-500 to-amber-600",
	errorGradient: "bg-gradient-to-r from-red-500 to-red-600",

	// Efectos de cristal
	glassEffect: "backdrop-blur-sm bg-white/80 border border-white/20",
	darkGlassEffect: "backdrop-blur-sm bg-gray-800/80 border border-gray-700/20",

	// Sombras
	shadowStyle: "shadow-xl shadow-primary-500/10",
	hoverShadow: "hover:shadow-2xl hover:shadow-primary-500/20",

	// Colores por tipo de material
	typeColors: {
		[MaterialCalculationType.STEEL_STRUCTURES]: {
			bg: "bg-slate-50",
			border: "border-slate-200",
			text: "text-slate-700",
			accent: "text-slate-600",
		},
		[MaterialCalculationType.CERAMIC_FINISHES]: {
			bg: "bg-emerald-50",
			border: "border-emerald-200",
			text: "text-emerald-700",
			accent: "text-emerald-600",
		},
		[MaterialCalculationType.CONCRETE_FOUNDATIONS]: {
			bg: "bg-stone-50",
			border: "border-stone-200",
			text: "text-stone-700",
			accent: "text-stone-600",
		},
		[MaterialCalculationType.ELECTRICAL_INSTALLATIONS]: {
			bg: "bg-yellow-50",
			border: "border-yellow-200",
			text: "text-yellow-700",
			accent: "text-yellow-600",
		},
		[MaterialCalculationType.MELAMINE_FURNITURE]: {
			bg: "bg-orange-50",
			border: "border-orange-200",
			text: "text-orange-700",
			accent: "text-orange-600",
		},
	},
} as const;

// Configuración específica por tipo de material
export const MATERIAL_TYPE_CONFIG = {
	[MaterialCalculationType.STEEL_STRUCTURES]: {
		type: MaterialCalculationType.STEEL_STRUCTURES,
		name: "Estructuras de Acero",
		description: "Cálculos para perfiles, placas y conexiones de acero",
		icon: "🔩",
		color: "bg-slate-500",
		subCategories: ["Perfiles", "Placas", "Conexiones", "Soldaduras"],
		commonParameters: ["perfil", "longitud", "espesor", "resistencia"],
		helpText:
			"Calcula pesos, dimensiones y especificaciones para estructuras de acero.",
	},
	[MaterialCalculationType.CERAMIC_FINISHES]: {
		type: MaterialCalculationType.CERAMIC_FINISHES,
		name: "Acabados Cerámicos",
		description: "Cálculos para cerámicos, porcelanato y adhesivos",
		icon: "🔲",
		color: "bg-emerald-500",
		subCategories: ["Cerámicos", "Porcelanato", "Adhesivos", "Fragüe"],
		commonParameters: ["dimensionPieza", "area", "patron", "junta"],
		helpText:
			"Calcula piezas cerámicas, adhesivos, fragüe y materiales para acabados.",
	},
	[MaterialCalculationType.CONCRETE_FOUNDATIONS]: {
		type: MaterialCalculationType.CONCRETE_FOUNDATIONS,
		name: "Fundiciones y Hormigón",
		description: "Cálculos para diferentes tipos y resistencias de hormigón",
		icon: "🏗️",
		color: "bg-stone-500",
		subCategories: ["f'c=150", "f'c=210", "f'c=240", "Aditivos"],
		commonParameters: ["volumen", "resistencia", "dosificacion"],
		helpText:
			"Calcula cemento, arena, grava y agua para diferentes resistencias de hormigón.",
	},
	[MaterialCalculationType.ELECTRICAL_INSTALLATIONS]: {
		type: MaterialCalculationType.ELECTRICAL_INSTALLATIONS,
		name: "Instalaciones Eléctricas",
		description: "Cálculos para cables, tuberías y accesorios eléctricos",
		icon: "⚡",
		color: "bg-yellow-500",
		subCategories: ["Conductores", "Tuberías", "Tomacorrientes", "Iluminación"],
		commonParameters: ["corriente", "distancia", "tipoInstalacion"],
		helpText:
			"Calcula cables, tuberías conduit, cajas y accesorios para instalaciones eléctricas.",
	},
	[MaterialCalculationType.MELAMINE_FURNITURE]: {
		type: MaterialCalculationType.MELAMINE_FURNITURE,
		name: "Muebles de Melamina",
		description: "Cálculos para muebles modulares y carpintería",
		icon: "🗄️",
		color: "bg-orange-500",
		subCategories: ["Planchas", "Herrajes", "Tapacanto", "Accesorios"],
		commonParameters: ["dimensiones", "espesorPlancha", "tipoMueble"],
		helpText:
			"Calcula planchas de melamina, herrajes y accesorios para muebles modulares.",
	},
};

// Helper functions
export const getMaterialTypeConfig = (type: MaterialCalculationType) => {
	return MATERIAL_TYPE_CONFIG[type];
};

export const getMaterialTypeColors = (type: MaterialCalculationType) => {
	return MATERIAL_UI_CONFIG.typeColors[type];
};

export const formatMaterialQuantity = (
	quantity: number,
	unit: string
): string => {
	return `${quantity.toLocaleString("es-EC", {maximumFractionDigits: 2})} ${unit}`;
};

export const formatMaterialPrice = (
	price: number,
	currency: string = "USD"
): string => {
	return new Intl.NumberFormat("es-EC", {
		style: "currency",
		currency: currency,
	}).format(price);
};

export const calculateWasteQuantity = (
	baseQuantity: number,
	wastePercentage: number
): number => {
	return baseQuantity * (1 + wastePercentage / 100);
};

export const getRegionalWasteFactor = (
	region: string,
	materialType: MaterialCalculationType
): number => {
	const factors: Record<string, Record<MaterialCalculationType, number>> = {
		costa: {
			[MaterialCalculationType.STEEL_STRUCTURES]: 0.05,
			[MaterialCalculationType.CERAMIC_FINISHES]: 0.1,
			[MaterialCalculationType.CONCRETE_FOUNDATIONS]: 0.08,
			[MaterialCalculationType.ELECTRICAL_INSTALLATIONS]: 0.06,
			[MaterialCalculationType.MELAMINE_FURNITURE]: 0.12,
		},
		sierra: {
			[MaterialCalculationType.STEEL_STRUCTURES]: 0.04,
			[MaterialCalculationType.CERAMIC_FINISHES]: 0.08,
			[MaterialCalculationType.CONCRETE_FOUNDATIONS]: 0.06,
			[MaterialCalculationType.ELECTRICAL_INSTALLATIONS]: 0.05,
			[MaterialCalculationType.MELAMINE_FURNITURE]: 0.1,
		},
		oriente: {
			[MaterialCalculationType.STEEL_STRUCTURES]: 0.06,
			[MaterialCalculationType.CERAMIC_FINISHES]: 0.12,
			[MaterialCalculationType.CONCRETE_FOUNDATIONS]: 0.1,
			[MaterialCalculationType.ELECTRICAL_INSTALLATIONS]: 0.08,
			[MaterialCalculationType.MELAMINE_FURNITURE]: 0.15,
		},
	};

	return factors[region]?.[materialType] || 0.08; // 8% por defecto
};
