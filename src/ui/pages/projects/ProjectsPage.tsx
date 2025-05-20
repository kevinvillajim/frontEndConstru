import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {
	PlusIcon,
	MagnifyingGlassIcon,
	ViewColumnsIcon,
	Squares2X2Icon,
	CalendarIcon,
	CurrencyDollarIcon,
	UserGroupIcon,
	ChartBarIcon,
	DocumentTextIcon,
	EllipsisVerticalIcon,
	StarIcon,
	PhotoIcon,
} from "@heroicons/react/24/outline";
import {StarIcon as StarSolidIcon} from "@heroicons/react/24/solid";

// Tipos de datos
interface Project {
	id: string;
	name: string;
	description: string;
	status: "planning" | "in_progress" | "on_hold" | "completed" | "cancelled";
	progress: number;
	startDate: string;
	endDate: string;
	budget: number;
	spent: number;
	teamMembers: number;
	phase: string;
	priority: "low" | "medium" | "high";
	isFavorite: boolean;
	thumbnail: string; // Imagen principal del proyecto
	images: string[]; // Array de todas las imágenes
	client: string;
	location: string;
}

// Datos de ejemplo con imágenes
const mockProjects: Project[] = [
	{
		id: "1",
		name: "Torre Residencial Quito Centro",
		description:
			"Desarrollo de torre residencial de 20 pisos con departamentos de lujo en el centro histórico de Quito",
		status: "in_progress",
		progress: 65,
		startDate: "2024-01-15",
		endDate: "2025-06-30",
		budget: 850000,
		spent: 420000,
		teamMembers: 12,
		phase: "Estructura",
		priority: "high",
		isFavorite: true,
		thumbnail: "/api/placeholder/400/300",
		images: [
			"/api/placeholder/400/300",
			"/api/placeholder/400/300",
			"/api/placeholder/400/300",
		],
		client: "Inmobiliaria Del Centro",
		location: "Quito, Pichincha",
	},
	{
		id: "2",
		name: "Centro Comercial La Aurora",
		description:
			"Construcción de centro comercial con 3 niveles y estacionamiento subterráneo",
		status: "planning",
		progress: 15,
		startDate: "2024-03-01",
		endDate: "2025-12-15",
		budget: 1200000,
		spent: 180000,
		teamMembers: 8,
		phase: "Planificación",
		priority: "medium",
		isFavorite: false,
		thumbnail: "/api/placeholder/400/300",
		images: ["/api/placeholder/400/300", "/api/placeholder/400/300"],
		client: "Grupo Aurora S.A.",
		location: "Cuenca, Azuay",
	},
	{
		id: "3",
		name: "Conjunto Habitacional Los Jardines",
		description:
			"Desarrollo habitacional de 45 casas con áreas verdes y amenidades comunitarias",
		status: "completed",
		progress: 100,
		startDate: "2023-08-01",
		endDate: "2024-04-30",
		budget: 650000,
		spent: 635000,
		teamMembers: 15,
		phase: "Completado",
		priority: "medium",
		isFavorite: true,
		thumbnail: "/api/placeholder/400/300",
		images: [
			"/api/placeholder/400/300",
			"/api/placeholder/400/300",
			"/api/placeholder/400/300",
			"/api/placeholder/400/300",
		],
		client: "Constructora Jardines",
		location: "Ambato, Tungurahua",
	},
	{
		id: "4",
		name: "Oficinas Corporativas Amazonas",
		description:
			"Edificio de oficinas moderno con certificación LEED y tecnología inteligente",
		status: "on_hold",
		progress: 30,
		startDate: "2024-02-01",
		endDate: "2025-08-15",
		budget: 950000,
		spent: 285000,
		teamMembers: 6,
		phase: "Pausado",
		priority: "low",
		isFavorite: false,
		thumbnail: "/api/placeholder/400/300",
		images: ["/api/placeholder/400/300"],
		client: "Tech Solutions Ecuador",
		location: "Quito, Pichincha",
	},
];

