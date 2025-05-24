import React, {useState, useCallback} from "react";
import {
	LightBulbIcon,
	ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import type {TemplateParameter} from "../../shared/types/template.types";

interface ParameterInputProps {
	parameter: TemplateParameter;
	value: any;
	onChange: (value: any) => void;
	error?: string;
	warning?: string;
}

const ParameterInput: React.FC<ParameterInputProps> = ({
	parameter,
	value,
	onChange,
	error,
	warning,
}) => {
	// Estado para controlar si el campo ha sido tocado (para mostrar errores)
	const [touched, setTouched] = useState(false);

	// Manejar cambios de input de manera simple
	const handleChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
			const newValue = event.target.value;

			if (parameter.type === "number") {
				// Para números, enviar el valor como string si no está vacío, sino undefined
				if (newValue === "") {
					onChange(undefined);
				} else {
					// Solo convertir a número si es válido, sino mantener como string para seguir escribiendo
					const num = parseFloat(newValue);
					if (!isNaN(num)) {
						onChange(num);
					} else {
						// Si no es un número válido pero el usuario está escribiendo, mantener el string
						onChange(newValue);
					}
				}
			} else {
				onChange(newValue);
			}
		},
		[parameter.type, onChange]
	);

	// Manejar checkbox
	const handleCheckboxChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			onChange(event.target.checked);
		},
		[onChange]
	);

	// Manejar cuando el campo pierde el foco
	const handleBlur = useCallback(() => {
		setTouched(true);

		// Si es un número y el valor actual no es válido, limpiarlo
		if (parameter.type === "number" && typeof value === "string") {
			const num = parseFloat(value);
			if (isNaN(num)) {
				onChange(undefined);
			} else {
				onChange(num);
			}
		}
	}, [parameter.type, value, onChange]);

	// Solo mostrar error si el campo ha sido tocado
	const shouldShowError = error && touched;

	// Obtener el valor para mostrar en el input
	const displayValue =
		value === undefined || value === null ? "" : String(value);

	return (
		<div className="space-y-2">
			<label className="block text-sm font-medium text-gray-700">
				{parameter.label}
				{parameter.required && <span className="text-red-500 ml-1">*</span>}
				{parameter.unit && (
					<span className="text-gray-500 font-normal"> ({parameter.unit})</span>
				)}
			</label>

			{parameter.type === "select" ? (
				<select
					value={displayValue}
					onChange={handleChange}
					onBlur={() => setTouched(true)}
					className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
						shouldShowError ? "border-red-500" : "border-gray-300"
					}`}
				>
					<option value="">Seleccionar...</option>
					{parameter.options?.map((option) => (
						<option key={option} value={option}>
							{option} {parameter.unit && `${parameter.unit}`}
						</option>
					))}
				</select>
			) : parameter.type === "boolean" ? (
				<div className="flex items-center">
					<input
						type="checkbox"
						checked={Boolean(value)}
						onChange={handleCheckboxChange}
						className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
					/>
					<span className="ml-2 text-sm text-gray-700">
						{parameter.tooltip || "Activar opción"}
					</span>
				</div>
			) : (
				<input
					type={parameter.type === "number" ? "number" : "text"}
					value={displayValue}
					onChange={handleChange}
					onBlur={handleBlur}
					placeholder={parameter.placeholder}
					min={parameter.min}
					max={parameter.max}
					step={parameter.type === "number" ? "any" : undefined}
					className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
						shouldShowError ? "border-red-500" : "border-gray-300"
					}`}
				/>
			)}

			{parameter.tooltip && (
				<div className="flex items-start gap-2 text-xs text-gray-500">
					<LightBulbIcon className="h-4 w-4 mt-0.5 text-yellow-500 flex-shrink-0" />
					<span>{parameter.tooltip}</span>
				</div>
			)}

			{shouldShowError && (
				<div className="flex items-center gap-2 text-xs text-red-600">
					<ExclamationTriangleIcon className="h-4 w-4" />
					<span>{error}</span>
				</div>
			)}

			{warning && !shouldShowError && (
				<div className="flex items-center gap-2 text-xs text-yellow-600">
					<ExclamationTriangleIcon className="h-4 w-4" />
					<span>{warning}</span>
				</div>
			)}

			{/* Indicador de rango para números */}
			{parameter.type === "number" &&
				(parameter.min !== undefined || parameter.max !== undefined) && (
					<div className="text-xs text-gray-500">
						{parameter.min !== undefined && parameter.max !== undefined
							? `Rango: ${parameter.min} - ${parameter.max}`
							: parameter.min !== undefined
								? `Mínimo: ${parameter.min}`
								: `Máximo: ${parameter.max}`}
					</div>
				)}
		</div>
	);
};

export default ParameterInput;
