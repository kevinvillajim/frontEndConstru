import React, {useState} from "react";
import {
	PlusIcon,
	XMarkIcon,
	TrashIcon,
	EyeIcon,
	DocumentArrowDownIcon,
	BeakerIcon,
	Cog6ToothIcon,
	CheckBadgeIcon,
	BookOpenIcon,
	ChevronUpIcon,
	ChevronDownIcon,
	CodeBracketIcon,
	InformationCircleIcon,
} from "@heroicons/react/24/outline";

// Tipos de datos
interface TemplateParameter {
	id: string;
	name: string;
	label: string;
	type: "number" | "select" | "text" | "boolean";
	unit?: string;
	required: boolean;
	defaultValue?: string | number | boolean;
	minValue?: number;
	maxValue?: number;
	options?: string[];
	description: string;
	validationRules?: string[];
	order: number;
}

interface FormulaVariable {
	name: string;
	description: string;
	type: "parameter" | "constant" | "function";
}

interface TemplateFormula {
	id: string;
	name: string;
	expression: string;
	description: string;
	unit?: string;
	variables: FormulaVariable[];
	validationRules?: string[];
}

interface TemplateData {
	id?: string;
	name: string;
	description: string;
	longDescription: string;
	category:
		| "structural"
		| "electrical"
		| "architectural"
		| "hydraulic"
		| "custom";
	subcategory: string;
	targetProfessions: string[];
	difficulty: "basic" | "intermediate" | "advanced";
	estimatedTime: string;
	necReference: string;
	necSection: string;
	tags: string[];
	parameters: TemplateParameter[];
	formulas: TemplateFormula[];
	requirements: string[];
	applicationCases: string[];
	limitations: string[];
	isPublic: boolean;
	version: string;
}

const initialTemplate: TemplateData = {
	name: "",
	description: "",
	longDescription: "",
	category: "custom",
	subcategory: "",
	targetProfessions: [],
	difficulty: "basic",
	estimatedTime: "",
	necReference: "",
	necSection: "",
	tags: [],
	parameters: [],
	formulas: [],
	requirements: [],
	applicationCases: [],
	limitations: [],
	isPublic: false,
	version: "1.0",
};

const categories = [
	{id: "structural", name: "Estructural", icon: "🏗️"},
	{id: "electrical", name: "Eléctrico", icon: "⚡"},
	{id: "architectural", name: "Arquitectónico", icon: "🏛️"},
	{id: "hydraulic", name: "Hidráulico", icon: "🚰"},
	{id: "custom", name: "Personalizada", icon: "⚒️"},
];

const professions = [
	{id: "architect", name: "Arquitecto"},
	{id: "civil_engineer", name: "Ingeniero Civil"},
	{id: "structural_engineer", name: "Ingeniero Estructural"},
	{id: "electrical_engineer", name: "Ingeniero Eléctrico"},
	{id: "mechanical_engineer", name: "Ingeniero Mecánico"},
	{id: "contractor", name: "Contratista"},
	{id: "other", name: "Otro"},
];

const difficulties = [
	{
		id: "basic",
		name: "Básico",
		description: "Requiere conocimientos fundamentales",
	},
	{
		id: "intermediate",
		name: "Intermedio",
		description: "Requiere experiencia práctica",
	},
	{
		id: "advanced",
		name: "Avanzado",
		description: "Requiere experticia especializada",
	},
];

const parameterTypes = [
	{
		id: "number",
		name: "Número",
		description: "Valor numérico (entero o decimal)",
	},
	{
		id: "select",
		name: "Selección",
		description: "Lista de opciones predefinidas",
	},
	{id: "text", name: "Texto", description: "Campo de texto libre"},
	{id: "boolean", name: "Sí/No", description: "Valor verdadero o falso"},
];

