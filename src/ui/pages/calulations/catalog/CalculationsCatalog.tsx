import React, {useState, useMemo} from "react";
import {
	CheckBadgeIcon,
	MagnifyingGlassIcon,
	AdjustmentsHorizontalIcon,
	StarIcon,
	CalculatorIcon,
	FireIcon,
	TrendingUpIcon,
	ClockIcon,
} from "@heroicons/react/24/outline";
import {TemplateCard} from "./components/TemplateCard";
import {CategoryFilter} from "./components/CategoryFilter";
import {TemplatePreview} from "./components/TemplatePreview";
import {useTemplates} from "../shared/hooks/useTemplates";
import type {
	CalculationTemplate,
	TemplateFilters,
	SortOption,
} from "../shared/types/template.types";

interface CalculationsCatalogProps {
	onTemplateSelect: (template: CalculationTemplate) => void;
	onPreviewTemplate?: (template: CalculationTemplate) => void;
}

const SORT_OPTIONS: {
	value: SortOption;
	label: string;
	icon: React.ComponentType<any>;
}[] = [
	{value: "popular", label: "Más Populares", icon: FireIcon},
	{value: "rating", label: "Mejor Calificados", icon: StarIcon},
	{value: "trending", label: "Tendencia", icon: TrendingUpIcon},
	{value: "recent", label: "Recientes", icon: ClockIcon},
	{value: "name", label: "Alfabético", icon: CalculatorIcon},
];

const CalculationsCatalog: React.FC<CalculationsCatalogProps> = ({
	onTemplateSelect,
	onPreviewTemplate,
}) => {
	// Estados locales
	const [previewTemplate, setPreviewTemplate] =
		useState<CalculationTemplate | null>(null);
	const [filters, setFilters] = useState<TemplateFilters>({
		category: null,
		subcategory: null,
		searchTerm: "",
		sortBy: "popular",
		showOnlyFavorites: false,
		showOnlyVerified: true, // Solo plantillas verificadas por defecto
		difficulty: null,
	});

	// Hook personalizado para gestionar plantillas
	const {
		templates,
		categories,
		isLoading,
		toggleFavorite,
		getFilteredTemplates,
		getTemplateStats,
	} = useTemplates();

	// Templates filtrados y ordenados
	const filteredTemplates = useMemo(() => {
		return getFilteredTemplates(filters);
	}, [getFilteredTemplates, filters]);

	// Estadísticas para mostrar
	const stats = useMemo(() => {
		return getTemplateStats(filteredTemplates);
	}, [getTemplateStats, filteredTemplates]);

	// Handlers
	const handleFilterChange = (newFilters: Partial<TemplateFilters>) => {
		setFilters((prev) => ({...prev, ...newFilters}));
	};

	const handleTemplatePreview = (template: CalculationTemplate) => {
		setPreviewTemplate(template);
		onPreviewTemplate?.(template);
	};

	const handleTemplateSelect = (template: CalculationTemplate) => {
		setPreviewTemplate(null);
		onTemplateSelect(template);
	};

	const clearFilters = () => {
		setFilters({
			category: null,
			subcategory: null,
			searchTerm: "",
			sortBy: "popular",
			showOnlyFavorites: false,
			showOnlyVerified: true,
			difficulty: null,
		});
	};

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
									<span>{stats.verifiedCount} verificadas</span>
								</div>
								<div className="flex items-center gap-1">
									<StarIcon className="h-4 w-4 text-yellow-500" />
									<span>{stats.avgRating.toFixed(1)} promedio</span>
								</div>
								<div className="flex items-center gap-1">
									<CalculatorIcon className="h-4 w-4 text-primary-600" />
									<span>{stats.totalUsage} cálculos realizados</span>
								</div>
							</div>
						</div>

						{/* Controles rápidos */}
						<div className="flex items-center gap-3">
							<button
								onClick={() =>
									handleFilterChange({
										showOnlyFavorites: !filters.showOnlyFavorites,
									})
								}
								className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
									filters.showOnlyFavorites
										? "bg-secondary-50 border-secondary-300 text-secondary-700"
										: "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
								}`}
							>
								<StarIcon className="h-4 w-4" />
								Favoritos
							</button>

							<button
								onClick={() =>
									handleFilterChange({
										showOnlyVerified: !filters.showOnlyVerified,
									})
								}
								className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
									filters.showOnlyVerified
										? "bg-green-50 border-green-300 text-green-700"
										: "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
								}`}
							>
								<CheckBadgeIcon className="h-4 w-4" />
								Solo Verificadas
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
								selectedCategory={filters.category}
								selectedSubcategory={filters.subcategory}
								onCategoryChange={(category) =>
									handleFilterChange({
										category,
										subcategory: null,
									})
								}
								onSubcategoryChange={(subcategory) =>
									handleFilterChange({subcategory})
								}
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
													checked={filters.difficulty === option.value}
													onChange={() =>
														handleFilterChange({difficulty: option.value})
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
											value={filters.searchTerm}
											onChange={(e) =>
												handleFilterChange({searchTerm: e.target.value})
											}
											className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
										/>
									</div>
								</div>

								{/* Ordenación */}
								<div className="flex items-center gap-3">
									<AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-500" />
									<select
										value={filters.sortBy}
										onChange={(e) =>
											handleFilterChange({sortBy: e.target.value as SortOption})
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
						{(filters.category || filters.searchTerm) && (
							<div className="mb-6">
								<div className="flex items-center justify-between">
									<div>
										<h2 className="text-xl font-semibold text-gray-900">
											{filters.category
												? categories.find((c) => c.id === filters.category)
														?.name
												: "Resultados de búsqueda"}
										</h2>
										<p className="text-gray-600">
											{filteredTemplates.length} plantillas encontradas
										</p>
									</div>

									{(filters.category || filters.searchTerm) && (
										<button
											onClick={clearFilters}
											className="text-primary-600 hover:text-primary-700 text-sm font-medium"
										>
											Limpiar filtros
										</button>
									)}
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
									onToggleFavorite={() => toggleFavorite(template.id)}
									animationDelay={index * 0.05}
								/>
							))}
						</div>

						{/* Estado vacío */}
						{filteredTemplates.length === 0 && (
							<div className="text-center py-16">
								<div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
									<CalculatorIcon className="h-12 w-12 text-gray-400" />
								</div>
								<h3 className="text-lg font-medium text-gray-900 mb-2">
									No se encontraron plantillas
								</h3>
								<p className="text-gray-600 mb-6">
									{filters.searchTerm
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
				/>
			)}

			{/* Estilos adicionales */}
			<style jsx>{`
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
