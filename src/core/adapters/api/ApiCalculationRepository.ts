// src/core/adapters/api/ApiCalculationRepository.ts
import type ApiClient from "./ApiClient";
import type {
	CalculationResult,
	CalculationTemplate,
} from "../../domain/models/calculations/CalculationTemplate";
import type {
	CalculationTemplateRepository,
	CalculationExecutionRepository,
	UserFavoritesRepository,
	TemplateFilters,
	PaginatedResult,
} from "../../domain/repositories/CalculationTemplateRepository";
import {mapBackendTemplate} from "../../../ui/pages/calculations/shared/types/template.types";

// ==================== TEMPLATE REPOSITORY ====================
export class ApiCalculationTemplateRepository
	implements CalculationTemplateRepository
{
	constructor(private readonly apiClient: typeof ApiClient) {}

	async findAll(
		filters?: TemplateFilters
	): Promise<PaginatedResult<CalculationTemplate>> {
		try {
			const params = this.buildQueryParams(filters);
			const response = await this.apiClient.get(
				`/calculations/templates?${params.toString()}`
			);

			if (response.data.success && response.data.data) {
				const templates = response.data.data.templates.map(
					(data: Record<string, unknown>) => mapBackendTemplate(data)
				);

				return {
					data: templates,
					pagination: response.data.data.pagination,
				};
			}

			return {data: [], pagination: {total: 0, page: 1, limit: 10, pages: 0}};
		} catch (error) {
			console.error("Error fetching templates:", error);
			return {data: [], pagination: {total: 0, page: 1, limit: 10, pages: 0}};
		}
	}

	async findById(id: string): Promise<CalculationTemplate | null> {
		try {
			const response = await this.apiClient.get(
				`/calculations/templates/${id}`
			);

			if (response.data.success && response.data.data) {
				return mapBackendTemplate(response.data.data);
			}
			return null;
		} catch (error) {
			console.error("Error fetching template by ID:", error);
			return null;
		}
	}

	async create(
		templateData: Partial<CalculationTemplate>
	): Promise<CalculationTemplate> {
		try {
			const response = await this.apiClient.post(
				"/calculations/templates",
				templateData
			);

			if (response.data.success && response.data.data) {
				return mapBackendTemplate(response.data.data);
			}

			throw new Error("Failed to create template");
		} catch (error) {
			console.error("Error creating template:", error);
			throw error;
		}
	}

	async update(
		id: string,
		templateData: Partial<CalculationTemplate>
	): Promise<CalculationTemplate> {
		try {
			const response = await this.apiClient.put(
				`/calculations/templates/${id}`,
				templateData
			);

			if (response.data.success && response.data.data) {
				return mapBackendTemplate(response.data.data);
			}

			throw new Error("Failed to update template");
		} catch (error) {
			console.error("Error updating template:", error);
			throw error;
		}
	}

	async delete(id: string): Promise<boolean> {
		try {
			const response = await this.apiClient.delete(
				`/calculations/templates/${id}`
			);
			return response.data.success;
		} catch (error) {
			console.error("Error deleting template:", error);
			return false;
		}
	}

	async findByType(type: string): Promise<CalculationTemplate[]> {
		try {
			const filters: TemplateFilters = {category: type};
			const result = await this.findAll(filters);
			return result.data;
		} catch (error) {
			console.error("Error finding templates by type:", error);
			return [];
		}
	}

	async findVerified(): Promise<CalculationTemplate[]> {
		try {
			const filters: TemplateFilters = {showOnlyVerified: true};
			const result = await this.findAll(filters);
			return result.data;
		} catch (error) {
			console.error("Error finding verified templates:", error);
			return [];
		}
	}

	async findFeatured(): Promise<CalculationTemplate[]> {
		try {
			const filters: TemplateFilters = {showOnlyFeatured: true};
			const result = await this.findAll(filters);
			return result.data;
		} catch (error) {
			console.error("Error finding featured templates:", error);
			return [];
		}
	}

	async findTrending(): Promise<CalculationTemplate[]> {
		try {
			const response = await this.apiClient.get(
				"/calculations/templates/trending"
			);

			if (response.data.success && response.data.data) {
				return response.data.data.map((data: Record<string, unknown>) =>
					mapBackendTemplate(data)
				);
			}

			return [];
		} catch (error) {
			console.error("Error finding trending templates:", error);
			return [];
		}
	}

	async search(
		query: string,
		filters?: TemplateFilters
	): Promise<PaginatedResult<CalculationTemplate>> {
		try {
			const params = this.buildQueryParams({...filters, searchTerm: query});
			const response = await this.apiClient.get(
				`/calculations/templates/search?${params.toString()}`
			);

			if (response.data.success && response.data.data) {
				const templates = response.data.data.templates.map(
					(data: Record<string, unknown>) => mapBackendTemplate(data)
				);

				return {
					data: templates,
					pagination: response.data.data.pagination,
				};
			}

			return {data: [], pagination: {total: 0, page: 1, limit: 10, pages: 0}};
		} catch (error) {
			console.error("Error searching templates:", error);
			return {data: [], pagination: {total: 0, page: 1, limit: 10, pages: 0}};
		}
	}

	async getRecommendations(
		userId?: string,
		templateId?: string,
		profession?: string,
		limit = 5
	): Promise<CalculationTemplate[]> {
		try {
			const params = new URLSearchParams();
			if (userId) params.append("userId", userId);
			if (templateId) params.append("templateId", templateId);
			if (profession) params.append("profession", profession);
			params.append("limit", limit.toString());

			const response = await this.apiClient.get(
				`/calculations/recommendations?${params.toString()}`
			);

			if (response.data.success && response.data.data) {
				return response.data.data.map((data: Record<string, unknown>) =>
					mapBackendTemplate(data)
				);
			}

			return [];
		} catch (error) {
			console.error("Error getting recommendations:", error);
			return [];
		}
	}

	async findSimilar(
		templateId: string,
		limit = 5
	): Promise<CalculationTemplate[]> {
		try {
			const response = await this.apiClient.get(
				`/calculations/templates/${templateId}/similar?limit=${limit}`
			);

			if (response.data.success && response.data.data) {
				return response.data.data.map((data: Record<string, unknown>) =>
					mapBackendTemplate(data)
				);
			}

			return [];
		} catch (error) {
			console.error("Error finding similar templates:", error);
			return [];
		}
	}

	async incrementUsage(templateId: string): Promise<void> {
		try {
			await this.apiClient.post(
				`/calculations/templates/${templateId}/increment-usage`
			);
		} catch (error) {
			console.error("Error incrementing usage:", error);
		}
	}

	async getUsageStats(templateId: string): Promise<Record<string, unknown>> {
		try {
			const response = await this.apiClient.get(
				`/calculations/templates/${templateId}/stats`
			);
			return response.data.success ? response.data.data : {};
		} catch (error) {
			console.error("Error getting usage stats:", error);
			return {};
		}
	}

	private buildQueryParams(filters?: TemplateFilters): URLSearchParams {
		const params = new URLSearchParams();

		if (filters) {
			if (filters.searchTerm) params.append("searchTerm", filters.searchTerm);
			if (filters.category) params.append("types", filters.category);
			if (filters.targetProfession)
				params.append("targetProfessions", filters.targetProfession);
			if (filters.showOnlyVerified !== undefined)
				params.append("isVerified", filters.showOnlyVerified.toString());
			if (filters.showOnlyFeatured !== undefined)
				params.append("isFeatured", filters.showOnlyFeatured.toString());
			if (filters.tags && filters.tags.length > 0)
				params.append("tags", filters.tags.join(","));
			if (filters.sortBy) params.append("sortBy", filters.sortBy);
			if (filters.page) params.append("page", filters.page.toString());
			if (filters.limit) params.append("limit", filters.limit.toString());
		}

		// Valores por defecto
		if (!params.has("isActive")) params.append("isActive", "true");
		if (!params.has("page")) params.append("page", "1");
		if (!params.has("limit")) params.append("limit", "50");

		return params;
	}
}

