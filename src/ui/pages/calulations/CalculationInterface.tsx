import React, {useState, useEffect} from "react";
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
	ShareIcon,
	ExclamationTriangleIcon,
	LightBulbIcon,
	CheckIcon,
} from "@heroicons/react/24/outline";
import {HeartIcon as HeartSolidIcon} from "@heroicons/react/24/solid";

// Tipos de datos
interface CalculationParameter {
	id: string;
	name: string;
	label: string;
	type: "number" | "select" | "text";
	unit?: string;
	required: boolean;
	defaultValue?: string | number;
	options?: string[];
	min?: number;
	max?: number;
	placeholder?: string;
	tooltip?: string;
	typicalRange?: string;
}

interface CalculationTemplate {
	id: string;
	name: string;
	description: string;
	category: string;
	necReference: string;
	verified: boolean;
	rating: number;
	usageCount: number;
	estimatedTime: string;
	parameters: CalculationParameter[];
	tags: string[];
}

interface CalculationResult {
	mainResult: {
		label: string;
		value: string;
		unit: string;
	};
	breakdown: Array<{
		label: string;
		value: string;
		unit?: string;
		factor?: string;
	}>;
	recommendations: Array<{
		type: "warning" | "info" | "success";
		title: string;
		description: string;
	}>;
	compliance: {
		isCompliant: boolean;
		necReference: string;
		notes: string[];
	};
}

// Template de ejemplo para demanda eléctrica residencial
const sampleTemplate: CalculationTemplate = {
	id: "elec-demand-residential",
	name: "Demanda Eléctrica Residencial",
	description:
		"Calcula la demanda eléctrica de una vivienda según normativa ecuatoriana NEC-SB-IE",
	category: "electrical",
	necReference: "NEC-SB-IE, Sección 1.1",
	verified: true,
	rating: 4.8,
	usageCount: 127,
	estimatedTime: "5-8 min",
	tags: ["demanda", "residencial", "eléctrico", "NEC"],
	parameters: [
		{
			id: "house_area",
			name: "houseArea",
			label: "Área de vivienda",
			type: "number",
			unit: "m²",
			required: true,
			min: 50,
			max: 500,
			placeholder: "150",
			tooltip: "Área total construida de la vivienda",
			typicalRange: "120-200 m² típico",
		},
		{
			id: "voltage",
			name: "voltage",
			label: "Voltaje nominal",
			type: "select",
			unit: "V",
			required: true,
			defaultValue: "220",
			options: ["110", "220", "240"],
			tooltip: "Voltaje de suministro estándar en Ecuador: 220V",
		},
		{
			id: "lighting_circuits",
			name: "lightingCircuits",
			label: "N° circuitos de iluminación",
			type: "number",
			unit: "und",
			required: true,
			min: 1,
			max: 10,
			defaultValue: 3,
			tooltip: "Número de circuitos dedicados a iluminación",
			typicalRange: "2-4 circuitos típico",
		},
		{
			id: "outlets_circuits",
			name: "outletsCircuits",
			label: "N° circuitos de tomacorrientes",
			type: "number",
			unit: "und",
			required: true,
			min: 1,
			max: 15,
			defaultValue: 4,
			tooltip: "Número de circuitos para tomacorrientes generales",
			typicalRange: "3-6 circuitos típico",
		},
		{
			id: "special_loads",
			name: "specialLoads",
			label: "Cargas especiales",
			type: "number",
			unit: "W",
			required: false,
			defaultValue: 2000,
			tooltip: "Cargas adicionales como cocina eléctrica, calentador, etc.",
			typicalRange: "1500-3000 W típico",
		},
	],
};

