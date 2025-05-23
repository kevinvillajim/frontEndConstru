// core/adapters/api/ApiCalculationRepository.ts

import type ApiClient from "./ApiClient";
import type {
	CalculationResult,
} from "../../domain/models/calculations/CalculationTemplate";
import {
	CalculationTemplate,
} from "../../domain/models/calculations/CalculationTemplate";

import type {
	CalculationTemplateRepository,
	CalculationExecutionRepository,
	UserFavoritesRepository,
	TemplateFilters,
	PaginatedResult,
} from "../../domain/repositories/CalculationTemplateRepository";

export class ApiCalculationTemplateRepository
	implements CalculationTemplateRepository
{
	constructor(private readonly apiClient: typeof ApiClient) {}

	async findById(id: string): Promise<CalculationTemplate | null> {
		try {
			const response = await this.apiClient.get(
				`/calculations/templates/${id}`
			);

			if (response.data.success && response.data.data) {
				return CalculationTemplate.fromAPIData(response.data.data);
			}

			return null;
		} catch (error) {
			console.error("Error fetching template by ID:", error);
			return null;
		}
	}

	async findAll(
		filters?: TemplateFilters
	): Promise<PaginatedResult<CalculationTemplate>> {
		try {
			const params = this.buildQueryParams(filters);
			const response = await this.apiClient.get(
				`/calculations/templates?${params.toString()}`
			);

			if (response.data.success && response.data.data) {
				const templates = response.data.data.templates.map((data: any) =>
					CalculationTemplate.fromAPIData(data)
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

	async create(template: CalculationTemplate): Promise<CalculationTemplate> {
		try {
			const response = await this.apiClient.post(
				"/calculations/templates",
				template.toAPIData()
			);

			if (response.data.success && response.data.data) {
				return CalculationTemplate.fromAPIData(response.data.data);
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
				return CalculationTemplate.fromAPIData(response.data.data);
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
		const result = await this.findAll({type, limit: 100});
		return result.data;
	}

	async findByProfession(profession: string): Promise<CalculationTemplate[]> {
		const result = await this.findAll({
			targetProfession: profession,
			limit: 100,
		});
		return result.data;
	}

	async findVerified(): Promise<CalculationTemplate[]> {
		const result = await this.findAll({isVerified: true, limit: 100});
		return result.data;
	}

	async findFeatured(): Promise<CalculationTemplate[]> {
		const result = await this.findAll({isFeatured: true, limit: 100});
		return result.data;
	}

	async findTrending(): Promise<CalculationTemplate[]> {
		const result = await this.findAll({
			sortBy: "usage_count",
			sortOrder: "DESC",
			limit: 20,
		});

		// Filtrar los que realmente están en tendencia
		return result.data.filter((template) => template.isTrending());
	}

	async findPublic(): Promise<CalculationTemplate[]> {
		const result = await this.findAll({shareLevel: "public", limit: 100});
		return result.data;
	}

	async search(
		query: string,
		filters?: TemplateFilters
	): Promise<PaginatedResult<CalculationTemplate>> {
		return this.findAll({...filters, searchTerm: query});
	}

	async findByTags(tags: string[]): Promise<CalculationTemplate[]> {
		const result = await this.findAll({tags, limit: 100});
		return result.data;
	}

	async findSimilar(
		templateId: string,
		limit = 5
	): Promise<CalculationTemplate[]> {
		try {
			// Primero obtener la plantilla original
			const template = await this.findById(templateId);
			if (!template) {
				return [];
			}

			// Buscar plantillas similares por tipo y profesión
			const result = await this.findAll({
				type: template.type,
				targetProfession: template.targetProfession,
				limit: limit + 1, // +1 para excluir la original
			});

			// Excluir la plantilla original y limitar resultados
			return result.data.filter((t) => t.id !== templateId).slice(0, limit);
		} catch (error) {
			console.error("Error finding similar templates:", error);
			return [];
		}
	}

	async getUsageStats(
		templateId: string
	): Promise<{usageCount: number; averageRating: number; ratingCount: number}> {
		try {
			const template = await this.findById(templateId);
			if (template) {
				return {
					usageCount: template.usageCount,
					averageRating: template.averageRating,
					ratingCount: template.ratingCount,
				};
			}
			return {usageCount: 0, averageRating: 0, ratingCount: 0};
		} catch (error) {
			console.error("Error getting usage stats:", error);
			return {usageCount: 0, averageRating: 0, ratingCount: 0};
		}
	}

	async incrementUsage(templateId: string): Promise<void> {
		try {
			await this.apiClient.patch(`/calculations/templates/${templateId}/usage`);
		} catch (error) {
			console.error("Error incrementing usage:", error);
		}
	}

	async addRating(templateId: string, rating: number): Promise<void> {
		try {
			await this.apiClient.post(
				`/calculations/templates/${templateId}/rating`,
				{rating}
			);
		} catch (error) {
			console.error("Error adding rating:", error);
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
			if (templateId) params.append("templateId", templateId);
			if (profession) params.append("profession", profession);
			params.append("limit", limit.toString());

			const response = await this.apiClient.get(
				`/calculations/recommendations?${params.toString()}`
			);

			if (response.data.success && response.data.data) {
				return response.data.data.map((data: any) =>
					CalculationTemplate.fromAPIData(data)
				);
			}

			return [];
		} catch (error) {
			console.error("Error getting recommendations:", error);
			return [];
		}
	}

	private buildQueryParams(filters?: TemplateFilters): URLSearchParams {
		const params = new URLSearchParams();

		if (filters) {
			if (filters.searchTerm) params.append("searchTerm", filters.searchTerm);
			if (filters.type) params.append("types", filters.type);
			if (filters.targetProfession)
				params.append("targetProfessions", filters.targetProfession);
			if (filters.isVerified !== undefined)
				params.append("isVerified", filters.isVerified.toString());
			if (filters.isFeatured !== undefined)
				params.append("isFeatured", filters.isFeatured.toString());
			if (filters.isActive !== undefined)
				params.append("isActive", filters.isActive.toString());
			if (filters.shareLevel) params.append("shareLevel", filters.shareLevel);
			if (filters.createdBy) params.append("createdBy", filters.createdBy);
			if (filters.tags && filters.tags.length > 0)
				params.append("tags", filters.tags.join(","));
			if (filters.sortBy) params.append("sortBy", filters.sortBy);
			if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);
			if (filters.page) params.append("page", filters.page.toString());
			if (filters.limit) params.append("limit", filters.limit.toString());
		}

		// Valores por defecto
		if (!params.has("isActive")) params.append("isActive", "true");
		if (!params.has("page")) params.append("page", "1");
		if (!params.has("limit")) params.append("limit", "50");
		if (!params.has("sortBy")) params.append("sortBy", "usage_count");
		if (!params.has("sortOrder")) params.append("sortOrder", "DESC");

		return params;
	}
}

export class ApiCalculationExecutionRepository
	implements CalculationExecutionRepository
{
	constructor(private readonly apiClient: typeof ApiClient) {}

	async saveExecution(result: CalculationResult): Promise<string> {
		try {
			const response = await this.apiClient.post("/calculations/execute", {
				templateId: result.templateId,
				parameters: result.inputs,
				result: result.outputs,
				metadata: result.metadata,
			});

			if (response.data.success) {
				return response.data.data.executionId || result.calculationId || "";
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

	async getExecution(executionId: string): Promise<CalculationResult | null> {
		try {
			const response = await this.apiClient.get(
				`/calculations/executions/${executionId}`
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

	async deleteExecution(executionId: string): Promise<boolean> {
		try {
			const response = await this.apiClient.delete(
				`/calculations/executions/${executionId}`
			);
			return response.data.success;
		} catch (error) {
			console.error("Error deleting execution:", error);
			return false;
		}
	}

	async getExecutionStats(templateId: string): Promise<{
		totalExecutions: number;
		averageExecutionTime: number;
		successRate: number;
		mostUsedParameters: Record<string, any>;
	}> {
		try {
			const response = await this.apiClient.get(
				`/calculations/templates/${templateId}/stats`
			);

			if (response.data.success && response.data.data) {
				return response.data.data;
			}

			return {
				totalExecutions: 0,
				averageExecutionTime: 0,
				successRate: 0,
				mostUsedParameters: {},
			};
		} catch (error) {
			console.error("Error getting execution stats:", error);
			return {
				totalExecutions: 0,
				averageExecutionTime: 0,
				successRate: 0,
				mostUsedParameters: {},
			};
		}
	}
}

export class ApiUserFavoritesRepository implements UserFavoritesRepository {
	constructor(private readonly apiClient: typeof ApiClient) {}

	async addFavorite(userId: string, templateId: string): Promise<void> {
		try {
			await this.apiClient.post("/user/favorites", {templateId});
		} catch (error) {
			console.error("Error adding favorite:", error);
			// Por ahora usar localStorage como fallback
			this.addToLocalStorage(userId, templateId);
		}
	}

	async removeFavorite(userId: string, templateId: string): Promise<void> {
		try {
			await this.apiClient.delete(`/user/favorites/${templateId}`);
		} catch (error) {
			console.error("Error removing favorite:", error);
			// Por ahora usar localStorage como fallback
			this.removeFromLocalStorage(userId, templateId);
		}
	}

	async getFavorites(userId: string): Promise<string[]> {
		try {
			const response = await this.apiClient.get("/user/favorites");

			if (response.data.success && response.data.data) {
				return response.data.data.map((fav: any) => fav.templateId);
			}

			return [];
		} catch (error) {
			console.error("Error getting favorites:", error);
			// Fallback a localStorage
			return this.getFromLocalStorage(userId);
		}
	}

	async isFavorite(userId: string, templateId: string): Promise<boolean> {
		const favorites = await this.getFavorites(userId);
		return favorites.includes(templateId);
	}

	async getFavoriteStats(
		templateId: string
	): Promise<{count: number; users: string[]}> {
		try {
			const response = await this.apiClient.get(
				`/calculations/templates/${templateId}/favorites`
			);

			if (response.data.success && response.data.data) {
				return response.data.data;
			}

			return {count: 0, users: []};
		} catch (error) {
			console.error("Error getting favorite stats:", error);
			return {count: 0, users: []};
		}
	}

	// Métodos de fallback con localStorage
	private addToLocalStorage(userId: string, templateId: string): void {
		try {
			const favorites = this.getFromLocalStorage(userId);
			if (!favorites.includes(templateId)) {
				favorites.push(templateId);
				localStorage.setItem(`favorites_${userId}`, JSON.stringify(favorites));
			}
		} catch (error) {
			console.error("Error with localStorage:", error);
		}
	}

	private removeFromLocalStorage(userId: string, templateId: string): void {
		try {
			const favorites = this.getFromLocalStorage(userId);
			const index = favorites.indexOf(templateId);
			if (index > -1) {
				favorites.splice(index, 1);
				localStorage.setItem(`favorites_${userId}`, JSON.stringify(favorites));
			}
		} catch (error) {
			console.error("Error with localStorage:", error);
		}
	}

	private getFromLocalStorage(userId: string): string[] {
		try {
			const stored = localStorage.getItem(`favorites_${userId}`);
			return stored ? JSON.parse(stored) : [];
		} catch (error) {
			console.error("Error reading from localStorage:", error);
			return [];
		}
	}
}
