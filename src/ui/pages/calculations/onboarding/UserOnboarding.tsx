// src/ui/pages/calculations/onboarding/UserOnboarding.tsx
import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {
	UserIcon,
	BuildingOfficeIcon,
	CogIcon,
	DocumentTextIcon,
	ChartBarIcon,
	CalendarDaysIcon,
	CheckCircleIcon,
	ArrowRightIcon,
	ArrowLeftIcon,
	PlayIcon,
	VideoCameraIcon,
	BookOpenIcon,
	LightBulbIcon,
	ClockIcon,
	CurrencyDollarIcon,
	DocumentDuplicateIcon,
	AcademicCapIcon,
	RocketLaunchIcon,
} from "@heroicons/react/24/outline";
import {LoadingSpinner, Badge} from "../shared/components/SharedComponents";

// Types
interface OnboardingStep {
	id: string;
	title: string;
	description: string;
	component: React.ComponentType<OnboardingStepProps>;
	required: boolean;
	estimatedTime: number; // minutes
	completed: boolean;
	data?: any;
}

interface OnboardingStepProps {
	onNext: (data?: any) => void;
	onBack: () => void;
	onSkip?: () => void;
	initialData?: any;
	isLoading?: boolean;
}

interface UserProfile {
	personal: {
		firstName: string;
		lastName: string;
		email: string;
		phone: string;
		avatar?: string;
	};
	professional: {
		title: string;
		company: string;
		experience: "beginner" | "intermediate" | "expert";
		specialization: string[];
		licenseNumber?: string;
		registration?: string;
	};
	location: {
		country: string;
		city: string;
		timezone: string;
		language: "es" | "en";
		currency: "USD" | "EUR" | "custom";
		customCurrency?: string;
	};
	preferences: {
		theme: "light" | "dark" | "auto";
		notifications: {
			email: boolean;
			push: boolean;
			sms: boolean;
		};
		defaultUnits: "metric" | "imperial";
		dateFormat: "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD";
		workingHours: {
			start: string;
			end: string;
			workDays: number[];
		};
	};
}

interface ProjectTemplate {
	id: string;
	name: string;
	description: string;
	type: "residential" | "commercial" | "industrial" | "infrastructure";
	size: "small" | "medium" | "large";
	estimatedDuration: string;
	budgetRange: string;
	features: string[];
	preview: string;
}

interface TutorialContent {
	id: string;
	title: string;
	description: string;
	type: "video" | "interactive" | "documentation";
	duration: number;
	difficulty: "beginner" | "intermediate" | "advanced";
	category: "calculations" | "budgets" | "schedules" | "general";
	thumbnail: string;
	url: string;
	completed: boolean;
}

// Custom Hook
const useUserOnboarding = () => {
	const [currentStepIndex, setCurrentStepIndex] = useState(0);
	const [steps, setSteps] = useState<OnboardingStep[]>([]);
	const [userProfile, setUserProfile] = useState<Partial<UserProfile>>({});
	const [selectedTemplate, setSelectedTemplate] =
		useState<ProjectTemplate | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [tutorialProgress, setTutorialProgress] = useState<
		Record<string, boolean>
	>({});

	useEffect(() => {
		initializeSteps();
	}, []);

	const initializeSteps = () => {
		const onboardingSteps: OnboardingStep[] = [
			{
				id: "welcome",
				title: "¡Bienvenido a CONSTRU!",
				description:
					"Te damos la bienvenida a la plataforma de construcción más completa de Ecuador",
				component: WelcomeStep,
				required: true,
				estimatedTime: 2,
				completed: false,
			},
			{
				id: "profile",
				title: "Información Personal",
				description: "Configura tu perfil profesional",
				component: ProfileStep,
				required: true,
				estimatedTime: 5,
				completed: false,
			},
			{
				id: "company",
				title: "Información de la Empresa",
				description: "Datos de tu empresa o práctica profesional",
				component: CompanyStep,
				required: true,
				estimatedTime: 4,
				completed: false,
			},
			{
				id: "preferences",
				title: "Preferencias",
				description: "Personaliza tu experiencia en la plataforma",
				component: PreferencesStep,
				required: false,
				estimatedTime: 3,
				completed: false,
			},
			{
				id: "project-template",
				title: "Primer Proyecto",
				description: "Crea tu primer proyecto usando una plantilla",
				component: ProjectTemplateStep,
				required: false,
				estimatedTime: 5,
				completed: false,
			},
			{
				id: "tutorials",
				title: "Recursos de Aprendizaje",
				description: "Descubre tutoriales y documentación",
				component: TutorialsStep,
				required: false,
				estimatedTime: 10,
				completed: false,
			},
			{
				id: "complete",
				title: "¡Todo Listo!",
				description: "Configuración completada exitosamente",
				component: CompletionStep,
				required: true,
				estimatedTime: 2,
				completed: false,
			},
		];

		setSteps(onboardingSteps);
	};

	const nextStep = (data?: any) => {
		if (data) {
			setUserProfile((prev) => ({...prev, ...data}));
		}

		setSteps((prev) =>
			prev.map((step, index) =>
				index === currentStepIndex ? {...step, completed: true, data} : step
			)
		);

		if (currentStepIndex < steps.length - 1) {
			setCurrentStepIndex((prev) => prev + 1);
		}
	};

	const prevStep = () => {
		if (currentStepIndex > 0) {
			setCurrentStepIndex((prev) => prev - 1);
		}
	};

	const skipStep = () => {
		setSteps((prev) =>
			prev.map((step, index) =>
				index === currentStepIndex ? {...step, completed: true} : step
			)
		);

		if (currentStepIndex < steps.length - 1) {
			setCurrentStepIndex((prev) => prev + 1);
		}
	};

	const completeOnboarding = async () => {
		setIsLoading(true);
		try {
			// Simulate API call to save user data
			await new Promise((resolve) => setTimeout(resolve, 2000));
			console.log("Onboarding completed:", userProfile);
		} finally {
			setIsLoading(false);
		}
	};

	return {
		currentStepIndex,
		steps,
		userProfile,
		selectedTemplate,
		isLoading,
		tutorialProgress,
		nextStep,
		prevStep,
		skipStep,
		completeOnboarding,
		setSelectedTemplate,
		setTutorialProgress,
	};
};

