// src/ui/pages/calculations/templates/components/TemplateForm.tsx

import React, {useState, useEffect} from "react";
import {Tab} from "@headlessui/react";
import {
	DocumentTextIcon,
	CogIcon,
	CalculatorIcon,
	ShieldCheckIcon,
	BookOpenIcon,
	PaintBrushIcon,
	PlusIcon,
	TrashIcon,
	XMarkIcon,
	ExclamationCircleIcon,
	CheckCircleIcon,
	InformationCircleIcon,
	DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";

import {useTemplateForm} from "../../shared/hooks/useTemplates";
import type {
	Template,
	TemplateCategory,
	TemplateParameter,
	ParameterType,
} from "../../shared/types/template.types";
import {
	TEMPLATE_CATEGORIES,
	DEFAULT_PARAMETER_VALUES,
} from "../../shared/types/template.types";
import ParameterEditor from "./ParameterEditor";

// ==================== INTERFACES ====================
interface TemplateFormProps {
	template?: Template;
	onSave?: (template: Template) => void;
	onCancel?: () => void;
	onDelete?: (templateId: string) => void;
	mode?: "create" | "edit" | "duplicate";
	className?: string;
}

interface TagInputProps {
	value: string[];
	onChange: (tags: string[]) => void;
	placeholder?: string;
}

// ==================== UTILIDADES ====================
function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(" ");
}

// ==================== COMPONENTE TAG INPUT ====================
const TagInput: React.FC<TagInputProps> = ({value, onChange, placeholder}) => {
	const [inputValue, setInputValue] = useState("");

	const addTag = (tag: string) => {
		const trimmedTag = tag.trim().toLowerCase();
		if (trimmedTag && !value.includes(trimmedTag)) {
			onChange([...value, trimmedTag]);
		}
		setInputValue("");
	};

	const removeTag = (tagToRemove: string) => {
		onChange(value.filter((tag) => tag !== tagToRemove));
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" || e.key === ",") {
			e.preventDefault();
			addTag(inputValue);
		} else if (e.key === "Backspace" && !inputValue && value.length > 0) {
			removeTag(value[value.length - 1]);
		}
	};

	return (
		<div className="space-y-2">
			<div className="flex flex-wrap gap-2 mb-2">
				{value.map((tag, index) => (
					<span
						key={index}
						className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-md"
					>
						{tag}
						<button
							type="button"
							onClick={() => removeTag(tag)}
							className="hover:bg-red-100 rounded-full p-0.5 transition-colors"
						>
							<XMarkIcon className="h-3 w-3" />
						</button>
					</span>
				))}
			</div>
			<input
				type="text"
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder={placeholder || "Agregar etiqueta y presionar Enter"}
				className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
			/>
		</div>
	);
};

// ==================== COMPONENTES UI BÁSICOS ====================
const Card: React.FC<{children: React.ReactNode; className?: string}> = ({
	children,
	className = "",
}) => (
	<div className={`bg-white shadow rounded-lg ${className}`}>{children}</div>
);

const CardHeader: React.FC<{children: React.ReactNode}> = ({children}) => (
	<div className="px-6 py-4 border-b border-gray-200">{children}</div>
);

const CardTitle: React.FC<{children: React.ReactNode; className?: string}> = ({
	children,
	className = "",
}) => (
	<h3 className={`text-lg font-medium text-gray-900 ${className}`}>
		{children}
	</h3>
);

const CardContent: React.FC<{
	children: React.ReactNode;
	className?: string;
}> = ({children, className = ""}) => (
	<div className={`px-6 py-4 ${className}`}>{children}</div>
);

const Button: React.FC<{
	children: React.ReactNode;
	onClick?: () => void;
	variant?: "primary" | "secondary" | "destructive" | "outline";
	size?: "sm" | "md" | "lg";
	disabled?: boolean;
	type?: "button" | "submit" | "reset";
	className?: string;
}> = ({
	children,
	onClick,
	variant = "primary",
	size = "md",
	disabled = false,
	type = "button",
	className = "",
}) => {
	const baseClasses =
		"inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors";

	const variantClasses = {
		primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
		secondary:
			"bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500",
		destructive: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
		outline:
			"border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-blue-500",
	};

	const sizeClasses = {
		sm: "px-3 py-1.5 text-sm",
		md: "px-4 py-2 text-sm",
		lg: "px-6 py-3 text-base",
	};

	const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={classNames(
				baseClasses,
				variantClasses[variant],
				sizeClasses[size],
				disabledClasses,
				className
			)}
		>
			{children}
		</button>
	);
};

