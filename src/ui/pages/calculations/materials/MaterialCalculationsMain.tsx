// src/ui/pages/calculations/materials/MaterialCalculationsMain.tsx
import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {
	BeakerIcon,
	HomeIcon,
	CpuChipIcon,
	SparklesIcon,
	MagnifyingGlassIcon,
	AdjustmentsHorizontalIcon,
	PlayIcon,
	PlusIcon,
	ChartBarIcon,
	ClockIcon,
} from "@heroicons/react/24/outline";
import {useMaterialTemplates} from "../shared/hooks/useMaterialCalculations";
import type {MaterialCalculationType} from "../shared/types/material.types";

// Configuración de categorías mejorada - más pequeña y sutil
const MATERIAL_CATEGORIES = [
	{
		id: "all" as const,
		name: "Todas",
		icon: HomeIcon,
		color: "text-gray-600 bg-gray-50 border-gray-200",
		activeColor: "text-primary-700 bg-primary-50 border-primary-200",
	},
	{
		id: "STEEL_STRUCTURES" as MaterialCalculationType,
		name: "Acero",
		icon: BeakerIcon,
		color: "text-slate-600 bg-slate-50 border-slate-200",
		activeColor: "text-slate-700 bg-slate-100 border-slate-300",
	},
	{
		id: "CERAMIC_FINISHES" as MaterialCalculationType,
		name: "Cerámicos",
		icon: CpuChipIcon,
		color: "text-emerald-600 bg-emerald-50 border-emerald-200",
		activeColor: "text-emerald-700 bg-emerald-100 border-emerald-300",
	},
	{
		id: "CONCRETE_FOUNDATIONS" as MaterialCalculationType,
		name: "Hormigón",
		icon: SparklesIcon,
		color: "text-stone-600 bg-stone-50 border-stone-200",
		activeColor: "text-stone-700 bg-stone-100 border-stone-300",
	},
	{
		id: "ELECTRICAL_INSTALLATIONS" as MaterialCalculationType,
		name: "Eléctrico",
		icon: ChartBarIcon,
		color: "text-yellow-600 bg-yellow-50 border-yellow-200",
		activeColor: "text-yellow-700 bg-yellow-100 border-yellow-300",
	},
	{
		id: "MELAMINE_FURNITURE" as MaterialCalculationType,
		name: "Muebles",
		icon: ClockIcon,
		color: "text-orange-600 bg-orange-50 border-orange-200",
		activeColor: "text-orange-700 bg-orange-100 border-orange-300",
	},
];

