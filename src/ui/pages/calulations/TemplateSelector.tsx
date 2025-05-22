import React, {useState, useMemo} from "react";
import {
	MagnifyingGlassIcon,
	XMarkIcon,
	CheckBadgeIcon,
	ClockIcon,
	BookOpenIcon,
	UserGroupIcon,
	LightBulbIcon,
	ExclamationTriangleIcon,
	PlayIcon,
	DocumentTextIcon,
	EyeIcon,
	SparklesIcon,
} from "@heroicons/react/24/outline";
import {StarIcon as StarSolidIcon} from "@heroicons/react/24/solid";

// Tipos de datos
interface TemplateParameter {
	name: string;
	label: string;
	type: "number" | "select" | "text";
	unit?: string;
	required: boolean;
	description: string;
	typicalRange?: string;
}

interface CalculationTemplate {
	id: string;
	name: string;
	description: string;
	longDescription: string;
	category: "structural" | "electrical" | "architectural" | "hydraulic";
	subcategory: string;
	profession: string[];
	difficulty: "basic" | "intermediate" | "advanced";
	estimatedTime: string;
	necReference: string;
	necSection: string;
	verified: boolean;
	rating: number;
	usageCount: number;
	isFeatured: boolean;
	isNew: boolean;
	tags: string[];
	parameters: TemplateParameter[];
	sampleResults: {
		input: string;
		output: string;
		unit: string;
	};
	requirements: string[];
	applicationCases: string[];
	limitations: string[];
	relatedTemplates: string[];
	lastUpdated: string;
	version: string;
}

