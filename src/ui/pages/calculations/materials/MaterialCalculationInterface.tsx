// src/ui/pages/calculations/materials/MaterialCalculationInterface.tsx
import React, {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {
	ArrowLeftIcon,
	PlayIcon,
	DocumentDuplicateIcon,
	ShareIcon,
	BookmarkIcon,
	CalendarIcon,
	ClockIcon,
	CpuChipIcon,
	ExclamationTriangleIcon,
	CheckCircleIcon,
	SparklesIcon,
} from "@heroicons/react/24/outline";
import {
	useMaterialTemplates,
	useMaterialCalculationExecution,
} from "../shared/hooks/useMaterialCalculations";

interface ParameterInputProps {
	parameter: any;
	value: any;
	onChange: (value: any) => void;
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
			case "number":
				return (
					<input
						type="number"
						value={value || ""}
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

			case "enum":
				return (
					<select
						value={value || ""}
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

			case "boolean":
				return (
					<div className="flex items-center">
						<input
							type="checkbox"
							checked={value || false}
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
						value={value || ""}
						onChange={(e) => onChange(e.target.value)}
						className={`
              w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500
              ${error ? "border-red-300 bg-red-50" : "border-gray-300 bg-white"}
            `}
						placeholder={parameter.defaultValue || ""}
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

	const [template, setTemplate] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [inputValues, setInputValues] = useState<Record<string, any>>({});
	const [validationErrors, setValidationErrors] = useState<
		Record<string, string>
	>({});
	const [includeWaste, setIncludeWaste] = useState(true);
	const [regionalFactors, setRegionalFactors] = useState("sierra");
	const [currency, setCurrency] = useState("USD");
	const [notes, setNotes] = useState("");

	useEffect(() => {
		if (templateId) {
			loadTemplate();
		}
	}, [templateId]);

	const loadTemplate = async () => {
		if (!templateId) return;

		setLoading(true);
		try {
			const templateData = await fetchTemplateById(templateId);
			if (templateData) {
				setTemplate(templateData);
				// Inicializar valores por defecto
				const defaultValues: Record<string, any> = {};
				templateData.parameters?.forEach((param: any) => {
					if (param.defaultValue !== null && param.defaultValue !== undefined) {
						defaultValues[param.name] = param.defaultValue;
					}
				});
				setInputValues(defaultValues);
			}
		} catch (error) {
			console.error("Error loading template:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleInputChange = (paramName: string, value: any) => {
		setInputValues((prev) => ({
			...prev,
			[paramName]: value,
		}));

		// Limpiar error de validación si existe
		if (validationErrors[paramName]) {
			setValidationErrors((prev) => {
				const newErrors = {...prev};
				delete newErrors[paramName];
				return newErrors;
			});
		}
	};

	const validateInputs = (): boolean => {
		const errors: Record<string, string> = {};

		template.parameters?.forEach((param: any) => {
			const value = inputValues[param.name];

			if (
				param.isRequired &&
				(value === undefined || value === null || value === "")
			) {
				errors[param.name] = `${param.name} es requerido`;
				return;
			}

			if (
				param.dataType === "number" &&
				value !== undefined &&
				value !== null
			) {
				if (param.minValue !== null && value < param.minValue) {
					errors[param.name] = `Valor mínimo: ${param.minValue}`;
				}
				if (param.maxValue !== null && value > param.maxValue) {
					errors[param.name] = `Valor máximo: ${param.maxValue}`;
				}
			}
		});

		setValidationErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleExecuteCalculation = async () => {
		if (!validateInputs()) {
			return;
		}

		try {
			await executeCalculation({
				templateId: template.id,
				templateType: template.type,
				inputParameters: inputValues,
				includeWaste,
				regionalFactors,
				currency,
				notes,
				saveResult: true,
			});
		} catch (error) {
			console.error("Error executing calculation:", error);
		}
	};

	const renderHeader = () => (
		<div className="bg-white border-b border-gray-200">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
				<div className="flex items-center gap-4 mb-4">
					<button
						onClick={() => navigate("/calculations/materials")}
						className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
					>
						<ArrowLeftIcon className="h-5 w-5" />
					</button>
					<div className="flex-1">
						<h1 className="text-2xl font-bold text-gray-900">
							{template?.name}
						</h1>
						<p className="text-gray-600 mt-1">{template?.description}</p>
					</div>
					<div className="flex items-center gap-2">
						<button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
							<BookmarkIcon className="h-5 w-5" />
						</button>
						<button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
							<ShareIcon className="h-5 w-5" />
						</button>
						<button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
							<DocumentDuplicateIcon className="h-5 w-5" />
						</button>
					</div>
				</div>

				{template && (
					<div className="flex items-center gap-4 text-sm text-gray-500">
						<span className="flex items-center gap-1">
							<CpuChipIcon className="h-4 w-4" />
							{template.type}
						</span>
						<span className="flex items-center gap-1">
							<PlayIcon className="h-4 w-4" />
							{template.usageCount || 0} usos
						</span>
						{template.averageRating && (
							<span className="flex items-center gap-1">
								⭐ {template.averageRating}
							</span>
						)}
						{template.isFeatured && (
							<span className="flex items-center gap-1 text-amber-600">
								<SparklesIcon className="h-4 w-4" />
								Destacado
							</span>
						)}
					</div>
				)}
			</div>
		</div>
	);

	const renderParameterForm = () => (
		<div className="bg-white rounded-xl border border-gray-200 p-6">
			<h3 className="text-lg font-semibold text-gray-900 mb-6">
				Parámetros de Entrada
			</h3>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{template.parameters
					?.filter((param: any) => param.scope === "input")
					?.sort(
						(a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0)
					)
					?.map((parameter: any) => (
						<ParameterInput
							key={parameter.id}
							parameter={parameter}
							value={inputValues[parameter.name]}
							onChange={(value) => handleInputChange(parameter.name, value)}
							error={validationErrors[parameter.name]}
						/>
					))}
			</div>

			<div className="mt-6 pt-6 border-t border-gray-200">
				<h4 className="text-md font-medium text-gray-900 mb-4">
					Opciones Adicionales
				</h4>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="space-y-2">
						<label className="block text-sm font-medium text-gray-700">
							Incluir Desperdicios
						</label>
						<div className="flex items-center">
							<input
								type="checkbox"
								checked={includeWaste}
								onChange={(e) => setIncludeWaste(e.target.checked)}
								className="h-4 w-4 text-primary-600 rounded focus:ring-primary-500"
							/>
							<span className="ml-2 text-sm text-gray-700">
								Aplicar factores de desperdicio
							</span>
						</div>
					</div>

					<div className="space-y-2">
						<label className="block text-sm font-medium text-gray-700">
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
						</select>
					</div>

					<div className="space-y-2">
						<label className="block text-sm font-medium text-gray-700">
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

				<div className="mt-4 space-y-2">
					<label className="block text-sm font-medium text-gray-700">
						Notas Adicionales
					</label>
					<textarea
						value={notes}
						onChange={(e) => setNotes(e.target.value)}
						rows={3}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
						placeholder="Observaciones o comentarios sobre el cálculo..."
					/>
				</div>
			</div>

			<div className="mt-6 flex items-center justify-end gap-3">
				<button
					onClick={() => navigate("/calculations/materials")}
					className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
				>
					Cancelar
				</button>
				<button
					onClick={handleExecuteCalculation}
					disabled={executing}
					className="
            inline-flex items-center gap-2 px-6 py-2 
            bg-primary-600 text-white font-medium rounded-lg
            hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-200
          "
				>
					{executing ? (
						<>
							<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
							Calculando...
						</>
					) : (
						<>
							<PlayIcon className="h-4 w-4" />
							Ejecutar Cálculo
						</>
					)}
				</button>
			</div>
		</div>
	);

	const renderResults = () => {
		if (!result) return null;

		return (
			<div className="bg-white rounded-xl border border-gray-200 p-6">
				<div className="flex items-center gap-2 mb-6">
					<CheckCircleIcon className="h-6 w-6 text-green-600" />
					<h3 className="text-lg font-semibold text-gray-900">
						Resultados del Cálculo
					</h3>
				</div>

				<div className="space-y-6">
					{/* Resumen de materiales */}
					<div className="bg-green-50 border border-green-200 rounded-lg p-4">
						<h4 className="font-medium text-green-900 mb-2">
							Materiales Calculados
						</h4>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{result.materialQuantities?.map(
								(material: any, index: number) => (
									<div
										key={index}
										className="flex justify-between items-center"
									>
										<span className="text-green-800">{material.name}</span>
										<span className="font-medium text-green-900">
											{material.quantity} {material.unit}
										</span>
									</div>
								)
							)}
						</div>
					</div>

					{/* Parámetros de salida */}
					{template.parameters
						?.filter((param: any) => param.scope === "output")
						?.map((param: any) => (
							<div
								key={param.id}
								className="border border-gray-200 rounded-lg p-4"
							>
								<div className="flex justify-between items-center">
									<div>
										<h4 className="font-medium text-gray-900">{param.name}</h4>
										<p className="text-sm text-gray-600">{param.description}</p>
									</div>
									<div className="text-right">
										<p className="text-xl font-bold text-gray-900">
											{result.outputParameters?.[param.name]}{" "}
											{param.unitOfMeasure}
										</p>
									</div>
								</div>
							</div>
						))}

					{/* Metadatos */}
					<div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
							<div>
								<p className="text-gray-600">Tiempo de Ejecución</p>
								<p className="font-medium">{result.executionTime}ms</p>
							</div>
							<div>
								<p className="text-gray-600">Moneda</p>
								<p className="font-medium">{result.currency}</p>
							</div>
							<div>
								<p className="text-gray-600">Región</p>
								<p className="font-medium">{result.regionalFactors}</p>
							</div>
							<div>
								<p className="text-gray-600">Desperdicios</p>
								<p className="font-medium">
									{result.includeWaste ? "Incluidos" : "No incluidos"}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};

	const renderError = () => {
		if (!executionError) return null;

		return (
			<div className="bg-red-50 border border-red-200 rounded-xl p-6">
				<div className="flex items-center gap-2 mb-2">
					<ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
					<h3 className="text-lg font-semibold text-red-900">
						Error en el Cálculo
					</h3>
				</div>
				<p className="text-red-800">{executionError}</p>
			</div>
		);
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
			</div>
		);
	}

	if (!template) {
		return (
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
					<p className="text-red-800">Plantilla no encontrada</p>
					<button
						onClick={() => navigate("/calculations/materials")}
						className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
					>
						Volver a Materiales
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{renderHeader()}

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="space-y-6">
					{renderParameterForm()}
					{renderError()}
					{renderResults()}
				</div>
			</div>
		</div>
	);
};

export default MaterialCalculationInterface;
