import React, {useState, useEffect} from "react";
import {
	ArrowLeftIcon,
	CalculatorIcon,
	BookOpenIcon,
	ClockIcon,
	DocumentArrowDownIcon,
	HeartIcon,
	ShareIcon,
	ExclamationTriangleIcon,
	CheckCircleIcon,
	InformationCircleIcon,
	PrinterIcon,
	UserIcon,
	ChartBarIcon,
	CpuChipIcon,
	DocumentTextIcon,
} from "@heroicons/react/24/outline";
import {HeartIcon as HeartSolidIcon} from "@heroicons/react/24/solid";

// Mock data basado en la estructura de tu DB
const mockTemplates = {
	"015b5150-c52c-4a73-9001-68c02b96b7da": {
		id: "015b5150-c52c-4a73-9001-68c02b96b7da",
		name: "Cálculo de Demanda Eléctrica Residencial (NEC-SB-IE)",
		description:
			"Calcula la demanda eléctrica de una vivienda residencial según la Norma Ecuatoriana de la Construcción.",
		type: "electrical",
		targetProfession: "electrical_engineer",
		necReference: "NEC-SB-IE, Sección 1.1",
		version: "1.0",
		usageCount: 245,
		averageRating: 4.5,
		author: "Sistema CONSTRU",
		isVerified: true,
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
		usageCount: 189,
		averageRating: 4.2,
		author: "Sistema CONSTRU",
		isVerified: true,
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
};

// Mock function para simular el cálculo
const executeCalculation = (templateId, inputValues) => {
	// Simular delay de procesamiento
	return new Promise((resolve) => {
		setTimeout(() => {
			if (templateId === "015b5150-c52c-4a73-9001-68c02b96b7da") {
				// Simulación para cálculo eléctrico
				const {
					areaVivienda,
					circuitosIluminacion,
					puntosIluminacion,
					circuitosTomacorrientes,
					puntosTomacorriente,
					cantidadCargasEspeciales,
					sumaCargasEspeciales,
					voltajeNominal,
				} = inputValues;

				// Determinar tipo de vivienda según área
				let tipoVivienda, fdIluminacion, fdTomacorrientes;
				if (areaVivienda < 80) {
					tipoVivienda = "Pequeña";
					fdIluminacion = 0.7;
					fdTomacorrientes = 0.5;
				} else if (areaVivienda < 200) {
					tipoVivienda = "Mediana";
					fdIluminacion = 0.7;
					fdTomacorrientes = 0.5;
				} else if (areaVivienda < 300) {
					tipoVivienda = "Mediana grande";
					fdIluminacion = 0.55;
					fdTomacorrientes = 0.4;
				} else {
					tipoVivienda = "Grande";
					fdIluminacion = 0.55;
					fdTomacorrientes = 0.4;
				}

				const potenciaIluminacion =
					circuitosIluminacion * puntosIluminacion * 100;
				const demandaIluminacion = potenciaIluminacion * fdIluminacion;
				const potenciaTomacorrientes =
					circuitosTomacorrientes * puntosTomacorriente * 200;
				const demandaTomacorrientes = potenciaTomacorrientes * fdTomacorrientes;

				let factorDemandaCargasEspeciales;
				if (cantidadCargasEspeciales <= 1) {
					factorDemandaCargasEspeciales = 1.0;
				} else if (sumaCargasEspeciales < 10000) {
					factorDemandaCargasEspeciales = 0.8;
				} else {
					factorDemandaCargasEspeciales = 0.75;
				}

				const demandaCargasEspeciales =
					sumaCargasEspeciales * factorDemandaCargasEspeciales;
				const demandaTotal =
					demandaIluminacion + demandaTomacorrientes + demandaCargasEspeciales;
				const corrienteTotal = demandaTotal / voltajeNominal;

				resolve({
					tipoVivienda,
					fdIluminacion,
					fdTomacorrientes,
					potenciaIluminacion: Math.round(potenciaIluminacion),
					demandaIluminacion: Math.round(demandaIluminacion),
					potenciaTomacorrientes: Math.round(potenciaTomacorrientes),
					demandaTomacorrientes: Math.round(demandaTomacorrientes),
					factorDemandaCargasEspeciales,
					demandaCargasEspeciales: Math.round(demandaCargasEspeciales),
					demandaTotal: Math.round(demandaTotal),
					corrienteTotal: Math.round(corrienteTotal * 100) / 100,
				});
			} else {
				// Simulación para cálculo estructural
				const {
					length,
					load,
					concreteStrength,
					steelStrength,
					beamHeight,
					beamWidth,
					barDiameter,
				} = inputValues;

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
				const barsCount = Math.ceil(finalAs / barArea);

				resolve({
					maxMoment: Math.round(maxMoment * 100) / 100,
					recommendedHeight: Math.round(recommendedHeight * 100) / 100,
					recommendedWidth: Math.round(recommendedWidth * 100) / 100,
					requiredAs: Math.round(finalAs * 100) / 100,
					barsCount,
					spacing: Math.round(((width - 0.1) / (barsCount - 1)) * 100),
					isOverReinforced: finalAs > 0.025 * width * height * 10000,
				});
			}
		}, 1500);
	});
};

const CalculationInterface = () => {
	// Estados principales
	const [templateId, setTemplateId] = useState(
		"015b5150-c52c-4a73-9001-68c02b96b7da"
	);
	const [template, setTemplate] = useState(mockTemplates[templateId]);
	const [inputValues, setInputValues] = useState({});
	const [results, setResults] = useState(null);
	const [isCalculating, setIsCalculating] = useState(false);
	const [errors, setErrors] = useState({});
	const [isFavorite, setIsFavorite] = useState(false);
	const [calculationHistory, setCalculationHistory] = useState([]);

	// Efecto para cargar plantilla
	useEffect(() => {
		if (templateId && mockTemplates[templateId]) {
			setTemplate(mockTemplates[templateId]);
			setInputValues({});
			setResults(null);
			setErrors({});
		}
	}, [templateId]);

	// Función para validar entradas
	const validateInputs = () => {
		const newErrors = {};

		template.parameters.forEach((param) => {
			const value = inputValues[param.name];

			if (
				param.required &&
				(value === undefined || value === null || value === "")
			) {
				newErrors[param.name] = `${param.label} es requerido`;
				return;
			}

			if (value !== undefined && value !== null && value !== "") {
				if (param.type === "number") {
					const numValue = parseFloat(value);
					if (isNaN(numValue)) {
						newErrors[param.name] = "Debe ser un número válido";
					} else {
						if (param.min !== undefined && numValue < param.min) {
							newErrors[param.name] = `Valor mínimo: ${param.min}`;
						}
						if (param.max !== undefined && numValue > param.max) {
							newErrors[param.name] = `Valor máximo: ${param.max}`;
						}
					}
				}
			}
		});

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// Manejar cambio de valores
	const handleInputChange = (paramName, value) => {
		setInputValues((prev) => ({
			...prev,
			[paramName]: value,
		}));

		// Limpiar error si existe
		if (errors[paramName]) {
			setErrors((prev) => ({
				...prev,
				[paramName]: "",
			}));
		}
	};

	// Ejecutar cálculo
	const handleCalculate = async () => {
		if (!validateInputs()) {
			return;
		}

		setIsCalculating(true);
		try {
			const calculationResults = await executeCalculation(
				templateId,
				inputValues
			);
			setResults(calculationResults);

			// Agregar al historial
			const newCalculation = {
				id: Date.now(),
				timestamp: new Date().toISOString(),
				inputs: {...inputValues},
				results: calculationResults,
			};
			setCalculationHistory((prev) => [newCalculation, ...prev.slice(0, 4)]);
		} catch (error) {
			console.error("Error en cálculo:", error);
		} finally {
			setIsCalculating(false);
		}
	};

	// Renderizar campo de entrada
	const renderInputField = (param) => {
		const value = inputValues[param.name] || "";
		const hasError = errors[param.name];

		return (
			<div key={param.name} className="space-y-2">
				<label className="block text-sm font-medium text-gray-700">
					{param.label}
					{param.required && <span className="text-red-500 ml-1">*</span>}
					{param.unit && (
						<span className="text-gray-500 ml-1">({param.unit})</span>
					)}
				</label>

				{param.type === "select" ? (
					<select
						value={value}
						onChange={(e) => handleInputChange(param.name, e.target.value)}
						className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
							hasError ? "border-red-500" : "border-gray-300"
						}`}
					>
						<option value="">Seleccionar...</option>
						{param.options.map((option) => (
							<option key={option} value={option}>
								{option}
							</option>
						))}
					</select>
				) : (
					<input
						type={param.type}
						value={value}
						onChange={(e) => handleInputChange(param.name, e.target.value)}
						placeholder={param.placeholder}
						min={param.min}
						max={param.max}
						className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
							hasError ? "border-red-500" : "border-gray-300"
						}`}
					/>
				)}

				{hasError && <p className="text-red-600 text-xs">{hasError}</p>}

				{param.tooltip && (
					<p className="text-gray-500 text-xs">{param.tooltip}</p>
				)}
			</div>
		);
	};

	// Renderizar resultados
	const renderResults = () => {
		if (!results) return null;

		return (
			<div className="bg-white rounded-xl border border-gray-200 p-6">
				<div className="flex items-center gap-3 mb-6">
					<div className="p-2 bg-green-100 rounded-lg">
						<CheckCircleIcon className="h-6 w-6 text-green-600" />
					</div>
					<div>
						<h3 className="text-lg font-semibold text-gray-900">
							Resultados del Cálculo
						</h3>
						<p className="text-sm text-gray-600">
							Cálculo completado exitosamente
						</p>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{Object.entries(results).map(([key, value]) => (
						<div key={key} className="p-4 bg-gray-50 rounded-lg">
							<dt className="text-sm font-medium text-gray-600 mb-1">
								{key
									.replace(/([A-Z])/g, " $1")
									.replace(/^./, (str) => str.toUpperCase())}
							</dt>
							<dd className="text-lg font-semibold text-gray-900">
								{typeof value === "number"
									? value.toLocaleString("es-EC", {maximumFractionDigits: 2})
									: value}
							</dd>
						</div>
					))}
				</div>

				{/* Acciones de resultados */}
				<div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200">
					<button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
						<DocumentArrowDownIcon className="h-4 w-4" />
						Exportar PDF
					</button>
					<button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
						<PrinterIcon className="h-4 w-4" />
						Imprimir
					</button>
					<button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
						<ShareIcon className="h-4 w-4" />
						Compartir
					</button>
				</div>
			</div>
		);
	};

	if (!template) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-pulse">
						<div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-4"></div>
						<div className="h-4 bg-gray-300 rounded w-48 mx-auto mb-2"></div>
						<div className="h-4 bg-gray-300 rounded w-32 mx-auto"></div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white border-b border-gray-200">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<div className="flex items-center gap-4 mb-6">
						<button
							onClick={() => window.history.back()}
							className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
						>
							<ArrowLeftIcon className="h-4 w-4" />
							<span>Volver</span>
						</button>

						{/* Selector de plantilla para demo */}
						<select
							value={templateId}
							onChange={(e) => setTemplateId(e.target.value)}
							className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
						>
							<option value="015b5150-c52c-4a73-9001-68c02b96b7da">
								Demanda Eléctrica
							</option>
							<option value="03b600f3-5188-42e0-a334-a29e38e13828">
								Viga de Hormigón
							</option>
						</select>
					</div>

					<div className="flex items-start gap-6">
						<div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
							<CalculatorIcon className="h-8 w-8 text-blue-600" />
						</div>

						<div className="flex-1">
							<div className="flex items-start justify-between">
								<div>
									<h1 className="text-2xl font-bold text-gray-900 mb-2">
										{template.name}
									</h1>
									<p className="text-gray-600 mb-4 max-w-3xl">
										{template.description}
									</p>
								</div>

								<button
									onClick={() => setIsFavorite(!isFavorite)}
									className="p-2 hover:bg-gray-100 rounded-full transition-colors"
								>
									{isFavorite ? (
										<HeartSolidIcon className="h-6 w-6 text-red-500" />
									) : (
										<HeartIcon className="h-6 w-6 text-gray-400" />
									)}
								</button>
							</div>

							<div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
								<div className="flex items-center gap-2">
									<BookOpenIcon className="h-4 w-4" />
									<span>{template.necReference}</span>
								</div>
								<div className="flex items-center gap-2">
									<UserIcon className="h-4 w-4" />
									<span>{template.author}</span>
								</div>
								<div className="flex items-center gap-2">
									<ChartBarIcon className="h-4 w-4" />
									<span>{template.usageCount} usos</span>
								</div>
								<div className="flex items-center gap-2">
									<span>★</span>
									<span>{template.averageRating}/5.0</span>
								</div>
								{template.isVerified && (
									<div className="flex items-center gap-2 text-green-600">
										<CheckCircleIcon className="h-4 w-4" />
										<span>Verificado</span>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Panel de entrada */}
					<div className="lg:col-span-2 space-y-6">
						<div className="bg-white rounded-xl border border-gray-200 p-6">
							<div className="flex items-center gap-3 mb-6">
								<div className="p-2 bg-blue-100 rounded-lg">
									<CpuChipIcon className="h-6 w-6 text-blue-600" />
								</div>
								<div>
									<h2 className="text-lg font-semibold text-gray-900">
										Parámetros de Entrada
									</h2>
									<p className="text-sm text-gray-600">
										Ingrese los datos requeridos para el cálculo
									</p>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{template.parameters.map(renderInputField)}
							</div>

							<div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
								<div className="text-sm text-gray-600">
									<span className="text-red-500">*</span> Campos obligatorios
								</div>

								<button
									onClick={handleCalculate}
									disabled={isCalculating}
									className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
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

						{/* Resultados */}
						{results && renderResults()}
					</div>

					{/* Panel lateral */}
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

								<div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
									<ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5" />
									<div>
										<p className="text-sm font-medium text-yellow-900">
											Importante
										</p>
										<p className="text-sm text-yellow-800">
											Los resultados son preliminares y deben ser verificados
											por un profesional.
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
													setInputValues(calc.inputs);
													setResults(calc.results);
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

						{/* Ayuda */}
						<div className="bg-white rounded-xl border border-gray-200 p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">
								¿Necesitas Ayuda?
							</h3>

							<div className="space-y-3">
								<button className="flex items-center gap-3 w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
									<DocumentTextIcon className="h-5 w-5 text-gray-400" />
									<div>
										<p className="text-sm font-medium text-gray-900">
											Documentación
										</p>
										<p className="text-xs text-gray-600">Ver guía de uso</p>
									</div>
								</button>

								<button className="flex items-center gap-3 w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
									<BookOpenIcon className="h-5 w-5 text-gray-400" />
									<div>
										<p className="text-sm font-medium text-gray-900">
											Referencia NEC
										</p>
										<p className="text-xs text-gray-600">Consultar normativa</p>
									</div>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CalculationInterface;