// Step Components
const WelcomeStep: React.FC<OnboardingStepProps> = ({onNext}) => {
	return (
		<div className="text-center space-y-6">
			<div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
				<RocketLaunchIcon className="h-12 w-12 text-white" />
			</div>

			<div>
				<h1 className="text-3xl font-bold text-gray-900 mb-4">
					¡Bienvenido a CONSTRU!
				</h1>
				<p className="text-lg text-gray-600 mb-6">
					La plataforma integral para profesionales de la construcción en
					Ecuador
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
				<div className="bg-blue-50 rounded-lg p-6">
					<ChartBarIcon className="h-8 w-8 text-blue-600 mb-3" />
					<h3 className="font-semibold text-gray-900 mb-2">
						Cálculos Técnicos
					</h3>
					<p className="text-sm text-gray-600">
						Cálculos estructurales conformes a normativa NEC con bibliotecas
						especializadas
					</p>
				</div>

				<div className="bg-green-50 rounded-lg p-6">
					<CurrencyDollarIcon className="h-8 w-8 text-green-600 mb-3" />
					<h3 className="font-semibold text-gray-900 mb-2">
						Presupuestos Inteligentes
					</h3>
					<p className="text-sm text-gray-600">
						Presupuestación automática con precios actualizados del mercado
						ecuatoriano
					</p>
				</div>

				<div className="bg-purple-50 rounded-lg p-6">
					<CalendarDaysIcon className="h-8 w-8 text-purple-600 mb-3" />
					<h3 className="font-semibold text-gray-900 mb-2">
						Gestión de Proyectos
					</h3>
					<p className="text-sm text-gray-600">
						Cronogramas inteligentes y seguimiento de progreso en tiempo real
					</p>
				</div>
			</div>

			<div className="bg-gray-50 rounded-lg p-6">
				<div className="flex items-center justify-center gap-2 mb-4">
					<ClockIcon className="h-5 w-5 text-gray-600" />
					<span className="text-sm text-gray-600">
						Tiempo estimado: 15-20 minutos
					</span>
				</div>
				<p className="text-sm text-gray-600 mb-4">
					Te guiaremos paso a paso para configurar tu cuenta y crear tu primer
					proyecto.
				</p>
			</div>

			<button
				onClick={() => onNext()}
				className="flex items-center gap-2 mx-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
			>
				Comenzar Configuración
				<ArrowRightIcon className="h-4 w-4" />
			</button>
		</div>
	);
};