const ProjectsPage: React.FC = () => {
	const navigate = useNavigate();
	const [projects, setProjects] = useState<Project[]>(mockProjects);
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [priorityFilter] = useState<string>("all");
	const [showFavorites, setShowFavorites] = useState(false);
	const [sortBy, setSortBy] = useState<string>("name");
	// const [showFilters, setShowFilters] = useState(false);

	// Filtrar proyectos
	const filteredProjects = projects.filter((project) => {
		const matchesSearch =
			project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
			project.location.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesStatus =
			statusFilter === "all" || project.status === statusFilter;
		const matchesPriority =
			priorityFilter === "all" || project.priority === priorityFilter;
		const matchesFavorites = !showFavorites || project.isFavorite;

		return (
			matchesSearch && matchesStatus && matchesPriority && matchesFavorites
		);
	});

	// Ordenar proyectos
	const sortedProjects = [...filteredProjects].sort((a, b) => {
		switch (sortBy) {
			case "name":
				return a.name.localeCompare(b.name);
			case "date":
				return (
					new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
				);
			case "progress":
				return b.progress - a.progress;
			case "budget":
				return b.budget - a.budget;
			default:
				return 0;
		}
	});

	const getStatusColor = (status: string) => {
		switch (status) {
			case "planning":
				return "bg-blue-100 text-blue-800";
			case "in_progress":
				return "bg-green-100 text-green-800";
			case "on_hold":
				return "bg-yellow-100 text-yellow-800";
			case "completed":
				return "bg-primary-100 text-primary-800";
			case "cancelled":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case "planning":
				return "Planificación";
			case "in_progress":
				return "En Progreso";
			case "on_hold":
				return "Pausado";
			case "completed":
				return "Completado";
			case "cancelled":
				return "Cancelado";
			default:
				return status;
		}
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case "high":
				return "border-l-red-500";
			case "medium":
				return "border-l-yellow-500";
			case "low":
				return "border-l-green-500";
			default:
				return "border-l-gray-300";
		}
	};

	const toggleFavorite = (projectId: string) => {
		setProjects(
			projects.map((project) =>
				project.id === projectId
					? {...project, isFavorite: !project.isFavorite}
					: project
			)
		);
	};

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("es-EC", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0,
		}).format(amount);
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("es-EC");
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header Section */}
			<div className="bg-white border-b border-gray-200">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
						{/* Title and Description */}
						<div className="flex-1">
							<div className="flex items-center gap-3 mb-2">
								<div className="h-8 w-8 bg-secondary-500 rounded-lg flex items-center justify-center">
									<DocumentTextIcon className="h-5 w-5 text-gray-900" />
								</div>
								<h1 className="text-3xl font-bold text-gray-900">Proyectos</h1>
							</div>
							<p className="text-gray-600 max-w-2xl">
								Gestiona y supervisa todos tus proyectos de construcción desde
								un solo lugar. Monitorea el progreso, controla presupuestos y
								coordina equipos de trabajo.
							</p>
						</div>

						{/* Action Buttons */}
						<div className="flex items-center gap-3">
							<button
								onClick={() => setShowFavorites(!showFavorites)}
								className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
									showFavorites
										? "bg-secondary-50 border-secondary-300 text-secondary-700"
										: "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
								}`}
							>
								<StarIcon className="h-4 w-4" />
								Favoritos
							</button>

							<Link
								to="/projects/create-new"
								className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
							>
								<PlusIcon className="h-4 w-4" />
								Nuevo Proyecto
							</Link>
						</div>
					</div>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">
									Total Proyectos
								</p>
								<p className="text-2xl font-bold text-gray-900">
									{projects.length}
								</p>
							</div>
							<div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
								<DocumentTextIcon className="h-6 w-6 text-blue-600" />
							</div>
						</div>
					</div>

					<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">En Progreso</p>
								<p className="text-2xl font-bold text-green-600">
									{projects.filter((p) => p.status === "in_progress").length}
								</p>
							</div>
							<div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
								<ChartBarIcon className="h-6 w-6 text-green-600" />
							</div>
						</div>
					</div>

					<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">
									Presupuesto Total
								</p>
								<p className="text-2xl font-bold text-secondary-600">
									{formatCurrency(
										projects.reduce((sum, p) => sum + p.budget, 0)
									)}
								</p>
							</div>
							<div className="h-12 w-12 bg-secondary-100 rounded-lg flex items-center justify-center">
								<CurrencyDollarIcon className="h-6 w-6 text-secondary-600" />
							</div>
						</div>
					</div>

					<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">
									Miembros de Equipo
								</p>
								<p className="text-2xl font-bold text-primary-600">
									{projects.reduce((sum, p) => sum + p.teamMembers, 0)}
								</p>
							</div>
							<div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
								<UserGroupIcon className="h-6 w-6 text-primary-600" />
							</div>
						</div>
					</div>
				</div>

				{/* Filters and Search */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
					<div className="flex flex-col lg:flex-row lg:items-center gap-4">
						{/* Search */}
						<div className="flex-1 relative">
							<MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
							<input
								type="text"
								placeholder="Buscar proyectos, clientes o ubicaciones..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
							/>
						</div>

						{/* Filters */}
						<div className="flex items-center gap-3">
							<select
								value={statusFilter}
								onChange={(e) => setStatusFilter(e.target.value)}
								className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
							>
								<option value="all">Todos los estados</option>
								<option value="planning">Planificación</option>
								<option value="in_progress">En Progreso</option>
								<option value="on_hold">Pausado</option>
								<option value="completed">Completado</option>
							</select>

							<select
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
								className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
							>
								<option value="name">Ordenar por nombre</option>
								<option value="date">Ordenar por fecha</option>
								<option value="progress">Ordenar por progreso</option>
								<option value="budget">Ordenar por presupuesto</option>
							</select>

							{/* View Toggle */}
							<div className="flex items-center bg-gray-100 rounded-lg p-1">
								<button
									onClick={() => setViewMode("grid")}
									className={`p-2 rounded-md transition-colors ${
										viewMode === "grid"
											? "bg-white text-primary-600 shadow-sm"
											: "text-gray-500 hover:text-gray-700"
									}`}
								>
									<Squares2X2Icon className="h-4 w-4" />
								</button>
								<button
									onClick={() => setViewMode("list")}
									className={`p-2 rounded-md transition-colors ${
										viewMode === "list"
											? "bg-white text-primary-600 shadow-sm"
											: "text-gray-500 hover:text-gray-700"
									}`}
								>
									<ViewColumnsIcon className="h-4 w-4" />
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* Projects Grid/List */}
				{viewMode === "grid" ? (
					<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
						{sortedProjects.map((project, index) => (
							<div
								key={project.id}
								className={`bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-l-4 ${getPriorityColor(project.priority)} group cursor-pointer animate-fade-in overflow-hidden`}
								style={{animationDelay: `${index * 0.1}s`}}
								onClick={() => navigate(`/projects/details/${project.id}`)}
							>
								{/* Imagen del proyecto */}
								<div className="relative h-48 overflow-hidden">
									<img
										src={project.thumbnail}
										alt={project.name}
										className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
									/>

									{/* Overlay con información */}
									<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
										<div className="absolute bottom-4 left-4 right-4">
											<div className="flex items-center gap-2 text-white text-sm">
												<PhotoIcon className="h-4 w-4" />
												<span>{project.images.length} imágenes</span>
											</div>
										</div>
									</div>

									{/* Badge de estado */}
									<div className="absolute top-4 left-4">
										<span
											className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}
										>
											{getStatusText(project.status)}
										</span>
									</div>

									{/* Botón de favorito */}
									<button
										onClick={(e) => {
											e.stopPropagation();
											toggleFavorite(project.id);
										}}
										className="absolute top-4 right-4 p-1.5 bg-white/90 hover:bg-white rounded-full transition-colors backdrop-blur-sm"
									>
										{project.isFavorite ? (
											<StarSolidIcon className="h-4 w-4 text-secondary-500" />
										) : (
											<StarIcon className="h-4 w-4 text-gray-600" />
										)}
									</button>
								</div>

								{/* Contenido de la tarjeta */}
								<div className="p-6">
									<div className="flex items-start justify-between mb-3">
										<div className="flex-1">
											<h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-1">
												{project.name}
											</h3>
											<p className="text-sm text-gray-600">{project.client}</p>
										</div>
										<div className="ml-4">
											<div className="relative">
												<button
													onClick={(e) => e.stopPropagation()}
													className="p-1 hover:bg-gray-100 rounded-full transition-colors"
												>
													<EllipsisVerticalIcon className="h-4 w-4 text-gray-400" />
												</button>
											</div>
										</div>
									</div>

									<div className="flex items-center justify-between mb-3">
										<span className="text-sm text-gray-500">
											{project.phase}
										</span>
										<span className="text-xs text-gray-500">
											{project.location}
										</span>
									</div>

									{/* Progress Bar */}
									<div className="mb-4">
										<div className="flex items-center justify-between mb-2">
											<span className="text-sm font-medium text-gray-700">
												Progreso
											</span>
											<span className="text-sm font-semibold text-primary-600">
												{project.progress}%
											</span>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-2">
											<div
												className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-500 ease-out"
												style={{width: `${project.progress}%`}}
											></div>
										</div>
									</div>

									{/* Project Info */}
									<div className="space-y-3">
										<div className="flex items-center text-sm text-gray-600">
											<CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
											<span>
												{formatDate(project.startDate)} -{" "}
												{formatDate(project.endDate)}
											</span>
										</div>

										<div className="flex items-center justify-between text-sm">
											<div className="flex items-center text-gray-600">
												<CurrencyDollarIcon className="h-4 w-4 mr-2 text-gray-400" />
												<span>
													{formatCurrency(project.spent)} /{" "}
													{formatCurrency(project.budget)}
												</span>
											</div>
											<div className="flex items-center text-gray-600">
												<UserGroupIcon className="h-4 w-4 mr-1 text-gray-400" />
												<span>{project.teamMembers}</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					// List View
					<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
						<div className="overflow-x-auto">
							<table className="min-w-full divide-y divide-gray-200">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Proyecto
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Estado
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Progreso
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Presupuesto
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Fechas
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Equipo
										</th>
										<th className="relative px-6 py-3">
											<span className="sr-only">Acciones</span>
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{sortedProjects.map((project, index) => (
										<tr
											key={project.id}
											className={`hover:bg-gray-50 cursor-pointer transition-colors animate-fade-in border-l-4 ${getPriorityColor(project.priority)}`}
											style={{animationDelay: `${index * 0.05}s`}}
											onClick={() => navigate(`/projects/details/${project.id}`)}
										>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="flex items-center">
													{/* Miniatura en vista de lista */}
													<div className="flex-shrink-0 h-12 w-12 mr-4">
														<img
															src={project.thumbnail}
															alt={project.name}
															className="h-12 w-12 rounded-lg object-cover"
														/>
													</div>
													<div className="flex-1">
														<div className="flex items-center gap-3">
															<button
																onClick={(e) => {
																	e.stopPropagation();
																	toggleFavorite(project.id);
																}}
																className="flex-shrink-0"
															>
																{project.isFavorite ? (
																	<StarSolidIcon className="h-4 w-4 text-secondary-500" />
																) : (
																	<StarIcon className="h-4 w-4 text-gray-300 hover:text-secondary-500 transition-colors" />
																)}
															</button>
															<div>
																<div className="text-sm font-medium text-gray-900">
																	{project.name}
																</div>
																<div className="text-sm text-gray-500">
																	{project.client}
																</div>
															</div>
														</div>
													</div>
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<span
													className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}
												>
													{getStatusText(project.status)}
												</span>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="flex items-center">
													<div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
														<div
															className="bg-primary-600 h-2 rounded-full transition-all duration-500"
															style={{width: `${project.progress}%`}}
														></div>
													</div>
													<span className="text-sm text-gray-900">
														{project.progress}%
													</span>
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
												<div>
													<div className="font-medium">
														{formatCurrency(project.budget)}
													</div>
													<div className="text-gray-500">
														Gastado: {formatCurrency(project.spent)}
													</div>
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
												<div>
													<div>Inicio: {formatDate(project.startDate)}</div>
													<div>Fin: {formatDate(project.endDate)}</div>
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
												<div className="flex items-center">
													<UserGroupIcon className="h-4 w-4 mr-1" />
													{project.teamMembers}
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
												<button
													onClick={(e) => e.stopPropagation()}
													className="text-gray-400 hover:text-gray-600 transition-colors"
												>
													<EllipsisVerticalIcon className="h-5 w-5" />
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				)}

				{/* Empty State */}
				{sortedProjects.length === 0 && (
					<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
						<DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
						<h3 className="text-lg font-medium text-gray-900 mb-2">
							No se encontraron proyectos
						</h3>
						<p className="text-gray-500 mb-6">
							{searchTerm ||
							statusFilter !== "all" ||
							priorityFilter !== "all" ||
							showFavorites
								? "Intenta ajustar los filtros para ver más resultados."
								: "Comienza creando tu primer proyecto de construcción."}
						</p>
						{!searchTerm &&
							statusFilter === "all" &&
							priorityFilter === "all" &&
							!showFavorites && (
								<Link
									to="/projects/create-new"
									className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
								>
									<PlusIcon className="h-5 w-5" />
									Crear Primer Proyecto
								</Link>
							)}
					</div>
				)}
			</div>

			{/* Custom CSS for animations */}
			<style>{`
				@keyframes fadeInUp {
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
					animation: fadeInUp 0.5s ease-out forwards;
					opacity: 0;
				}

				.line-clamp-2 {
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					overflow: hidden;
				}

				/* Smooth hover effects */
				.group:hover .group-hover\\:text-primary-600 {
					color: var(--color-primary-600);
				}

				/* Progress bar animation */
				.bg-gradient-to-r {
					background: linear-gradient(
						to right,
						var(--color-primary-500),
						var(--color-primary-600)
					);
				}

				/* Image hover effects */
				.group:hover img {
					transform: scale(1.05);
				}
			`}</style>
		</div>
	);
};

export default ProjectsPage;
