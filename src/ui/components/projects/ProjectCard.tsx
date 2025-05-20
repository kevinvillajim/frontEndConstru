import React from "react";
import {useNavigate} from "react-router-dom";
import {
	CalendarIcon,
	CurrencyDollarIcon,
	UserGroupIcon,
	EllipsisVerticalIcon,
	PhotoIcon,
} from "@heroicons/react/24/outline";
import {StarIcon as StarSolidIcon} from "@heroicons/react/24/solid";
import {StarIcon} from "@heroicons/react/24/outline";

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
	thumbnail: string;
	images: string[];
	client: string;
	location: string;
}

interface ProjectCardProps {
	project: Project;
	onToggleFavorite: (projectId: string) => void;
	animationDelay?: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
	project,
	onToggleFavorite,
	animationDelay = 0,
}) => {
	const navigate = useNavigate();

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
		<div
			className={`bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-l-4 ${getPriorityColor(project.priority)} group cursor-pointer animate-fade-in overflow-hidden`}
			style={{animationDelay: `${animationDelay}s`}}
			onClick={() => navigate(`/proyectos/${project.id}`)}
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
						onToggleFavorite(project.id);
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
					<span className="text-sm text-gray-500">{project.phase}</span>
					<span className="text-xs text-gray-500">{project.location}</span>
				</div>

				{/* Progress Bar */}
				<div className="mb-4">
					<div className="flex items-center justify-between mb-2">
						<span className="text-sm font-medium text-gray-700">Progreso</span>
						<span className="text-sm font-semibold text-primary-600">
							{project.progress}%
						</span>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-2">
						<div
							className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
							style={{width: `${project.progress}%`}}
						>
							<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
						</div>
					</div>
				</div>

				{/* Project Info */}
				<div className="space-y-3">
					<div className="flex items-center text-sm text-gray-600">
						<CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
						<span>
							{formatDate(project.startDate)} - {formatDate(project.endDate)}
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

			{/* Estilos inline para animaciones */}
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

				.line-clamp-2 {
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					overflow: hidden;
				}
			`}</style>
		</div>
	);
};

export default ProjectCard;
