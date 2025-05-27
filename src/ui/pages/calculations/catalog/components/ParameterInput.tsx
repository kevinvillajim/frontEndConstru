import React from "react";
import {
	LightBulbIcon,
	ExclamationTriangleIcon,
	CheckIcon,
	XMarkIcon,
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
	// Obtener valor seguro para mostrar
	const getSafeValue = () => {
		if (parameter.type === "boolean") {
			return Boolean(value);
		}
		if (value === undefined || value === null) {
			return "";
		}
		return String(value);
	};

	// Manejar cambio de input número
	const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.value;
		if (newValue === "") {
			onChange(undefined);
		} else {
			const num = parseFloat(newValue);
			if (!isNaN(num)) {
				onChange(num);
			}
		}
	};

	// Manejar cambio de texto/select
	const handleTextChange = (
		event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const newValue = event.target.value;
		onChange(newValue === "" ? undefined : newValue);
	};

	// Manejar cambio de boolean
	const handleBooleanChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		onChange(event.target.checked);
	};

	// Renderizar según tipo FIJO
	const renderInputByType = () => {
		switch (parameter.type) {
			case "select":
				return (
					<select
						value={getSafeValue()}
						onChange={handleTextChange}
						className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white ${
							error ? "border-red-500" : "border-gray-300"
						}`}
					>
						<option value="">
							{parameter.required ? "Seleccionar..." : "Ninguno (opcional)"}
						</option>
						{parameter.options?.map((option, index) => (
							<option key={index} value={option}>
								{option}
							</option>
						))}
					</select>
				);

			case "boolean":
				return (
					<div className="space-y-3">
						<div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
							<div className="flex-1">
								<div className="font-medium text-gray-900">
									{parameter.label}
								</div>
								<div className="text-sm text-gray-600 mt-1">
									{parameter.tooltip || "Selecciona si aplica esta condición"}
								</div>
							</div>
							<div className="ml-4">
								<label className="relative inline-flex items-center cursor-pointer">
									<input
										type="checkbox"
										checked={Boolean(value)}
										onChange={handleBooleanChange}
										className="sr-only peer"
									/>
									<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
								</label>
							</div>
						</div>
						<div className="flex items-center gap-2 text-sm">
							{Boolean(value) ? (
								<div className="flex items-center gap-1 text-green-700 bg-green-50 px-3 py-1 rounded-full">
									<CheckIcon className="h-4 w-4" />
									<span>Sí</span>
								</div>
							) : (
								<div className="flex items-center gap-1 text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
									<XMarkIcon className="h-4 w-4" />
									<span>No</span>
								</div>
							)}
						</div>
					</div>
				);

			case "number":
				return (
					<div className="space-y-2">
						<input
							type="number"
							value={getSafeValue()}
							onChange={handleNumberChange}
							placeholder={parameter.placeholder}
							min={parameter.min}
							max={parameter.max}
							step="any"
							className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
								error ? "border-red-500" : "border-gray-300"
							}`}
						/>
						{(parameter.min !== undefined || parameter.max !== undefined) && (
							<div className="text-xs text-gray-500 flex items-center justify-between">
								<span>
									{parameter.min !== undefined && parameter.max !== undefined
										? `Rango: ${parameter.min} - ${parameter.max}`
										: parameter.min !== undefined
											? `Mínimo: ${parameter.min}`
											: `Máximo: ${parameter.max}`}
								</span>
								{parameter.unit && (
									<span className="font-medium text-primary-600">
										{parameter.unit}
									</span>
								)}
							</div>
						)}
					</div>
				);

			default: // text
				return (
					<input
						type="text"
						value={getSafeValue()}
						onChange={handleTextChange}
						placeholder={parameter.placeholder}
						className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
							error ? "border-red-500" : "border-gray-300"
						}`}
					/>
				);
		}
	};

	return (
		<div className="space-y-3">
			{/* Label - Solo mostrar si no es boolean (ya tiene su propio label) */}
			{parameter.type !== "boolean" && (
				<label className="block text-sm font-semibold text-gray-900">
					{parameter.label}
					{parameter.required && <span className="text-red-500 ml-1">*</span>}
					{parameter.unit && (
						<span className="text-gray-500 font-normal ml-1">
							({parameter.unit})
						</span>
					)}
				</label>
			)}

			{/* Input */}
			{renderInputByType()}

			{/* Tooltip - Solo mostrar si no es boolean */}
			{parameter.tooltip && parameter.type !== "boolean" && (
				<div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
					<LightBulbIcon className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
					<div className="text-sm text-blue-800">
						<div className="font-medium mb-1">Información:</div>
						<div>{parameter.tooltip}</div>
					</div>
				</div>
			)}

			{/* Error */}
			{error && (
				<div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
					<ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
					<span className="text-sm text-red-700 font-medium">{error}</span>
				</div>
			)}

			{/* Warning */}
			{warning && !error && (
				<div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
					<ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />
					<span className="text-sm text-yellow-700 font-medium">{warning}</span>
				</div>
			)}
		</div>
	);
};

export default ParameterInput;