const Alert: React.FC<{
	children: React.ReactNode;
	variant?: "info" | "warning" | "error" | "success";
	className?: string;
}> = ({children, variant = "info", className = ""}) => {
	const variantClasses = {
		info: "bg-blue-50 border-blue-200 text-blue-800",
		warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
		error: "bg-red-50 border-red-200 text-red-800",
		success: "bg-green-50 border-green-200 text-green-800",
	};

	return (
		<div
			className={`rounded-md border p-4 ${variantClasses[variant]} ${className}`}
		>
			{children}
		</div>
	);
};

const Badge: React.FC<{
	children: React.ReactNode;
	variant?: "default" | "secondary" | "outline";
	className?: string;
}> = ({children, variant = "default", className = ""}) => {
	const variantClasses = {
		default: "bg-blue-100 text-blue-800",
		secondary: "bg-gray-100 text-gray-800",
		outline: "border border-gray-200 text-gray-700",
	};

	return (
		<span
			className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}
		>
			{children}
		</span>
	);
};

const Switch: React.FC<{
	checked: boolean;
	onChange: (checked: boolean) => void;
	className?: string;
}> = ({checked, onChange, className = ""}) => {
	return (
		<button
			type="button"
			onClick={() => onChange(!checked)}
			className={classNames(
				checked ? "bg-blue-600" : "bg-gray-200",
				"relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2",
				className
			)}
		>
			<span
				className={classNames(
					checked ? "translate-x-5" : "translate-x-0",
					"pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
				)}
			/>
		</button>
	);
};

