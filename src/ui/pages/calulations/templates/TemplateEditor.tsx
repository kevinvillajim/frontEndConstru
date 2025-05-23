import React, {useState, useEffect} from "react";
import {useNavigate, useParams, useLocation} from "react-router-dom";
import {
	ArrowLeftIcon,
	PlusIcon,
	CheckIcon,
	DocumentTextIcon,
	CpuChipIcon,
	ExclamationTriangleIcon,
	BookOpenIcon,
	TagIcon,
	UserGroupIcon,
	ClockIcon,
} from "@heroicons/react/24/outline";

// Componentes modulares
import ParameterEditor from "./components/ParameterEditor";

// Types y hooks
import type {
	TemplateFormData,
	TemplateParameter,
	MyCalculationTemplate,
} from "../shared/types/template.types";
import {useTemplates} from "../shared/hooks/useTemplates";

// Configuración de opciones
const categories = [
	{
		id: "structural",
		name: "Estructural",
		description: "Cálculos de estructuras y resistencia",
	},
	{
		id: "electrical",
		name: "Eléctrico",
		description: "Instalaciones y sistemas eléctricos",
	},
	{
		id: "architectural",
		name: "Arquitectónico",
		description: "Diseño y espacios arquitectónicos",
	},
	{
		id: "hydraulic",
		name: "Hidráulico",
		description: "Sistemas de agua y drenaje",
	},
	{
		id: "custom",
		name: "Personalizada",
		description: "Cálculos específicos del usuario",
	},
];

const subcategoriesByCategory = {
	structural: [
		{id: "seismic", name: "Análisis Sísmico"},
		{id: "concrete", name: "Hormigón Armado"},
		{id: "steel", name: "Acero Estructural"},
		{id: "foundations", name: "Cimentaciones"},
		{id: "timber", name: "Estructuras de Madera"},
	],
	electrical: [
		{id: "demand", name: "Demanda Eléctrica"},
		{id: "conductors", name: "Conductores"},
		{id: "grounding", name: "Puesta a Tierra"},
		{id: "lighting", name: "Iluminación"},
		{id: "protection", name: "Protecciones"},
	],
	architectural: [
		{id: "areas", name: "Cálculo de Áreas"},
		{id: "circulation", name: "Circulación"},
		{id: "environmental", name: "Confort Ambiental"},
		{id: "accessibility", name: "Accesibilidad"},
		{id: "parking", name: "Estacionamientos"},
	],
	hydraulic: [
		{id: "piping", name: "Tuberías"},
		{id: "pumps", name: "Equipos de Bombeo"},
		{id: "drainage", name: "Desagües"},
		{id: "treatment", name: "Tratamiento de Aguas"},
	],
	custom: [
		{id: "general", name: "General"},
		{id: "specific", name: "Específico"},
	],
};

const professions = [
	{id: "architect", name: "Arquitecto", icon: "🏛️"},
	{id: "civil_engineer", name: "Ingeniero Civil", icon: "🏗️"},
	{id: "structural_engineer", name: "Ingeniero Estructural", icon: "⚡"},
	{id: "electrical_engineer", name: "Ingeniero Eléctrico", icon: "⚡"},
	{id: "mechanical_engineer", name: "Ingeniero Mecánico", icon: "⚙️"},
	{id: "contractor", name: "Contratista", icon: "👷"},
];

