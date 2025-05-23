import React from "react";
import {
	ClockIcon,
	StarIcon,
	CheckBadgeIcon,
	BookOpenIcon,
	UserGroupIcon,
	CalculatorIcon,
	EyeIcon,
	FireIcon,
	HeartIcon,
	ArrowTrendingUpIcon
} from "@heroicons/react/24/outline";
import {
	HeartIcon as HeartSolidIcon,
} from "@heroicons/react/24/solid";
import type {CalculationTemplate} from "../../shared/types/template.types";

interface TemplateCardProps {
	template: CalculationTemplate;
	onSelect: () => void;
	onPreview?: () => void;
	onToggleFavorite: () => void;
	animationDelay?: number;
	showPreviewButton?: boolean;
	compact?: boolean;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
	template,
	onSelect,
	onPreview,
	onToggleFavorite,
	animationDelay = 0,
	showPreviewButton = true,
	compact = false,
}) => {
	const getDifficultyConfig = (difficulty: string) => {
		switch (difficulty) {
			case "basic":
				return {
					color: "bg-green-100 text-green-700 border-green-200",
					label: "Básico",
				};
			case "intermediate":
				return {
					color: "bg-yellow-100 text-yellow-700 border-yellow-200",
					label: "Intermedio",
				};
			case "advanced":
				return {
					color: "bg-red-100 text-red-700 border-red-200",
					label: "Avanzado",
				};
			default:
				return {
					color: "bg-gray-100 text-gray-700 border-gray-200",
					label: difficulty,
				};
		}
	};

	const getTrendingIcon = () => {
		if (template.trending) {
			return <ArrowTrendingUpIcon className="h-4 w-4 text-orange-500" />;
		}
		if (template.popular) {
			return <FireIcon className="h-4 w-4 text-red-500" />;
		}
		return null;
	};

	const difficultyConfig = getDifficultyConfig(template.difficulty);

	return (
		<div
			className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden animate-fade-in"
			style={{animationDelay: `${animationDelay}s`}}
		>
			{/* Header con gradiente y patrones */}
			<div
				className={`h-32 bg-gradient-to-r ${template.color} relative overflow-hidden`}
			>
				{/* Patrón arquitectónico */}
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

				{/* Indicadores superiores */}
				<div className="absolute top-4 left-4 flex items-center gap-2">
					{template.verified && (
						<div className="p-1.5 bg-white/20 backdrop-blur-sm rounded-full">
							<CheckBadgeIcon className="h-4 w-4 text-white" />
						</div>
					)}
					{template.isNew && (
						<span className="px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
							NUEVO
						</span>
					)}
					{getTrendingIcon() && (
						<div className="p-1.5 bg-white/20 backdrop-blur-sm rounded-full">
							{getTrendingIcon()}
						</div>
					)}
				</div>

				{/* Botón de favorito */}
				<button
					onClick={(e) => {
						e.stopPropagation();
						onToggleFavorite();
					}}
					className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-200 transform hover:scale-110"
				>
					{template.isFavorite ? (
						<HeartSolidIcon className="h-4 w-4 text-red-400" />
					) : (
						<HeartIcon className="h-4 w-4 text-white" />
					)}
				</button>

				{/* Badge de dificultad */}
				<div className="absolute bottom-4 left-4">
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium border ${difficultyConfig.color}`}
					>
						{difficultyConfig.label}
					</span>
				</div>
			</div>

			{/* Contenido principal */}
			<div className={`p-6 ${compact ? "p-4" : ""}`}>
				{/* Título y descripción */}
				<div className="mb-4">
					<h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-200 line-clamp-1">
						{template.name}
					</h3>
					<p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
						{template.description}
					</p>
				</div>

				{/* Metadata */}
				<div className="grid grid-cols-2 gap-3 mb-4 text-xs text-gray-500">
					<div className="flex items-center gap-1">
						<BookOpenIcon className="h-3 w-3 text-primary-600" />
						<span className="truncate">{template.necReference}</span>
					</div>
					<div className="flex items-center gap-1">
						<ClockIcon className="h-3 w-3 text-green-600" />
						<span>{template.estimatedTime}</span>
					</div>
					<div className="flex items-center gap-1">
						<StarIcon className="h-3 w-3 text-yellow-500" />
						<span>
							{template.rating} ({template.usageCount})
						</span>
					</div>
					<div className="flex items-center gap-1">
						<UserGroupIcon className="h-3 w-3 text-gray-500" />
						<span>{template.profession.length} esp.</span>
					</div>
				</div>

				{/* Requerimientos principales */}
				{!compact && (
					<div className="mb-4">
						<p className="text-xs font-medium text-gray-700 mb-2">
							Datos requeridos:
						</p>
						<div className="flex flex-wrap gap-1">
							{template.requirements.slice(0, 2).map((req, idx) => (
								<span
									key={idx}
									className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md truncate max-w-[120px]"
									title={req}
								>
									{req}
								</span>
							))}
							{template.requirements.length > 2 && (
								<span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md">
									+{template.requirements.length - 2}
								</span>
							)}
						</div>
					</div>
				)}

				{/* Tags */}
				<div className="mb-6">
					<div className="flex flex-wrap gap-1">
						{template.tags.slice(0, 3).map((tag, idx) => (
							<span
								key={idx}
								className="px-2 py-1 bg-primary-50 text-primary-600 text-xs rounded-md font-medium"
							>
								#{tag}
							</span>
						))}
						{template.tags.length > 3 && (
							<span className="px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded-md">
								+{template.tags.length - 3}
							</span>
						)}
					</div>
				</div>

				{/* Botones de acción */}
				<div className="space-y-2">
					{/* Botón principal */}
					<button
						onClick={onSelect}
						className="w-full bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-700 hover:to-secondary-600 text-white py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2 font-medium"
					>
						<CalculatorIcon className="h-4 w-4" />
						<span>Usar Plantilla</span>
					</button>

					{/* Botón de vista previa */}
					{showPreviewButton && onPreview && (
						<button
							onClick={(e) => {
								e.stopPropagation();
								onPreview();
							}}
							className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
						>
							<EyeIcon className="h-4 w-4" />
							<span>Vista Previa</span>
						</button>
					)}
				</div>
			</div>

			{/* Efecto de hover */}
			<div className="absolute inset-0 bg-gradient-to-r from-primary-600/5 to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

			{/* Sombra proyectada elegante */}
			<div
				className={`absolute inset-0 bg-gradient-to-r ${template.color} rounded-2xl -z-10 blur-xl opacity-0 group-hover:opacity-20 transition-all duration-500 transform group-hover:scale-110`}
			/>
		</div>
	);
};
