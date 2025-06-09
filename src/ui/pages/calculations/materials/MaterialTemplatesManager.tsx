// src/ui/pages/calculations/materials/MaterialTemplatesManager.tsx
import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {
	PlusIcon,
	ArrowLeftIcon,
	MagnifyingGlassIcon,
	FunnelIcon,
	PencilIcon,
	TrashIcon,
	ShareIcon,
	EyeIcon,
	DocumentDuplicateIcon,
	ChartBarIcon,
	ClockIcon,
	StarIcon,
} from "@heroicons/react/24/outline";
import {useMaterialTemplates} from "../shared/hooks/useMaterialCalculations";
import type {MaterialCalculationType} from "../shared/types/material.types";

const TEMPLATE_TYPES = [
	{id: "all", name: "Todas las Plantillas"},
	{id: "STEEL_STRUCTURES", name: "Estructuras de Acero"},
	{id: "CERAMIC_FINISHES", name: "Acabados Cerámicos"},
	{id: "CONCRETE_FOUNDATIONS", name: "Fundiciones y Hormigón"},
	{id: "ELECTRICAL_INSTALLATIONS", name: "Instalaciones Eléctricas"},
	{id: "MELAMINE_FURNITURE", name: "Muebles de Melamina"},
];

const MaterialTemplatesManager: React.FC = () => {
	const navigate = useNavigate();
	const {templates, loading, error, fetchTemplates} = useMaterialTemplates();

	const [searchTerm, setSearchTerm] = useState("");
	const [selectedType, setSelectedType] = useState<
		MaterialCalculationType | "all"
	>("all");
	const [sortBy, setSortBy] = useState<"name" | "created" | "usage" | "rating">(
		"created"
	);
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
	const [filteredTemplates, setFilteredTemplates] = useState(templates);

	useEffect(() => {
		fetchTemplates({
			type: selectedType === "all" ? undefined : selectedType,
			sortBy,
			sortOrder,
		});
	}, [selectedType, sortBy, sortOrder, fetchTemplates]);

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

	const handleCreateTemplate = () => {
		navigate("/calculations/materials/templates/create");
	};

	const handleEditTemplate = (templateId: string) => {
		navigate(`/calculations/materials/templates/edit/${templateId}`);
	};

	const handleViewTemplate = (templateId: string) => {
		navigate(`/calculations/materials/interface/${templateId}`);
	};

	const handleDuplicateTemplate = (templateId: string) => {
		navigate(`/calculations/materials/templates/duplicate/${templateId}`);
	};

	const renderFilters = () => (
		<div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
			<div className="flex flex-col lg:flex-row gap-4">
				{/* Búsqueda */}
				<div className="flex-1">
					<div className="relative">
						<MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
						<input
							type="text"
							placeholder="Buscar plantillas..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
						/>
					</div>
				</div>

				{/* Filtros */}
				<div className="flex flex-wrap gap-3">
					<select
						value={selectedType}
						onChange={(e) =>
							setSelectedType(e.target.value as MaterialCalculationType | "all")
						}
						className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
					>
						{TEMPLATE_TYPES.map((type) => (
							<option key={type.id} value={type.id}>
								{type.name}
							</option>
						))}
					</select>

					<select
						value={`${sortBy}-${sortOrder}`}
						onChange={(e) => {
							const [field, order] = e.target.value.split("-");
							setSortBy(field as "name" | "created" | "usage" | "rating");
							setSortOrder(order as "asc" | "desc");
						}}
						className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
					>
						<option value="created-desc">Más Recientes</option>
						<option value="created-asc">Más Antiguos</option>
						<option value="name-asc">Nombre A-Z</option>
						<option value="name-desc">Nombre Z-A</option>
						<option value="usage-desc">Más Usados</option>
						<option value="rating-desc">Mejor Valorados</option>
					</select>

					<button className="inline-flex items-center gap-2 px-3 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
						<FunnelIcon className="h-4 w-4" />
						Filtros
					</button>
				</div>
			</div>
		</div>
	);

	const renderTemplateCard = (template: any) => (
		<div
			key={template.id}
			className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-200"
		>
			{/* Header */}
			<div className="flex items-start justify-between mb-4">
				<div className="flex-1">
					<h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
						{template.name}
					</h3>
					<p className="text-sm text-gray-600 line-clamp-2 mb-2">
						{template.description}
					</p>
					<div className="flex items-center gap-2">
						<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700">
							{template.type}
						</span>
						{template.isFeatured && (
							<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
								Destacado
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

			{/* Actions */}
			<div className="flex items-center gap-2">
				<button
					onClick={() => handleViewTemplate(template.id)}
					className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
				>
					<EyeIcon className="h-4 w-4" />
					Ver
				</button>
				<button
					onClick={() => handleEditTemplate(template.id)}
					className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
					title="Editar"
				>
					<PencilIcon className="h-4 w-4" />
				</button>
				<button
					onClick={() => handleDuplicateTemplate(template.id)}
					className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
					title="Duplicar"
				>
					<DocumentDuplicateIcon className="h-4 w-4" />
				</button>
				<button
					className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
					title="Compartir"
				>
					<ShareIcon className="h-4 w-4" />
				</button>
				<button
					className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
					title="Eliminar"
				>
					<TrashIcon className="h-4 w-4" />
				</button>
			</div>
		</div>
	);

	const renderHeader = () => (
		<div className="flex items-center justify-between mb-8">
			<div className="flex items-center gap-4">
				<button
					onClick={() => navigate("/calculations/materials")}
					className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
				>
					<ArrowLeftIcon className="h-5 w-5" />
				</button>
				<div>
					<h1 className="text-2xl font-bold text-gray-900">
						Mis Plantillas de Materiales
					</h1>
					<p className="text-gray-600 mt-1">
						Gestiona y organiza tus plantillas personalizadas
					</p>
				</div>
			</div>
			<button
				onClick={handleCreateTemplate}
				className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
			>
				<PlusIcon className="h-4 w-4" />
				Nueva Plantilla
			</button>
		</div>
	);

	const renderStatsOverview = () => (
		<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
			<div className="bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 rounded-xl p-6">
				<div className="flex items-center">
					<div className="flex-shrink-0">
						<ChartBarIcon className="h-8 w-8 text-primary-600" />
					</div>
					<div className="ml-4">
						<p className="text-sm font-medium text-primary-700">Total</p>
						<p className="text-2xl font-bold text-primary-900">
							{templates.length}
						</p>
					</div>
				</div>
			</div>

			<div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-6">
				<div className="flex items-center">
					<div className="flex-shrink-0">
						<StarIcon className="h-8 w-8 text-emerald-600" />
					</div>
					<div className="ml-4">
						<p className="text-sm font-medium text-emerald-700">Destacadas</p>
						<p className="text-2xl font-bold text-emerald-900">
							{templates.filter((t) => t.isFeatured).length}
						</p>
					</div>
				</div>
			</div>

			<div className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-6">
				<div className="flex items-center">
					<div className="flex-shrink-0">
						<ClockIcon className="h-8 w-8 text-amber-600" />
					</div>
					<div className="ml-4">
						<p className="text-sm font-medium text-amber-700">Esta Semana</p>
						<p className="text-2xl font-bold text-amber-900">0</p>
					</div>
				</div>
			</div>

			<div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
				<div className="flex items-center">
					<div className="flex-shrink-0">
						<ShareIcon className="h-8 w-8 text-purple-600" />
					</div>
					<div className="ml-4">
						<p className="text-sm font-medium text-purple-700">Compartidas</p>
						<p className="text-2xl font-bold text-purple-900">
							{templates.filter((t) => t.shareLevel === "public").length}
						</p>
					</div>
				</div>
			</div>
		</div>
	);

	const renderEmptyState = () => (
		<div className="text-center py-12">
			<div className="mx-auto h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
				<PlusIcon className="h-12 w-12 text-gray-400" />
			</div>
			<h3 className="text-lg font-medium text-gray-900 mb-2">
				No tienes plantillas aún
			</h3>
			<p className="text-gray-600 mb-6">
				Crea tu primera plantilla personalizada para cálculos de materiales
			</p>
			<button
				onClick={handleCreateTemplate}
				className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
			>
				<PlusIcon className="h-5 w-5" />
				Crear Primera Plantilla
			</button>
		</div>
	);

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
			{renderHeader()}
			{renderStatsOverview()}
			{renderFilters()}

			{filteredTemplates.length === 0 ? (
				searchTerm ? (
					<div className="text-center py-12">
						<MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
						<h3 className="mt-4 text-lg font-medium text-gray-900">
							No se encontraron plantillas
						</h3>
						<p className="mt-2 text-gray-600">
							Intenta con otros términos de búsqueda
						</p>
					</div>
				) : (
					renderEmptyState()
				)
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredTemplates.map(renderTemplateCard)}
				</div>
			)}
		</div>
	);
};

export default MaterialTemplatesManager;