const TemplateEditor: React.FC = () => {
	const navigate = useNavigate();
	const {templateId} = useParams<{templateId: string}>();
	const location = useLocation();
	const existingTemplate = location.state?.template;

	// Hooks
	const {createTemplate, updateTemplate} = useTemplates({
		autoLoad: false,
	});

	// Estado del formulario
	const [formData, setFormData] = useState<TemplateFormData>({
		name: "",
		description: "",
		longDescription: "",
		category: "",
		subcategory: "",
		targetProfessions: [],
		difficulty: "basic",
		estimatedTime: "",
		necReference: "",
		tags: [],
		isPublic: false,
		parameters: [],
		formula: "",
		requirements: [],
		applicationCases: [],
		limitations: [],
	});

	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [currentStep, setCurrentStep] = useState(0);

	// Estados para inputs dinámicos
	const [newTag, setNewTag] = useState("");
	const [newRequirement, setNewRequirement] = useState("");
	const [newApplicationCase, setNewApplicationCase] = useState("");
	const [newLimitation, setNewLimitation] = useState("");

	const isEditing = Boolean(templateId && existingTemplate);

	// Inicializar con datos existentes si es edición
	useEffect(() => {
		if (existingTemplate) {
			setFormData({
				name: existingTemplate.name || "",
				description: existingTemplate.description || "",
				longDescription: existingTemplate.longDescription || "",
				category: existingTemplate.category || "",
				subcategory: existingTemplate.subcategory || "",
				targetProfessions: existingTemplate.targetProfessions || [],
				difficulty: existingTemplate.difficulty || "basic",
				estimatedTime: existingTemplate.estimatedTime || "",
				necReference: existingTemplate.necReference || "",
				tags: existingTemplate.tags || [],
				isPublic: existingTemplate.isPublic || false,
				parameters: existingTemplate.parameters || [],
				formula:
					typeof existingTemplate.formula === "string"
						? existingTemplate.formula
						: "",
				requirements: existingTemplate.requirements || [],
				applicationCases: existingTemplate.applicationCases || [],
				limitations: existingTemplate.limitations || [],
			});
		}
	}, [existingTemplate]);

	// Manejadores de cambio
	const handleInputChange = (field: keyof TemplateFormData, value: any) => {
		setFormData((prev) => ({...prev, [field]: value}));
		// Limpiar error si existe
		if (errors[field]) {
			setErrors((prev) => ({...prev, [field]: ""}));
		}
	};

	const handleCategoryChange = (category: string) => {
		setFormData((prev) => ({
			...prev,
			category,
			subcategory: "", // Reset subcategory cuando cambia la categoría
		}));
	};

	// Manejo de arrays dinámicos
	const addToArray = (field: keyof TemplateFormData, value: string) => {
		if (value.trim()) {
			const currentArray = formData[field] as string[];
			if (!currentArray.includes(value.trim())) {
				setFormData((prev) => ({
					...prev,
					[field]: [...currentArray, value.trim()],
				}));
			}
		}
	};

	const removeFromArray = (field: keyof TemplateFormData, index: number) => {
		const currentArray = formData[field] as string[];
		setFormData((prev) => ({
			...prev,
			[field]: currentArray.filter((_, i) => i !== index),
		}));
	};

	// Manejo de parámetros
	const addParameter = () => {
		const newParameter: TemplateParameter = {
			id: `param_${Date.now()}`,
			name: "",
			label: "",
			type: "number",
			required: false,
		};
		setFormData((prev) => ({
			...prev,
			parameters: [...prev.parameters, newParameter],
		}));
	};

	const updateParameter = (
		index: number,
		field: keyof TemplateParameter,
		value: any
	) => {
		const updatedParameters = [...formData.parameters];
		updatedParameters[index] = {...updatedParameters[index], [field]: value};
		setFormData((prev) => ({...prev, parameters: updatedParameters}));
	};

	const removeParameter = (index: number) => {
		setFormData((prev) => ({
			...prev,
			parameters: prev.parameters.filter((_, i) => i !== index),
		}));
	};

	// Validación
	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		// Validaciones básicas
		if (!formData.name.trim()) newErrors.name = "El nombre es requerido";
		if (!formData.description.trim())
			newErrors.description = "La descripción es requerida";
		if (!formData.category) newErrors.category = "La categoría es requerida";
		if (formData.targetProfessions.length === 0) {
			newErrors.targetProfessions = "Debe seleccionar al menos una profesión";
		}

		// Validar parámetros
		formData.parameters.forEach((param, index) => {
			if (!param.name.trim()) {
				newErrors[`param_${index}_name`] = "Nombre del parámetro requerido";
			}
			if (!param.label.trim()) {
				newErrors[`param_${index}_label`] = "Etiqueta del parámetro requerida";
			}
			if (
				param.type === "select" &&
				(!param.options || param.options.length === 0)
			) {
				newErrors[`param_${index}_options`] =
					"Las opciones son requeridas para listas de selección";
			}
		});

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// Envío del formulario
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setIsSubmitting(true);

		try {
			const templateData: Partial<MyCalculationTemplate> = {
				...formData,
				version: isEditing
					? String(Number(existingTemplate?.version || "1.0") + 0.1)
					: "1.0",
				status: "draft",
			};

			if (isEditing && templateId) {
				await updateTemplate(templateId, templateData);
			} else {
				await createTemplate(templateData);
			}

			// Redirigir con mensaje de éxito
			navigate("/calculations/templates", {
				state: {
					message: `Plantilla ${isEditing ? "actualizada" : "creada"} exitosamente`,
				},
			});
		} catch (error) {
			console.error("Error al guardar plantilla:", error);
			setErrors({submit: "Error al guardar la plantilla. Intenta nuevamente."});
		} finally {
			setIsSubmitting(false);
		}
	};

	// Pasos del formulario
	const steps = [
		{id: 0, name: "Información Básica", icon: DocumentTextIcon},
		{id: 1, name: "Categorización", icon: TagIcon},
		{id: 2, name: "Parámetros", icon: CpuChipIcon},
		{id: 3, name: "Detalles Técnicos", icon: BookOpenIcon},
		{id: 4, name: "Configuración", icon: UserGroupIcon},
	];

	const isStepValid = (step: number): boolean => {
		switch (step) {
			case 0:
				return !!(formData.name && formData.description);
			case 1:
				return !!(formData.category && formData.targetProfessions.length > 0);
			case 2:
				return true; // Los parámetros son opcionales
			case 3:
				return true; // Los detalles técnicos son opcionales
			case 4:
				return true; // La configuración siempre es válida
			default:
				return false;
		}
	};

	const availableSubcategories = formData.category
		? subcategoriesByCategory[
				formData.category as keyof typeof subcategoriesByCategory
			] || []
		: [];

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white border-b border-gray-200">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<div className="flex items-center gap-4">
						<button
							onClick={() => navigate("/calculations/templates")}
							className="p-2 hover:bg-gray-100 rounded-full transition-colors"
						>
							<ArrowLeftIcon className="h-5 w-5 text-gray-600" />
						</button>
						<div>
							<h1 className="text-2xl font-bold text-gray-900">
								{isEditing ? "Editar Plantilla" : "Nueva Plantilla"}
							</h1>
							<p className="text-gray-600">
								{isEditing
									? "Modifica tu plantilla existente"
									: "Crea una nueva plantilla de cálculo personalizada"}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Progress Steps */}
			<div className="bg-white border-b border-gray-200">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center justify-between">
						{steps.map((step, index) => (
							<div key={step.id} className="flex items-center">
								<button
									onClick={() => setCurrentStep(step.id)}
									className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
										currentStep === step.id
											? "bg-primary-100 text-primary-700"
											: isStepValid(step.id)
												? "text-green-700 hover:bg-green-50"
												: "text-gray-500 hover:bg-gray-50"
									}`}
								>
									<step.icon className="h-4 w-4" />
									<span className="hidden sm:inline">{step.name}</span>
									{isStepValid(step.id) && currentStep !== step.id && (
										<CheckIcon className="h-3 w-3 text-green-600" />
									)}
								</button>
								{index < steps.length - 1 && (
									<div className="h-px bg-gray-300 w-8 mx-2" />
								)}
							</div>
						))}
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
					{/* Paso 0: Información Básica */}
					{currentStep === 0 && (
						<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
							<h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
								<DocumentTextIcon className="h-5 w-5 text-primary-600" />
								Información Básica
							</h2>

							<div className="space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="md:col-span-2">
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Nombre de la plantilla *
										</label>
										<input
											type="text"
											value={formData.name}
											onChange={(e) =>
												handleInputChange("name", e.target.value)
											}
											placeholder="ej: Cálculo de Escaleras Residenciales"
											className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
												errors.name ? "border-red-500" : "border-gray-300"
											}`}
										/>
										{errors.name && (
											<p className="text-red-600 text-xs mt-1">{errors.name}</p>
										)}
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Tiempo estimado
										</label>
										<div className="relative">
											<ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
											<input
												type="text"
												value={formData.estimatedTime}
												onChange={(e) =>
													handleInputChange("estimatedTime", e.target.value)
												}
												placeholder="ej: 10-15 min"
												className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
											/>
										</div>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Referencia normativa
										</label>
										<div className="relative">
											<BookOpenIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
											<input
												type="text"
												value={formData.necReference}
												onChange={(e) =>
													handleInputChange("necReference", e.target.value)
												}
												placeholder="ej: NEC-SE-DS, Cap. 2"
												className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
											/>
										</div>
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Descripción breve *
									</label>
									<textarea
										value={formData.description}
										onChange={(e) =>
											handleInputChange("description", e.target.value)
										}
										rows={3}
										placeholder="Descripción concisa de qué calcula esta plantilla..."
										className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
											errors.description ? "border-red-500" : "border-gray-300"
										}`}
									/>
									{errors.description && (
										<p className="text-red-600 text-xs mt-1">
											{errors.description}
										</p>
									)}
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Descripción detallada
									</label>
									<textarea
										value={formData.longDescription}
										onChange={(e) =>
											handleInputChange("longDescription", e.target.value)
										}
										rows={4}
										placeholder="Descripción técnica detallada, casos de uso, metodología..."
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
									/>
								</div>
							</div>
						</div>
					)}

					{/* Paso 1: Categorización */}
					{currentStep === 1 && (
						<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
							<h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
								<TagIcon className="h-5 w-5 text-primary-600" />
								Categorización y Audiencia
							</h2>

							<div className="space-y-6">
								{/* Categoría */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-3">
										Categoría principal *
									</label>
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
										{categories.map((category) => (
											<button
												key={category.id}
												type="button"
												onClick={() => handleCategoryChange(category.id)}
												className={`p-4 rounded-lg border-2 text-left transition-all ${
													formData.category === category.id
														? "border-primary-500 bg-primary-50"
														: "border-gray-200 hover:border-gray-300"
												}`}
											>
												<h3 className="font-medium text-gray-900 mb-1">
													{category.name}
												</h3>
												<p className="text-sm text-gray-600">
													{category.description}
												</p>
											</button>
										))}
									</div>
									{errors.category && (
										<p className="text-red-600 text-xs mt-1">
											{errors.category}
										</p>
									)}
								</div>

								{/* Subcategoría */}
								{formData.category && availableSubcategories.length > 0 && (
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Subcategoría
										</label>
										<select
											value={formData.subcategory}
											onChange={(e) =>
												handleInputChange("subcategory", e.target.value)
											}
											className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
										>
											<option value="">Seleccionar subcategoría...</option>
											{availableSubcategories.map((subcat) => (
												<option key={subcat.id} value={subcat.id}>
													{subcat.name}
												</option>
											))}
										</select>
									</div>
								)}

								{/* Profesiones objetivo */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-3">
										Profesiones objetivo *
									</label>
									<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
										{professions.map((prof) => (
											<label
												key={prof.id}
												className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
											>
												<input
													type="checkbox"
													checked={formData.targetProfessions.includes(prof.id)}
													onChange={(e) => {
														if (e.target.checked) {
															handleInputChange("targetProfessions", [
																...formData.targetProfessions,
																prof.id,
															]);
														} else {
															handleInputChange(
																"targetProfessions",
																formData.targetProfessions.filter(
																	(p) => p !== prof.id
																)
															);
														}
													}}
													className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
												/>
												<span className="ml-3 text-sm">
													<span className="mr-1">{prof.icon}</span>
													{prof.name}
												</span>
											</label>
										))}
									</div>
									{errors.targetProfessions && (
										<p className="text-red-600 text-xs mt-1">
											{errors.targetProfessions}
										</p>
									)}
								</div>

								{/* Dificultad */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-3">
										Nivel de dificultad
									</label>
									<div className="grid grid-cols-3 gap-4">
										{[
											{
												id: "basic",
												name: "Básico",
												desc: "Conceptos fundamentales",
											},
											{
												id: "intermediate",
												name: "Intermedio",
												desc: "Conocimiento técnico",
											},
											{
												id: "advanced",
												name: "Avanzado",
												desc: "Experiencia especializada",
											},
										].map((level) => (
											<button
												key={level.id}
												type="button"
												onClick={() =>
													handleInputChange("difficulty", level.id)
												}
												className={`p-3 rounded-lg border-2 text-center transition-all ${
													formData.difficulty === level.id
														? "border-primary-500 bg-primary-50"
														: "border-gray-200 hover:border-gray-300"
												}`}
											>
												<div className="font-medium text-gray-900">
													{level.name}
												</div>
												<div className="text-xs text-gray-600 mt-1">
													{level.desc}
												</div>
											</button>
										))}
									</div>
								</div>

								{/* Tags */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Etiquetas
									</label>
									<div className="flex flex-wrap gap-2 mb-3">
										{formData.tags.map((tag, index) => (
											<span
												key={index}
												className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
											>
												{tag}
												<button
													type="button"
													onClick={() => removeFromArray("tags", index)}
													className="ml-1 hover:text-primary-900"
												>
													×
												</button>
											</span>
										))}
									</div>
									<div className="flex gap-2">
										<input
											type="text"
											value={newTag}
											onChange={(e) => setNewTag(e.target.value)}
											placeholder="Agregar etiqueta"
											className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
											onKeyPress={(e) => {
												if (e.key === "Enter") {
													e.preventDefault();
													addToArray("tags", newTag);
													setNewTag("");
												}
											}}
										/>
										<button
											type="button"
											onClick={() => {
												addToArray("tags", newTag);
												setNewTag("");
											}}
											className="px-3 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors text-sm"
										>
											Agregar
										</button>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Paso 2: Parámetros */}
					{currentStep === 2 && (
						<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
									<CpuChipIcon className="h-5 w-5 text-primary-600" />
									Parámetros de Entrada
								</h2>
								<button
									type="button"
									onClick={addParameter}
									className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
								>
									<PlusIcon className="h-4 w-4" />
									Agregar Parámetro
								</button>
							</div>

							<div className="space-y-6">
								{formData.parameters.length === 0 ? (
									<div className="text-center py-12 text-gray-500">
										<CpuChipIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
										<h3 className="text-lg font-medium text-gray-900 mb-2">
											No hay parámetros definidos
										</h3>
										<p className="mb-4">
											Los parámetros permiten que los usuarios ingresen datos
											específicos para el cálculo
										</p>
										<button
											type="button"
											onClick={addParameter}
											className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
										>
											<PlusIcon className="h-4 w-4" />
											Crear Primer Parámetro
										</button>
									</div>
								) : (
									formData.parameters.map((param, index) => (
										<ParameterEditor
											key={param.id}
											parameter={param}
											index={index}
											errors={errors}
											onUpdate={updateParameter}
											onRemove={removeParameter}
										/>
									))
								)}
							</div>
						</div>
					)}

					{/* Paso 3: Detalles Técnicos */}
					{currentStep === 3 && (
						<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
							<h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
								<BookOpenIcon className="h-5 w-5 text-primary-600" />
								Detalles Técnicos
							</h2>

							<div className="space-y-6">
								{/* Fórmula */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Fórmula o metodología de cálculo
									</label>
									<textarea
										value={formData.formula}
										onChange={(e) =>
											handleInputChange("formula", e.target.value)
										}
										rows={6}
										placeholder="Describe la fórmula, ecuaciones, o proceso de cálculo paso a paso..."
										className="w-full px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
									/>
									<p className="text-xs text-gray-500 mt-1">
										Puedes usar notación matemática, variables de parámetros, y
										descripciones paso a paso
									</p>
								</div>

								{/* Requisitos */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Requisitos y consideraciones
									</label>
									<div className="space-y-2">
										{formData.requirements.map((req, index) => (
											<div
												key={index}
												className="flex items-center gap-2 p-2 bg-gray-50 rounded"
											>
												<span className="flex-1 text-sm">{req}</span>
												<button
													type="button"
													onClick={() => removeFromArray("requirements", index)}
													className="text-red-600 hover:text-red-800"
												>
													<ExclamationTriangleIcon className="h-4 w-4" />
												</button>
											</div>
										))}
									</div>
									<div className="flex gap-2 mt-2">
										<input
											type="text"
											value={newRequirement}
											onChange={(e) => setNewRequirement(e.target.value)}
											placeholder="Agregar requisito"
											className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
											onKeyPress={(e) => {
												if (e.key === "Enter") {
													e.preventDefault();
													addToArray("requirements", newRequirement);
													setNewRequirement("");
												}
											}}
										/>
										<button
											type="button"
											onClick={() => {
												addToArray("requirements", newRequirement);
												setNewRequirement("");
											}}
											className="px-3 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors text-sm"
										>
											Agregar
										</button>
									</div>
								</div>

								{/* Casos de aplicación */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Casos de aplicación
									</label>
									<div className="space-y-2">
										{formData.applicationCases.map((case_, index) => (
											<div
												key={index}
												className="flex items-center gap-2 p-2 bg-green-50 rounded"
											>
												<span className="flex-1 text-sm">{case_}</span>
												<button
													type="button"
													onClick={() =>
														removeFromArray("applicationCases", index)
													}
													className="text-red-600 hover:text-red-800"
												>
													×
												</button>
											</div>
										))}
									</div>
									<div className="flex gap-2 mt-2">
										<input
											type="text"
											value={newApplicationCase}
											onChange={(e) => setNewApplicationCase(e.target.value)}
											placeholder="Agregar caso de uso"
											className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
											onKeyPress={(e) => {
												if (e.key === "Enter") {
													e.preventDefault();
													addToArray("applicationCases", newApplicationCase);
													setNewApplicationCase("");
												}
											}}
										/>
										<button
											type="button"
											onClick={() => {
												addToArray("applicationCases", newApplicationCase);
												setNewApplicationCase("");
											}}
											className="px-3 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors text-sm"
										>
											Agregar
										</button>
									</div>
								</div>

								{/* Limitaciones */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Limitaciones y advertencias
									</label>
									<div className="space-y-2">
										{formData.limitations.map((limitation, index) => (
											<div
												key={index}
												className="flex items-center gap-2 p-2 bg-yellow-50 rounded"
											>
												<span className="flex-1 text-sm">{limitation}</span>
												<button
													type="button"
													onClick={() => removeFromArray("limitations", index)}
													className="text-red-600 hover:text-red-800"
												>
													×
												</button>
											</div>
										))}
									</div>
									<div className="flex gap-2 mt-2">
										<input
											type="text"
											value={newLimitation}
											onChange={(e) => setNewLimitation(e.target.value)}
											placeholder="Agregar limitación"
											className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
											onKeyPress={(e) => {
												if (e.key === "Enter") {
													e.preventDefault();
													addToArray("limitations", newLimitation);
													setNewLimitation("");
												}
											}}
										/>
										<button
											type="button"
											onClick={() => {
												addToArray("limitations", newLimitation);
												setNewLimitation("");
											}}
											className="px-3 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors text-sm"
										>
											Agregar
										</button>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Paso 4: Configuración */}
					{currentStep === 4 && (
						<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
							<h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
								<UserGroupIcon className="h-5 w-5 text-primary-600" />
								Configuración y Permisos
							</h2>

							<div className="space-y-6">
								<div className="border border-gray-200 rounded-lg p-4">
									<div className="flex items-start gap-3">
										<input
											id="isPublic"
											type="checkbox"
											checked={formData.isPublic}
											onChange={(e) =>
												handleInputChange("isPublic", e.target.checked)
											}
											className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
										/>
										<div>
											<label
												htmlFor="isPublic"
												className="text-sm font-medium text-gray-900"
											>
												Plantilla pública
											</label>
											<p className="text-sm text-gray-600 mt-1">
												Al marcar esta opción, tu plantilla estará disponible en
												el catálogo público para otros profesionales. Recibirás
												reconocimiento como autor y contribuciones de la
												comunidad.
											</p>
											{formData.isPublic && (
												<div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
													<p className="text-sm text-blue-800">
														<strong>Nota:</strong> Las plantillas públicas pasan
														por un proceso de revisión antes de ser publicadas.
														Mantienen tu autoría y puedes retirarlas del
														catálogo en cualquier momento.
													</p>
												</div>
											)}
										</div>
									</div>
								</div>

								{/* Resumen de la plantilla */}
								<div className="bg-gray-50 rounded-lg p-4">
									<h3 className="text-sm font-medium text-gray-900 mb-3">
										Resumen de la plantilla
									</h3>
									<div className="grid grid-cols-2 gap-4 text-sm">
										<div>
											<span className="text-gray-600">Nombre:</span>
											<span className="ml-2 font-medium">
												{formData.name || "Sin nombre"}
											</span>
										</div>
										<div>
											<span className="text-gray-600">Categoría:</span>
											<span className="ml-2 font-medium">
												{categories.find((c) => c.id === formData.category)
													?.name || "Sin categoría"}
											</span>
										</div>
										<div>
											<span className="text-gray-600">Dificultad:</span>
											<span className="ml-2 font-medium">
												{formData.difficulty === "basic"
													? "Básico"
													: formData.difficulty === "intermediate"
														? "Intermedio"
														: "Avanzado"}
											</span>
										</div>
										<div>
											<span className="text-gray-600">Parámetros:</span>
											<span className="ml-2 font-medium">
												{formData.parameters.length}
											</span>
										</div>
										<div>
											<span className="text-gray-600">Profesiones:</span>
											<span className="ml-2 font-medium">
												{formData.targetProfessions.length}
											</span>
										</div>
										<div>
											<span className="text-gray-600">Etiquetas:</span>
											<span className="ml-2 font-medium">
												{formData.tags.length}
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Navegación entre pasos y botones de acción */}
					<div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
						<div className="flex gap-3">
							{currentStep > 0 && (
								<button
									type="button"
									onClick={() => setCurrentStep(currentStep - 1)}
									className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
								>
									← Anterior
								</button>
							)}
						</div>

						<div className="flex gap-3">
							<button
								type="button"
								onClick={() => navigate("/calculations/templates")}
								className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
							>
								Cancelar
							</button>

							{currentStep < steps.length - 1 ? (
								<button
									type="button"
									onClick={() => setCurrentStep(currentStep + 1)}
									disabled={!isStepValid(currentStep)}
									className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								>
									Siguiente →
								</button>
							) : (
								<button
									type="submit"
									disabled={isSubmitting || !validateForm()}
									className="px-8 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
								>
									{isSubmitting ? (
										<>
											<div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent" />
											Guardando...
										</>
									) : (
										<>
											<CheckIcon className="h-4 w-4" />
											{isEditing ? "Actualizar" : "Crear"} Plantilla
										</>
									)}
								</button>
							)}
						</div>
					</div>

					{/* Errores del formulario */}
					{errors.submit && (
						<div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
							<p className="text-red-800 text-sm">{errors.submit}</p>
						</div>
					)}
				</form>
			</div>
		</div>
	);
};

export default TemplateEditor;
