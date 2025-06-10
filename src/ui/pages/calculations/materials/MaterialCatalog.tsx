// src/ui/pages/calculations/materials/MaterialCatalog.tsx
import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {
	MagnifyingGlassIcon,
	PlayIcon,
	BookmarkIcon,
	ShareIcon,
	StarIcon,
	SparklesIcon,
	ChartBarIcon,
	ClockIcon,
	FunnelIcon,
	CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import {useMaterialTemplates} from "../shared/hooks/useMaterialCalculations";
import type {MaterialCalculationTemplate, MaterialCalculationType, MaterialTemplateFilters} from "../shared/types/material.types";

const CATEGORIES = [
	{id: "all", name: "Todas", icon: "🔍"},
	{id: "STEEL_STRUCTURES", name: "Acero", icon: "🔩"},
	{id: "CERAMIC_FINISHES", name: "Cerámicos", icon: "🔲"},
	{id: "CONCRETE_FOUNDATIONS", name: "Hormigón", icon: "🏗️"},
	{id: "ELECTRICAL_INSTALLATIONS", name: "Eléctrico", icon: "⚡"},
	{id: "MELAMINE_FURNITURE", name: "Muebles", icon: "🗄️"},
];

const SORT_OPTIONS = [
	{id: "featured", name: "Destacadas"},
	{id: "popular", name: "Más Populares"},
	{id: "recent", name: "Más Recientes"},
	{id: "rating", name: "Mejor Valoradas"},
	{id: "name", name: "Nombre A-Z"},
];

const MaterialCatalog: React.FC = () => {
	const navigate = useNavigate();
	const {templates, loading, error, fetchTemplates} = useMaterialTemplates();

	const [selectedCategory, setSelectedCategory] = useState<
		MaterialCalculationType | "all"
	>("all");
	const [searchTerm, setSearchTerm] = useState("");
	const [sortBy, setSortBy] = useState("featured");
	const [showFilters, setShowFilters] = useState(false);
	const [filteredTemplates, setFilteredTemplates] = useState(templates);

	useEffect(() => {
		const filters: MaterialTemplateFilters = {
			isFeatured: sortBy === "featured" ? true : undefined,
			type: selectedCategory === "all" ? undefined : selectedCategory,
			sortBy: sortBy === "featured" ? "usageCount" : sortBy,
			sortOrder: "desc",
		};

		fetchTemplates(filters);
	}, [selectedCategory, sortBy, fetchTemplates]);

	useEffect(() => {
		if (!searchTerm) {
			setFilteredTemplates(templates);
		} else {
			const filtered = templates.filter(
				(template) =>
					template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					template.description
						.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					template.tags?.some((tag) =>
						tag.toLowerCase().includes(searchTerm.toLowerCase())
					)
			);
			setFilteredTemplates(filtered);
		}
	}, [searchTerm, templates]);

	const handleUseTemplate = (templateId: string) => {
		navigate(`/calculations/materials/interface/${templateId}`);
	};

	const renderSearchAndFilters = () => (
		<div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
			<div className="flex flex-col lg:flex-row gap-4">
				{/* Búsqueda */}
				<div className="flex-1">
					<div className="relative">
						<MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
						<input
							type="text"
							placeholder="Buscar plantillas en el catálogo..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
						/>
					</div>
				</div>

				{/* Controles */}
				<div className="flex gap-3">
					<select
						value={sortBy}
						onChange={(e) => setSortBy(e.target.value)}
						className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
					>
						{SORT_OPTIONS.map((option) => (
							<option key={option.id} value={option.id}>
								{option.name}
							</option>
						))}
					</select>

					<button
						onClick={() => setShowFilters(!showFilters)}
						className={`inline-flex items-center gap-2 px-4 py-3 border rounded-lg transition-colors ${
							showFilters
								? "border-primary-300 bg-primary-50 text-primary-700"
								: "border-gray-300 text-gray-700 hover:bg-gray-50"
						}`}
					>
						<FunnelIcon className="h-4 w-4" />
						Filtros
					</button>
				</div>
			</div>

			{/* Filtros expandibles */}
			{showFilters && (
				<div className="mt-6 pt-6 border-t border-gray-200">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Dificultad
							</label>
							<div className="space-y-2">
								{["basic", "intermediate", "advanced"].map((level) => (
									<label key={level} className="flex items-center">
										<input
											type="checkbox"
											className="h-4 w-4 text-primary-600 rounded focus:ring-primary-500"
										/>
										<span className="ml-2 text-sm text-gray-700 capitalize">
											{level}
										</span>
									</label>
								))}
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Profesión
							</label>
							<div className="space-y-2">
								{["Ingeniero Civil", "Arquitecto", "Constructor"].map(
									(prof) => (
										<label key={prof} className="flex items-center">
											<input
												type="checkbox"
												className="h-4 w-4 text-primary-600 rounded focus:ring-primary-500"
											/>
											<span className="ml-2 text-sm text-gray-700">{prof}</span>
										</label>
									)
								)}
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Valoración Mínima
							</label>
							<select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
								<option value="">Cualquiera</option>
								<option value="4">4+ estrellas</option>
								<option value="4.5">4.5+ estrellas</option>
								<option value="4.8">4.8+ estrellas</option>
							</select>
						</div>
					</div>
				</div>
			)}
		</div>
	);

	const renderCategories = () => (
		<div className="flex flex-wrap gap-2 mb-6">
			{CATEGORIES.map((category) => {
				const isActive = selectedCategory === category.id;

				return (
					<button
						key={category.id}
						onClick={() =>
							setSelectedCategory(
								category.id as MaterialCalculationType | "all"
							)
						}
						className={`
              inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full 
              border transition-all duration-200 ease-in-out
              ${
								isActive
									? "bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-600/25"
									: "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
							}
            `}
					>
						<span className="text-base">{category.icon}</span>
						{category.name}
					</button>
				);
			})}
		</div>
	);

	const renderTemplateCard = (template: MaterialCalculationTemplate) => (
		<div
			key={template.id}
			className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-200 group"
		>
			{/* Header */}
			<div className="flex items-start justify-between mb-4">
				<div className="flex-1">
					<div className="flex items-center gap-2 mb-2">
						<h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-primary-700 transition-colors">
							{template.name}
						</h3>
						{template.isVerified && (
							<CheckBadgeIcon
								className="h-5 w-5 text-blue-600"
								title="Verificado"
							/>
						)}
						{template.isFeatured && (
							<SparklesIcon
								className="h-5 w-5 text-amber-500"
								title="Destacado"
							/>
						)}
					</div>
					<p className="text-sm text-gray-600 line-clamp-2 mb-3">
						{template.description}
					</p>
					<div className="flex items-center gap-2">
						<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700">
							{template.type?.replace(/_/g, " ")}
						</span>
						{template.difficulty && (
							<span
								className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
									template.difficulty === "basic"
										? "bg-green-50 text-green-700"
										: template.difficulty === "intermediate"
											? "bg-yellow-50 text-yellow-700"
											: "bg-red-50 text-red-700"
								}`}
							>
								{template.difficulty}
							</span>
						)}
					</div>
				</div>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-3 gap-4 mb-4 text-sm">
				<div className="text-center">
					<div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
						<ChartBarIcon className="h-4 w-4" />
					</div>
					<p className="font-medium text-gray-900">
						{template.usageCount || 0}
					</p>
					<p className="text-xs text-gray-500">Usos</p>
				</div>
				<div className="text-center">
					<div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
						<StarIcon className="h-4 w-4" />
					</div>
					<p className="font-medium text-gray-900">
						{template.averageRating ? template.averageRating.toFixed(1) : "0.0"}
					</p>
					<p className="text-xs text-gray-500">Rating</p>
				</div>
				<div className="text-center">
					<div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
						<ClockIcon className="h-4 w-4" />
					</div>
					<p className="font-medium text-gray-900">
						{template.estimatedTime || "5min"}
					</p>
					<p className="text-xs text-gray-500">Tiempo</p>
				</div>
			</div>

			{/* Tags */}
			{template.tags && template.tags.length > 0 && (
				<div className="flex flex-wrap gap-1 mb-4">
					{template.tags.slice(0, 3).map((tag: string, index: number) => (
						<span
							key={index}
							className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-600"
						>
							{tag}
						</span>
					))}
					{template.tags.length > 3 && (
						<span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-600">
							+{template.tags.length - 3}
						</span>
					)}
				</div>
			)}

			{/* Actions */}
			<div className="flex items-center gap-2">
				<button
					onClick={() => handleUseTemplate(template.id)}
					className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200"
				>
					<PlayIcon className="h-4 w-4" />
					Usar Plantilla
				</button>
				<button className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
					<BookmarkIcon className="h-4 w-4" />
				</button>
				<button className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
					<ShareIcon className="h-4 w-4" />
				</button>
			</div>
		</div>
	);

	const renderFeaturedSection = () => {
		const featuredTemplates = templates.filter((t) => t.isFeatured).slice(0, 3);

		if (featuredTemplates.length === 0) return null;

		return (
			<div className="mb-8">
				<div className="flex items-center gap-2 mb-4">
					<SparklesIcon className="h-6 w-6 text-amber-500" />
					<h2 className="text-lg font-semibold text-gray-900">
						Plantillas Destacadas
					</h2>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{featuredTemplates.map(renderTemplateCard)}
				</div>
			</div>
		);
	};

	if (loading) {
		return (
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex items-center justify-center h-64">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
					<p className="text-red-800">Error: {error}</p>
					<button
						onClick={() => fetchTemplates({})}
						className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
					>
						Reintentar
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			{renderCategories()}
			{renderSearchAndFilters()}

			{sortBy === "featured" && renderFeaturedSection()}

			<div className="flex items-center justify-between mb-6">
				<h2 className="text-lg font-semibold text-gray-900">
					{selectedCategory === "all"
						? "Todas las Plantillas"
						: `Plantillas de ${CATEGORIES.find((c) => c.id === selectedCategory)?.name}`}
				</h2>
				<span className="text-sm text-gray-500">
					{filteredTemplates.length} plantilla
					{filteredTemplates.length !== 1 ? "s" : ""} encontrada
					{filteredTemplates.length !== 1 ? "s" : ""}
				</span>
			</div>

			{filteredTemplates.length === 0 ? (
				<div className="text-center py-12">
					<MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
					<h3 className="mt-4 text-lg font-medium text-gray-900">
						No se encontraron plantillas
					</h3>
					<p className="mt-2 text-gray-600">
						{searchTerm
							? "Intenta con otros términos de búsqueda o cambia los filtros"
							: "No hay plantillas disponibles para esta categoría"}
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredTemplates.map(renderTemplateCard)}
				</div>
			)}
		</div>
	);
};

export default MaterialCatalog;
