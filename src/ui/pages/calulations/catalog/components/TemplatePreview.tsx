import React, {useEffect} from "react";
import {
	XMarkIcon,
	CheckBadgeIcon,
	BookOpenIcon,
	StarIcon,
	ClockIcon,
	UserGroupIcon,
	TagIcon,
	ExclamationCircleIcon,
	CheckIcon,
	CalculatorIcon,
	HeartIcon,
	ShareIcon,
	DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import {HeartIcon as HeartSolidIcon} from "@heroicons/react/24/solid";
import type {CalculationTemplate} from "../../shared/types/template.types";

interface TemplatePreviewProps {
	template: CalculationTemplate;
	onClose: () => void;
	onSelect: () => void;
	onToggleFavorite?: () => void;
	onShare?: () => void;
	onDuplicate?: () => void;
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({
	template,
	onClose,
	onSelect,
	onToggleFavorite,
	onShare,
	onDuplicate,
}) => {
	// Cerrar con ESC
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose();
			}
		};

		document.addEventListener("keydown", handleEscape);
		return () => document.removeEventListener("keydown", handleEscape);
	}, [onClose]);

	// Prevenir scroll del body
	useEffect(() => {
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = "unset";
		};
	}, []);

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

	const difficultyConfig = getDifficultyConfig(template.difficulty);

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-2xl max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
				{/* Header */}
				<div
					className={`relative h-48 bg-gradient-to-r ${template.color} overflow-hidden`}
				>
					{/* Patrón de fondo */}
					<div className="absolute inset-0 opacity-20">
						<svg
							className="w-full h-full"
							viewBox="0 0 100 100"
							preserveAspectRatio="none"
						>
							<defs>
								<pattern
									id={`pattern-preview-${template.id}`}
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
								fill={`url(#pattern-preview-${template.id})`}
							/>
						</svg>
					</div>

					{/* Botón cerrar */}
					<button
						onClick={onClose}
						className="absolute top-6 right-6 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors duration-200"
					>
						<XMarkIcon className="h-5 w-5 text-white" />
					</button>

					{/* Indicadores superiores */}
					<div className="absolute top-6 left-6 flex items-center gap-2">
						{template.verified && (
							<div className="flex items-center gap-1 px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full">
								<CheckBadgeIcon className="h-4 w-4 text-white" />
								<span className="text-white text-xs font-medium">
									Verificada
								</span>
							</div>
						)}
						{template.isNew && (
							<span className="px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
								NUEVO
							</span>
						)}
					</div>

					{/* Icono y título principal */}
					<div className="absolute inset-0 flex flex-col justify-center items-center text-white">
						<div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4">
							<template.icon className="h-10 w-10" />
						</div>
						<h1 className="text-2xl font-bold text-center px-4">
							{template.name}
						</h1>
					</div>

					{/* Badge de dificultad */}
					<div className="absolute bottom-6 left-6">
						<span
							className={`px-3 py-1 rounded-full text-sm font-medium border ${difficultyConfig.color}`}
						>
							{difficultyConfig.label}
						</span>
					</div>
				</div>

				{/* Contenido */}
				<div className="p-8">
					{/* Descripción */}
					<div className="mb-6">
						<p className="text-gray-700 text-lg leading-relaxed">
							{template.description}
						</p>
					</div>

					{/* Metadatos principales */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
						<div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
							<BookOpenIcon className="h-5 w-5 text-primary-600" />
							<div>
								<div className="text-xs text-gray-500">Referencia NEC</div>
								<div className="text-sm font-medium text-gray-900">
									{template.necReference}
								</div>
							</div>
						</div>

						<div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
							<StarIcon className="h-5 w-5 text-yellow-500" />
							<div>
								<div className="text-xs text-gray-500">Calificación</div>
								<div className="text-sm font-medium text-gray-900">
									{template.rating}/5 ({template.usageCount} usos)
								</div>
							</div>
						</div>

						<div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
							<ClockIcon className="h-5 w-5 text-green-600" />
							<div>
								<div className="text-xs text-gray-500">Tiempo estimado</div>
								<div className="text-sm font-medium text-gray-900">
									{template.estimatedTime}
								</div>
							</div>
						</div>

						<div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
							<UserGroupIcon className="h-5 w-5 text-gray-500" />
							<div>
								<div className="text-xs text-gray-500">Especialidades</div>
								<div className="text-sm font-medium text-gray-900">
									{template.profession.length} área
									{template.profession.length > 1 ? "s" : ""}
								</div>
							</div>
						</div>
					</div>

					{/* Profesiones objetivo */}
					<div className="mb-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
							<UserGroupIcon className="h-5 w-5 text-primary-600" />
							Dirigido a:
						</h3>
						<div className="flex flex-wrap gap-2">
							{template.profession.map((prof, index) => (
								<span
									key={index}
									className="px-3 py-1 bg-primary-100 text-primary-700 rounded-lg text-sm font-medium"
								>
									{prof}
								</span>
							))}
						</div>
					</div>

					{/* Tags */}
					<div className="mb-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
							<TagIcon className="h-5 w-5 text-primary-600" />
							Etiquetas:
						</h3>
						<div className="flex flex-wrap gap-2">
							{template.tags.map((tag, index) => (
								<span
									key={index}
									className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm"
								>
									#{tag}
								</span>
							))}
						</div>
					</div>

					{/* Requerimientos */}
					<div className="mb-8">
						<h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
							<ExclamationCircleIcon className="h-5 w-5 text-orange-600" />
							Datos Requeridos:
						</h3>
						<div className="bg-orange-50 rounded-lg p-4">
							<ul className="space-y-2">
								{template.requirements.map((req, index) => (
									<li
										key={index}
										className="flex items-start gap-2 text-orange-800"
									>
										<CheckIcon className="h-4 w-4 mt-0.5 text-orange-600 flex-shrink-0" />
										<span className="text-sm">{req}</span>
									</li>
								))}
							</ul>
						</div>
					</div>

					{/* Parámetros de entrada */}
					{template.parameters && template.parameters.length > 0 && (
						<div className="mb-8">
							<h3 className="text-lg font-semibold text-gray-900 mb-3">
								Parámetros de Cálculo:
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{template.parameters.slice(0, 6).map((param, index) => (
									<div
										key={index}
										className="border border-gray-200 rounded-lg p-4"
									>
										<div className="flex items-center justify-between mb-2">
											<span className="font-medium text-gray-900">
												{param.label}
											</span>
											{param.required && (
												<span className="text-red-500 text-xs">Requerido</span>
											)}
										</div>
										<div className="text-sm text-gray-600">
											Tipo:{" "}
											{param.type === "number"
												? "Numérico"
												: param.type === "select"
													? "Selección"
													: "Texto"}
											{param.unit && ` (${param.unit})`}
										</div>
										{param.tooltip && (
											<div className="text-xs text-gray-500 mt-1">
												{param.tooltip}
											</div>
										)}
									</div>
								))}
								{template.parameters.length > 6 && (
									<div className="col-span-full text-center text-gray-500 text-sm">
										+{template.parameters.length - 6} parámetros más...
									</div>
								)}
							</div>
						</div>
					)}

					{/* Información adicional */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
						{/* Última actualización */}
						<div className="p-4 bg-blue-50 rounded-lg">
							<h4 className="text-sm font-semibold text-blue-900 mb-2">
								Información de Versión
							</h4>
							<div className="text-sm text-blue-800">
								<div>Última actualización: {template.lastUpdated}</div>
								{template.createdBy && (
									<div>Creado por: {template.createdBy}</div>
								)}
								{template.isPublic && (
									<div className="mt-1">
										<span className="px-2 py-0.5 bg-blue-200 text-blue-800 rounded text-xs">
											Plantilla Pública
										</span>
									</div>
								)}
							</div>
						</div>

						{/* Estadísticas de uso */}
						<div className="p-4 bg-green-50 rounded-lg">
							<h4 className="text-sm font-semibold text-green-900 mb-2">
								Estadísticas de Uso
							</h4>
							<div className="text-sm text-green-800 space-y-1">
								<div>Cálculos realizados: {template.usageCount}</div>
								<div>Calificación promedio: {template.rating}/5</div>
								{template.trending && (
									<div className="mt-1">
										<span className="px-2 py-0.5 bg-orange-200 text-orange-800 rounded text-xs">
											En Tendencia
										</span>
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Botones de acción */}
					<div className="flex flex-col sm:flex-row gap-4">
						{/* Botón principal */}
						<button
							onClick={onSelect}
							className="flex-1 bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-700 hover:to-secondary-600 text-white py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2 font-medium text-lg"
						>
							<CalculatorIcon className="h-5 w-5" />
							<span>Usar esta Plantilla</span>
						</button>

						{/* Botones secundarios */}
						<div className="flex gap-2">
							{onToggleFavorite && (
								<button
									onClick={onToggleFavorite}
									className="p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
									title={
										template.isFavorite
											? "Quitar de favoritos"
											: "Agregar a favoritos"
									}
								>
									{template.isFavorite ? (
										<HeartSolidIcon className="h-5 w-5 text-red-500" />
									) : (
										<HeartIcon className="h-5 w-5 text-gray-500" />
									)}
								</button>
							)}

							{onShare && (
								<button
									onClick={onShare}
									className="p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
									title="Compartir plantilla"
								>
									<ShareIcon className="h-5 w-5 text-gray-500" />
								</button>
							)}

							{onDuplicate && (
								<button
									onClick={onDuplicate}
									className="p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
									title="Duplicar plantilla"
								>
									<DocumentDuplicateIcon className="h-5 w-5 text-gray-500" />
								</button>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
