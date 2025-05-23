import React from "react";
import {
	TrashIcon,
	QuestionMarkCircleIcon,
	CpuChipIcon,
} from "@heroicons/react/24/outline";
import type {TemplateParameter} from "../../shared/types/template.types";

interface ParameterEditorProps {
	parameter: TemplateParameter;
	index: number;
	errors: Record<string, string>;
	onUpdate: (index: number, field: keyof TemplateParameter, value: any) => void;
	onRemove: (index: number) => void;
}

const ParameterEditor: React.FC<ParameterEditorProps> = ({
	parameter,
	index,
	errors,
	onUpdate,
	onRemove,
}) => {
	const getFieldError = (field: string) => {
		return errors[`param_${index}_${field}`];
	};

	const renderTypeSpecificFields = () => {
		switch (parameter.type) {
			case "number":
				return (
					<>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Valor mínimo
							</label>
							<input
								type="number"
								value={parameter.min || ""}
								onChange={(e) =>
									onUpdate(
										index,
										"min",
										e.target.value ? Number(e.target.value) : undefined
									)
								}
								placeholder="0"
								className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Valor máximo
							</label>
							<input
								type="number"
								value={parameter.max || ""}
								onChange={(e) =>
									onUpdate(
										index,
										"max",
										e.target.value ? Number(e.target.value) : undefined
									)
								}
								placeholder="1000"
								className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Valor por defecto
							</label>
							<input
								type="number"
								value={
									typeof parameter.defaultValue === "number"
										? parameter.defaultValue
										: ""
								}
								onChange={(e) =>
									onUpdate(
										index,
										"defaultValue",
										e.target.value ? Number(e.target.value) : undefined
									)
								}
								placeholder="10"
								className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Rango típico
							</label>
							<input
								type="text"
								value={parameter.typicalRange || ""}
								onChange={(e) =>
									onUpdate(index, "typicalRange", e.target.value)
								}
								placeholder="ej: 1-100"
								className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
							/>
							<p className="text-xs text-gray-500 mt-1">
								Información orientativa para el usuario
							</p>
						</div>
					</>
				);

			case "select":
				return (
					<div className="md:col-span-2">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Opciones (separadas por comas) *
						</label>
						<input
							type="text"
							value={parameter.options?.join(", ") || ""}
							onChange={(e) =>
								onUpdate(
									index,
									"options",
									e.target.value
										.split(",")
										.map((opt) => opt.trim())
										.filter((opt) => opt)
								)
							}
							placeholder="Opción 1, Opción 2, Opción 3"
							className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
								getFieldError("options") ? "border-red-500" : "border-gray-300"
							}`}
						/>
						{getFieldError("options") && (
							<p className="text-red-600 text-xs mt-1">
								{getFieldError("options")}
							</p>
						)}
						<p className="text-xs text-gray-500 mt-1">
							Las opciones vacías se eliminarán automáticamente
						</p>
					</div>
				);

			case "text":
				return (
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Valor por defecto
						</label>
						<input
							type="text"
							value={
								typeof parameter.defaultValue === "string"
									? parameter.defaultValue
									: ""
							}
							onChange={(e) => onUpdate(index, "defaultValue", e.target.value)}
							placeholder="Texto por defecto"
							className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
						/>
					</div>
				);

			default:
				return null;
		}
	};

	return (
		<div className="border border-gray-200 rounded-xl p-4 bg-gray-50/30">
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-2">
					<CpuChipIcon className="h-4 w-4 text-primary-600" />
					<h4 className="font-medium text-gray-900">Parámetro {index + 1}</h4>
					{parameter.required && (
						<span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full font-medium">
							Requerido
						</span>
					)}
				</div>
				<button
					type="button"
					onClick={() => onRemove(index)}
					className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
					title="Eliminar parámetro"
				>
					<TrashIcon className="h-4 w-4" />
				</button>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{/* Nombre interno */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Nombre interno *
						<QuestionMarkCircleIcon
							className="inline h-3 w-3 ml-1 text-gray-400"
							title="Identificador único para el parámetro (sin espacios, solo letras y números)"
						/>
					</label>
					<input
						type="text"
						value={parameter.name}
						onChange={(e) =>
							onUpdate(
								index,
								"name",
								e.target.value.replace(/[^a-zA-Z0-9_]/g, "")
							)
						}
						placeholder="ej: areaVivienda"
						className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
							getFieldError("name") ? "border-red-500" : "border-gray-300"
						}`}
					/>
					{getFieldError("name") && (
						<p className="text-red-600 text-xs mt-1">{getFieldError("name")}</p>
					)}
				</div>

				{/* Etiqueta visible */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Etiqueta visible *
					</label>
					<input
						type="text"
						value={parameter.label}
						onChange={(e) => onUpdate(index, "label", e.target.value)}
						placeholder="ej: Área de la vivienda"
						className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
							getFieldError("label") ? "border-red-500" : "border-gray-300"
						}`}
					/>
					{getFieldError("label") && (
						<p className="text-red-600 text-xs mt-1">
							{getFieldError("label")}
						</p>
					)}
				</div>

				{/* Tipo */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Tipo de dato
					</label>
					<select
						value={parameter.type}
						onChange={(e) => onUpdate(index, "type", e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
					>
						<option value="number">Número</option>
						<option value="text">Texto</option>
						<option value="select">Lista de opciones</option>
					</select>
				</div>

				{/* Unidad */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Unidad
					</label>
					<input
						type="text"
						value={parameter.unit || ""}
						onChange={(e) => onUpdate(index, "unit", e.target.value)}
						placeholder="ej: m², kg, A, %"
						className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
					/>
				</div>

				{/* Campos específicos del tipo */}
				{renderTypeSpecificFields()}

				{/* Placeholder */}
				<div className={parameter.type === "select" ? "md:col-span-2" : ""}>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Texto de ayuda
					</label>
					<input
						type="text"
						value={parameter.placeholder || ""}
						onChange={(e) => onUpdate(index, "placeholder", e.target.value)}
						placeholder="Texto que aparece en el campo vacío"
						className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
					/>
				</div>

				{/* Descripción/Tooltip */}
				<div className="md:col-span-2">
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Descripción detallada
					</label>
					<textarea
						value={parameter.tooltip || ""}
						onChange={(e) => onUpdate(index, "tooltip", e.target.value)}
						placeholder="Explicación detallada que aparecerá como tooltip"
						rows={2}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
					/>
				</div>

				{/* Campo requerido */}
				<div className="flex items-center md:col-span-2">
					<label className="flex items-center">
						<input
							type="checkbox"
							checked={parameter.required}
							onChange={(e) => onUpdate(index, "required", e.target.checked)}
							className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
						/>
						<span className="ml-2 text-sm text-gray-700">
							Campo obligatorio
						</span>
					</label>
				</div>
			</div>

			{/* Vista previa del parámetro */}
			<div className="mt-4 p-3 bg-white border border-gray-200 rounded-lg">
				<p className="text-xs text-gray-500 mb-2 font-medium">Vista previa:</p>
				<div className="space-y-1">
					<label className="block text-sm font-medium text-gray-700">
						{parameter.label || "Sin etiqueta"}
						{parameter.required && <span className="text-red-500 ml-1">*</span>}
						{parameter.unit && (
							<span className="text-gray-500 ml-1">({parameter.unit})</span>
						)}
					</label>
					{parameter.type === "number" && (
						<input
							type="number"
							placeholder={parameter.placeholder || "Ingrese un número"}
							min={parameter.min}
							max={parameter.max}
							defaultValue={
								typeof parameter.defaultValue === "number"
									? parameter.defaultValue
									: undefined
							}
							className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
							disabled
						/>
					)}
					{parameter.type === "text" && (
						<input
							type="text"
							placeholder={parameter.placeholder || "Ingrese texto"}
							defaultValue={
								typeof parameter.defaultValue === "string"
									? parameter.defaultValue
									: ""
							}
							className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
							disabled
						/>
					)}
					{parameter.type === "select" && (
						<select
							className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
							disabled
						>
							<option>
								{parameter.placeholder || "Seleccione una opción"}
							</option>
							{parameter.options?.map((option, idx) => (
								<option key={idx} value={option}>
									{option}
								</option>
							))}
						</select>
					)}
					{parameter.tooltip && (
						<p className="text-xs text-gray-500 italic">{parameter.tooltip}</p>
					)}
					{parameter.typicalRange && (
						<p className="text-xs text-gray-400">
							Rango típico: {parameter.typicalRange}
						</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default ParameterEditor;