const TemplateEditor: React.FC = () => {
	const [template, setTemplate] = useState<TemplateData>(initialTemplate);
	const [activeTab, setActiveTab] = useState("basic");
	//showPreview
	const [setShowPreview] = useState(false);
	const [currentParameter, setCurrentParameter] =
		useState<TemplateParameter | null>(null);
	const [parameterModalOpen, setParameterModalOpen] = useState(false);
	const [formulaModalOpen, setFormulaModalOpen] = useState(false);
	const [currentFormula, setCurrentFormula] = useState<TemplateFormula | null>(
		null
	);
	const [validationErrors, setValidationErrors] = useState<
		Record<string, string>
	>({});

	// const fileInputRef = useRef<HTMLInputElement>(null);

	const tabs = [
		{id: "basic", name: "Información Básica", icon: InformationCircleIcon},
		{id: "parameters", name: "Parámetros", icon: Cog6ToothIcon},
		{id: "formulas", name: "Fórmulas", icon: CodeBracketIcon},
		{id: "validation", name: "Validación", icon: CheckBadgeIcon},
		{id: "documentation", name: "Documentación", icon: BookOpenIcon},
	];

	// Validación del template
	const validateTemplate = (): boolean => {
		const errors: Record<string, string> = {};

		if (!template.name.trim()) {
			errors.name = "El nombre es requerido";
		}

		if (!template.description.trim()) {
			errors.description = "La descripción es requerida";
		}

		if (template.parameters.length === 0) {
			errors.parameters = "Debe definir al menos un parámetro";
		}

		if (template.formulas.length === 0) {
			errors.formulas = "Debe definir al menos una fórmula";
		}

		setValidationErrors(errors);
		return Object.keys(errors).length === 0;
	};

	// Manejo de parámetros
	const addParameter = () => {
		const newParameter: TemplateParameter = {
			id: `param_${Date.now()}`,
			name: `parameter${template.parameters.length + 1}`,
			label: "",
			type: "number",
			required: true,
			description: "",
			order: template.parameters.length,
		};
		setCurrentParameter(newParameter);
		setParameterModalOpen(true);
	};

	const saveParameter = (parameter: TemplateParameter) => {
		if (
			parameter.id &&
			template.parameters.find((p) => p.id === parameter.id)
		) {
			// Actualizar parámetro existente
			setTemplate((prev) => ({
				...prev,
				parameters: prev.parameters.map((p) =>
					p.id === parameter.id ? parameter : p
				),
			}));
		} else {
			// Agregar nuevo parámetro
			setTemplate((prev) => ({
				...prev,
				parameters: [...prev.parameters, parameter],
			}));
		}
		setParameterModalOpen(false);
		setCurrentParameter(null);
	};

	const deleteParameter = (parameterId: string) => {
		setTemplate((prev) => ({
			...prev,
			parameters: prev.parameters.filter((p) => p.id !== parameterId),
		}));
	};

	const moveParameter = (parameterId: string, direction: "up" | "down") => {
		const parameters = [...template.parameters];
		const index = parameters.findIndex((p) => p.id === parameterId);

		if (direction === "up" && index > 0) {
			[parameters[index], parameters[index - 1]] = [
				parameters[index - 1],
				parameters[index],
			];
		} else if (direction === "down" && index < parameters.length - 1) {
			[parameters[index], parameters[index + 1]] = [
				parameters[index + 1],
				parameters[index],
			];
		}

		// Actualizar order
		parameters.forEach((param, idx) => {
			param.order = idx;
		});

		setTemplate((prev) => ({...prev, parameters}));
	};

	// Manejo de fórmulas
	const addFormula = () => {
		const newFormula: TemplateFormula = {
			id: `formula_${Date.now()}`,
			name: `Formula ${template.formulas.length + 1}`,
			expression: "",
			description: "",
			variables: [],
		};
		setCurrentFormula(newFormula);
		setFormulaModalOpen(true);
	};

	const saveFormula = (formula: TemplateFormula) => {
		if (formula.id && template.formulas.find((f) => f.id === formula.id)) {
			setTemplate((prev) => ({
				...prev,
				formulas: prev.formulas.map((f) => (f.id === formula.id ? formula : f)),
			}));
		} else {
			setTemplate((prev) => ({
				...prev,
				formulas: [...prev.formulas, formula],
			}));
		}
		setFormulaModalOpen(false);
		setCurrentFormula(null);
	};

	const deleteFormula = (formulaId: string) => {
		setTemplate((prev) => ({
			...prev,
			formulas: prev.formulas.filter((f) => f.id !== formulaId),
		}));
	};

	// Manejo de tags
	const addTag = (tag: string) => {
		if (tag.trim() && !template.tags.includes(tag.trim())) {
			setTemplate((prev) => ({
				...prev,
				tags: [...prev.tags, tag.trim()],
			}));
		}
	};

	const removeTag = (tag: string) => {
		setTemplate((prev) => ({
			...prev,
			tags: prev.tags.filter((t) => t !== tag),
		}));
	};

	// Guardar template
	const saveTemplate = () => {
		if (validateTemplate()) {
			console.log("Guardando template:", template);
			// Aquí iría la lógica para guardar en el backend
			alert("Template guardado exitosamente!");
		}
	};

	// Renderizado de tabs
	const renderBasicInfo = () => (
		<div className="space-y-6">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Nombre de la Plantilla *
					</label>
					<input
						type="text"
						value={template.name}
						onChange={(e) =>
							setTemplate((prev) => ({...prev, name: e.target.value}))
						}
						className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
							validationErrors.name ? "border-red-500" : "border-gray-300"
						}`}
						placeholder="Ej: Cálculo de Momento Flector"
					/>
					{validationErrors.name && (
						<p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
					)}
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Categoría *
					</label>
					<select
						value={template.category}
						onChange={(e) =>
							setTemplate((prev) => ({
								...prev,
								category: e.target.value as TemplateData["category"],
							}))
						}
						className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
					>
						{categories.map((cat) => (
							<option key={cat.id} value={cat.id}>
								{cat.icon} {cat.name}
							</option>
						))}
					</select>
				</div>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Descripción Corta *
				</label>
				<input
					type="text"
					value={template.description}
					onChange={(e) =>
						setTemplate((prev) => ({...prev, description: e.target.value}))
					}
					className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
						validationErrors.description ? "border-red-500" : "border-gray-300"
					}`}
					placeholder="Descripción concisa de qué calcula la plantilla"
				/>
				{validationErrors.description && (
					<p className="mt-1 text-sm text-red-600">
						{validationErrors.description}
					</p>
				)}
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Descripción Detallada
				</label>
				<textarea
					value={template.longDescription}
					onChange={(e) =>
						setTemplate((prev) => ({...prev, longDescription: e.target.value}))
					}
					rows={4}
					className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
					placeholder="Explicación detallada del propósito, metodología y aplicaciones de la plantilla"
				/>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Subcategoría
					</label>
					<input
						type="text"
						value={template.subcategory}
						onChange={(e) =>
							setTemplate((prev) => ({...prev, subcategory: e.target.value}))
						}
						className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
						placeholder="Ej: Diseño de elementos"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Dificultad
					</label>
					<select
						value={template.difficulty}
						onChange={(e) =>
							setTemplate((prev) => ({
								...prev,
								difficulty: e.target.value as TemplateData["difficulty"],
							}))
						}
						className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
					>
						{difficulties.map((diff) => (
							<option key={diff.id} value={diff.id}>
								{diff.name}
							</option>
						))}
					</select>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Tiempo Estimado
					</label>
					<input
						type="text"
						value={template.estimatedTime}
						onChange={(e) =>
							setTemplate((prev) => ({...prev, estimatedTime: e.target.value}))
						}
						className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
						placeholder="Ej: 10-15 min"
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Referencia NEC
					</label>
					<input
						type="text"
						value={template.necReference}
						onChange={(e) =>
							setTemplate((prev) => ({...prev, necReference: e.target.value}))
						}
						className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
						placeholder="Ej: NEC-SE-HM"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Sección NEC
					</label>
					<input
						type="text"
						value={template.necSection}
						onChange={(e) =>
							setTemplate((prev) => ({...prev, necSection: e.target.value}))
						}
						className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
						placeholder="Ej: Capítulo 9 - Flexión y Carga Axial"
					/>
				</div>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Profesiones Objetivo
				</label>
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
					{professions.map((prof) => (
						<label key={prof.id} className="flex items-center">
							<input
								type="checkbox"
								checked={template.targetProfessions.includes(prof.id)}
								onChange={(e) => {
									if (e.target.checked) {
										setTemplate((prev) => ({
											...prev,
											targetProfessions: [...prev.targetProfessions, prof.id],
										}));
									} else {
										setTemplate((prev) => ({
											...prev,
											targetProfessions: prev.targetProfessions.filter(
												(p) => p !== prof.id
											),
										}));
									}
								}}
								className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
							/>
							<span className="ml-2 text-sm text-gray-700">{prof.name}</span>
						</label>
					))}
				</div>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Etiquetas
				</label>
				<div className="flex flex-wrap gap-2 mb-3">
					{template.tags.map((tag, index) => (
						<span
							key={index}
							className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
						>
							{tag}
							<button
								onClick={() => removeTag(tag)}
								className="hover:text-primary-900"
							>
								<XMarkIcon className="h-3 w-3" />
							</button>
						</span>
					))}
				</div>
				<input
					type="text"
					placeholder="Escribir etiqueta y presionar Enter"
					className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
					onKeyPress={(e) => {
						if (e.key === "Enter") {
							e.preventDefault();
							addTag(e.currentTarget.value);
							e.currentTarget.value = "";
						}
					}}
				/>
			</div>
		</div>
	);

	const renderParameters = () => (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h3 className="text-lg font-semibold text-gray-900">
						Parámetros de Entrada
					</h3>
					<p className="text-sm text-gray-600">
						Define los parámetros que los usuarios ingresarán para el cálculo
					</p>
				</div>
				<button
					onClick={addParameter}
					className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
				>
					<PlusIcon className="h-4 w-4" />
					Agregar Parámetro
				</button>
			</div>

			{validationErrors.parameters && (
				<div className="bg-red-50 border border-red-200 rounded-lg p-4">
					<p className="text-red-700 text-sm">{validationErrors.parameters}</p>
				</div>
			)}

			<div className="space-y-4">
				{template.parameters
					.sort((a, b) => a.order - b.order)
					.map((parameter, index) => (
						<div
							key={parameter.id}
							className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow"
						>
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<div className="flex items-center gap-2 mb-2">
										<h4 className="font-medium text-gray-900">
											{parameter.label || parameter.name}
										</h4>
										{parameter.required && (
											<span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
												Requerido
											</span>
										)}
										<span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
											{
												parameterTypes.find((t) => t.id === parameter.type)
													?.name
											}
										</span>
									</div>
									<p className="text-sm text-gray-600 mb-2">
										{parameter.description}
									</p>
									<div className="flex items-center gap-4 text-xs text-gray-500">
										<span>Variable: {parameter.name}</span>
										{parameter.unit && <span>Unidad: {parameter.unit}</span>}
										{parameter.defaultValue && (
											<span>Por defecto: {parameter.defaultValue}</span>
										)}
									</div>
								</div>

								<div className="flex items-center gap-2">
									<button
										onClick={() => moveParameter(parameter.id, "up")}
										disabled={index === 0}
										className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
									>
										<ChevronUpIcon className="h-4 w-4" />
									</button>
									<button
										onClick={() => moveParameter(parameter.id, "down")}
										disabled={index === template.parameters.length - 1}
										className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
									>
										<ChevronDownIcon className="h-4 w-4" />
									</button>
									<button
										onClick={() => {
											setCurrentParameter(parameter);
											setParameterModalOpen(true);
										}}
										className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg"
									>
										<Cog6ToothIcon className="h-4 w-4" />
									</button>
									<button
										onClick={() => deleteParameter(parameter.id)}
										className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
									>
										<TrashIcon className="h-4 w-4" />
									</button>
								</div>
							</div>
						</div>
					))}

				{template.parameters.length === 0 && (
					<div className="text-center py-12 bg-gray-50 rounded-xl">
						<BeakerIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
						<h3 className="text-lg font-medium text-gray-900 mb-2">
							No hay parámetros definidos
						</h3>
						<p className="text-gray-600 mb-4">
							Agrega parámetros para que los usuarios puedan ingresar datos en
							el cálculo.
						</p>
						<button
							onClick={addParameter}
							className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
						>
							Agregar Primer Parámetro
						</button>
					</div>
				)}
			</div>
		</div>
	);

	const renderFormulas = () => (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h3 className="text-lg font-semibold text-gray-900">
						Fórmulas de Cálculo
					</h3>
					<p className="text-sm text-gray-600">
						Define las fórmulas matemáticas que procesarán los parámetros
					</p>
				</div>
				<button
					onClick={addFormula}
					className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
				>
					<PlusIcon className="h-4 w-4" />
					Agregar Fórmula
				</button>
			</div>

			{validationErrors.formulas && (
				<div className="bg-red-50 border border-red-200 rounded-lg p-4">
					<p className="text-red-700 text-sm">{validationErrors.formulas}</p>
				</div>
			)}

			<div className="space-y-4">
				{template.formulas.map((formula) => (
					<div
						key={formula.id}
						className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow"
					>
						<div className="flex items-start justify-between mb-3">
							<div className="flex-1">
								<h4 className="font-medium text-gray-900 mb-1">
									{formula.name}
								</h4>
								<p className="text-sm text-gray-600 mb-2">
									{formula.description}
								</p>
							</div>
							<div className="flex items-center gap-2">
								<button
									onClick={() => {
										setCurrentFormula(formula);
										setFormulaModalOpen(true);
									}}
									className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg"
								>
									<CodeBracketIcon className="h-4 w-4" />
								</button>
								<button
									onClick={() => deleteFormula(formula.id)}
									className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
								>
									<TrashIcon className="h-4 w-4" />
								</button>
							</div>
						</div>

						<div className="bg-gray-50 rounded-lg p-3 font-mono text-sm">
							{formula.expression || "Sin expresión definida"}
						</div>

						{formula.unit && (
							<div className="mt-2 text-xs text-gray-500">
								Unidad: {formula.unit}
							</div>
						)}
					</div>
				))}

				{template.formulas.length === 0 && (
					<div className="text-center py-12 bg-gray-50 rounded-xl">
						<CodeBracketIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
						<h3 className="text-lg font-medium text-gray-900 mb-2">
							No hay fórmulas definidas
						</h3>
						<p className="text-gray-600 mb-4">
							Agrega fórmulas matemáticas para procesar los parámetros de
							entrada.
						</p>
						<button
							onClick={addFormula}
							className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
						>
							Agregar Primera Fórmula
						</button>
					</div>
				)}
			</div>
		</div>
	);

	const renderValidation = () => (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-semibold text-gray-900 mb-2">
					Validación y Verificación
				</h3>
				<p className="text-sm text-gray-600">
					Configura reglas de validación y verificación para garantizar la
					calidad de los cálculos
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="space-y-4">
					<h4 className="font-medium text-gray-900">Validaciones de Entrada</h4>

					{template.parameters.map((param) => (
						<div
							key={param.id}
							className="border border-gray-200 rounded-lg p-4"
						>
							<h5 className="font-medium text-gray-900 mb-2">{param.label}</h5>
							<div className="space-y-2">
								{param.type === "number" && (
									<>
										<div className="grid grid-cols-2 gap-2">
											<div>
												<label className="block text-xs text-gray-600">
													Valor mínimo
												</label>
												<input
													type="number"
													value={param.minValue || ""}
													onChange={(e) => {
														const value = e.target.value
															? Number(e.target.value)
															: undefined;
														setTemplate((prev) => ({
															...prev,
															parameters: prev.parameters.map((p) =>
																p.id === param.id ? {...p, minValue: value} : p
															),
														}));
													}}
													className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
												/>
											</div>
											<div>
												<label className="block text-xs text-gray-600">
													Valor máximo
												</label>
												<input
													type="number"
													value={param.maxValue || ""}
													onChange={(e) => {
														const value = e.target.value
															? Number(e.target.value)
															: undefined;
														setTemplate((prev) => ({
															...prev,
															parameters: prev.parameters.map((p) =>
																p.id === param.id ? {...p, maxValue: value} : p
															),
														}));
													}}
													className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
												/>
											</div>
										</div>
									</>
								)}
							</div>
						</div>
					))}
				</div>

				<div className="space-y-4">
					<h4 className="font-medium text-gray-900">
						Verificación de Resultados
					</h4>

					<div className="border border-gray-200 rounded-lg p-4">
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Rangos de Resultados Esperados
						</label>
						<textarea
							placeholder="Define rangos típicos para los resultados..."
							rows={3}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
						/>
					</div>

					<div className="border border-gray-200 rounded-lg p-4">
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Alertas de Seguridad
						</label>
						<textarea
							placeholder="Define condiciones que generen advertencias..."
							rows={3}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
						/>
					</div>
				</div>
			</div>
		</div>
	);

	const renderDocumentation = () => (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-semibold text-gray-900 mb-2">
					Documentación de la Plantilla
				</h3>
				<p className="text-sm text-gray-600">
					Proporciona información adicional para ayudar a los usuarios a
					entender y usar la plantilla
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Requisitos Previos
						</label>
						<div className="space-y-2">
							{template.requirements.map((req, index) => (
								<div key={index} className="flex items-center gap-2">
									<input
										type="text"
										value={req}
										onChange={(e) => {
											const newReqs = [...template.requirements];
											newReqs[index] = e.target.value;
											setTemplate((prev) => ({...prev, requirements: newReqs}));
										}}
										className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
									/>
									<button
										onClick={() => {
											setTemplate((prev) => ({
												...prev,
												requirements: prev.requirements.filter(
													(_, i) => i !== index
												),
											}));
										}}
										className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
									>
										<XMarkIcon className="h-4 w-4" />
									</button>
								</div>
							))}
							<button
								onClick={() => {
									setTemplate((prev) => ({
										...prev,
										requirements: [...prev.requirements, ""],
									}));
								}}
								className="text-primary-600 hover:text-primary-700 text-sm flex items-center gap-1"
							>
								<PlusIcon className="h-4 w-4" />
								Agregar requisito
							</button>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Casos de Aplicación
						</label>
						<div className="space-y-2">
							{template.applicationCases.map((useCase, index) => (
								<div key={index} className="flex items-center gap-2">
									<input
										type="text"
										value={useCase}
										onChange={(e) => {
											const newCases = [...template.applicationCases];
											newCases[index] = e.target.value;
											setTemplate((prev) => ({
												...prev,
												applicationCases: newCases,
											}));
										}}
										className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
									/>
									<button
										onClick={() => {
											setTemplate((prev) => ({
												...prev,
												applicationCases: prev.applicationCases.filter(
													(_, i) => i !== index
												),
											}));
										}}
										className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
									>
										<XMarkIcon className="h-4 w-4" />
									</button>
								</div>
							))}
							<button
								onClick={() => {
									setTemplate((prev) => ({
										...prev,
										applicationCases: [...prev.applicationCases, ""],
									}));
								}}
								className="text-primary-600 hover:text-primary-700 text-sm flex items-center gap-1"
							>
								<PlusIcon className="h-4 w-4" />
								Agregar caso de uso
							</button>
						</div>
					</div>
				</div>

				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Limitaciones
						</label>
						<div className="space-y-2">
							{template.limitations.map((limitation, index) => (
								<div key={index} className="flex items-center gap-2">
									<input
										type="text"
										value={limitation}
										onChange={(e) => {
											const newLimitations = [...template.limitations];
											newLimitations[index] = e.target.value;
											setTemplate((prev) => ({
												...prev,
												limitations: newLimitations,
											}));
										}}
										className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
									/>
									<button
										onClick={() => {
											setTemplate((prev) => ({
												...prev,
												limitations: prev.limitations.filter(
													(_, i) => i !== index
												),
											}));
										}}
										className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
									>
										<XMarkIcon className="h-4 w-4" />
									</button>
								</div>
							))}
							<button
								onClick={() => {
									setTemplate((prev) => ({
										...prev,
										limitations: [...prev.limitations, ""],
									}));
								}}
								className="text-primary-600 hover:text-primary-700 text-sm flex items-center gap-1"
							>
								<PlusIcon className="h-4 w-4" />
								Agregar limitación
							</button>
						</div>
					</div>

					<div>
						<label className="flex items-center gap-2">
							<input
								type="checkbox"
								checked={template.isPublic}
								onChange={(e) =>
									setTemplate((prev) => ({...prev, isPublic: e.target.checked}))
								}
								className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
							/>
							<span className="text-sm font-medium text-gray-700">
								Hacer plantilla pública
							</span>
						</label>
						<p className="text-xs text-gray-500 mt-1">
							Las plantillas públicas pueden ser usadas por otros usuarios de la
							plataforma
						</p>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Versión
						</label>
						<input
							type="text"
							value={template.version}
							onChange={(e) =>
								setTemplate((prev) => ({...prev, version: e.target.value}))
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
						/>
					</div>
				</div>
			</div>
		</div>
	);

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white border-b border-gray-200 sticky top-0 z-40">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-2xl font-bold text-gray-900">
								Editor de Plantillas
							</h1>
							<p className="text-sm text-gray-600">
								{template.name || "Nueva plantilla de cálculo"}
							</p>
						</div>

						<div className="flex items-center gap-3">
							<button
								onClick={() => setShowPreview(true)}
								className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
							>
								<EyeIcon className="h-4 w-4" />
								Vista Previa
							</button>
							<button
								onClick={saveTemplate}
								className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
							>
								<DocumentArrowDownIcon className="h-4 w-4" />
								Guardar Plantilla
							</button>
						</div>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex gap-8">
					{/* Navegación por tabs */}
					<div className="w-64 flex-shrink-0">
						<nav className="space-y-2">
							{tabs.map((tab) => (
								<button
									key={tab.id}
									onClick={() => setActiveTab(tab.id)}
									className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition-colors ${
										activeTab === tab.id
											? "bg-primary-100 text-primary-700 border border-primary-200"
											: "text-gray-600 hover:bg-gray-100"
									}`}
								>
									<tab.icon className="h-5 w-5" />
									{tab.name}
								</button>
							))}
						</nav>
					</div>

					{/* Contenido principal */}
					<div className="flex-1">
						<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
							{activeTab === "basic" && renderBasicInfo()}
							{activeTab === "parameters" && renderParameters()}
							{activeTab === "formulas" && renderFormulas()}
							{activeTab === "validation" && renderValidation()}
							{activeTab === "documentation" && renderDocumentation()}
						</div>
					</div>
				</div>
			</div>

			{/* Modal para editar parámetros */}
			{parameterModalOpen && currentParameter && (
				<ParameterModal
					parameter={currentParameter}
					onSave={saveParameter}
					onClose={() => {
						setParameterModalOpen(false);
						setCurrentParameter(null);
					}}
				/>
			)}

			{/* Modal para editar fórmulas */}
			{formulaModalOpen && currentFormula && (
				<FormulaModal
					formula={currentFormula}
					parameters={template.parameters}
					onSave={saveFormula}
					onClose={() => {
						setFormulaModalOpen(false);
						setCurrentFormula(null);
					}}
				/>
			)}
		</div>
	);
};

// Componente modal para editar parámetros
const ParameterModal: React.FC<{
	parameter: TemplateParameter;
	onSave: (parameter: TemplateParameter) => void;
	onClose: () => void;
}> = ({parameter, onSave, onClose}) => {
	const [editedParameter, setEditedParameter] =
		useState<TemplateParameter>(parameter);

	const handleSave = () => {
		onSave(editedParameter);
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
				<div className="border-b border-gray-200 p-6">
					<div className="flex items-center justify-between">
						<h3 className="text-xl font-semibold text-gray-900">
							{parameter.id ? "Editar Parámetro" : "Nuevo Parámetro"}
						</h3>
						<button
							onClick={onClose}
							className="p-2 hover:bg-gray-100 rounded-full transition-colors"
						>
							<XMarkIcon className="h-5 w-5 text-gray-500" />
						</button>
					</div>
				</div>

				<div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
					<div className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Nombre de Variable *
								</label>
								<input
									type="text"
									value={editedParameter.name}
									onChange={(e) =>
										setEditedParameter((prev) => ({
											...prev,
											name: e.target.value,
										}))
									}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
									placeholder="nombreVariable"
								/>
								<p className="text-xs text-gray-500 mt-1">
									Nombre usado en las fórmulas (sin espacios)
								</p>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Etiqueta de Campo *
								</label>
								<input
									type="text"
									value={editedParameter.label}
									onChange={(e) =>
										setEditedParameter((prev) => ({
											...prev,
											label: e.target.value,
										}))
									}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
									placeholder="Etiqueta visible para el usuario"
								/>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Descripción
							</label>
							<textarea
								value={editedParameter.description}
								onChange={(e) =>
									setEditedParameter((prev) => ({
										...prev,
										description: e.target.value,
									}))
								}
								rows={3}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
								placeholder="Descripción del parámetro para ayudar al usuario"
							/>
						</div>

						<div className="grid grid-cols-3 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Tipo de Campo *
								</label>
								<select
									value={editedParameter.type}
									onChange={(e) =>
										setEditedParameter((prev) => ({
											...prev,
											type: e.target.value as TemplateParameter["type"],
										}))
									}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
								>
									{parameterTypes.map((type) => (
										<option key={type.id} value={type.id}>
											{type.name}
										</option>
									))}
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Unidad
								</label>
								<input
									type="text"
									value={editedParameter.unit || ""}
									onChange={(e) =>
										setEditedParameter((prev) => ({
											...prev,
											unit: e.target.value,
										}))
									}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
									placeholder="m, kg, °C, etc."
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Valor por Defecto
								</label>
								<input
									type="text"
									value={
										typeof editedParameter.defaultValue === "boolean"
											? editedParameter.defaultValue.toString()
											: editedParameter.defaultValue || ""
									}
									onChange={(e) =>
										setEditedParameter((prev) => ({
											...prev,
											defaultValue:
												editedParameter.type === "number"
													? Number(e.target.value)
													: e.target.value,
										}))
									}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
								/>
							</div>
						</div>

						{editedParameter.type === "select" && (
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Opciones (una por línea)
								</label>
								<textarea
									value={editedParameter.options?.join("\n") || ""}
									onChange={(e) =>
										setEditedParameter((prev) => ({
											...prev,
											options: e.target.value
												.split("\n")
												.filter((opt) => opt.trim()),
										}))
									}
									rows={4}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
									placeholder="Opción 1&#10;Opción 2&#10;Opción 3"
								/>
							</div>
						)}

						<div className="flex items-center">
							<input
								type="checkbox"
								id="required"
								checked={editedParameter.required}
								onChange={(e) =>
									setEditedParameter((prev) => ({
										...prev,
										required: e.target.checked,
									}))
								}
								className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
							/>
							<label htmlFor="required" className="ml-2 text-sm text-gray-700">
								Campo requerido
							</label>
						</div>
					</div>
				</div>

				<div className="border-t border-gray-200 p-6 flex justify-end gap-3">
					<button
						onClick={onClose}
						className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
					>
						Cancelar
					</button>
					<button
						onClick={handleSave}
						className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
					>
						Guardar Parámetro
					</button>
				</div>
			</div>
		</div>
	);
};

// Componente modal para editar fórmulas
const FormulaModal: React.FC<{
	formula: TemplateFormula;
	parameters: TemplateParameter[];
	onSave: (formula: TemplateFormula) => void;
	onClose: () => void;
}> = ({formula, parameters, onSave, onClose}) => {
	const [editedFormula, setEditedFormula] = useState<TemplateFormula>(formula);

	const handleSave = () => {
		onSave(editedFormula);
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
				<div className="border-b border-gray-200 p-6">
					<div className="flex items-center justify-between">
						<h3 className="text-xl font-semibold text-gray-900">
							{formula.id ? "Editar Fórmula" : "Nueva Fórmula"}
						</h3>
						<button
							onClick={onClose}
							className="p-2 hover:bg-gray-100 rounded-full transition-colors"
						>
							<XMarkIcon className="h-5 w-5 text-gray-500" />
						</button>
					</div>
				</div>

				<div className="flex h-[calc(90vh-140px)]">
					{/* Panel izquierdo - Configuración */}
					<div className="w-1/2 p-6 border-r border-gray-200 overflow-y-auto">
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Nombre de la Fórmula *
								</label>
								<input
									type="text"
									value={editedFormula.name}
									onChange={(e) =>
										setEditedFormula((prev) => ({
											...prev,
											name: e.target.value,
										}))
									}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
									placeholder="Resultado Principal"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Descripción
								</label>
								<textarea
									value={editedFormula.description}
									onChange={(e) =>
										setEditedFormula((prev) => ({
											...prev,
											description: e.target.value,
										}))
									}
									rows={2}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
									placeholder="Qué calcula esta fórmula"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Unidad del Resultado
								</label>
								<input
									type="text"
									value={editedFormula.unit || ""}
									onChange={(e) =>
										setEditedFormula((prev) => ({
											...prev,
											unit: e.target.value,
										}))
									}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
									placeholder="m, kg, W, etc."
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Expresión Matemática *
								</label>
								<textarea
									value={editedFormula.expression}
									onChange={(e) =>
										setEditedFormula((prev) => ({
											...prev,
											expression: e.target.value,
										}))
									}
									rows={4}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
									placeholder="area * factor + constante"
								/>
								<p className="text-xs text-gray-500 mt-1">
									Usa los nombres de variables definidos en los parámetros
								</p>
							</div>
						</div>
					</div>

					{/* Panel derecho - Variables disponibles */}
					<div className="w-1/2 p-6 overflow-y-auto">
						<h4 className="text-lg font-medium text-gray-900 mb-4">
							Variables Disponibles
						</h4>

						<div className="space-y-3">
							<div>
								<h5 className="text-sm font-medium text-gray-700 mb-2">
									Parámetros de Entrada
								</h5>
								<div className="space-y-2">
									{parameters.map((param) => (
										<div
											key={param.id}
											className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
											onClick={() => {
												const textarea = document.querySelector(
													'textarea[placeholder*="area * factor"]'
												) as HTMLTextAreaElement;
												if (textarea) {
													const start = textarea.selectionStart;
													const end = textarea.selectionEnd;
													const newValue =
														editedFormula.expression.substring(0, start) +
														param.name +
														editedFormula.expression.substring(end);
													setEditedFormula((prev) => ({
														...prev,
														expression: newValue,
													}));
													setTimeout(() => {
														textarea.focus();
														textarea.setSelectionRange(
															start + param.name.length,
															start + param.name.length
														);
													}, 0);
												}
											}}
										>
											<div>
												<div className="font-mono text-sm text-primary-600">
													{param.name}
												</div>
												<div className="text-xs text-gray-600">
													{param.label}
													{param.unit && ` (${param.unit})`}
												</div>
											</div>
											<button className="text-gray-400 hover:text-primary-600">
												<PlusIcon className="h-4 w-4" />
											</button>
										</div>
									))}
								</div>
							</div>

							<div>
								<h5 className="text-sm font-medium text-gray-700 mb-2">
									Funciones Matemáticas
								</h5>
								<div className="grid grid-cols-2 gap-2">
									{[
										"sqrt",
										"pow",
										"sin",
										"cos",
										"tan",
										"log",
										"abs",
										"max",
										"min",
									].map((func) => (
										<button
											key={func}
											onClick={() => {
												const funcText = `${func}()`;
												setEditedFormula((prev) => ({
													...prev,
													expression: prev.expression + funcText,
												}));
											}}
											className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs hover:bg-blue-100 transition-colors"
										>
											{func}()
										</button>
									))}
								</div>
							</div>

							<div>
								<h5 className="text-sm font-medium text-gray-700 mb-2">
									Operadores
								</h5>
								<div className="grid grid-cols-4 gap-2">
									{["+", "-", "*", "/", "(", ")", "^", "%"].map((op) => (
										<button
											key={op}
											onClick={() => {
												setEditedFormula((prev) => ({
													...prev,
													expression: prev.expression + op,
												}));
											}}
											className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-center hover:bg-gray-200 transition-colors"
										>
											{op}
										</button>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="border-t border-gray-200 p-6 flex justify-end gap-3">
					<button
						onClick={onClose}
						className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
					>
						Cancelar
					</button>
					<button
						onClick={handleSave}
						className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
					>
						Guardar Fórmula
					</button>
				</div>
			</div>
		</div>
	);
};

export default TemplateEditor;
