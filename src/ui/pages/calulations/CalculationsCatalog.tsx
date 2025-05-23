import React, {useState, useEffect} from "react";
import {
	BuildingOffice2Icon,
	BoltIcon,
	AcademicCapIcon,
	BeakerIcon,
	WrenchScrewdriverIcon,
	ChevronDownIcon,
	ChevronRightIcon,
	StarIcon,
	ClockIcon,
	CheckBadgeIcon,
	BookOpenIcon,
	UserGroupIcon,
	MagnifyingGlassIcon,
	AdjustmentsHorizontalIcon,
	CalculatorIcon,
	LightBulbIcon,
	CpuChipIcon,
	CogIcon,
	HomeIcon,
	ArrowPathIcon,
	ShieldCheckIcon,
	ExclamationCircleIcon,
	PlusIcon,
} from "@heroicons/react/24/outline";
import {StarIcon as StarSolidIcon} from "@heroicons/react/24/solid";
import {useNavigate} from "react-router-dom";

// Interfaces para tipado
interface CalculationTemplate {
	id: string;
	name: string;
	description: string;
	category: string;
	subcategory: string;
	profession: string[];
	difficulty: "basic" | "intermediate" | "advanced";
	estimatedTime: string;
	necReference: string;
	verified: boolean;
	rating: number;
	usageCount: number;
	isFavorite: boolean;
	isNew: boolean;
	isCollaborative: boolean;
	shareLevel: "public" | "organization" | "private";
	createdBy?: string;
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
	tags: string[];
	lastUpdated: string;
	requirements: string[];
}

// Mock data separando plantillas públicas de las colaborativas
const publicTemplates: CalculationTemplate[] = [
	// ESTRUCTURAL - NEC
	{
		id: "nec-str-01",
		name: "Análisis Sísmico Estático NEC",
		description:
			"Cálculo de fuerzas sísmicas según NEC-SE-DS para estructuras regulares",
		category: "structural",
		subcategory: "seismic",
		profession: ["civil_engineer", "structural_engineer"],
		difficulty: "advanced",
		estimatedTime: "25-35 min",
		necReference: "NEC-SE-DS, Cap. 2",
		verified: true,
		rating: 4.9,
		usageCount: 1256,
		isFavorite: false,
		isNew: false,
		isCollaborative: false,
		shareLevel: "public",
		icon: BuildingOffice2Icon,
		tags: ["sísmico", "fuerzas", "análisis", "estructura", "nec"],
		lastUpdated: "2024-03-15",
		requirements: [
			"Geometría estructura",
			"Cargas permanentes",
			"Zona sísmica",
		],
	},
	{
		id: "nec-str-02",
		name: "Diseño de Vigas de Hormigón Armado NEC",
		description:
			"Cálculo y verificación de vigas rectangulares y T según NEC-SE-HM",
		category: "structural",
		subcategory: "concrete",
		profession: ["civil_engineer", "structural_engineer"],
		difficulty: "advanced",
		estimatedTime: "20-30 min",
		necReference: "NEC-SE-HM, Cap. 9",
		verified: true,
		rating: 4.8,
		usageCount: 2134,
		isFavorite: true,
		isNew: false,
		isCollaborative: false,
		shareLevel: "public",
		icon: BuildingOffice2Icon,
		tags: ["hormigón", "vigas", "armado", "flexión", "nec"],
		lastUpdated: "2024-02-28",
		requirements: [
			"Dimensiones viga",
			"Cargas aplicadas",
			"Resistencia hormigón",
		],
	},
	// ELÉCTRICO - NEC
	{
		id: "nec-elec-01",
		name: "Demanda Eléctrica Residencial NEC",
		description:
			"Cálculo de demanda eléctrica para viviendas según factores NEC-SB-IE",
		category: "electrical",
		subcategory: "demand",
		profession: ["electrical_engineer", "architect"],
		difficulty: "basic",
		estimatedTime: "8-12 min",
		necReference: "NEC-SB-IE, Sección 1.1",
		verified: true,
		rating: 4.8,
		usageCount: 3420,
		isFavorite: true,
		isNew: false,
		isCollaborative: false,
		shareLevel: "public",
		icon: BoltIcon,
		tags: ["demanda", "residencial", "factores", "carga", "nec"],
		lastUpdated: "2024-03-10",
		requirements: ["Área vivienda", "Número circuitos", "Cargas especiales"],
	},
];

