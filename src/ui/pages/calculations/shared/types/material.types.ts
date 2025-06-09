// src/ui/pages/calculations/shared/types/material.types.ts

export enum MaterialCalculationType {
	WALLS_MASONRY = "walls_masonry",
	STAIRS = "stairs",
	SUBFLOORS = "subfloors",
	CERAMIC_FINISHES = "ceramic_finishes",
	CONCRETE_FOUNDATIONS = "concrete_foundations",
	ELECTRICAL_INSTALLATIONS = "electrical_installations",
	MELAMINE_FURNITURE = "melamine_furniture",
}

export interface MaterialParameter {
	id: string;
	name: string;
	description: string;
	dataType: "number" | "string" | "boolean" | "enum" | "array";
	scope: "input" | "output" | "calculation";
	displayOrder: number;
	isRequired: boolean;
	defaultValue?: string;
	minValue?: number;
	maxValue?: number;
	unitOfMeasure?: string;
	allowedValues?: string[];
	helpText?: string;
	dependsOnParameters?: string[];
	formula?: string;
}

export interface MaterialCalculationTemplate {
	id: string;
	name: string;
	description: string;
	type: MaterialCalculationType;
	subCategory?: string;
	formula: string;
	parameters: MaterialParameter[];
	isActive: boolean;
	isVerified: boolean;
	isFeatured: boolean;
	usageCount: number;
	averageRating: number;
	ratingCount: number;
	tags?: string[];
	author?: {
		id: string;
		name: string;
		profession: string;
	};
	createdAt: string;
	updatedAt: string;
}

export interface MaterialCalculationResult {
	id: string;
	templateId: string;
	templateName: string;
	templateType: MaterialCalculationType;
	inputParameters: Record<string, string | number | boolean | string[]>;
	results: Record<string, string | number | boolean | string[]>;
	materialQuantities: MaterialQuantity[];
	totalCost?: number;
	executionTime: number;
	wasSuccessful: boolean;
	errorMessage?: string;
	notes?: string;
	createdAt: string;
	userId: string;
	projectId?: string;
	isSaved: boolean;
	isShared: boolean;
}

export interface MaterialQuantity {
	materialType: string;
	quantity: number;
	unit: string;
	unitCost?: number;
	totalCost?: number;
	supplier?: string;
	notes?: string;
}

export interface MaterialCalculationFilters {
	type?: MaterialCalculationType;
	subCategory?: string;
	isFeatured?: boolean;
	searchTerm?: string;
	tags?: string[];
	minRating?: number;
	sortBy?: "name" | "rating" | "usage" | "date";
	sortOrder?: "asc" | "desc";
}

export interface MaterialTemplateStats {
	totalUsage: number;
	uniqueUsers: number;
	averageRating: number;
	successRate: number;
	trendScore: number;
	rankPosition?: number;
}

export interface MaterialExecutionRequest {
	templateId: string;
	templateType: MaterialCalculationType;
	inputParameters: Record<string, string | number | boolean | string[]>;
	projectId?: string;
	includeWaste?: boolean;
	regionalFactors?: Record<string, number>;
	currency?: string;
	notes?: string;
	saveResult?: boolean;
}

export interface MaterialTrendingTemplate {
	template: MaterialCalculationTemplate;
	stats: MaterialTemplateStats;
	growthRate: number;
	isRising: boolean;
}

export interface MaterialCategoryConfig {
	type: MaterialCalculationType;
	name: string;
	description: string;
	icon: string;
	color: string;
	subCategories: string[];
	commonParameters: string[];
	helpText: string;
}

// Configuración de categorías de materiales
export const MATERIAL_CATEGORIES: Record<
	MaterialCalculationType,
	MaterialCategoryConfig
> = {
	[MaterialCalculationType.WALLS_MASONRY]: {
		type: MaterialCalculationType.WALLS_MASONRY,
		name: "Paredes y Muros",
		description: "Cálculos para mampostería, ladrillos, bloques y morteros",
		icon: "🧱",
		color: "bg-amber-500",
		subCategories: ["Ladrillos", "Bloques", "Mortero", "Enlucidos", "Pintura"],
		commonParameters: ["area", "espesor", "tipoLadrillo", "junta"],
		helpText:
			"Calcula materiales necesarios para construcción de paredes, incluyendo ladrillos, mortero, y acabados.",
	},
	[MaterialCalculationType.STAIRS]: {
		type: MaterialCalculationType.STAIRS,
		name: "Escaleras",
		description: "Cálculos para escaleras de hormigón, madera y acabados",
		icon: "🏗️",
		color: "bg-blue-500",
		subCategories: ["Hormigón Armado", "Escalones", "Barandas", "Acabados"],
		commonParameters: ["huella", "contrahuella", "ancho", "altura"],
		helpText:
			"Calcula hormigón, acero, encofrados y acabados para construcción de escaleras.",
	},
	[MaterialCalculationType.SUBFLOORS]: {
		type: MaterialCalculationType.SUBFLOORS,
		name: "Contrapisos y Losas",
		description: "Cálculos para contrapisos, losas y fundaciones",
		icon: "⬜",
		color: "bg-gray-500",
		subCategories: ["Contrapiso Pobre", "Losa Hormigón", "Arcilla Expandida"],
		commonParameters: ["area", "espesor", "resistencia"],
		helpText:
			"Calcula materiales para contrapisos, losas de hormigón y bases estructurales.",
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

// Configuración de iconos y colores para el UI
export const MATERIAL_UI_CONFIG = {
	defaultTransition: "transition-all duration-200 ease-in-out",
	cardHover: "hover:shadow-lg hover:scale-[1.02]",
	primaryGradient: "bg-gradient-to-r from-blue-600 to-purple-600",
	successGradient: "bg-gradient-to-r from-green-500 to-emerald-600",
	warningGradient: "bg-gradient-to-r from-orange-500 to-red-500",
	glassEffect: "backdrop-blur-sm bg-white/80 dark:bg-gray-800/80",
	shadowStyle: "shadow-xl shadow-blue-500/10 dark:shadow-blue-400/20",
} as const;
