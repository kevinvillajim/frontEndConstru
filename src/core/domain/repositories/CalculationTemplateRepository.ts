// core/domain/repositories/CalculationTemplateRepository.ts

import {
	CalculationTemplate
} from "../models/calculations/CalculationTemplate";
import type {
	CalculationResult,
} from "../models/calculations/CalculationTemplate";
export interface TemplateFilters {
	searchTerm?: string;
	type?: string;
	targetProfession?: string;
	isVerified?: boolean;
	isFeatured?: boolean;
	isActive?: boolean;
	shareLevel?: "private" | "public" | "organization";
	tags?: string[];
	createdBy?: string;
	difficulty?: "basic" | "intermediate" | "advanced";
	sortBy?:
		| "name"
		| "usage_count"
		| "average_rating"
		| "created_at"
		| "updated_at";
	sortOrder?: "ASC" | "DESC";
	page?: number;
	limit?: number;
}

export interface PaginatedResult<T> {
	data: T[];
	pagination: {
		total: number;
		page: number;
		limit: number;
		pages: number;
	};
}

export interface CalculationTemplateRepository {
	// Operaciones básicas CRUD
	findById(id: string): Promise<CalculationTemplate | null>;
	findAll(
		filters?: TemplateFilters
	): Promise<PaginatedResult<CalculationTemplate>>;
	create(template: CalculationTemplate): Promise<CalculationTemplate>;
	update(
		id: string,
		template: Partial<CalculationTemplate>
	): Promise<CalculationTemplate>;
	delete(id: string): Promise<boolean>;

	// Operaciones específicas del dominio
	findByType(type: string): Promise<CalculationTemplate[]>;
	findByProfession(profession: string): Promise<CalculationTemplate[]>;
	findVerified(): Promise<CalculationTemplate[]>;
	findFeatured(): Promise<CalculationTemplate[]>;
	findTrending(): Promise<CalculationTemplate[]>;
	findPublic(): Promise<CalculationTemplate[]>;

	// Búsqueda y filtrado
	search(
		query: string,
		filters?: TemplateFilters
	): Promise<PaginatedResult<CalculationTemplate>>;
	findByTags(tags: string[]): Promise<CalculationTemplate[]>;
	findSimilar(
		templateId: string,
		limit?: number
	): Promise<CalculationTemplate[]>;

	// Operaciones de estadísticas
	getUsageStats(
		templateId: string
	): Promise<{usageCount: number; averageRating: number; ratingCount: number}>;
	incrementUsage(templateId: string): Promise<void>;
	addRating(templateId: string, rating: number): Promise<void>;

	// Operaciones de recomendaciones
	getRecommendations(
		userId?: string,
		templateId?: string,
		profession?: string,
		limit?: number
	): Promise<CalculationTemplate[]>;
}

// Repositorio para ejecuciones de cálculos
export interface CalculationExecutionRepository {
	// Guardar resultado de cálculo
	saveExecution(result: CalculationResult): Promise<string>;

	// Obtener historial de cálculos
	getExecutionHistory(
		userId?: string,
		templateId?: string,
		limit?: number
	): Promise<CalculationResult[]>;

	// Obtener ejecución específica
	getExecution(executionId: string): Promise<CalculationResult | null>;

	// Eliminar ejecución
	deleteExecution(executionId: string): Promise<boolean>;

	// Estadísticas de ejecuciones
	getExecutionStats(templateId: string): Promise<{
		totalExecutions: number;
		averageExecutionTime: number;
		successRate: number;
		mostUsedParameters: Record<string, any>;
	}>;
}

// Repositorio para favoritos de usuario
export interface UserFavoritesRepository {
	// Gestión de favoritos
	addFavorite(userId: string, templateId: string): Promise<void>;
	removeFavorite(userId: string, templateId: string): Promise<void>;
	getFavorites(userId: string): Promise<string[]>;
	isFavorite(userId: string, templateId: string): Promise<boolean>;

	// Estadísticas de favoritos
	getFavoriteStats(
		templateId: string
	): Promise<{count: number; users: string[]}>;
}
