import React, {useState, useMemo} from "react";
import {
	MagnifyingGlassIcon,
	DocumentTextIcon,
	CalendarIcon,
	FolderIcon,
	StarIcon,
	EyeIcon,
	DocumentDuplicateIcon,
	ShareIcon,
	CheckBadgeIcon,
	CalculatorIcon,
	PlusIcon,
	ArchiveBoxIcon,
} from "@heroicons/react/24/outline";
import {StarIcon as StarSolidIcon} from "@heroicons/react/24/solid";

// Tipos de datos
interface SavedCalculation {
	id: string;
	name: string;
	templateName: string;
	templateCategory: "structural" | "electrical" | "architectural" | "hydraulic";
	projectName?: string;
	projectId?: string;
	results: {
		mainValue: string;
		unit: string;
	};
	createdAt: string;
	lastModified: string;
	isFavorite: boolean;
	tags: string[];
	necReference: string;
	status: "completed" | "draft" | "error";
	usedInProject: boolean;
}

interface Project {
	id: string;
	name: string;
	calculationsCount: number;
}

// Datos de ejemplo
const mockCalculations: SavedCalculation[] = [
	{
		id: "calc-001",
		name: "Demanda Eléctrica - Casa Modelo A",
		templateName: "Demanda Eléctrica Residencial",
		templateCategory: "electrical",
		projectName: "Urbanización Los Álamos",
		projectId: "proj-001",
		results: {mainValue: "8,450", unit: "W"},
		createdAt: "2024-03-15T10:30:00Z",
		lastModified: "2024-03-15T15:45:00Z",
		isFavorite: true,
		tags: ["residencial", "unifamiliar", "estándar"],
		necReference: "NEC-SB-IE 1.1",
		status: "completed",
		usedInProject: true,
	},
	{
		id: "calc-002",
		name: "Viga Principal - Estructura Tipo",
		templateName: "Diseño de Vigas de Hormigón Armado",
		templateCategory: "structural",
		projectName: "Torre Residencial Centro",
		projectId: "proj-002",
		results: {mainValue: "25x60", unit: "cm"},
		createdAt: "2024-03-14T14:20:00Z",
		lastModified: "2024-03-14T16:10:00Z",
		isFavorite: false,
		tags: ["hormigón", "viga", "residencial"],
		necReference: "NEC-SE-HM 9.2",
		status: "completed",
		usedInProject: true,
	},
	{
		id: "calc-003",
		name: "Área Computable - Oficinas",
		templateName: "Cálculo de Áreas",
		templateCategory: "architectural",
		projectName: "Edificio Corporativo",
		projectId: "proj-003",
		results: {mainValue: "2,840", unit: "m²"},
		createdAt: "2024-03-13T09:15:00Z",
		lastModified: "2024-03-13T11:30:00Z",
		isFavorite: true,
		tags: ["área", "oficinas", "comercial"],
		necReference: "NEC-HS-A 15.1",
		status: "completed",
		usedInProject: false,
	},
	{
		id: "calc-004",
		name: "Sistema de Tuberías - Planta Baja",
		templateName: "Dimensionamiento de Tuberías",
		templateCategory: "hydraulic",
		results: {mainValue: "3/4", unit: "pulg"},
		createdAt: "2024-03-12T16:45:00Z",
		lastModified: "2024-03-12T16:45:00Z",
		isFavorite: false,
		tags: ["hidráulico", "tuberías", "residencial"],
		necReference: "NEC-HS-HI 3.1",
		status: "draft",
		usedInProject: false,
	},
];

const mockProjects: Project[] = [
	{id: "proj-001", name: "Urbanización Los Álamos", calculationsCount: 12},
	{id: "proj-002", name: "Torre Residencial Centro", calculationsCount: 8},
	{id: "proj-003", name: "Edificio Corporativo", calculationsCount: 15},
];