const MaterialCalculationsMain: React.FC = () => {
	const navigate = useNavigate();
	const {templates, loading, error, fetchTemplates, getTemplatesByType} =
		useMaterialTemplates();

	const [selectedCategory, setSelectedCategory] = useState<
		MaterialCalculationType | "all"
	>("all");
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredTemplates, setFilteredTemplates] = useState(templates);

	// Cargar plantillas al montar el componente
	useEffect(() => {
		if (selectedCategory === "all") {
			fetchTemplates({});
		} else {
			getTemplatesByType(selectedCategory).then(setFilteredTemplates);
		}
	}, [selectedCategory, fetchTemplates, getTemplatesByType]);

	// Filtrar por búsqueda
	useEffect(() => {
		if (!searchTerm) {
			setFilteredTemplates(templates);
		} else {
			const filtered = templates.filter(
				(template) =>
					template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					template.description.toLowerCase().includes(searchTerm.toLowerCase())
			);
			setFilteredTemplates(filtered);
		}
	}, [searchTerm, templates]);

	const handleCategoryChange = (category: MaterialCalculationType | "all") => {
		setSelectedCategory(category);
		setSearchTerm(""); // Limpiar búsqueda al cambiar categoría
	};

	const handleUseTemplate = (templateId: string) => {
		navigate(`/calculations/materials/interface/${templateId}`);
	};

	const handleCreateTemplate = () => {
		navigate("/calculations/materials/templates/create");
	};

	const renderCategories = () => (
		<div className="flex flex-wrap gap-2 mb-6">
			{MATERIAL_CATEGORIES.map((category) => {
				const isActive = selectedCategory === category.id;
				const Icon = category.icon;

				return (
					<button
						key={category.id}
						onClick={() => handleCategoryChange(category.id)}
						className={`
              inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full 
              border transition-all duration-200 ease-in-out
              ${isActive ? category.activeColor : category.color}
              hover:scale-105 hover:shadow-sm
            `}
					>
						<Icon className="h-4 w-4" />
						{category.name}
					</button>
				);
			})}
		</div>
	);

	const renderSearchBar = () => (
		<div className="relative mb-6">
			<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
				<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
			</div>
			<input
				type="text"
				placeholder="Buscar plantillas de materiales..."
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				className="
          w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          text-gray-900 placeholder-gray-500
          transition-all duration-200
        "
			/>
		</div>
	);

	const renderTemplateCard = (template: any) => (
		<div
			key={template.id}
			className="
        bg-white border border-gray-200 rounded-xl p-6
        hover:shadow-lg hover:border-gray-300 hover:scale-[1.02]
        transition-all duration-200 ease-in-out
        group cursor-pointer
      "
		>
			<div className="flex items-start justify-between mb-4">
				<div className="flex-1">
					<h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors">
						{template.name}
					</h3>
					<p className="text-sm text-gray-600 line-clamp-2">
						{template.description}
					</p>
				</div>
				<div className="ml-4 flex items-center gap-2">
					<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700">
						{template.type}
					</span>
				</div>
			</div>

			<div className="flex items-center justify-between text-sm text-gray-500 mb-4">
				<div className="flex items-center gap-4">
					<span className="flex items-center gap-1">
						<PlayIcon className="h-4 w-4" />
						{template.usageCount || 0} usos
					</span>
					{template.averageRating && (
						<span className="flex items-center gap-1">
							⭐ {template.averageRating}
						</span>
					)}
				</div>
				{template.isFeatured && (
					<span className="inline-flex items-center gap-1 text-amber-600">
						<SparklesIcon className="h-4 w-4" />
						Destacado
					</span>
				)}
			</div>

			<div className="flex items-center gap-3">
				<button
					onClick={() => handleUseTemplate(template.id)}
					className="
            flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 
            bg-primary-600 text-white text-sm font-medium rounded-lg
            hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500
            transition-colors duration-200
          "
				>
					<PlayIcon className="h-4 w-4" />
					Usar Plantilla
				</button>
				<button
					className="
          p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-50 
          rounded-lg transition-colors duration-200
        "
				>
					<AdjustmentsHorizontalIcon className="h-4 w-4" />
				</button>
			</div>
		</div>
	);

	const renderHeader = () => (
		<div className="mb-8">
			<div className="flex items-center justify-between mb-4">
				<div>
					<h1 className="text-2xl font-bold text-gray-900 mb-2">
						Cálculos de Materiales
					</h1>
					<p className="text-gray-600">
						Plantillas profesionales para cálculo de materiales de construcción
					</p>
				</div>
				<button
					onClick={handleCreateTemplate}
					className="
            inline-flex items-center gap-2 px-4 py-2.5 
            bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-medium 
            rounded-lg shadow-sm hover:shadow-md hover:from-primary-700 hover:to-primary-800
            focus:outline-none focus:ring-2 focus:ring-primary-500
            transition-all duration-200
          "
				>
					<PlusIcon className="h-4 w-4" />
					Nueva Plantilla
				</button>
			</div>
		</div>
	);

	const renderStatsCards = () => (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
			<div className="bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 rounded-xl p-6">
				<div className="flex items-center">
					<div className="flex-shrink-0">
						<BeakerIcon className="h-8 w-8 text-primary-600" />
					</div>
					<div className="ml-4">
						<p className="text-sm font-medium text-primary-700">
							Total Plantillas
						</p>
						<p className="text-2xl font-bold text-primary-900">
							{templates.length}
						</p>
					</div>
				</div>
			</div>

			<div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-6">
				<div className="flex items-center">
					<div className="flex-shrink-0">
						<ChartBarIcon className="h-8 w-8 text-emerald-600" />
					</div>
					<div className="ml-4">
						<p className="text-sm font-medium text-emerald-700">Esta Semana</p>
						<p className="text-2xl font-bold text-emerald-900">156</p>
					</div>
				</div>
			</div>

			<div className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-6">
				<div className="flex items-center">
					<div className="flex-shrink-0">
						<SparklesIcon className="h-8 w-8 text-amber-600" />
					</div>
					<div className="ml-4">
						<p className="text-sm font-medium text-amber-700">Destacadas</p>
						<p className="text-2xl font-bold text-amber-900">
							{templates.filter((t) => t.isFeatured).length}
						</p>
					</div>
				</div>
			</div>
		</div>
	);

	if (loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
				<p className="text-red-800">Error: {error}</p>
				<button
					onClick={() => fetchTemplates({})}
					className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
				>
					Reintentar
				</button>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			{renderHeader()}
			{renderStatsCards()}
			{renderCategories()}
			{renderSearchBar()}

			{filteredTemplates.length === 0 ? (
				<div className="text-center py-12">
					<BeakerIcon className="mx-auto h-12 w-12 text-gray-400" />
					<h3 className="mt-4 text-lg font-medium text-gray-900">
						No se encontraron plantillas
					</h3>
					<p className="mt-2 text-gray-600">
						{searchTerm
							? "Intenta con otros términos de búsqueda"
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

export default MaterialCalculationsMain;
