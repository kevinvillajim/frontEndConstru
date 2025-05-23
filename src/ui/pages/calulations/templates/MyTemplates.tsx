import React, {useState, useMemo} from "react";
import {useNavigate} from "react-router-dom";
import {
	PlusIcon,
	MagnifyingGlassIcon,
	AdjustmentsHorizontalIcon,
	FolderIcon,
	CheckBadgeIcon,
	ClockIcon,
	StarIcon as StarSolidIcon,
	FunnelIcon,
} from "@heroicons/react/24/outline";

// Componentes modulares
import TemplateCard from "./components/TemplateCards";
import {
	DeleteModal,
	ShareModal,
	useTemplateActions,
} from "./components/TemplateActions";

// Types
import type {
	MyCalculationTemplate,
	TemplateFilters,
} from "../shared/types/template.types";

// Hook personalizado para plantillas
import {useTemplates} from "../shared/hooks/useTemplates";

// Mock data mejorado
const mockMyTemplates: MyCalculationTemplate[] = [
	{
		id: "my-001",
		name: "Cálculo de Escaleras Personalizadas",
		description:
			"Mi versión personalizada para cálculo de escaleras con parámetros específicos",
		longDescription:
			"Plantilla personalizada que incluye factores específicos para mis proyectos residenciales",
		category: "architectural",
		subcategory: "circulation",
		targetProfessions: ["architect"],
		difficulty: "intermediate",
		estimatedTime: "10-15 min",
		necReference: "NEC-HS-A, Art. 45",
		tags: ["escaleras", "personalizada", "residencial"],
		isPublic: false,
		isActive: true,
		isFavorite: true,
		usageCount: 12,
		version: "1.2",
		createdAt: "2024-02-15T10:30:00Z",
		lastModified: "2024-03-10T16:45:00Z",
		status: "active",
		sharedWith: [],
		parameters: [],
		author: {
			id: "user-1",
			name: "Juan Pérez",
			profession: "Arquitecto",
		},
	},
	{
		id: "my-002",
		name: "Demanda Eléctrica Comercial",
		description: "Cálculo específico para locales comerciales pequeños",
		longDescription:
			"Adaptación de la fórmula estándar para comercios con características específicas",
		category: "electrical",
		subcategory: "demand",
		targetProfessions: ["electrical_engineer"],
		difficulty: "intermediate",
		estimatedTime: "12-18 min",
		tags: ["demanda", "comercial", "electricidad"],
		isPublic: true,
		isActive: true,
		isFavorite: false,
		usageCount: 8,
		version: "1.0",
		createdAt: "2024-01-20T14:20:00Z",
		lastModified: "2024-01-25T09:15:00Z",
		status: "active",
		sharedWith: ["team"],
		parameters: [],
	},
	{
		id: "my-003",
		name: "Estructura de Madera - Borrador",
		description: "Cálculo experimental para estructuras de madera",
		longDescription:
			"Plantilla en desarrollo para evaluar resistencia en estructuras de madera nativa",
		category: "structural",
		subcategory: "timber",
		targetProfessions: ["structural_engineer", "architect"],
		difficulty: "advanced",
		estimatedTime: "25-35 min",
		tags: ["madera", "estructura", "experimental"],
		isPublic: false,
		isActive: false,
		isFavorite: false,
		usageCount: 2,
		version: "0.8",
		createdAt: "2024-03-01T11:00:00Z",
		lastModified: "2024-03-05T15:30:00Z",
		status: "draft",
		sharedWith: [],
		parameters: [],
	},
];

const categories = [
	{
		id: "structural",
		name: "Estructural",
		icon: "🏗️",
		color: "bg-blue-50 text-blue-700",
	},
	{
		id: "electrical",
		name: "Eléctrico",
		icon: "⚡",
		color: "bg-yellow-50 text-yellow-700",
	},
	{
		id: "architectural",
		name: "Arquitectónico",
		icon: "🏛️",
		color: "bg-green-50 text-green-700",
	},
	{
		id: "hydraulic",
		name: "Hidráulico",
		icon: "🚰",
		color: "bg-cyan-50 text-cyan-700",
	},
	{
		id: "custom",
		name: "Personalizada",
		icon: "⚒️",
		color: "bg-purple-50 text-purple-700",
	},
];

