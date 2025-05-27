// src/core/adapters/api/ApiCalculationRepository.ts - CORRECCIONES CRÍTICAS
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

export class ApiCalculationTemplateRepository implements CalculationTemplateRepository {
  constructor(private readonly apiClient: typeof ApiClient) {}

  async findAll(filters?: TemplateFilters): Promise<PaginatedResult<CalculationTemplate>> {
    try {
      const params = this.buildQueryParams(filters);
      // ✅ USA LA RUTA CORRECTA DEL BACKEND
      const response = await this.apiClient.get(`/calculations/templates?${params.toString()}`);

      if (response.data.success && response.data.data) {
        const templates = response.data.data.templates.map((data: any) =>
          this.convertAPIResponse(data)
        );

        return {
          data: templates,
          pagination: response.data.data.pagination,
        };
      }

      return { data: [], pagination: { total: 0, page: 1, limit: 10, pages: 0 } };
    } catch (error) {
      console.error("Error fetching templates:", error);
      return { data: [], pagination: { total: 0, page: 1, limit: 10, pages: 0 } };
    }
  }

  async findById(id: string): Promise<CalculationTemplate | null> {
    try {
      // ✅ USA LA RUTA CORRECTA
      const response = await this.apiClient.get(`/calculations/templates/${id}`);
      
      if (response.data.success && response.data.data) {
        return this.convertAPIResponse(response.data.data);
      }
      return null;
    } catch (error) {
      console.error("Error fetching template by ID:", error);
      return null;
    }
  }

  // ✅ MÉTODOS PARA FAVORITOS SEGÚN TU BACKEND
  async toggleFavorite(userId: string, templateId: string): Promise<boolean> {
    try {
      const response = await this.apiClient.post(`/calculations/templates/${templateId}/favorite`);
      return response.data.success;
    } catch (error) {
      console.error("Error toggling favorite:", error);
      return false;
    }
  }

  async getUserFavorites(): Promise<CalculationTemplate[]> {
    try {
      const response = await this.apiClient.get("/users/favorites");
      
      if (response.data.success && response.data.data) {
        return response.data.data.map((data: any) => this.convertAPIResponse(data));
      }
      return [];
    } catch (error) {
      console.error("Error getting user favorites:", error);
      return [];
    }
  }

  // ✅ CONVERSIÓN CORRECTA DE RESPUESTA API
  private convertAPIResponse(apiData: any): CalculationTemplate {
    return {
      id: apiData.id,
      name: apiData.name,
      description: apiData.description,
      type: apiData.type,
      targetProfession: apiData.targetProfession,
      formula: apiData.formula,
      necReference: apiData.necReference || apiData.nec_reference,
      isActive: apiData.isActive || apiData.is_active,
      version: apiData.version,
      parentTemplateId: apiData.parentTemplateId || apiData.parent_template_id,
      source: apiData.source,
      createdBy: apiData.createdBy || apiData.created_by,
      isVerified: apiData.isVerified || apiData.is_verified,
      verifiedBy: apiData.verifiedBy || apiData.verified_by,
      verifiedAt: apiData.verifiedAt || apiData.verified_at,
      isFeatured: apiData.isFeatured || apiData.is_featured,
      usageCount: apiData.usageCount || apiData.usage_count || 0,
      averageRating: apiData.averageRating || apiData.average_rating || 0,
      ratingCount: apiData.ratingCount || apiData.rating_count || 0,
      tags: apiData.tags || [],
      shareLevel: apiData.shareLevel || apiData.share_level || 'private',
      difficulty: apiData.difficulty || 'intermediate',
      estimatedTime: apiData.estimatedTime || apiData.estimated_time,
      complianceLevel: apiData.complianceLevel || apiData.compliance_level,
      parameters: apiData.parameters || [],
      createdAt: apiData.createdAt || apiData.created_at,
      updatedAt: apiData.updatedAt || apiData.updated_at,
      
      // Campos computados
      trending: this.calculateTrending(apiData),
      popular: this.calculatePopular(apiData),
      isNew: this.calculateIsNew(apiData),
      isFavorite: false, // Se carga por separado
    };
  }