const SavedCalculations: React.FC = () => {
	const [calculations, setCalculations] =
		useState<SavedCalculation[]>(mockCalculations);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const [selectedProject, setSelectedProject] = useState<string | null>(null);
	const [sortBy, setSortBy] = useState("recent");
	// const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

	// Categorías con iconos y colores
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
	];

	// Filtrar y ordenar cálculos
	const filteredCalculations = useMemo(() => {
		const filtered = calculations.filter((calc) => {
			const matchesSearch =
				calc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				calc.templateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
				calc.tags.some((tag) =>
					tag.toLowerCase().includes(searchTerm.toLowerCase())
				);

			const matchesCategory =
				!selectedCategory || calc.templateCategory === selectedCategory;
			const matchesProject =
				!selectedProject || calc.projectId === selectedProject;
			const matchesFavorites = !showOnlyFavorites || calc.isFavorite;

			return (
				matchesSearch && matchesCategory && matchesProject && matchesFavorites
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
				case "project":
					return (a.projectName || "").localeCompare(b.projectName || "");
				case "category":
					return a.templateCategory.localeCompare(b.templateCategory);
				default:
					return 0;
			}
		});

		return filtered;
	}, [
		calculations,
		searchTerm,
		selectedCategory,
		selectedProject,
		sortBy,
		showOnlyFavorites,
	]);

	const toggleFavorite = (calcId: string) => {
		setCalculations((prev) =>
			prev.map((calc) =>
				calc.id === calcId ? {...calc, isFavorite: !calc.isFavorite} : calc
			)
		);
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("es-EC", {
			day: "2-digit",
			month: "short",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const getCategoryInfo = (category: string) => {
		return categories.find((cat) => cat.id === category) || categories[0];
	};

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "completed":
				return (
					<span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
						Completado
					</span>
				);
			case "draft":
				return (
					<span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
						Borrador
					</span>
				);
			case "error":
				return (
					<span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
						Error
					</span>
				);
			default:
				return null;
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white border-b border-gray-200">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
						<div>
							<h1 className="text-3xl font-bold text-gray-900 tracking-tight">
								Mis Cálculos Guardados
							</h1>
							<p className="text-gray-600 mt-1">
								Gestiona y reutiliza tus cálculos técnicos guardados
							</p>
						</div>

						<div className="flex items-center gap-3">
							<button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2">
								<PlusIcon className="h-4 w-4" />
								Nuevo Cálculo
							</button>
						</div>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Estadísticas rápidas */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
					<div className="bg-white rounded-xl p-6 border border-gray-100">
						<div className="flex items-center">
							<div className="p-3 bg-primary-100 rounded-lg">
								<CalculatorIcon className="h-6 w-6 text-primary-600" />
							</div>
							<div className="ml-4">
								<p className="text-2xl font-semibold text-gray-900">
									{calculations.length}
								</p>
								<p className="text-gray-600 text-sm">Total Cálculos</p>
							</div>
						</div>
					</div>

					<div className="bg-white rounded-xl p-6 border border-gray-100">
						<div className="flex items-center">
							<div className="p-3 bg-secondary-100 rounded-lg">
								<StarIcon className="h-6 w-6 text-secondary-600" />
							</div>
							<div className="ml-4">
								<p className="text-2xl font-semibold text-gray-900">
									{calculations.filter((c) => c.isFavorite).length}
								</p>
								<p className="text-gray-600 text-sm">Favoritos</p>
							</div>
						</div>
					</div>

					<div className="bg-white rounded-xl p-6 border border-gray-100">
						<div className="flex items-center">
							<div className="p-3 bg-green-100 rounded-lg">
								<FolderIcon className="h-6 w-6 text-green-600" />
							</div>
							<div className="ml-4">
								<p className="text-2xl font-semibold text-gray-900">
									{mockProjects.length}
								</p>
								<p className="text-gray-600 text-sm">Proyectos</p>
							</div>
						</div>
					</div>

					<div className="bg-white rounded-xl p-6 border border-gray-100">
						<div className="flex items-center">
							<div className="p-3 bg-blue-100 rounded-lg">
								<CheckBadgeIcon className="h-6 w-6 text-blue-600" />
							</div>
							<div className="ml-4">
								<p className="text-2xl font-semibold text-gray-900">
									{calculations.filter((c) => c.status === "completed").length}
								</p>
								<p className="text-gray-600 text-sm">Completados</p>
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
									placeholder="Buscar cálculos por nombre, plantilla o etiquetas..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
								/>
							</div>
						</div>

						{/* Filtros */}
						<div className="flex items-center gap-3">
							<button
								onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
								className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-200 ${
									showOnlyFavorites
										? "bg-secondary-50 border-secondary-300 text-secondary-700"
										: "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
								}`}
							>
								<StarIcon className="h-4 w-4" />
								Favoritos
							</button>

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
								value={selectedProject || ""}
								onChange={(e) => setSelectedProject(e.target.value || null)}
								className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
							>
								<option value="">Todos los proyectos</option>
								{mockProjects.map((project) => (
									<option key={project.id} value={project.id}>
										{project.name}
									</option>
								))}
							</select>

							<select
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
								className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
							>
								<option value="recent">Más recientes</option>
								<option value="name">Por nombre</option>
								<option value="project">Por proyecto</option>
								<option value="category">Por categoría</option>
							</select>
						</div>
					</div>
				</div>

				{/* Lista de cálculos */}
				<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
					{filteredCalculations.map((calculation, index) => {
						const categoryInfo = getCategoryInfo(calculation.templateCategory);

						return (
							<div
								key={calculation.id}
								className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
								style={{animationDelay: `${index * 0.05}s`}}
							>
								<div className="p-6">
									{/* Header */}
									<div className="flex items-start justify-between mb-4">
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-1">
												<h3 className="font-semibold text-gray-900 line-clamp-1">
													{calculation.name}
												</h3>
												{getStatusBadge(calculation.status)}
											</div>
											<p className="text-sm text-gray-600 mb-2">
												{calculation.templateName}
											</p>
											<div
												className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${categoryInfo.color}`}
											>
												<span>{categoryInfo.icon}</span>
												<span>{categoryInfo.name}</span>
											</div>
										</div>

										<button
											onClick={() => toggleFavorite(calculation.id)}
											className="p-1 hover:bg-gray-100 rounded-full transition-colors"
										>
											{calculation.isFavorite ? (
												<StarSolidIcon className="h-4 w-4 text-secondary-500" />
											) : (
												<StarIcon className="h-4 w-4 text-gray-400" />
											)}
										</button>
									</div>

									{/* Resultado principal */}
									<div className="bg-gray-50 rounded-lg p-4 mb-4">
										<div className="text-center">
											<div className="text-2xl font-bold text-primary-700">
												{calculation.results.mainValue}
											</div>
											<div className="text-sm text-gray-600">
												{calculation.results.unit}
											</div>
										</div>
									</div>

									{/* Metadatos */}
									<div className="space-y-2 mb-4">
										{calculation.projectName && (
											<div className="flex items-center gap-2 text-sm text-gray-600">
												<FolderIcon className="h-4 w-4" />
												<span className="truncate">
													{calculation.projectName}
												</span>
											</div>
										)}

										<div className="flex items-center gap-2 text-sm text-gray-600">
											<CalendarIcon className="h-4 w-4" />
											<span>{formatDate(calculation.lastModified)}</span>
										</div>

										<div className="flex items-center gap-2 text-sm text-gray-600">
											<DocumentTextIcon className="h-4 w-4" />
											<span>{calculation.necReference}</span>
										</div>
									</div>

									{/* Tags */}
									{calculation.tags.length > 0 && (
										<div className="flex flex-wrap gap-1 mb-4">
											{calculation.tags.slice(0, 3).map((tag, tagIndex) => (
												<span
													key={tagIndex}
													className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
												>
													{tag}
												</span>
											))}
											{calculation.tags.length > 3 && (
												<span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md">
													+{calculation.tags.length - 3}
												</span>
											)}
										</div>
									)}

									{/* Acciones */}
									<div className="flex justify-between items-center">
										<div className="flex gap-2">
											<button className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors">
												<EyeIcon className="h-4 w-4" />
											</button>
											<button className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors">
												<DocumentDuplicateIcon className="h-4 w-4" />
											</button>
											<button className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors">
												<ShareIcon className="h-4 w-4" />
											</button>
										</div>

										<button className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors">
											Usar Plantilla
										</button>
									</div>
								</div>
							</div>
						);
					})}
				</div>

				{/* Estado vacío */}
				{filteredCalculations.length === 0 && (
					<div className="text-center py-16">
						<div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<ArchiveBoxIcon className="h-12 w-12 text-gray-400" />
						</div>
						<h3 className="text-lg font-medium text-gray-900 mb-2">
							No se encontraron cálculos
						</h3>
						<p className="text-gray-600 mb-6">
							{searchTerm || selectedCategory || selectedProject
								? "Intenta ajustar los filtros o términos de búsqueda."
								: "Aún no tienes cálculos guardados. ¡Comienza creando tu primer cálculo!"}
						</p>
						<button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2 mx-auto">
							<PlusIcon className="h-4 w-4" />
							Crear Primer Cálculo
						</button>
					</div>
				)}
			</div>

			{/* Estilos para animaciones */}
			<style>{`
				.line-clamp-1 {
					display: -webkit-box;
					-webkit-line-clamp: 1;
					-webkit-box-orient: vertical;
					overflow: hidden;
				}
			`}</style>
		</div>
	);
};

export default SavedCalculations;
