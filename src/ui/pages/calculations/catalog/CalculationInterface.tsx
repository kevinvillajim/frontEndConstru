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

// Tipos para la plantilla y parámetros
interface CalculationParameter {
	name: string;
	label: string;
	type: "number" | "text" | "select" | "boolean";
	unit?: string;
	required: boolean;
	min?: number;
	max?: number;
	options?: string[];
	defaultValue?: any;
	placeholder?: string;
	tooltip?: string;
	validation?: {
		pattern?: string;
		message?: string;
	};
}

interface CalculationTemplate {
	id: string;
	name: string;
	description: string;
	type: string;
	targetProfession: string;
	formula: string;
	necReference: string;
	isActive: boolean;
	version: string;
	isVerified: boolean;
	isFeatured: boolean;
	usageCount: number;
	averageRating: number;
	shareLevel: string;
	author?: string;
	parameters: CalculationParameter[];
}

interface CalculationResult {
	[key: string]: any;
}

interface ValidationResult {
	isValid: boolean;
	errors: Record<string, string>;
	warnings: Record<string, string>;
}

type CalculationStep = "overview" | "parameters" | "calculating" | "results";

// Mock de plantillas basado en la DB
const mockTemplates: Record<string, CalculationTemplate> = {
	"015b5150-c52c-4a73-9001-68c02b96b7da": {
		id: "015b5150-c52c-4a73-9001-68c02b96b7da",
		name: "Cálculo de Demanda Eléctrica Residencial (NEC-SB-IE)",
		description:
			"Calcula la demanda eléctrica de una vivienda residencial según la Norma Ecuatoriana de la Construcción.",
		type: "electrical",
		targetProfession: "electrical_engineer",
		necReference: "NEC-SB-IE, Sección 1.1",
		version: "1.0",
		isActive: true,
		isVerified: true,
		isFeatured: true,
		usageCount: 245,
		averageRating: 4.5,
		shareLevel: "public",
		author: "Sistema CONSTRU",
		formula: `// Fórmula de demanda eléctrica residencial según NEC
		let tipoVivienda, fdIluminacion, fdTomacorrientes;
		
		if (areaVivienda < 80) {
			tipoVivienda = "Pequeña";
			fdIluminacion = 0.70;
			fdTomacorrientes = 0.50;
		} else if (areaVivienda < 200) {
			tipoVivienda = "Mediana";
			fdIluminacion = 0.70;
			fdTomacorrientes = 0.50;
		} else if (areaVivienda < 300) {
			tipoVivienda = "Mediana grande";
			fdIluminacion = 0.55;
			fdTomacorrientes = 0.40;
		} else {
			tipoVivienda = "Grande";
			fdIluminacion = 0.55;
			fdTomacorrientes = 0.40;
		}
		
		const potenciaIluminacion = circuitosIluminacion * puntosIluminacion * 100;
		const demandaIluminacion = potenciaIluminacion * fdIluminacion;
		const potenciaTomacorrientes = circuitosTomacorrientes * puntosTomacorriente * 200;
		const demandaTomacorrientes = potenciaTomacorrientes * fdTomacorrientes;
		
		let factorDemandaCargasEspeciales;
		if (cantidadCargasEspeciales <= 1) {
			factorDemandaCargasEspeciales = 1.0;
		} else if (sumaCargasEspeciales < 10000) {
			factorDemandaCargasEspeciales = 0.80;
		} else {
			factorDemandaCargasEspeciales = 0.75;
		}
		
		const demandaCargasEspeciales = sumaCargasEspeciales * factorDemandaCargasEspeciales;
		const demandaTotal = demandaIluminacion + demandaTomacorrientes + demandaCargasEspeciales;
		const corrienteTotal = demandaTotal / voltajeNominal;`,
		parameters: [
			{
				name: "areaVivienda",
				label: "Área de la vivienda",
				type: "number",
				unit: "m²",
				required: true,
				min: 30,
				max: 1000,
				placeholder: "150",
				tooltip: "Área total construida de la vivienda en metros cuadrados",
			},
			{
				name: "circuitosIluminacion",
				label: "Número de circuitos de iluminación",
				type: "number",
				unit: "circuitos",
				required: true,
				min: 1,
				max: 20,
				placeholder: "4",
			},
			{
				name: "puntosIluminacion",
				label: "Puntos de iluminación por circuito",
				type: "number",
				unit: "puntos",
				required: true,
				min: 1,
				max: 10,
				placeholder: "6",
			},
			{
				name: "circuitosTomacorrientes",
				label: "Número de circuitos de tomacorrientes",
				type: "number",
				unit: "circuitos",
				required: true,
				min: 1,
				max: 15,
				placeholder: "3",
			},
			{
				name: "puntosTomacorriente",
				label: "Puntos por circuito de tomacorrientes",
				type: "number",
				unit: "puntos",
				required: true,
				min: 1,
				max: 8,
				placeholder: "4",
			},
			{
				name: "cantidadCargasEspeciales",
				label: "Cantidad de cargas especiales",
				type: "number",
				unit: "cargas",
				required: true,
				min: 0,
				max: 10,
				placeholder: "2",
			},
			{
				name: "sumaCargasEspeciales",
				label: "Suma de potencia de cargas especiales",
				type: "number",
				unit: "W",
				required: true,
				min: 0,
				max: 50000,
				placeholder: "5000",
			},
			{
				name: "voltajeNominal",
				label: "Voltaje nominal del sistema",
				type: "select",
				unit: "V",
				required: true,
				options: ["120", "240", "208", "480"],
				defaultValue: "240",
			},
		],
	},
	"03b600f3-5188-42e0-a334-a29e38e13828": {
		id: "03b600f3-5188-42e0-a334-a29e38e13828",
		name: "Diseño de Viga de Hormigón Armado",
		description:
			"Calcula el diseño preliminar de una viga de hormigón armado según la norma ecuatoriana de construcción (NEC).",
		type: "structural",
		targetProfession: "civil_engineer",
		necReference: "NEC-SE-HM, Capítulo 4.2",
		version: "1.0",
		isActive: true,
		isVerified: true,
		isFeatured: true,
		usageCount: 189,
		averageRating: 4.2,
		shareLevel: "public",
		author: "Sistema CONSTRU",
		formula: `// Diseño de viga de hormigón armado según NEC
		const span = length;
		const loadkNm = load / 1000;
		const maxMoment = (loadkNm * Math.pow(span, 2)) / 8;
		const recommendedHeight = span / 10;
		const recommendedWidth = 0.5 * recommendedHeight;
		const height = beamHeight > 0 ? beamHeight : recommendedHeight;
		const width = beamWidth > 0 ? beamWidth : recommendedWidth;
		const d = height - 0.05;
		const fy = steelStrength * 1000000;
		const requiredAs = (maxMoment * 1000) / (0.9 * d * (fy / 1.15));
		const requiredAsCm2 = requiredAs * 10000;
		const minAs = 0.0033 * width * height * 10000;
		const finalAs = Math.max(requiredAsCm2, minAs);
		const barArea = Math.PI * Math.pow(barDiameter / 20, 2);
		const barsCount = Math.ceil(finalAs / barArea);`,
		parameters: [
			{
				name: "length",
				label: "Longitud de la viga",
				type: "number",
				unit: "m",
				required: true,
				min: 1,
				max: 20,
				placeholder: "6.0",
				tooltip: "Luz libre de la viga en metros",
			},
			{
				name: "load",
				label: "Carga uniformemente distribuida",
				type: "number",
				unit: "N/m",
				required: true,
				min: 1000,
				max: 100000,
				placeholder: "15000",
			},
			{
				name: "concreteStrength",
				label: "Resistencia del concreto f'c",
				type: "select",
				unit: "MPa",
				required: true,
				options: ["21", "28", "35", "42"],
				defaultValue: "21",
			},
			{
				name: "steelStrength",
				label: "Resistencia del acero fy",
				type: "select",
				unit: "MPa",
				required: true,
				options: ["420", "500", "520"],
				defaultValue: "420",
			},
			{
				name: "beamHeight",
				label: "Altura de la viga (opcional)",
				type: "number",
				unit: "m",
				required: false,
				min: 0.2,
				max: 2,
				placeholder: "0.60",
			},
			{
				name: "beamWidth",
				label: "Ancho de la viga (opcional)",
				type: "number",
				unit: "m",
				required: false,
				min: 0.15,
				max: 1,
				placeholder: "0.30",
			},
			{
				name: "barDiameter",
				label: "Diámetro de varilla",
				type: "select",
				unit: "mm",
				required: true,
				options: ["8", "10", "12", "16", "20", "25"],
				defaultValue: "16",
			},
		],
	},
	"04ff5abe-6810-43df-aa1b-8347af49d11c": {
		id: "04ff5abe-6810-43df-aa1b-8347af49d11c",
		name: "Cálculo de tubería de agua fría",
		description:
			"Calcula el diámetro óptimo de tubería de agua fría y la cantidad necesaria según el caudal y la longitud del recorrido",
		type: "installation",
		targetProfession: "plumber",
		necReference: "NEC-HS-CI, Capítulo 16",
		version: "1.0",
		isActive: true,
		isVerified: true,
		isFeatured: true,
		usageCount: 156,
		averageRating: 4.3,
		shareLevel: "public",
		author: "Sistema CONSTRU",
		formula: `// Cálculo de tubería de agua fría
		const flowRateLS = flowRate / 60;
		const flowRateM3S = flowRateLS / 1000;
		const velocity = 1.5;
		const area = flowRateM3S / velocity;
		const theoreticalDiameter = Math.sqrt((4 * area) / Math.PI) * 1000;
		const commercialDiameters = [12, 20, 25, 32, 40, 50, 63, 75, 90, 110];
		let selectedDiameter = commercialDiameters.find(d => d >= theoreticalDiameter) || commercialDiameters[commercialDiameters.length - 1];
		const totalLength = pipeLength * 1.1;
		const elbowCount = Math.ceil(pipeLength / 5);
		const teeCount = Math.ceil(fixtures / 2);`,
		parameters: [
			{
				name: "flowRate",
				label: "Caudal requerido",
				type: "number",
				unit: "L/min",
				required: true,
				min: 1,
				max: 1000,
				placeholder: "20",
				tooltip: "Caudal total requerido en litros por minuto",
			},
			{
				name: "pipeLength",
				label: "Longitud de tubería",
				type: "number",
				unit: "m",
				required: true,
				min: 1,
				max: 500,
				placeholder: "50",
			},
			{
				name: "fixtures",
				label: "Número de aparatos",
				type: "number",
				unit: "und",
				required: true,
				min: 1,
				max: 50,
				placeholder: "8",
			},
		],
	},
	"086aa8f1-165e-45cf-b1e2-ae4d775cedd7": {
		id: "086aa8f1-165e-45cf-b1e2-ae4d775cedd7",
		name: "Corrección de Ensayo SPT (NEC-SE-GC)",
		description:
			"Calcula la corrección del número de golpes del ensayo SPT según la Norma Ecuatoriana de la Construcción.",
		type: "foundation",
		targetProfession: "civil_engineer",
		necReference: "NEC-SE-GC, Capítulo 3.5",
		version: "1.0",
		isActive: true,
		isVerified: true,
		isFeatured: true,
		usageCount: 98,
		averageRating: 4.7,
		shareLevel: "public",
		author: "Sistema CONSTRU",
		formula: `// Corrección de ensayo SPT según NEC
		let CE = tipoMartillo === "seguridad" ? 0.75 : tipoMartillo === "automatico" ? 1.0 : 0.6;
		let CR = longitudBarras < 3 ? 0.75 : longitudBarras < 4 ? 0.8 : longitudBarras < 6 ? 0.85 : longitudBarras < 10 ? 0.95 : 1.0;
		let CB = diametroPerforacion <= 115 ? 1.0 : diametroPerforacion < 150 ? 1.05 : 1.15;
		let CS = usaMuestreador ? 1.0 : 1.2;
		const N60 = Ncampo * CE * CR * CB * CS;
		let N60corregido = N60;
		if (tipoSuelo === "granular") {
			const CN = Math.min(Math.sqrt(100 / esfuerzoVertical), 2.0);
			N60corregido = N60 * CN;
		}`,
		parameters: [
			{
				name: "Ncampo",
				label: "Número de golpes de campo (N)",
				type: "number",
				unit: "golpes",
				required: true,
				min: 0,
				max: 100,
				placeholder: "15",
			},
			{
				name: "tipoMartillo",
				label: "Tipo de martillo",
				type: "select",
				required: true,
				options: ["manual", "seguridad", "automatico"],
				defaultValue: "seguridad",
			},
			{
				name: "longitudBarras",
				label: "Longitud de barras",
				type: "number",
				unit: "m",
				required: true,
				min: 1,
				max: 20,
				placeholder: "6",
			},
			{
				name: "diametroPerforacion",
				label: "Diámetro de perforación",
				type: "number",
				unit: "mm",
				required: true,
				min: 60,
				max: 200,
				placeholder: "110",
			},
			{
				name: "usaMuestreador",
				label: "Usa muestreador estándar",
				type: "boolean",
				required: true,
				defaultValue: true,
			},
			{
				name: "tipoSuelo",
				label: "Tipo de suelo",
				type: "select",
				required: true,
				options: ["granular", "cohesivo"],
				defaultValue: "granular",
			},
			{
				name: "esfuerzoVertical",
				label: "Esfuerzo vertical efectivo",
				type: "number",
				unit: "kPa",
				required: true,
				min: 10,
				max: 1000,
				placeholder: "150",
			},
		],
	},
};

