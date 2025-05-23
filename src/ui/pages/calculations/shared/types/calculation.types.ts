// src/ui/pages/calculations/shared/types/calculation.types.ts

export interface CalculationTemplate {
	id: string;
	name: string;
	description: string;
	category: "structural" | "electrical" | "architectural" | "hydraulic";
	subcategory: string;
	profession: string[];
	difficulty: "basic" | "intermediate" | "advanced";
	estimatedTime: string;
	necReference: string;
	verified: boolean;
	rating: number;
	usageCount: number;
	isFavorite: boolean;
	isNew: boolean;
	tags: string[];
	parameters: CalculationParameter[];
	lastUpdated: string;
	version: string;
	requirements?: string[];
	isPublic?: boolean;
	isActive: boolean;
	createdBy?: string;
}

export interface CalculationParameter {
	id: string;
	name: string;
	label: string;
	type: "number" | "select" | "text" | "boolean";
	unit?: string;
	required: boolean;
	defaultValue?: string | number | boolean;
	minValue?: number;
	maxValue?: number;
	options?: string[];
	description: string;
	typicalRange?: string;
}

export interface CalculationResult {
	id: string;
	templateId: string;
	name: string;
	parameters: Record<string, any>;
	results: {
		mainResult: {
			label: string;
			value: string;
			unit: string;
		};
		breakdown: Array<{
			label: string;
			value: string;
			unit?: string;
			factor?: string;
		}>;
		recommendations: Array<{
			type: "warning" | "info" | "success";
			title: string;
			description: string;
		}>;
		compliance: {
			isCompliant: boolean;
			necReference: string;
			notes: string[];
		};
	};
	createdAt: string;
	lastModified: string;
	usedInProject?: boolean;
	projectId?: string;
}

export interface QuickStat {
	label: string;
	value: string | number;
	change?: number;
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
	color: string;
}

export interface RecentActivity {
	id: string;
	type: "calculation" | "template" | "collaboration";
	title: string;
	description: string;
	timestamp: string;
	status?: "completed" | "draft" | "shared";
}

export interface NavigationItem {
	id: string;
	name: string;
	description: string;
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
	route: string;
	badge?: number;
	isNew?: boolean;
}

export interface CalculationsFilters {
	category?: string;
	profession?: string;
	difficulty?: string;
	searchTerm?: string;
}

export interface RecommendationContext {
	templateId?: string;
	projectId?: string;
	limit?: number;
}

export interface SaveCalculationRequest {
	id: string;
	name: string;
	notes?: string;
	usedInProject?: boolean;
	projectId?: string;
}
