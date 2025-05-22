import React, { useState } from "react";
import type { ProjectTemplate } from "./ProjectTemplatesPage";
import {
	ClockIcon,
	StarIcon,
	ChevronRightIcon,
	AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";

interface TemplateSelectorProps {
	templates: ProjectTemplate[];
	onTemplateSelect: (template: ProjectTemplate) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
	templates,
	onTemplateSelect,
}) => {
	const [selectedCategory, setSelectedCategory] = useState<string>("all");
	const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);
	const [favorites, setFavorites] = useState<Set<string>>(new Set());

	const categories = [
		{ id: "all", name: "Todos", count: templates.length },
		{
			id: "residential",
			name: "Residencial",
			count: templates.filter((t) => t.category === "residential").length,
		},
		{
			id: "commercial",
			name: "Comercial",
			count: templates.filter((t) => t.category === "commercial").length,
		},
		{
			id: "industrial",
			name: "Industrial",
			count: templates.filter((t) => t.category === "industrial").length,
		},
		{
			id: "infrastructure",
			name: "Infraestructura",
			count: templates.filter((t) => t.category === "infrastructure").length,
		},
	];

	const filteredTemplates = templates.filter(
		(template) =>
			selectedCategory === "all" || template.category === selectedCategory
	);

	const toggleFavorite = (templateId: string, e: React.MouseEvent) => {
		e.stopPropagation();
		const newFavorites = new Set(favorites);
		if (newFavorites.has(templateId)) {
			newFavorites.delete(templateId);
		} else {
			newFavorites.add(templateId);
		}
		setFavorites(newFavorites);
	};

	const getComplexityColor = (complexity: string) => {
		switch (complexity) {
			case "basic":
				return "bg-green-100 text-green-700 border-green-200";
			case "intermediate":
				return "bg-yellow-100 text-yellow-700 border-yellow-200";
			case "advanced":
				return "bg-red-100 text-red-700 border-red-200";
			default:
				return "bg-gray-100 text-gray-700 border-gray-200";
		}
	};

	const getComplexityText = (complexity: string) => {
		switch (complexity) {
			case "basic":
				return "Básico";
			case "intermediate":
				return "Intermedio";
			case "advanced":
				return "Avanzado";
			default:
				return complexity;
		}
	};

	return (
		<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
			{/* Filtros de categoría */}
			<div className="mb-8">
				<div className="flex items-center gap-2 mb-4">
					<AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-500" />
					<span className="text-sm font-medium text-gray-700">Categorías</span>
				</div>
				<div className="flex flex-wrap gap-3">
					{categories.map((category) => (
						<button
							key={category.id}
							onClick={() => setSelectedCategory(category.id)}
							className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
								selectedCategory === category.id
									? "bg-primary-600 text-white border-primary-600 shadow-lg scale-105"
									: "bg-white text-gray-700 border-gray-200 hover:border-primary-300 hover:bg-primary-50"
							}`}
						>
							{category.name}
							<span
								className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
									selectedCategory === category.id
										? "bg-white/20 text-white"
										: "bg-gray-100 text-gray-600"
								}`}
							>
								{category.count}
							</span>
						</button>
					))}
				</div>
			</div>

			{/* Grid de plantillas */}
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
				{filteredTemplates.map((template, index) => (
					<div
						key={template.id}
						className="group relative animate-fade-in cursor-pointer"
						style={{ animationDelay: `${index * 0.1}s` }}
						onMouseEnter={() => setHoveredTemplate(template.id)}
						onMouseLeave={() => setHoveredTemplate(null)}
						onClick={() => onTemplateSelect(template)}
					>
						{/* Tarjeta principal */}
						<div
							className={`relative bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
								hoveredTemplate === template.id ? "scale-102" : ""
							}`}
						>
							{/* Header con gradiente */}
							<div className={`h-32 bg-gradient-to-r ${template.color} relative overflow-hidden`}>
								{/* Patrón arquitectónico sutil */}
								<div className="absolute inset-0 opacity-20">
									<svg
										className="w-full h-full"
										viewBox="0 0 100 100"
										preserveAspectRatio="none"
									>
										<defs>
											<pattern
												id={`pattern-${template.id}`}
												x="0"
												y="0"
												width="20"
												height="20"
												patternUnits="userSpaceOnUse"
											>
												<path
													d="M 20 0 L 0 0 0 20"
													fill="none"
													stroke="white"
													strokeWidth="0.5"
												/>
											</pattern>
										</defs>
										<rect
											width="100"
											height="100"
											fill={`url(#pattern-${template.id})`}
										/>
									</svg>
								</div>

								{/* Icono principal */}
								<div className="absolute inset-0 flex items-center justify-center">
									<div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
										<template.icon className="h-8 w-8 text-white" />
									</div>
								</div>

								{/* Botón de favorito */}
								<button
									onClick={(e) => toggleFavorite(template.id, e)}
									className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors duration-200"
								>
									{favorites.has(template.id) ? (
										<StarSolidIcon className="h-4 w-4 text-yellow-300" />
									) : (
										<StarIcon className="h-4 w-4 text-white" />
									)}
								</button>

								{/* Badge de complejidad */}
								<div className="absolute bottom-4 left-4">
									<span
										className={`px-2 py-1 rounded-full text-xs font-medium border ${getComplexityColor(template.complexity)}`}
									>
										{getComplexityText(template.complexity)}
									</span>
								</div>
							</div>

							{/* Contenido */}
							<div className="p-6">
								<div className="mb-4">
									<h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">
										{template.name}
									</h3>
									<p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
										{template.description}
									</p>
								</div>

								{/* Información adicional */}
								<div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
									<div className="flex items-center gap-1">
										<ClockIcon className="h-4 w-4" />
										<span>{template.estimatedDuration}</span>
									</div>
									<div className="w-1 h-1 bg-gray-300 rounded-full"></div>
									<div className="flex items-center gap-1">
										<span>{template.features.length} características</span>
									</div>
								</div>

								{/* Características principales */}
								<div className="space-y-2 mb-6">
									{template.features.slice(0, 3).map((feature, idx) => (
										<div
											key={idx}
											className="flex items-center text-sm text-gray-600"
										>
											<div className="w-1.5 h-1.5 bg-primary-400 rounded-full mr-2"></div>
											{feature}
										</div>
									))}
									{template.features.length > 3 && (
										<div className="text-xs text-gray-500 pl-3.5">
											+{template.features.length - 3} más características
										</div>
									)}
								</div>

								{/* Botón de acción */}
								<button
									className="w-full bg-gray-50 hover:bg-primary-50 text-gray-700 hover:text-primary-700 py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group/btn border border-gray-200 hover:border-primary-200"
									onClick={() => onTemplateSelect(template)}
								>
									<span className="font-medium">Usar esta plantilla</span>
									<ChevronRightIcon className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
								</button>
							</div>

							{/* Efecto de hover */}
							<div
								className={`absolute inset-0 bg-gradient-to-r from-primary-600/5 to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
							></div>
						</div>

						{/* Sombra proyectada elegante */}
						<div
							className={`absolute inset-0 bg-gradient-to-r ${template.color} rounded-2xl -z-10 blur-xl opacity-0 group-hover:opacity-20 transition-all duration-500 transform group-hover:scale-110`}
						></div>
					</div>
				))}
			</div>

			{/* Estado vacío */}
			{filteredTemplates.length === 0 && (
				<div className="text-center py-16">
					<div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<AdjustmentsHorizontalIcon className="h-12 w-12 text-gray-400" />
					</div>
					<h3 className="text-lg font-medium text-gray-900 mb-2">
						No hay plantillas disponibles
					</h3>
					<p className="text-gray-600 mb-6">
						No encontramos plantillas para esta categoría.
					</p>
					<button
						onClick={() => setSelectedCategory("all")}
						className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
					>
						Ver todas las plantillas
					</button>
				</div>
			)}

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

				.scale-102 {
					transform: scale(1.02);
				}

				.line-clamp-2 {
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					overflow: hidden;
				}

				/* Hover effects */
				.group:hover .group-hover\\:scale-110 {
					transform: scale(1.1);
				}

				.group:hover .group-hover\\:translate-x-1 {
					transform: translateX(0.25rem);
				}

				/* Smooth transitions */
				* {
					transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
					transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
				}
			`}</style>
		</div>
	);
};

export default TemplateSelector;