const MyTemplates: React.FC = () => {
	const navigate = useNavigate();

	// Estado local
	const [templates, setTemplates] =
		useState<MyCalculationTemplate[]>(mockMyTemplates);
	const [filters, setFilters] = useState<TemplateFilters>({
		search: "",
		sortBy: "date",
		sortOrder: "desc",
	});
	const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

	// Hook personalizado para acciones de plantillas
	const templateActions = useTemplateActions({templates, setTemplates});

	// Filtrar y ordenar plantillas
	const filteredTemplates = useMemo(() => {
		let filtered = templates.filter((template) => {
			const matchesSearch =
				!filters.search ||
				template.name.toLowerCase().includes(filters.search.toLowerCase()) ||
				template.description
					.toLowerCase()
					.includes(filters.search.toLowerCase()) ||
				template.tags.some((tag) =>
					tag.toLowerCase().includes(filters.search.toLowerCase())
				);

			const matchesCategory =
				!filters.category || template.category === filters.category;
			const matchesDifficulty =
				!filters.difficulty || template.difficulty === filters.difficulty;
			const matchesStatus =
				!filters.status?.length || filters.status.includes(template.status);
			const matchesFavorites = !filters.favorites || template.isFavorite;

			return (
				matchesSearch &&
				matchesCategory &&
				matchesDifficulty &&
				matchesStatus &&
				matchesFavorites
			);
		});

		// Ordenar
		filtered.sort((a, b) => {
			const order = filters.sortOrder === "asc" ? 1 : -1;

			switch (filters.sortBy) {
				case "date":
					return (
						(new Date(b.lastModified).getTime() -
							new Date(a.lastModified).getTime()) *
						order
					);
				case "name":
					return a.name.localeCompare(b.name) * order;
				case "usage":
					return (b.usageCount - a.usageCount) * order;
				case "category":
					return a.category.localeCompare(b.category) * order;
				default:
					return 0;
			}
		});

		return filtered;
	}, [templates, filters]);

	// Estadísticas calculadas
	const stats = useMemo(
		() => ({
			total: templates.length,
			active: templates.filter((t) => t.status === "active").length,
			draft: templates.filter((t) => t.status === "draft").length,
			favorites: templates.filter((t) => t.isFavorite).length,
			archived: templates.filter((t) => t.status === "archived").length,
		}),
		[templates]
	);

	// Handlers
	const handleFilterChange = (key: keyof TemplateFilters, value: any) => {
		setFilters((prev) => ({...prev, [key]: value}));
	};

	const handleCreateNew = () => {
		navigate("/calculations/templates/new");
	};

	const handleView = (templateId: string) => {
		navigate(`/calculations/templates/${templateId}/view`);
	};

	const handleEdit = (templateId: string) => {
		navigate(`/calculations/templates/${templateId}/edit`);
	};

	const clearFilters = () => {
		setFilters({
			search: "",
			sortBy: "date",
			sortOrder: "desc",
		});
		setShowAdvancedFilters(false);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white border-b border-gray-200">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
						<div>
							<h1 className="text-3xl font-bold text-gray-900 tracking-tight">
								Mis Plantillas de Cálculo
							</h1>
							<p className="text-gray-600 mt-1">
								Gestiona tus plantillas personalizadas y colaborativas
							</p>
						</div>

						<div className="flex items-center gap-3">
							<button
								onClick={handleCreateNew}
								className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 font-medium"
							>
								<PlusIcon className="h-4 w-4" />
								Nueva Plantilla
							</button>
						</div>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Estadísticas */}
				<div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
					<div className="bg-white rounded-xl p-4 border border-gray-100">
						<div className="flex items-center">
							<div className="p-2 bg-primary-100 rounded-lg">
								<FolderIcon className="h-5 w-5 text-primary-600" />
							</div>
							<div className="ml-3">
								<p className="text-xl font-semibold text-gray-900">
									{stats.total}
								</p>
								<p className="text-gray-600 text-xs">Total</p>
							</div>
						</div>
					</div>

					<div className="bg-white rounded-xl p-4 border border-gray-100">
						<div className="flex items-center">
							<div className="p-2 bg-green-100 rounded-lg">
								<CheckBadgeIcon className="h-5 w-5 text-green-600" />
							</div>
							<div className="ml-3">
								<p className="text-xl font-semibold text-gray-900">
									{stats.active}
								</p>
								<p className="text-gray-600 text-xs">Activas</p>
							</div>
						</div>
					</div>

					<div className="bg-white rounded-xl p-4 border border-gray-100">
						<div className="flex items-center">
							<div className="p-2 bg-yellow-100 rounded-lg">
								<ClockIcon className="h-5 w-5 text-yellow-600" />
							</div>
							<div className="ml-3">
								<p className="text-xl font-semibold text-gray-900">
									{stats.draft}
								</p>
								<p className="text-gray-600 text-xs">Borradores</p>
							</div>
						</div>
					</div>

					<div className="bg-white rounded-xl p-4 border border-gray-100">
						<div className="flex items-center">
							<div className="p-2 bg-secondary-100 rounded-lg">
								<StarSolidIcon className="h-5 w-5 text-secondary-600" />
							</div>
							<div className="ml-3">
								<p className="text-xl font-semibold text-gray-900">
									{stats.favorites}
								</p>
								<p className="text-gray-600 text-xs">Favoritas</p>
							</div>
						</div>
					</div>

					<div className="bg-white rounded-xl p-4 border border-gray-100">
						<div className="flex items-center">
							<div className="p-2 bg-gray-100 rounded-lg">
								<FolderIcon className="h-5 w-5 text-gray-600" />
							</div>
							<div className="ml-3">
								<p className="text-xl font-semibold text-gray-900">
									{stats.archived}
								</p>
								<p className="text-gray-600 text-xs">Archivadas</p>
							</div>
						</div>
					</div>
				</div>

				{/* Filtros y búsqueda */}
				<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
					<div className="flex flex-col lg:flex-row gap-4">
						{/* Búsqueda */}
						<div className="flex-1">
							<div className="relative">
								<MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
								<input
									type="text"
									placeholder="Buscar mis plantillas..."
									value={filters.search || ""}
									onChange={(e) => handleFilterChange("search", e.target.value)}
									className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
								/>
							</div>
						</div>

						{/* Filtros básicos */}
						<div className="flex items-center gap-3">
							<button
								onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
								className={`flex items-center gap-2 px-4 py-2 border rounded-xl transition-colors ${
									showAdvancedFilters
										? "border-primary-500 bg-primary-50 text-primary-700"
										: "border-gray-300 hover:bg-gray-50"
								}`}
							>
								<FunnelIcon className="h-4 w-4" />
								Filtros
							</button>

							<select
								value={filters.sortBy || "date"}
								onChange={(e) => handleFilterChange("sortBy", e.target.value)}
								className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
							>
								<option value="date">Más recientes</option>
								<option value="name">Por nombre</option>
								<option value="usage">Más usadas</option>
								<option value="category">Por categoría</option>
							</select>
						</div>
					</div>

					{/* Filtros avanzados */}
					{showAdvancedFilters && (
						<div className="mt-4 pt-4 border-t border-gray-200">
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Categoría
									</label>
									<select
										value={filters.category || ""}
										onChange={(e) =>
											handleFilterChange(
												"category",
												e.target.value || undefined
											)
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
									>
										<option value="">Todas</option>
										{categories.map((cat) => (
											<option key={cat.id} value={cat.id}>
												{cat.icon} {cat.name}
											</option>
										))}
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Dificultad
									</label>
									<select
										value={filters.difficulty || ""}
										onChange={(e) =>
											handleFilterChange(
												"difficulty",
												e.target.value || undefined
											)
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
									>
										<option value="">Todas</option>
										<option value="basic">Básico</option>
										<option value="intermediate">Intermedio</option>
										<option value="advanced">Avanzado</option>
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Estado
									</label>
									<select
										value={filters.status?.[0] || ""}
										onChange={(e) =>
											handleFilterChange(
												"status",
												e.target.value ? [e.target.value] : undefined
											)
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
									>
										<option value="">Todos</option>
										<option value="active">Activas</option>
										<option value="draft">Borradores</option>
										<option value="archived">Archivadas</option>
									</select>
								</div>

								<div className="flex items-end">
									<label className="flex items-center">
										<input
											type="checkbox"
											checked={filters.favorites || false}
											onChange={(e) =>
												handleFilterChange(
													"favorites",
													e.target.checked || undefined
												)
											}
											className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
										/>
										<span className="ml-2 text-sm text-gray-700">
											Solo favoritas
										</span>
									</label>
								</div>
							</div>

							<div className="mt-4 flex justify-end">
								<button
									onClick={clearFilters}
									className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
								>
									Limpiar filtros
								</button>
							</div>
						</div>
					)}
				</div>

				{/* Mostrar filtros activos */}
				{(filters.search ||
					filters.category ||
					filters.difficulty ||
					filters.status?.length ||
					filters.favorites) && (
					<div className="mb-6 flex flex-wrap items-center gap-2">
						<span className="text-sm text-gray-600">Filtros activos:</span>
						{filters.search && (
							<span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
								Búsqueda: "{filters.search}"
							</span>
						)}
						{filters.category && (
							<span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
								{categories.find((c) => c.id === filters.category)?.name}
							</span>
						)}
						{filters.difficulty && (
							<span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
								{filters.difficulty === "basic"
									? "Básico"
									: filters.difficulty === "intermediate"
										? "Intermedio"
										: "Avanzado"}
							</span>
						)}
						{filters.favorites && (
							<span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
								Favoritas
							</span>
						)}
					</div>
				)}

				{/* Lista de plantillas */}
				<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
					{filteredTemplates.map((template, index) => (
						<TemplateCard
							key={template.id}
							template={template}
							animationDelay={index}
							onToggleFavorite={templateActions.toggleFavorite}
							onDuplicate={templateActions.duplicateTemplate}
							onDelete={templateActions.openDeleteModal}
							onToggleStatus={templateActions.toggleTemplateStatus}
							onView={handleView}
							onEdit={handleEdit}
							onShare={templateActions.openShareModal}
						/>
					))}
				</div>

				{/* Estado vacío */}
				{filteredTemplates.length === 0 && (
					<div className="text-center py-16">
						<div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<FolderIcon className="h-12 w-12 text-gray-400" />
						</div>
						<h3 className="text-lg font-medium text-gray-900 mb-2">
							{templates.length === 0
								? "No tienes plantillas aún"
								: "No se encontraron plantillas"}
						</h3>
						<p className="text-gray-600 mb-6">
							{templates.length === 0
								? "¡Comienza creando tu primera plantilla personalizada!"
								: "Intenta ajustar los filtros o términos de búsqueda."}
						</p>
						<div className="flex justify-center gap-3">
							{templates.length > 0 && (
								<button
									onClick={clearFilters}
									className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
								>
									Limpiar Filtros
								</button>
							)}
							<button
								onClick={handleCreateNew}
								className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2 font-medium"
							>
								<PlusIcon className="h-4 w-4" />
								{templates.length === 0
									? "Crear Primera Plantilla"
									: "Nueva Plantilla"}
							</button>
						</div>
					</div>
				)}
			</div>

			{/* Modales */}
			<DeleteModal
				template={templateActions.deleteModal.template}
				isOpen={templateActions.deleteModal.isOpen}
				onClose={templateActions.closeDeleteModal}
				onConfirm={templateActions.confirmDelete}
				isDeleting={templateActions.deleteModal.isDeleting}
			/>

			<ShareModal
				template={templateActions.shareModal.template}
				isOpen={templateActions.shareModal.isOpen}
				onClose={templateActions.closeShareModal}
			/>
		</div>
	);
};

export default MyTemplates;
