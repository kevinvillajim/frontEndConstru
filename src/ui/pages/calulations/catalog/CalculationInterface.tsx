import React, {useState, useEffect, useMemo, useCallback} from "react";
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
} from "@heroicons/react/24/outline";
import {HeartIcon as HeartSolidIcon} from "@heroicons/react/24/solid";
import {TemplateCard} from "./components/TemplateCard";
import {useTemplates} from "../shared/hooks/useTemplates";
import type {
	CalculationTemplate,
	CalculationResult,
	CalculationParameter,
	ParameterValidation,
} from "../shared/types/template.types";

interface CalculationInterfaceProps {
	template: CalculationTemplate;
	onBack: () => void;
	onSuggestChange?: (template: CalculationTemplate) => void;
	onSaveCalculation?: (
		template: CalculationTemplate,
		parameters: Record<string, any>,
		results: CalculationResult
	) => void;
	autoSave?: boolean;
}

type CalculationStep = "overview" | "parameters" | "calculating" | "results";

const CalculationInterface: React.FC<CalculationInterfaceProps> = ({
	template,
	onBack,
	onSuggestChange,
	onSaveCalculation,
	autoSave = true,
}) => {
	// Estados principales
	const [currentStep, setCurrentStep] = useState<CalculationStep>("overview");
	const [parameters, setParameters] = useState<Record<string, any>>({});
	const [results, setResults] = useState<CalculationResult | null>(null);
	const [isCalculating, setIsCalculating] = useState(false);
	const [isFavorite, setIsFavorite] = useState(template.isFavorite || false);
	const [calculationName, setCalculationName] = useState("");
	const [showSteps] = useState(true);

	// Hook para plantillas relacionadas
	const {getRelatedTemplates, toggleFavorite} = useTemplates();

	// Plantillas relacionadas
	const relatedTemplates = useMemo(() => {
		return getRelatedTemplates(template.id, 3);
	}, [getRelatedTemplates, template.id]);

	// Inicializar parámetros con valores por defecto
	useEffect(() => {
		const defaultParams: Record<string, any> = {};
		template.parameters.forEach((param) => {
			if (param.defaultValue !== undefined) {
				defaultParams[param.name] = param.defaultValue;
			}
		});
		setParameters(defaultParams);

		// Nombre por defecto para el cálculo
		setCalculationName(`${template.name} - ${new Date().toLocaleDateString()}`);
	}, [template]);

	// Validación de parámetros
	const validation = useMemo((): ParameterValidation => {
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
						{ const numValue = Number(value);
						if (isNaN(numValue)) {
							errors[param.name] = "Debe ser un número válido";
						} else {
							if (param.min !== undefined && numValue < param.min) {
								errors[param.name] = `Valor mínimo: ${param.min}`;
							}
							if (param.max !== undefined && numValue > param.max) {
								errors[param.name] = `Valor máximo: ${param.max}`;
							}
							// Advertencias para valores fuera del rango típico
							if (param.typicalRange && !errors[param.name]) {
								// Aquí se podría implementar lógica para rangos típicos
								// Por simplicidad, omitido en este ejemplo
							}
						}
						break; }

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
	}, [parameters, template.parameters]);

	// Handlers
	const handleParameterChange = useCallback((paramName: string, value: any) => {
		setParameters((prev) => ({...prev, [paramName]: value}));
	}, []);

	const handleToggleFavorite = useCallback(() => {
		setIsFavorite((prev) => !prev);
		toggleFavorite(template.id);
	}, [toggleFavorite, template.id]);

	const handleCalculate = useCallback(async () => {
		if (!validation.isValid) return;

		setIsCalculating(true);
		setCurrentStep("calculating");

		try {
			// Simular cálculo asíncrono
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Generar resultados mock basados en los parámetros
			const mockResults = generateMockResults(template, parameters);
			setResults(mockResults);
			setCurrentStep("results");

			// Auto-guardar si está habilitado
			if (autoSave && onSaveCalculation) {
				onSaveCalculation(template, parameters, mockResults);
			}
		} catch (error) {
			console.error("Error in calculation:", error);
			// Aquí manejar errores de cálculo
		} finally {
			setIsCalculating(false);
		}
	}, [validation.isValid, template, parameters, autoSave, onSaveCalculation]);

	const handleStepNavigation = useCallback(
		(step: CalculationStep) => {
			if (step === "calculating" || isCalculating) return;
			setCurrentStep(step);
		},
		[isCalculating]
	);

	// Configuración de dificultad
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
					label: difficulty,
				};
		}
	};

	const difficultyConfig = getDifficultyConfig(template.difficulty);

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
												? "bg-green-500 text-white"
												: "bg-gray-200 text-gray-600 hover:bg-gray-300"
									} ${isClickable ? "cursor-pointer" : "cursor-not-allowed"}`}
								>
									<Icon className="h-5 w-5 mb-1" />
									<span className="text-xs font-medium">{step.label}</span>
								</button>
								{index < steps.length - 1 && (
									<div
										className={`w-8 h-1 transition-all duration-300 ${
											isCompleted ? "bg-green-500" : "bg-gray-200"
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
			{/* Header de la plantilla */}
			<div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
				{/* Gradient header */}
				<div
					className={`h-32 bg-gradient-to-r ${template.color} relative overflow-hidden`}
				>
					<div className="absolute inset-0 bg-black bg-opacity-20" />
					<div className="absolute inset-0 flex items-center justify-between p-6">
						<div className="flex items-center gap-4">
							<div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
								<template.icon className="h-8 w-8 text-white" />
							</div>
							<div>
								<h1 className="text-2xl font-bold text-white mb-1">
									{template.name}
								</h1>
								<div className="flex items-center gap-2">
									{template.verified && (
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
								<span>{template.rating}</span>
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
							<ClockIcon className="h-5 w-5 text-green-600" />
							<div>
								<div className="text-xs text-gray-500">Tiempo estimado</div>
								<div className="text-sm font-medium">
									{template.estimatedTime}
								</div>
							</div>
						</div>
						<div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
							<UserGroupIcon className="h-5 w-5 text-gray-500" />
							<div>
								<div className="text-xs text-gray-500">Dirigido a</div>
								<div className="text-sm font-medium">
									{template.profession.join(", ")}
								</div>
							</div>
						</div>
					</div>

					{/* Requerimientos */}
					<div className="bg-blue-50 rounded-lg p-4 mb-6">
						<h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
							<ExclamationTriangleIcon className="h-4 w-4" />
							Datos requeridos para el cálculo:
						</h4>
						<ul className="space-y-2">
							{template.requirements.map((req, index) => (
								<li
									key={index}
									className="text-sm text-blue-800 flex items-start gap-2"
								>
									<CheckIcon className="h-3 w-3 mt-0.5 text-blue-600" />
									<span>{req}</span>
								</li>
							))}
						</ul>
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
				{template.parameters.map((param) => (
					<ParameterInput
						key={param.id}
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
						Generando recomendaciones...
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
						{results.compliance.isCompliant && (
							<div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
								<CheckBadgeIcon className="h-4 w-4" />
								CONFORME NEC
							</div>
						)}
					</div>

					<div className="mb-6">
						<div className="text-3xl font-bold text-primary-700 mb-1">
							{results.mainResult.value} {results.mainResult.unit}
						</div>
						<div className="text-gray-600">{results.mainResult.label}</div>
					</div>

					{/* Desglose */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{results.breakdown.map((item, index) => (
							<div key={index} className="bg-white rounded-lg p-4">
								<div className="flex justify-between items-center">
									<span className="text-gray-600">{item.label}:</span>
									<div className="text-right">
										<span className="font-semibold text-gray-900">
											{item.value} {item.unit}
										</span>
										{item.factor && (
											<div className="text-xs text-gray-500">{item.factor}</div>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Recomendaciones */}
				{results.recommendations.length > 0 && (
					<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
							<LightBulbIcon className="h-5 w-5 text-yellow-500" />
							Recomendaciones Técnicas
						</h3>
						<div className="space-y-3">
							{results.recommendations.map((rec, index) => (
								<div
									key={index}
									className={`p-4 rounded-lg border-l-4 ${
										rec.type === "success"
											? "bg-green-50 border-green-500"
											: rec.type === "warning"
												? "bg-yellow-50 border-yellow-500"
												: rec.type === "error"
													? "bg-red-50 border-red-500"
													: "bg-blue-50 border-blue-500"
									}`}
								>
									<div className="font-medium text-gray-900">{rec.title}</div>
									<div className="text-gray-600 text-sm">{rec.description}</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Botones de acción */}
				<div className="flex flex-col sm:flex-row justify-center gap-4">
					<button
						onClick={() => setCurrentStep("parameters")}
						className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
					>
						<ArrowLeftIcon className="h-4 w-4" />
						Recalcular
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
					{onSaveCalculation && (
						<button
							onClick={() => onSaveCalculation(template, parameters, results)}
							className="px-6 py-3 bg-secondary-500 text-gray-900 rounded-lg hover:bg-secondary-600 transition-colors flex items-center justify-center gap-2"
						>
							<DocumentDuplicateIcon className="h-4 w-4" />
							Guardar Cálculo
						</button>
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
						onClick={onBack}
						className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
					>
						<ArrowLeftIcon className="h-4 w-4" />
						<span>Volver al catálogo</span>
					</button>

					<div className="flex-1" />

					{onSuggestChange && template.allowSuggestions && (
						<button
							onClick={() => onSuggestChange(template)}
							className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-700 rounded-lg hover:from-orange-200 hover:to-yellow-200 transition-all duration-200 text-sm font-medium"
						>
							<SparklesIcon className="h-4 w-4" />
							<span>Sugerir Mejora</span>
						</button>
					)}
				</div>

				{/* Indicador de pasos */}
				{showSteps && <StepIndicator />}

				{/* Contenido principal basado en el paso actual */}
				{currentStep === "overview" && <OverviewView />}
				{currentStep === "parameters" && <ParametersView />}
				{currentStep === "calculating" && <CalculatingView />}
				{currentStep === "results" && <ResultsView />}

				{/* Plantillas relacionadas */}
				{currentStep === "overview" && relatedTemplates.length > 0 && (
					<div className="mt-12">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">
							Plantillas Relacionadas
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							{relatedTemplates.map((relatedTemplate) => (
								<TemplateCard
									key={relatedTemplate.id}
									template={relatedTemplate}
									onSelect={() => {
										/* Navegar a nueva plantilla */
									}}
									onToggleFavorite={() => toggleFavorite(relatedTemplate.id)}
									compact={true}
									showPreviewButton={false}
								/>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

// Componente auxiliar para inputs de parámetros
const ParameterInput: React.FC<{
	parameter: CalculationParameter;
	value: any;
	onChange: (value: any) => void;
	error?: string;
	warning?: string;
}> = ({parameter, value, onChange, error, warning}) => {
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
					value={value || ""}
					onChange={(e) => onChange(e.target.value)}
					className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
						error ? "border-red-500" : "border-gray-300"
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
						onChange={(e) => onChange(e.target.checked)}
						className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
					/>
					<span className="ml-2 text-sm text-gray-700">
						{parameter.tooltip}
					</span>
				</div>
			) : (
				<input
					type={parameter.type}
					value={value || ""}
					onChange={(e) =>
						parameter.type === "number"
							? onChange(Number(e.target.value))
							: onChange(e.target.value)
					}
					placeholder={parameter.placeholder}
					min={parameter.min}
					max={parameter.max}
					step={parameter.step}
					className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
						error ? "border-red-500" : "border-gray-300"
					}`}
				/>
			)}

			{parameter.tooltip && (
				<div className="flex items-start gap-2 text-xs text-gray-500">
					<LightBulbIcon className="h-4 w-4 mt-0.5 text-yellow-500 flex-shrink-0" />
					<span>{parameter.tooltip}</span>
				</div>
			)}

			{parameter.typicalRange && (
				<div className="text-xs text-primary-600">
					💡 Rango típico: {parameter.typicalRange}
				</div>
			)}

			{error && (
				<div className="flex items-center gap-2 text-xs text-red-600">
					<ExclamationTriangleIcon className="h-4 w-4" />
					<span>{error}</span>
				</div>
			)}

			{warning && !error && (
				<div className="flex items-center gap-2 text-xs text-yellow-600">
					<ExclamationTriangleIcon className="h-4 w-4" />
					<span>{warning}</span>
				</div>
			)}
		</div>
	);
};

// Función auxiliar para generar resultados mock
const generateMockResults = (
	template: CalculationTemplate,
): CalculationResult => {
	// Esta función debería implementar la lógica real de cálculo
	// Por ahora, generamos resultados mock basados en la plantilla

	return {
		mainResult: {
			label: "Resultado Principal",
			value: "25.4",
			unit: "kN/m²",
		},
		breakdown: [
			{
				label: "Carga permanente",
				value: "12.5",
				unit: "kN/m²",
				factor: "(Factor: 1.0)",
			},
			{
				label: "Carga variable",
				value: "8.0",
				unit: "kN/m²",
				factor: "(Factor: 1.5)",
			},
			{
				label: "Carga sísmica",
				value: "4.9",
				unit: "kN/m²",
				factor: "(Factor: 1.8)",
			},
		],
		recommendations: [
			{
				type: "success",
				title: "Cálculo conforme",
				description: "Los resultados cumplen con la normativa NEC vigente",
			},
			{
				type: "info",
				title: "Verificación adicional",
				description: "Se recomienda revisar las condiciones de apoyo",
			},
		],
		compliance: {
			isCompliant: true,
			necReference: template.necReference,
			notes: [
				"Cálculo realizado según normativa ecuatoriana",
				"Factores de seguridad aplicados correctamente",
				"Verificación de estados límite completada",
			],
		},
	};
};

export default CalculationInterface;