// ==================== EXECUTION REPOSITORY ====================
export class ApiCalculationExecutionRepository
	implements CalculationExecutionRepository
{
	constructor(private readonly apiClient: typeof ApiClient) {}

	async saveExecution(result: CalculationResult): Promise<string> {
		try {
			const response = await this.apiClient.post("/calculations/execute", {
				templateId: result.calculationTemplateId,
				projectId: result.projectId,
				parameters: result.inputParameters,
			});

			if (response.data.success) {
				return response.data.data.id || "";
			}

			throw new Error("Failed to save execution");
		} catch (error) {
			console.error("Error saving execution:", error);
			throw error;
		}
	}

	async getExecutionHistory(
		userId?: string,
		templateId?: string,
		limit = 10
	): Promise<CalculationResult[]> {
		try {
			const params = new URLSearchParams();
			if (userId) params.append("userId", userId);
			if (templateId) params.append("templateId", templateId);
			params.append("limit", limit.toString());

			const response = await this.apiClient.get(
				`/calculations/history?${params.toString()}`
			);

			if (response.data.success && response.data.data) {
				return response.data.data;
			}

			return [];
		} catch (error) {
			console.error("Error getting execution history:", error);
			return [];
		}
	}

	async getExecution(id: string): Promise<CalculationResult | null> {
		try {
			const response = await this.apiClient.get(
				`/calculations/executions/${id}`
			);

			if (response.data.success && response.data.data) {
				return response.data.data;
			}

			return null;
		} catch (error) {
			console.error("Error getting execution:", error);
			return null;
		}
	}

	async deleteExecution(id: string): Promise<boolean> {
		try {
			const response = await this.apiClient.delete(
				`/calculations/executions/${id}`
			);
			return response.data.success;
		} catch (error) {
			console.error("Error deleting execution:", error);
			return false;
		}
	}

	async getExecutionStats(
		templateId?: string
	): Promise<Record<string, unknown>> {
		try {
			const params = templateId ? `?templateId=${templateId}` : "";
			const response = await this.apiClient.get(`/calculations/stats${params}`);

			if (response.data.success && response.data.data) {
				return response.data.data;
			}

			return {};
		} catch (error) {
			console.error("Error getting execution stats:", error);
			return {};
		}
	}
}

