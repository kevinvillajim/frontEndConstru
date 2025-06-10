// src/ui/pages/calculations/materials/MaterialCalculationInterface.tsx
import React, {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {
	PlayIcon,
	ArrowLeftIcon,
	ExclamationTriangleIcon,
	CheckCircleIcon,
	CpuChipIcon,
	BookmarkIcon,
	ShareIcon,
	EyeIcon,
	DocumentTextIcon,
	BeakerIcon,
	CubeIcon,
	Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import {BookmarkIcon as BookmarkSolidIcon} from "@heroicons/react/24/solid";
import {
	useMaterialCalculations,
	type MaterialTemplate,
	type MaterialParameter,
	type MaterialCalculationResult,
} from "../shared/hooks/useMaterialCalculations";

interface ParameterInputProps {
	parameter: MaterialParameter;
	value: string | number | boolean | undefined;
	onChange: (name: string, value: string | number | boolean) => void;
	error?: string;
}

const ParameterInput: React.FC<ParameterInputProps> = ({
	parameter,
	value,
	onChange,
	error,
}) => {
	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const newValue =
			parameter.dataType === "number"
				? parseFloat(e.target.value) || 0
				: e.target.value;
		onChange(parameter.name, newValue);
	};

	const renderInput = () => {
		if (parameter.dataType === "enum" && parameter.allowedValues) {
			return (
				<select
					id={parameter.name}
					value={value || parameter.defaultValue || ""}
					onChange={handleChange}
					className={`
						w-full px-4 py-3 border rounded-xl bg-white transition-all duration-200
						focus:ring-2 focus:ring-blue-500 focus:border-blue-500
						${error ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"}
					`}
				>
					<option value="">Seleccionar...</option>
					{parameter.allowedValues.map((option: string) => (
						<option key={option} value={option}>
							{option}
						</option>
					))}
				</select>
			);
		}

		return (
			<input
				id={parameter.name}
				type={parameter.dataType === "number" ? "number" : "text"}
				value={value || parameter.defaultValue || ""}
				onChange={handleChange}
				min={parameter.minValue}
				max={parameter.maxValue}
				step={parameter.dataType === "number" ? "any" : undefined}
				className={`
					w-full px-4 py-3 border rounded-xl bg-white transition-all duration-200
					focus:ring-2 focus:ring-blue-500 focus:border-blue-500
					${error ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"}
				`}
				placeholder={parameter.description || `Ingrese ${parameter.name}`}
			/>
		);
	};

	return (
		<div className="space-y-2">
			<label
				htmlFor={parameter.name}
				className="block text-sm font-medium text-gray-900"
			>
				{parameter.name}
				{parameter.isRequired && <span className="text-red-500 ml-1">*</span>}
				{parameter.unitOfMeasure && (
					<span className="text-gray-500 ml-1 font-normal">
						({parameter.unitOfMeasure})
					</span>
				)}
			</label>

			{renderInput()}

			{parameter.helpText && (
				<p className="text-xs text-gray-600 flex items-center gap-1">
					<EyeIcon className="h-3 w-3" />
					{parameter.helpText}
				</p>
			)}

			{error && (
				<p className="text-sm text-red-600 flex items-center gap-1">
					<ExclamationTriangleIcon className="h-4 w-4" />
					{error}
				</p>
			)}
		</div>
	);
};

const MaterialCalculationInterface: React.FC = () => {
	const {templateId} = useParams<{templateId: string}>();
	const navigate = useNavigate();
	const {
		executeCalculation,
		getTemplate,
		isLoading: calculating,
	} = useMaterialCalculations();

	// Estados principales
	const [template, setTemplate] = useState<MaterialTemplate | null>(null);
	const [parameters, setParameters] = useState<
		Record<string, string | number | boolean>
	>({});
	const [result, setResult] = useState<MaterialCalculationResult | null>(null);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isLoading, setIsLoading] = useState(true);
	const [executionError, setExecutionError] = useState<string | null>(null);
	const [isFavorite, setIsFavorite] = useState(false);
	const [calculationName, setCalculationName] = useState("");

	// Cargar template al montar el componente
	useEffect(() => {
		const loadTemplate = async () => {
			if (!templateId) return;

			try {
				setIsLoading(true);
				const templateData = await getTemplate(templateId);

				if (templateData) {
					setTemplate(templateData);
					setCalculationName(
						`${templateData.name} - ${new Date().toLocaleDateString()}`
					);

					// Inicializar parámetros con valores por defecto
					const initialParams: Record<string, string | number | boolean> = {};
					templateData.parameters?.forEach((param: MaterialParameter) => {
						if (param.scope === "input" && param.defaultValue !== null) {
							initialParams[param.name] =
								param.dataType === "number"
									? parseFloat(param.defaultValue) || 0
									: param.defaultValue;
						}
					});
					setParameters(initialParams);
				}
			} catch (error) {
				console.error("Error loading template:", error);
				setExecutionError("Error al cargar la plantilla");
			} finally {
				setIsLoading(false);
			}
		};

		loadTemplate();
	}, [templateId, getTemplate]);

	// Manejar cambios en parámetros
	const handleParameterChange = (
		name: string,
		value: string | number | boolean
	) => {
		setParameters((prev) => ({...prev, [name]: value}));
		// Limpiar error del parámetro si existe
		if (errors[name]) {
			setErrors((prev) => ({...prev, [name]: ""}));
		}
	};

	// Validar parámetros
	const validateParameters = (): boolean => {
		const newErrors: Record<string, string> = {};
		const inputParams =
			template?.parameters?.filter(
				(p: MaterialParameter) => p.scope === "input"
			) || [];

		inputParams.forEach((param: MaterialParameter) => {
			const value = parameters[param.name];

			if (
				param.isRequired &&
				(value === undefined || value === null || value === "")
			) {
				newErrors[param.name] = "Este campo es requerido";
				return;
			}

			if (value !== undefined && value !== null && value !== "") {
				if (param.dataType === "number") {
					const numValue = Number(value);
					if (isNaN(numValue)) {
						newErrors[param.name] = "Debe ser un número válido";
					} else {
						if (param.minValue !== undefined && numValue < param.minValue) {
							newErrors[param.name] =
								`Debe ser mayor o igual a ${param.minValue}`;
						}
						if (param.maxValue !== undefined && numValue > param.maxValue) {
							newErrors[param.name] =
								`Debe ser menor o igual a ${param.maxValue}`;
						}
					}
				}
			}
		});

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// Ejecutar cálculo
	const handleCalculate = async () => {
		if (!validateParameters()) return;

		try {
			setExecutionError(null);
			setResult(null);

			const calculationRequest = {
				templateId: templateId!,
				templateType: "official" as const,
				inputParameters: parameters,
				includeWaste: true,
				saveResult: true,
				notes: calculationName,
			};

			const calculationResult = await executeCalculation(calculationRequest);
			setResult(calculationResult);
		} catch (error: unknown) {
			console.error("Calculation error:", error);
			const errorMessage =
				error instanceof Error ? error.message : "Error al ejecutar el cálculo";
			setExecutionError(errorMessage);
		}
	};

	// Verificar si se puede calcular
	const canCalculate = () => {
		const inputParams =
			template?.parameters?.filter(
				(p: MaterialParameter) => p.scope === "input"
			) || [];
		const requiredParams = inputParams.filter(
			(p: MaterialParameter) => p.isRequired
		);

		return requiredParams.every((param: MaterialParameter) => {
			const value = parameters[param.name];
			return value !== undefined && value !== null && value !== "";
		});
	};

	// Obtener parámetros de salida
	const outputParameters =
		template?.parameters?.filter(
			(p: MaterialParameter) => p.scope === "output"
		) || [];
	const inputParameters =
		template?.parameters?.filter(
			(p: MaterialParameter) => p.scope === "input"
		) || [];

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<CpuChipIcon className="h-8 w-8 text-blue-600 animate-pulse" />
					</div>
					<h2 className="text-xl font-semibold text-gray-900 mb-2">
						Cargando plantilla...
					</h2>
					<p className="text-gray-600">Preparando la interfaz de cálculo</p>
				</div>
			</div>
		);
	}

	if (!template) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
					</div>
					<h2 className="text-xl font-semibold text-gray-900 mb-2">
						Plantilla no encontrada
					</h2>
					<p className="text-gray-600 mb-6">
						La plantilla que buscas no existe o no está disponible
					</p>
					<button
						onClick={() => navigate("/calculations/materials")}
						className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
					>
						Volver al catálogo
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header con navegación */}
			<div className="bg-white border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<button
								onClick={() => navigate("/calculations/materials")}
								className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
							>
								<ArrowLeftIcon className="h-5 w-5" />
							</button>

							<div className="flex items-center gap-3">
								<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
									<BeakerIcon className="h-6 w-6 text-white" />
								</div>
								<div>
									<h1 className="text-xl font-bold text-gray-900">
										{template.name}
									</h1>
									<p className="text-sm text-gray-600">
										{template.description}
									</p>
								</div>
							</div>
						</div>

						<div className="flex items-center gap-3">
							<button
								onClick={() => setIsFavorite(!isFavorite)}
								className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
							>
								{isFavorite ? (
									<BookmarkSolidIcon className="h-5 w-5 text-yellow-600" />
								) : (
									<BookmarkIcon className="h-5 w-5" />
								)}
							</button>

							<button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
								<ShareIcon className="h-5 w-5" />
							</button>
						</div>
					</div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Panel de parámetros */}
					<div className="lg:col-span-2 space-y-6">
						{/* Información de la plantilla */}
						<div className="bg-white rounded-2xl border border-gray-200 p-6">
							<div className="flex items-start justify-between mb-4">
								<div className="flex items-center gap-3">
									<CubeIcon className="h-6 w-6 text-blue-600" />
									<h2 className="text-lg font-semibold text-gray-900">
										Configuración del Cálculo
									</h2>
								</div>

								{template.necReference && (
									<div className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200">
										{template.necReference}
									</div>
								)}
							</div>

							<div className="mb-6">
								<label className="block text-sm font-medium text-gray-900 mb-2">
									Nombre del cálculo
								</label>
								<input
									type="text"
									value={calculationName}
									onChange={(e) => setCalculationName(e.target.value)}
									className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									placeholder="Nombre descriptivo para este cálculo"
								/>
							</div>
						</div>

						{/* Parámetros de entrada */}
						<div className="bg-white rounded-2xl border border-gray-200 p-6">
							<div className="flex items-center gap-3 mb-6">
								<Cog6ToothIcon className="h-6 w-6 text-blue-600" />
								<h2 className="text-lg font-semibold text-gray-900">
									Parámetros de Entrada
								</h2>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{inputParameters.map((parameter) => (
									<ParameterInput
										key={parameter.id}
										parameter={parameter}
										value={parameters[parameter.name]}
										onChange={handleParameterChange}
										error={errors[parameter.name]}
									/>
								))}
							</div>

							<div className="mt-8 pt-6 border-t border-gray-200">
								<button
									onClick={handleCalculate}
									disabled={!canCalculate() || calculating}
									className={`
										w-full px-6 py-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-3
										${
											canCalculate() && !calculating
												? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl"
												: "bg-gray-300 text-gray-500 cursor-not-allowed"
										}
									`}
								>
									{calculating ? (
										<>
											<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
											Calculando...
										</>
									) : (
										<>
											<PlayIcon className="h-5 w-5" />
											Ejecutar Cálculo
										</>
									)}
								</button>
							</div>
						</div>
					</div>

					{/* Panel de resultados */}
					<div className="lg:col-span-1">
						<div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-8">
							<div className="flex items-center gap-3 mb-6">
								<DocumentTextIcon className="h-6 w-6 text-green-600" />
								<h2 className="text-lg font-semibold text-gray-900">
									Resultados
								</h2>
							</div>

							{executionError && (
								<div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
									<div className="flex items-center gap-2 mb-2">
										<ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
										<span className="text-red-700 font-medium">
											Error en el cálculo
										</span>
									</div>
									<p className="text-red-600 text-sm">{executionError}</p>
								</div>
							)}

							{result && (
								<div className="space-y-4">
									<div className="flex items-center gap-2 text-green-600 mb-4 p-3 bg-green-50 rounded-xl">
										<CheckCircleIcon className="h-5 w-5" />
										<span className="font-medium text-sm">
											Cálculo completado exitosamente
										</span>
									</div>

									{/* Parámetros de salida */}
									{outputParameters.map((param) => {
										const value = result.outputParameters?.[param.name];
										if (value !== undefined) {
											return (
												<div
													key={param.id}
													className="border-b border-gray-100 pb-3 last:border-b-0"
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

									{/* Materiales calculados */}
									{result.materialQuantities &&
										result.materialQuantities.length > 0 && (
											<div className="mt-6">
												<h3 className="text-md font-medium text-gray-900 mb-3">
													Materiales Calculados
												</h3>
												<div className="space-y-3">
													{result.materialQuantities.map(
														(material, index: number) => (
															<div
																key={index}
																className="bg-blue-50 rounded-xl p-4 border border-blue-100"
															>
																<div className="font-medium text-gray-900">
																	{material.name}
																</div>
																<div className="text-sm text-gray-600">
																	{material.quantity.toLocaleString("es-EC")}{" "}
																	{material.unit}
																</div>
																{material.totalPrice && (
																	<div className="text-sm font-medium text-blue-600 mt-1">
																		$
																		{material.totalPrice.toLocaleString(
																			"es-EC",
																			{
																				minimumFractionDigits: 2,
																			}
																		)}
																	</div>
																)}
															</div>
														)
													)}
												</div>
											</div>
										)}

									{/* Costo total */}
									{result.totalCost && (
										<div className="mt-6 pt-4 border-t border-gray-200">
											<div className="text-sm text-gray-600">
												Costo Total Estimado
											</div>
											<div className="text-2xl font-bold text-blue-600">
												$
												{result.totalCost.toLocaleString("es-EC", {
													minimumFractionDigits: 2,
												})}{" "}
												{result.currency || "USD"}
											</div>
										</div>
									)}

									{/* Acciones */}
									<div className="mt-6 pt-4 border-t border-gray-200 space-y-3">
										<button className="w-full px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium">
											Guardar Resultado
										</button>
										<button className="w-full px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium">
											Exportar PDF
										</button>
									</div>
								</div>
							)}

							{!result && !calculating && !executionError && (
								<div className="text-center text-gray-500 py-8">
									<CpuChipIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
									<p className="text-sm">
										Completa los parámetros y ejecuta el cálculo para ver los
										resultados
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MaterialCalculationInterface;