// ==================== COMPONENTE PRINCIPAL ====================
const TemplateForm: React.FC<TemplateFormProps> = ({
	template,
	onSave,
	onCancel,
	onDelete,
	mode = "create",
	className,
}) => {
	const {
		formState,
		formErrors,
		isDirty,
		isValid,
		updateFormField,
		resetForm,
		saveForm,
	} = useTemplateForm(template);

	const [selectedTab, setSelectedTab] = useState(0);
	const [showValidation, setShowValidation] = useState(false);

	// ==================== EFECTOS ====================
	useEffect(() => {
		if (template && mode === "duplicate") {
			updateFormField("basic.name", `${template.name} (Copia)`);
			updateFormField("basic.isPublic", false);
		}
	}, [template, mode, updateFormField]);

	// ==================== HANDLERS ====================
	const handleSave = async () => {
		setShowValidation(true);

		if (!isValid) {
			setSelectedTab(0); // Ir a la pestaña básica si hay errores
			return;
		}

		try {
			const result = await saveForm();
			if (result.success && result.data) {
				onSave?.(result.data as Template);
			}
		} catch (error) {
			console.error("Error saving template:", error);
		}
	};

	const handleCancel = () => {
		if (isDirty) {
			if (
				window.confirm(
					"¿Estás seguro de que quieres cancelar? Se perderán los cambios no guardados."
				)
			) {
				resetForm();
				onCancel?.();
			}
		} else {
			onCancel?.();
		}
	};

	const handleDelete = () => {
		if (
			template &&
			window.confirm(
				"¿Estás seguro de que quieres eliminar esta plantilla? Esta acción no se puede deshacer."
			)
		) {
			onDelete?.(template.id);
		}
	};

	const updateBasicField = (field: string, value: any) => {
		updateFormField(`basic.${field}`, value);
	};

	// ==================== VALIDACIÓN EN TIEMPO REAL ====================
	const getFieldError = (field: string) => {
		if (!showValidation) return null;
		return formErrors.basic?.[field];
	};

	const hasTabError = (tabIndex: number) => {
		if (!showValidation) return false;

		switch (tabIndex) {
			case 0:
				return !!formErrors.basic && Object.keys(formErrors.basic).length > 0;
			case 1:
				return (
					!!formErrors.parameters &&
					Object.keys(formErrors.parameters).length > 0
				);
			case 2:
				return (
					!!formErrors.formulas && Object.keys(formErrors.formulas).length > 0
				);
			default:
				return false;
		}
	};

	// ==================== DATOS DE TABS ====================
	const tabs = [
		{name: "Básico", icon: DocumentTextIcon, key: "basic"},
		{name: "Parámetros", icon: CogIcon, key: "parameters"},
		{name: "Fórmulas", icon: CalculatorIcon, key: "formulas"},
		{name: "Validación", icon: ShieldCheckIcon, key: "validation"},
		{name: "Normas", icon: BookOpenIcon, key: "norms"},
		{name: "Interfaz", icon: PaintBrushIcon, key: "ui"},
	];

	// Convertir TEMPLATE_CATEGORIES de Record a Array para usar en select
	const templateCategoriesArray = Object.values(TEMPLATE_CATEGORIES);

	// ==================== RENDERIZADO ====================
	if (!formState) {
		return (
			<div className="flex items-center justify-center p-8">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Cargando formulario...</p>
				</div>
			</div>
		);
	}

	return (
		<div className={`space-y-6 ${className}`}>
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold text-gray-900">
						{mode === "create"
							? "Nueva Plantilla"
							: mode === "duplicate"
								? "Duplicar Plantilla"
								: "Editar Plantilla"}
					</h2>
					<p className="text-gray-600 mt-1">
						{mode === "create"
							? "Crea una nueva plantilla de cálculo personalizada"
							: mode === "duplicate"
								? "Crea una copia de la plantilla existente"
								: "Modifica los detalles de tu plantilla"}
					</p>
				</div>

				<div className="flex items-center gap-2">
					{isDirty && (
						<Badge
							variant="outline"
							className="text-orange-600 border-orange-200"
						>
							<ExclamationCircleIcon className="h-3 w-3 mr-1" />
							Sin guardar
						</Badge>
					)}
					{isValid && (
						<Badge
							variant="outline"
							className="text-green-600 border-green-200"
						>
							<CheckCircleIcon className="h-3 w-3 mr-1" />
							Válido
						</Badge>
					)}
				</div>
			</div>

			{/* Alertas de validación */}
			{showValidation && !isValid && (
				<Alert variant="error">
					<div className="flex">
						<ExclamationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
						<div>
							<p>
								Por favor completa todos los campos requeridos antes de guardar.
							</p>
							{formErrors.general && (
								<ul className="mt-2 list-disc list-inside">
									{formErrors.general.map((error, index) => (
										<li key={index}>{error}</li>
									))}
								</ul>
							)}
						</div>
					</div>
				</Alert>
			)}

			{/* Tabs */}
			<Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
				<Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
					{tabs.map((tab, index) => (
						<Tab
							key={tab.key}
							className={({selected}) =>
								classNames(
									"w-full rounded-lg py-2.5 text-sm font-medium leading-5",
									"ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
									selected
										? "bg-white text-blue-700 shadow"
										: "text-blue-100 hover:bg-white/[0.12] hover:text-white",
									hasTabError(index) ? "text-red-600" : ""
								)
							}
						>
							<div className="flex items-center justify-center gap-2">
								<tab.icon className="h-4 w-4" />
								{tab.name}
							</div>
						</Tab>
					))}
				</Tab.List>

				<Tab.Panels className="mt-6">
					{/* Información Básica */}
					<Tab.Panel>
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<DocumentTextIcon className="h-5 w-5" />
									Información Básica
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
									<div className="space-y-4">
										<div className="space-y-2">
											<label className="block text-sm font-medium text-gray-700">
												Nombre de la plantilla *
											</label>
											<input
												type="text"
												value={formState.basic.name}
												onChange={(e) =>
													updateBasicField("name", e.target.value)
												}
												placeholder="Ej: Cálculo de Vigas de Concreto"
												className={classNames(
													"w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
													getFieldError("name")
														? "border-red-500"
														: "border-gray-300"
												)}
											/>
											{getFieldError("name") && (
												<p className="text-sm text-red-600">
													{getFieldError("name")}
												</p>
											)}
										</div>

										<div className="space-y-2">
											<label className="block text-sm font-medium text-gray-700">
												Categoría *
											</label>
											<select
												value={formState.basic.category}
												onChange={(e) =>
													updateBasicField(
														"category",
														e.target.value as TemplateCategory
													)
												}
												className={classNames(
													"w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
													getFieldError("category")
														? "border-red-500"
														: "border-gray-300"
												)}
											>
												<option value="">Selecciona una categoría</option>
												{templateCategoriesArray.map((category) => (
													<option key={category.id} value={category.id}>
														{category.name}
													</option>
												))}
											</select>
											{getFieldError("category") && (
												<p className="text-sm text-red-600">
													{getFieldError("category")}
												</p>
											)}
										</div>

										<div className="space-y-2">
											<label className="block text-sm font-medium text-gray-700">
												Etiquetas
											</label>
											<TagInput
												value={formState.basic.tags}
												onChange={(tags) => updateBasicField("tags", tags)}
												placeholder="Agregar etiqueta (Enter para confirmar)"
											/>
											<p className="text-xs text-gray-500">
												Las etiquetas ayudan a organizar y encontrar tus
												plantillas
											</p>
										</div>
									</div>

									<div className="space-y-4">
										<div className="space-y-2">
											<label className="block text-sm font-medium text-gray-700">
												Descripción *
											</label>
											<textarea
												value={formState.basic.description}
												onChange={(e) =>
													updateBasicField("description", e.target.value)
												}
												placeholder="Describe el propósito y uso de esta plantilla..."
												rows={6}
												className={classNames(
													"w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
													getFieldError("description")
														? "border-red-500"
														: "border-gray-300"
												)}
											/>
											{getFieldError("description") && (
												<p className="text-sm text-red-600">
													{getFieldError("description")}
												</p>
											)}
										</div>

										<div className="flex items-center justify-between p-4 border rounded-lg">
											<div className="space-y-1">
												<label className="text-sm font-medium text-gray-700">
													Plantilla Pública
												</label>
												<p className="text-xs text-gray-500">
													Permitir que otros usuarios vean y usen esta plantilla
												</p>
											</div>
											<Switch
												checked={formState.basic.isPublic}
												onChange={(checked) =>
													updateBasicField("isPublic", checked)
												}
											/>
										</div>

										{formState.basic.isPublic && (
											<Alert variant="info">
												<div className="flex">
													<InformationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
													<p>
														Las plantillas públicas serán revisadas antes de
														aparecer en el catálogo. Puedes recibir sugerencias
														de mejora de otros usuarios.
													</p>
												</div>
											</Alert>
										)}
									</div>
								</div>
							</CardContent>
						</Card>
					</Tab.Panel>

					{/* Parámetros */}
					<Tab.Panel>
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<CogIcon className="h-5 w-5" />
										Parámetros de Entrada
									</div>
									<Button
										variant="outline"
										size="sm"
										onClick={() => {
											const newParam: TemplateParameter = {
												id: `param_${Date.now()}`,
												name: `parametro_${formState.parameters.length + 1}`,
												label: `Parámetro ${formState.parameters.length + 1}`,
												type: "number" as ParameterType,
												required: true,
												defaultValue: DEFAULT_PARAMETER_VALUES.number,
											};
											updateFormField("parameters", [
												...formState.parameters,
												newParam,
											]);
										}}
									>
										<PlusIcon className="h-4 w-4 mr-1" />
										Agregar Parámetro
									</Button>
								</CardTitle>
							</CardHeader>
							<CardContent>
								{formState.parameters.length === 0 ? (
									<div className="text-center py-8 text-gray-500">
										<CogIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
										<p>No hay parámetros definidos</p>
										<p className="text-sm">
											Agrega parámetros para que los usuarios puedan ingresar
											datos
										</p>
									</div>
								) : (
									<ParameterEditor
										parameters={formState.parameters}
										onChange={(params) => updateFormField("parameters", params)}
										errors={formErrors.parameters}
									/>
								)}
							</CardContent>
						</Card>
					</Tab.Panel>

					{/* Fórmulas */}
					<Tab.Panel>
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<CalculatorIcon className="h-5 w-5" />
										Fórmulas de Cálculo
									</div>
									<Button
										variant="outline"
										size="sm"
										onClick={() => {
											const newFormula = {
												id: `formula_${Date.now()}`,
												name: `Resultado ${formState.formulas.length + 1}`,
												expression: "",
												dependencies: [],
											};
											updateFormField("formulas", [
												...formState.formulas,
												newFormula,
											]);
										}}
									>
										<PlusIcon className="h-4 w-4 mr-1" />
										Agregar Fórmula
									</Button>
								</CardTitle>
							</CardHeader>
							<CardContent>
								{formState.formulas.length === 0 ? (
									<div className="text-center py-8 text-gray-500">
										<CalculatorIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
										<p>No hay fórmulas definidas</p>
										<p className="text-sm">
											Agrega fórmulas para calcular resultados automáticamente
										</p>
									</div>
								) : (
									<div className="space-y-4">
										{formState.formulas.map((formula, index) => (
											<div key={formula.id} className="border rounded-lg p-4">
												<div className="flex items-center justify-between mb-3">
													<h4 className="font-medium">Fórmula {index + 1}</h4>
													<Button
														variant="outline"
														size="sm"
														onClick={() => {
															const newFormulas = formState.formulas.filter(
																(_, i) => i !== index
															);
															updateFormField("formulas", newFormulas);
														}}
													>
														<TrashIcon className="h-4 w-4" />
													</Button>
												</div>

												<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
													<div className="space-y-2">
														<label className="block text-sm font-medium text-gray-700">
															Nombre
														</label>
														<input
															type="text"
															value={formula.name}
															onChange={(e) => {
																const newFormulas = [...formState.formulas];
																newFormulas[index] = {
																	...formula,
																	name: e.target.value,
																};
																updateFormField("formulas", newFormulas);
															}}
															placeholder="Nombre del resultado"
															className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
														/>
													</div>

													<div className="space-y-2">
														<label className="block text-sm font-medium text-gray-700">
															Unidad
														</label>
														<input
															type="text"
															value={formula.unit || ""}
															onChange={(e) => {
																const newFormulas = [...formState.formulas];
																newFormulas[index] = {
																	...formula,
																	unit: e.target.value,
																};
																updateFormField("formulas", newFormulas);
															}}
															placeholder="kg, m, kN, etc."
															className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
														/>
													</div>
												</div>

												<div className="mt-4 space-y-2">
													<label className="block text-sm font-medium text-gray-700">
														Expresión
													</label>
													<textarea
														value={formula.expression}
														onChange={(e) => {
															const newFormulas = [...formState.formulas];
															newFormulas[index] = {
																...formula,
																expression: e.target.value,
															};
															updateFormField("formulas", newFormulas);
														}}
														placeholder="Ej: parametro1 * parametro2 / 1000"
														rows={3}
														className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
													/>
													<p className="text-xs text-gray-500">
														Usa los nombres de los parámetros en la expresión
													</p>
												</div>
											</div>
										))}
									</div>
								)}
							</CardContent>
						</Card>
					</Tab.Panel>

					{/* Validación */}
					<Tab.Panel>
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<ShieldCheckIcon className="h-5 w-5" />
									Reglas de Validación
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-gray-600 mb-4">
									Define reglas para validar los datos ingresados por los
									usuarios.
								</p>
								<Alert variant="info">
									<div className="flex">
										<InformationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
										<p>
											Esta funcionalidad estará disponible en una próxima
											actualización.
										</p>
									</div>
								</Alert>
							</CardContent>
						</Card>
					</Tab.Panel>

					{/* Normas */}
					<Tab.Panel>
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<BookOpenIcon className="h-5 w-5" />
									Referencias Normativas
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-gray-600 mb-4">
									Especifica las normas técnicas que aplican a esta plantilla.
								</p>
								<Alert variant="info">
									<div className="flex">
										<InformationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
										<p>
											Esta funcionalidad estará disponible en una próxima
											actualización.
										</p>
									</div>
								</Alert>
							</CardContent>
						</Card>
					</Tab.Panel>

					{/* Interfaz */}
					<Tab.Panel>
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<PaintBrushIcon className="h-5 w-5" />
									Configuración de Interfaz
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-gray-600 mb-4">
									Personaliza cómo se verá la plantilla para los usuarios.
								</p>
								<Alert variant="info">
									<div className="flex">
										<InformationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
										<p>
											Esta funcionalidad estará disponible en una próxima
											actualización.
										</p>
									</div>
								</Alert>
							</CardContent>
						</Card>
					</Tab.Panel>
				</Tab.Panels>
			</Tab.Group>

			{/* Footer con acciones */}
			<div className="flex items-center justify-between pt-6 border-t border-gray-200">
				<div className="flex items-center gap-2">
					{template && mode === "edit" && (
						<Button variant="destructive" onClick={handleDelete}>
							<TrashIcon className="h-4 w-4 mr-2" />
							Eliminar
						</Button>
					)}
				</div>

				<div className="flex items-center gap-2">
					<Button variant="outline" onClick={handleCancel}>
						Cancelar
					</Button>

					<Button onClick={handleSave} disabled={showValidation && !isValid}>
						<DocumentDuplicateIcon className="h-4 w-4 mr-2" />
						{mode === "create" ? "Crear Plantilla" : "Guardar Cambios"}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default TemplateForm;
