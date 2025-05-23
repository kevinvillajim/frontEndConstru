import React, {useState, useEffect} from "react";
import {useNavigate, useParams, useLocation} from "react-router-dom";
import {
	ArrowLeftIcon,
	PlusIcon,
	TrashIcon,
	CheckIcon,
	DocumentTextIcon,
	CpuChipIcon,
} from "@heroicons/react/24/outline";

// Interfaces
interface TemplateParameter {
	id: string;
	name: string;
	label: string;
	type: "number" | "select" | "text";
	unit?: string;
	required: boolean;
	defaultValue?: string | number;
	options?: string[];
	min?: number;
	max?: number;
	placeholder?: string;
	tooltip?: string;
	typicalRange?: string;
}

interface TemplateFormData {
	name: string;
	description: string;
	longDescription: string;
	category: string;
	subcategory: string;
	targetProfessions: string[];
	difficulty: "basic" | "intermediate" | "advanced";
	estimatedTime: string;
	necReference: string;
	tags: string[];
	isPublic: boolean;
	parameters: TemplateParameter[];
	formula: string;
	requirements: string[];
	applicationCases: string[];
	limitations: string[];
}

const TemplateEditor: React.FC = () => {
	const navigate = useNavigate();
	const {templateId} = useParams<{templateId: string}>();
	const location = useLocation();
	const existingTemplate = location.state?.template;

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
	const [showPreview, setShowPreview] = useState(false);

	// Configuraciones de opciones
	const categories = [
		{id: "structural", name: "Estructural"},
		{id: "electrical", name: "Eléctrico"},
		{id: "architectural", name: "Arquitectónico"},
		{id: "hydraulic", name: "Hidráulico"},
		{id: "custom", name: "Personalizada"},
	];

	const subcategories = {
		structural: [
			{id: "seismic", name: "Análisis Sísmico"},
			{id: "concrete", name: "Hormigón Armado"},
			{id: "steel", name: "Acero Estructural"},
			{id: "foundations", name: "Cimentaciones"},
		],
		electrical: [
			{id: "demand", name: "Demanda Eléctrica"},
			{id: "conductors", name: "Conductores"},
			{id: "grounding", name: "Puesta a Tierra"},
			{id: "lighting", name: "Iluminación"},
		],
		architectural: [
			{id: "areas", name: "Cálculo de Áreas"},
			{id: "circulation", name: "Circulación"},
			{id: "environmental", name: "Confort Ambiental"},
			{id: "accessibility", name: "Accesibilidad"},
		],
		hydraulic: [
			{id: "piping", name: "Tuberías"},
			{id: "pumps", name: "Equipos de Bombeo"},
			{id: "drainage", name: "Desagües"},
		],
		custom: [{id: "general", name: "General"}],
	};

	const professions = [
		{id: "architect", name: "Arquitecto"},
		{id: "civil_engineer", name: "Ingeniero Civil"},
		{id: "structural_engineer", name: "Ingeniero Estructural"},
		{id: "electrical_engineer", name: "Ingeniero Eléctrico"},
		{id: "mechanical_engineer", name: "Ingeniero Mecánico"},
		{id: "contractor", name: "Contratista"},
	];

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
				formula: existingTemplate.formula || "",
				requirements: existingTemplate.requirements || [],
				applicationCases: existingTemplate.applicationCases || [],
				limitations: existingTemplate.limitations || [],
			});
		}
	}, [existingTemplate]);

	const handleInputChange = (field: keyof TemplateFormData, value: any) => {
		setFormData((prev) => ({...prev, [field]: value}));
		// Limpiar error si existe
		if (errors[field]) {
			setErrors((prev) => ({...prev, [field]: ""}));
		}
	};

	const handleArrayAdd = (field: keyof TemplateFormData, value: string) => {
		if (value.trim()) {
			const currentArray = formData[field] as string[];
			setFormData((prev) => ({
				...prev,
				[field]: [...currentArray, value.trim()],
			}));
		}
	};

	const handleArrayRemove = (field: keyof TemplateFormData, index: number) => {
		const currentArray = formData[field] as string[];
		setFormData((prev) => ({
			...prev,
			[field]: currentArray.filter((_, i) => i !== index),
		}));
	};

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

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (!formData.name.trim()) newErrors.name = "El nombre es requerido";
		if (!formData.description.trim())
			newErrors.description = "La descripción es requerida";
		if (!formData.category) newErrors.category = "La categoría es requerida";
		if (!formData.difficulty)
			newErrors.difficulty = "La dificultad es requerida";
		if (formData.targetProfessions.length === 0)
			newErrors.targetProfessions = "Debe seleccionar al menos una profesión";

		// Validar parámetros
		formData.parameters.forEach((param, index) => {
			if (!param.name.trim()) {
				newErrors[`param_${index}_name`] = "Nombre del parámetro requerido";
			}
			if (!param.label.trim()) {
				newErrors[`param_${index}_label`] = "Etiqueta del parámetro requerida";
			}
		});

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setIsSubmitting(true);

		try {
			const templateData = {
				...formData,
				id: templateId || undefined,
				createdAt: existingTemplate?.createdAt || new Date().toISOString(),
				lastModified: new Date().toISOString(),
				version: existingTemplate
					? String(Number(existingTemplate.version || "1.0") + 0.1)
					: "1.0",
				usageCount: existingTemplate?.usageCount || 0,
				status: "draft" as const,
			};

			// TODO: Reemplazar con llamada real a la API
			console.log("Guardando plantilla:", templateData);

			// Simular delay de API
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// Redirigir a mis plantillas
			navigate("/calculations/my-templates", {
				state: {
					message: `Plantilla ${templateId ? "actualizada" : "creada"} exitosamente`,
				},
			});
		} catch (error) {
			console.error("Error al guardar plantilla:", error);
			// TODO: Manejar error apropiadamente
		} finally {
			setIsSubmitting(false);
		}
	};

	const renderParameterEditor = (param: TemplateParameter, index: number) => (
		<div key={param.id} className="border border-gray-200 rounded-xl p-4">
			<div className="flex items-center justify-between mb-4">
				<h4 className="font-medium text-gray-900">Parámetro {index + 1}</h4>
				<button
					type="button"
					onClick={() => removeParameter(index)}
					className="p-1 text-red-600 hover:bg-red-50 rounded"
				>
					<TrashIcon className="h-4 w-4" />
				</button>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Nombre interno *
					</label>
					<input
						type="text"
						value={param.name}
						onChange={(e) => updateParameter(index, "name", e.target.value)}
						placeholder="ej: houseArea"
						className={`w-full px-3 py-2 border rounded-lg text-sm ${
							errors[`param_${index}_name`]
								? "border-red-500"
								: "border-gray-300"
						}`}
					/>
					{errors[`param_${index}_name`] && (
						<p className="text-red-600 text-xs mt-1">
							{errors[`param_${index}_name`]}
						</p>
					)}
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Etiqueta visible *
					</label>
					<input
						type="text"
						value={param.label}
						onChange={(e) => updateParameter(index, "label", e.target.value)}
						placeholder="ej: Área de la casa"
						className={`w-full px-3 py-2 border rounded-lg text-sm ${
							errors[`param_${index}_label`]
								? "border-red-500"
								: "border-gray-300"
						}`}
					/>
					{errors[`param_${index}_label`] && (
						<p className="text-red-600 text-xs mt-1">
							{errors[`param_${index}_label`]}
						</p>
					)}
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Tipo
					</label>
					<select
						value={param.type}
						onChange={(e) => updateParameter(index, "type", e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
					>
						<option value="number">Número</option>
						<option value="text">Texto</option>
						<option value="select">Selección</option>
					</select>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Unidad
					</label>
					<input
						type="text"
						value={param.unit || ""}
						onChange={(e) => updateParameter(index, "unit", e.target.value)}
						placeholder="ej: m², kg, A"
						className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
					/>
				</div>

				{param.type === "number" && (
					<>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Valor mínimo
							</label>
							<input
								type="number"
								value={param.min || ""}
								onChange={(e) =>
									updateParameter(index, "min", Number(e.target.value))
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Valor máximo
							</label>
							<input
								type="number"
								value={param.max || ""}
								onChange={(e) =>
									updateParameter(index, "max", Number(e.target.value))
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
							/>
						</div>
					</>
				)}

				{param.type === "select" && (
					<div className="md:col-span-2">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Opciones (separadas por comas)
						</label>
						<input
							type="text"
							value={param.options?.join(", ") || ""}
							onChange={(e) =>
								updateParameter(
									index,
									"options",
									e.target.value.split(",").map((opt) => opt.trim())
								)
							}
							placeholder="Opción 1, Opción 2, Opción 3"
							className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
						/>
					</div>
				)}

				<div className="md:col-span-2">
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Descripción/Tooltip
					</label>
					<input
						type="text"
						value={param.tooltip || ""}
						onChange={(e) => updateParameter(index, "tooltip", e.target.value)}
						placeholder="Descripción que aparecerá como ayuda"
						className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
					/>
				</div>

				<div className="flex items-center">
					<label className="flex items-center">
						<input
							type="checkbox"
							checked={param.required}
							onChange={(e) =>
								updateParameter(index, "required", e.target.checked)
							}
							className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
						/>
						<span className="ml-2 text-sm text-gray-700">Campo requerido</span>
					</label>
				</div>
			</div>
		</div>
	);

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white border-b border-gray-200">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<div className="flex items-center gap-4">
						<button
							onClick={() => navigate("/calculations/my-templates")}
							className="p-2 hover:bg-gray-100 rounded-full transition-colors"
						>
							<ArrowLeftIcon className="h-5 w-5 text-gray-600" />
						</button>
						<div>
							<h1 className="text-2xl font-bold text-gray-900">
								{templateId ? "Editar Plantilla" : "Nueva Plantilla"}
							</h1>
							<p className="text-gray-600">
								{templateId
									? "Modifica tu plantilla existente"
									: "Crea una nueva plantilla de cálculo"}
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
					{/* Información básica */}
					<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
						<h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
							<DocumentTextIcon className="h-5 w-5 text-primary-600" />
							Información Básica
						</h2>

						<div className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Nombre de la plantilla *
									</label>
									<input
										type="text"
										value={formData.name}
										onChange={(e) => handleInputChange("name", e.target.value)}
										className={`w-full px-4 py-3 border rounded-lg ${
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
									<input
										type="text"
										value={formData.estimatedTime}
										onChange={(e) =>
											handleInputChange("estimatedTime", e.target.value)
										}
										placeholder="ej: 10-15 min"
										className="w-full px-4 py-3 border border-gray-300 rounded-lg"
									/>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Descripción *
								</label>
								<textarea
									value={formData.description}
									onChange={(e) =>
										handleInputChange("description", e.target.value)
									}
									rows={3}
									className={`w-full px-4 py-3 border rounded-lg ${
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
									placeholder="Descripción técnica detallada de la plantilla..."
									className="w-full px-4 py-3 border border-gray-300 rounded-lg"
								/>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Categoría *
									</label>
									<select
										value={formData.category}
										onChange={(e) => {
											handleInputChange("category", e.target.value);
											handleInputChange("subcategory", ""); // Reset subcategory
										}}
										className={`w-full px-4 py-3 border rounded-lg ${
											errors.category ? "border-red-500" : "border-gray-300"
										}`}
									>
										<option value="">Seleccionar...</option>
										{categories.map((cat) => (
											<option key={cat.id} value={cat.id}>
												{cat.name}
											</option>
										))}
									</select>
									{errors.category && (
										<p className="text-red-600 text-xs mt-1">
											{errors.category}
										</p>
									)}
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Subcategoría
									</label>
									<select
										value={formData.subcategory}
										onChange={(e) =>
											handleInputChange("subcategory", e.target.value)
										}
										disabled={!formData.category}
										className="w-full px-4 py-3 border border-gray-300 rounded-lg disabled:bg-gray-100"
									>
										<option value="">Seleccionar...</option>
										{formData.category &&
											subcategories[
												formData.category as keyof typeof subcategories
											]?.map((subcat) => (
												<option key={subcat.id} value={subcat.id}>
													{subcat.name}
												</option>
											))}
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Dificultad *
									</label>
									<select
										value={formData.difficulty}
										onChange={(e) =>
											handleInputChange("difficulty", e.target.value)
										}
										className="w-full px-4 py-3 border border-gray-300 rounded-lg"
									>
										<option value="basic">Básico</option>
										<option value="intermediate">Intermedio</option>
										<option value="advanced">Avanzado</option>
									</select>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Profesiones objetivo *
								</label>
								<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
									{professions.map((prof) => (
										<label key={prof.id} className="flex items-center">
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
											<span className="ml-2 text-sm text-gray-700">
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
						</div>
					</div>

					{/* Parámetros */}
					<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
								<CpuChipIcon className="h-5 w-5 text-primary-600" />
								Parámetros de Entrada
							</h2>
							<button
								type="button"
								onClick={addParameter}
								className="flex items-center gap-2 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
							>
								<PlusIcon className="h-4 w-4" />
								Agregar Parámetro
							</button>
						</div>

						<div className="space-y-4">
							{formData.parameters.map((param, index) =>
								renderParameterEditor(param, index)
							)}

							{formData.parameters.length === 0 && (
								<div className="text-center py-8 text-gray-500">
									<CpuChipIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
									<p>No hay parámetros definidos</p>
									<p className="text-sm">
										Agrega parámetros para que los usuarios puedan ingresar
										datos
									</p>
								</div>
							)}
						</div>
					</div>

					{/* Información adicional */}
					<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
						<h2 className="text-lg font-semibold text-gray-900 mb-4">
							Información Adicional
						</h2>

						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Referencia normativa
								</label>
								<input
									type="text"
									value={formData.necReference}
									onChange={(e) =>
										handleInputChange("necReference", e.target.value)
									}
									placeholder="ej: NEC-SE-DS, Cap. 2"
									className="w-full px-4 py-3 border border-gray-300 rounded-lg"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Fórmula
								</label>
								<textarea
									value={formData.formula}
									onChange={(e) => handleInputChange("formula", e.target.value)}
									rows={4}
									placeholder="Describe la fórmula o proceso de cálculo..."
									className="w-full px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm"
								/>
							</div>
						</div>
					</div>

					{/* Configuración */}
					<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
						<h2 className="text-lg font-semibold text-gray-900 mb-4">
							Configuración
						</h2>

						<div className="flex items-center">
							<label className="flex items-center">
								<input
									type="checkbox"
									checked={formData.isPublic}
									onChange={(e) =>
										handleInputChange("isPublic", e.target.checked)
									}
									className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
								/>
								<span className="ml-2 text-sm text-gray-700">
									Plantilla pública
								</span>
							</label>
						</div>
						<p className="text-xs text-gray-500 mt-1">
							Las plantillas públicas pueden ser vistas por otros usuarios
						</p>
					</div>

					{/* Botones de acción */}
					<div className="flex justify-between items-center">
						<button
							type="button"
							onClick={() => navigate("/calculations/my-templates")}
							className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
						>
							Cancelar
						</button>

						<div className="flex gap-3">
							<button
								type="button"
								onClick={() => setShowPreview(!showPreview)}
								className="px-6 py-3 border border-primary-300 text-primary-700 rounded-lg hover:bg-primary-50 transition-colors"
							>
								{showPreview ? "Ocultar" : "Vista Previa"}
							</button>

							<button
								type="submit"
								disabled={isSubmitting}
								className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
							>
								{isSubmitting ? (
									<>
										<div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent" />
										Guardando...
									</>
								) : (
									<>
										<CheckIcon className="h-4 w-4" />
										{templateId ? "Actualizar" : "Crear"} Plantilla
									</>
								)}
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default TemplateEditor;
