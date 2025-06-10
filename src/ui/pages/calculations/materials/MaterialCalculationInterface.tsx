// src/ui/pages/calculations/materials/MaterialCalculationInterface.tsx
// CORRECCIÓN: Reemplazados todos los tipos 'any' por tipos específicos

import React, {useState, useEffect, useCallback} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {
	ArrowLeftIcon,
	PlayIcon,
	DocumentDuplicateIcon,
	ShareIcon,
	BookmarkIcon,
	CpuChipIcon,
	ExclamationTriangleIcon,
	CheckCircleIcon,
	SparklesIcon,
} from "@heroicons/react/24/outline";
import {
	useMaterialTemplates,
	useMaterialCalculationExecution,
} from "../shared/hooks/useMaterialCalculations";
import {
	ParameterDataType,
} from "../shared/types/material.types";
import type {	MaterialCalculationTemplate,
	MaterialParameter}  from "../shared/types/material.types";

// Tipos para valores de entrada
type ParameterValue = string | number | boolean | string[];
type InputValues = Record<string, ParameterValue>;
type ValidationErrors = Record<string, string>;

interface ParameterInputProps {
	parameter: MaterialParameter;
	value: ParameterValue;
	onChange: (value: ParameterValue) => void;
	error?: string;
}

const ParameterInput: React.FC<ParameterInputProps> = ({
	parameter,
	value,
	onChange,
	error,
}) => {
	const renderInput = () => {
		switch (parameter.dataType) {
			case ParameterDataType.NUMBER:
				return (
					<input
						type="number"
						value={typeof value === "number" ? value : ""}
						onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
						min={parameter.minValue}
						max={parameter.maxValue}
						step={parameter.step || 0.01}
						className={`
              w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500
              ${error ? "border-red-300 bg-red-50" : "border-gray-300 bg-white"}
            `}
						placeholder={parameter.defaultValue?.toString() || "0"}
					/>
				);

			case ParameterDataType.ENUM:
				return (
					<select
						value={typeof value === "string" ? value : ""}
						onChange={(e) => onChange(e.target.value)}
						className={`
              w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500
              ${error ? "border-red-300 bg-red-50" : "border-gray-300 bg-white"}
            `}
					>
						<option value="">Seleccionar...</option>
						{parameter.allowedValues?.map((option: string) => (
							<option key={option} value={option}>
								{option}
							</option>
						))}
					</select>
				);

			case ParameterDataType.BOOLEAN:
				return (
					<div className="flex items-center">
						<input
							type="checkbox"
							checked={typeof value === "boolean" ? value : false}
							onChange={(e) => onChange(e.target.checked)}
							className="h-4 w-4 text-primary-600 rounded focus:ring-primary-500"
						/>
						<label className="ml-2 text-sm text-gray-700">
							{parameter.description}
						</label>
					</div>
				);

			default:
				return (
					<input
						type="text"
						value={typeof value === "string" ? value : ""}
						onChange={(e) => onChange(e.target.value)}
						className={`
              w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500
              ${error ? "border-red-300 bg-red-50" : "border-gray-300 bg-white"}
            `}
						placeholder={parameter.defaultValue?.toString() || ""}
					/>
				);
		}
	};

	return (
		<div className="space-y-2">
			<label className="block text-sm font-medium text-gray-700">
				{parameter.name}
				{parameter.isRequired && <span className="text-red-500 ml-1">*</span>}
				{parameter.unitOfMeasure && (
					<span className="text-gray-500 ml-1">
						({parameter.unitOfMeasure})
					</span>
				)}
			</label>
			{renderInput()}
			{parameter.helpText && (
				<p className="text-xs text-gray-500">{parameter.helpText}</p>
			)}
			{error && (
				<p className="text-xs text-red-600 flex items-center gap-1">
					<ExclamationTriangleIcon className="h-3 w-3" />
					{error}
				</p>
			)}
		</div>
	);
};

