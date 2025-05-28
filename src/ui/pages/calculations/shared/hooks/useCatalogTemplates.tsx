// src/ui/pages/calculations/shared/hooks/useCatalogTemplates.tsx

import {useState, useEffect, useCallback, useMemo, useRef} from "react";
import {templateApplicationService} from "../../../../../core/application/ServiceFactory";
import type {
	CalculationTemplate,
	TemplateFilters,
	CatalogStats,
	UseCatalogTemplatesOptions,
	TemplateCategory,
} from "../types/template.types";
import {TEMPLATE_CATEGORIES} from "../types/template.types";
import {useAuth} from "../../../../context/AuthContext";

// ==================== HOOK PRINCIPAL SIMPLIFICADO ====================
export const useCatalogTemplates = (
	options: UseCatalogTemplatesOptions = {}
) => {
	const {user} = useAuth();
	const [templates, setTemplates] = useState<CalculationTemplate[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [currentUserId, setCurrentUserId] = useState<string | null>(null);
	const loadingRef = useRef(false);

	// Cargar templates
	const refreshTemplates = useCallback(async () => {
		if (loadingRef.current) return;

		try {
			loadingRef.current = true;
			setIsLoading(true);
			setError(null);

			console.log("🔄 Loading templates...");

			const result = await templateApplicationService.getTemplates({
				showOnlyVerified: options.onlyVerified ?? true,
				showOnlyFeatured: true,
				limit: 100,
			});

			if (result.data) {
				console.log(`📦 Loaded ${result.data.length} templates`);

				// ✅ CARGAR FAVORITOS SI HAY USUARIO
				if (user) {
					try {
						console.log("❤️ Loading favorites for user:", user.id);
						const favorites = await templateApplicationService.getUserFavorites(
							user.id
						);
						const favoriteIds = new Set(favorites.map((f) => f.id));
						console.log("❤️ Found favorites:", Array.from(favoriteIds));

						const templatesWithFavorites = result.data.map((template) => ({
							...template,
							isFavorite: favoriteIds.has(template.id),
						}));

						setTemplates(templatesWithFavorites);
						console.log(
							`✅ Templates loaded with favorites: ${templatesWithFavorites.filter((t) => t.isFavorite).length} favorites`
						);
					} catch (favoriteError) {
						console.warn(
							"⚠️ Error loading favorites, continuing without them:",
							favoriteError
						);
						setTemplates(result.data);
					}
				} else {
					console.log("👤 No user, loading templates without favorites");
					setTemplates(result.data);
				}
			}
		} catch (err) {
			console.error("❌ Error loading templates:", err);
			setError("Error cargando plantillas");
		} finally {
			loadingRef.current = false;
			setIsLoading(false);
		}
	}, [options.onlyVerified, user]);

	// ✅ Toggle favorite con logging detallado
	const toggleFavorite = useCallback(
		async (templateId: string) => {
			if (!user) {
				console.warn("👤 User not authenticated, cannot toggle favorite");
				return false;
			}

			console.log(`❤️ Toggling favorite for template: ${templateId}`);

			// Encontrar template actual
			const currentTemplate = templates.find((t) => t.id === templateId);
			if (!currentTemplate) {
				console.error(
					`❌ Template ${templateId} not found in current templates`
				);
				return false;
			}

			const oldIsFavorite = currentTemplate.isFavorite;
			const newIsFavorite = !oldIsFavorite;

			console.log(
				`❤️ Template ${templateId}: ${oldIsFavorite} -> ${newIsFavorite}`
			);

			// ✅ Actualización inmediata del estado para feedback visual
			setTemplates((prevTemplates) => {
				const updated = prevTemplates.map((template) =>
					template.id === templateId
						? {...template, isFavorite: newIsFavorite}
						: template
				);
				console.log(
					`🔄 Updated templates state. Favorites count: ${updated.filter((t) => t.isFavorite).length}`
				);
				return updated;
			});

			try {
				// Llamar al servicio
				const actualNewIsFavorite =
					await templateApplicationService.toggleFavorite(user.id, templateId);

				console.log(`✅ Server responded: isFavorite = ${actualNewIsFavorite}`);

				// Verificar si el resultado del servidor es diferente al optimista
				if (actualNewIsFavorite !== newIsFavorite) {
					console.log(
						`🔄 Server result differs from optimistic update, correcting...`
					);
					setTemplates((prevTemplates) =>
						prevTemplates.map((template) =>
							template.id === templateId
								? {...template, isFavorite: actualNewIsFavorite}
								: template
						)
					);
				}

				return actualNewIsFavorite;
			} catch (error) {
				console.error("❌ Error toggling favorite:", error);

				// Revertir cambio optimista en caso de error
				console.log(`🔄 Reverting optimistic update due to error`);
				setTemplates((prevTemplates) =>
					prevTemplates.map((template) =>
						template.id === templateId
							? {...template, isFavorite: oldIsFavorite}
							: template
					)
				);

				throw error;
			}
		},
		[user, templates]
	);

	// Cargar al inicializar
	useEffect(() => {
		if (options.autoLoad !== false) {
			refreshTemplates();
		}
	}, [refreshTemplates, options.autoLoad]);

	// Calcular categorías con conteos
	const categoriesWithCounts = useMemo(() => {
		return TEMPLATE_CATEGORIES.map((category) => ({
			...category,
			count: templates.filter(
				(t) =>
					t.type === category.id ||
					t.category === category.id ||
					(t.type && t.type.toLowerCase() === category.id.toLowerCase()) ||
					(t.category && t.category.toLowerCase() === category.id.toLowerCase())
			).length,
			subcategories: category.subcategories?.map((sub) => ({
				...sub,
				count: templates.filter(
					(t) =>
						((t.type === category.id || t.category === category.id) &&
							(t.subcategory === sub.id || t.type === sub.id)) ||
						(t.type &&
							t.type.toLowerCase() === category.id.toLowerCase() &&
							t.subcategory &&
							t.subcategory.toLowerCase() === sub.id.toLowerCase())
				).length,
			})),
		}));
	}, [templates]);

	// Calcular estadísticas
	const stats = useMemo((): CatalogStats => {
		const result = {
			total: templates.length,
			verifiedCount: templates.filter((t) => t.isVerified || t.verified).length,
			avgRating:
				templates.length > 0
					? templates.reduce(
							(sum, t) => sum + (t.averageRating || t.rating || 0),
							0
						) / templates.length
					: 0,
			totalUsage: templates.reduce((sum, t) => sum + (t.usageCount || 0), 0),
			trendingCount: templates.filter((t) => t.trending).length,
			popularCount: templates.filter((t) => t.popular).length,
		};

		console.log("📊 Stats calculated:", result);
		return result;
	}, [templates]);

	const clearError = useCallback(() => setError(null), []);

	// Log del estado actual (solo en desarrollo)
	useEffect(() => {
		if (process.env.NODE_ENV === "development") {
			console.log("🏗️ useCatalogTemplates state:", {
				templatesCount: templates.length,
				favoritesCount: templates.filter((t) => t.isFavorite).length,
				isLoading,
				error,
				userId: user?.id,
			});
		}
	}, [templates, isLoading, error, user]);

	return {
		templates,
		categories: categoriesWithCounts,
		isLoading,
		error,
		stats,
		toggleFavorite,
		refreshTemplates,
		clearError,
		setCurrentUserId,
	};
};

// ==================== HOOK DE BÚSQUEDA REMOVIDO ====================
// Ya no necesitamos useCatalogSearch como hook separado
// La lógica de filtrado se movió directamente a CalculationsCatalog


