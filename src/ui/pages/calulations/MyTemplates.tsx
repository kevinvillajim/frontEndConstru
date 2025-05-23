import React, {useState, useMemo} from "react";
import {
	PlusIcon,
	MagnifyingGlassIcon,
	EyeIcon,
	PencilIcon,
	TrashIcon,
	DocumentDuplicateIcon,
	ShareIcon,
	FolderIcon,
	CheckBadgeIcon,
	ClockIcon,
	BookOpenIcon,
	ExclamationTriangleIcon,
	AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import {StarIcon as StarSolidIcon} from "@heroicons/react/24/solid";

// Tipos de datos
interface MyCalculationTemplate {
	id: string;
	name: string;
	description: string;
	longDescription: string;
	category:
		| "structural"
		| "electrical"
		| "architectural"
		| "hydraulic"
		| "custom";
	subcategory: string;
	targetProfessions: string[];
	difficulty: "basic" | "intermediate" | "advanced";
	estimatedTime: string;
	necReference?: string;
	tags: string[];
	isPublic: boolean;
	isActive: boolean;
	isFavorite: boolean;
	usageCount: number;
	version: string;
	createdAt: string;
	lastModified: string;
	status: "draft" | "active" | "archived";
	sharedWith: string[];
}

// Mock data - plantillas personalizadas del usuario
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
	const [templates, setTemplates] =
		useState<MyCalculationTemplate[]>(mockMyTemplates);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
	const [sortBy, setSortBy] = useState("recent");
	const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
	const [selectedTemplate, setSelectedTemplate] =
		useState<MyCalculationTemplate | null>(null);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showShareModal, setShowShareModal] = useState(false);

	// Filtrar y ordenar plantillas
	const filteredTemplates = useMemo(() => {
		const filtered = templates.filter((template) => {
			const matchesSearch =
				template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
				template.tags.some((tag) =>
					tag.toLowerCase().includes(searchTerm.toLowerCase())
				);

			const matchesCategory =
				!selectedCategory || template.category === selectedCategory;
			const matchesStatus =
				!selectedStatus || template.status === selectedStatus;
			const matchesFavorites = !showOnlyFavorites || template.isFavorite;

			return (
				matchesSearch && matchesCategory && matchesStatus && matchesFavorites
			);
		});

		// Ordenar
		filtered.sort((a, b) => {
			switch (sortBy) {
				case "recent":
					return (
						new Date(b.lastModified).getTime() -
						new Date(a.lastModified).getTime()
					);
				case "name":
					return a.name.localeCompare(b.name);
				case "usage":
					return b.usageCount - a.usageCount;
				case "category":
					return a.category.localeCompare(b.category);
				default:
					return 0;
			}
		});

		return filtered;
	}, [
		templates,
		searchTerm,
		selectedCategory,
		selectedStatus,
		sortBy,
		showOnlyFavorites,
	]);

	const toggleFavorite = (templateId: string) => {
		setTemplates(
			templates.map((template) =>
				template.id === templateId
					? {...template, isFavorite: !template.isFavorite}
					: template
			)
		);
	};

	const duplicateTemplate = (templateId: string) => {
		const template = templates.find((t) => t.id === templateId);
		if (template) {
			const duplicated: MyCalculationTemplate = {
				...template,
				id: `my-${Date.now()}`,
				name: `${template.name} (Copia)`,
				createdAt: new Date().toISOString(),
				lastModified: new Date().toISOString(),
				usageCount: 0,
				version: "1.0",
				isPublic: false,
				status: "draft",
			};
			setTemplates([duplicated, ...templates]);
		}
	};

	const deleteTemplate = (templateId: string) => {
		setTemplates(templates.filter((t) => t.id !== templateId));
		setShowDeleteModal(false);
		setSelectedTemplate(null);
	};

	const toggleTemplateStatus = (templateId: string) => {
		setTemplates(
			templates.map((template) =>
				template.id === templateId
					? {
							...template,
							isActive: !template.isActive,
							status: template.isActive ? "archived" : "active",
						}
					: template
			)
		);
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("es-EC", {
			day: "2-digit",
			month: "short",
			year: "numeric",
		});
	};

	const getCategoryInfo = (category: string) => {
		return categories.find((cat) => cat.id === category) || categories[4];
	};

	const getStatusBadge = (status: string, isActive: boolean) => {
		if (status === "draft") {
			return (
				<span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
					Borrador
				</span>
			);
		}
		if (!isActive) {
			return (
				<span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
					Archivada
				</span>
			);
		}
		return (
			<span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
				Activa
			</span>
		);
	};

	const stats = {
		total: templates.length,
		active: templates.filter((t) => t.status === "active").length,
		draft: templates.filter((t) => t.status === "draft").length,
		favorites: templates.filter((t) => t.isFavorite).length,
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
							<button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2">
								<PlusIcon className="h-4 w-4" />
								Nueva Plantilla
							</button>
						</div>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Estadísticas */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
					<div className="bg-white rounded-xl p-6 border border-gray-100">
						<div className="flex items-center">
							<div className="p-3 bg-primary-100 rounded-lg">
								<FolderIcon className="h-6 w-6 text-primary-600" />
							</div>
							<div className="ml-4">
								<p className="text-2xl font-semibold text-gray-900">
									{stats.total}
								</p>
								<p className="text-gray-600 text-sm">Total Plantillas</p>
							</div>
						</div>
					</div>

					<div className="bg-white rounded-xl p-6 border border-gray-100">
						<div className="flex items-center">
							<div className="p-3 bg-green-100 rounded-lg">
								<CheckBadgeIcon className="h-6 w-6 text-green-600" />
							</div>
							<div className="ml-4">
								<p className="text-2xl font-semibold text-gray-900">
									{stats.active}
								</p>
								<p className="text-gray-600 text-sm">Activas</p>
							</div>
						</div>
					</div>

					<div className="bg-white rounded-xl p-6 border border-gray-100">
						<div className="flex items-center">
							<div className="p-3 bg-yellow-100 rounded-lg">
								<ClockIcon className="h-6 w-6 text-yellow-600" />
							</div>
							<div className="ml-4">
								<p className="text-2xl font-semibold text-gray-900">
									{stats.draft}
								</p>
								<p className="text-gray-600 text-sm">Borradores</p>
							</div>
						</div>
					</div>

					<div className="bg-white rounded-xl p-6 border border-gray-100">
						<div className="flex items-center">
							<div className="p-3 bg-secondary-100 rounded-lg">
								<StarSolidIcon className="h-6 w-6 text-secondary-600" />
							</div>
							<div className="ml-4">
								<p className="text-2xl font-semibold text-gray-900">
									{stats.favorites}
								</p>
								<p className="text-gray-600 text-sm">Favoritas</p>
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
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
								/>
							</div>
						</div>

						{/* Filtros */}
						<div className="flex items-center gap-3">
							<AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-500" />

							<select
								value={selectedCategory || ""}
								onChange={(e) => setSelectedCategory(e.target.value || null)}
								className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
							>
								<option value="">Todas las categorías</option>
								{categories.map((cat) => (
									<option key={cat.id} value={cat.id}>
										{cat.icon} {cat.name}
									</option>
								))}
							</select>

							<select
								value={selectedStatus || ""}
								onChange={(e) => setSelectedStatus(e.target.value || null)}
								className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
							>
								<option value="">Todos los estados</option>
								<option value="active">Activas</option>
								<option value="draft">Borradores</option>
								<option value="archived">Archivadas</option>
							</select>

							<select
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
								className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
							>
								<option value="recent">Más recientes</option>
								<option value="name">Por nombre</option>
								<option value="usage">Más usadas</option>
								<option value="category">Por categoría</option>
							</select>
						</div>
					</div>
				</div>

				{/* Lista de plantillas */}
				<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
					{filteredTemplates.map((template, index) => {
						const categoryInfo = getCategoryInfo(template.category);

						return (
							<div
								key={template.id}
								className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
								style={{animationDelay: `${index * 0.05}s`}}
							>
								<div className="p-6">
									{/* Header */}
									<div className="flex items-start justify-between mb-4">
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-2">
												<h3 className="font-semibold text-gray-900 line-clamp-1">
													{template.name}
												</h3>
												{getStatusBadge(template.status, template.isActive)}
											</div>
											<p className="text-sm text-gray-600 mb-3 line-clamp-2">
												{template.description}
											</p>
											<div
												className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${categoryInfo.color}`}
											>
												<span>{categoryInfo.icon}</span>
												<span>{categoryInfo.name}</span>
											</div>
										</div>

										<button
											onClick={() => toggleFavorite(template.id)}
											className="p-1 hover:bg-gray-100 rounded-full transition-colors"
										>
											<StarSolidIcon
												className={`h-4 w-4 ${template.isFavorite ? "text-secondary-500" : "text-gray-300"}`}
											/>
										</button>
									</div>

									{/* Metadatos */}
									<div className="space-y-2 mb-4">
										<div className="flex items-center justify-between text-xs text-gray-500">
											<span>Versión {template.version}</span>
											<span>{template.usageCount} usos</span>
										</div>
										<div className="flex items-center justify-between text-xs text-gray-500">
											<span>
												Modificado: {formatDate(template.lastModified)}
											</span>
											{template.isPublic && (
												<span className="text-green-600">Pública</span>
											)}
										</div>
										{template.necReference && (
											<div className="flex items-center gap-1 text-xs text-primary-600">
												<BookOpenIcon className="h-3 w-3" />
												<span>{template.necReference}</span>
											</div>
										)}
									</div>

									{/* Tags */}
									<div className="flex flex-wrap gap-1 mb-4">
										{template.tags.slice(0, 3).map((tag, tagIndex) => (
											<span
												key={tagIndex}
												className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
											>
												{tag}
											</span>
										))}
										{template.tags.length > 3 && (
											<span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md">
												+{template.tags.length - 3}
											</span>
										)}
									</div>

									{/* Acciones */}
									<div className="flex justify-between items-center">
										<div className="flex gap-2">
											<button className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors">
												<EyeIcon className="h-4 w-4" />
											</button>
											<button className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors">
												<PencilIcon className="h-4 w-4" />
											</button>
											<button
												onClick={() => duplicateTemplate(template.id)}
												className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
											>
												<DocumentDuplicateIcon className="h-4 w-4" />
											</button>
											{template.isPublic && (
												<button className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors">
													<ShareIcon className="h-4 w-4" />
												</button>
											)}
											<button
												onClick={() => {
													setSelectedTemplate(template);
													setShowDeleteModal(true);
												}}
												className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
											>
												<TrashIcon className="h-4 w-4" />
											</button>
										</div>

										<button
											onClick={() => toggleTemplateStatus(template.id)}
											className={`px-4 py-2 text-sm rounded-lg transition-colors ${
												template.isActive
													? "bg-gray-100 text-gray-700 hover:bg-gray-200"
													: "bg-primary-600 text-white hover:bg-primary-700"
											}`}
										>
											{template.isActive ? "Archivar" : "Activar"}
										</button>
									</div>
								</div>
							</div>
						);
					})}
				</div>

				{/* Estado vacío */}
				{filteredTemplates.length === 0 && (
					<div className="text-center py-16">
						<div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<FolderIcon className="h-12 w-12 text-gray-400" />
						</div>
						<h3 className="text-lg font-medium text-gray-900 mb-2">
							No se encontraron plantillas
						</h3>
						<p className="text-gray-600 mb-6">
							{searchTerm || selectedCategory || selectedStatus
								? "Intenta ajustar los filtros o términos de búsqueda."
								: "¡Comienza creando tu primera plantilla personalizada!"}
						</p>
						<button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2 mx-auto">
							<PlusIcon className="h-4 w-4" />
							Crear Primera Plantilla
						</button>
					</div>
				)}
			</div>

			{/* Modal de eliminación */}
			{showDeleteModal && selectedTemplate && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
						<div className="p-6">
							<div className="flex items-center gap-3 mb-4">
								<div className="p-2 bg-red-100 rounded-full">
									<ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
								</div>
								<h3 className="text-lg font-semibold text-gray-900">
									Eliminar Plantilla
								</h3>
							</div>

							<p className="text-gray-600 mb-6">
								¿Estás seguro de que deseas eliminar la plantilla "
								{selectedTemplate.name}"? Esta acción no se puede deshacer.
							</p>

							<div className="flex justify-end gap-3">
								<button
									onClick={() => {
										setShowDeleteModal(false);
										setSelectedTemplate(null);
									}}
									className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
								>
									Cancelar
								</button>
								<button
									onClick={() => deleteTemplate(selectedTemplate.id)}
									className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
								>
									Eliminar
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default MyTemplates;
