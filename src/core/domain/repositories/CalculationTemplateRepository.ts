// src/core/domain/repositories/CalculationTemplateRepository.ts

import type {
	CalculationTemplate,
	CalculationResult,
} from "../models/calculations/CalculationTemplate";

// ==================== FILTROS ====================
export interface TemplateFilters {
	searchTerm?: string;
	category?: string | null;
	subcategory?: string | null;
	targetProfession?: string;
	difficulty?: "basic" | "intermediate" | "advanced" | null;
	showOnlyFavorites?: boolean;
	showOnlyVerified?: boolean;
	showOnlyFeatured?: boolean;
	tags?: string[];
	sortBy?: "popular" | "rating" | "trending" | "recent" | "name";
	limit?: number;
	page?: number;
}

// ==================== RESPUESTA PAGINADA ====================
export interface PaginatedResult<T> {
	data: T[];
	pagination: {
		total: number;
		page: number;
		limit: number;
		pages: number;
	};
}

// ==================== REPOSITORIO DE PLANTILLAS ====================
export interface CalculationTemplateRepository {
	// Métodos básicos CRUD
	findAll(
		filters?: TemplateFilters
	): Promise<PaginatedResult<CalculationTemplate>>;
	findById(id: string): Promise<CalculationTemplate | null>;
	create(
		templateData: Partial<CalculationTemplate>
	): Promise<CalculationTemplate>;
	update(
		id: string,
		templateData: Partial<CalculationTemplate>
	): Promise<CalculationTemplate>;
	delete(id: string): Promise<boolean>;

	// Métodos de búsqueda específicos
	findByType(type: string): Promise<CalculationTemplate[]>;
	findVerified(): Promise<CalculationTemplate[]>;
	findFeatured(): Promise<CalculationTemplate[]>;
	findTrending(): Promise<CalculationTemplate[]>;
	search(
		query: string,
		filters?: TemplateFilters
	): Promise<PaginatedResult<CalculationTemplate>>;

	// Métodos de recomendaciones
	getRecommendations(
		userId?: string,
		templateId?: string,
		profession?: string,
		limit?: number
	): Promise<CalculationTemplate[]>;
	findSimilar(
		templateId: string,
		limit?: number
	): Promise<CalculationTemplate[]>;

	// Métodos de estadísticas
	incrementUsage(templateId: string): Promise<void>;
	getUsageStats(templateId: string): Promise<Record<string, unknown>>;
}

// ==================== REPOSITORIO DE EJECUCIÓN ====================
export interface CalculationExecutionRepository {
	// Guardar y obtener ejecuciones
	saveExecution(result: CalculationResult): Promise<string>;
	getExecutionHistory(
		userId?: string,
		templateId?: string,
		limit?: number
	): Promise<CalculationResult[]>;
	getExecution(id: string): Promise<CalculationResult | null>;
	deleteExecution(id: string): Promise<boolean>;

	// Estadísticas de ejecución
	getExecutionStats(templateId?: string): Promise<Record<string, unknown>>;
}

// ==================== REPOSITORIO DE FAVORITOS ====================
export interface UserFavoritesRepository {
	// Gestión de favoritos
	addFavorite(userId: string, templateId: string): Promise<void>;
	removeFavorite(userId: string, templateId: string): Promise<void>;
	getFavorites(userId: string): Promise<string[]>;
	isFavorite(userId: string, templateId: string): Promise<boolean>;

	// Estadísticas de favoritos
	getFavoriteStats(templateId: string): Promise<Record<string, unknown>>;
}
