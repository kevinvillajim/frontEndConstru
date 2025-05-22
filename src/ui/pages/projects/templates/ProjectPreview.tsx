import React from "react";
import type { ProjectTemplate } from "./ProjectTemplatesPage";
import {
	CheckCircleIcon,
	UserGroupIcon,
	MapPinIcon,
	CalendarIcon,
	RocketLaunchIcon,
	PencilIcon,
	BuildingOffice2Icon,
	CogIcon,
	BeakerIcon,
	UserIcon,
	PlusIcon,
} from "@heroicons/react/24/outline";

interface ProjectPreviewProps {
	template: ProjectTemplate;
	customization: {
		projectName: string;
		clientName: string;
		location: string;
		startDate: string;
		endDate: string;
		budget: number;
		teamSize: number;
		priority: "low" | "medium" | "high";
		description?: string;
		selectedPhases: string[];
		selectedMaterials: string[];
		selectedFormulas: string[];
		selectedTeamRoles: string[];
		additionalFeatures: string[];
	};
	onCreateProject: () => void;
	onBack: () => void;
}

const ProjectPreview: React.FC<ProjectPreviewProps> = ({
	template,
	customization,
	onCreateProject,
	onBack,
}) => {
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

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case "high":
				return "bg-red-100 text-red-700 border-red-200";
			case "medium":
				return "bg-yellow-100 text-yellow-700 border-yellow-200";
			case "low":
				return "bg-green-100 text-green-700 border-green-200";
			default:
				return "bg-gray-100 text-gray-700 border-gray-200";
		}
	};

	const getPriorityText = (priority: string) => {
		switch (priority) {
			case "high":
				return "Alta";
			case "medium":
				return "Media";
			case "low":
				return "Baja";
			default:
				return priority;
		}
	};

	const calculateDuration = () => {
		const start = new Date(customization.startDate);
		const end = new Date(customization.endDate);
		const diffTime = Math.abs(end.getTime() - start.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		const months = Math.floor(diffDays / 30);
		const days = diffDays % 30;
		
		if (months > 0) {
			return `${months} mes${months > 1 ? 'es' : ''} ${days > 0 ? `y ${days} día${days > 1 ? 's' : ''}` : ''}`;
		}
		return `${days} día${days > 1 ? 's' : ''}`;
	};

	const SectionCard: React.FC<{
		title: string;
		icon: React.ReactNode;
		children: React.ReactNode;
		delay?: string;
	}> = ({ title, icon, children, delay = "0s" }) => (
		<div 
			className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 animate-fade-in"
			style={{ animationDelay: delay }}
		>
			<div className="flex items-center gap-3 mb-4">
				<div className="h-8 w-8 bg-primary-100 rounded-lg flex items-center justify-center">
					{icon}
				</div>
				<h3 className="text-lg font-semibold text-gray-900">{title}</h3>
			</div>
			{children}
		</div>
	);

	const TagList: React.FC<{ items: string[]; emptyMessage: string }> = ({ items, emptyMessage }) => (
		<div className="flex flex-wrap gap-2">
			{items.length > 0 ? (
				items.map((item, index) => (
					<span
						key={index}
						className="px-3 py-1 bg-primary-50 text-primary-700 rounded-lg text-sm border border-primary-200"
					>
						{item}
					</span>
				))
			) : (
				<span className="text-gray-500 text-sm italic">{emptyMessage}</span>
			)}
		</div>
	);

	return (
		<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div className="max-w-6xl mx-auto">
				{/* Header principal */}
				<div className="text-center mb-8 animate-fade-in">
					<div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
						<CheckCircleIcon className="h-4 w-4" />
						Configuración Completa
					</div>
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						¡Tu proyecto está listo para crear!
					</h1>
					<p className="text-gray-600 max-w-2xl mx-auto">
						Revisa todos los detalles de tu proyecto basado en la plantilla <strong>{template.name}</strong> 
						antes de continuar.
					</p>
				</div>

				{/* Información principal del proyecto */}
				<div className={`mb-8 p-8 rounded-2xl ${template.gradient} border border-gray-200 animate-fade-in`} style={{animationDelay: '0.1s'}}>
					<div className="flex flex-col lg:flex-row lg:items-center gap-6">
						<div className={`w-20 h-20 bg-gradient-to-r ${template.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
							<template.icon className="h-10 w-10 text-white" />
						</div>
						<div className="flex-1">
							<h2 className="text-2xl font-bold text-gray-900 mb-2">
								{customization.projectName}
							</h2>
							<p className="text-gray-700 mb-3">
								Cliente: <strong>{customization.clientName}</strong>
							</p>
							{customization.description && (
								<p className="text-gray-600 text-sm leading-relaxed">
									{customization.description}
								</p>
							)}
						</div>
						<div className="flex items-center gap-4 text-sm">
							<div className="text-center">
								<div className="text-2xl font-bold text-gray-900">
									{formatCurrency(customization.budget)}
								</div>
								<div className="text-gray-600">Presupuesto</div>
							</div>
							<div className="w-px h-12 bg-gray-300"></div>
							<div className="text-center">
								<div className="text-2xl font-bold text-gray-900">
									{calculateDuration()}
								</div>
								<div className="text-gray-600">Duración</div>
							</div>
						</div>
					</div>
				</div>

				{/* Grid de información detallada */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
					{/* Detalles básicos */}
					<SectionCard 
						title="Detalles del Proyecto" 
						icon={<BuildingOffice2Icon className="h-5 w-5 text-primary-600" />}
						delay="0.2s"
					>
						<div className="space-y-4">
							<div className="flex items-center gap-3">
								<MapPinIcon className="h-5 w-5 text-gray-400" />
								<div>
									<span className="text-sm text-gray-600">Ubicación</span>
									<p className="font-medium text-gray-900">{customization.location}</p>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<CalendarIcon className="h-5 w-5 text-gray-400" />
								<div>
									<span className="text-sm text-gray-600">Fechas</span>
									<p className="font-medium text-gray-900">
										{formatDate(customization.startDate)} - {formatDate(customization.endDate)}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<UserGroupIcon className="h-5 w-5 text-gray-400" />
								<div>
									<span className="text-sm text-gray-600">Equipo</span>
									<p className="font-medium text-gray-900">
										{customization.teamSize} miembro{customization.teamSize !== 1 ? 's' : ''}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<div className="h-5 w-5 flex items-center justify-center">
									<div className="w-3 h-3 bg-primary-400 rounded-full"></div>
								</div>
								<div>
									<span className="text-sm text-gray-600">Prioridad</span>
									<div className="mt-1">
										<span className={`px-2 py-1 rounded-lg text-sm font-medium border ${getPriorityColor(customization.priority)}`}>
											{getPriorityText(customization.priority)}
										</span>
									</div>
								</div>
							</div>
						</div>
					</SectionCard>

					{/* Plantilla base */}
					<SectionCard 
						title="Plantilla Base" 
						icon={<template.icon className="h-5 w-5 text-primary-600" />}
						delay="0.3s"
					>
						<div className="space-y-4">
							<div>
								<h4 className="font-medium text-gray-900 mb-2">{template.name}</h4>
								<p className="text-sm text-gray-600">{template.description}</p>
							</div>
							<div className="grid grid-cols-2 gap-4 text-sm">
								<div>
									<span className="text-gray-600">Categoría</span>
									<p className="font-medium text-gray-900 capitalize">{template.category}</p>
								</div>
								<div>
									<span className="text-gray-600">Complejidad</span>
									<p className="font-medium text-gray-900 capitalize">{template.complexity}</p>
								</div>
							</div>
							<div>
								<span className="text-sm text-gray-600">Características incluidas</span>
								<div className="mt-2 flex flex-wrap gap-1">
									{template.features.slice(0, 3).map((feature, index) => (
										<span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
											{feature}
										</span>
									))}
									{template.features.length > 3 && (
										<span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
											+{template.features.length - 3} más
										</span>
									)}
								</div>
							</div>
						</div>
					</SectionCard>
				</div>

				{/* Configuraciones detalladas */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
					{/* Fases */}
					<SectionCard 
						title={`Fases del Proyecto (${customization.selectedPhases.length})`}
						icon={<CogIcon className="h-5 w-5 text-purple-600" />}
						delay="0.4s"
					>
						<TagList 
							items={customization.selectedPhases} 
							emptyMessage="No se han seleccionado fases" 
						/>
					</SectionCard>

					{/* Materiales */}
					<SectionCard 
						title={`Materiales (${customization.selectedMaterials.length})`}
						icon={<BuildingOffice2Icon className="h-5 w-5 text-orange-600" />}
						delay="0.5s"
					>
						<TagList 
							items={customization.selectedMaterials} 
							emptyMessage="No se han seleccionado materiales" 
						/>
					</SectionCard>

					{/* Fórmulas */}
					<SectionCard 
						title={`Fórmulas y Cálculos (${customization.selectedFormulas.length})`}
						icon={<BeakerIcon className="h-5 w-5 text-indigo-600" />}
						delay="0.6s"
					>
						<TagList 
							items={customization.selectedFormulas} 
							emptyMessage="No se han seleccionado fórmulas" 
						/>
					</SectionCard>

					{/* Roles del equipo */}
					<SectionCard 
						title={`Roles del Equipo (${customization.selectedTeamRoles.length})`}
						icon={<UserIcon className="h-5 w-5 text-cyan-600" />}
						delay="0.7s"
					>
						<TagList 
							items={customization.selectedTeamRoles} 
							emptyMessage="No se han seleccionado roles" 
						/>
					</SectionCard>
				</div>

				{/* Características adicionales */}
				{customization.additionalFeatures.length > 0 && (
					<SectionCard 
						title={`Características Adicionales (${customization.additionalFeatures.length})`}
						icon={<PlusIcon className="h-5 w-5 text-pink-600" />}
						delay="0.8s"
					>
						<TagList 
							items={customization.additionalFeatures} 
							emptyMessage="No hay características adicionales" 
						/>
					</SectionCard>
				)}

				{/* Botones de acción */}
				<div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 animate-fade-in" style={{animationDelay: '0.9s'}}>
					<button
						onClick={onBack}
						className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200"
					>
						<PencilIcon className="h-4 w-4" />
						Editar Configuración
					</button>
					<button
						onClick={onCreateProject}
						className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-700 hover:to-secondary-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
					>
						<RocketLaunchIcon className="h-5 w-5" />
						<span className="font-medium">Crear Proyecto</span>
					</button>
				</div>

				{/* Información adicional */}
				<div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-2xl animate-fade-in" style={{animationDelay: '1s'}}>
					<div className="flex items-start gap-3">
						<div className="flex-shrink-0">
							<div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
								<CheckCircleIcon className="h-5 w-5 text-blue-600" />
							</div>
						</div>
						<div>
							<h4 className="text-sm font-medium text-blue-900 mb-1">
								¿Qué sucede después?
							</h4>
							<p className="text-sm text-blue-700">
								Una vez creado, podrás gestionar todas las fases del proyecto, asignar tareas al equipo, 
								realizar cálculos técnicos, y hacer seguimiento del progreso en tiempo real.
							</p>
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

				.animate-fade-in {
					animation: fadeIn 0.6s ease-out forwards;
					opacity: 0;
				}

				/* Hover effects */
				.hover\\:scale-105:hover {
					transform: scale(1.05);
				}
			`}</style>
		</div>
	);
};

export default ProjectPreview;