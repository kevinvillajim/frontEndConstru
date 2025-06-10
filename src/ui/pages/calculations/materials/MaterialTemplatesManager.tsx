// src/ui/pages/calculations/materials/MaterialTemplatesManager.tsx
import React, {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import {
	PlusIcon,
	BeakerIcon,
	EyeIcon,
	PencilIcon,
	TrashIcon,
	DocumentDuplicateIcon,
	LockClosedIcon,
	LockOpenIcon,
	MagnifyingGlassIcon,
	FunnelIcon,
	ClockIcon,
} from "@heroicons/react/24/outline";
import {
	useMaterialTemplates,
	type UserTemplate,
} from "../shared/hooks/useMaterialCalculations";

interface TemplateCardProps {
	template: UserTemplate;
	onEdit: (template: UserTemplate) => void;
	onDelete: (template: UserTemplate) => void;
	onDuplicate: (template: UserTemplate) => void;
	onToggleVisibility: (template: UserTemplate) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
	template,
	onEdit,
	onDelete,
	onDuplicate,
	onToggleVisibility,
}) => {
	return (
		<div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
			{/* Header */}
			<div className="p-6 pb-4">
				<div className="flex items-start justify-between mb-4">
					<div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
						<BeakerIcon className="h-6 w-6 text-white" />
					</div>

					<div className="flex items-center gap-2">
						<div
							className={`px-2 py-1 text-xs font-medium rounded-full ${
								template.isPublic
									? "bg-green-50 text-green-700 border border-green-200"
									: "bg-gray-50 text-gray-700 border border-gray-200"
							}`}
						>
							{template.isPublic ? "Pública" : "Privada"}
						</div>
					</div>
				</div>

				<div className="mb-4">
					<h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2 mb-2">
						{template.name}
					</h3>
					<p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
						{template.description}
					</p>
				</div>

				{/* Métricas */}
				<div className="flex items-center justify-between text-sm text-gray-500 mb-4">
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-1">
							<EyeIcon className="h-4 w-4" />
							<span>{template.usageCount}</span>
						</div>

						<div className="flex items-center gap-1">
							<ClockIcon className="h-4 w-4" />
							<span>
								Editada {new Date(template.updatedAt).toLocaleDateString()}
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Footer con acciones */}
			<div className="px-6 pb-6">
				<div className="flex items-center gap-2">
					<button
						onClick={() => onEdit(template)}
						className="flex-1 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
					>
						<PencilIcon className="h-4 w-4" />
						Editar
					</button>

					<button
						onClick={() => onDuplicate(template)}
						className="p-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors"
						title="Duplicar"
					>
						<DocumentDuplicateIcon className="h-4 w-4" />
					</button>

					<button
						onClick={() => onToggleVisibility(template)}
						className="p-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors"
						title={template.isPublic ? "Hacer privada" : "Hacer pública"}
					>
						{template.isPublic ? (
							<LockOpenIcon className="h-4 w-4" />
						) : (
							<LockClosedIcon className="h-4 w-4" />
						)}
					</button>

					<button
						onClick={() => onDelete(template)}
						className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-400 transition-colors"
						title="Eliminar"
					>
						<TrashIcon className="h-4 w-4" />
					</button>
				</div>
			</div>
		</div>
	);
};

