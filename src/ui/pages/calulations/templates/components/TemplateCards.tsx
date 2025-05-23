import React from "react";
import {
	EyeIcon,
	PencilIcon,
	TrashIcon,
	DocumentDuplicateIcon,
	ShareIcon,
	BookOpenIcon,
	CheckBadgeIcon,
	ClockIcon,
	StarIcon as StarOutlineIcon,
} from "@heroicons/react/24/outline";
import {StarIcon as StarSolidIcon} from "@heroicons/react/24/solid";
import {MyCalculationTemplate} from "../../../shared/types/template.types";

interface TemplateCardProps {
	template: MyCalculationTemplate;
	onToggleFavorite: (templateId: string) => void;
	onDuplicate: (templateId: string) => void;
	onDelete: (template: MyCalculationTemplate) => void;
	onToggleStatus: (templateId: string) => void;
	onView: (templateId: string) => void;
	onEdit: (templateId: string) => void;
	onShare: (template: MyCalculationTemplate) => void;
	animationDelay?: number;
}

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
	custom: {
		name: "Personalizada",
		icon: "⚒️",
		color: "bg-purple-50 text-purple-700",
	},
};

const TemplateCard: React.FC<TemplateCardProps> = ({
	template,
	onToggleFavorite,
	onDuplicate,
	onDelete,
	onToggleStatus,
	onView,
	onEdit,
	onShare,
	animationDelay = 0,
}) => {
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("es-EC", {
			day: "2-digit",
			month: "short",
			year: "numeric",
		});
	};

	const getCategoryInfo = (category: string) => {
		return categories[category as keyof typeof categories] || categories.custom;
	};

	const getStatusBadge = (status: string, isActive: boolean) => {
		if (status === "draft") {
			return (
				<span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
					Borrador
				</span>
			);
		}
		if (!isActive) {
			return (
				<span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
					Archivada
				</span>
			);
		}
		return (
			<span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
				Activa
			</span>
		);
	};

	const categoryInfo = getCategoryInfo(template.category);

	return (
		<div
			className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
			style={{animationDelay: `${animationDelay * 0.05}s`}}
		>
			<div className="p-6">
				{/* Header */}
				<div className="flex items-start justify-between mb-4">
					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-2 mb-2">
							<h3 className="font-semibold text-gray-900 truncate">
								{template.name}
							</h3>
							{getStatusBadge(template.status, template.isActive)}
						</div>
						<p className="text-sm text-gray-600 mb-3 line-clamp-2">
							{template.description}
						</p>
						<div
							className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${categoryInfo.color}`}
						>
							<span>{categoryInfo.icon}</span>
							<span>{categoryInfo.name}</span>
						</div>
					</div>

					<button
						onClick={() => onToggleFavorite(template.id)}
						className="p-1 hover:bg-gray-100 rounded-full transition-colors shrink-0 ml-2"
						title={
							template.isFavorite
								? "Quitar de favoritos"
								: "Agregar a favoritos"
						}
					>
						<StarSolidIcon
							className={`h-4 w-4 ${
								template.isFavorite ? "text-secondary-500" : "text-gray-300"
							}`}
						/>
					</button>
				</div>

				{/* Metadata */}
				<div className="space-y-2 mb-4">
					<div className="flex items-center justify-between text-xs text-gray-500">
						<span>Versión {template.version}</span>
						<span>{template.usageCount} usos</span>
					</div>
					<div className="flex items-center justify-between text-xs text-gray-500">
						<span>Modificado: {formatDate(template.lastModified)}</span>
						{template.isPublic && (
							<span className="text-green-600 font-medium">Pública</span>
						)}
					</div>
					{template.necReference && (
						<div className="flex items-center gap-1 text-xs text-primary-600">
							<BookOpenIcon className="h-3 w-3" />
							<span className="truncate">{template.necReference}</span>
						</div>
					)}
					{template.estimatedTime && (
						<div className="flex items-center gap-1 text-xs text-gray-500">
							<ClockIcon className="h-3 w-3" />
							<span>{template.estimatedTime}</span>
						</div>
					)}
				</div>

				{/* Tags */}
				<div className="flex flex-wrap gap-1 mb-4">
					{template.tags.slice(0, 3).map((tag, tagIndex) => (
						<span
							key={tagIndex}
							className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
						>
							{tag}
						</span>
					))}
					{template.tags.length > 3 && (
						<span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md">
							+{template.tags.length - 3}
						</span>
					)}
				</div>

				{/* Actions */}
				<div className="flex justify-between items-center">
					<div className="flex gap-1">
						<button
							onClick={() => onView(template.id)}
							className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
							title="Ver plantilla"
						>
							<EyeIcon className="h-4 w-4" />
						</button>
						<button
							onClick={() => onEdit(template.id)}
							className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
							title="Editar plantilla"
						>
							<PencilIcon className="h-4 w-4" />
						</button>
						<button
							onClick={() => onDuplicate(template.id)}
							className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
							title="Duplicar plantilla"
						>
							<DocumentDuplicateIcon className="h-4 w-4" />
						</button>
						{template.isPublic && (
							<button
								onClick={() => onShare(template)}
								className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
								title="Compartir plantilla"
							>
								<ShareIcon className="h-4 w-4" />
							</button>
						)}
						<button
							onClick={() => onDelete(template)}
							className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
							title="Eliminar plantilla"
						>
							<TrashIcon className="h-4 w-4" />
						</button>
					</div>

					<button
						onClick={() => onToggleStatus(template.id)}
						className={`px-4 py-2 text-sm rounded-lg transition-colors font-medium ${
							template.isActive
								? "bg-gray-100 text-gray-700 hover:bg-gray-200"
								: "bg-primary-600 text-white hover:bg-primary-700"
						}`}
					>
						{template.isActive ? "Archivar" : "Activar"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default TemplateCard;
