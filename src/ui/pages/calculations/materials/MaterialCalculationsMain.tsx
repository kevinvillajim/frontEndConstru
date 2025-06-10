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
		console.log("🔄 Cargando templates, categoría:", selectedCategory);

		if (selectedCategory === "all") {
			fetchTemplates({});
		} else {
			getTemplatesByType(selectedCategory).then((data) => {
				console.log("📊 Templates recibidos:", data);
				setFilteredTemplates(data);
			});
		}
	}, [selectedCategory, fetchTemplates, getTemplatesByType]);

	// Actualizar plantillas filtradas cuando cambien las plantillas base
	useEffect(() => {
		setFilteredTemplates(templates);
	}, [templates]);

	// Filtrar plantillas por término de búsqueda
	useEffect(() => {
		if (!searchTerm) {
			setFilteredTemplates(templates);
			return;
		}

		const filtered = templates.filter(
			(template) =>
				template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				template.description.toLowerCase().includes(searchTerm.toLowerCase())
		);
		setFilteredTemplates(filtered);
	}, [searchTerm, templates]);

	const handleCategoryChange = (category: MaterialCalculationType | "all") => {
		setSelectedCategory(category);
		setSearchTerm(""); // Reset search when changing category
	};

	const handleTemplateClick = (templateId: string) => {
		navigate(`/calculations/materials/interface/${templateId}`);
	};

	// Función para mostrar estado de carga
	if (loading) {
		return (
			<div className="max-w-7xl mx-auto px-4 py-8">
				<div className="text-center py-12">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Cargando plantillas de materiales...</p>
				</div>
			</div>
		);
	}

	// Función para mostrar error
	if (error) {
		return (
			<div className="max-w-7xl mx-auto px-4 py-8">
				<div className="text-center py-12">
					<div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
						<div className="text-red-600 mb-2">
							❌ Error al cargar plantillas
						</div>
						<p className="text-red-700 text-sm">{error}</p>
						<button
							onClick={() => fetchTemplates({})}
							className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
						>
							Reintentar
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto px-4 py-8">
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">
					Cálculos de Materiales
				</h1>
				<p className="text-gray-600">
					Herramientas profesionales para calcular materiales de construcción
					según la normativa ecuatoriana NEC.
				</p>
			</div>

			{/* Filtros de categoría compactos */}
			<div className="mb-6">
				<div className="flex flex-wrap gap-2">
					{MATERIAL_CATEGORIES.map((category) => {
						const Icon = category.icon;
						const isActive = selectedCategory === category.id;

						return (
							<button
								key={category.id}
								onClick={() => handleCategoryChange(category.id)}
								className={`
									flex items-center px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-200
									${isActive ? category.activeColor : category.color}
									hover:shadow-sm
								`}
							>
								<Icon className="h-4 w-4 mr-2" />
								{category.name}
							</button>
						);
					})}
				</div>
			</div>

			{/* Barra de búsqueda */}
			<div className="mb-8">
				<div className="relative max-w-md">
					<MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
					<input
						type="text"
						placeholder="Buscar plantillas..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
					/>
				</div>
			</div>

			{/* Lista de plantillas */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{filteredTemplates.length === 0 ? (
					<div className="col-span-full text-center py-12">
						<BeakerIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
						<h3 className="text-lg font-medium text-gray-900 mb-2">
							No se encontraron plantillas
						</h3>
						<p className="text-gray-500">
							{searchTerm
								? "Intenta con otros términos de búsqueda"
								: "No hay plantillas disponibles para esta categoría"}
						</p>
					</div>
				) : (
					filteredTemplates.map((template) => (
						<div
							key={template.id}
							onClick={() => handleTemplateClick(template.id)}
							className="bg-white rounded-xl border border-gray-200 p-6 hover:border-primary-300 hover:shadow-lg transition-all duration-200 cursor-pointer group"
						>
							<div className="flex items-start justify-between mb-4">
								<div className="flex-1">
									<h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
										{template.name}
									</h3>
									<p className="text-sm text-gray-600 mt-1 line-clamp-2">
										{template.description}
									</p>
								</div>
								<PlayIcon className="h-5 w-5 text-gray-400 group-hover:text-primary-600 transition-colors ml-2 flex-shrink-0" />
							</div>

							<div className="flex items-center justify-between text-sm text-gray-500">
								<div className="flex items-center space-x-4">
									<span className="flex items-center">
										<ChartBarIcon className="h-4 w-4 mr-1" />
										{template.usageCount} usos
									</span>
									{template.averageRating > 0 && (
										<span className="flex items-center">
											<span className="text-yellow-400 mr-1">★</span>
											{template.averageRating.toFixed(1)}
										</span>
									)}
								</div>
								{template.isFeatured && (
									<span className="text-primary-600 font-medium">
										<SparklesIcon className="h-4 w-4 inline mr-1" />
										Destacada
									</span>
								)}
							</div>

							{template.tags && template.tags.length > 0 && (
								<div className="mt-3 flex flex-wrap gap-1">
									{template.tags.slice(0, 3).map((tag) => (
										<span
											key={tag}
											className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
										>
											{tag}
										</span>
									))}
								</div>
							)}
						</div>
					))
				)}
			</div>

			{/* Acciones rápidas */}
			<div className="mt-12 text-center">
				<button
					onClick={() => navigate("/calculations/materials/templates")}
					className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
				>
					<PlusIcon className="h-5 w-5 mr-2" />
					Crear Plantilla Personal
				</button>
			</div>
		</div>
	);
};

export default MaterialCalculationsMain;