// Función para ejecutar la fórmula dinámicamente
const executeFormula = (
	formula: string,
	parameters: Record<string, any>
): CalculationResult => {
	try {
		// Crear una función que evalúe la fórmula con los parámetros
		const func = new Function(
			...Object.keys(parameters),
			`
			${formula}
			
			// Retornar todos los valores calculados
			const results = {};
			const localVars = Object.keys(this).filter(key => 
				!key.startsWith('_') && 
				typeof this[key] !== 'function' &&
				key !== 'results'
			);
			
			// Capturar variables locales definidas en la fórmula
			try {
				// Variables específicas por tipo de cálculo
				if (typeof tipoVivienda !== 'undefined') results.tipoVivienda = tipoVivienda;
				if (typeof fdIluminacion !== 'undefined') results.fdIluminacion = fdIluminacion;
				if (typeof fdTomacorrientes !== 'undefined') results.fdTomacorrientes = fdTomacorrientes;
				if (typeof potenciaIluminacion !== 'undefined') results.potenciaIluminacion = Math.round(potenciaIluminacion);
				if (typeof demandaIluminacion !== 'undefined') results.demandaIluminacion = Math.round(demandaIluminacion);
				if (typeof potenciaTomacorrientes !== 'undefined') results.potenciaTomacorrientes = Math.round(potenciaTomacorrientes);
				if (typeof demandaTomacorrientes !== 'undefined') results.demandaTomacorrientes = Math.round(demandaTomacorrientes);
				if (typeof factorDemandaCargasEspeciales !== 'undefined') results.factorDemandaCargasEspeciales = factorDemandaCargasEspeciales;
				if (typeof demandaCargasEspeciales !== 'undefined') results.demandaCargasEspeciales = Math.round(demandaCargasEspeciales);
				if (typeof demandaTotal !== 'undefined') results.demandaTotal = Math.round(demandaTotal);
				if (typeof corrienteTotal !== 'undefined') results.corrienteTotal = Math.round(corrienteTotal * 100) / 100;
				
				// Variables estructurales
				if (typeof maxMoment !== 'undefined') results.maxMoment = Math.round(maxMoment * 100) / 100;
				if (typeof recommendedHeight !== 'undefined') results.recommendedHeight = Math.round(recommendedHeight * 100) / 100;
				if (typeof recommendedWidth !== 'undefined') results.recommendedWidth = Math.round(recommendedWidth * 100) / 100;
				if (typeof requiredAs !== 'undefined') results.requiredAs = Math.round(finalAs * 100) / 100;
				if (typeof barsCount !== 'undefined') results.barsCount = barsCount;
				if (typeof spacing !== 'undefined') results.spacing = Math.round(((width - 0.1) / (barsCount - 1)) * 100);
				if (typeof isOverReinforced !== 'undefined') results.isOverReinforced = finalAs > 0.025 * width * height * 10000;
				
				// Variables de tubería
				if (typeof theoreticalDiameter !== 'undefined') results.theoreticalDiameter = Math.round(theoreticalDiameter * 100) / 100;
				if (typeof selectedDiameter !== 'undefined') results.selectedDiameter = selectedDiameter;
				if (typeof totalLength !== 'undefined') results.totalLength = Math.round(totalLength * 100) / 100;
				if (typeof elbowCount !== 'undefined') results.elbowCount = elbowCount;
				if (typeof teeCount !== 'undefined') results.teeCount = teeCount;
				
				// Variables SPT
				if (typeof CE !== 'undefined') results.factorEnergia = CE;
				if (typeof CR !== 'undefined') results.factorLongitud = CR;
				if (typeof CB !== 'undefined') results.factorDiametro = CB;
				if (typeof CS !== 'undefined') results.factorMuestreador = CS;
				if (typeof N60 !== 'undefined') results.N60 = Math.round(N60 * 100) / 100;
				if (typeof N60corregido !== 'undefined') results.N60corregido = Math.round(N60corregido * 100) / 100;
				
			} catch (e) {
				console.warn('Error capturando variables:', e);
			}
			
			return results;
		`
		);

		return func.apply({}, Object.values(parameters));
	} catch (error) {
		console.error("Error ejecutando fórmula:", error);
		throw new Error("Error en el cálculo: " + error.message);
	}
};