const ProfileStep: React.FC<OnboardingStepProps> = ({
	onNext,
	onBack,
	initialData,
}) => {
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		title: "",
		experience: "intermediate" as const,
		specialization: [] as string[],
		licenseNumber: "",
		...initialData?.personal,
		...initialData?.professional,
	});

	const [errors, setErrors] = useState<Record<string, string>>({});

	const specializations = [
		"Arquitectura",
		"Ingeniería Civil",
		"Ingeniería Estructural",
		"Construcción",
		"Gestión de Proyectos",
		"Supervisión de Obra",
		"Topografía",
		"Instalaciones",
	];

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.firstName.trim()) newErrors.firstName = "Nombre es requerido";
		if (!formData.lastName.trim()) newErrors.lastName = "Apellido es requerido";
		if (!formData.email.trim()) newErrors.email = "Email es requerido";
		if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			newErrors.email = "Email inválido";
		}
		if (!formData.title.trim())
			newErrors.title = "Título profesional es requerido";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = () => {
		if (!validateForm()) return;

		onNext({
			personal: {
				firstName: formData.firstName,
				lastName: formData.lastName,
				email: formData.email,
				phone: formData.phone,
			},
			professional: {
				title: formData.title,
				experience: formData.experience,
				specialization: formData.specialization,
				licenseNumber: formData.licenseNumber,
			},
		});
	};

	const toggleSpecialization = (spec: string) => {
		setFormData((prev) => ({
			...prev,
			specialization: prev.specialization.includes(spec)
				? prev.specialization.filter((s) => s !== spec)
				: [...prev.specialization, spec],
		}));
	};

	return (
		<div className="space-y-6">
			<div className="text-center">
				<UserIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
				<h2 className="text-2xl font-bold text-gray-900 mb-2">
					Información Personal y Profesional
				</h2>
				<p className="text-gray-600">
					Esta información nos ayuda a personalizar tu experiencia
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Personal Information */}
				<div className="space-y-4">
					<h3 className="font-semibold text-gray-900">Información Personal</h3>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Nombre *
						</label>
						<input
							type="text"
							value={formData.firstName}
							onChange={(e) =>
								setFormData({...formData, firstName: e.target.value})
							}
							className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
								errors.firstName ? "border-red-500" : "border-gray-300"
							}`}
							placeholder="Tu nombre"
						/>
						{errors.firstName && (
							<p className="text-sm text-red-600 mt-1">{errors.firstName}</p>
						)}
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Apellido *
						</label>
						<input
							type="text"
							value={formData.lastName}
							onChange={(e) =>
								setFormData({...formData, lastName: e.target.value})
							}
							className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
								errors.lastName ? "border-red-500" : "border-gray-300"
							}`}
							placeholder="Tu apellido"
						/>
						{errors.lastName && (
							<p className="text-sm text-red-600 mt-1">{errors.lastName}</p>
						)}
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Email *
						</label>
						<input
							type="email"
							value={formData.email}
							onChange={(e) =>
								setFormData({...formData, email: e.target.value})
							}
							className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
								errors.email ? "border-red-500" : "border-gray-300"
							}`}
							placeholder="tu@email.com"
						/>
						{errors.email && (
							<p className="text-sm text-red-600 mt-1">{errors.email}</p>
						)}
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Teléfono
						</label>
						<input
							type="tel"
							value={formData.phone}
							onChange={(e) =>
								setFormData({...formData, phone: e.target.value})
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							placeholder="+593 99 123 4567"
						/>
					</div>
				</div>

				{/* Professional Information */}
				<div className="space-y-4">
					<h3 className="font-semibold text-gray-900">
						Información Profesional
					</h3>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Título Profesional *
						</label>
						<input
							type="text"
							value={formData.title}
							onChange={(e) =>
								setFormData({...formData, title: e.target.value})
							}
							className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
								errors.title ? "border-red-500" : "border-gray-300"
							}`}
							placeholder="Ej: Ingeniero Civil, Arquitecto"
						/>
						{errors.title && (
							<p className="text-sm text-red-600 mt-1">{errors.title}</p>
						)}
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Nivel de Experiencia
						</label>
						<select
							value={formData.experience}
							onChange={(e) =>
								setFormData({...formData, experience: e.target.value as any})
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						>
							<option value="beginner">Principiante (0-2 años)</option>
							<option value="intermediate">Intermedio (2-8 años)</option>
							<option value="expert">Experto (8+ años)</option>
						</select>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Número de Registro/Licencia
						</label>
						<input
							type="text"
							value={formData.licenseNumber}
							onChange={(e) =>
								setFormData({...formData, licenseNumber: e.target.value})
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							placeholder="Número de colegiatura o registro"
						/>
					</div>
				</div>
			</div>

			{/* Specializations */}
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-3">
					Especialidades (selecciona todas las que apliquen)
				</label>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
					{specializations.map((spec) => (
						<button
							key={spec}
							type="button"
							onClick={() => toggleSpecialization(spec)}
							className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
								formData.specialization.includes(spec)
									? "bg-blue-600 text-white"
									: "bg-gray-100 text-gray-700 hover:bg-gray-200"
							}`}
						>
							{spec}
						</button>
					))}
				</div>
			</div>

			<div className="flex justify-between">
				<button
					onClick={onBack}
					className="flex items-center gap-2 px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
				>
					<ArrowLeftIcon className="h-4 w-4" />
					Anterior
				</button>
				<button
					onClick={handleSubmit}
					className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
				>
					Continuar
					<ArrowRightIcon className="h-4 w-4" />
				</button>
			</div>
		</div>
	);
};

const CompanyStep: React.FC<OnboardingStepProps> = ({
	onNext,
	onBack,
	initialData,
}) => {
	const [formData, setFormData] = useState({
		company: "",
		ruc: "",
		address: "",
		city: "Quito",
		website: "",
		...initialData?.professional,
		...initialData?.location,
	});

	const ecuadorianCities = [
		"Quito",
		"Guayaquil",
		"Cuenca",
		"Santo Domingo",
		"Ambato",
		"Manta",
		"Portoviejo",
		"Machala",
		"Loja",
		"Riobamba",
		"Esmeraldas",
		"Milagro",
		"Ibarra",
		"La Libertad",
		"Babahoyo",
		"Quevedo",
		"Tulcán",
		"Pasaje",
	];

	const handleSubmit = () => {
		onNext({
			professional: {
				company: formData.company,
			},
			location: {
				country: "Ecuador",
				city: formData.city,
				timezone: "America/Guayaquil",
			},
			company: {
				name: formData.company,
				ruc: formData.ruc,
				address: formData.address,
				city: formData.city,
				website: formData.website,
			},
		});
	};

	return (
		<div className="space-y-6">
			<div className="text-center">
				<BuildingOfficeIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
				<h2 className="text-2xl font-bold text-gray-900 mb-2">
					Información de la Empresa
				</h2>
				<p className="text-gray-600">
					Datos de tu empresa o práctica profesional independiente
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Nombre de la Empresa
					</label>
					<input
						type="text"
						value={formData.company}
						onChange={(e) =>
							setFormData({...formData, company: e.target.value})
						}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						placeholder="Ej: Constructora ABC S.A."
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						RUC
					</label>
					<input
						type="text"
						value={formData.ruc}
						onChange={(e) => setFormData({...formData, ruc: e.target.value})}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						placeholder="1234567890001"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Dirección
					</label>
					<input
						type="text"
						value={formData.address}
						onChange={(e) =>
							setFormData({...formData, address: e.target.value})
						}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						placeholder="Dirección de la empresa"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Ciudad
					</label>
					<select
						value={formData.city}
						onChange={(e) => setFormData({...formData, city: e.target.value})}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					>
						{ecuadorianCities.map((city) => (
							<option key={city} value={city}>
								{city}
							</option>
						))}
					</select>
				</div>

				<div className="md:col-span-2">
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Sitio Web (opcional)
					</label>
					<input
						type="url"
						value={formData.website}
						onChange={(e) =>
							setFormData({...formData, website: e.target.value})
						}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						placeholder="https://www.tuempresa.com"
					/>
				</div>
			</div>

			<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
				<div className="flex items-start gap-3">
					<LightBulbIcon className="h-5 w-5 text-blue-600 mt-0.5" />
					<div>
						<h4 className="font-medium text-blue-900 mb-1">Tip Profesional</h4>
						<p className="text-sm text-blue-700">
							Esta información aparecerá en tus documentos profesionales como
							presupuestos, reportes y contratos. Puedes cambiarla más tarde en
							configuración.
						</p>
					</div>
				</div>
			</div>

			<div className="flex justify-between">
				<button
					onClick={onBack}
					className="flex items-center gap-2 px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
				>
					<ArrowLeftIcon className="h-4 w-4" />
					Anterior
				</button>
				<button
					onClick={handleSubmit}
					className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
				>
					Continuar
					<ArrowRightIcon className="h-4 w-4" />
				</button>
			</div>
		</div>
	);
};

const PreferencesStep: React.FC<OnboardingStepProps> = ({
	onNext,
	onBack,
	onSkip,
	initialData,
}) => {
	const [formData, setFormData] = useState({
		theme: "light" as const,
		language: "es" as const,
		currency: "USD" as const,
		dateFormat: "DD/MM/YYYY" as const,
		defaultUnits: "metric" as const,
		notifications: {
			email: true,
			push: true,
			sms: false,
		},
		workingHours: {
			start: "08:00",
			end: "17:00",
			workDays: [1, 2, 3, 4, 5], // Monday to Friday
		},
		...initialData?.preferences,
	});

	const handleSubmit = () => {
		onNext({
			preferences: formData,
		});
	};

	return (
		<div className="space-y-6">
			<div className="text-center">
				<CogIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
				<h2 className="text-2xl font-bold text-gray-900 mb-2">
					Personaliza tu Experiencia
				</h2>
				<p className="text-gray-600">
					Configura las preferencias según tu forma de trabajo
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Display Preferences */}
				<div className="space-y-4">
					<h3 className="font-semibold text-gray-900">Apariencia</h3>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Tema
						</label>
						<select
							value={formData.theme}
							onChange={(e) =>
								setFormData({...formData, theme: e.target.value as any})
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						>
							<option value="light">Claro</option>
							<option value="dark">Oscuro</option>
							<option value="auto">Automático</option>
						</select>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Idioma
						</label>
						<select
							value={formData.language}
							onChange={(e) =>
								setFormData({...formData, language: e.target.value as any})
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						>
							<option value="es">Español</option>
							<option value="en">English</option>
						</select>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Moneda
						</label>
						<select
							value={formData.currency}
							onChange={(e) =>
								setFormData({...formData, currency: e.target.value as any})
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						>
							<option value="USD">Dólar Americano (USD)</option>
							<option value="EUR">Euro (EUR)</option>
						</select>
					</div>
				</div>

				{/* Format Preferences */}
				<div className="space-y-4">
					<h3 className="font-semibold text-gray-900">Formatos</h3>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Formato de Fecha
						</label>
						<select
							value={formData.dateFormat}
							onChange={(e) =>
								setFormData({...formData, dateFormat: e.target.value as any})
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						>
							<option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2024)</option>
							<option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2024)</option>
							<option value="YYYY-MM-DD">YYYY-MM-DD (2024-12-31)</option>
						</select>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Sistema de Unidades
						</label>
						<select
							value={formData.defaultUnits}
							onChange={(e) =>
								setFormData({...formData, defaultUnits: e.target.value as any})
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						>
							<option value="metric">Métrico (m, kg, °C)</option>
							<option value="imperial">Imperial (ft, lb, °F)</option>
						</select>
					</div>
				</div>
			</div>

			{/* Notifications */}
			<div>
				<h3 className="font-semibold text-gray-900 mb-4">Notificaciones</h3>
				<div className="space-y-3">
					<div className="flex items-center justify-between">
						<div>
							<div className="font-medium text-gray-900">Email</div>
							<div className="text-sm text-gray-600">
								Recibir notificaciones por correo
							</div>
						</div>
						<button
							onClick={() =>
								setFormData({
									...formData,
									notifications: {
										...formData.notifications,
										email: !formData.notifications.email,
									},
								})
							}
							className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
								formData.notifications.email ? "bg-blue-600" : "bg-gray-200"
							}`}
						>
							<span
								className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
									formData.notifications.email
										? "translate-x-6"
										: "translate-x-1"
								}`}
							/>
						</button>
					</div>

					<div className="flex items-center justify-between">
						<div>
							<div className="font-medium text-gray-900">Push</div>
							<div className="text-sm text-gray-600">
								Notificaciones en el navegador
							</div>
						</div>
						<button
							onClick={() =>
								setFormData({
									...formData,
									notifications: {
										...formData.notifications,
										push: !formData.notifications.push,
									},
								})
							}
							className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
								formData.notifications.push ? "bg-blue-600" : "bg-gray-200"
							}`}
						>
							<span
								className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
									formData.notifications.push
										? "translate-x-6"
										: "translate-x-1"
								}`}
							/>
						</button>
					</div>
				</div>
			</div>

			{/* Working Hours */}
			<div>
				<h3 className="font-semibold text-gray-900 mb-4">Horario de Trabajo</h3>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Hora de Inicio
						</label>
						<input
							type="time"
							value={formData.workingHours.start}
							onChange={(e) =>
								setFormData({
									...formData,
									workingHours: {
										...formData.workingHours,
										start: e.target.value,
									},
								})
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Hora de Fin
						</label>
						<input
							type="time"
							value={formData.workingHours.end}
							onChange={(e) =>
								setFormData({
									...formData,
									workingHours: {...formData.workingHours, end: e.target.value},
								})
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
				</div>
			</div>

			<div className="flex justify-between">
				<button
					onClick={onBack}
					className="flex items-center gap-2 px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
				>
					<ArrowLeftIcon className="h-4 w-4" />
					Anterior
				</button>
				<div className="flex gap-3">
					<button
						onClick={onSkip}
						className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
					>
						Omitir
					</button>
					<button
						onClick={handleSubmit}
						className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
					>
						Continuar
						<ArrowRightIcon className="h-4 w-4" />
					</button>
				</div>
			</div>
		</div>
	);
};

const ProjectTemplateStep: React.FC<OnboardingStepProps> = ({
	onNext,
	onBack,
	onSkip,
}) => {
	const [selectedTemplate, setSelectedTemplate] =
		useState<ProjectTemplate | null>(null);

	const templates: ProjectTemplate[] = [
		{
			id: "residential-small",
			name: "Casa Familiar",
			description: "Vivienda unifamiliar de 1-2 pisos",
			type: "residential",
			size: "small",
			estimatedDuration: "4-6 meses",
			budgetRange: "$50,000 - $120,000",
			features: [
				"Cálculos estructurales",
				"Presupuesto detallado",
				"Cronograma de obra",
			],
			preview: "/images/templates/casa-familiar.jpg",
		},
		{
			id: "residential-multi",
			name: "Edificio Residencial",
			description: "Edificio de apartamentos 3-8 pisos",
			type: "residential",
			size: "medium",
			estimatedDuration: "12-18 meses",
			budgetRange: "$300,000 - $800,000",
			features: [
				"Cálculos sísmicos NEC",
				"Análisis estructural",
				"Gestión de materiales",
			],
			preview: "/images/templates/edificio-residencial.jpg",
		},
		{
			id: "commercial-small",
			name: "Local Comercial",
			description: "Tienda, oficina o restaurante",
			type: "commercial",
			size: "small",
			estimatedDuration: "2-4 meses",
			budgetRange: "$30,000 - $80,000",
			features: [
				"Instalaciones especiales",
				"Acabados comerciales",
				"Permisos municipales",
			],
			preview: "/images/templates/local-comercial.jpg",
		},
		{
			id: "industrial",
			name: "Nave Industrial",
			description: "Bodega o planta industrial",
			type: "industrial",
			size: "large",
			estimatedDuration: "8-12 meses",
			budgetRange: "$200,000 - $500,000",
			features: [
				"Estructuras metálicas",
				"Instalaciones industriales",
				"Seguridad ocupacional",
			],
			preview: "/images/templates/nave-industrial.jpg",
		},
	];

	const handleSubmit = () => {
		onNext({
			selectedTemplate,
		});
	};

	const getTypeColor = (type: ProjectTemplate["type"]) => {
		switch (type) {
			case "residential":
				return "bg-green-100 text-green-800";
			case "commercial":
				return "bg-blue-100 text-blue-800";
			case "industrial":
				return "bg-purple-100 text-purple-800";
			case "infrastructure":
				return "bg-orange-100 text-orange-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	return (
		<div className="space-y-6">
			<div className="text-center">
				<DocumentDuplicateIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
				<h2 className="text-2xl font-bold text-gray-900 mb-2">
					Crea tu Primer Proyecto
				</h2>
				<p className="text-gray-600">
					Selecciona una plantilla que se ajuste a tu próximo proyecto
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{templates.map((template) => (
					<div
						key={template.id}
						className={`border-2 rounded-lg p-6 cursor-pointer transition-all hover:shadow-lg ${
							selectedTemplate?.id === template.id
								? "border-blue-500 bg-blue-50"
								: "border-gray-200 hover:border-gray-300"
						}`}
						onClick={() => setSelectedTemplate(template)}
					>
						{/* Preview Image Placeholder */}
						<div className="w-full h-32 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
							<BuildingOfficeIcon className="h-12 w-12 text-gray-400" />
						</div>

						<div className="space-y-3">
							<div className="flex items-start justify-between">
								<h3 className="font-semibold text-gray-900">{template.name}</h3>
								<Badge
									variant={
										template.type === "residential"
											? "success"
											: template.type === "commercial"
												? "info"
												: template.type === "industrial"
													? "default"
													: "warning"
									}
								>
									{template.type === "residential"
										? "Residencial"
										: template.type === "commercial"
											? "Comercial"
											: template.type === "industrial"
												? "Industrial"
												: "Infraestructura"}
								</Badge>
							</div>

							<p className="text-sm text-gray-600">{template.description}</p>

							<div className="grid grid-cols-2 gap-2 text-sm">
								<div>
									<span className="text-gray-600">Duración:</span>
									<div className="font-medium text-gray-900">
										{template.estimatedDuration}
									</div>
								</div>
								<div>
									<span className="text-gray-600">Presupuesto:</span>
									<div className="font-medium text-gray-900">
										{template.budgetRange}
									</div>
								</div>
							</div>

							<div>
								<div className="text-sm text-gray-600 mb-2">Incluye:</div>
								<ul className="space-y-1">
									{template.features.map((feature, index) => (
										<li key={index} className="flex items-center gap-2 text-sm">
											<CheckCircleIcon className="h-4 w-4 text-green-600" />
											<span className="text-gray-700">{feature}</span>
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
				))}
			</div>

			{selectedTemplate && (
				<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
					<div className="flex items-start gap-3">
						<LightBulbIcon className="h-5 w-5 text-blue-600 mt-0.5" />
						<div>
							<h4 className="font-medium text-blue-900 mb-1">
								Plantilla Seleccionada
							</h4>
							<p className="text-sm text-blue-700">
								<strong>{selectedTemplate.name}</strong> - Esta plantilla
								incluye cálculos base, materiales típicos y cronograma estándar
								que puedes personalizar según tus necesidades.
							</p>
						</div>
					</div>
				</div>
			)}

			<div className="flex justify-between">
				<button
					onClick={onBack}
					className="flex items-center gap-2 px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
				>
					<ArrowLeftIcon className="h-4 w-4" />
					Anterior
				</button>
				<div className="flex gap-3">
					<button
						onClick={onSkip}
						className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
					>
						Omitir por ahora
					</button>
					<button
						onClick={handleSubmit}
						className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
					>
						Continuar
						<ArrowRightIcon className="h-4 w-4" />
					</button>
				</div>
			</div>
		</div>
	);
};

const TutorialsStep: React.FC<OnboardingStepProps> = ({
	onNext,
	onBack,
	onSkip,
}) => {
	const [selectedTutorials, setSelectedTutorials] = useState<string[]>([]);

	const tutorials: TutorialContent[] = [
		{
			id: "intro-platform",
			title: "Introducción a CONSTRU",
			description: "Tour general de la plataforma y sus principales funciones",
			type: "video",
			duration: 8,
			difficulty: "beginner",
			category: "general",
			thumbnail: "/images/tutorials/intro.jpg",
			url: "/tutorials/intro-platform",
			completed: false,
		},
		{
			id: "calculations-basic",
			title: "Cálculos Básicos",
			description: "Cómo realizar cálculos de área, volumen y materiales",
			type: "interactive",
			duration: 15,
			difficulty: "beginner",
			category: "calculations",
			thumbnail: "/images/tutorials/calculations.jpg",
			url: "/tutorials/calculations-basic",
			completed: false,
		},
		{
			id: "budgets-creation",
			title: "Creación de Presupuestos",
			description: "Proceso completo para generar presupuestos profesionales",
			type: "video",
			duration: 12,
			difficulty: "intermediate",
			category: "budgets",
			thumbnail: "/images/tutorials/budgets.jpg",
			url: "/tutorials/budgets-creation",
			completed: false,
		},
		{
			id: "nec-compliance",
			title: "Normativa NEC",
			description: "Cumplimiento de la Norma Ecuatoriana de la Construcción",
			type: "documentation",
			duration: 20,
			difficulty: "advanced",
			category: "calculations",
			thumbnail: "/images/tutorials/nec.jpg",
			url: "/tutorials/nec-compliance",
			completed: false,
		},
	];

	const toggleTutorial = (tutorialId: string) => {
		setSelectedTutorials((prev) =>
			prev.includes(tutorialId)
				? prev.filter((id) => id !== tutorialId)
				: [...prev, tutorialId]
		);
	};

	const handleSubmit = () => {
		onNext({
			selectedTutorials,
		});
	};

	const getDifficultyColor = (difficulty: TutorialContent["difficulty"]) => {
		switch (difficulty) {
			case "beginner":
				return "bg-green-100 text-green-800";
			case "intermediate":
				return "bg-yellow-100 text-yellow-800";
			case "advanced":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getTypeIcon = (type: TutorialContent["type"]) => {
		switch (type) {
			case "video":
				return VideoCameraIcon;
			case "interactive":
				return PlayIcon;
			case "documentation":
				return BookOpenIcon;
			default:
				return DocumentTextIcon;
		}
	};

	return (
		<div className="space-y-6">
			<div className="text-center">
				<AcademicCapIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
				<h2 className="text-2xl font-bold text-gray-900 mb-2">
					Recursos de Aprendizaje
				</h2>
				<p className="text-gray-600">
					Selecciona los tutoriales que te interesen para acceso rápido
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{tutorials.map((tutorial) => {
					const TypeIcon = getTypeIcon(tutorial.type);
					const isSelected = selectedTutorials.includes(tutorial.id);

					return (
						<div
							key={tutorial.id}
							className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
								isSelected
									? "border-blue-500 bg-blue-50"
									: "border-gray-200 hover:border-gray-300"
							}`}
							onClick={() => toggleTutorial(tutorial.id)}
						>
							<div className="flex items-start gap-4">
								<div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
									<TypeIcon className="h-6 w-6 text-gray-400" />
								</div>

								<div className="flex-1 min-w-0">
									<div className="flex items-start justify-between mb-2">
										<h3 className="font-medium text-gray-900 truncate">
											{tutorial.title}
										</h3>
										{isSelected && (
											<CheckCircleIcon className="h-5 w-5 text-blue-600 flex-shrink-0" />
										)}
									</div>

									<p className="text-sm text-gray-600 mb-3 line-clamp-2">
										{tutorial.description}
									</p>

									<div className="flex items-center gap-3 text-xs">
										<Badge
											variant={
												tutorial.difficulty === "beginner"
													? "success"
													: tutorial.difficulty === "intermediate"
														? "warning"
														: "error"
											}
										>
											{tutorial.difficulty === "beginner"
												? "Básico"
												: tutorial.difficulty === "intermediate"
													? "Intermedio"
													: "Avanzado"}
										</Badge>

										<span className="flex items-center gap-1 text-gray-600">
											<ClockIcon className="h-3 w-3" />
											{tutorial.duration} min
										</span>

										<span className="text-gray-600">
											{tutorial.type === "video"
												? "Video"
												: tutorial.type === "interactive"
													? "Interactivo"
													: "Documentación"}
										</span>
									</div>
								</div>
							</div>
						</div>
					);
				})}
			</div>

			<div className="bg-green-50 border border-green-200 rounded-lg p-4">
				<div className="flex items-start gap-3">
					<LightBulbIcon className="h-5 w-5 text-green-600 mt-0.5" />
					<div>
						<h4 className="font-medium text-green-900 mb-1">
							Aprende a tu ritmo
						</h4>
						<p className="text-sm text-green-700">
							Puedes acceder a todos los tutoriales en cualquier momento desde
							el menú de ayuda. También tenemos soporte técnico disponible de
							lunes a viernes.
						</p>
					</div>
				</div>
			</div>

			<div className="flex justify-between">
				<button
					onClick={onBack}
					className="flex items-center gap-2 px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
				>
					<ArrowLeftIcon className="h-4 w-4" />
					Anterior
				</button>
				<div className="flex gap-3">
					<button
						onClick={onSkip}
						className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
					>
						Omitir
					</button>
					<button
						onClick={handleSubmit}
						className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
					>
						Continuar
						<ArrowRightIcon className="h-4 w-4" />
					</button>
				</div>
			</div>
		</div>
	);
};

