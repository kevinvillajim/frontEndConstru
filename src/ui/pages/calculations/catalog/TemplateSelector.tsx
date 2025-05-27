import React, {useState, useMemo} from "react";
import {
	MagnifyingGlassIcon,
	AdjustmentsHorizontalIcon,
	StarIcon,
	CheckBadgeIcon,
	FireIcon,
	ArrowTrendingUpIcon,
	SparklesIcon,
} from "@heroicons/react/24/outline";
import {TemplateCard} from "./components/TemplateCardCatalog";
import {useTemplates} from "../shared/hooks/useTemplates";
import type {
	CalculationTemplate,
	TemplateFilters,
	SortOption,
} from "../shared/types/template.types";

interface TemplateSelectorProps {
	onTemplateSelect: (template: CalculationTemplate) => void;
	preSelectedCategory?: string;
	showSearch?: boolean;
	showFilters?: boolean;
	maxResults?: number;
	compact?: boolean;
	title?: string;
	subtitle?: string;
}

const QUICK_FILTERS = [
	{
		id: "all",
		label: "Todas",
		icon: SparklesIcon,
		filter: {},
	},
	{
		id: "trending",
		label: "Tendencia",
		icon: ArrowTrendingUpIcon,
		filter: {sortBy: "trending" as SortOption},
	},
	{
		id: "popular",
		label: "Populares",
		icon: FireIcon,
		filter: {sortBy: "popular" as SortOption},
	},
	{
		id: "favorites",
		label: "Favoritos",
		icon: StarIcon,
		filter: {showOnlyFavorites: true},
	},
	{
		id: "verified",
		label: "Verificadas",
		icon: CheckBadgeIcon,
		filter: {showOnlyVerified: true},
	},
];

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
	onTemplateSelect,
	preSelectedCategory,
	showSearch = true,
	showFilters = true,
	maxResults = 12,
	compact = false,
	title = "Selecciona una Plantilla",
	subtitle = "Elige la plantilla que mejor se adapte a tu cálculo",
}) => {
	// Estados locales
	const [quickFilter, setQuickFilter] = useState("all");
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedSort, setSelectedSort] = useState<SortOption>("popular");

	// Hook de plantillas
	const {
		categories,
		isLoading,
		toggleFavorite,
		getFilteredTemplates,
	} = useTemplates();

	// Filtros aplicados
	const appliedFilters: TemplateFilters = useMemo(() => {
		const baseFilters: TemplateFilters = {
			category: preSelectedCategory || null,
			subcategory: null,
			searchTerm,
			sortBy: selectedSort,
			showOnlyFavorites: false,
			showOnlyVerified: true, // Solo plantillas verificadas por defecto
			difficulty: null,
		};

		// Aplicar filtro rápido seleccionado
		const quickFilterConfig = QUICK_FILTERS.find((f) => f.id === quickFilter);
		if (quickFilterConfig) {
			return {...baseFilters, ...quickFilterConfig.filter};
		}

		return baseFilters;
	}, [preSelectedCategory, searchTerm, selectedSort, quickFilter]);

	// Templates filtrados
	const filteredTemplates = useMemo(() => {
		const filtered = getFilteredTemplates(appliedFilters);
		return maxResults ? filtered.slice(0, maxResults) : filtered;
	}, [getFilteredTemplates, appliedFilters, maxResults]);

	// Categoría seleccionada (para mostrar contexto)
	const selectedCategory = useMemo(() => {
		return preSelectedCategory
			? categories.find((c) => c.id === preSelectedCategory)
			: null;
	}, [preSelectedCategory, categories]);

	// Handlers
	const handleTemplateSelect = (template: CalculationTemplate) => {
		onTemplateSelect(template);
	};

	const handleSearchChange = (value: string) => {
		setSearchTerm(value);
		// Resetear a "all" cuando se busca
		if (value && quickFilter !== "all") {
			setQuickFilter("all");
		}
	};

	const handleQuickFilter = (filterId: string) => {
		setQuickFilter(filterId);
		// Limpiar búsqueda cuando se aplica un filtro rápido
		if (filterId !== "all" && searchTerm) {
			setSearchTerm("");
		}
	};

	if (isLoading) {
		return (
			<div className="p-8 text-center">
				<div className="animate-spin h-8 w-8 border-4 border-primary-600 rounded-full border-t-transparent mx-auto mb-4" />
				<p className="text-gray-600">Cargando plantillas...</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="text-center">
				<h2 className="text-2xl font-bold text-gray-900 mb-2">
					{selectedCategory ? `${title} - ${selectedCategory.name}` : title}
				</h2>
				<p className="text-gray-600">
					{selectedCategory
						? `${selectedCategory.description} • ${filteredTemplates.length} plantillas disponibles`
						: `${subtitle} • ${filteredTemplates.length} plantillas disponibles`}
				</p>
			</div>

			{/* Controles de filtrado */}
			{showFilters && (
				<div className="bg-white rounded-xl border border-gray-200 p-4">
					{/* Filtros rápidos */}
					<div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
						{QUICK_FILTERS.map((filter) => {
							const isActive = quickFilter === filter.id;
							const Icon = filter.icon;

							return (
								<button
									key={filter.id}
									onClick={() => handleQuickFilter(filter.id)}
									className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
										isActive
											? "bg-primary-100 text-primary-700 border border-primary-300"
											: "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-transparent"
									}`}
								>
									<Icon className="h-4 w-4" />
									{filter.label}
								</button>
							);
						})}
					</div>

					{/* Búsqueda y ordenación */}
					{showSearch && (
						<div className="flex flex-col sm:flex-row gap-3">
							{/* Campo de búsqueda */}
							<div className="flex-1 relative">
								<MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
								<input
									type="text"
									placeholder="Buscar plantillas..."
									value={searchTerm}
									onChange={(e) => handleSearchChange(e.target.value)}
									className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
								/>
							</div>

							{/* Ordenación */}
							<div className="flex items-center gap-2">
								<AdjustmentsHorizontalIcon className="h-4 w-4 text-gray-500" />
								<select
									value={selectedSort}
									onChange={(e) =>
										setSelectedSort(e.target.value as SortOption)
									}
									className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-sm min-w-[140px]"
								>
									<option value="popular">Más Populares</option>
									<option value="rating">Mejor Calificadas</option>
									<option value="trending">En Tendencia</option>
									<option value="recent">Recientes</option>
									<option value="name">Alfabético</option>
								</select>
							</div>
						</div>
					)}
				</div>
			)}

			{/* Grid de plantillas */}
			<div
				className={`grid gap-4 ${
					compact
						? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
						: "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
				}`}
			>
				{filteredTemplates.map((template, index) => (
					<TemplateCard
						key={template.id}
						template={template}
						onSelect={() => handleTemplateSelect(template)}
						onToggleFavorite={() => toggleFavorite(template.id)}
						animationDelay={index * 0.05}
						compact={compact}
						showPreviewButton={false} // En selector no mostramos preview
					/>
				))}
			</div>

			{/* Estado vacío */}
			{filteredTemplates.length === 0 && (
				<div className="text-center py-12">
					<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<MagnifyingGlassIcon className="h-8 w-8 text-gray-400" />
					</div>
					<h3 className="text-lg font-medium text-gray-900 mb-2">
						No se encontraron plantillas
					</h3>
					<p className="text-gray-600 mb-4">
						{searchTerm
							? `No hay resultados para "${searchTerm}"`
							: "No hay plantillas disponibles para los filtros seleccionados"}
					</p>
					<button
						onClick={() => {
							setSearchTerm("");
							setQuickFilter("all");
							setSelectedSort("popular");
						}}
						className="text-primary-600 hover:text-primary-700 text-sm font-medium"
					>
						Limpiar filtros
					</button>
				</div>
			)}

			{/* Indicador de resultados limitados */}
			{maxResults && filteredTemplates.length === maxResults && (
				<div className="text-center">
					<div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm">
						<SparklesIcon className="h-4 w-4" />
						<span>Mostrando los primeros {maxResults} resultados</span>
					</div>
				</div>
			)}

			{/* Estadísticas rápidas */}
			{!compact && filteredTemplates.length > 0 && (
				<div className="bg-gray-50 rounded-lg p-4">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
						<div>
							<div className="text-2xl font-bold text-primary-600">
								{filteredTemplates.filter((t) => t.verified).length}
							</div>
							<div className="text-sm text-gray-600">Verificadas</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-yellow-600">
								{(
									filteredTemplates.reduce((sum, t) => sum + t.rating, 0) /
									filteredTemplates.length
								).toFixed(1)}
							</div>
							<div className="text-sm text-gray-600">Rating Promedio</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-green-600">
								{filteredTemplates
									.reduce((sum, t) => sum + t.usageCount, 0)
									.toLocaleString()}
							</div>
							<div className="text-sm text-gray-600">Usos Totales</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-orange-600">
								{filteredTemplates.filter((t) => t.trending).length}
							</div>
							<div className="text-sm text-gray-600">En Tendencia</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
