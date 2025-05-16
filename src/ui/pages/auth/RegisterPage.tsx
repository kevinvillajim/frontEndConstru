import {useState, useEffect} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {
	EyeIcon,
	EyeSlashIcon,
	ArrowRightIcon,
	BuildingOffice2Icon,
	UserIcon,
	AcademicCapIcon,
	WrenchScrewdriverIcon,
	PaintBrushIcon,
	PlusIcon,
	MinusIcon,
	BoltIcon,
	WrenchIcon,
} from "@heroicons/react/24/outline";
import {useAuth} from "../../context/AuthContext";

// Enum matching the backend's ProfessionalType enum
const ProfessionalType = {
	ARCHITECT: "architect",
	CIVIL_ENGINEER: "civil_engineer",
	CONSTRUCTOR: "constructor",
	CONTRACTOR: "contractor",
	ELECTRICIAN: "electrician",
	PLUMBER: "plumber",
	DESIGNER: "designer",
	OTHER: "other",
} as const

// Definir el esquema de validación con Zod
const registerSchema = z
	.object({
		firstName: z.string().min(2, "Nombre demasiado corto"),
		lastName: z.string().min(2, "Apellido demasiado corto"),
		email: z.string().email("Ingresa un correo electrónico válido"),
		password: z
			.string()
			.min(8, "La contraseña debe tener al menos 8 caracteres")
			.regex(/[A-Z]/, "Debe incluir al menos una mayúscula")
			.regex(/[0-9]/, "Debe incluir al menos un número"),
		confirmPassword: z.string(),
		professionalType: z.nativeEnum(ProfessionalType),
		terms: z.literal(true, {
			errorMap: () => ({message: "Debes aceptar los términos y condiciones"}),
		}),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Las contraseñas no coinciden",
		path: ["confirmPassword"],
	});

// Tipo para los valores del formulario
type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegisterError {
	message: string;
}

