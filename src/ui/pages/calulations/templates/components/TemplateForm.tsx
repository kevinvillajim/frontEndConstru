// src/ui/pages/calculations/templates/components/TemplateForm.tsx

import React, {useState, useEffect} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {Badge} from "@/components/ui/badge";
import {Switch} from "@/components/ui/switch";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Separator} from "@/components/ui/separator";
import {
	Save,
	X,
	Plus,
	Trash2,
	Copy,
	AlertCircle,
	CheckCircle,
	Info,
	Settings,
	Calculator,
	FileText,
	Shield,
	BookOpen,
	Palette,
} from "lucide-react";
import {Alert, AlertDescription} from "@/components/ui/alert";

import {useTemplateForm} from "../../shared/hooks/useTemplates";
import type {
	Template,
	TemplateCategory,
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
					<Badge
						key={index}
						variant="secondary"
						className="flex items-center gap-1"
					>
						{tag}
						<button
							type="button"
							onClick={() => removeTag(tag)}
							className="hover:bg-red-100 rounded-full p-0.5"
						>
							<X className="h-3 w-3" />
						</button>
					</Badge>
				))}
			</div>
			<Input
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder={placeholder || "Agregar etiqueta y presionar Enter"}
				className="text-sm"
			/>
		</div>
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

	const [activeTab, setActiveTab] = useState("basic");
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
			setActiveTab("basic"); // Ir a la pestaña básica si hay errores
			return;
		}

		try {
			const result = await saveForm();
			if (result.success && result.data) {
				onSave?.(result.data);
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

	const hasTabError = (tabName: string) => {
		if (!showValidation) return false;

		switch (tabName) {
			case "basic":
				return !!formErrors.basic && Object.keys(formErrors.basic).length > 0;
			case "parameters":
				return (
					!!formErrors.parameters &&
					Object.keys(formErrors.parameters).length > 0
				);
			case "formulas":
				return (
					!!formErrors.formulas && Object.keys(formErrors.formulas).length > 0
				);
			default:
				return false;
		}
	};

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
							<AlertCircle className="h-3 w-3 mr-1" />
							Sin guardar
						</Badge>
					)}
					{isValid && (
						<Badge
							variant="outline"
							className="text-green-600 border-green-200"
						>
							<CheckCircle className="h-3 w-3 mr-1" />
							Válido
						</Badge>
					)}
				</div>
			</div>

			{/* Alertas de validación */}
			{showValidation && !isValid && (
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>
						Por favor completa todos los campos requeridos antes de guardar.
						{formErrors.general && (
							<ul className="mt-2 list-disc list-inside">
								{formErrors.general.map((error, index) => (
									<li key={index}>{error}</li>
								))}
							</ul>
						)}
					</AlertDescription>
				</Alert>
			)}

			{/* Tabs */}
			<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
				<TabsList className="grid w-full grid-cols-6">
					<TabsTrigger
						value="basic"
						className={`flex items-center gap-2 ${hasTabError("basic") ? "text-red-600" : ""}`}
					>
						<FileText className="h-4 w-4" />
						Básico
					</TabsTrigger>
					<TabsTrigger
						value="parameters"
						className={`flex items-center gap-2 ${hasTabError("parameters") ? "text-red-600" : ""}`}
					>
						<Settings className="h-4 w-4" />
						Parámetros
					</TabsTrigger>
					<TabsTrigger
						value="formulas"
						className={`flex items-center gap-2 ${hasTabError("formulas") ? "text-red-600" : ""}`}
					>
						<Calculator className="h-4 w-4" />
						Fórmulas
					</TabsTrigger>
					<TabsTrigger value="validation" className="flex items-center gap-2">
						<Shield className="h-4 w-4" />
						Validación
					</TabsTrigger>
					<TabsTrigger value="norms" className="flex items-center gap-2">
						<BookOpen className="h-4 w-4" />
						Normas
					</TabsTrigger>
					<TabsTrigger value="ui" className="flex items-center gap-2">
						<Palette className="h-4 w-4" />
						Interfaz
					</TabsTrigger>
				</TabsList>

				{/* Información Básica */}
				<TabsContent value="basic">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<FileText className="h-5 w-5" />
								Información Básica
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								<div className="space-y-4">
									<div className="space-y-2">
										<label className="text-sm font-medium text-gray-700">
											Nombre de la plantilla *
										</label>
										<Input
											value={formState.basic.name}
											onChange={(e) => updateBasicField("name", e.target.value)}
											placeholder="Ej: Cálculo de Vigas de Concreto"
											className={getFieldError("name") ? "border-red-500" : ""}
										/>
										{getFieldError("name") && (
											<p className="text-sm text-red-600">
												{getFieldError("name")}
											</p>
										)}
									</div>

									<div className="space-y-2">
										<label className="text-sm font-medium text-gray-700">
											Categoría *
										</label>
										<Select
											value={formState.basic.category}
											onValueChange={(value) =>
												updateBasicField("category", value as TemplateCategory)
											}
										>
											<SelectTrigger
												className={
													getFieldError("category") ? "border-red-500" : ""
												}
											>
												<SelectValue placeholder="Selecciona una categoría" />
											</SelectTrigger>
											<SelectContent>
												{TEMPLATE_CATEGORIES.map((category) => (
													<SelectItem key={category.id} value={category.id}>
														<div className="flex items-center gap-2">
															<div
																className="w-3 h-3 rounded-full"
																style={{backgroundColor: category.color}}
															/>
															{category.name}
														</div>
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										{getFieldError("category") && (
											<p className="text-sm text-red-600">
												{getFieldError("category")}
											</p>
										)}
									</div>

									<div className="space-y-2">
										<label className="text-sm font-medium text-gray-700">
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
										<label className="text-sm font-medium text-gray-700">
											Descripción *
										</label>
										<Textarea
											value={formState.basic.description}
											onChange={(e) =>
												updateBasicField("description", e.target.value)
											}
											placeholder="Describe el propósito y uso de esta plantilla..."
											rows={6}
											className={
												getFieldError("description") ? "border-red-500" : ""
											}
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
											onCheckedChange={(checked) =>
												updateBasicField("isPublic", checked)
											}
										/>
									</div>

									{formState.basic.isPublic && (
										<Alert>
											<Info className="h-4 w-4" />
											<AlertDescription>
												Las plantillas públicas serán revisadas antes de
												aparecer en el catálogo. Puedes recibir sugerencias de
												mejora de otros usuarios.
											</AlertDescription>
										</Alert>
									)}
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Parámetros */}
				<TabsContent value="parameters">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Settings className="h-5 w-5" />
									Parámetros de Entrada
								</div>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => {
										const newParam = {
											id: `param_${Date.now()}`,
											name: `parametro_${formState.parameters.length + 1}`,
											label: `Parámetro ${formState.parameters.length + 1}`,
											type: "number" as const,
											required: true,
											order: formState.parameters.length,
											...DEFAULT_PARAMETER_VALUES.number,
										};
										updateFormField("parameters", [
											...formState.parameters,
											newParam,
										]);
									}}
								>
									<Plus className="h-4 w-4 mr-1" />
									Agregar Parámetro
								</Button>
							</CardTitle>
						</CardHeader>
						<CardContent>
							{formState.parameters.length === 0 ? (
								<div className="text-center py-8 text-gray-500">
									<Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
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
				</TabsContent>

				{/* Fórmulas */}
				<TabsContent value="formulas">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Calculator className="h-5 w-5" />
									Fórmulas de Cálculo
								</div>
								<Button
									type="button"
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
									<Plus className="h-4 w-4 mr-1" />
									Agregar Fórmula
								</Button>
							</CardTitle>
						</CardHeader>
						<CardContent>
							{formState.formulas.length === 0 ? (
								<div className="text-center py-8 text-gray-500">
									<Calculator className="h-12 w-12 mx-auto mb-4 text-gray-300" />
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
													type="button"
													variant="ghost"
													size="sm"
													onClick={() => {
														const newFormulas = formState.formulas.filter(
															(_, i) => i !== index
														);
														updateFormField("formulas", newFormulas);
													}}
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>

											<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
												<div className="space-y-2">
													<label className="text-sm font-medium">Nombre</label>
													<Input
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
													/>
												</div>

												<div className="space-y-2">
													<label className="text-sm font-medium">Unidad</label>
													<Input
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
													/>
												</div>
											</div>

											<div className="mt-4 space-y-2">
												<label className="text-sm font-medium">Expresión</label>
												<Textarea
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
				</TabsContent>

				{/* Validación */}
				<TabsContent value="validation">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Shield className="h-5 w-5" />
								Reglas de Validación
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-gray-600 mb-4">
								Define reglas para validar los datos ingresados por los
								usuarios.
							</p>
							<Alert>
								<Info className="h-4 w-4" />
								<AlertDescription>
									Esta funcionalidad estará disponible en una próxima
									actualización.
								</AlertDescription>
							</Alert>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Normas */}
				<TabsContent value="norms">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<BookOpen className="h-5 w-5" />
								Referencias Normativas
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-gray-600 mb-4">
								Especifica las normas técnicas que aplican a esta plantilla.
							</p>
							<Alert>
								<Info className="h-4 w-4" />
								<AlertDescription>
									Esta funcionalidad estará disponible en una próxima
									actualización.
								</AlertDescription>
							</Alert>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Interfaz */}
				<TabsContent value="ui">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Palette className="h-5 w-5" />
								Configuración de Interfaz
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-gray-600 mb-4">
								Personaliza cómo se verá la plantilla para los usuarios.
							</p>
							<Alert>
								<Info className="h-4 w-4" />
								<AlertDescription>
									Esta funcionalidad estará disponible en una próxima
									actualización.
								</AlertDescription>
							</Alert>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			{/* Footer con acciones */}
			<div className="flex items-center justify-between pt-6 border-t">
				<div className="flex items-center gap-2">
					{template && mode === "edit" && (
						<Button
							type="button"
							variant="destructive"
							onClick={handleDelete}
							className="flex items-center gap-2"
						>
							<Trash2 className="h-4 w-4" />
							Eliminar
						</Button>
					)}
				</div>

				<div className="flex items-center gap-2">
					<Button type="button" variant="outline" onClick={handleCancel}>
						Cancelar
					</Button>

					<Button
						type="button"
						onClick={handleSave}
						disabled={showValidation && !isValid}
						className="flex items-center gap-2"
					>
						<Save className="h-4 w-4" />
						{mode === "create" ? "Crear Plantilla" : "Guardar Cambios"}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default TemplateForm;
