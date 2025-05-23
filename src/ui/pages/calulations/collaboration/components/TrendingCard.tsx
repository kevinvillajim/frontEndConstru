import React from "react";
import {
	StarIcon,
	UserIcon,
	ArrowRightIcon,
} from "@heroicons/react/24/outline";
import {StarIcon as StarSolidIcon} from "@heroicons/react/24/solid";

// Tipos
interface TrendingCalculationProps {
	calculation: {
		id: string;
		name: string;
		templateName: string;
		category: "structural" | "electrical" | "architectural" | "hydraulic";
		author: {
			name: string;
			company?: string;
			country: string;
		};
		stats: {
			uses: number;
			saves: number;
			rating: number;
			reviews: number;
		};
		tags: string[];
		isFavorite: boolean;
		results: {
			preview: string;
			unit: string;
		};
		publishedAt: string;
		updatedAt: string;
	};
	toggleFavorite: (id: string) => void;
	formatNumber: (num: number) => string;
}

// Categorías con iconos y colores
const categories = {
	structural: {
		name: "Estructural",
		icon: "🏗️",
		color: "bg-blue-50 text-blue-700",
	},
	electrical: {
		name: "Eléctrico",
		icon: "⚡",
		color: "bg-yellow-50 text-yellow-700",
	},
	architectural: {
		name: "Arquitectónico",
		icon: "🏛️",
		color: "bg-green-50 text-green-700",
	},
	hydraulic: {
		name: "Hidráulico",
		icon: "🚰",
		color: "bg-cyan-50 text-cyan-700",
	},
};

// Formatear fecha
const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString("es-EC", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
};

const TrendingCard: React.FC<TrendingCalculationProps> = ({
	calculation,
	toggleFavorite,
	formatNumber,
}) => {
	const categoryInfo = categories[calculation.category];

	return (
		<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
			<div className="p-5">
				{/* Encabezado */}
				<div className="flex items-start justify-between mb-3">
					<div className="flex-1">
						<h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
							{calculation.name}
						</h3>
						<p className="text-sm text-gray-600 mb-2">
							{calculation.templateName}
						</p>
						<div className="flex items-center gap-2">
							<span
								className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${categoryInfo.color}`}
							>
								<span>{categoryInfo.icon}</span>
								<span>{categoryInfo.name}</span>
							</span>

							<div className="flex items-center gap-1 text-amber-500">
								<StarSolidIcon className="h-3 w-3" />
								<span className="text-xs font-medium">
									{calculation.stats.rating.toFixed(1)}
								</span>
							</div>
						</div>
					</div>
					<button
						onClick={() => toggleFavorite(calculation.id)}
						className="p-1 hover:bg-gray-100 rounded-full transition-colors"
					>
						{calculation.isFavorite ? (
							<StarSolidIcon className="h-5 w-5 text-amber-500" />
						) : (
							<StarIcon className="h-5 w-5 text-gray-400" />
						)}
					</button>
				</div>

				{/* Tags */}
				<div className="flex flex-wrap gap-1 mb-4">
					{calculation.tags.slice(0, 3).map((tag, index) => (
						<span
							key={index}
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

				{/* Autor y estadísticas */}
				<div className="flex items-center justify-between mb-4">
					<div className="flex items-center gap-2 text-xs text-gray-600">
						<UserIcon className="h-3 w-3" />
						<span>
							{calculation.author.name}
							{calculation.author.company
								? ` • ${calculation.author.company}`
								: ""}
						</span>
					</div>
					<div className="text-xs text-gray-500">
						Actualizado {formatDate(calculation.updatedAt)}
					</div>
				</div>

				{/* Estadísticas */}
				<div className="grid grid-cols-3 gap-2 mb-4">
					<div className="bg-gray-50 rounded-lg p-2 text-center">
						<div className="text-sm font-semibold text-gray-900">
							{formatNumber(calculation.stats.uses)}
						</div>
						<div className="text-xs text-gray-600">Usos</div>
					</div>
					<div className="bg-gray-50 rounded-lg p-2 text-center">
						<div className="text-sm font-semibold text-gray-900">
							{formatNumber(calculation.stats.saves)}
						</div>
						<div className="text-xs text-gray-600">Guardados</div>
					</div>
					<div className="bg-gray-50 rounded-lg p-2 text-center">
						<div className="text-sm font-semibold text-gray-900">
							{formatNumber(calculation.stats.reviews)}
						</div>
						<div className="text-xs text-gray-600">Reseñas</div>
					</div>
				</div>

				{/* Botones de acción */}
				<div className="flex justify-between items-center">
					<div className="flex items-center gap-1 text-xs text-gray-500">
						<span
							className={`w-2 h-2 rounded-full bg-${calculation.author.country === "EC" ? "green" : "blue"}-500`}
						></span>
						{calculation.author.country === "EC"
							? "Ecuador"
							: calculation.author.country}
					</div>
					<button className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-1">
						Usar <ArrowRightIcon className="h-3 w-3" />
					</button>
				</div>
			</div>
		</div>
	);
};

export default TrendingCard;