// Templates de ejemplo expandidos
const mockTemplates: CalculationTemplate[] = [
	{
		id: "str-beam-design",
		name: "Diseño de Vigas de Hormigón Armado",
		description:
			"Cálculo y verificación de vigas rectangulares y T según NEC-SE-HM",
		longDescription:
			"Esta plantilla permite el diseño integral de vigas de hormigón armado considerando cargas permanentes, variables y sísmicas. Incluye verificación por flexión, cortante y deflexiones según la normativa ecuatoriana NEC-SE-HM. El cálculo considera factores de seguridad, condiciones de servicio y durabilidad estructural.",
		category: "structural",
		subcategory: "concrete",
		profession: ["civil_engineer", "structural_engineer"],
		difficulty: "advanced",
		estimatedTime: "20-30 min",
		necReference: "NEC-SE-HM",
		necSection: "Capítulo 9 - Flexión y Carga Axial",
		verified: true,
		rating: 4.8,
		usageCount: 234,
		isFeatured: true,
		isNew: false,
		tags: ["hormigón", "vigas", "flexión", "cortante", "estructural"],
		parameters: [
			{
				name: "beamWidth",
				label: "Ancho de viga (b)",
				type: "number",
				unit: "cm",
				required: true,
				description: "Ancho de la sección transversal de la viga",
				typicalRange: "25-40 cm para vigas residenciales",
			},
			{
				name: "beamHeight",
				label: "Altura de viga (h)",
				type: "number",
				unit: "cm",
				required: true,
				description: "Altura total de la sección transversal",
				typicalRange: "40-80 cm según luz de viga",
			},
			{
				name: "concreteStrength",
				label: "Resistencia del hormigón (f'c)",
				type: "select",
				unit: "MPa",
				required: true,
				description: "Resistencia característica a compresión del hormigón",
			},
			{
				name: "steelGrade",
				label: "Grado del acero",
				type: "select",
				unit: "MPa",
				required: true,
				description: "Resistencia de fluencia del acero de refuerzo",
			},
		],
		sampleResults: {
			input: "Viga 30x60 cm, f'c=28 MPa",
			output: "4φ20 + 2φ16",
			unit: "refuerzo",
		},
		requirements: [
			"Geometría de la viga (ancho, altura, luz)",
			"Cargas aplicadas (permanentes y variables)",
			"Resistencia de materiales (f'c, fy)",
			"Condiciones de apoyo",
		],
		applicationCases: [
			"Vigas principales en edificaciones residenciales",
			"Vigas secundarias en estructuras comerciales",
			"Vigas de fundación y cimentación",
			"Elementos de puentes peatonales",
		],
		limitations: [
			"Aplicable solo a secciones rectangulares y T",
			"No considera efectos de pandeo lateral",
			"Válido para cargas estáticas y sísmicas básicas",
		],
		relatedTemplates: [
			"Diseño de Columnas",
			"Cálculo de Losas",
			"Análisis Sísmico",
		],
		lastUpdated: "2024-03-15",
		version: "2.1",
	},
	{
		id: "elec-demand-calc",
		name: "Demanda Eléctrica Residencial",
		description:
			"Cálculo de demanda eléctrica para viviendas según factores NEC-SB-IE",
		longDescription:
			"Herramienta completa para determinar la demanda eléctrica de instalaciones residenciales aplicando los factores de diversidad establecidos en la normativa ecuatoriana. Considera circuitos de iluminación, tomacorrientes, cargas especiales y sistemas de emergencia.",
		category: "electrical",
		subcategory: "demand",
		profession: ["electrical_engineer", "architect"],
		difficulty: "basic",
		estimatedTime: "8-12 min",
		necReference: "NEC-SB-IE",
		necSection: "Sección 1.1 - Cargas de Ocupaciones Residenciales",
		verified: true,
		rating: 4.9,
		usageCount: 342,
		isFeatured: true,
		isNew: false,
		tags: ["demanda", "residencial", "factores", "carga", "instalación"],
		parameters: [
			{
				name: "dwellingArea",
				label: "Área de vivienda",
				type: "number",
				unit: "m²",
				required: true,
				description: "Área construida total de la vivienda",
				typicalRange: "80-300 m² para viviendas estándar",
			},
			{
				name: "lightingCircuits",
				label: "Circuitos de iluminación",
				type: "number",
				unit: "unidades",
				required: true,
				description: "Número de circuitos dedicados a iluminación",
			},
		],
		sampleResults: {
			input: "Casa 150 m², 4 circuitos",
			output: "8,450",
			unit: "W",
		},
		requirements: [
			"Área construida de la vivienda",
			"Número y tipo de circuitos",
			"Cargas especiales instaladas",
		],
		applicationCases: [
			"Viviendas unifamiliares estándar",
			"Departamentos en edificios multifamiliares",
			"Casas con cargas especiales (piscinas, saunas)",
		],
		limitations: [
			"Aplicable solo a instalaciones residenciales",
			"No incluye cargas industriales o comerciales",
			"Requiere verificación para instalaciones especiales",
		],
		relatedTemplates: [
			"Cálculo de Conductores",
			"Sistema de Tierra",
			"Tableros",
		],
		lastUpdated: "2024-03-10",
		version: "1.8",
	},
	{
		id: "arch-area-calc",
		name: "Cálculo de Áreas Arquitectónicas",
		description:
			"Cómputo de áreas útiles, construidas y computables según NEC-HS-A",
		longDescription:
			"Calculadora especializada para determinar áreas arquitectónicas según definiciones normativas ecuatorianas. Incluye áreas útiles, construidas, computables y de circulación con aplicación automática de coeficientes y factores de ocupación.",
		category: "architectural",
		subcategory: "areas",
		profession: ["architect"],
		difficulty: "basic",
		estimatedTime: "5-10 min",
		necReference: "NEC-HS-A",
		necSection: "Artículo 15 - Definición de Áreas",
		verified: true,
		rating: 4.6,
		usageCount: 445,
		isFeatured: false,
		isNew: false,
		tags: ["áreas", "útil", "construida", "computable", "normativa"],
		parameters: [
			{
				name: "buildingType",
				label: "Tipo de edificación",
				type: "select",
				required: true,
				description: "Clasificación según uso de la edificación",
			},
			{
				name: "floorArea",
				label: "Área de planta",
				type: "number",
				unit: "m²",
				required: true,
				description: "Área bruta de la planta arquitectónica",
			},
		],
		sampleResults: {
			input: "Oficina 500 m² brutos",
			output: "425",
			unit: "m² útiles",
		},
		requirements: [
			"Planos arquitectónicos actualizados",
			"Definición del uso de la edificación",
			"Dimensiones precisas de espacios",
		],
		applicationCases: [
			"Edificios de oficinas y comerciales",
			"Viviendas multifamiliares",
			"Instalaciones educativas y de salud",
		],
		limitations: [
			"Requiere interpretación de planos arquitectónicos",
			"No incluye áreas exteriores o de estacionamiento",
			"Sujeto a interpretación normativa local",
		],
		relatedTemplates: ["Escaleras", "Ventilación", "Accesibilidad"],
		lastUpdated: "2024-02-20",
		version: "1.4",
	},
];

