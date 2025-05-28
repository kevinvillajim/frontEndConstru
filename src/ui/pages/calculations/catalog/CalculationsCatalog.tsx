// ui/pages/calculations/catalog/CalculationsCatalog.tsx

import React, {useState, useMemo, useEffect} from "react";
import {
	CheckBadgeIcon,
	MagnifyingGlassIcon,
	AdjustmentsHorizontalIcon,
	StarIcon,
	CalculatorIcon,
	FireIcon,
	ClockIcon,
	ArrowTrendingUpIcon,
	ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import {TemplateCard} from "./components/TemplateCardCatalog";
import {CategoryFilter} from "./components/CategoryFilter";
import {TemplatePreview} from "./components/TemplatePreview";

// Usar solo el hook principal
import {useCatalogTemplates} from "../shared/hooks/useCatalogTemplates";
import type {
	CalculationTemplate as UITemplate,
	TemplateFilters as UITemplateFilters,
	SortOption,
} from "../shared/types/template.types";

interface CalculationsCatalogProps {
	onTemplateSelect: (template: UITemplate) => void;
	onPreviewTemplate?: (template: UITemplate) => void;
}

const SORT_OPTIONS: {
	value: SortOption;
	label: string;
	icon: React.ComponentType<any>;
}[] = [
	{value: "popular", label: "Más Populares", icon: FireIcon},
	{value: "rating", label: "Mejor Calificados", icon: StarIcon},
	{value: "trending", label: "Tendencia", icon: ArrowTrendingUpIcon},
	{value: "recent", label: "Recientes", icon: ClockIcon},
	{value: "name", label: "Alfabético", icon: CalculatorIcon},
];

const CalculationsCatalog: React.FC<CalculationsCatalogProps> = ({
	onTemplateSelect,
	onPreviewTemplate,
}) => {
	// ==================== ESTADOS LOCALES ====================
	const [previewTemplate, setPreviewTemplate] = useState<UITemplate | null>(
		null
	);
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
		null
	);

	// Estados de búsqueda y filtros (movidos aquí desde useCatalogSearch)
	const [searchTerm, setSearchTerm] = useState("");
	const [sortBy, setSortBy] = useState<SortOption>("popular");
	const [activeFilters, setActiveFilters] = useState<UITemplateFilters>({
		showOnlyVerified: true,
	});

	// ==================== HOOK PRINCIPAL (ÚNICA INSTANCIA) ====================
	const {
		templates: allTemplates,
		categories,
		isLoading,
		error,
		stats,
		toggleFavorite,
		refreshTemplates,
		clearError,
		setCurrentUserId,
	} = useCatalogTemplates({
		autoLoad: true,
		includePersonal: false,
		onlyVerified: true,
	});

	// ==================== CONFIGURACIÓN DE USUARIO ====================
	useEffect(() => {
		const mockUserId = localStorage.getItem("current_user_id") || "user_123";
		setCurrentUserId(mockUserId);
	}, [setCurrentUserId]);

	// ==================== FILTROS Y BÚSQUEDA (MOVIDO AQUÍ) ====================
	const updateFilter = (key: keyof UITemplateFilters, value: unknown) => {
		setActiveFilters((prev) => ({...prev, [key]: value}));
	};

	const clearFilters = () => {
		setSearchTerm("");
		setSortBy("popular");
		setActiveFilters({showOnlyVerified: true});
		setSelectedCategory(null);
		setSelectedSubcategory(null);
	};

	// ✅ Filtrado directo usando el estado único
	const filteredTemplates = useMemo(() => {
		let filtered = [...allTemplates];

		// Filtrar por búsqueda
		if (searchTerm) {
			const searchLower = searchTerm.toLowerCase();
			filtered = filtered.filter(
				(template) =>
					template.name.toLowerCase().includes(searchLower) ||
					template.description.toLowerCase().includes(searchLower) ||
					(template.necReference &&
						template.necReference.toLowerCase().includes(searchLower)) ||
					(template.tags &&
						template.tags.some((tag) =>
							tag.toLowerCase().includes(searchLower)
						))
			);
		}

		// Filtrar por categoría
		if (selectedCategory) {
			const categoryLower = selectedCategory.toLowerCase();
			filtered = filtered.filter(
				(template) =>
					template.type === selectedCategory ||
					template.category === selectedCategory ||
					(template.type && template.type.toLowerCase() === categoryLower) ||
					(template.category &&
						template.category.toLowerCase() === categoryLower)
			);
		}

		// Filtrar por subcategoría
		if (selectedSubcategory) {
			const subcategoryLower = selectedSubcategory.toLowerCase();
			filtered = filtered.filter(
				(template) =>
					template.subcategory === selectedSubcategory ||
					template.type === selectedSubcategory ||
					(template.subcategory &&
						template.subcategory.toLowerCase() === subcategoryLower) ||
					(template.type && template.type.toLowerCase() === subcategoryLower)
			);
		}

		// Filtrar por dificultad
		if (activeFilters.difficulty) {
			filtered = filtered.filter(
				(template) => template.difficulty === activeFilters.difficulty
			);
		}

		// Filtrar solo favoritos
		if (activeFilters.showOnlyFavorites) {
			filtered = filtered.filter((template) => template.isFavorite);
		}

		// Filtrar solo verificados
		if (activeFilters.showOnlyVerified) {
			filtered = filtered.filter(
				(template) => template.isVerified || template.verified
			);
		}

		// Filtrar solo destacados
		if (activeFilters.showOnlyFeatured) {
			filtered = filtered.filter(
				(template) =>
					template.trending || template.popular || template.isFeatured
			);
		}

		// Ordenar
		switch (sortBy) {
			case "popular":
				filtered.sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0));
				break;
			case "rating":
				filtered.sort((a, b) => {
					const aRating = a.averageRating || a.rating || 0;
					const bRating = b.averageRating || b.rating || 0;
					return bRating - aRating;
				});
				break;
			case "trending":
				filtered.sort((a, b) => {
					if (b.trending && !a.trending) return 1;
					if (!b.trending && a.trending) return -1;
					return (b.usageCount || 0) - (a.usageCount || 0);
				});
				break;
			case "recent":
				filtered.sort((a, b) => {
					const aDate = new Date(a.updatedAt || a.lastUpdated || 0).getTime();
					const bDate = new Date(b.updatedAt || b.lastUpdated || 0).getTime();
					return bDate - aDate;
				});
				break;
			case "name":
				filtered.sort((a, b) => a.name.localeCompare(b.name));
				break;
		}

		return filtered;
	}, [
		allTemplates,
		searchTerm,
		selectedCategory,
		selectedSubcategory,
		activeFilters,
		sortBy,
	]);

	const hasActiveFilters = useMemo(() => {
		return (
			searchTerm !== "" ||
			selectedCategory !== null ||
			selectedSubcategory !== null ||
			activeFilters.difficulty !== undefined ||
			activeFilters.showOnlyFavorites === true ||
			activeFilters.showOnlyFeatured === true ||
			activeFilters.showOnlyVerified !== true
		);
	}, [searchTerm, selectedCategory, selectedSubcategory, activeFilters]);

	// ==================== ESTADÍSTICAS COMPUTADAS ====================
	const currentStats = useMemo(() => {
		return {
			verifiedCount: stats.verifiedCount,
			avgRating: Number(stats.avgRating.toFixed(1)),
			totalUsage: stats.totalUsage,
		};
	}, [stats]);

	// ==================== HANDLERS ====================
	const handleCategoryChange = (categoryId: string | null) => {
		setSelectedCategory(categoryId);
		setSelectedSubcategory(null);
	};

	const handleSubcategoryChange = (subcategoryId: string | null) => {
		setSelectedSubcategory(subcategoryId);
	};

	const handleTemplatePreview = (template: UITemplate) => {
		setPreviewTemplate(template);
		onPreviewTemplate?.(template);
	};

	const handleTemplateSelect = (template: UITemplate) => {
		setPreviewTemplate(null);
		onTemplateSelect(template);
	};

	// ✅ Toggle favoritos simplificado usando directamente el hook
	const handleToggleFavorite = async (templateId: string) => {
		try {
			await toggleFavorite(templateId);
			console.log("Toggle favorite completed for:", templateId);
		} catch (error) {
			console.error("Error al cambiar favorito:", error);
		}
	};

	const handleQuickFilter = (filterType: string, value: boolean) => {
		switch (filterType) {
			case "favorites":
				updateFilter("showOnlyFavorites", value);
				break;
			case "verified":
				updateFilter("showOnlyVerified", value);
				break;
			default:
				break;
		}
	};

	// ==================== ESTADO DE CARGA ====================
	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin h-12 w-12 border-4 border-primary-600 rounded-full border-t-transparent mx-auto mb-4" />
					<p className="text-gray-600">Cargando catálogo de plantillas...</p>
				</div>
			</div>
		);
	}

	// ==================== ESTADO DE ERROR ====================
	if (error) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center max-w-md">
					<ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
					<h2 className="text-xl font-semibold text-gray-900 mb-2">
						Error al cargar plantillas
					</h2>
					<p className="text-gray-600 mb-4">{error}</p>
					<button
						onClick={refreshTemplates}
						className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
					>
						Reintentar
					</button>
				</div>
			</div>
		);
	}

	// ==================== RENDER PRINCIPAL ====================
	return (
		<div className="min-h-screen bg-gray-50 relative">
			{/* Header optimizado */}
			<div className="bg-white border-b border-gray-200 sticky top-0 z-40">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
						<div>
							<h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">
								Catálogo de Plantillas NEC
							</h1>
							<div className="flex items-center gap-4 text-sm text-gray-600">
								<div className="flex items-center gap-1">
									<CheckBadgeIcon className="h-4 w-4 text-green-600" />
									<span>{currentStats.verifiedCount} verificadas</span>
								</div>
								<div className="flex items-center gap-1">
									<StarIcon className="h-4 w-4 text-yellow-500" />
									<span>{currentStats.avgRating} promedio</span>
								</div>
								<div className="flex items-center gap-1">
									<CalculatorIcon className="h-4 w-4 text-primary-600" />
									<span>
										{currentStats.totalUsage.toLocaleString()} cálculos
										realizados
									</span>
								</div>
							</div>
						</div>

						{/* Controles rápidos */}
						<div className="flex items-center gap-3">
							<button
								onClick={() =>
									handleQuickFilter(
										"favorites",
										!activeFilters.showOnlyFavorites
									)
								}
								className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
									activeFilters.showOnlyFavorites
										? "bg-secondary-50 border-secondary-300 text-secondary-700"
										: "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
								}`}
							>
								<StarIcon className="h-4 w-4" />
								Favoritos
							</button>

							<button
								onClick={() =>
									handleQuickFilter("verified", !activeFilters.showOnlyVerified)
								}
								className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
									activeFilters.showOnlyVerified
										? "bg-green-50 border-green-300 text-green-700"
										: "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
								}`}
							>
								<CheckBadgeIcon className="h-4 w-4" />
								Solo Verificadas
							</button>

							<button
								onClick={refreshTemplates}
								className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium transition-all duration-200"
								title="Actualizar plantillas"
							>
								🔄 Actualizar
							</button>
						</div>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex gap-8">
					{/* Sidebar con filtros */}
					<div className="w-80 flex-shrink-0">
						<div className="sticky top-24 space-y-6">
							{/* Filtros por categoría */}
							<CategoryFilter
								categories={categories}
								selectedCategory={selectedCategory}
								selectedSubcategory={selectedSubcategory}
								onCategoryChange={handleCategoryChange}
								onSubcategoryChange={handleSubcategoryChange}
							/>
						</div>
					</div>

					{/* Contenido principal */}
					<div className="flex-1">
						{/* Barra de búsqueda y ordenación */}
						<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
							<div className="flex flex-col lg:flex-row gap-4">
								{/* Búsqueda */}
								<div className="flex-1">
									<div className="relative">
										<MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
										<input
											type="text"
											placeholder="Buscar plantillas técnicas..."
											value={searchTerm}
											onChange={(e) => setSearchTerm(e.target.value)}
											className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
										/>
									</div>
								</div>

								{/* Ordenación */}
								<div className="flex items-center gap-3">
									<AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-500" />
									<select
										value={sortBy}
										onChange={(e) => setSortBy(e.target.value as SortOption)}
										className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white min-w-[180px]"
									>
										{SORT_OPTIONS.map((option) => (
											<option key={option.value} value={option.value}>
												{option.label}
											</option>
										))}
									</select>
								</div>
							</div>
						</div>

						{/* Estadísticas de resultados */}
						<div className="mb-6">
							<div className="flex items-center justify-between">
								<div>
									<h2 className="text-xl font-semibold text-gray-900">
										{selectedCategory
											? categories.find((c) => c.id === selectedCategory)?.name
											: "Todas las plantillas"}
									</h2>
									<p className="text-gray-600">
										{filteredTemplates.length} plantillas encontradas
									</p>
								</div>

								{hasActiveFilters && (
									<button
										onClick={clearFilters}
										className="text-primary-600 hover:text-primary-700 text-sm font-medium"
									>
										Limpiar filtros
									</button>
								)}
							</div>
						</div>

						{/* Grid de plantillas */}
						<div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
							{filteredTemplates.map((template, index) => (
								<TemplateCard
									key={template.id}
									template={template}
									onSelect={() => handleTemplateSelect(template)}
									onPreview={() => handleTemplatePreview(template)}
									onToggleFavorite={() => handleToggleFavorite(template.id)}
									animationDelay={index * 0.05}
								/>
							))}
						</div>

						{/* Estado vacío */}
						{filteredTemplates.length === 0 && !isLoading && (
							<div className="text-center py-16">
								<div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
									<CalculatorIcon className="h-12 w-12 text-gray-400" />
								</div>
								<h3 className="text-lg font-medium text-gray-900 mb-2">
									No se encontraron plantillas
								</h3>
								<p className="text-gray-600 mb-6">
									{searchTerm
										? "Intenta con otros términos de búsqueda"
										: "No hay plantillas disponibles para los filtros seleccionados"}
								</p>
								<button
									onClick={clearFilters}
									className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
								>
									Limpiar Filtros
								</button>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Modal de vista previa */}
			{previewTemplate && (
				<TemplatePreview
					template={previewTemplate}
					onClose={() => setPreviewTemplate(null)}
					onSelect={() => handleTemplateSelect(previewTemplate)}
					onToggleFavorite={() => handleToggleFavorite(previewTemplate.id)}
				/>
			)}

			{/* Debug info */}
			{process.env.NODE_ENV === "development" && (
				<div className="fixed bottom-4 right-4 bg-black text-white p-2 rounded text-xs max-w-xs z-50">
					<div>Total: {allTemplates.length}</div>
					<div>Filtered: {filteredTemplates.length}</div>
					<div>
						Favorites: {allTemplates.filter((t) => t.isFavorite).length}
					</div>
				</div>
			)}
		</div>
	);
};

export default CalculationsCatalog;
