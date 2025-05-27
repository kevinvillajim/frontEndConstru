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
	ArrowTrendingUpIcon,
	BoltIcon,
	BuildingOffice2Icon,
	AcademicCapIcon,
	BeakerIcon,
	WrenchScrewdriverIcon,
	CubeIcon,
	Squares2X2Icon,
} from "@heroicons/react/24/outline";
import {HeartIcon as HeartSolidIcon} from "@heroicons/react/24/solid";
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

// Helper para asegurar que un valor sea un número válido
const ensureNumber = (value: unknown, defaultValue: number = 0): number => {
	if (typeof value === "number" && !isNaN(value)) {
		return value;
	}
	if (typeof value === "string") {
		const parsed = parseFloat(value);
		return !isNaN(parsed) ? parsed : defaultValue;
	}
	return defaultValue;
};

// Helper para asegurar que un valor sea un float con 2 decimales
const ensureFloat = (value: unknown, defaultValue: number = 0): number => {
	const numValue = ensureNumber(value, defaultValue);
	return parseFloat(numValue.toFixed(2));
};

// Helper para formatear rating de manera segura
const formatRating = (rating: unknown): string => {
	const numRating = ensureFloat(rating, 0.0);
	return numRating.toFixed(2);
};

// Mapeo de categorías a iconos
const getCategoryIcon = (category: string, type?: string) => {
	switch (category?.toLowerCase() || type?.toLowerCase()) {
		case "structural":
		case "foundation":
			return BuildingOffice2Icon;
		case "electrical":
		case "installation":
			return BoltIcon;
		case "architectural":
			return AcademicCapIcon;
		case "hydraulic":
		case "plumbing":
			return BeakerIcon;
		case "mechanical":
			return WrenchScrewdriverIcon;
		case "geotechnical":
			return CubeIcon;
		case "material_calculation":
			return Squares2X2Icon;
		default:
			return CalculatorIcon;
	}
};

