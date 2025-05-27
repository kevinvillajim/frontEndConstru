// core/application/calculations/TemplateApplicationService.ts

import type {
	CalculationResult,
} from "../../domain/models/calculations/CalculationTemplate";
import type {
	CalculationTemplate,
} from "../../domain/models/calculations/CalculationTemplate";
import type {
	CalculationTemplateRepository,
	CalculationExecutionRepository,
	UserFavoritesRepository,
	TemplateFilters,
	PaginatedResult,
} from "../../domain/repositories/CalculationTemplateRepository";

export interface TemplateApplicationService {
	// Obtener plantillas
	getTemplates(
		filters?: TemplateFilters
	): Promise<PaginatedResult<CalculationTemplate>>;
	getTemplateById(id: string): Promise<CalculationTemplate | null>;
	getVerifiedTemplates(): Promise<CalculationTemplate[]>;
	getFeaturedTemplates(): Promise<CalculationTemplate[]>;
	getTrendingTemplates(): Promise<CalculationTemplate[]>;

	// Búsqueda y recomendaciones
	searchTemplates(
		query: string,
		filters?: TemplateFilters
	): Promise<PaginatedResult<CalculationTemplate>>;
	getRecommendations(
		userId?: string,
		templateId?: string,
		profession?: string
	): Promise<CalculationTemplate[]>;
	getSimilarTemplates(templateId: string): Promise<CalculationTemplate[]>;

	// Ejecución de cálculos
	executeCalculation(
		templateId: string,
		parameters: Record<string, any>,
		userId?: string
	): Promise<CalculationResult>;
	saveCalculationResult(
		result: CalculationResult,
		name?: string,
		notes?: string
	): Promise<string>;

	// Gestión de favoritos
	toggleFavorite(userId: string, templateId: string): Promise<boolean>;
	getUserFavorites(userId: string): Promise<CalculationTemplate[]>;

	// Estadísticas
	getTemplateStats(templateId: string): Promise<any>;
	getUserCalculationHistory(
		userId: string,
		limit?: number
	): Promise<CalculationResult[]>;
}

export class TemplateApplicationServiceImpl implements TemplateApplicationService {
	constructor(
		private readonly templateRepository: CalculationTemplateRepository,
		private readonly executionRepository: CalculationExecutionRepository,
		private readonly favoritesRepository: UserFavoritesRepository
	) {}

	async getTemplates(
		filters?: TemplateFilters
	): Promise<PaginatedResult<CalculationTemplate>> {
		try {
			return await this.templateRepository.findAll(filters);
		} catch (error) {
			throw new Error(`Failed to get templates: ${error.message}`);
		}
	}

	async getTemplateById(id: string): Promise<CalculationTemplate | null> {
		try {
			if (!id) {
				throw new Error("Template ID is required");
			}
			return await this.templateRepository.findById(id);
		} catch (error) {
			throw new Error(`Failed to get template: ${error.message}`);
		}
	}

	async getVerifiedTemplates(): Promise<CalculationTemplate[]> {
		try {
			return await this.templateRepository.findVerified();
		} catch (error) {
			throw new Error(`Failed to get verified templates: ${error.message}`);
		}
	}

	async getFeaturedTemplates(): Promise<CalculationTemplate[]> {
		try {
			return await this.templateRepository.findFeatured();
		} catch (error) {
			throw new Error(`Failed to get featured templates: ${error.message}`);
		}
	}

	async getTrendingTemplates(): Promise<CalculationTemplate[]> {
		try {
			return await this.templateRepository.findTrending();
		} catch (error) {
			throw new Error(`Failed to get trending templates: ${error.message}`);
		}
	}

	async searchTemplates(
		query: string,
		filters?: TemplateFilters
	): Promise<PaginatedResult<CalculationTemplate>> {
		try {
			if (!query || query.trim().length === 0) {
				return await this.getTemplates(filters);
			}
			return await this.templateRepository.search(query, filters);
		} catch (error) {
			throw new Error(`Failed to search templates: ${error.message}`);
		}
	}

	async getRecommendations(
		userId?: string,
		templateId?: string,
		profession?: string
	): Promise<CalculationTemplate[]> {
		try {
			return await this.templateRepository.getRecommendations(
				userId,
				templateId,
				profession,
				5
			);
		} catch (error) {
			throw new Error(`Failed to get recommendations: ${error.message}`);
		}
	}

	async getSimilarTemplates(
		templateId: string
	): Promise<CalculationTemplate[]> {
		try {
			if (!templateId) {
				throw new Error("Template ID is required");
			}
			return await this.templateRepository.findSimilar(templateId, 5);
		} catch (error) {
			throw new Error(`Failed to get similar templates: ${error.message}`);
		}
	}

