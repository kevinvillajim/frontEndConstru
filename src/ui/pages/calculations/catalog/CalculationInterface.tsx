import React, {useState, useEffect, useMemo, useCallback, useRef} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	CheckBadgeIcon,
	BookOpenIcon,
	StarIcon,
	CalculatorIcon,
	DocumentArrowDownIcon,
	HeartIcon,
	ExclamationTriangleIcon,
	CheckIcon,
	PencilSquareIcon,
	EyeIcon,
	PlayIcon,
	DocumentDuplicateIcon,
	UserIcon,
	ChartBarIcon,
	CpuChipIcon,
	InformationCircleIcon,
	CheckCircleIcon,
} from "@heroicons/react/24/outline";
import {HeartIcon as HeartSolidIcon} from "@heroicons/react/24/solid";
import ParameterInput from "./components/ParameterInput";
import {useTemplates} from "../shared/hooks/useTemplates";
import {useCalculations} from "../shared/hooks/useCalculations";
import type {CalculationTemplate as MyCalculationTemplate} from "../shared/types/template.types";

// Interfaz para parámetros del backend
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
	allowedValues?: string | null;
	helpText?: string;
	dependsOnParameters?: string | null;
	formula?: string | null;
}

interface ValidationResult {
	isValid: boolean;
	errors: Record<string, string>;
	warnings: Record<string, string>;
}

type CalculationStep = "overview" | "parameters" | "calculating" | "results";

// COMPONENTES SEPARADOS - FUERA DEL COMPONENTE PRINCIPAL

const StepIndicator: React.FC<{
	currentStep: CalculationStep;
	onStepClick: (step: CalculationStep) => void;
	isCalculating: boolean;
}> = React.memo(({currentStep, onStepClick, isCalculating}) => {
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
									isClickable && onStepClick(step.id as CalculationStep)
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
});

