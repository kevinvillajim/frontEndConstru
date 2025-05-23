import React, {useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {
	ArrowLeftIcon,
	LightBulbIcon,
	ExclamationTriangleIcon,
	CheckCircleIcon,
	DocumentTextIcon,

} from "@heroicons/react/24/outline";

interface CalculationTemplate {
	id: string;
	name: string;
	description: string;
	category: string;
	necReference: string;
	verified: boolean;
	rating: number;
	usageCount: number;
}

interface SuggestionFormData {
	suggestionType: "improvement" | "error" | "new_feature" | "optimization";
	title: string;
	description: string;
	currentBehavior: string;
	proposedBehavior: string;
	justification: string;
	references: string;
	priority: "low" | "medium" | "high";
	affectedParameters: string[];
	testCases: string;
}

const SuggestTemplateChange: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const template = location.state?.template as CalculationTemplate;

	const [formData, setFormData] = useState<SuggestionFormData>({
		suggestionType: "improvement",
		title: "",
		description: "",
		currentBehavior: "",
		proposedBehavior: "",
		justification: "",
		references: "",
		priority: "medium",
		affectedParameters: [],
		testCases: "",
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	// Si no hay template, redirigir
	if (!template) {
		navigate("/calculations/catalog");
		return null;
	}

	const suggestionTypes = [
		{
			id: "improvement",
			name: "Mejora General",
			description: "Sugerir una mejora en la precisión o funcionalidad",
			icon: "🔧",
			color: "text-blue-600",
		},
		{
			id: "error",
			name: "Corrección de Error",
			description: "Reportar un error en los cálculos o fórmulas",
			icon: "🐛",
			color: "text-red-600",
		},
		{
			id: "new_feature",
			name: "Nueva Funcionalidad",
			description: "Proponer una nueva característica o parámetro",
			icon: "✨",
			color: "text-purple-600",
		},
		{
			id: "optimization",
			name: "Optimización",
			description: "Mejorar rendimiento o eficiencia del cálculo",
			icon: "⚡",
			color: "text-yellow-600",
		},
	];

	const priorities = [
		{id: "low", name: "Baja", color: "text-green-600", bg: "bg-green-50"},
		{id: "medium", name: "Media", color: "text-yellow-600", bg: "bg-yellow-50"},
		{id: "high", name: "Alta", color: "text-red-600", bg: "bg-red-50"},
	];

	const handleInputChange = (
		field: keyof SuggestionFormData,
		value: string | string[]
	) => {
		setFormData((prev) => ({...prev, [field]: value}));
		// Limpiar error si existe
		if (errors[field]) {
			setErrors((prev) => ({...prev, [field]: ""}));
		}
	};

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (!formData.title.trim()) {
			newErrors.title = "El título es requerido";
		}

		if (!formData.description.trim()) {
			newErrors.description = "La descripción es requerida";
		}

		if (!formData.justification.trim()) {
			newErrors.justification = "La justificación es requerida";
		}

		if (
			formData.suggestionType === "error" &&
			!formData.currentBehavior.trim()
		) {
			newErrors.currentBehavior =
				"Debe describir el comportamiento actual para reportar un error";
		}

		if (!formData.proposedBehavior.trim()) {
			newErrors.proposedBehavior = "Debe describir el comportamiento propuesto";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setIsSubmitting(true);

		try {
			// Simular envío a la API
			const suggestionData = {
				templateId: template.id,
				templateName: template.name,
				...formData,
				submittedAt: new Date().toISOString(),
			};

			// TODO: Reemplazar con llamada real a la API
			console.log("Enviando sugerencia:", suggestionData);

			// Simular delay de API
			await new Promise((resolve) => setTimeout(resolve, 1500));

			setShowSuccess(true);

			// Redirigir después de 3 segundos
			setTimeout(() => {
				navigate("/calculations/catalog");
			}, 3000);
		} catch (error) {
			console.error("Error al enviar sugerencia:", error);
			// TODO: Manejar error apropiadamente
		} finally {
			setIsSubmitting(false);
		}
	};

	if (showSuccess) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
				<div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
					<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<CheckCircleIcon className="h-8 w-8 text-green-600" />
					</div>
					<h2 className="text-2xl font-bold text-gray-900 mb-2">
						¡Sugerencia Enviada!
					</h2>
					<p className="text-gray-600 mb-6">
						Tu sugerencia ha sido enviada correctamente y será revisada por
						nuestro equipo técnico.
					</p>
					<div className="space-y-2 text-sm text-gray-500">
						<p>• Recibirás una notificación cuando sea revisada</p>
						<p>• El proceso de evaluación toma 3-5 días hábiles</p>
						<p>• Si es aprobada, se incluirá en la próxima actualización</p>
					</div>
					<button
						onClick={() => navigate("/calculations/catalog")}
						className="mt-6 w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
					>
						Volver al Catálogo
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white border-b border-gray-200">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<div className="flex items-center gap-4">
						<button
							onClick={() => navigate("/calculations/catalog")}
							className="p-2 hover:bg-gray-100 rounded-full transition-colors"
						>
							<ArrowLeftIcon className="h-5 w-5 text-gray-600" />
						</button>
						<div>
							<h1 className="text-2xl font-bold text-gray-900">
								Sugerir Mejora
							</h1>
							<p className="text-gray-600">Plantilla: {template.name}</p>
						</div>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="max-w-4xl mx-auto">
					{/* Información de la plantilla */}
					<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
						<h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
							<DocumentTextIcon className="h-5 w-5 text-primary-600" />
							Información de la Plantilla
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
							<div>
								<span className="font-medium text-gray-700">Nombre:</span>
								<p className="text-gray-600">{template.name}</p>
							</div>
							<div>
								<span className="font-medium text-gray-700">
									Referencia NEC:
								</span>
								<p className="text-gray-600">{template.necReference}</p>
							</div>
							<div>
								<span className="font-medium text-gray-700">Categoría:</span>
								<p className="text-gray-600 capitalize">{template.category}</p>
							</div>
							<div>
								<span className="font-medium text-gray-700">Usos:</span>
								<p className="text-gray-600">{template.usageCount} veces</p>
							</div>
						</div>
					</div>

					{/* Formulario de sugerencia */}
					<form onSubmit={handleSubmit} className="space-y-8">
						{/* Tipo de sugerencia */}
						<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">
								Tipo de Sugerencia
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{suggestionTypes.map((type) => (
									<label
										key={type.id}
										className={`relative flex items-start p-4 border rounded-xl cursor-pointer transition-all ${
											formData.suggestionType === type.id
												? "border-primary-500 bg-primary-50"
												: "border-gray-200 hover:border-gray-300"
										}`}
									>
										<input
											type="radio"
											name="suggestionType"
											value={type.id}
											checked={formData.suggestionType === type.id}
											onChange={(e) =>
												handleInputChange("suggestionType", e.target.value)
											}
											className="sr-only"
										/>
										<div className="flex items-start gap-3">
											<span className="text-2xl">{type.icon}</span>
											<div>
												<p className={`font-medium ${type.color}`}>
													{type.name}
												</p>
												<p className="text-sm text-gray-600">
													{type.description}
												</p>
											</div>
										</div>
									</label>
								))}
							</div>
						</div>

						{/* Información básica */}
						<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">
								Información Básica
							</h3>
							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Título de la Sugerencia *
									</label>
									<input
										type="text"
										value={formData.title}
										onChange={(e) => handleInputChange("title", e.target.value)}
										placeholder="Ej: Mejorar precisión en cálculo de cargas sísmicas"
										className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
											errors.title ? "border-red-500" : "border-gray-300"
										}`}
									/>
									{errors.title && (
										<p className="text-red-600 text-xs mt-1">{errors.title}</p>
									)}
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Descripción General *
									</label>
									<textarea
										value={formData.description}
										onChange={(e) =>
											handleInputChange("description", e.target.value)
										}
										placeholder="Describe brevemente tu sugerencia..."
										rows={4}
										className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
											errors.description ? "border-red-500" : "border-gray-300"
										}`}
									/>
									{errors.description && (
										<p className="text-red-600 text-xs mt-1">
											{errors.description}
										</p>
									)}
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Prioridad
									</label>
									<div className="flex gap-2">
										{priorities.map((priority) => (
											<label
												key={priority.id}
												className={`flex-1 text-center py-2 px-4 border rounded-lg cursor-pointer transition-all ${
													formData.priority === priority.id
														? `${priority.bg} border-current ${priority.color}`
														: "border-gray-200 hover:border-gray-300"
												}`}
											>
												<input
													type="radio"
													name="priority"
													value={priority.id}
													checked={formData.priority === priority.id}
													onChange={(e) =>
														handleInputChange("priority", e.target.value)
													}
													className="sr-only"
												/>
												<span className="font-medium">{priority.name}</span>
											</label>
										))}
									</div>
								</div>
							</div>
						</div>

						{/* Detalles técnicos */}
						<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">
								Detalles Técnicos
							</h3>
							<div className="space-y-4">
								{formData.suggestionType === "error" && (
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Comportamiento Actual (Error) *
										</label>
										<textarea
											value={formData.currentBehavior}
											onChange={(e) =>
												handleInputChange("currentBehavior", e.target.value)
											}
											placeholder="Describe el comportamiento incorrecto actual..."
											rows={3}
											className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
												errors.currentBehavior
													? "border-red-500"
													: "border-gray-300"
											}`}
										/>
										{errors.currentBehavior && (
											<p className="text-red-600 text-xs mt-1">
												{errors.currentBehavior}
											</p>
										)}
									</div>
								)}

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Comportamiento Propuesto *
									</label>
									<textarea
										value={formData.proposedBehavior}
										onChange={(e) =>
											handleInputChange("proposedBehavior", e.target.value)
										}
										placeholder="Describe cómo debería funcionar o qué cambios propones..."
										rows={4}
										className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
											errors.proposedBehavior
												? "border-red-500"
												: "border-gray-300"
										}`}
									/>
									{errors.proposedBehavior && (
										<p className="text-red-600 text-xs mt-1">
											{errors.proposedBehavior}
										</p>
									)}
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Justificación Técnica *
									</label>
									<textarea
										value={formData.justification}
										onChange={(e) =>
											handleInputChange("justification", e.target.value)
										}
										placeholder="Explica por qué esta mejora es necesaria y sus beneficios..."
										rows={4}
										className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
											errors.justification
												? "border-red-500"
												: "border-gray-300"
										}`}
									/>
									{errors.justification && (
										<p className="text-red-600 text-xs mt-1">
											{errors.justification}
										</p>
									)}
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Referencias y Fuentes
									</label>
									<textarea
										value={formData.references}
										onChange={(e) =>
											handleInputChange("references", e.target.value)
										}
										placeholder="Incluye referencias técnicas, normas, estudios, etc. que respalden tu sugerencia..."
										rows={3}
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Casos de Prueba
									</label>
									<textarea
										value={formData.testCases}
										onChange={(e) =>
											handleInputChange("testCases", e.target.value)
										}
										placeholder="Describe casos específicos donde se puede probar la mejora..."
										rows={3}
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
									/>
								</div>
							</div>
						</div>

						{/* Aviso importante */}
						<div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
							<div className="flex items-start gap-3">
								<ExclamationTriangleIcon className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
								<div className="text-sm">
									<p className="font-medium text-orange-800 mb-1">
										Proceso de Revisión
									</p>
									<ul className="text-orange-700 space-y-1">
										<li>
											• Tu sugerencia será revisada por nuestro equipo de
											ingenieros
										</li>
										<li>• El proceso puede tomar entre 3-5 días hábiles</li>
										<li>
											• Recibirás una notificación con la decisión y
											retroalimentación
										</li>
										<li>
											• Las mejoras aprobadas se implementarán en futuras
											actualizaciones
										</li>
									</ul>
								</div>
							</div>
						</div>

						{/* Botones de acción */}
						<div className="flex justify-between items-center">
							<button
								type="button"
								onClick={() => navigate("/calculations/catalog")}
								className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
							>
								Cancelar
							</button>
							<button
								type="submit"
								disabled={isSubmitting}
								className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
							>
								{isSubmitting ? (
									<>
										<div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent" />
										Enviando...
									</>
								) : (
									<>
										<LightBulbIcon className="h-4 w-4" />
										Enviar Sugerencia
									</>
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default SuggestTemplateChange;