	async executeCalculation(
		templateId: string,
		parameters: Record<string, any>,
		userId?: string
	): Promise<CalculationResult> {
		try {
			// Obtener la plantilla
			const template = await this.templateRepository.findById(templateId);
			if (!template) {
				throw new Error("Template not found");
			}

			// Validar que la plantilla esté activa
			if (!template.isActive) {
				throw new Error("Template is not active");
			}

			// Ejecutar el cálculo usando la lógica de dominio
			const result = template.executeFormula(parameters);

			// Incrementar contador de uso
			await this.templateRepository.incrementUsage(templateId);

			// Guardar la ejecución
			const executionId = await this.executionRepository.saveExecution({
				...result,
				userId,
				templateId,
				templateName: template.name,
			});

			return {
				...result,
				executionId,
			};
		} catch (error) {
			throw new Error(`Calculation execution failed: ${error.message}`);
		}
	}

	async saveCalculationResult(
		result: CalculationResult,
		name?: string,
		notes?: string
	): Promise<string> {
		try {
			const enrichedResult = {
				...result,
				savedName: name,
				savedNotes: notes,
				savedAt: new Date().toISOString(),
			};

			return await this.executionRepository.saveExecution(enrichedResult);
		} catch (error) {
			throw new Error(`Failed to save calculation result: ${error.message}`);
		}
	}

	async toggleFavorite(userId: string, templateId: string): Promise<boolean> {
		try {
			if (!userId || !templateId) {
				throw new Error("User ID and Template ID are required");
			}

			const isFavorite = await this.favoritesRepository.isFavorite(
				userId,
				templateId
			);

			if (isFavorite) {
				await this.favoritesRepository.removeFavorite(userId, templateId);
				return false;
			} else {
				await this.favoritesRepository.addFavorite(userId, templateId);
				return true;
			}
		} catch (error) {
			console.error("Error in toggleFavorite:", error);
			throw new Error(
				`Failed to toggle favorite: ${error instanceof Error ? error.message : "Unknown error"}`
			);
		}
	}

	async getUserFavorites(userId: string): Promise<CalculationTemplate[]> {
		try {
			if (!userId) {
				throw new Error("User ID is required");
			}

			const favoriteIds = await this.favoritesRepository.getFavorites(userId);
			const templates: CalculationTemplate[] = [];

			for (const id of favoriteIds) {
				const template = await this.templateRepository.findById(id);
				if (template) {
					templates.push(template);
				}
			}

			return templates;
		} catch (error) {
			throw new Error(`Failed to get user favorites: ${error.message}`);
		}
	}

	async getTemplateStats(templateId: string): Promise<any> {
		try {
			if (!templateId) {
				throw new Error("Template ID is required");
			}

			const [usageStats, executionStats, favoriteStats] = await Promise.all([
				this.templateRepository.getUsageStats(templateId),
				this.executionRepository.getExecutionStats(templateId),
				this.favoritesRepository.getFavoriteStats(templateId),
			]);

			return {
				usage: usageStats,
				executions: executionStats,
				favorites: favoriteStats,
			};
		} catch (error) {
			throw new Error(`Failed to get template stats: ${error.message}`);
		}
	}

	async getUserCalculationHistory(
		userId: string,
		limit = 10
	): Promise<CalculationResult[]> {
		try {
			if (!userId) {
				throw new Error("User ID is required");
			}

			return await this.executionRepository.getExecutionHistory(
				userId,
				undefined,
				limit
			);
		} catch (error) {
			throw new Error(
				`Failed to get user calculation history: ${error.message}`
			);
		}
	}

	// Métodos auxiliares para validación
	private validateExecutionParameters(
		template: CalculationTemplate,
		parameters: Record<string, any>
	): void {
		const errors: string[] = [];

		template.parameters.forEach((param) => {
			const validation = template.validateParameter(
				param.name,
				parameters[param.name]
			);
			if (!validation.isValid) {
				errors.push(`${param.label}: ${validation.error}`);
			}
		});

		if (errors.length > 0) {
			throw new Error(`Parameter validation failed: ${errors.join(", ")}`);
		}
	}

	// Método para obtener estadísticas agregadas
	async getAggregatedStats(): Promise<{
		totalTemplates: number;
		verifiedTemplates: number;
		totalExecutions: number;
		averageRating: number;
	}> {
		try {
			const allTemplates = await this.templateRepository.findAll({limit: 1000});
			const verifiedTemplates = allTemplates.data.filter((t) => t.isVerified);

			const totalExecutions = allTemplates.data.reduce(
				(sum, t) => sum + t.usageCount,
				0
			);
			const totalRating = allTemplates.data.reduce(
				(sum, t) => sum + t.averageRating,
				0
			);
			const averageRating =
				allTemplates.data.length > 0
					? totalRating / allTemplates.data.length
					: 0;

			return {
				totalTemplates: allTemplates.data.length,
				verifiedTemplates: verifiedTemplates.length,
				totalExecutions,
				averageRating: Math.round(averageRating * 100) / 100,
			};
		} catch (error) {
			throw new Error(`Failed to get aggregated stats: ${error.message}`);
		}
	}
}