const OverviewView: React.FC<{
	template: MyCalculationTemplate & {parameters?: BackendParameter[]};
	isFavorite: boolean;
	onToggleFavorite: () => void;
	onStartCalculation: () => void;
	difficultyConfig: {color: string; label: string};
	TypeIcon: React.ComponentType<{className?: string}>;
}> = React.memo(
	({
		template,
		isFavorite,
		onToggleFavorite,
		onStartCalculation,
		difficultyConfig,
		TypeIcon,
	}) => (
		<div className="space-y-6">
			<div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
				{/* Header colorido */}
				<div className="h-32 bg-gradient-to-r from-primary-500 to-secondary-500 relative overflow-hidden">
					<div className="absolute inset-0 bg-primary-600 bg-opacity-20" />
					<div className="absolute inset-0 flex items-center justify-between p-6">
						<div className="flex items-center gap-4">
							<div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
								<TypeIcon className="h-8 w-8 text-secondary-700" />
							</div>
							<div>
								<h1 className="text-2xl font-bold text-white mb-1">
									{template.name}
								</h1>
								<div className="flex items-center gap-2">
									{(template.isVerified || template.verified) && (
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
								onClick={onToggleFavorite}
								className="p-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full hover:bg-white hover:bg-opacity-30 transition-all duration-200"
							>
								{isFavorite ? (
									<HeartSolidIcon className="h-5 w-5 text-red-400" />
								) : (
									<HeartIcon className="h-5 w-5 text-secondary-700" />
								)}
							</button>
							<div className="flex items-center gap-1 text-white text-sm">
								<StarIcon className="h-4 w-4" />
								<span>{template.averageRating || template.rating || 0}</span>
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
								<div className="text-sm font-medium">
									{template.usageCount || 0}
								</div>
							</div>
						</div>
					</div>

					{/* Botón de continuar */}
					<div className="flex justify-center">
						<button
							onClick={onStartCalculation}
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
	)
);

const ParametersView: React.FC<{
	template: MyCalculationTemplate & {parameters?: BackendParameter[]};
	parameters: Record<string, any>;
	calculationName: string;
	validation: ValidationResult;
	onParameterChange: (paramName: string, value: any) => void;
	onCalculationNameChange: (name: string) => void;
	onCalculate: () => void;
	onBack: () => void;
}> = React.memo(
	({
		template,
		parameters,
		calculationName,
		validation,
		onParameterChange,
		onCalculationNameChange,
		onCalculate,
		onBack,
	}) => (
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
					onChange={(e) => onCalculationNameChange(e.target.value)}
					className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
					placeholder="Ej: Cálculo sísmico - Edificio Quito Centro"
				/>
			</div>

			{/* Parámetros */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
				{template.parameters &&
					template.parameters
						.filter((param) => param.scope === "input" || !param.scope)
						.map((param) => (
							<ParameterInput
								key={param.name}
								parameter={param}
								value={parameters[param.name]}
								onChange={(value) => onParameterChange(param.name, value)}
								error={validation.errors[param.name]}
								warning={validation.warnings[param.name]}
							/>
						))}
			</div>

			{/* Botones de navegación */}
			<div className="flex justify-between items-center">
				<button
					onClick={onBack}
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
						onClick={onCalculate}
						disabled={!validation.isValid}
						className="px-8 py-3 bg-gradient-to-r from-primary-600 to-secondary-500 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
					>
						<CalculatorIcon className="h-4 w-4" />
						Calcular
					</button>
				</div>
			</div>
		</div>
	)
);

const CalculatingView: React.FC<{
	template: MyCalculationTemplate & {parameters?: BackendParameter[]};
}> = React.memo(({template}) => (
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
));

const ResultsView: React.FC<{
	results: any;
	onRecalculate: () => void;
	onSaveResult: () => void;
}> = React.memo(({results, onRecalculate, onSaveResult}) => {
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
					onClick={onRecalculate}
					className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
				>
					<ArrowLeftIcon className="h-4 w-4" />
					Recalcular
				</button>

				{results.wasSuccessful && (
					<>
						<button
							onClick={onSaveResult}
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
});

// COMPONENTE PRINCIPAL
const CalculationInterface: React.FC = () => {
	const {templateId} = useParams<{templateId: string}>();
	const navigate = useNavigate();

	// Hooks
	const {getTemplate, toggleFavorite} = useTemplates();
	const {executeCalculation, saveCalculationResult} = useCalculations();

	// Estados principales
	const [template, setTemplate] = useState<
		(MyCalculationTemplate & {parameters?: BackendParameter[]}) | null
	>(null);
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
						if (
							param.defaultValue !== undefined &&
							param.defaultValue !== null
						) {
							defaultParams[param.name] = String(param.defaultValue);
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
		if (!template?.parameters) {
			return {isValid: false, errors: {}, warnings: {}};
		}

		const errors: Record<string, string> = {};
		const warnings: Record<string, string> = {};

		template.parameters
			.filter((param) => param.scope === "input" || !param.scope)
			.forEach((param) => {
				const value = parameters[param.name];

				if (param.isRequired && (!value || value === "")) {
					errors[param.name] = "Este campo es requerido";
					return;
				}

				if (value && value !== "") {
					if (param.dataType === "number") {
						const numValue = parseFloat(value);
						if (isNaN(numValue)) {
							errors[param.name] = "Debe ser un número válido";
						} else {
							if (
								param.minValue !== null &&
								param.minValue !== undefined &&
								numValue < param.minValue
							) {
								errors[param.name] = `Valor mínimo: ${param.minValue}`;
							}
							if (
								param.maxValue !== null &&
								param.maxValue !== undefined &&
								numValue > param.maxValue
							) {
								errors[param.name] = `Valor máximo: ${param.maxValue}`;
							}
						}
					}
				}
			});

		return {
			isValid: Object.keys(errors).length === 0,
			errors,
			warnings,
		};
	}, [template?.parameters, parameters]);

	// Función para ejecutar fórmula
	const executeFormulaCalculation = useCallback(
		(formula: string, params: Record<string, any>): any => {
			try {
				const context = {...params};
				const func = new Function(
					...Object.keys(context),
					`
				${formula}
				
				if (typeof result !== 'undefined') return result;
				
				const results = {};
				try {
					if (typeof incrementoEsfuerzoCalculado !== 'undefined') results.incrementoEsfuerzoCalculado = incrementoEsfuerzoCalculado;
					if (typeof asentamientoMetros !== 'undefined') results.asentamientoMetros = asentamientoMetros;
					if (typeof asentamientoCentimetros !== 'undefined') results.asentamientoCentimetros = asentamientoCentimetros;
					if (typeof evaluacion !== 'undefined') results.evaluacion = evaluacion;
				} catch (e) {
					console.warn('Error capturando variables:', e);
				}
				
				return results;
			`
				);

				return func.apply({}, Object.values(context));
			} catch (error) {
				console.error("Error ejecutando fórmula:", error);
				throw new Error("Error en el cálculo: " + (error as Error).message);
			}
		},
		[]
	);

	// Handlers estables
	const handleParameterChange = useCallback((paramName: string, value: any) => {
		setParameters((prev) => ({...prev, [paramName]: value}));
	}, []);

	const handleCalculationNameChange = useCallback((name: string) => {
		setCalculationName(name);
	}, []);

	const handleToggleFavorite = useCallback(async () => {
		if (!template) return;
		try {
			await toggleFavorite(template.id);
			setIsFavorite((prev) => !prev);
		} catch (error) {
			console.error("Error toggling favorite:", error);
		}
	}, [template?.id, toggleFavorite]);

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

	const handleStartCalculation = useCallback(() => {
		setCurrentStep("parameters");
	}, []);

	const handleBackToOverview = useCallback(() => {
		setCurrentStep("overview");
	}, []);

	const handleCalculate = useCallback(async () => {
		if (!validation.isValid || !template) return;

		setIsCalculating(true);
		setCurrentStep("calculating");

		try {
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// Convertir parámetros según su tipo
			const convertedParams: Record<string, any> = {};
			template.parameters?.forEach((param) => {
				const value = parameters[param.name];
				if (value !== undefined && value !== "") {
					switch (param.dataType) {
						case "number":
							convertedParams[param.name] = parseFloat(value);
							break;
						case "boolean":
							convertedParams[param.name] = Boolean(value);
							break;
						default:
							convertedParams[param.name] = value;
					}
				} else if (param.defaultValue) {
					switch (param.dataType) {
						case "number":
							convertedParams[param.name] = parseFloat(param.defaultValue);
							break;
						case "boolean":
							convertedParams[param.name] = Boolean(param.defaultValue);
							break;
						default:
							convertedParams[param.name] = param.defaultValue;
					}
				}
			});

			const calculationResults = executeFormulaCalculation(
				template.formula || "",
				convertedParams
			);

			const resultData = {
				wasSuccessful: true,
				results: calculationResults,
				executedAt: new Date().toISOString(),
				templateId: template.id,
				parameters: convertedParams,
			};

			setResults(resultData);
			setCurrentStep("results");

			const newCalculation = {
				id: Date.now(),
				timestamp: new Date().toISOString(),
				inputs: {...convertedParams},
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
	}, [validation.isValid, template, parameters, executeFormulaCalculation]);

	const handleRecalculate = useCallback(() => {
		setCurrentStep("parameters");
	}, []);

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
			console.log("Resultado guardado exitosamente");
		} catch (error) {
			console.error("Error guardando resultado:", error);
		}
	}, [results, template, calculationName, saveCalculationResult]);

	// Configuración de dificultad y profesión
	const getDifficultyConfig = (difficulty?: string) => {
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

	const getTypeIcon = (type?: string) => {
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

	const difficultyConfig = getDifficultyConfig(template?.difficulty);
	const TypeIcon = getTypeIcon(template?.category || template?.type);

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
				<StepIndicator
					currentStep={currentStep}
					onStepClick={handleStepNavigation}
					isCalculating={isCalculating}
				/>

				{/* Contenido principal basado en el paso actual */}
				{currentStep === "overview" && (
					<OverviewView
						template={template}
						isFavorite={isFavorite}
						onToggleFavorite={handleToggleFavorite}
						onStartCalculation={handleStartCalculation}
						difficultyConfig={difficultyConfig}
						TypeIcon={TypeIcon}
					/>
				)}
				{currentStep === "parameters" && (
					<ParametersView
						template={template}
						parameters={parameters}
						calculationName={calculationName}
						validation={validation}
						onParameterChange={handleParameterChange}
						onCalculationNameChange={handleCalculationNameChange}
						onCalculate={handleCalculate}
						onBack={handleBackToOverview}
					/>
				)}
				{currentStep === "calculating" && (
					<CalculatingView template={template} />
				)}
				{currentStep === "results" && results && (
					<ResultsView
						results={results}
						onRecalculate={handleRecalculate}
						onSaveResult={handleSaveResult}
					/>
				)}
			</div>
		</div>
	);
};

export default CalculationInterface;