const CalculationInterface: React.FC = () => {
	const [template] = useState<CalculationTemplate>(sampleTemplate);
	const [isFavorite, setIsFavorite] = useState(false);
	const [currentStep, setCurrentStep] = useState(1);
	const [parameters, setParameters] = useState<Record<string, string | number>>(
		{}
	);
	const [results, setResults] = useState<CalculationResult | null>(null);
	const [isCalculating, setIsCalculating] = useState(false);
	const [validationErrors, setValidationErrors] = useState<
		Record<string, string>
	>({});

	// Inicializar parámetros con valores por defecto
	useEffect(() => {
		const defaultParams: Record<string, string | number> = {};
		template.parameters.forEach((param) => {
			if (param.defaultValue !== undefined) {
				defaultParams[param.name] = param.defaultValue;
			}
		});
		setParameters(defaultParams);
	}, [template]);

	// Validar parámetros en tiempo real
	const validateParameter = (
		param: CalculationParameter,
		value: string | number
	) => {
		const errors: string[] = [];

		if (param.required && (!value || value === "")) {
			errors.push("Este campo es requerido");
		}

		if (param.type === "number" && value) {
			const numValue = Number(value);
			if (isNaN(numValue)) {
				errors.push("Debe ser un número válido");
			} else {
				if (param.min !== undefined && numValue < param.min) {
					errors.push(`Valor mínimo: ${param.min}`);
				}
				if (param.max !== undefined && numValue > param.max) {
					errors.push(`Valor máximo: ${param.max}`);
				}
			}
		}

		return errors.length > 0 ? errors.join(", ") : null;
	};

	const handleParameterChange = (paramName: string, value: string | number) => {
		setParameters((prev) => ({...prev, [paramName]: value}));

		// Validar en tiempo real
		const param = template.parameters.find((p) => p.name === paramName);
		if (param) {
			const error = validateParameter(param, value);
			setValidationErrors((prev) => ({
				...prev,
				[paramName]: error || "",
			}));
		}
	};

	const executeCalculation = () => {
		setIsCalculating(true);

		// Simular cálculo
		setTimeout(() => {
			// const area = Number(parameters.houseArea) || 150;
			const lightingCircuits = Number(parameters.lightingCircuits) || 3;
			const outletsCircuits = Number(parameters.outletsCircuits) || 4;
			const specialLoads = Number(parameters.specialLoads) || 2000;

			// Cálculos simplificados
			const lightingLoad = lightingCircuits * 800 * 0.7; // Factor de demanda 0.7
			const outletsLoad = outletsCircuits * 800 * 0.5; // Factor de demanda 0.5
			const specialLoadsCalculated = specialLoads * 0.8; // Factor de demanda 0.8

			const totalDemand = lightingLoad + outletsLoad + specialLoadsCalculated;
			const totalCurrent = totalDemand / Number(parameters.voltage || 220);

			const mockResults: CalculationResult = {
				mainResult: {
					label: "Demanda Total",
					value: totalDemand.toFixed(0),
					unit: "W",
				},
				breakdown: [
					{
						label: "Iluminación",
						value: lightingLoad.toFixed(0),
						unit: "W",
						factor: "(FD: 0.70)",
					},
					{
						label: "Tomacorrientes",
						value: outletsLoad.toFixed(0),
						unit: "W",
						factor: "(FD: 0.50)",
					},
					{
						label: "Cargas Especiales",
						value: specialLoadsCalculated.toFixed(0),
						unit: "W",
						factor: "(FD: 0.80)",
					},
					{
						label: "Corriente Total",
						value: totalCurrent.toFixed(1),
						unit: "A",
					},
				],
				recommendations: [
					{
						type: "success",
						title: "Tablero principal",
						description: `Recomendado: ${Math.ceil(totalCurrent * 1.25)}A`,
					},
					{
						type: "info",
						title: "Conductor alimentador",
						description: totalCurrent > 40 ? "10 AWG Cu" : "12 AWG Cu",
					},
					{
						type: "warning",
						title: "Protección",
						description: `Breaker principal: ${Math.ceil(totalCurrent * 1.1)}A`,
					},
				],
				compliance: {
					isCompliant: true,
					necReference: "NEC-SB-IE, Sección 1.1",
					notes: [
						"Cálculo conforme a normativa ecuatoriana",
						"Factores de demanda aplicados correctamente",
						"Dimensionamiento seguro para la instalación",
					],
				},
			};

			setResults(mockResults);
			setCurrentStep(3);
			setIsCalculating(false);
		}, 2000);
	};

	const isParametersValid = () => {
		return template.parameters.every((param) => {
			if (param.required && !parameters[param.name]) return false;
			const error = validationErrors[param.name];
			return !error || error === "";
		});
	};

	const renderStepIndicator = () => (
		<div className="flex items-center justify-center mb-8">
			<div className="flex items-center">
				{[1, 2, 3].map((step, index) => (
					<React.Fragment key={step}>
						<div
							className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
								currentStep >= step
									? "bg-primary-600 text-white"
									: "bg-gray-200 text-gray-500"
							}`}
						>
							{currentStep > step ? <CheckIcon className="h-5 w-5" /> : step}
						</div>
						{index < 2 && (
							<div
								className={`w-16 h-1 transition-all duration-300 ${
									currentStep > step + 1 ? "bg-primary-600" : "bg-gray-200"
								}`}
							/>
						)}
					</React.Fragment>
				))}
			</div>
		</div>
	);

	const renderTemplateHeader = () => (
		<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
			<div className="flex items-start justify-between mb-4">
				<div className="flex-1">
					<div className="flex items-center gap-3 mb-2">
						<h1 className="text-2xl font-bold text-gray-900">
							{template.name}
						</h1>
						{template.verified && (
							<CheckBadgeIcon className="h-6 w-6 text-green-600" />
						)}
					</div>
					<p className="text-gray-600 mb-4">{template.description}</p>

					<div className="flex items-center gap-6 text-sm text-gray-500">
						<div className="flex items-center gap-1">
							<BookOpenIcon className="h-4 w-4" />
							<span>{template.necReference}</span>
						</div>
						<div className="flex items-center gap-1">
							<StarIcon className="h-4 w-4 text-yellow-500" />
							<span>
								{template.rating}/5 ({template.usageCount} usos)
							</span>
						</div>
						<div className="flex items-center gap-1">
							<ClockIcon className="h-4 w-4" />
							<span>{template.estimatedTime}</span>
						</div>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<button
						onClick={() => setIsFavorite(!isFavorite)}
						className="p-2 hover:bg-gray-100 rounded-full transition-colors"
					>
						{isFavorite ? (
							<HeartSolidIcon className="h-5 w-5 text-red-500" />
						) : (
							<HeartIcon className="h-5 w-5 text-gray-400" />
						)}
					</button>
					<button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
						<ShareIcon className="h-5 w-5 text-gray-400" />
					</button>
				</div>
			</div>
		</div>
	);

	const renderParametersForm = () => (
		<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
			<h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
				<CalculatorIcon className="h-6 w-6 text-primary-600" />
				Parámetros del Cálculo
			</h2>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{template.parameters.map((param) => (
					<div key={param.id} className="space-y-2">
						<label className="block text-sm font-medium text-gray-700">
							{param.label}
							{param.required && <span className="text-red-500 ml-1">*</span>}
							{param.unit && (
								<span className="text-gray-500 font-normal">
									{" "}
									({param.unit})
								</span>
							)}
						</label>

						{param.type === "select" ? (
							<select
								value={parameters[param.name] || ""}
								onChange={(e) =>
									handleParameterChange(param.name, e.target.value)
								}
								className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
									validationErrors[param.name]
										? "border-red-500"
										: "border-gray-300"
								}`}
							>
								<option value="">Seleccionar...</option>
								{param.options?.map((option) => (
									<option key={option} value={option}>
										{option} {param.unit}
									</option>
								))}
							</select>
						) : (
							<input
								type={param.type}
								value={parameters[param.name] || ""}
								onChange={(e) =>
									handleParameterChange(
										param.name,
										param.type === "number"
											? Number(e.target.value)
											: e.target.value
									)
								}
								placeholder={param.placeholder}
								min={param.min}
								max={param.max}
								className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
									validationErrors[param.name]
										? "border-red-500"
										: "border-gray-300"
								}`}
							/>
						)}

						{param.tooltip && (
							<div className="flex items-start gap-2 text-xs text-gray-500">
								<LightBulbIcon className="h-4 w-4 mt-0.5 text-yellow-500" />
								<span>{param.tooltip}</span>
							</div>
						)}

						{param.typicalRange && (
							<div className="flex items-center gap-2 text-xs text-primary-600">
								<span>💡 {param.typicalRange}</span>
							</div>
						)}

						{validationErrors[param.name] && (
							<div className="flex items-center gap-2 text-xs text-red-600">
								<ExclamationTriangleIcon className="h-4 w-4" />
								<span>{validationErrors[param.name]}</span>
							</div>
						)}
					</div>
				))}
			</div>

			<div className="flex justify-center gap-4 mt-8">
				<button
					onClick={() => setCurrentStep(1)}
					className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
				>
					<ArrowLeftIcon className="h-4 w-4" />
					Volver
				</button>

				<button
					onClick={executeCalculation}
					disabled={!isParametersValid() || isCalculating}
					className="px-8 py-3 bg-gradient-to-r from-primary-600 to-secondary-500 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
				>
					{isCalculating ? (
						<>
							<div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent" />
							Calculando...
						</>
					) : (
						<>
							<CalculatorIcon className="h-4 w-4" />
							Calcular
						</>
					)}
				</button>
			</div>
		</div>
	);

	const renderResults = () => {
		if (!results) return null;

		return (
			<div className="space-y-6">
				{/* Resultado Principal */}
				<div className="bg-gradient-to-r from-green-50 to-primary-50 rounded-2xl border border-green-200 p-6">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
							📊 Resultados del Cálculo
						</h2>
						{results.compliance.isCompliant && (
							<div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
								<CheckIcon className="h-4 w-4" />
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
				<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
					<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
						⚠️ Recomendaciones Técnicas
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
											: "bg-blue-50 border-blue-500"
								}`}
							>
								<div className="font-medium text-gray-900">{rec.title}</div>
								<div className="text-gray-600 text-sm">{rec.description}</div>
							</div>
						))}
					</div>
				</div>

				{/* Cumplimiento Normativo */}
				<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
					<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
						📋 Cumplimiento Normativo
					</h3>
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<BookOpenIcon className="h-5 w-5 text-primary-600" />
							<span className="font-medium">
								Referencia: {results.compliance.necReference}
							</span>
						</div>
						<ul className="space-y-2">
							{results.compliance.notes.map((note, index) => (
								<li
									key={index}
									className="flex items-start gap-2 text-gray-600"
								>
									<CheckIcon className="h-4 w-4 text-green-600 mt-0.5" />
									<span>{note}</span>
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Acciones */}
				<div className="flex justify-center gap-4">
					<button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
						<ArrowLeftIcon className="h-4 w-4" />
						Recalcular
					</button>
					<button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2">
						<DocumentArrowDownIcon className="h-4 w-4" />
						Exportar PDF
					</button>
					<button className="px-6 py-3 bg-secondary-500 text-gray-900 rounded-lg hover:bg-secondary-600 transition-colors flex items-center gap-2">
						💾 Guardar en Proyecto
					</button>
				</div>
			</div>
		);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{renderStepIndicator()}

				{currentStep === 1 && (
					<>
						{renderTemplateHeader()}
						<div className="text-center">
							<button
								onClick={() => setCurrentStep(2)}
								className="px-8 py-3 bg-gradient-to-r from-primary-600 to-secondary-500 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] flex items-center gap-2 mx-auto"
							>
								▶️ Usar Plantilla
								<ArrowRightIcon className="h-4 w-4" />
							</button>
						</div>
					</>
				)}

				{currentStep === 2 && renderParametersForm()}
				{currentStep === 3 && renderResults()}
			</div>
		</div>
	);
};

export default CalculationInterface;
