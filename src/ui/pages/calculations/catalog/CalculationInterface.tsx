import React, {useState, useEffect, useMemo, useCallback} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	CheckBadgeIcon,
	BookOpenIcon,
	StarIcon,
	ClockIcon,
	CalculatorIcon,
	DocumentArrowDownIcon,
	HeartIcon,
	ExclamationTriangleIcon,
	LightBulbIcon,
	CheckIcon,
	PencilSquareIcon,
	UserGroupIcon,
	SparklesIcon,
	EyeIcon,
	PlayIcon,
	DocumentDuplicateIcon,
	ShareIcon,
	PrinterIcon,
	UserIcon,
	ChartBarIcon,
	CpuChipIcon,
	DocumentTextIcon,
	InformationCircleIcon,
	CheckCircleIcon,
} from "@heroicons/react/24/outline";
import {HeartIcon as HeartSolidIcon} from "@heroicons/react/24/solid";
import ParameterInput from "./components/ParameterInput";
import {useTemplates} from "../shared/hooks/useTemplates";
import {useCalculations} from "../shared/hooks/useCalculations";
import type {
	MyCalculationTemplate,
	TemplateParameter,
} from "../shared/types/template.types";

interface ValidationResult {
	isValid: boolean;
	errors: Record<string, string>;
	warnings: Record<string, string>;
}

type CalculationStep = "overview" | "parameters" | "calculating" | "results";