// ==================== FAVORITES REPOSITORY ====================
export class ApiUserFavoritesRepository implements UserFavoritesRepository {
	constructor(private readonly apiClient: typeof ApiClient) {}

	async addFavorite(userId: string, templateId: string): Promise<void> {
		try {
			await this.apiClient.post(
				`/calculations/templates/${templateId}/favorite`
			);
		} catch (error) {
			console.error("Error adding favorite:", error);
			// Fallback a localStorage
			this.addLocalStorageFavorite(userId, templateId);
		}
	}

	async removeFavorite(userId: string, templateId: string): Promise<void> {
		try {
			// Usar POST en lugar de DELETE porque el backend solo tiene toggle
			const response = await this.apiClient.post(
				`/calculations/templates/${templateId}/favorite`,
				{userId}
			);

			if (!response.data.success) {
				throw new Error(response.data.message || "Error removing favorite");
			}
		} catch (error) {
			console.error("Error removing favorite:", error);
			throw error;
		}
	}

	async getFavorites(userId: string): Promise<string[]> {
		try {
			const response = await this.apiClient.get(
				"/calculations/users/favorites"
			);

			if (response.data.success && response.data.data) {
				return response.data.data.map(
					(fav: Record<string, unknown>) => fav.templateId || fav.id
				);
			}

			return this.getLocalStorageFavorites(userId);
		} catch (error) {
			console.error("Error getting favorites:", error);
			return this.getLocalStorageFavorites(userId);
		}
	}

	async isFavorite(userId: string, templateId: string): Promise<boolean> {
		try {
			const favorites = await this.getFavorites(userId);
			return favorites.includes(templateId);
		} catch (error) {
			console.error("Error checking favorite:", error);
			return false;
		}
	}

	async getFavoriteStats(templateId: string): Promise<Record<string, unknown>> {
		try {
			const response = await this.apiClient.get(
				`/calculations/templates/${templateId}/favorite-stats`
			);
			return response.data.success ? response.data.data : {};
		} catch (error) {
			console.error("Error getting favorite stats:", error);
			return {};
		}
	}

	// Métodos de fallback con localStorage
	private addLocalStorageFavorite(userId: string, templateId: string): void {
		try {
			const favorites = this.getLocalStorageFavorites(userId);
			if (!favorites.includes(templateId)) {
				favorites.push(templateId);
				localStorage.setItem(`favorites_${userId}`, JSON.stringify(favorites));
			}
		} catch (error) {
			console.error("Error with localStorage:", error);
		}
	}

	private removeLocalStorageFavorite(userId: string, templateId: string): void {
		try {
			const favorites = this.getLocalStorageFavorites(userId);
			const index = favorites.indexOf(templateId);
			if (index > -1) {
				favorites.splice(index, 1);
				localStorage.setItem(`favorites_${userId}`, JSON.stringify(favorites));
			}
		} catch (error) {
			console.error("Error with localStorage:", error);
		}
	}

	private getLocalStorageFavorites(userId: string): string[] {
		try {
			const stored = localStorage.getItem(`favorites_${userId}`);
			return stored ? JSON.parse(stored) : [];
		} catch (error) {
			console.error("Error reading from localStorage:", error);
			return [];
		}
	}
}
