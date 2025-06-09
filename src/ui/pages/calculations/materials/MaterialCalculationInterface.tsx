// src/ui/pages/calculations/materials/MaterialCalculationInterface.tsx

import React, {useState, useEffect, useMemo} from "react";
import type {
	MaterialCalculationTemplate,
	MaterialCalculationResult,
	MaterialParameter,
	MaterialExecutionRequest,
} from "../shared/types/material.types";
import { MATERIAL_CATEGORIES } from "../shared/types/material.types";
import {useMaterialCalculationExecution} from "../shared/hooks/useMaterialCalculations";

interface MaterialCalculationInterfaceProps {
	template: MaterialCalculationTemplate;
	onResult: (result: MaterialCalculationResult) => void;
	onBack: () => void;
}

interface ParameterValue {
	value: string | number | boolean | null;
	isValid: boolean;
	error?: string;
}

const MaterialCalculationInterface: React.FC<
	MaterialCalculationInterfaceProps
> = ({template, onResult, onBack}) => {
	const [parameters, setParameters] = useState<Record<string, ParameterValue>>(
		{}
	);
	const [notes, setNotes] = useState("");
	const [includeWaste, setIncludeWaste] = useState(true);
	const [saveResult, setSaveResult] = useState(true);
	// Removed unused previewData state

	const {
		executing,
		result,
		error,
		executeCalculation,
		clearError,
	} = useMaterialCalculationExecution();

	const categoryConfig = MATERIAL_CATEGORIES[template.type];

	// Filtrar parámetros por tipo
	const inputParameters = useMemo(
		() =>
			template.parameters
				.filter((p) => p.scope === "input")
				.sort((a, b) => a.displayOrder - b.displayOrder),
		[template.parameters]
	);

	const outputParameters = useMemo(
		() =>
			template.parameters
				.filter((p) => p.scope === "output")
				.sort((a, b) => a.displayOrder - b.displayOrder),
		[template.parameters]
	);

	// Inicializar parámetros con valores por defecto
	useEffect(() => {
		const initialParams: Record<string, ParameterValue> = {};

		inputParameters.forEach((param) => {
			initialParams[param.name] = {
				value: param.defaultValue || "",
				isValid: !param.isRequired || !!param.defaultValue,
			};
		});

		setParameters(initialParams);
	}, [inputParameters]);

	const validateParameter = (
		param: MaterialParameter,
		value: string | number | boolean | null
	): {isValid: boolean; error?: string} => {
		if (param.isRequired && (!value || value === "")) {
			return {isValid: false, error: "Este campo es requerido"};
		}

		if (value === "" || value === null || value === undefined) {
			return {isValid: true};
		}

		if (param.dataType === "number") {
			const numValue = parseFloat(String(value));
			if (isNaN(numValue)) {
				return {isValid: false, error: "Debe ser un número válido"};
			}
			if (param.minValue !== undefined && numValue < param.minValue) {
				return {isValid: false, error: `Valor mínimo: ${param.minValue}`};
			}
			if (param.maxValue !== undefined && numValue > param.maxValue) {
				return {isValid: false, error: `Valor máximo: ${param.maxValue}`};
			}
		}

		if (param.dataType === "enum" && param.allowedValues) {
			if (!param.allowedValues.includes(String(value))) {
				return {isValid: false, error: "Valor no válido"};
			}
		}

		return {isValid: true};
	};

	const handleParameterChange = (paramName: string, value: string | number | boolean | null) => {
		const param = inputParameters.find((p) => p.name === paramName);
		if (!param) return;

		const validation = validateParameter(param, value);

		setParameters((prev) => ({
			...prev,
			[paramName]: {
				value,
				isValid: validation.isValid,
				error: validation.error,
			},
		}));
	};

	const isFormValid = useMemo(() => {
		return inputParameters.every((param) => {
			const paramValue = parameters[param.name];
			if (!paramValue) return !param.isRequired;
			return paramValue.isValid;
		});
	}, [parameters, inputParameters]);

	const handleExecuteCalculation = async () => {
		if (!isFormValid) return;

		const inputData: Record<string, string | number | boolean | string[]> = {};
		Object.entries(parameters).forEach(([key, paramValue]) => {
			const param = inputParameters.find((p) => p.name === key);
			if (param && paramValue.value !== "" && paramValue.value !== null) {
				inputData[key] =
					param.dataType === "number"
						? parseFloat(typeof paramValue.value === "string" ? paramValue.value : "")
						: paramValue.value;
			}
		});

		const request: MaterialExecutionRequest = {
			templateId: template.id,
			templateType: template.type,
			inputParameters: inputData,
			includeWaste,
			notes: notes.trim() || undefined,
			saveResult,
		};

		try {
			const calculationResult = await executeCalculation(request);
			onResult(calculationResult);
		} catch {
			// Error se maneja en el hook
		}
	};

	const ParameterInput: React.FC<{param: MaterialParameter}> = ({param}) => {
		const paramValue = parameters[param.name];

		const baseInputClasses = `
      w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 
      text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
      focus:outline-none focus:ring-2 transition-colors
      ${
				paramValue?.isValid !== false
					? "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
					: "border-red-500 focus:ring-red-500 focus:border-red-500"
			}
    `;

		const renderInput = () => {
			switch (param.dataType) {
				case "number":
					return (
						<div className="relative">
							<input
								type="number"
								value={paramValue?.value === true ? "true" : paramValue?.value || ""}
								onChange={(e) =>
									handleParameterChange(param.name, e.target.value)
								}
								placeholder={`Ingresa ${param.description.toLowerCase()}`}
								className={baseInputClasses}
								min={param.minValue}
								max={param.maxValue}
								step="any"
							/>
							{param.unitOfMeasure && (
								<div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
									{param.unitOfMeasure}
								</div>
							)}
						</div>
					);

				case "enum":
					return (
						<select
							value={paramValue?.value === true ? "true" : paramValue?.value || ""}
							onChange={(e) =>
								handleParameterChange(param.name, e.target.value)
							}
							className={baseInputClasses}
						>
							<option value="">Selecciona una opción</option>
							{param.allowedValues?.map((option, index) => (
								<option key={index} value={option}>
									{option}
								</option>
							))}
						</select>
					);

				case "boolean":
					return (
						<div className="flex items-center space-x-3">
							<input
								type="checkbox"
								checked={
									paramValue?.value === true || paramValue?.value === "true"
								}
								onChange={(e) =>
									handleParameterChange(param.name, e.target.checked)
								}
								className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
							/>
							<label className="text-gray-700 dark:text-gray-300">
								{param.description}
							</label>
						</div>
					);

				default:
					return (
						<input
							type="text"
							value={paramValue?.value === true ? "true" : paramValue?.value || ""}
							onChange={(e) =>
								handleParameterChange(param.name, e.target.value)
							}
							placeholder={`Ingresa ${param.description.toLowerCase()}`}
							className={baseInputClasses}
						/>
					);
			}
		};

		return (
			<div className="space-y-2">
				<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
					{param.description}
					{param.isRequired && <span className="text-red-500 ml-1">*</span>}
				</label>

				{renderInput()}

				{paramValue?.error && (
					<p className="text-red-500 text-sm flex items-center space-x-1">
						<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
							<path
								fillRule="evenodd"
								d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
								clipRule="evenodd"
							/>
						</svg>
						<span>{paramValue.error}</span>
					</p>
				)}

				{param.helpText && (
					<p className="text-gray-500 dark:text-gray-400 text-sm">
						💡 {param.helpText}
					</p>
				)}

				{param.minValue !== undefined || param.maxValue !== undefined ? (
					<p className="text-gray-500 dark:text-gray-400 text-xs">
						Rango: {param.minValue ?? "∞"} - {param.maxValue ?? "∞"}{" "}
						{param.unitOfMeasure}
					</p>
				) : null}
			</div>
		);
	};

	const ResultsDisplay: React.FC<{result: MaterialCalculationResult}> = ({
		result,
	}) => {
		return (
			<div className="space-y-6">
				{/* Header de resultados */}
				<div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
					<div className="flex items-center space-x-3 mb-4">
						<div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
							<svg
								className="w-6 h-6 text-green-600 dark:text-green-400"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fillRule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clipRule="evenodd"
								/>
							</svg>
						</div>
						<div>
							<h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
								Cálculo Completado Exitosamente
							</h3>
							<p className="text-green-700 dark:text-green-300 text-sm">
								Tiempo de ejecución: {result.executionTime}ms
							</p>
						</div>
					</div>
				</div>

				{/* Resultados principales */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{outputParameters.map((param) => {
						const value = result.results[param.name];
						if (value === undefined || value === null) return null;

						return (
							<div
								key={param.name}
								className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6"
							>
								<div className="flex items-center justify-between mb-2">
									<h4 className="font-medium text-gray-900 dark:text-white">
										{param.description}
									</h4>
									{param.unitOfMeasure && (
										<span className="text-sm text-gray-500 dark:text-gray-400">
											{param.unitOfMeasure}
										</span>
									)}
								</div>
								<div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
									{typeof value === "number" ? value.toLocaleString() : value}
								</div>
							</div>
						);
					})}
				</div>

				{/* Lista de materiales */}
				{result.materialQuantities && result.materialQuantities.length > 0 && (
					<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
						<div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
								Lista de Materiales
							</h3>
						</div>
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead className="bg-gray-50 dark:bg-gray-700">
									<tr>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
											Material
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
											Cantidad
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
											Unidad
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
											Costo Unit.
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
											Total
										</th>
									</tr>
								</thead>
								<tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
									{result.materialQuantities.map((material, index) => (
										<tr
											key={index}
											className="hover:bg-gray-50 dark:hover:bg-gray-700"
										>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
												{material.materialType}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
												{material.quantity.toLocaleString()}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
												{material.unit}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
												{material.unitCost
													? `$${material.unitCost.toFixed(2)}`
													: "-"}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
												{material.totalCost
													? `$${material.totalCost.toFixed(2)}`
													: "-"}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						{result.totalCost && (
							<div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
								<div className="flex justify-between items-center">
									<span className="text-lg font-semibold text-gray-900 dark:text-white">
										Costo Total:
									</span>
									<span className="text-2xl font-bold text-green-600 dark:text-green-400">
										${result.totalCost.toLocaleString()}
									</span>
								</div>
							</div>
						)}
					</div>
				)}

				{/* Acciones */}
				<div className="flex flex-col sm:flex-row gap-4">
					<button
						onClick={() => {
							// Implementar descarga
						}}
						className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
					>
						<svg
							className="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
						<span>Descargar PDF</span>
					</button>

					<button
						onClick={() => {
							// Implementar compartir
						}}
						className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
					>
						<svg
							className="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
							/>
						</svg>
						<span>Compartir</span>
					</button>

					<button
						onClick={onBack}
						className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
					>
						Nuevo Cálculo
					</button>
				</div>
			</div>
		);
	};

	// Si ya hay resultado, mostrar resultados
	if (result) {
		return (
			<div className="max-w-6xl mx-auto">
				<ResultsDisplay result={result} />
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto">
			{/* Header */}
			<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
				<div className="flex items-center space-x-4 mb-4">
					<button
						onClick={onBack}
						className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
					>
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 19l-7-7 7-7"
							/>
						</svg>
					</button>

					<div
						className={`
            w-12 h-12 rounded-lg flex items-center justify-center
            ${categoryConfig.color} bg-opacity-20
          `}
					>
						<span className="text-2xl">{categoryConfig.icon}</span>
					</div>

					<div className="flex-1">
						<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
							{template.name}
						</h1>
						<p className="text-gray-600 dark:text-gray-300">
							{template.description}
						</p>
					</div>

					{template.isVerified && (
						<div className="flex items-center text-green-600 dark:text-green-400 text-sm">
							<svg
								className="w-5 h-5 mr-1"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fillRule="evenodd"
									d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clipRule="evenodd"
								/>
							</svg>
							Plantilla Verificada
						</div>
					)}
				</div>
			</div>

			{/* Formulario de parámetros */}
			<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
				<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
					Parámetros de Entrada
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{inputParameters.map((param) => (
						<ParameterInput key={param.name} param={param} />
					))}
				</div>
			</div>

			{/* Opciones adicionales */}
			<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
				<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
					Opciones Adicionales
				</h3>

				<div className="space-y-4">
					<label className="flex items-center space-x-3">
						<input
							type="checkbox"
							checked={includeWaste}
							onChange={(e) => setIncludeWaste(e.target.checked)}
							className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
						/>
						<span className="text-gray-700 dark:text-gray-300">
							Incluir factor de desperdicio (recomendado)
						</span>
					</label>

					<label className="flex items-center space-x-3">
						<input
							type="checkbox"
							checked={saveResult}
							onChange={(e) => setSaveResult(e.target.checked)}
							className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
						/>
						<span className="text-gray-700 dark:text-gray-300">
							Guardar resultado para consulta posterior
						</span>
					</label>

					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Notas adicionales (opcional)
						</label>
						<textarea
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
							placeholder="Agrega cualquier información adicional sobre este cálculo..."
							rows={3}
							className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
				</div>
			</div>

			{/* Error display */}
			{error && (
				<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
					<div className="flex items-center space-x-2">
						<svg
							className="w-5 h-5 text-red-500"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path
								fillRule="evenodd"
								d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
								clipRule="evenodd"
							/>
						</svg>
						<span className="text-red-700 dark:text-red-300">{error}</span>
						<button
							onClick={clearError}
							className="ml-auto text-red-500 hover:text-red-700 transition-colors"
						>
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>
				</div>
			)}

			{/* Botón de ejecución */}
			<div className="flex justify-end">
				<button
					onClick={handleExecuteCalculation}
					disabled={!isFormValid || executing}
					className={`
            px-8 py-4 rounded-lg font-medium text-lg transition-all
            ${
							isFormValid && !executing
								? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
								: "bg-gray-400 text-gray-700 cursor-not-allowed"
						}
            ${executing ? "animate-pulse" : ""}
          `}
				>
					{executing ? (
						<div className="flex items-center space-x-2">
							<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
							<span>Calculando...</span>
						</div>
					) : (
						<div className="flex items-center space-x-2">
							<svg
								className="w-6 h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
								/>
							</svg>
							<span>Ejecutar Cálculo</span>
						</div>
					)}
				</button>
			</div>
		</div>
	);
};

export default MaterialCalculationInterface;
