import React, {useState, useCallback} from "react";
import {
	LightBulbIcon,
	ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

// Tipo de parámetro real del backend
interface BackendParameter {
	id: string;
	name: string;
	description: string;
	dataType: "number" | "string" | "enum" | "boolean";
	scope: "input" | "output";
	displayOrder: number;
	isRequired: boolean;
	defaultValue?: string | null;
	minValue?: number | null;
	maxValue?: number | null;
	regexPattern?: string | null;
	unitOfMeasure?: string | null;
	allowedValues?: string | null; // JSON array como string
	helpText?: string;
	dependsOnParameters?: string | null;
	formula?: string | null;
}

interface ParameterInputProps {
	parameter: BackendParameter;
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

	// Parsear allowedValues si existe
	const getAllowedValues = useCallback(() => {
		if (!parameter.allowedValues) return null;
		try {
			return JSON.parse(parameter.allowedValues);
		} catch {
			return null;
		}
	}, [parameter.allowedValues]);

	// Manejar cambios de input de manera simple
	const handleChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
			const newValue = event.target.value;

			if (parameter.dataType === "number") {
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
		[parameter.dataType, onChange]
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
		if (parameter.dataType === "number" && typeof value === "string") {
			const num = parseFloat(value);
			if (isNaN(num)) {
				onChange(undefined);
			} else {
				onChange(num);
			}
		}
	}, [parameter.dataType, value, onChange]);

	// Solo mostrar error si el campo ha sido tocado
	const shouldShowError = error && touched;

	// Obtener el valor para mostrar en el input
	const displayValue =
		value === undefined || value === null ? "" : String(value);

	// Obtener label desde description o name
	const label = parameter.description || parameter.name;

	// Obtener opciones válidas
	const allowedValues = getAllowedValues();

	return (
		<div className="space-y-2">
			<label className="block text-sm font-medium text-gray-700">
				{label}
				{parameter.isRequired && <span className="text-red-500 ml-1">*</span>}
				{parameter.unitOfMeasure && (
					<span className="text-gray-500 font-normal">
						{" "}
						({parameter.unitOfMeasure})
					</span>
				)}
			</label>

			{parameter.dataType === "enum" ? (
				<select
					value={displayValue}
					onChange={handleChange}
					onBlur={() => setTouched(true)}
					className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
						shouldShowError ? "border-red-500" : "border-gray-300"
					}`}
				>
					<option value="">Seleccionar...</option>
					{allowedValues &&
						Array.isArray(allowedValues) &&
						allowedValues.map((option) => (
							<option key={option} value={option}>
								{option}{" "}
								{parameter.unitOfMeasure && `${parameter.unitOfMeasure}`}
							</option>
						))}
				</select>
			) : parameter.dataType === "boolean" ? (
				<div className="flex items-center">
					<input
						type="checkbox"
						checked={Boolean(value)}
						onChange={handleCheckboxChange}
						className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
					/>
					<span className="ml-2 text-sm text-gray-700">
						{parameter.helpText || "Activar opción"}
					</span>
				</div>
			) : (
				<input
					type={parameter.dataType === "number" ? "number" : "text"}
					value={displayValue}
					onChange={handleChange}
					onBlur={handleBlur}
					placeholder={parameter.defaultValue || ""}
					min={parameter.minValue || undefined}
					max={parameter.maxValue || undefined}
					step={parameter.dataType === "number" ? "any" : undefined}
					pattern={parameter.regexPattern || undefined}
					className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
						shouldShowError ? "border-red-500" : "border-gray-300"
					}`}
				/>
			)}

			{parameter.helpText && (
				<div className="flex items-start gap-2 text-xs text-gray-500">
					<LightBulbIcon className="h-4 w-4 mt-0.5 text-yellow-500 flex-shrink-0" />
					<span>{parameter.helpText}</span>
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
			{parameter.dataType === "number" &&
				(parameter.minValue !== undefined ||
					parameter.maxValue !== undefined) && (
					<div className="text-xs text-gray-500">
						{parameter.minValue !== undefined &&
						parameter.maxValue !== undefined
							? `Rango: ${parameter.minValue} - ${parameter.maxValue}`
							: parameter.minValue !== undefined
								? `Mínimo: ${parameter.minValue}`
								: `Máximo: ${parameter.maxValue}`}
					</div>
				)}

			{/* Mostrar valor por defecto si existe */}
			{parameter.defaultValue && !value && (
				<div className="text-xs text-gray-500">
					Valor por defecto: {parameter.defaultValue}
				</div>
			)}
		</div>
	);
};

export default ParameterInput;