const collaborativeTemplates: CalculationTemplate[] = [
	{
		id: "collab-01",
		name: "Cálculo de Losas Optimizado",
		description:
			"Método mejorado para cálculo de losas con consideraciones sísmicas locales",
		category: "structural",
		subcategory: "concrete",
		profession: ["structural_engineer"],
		difficulty: "advanced",
		estimatedTime: "30-40 min",
		necReference: "Basado en NEC-SE-HM",
		verified: true,
		rating: 4.6,
		usageCount: 89,
		isFavorite: false,
		isNew: true,
		isCollaborative: true,
		shareLevel: "public",
		createdBy: "Ing. María González",
		icon: BuildingOffice2Icon,
		tags: ["losas", "optimizado", "sísmico", "colaborativo"],
		lastUpdated: "2024-03-20",
		requirements: [
			"Geometría losa",
			"Cargas distribuidas",
			"Condiciones apoyo",
		],
	},
	{
		id: "collab-02",
		name: "Instalaciones Eléctricas Comerciales Mejoradas",
		description: "Cálculo especializado para comercios con cargas variables",
		category: "electrical",
		subcategory: "commercial",
		profession: ["electrical_engineer"],
		difficulty: "intermediate",
		estimatedTime: "15-20 min",
		necReference: "Adaptación NEC-SB-IE",
		verified: true,
		rating: 4.4,
		usageCount: 156,
		isFavorite: false,
		isNew: false,
		isCollaborative: true,
		shareLevel: "public",
		createdBy: "Ing. Carlos Mendoza",
		icon: BoltIcon,
		tags: ["comercial", "cargas variables", "mejorado", "colaborativo"],
		lastUpdated: "2024-03-05",
		requirements: ["Tipo local", "Equipos instalados", "Horarios operación"],
	},
];

const categories = [
	{
		id: "structural",
		name: "Estructural",
		icon: BuildingOffice2Icon,
		color: "bg-blue-50 border-blue-200 text-blue-700",
		subcategories: [
			{id: "seismic", name: "Análisis Sísmico"},
			{id: "concrete", name: "Hormigón Armado"},
			{id: "steel", name: "Acero Estructural"},
			{id: "foundations", name: "Cimentaciones"},
		],
	},
	{
		id: "electrical",
		name: "Eléctrico",
		icon: BoltIcon,
		color: "bg-yellow-50 border-yellow-200 text-yellow-700",
		subcategories: [
			{id: "demand", name: "Demanda Eléctrica"},
			{id: "conductors", name: "Conductores"},
			{id: "grounding", name: "Puesta a Tierra"},
			{id: "lighting", name: "Iluminación"},
			{id: "commercial", name: "Instalaciones Comerciales"},
		],
	},
	{
		id: "architectural",
		name: "Arquitectónico",
		icon: AcademicCapIcon,
		color: "bg-green-50 border-green-200 text-green-700",
		subcategories: [
			{id: "areas", name: "Cálculo de Áreas"},
			{id: "circulation", name: "Circulación"},
			{id: "environmental", name: "Confort Ambiental"},
			{id: "accessibility", name: "Accesibilidad"},
		],
	},
	{
		id: "hydraulic",
		name: "Hidráulico",
		icon: BeakerIcon,
		color: "bg-cyan-50 border-cyan-200 text-cyan-700",
		subcategories: [
			{id: "piping", name: "Tuberías"},
			{id: "pumps", name: "Equipos de Bombeo"},
			{id: "drainage", name: "Desagües"},
			{id: "irrigation", name: "Riego"},
		],
	},
];