interface TemplateSelectorProps {
	isOpen: boolean;
	onClose: () => void;
	onSelectTemplate: (template: CalculationTemplate) => void;
	selectedCategory?: string;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
	isOpen,
	onClose,
	onSelectTemplate,
	selectedCategory,
}) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [filterCategory, setFilterCategory] = useState<string>(
		selectedCategory || ""
	);
	//setFilterDifficulty
	const [filterDifficulty] = useState<string>("");
	const [sortBy, setSortBy] = useState("popular");
	const [selectedTemplate, setSelectedTemplate] =
		useState<CalculationTemplate | null>(null);
	const [showPreview, setShowPreview] = useState(false);

	const categories = [
		{id: "structural", name: "Estructural", icon: "🏗️"},
		{id: "electrical", name: "Eléctrico", icon: "⚡"},
		{id: "architectural", name: "Arquitectónico", icon: "🏛️"},
		{id: "hydraulic", name: "Hidráulico", icon: "🚰"},
	];

	const difficulties = [
		{id: "basic", name: "Básico", color: "text-green-600"},
		{id: "intermediate", name: "Intermedio", color: "text-yellow-600"},
		{id: "advanced", name: "Avanzado", color: "text-red-600"},
	];

	const filteredTemplates = useMemo(() => {
		const filtered = mockTemplates.filter((template) => {
			const matchesSearch =
				template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
				template.tags.some((tag) =>
					tag.toLowerCase().includes(searchTerm.toLowerCase())
				);

			const matchesCategory =
				!filterCategory || template.category === filterCategory;
			const matchesDifficulty =
				!filterDifficulty || template.difficulty === filterDifficulty;

			return matchesSearch && matchesCategory && matchesDifficulty;
		});

		// Ordenar
		filtered.sort((a, b) => {
			switch (sortBy) {
				case "popular":
					return b.usageCount - a.usageCount;
				case "rating":
					return b.rating - a.rating;
				case "name":
					return a.name.localeCompare(b.name);
				case "recent":
					return (
						new Date(b.lastUpdated).getTime() -
						new Date(a.lastUpdated).getTime()
					);
				default:
					return 0;
			}
		});

		return filtered;
	}, [searchTerm, filterCategory, filterDifficulty, sortBy]);

	const getDifficultyBadge = (difficulty: string) => {
		const diffInfo = difficulties.find((d) => d.id === difficulty);
		if (!diffInfo) return null;

		return (
			<span className={`text-xs font-medium ${diffInfo.color}`}>
				{diffInfo.name}
			</span>
		);
	};

	const handlePreviewTemplate = (template: CalculationTemplate) => {
		setSelectedTemplate(template);
		setShowPreview(true);
	};

	const handleSelectTemplate = (template: CalculationTemplate) => {
		onSelectTemplate(template);
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
				{/* Header */}
				<div className="border-b border-gray-200 p-6">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-2xl font-bold text-gray-900">
								Seleccionar Plantilla de Cálculo
							</h2>
							<p className="text-gray-600 mt-1">
								Elige la plantilla que mejor se adapte a tus necesidades
								técnicas
							</p>
						</div>
						<button
							onClick={onClose}
							className="p-2 hover:bg-gray-100 rounded-full transition-colors"
						>
							<XMarkIcon className="h-6 w-6 text-gray-500" />
						</button>
					</div>
				</div>

				<div className="flex h-[calc(90vh-120px)]">
					{/* Panel izquierdo - Filtros y lista */}
					<div
						className={`${showPreview ? "w-1/2" : "w-full"} border-r border-gray-200 flex flex-col`}
					>
						{/* Filtros */}
						<div className="p-6 border-b border-gray-100 bg-gray-50">
							<div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
								<div className="lg:col-span-2">
									<div className="relative">
										<MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
										<input
											type="text"
											placeholder="Buscar plantillas..."
											value={searchTerm}
											onChange={(e) => setSearchTerm(e.target.value)}
											className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
										/>
									</div>
								</div>

								<select
									value={filterCategory}
									onChange={(e) => setFilterCategory(e.target.value)}
									className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
								>
									<option value="">Todas las categorías</option>
									{categories.map((cat) => (
										<option key={cat.id} value={cat.id}>
											{cat.icon} {cat.name}
										</option>
									))}
								</select>

								<select
									value={sortBy}
									onChange={(e) => setSortBy(e.target.value)}
									className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
								>
									<option value="popular">Más populares</option>
									<option value="rating">Mejor calificados</option>
									<option value="name">Alfabético</option>
									<option value="recent">Actualizados</option>
								</select>
							</div>
						</div>

						{/* Lista de plantillas */}
						<div className="flex-1 overflow-y-auto p-4">
							<div className="space-y-4">
								{filteredTemplates.map((template) => (
									<div
										key={template.id}
										className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer"
										onClick={() => handlePreviewTemplate(template)}
									>
										<div className="flex items-start justify-between mb-3">
											<div className="flex-1">
												<div className="flex items-center gap-2 mb-1">
													<h3 className="font-semibold text-gray-900 text-lg">
														{template.name}
													</h3>
													{template.verified && (
														<CheckBadgeIcon className="h-5 w-5 text-green-600" />
													)}
													{template.isFeatured && (
														<SparklesIcon className="h-4 w-4 text-secondary-500" />
													)}
													{template.isNew && (
														<span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
															NUEVO
														</span>
													)}
												</div>
												<p className="text-gray-600 text-sm mb-2 line-clamp-2">
													{template.description}
												</p>
											</div>
											{getDifficultyBadge(template.difficulty)}
										</div>

										<div className="flex items-center justify-between text-sm text-gray-500 mb-4">
											<div className="flex items-center gap-4">
												<div className="flex items-center gap-1">
													<BookOpenIcon className="h-4 w-4" />
													<span>{template.necReference}</span>
												</div>
												<div className="flex items-center gap-1">
													<ClockIcon className="h-4 w-4" />
													<span>{template.estimatedTime}</span>
												</div>
												<div className="flex items-center gap-1">
													<UserGroupIcon className="h-4 w-4" />
													<span>{template.usageCount} usos</span>
												</div>
											</div>
											<div className="flex items-center gap-1">
												<StarSolidIcon className="h-4 w-4 text-yellow-400" />
												<span className="font-medium">{template.rating}</span>
											</div>
										</div>

										<div className="flex items-center justify-between">
											<div className="flex flex-wrap gap-1">
												{template.tags.slice(0, 3).map((tag, index) => (
													<span
														key={index}
														className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
													>
														{tag}
													</span>
												))}
											</div>

											<div className="flex items-center gap-2">
												<button
													onClick={(e) => {
														e.stopPropagation();
														handlePreviewTemplate(template);
													}}
													className="px-3 py-1 text-primary-600 hover:bg-primary-50 rounded-lg text-sm transition-colors flex items-center gap-1"
												>
													<EyeIcon className="h-4 w-4" />
													Vista previa
												</button>
												<button
													onClick={(e) => {
														e.stopPropagation();
														handleSelectTemplate(template);
													}}
													className="px-4 py-1 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 transition-colors flex items-center gap-1"
												>
													<PlayIcon className="h-4 w-4" />
													Usar
												</button>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Panel derecho - Vista previa */}
					{showPreview && selectedTemplate && (
						<div className="w-1/2 flex flex-col">
							<div className="p-6 border-b border-gray-100 bg-gray-50">
								<div className="flex items-center justify-between">
									<h3 className="text-xl font-semibold text-gray-900">
										Vista Previa Detallada
									</h3>
									<button
										onClick={() => setShowPreview(false)}
										className="p-1 hover:bg-gray-200 rounded transition-colors"
									>
										<XMarkIcon className="h-4 w-4 text-gray-500" />
									</button>
								</div>
							</div>

							<div className="flex-1 overflow-y-auto p-6">
								<div className="space-y-6">
									{/* Header */}
									<div>
										<div className="flex items-center gap-2 mb-2">
											<h2 className="text-2xl font-bold text-gray-900">
												{selectedTemplate.name}
											</h2>
											{selectedTemplate.verified && (
												<CheckBadgeIcon className="h-6 w-6 text-green-600" />
											)}
										</div>
										<p className="text-gray-600 mb-4">
											{selectedTemplate.longDescription}
										</p>

										<div className="flex items-center gap-4 text-sm">
											<div className="flex items-center gap-1">
												<BookOpenIcon className="h-4 w-4 text-primary-600" />
												<span className="font-medium">
													{selectedTemplate.necSection}
												</span>
											</div>
											<div className="flex items-center gap-1">
												<DocumentTextIcon className="h-4 w-4 text-gray-500" />
												<span>v{selectedTemplate.version}</span>
											</div>
										</div>
									</div>

									{/* Parámetros */}
									<div>
										<h4 className="text-lg font-semibold text-gray-900 mb-3">
											Parámetros Requeridos
										</h4>
										<div className="space-y-3">
											{selectedTemplate.parameters.map((param, index) => (
												<div
													key={index}
													className="border border-gray-200 rounded-lg p-4"
												>
													<div className="flex items-center justify-between mb-2">
														<span className="font-medium text-gray-900">
															{param.label}
														</span>
														{param.required && (
															<span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
																Requerido
															</span>
														)}
													</div>
													<p className="text-sm text-gray-600 mb-2">
														{param.description}
													</p>
													{param.typicalRange && (
														<div className="flex items-center gap-1 text-xs text-primary-600">
															<LightBulbIcon className="h-3 w-3" />
															<span>{param.typicalRange}</span>
														</div>
													)}
												</div>
											))}
										</div>
									</div>

									{/* Ejemplo de resultados */}
									<div>
										<h4 className="text-lg font-semibold text-gray-900 mb-3">
											Ejemplo de Resultados
										</h4>
										<div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-4">
											<div className="text-sm text-gray-600 mb-1">
												Entrada: {selectedTemplate.sampleResults.input}
											</div>
											<div className="text-lg font-bold text-primary-700">
												{selectedTemplate.sampleResults.output}{" "}
												{selectedTemplate.sampleResults.unit}
											</div>
										</div>
									</div>

									{/* Casos de aplicación */}
									<div>
										<h4 className="text-lg font-semibold text-gray-900 mb-3">
											Casos de Aplicación
										</h4>
										<ul className="space-y-2">
											{selectedTemplate.applicationCases.map(
												(useCase, index) => (
													<li
														key={index}
														className="flex items-start gap-2 text-sm text-gray-600"
													>
														<div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2" />
														<span>{useCase}</span>
													</li>
												)
											)}
										</ul>
									</div>

									{/* Limitaciones */}
									<div>
										<h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
											<ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
											Limitaciones
										</h4>
										<ul className="space-y-2">
											{selectedTemplate.limitations.map((limitation, index) => (
												<li
													key={index}
													className="flex items-start gap-2 text-sm text-gray-600"
												>
													<div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2" />
													<span>{limitation}</span>
												</li>
											))}
										</ul>
									</div>

									{/* Plantillas relacionadas */}
									<div>
										<h4 className="text-lg font-semibold text-gray-900 mb-3">
											Plantillas Relacionadas
										</h4>
										<div className="flex flex-wrap gap-2">
											{selectedTemplate.relatedTemplates.map(
												(related, index) => (
													<span
														key={index}
														className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 cursor-pointer transition-colors"
													>
														{related}
													</span>
												)
											)}
										</div>
									</div>
								</div>
							</div>

							{/* Acciones */}
							<div className="p-6 border-t border-gray-100 bg-gray-50">
								<div className="flex justify-end gap-3">
									<button
										onClick={() => setShowPreview(false)}
										className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
									>
										Cerrar Vista Previa
									</button>
									<button
										onClick={() => handleSelectTemplate(selectedTemplate)}
										className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
									>
										<PlayIcon className="h-4 w-4" />
										Usar Esta Plantilla
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			<style>{`
				.line-clamp-2 {
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					overflow: hidden;
				}
			`}</style>
		</div>
	);
};

export default TemplateSelector;