const CalculationInterface: React.FC = () => {
	const {templateId} = useParams<{templateId: string}>();
	const navigate = useNavigate();

	// Estados principales
	const [template, setTemplate] = useState<CalculationTemplate | null>(null);
	const [currentStep, setCurrentStep] = useState<CalculationStep>("overview");
	const [parameters, setParameters] = useState<Record<string, any>>({});
	const [results, setResults] = useState<CalculationResult | null>(null);
	const [isCalculating, setIsCalculating] = useState(false);
	const [isFavorite, setIsFavorite] = useState(false);
	const [calculationName, setCalculationName] = useState("");
	const [calculationHistory, setCalculationHistory] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Cargar plantilla
	useEffect(() => {
		const loadTemplate = async () => {
			if (!templateId) {
				setError("ID de plantilla no válido");
				setLoading(false);
				return;
			}

			try {
				// En producción, esto sería una llamada a la API
				// const response = await fetch(`/api/templates/${templateId}`);
				// const templateData = await response.json();

				const templateData = mockTemplates[templateId];

				if (!templateData) {
					setError("Plantilla no encontrada");
					setLoading(false);
					return;
				}

				setTemplate(templateData);

				// Inicializar parámetros con valores por defecto
				const defaultParams: Record<string, any> = {};
				templateData.parameters.forEach((param) => {
					if (param.defaultValue !== undefined) {
						defaultParams[param.name] = param.defaultValue;
					}
				});
				setParameters(defaultParams);

				// Nombre por defecto para el cálculo
				setCalculationName(
					`${templateData.name} - ${new Date().toLocaleDateString()}`
				);
			} catch (err) {
				setError("Error cargando la plantilla");
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		loadTemplate();
	}, [templateId]);

	// Validación de parámetros
	const validation = useMemo((): ValidationResult => {
		if (!template) return {isValid: false, errors: {}, warnings: {}};

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

	const handleToggleFavorite = useCallback(() => {
		setIsFavorite((prev) => !prev);
		// En producción: llamada a API para toggle favorite
	}, []);

	const handleCalculate = useCallback(async () => {
		if (!validation.isValid || !template) return;

		setIsCalculating(true);
		setCurrentStep("calculating");

		try {
			// Simular delay de procesamiento
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// Ejecutar la fórmula dinámicamente
			const calculationResults = executeFormula(template.formula, parameters);
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
			setError("Error ejecutando el cálculo");
		} finally {
			setIsCalculating(false);
		}
	}, [validation.isValid, template, parameters]);

	const handleStepNavigation = useCallback(
		(step: CalculationStep) => {
			if (step === "calculating" || isCalculating) return;
			setCurrentStep(step);
		},
		[isCalculating]
	);

	// Configuración de dificultad
	const getDifficultyConfig = (profession: string) => {
		switch (profession) {
			case "electrical_engineer":
				return {
					color: "bg-blue-100 text-blue-700 border-blue-200",
					label: "Eléctrico",
				};
			case "civil_engineer":
				return {
					color: "bg-green-100 text-green-700 border-green-200",
					label: "Civil",
				};
			case "plumber":
				return {
					color: "bg-yellow-100 text-yellow-700 border-yellow-200",
					label: "Instalaciones",
				};
			default:
				return {
					color: "bg-gray-100 text-gray-700 border-gray-200",
					label: "General",
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

	const difficultyConfig = getDifficultyConfig(template.targetProfession);
	const TypeIcon = getTypeIcon(template.type);

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
			<div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
				{/* Header colorido */}
				<div className="h-32 bg-gradient-to-r from-primary-500 to-secondary-500 relative overflow-hidden">
					<div className="absolute inset-0 bg-black bg-opacity-20" />
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
								<span>{template.averageRating}</span>
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
								<div className="text-xs text-gray-500">Autor</div>
								<div className="text-sm font-medium">{template.author}</div>
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
				{template.parameters.map((param) => (
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
						<div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
							<CheckBadgeIcon className="h-4 w-4" />
							CONFORME NEC
						</div>
					</div>

					{/* Resultados en grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{Object.entries(results).map(([key, value]) => (
							<div key={key} className="bg-white rounded-lg p-4">
								<div className="text-xs text-gray-500 mb-1">
									{key
										.replace(/([A-Z])/g, " $1")
										.replace(/^./, (str) => str.toUpperCase())}
								</div>
								<div className="text-lg font-semibold text-gray-900">
									{typeof value === "number"
										? value.toLocaleString("es-EC", {maximumFractionDigits: 2})
										: String(value)}
								</div>
							</div>
						))}
					</div>
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
					<button
						onClick={() => {
							/* Implementar exportación */
						}}
						className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
					>
						<DocumentArrowDownIcon className="h-4 w-4" />
						Exportar PDF
					</button>
					<button
						onClick={() => {
							/* Implementar guardar */
						}}
						className="px-6 py-3 bg-secondary-500 text-gray-900 rounded-lg hover:bg-secondary-600 transition-colors flex items-center justify-center gap-2"
					>
						<DocumentDuplicateIcon className="h-4 w-4" />
						Guardar Cálculo
					</button>
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
						<div className="lg:col-span-3">
							{/* El contenido principal ya se renderiza arriba */}
						</div>

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

export default CalculationInterface;