const RegisterPage = () => {
	const {register: registerUser} = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [registerError, setRegisterError] = useState<string | null>(null);
	const [registerSuccess, setRegisterSuccess] = useState(false);
	const [passwordStrength, setPasswordStrength] = useState(0);
	const [showAllProfessions, setShowAllProfessions] = useState(false);

	// Professional options with proper backend enum values
	const primaryProfessionOptions = [
		{
			value: ProfessionalType.ARCHITECT,
			label: "Arquitecto",
			icon: BuildingOffice2Icon,
		},
		{
			value: ProfessionalType.CIVIL_ENGINEER,
			label: "Ingeniero Civil",
			icon: AcademicCapIcon,
		},
		{
			value: ProfessionalType.CONSTRUCTOR,
			label: "Constructor",
			icon: WrenchScrewdriverIcon,
		},
		{
			value: ProfessionalType.DESIGNER,
			label: "Diseñador",
			icon: PaintBrushIcon,
		},
	];

	const additionalProfessionOptions = [
		{value: ProfessionalType.CONTRACTOR, label: "Contratista", icon: UserIcon},
		{
			value: ProfessionalType.ELECTRICIAN,
			label: "Electricista",
			icon: BoltIcon,
		},
		{value: ProfessionalType.PLUMBER, label: "Plomero", icon: WrenchIcon},
		{value: ProfessionalType.OTHER, label: "Otro Profesional", icon: UserIcon},
	];

	// Display all profession options or just the primary ones
	const visibleProfessions = showAllProfessions
		? [...primaryProfessionOptions, ...additionalProfessionOptions]
		: primaryProfessionOptions;

	// Configurar react-hook-form con validación de Zod
	const {
		register,
		handleSubmit,
		formState: {errors},
		watch,
	} = useForm<RegisterFormValues>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			password: "",
			confirmPassword: "",
			professionalType: ProfessionalType.ARCHITECT,
			terms: true,
		},
	});

	// Observar los cambios en el campo de contraseña para evaluar su fortaleza
	const password = watch("password");

	// Evaluar la fortaleza de la contraseña
	const calculatePasswordStrength = (password: string) => {
		if (!password) return 0;

		let strength = 0;

		// Longitud mínima
		if (password.length >= 8) strength += 1;

		// Contiene mayúsculas
		if (/[A-Z]/.test(password)) strength += 1;

		// Contiene minúsculas
		if (/[a-z]/.test(password)) strength += 1;

		// Contiene números
		if (/[0-9]/.test(password)) strength += 1;

		// Contiene caracteres especiales
		if (/[^A-Za-z0-9]/.test(password)) strength += 1;

		return strength;
	};

	// Actualizar la fortaleza cada vez que cambia la contraseña
	useEffect(() => {
		setPasswordStrength(calculatePasswordStrength(password));
	}, [password]);

	// Manejar el envío del formulario
	const onSubmit = async (data: RegisterFormValues) => {
		setIsLoading(true);
		setRegisterError(null);

		try {
			// Mapear datos del formulario a la estructura que espera la API
			const registerData = {
				firstName: data.firstName,
				lastName: data.lastName,
				email: data.email,
				password: data.password,
				professionalType: data.professionalType, // Esto ya debe ser el valor del enum correcto
			};

			console.log("Enviando datos de registro:", {
				...registerData,
				password: "********", // No mostrar la contraseña en los logs
			});

			// Llamar al método de registro del AuthContext
			await registerUser(registerData);

			// Marcar el registro como exitoso
			setRegisterSuccess(true);

			// Después de un tiempo, redirigir a login
			setTimeout(() => {
				navigate("/login", {
					state: {
						from: location.state?.from,
						registrationSuccess: true,
						email: data.email,
					},
				});
			}, 3000);
		} catch (error) {
			console.error("Error de registro:", error);
			const err = error as RegisterError;
			setRegisterError(
				err.message ||
					"Ha ocurrido un error al registrarse. Por favor, inténtalo de nuevo."
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
			{/* Panel izquierdo - Formulario de registro */}
			<div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
				<div className="w-full max-w-lg animate-slide-up">
					<div className="text-center mb-8">
						<h2 className="text-3xl font-bold mb-2 text-primary-700">
							Únete a CONSTRU
						</h2>
						<p className="text-gray-600">
							Tu plataforma integral para la construcción
						</p>
					</div>

					{/* Contenido condicional: Éxito de registro o formulario */}
					{registerSuccess ? (
						<div className="bg-white rounded-xl shadow-card p-8 text-center animate-fade-in">
							<div className="rounded-full bg-green-100 p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
								<svg
									className="w-8 h-8 text-green-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M5 13l4 4L19 7"
									></path>
								</svg>
							</div>
							<h3 className="text-xl font-semibold mb-2 text-gray-800">
								¡Registro Exitoso!
							</h3>
							<p className="text-gray-600 mb-6">
								Te hemos enviado un correo de verificación. Por favor, revisa tu
								bandeja de entrada para completar el registro.
							</p>
							<Link
								to="/login"
								className="w-full inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
							>
								Ir a Iniciar Sesión
							</Link>
						</div>
					) : (
						<div className="bg-white rounded-xl shadow-card p-8 backdrop-filter backdrop-blur-md bg-opacity-80">
							{registerError && (
								<div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6 text-sm animate-fade-in">
									{registerError}
								</div>
							)}

							<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
								{/* Nombres y apellidos en una fila */}
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									{/* Nombre */}
									<div>
										<label
											htmlFor="firstName"
											className="block mb-2 text-sm font-medium text-gray-700"
										>
											Nombre
										</label>
										<div
											className={`relative ${errors.firstName ? "animate-shake" : ""}`}
										>
											<input
												id="firstName"
												type="text"
												{...register("firstName")}
												className={`w-full px-4 py-3 rounded-lg border ${
													errors.firstName
														? "border-red-500 focus:ring-red-500 focus:border-red-500"
														: "border-gray-300 focus:ring-primary-500 focus:border-primary-500"
												} bg-white text-gray-900 transition-all duration-300 focus:outline-none focus:ring-2`}
												placeholder="Tu nombre"
											/>
										</div>
										{errors.firstName && (
											<p className="mt-1 text-sm text-red-600 animate-fade-in">
												{errors.firstName.message}
											</p>
										)}
									</div>

									{/* Apellido */}
									<div>
										<label
											htmlFor="lastName"
											className="block mb-2 text-sm font-medium text-gray-700"
										>
											Apellido
										</label>
										<div
											className={`relative ${errors.lastName ? "animate-shake" : ""}`}
										>
											<input
												id="lastName"
												type="text"
												{...register("lastName")}
												className={`w-full px-4 py-3 rounded-lg border ${
													errors.lastName
														? "border-red-500 focus:ring-red-500 focus:border-red-500"
														: "border-gray-300 focus:ring-primary-500 focus:border-primary-500"
												} bg-white text-gray-900 transition-all duration-300 focus:outline-none focus:ring-2`}
												placeholder="Tu apellido"
											/>
										</div>
										{errors.lastName && (
											<p className="mt-1 text-sm text-red-600 animate-fade-in">
												{errors.lastName.message}
											</p>
										)}
									</div>
								</div>

								{/* Correo electrónico */}
								<div>
									<label
										htmlFor="email"
										className="block mb-2 text-sm font-medium text-gray-700"
									>
										Correo Electrónico
									</label>
									<div
										className={`relative ${errors.email ? "animate-shake" : ""}`}
									>
										<input
											id="email"
											type="email"
											{...register("email")}
											className={`w-full px-4 py-3 rounded-lg border ${
												errors.email
													? "border-red-500 focus:ring-red-500 focus:border-red-500"
													: "border-gray-300 focus:ring-primary-500 focus:border-primary-500"
											} bg-white text-gray-900 transition-all duration-300 focus:outline-none focus:ring-2`}
											placeholder="tu@correo.com"
										/>
									</div>
									{errors.email && (
										<p className="mt-1 text-sm text-red-600 animate-fade-in">
											{errors.email.message}
										</p>
									)}
								</div>

								{/* Tipo de profesional */}
								<div>
									<label
										htmlFor="professionalType"
										className="block mb-2 text-sm font-medium text-gray-700"
									>
										Tipo de Profesional
									</label>
									<div className="grid grid-cols-2 md:grid-cols-2 gap-3">
										{visibleProfessions.map((option) => (
											<label
												key={option.value}
												className={`
													flex flex-col items-center justify-center p-3 rounded-lg border cursor-pointer transition-all duration-300
													${
														watch("professionalType") === option.value
															? "border-primary-500 bg-primary-50 text-primary-700"
															: "border-gray-300 hover:border-primary-400"
													}
												`}
											>
												<input
													type="radio"
													value={option.value}
													{...register("professionalType")}
													className="sr-only"
												/>
												<option.icon className="w-6 h-6 mb-2" />
												<span className="text-sm font-medium">
													{option.label}
												</span>
											</label>
										))}
									</div>

									{/* Botón para mostrar/ocultar más opciones */}
									<button
										type="button"
										onClick={() => setShowAllProfessions(!showAllProfessions)}
										className="mt-3 text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
									>
										{showAllProfessions ? (
											<>
												<MinusIcon className="h-4 w-4 mr-1" />
												Mostrar menos opciones
											</>
										) : (
											<>
												<PlusIcon className="h-4 w-4 mr-1" />
												Mostrar más opciones
											</>
										)}
									</button>
								</div>

								{/* Contraseña */}
								<div>
									<label
										htmlFor="password"
										className="block mb-2 text-sm font-medium text-gray-700"
									>
										Contraseña
									</label>
									<div
										className={`relative ${errors.password ? "animate-shake" : ""}`}
									>
										<input
											id="password"
											type={showPassword ? "text" : "password"}
											{...register("password")}
											className={`w-full px-4 py-3 rounded-lg border ${
												errors.password
													? "border-red-500 focus:ring-red-500 focus:border-red-500"
													: "border-gray-300 focus:ring-primary-500 focus:border-primary-500"
											} bg-white text-gray-900 transition-all duration-300 focus:outline-none focus:ring-2`}
											placeholder="••••••••"
										/>
										<button
											type="button"
											className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-primary-500 transition-colors"
											onClick={() => setShowPassword(!showPassword)}
										>
											{showPassword ? (
												<EyeSlashIcon className="h-5 w-5" />
											) : (
												<EyeIcon className="h-5 w-5" />
											)}
										</button>
									</div>
									{errors.password && (
										<p className="mt-1 text-sm text-red-600 animate-fade-in">
											{errors.password.message}
										</p>
									)}

									{/* Indicador de fortaleza de contraseña */}
									{password && (
										<div className="mt-2">
											<div className="flex justify-between mb-1">
												<span className="text-xs text-gray-500">
													Fortaleza de contraseña
												</span>
												<span className="text-xs font-medium">
													{passwordStrength === 0 && "Muy débil"}
													{passwordStrength === 1 && "Débil"}
													{passwordStrength === 2 && "Media"}
													{passwordStrength === 3 && "Buena"}
													{passwordStrength === 4 && "Fuerte"}
													{passwordStrength === 5 && "Muy fuerte"}
												</span>
											</div>
											<div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
												<div
													className={`h-full transition-all duration-300 ${
														passwordStrength <= 1
															? "bg-red-500"
															: passwordStrength <= 2
																? "bg-yellow-500"
																: passwordStrength <= 3
																	? "bg-blue-500"
																	: "bg-green-500"
													}`}
													style={{width: `${passwordStrength * 20}%`}}
												></div>
											</div>
										</div>
									)}
								</div>

								{/* Confirmar Contraseña */}
								<div>
									<label
										htmlFor="confirmPassword"
										className="block mb-2 text-sm font-medium text-gray-700"
									>
										Confirmar Contraseña
									</label>
									<div
										className={`relative ${errors.confirmPassword ? "animate-shake" : ""}`}
									>
										<input
											id="confirmPassword"
											type={showConfirmPassword ? "text" : "password"}
											{...register("confirmPassword")}
											className={`w-full px-4 py-3 rounded-lg border ${
												errors.confirmPassword
													? "border-red-500 focus:ring-red-500 focus:border-red-500"
													: "border-gray-300 focus:ring-primary-500 focus:border-primary-500"
											} text-gray-900 transition-all duration-300 focus:outline-none focus:ring-2`}
											placeholder="••••••••"
										/>
										<button
											type="button"
											className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-primary-500 transition-colors"
											onClick={() =>
												setShowConfirmPassword(!showConfirmPassword)
											}
										>
											{showConfirmPassword ? (
												<EyeSlashIcon className="h-5 w-5" />
											) : (
												<EyeIcon className="h-5 w-5" />
											)}
										</button>
									</div>
									{errors.confirmPassword && (
										<p className="mt-1 text-sm text-red-600 animate-fade-in">
											{errors.confirmPassword.message}
										</p>
									)}
								</div>

								{/* Términos y condiciones */}
								<div className={errors.terms ? "animate-shake" : ""}>
									<div className="flex items-start">
										<div className="flex items-center h-5">
											<input
												id="terms"
												type="checkbox"
												{...register("terms")}
												className={`h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 accent-secondary-500 ${
													errors.terms ? "border-red-500" : "border-gray-300"
												}`}
											/>
										</div>
										<div className="ml-3 text-sm">
											<label
												htmlFor="terms"
												className="font-medium text-gray-700"
											>
												Acepto los{" "}
												<Link
													to="/terminos"
													className="text-primary-600 hover:text-primary-500 transition-colors"
												>
													términos de servicio
												</Link>{" "}
												y{" "}
												<Link
													to="/privacidad"
													className="text-primary-600 hover:text-primary-500 transition-colors"
												>
													política de privacidad
												</Link>
											</label>
										</div>
									</div>
									{errors.terms && (
										<p className="mt-1 text-sm text-red-600 animate-fade-in">
											{errors.terms.message}
										</p>
									)}
								</div>

								{/* Botón de registro */}
								<button
									type="submit"
									disabled={isLoading}
									className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 flex items-center justify-center"
								>
									{isLoading ? (
										<div className="flex items-center">
											<svg
												className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
											>
												<circle
													className="opacity-25"
													cx="12"
													cy="12"
													r="10"
													stroke="currentColor"
													strokeWidth="4"
												></circle>
												<path
													className="opacity-75"
													fill="currentColor"
													d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
												></path>
											</svg>
											<span>Procesando...</span>
										</div>
									) : (
										<div className="flex items-center">
											<span>Crear Cuenta</span>
											<ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
										</div>
									)}
								</button>

								{/* Enlace a iniciar sesión */}
								<div className="text-center">
									<p className="text-sm text-gray-600">
										¿Ya tienes una cuenta?{" "}
										<Link
											to="/login"
											className="font-medium text-primary-600 hover:text-primary-500 transition-colors group"
										>
											<span>Inicia sesión</span>
											<span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-primary-600"></span>
										</Link>
									</p>
								</div>
							</form>
						</div>
					)}
				</div>
			</div>

			{/* Panel derecho - Diseño e ilustración para registrarse */}
			<div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
				<div className="absolute inset-0 bg-primary-700">
					{/* Elementos gráficos arquitectónicos */}
					<div className="absolute inset-0 opacity-5">
						{/* Fondo tipo blueprint */}
						<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
							<defs>
								<pattern
									id="smallGrid"
									width="10"
									height="10"
									patternUnits="userSpaceOnUse"
								>
									<path
										d="M 10 0 L 0 0 0 10"
										fill="none"
										stroke="white"
										strokeWidth="0.5"
										opacity="0.2"
									/>
								</pattern>
								<pattern
									id="grid"
									width="100"
									height="100"
									patternUnits="userSpaceOnUse"
								>
									<rect width="100" height="100" fill="url(#smallGrid)" />
									<path
										d="M 100 0 L 0 0 0 100"
										fill="none"
										stroke="white"
										strokeWidth="1"
										opacity="0.2"
									/>
								</pattern>
							</defs>
							<rect width="100%" height="100%" fill="url(#grid)" />
						</svg>
					</div>

					{/* Elementos decorativos arquitectónicos */}
					<div className="absolute opacity-20">
						{/* Formas arquitectónicas estilizadas */}
						<svg
							className="h-full w-full"
							viewBox="0 0 1000 1000"
							xmlns="http://www.w3.org/2000/svg"
						>
							{/* Círculos y formas geométricas superpuestas */}
							<circle
								cx="500"
								cy="500"
								r="300"
								fill="none"
								stroke="white"
								strokeWidth="2"
							/>
							<circle
								cx="500"
								cy="500"
								r="200"
								fill="none"
								stroke="white"
								strokeWidth="1"
							/>
							<rect
								x="300"
								y="300"
								width="400"
								height="400"
								fill="none"
								stroke="white"
								strokeWidth="2"
								strokeDasharray="10,5"
							/>
							<polygon
								points="500,200 700,400 500,600 300,400"
								fill="none"
								stroke="white"
								strokeWidth="1.5"
							/>

							{/* Líneas para representar planos arquitectónicos */}
							<line
								x1="200"
								y1="500"
								x2="800"
								y2="500"
								stroke="white"
								strokeWidth="1"
							/>
							<line
								x1="500"
								y1="200"
								x2="500"
								y2="800"
								stroke="white"
								strokeWidth="1"
							/>

							{/* Detalles técnicos */}
							<circle cx="500" cy="500" r="40" fill="white" opacity="0.2" />
							<circle cx="500" cy="500" r="10" fill="white" opacity="0.5" />
						</svg>
					</div>
				</div>

				{/* Contenido del panel derecho */}
				<div className="relative z-10 flex flex-col justify-center items-center text-white p-12 h-full animate-fade-in-slow">
					<div className="max-w-md">
						<h1 className="text-4xl font-bold mb-6 tracking-tight">
							Construyendo el Futuro
						</h1>
						<p className="text-xl mb-8">
							Únete a la comunidad líder de profesionales de la construcción en
							Ecuador y transforma tu manera de trabajar.
						</p>

						{/* Beneficios con íconos */}
						<div className="space-y-6 mb-12">
							<div className="flex items-start">
								<div className="flex-shrink-0 h-10 w-10 rounded-md bg-secondary-500 flex items-center justify-center mr-4 shadow-glow">
									<svg
										className="h-6 w-6 text-white"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M13 10V3L4 14h7v7l9-11h-7z"
										/>
									</svg>
								</div>
								<div>
									<h3 className="text-lg font-medium mb-1">
										Optimiza tus proyectos
									</h3>
									<p className="text-primary-200">
										Reduce un 85% el tiempo dedicado a presupuestos y cálculos
										técnicos.
									</p>
								</div>
							</div>

							<div className="flex items-start">
								<div className="flex-shrink-0 h-10 w-10 rounded-md bg-secondary-500 flex items-center justify-center mr-4 shadow-glow">
									<svg
										className="h-6 w-6 text-white"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
										/>
									</svg>
								</div>
								<div>
									<h3 className="text-lg font-medium mb-1">
										Conecta con profesionales
									</h3>
									<p className="text-primary-200">
										Forma parte de una red de más de 500 profesionales de la
										industria.
									</p>
								</div>
							</div>

							<div className="flex items-start">
								<div className="flex-shrink-0 h-10 w-10 rounded-md bg-secondary-500 flex items-center justify-center mr-4 shadow-glow">
									<svg
										className="h-6 w-6 text-white"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
								</div>
								<div>
									<h3 className="text-lg font-medium mb-1">Optimiza Costos</h3>
									<p className="text-primary-200">
										Ahorra hasta un 20% en costos de materiales con nuestras
										herramientas de comparación.
									</p>
								</div>
							</div>
						</div>

						{/* Testimonios */}
						<div className="bg-primary-800 bg-opacity-10 p-6 rounded-lg relative">
							<div className="absolute -top-3 -left-3 w-8 h-8 text-4xl text-secondary-400">
								"
							</div>
							<p className="text-white/90 italic mb-4">
								CONSTRU ha transformado mi forma de trabajar. Los cálculos que
								antes me tomaban días ahora los hago en minutos, con mayor
								precisión y control.
							</p>
							<div className="flex items-center">
								<div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold mr-3">
									MV
								</div>
								<div>
									<h4 className="font-medium">María Velasco</h4>
									<p className="text-sm text-primary-200">Arquitecta, Quito</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Estilos para las animaciones */}
			<style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-in-slow {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-4px);
          }
          50% {
            transform: translateX(4px);
          }
          75% {
            transform: translateX(-4px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.4s ease-in-out;
        }

        .animate-fade-in-slow {
          animation: fade-in-slow 1s ease-in-out;
        }

        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }

        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }

        .shadow-card {
          box-shadow:
            0 10px 25px -5px rgba(0, 0, 0, 0.05),
            0 8px 10px -6px rgba(0, 0, 0, 0.01);
        }

        .shadow-glow {
          box-shadow: 0 0 15px rgba(255, 193, 7, 0.5);
        }
      `}</style>
		</div>
	);
};

export default RegisterPage;
