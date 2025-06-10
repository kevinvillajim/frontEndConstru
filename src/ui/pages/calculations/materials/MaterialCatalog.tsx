// src/ui/pages/calculations/materials/MaterialCatalog.tsx
import React, {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import {
	MagnifyingGlassIcon,
	FunnelIcon,
	StarIcon,
	EyeIcon,
	PlayIcon,
	BookmarkIcon,
	BeakerIcon,
	CubeIcon,
	BuildingOffice2Icon,
	WrenchScrewdriverIcon,
	HomeIcon,
	ClockIcon,
	CheckBadgeIcon,
	ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import {BookmarkIcon as BookmarkSolidIcon} from "@heroicons/react/24/solid";
import {
	useMaterialCalculations,
	type MaterialTemplate,
} from "../shared/hooks/useMaterialCalculations";

// Categorías de materiales
const MATERIAL_CATEGORIES = [
	{
		id: "all",
		name: "Todos",
		icon: CubeIcon,
		color: "text-gray-600",
		bgColor: "bg-gray-100",
	},
	{
		id: "concrete",
		name: "Hormigón",
		icon: BuildingOffice2Icon,
		color: "text-blue-600",
		bgColor: "bg-blue-100",
	},
	{
		id: "steel",
		name: "Acero",
		icon: WrenchScrewdriverIcon,
		color: "text-gray-600",
		bgColor: "bg-gray-100",
	},
	{
		id: "masonry",
		name: "Mampostería",
		icon: HomeIcon,
		color: "text-orange-600",
		bgColor: "bg-orange-100",
	},
	{
		id: "aggregates",
		name: "Agregados",
		icon: CubeIcon,
		color: "text-yellow-600",
		bgColor: "bg-yellow-100",
	},
];

// Filtros de ordenamiento
const SORT_OPTIONS = [
	{value: "popularity", label: "Más Popular"},
	{value: "recent", label: "Más Reciente"},
	{value: "name", label: "Nombre A-Z"},
	{value: "rating", label: "Mejor Calificación"},
];

interface TemplateCardProps {
	template: MaterialTemplate;
	onUse: (templateId: string) => void;
	onToggleFavorite: (templateId: string) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
	template,
	onUse,
	onToggleFavorite,
}) => {
	const [isFavorite, setIsFavorite] = useState(false);
	const [isHovered, setIsHovered] = useState(false);

	const getCategoryIcon = (type: string) => {
		const category = MATERIAL_CATEGORIES.find((cat) => cat.id === type);
		return category ? category.icon : CubeIcon;
	};

	const getCategoryColor = (type: string) => {
		const category = MATERIAL_CATEGORIES.find((cat) => cat.id === type);
		return category ? category.color : "text-gray-600";
	};

	const handleToggleFavorite = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsFavorite(!isFavorite);
		onToggleFavorite(template.id);
	};

	const handleUse = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		onUse(template.id);
	};

	const CategoryIcon = getCategoryIcon(template.type);

	return (
		<div
			className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{/* Header de la card */}
			<div className="relative p-6 pb-4">
				<div className="flex items-start justify-between mb-4">
					<div
						className={`w-12 h-12 ${getCategoryColor(template.type)} bg-opacity-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
					>
						<CategoryIcon
							className={`h-6 w-6 ${getCategoryColor(template.type)}`}
						/>
					</div>

					<div className="flex items-center gap-2">
						{template.isFeatured && (
							<div className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full">
								⭐ Destacada
							</div>
						)}

						{template.isVerified && (
							<div className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200">
								<CheckBadgeIcon className="h-3 w-3" />
								Verificada
							</div>
						)}
					</div>
				</div>

				<div className="mb-4">
					<h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2 mb-2">
						{template.name}
					</h3>
					<p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
						{template.description}
					</p>
				</div>

				{/* Referencia normativa */}
				{template.necReference && (
					<div className="flex items-center gap-2 mb-4">
						<div className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200">
							{template.necReference}
						</div>
					</div>
				)}

				{/* Métricas */}
				<div className="flex items-center justify-between text-sm text-gray-500 mb-4">
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-1">
							<EyeIcon className="h-4 w-4" />
							<span>{template.usageCount || 0}</span>
						</div>

						<div className="flex items-center gap-1">
							<StarIcon className="h-4 w-4" />
							<span>{template.averageRating || "0.0"}</span>
						</div>

						<div className="flex items-center gap-1">
							<ClockIcon className="h-4 w-4" />
							<span>
								Actualizada {new Date(template.updatedAt).toLocaleDateString()}
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Footer con acciones */}
			<div className="px-6 pb-6">
				<div className="flex items-center gap-3">
					<button
						onClick={handleUse}
						className={`
							flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium 
							hover:bg-blue-700 active:scale-[0.98] transition-all duration-200
							flex items-center justify-center gap-2
							${isHovered ? "shadow-lg" : ""}
						`}
					>
						<PlayIcon className="h-4 w-4" />
						Usar Plantilla
					</button>

					<button
						onClick={handleToggleFavorite}
						className={`
							p-3 rounded-xl border-2 transition-all duration-200
							${
								isFavorite
									? "border-yellow-300 bg-yellow-50 text-yellow-600"
									: "border-gray-200 hover:border-yellow-300 hover:bg-yellow-50 text-gray-400 hover:text-yellow-600"
							}
						`}
					>
						{isFavorite ? (
							<BookmarkSolidIcon className="h-4 w-4" />
						) : (
							<BookmarkIcon className="h-4 w-4" />
						)}
					</button>

					<Link
						to={`/calculations/materials/interface/${template.id}`}
						className="p-3 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-all duration-200"
					>
						<ArrowTopRightOnSquareIcon className="h-4 w-4" />
					</Link>
				</div>
			</div>

			{/* Overlay de hover */}
			{isHovered && (
				<div className="absolute inset-0 bg-blue-500 bg-opacity-5 pointer-events-none rounded-2xl"></div>
			)}
		</div>
	);
};

const MaterialCatalog: React.FC = () => {
	const navigate = useNavigate();
	const {getTemplates, isLoading} = useMaterialCalculations();

	// Estados
	const [templates, setTemplates] = useState<MaterialTemplate[]>([]);
	const [filteredTemplates, setFilteredTemplates] = useState<
		MaterialTemplate[]
	>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [sortBy, setSortBy] = useState("popularity");
	const [showFilters, setShowFilters] = useState(false);

	// Cargar plantillas
	useEffect(() => {
		const loadTemplates = async () => {
			try {
				const data = await getTemplates({
					isActive: true,
					limit: 50,
					page: 1,
				});
				setTemplates(data || []);
			} catch (error) {
				console.error("Error loading templates:", error);
			}
		};

		loadTemplates();
	}, [getTemplates]);

	// Filtrar y ordenar plantillas
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

		// Filtro por categoría
		if (selectedCategory !== "all") {
			filtered = filtered.filter(
				(template) => template.type === selectedCategory
			);
		}

		// Ordenamiento
		filtered.sort((a, b) => {
			switch (sortBy) {
				case "popularity":
					return (b.usageCount || 0) - (a.usageCount || 0);
				case "recent":
					return (
						new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
					);
				case "name":
					return a.name.localeCompare(b.name);
				case "rating":
					return (
						(parseFloat(b.averageRating) || 0) -
						(parseFloat(a.averageRating) || 0)
					);
				default:
					return 0;
			}
		});

		setFilteredTemplates(filtered);
	}, [templates, searchTerm, selectedCategory, sortBy]);

	const handleUseTemplate = (templateId: string) => {
		navigate(`/calculations/materials/interface/${templateId}`);
	};

	const handleToggleFavorite = (templateId: string) => {
		console.log("Toggle favorite:", templateId);
		// Implementar lógica de favoritos
	};

	const renderHeader = () => (
		<div className="bg-white border-b border-gray-200">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
							<BeakerIcon className="h-6 w-6 text-white" />
						</div>
						<div>
							<h1 className="text-2xl font-bold text-gray-900">
								Catálogo de Materiales
							</h1>
							<p className="text-gray-600">
								{filteredTemplates.length} plantillas disponibles
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
										? "border-blue-300 bg-blue-50 text-blue-700"
										: "border-gray-300 text-gray-700 hover:bg-gray-50"
								}
							`}
						>
							<FunnelIcon className="h-4 w-4" />
							Filtros
						</button>
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
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
								className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							/>
						</div>
					</div>

					{/* Categorías */}
					<div>
						<label className="block text-sm font-medium text-gray-900 mb-2">
							Categoría
						</label>
						<div className="flex flex-wrap gap-2">
							{MATERIAL_CATEGORIES.map((category) => {
								const CategoryIcon = category.icon;
								return (
									<button
										key={category.id}
										onClick={() => setSelectedCategory(category.id)}
										className={`
											px-3 py-2 rounded-lg border transition-all duration-200 flex items-center gap-2 text-sm
											${
												selectedCategory === category.id
													? "border-blue-300 bg-blue-50 text-blue-700"
													: "border-gray-300 text-gray-700 hover:bg-gray-50"
											}
										`}
									>
										<CategoryIcon className="h-4 w-4" />
										{category.name}
									</button>
								);
							})}
						</div>
					</div>

					{/* Ordenamiento */}
					<div>
						<label className="block text-sm font-medium text-gray-900 mb-2">
							Ordenar por
						</label>
						<select
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value)}
							className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						>
							{SORT_OPTIONS.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
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
					<div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<BeakerIcon className="h-12 w-12 text-gray-400" />
					</div>
					<h3 className="text-lg font-medium text-gray-900 mb-2">
						No se encontraron plantillas
					</h3>
					<p className="text-gray-600">
						Intenta ajustar los filtros o términos de búsqueda
					</p>
				</div>
			);
		}

		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{filteredTemplates.map((template) => (
					<TemplateCard
						key={template.id}
						template={template}
						onUse={handleUseTemplate}
						onToggleFavorite={handleToggleFavorite}
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

export default MaterialCatalog;