export const TemplateCard: React.FC<TemplateCardProps> = ({
	template,
	onSelect,
	onPreview,
	onToggleFavorite,
	animationDelay = 0,
	showPreviewButton = true,
	compact = false,
}) => {
	// --- DEBUG LOGS ---
	console.log("TemplateCard received template ID:", template.id);
	console.log(
		"typeof template.averageRating:",
		typeof template.averageRating,
		"| value:",
		template.averageRating
	);
	console.log(
		"typeof template.rating (compatibility field):",
		typeof template.rating,
		"| value:",
		template.rating
	);

	// --- END DEBUG LOGS ---

	// Normalizar datos del template para evitar errores
	const normalizedTemplate = {
		...template,
		// Usar averageRating como fuente principal, con fallback a rating - CONVERTIR A FLOAT
		rating: ensureFloat(template.averageRating || template.rating, 0.0),
		usageCount: ensureNumber(template.usageCount, 0),
		verified: Boolean(template.verified || template.isVerified),
		necReference: template.necReference || "",
		profession: template.targetProfession || "",
		estimatedTime: template.estimatedTime || "10-15 min",
		requirements: template.requirements || [],
		tags: template.tags || [],
		isFavorite: Boolean(template.isFavorite),
		isNew: Boolean(template.isNew),
		trending: Boolean(template.trending),
		popular: Boolean(template.popular),
		category: template.category,
		type: template.type,
		difficulty: template.difficulty || "intermediate",
		icon: template.icon,
		color: template.color,
	};

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
					label: difficulty || "General",
				};
		}
	};

	const getTrendingIcon = () => {
		if (normalizedTemplate.trending) {
			return <ArrowTrendingUpIcon className="h-4 w-4 text-orange-500" />;
		}
		if (normalizedTemplate.popular || normalizedTemplate.usageCount > 100) {
			return <FireIcon className="h-4 w-4 text-red-500" />;
		}
		return null;
	};

	const difficultyConfig = getDifficultyConfig(normalizedTemplate.difficulty);

	// Obtener el icono correcto basado en la categoría/tipo
	const IconComponent =
		normalizedTemplate.icon ||
		getCategoryIcon(
			normalizedTemplate.category || "",
			normalizedTemplate.type || ""
		);

	// Color de gradiente basado en categoría
	const getGradientColor = (category: string) => {
		switch (category?.toLowerCase()) {
			case "structural":
			case "foundation":
				return "from-blue-600 to-blue-500";
			case "electrical":
			case "installation":
				return "from-yellow-600 to-yellow-500";
			case "architectural":
				return "from-green-600 to-green-500";
			case "hydraulic":
			case "plumbing":
				return "from-cyan-600 to-cyan-500";
			case "mechanical":
				return "from-purple-600 to-purple-500";
			case "geotechnical":
				return "from-stone-600 to-stone-500";
			default:
				return normalizedTemplate.color || "from-primary-600 to-secondary-500";
		}
	};

	return (
		<div
			className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden animate-fade-in"
			style={{animationDelay: `${animationDelay}s`}}
		>
			{/* Header con gradiente y patrones */}
			<div
				className={`h-32 bg-gradient-to-r ${getGradientColor(normalizedTemplate.category || "")} relative overflow-hidden`}
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
								id={`pattern-${normalizedTemplate.id}`}
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
							fill={`url(#pattern-${normalizedTemplate.id})`}
						/>
					</svg>
				</div>

				{/* Icono principal */}
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
						{IconComponent && <IconComponent className="h-8 w-8 text-white" />}
					</div>
				</div>

				{/* Indicadores superiores */}
				<div className="absolute top-4 left-4 flex items-center gap-2">
					{normalizedTemplate.verified && (
						<div className="p-1.5 bg-white/20 backdrop-blur-sm rounded-full">
							<CheckBadgeIcon className="h-4 w-4 text-white" />
						</div>
					)}
					{normalizedTemplate.isNew && (
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
					{normalizedTemplate.isFavorite ? (
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
						{normalizedTemplate.name}
					</h3>
					<p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
						{normalizedTemplate.description}
					</p>
				</div>

				{/* Metadata */}
				<div className="grid grid-cols-2 gap-3 mb-4 text-xs text-gray-500">
					<div className="flex items-center gap-1">
						<BookOpenIcon className="h-3 w-3 text-primary-600" />
						<span className="truncate">{normalizedTemplate.necReference}</span>
					</div>
					<div className="flex items-center gap-1">
						<ClockIcon className="h-3 w-3 text-green-600" />
						<span>{normalizedTemplate.estimatedTime}</span>
					</div>
					<div className="flex items-center gap-1">
						<StarIcon className="h-3 w-3 text-yellow-500" />
						<span>
							{formatRating(normalizedTemplate.rating)} (
							{normalizedTemplate.usageCount})
						</span>
					</div>
					<div className="flex items-center gap-1">
						<UserGroupIcon className="h-3 w-3 text-gray-500" />
						<span>{normalizedTemplate.profession?.length || 0} esp.</span>
					</div>
				</div>

				{/* Requerimientos principales - Solo mostrar si existen */}
				{!compact &&
					normalizedTemplate.requirements &&
					normalizedTemplate.requirements.length > 0 && (
						<div className="mb-4">
							<p className="text-xs font-medium text-gray-700 mb-2">
								Datos requeridos:
							</p>
							<div className="flex flex-wrap gap-1">
								{normalizedTemplate.requirements.slice(0, 2).map((req, idx) => (
									<span
										key={idx}
										className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md truncate max-w-[120px]"
										title={req}
									>
										{req}
									</span>
								))}
								{normalizedTemplate.requirements.length > 2 && (
									<span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md">
										+{normalizedTemplate.requirements.length - 2}
									</span>
								)}
							</div>
						</div>
					)}

				{/* Tags - Solo mostrar si existen */}
				{normalizedTemplate.tags && normalizedTemplate.tags.length > 0 && (
					<div className="mb-6">
						<div className="flex flex-wrap gap-1">
							{normalizedTemplate.tags.slice(0, 3).map((tag, idx) => (
								<span
									key={idx}
									className="px-2 py-1 bg-primary-50 text-primary-600 text-xs rounded-md font-medium"
								>
									#{tag}
								</span>
							))}
							{normalizedTemplate.tags.length > 3 && (
								<span className="px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded-md">
									+{normalizedTemplate.tags.length - 3}
								</span>
							)}
						</div>
					</div>
				)}

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
				className={`absolute inset-0 bg-gradient-to-r ${getGradientColor(normalizedTemplate.category || "")} rounded-2xl -z-10 blur-xl opacity-0 group-hover:opacity-20 transition-all duration-500 transform group-hover:scale-110`}
			/>
		</div>
	);
};