const CalculationsCatalog: React.FC = () => {
	const navigate = useNavigate();
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
		null
	);
	const [searchTerm, setSearchTerm] = useState("");
	const [sortBy, setSortBy] = useState("popular");
	const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
	const [showOnlyNEC, setShowOnlyNEC] = useState(false);
	const [showOnlyCollaborative, setShowOnlyCollaborative] = useState(false);
	const [templates, setTemplates] = useState<CalculationTemplate[]>([]);
	const [activeTab, setActiveTab] = useState<"all" | "nec" | "collaborative">(
		"all"
	);

	// Combinar todas las plantillas
	useEffect(() => {
		const allTemplates = [...publicTemplates, ...collaborativeTemplates];
		setTemplates(allTemplates);
	}, []);

	// Filtrar templates según la pestaña activa
	const getFilteredTemplates = () => {
		let baseTemplates = templates;

		// Filtrar por pestaña
		switch (activeTab) {
			case "nec":
				baseTemplates = publicTemplates;
				break;
			case "collaborative":
				baseTemplates = collaborativeTemplates;
				break;
			default:
				baseTemplates = templates;
		}

		return baseTemplates.filter((template) => {
			const matchesCategory =
				!selectedCategory || template.category === selectedCategory;
			const matchesSubcategory =
				!selectedSubcategory || template.subcategory === selectedSubcategory;
			const matchesSearch =
				template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
				template.tags.some((tag) =>
					tag.toLowerCase().includes(searchTerm.toLowerCase())
				);
			const matchesFavorites = !showOnlyFavorites || template.isFavorite;
			const matchesNEC = !showOnlyNEC || !template.isCollaborative;
			const matchesCollaborative =
				!showOnlyCollaborative || template.isCollaborative;

			return (
				matchesCategory &&
				matchesSubcategory &&
				matchesSearch &&
				matchesFavorites &&
				matchesNEC &&
				matchesCollaborative
			);
		});
	};

	const sortedTemplates = [...getFilteredTemplates()].sort((a, b) => {
		switch (sortBy) {
			case "popular":
				return b.usageCount - a.usageCount;
			case "rating":
				return b.rating - a.rating;
			case "name":
				return a.name.localeCompare(b.name);
			case "recent":
				return (
					new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
				);
			case "difficulty":
				const difficultyOrder = {basic: 1, intermediate: 2, advanced: 3};
				return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
			default:
				return 0;
		}
	});

	const toggleFavorite = (templateId: string) => {
		setTemplates(
			templates.map((template) =>
				template.id === templateId
					? {...template, isFavorite: !template.isFavorite}
					: template
			)
		);
	};

	const handleUseTemplate = (template: CalculationTemplate) => {
		navigate(`/calculations/template/${template.id}`, {state: {template}});
	};

	const handleSuggestChange = (template: CalculationTemplate) => {
		navigate(`/calculations/suggest-change/${template.id}`, {
			state: {template},
		});
	};

	const getDifficultyColor = (difficulty: string) => {
		switch (difficulty) {
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

	const getDifficultyText = (difficulty: string) => {
		switch (difficulty) {
			case "basic":
				return "Básico";
			case "intermediate":
				return "Intermedio";
			case "advanced":
				return "Avanzado";
			default:
				return difficulty;
		}
	};

	const getSelectedCategoryData = () => {
		return categories.find((cat) => cat.id === selectedCategory);
	};

	const getTabCounts = () => {
		return {
			all: templates.length,
			nec: publicTemplates.length,
			collaborative: collaborativeTemplates.length,
		};
	};

	const tabCounts = getTabCounts();

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white border-b border-gray-200">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
						<div>
							<h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
								Catálogo de Cálculos Técnicos
							</h1>
							<p className="text-gray-600 flex items-center gap-2">
								<span>
									Biblioteca completa de plantillas verificadas NEC Ecuador
								</span>
								<CheckBadgeIcon className="h-4 w-4 text-green-600" />
							</p>
						</div>

						<div className="flex items-center gap-3">
							<button
								onClick={() => navigate("/calculations/my-templates")}
								className="flex items-center gap-2 px-4 py-2 border border-primary-300 text-primary-700 rounded-xl hover:bg-primary-50 transition-all duration-200"
							>
								<StarIcon className="h-4 w-4" />
								Mis Plantillas
							</button>
							<button
								onClick={() => navigate("/calculations/template-editor")}
								className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all duration-200"
							>
								<PlusIcon className="h-4 w-4" />
								Nueva Plantilla
							</button>
						</div>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex gap-8">
					{/* Sidebar - Navegación por categorías */}
					<div className="w-80 flex-shrink-0">
						<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">
								Especialidades
							</h3>

							<div className="space-y-2">
								{categories.map((category) => {
									const isSelected = selectedCategory === category.id;
									const templateCount = templates.filter(
										(t) => t.category === category.id
									).length;

									return (
										<div key={category.id}>
											<button
												onClick={() => {
													if (selectedCategory === category.id) {
														setSelectedCategory(null);
														setSelectedSubcategory(null);
													} else {
														setSelectedCategory(category.id);
														setSelectedSubcategory(null);
													}
												}}
												className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
													isSelected
														? category.color
														: "hover:bg-gray-50 text-gray-700"
												}`}
											>
												<div className="flex items-center gap-3">
													<category.icon className="h-5 w-5" />
													<span className="font-medium">{category.name}</span>
												</div>
												<div className="flex items-center gap-2">
													<span className="text-xs px-2 py-1 bg-white bg-opacity-50 rounded-full">
														{templateCount}
													</span>
													<ChevronDownIcon
														className={`h-4 w-4 transition-transform duration-200 ${
															isSelected ? "rotate-180" : ""
														}`}
													/>
												</div>
											</button>

											{isSelected && (
												<div className="ml-8 mt-2 space-y-1">
													{category.subcategories.map((subcategory) => {
														const subTemplateCount = templates.filter(
															(t) =>
																t.category === category.id &&
																t.subcategory === subcategory.id
														).length;

														return (
															<button
																key={subcategory.id}
																onClick={() =>
																	setSelectedSubcategory(
																		selectedSubcategory === subcategory.id
																			? null
																			: subcategory.id
																	)
																}
																className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
																	selectedSubcategory === subcategory.id
																		? "bg-primary-100 text-primary-700"
																		: "text-gray-600 hover:bg-gray-100"
																}`}
															>
																<div className="flex items-center justify-between">
																	<span>{subcategory.name}</span>
																	<span className="text-xs text-gray-500">
																		({subTemplateCount})
																	</span>
																</div>
															</button>
														);
													})}
												</div>
											)}
										</div>
									);
								})}
							</div>
						</div>
					</div>

					{/* Contenido principal */}
					<div className="flex-1">
						{/* Pestañas de tipo de plantilla */}
						<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
							<div className="flex border-b border-gray-200">
								<button
									onClick={() => setActiveTab("all")}
									className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
										activeTab === "all"
											? "border-primary-500 text-primary-600"
											: "border-transparent text-gray-500 hover:text-gray-700"
									}`}
								>
									Todas ({tabCounts.all})
								</button>
								<button
									onClick={() => setActiveTab("nec")}
									className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
										activeTab === "nec"
											? "border-primary-500 text-primary-600"
											: "border-transparent text-gray-500 hover:text-gray-700"
									}`}
								>
									NEC Oficiales ({tabCounts.nec})
								</button>
								<button
									onClick={() => setActiveTab("collaborative")}
									className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
										activeTab === "collaborative"
											? "border-primary-500 text-primary-600"
											: "border-transparent text-gray-500 hover:text-gray-700"
									}`}
								>
									Colaborativas ({tabCounts.collaborative})
								</button>
							</div>
						</div>

						{/* Filtros y búsqueda */}
						<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
							<div className="flex flex-col lg:flex-row gap-4">
								<div className="flex-1">
									<div className="relative">
										<MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
										<input
											type="text"
											placeholder="Buscar plantillas de cálculo..."
											value={searchTerm}
											onChange={(e) => setSearchTerm(e.target.value)}
											className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
										/>
									</div>
								</div>

								<div className="flex items-center gap-3">
									<AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-500" />
									<button
										onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
										className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-200 ${
											showOnlyFavorites
												? "bg-secondary-50 border-secondary-300 text-secondary-700"
												: "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
										}`}
									>
										<StarIcon className="h-4 w-4" />
										Favoritos
									</button>
									<select
										value={sortBy}
										onChange={(e) => setSortBy(e.target.value)}
										className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
									>
										<option value="popular">Más Populares</option>
										<option value="rating">Mejor Calificados</option>
										<option value="name">Alfabético</option>
										<option value="recent">Recientemente Actualizados</option>
										<option value="difficulty">Por Dificultad</option>
									</select>
								</div>
							</div>
						</div>

						{/* Header de resultados */}
						{(selectedCategory || searchTerm) && (
							<div className="mb-6">
								<div className="flex items-center justify-between">
									<div>
										<h2 className="text-xl font-semibold text-gray-900">
											{selectedCategory
												? `${getSelectedCategoryData()?.name}${
														selectedSubcategory
															? ` - ${
																	categories
																		.find((c) => c.id === selectedCategory)
																		?.subcategories.find(
																			(s) => s.id === selectedSubcategory
																		)?.name
																}`
															: ""
													}`
												: "Resultados de búsqueda"}
										</h2>
										<p className="text-gray-600">
											{sortedTemplates.length} plantillas encontradas
										</p>
									</div>

									{selectedCategory && (
										<button
											onClick={() => {
												setSelectedCategory(null);
												setSelectedSubcategory(null);
											}}
											className="text-primary-600 hover:text-primary-700 text-sm font-medium"
										>
											Ver todas
										</button>
									)}
								</div>
							</div>
						)}

						{/* Grid de plantillas */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							{sortedTemplates.map((template, index) => (
								<div
									key={template.id}
									className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden animate-fade-in"
									style={{animationDelay: `${index * 0.05}s`}}
								>
									<div className="p-6">
										{/* Header */}
										<div className="flex items-start justify-between mb-4">
											<div className="flex items-center gap-3">
												<div className="h-12 w-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
													<template.icon className="h-6 w-6 text-white" />
												</div>
												<div>
													<div className="flex items-center gap-2 mb-1">
														{template.verified && (
															<CheckBadgeIcon className="h-4 w-4 text-green-600" />
														)}
														{template.isNew && (
															<span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
																NUEVO
															</span>
														)}
														{template.isCollaborative && (
															<span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
																COLABORATIVA
															</span>
														)}
													</div>
													<div className="flex items-center gap-2">
														<span
															className={`px-2 py-1 rounded-lg text-xs font-medium border ${getDifficultyColor(
																template.difficulty
															)}`}
														>
															{getDifficultyText(template.difficulty)}
														</span>
														<div className="flex items-center gap-1">
															<StarIcon className="h-3 w-3 text-yellow-500 fill-current" />
															<span className="text-xs text-gray-600">
																{template.rating}
															</span>
														</div>
													</div>
												</div>
											</div>

											<button
												onClick={() => toggleFavorite(template.id)}
												className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
											>
												{template.isFavorite ? (
													<StarSolidIcon className="h-4 w-4 text-secondary-500" />
												) : (
													<StarIcon className="h-4 w-4 text-gray-400" />
												)}
											</button>
										</div>

										{/* Contenido */}
										<h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
											{template.name}
										</h3>
										<p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
											{template.description}
										</p>

										{/* Metadata */}
										<div className="space-y-3 mb-4">
											<div className="flex items-center justify-between text-xs text-gray-500">
												<div className="flex items-center gap-1">
													<BookOpenIcon className="h-3 w-3" />
													<span>{template.necReference}</span>
												</div>
												<div className="flex items-center gap-1">
													<ClockIcon className="h-3 w-3" />
													<span>{template.estimatedTime}</span>
												</div>
											</div>
											<div className="flex items-center justify-between text-xs text-gray-500">
												<span>{template.usageCount} usos</span>
												<div className="flex items-center gap-1">
													<UserGroupIcon className="h-3 w-3" />
													<span>
														{template.profession.length} especialidad
														{template.profession.length > 1 ? "es" : ""}
													</span>
												</div>
											</div>
											{template.isCollaborative && template.createdBy && (
												<div className="text-xs text-purple-600">
													<span>Por: {template.createdBy}</span>
												</div>
											)}
										</div>

										{/* Requerimientos */}
										<div className="mb-4">
											<p className="text-xs font-medium text-gray-700 mb-2">
												Requerimientos:
											</p>
											<div className="flex flex-wrap gap-1">
												{template.requirements.slice(0, 2).map((req, idx) => (
													<span
														key={idx}
														className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
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

										{/* Botones de acción */}
										<div className="flex gap-2">
											<button
												onClick={() => handleUseTemplate(template)}
												className="flex-1 bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-700 hover:to-secondary-600 text-white py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2 font-medium"
											>
												<CalculatorIcon className="h-4 w-4" />
												<span>Usar Plantilla</span>
											</button>

											{template.shareLevel === "public" &&
												!template.isCollaborative && (
													<button
														onClick={() => handleSuggestChange(template)}
														className="px-3 py-3 border border-orange-300 text-orange-700 rounded-xl hover:bg-orange-50 transition-all duration-200 flex items-center justify-center"
														title="Sugerir mejora"
													>
														<LightBulbIcon className="h-4 w-4" />
													</button>
												)}
										</div>
									</div>
								</div>
							))}
						</div>

						{/* Estado vacío */}
						{sortedTemplates.length === 0 && (
							<div className="text-center py-16">
								<div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
									<CalculatorIcon className="h-12 w-12 text-gray-400" />
								</div>
								<h3 className="text-lg font-medium text-gray-900 mb-2">
									No se encontraron plantillas
								</h3>
								<p className="text-gray-600 mb-6">
									Intenta ajustar los filtros o términos de búsqueda.
								</p>
								<button
									onClick={() => {
										setSearchTerm("");
										setSelectedCategory(null);
										setSelectedSubcategory(null);
										setShowOnlyFavorites(false);
										setActiveTab("all");
									}}
									className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
								>
									Limpiar Filtros
								</button>
							</div>
						)}
					</div>
				</div>
			</div>

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

				.line-clamp-2 {
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					overflow: hidden;
				}

				/* Smooth transitions */
				* {
					transition-property: color, background-color, border-color, transform, opacity;
					transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
				}
			`}</style>
		</div>
	);
};

export default CalculationsCatalog;
