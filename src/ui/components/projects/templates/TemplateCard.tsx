// src/ui/components/templates/TemplateCard.tsx
import React from "react";
import type { ProjectTemplate } from "../../../pages/projects/templates/ProjectTemplatesPage";
import { ClockIcon, StarIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";

interface TemplateCardProps {
	template: ProjectTemplate;
	isHovered: boolean;
	isFavorite: boolean;
	onHover: (id: string | null) => void;
	onFavoriteToggle: (id: string, e: React.MouseEvent) => void;
	onSelect: (template: ProjectTemplate) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
	template,
	isHovered,
	isFavorite,
	onHover,
	onFavoriteToggle,
	onSelect,
}) => {
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

	return (
		<div
			className="group relative cursor-pointer"
			onMouseEnter={() => onHover(template.id)}
			onMouseLeave={() => onHover(null)}
			onClick={() => onSelect(template)}
		>
			{/* Tarjeta principal */}
			<div
				className={`relative bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
					isHovered ? "scale-102" : ""
				}`}
			>
				{/* Header con gradiente */}
				<div className={`h-32 bg-gradient-to-r ${template.color} relative overflow-hidden`}>
					{/* Patrón arquitectónico */}
					<div className="absolute inset-0 opacity-20">
						<svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
							<defs>
								<pattern
									id={`pattern-${template.id}`}
									x="0" y="0" width="20" height="20"
									patternUnits="userSpaceOnUse"
								>
									<path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" />
								</pattern>
							</defs>
							<rect width="100" height="100" fill={`url(#pattern-${template.id})`} />
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
						onClick={(e) => onFavoriteToggle(template.id, e)}
						className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors duration-200"
					>
						{isFavorite ? (
							<StarSolidIcon className="h-4 w-4 text-yellow-300" />
						) : (
							<StarIcon className="h-4 w-4 text-white" />
						)}
					</button>

					{/* Badge de complejidad */}
					<div className="absolute bottom-4 left-4">
						<span className={`px-2 py-1 rounded-full text-xs font-medium border ${getComplexityColor(template.complexity)}`}>
							{template.complexity}
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

					{/* Características */}
					<div className="space-y-2 mb-6">
						{template.features.slice(0, 3).map((feature, idx) => (
							<div key={idx} className="flex items-center text-sm text-gray-600">
								<div className="w-1.5 h-1.5 bg-primary-400 rounded-full mr-2"></div>
								{feature}
							</div>
						))}
					</div>

					{/* Botón de acción */}
					<button className="w-full bg-gray-50 hover:bg-primary-50 text-gray-700 hover:text-primary-700 py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group/btn border border-gray-200 hover:border-primary-200">
						<span className="font-medium">Usar esta plantilla</span>
					</button>
				</div>
			</div>

			{/* Sombra proyectada */}
			<div className={`absolute inset-0 bg-gradient-to-r ${template.color} rounded-2xl -z-10 blur-xl opacity-0 group-hover:opacity-20 transition-all duration-500 transform group-hover:scale-110`}></div>
		</div>
	);
};
