import React, {useState, useMemo, useEffect, useCallback} from "react";
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
import {TemplateCard} from "./components/TemplateCard";
import {CategoryFilter} from "./components/CategoryFilter";
import {TemplatePreview} from "./components/TemplatePreview";

// Usar los hooks corregidos
import {
	useCatalogTemplates,
	useCatalogSearch,
} from "../shared/hooks/useCatalogTemplates";
import type {
	CalculationTemplate as UITemplate,
	TemplateFilters as UITemplateFilters,
} from "../shared/types/template.types";

interface CalculationsCatalogProps {
	onTemplateSelect: (template: UITemplate) => void;
	onPreviewTemplate?: (template: UITemplate) => void;
}

const SORT_OPTIONS: {
	value: UITemplateFilters["sortBy"];
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

	// ==================== HOOKS ESPECIALIZADOS ====================
	const {
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

	const {
		searchTerm,
		activeFilters,
		sortBy,
		templates: filteredTemplates,
		setSearchTerm,
		setSortBy,
		updateFilter,
		clearFilters,
		hasActiveFilters,
	} = useCatalogSearch();

	// ==================== CONFIGURACIÓN DE USUARIO ====================
	useEffect(() => {
		const mockUserId = localStorage.getItem("current_user_id") || "user_123";
		setCurrentUserId?.(mockUserId);
	}, [setCurrentUserId]);

	// ==================== FILTRADO POR CATEGORÍA (SIN BUCLE INFINITO) ====================
	const handleCategoryChange = useCallback(
		(categoryId: string | null) => {
			setSelectedCategory(categoryId);
			setSelectedSubcategory(null);

			// Actualizar filtros de manera controlada
			if (categoryId !== activeFilters.category) {
				updateFilter("category", categoryId);
			}
		},
		[activeFilters.category, updateFilter]
	);

	const handleSubcategoryChange = useCallback(
		(subcategoryId: string | null) => {
			setSelectedSubcategory(subcategoryId);

			// Actualizar filtros de manera controlada
			if (subcategoryId !== activeFilters.subcategory) {
				updateFilter("subcategory", subcategoryId);
			}
		},
		[activeFilters.subcategory, updateFilter]
	);

	// ==================== ESTADÍSTICAS COMPUTADAS ====================
	const currentStats = useMemo(() => {
		if (!filteredTemplates || filteredTemplates.length === 0) {
			return {
				verifiedCount: 0,
				avgRating: 0,
				totalUsage: 0,
			};
		}

		const verifiedCount = filteredTemplates.filter(
			(t) => t.verified || t.is_verified
		).length;
		const totalRating = filteredTemplates.reduce((sum, t) => {
			const rating =
				typeof t.rating === "number"
					? t.rating
					: typeof t.average_rating === "number"
						? t.average_rating
						: 0;
			return sum + rating;
		}, 0);
		const avgRating =
			filteredTemplates.length > 0 ? totalRating / filteredTemplates.length : 0;
		const totalUsage = filteredTemplates.reduce((sum, t) => {
			const usage =
				typeof t.usageCount === "number"
					? t.usageCount
					: typeof t.usage_count === "number"
						? t.usage_count
						: 0;
			return sum + usage;
		}, 0);

		return {
			verifiedCount,
			avgRating,
			totalUsage,
		};
	}, [filteredTemplates]);

	// ==================== HANDLERS ====================
	const handleTemplatePreview = useCallback(
		(template: UITemplate) => {
			setPreviewTemplate(template);
			onPreviewTemplate?.(template);
		},
		[onPreviewTemplate]
	);

	const handleTemplateSelect = useCallback(
		(template: UITemplate) => {
			setPreviewTemplate(null);
			onTemplateSelect(template);
		},
		[onTemplateSelect]
	);

	const handleToggleFavorite = useCallback(
		async (templateId: string) => {
			try {
				await toggleFavorite(templateId);
			} catch (error) {
				console.error("Error al cambiar favorito:", error);
			}
		},
		[toggleFavorite]
	);

	const handleClearAllFilters = useCallback(() => {
		clearFilters();
		setSelectedCategory(null);
		setSelectedSubcategory(null);
	}, [clearFilters]);

	const handleQuickFilter = useCallback(
		(filterType: string, value: boolean) => {
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
		},
		[updateFilter]
	);

	const handleRefresh = useCallback(() => {
		clearError();
		refreshTemplates();
	}, [clearError, refreshTemplates]);

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
						onClick={handleRefresh}
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
									<span>{currentStats.avgRating.toFixed(1)} promedio</span>
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
								onClick={handleRefresh}
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

							{/* Filtros adicionales */}
							<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
								<h3 className="text-lg font-semibold text-gray-900 mb-4">
									Filtros Avanzados
								</h3>

								{/* Dificultad */}
								<div className="mb-4">
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Dificultad
									</label>
									<div className="space-y-2">
										{[
											{value: null, label: "Todas"},
											{value: "basic", label: "Básico"},
											{value: "intermediate", label: "Intermedio"},
											{value: "advanced", label: "Avanzado"},
										].map((option) => (
											<label
												key={option.value || "all"}
												className="flex items-center"
											>
												<input
													type="radio"
													name="difficulty"
													checked={activeFilters.difficulty === option.value}
													onChange={() =>
														updateFilter("difficulty", option.value)
													}
													className="h-4 w-4 text-primary-600 focus:ring-primary-500"
												/>
												<span className="ml-2 text-sm text-gray-700">
													{option.label}
												</span>
											</label>
										))}
									</div>
								</div>
							</div>
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
										value={sortBy || "popular"}
										onChange={(e) =>
											setSortBy(e.target.value as UITemplateFilters["sortBy"])
										}
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
						{hasActiveFilters && (
							<div className="mb-6">
								<div className="flex items-center justify-between">
									<div>
										<h2 className="text-xl font-semibold text-gray-900">
											{selectedCategory
												? categories.find((c) => c.id === selectedCategory)
														?.name
												: "Resultados de búsqueda"}
										</h2>
										<p className="text-gray-600">
											{filteredTemplates.length} plantillas encontradas
										</p>
									</div>

									<button
										onClick={handleClearAllFilters}
										className="text-primary-600 hover:text-primary-700 text-sm font-medium"
									>
										Limpiar filtros
									</button>
								</div>
							</div>
						)}

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
									onClick={handleClearAllFilters}
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

			{/* Estilos adicionales */}
			<style>{`
				@keyframes fadeIn {
					from {
						opacity: 0;
						transform: translateY(20px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}
				
				.animate-fade-in {
					animation: fadeIn 0.6s ease-out forwards;
					opacity: 0;
				}
			`}</style>
		</div>
	);
};

export default CalculationsCatalog;
