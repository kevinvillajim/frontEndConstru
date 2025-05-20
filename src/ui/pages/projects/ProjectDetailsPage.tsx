import React, {useState, useEffect} from "react";
import {useParams, useNavigate, Link} from "react-router-dom";
import {
	ArrowLeftIcon,
	PencilIcon,
	ShareIcon,
	EllipsisVerticalIcon,
	CalendarIcon,
	UserGroupIcon,
	MapPinIcon,
	ChartBarIcon,
	ClockIcon,
	DocumentTextIcon,
	ExclamationTriangleIcon,
	CheckCircleIcon,
	PlayCircleIcon,
	PauseCircleIcon,
	StarIcon,
	EyeIcon,
	ArchiveBoxIcon,
	TrashIcon,
} from "@heroicons/react/24/outline";
import {StarIcon as StarSolidIcon} from "@heroicons/react/24/solid";

// Tipo de datos del proyecto
interface ProjectDetails {
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
	images: string[];
	client: string;
	location: string;
	projectType: string;
	projectSize: string;
	createdAt: string;
	updatedAt: string;
}

// Mock data - En producción vendría de la API
const mockProject: ProjectDetails = {
	id: "1",
	name: "Torre Residencial Quito Centro",
	description:
		"Desarrollo de torre residencial de 20 pisos con departamentos de lujo en el centro histórico de Quito. El proyecto incluye amenidades de primera clase como gimnasio, spa, área social, piscina en la terraza y estacionamiento subterráneo para 150 vehículos.",
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
	images: [
		"/api/placeholder/600/400",
		"/api/placeholder/600/400",
		"/api/placeholder/600/400",
		"/api/placeholder/600/400",
	],
	client: "Inmobiliaria Del Centro",
	location: "Quito, Pichincha",
	projectType: "Residencial",
	projectSize: "Grande (2000m² - 10000m²)",
	createdAt: "2024-01-10T10:00:00Z",
	updatedAt: "2024-05-15T14:30:00Z",
};