const MaterialCalculationInterface: React.FC = () => {
	const {templateId} = useParams<{templateId: string}>();
	const navigate = useNavigate();
	const {fetchTemplateById} = useMaterialTemplates();
	const {
		executeCalculation,
		executing,
		result,
		error: executionError,
	} = useMaterialCalculationExecution();

	// Estados tipados correctamente
	const [template, setTemplate] = useState<MaterialCalculationTemplate | null>(
		null
	);
	const [loading, setLoading] = useState(true);
	const [inputValues, setInputValues] = useState<InputValues>({});
	const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
		{}
	);
	const [includeWaste, setIncludeWaste] = useState(true);
	const [regionalFactors, setRegionalFactors] = useState("sierra");
	const [currency, setCurrency] = useState("USD");
	const [notes, setNotes] = useState("");

	// useCallback para loadTemplate para evitar dependencias infinitas
	const loadTemplate = useCallback(async () => {
		if (!templateId) return;

		setLoading(true);
		try {
			const templateData = await fetchTemplateById(templateId);
			if (templateData) {
				setTemplate(templateData);
				// Inicializar valores con defaults tipados correctamente
				const initialValues: InputValues = {};
				templateData.parameters
					.filter((p) => p.scope === "input")
					.forEach((param) => {
						if (param.defaultValue !== undefined) {
							initialValues[param.name] = parseDefaultValue(
								param.defaultValue,
								param.dataType
							);
						}
					});
				setInputValues(initialValues);
			}
		} catch (error) {
			console.error("Error cargando template:", error);
		} finally {
			setLoading(false);
		}
	}, [templateId, fetchTemplateById]);

	// Incluir loadTemplate en las dependencias del useEffect
	useEffect(() => {
		if (templateId) {
			loadTemplate();
		}
	}, [templateId, loadTemplate]);

	// Función helper para parsear valores por defecto
	const parseDefaultValue = (
		value: ParameterValue,
		dataType: ParameterDataType
	): ParameterValue => {
		switch (dataType) {
			case ParameterDataType.NUMBER:
				return typeof value === "string"
					? parseFloat(value)
					: (value as number);
			case ParameterDataType.BOOLEAN:
				return typeof value === "string"
					? value.toLowerCase() === "true"
					: (value as boolean);
			case ParameterDataType.ARRAY:
				if (typeof value === "string") {
					try {
						return JSON.parse(value);
					} catch {
						return value.split(",");
					}
				}
				return value as string[];
			default:
				return value as string;
		}
	};

	// Manejar cambios en inputs tipados correctamente
	const handleInputChange = (parameterName: string, value: ParameterValue) => {
		setInputValues((prev) => ({
			...prev,
			[parameterName]: value,
		}));

		// Limpiar error de validación si existe
		if (validationErrors[parameterName]) {
			setValidationErrors((prev) => {
				const newErrors = {...prev};
				delete newErrors[parameterName];
				return newErrors;
			});
		}
	};

	// Validar inputs antes de ejecutar
	const validateInputs = (): boolean => {
		if (!template) return false;

		const errors: ValidationErrors = {};
		const inputParams = template.parameters.filter((p) => p.scope === "input");

		inputParams.forEach((param) => {
			const value = inputValues[param.name];

			// Validar campos requeridos
			if (
				param.isRequired &&
				(value === undefined || value === "" || value === null)
			) {
				errors[param.name] = "Este campo es requerido";
				return;
			}

			// Validar números
			if (
				param.dataType === ParameterDataType.NUMBER &&
				value !== undefined &&
				value !== ""
			) {
				const numValue =
					typeof value === "number" ? value : parseFloat(value as string);

				if (isNaN(numValue)) {
					errors[param.name] = "Debe ser un número válido";
				} else {
					if (param.minValue !== undefined && numValue < param.minValue) {
						errors[param.name] = `Debe ser mayor o igual a ${param.minValue}`;
					}
					if (param.maxValue !== undefined && numValue > param.maxValue) {
						errors[param.name] = `Debe ser menor o igual a ${param.maxValue}`;
					}
				}
			}

			// Validar patrones regex
			if (
				param.regexPattern &&
				value &&
				typeof value === "string" &&
				!new RegExp(param.regexPattern).test(value)
			) {
				errors[param.name] = "Formato inválido";
			}
		});

		setValidationErrors(errors);
		return Object.keys(errors).length === 0;
	};

	// Ejecutar cálculo
	const handleExecute = async () => {
		if (!template || !validateInputs()) return;

		try {
			await executeCalculation({
				templateId: template.id,
				templateType: template.type,
				inputParameters: Object.fromEntries(
					Object.entries(inputValues).map(([key, value]) => [
						key,
						Array.isArray(value) ? value.join(",") : value,
					])
				),
				includeWaste,
				regionalFactors,
				currency,
				notes,
				saveResult: true,
			});
		} catch (error) {
			console.error("Error en ejecución:", error);
		}
	};

	// Funciones de acciones tipadas
	const handleDuplicate = () => {
		if (template) {
			navigate(`/calculations/materials/templates/duplicate/${template.id}`);
		}
	};

	const handleShare = () => {
		if (template) {
			// Implementar lógica de compartir
			console.log("Compartir template:", template.id);
		}
	};

	const handleBookmark = () => {
		if (template) {
			// Implementar lógica de favoritos
			console.log("Agregar a favoritos:", template.id);
		}
	};

	// Estados de carga
	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="flex items-center space-x-3">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
					<span className="text-gray-600">Cargando plantilla...</span>
				</div>
			</div>
		);
	}

	if (!template) {
		return (
			<div className="max-w-4xl mx-auto px-4 py-8">
				<div className="bg-white rounded-xl border border-red-200 p-8 text-center">
					<ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
					<h2 className="text-xl font-semibold text-gray-900 mb-2">
						Plantilla no encontrada
					</h2>
					<p className="text-gray-600 mb-6">
						La plantilla solicitada no existe o no está disponible.
					</p>
					<button
						onClick={() => navigate("/calculations/materials")}
						className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
					>
						Volver al catálogo
					</button>
				</div>
			</div>
		);
	}

	const inputParameters = template.parameters.filter(
		(p) => p.scope === "input"
	);
	const outputParameters = template.parameters.filter(
		(p) => p.scope === "output"
	);

	return (
		<div className="max-w-6xl mx-auto px-4 py-6">
			{/* Header */}
			<div className="mb-6">
				<div className="flex items-center justify-between mb-4">
					<button
						onClick={() => navigate("/calculations/materials")}
						className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
					>
						<ArrowLeftIcon className="h-5 w-5 mr-2" />
						Volver al catálogo
					</button>

					<div className="flex items-center space-x-2">
						<button
							onClick={handleBookmark}
							className="p-2 text-gray-400 hover:text-yellow-500 transition-colors"
							title="Agregar a favoritos"
						>
							<BookmarkIcon className="h-5 w-5" />
						</button>
						<button
							onClick={handleDuplicate}
							className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
							title="Duplicar plantilla"
						>
							<DocumentDuplicateIcon className="h-5 w-5" />
						</button>
						<button
							onClick={handleShare}
							className="p-2 text-gray-400 hover:text-green-500 transition-colors"
							title="Compartir"
						>
							<ShareIcon className="h-5 w-5" />
						</button>
					</div>
				</div>

				<div className="bg-white rounded-xl border border-gray-200 p-6">
					<div className="flex items-start justify-between">
						<div className="flex-1">
							<h1 className="text-2xl font-bold text-gray-900 mb-2">
								{template.name}
							</h1>
							<p className="text-gray-600 mb-4">{template.description}</p>

							<div className="flex items-center space-x-4 text-sm text-gray-500">
								<span className="flex items-center">
									<CpuChipIcon className="h-4 w-4 mr-1" />
									{template.type.replace("_", " ")}
								</span>
								{template.difficulty && (
									<span className="capitalize">{template.difficulty}</span>
								)}
								{template.estimatedTime && (
									<span>~{template.estimatedTime}</span>
								)}
								<span className="flex items-center">
									<SparklesIcon className="h-4 w-4 mr-1" />
									{template.usageCount} usos
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Panel de parámetros de entrada */}
				<div className="lg:col-span-2">
					<div className="bg-white rounded-xl border border-gray-200 p-6">
						<h2 className="text-lg font-semibold text-gray-900 mb-6">
							Parámetros de Entrada
						</h2>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{inputParameters.map((parameter) => (
								<ParameterInput
									key={parameter.id}
									parameter={parameter}
									value={inputValues[parameter.name]}
									onChange={(value) => handleInputChange(parameter.name, value)}
									error={validationErrors[parameter.name]}
								/>
							))}
						</div>

						{/* Configuraciones adicionales */}
						<div className="mt-8 pt-6 border-t border-gray-200">
							<h3 className="text-md font-medium text-gray-900 mb-4">
								Configuraciones Adicionales
							</h3>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Incluir desperdicios
									</label>
									<input
										type="checkbox"
										checked={includeWaste}
										onChange={(e) => setIncludeWaste(e.target.checked)}
										className="h-4 w-4 text-primary-600 rounded focus:ring-primary-500"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Región
									</label>
									<select
										value={regionalFactors}
										onChange={(e) => setRegionalFactors(e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
									>
										<option value="costa">Costa</option>
										<option value="sierra">Sierra</option>
										<option value="oriente">Oriente</option>
										<option value="galapagos">Galápagos</option>
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Moneda
									</label>
									<select
										value={currency}
										onChange={(e) => setCurrency(e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
									>
										<option value="USD">USD</option>
										<option value="EUR">EUR</option>
									</select>
								</div>
							</div>

							<div className="mt-4">
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Notas adicionales
								</label>
								<textarea
									value={notes}
									onChange={(e) => setNotes(e.target.value)}
									rows={3}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
									placeholder="Agregar notas o comentarios sobre este cálculo..."
								/>
							</div>
						</div>

						{/* Botón de ejecutar */}
						<div className="mt-6">
							<button
								onClick={handleExecute}
								disabled={executing || Object.keys(validationErrors).length > 0}
								className={`
									w-full flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors
									${
										executing || Object.keys(validationErrors).length > 0
											? "bg-gray-300 text-gray-500 cursor-not-allowed"
											: "bg-primary-600 text-white hover:bg-primary-700"
									}
								`}
							>
								{executing ? (
									<>
										<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
										Calculando...
									</>
								) : (
									<>
										<PlayIcon className="h-5 w-5 mr-2" />
										Ejecutar Cálculo
									</>
								)}
							</button>
						</div>
					</div>
				</div>

				{/* Panel de resultados */}
				<div className="lg:col-span-1">
					<div className="bg-white rounded-xl border border-gray-200 p-6">
						<h2 className="text-lg font-semibold text-gray-900 mb-6">
							Resultados
						</h2>

						{executionError && (
							<div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
								<div className="flex items-center">
									<ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
									<span className="text-red-700 font-medium">
										Error en el cálculo
									</span>
								</div>
								<p className="text-red-600 text-sm mt-1">{executionError}</p>
							</div>
						)}

						{result && (
							<div className="space-y-4">
								<div className="flex items-center text-green-600 mb-4">
									<CheckCircleIcon className="h-5 w-5 mr-2" />
									<span className="font-medium">
										Cálculo completado exitosamente
									</span>
								</div>

								{/* Mostrar resultados de output parameters */}
								{outputParameters.map((param) => {
									const value = result.outputParameters?.[param.name];
									if (value !== undefined) {
										return (
											<div
												key={param.id}
												className="border-b border-gray-100 pb-3"
											>
												<div className="text-sm font-medium text-gray-700">
													{param.name}
													{param.unitOfMeasure && (
														<span className="text-gray-500 ml-1">
															({param.unitOfMeasure})
														</span>
													)}
												</div>
												<div className="text-lg font-semibold text-gray-900">
													{typeof value === "number"
														? value.toLocaleString("es-EC", {
																maximumFractionDigits: 2,
															})
														: value}
												</div>
												{param.description && (
													<div className="text-xs text-gray-500 mt-1">
														{param.description}
													</div>
												)}
											</div>
										);
									}
									return null;
								})}

								{/* Mostrar materiales calculados */}
								{result.materialQuantities &&
									result.materialQuantities.length > 0 && (
										<div className="mt-6">
											<h3 className="text-md font-medium text-gray-900 mb-3">
												Materiales Calculados
											</h3>
											<div className="space-y-2">
												{result.materialQuantities.map((material, index) => (
													<div
														key={index}
														className="bg-gray-50 rounded-lg p-3"
													>
														<div className="font-medium text-gray-900">
															{material.name}
														</div>
														<div className="text-sm text-gray-600">
															{material.quantity.toLocaleString("es-EC")}{" "}
															{material.unit}
														</div>
														{material.totalPrice && (
															<div className="text-sm font-medium text-primary-600">
																$
																{material.totalPrice.toLocaleString("es-EC", {
																	minimumFractionDigits: 2,
																})}
															</div>
														)}
													</div>
												))}
											</div>
										</div>
									)}

								{/* Costo total estimado */}
								{result.totalEstimatedCost && (
									<div className="mt-6 pt-4 border-t border-gray-200">
										<div className="text-sm text-gray-600">
											Costo Total Estimado
										</div>
										<div className="text-2xl font-bold text-primary-600">
											$
											{result.totalEstimatedCost.toLocaleString("es-EC", {
												minimumFractionDigits: 2,
											})}{" "}
											{result.currency}
										</div>
									</div>
								)}
							</div>
						)}

						{!result && !executing && !executionError && (
							<div className="text-center text-gray-500 py-8">
								<CpuChipIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
								<p>
									Completa los parámetros y ejecuta el cálculo para ver los
									resultados
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default MaterialCalculationInterface;