const CompletionStep: React.FC<OnboardingStepProps> = ({initialData}) => {
	const navigate = useNavigate();
	const [isCompleting, setIsCompleting] = useState(false);

	const handleComplete = async () => {
		setIsCompleting(true);
		try {
			// Simulate final setup
			await new Promise((resolve) => setTimeout(resolve, 2000));
			navigate("/dashboard");
		} finally {
			setIsCompleting(false);
		}
	};

	return (
		<div className="text-center space-y-6">
			<div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
				<CheckCircleIcon className="h-12 w-12 text-white" />
			</div>

			<div>
				<h1 className="text-3xl font-bold text-gray-900 mb-4">
					¡Configuración Completada!
				</h1>
				<p className="text-lg text-gray-600 mb-6">
					Tu cuenta está lista. Ahora puedes comenzar a usar CONSTRU al máximo.
				</p>
			</div>

			{/* Summary */}
			<div className="bg-gray-50 rounded-lg p-6 text-left max-w-md mx-auto">
				<h3 className="font-semibold text-gray-900 mb-4 text-center">
					Resumen de tu configuración
				</h3>
				<div className="space-y-3 text-sm">
					{initialData?.personal && (
						<div className="flex justify-between">
							<span className="text-gray-600">Nombre:</span>
							<span className="font-medium text-gray-900">
								{initialData.personal.firstName} {initialData.personal.lastName}
							</span>
						</div>
					)}
					{initialData?.professional?.title && (
						<div className="flex justify-between">
							<span className="text-gray-600">Título:</span>
							<span className="font-medium text-gray-900">
								{initialData.professional.title}
							</span>
						</div>
					)}
					{initialData?.professional?.company && (
						<div className="flex justify-between">
							<span className="text-gray-600">Empresa:</span>
							<span className="font-medium text-gray-900">
								{initialData.professional.company}
							</span>
						</div>
					)}
					{initialData?.location?.city && (
						<div className="flex justify-between">
							<span className="text-gray-600">Ciudad:</span>
							<span className="font-medium text-gray-900">
								{initialData.location.city}
							</span>
						</div>
					)}
				</div>
			</div>

			{/* Next Steps */}
			<div className="bg-blue-50 rounded-lg p-6">
				<h3 className="font-semibold text-blue-900 mb-4">
					Próximos pasos recomendados
				</h3>
				<ul className="space-y-2 text-sm text-blue-700 text-left">
					<li className="flex items-center gap-2">
						<CheckCircleIcon className="h-4 w-4 text-blue-600" />
						Explora el catálogo de plantillas de cálculo
					</li>
					<li className="flex items-center gap-2">
						<CheckCircleIcon className="h-4 w-4 text-blue-600" />
						Crea tu primer proyecto usando una plantilla
					</li>
					<li className="flex items-center gap-2">
						<CheckCircleIcon className="h-4 w-4 text-blue-600" />
						Personaliza tu perfil y configuración de empresa
					</li>
					<li className="flex items-center gap-2">
						<CheckCircleIcon className="h-4 w-4 text-blue-600" />
						Revisa los tutoriales de introducción
					</li>
				</ul>
			</div>

			<button
				onClick={handleComplete}
				disabled={isCompleting}
				className="flex items-center gap-2 mx-auto px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
			>
				{isCompleting ? (
					<>
						<LoadingSpinner size="sm" />
						Finalizando configuración...
					</>
				) : (
					<>
						Ir al Dashboard
						<ArrowRightIcon className="h-4 w-4" />
					</>
				)}
			</button>
		</div>
	);
};