const ProjectDetailsPage: React.FC = () => {
	const {projectId} = useParams<{projectId: string}>();
	const navigate = useNavigate();
	const [project, setProject] = useState<ProjectDetails | null>(null);
	const [loading, setLoading] = useState(true);
	const [selectedImage, setSelectedImage] = useState(0);
	const [showActionsMenu, setShowActionsMenu] = useState(false);

	useEffect(() => {
		// Simular carga de datos del proyecto
		const loadProject = async () => {
			try {
				// En producción: await api.get(`/projects/${projectId}`)
				await new Promise((resolve) => setTimeout(resolve, 1000));
				setProject(mockProject);
			} catch (error) {
				console.error("Error loading project:", error);
			} finally {
				setLoading(false);
			}
		};

		loadProject();
	}, [projectId]);

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin h-8 w-8 border-2 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
					<p className="text-gray-600">Cargando proyecto...</p>
				</div>
			</div>
		);
	}

	if (!project) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
					<h2 className="text-xl font-semibold text-gray-900 mb-2">
						Proyecto no encontrado
					</h2>
					<p className="text-gray-600 mb-6">
						El proyecto que buscas no existe o no tienes acceso a él.
					</p>
					<button
						onClick={() => navigate("/projects")}
						className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors"
					>
						Volver a Proyectos
					</button>
				</div>
			</div>
		);
	}

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "planning":
				return <ClockIcon className="h-5 w-5" />;
			case "in_progress":
				return <PlayCircleIcon className="h-5 w-5" />;
			case "on_hold":
				return <PauseCircleIcon className="h-5 w-5" />;
			case "completed":
				return <CheckCircleIcon className="h-5 w-5" />;
			default:
				return <ExclamationTriangleIcon className="h-5 w-5" />;
		}
	};

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
				return "text-red-600 bg-red-50";
			case "medium":
				return "text-yellow-600 bg-yellow-50";
			case "low":
				return "text-green-600 bg-green-50";
			default:
				return "text-gray-600 bg-gray-50";
		}
	};

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("es-EC", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0,
		}).format(amount);
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("es-EC", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const toggleFavorite = () => {
		setProject((prev) =>
			prev ? {...prev, isFavorite: !prev.isFavorite} : null
		);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white border-b border-gray-200 sticky top-0 z-40">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<button
								onClick={() => navigate("/projects")}
								className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
							>
								<ArrowLeftIcon className="h-5 w-5" />
							</button>
							<div className="flex items-center gap-3">
								<div
									className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}
								>
									{getStatusIcon(project.status)}
									{getStatusText(project.status)}
								</div>
								<div
									className={`px-2 py-1 rounded text-xs font-medium uppercase tracking-wide ${getPriorityColor(project.priority)}`}
								>
									{project.priority === "high"
										? "Alta"
										: project.priority === "medium"
											? "Media"
											: "Baja"}
								</div>
							</div>
						</div>

						<div className="flex items-center gap-2">
							<button
								onClick={toggleFavorite}
								className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
							>
								{project.isFavorite ? (
									<StarSolidIcon className="h-5 w-5 text-secondary-500" />
								) : (
									<StarIcon className="h-5 w-5 text-gray-400" />
								)}
							</button>

							<Link
								to={`/projects/edit/${project.id}`}
								className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
							>
								<PencilIcon className="h-4 w-4" />
								Editar
							</Link>

							<div className="relative">
								<button
									onClick={() => setShowActionsMenu(!showActionsMenu)}
									className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
								>
									<EllipsisVerticalIcon className="h-5 w-5" />
								</button>

								{showActionsMenu && (
									<div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
										<button className="flex items-center gap-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50">
											<ShareIcon className="h-4 w-4" />
											Compartir
										</button>
										<button className="flex items-center gap-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50">
											<EyeIcon className="h-4 w-4" />
											Ver en Dashboard
										</button>
										<button className="flex items-center gap-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50">
											<ArchiveBoxIcon className="h-4 w-4" />
											Archivar
										</button>
										<hr className="my-1" />
										<button className="flex items-center gap-2 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50">
											<TrashIcon className="h-4 w-4" />
											Eliminar
										</button>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Contenido principal */}
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Columna principal */}
					<div className="lg:col-span-2 space-y-8">
						{/* Hero Section */}
						<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
							{/* Galería de imágenes */}
							<div className="relative">
								<div className="aspect-[16/9] overflow-hidden">
									<img
										src={project.images[selectedImage]}
										alt={project.name}
										className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
									/>
								</div>

								{project.images.length > 1 && (
									<div className="absolute bottom-4 left-4 flex gap-2">
										{project.images.map((_, index) => (
											<button
												key={index}
												onClick={() => setSelectedImage(index)}
												className={`w-3 h-3 rounded-full transition-all ${
													selectedImage === index
														? "bg-white"
														: "bg-white/50 hover:bg-white/75"
												}`}
											/>
										))}
									</div>
								)}

								{project.images.length > 1 && (
									<div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
										{selectedImage + 1} / {project.images.length}
									</div>
								)}
							</div>

							<div className="p-8">
								<h1 className="text-3xl font-bold text-gray-900 mb-4">
									{project.name}
								</h1>
								<p className="text-gray-600 leading-relaxed">
									{project.description}
								</p>
							</div>
						</div>

						{/* Progreso del Proyecto */}
						<div
							className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 animate-fade-in"
							style={{animationDelay: "0.1s"}}
						>
							<div className="flex items-center gap-3 mb-6">
								<div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
									<ChartBarIcon className="h-5 w-5 text-green-600" />
								</div>
								<div>
									<h2 className="text-xl font-semibold text-gray-900">
										Progreso del Proyecto
									</h2>
									<p className="text-sm text-gray-600">
										Estado actual: {project.phase}
									</p>
								</div>
							</div>

							<div className="mb-6">
								<div className="flex items-center justify-between mb-3">
									<span className="text-sm font-medium text-gray-700">
										Completado
									</span>
									<span className="text-sm font-semibold text-primary-600">
										{project.progress}%
									</span>
								</div>
								<div className="w-full bg-gray-200 rounded-full h-3">
									<div
										className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
										style={{width: `${project.progress}%`}}
									>
										<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
									</div>
								</div>
							</div>

							{/* Timeline visual simplificado */}
							<div className="grid grid-cols-4 gap-4">
								{["Planificación", "Estructura", "Acabados", "Entrega"].map(
									(phase, index) => (
										<div key={phase} className="text-center">
											<div
												className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-bold ${
													index < Math.floor(project.progress / 25)
														? "bg-primary-600 text-white"
														: index === Math.floor(project.progress / 25)
															? "bg-primary-100 text-primary-600 border-2 border-primary-600"
															: "bg-gray-200 text-gray-500"
												}`}
											>
												{index + 1}
											</div>
											<p
												className={`text-xs ${
													index <= Math.floor(project.progress / 25)
														? "text-primary-600 font-medium"
														: "text-gray-500"
												}`}
											>
												{phase}
											</p>
										</div>
									)
								)}
							</div>
						</div>

						{/* Miniatura de imágenes */}
						{project.images.length > 1 && (
							<div
								className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-fade-in"
								style={{animationDelay: "0.2s"}}
							>
								<h3 className="text-lg font-semibold text-gray-900 mb-4">
									Galería del Proyecto
								</h3>
								<div className="grid grid-cols-4 gap-4">
									{project.images.map((image, index) => (
										<button
											key={index}
											onClick={() => setSelectedImage(index)}
											className={`aspect-square rounded-lg overflow-hidden transition-all hover:scale-105 ${
												selectedImage === index ? "ring-2 ring-primary-500" : ""
											}`}
										>
											<img
												src={image}
												alt={`Imagen ${index + 1}`}
												className="w-full h-full object-cover"
											/>
										</button>
									))}
								</div>
							</div>
						)}
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						{/* Información del Cliente */}
						<div
							className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-fade-in"
							style={{animationDelay: "0.3s"}}
						>
							<h3 className="text-lg font-semibold text-gray-900 mb-4">
								Información del Cliente
							</h3>
							<div className="space-y-4">
								<div className="flex items-center gap-3">
									<UserGroupIcon className="h-5 w-5 text-gray-400" />
									<div>
										<p className="text-sm text-gray-600">Cliente</p>
										<p className="font-medium text-gray-900">
											{project.client}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<MapPinIcon className="h-5 w-5 text-gray-400" />
									<div>
										<p className="text-sm text-gray-600">Ubicación</p>
										<p className="font-medium text-gray-900">
											{project.location}
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* Detalles del Proyecto */}
						<div
							className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-fade-in"
							style={{animationDelay: "0.4s"}}
						>
							<h3 className="text-lg font-semibold text-gray-900 mb-4">
								Detalles del Proyecto
							</h3>
							<div className="space-y-4">
								<div>
									<p className="text-sm text-gray-600">Tipo de Proyecto</p>
									<p className="font-medium text-gray-900">
										{project.projectType}
									</p>
								</div>
								<div>
									<p className="text-sm text-gray-600">Tamaño</p>
									<p className="font-medium text-gray-900">
										{project.projectSize}
									</p>
								</div>
								<div>
									<p className="text-sm text-gray-600">Miembros del Equipo</p>
									<p className="font-medium text-gray-900">
										{project.teamMembers} personas
									</p>
								</div>
							</div>
						</div>

						{/* Presupuesto */}
						<div
							className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-fade-in"
							style={{animationDelay: "0.5s"}}
						>
							<h3 className="text-lg font-semibold text-gray-900 mb-4">
								Presupuesto
							</h3>
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<span className="text-gray-600">Presupuesto Total</span>
									<span className="font-semibold text-gray-900">
										{formatCurrency(project.budget)}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-gray-600">Gastado</span>
									<span className="font-semibold text-red-600">
										{formatCurrency(project.spent)}
									</span>
								</div>
								<div className="flex items-center justify-between border-t pt-4">
									<span className="text-gray-600">Restante</span>
									<span className="font-semibold text-green-600">
										{formatCurrency(project.budget - project.spent)}
									</span>
								</div>

								<div className="mt-4">
									<div className="flex items-center justify-between mb-2">
										<span className="text-sm text-gray-600">Utilizado</span>
										<span className="text-sm font-medium">
											{Math.round((project.spent / project.budget) * 100)}%
										</span>
									</div>
									<div className="w-full bg-gray-200 rounded-full h-2">
										<div
											className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full"
											style={{
												width: `${(project.spent / project.budget) * 100}%`,
											}}
										></div>
									</div>
								</div>
							</div>
						</div>

						{/* Fechas Importantes */}
						<div
							className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-fade-in"
							style={{animationDelay: "0.6s"}}
						>
							<h3 className="text-lg font-semibold text-gray-900 mb-4">
								Fechas Importantes
							</h3>
							<div className="space-y-4">
								<div className="flex items-center gap-3">
									<CalendarIcon className="h-5 w-5 text-gray-400" />
									<div>
										<p className="text-sm text-gray-600">Fecha de Inicio</p>
										<p className="font-medium text-gray-900">
											{formatDate(project.startDate)}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<CalendarIcon className="h-5 w-5 text-gray-400" />
									<div>
										<p className="text-sm text-gray-600">
											Fecha de Finalización
										</p>
										<p className="font-medium text-gray-900">
											{formatDate(project.endDate)}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<ClockIcon className="h-5 w-5 text-gray-400" />
									<div>
										<p className="text-sm text-gray-600">Duración Total</p>
										<p className="font-medium text-gray-900">
											{Math.ceil(
												(new Date(project.endDate).getTime() -
													new Date(project.startDate).getTime()) /
													(1000 * 3600 * 24)
											)}{" "}
											días
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* Acciones Rápidas */}
						<div
							className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-fade-in"
							style={{animationDelay: "0.7s"}}
						>
							<h3 className="text-lg font-semibold text-gray-900 mb-4">
								Acciones Rápidas
							</h3>
							<div className="space-y-3">
								<button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
									<div className="flex items-center gap-3">
										<DocumentTextIcon className="h-5 w-5 text-primary-600" />
										<span className="text-gray-700">Ver Informes</span>
									</div>
								</button>
								<button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
									<div className="flex items-center gap-3">
										<ChartBarIcon className="h-5 w-5 text-green-600" />
										<span className="text-gray-700">Dashboard</span>
									</div>
								</button>
								<button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
									<div className="flex items-center gap-3">
										<UserGroupIcon className="h-5 w-5 text-blue-600" />
										<span className="text-gray-700">Gestionar Equipo</span>
									</div>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Estilos para animaciones */}
			<style>{`
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

				@keyframes shimmer {
					0% {
						transform: translateX(-100%);
					}
					100% {
						transform: translateX(100%);
					}
				}

				.animate-fade-in {
					animation: fadeIn 0.5s ease-out forwards;
					opacity: 0;
				}

				.animate-shimmer {
					animation: shimmer 2s infinite;
				}
			`}</style>
		</div>
	);
};

export default ProjectDetailsPage;