const CalculationInterface: React.FC = () => {
	const {templateId} = useParams<{templateId: string}>();
	const navigate = useNavigate();

	// Hooks
	const {getTemplate, toggleFavorite} = useTemplates();
	const {executeCalculation, saveCalculationResult} = useCalculations();

	// Estados principales
	const [template, setTemplate] = useState<MyCalculationTemplate | null>(null);
	const [currentStep, setCurrentStep] = useState<CalculationStep>("overview");
	const [parameters, setParameters] = useState<Record<string, any>>({});
	const [results, setResults] = useState<any | null>(null);
	const [isCalculating, setIsCalculating] = useState(false);
	const [isFavorite, setIsFavorite] = useState(false);
	const [calculationName, setCalculationName] = useState("");
	const [calculationHistory, setCalculationHistory] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Cargar plantilla desde la API
	useEffect(() => {
		const loadTemplate = async () => {
			if (!templateId) {
				setError("ID de plantilla no válido");
				setLoading(false);
				return;
			}

			try {
				setLoading(true);
				setError(null);

				const templateData = await getTemplate(templateId);

				if (!templateData) {
					setError("Plantilla no encontrada");
					setLoading(false);
					return;
				}

				setTemplate(templateData);
				setIsFavorite(templateData.isFavorite || false);

				// Inicializar parámetros con valores por defecto
				const defaultParams: Record<string, any> = {};
				if (templateData.parameters) {
					templateData.parameters.forEach((param) => {
						if (param.defaultValue !== undefined) {
							defaultParams[param.name] = param.defaultValue;
						}
					});
				}
				setParameters(defaultParams);

				// Nombre por defecto para el cálculo
				setCalculationName(
					`${templateData.name} - ${new Date().toLocaleDateString()}`
				);
			} catch (err) {
				console.error("Error loading template:", err);
				setError("Error cargando la plantilla");
			} finally {
				setLoading(false);
			}
		};

		loadTemplate();
	}, [templateId, getTemplate]);

	// Validación de parámetros
	const validation = useMemo((): ValidationResult => {
		if (!template || !template.parameters) {
			return {isValid: false, errors: {}, warnings: {}};
		}

		const errors: Record<string, string> = {};
		const warnings: Record<string, string> = {};

		template.parameters.forEach((param) => {
			const value = parameters[param.name];

			// Validación requerido
			if (
				param.required &&
				(value === undefined || value === "" || value === null)
			) {
				errors[param.name] = "Este campo es requerido";
				return;
			}

			// Validación por tipo
			if (value !== undefined && value !== "") {
				switch (param.type) {
					case "number":
						const numValue = Number(value);
						if (isNaN(numValue)) {
							errors[param.name] = "Debe ser un número válido";
						} else {
							if (param.min !== undefined && numValue < param.min) {
								errors[param.name] = `Valor mínimo: ${param.min}`;
							}
							if (param.max !== undefined && numValue > param.max) {
								errors[param.name] = `Valor máximo: ${param.max}`;
							}
						}
						break;

					case "text":
						if (param.validation?.pattern) {
							const regex = new RegExp(param.validation.pattern);
							if (!regex.test(String(value))) {
								errors[param.name] =
									param.validation.message || "Formato inválido";
							}
						}
						break;
				}
			}
		});

		return {
			isValid: Object.keys(errors).length === 0,
			errors,
			warnings,
		};
	}, [parameters, template]);

	// Handlers
	const handleParameterChange = useCallback((paramName: string, value: any) => {
		setParameters((prev) => ({...prev, [paramName]: value}));
	}, []);

	const handleToggleFavorite = useCallback(async () => {
		if (!template) return;

		try {
			await toggleFavorite(template.id);
			setIsFavorite((prev) => !prev);
		} catch (error) {
			console.error("Error toggling favorite:", error);
		}
	}, [template, toggleFavorite]);

	const handleCalculate = useCallback(async () => {
		if (!validation.isValid || !template) return;

		setIsCalculating(true);
		setCurrentStep("calculating");

		try {
			// Ejecutar cálculo usando el servicio real
			const calculationResults = await executeCalculation(
				template.id,
				parameters
			);

			setResults(calculationResults);
			setCurrentStep("results");

			// Agregar al historial
			const newCalculation = {
				id: Date.now(),
				timestamp: new Date().toISOString(),
				inputs: {...parameters},
				results: calculationResults,
			};
			setCalculationHistory((prev) => [newCalculation, ...prev.slice(0, 4)]);
		} catch (error) {
			console.error("Error en cálculo:", error);
			setError(
				error instanceof Error ? error.message : "Error ejecutando el cálculo"
			);
			setCurrentStep("parameters");
		} finally {
			setIsCalculating(false);
		}
	}, [validation.isValid, template, parameters, executeCalculation]);

	const handleStepNavigation = useCallback(
		(step: CalculationStep) => {
			if (step === "calculating" || isCalculating) return;
			setCurrentStep(step);
			if (step !== "results") {
				setError(null);
			}
		},
		[isCalculating]
	);

	const handleSaveResult = useCallback(async () => {
		if (!results || !template) return;

		try {
			await saveCalculationResult({
				id: results.id || `calc_${Date.now()}`,
				name: calculationName,
				notes: "Cálculo realizado en interface",
				usedInProject: false,
				projectId: undefined,
			});

			// Mostrar notificación de éxito (puedes implementar un toast)
			console.log("Resultado guardado exitosamente");
		} catch (error) {
			console.error("Error guardando resultado:", error);
		}
	}, [results, template, calculationName, saveCalculationResult]);

	// Configuración de dificultad y profesión
	const getDifficultyConfig = (difficulty: string) => {
		switch (difficulty) {
			case "basic":
				return {
					color: "bg-green-100 text-green-700 border-green-200",
					label: "Básico",
				};
			case "intermediate":
				return {
					color: "bg-yellow-100 text-yellow-700 border-yellow-200",
					label: "Intermedio",
				};
			case "advanced":
				return {
					color: "bg-red-100 text-red-700 border-red-200",
					label: "Avanzado",
				};
			default:
				return {
					color: "bg-gray-100 text-gray-700 border-gray-200",
					label: difficulty || "General",
				};
		}
	};

	const getTypeIcon = (type: string) => {
		switch (type) {
			case "electrical":
				return CalculatorIcon;
			case "structural":
				return BookOpenIcon;
			case "installation":
				return CpuChipIcon;
			case "foundation":
				return ChartBarIcon;
			default:
				return CalculatorIcon;
		}
	};

	// Estados de loading y error
	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Cargando plantilla...</p>
				</div>
			</div>
		);
	}

	if (error || !template) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
					<h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
					<p className="text-gray-600 mb-4">
						{error || "Plantilla no encontrada"}
					</p>
					<button
						onClick={() => navigate("/calculations/catalog")}
						className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
					>
						Volver al Catálogo
					</button>
				</div>
			</div>
		);
	}

	const difficultyConfig = getDifficultyConfig(template.difficulty);
	const TypeIcon = getTypeIcon(template.category);

	// Componente del indicador de pasos
	const StepIndicator = () => {
		const steps = [
			{id: "overview", label: "Vista General", icon: EyeIcon},
			{id: "parameters", label: "Parámetros", icon: PencilSquareIcon},
			{id: "calculating", label: "Calculando", icon: CalculatorIcon},
			{id: "results", label: "Resultados", icon: CheckIcon},
		];

		return (
			<div className="flex items-center justify-center mb-8 overflow-x-auto">
				<div className="flex items-center space-x-2">
					{steps.map((step, index) => {
						const isActive = currentStep === step.id;
						const isCompleted =
							steps.findIndex((s) => s.id === currentStep) > index;
						const isClickable = step.id !== "calculating" && !isCalculating;
						const Icon = step.icon;

						return (
							<React.Fragment key={step.id}>
								<button
									onClick={() =>
										isClickable &&
										handleStepNavigation(step.id as CalculationStep)
									}
									disabled={!isClickable}
									className={`flex flex-col items-center p-3 rounded-xl transition-all duration-300 ${
										isActive
											? "bg-primary-600 text-white shadow-lg scale-105"
											: isCompleted
												? "bg-green-700 text-white"
												: "bg-gray-200 text-gray-600 hover:bg-gray-300"
									} ${isClickable ? "cursor-pointer" : "cursor-not-allowed"}`}
								>
									<Icon className="h-5 w-5 mb-1" />
									<span className="text-xs font-medium">{step.label}</span>
								</button>
								{index < steps.length - 1 && (
									<div
										className={`w-8 h-1 transition-all duration-300 ${
											isCompleted ? "bg-green-800" : "bg-gray-200"
										}`}
									/>
								)}
							</React.Fragment>
						);
					})}
				</div>
			</div>
		);
	};

	// Vista general de la plantilla
	const OverviewView = () => (
		<div className="space-y-6">
			<div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
				{/* Header colorido */}
				<div className="h-32 bg-gradient-to-r from-primary-500 to-secondary-500 relative overflow-hidden">
					<div className="absolute inset-0 bg-primary-600 bg-opacity-20" />
					<div className="absolute inset-0 flex items-center justify-between p-6">
						<div className="flex items-center gap-4">
							<div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
								<TypeIcon className="h-8 w-8 text-white" />
							</div>
							<div>
								<h1 className="text-2xl font-bold text-white mb-1">
									{template.name}
								</h1>
								<div className="flex items-center gap-2">
									{template.isVerified && (
										<CheckBadgeIcon className="h-5 w-5 text-white" />
									)}
									<span
										className={`px-2 py-1 rounded-full text-xs font-medium border ${difficultyConfig.color}`}
									>
										{difficultyConfig.label}
									</span>
								</div>
							</div>
						</div>
						<div className="flex flex-col items-end gap-2">
							<button
								onClick={handleToggleFavorite}
								className="p-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full hover:bg-white hover:bg-opacity-30 transition-all duration-200"
							>
								{isFavorite ? (
									<HeartSolidIcon className="h-5 w-5 text-red-400" />
								) : (
									<HeartIcon className="h-5 w-5 text-white" />
								)}
							</button>
							<div className="flex items-center gap-1 text-white text-sm">
								<StarIcon className="h-4 w-4" />
								<span>{template.averageRating || 0}</span>
							</div>
						</div>
					</div>
				</div>

				{/* Contenido */}
				<div className="p-6">
					<p className="text-gray-700 text-lg leading-relaxed mb-6">
						{template.description}
					</p>

					{/* Metadatos */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
						<div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
							<BookOpenIcon className="h-5 w-5 text-primary-600" />
							<div>
								<div className="text-xs text-gray-500">Referencia NEC</div>
								<div className="text-sm font-medium">
									{template.necReference}
								</div>
							</div>
						</div>
						<div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
							<UserIcon className="h-5 w-5 text-green-600" />
							<div>
								<div className="text-xs text-gray-500">Versión</div>
								<div className="text-sm font-medium">v{template.version}</div>
							</div>
						</div>
						<div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
							<ChartBarIcon className="h-5 w-5 text-gray-500" />
							<div>
								<div className="text-xs text-gray-500">Usos</div>
								<div className="text-sm font-medium">{template.usageCount}</div>
							</div>
						</div>
					</div>

					{/* Botón de continuar */}
					<div className="flex justify-center">
						<button
							onClick={() => setCurrentStep("parameters")}
							className="px-8 py-3 bg-gradient-to-r from-primary-600 to-secondary-500 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] flex items-center gap-2"
						>
							<PlayIcon className="h-5 w-5" />
							Comenzar Cálculo
							<ArrowRightIcon className="h-4 w-4" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);

	// Vista de parámetros
	const ParametersView = () => (
		<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
			<div className="mb-6">
				<h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
					<CalculatorIcon className="h-6 w-6 text-primary-600" />
					Parámetros del Cálculo
				</h2>
				<p className="text-gray-600">
					Ingresa los valores requeridos para realizar el cálculo según{" "}
					{template.necReference}
				</p>
			</div>

			{/* Nombre del cálculo */}
			<div className="mb-6 p-4 bg-gray-50 rounded-lg">
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Nombre del cálculo (opcional)
				</label>
				<input
					type="text"
					value={calculationName}
					onChange={(e) => setCalculationName(e.target.value)}
					className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
					placeholder="Ej: Cálculo sísmico - Edificio Quito Centro"
				/>
			</div>

			{/* Parámetros */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
				{template.parameters &&
					template.parameters
						.filter((param) => param.scope !== "output")
						.map((param) => (
							<ParameterInput
								key={param.name}
								parameter={param}
								value={parameters[param.name]}
								onChange={(value) => handleParameterChange(param.name, value)}
								error={validation.errors[param.name]}
								warning={validation.warnings[param.name]}
							/>
						))}
			</div>

			{/* Botones de navegación */}
			<div className="flex justify-between items-center">
				<button
					onClick={() => setCurrentStep("overview")}
					className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
				>
					<ArrowLeftIcon className="h-4 w-4" />
					Volver
				</button>

				<div className="flex items-center gap-3">
					{!validation.isValid && (
						<div className="text-sm text-red-600 flex items-center gap-1">
							<ExclamationTriangleIcon className="h-4 w-4" />
							Completa todos los campos requeridos
						</div>
					)}
					<button
						onClick={handleCalculate}
						disabled={!validation.isValid}
						className="px-8 py-3 bg-gradient-to-r from-primary-600 to-secondary-500 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
					>
						<CalculatorIcon className="h-4 w-4" />
						Calcular
					</button>
				</div>
			</div>
		</div>
	);

	// Vista de cálculo en progreso
	const CalculatingView = () => (
		<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
			<div className="mb-6">
				<div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
					<div className="animate-spin h-8 w-8 border-4 border-primary-600 rounded-full border-t-transparent" />
				</div>
				<h2 className="text-xl font-semibold text-gray-900 mb-2">
					Procesando Cálculo
				</h2>
				<p className="text-gray-600">
					Aplicando normativa {template.necReference}...
				</p>
			</div>

			<div className="bg-gray-50 rounded-lg p-4">
				<div className="text-sm text-gray-600 space-y-1">
					<div>✓ Validando parámetros de entrada</div>
					<div>✓ Aplicando factores de seguridad</div>
					<div>✓ Calculando resultados principales</div>
					<div className="flex items-center gap-2">
						<div className="animate-spin h-3 w-3 border-2 border-primary-600 rounded-full border-t-transparent" />
						Procesando fórmula...
					</div>
				</div>
			</div>
		</div>
	);

	// Vista de resultados
	const ResultsView = () => {
		if (!results) return null;

		return (
			<div className="space-y-6">
				{/* Resultado principal */}
				<div className="bg-gradient-to-r from-green-50 to-primary-50 rounded-2xl border border-green-200 p-6">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
							<CheckIcon className="h-6 w-6 text-green-600" />
							Resultado del Cálculo
						</h2>
						<div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
							<CheckBadgeIcon className="h-4 w-4" />
							{results.wasSuccessful ? "EXITOSO" : "ERROR"}
						</div>
					</div>

					{results.wasSuccessful ? (
						/* Resultados exitosos */
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{results.results &&
								Object.entries(results.results).map(([key, value]) => (
									<div key={key} className="bg-white rounded-lg p-4">
										<div className="text-xs text-gray-500 mb-1">
											{key
												.replace(/([A-Z])/g, " $1")
												.replace(/^./, (str) => str.toUpperCase())}
										</div>
										<div className="text-lg font-semibold text-gray-900">
											{typeof value === "number"
												? value.toLocaleString("es-EC", {
														maximumFractionDigits: 4,
													})
												: String(value)}
										</div>
									</div>
								))}
						</div>
					) : (
						/* Error en el cálculo */
						<div className="bg-red-50 border border-red-200 rounded-lg p-4">
							<div className="flex items-center gap-2 text-red-700 mb-2">
								<ExclamationTriangleIcon className="h-5 w-5" />
								<span className="font-medium">Error en el cálculo</span>
							</div>
							<p className="text-red-600 text-sm">
								{results.errorMessage || "Error desconocido"}
							</p>
						</div>
					)}
				</div>

				{/* Botones de acción */}
				<div className="flex flex-col sm:flex-row justify-center gap-4">
					<button
						onClick={() => setCurrentStep("parameters")}
						className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
					>
						<ArrowLeftIcon className="h-4 w-4" />
						Recalcular
					</button>

					{results.wasSuccessful && (
						<>
							<button
								onClick={handleSaveResult}
								className="px-6 py-3 bg-secondary-500 text-gray-900 rounded-lg hover:bg-secondary-600 transition-colors flex items-center justify-center gap-2"
							>
								<DocumentDuplicateIcon className="h-4 w-4" />
								Guardar Cálculo
							</button>
							<button
								onClick={() => {
									/* Implementar exportación */
								}}
								className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
							>
								<DocumentArrowDownIcon className="h-4 w-4" />
								Exportar PDF
							</button>
						</>
					)}
				</div>
			</div>
		);
	};

	// Render principal
	return (
		<div className="min-h-screen bg-gray-50">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Header con navegación */}
				<div className="flex items-center gap-4 mb-8">
					<button
						onClick={() => navigate("/calculations/catalog")}
						className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
					>
						<ArrowLeftIcon className="h-4 w-4" />
						<span>Volver al catálogo</span>
					</button>
				</div>

				{/* Indicador de pasos */}
				<StepIndicator />

				{/* Contenido principal basado en el paso actual */}
				{currentStep === "overview" && <OverviewView />}
				{currentStep === "parameters" && <ParametersView />}
				{currentStep === "calculating" && <CalculatingView />}
				{currentStep === "results" && <ResultsView />}

				{/* Panel lateral con historial e información */}
				{(currentStep === "parameters" || currentStep === "results") && (
					<div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
						<div className="lg:col-span-3">{/* Contenido principal */}</div>

						<div className="space-y-6">
							{/* Información técnica */}
							<div className="bg-white rounded-xl border border-gray-200 p-6">
								<h3 className="text-lg font-semibold text-gray-900 mb-4">
									Información Técnica
								</h3>
								<div className="space-y-4">
									<div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
										<InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5" />
										<div>
											<p className="text-sm font-medium text-blue-900">
												Referencia Normativa
											</p>
											<p className="text-sm text-blue-800">
												{template.necReference}
											</p>
										</div>
									</div>
									<div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
										<CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5" />
										<div>
											<p className="text-sm font-medium text-green-900">
												Versión
											</p>
											<p className="text-sm text-green-800">
												v{template.version}
											</p>
										</div>
									</div>
								</div>
							</div>

							{/* Historial reciente */}
							{calculationHistory.length > 0 && (
								<div className="bg-white rounded-xl border border-gray-200 p-6">
									<h3 className="text-lg font-semibold text-gray-900 mb-4">
										Cálculos Recientes
									</h3>
									<div className="space-y-3">
										{calculationHistory.map((calc, index) => (
											<div key={calc.id} className="p-3 bg-gray-50 rounded-lg">
												<div className="flex items-center justify-between mb-2">
													<span className="text-sm font-medium text-gray-900">
														Cálculo #{calculationHistory.length - index}
													</span>
													<span className="text-xs text-gray-500">
														{new Date(calc.timestamp).toLocaleTimeString(
															"es-EC",
															{
																hour: "2-digit",
																minute: "2-digit",
															}
														)}
													</span>
												</div>
												<button
													onClick={() => {
														setParameters(calc.inputs);
														setResults(calc.results);
														setCurrentStep("results");
													}}
													className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
												>
													Restaurar valores
												</button>
											</div>
										))}
									</div>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default CalculationInterface;