const MaterialTemplatesManager: React.FC = () => {
	const navigate = useNavigate();
	const {getUserTemplates, deleteTemplate, updateTemplate, isLoading} =
		useMaterialTemplates();

	// Estados
	const [templates, setTemplates] = useState<UserTemplate[]>([]);
	const [filteredTemplates, setFilteredTemplates] = useState<UserTemplate[]>(
		[]
	);
	const [searchTerm, setSearchTerm] = useState("");
	const [filterVisibility, setFilterVisibility] = useState<
		"all" | "public" | "private"
	>("all");
	const [showFilters, setShowFilters] = useState(false);

	// Cargar plantillas
	useEffect(() => {
		const loadTemplates = async () => {
			const data = await getUserTemplates();
			setTemplates(data);
		};

		loadTemplates();
	}, [getUserTemplates]);

	// Filtrar plantillas
	useEffect(() => {
		let filtered = [...templates];

		// Filtro por búsqueda
		if (searchTerm) {
			filtered = filtered.filter(
				(template) =>
					template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					template.description.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		// Filtro por visibilidad
		if (filterVisibility !== "all") {
			filtered = filtered.filter((template) =>
				filterVisibility === "public" ? template.isPublic : !template.isPublic
			);
		}

		setFilteredTemplates(filtered);
	}, [templates, searchTerm, filterVisibility]);

	const handleEdit = (template: UserTemplate) => {
		navigate(`/calculations/materials/templates/edit/${template.id}`);
	};

	const handleDelete = async (template: UserTemplate) => {
		if (
			window.confirm(
				`¿Estás seguro de que quieres eliminar "${template.name}"?`
			)
		) {
			const success = await deleteTemplate(template.id);
			if (success) {
				setTemplates((prev) => prev.filter((t) => t.id !== template.id));
			}
		}
	};

	const handleDuplicate = (template: UserTemplate) => {
		navigate(`/calculations/materials/templates/duplicate/${template.id}`);
	};

	const handleToggleVisibility = async (template: UserTemplate) => {
		const success = await updateTemplate(template.id, {
			isPublic: !template.isPublic,
		});

		if (success) {
			setTemplates((prev) =>
				prev.map((t) =>
					t.id === template.id ? {...t, isPublic: !t.isPublic} : t
				)
			);
		}
	};

	const renderHeader = () => (
		<div className="bg-white border-b border-gray-200">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
							<BeakerIcon className="h-6 w-6 text-white" />
						</div>
						<div>
							<h1 className="text-2xl font-bold text-gray-900">
								Mis Plantillas de Materiales
							</h1>
							<p className="text-gray-600">
								{filteredTemplates.length} plantillas personales
							</p>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<button
							onClick={() => setShowFilters(!showFilters)}
							className={`
								px-4 py-2 rounded-lg border transition-colors flex items-center gap-2
								${
									showFilters
										? "border-emerald-300 bg-emerald-50 text-emerald-700"
										: "border-gray-300 text-gray-700 hover:bg-gray-50"
								}
							`}
						>
							<FunnelIcon className="h-4 w-4" />
							Filtros
						</button>

						<Link
							to="/calculations/materials/templates/create"
							className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 font-medium"
						>
							<PlusIcon className="h-4 w-4" />
							Nueva Plantilla
						</Link>
					</div>
				</div>
			</div>
		</div>
	);

	const renderFilters = () => (
		<div
			className={`bg-gray-50 border-b border-gray-200 transition-all duration-300 ${showFilters ? "max-h-96" : "max-h-0 overflow-hidden"}`}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Búsqueda */}
					<div>
						<label className="block text-sm font-medium text-gray-900 mb-2">
							Buscar plantillas
						</label>
						<div className="relative">
							<MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
							<input
								type="text"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								placeholder="Buscar por nombre o descripción..."
								className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
							/>
						</div>
					</div>

					{/* Visibilidad */}
					<div>
						<label className="block text-sm font-medium text-gray-900 mb-2">
							Visibilidad
						</label>
						<div className="flex gap-2">
							{[
								{value: "all", label: "Todas"},
								{value: "public", label: "Públicas"},
								{value: "private", label: "Privadas"},
							].map((option) => (
								<button
									key={option.value}
									onClick={() =>
										setFilterVisibility(option.value as typeof filterVisibility)
									}
									className={`
										px-4 py-2 rounded-lg border transition-all duration-200 text-sm font-medium
										${
											filterVisibility === option.value
												? "border-emerald-300 bg-emerald-50 text-emerald-700"
												: "border-gray-300 text-gray-700 hover:bg-gray-50"
										}
									`}
								>
									{option.label}
								</button>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);

	const renderTemplateGrid = () => {
		if (isLoading) {
			return (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{[...Array(6)].map((_, index) => (
						<div
							key={index}
							className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse"
						>
							<div className="w-12 h-12 bg-gray-200 rounded-xl mb-4"></div>
							<div className="h-4 bg-gray-200 rounded mb-2"></div>
							<div className="h-3 bg-gray-200 rounded mb-4"></div>
							<div className="h-10 bg-gray-200 rounded"></div>
						</div>
					))}
				</div>
			);
		}

		if (filteredTemplates.length === 0) {
			return (
				<div className="text-center py-12">
					<div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<BeakerIcon className="h-12 w-12 text-emerald-600" />
					</div>
					<h3 className="text-lg font-medium text-gray-900 mb-2">
						{templates.length === 0
							? "No tienes plantillas aún"
							: "No se encontraron plantillas"}
					</h3>
					<p className="text-gray-600 mb-6">
						{templates.length === 0
							? "Crea tu primera plantilla personalizada para cálculos de materiales"
							: "Intenta ajustar los filtros o términos de búsqueda"}
					</p>
					{templates.length === 0 && (
						<Link
							to="/calculations/materials/templates/create"
							className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
						>
							<PlusIcon className="h-4 w-4 mr-2" />
							Crear Primera Plantilla
						</Link>
					)}
				</div>
			);
		}

		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{filteredTemplates.map((template) => (
					<TemplateCard
						key={template.id}
						template={template}
						onEdit={handleEdit}
						onDelete={handleDelete}
						onDuplicate={handleDuplicate}
						onToggleVisibility={handleToggleVisibility}
					/>
				))}
			</div>
		);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{renderHeader()}
			{renderFilters()}

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{renderTemplateGrid()}
			</div>
		</div>
	);
};

export default MaterialTemplatesManager;