  // ✅ MÉTODOS DE BÚSQUEDA SEGÚN TU BACKEND
  async search(query: string, filters?: TemplateFilters): Promise<PaginatedResult<CalculationTemplate>> {
    try {
      const params = this.buildQueryParams({ ...filters, searchTerm: query });
      const response = await this.apiClient.get(`/calculations/templates/search?${params.toString()}`);
      
      if (response.data.success && response.data.data) {
        const templates = response.data.data.templates.map((data: any) => 
          this.convertAPIResponse(data)
        );
        
        return {
          data: templates,
          pagination: response.data.data.pagination,
        };
      }
      
      return { data: [], pagination: { total: 0, page: 1, limit: 10, pages: 0 } };
    } catch (error) {
      console.error("Error searching templates:", error);
      return { data: [], pagination: { total: 0, page: 1, limit: 10, pages: 0 } };
    }
  }

  private buildQueryParams(filters?: TemplateFilters): URLSearchParams {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.searchTerm) params.append("searchTerm", filters.searchTerm);
      if (filters.category) params.append("types", filters.category);
      if (filters.targetProfession) params.append("targetProfessions", filters.targetProfession);
      if (filters.showOnlyVerified !== undefined) params.append("isVerified", filters.showOnlyVerified.toString());
      if (filters.showOnlyFeatured !== undefined) params.append("isFeatured", filters.showOnlyFeatured.toString());
      if (filters.tags && filters.tags.length > 0) params.append("tags", filters.tags.join(","));
      if (filters.sortBy) params.append("sortBy", filters.sortBy);
    }
    
    // Valores por defecto
    if (!params.has("isActive")) params.append("isActive", "true");
    if (!params.has("page")) params.append("page", "1");
    if (!params.has("limit")) params.append("limit", "50");
    
    return params;
  }

  private calculateTrending(apiData: any): boolean {
    const usageCount = apiData.usageCount || apiData.usage_count || 0;
    const avgRating = apiData.averageRating || apiData.average_rating || 0;
    return usageCount > 50 && avgRating > 4.0;
  }

  private calculatePopular(apiData: any): boolean {
    const usageCount = apiData.usageCount || apiData.usage_count || 0;
    return usageCount > 100;
  }

  private calculateIsNew(apiData: any): boolean {
    const createdAt = apiData.createdAt || apiData.created_at;
    if (!createdAt) return false;
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return new Date(createdAt) > thirtyDaysAgo;
  }
}

// ✅ EXECUTION REPOSITORY CORREGIDO
export class ApiCalculationExecutionRepository implements CalculationExecutionRepository {
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

  async saveCalculationResult(resultData: {
    id: string;
    name?: string;
    notes?: string;
    usedInProject?: boolean;
    projectId?: string;
  }): Promise<string> {
    try {
      const response = await this.apiClient.post("/calculations/save", resultData);
      
      if (response.data.success) {
        return response.data.data.id || resultData.id;
      }
      
      throw new Error("Failed to save calculation result");
    } catch (error) {
      console.error("Error saving calculation result:", error);
      throw error;
    }
  }
}

// ✅ FAVORITES REPOSITORY CORREGIDO
export class ApiUserFavoritesRepository implements UserFavoritesRepository {
  constructor(private readonly apiClient: typeof ApiClient) {}

  async toggleFavorite(userId: string, templateId: string): Promise<boolean> {
    try {
      const response = await this.apiClient.post(`/calculations/templates/${templateId}/favorite`);
      return response.data.success;
    } catch (error) {
      console.error("Error toggling favorite:", error);
      // Fallback a localStorage
      this.toggleLocalStorageFavorite(userId, templateId);
      return true;
    }
  }

  async getUserFavorites(userId: string): Promise<string[]> {
    try {
      const response = await this.apiClient.get("/users/favorites");
      
      if (response.data.success && response.data.data) {
        return response.data.data.map((fav: any) => fav.templateId || fav.id);
      }
      
      return this.getLocalStorageFavorites(userId);
    } catch (error) {
      console.error("Error getting favorites:", error);
      return this.getLocalStorageFavorites(userId);
    }
  }

  // Métodos de fallback con localStorage
  private toggleLocalStorageFavorite(userId: string, templateId: string): void {
    try {
      const favorites = this.getLocalStorageFavorites(userId);
      const index = favorites.indexOf(templateId);
      
      if (index > -1) {
        favorites.splice(index, 1);
      } else {
        favorites.push(templateId);
      }
      
      localStorage.setItem(`favorites_${userId}`, JSON.stringify(favorites));
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