// Main Component
const UserOnboarding: React.FC = () => {
	const {
		currentStepIndex,
		steps,
		userProfile,
		isLoading,
		nextStep,
		prevStep,
		skipStep,
	} = useUserOnboarding();

	const currentStep = steps[currentStepIndex];
	const completedSteps = steps.filter((step) => step.completed).length;
	const totalTime = steps.reduce((acc, step) => acc + step.estimatedTime, 0);

	if (!currentStep) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<LoadingSpinner size="lg" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Progress Header */}
			<div className="bg-white border-b border-gray-200 sticky top-0 z-10">
				<div className="max-w-4xl mx-auto px-4 py-4">
					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center gap-3">
							<div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
								<BuildingOfficeIcon className="h-5 w-5 text-white" />
							</div>
							<div>
								<h1 className="text-lg font-semibold text-gray-900">CONSTRU</h1>
								<p className="text-sm text-gray-600">Configuración inicial</p>
							</div>
						</div>
						<div className="text-right">
							<div className="text-sm text-gray-600">
								Paso {currentStepIndex + 1} de {steps.length}
							</div>
							<div className="text-xs text-gray-500">
								~
								{totalTime -
									steps
										.slice(0, currentStepIndex)
										.reduce((acc, step) => acc + step.estimatedTime, 0)}{" "}
								min restantes
							</div>
						</div>
					</div>

					{/* Progress Bar */}
					<div className="w-full bg-gray-200 rounded-full h-2">
						<div
							className="bg-blue-600 h-2 rounded-full transition-all duration-300"
							style={{
								width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
							}}
						/>
					</div>

					{/* Step Indicators */}
					<div className="flex justify-between mt-4">
						{steps.map((step, index) => (
							<div
								key={step.id}
								className={`flex flex-col items-center ${
									index <= currentStepIndex ? "text-blue-600" : "text-gray-400"
								}`}
							>
								<div
									className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
										step.completed
											? "bg-green-600 text-white"
											: index === currentStepIndex
												? "bg-blue-600 text-white"
												: "bg-gray-200"
									}`}
								>
									{step.completed ? "✓" : index + 1}
								</div>
								<span className="text-xs mt-1 text-center max-w-16 truncate">
									{step.title.split(" ")[0]}
								</span>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Step Content */}
			<div className="max-w-4xl mx-auto px-4 py-8">
				<div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
					<currentStep.component
						onNext={nextStep}
						onBack={prevStep}
						onSkip={currentStep.required ? undefined : skipStep}
						initialData={userProfile}
						isLoading={isLoading}
					/>
				</div>
			</div>
		</div>
	);
};

export default UserOnboarding;
