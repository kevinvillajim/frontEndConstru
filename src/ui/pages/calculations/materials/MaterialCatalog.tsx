// src/ui/pages/calculations/materials/MaterialCatalog.tsx
import React, {useState, useEffect} from "react";
import {useNavigate, Link} from "react-router-dom";
import {
	BeakerIcon,
	FunnelIcon,
	MagnifyingGlassIcon,
	StarIcon,
	EyeIcon,
	ClockIcon,
	PlayIcon,
	BookmarkIcon,
	ArrowTopRightOnSquareIcon,
	TagIcon,
} from "@heroicons/react/24/outline";
import {BookmarkIcon as BookmarkSolidIcon} from "@heroicons/react/24/solid";
import {
	useMaterialCalculations,
} from "../shared/hooks/useMaterialCalculations";
import type {MaterialTemplate} from "../shared/hooks/useMaterialCalculations";


// Categorías de materiales - actualizadas según los datos del API
const MATERIAL_CATEGORIES = [
	{id: "all", name: "Todas las categorías", icon: BeakerIcon},
	{id: "concrete", name: "Hormigón", icon: BeakerIcon},
	{id: "masonry", name: "Mampostería", icon: BeakerIcon},
	{id: "finishes", name: "Acabados", icon: BeakerIcon},
	{id: "steel", name: "Acero", icon: BeakerIcon},
	{id: "insulation", name: "Aislamiento", icon: BeakerIcon},
];

// Opciones de ordenamiento
const SORT_OPTIONS = [
	{value: "popularity", label: "Más populares"},
	{value: "recent", label: "Más recientes"},
	{value: "name", label: "Alfabético"},
	{value: "rating", label: "Mejor valoradas"},
];

// Componente de Card de Plantilla
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
	const [isHovered, setIsHovered] = useState(false);
	const [isFavorite, setIsFavorite] = useState(false);

	const handleUse = () => onUse(template.id);
	const handleToggleFavorite = () => {
		setIsFavorite(!isFavorite);
		onToggleFavorite(template.id);
	};

	const getCategoryIcon = (type: string) => {
		const category = MATERIAL_CATEGORIES.find((cat) => cat.id === type);
		return category?.icon || BeakerIcon;
	};

	const CategoryIcon = getCategoryIcon(template.type);

	return (
		<div
			className="relative bg-white rounded-2xl border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg group"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{/* Header con icono y categoría */}
			<div className="px-6 pt-6 pb-4">
				<div className="flex items-start justify-between mb-4">
					<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
						<CategoryIcon className="h-6 w-6 text-white" />
					</div>

					{template.isFeatured && (
						<div className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-medium rounded-full">
							Destacada
						</div>
					)}
				</div>

				<h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
					{template.name}
				</h3>

				<p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
					{template.description}
				</p>

				{/* Tags de NEC si existe */}
				{template.normativeReference && (
					<div className="mt-3">
						<div className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
							<TagIcon className="h-3 w-3" />
							{template.normativeReference}
						</div>
					</div>
				)}

				{/* Métricas */}
				<div className="flex items-center justify-between text-sm text-gray-500 mb-4 mt-4">
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
							<span>{new Date(template.updatedAt).toLocaleDateString()}</span>
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
				<div className="absolute inset-0 bg-opacity-5 pointer-events-none rounded-2xl"></div>
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
	const [isInitialized, setIsInitialized] = useState(false);

	// Cargar plantillas al montar el componente
	useEffect(() => {
		const loadTemplates = async () => {
			try {
				console.log("🔄 Cargando plantillas de materiales...");
				const data = await getTemplates({
					isActive: true,
					limit: 50,
					page: 1,
				});

				console.log("📦 Datos recibidos:", data);

				// Asegurar que data sea un array
				const templatesArray = Array.isArray(data) ? data : [];
				console.log("✅ Templates procesados:", templatesArray.length);

				setTemplates(templatesArray);
				setIsInitialized(true);
			} catch (error) {
				console.error("❌ Error loading templates:", error);
				setTemplates([]); // Establecer array vacío en caso de error
				setIsInitialized(true);
			}
		};

		loadTemplates();
	}, [getTemplates]);

	// Filtrar y ordenar plantillas - SOLO después de que se inicialice
	useEffect(() => {
		if (!isInitialized || !Array.isArray(templates)) {
			console.log("⏳ Esperando inicialización...", {
				isInitialized,
				templatesIsArray: Array.isArray(templates),
			});
			return;
		}

		console.log("🔍 Filtrando plantillas...", {
			totalTemplates: templates.length,
			searchTerm,
			selectedCategory,
			sortBy,
		});

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

		console.log("✅ Plantillas filtradas:", filtered.length);
		setFilteredTemplates(filtered);
	}, [templates, searchTerm, selectedCategory, sortBy, isInitialized]);

	const handleUseTemplate = (templateId: string) => {
		navigate(`/calculations/materials/interface/${templateId}`);
	};

	const handleToggleFavorite = (templateId: string) => {
		console.log("Toggle favorite:", templateId);
		// TODO: Implementar lógica de favoritos
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
			className={`bg-gray-50 border-b border-gray-200 transition-all duration-300 ${
				showFilters
					? "max-h-96 opacity-100"
					: "max-h-0 opacity-0 overflow-hidden"
			}`}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
						<div className="grid grid-cols-2 gap-2">
							{MATERIAL_CATEGORIES.map((category) => {
								const CategoryIcon = category.icon;
								return (
									<button
										key={category.id}
										onClick={() => setSelectedCategory(category.id)}
										className={`
											px-3 py-2 rounded-lg border text-sm font-medium transition-colors
											flex items-center gap-2 justify-center
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
		if (isLoading || !isInitialized) {
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
