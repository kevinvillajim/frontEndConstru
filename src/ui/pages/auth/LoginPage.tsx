import {useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {
	EyeIcon,
	EyeSlashIcon,
	ArrowRightIcon,
} from "@heroicons/react/24/outline";
import {useAuth} from "../../context/AuthContext";

// Definir el esquema de validación con Zod
const loginSchema = z.object({
	email: z.string().email("Ingresa un correo electrónico válido"),
	password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
	rememberMe: z.boolean().optional(),
});

// Tipo para los valores del formulario
type LoginFormValues = z.infer<typeof loginSchema>;

interface AuthError {
	message: string;
}

const LoginPage = () => {
	const {login} = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [loginError, setLoginError] = useState<string | null>(null);
	const [showTwoFactorInput, setShowTwoFactorInput] = useState(false);
	const [twoFactorCode, setTwoFactorCode] = useState("");

	// Obtener la ruta de redirección después del login, si existe
	const from =
		(location.state &&
			(location.state as {from?: {pathname: string}}).from?.pathname) ||
		"/";

	// Configurar react-hook-form con validación de Zod
	const {
		register,
		handleSubmit,
		formState: {errors},
	} = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
			rememberMe: false,
		},
	});

	// Manejar el envío del formulario
	const onSubmit = async (data: LoginFormValues) => {
		setIsLoading(true);
		setLoginError(null);

		try {
			// Si estamos en el flujo de 2FA, enviamos el código
			if (showTwoFactorInput) {
				await login(data.email, data.password, twoFactorCode);
			} else {
				// Intento normal de login
				try {
					await login(data.email, data.password);
				} catch (error) {
					const authError = error as AuthError;
					// Si el error es por 2FA requerido, mostrar el input
					if (
						authError.message?.includes("two-factor") ||
						authError.message?.includes("2FA") ||
						authError.message?.includes("código de verificación")
					) {
						setShowTwoFactorInput(true);
						setIsLoading(false);
						return;
					}
					throw error;
				}
			}
		// Login exitoso, redirigir
			navigate(from);
		} catch (error) {
			console.error("Error de inicio de sesión:", error);
			const err = error as AuthError;
			setLoginError(err.message || "Credenciales incorrectas. Por favor, inténtalo de nuevo.");		} finally {
			setIsLoading(false);
		}
	};

	const renderTwoFactorField = () => {
		if (!showTwoFactorInput) return null;

		return (
			<div className="mb-6">
				<label
					htmlFor="totpToken"
					className="block mb-2 text-sm font-medium text-gray-700"
				>
					Código de Verificación (2FA)
				</label>
				<input
					id="totpToken"
					type="text"
					value={twoFactorCode}
					onChange={(e) => setTwoFactorCode(e.target.value)}
					className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900 transition-all duration-300 focus:outline-none focus:ring-2"
					placeholder="Código de 6 dígitos"
				/>
			</div>
		);
	};

	return (
		<div className="flex min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
			{/* Panel izquierdo - Diseño e ilustración */}
			<div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
				<div className="absolute inset-0 bg-primary-600">
					{/* Elementos gráficos arquitectónicos (rejilla) */}
					<div className="absolute inset-0 opacity-10">
						<div className="grid-pattern"></div>
					</div>

					{/* Formas arquitectónicas decorativas */}
					<div className="absolute top-1/4 left-1/3 w-64 h-64 rounded-full bg-secondary-400 opacity-20 filter blur-3xl"></div>
					<div className="absolute bottom-1/3 right-1/3 w-48 h-65 rounded-full bg-primary-300 opacity-20 filter blur-3xl"></div>

					{/* Líneas de blueprint que representan un plano arquitectónico */}
					<div className="absolute inset-0 overflow-hidden">
						<svg
							className="w-full h-full opacity-10"
							viewBox="0 0 100 100"
							xmlns="http://www.w3.org/2000/svg"
						>
							{/* Líneas horizontales y verticales estilo plano */}
							<pattern
								id="grid"
								width="10"
								height="10"
								patternUnits="userSpaceOnUse"
							>
								<path
									d="M 10 0 L 0 0 0 10"
									fill="none"
									stroke="currentColor"
									strokeWidth="0.25"
								/>
							</pattern>
							<rect width="100" height="100" fill="url(#grid)" />

							{/* Elementos de plano arquitectónico */}
							<rect
								x="20"
								y="20"
								width="60"
								height="40"
								fill="none"
								stroke="currentColor"
								strokeWidth="0.5"
							/>
							<line
								x1="20"
								y1="35"
								x2="80"
								y2="35"
								stroke="currentColor"
								strokeWidth="0.5"
							/>
							<rect
								x="30"
								y="20"
								width="15"
								height="15"
								fill="none"
								stroke="currentColor"
								strokeWidth="0.5"
							/>
							<rect
								x="55"
								y="20"
								width="15"
								height="15"
								fill="none"
								stroke="currentColor"
								strokeWidth="0.5"
							/>
						</svg>
					</div>
				</div>

				{/* Contenido del panel izquierdo */}
				<div className="relative z-10 flex flex-col justify-center items-center text-white p-12 animate-fade-in-slow">
					<h1 className="text-4xl font-bold mb-6 tracking-tight">
						<span className="text-secondary-500">CONS</span>
						<span style={{color: "var(--text-main)"}}>TRU</span>
					</h1>
					<p className="text-xl text-center mb-8 max-w-md">
						La plataforma integral para profesionales de la construcción en
						Ecuador
					</p>

					{/* Cita que inspira a arquitectos */}
					<blockquote className="border-l-4 border-secondary-500 pl-4 mb-8 italic text-lg">
						"La arquitectura es el punto de partida para cualquiera que quiera
						crear algo que perdurar en el tiempo."
						<div className="text-sm mt-2 text-gray-300">
							— Ludwig Mies van der Rohe
						</div>
					</blockquote>

					{/* Métricas o beneficios */}
					<div className="grid grid-cols-2 gap-8 mt-4 w-full max-w-lg">
						<div className="bg-primary-600 bg-opacity-10 rounded-lg p-4 backdrop-filter backdrop-blur-sm transform transition-transform hover:scale-105">
							<div className="text-3xl font-bold text-secondary-400 mb-1">
								+500
							</div>
							<div className="text-sm">Profesionales confían en nosotros</div>
						</div>
						<div className="bg-primary-600 bg-opacity-10 rounded-lg p-4 backdrop-filter backdrop-blur-sm transform transition-transform hover:scale-105">
							<div className="text-3xl font-bold text-secondary-400 mb-1">
								85%
							</div>
							<div className="text-sm">Ahorro de tiempo en presupuestos</div>
						</div>
					</div>
				</div>
			</div>

			{/* Panel derecho - Formulario de inicio de sesión */}
			<div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
				<div className="w-full max-w-md animate-slide-up">
					<div className="text-center mb-10">
						<h2 className="text-3xl font-bold mb-2 text-primary-700">
							Iniciar Sesión
						</h2>
						<p className="dark:text-gray-600">
							Bienvenido de nuevo a tu plataforma profesional
						</p>
					</div>

					{/* Tarjeta del formulario con efecto de elevación sutil */}
					<div className="bg-white rounded-xl shadow-card p-8 backdrop-filter backdrop-blur-md bg-opacity-80">
						{loginError && (
							<div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6 text-sm animate-fade-in">
								{loginError}
							</div>
						)}

						<form onSubmit={handleSubmit(onSubmit)}>
							{/* Campo de correo electrónico */}
							<div className="mb-6">
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

							{/* Campo de contraseña */}
							<div className="mb-6">
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
							</div>

							{/* Campo de 2FA si es necesario */}
							{renderTwoFactorField()}

							{/* Opciones adicionales */}
							<div className="flex items-center justify-between mb-6">
								<div className="flex items-center">
									<input
										id="rememberMe"
										type="checkbox"
										{...register("rememberMe")}
										className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 "
									/>
									<label
										htmlFor="rememberMe"
										className="ml-2 text-sm text-gray-700"
									>
										Recordarme
									</label>
								</div>
								<Link
									to="/forgot-password"
									className="text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors group"
								>
									<span>¿Olvidaste tu contraseña?</span>
									<span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-primary-600"></span>
								</Link>
							</div>

							{/* Botón de inicio de sesión */}
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
										<span>Iniciando sesión...</span>
									</div>
								) : (
									<div className="flex items-center">
										<span>Iniciar Sesión</span>
										<ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
									</div>
								)}
							</button>
						</form>

						{/* Separador */}
						<div className="flex items-center my-6">
							<div className="flex-grow border-t border-gray-300"></div>
							<div className="px-3 text-sm text-gray-500">
								o
							</div>
							<div className="flex-grow border-t border-gray-300"></div>
						</div>

						{/* Enlace a registro */}
						<div className="text-center">
							<p className="text-sm text-gray-600">
								¿No tienes una cuenta?{" "}
								<Link
									to="/register"
									className="relative inline-block font-medium text-primary-600 hover:text-primary-500 transition-colors group"
								>
									<span className="relative z-10">Regístrate aquí</span>
									<span className="absolute left-0 bottom-0 h-0.5 bg-primary-600 w-0 group-hover:w-full transition-all duration-500"></span>
								</Link>
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Estilos para las animaciones */}
			<style>{`
				.grid-pattern {
					background-image:
						linear-gradient(
							to right,
							rgba(255, 255, 255, 0.1) 1px,
							transparent 1px
						),
						linear-gradient(
							to bottom,
							rgba(255, 255, 255, 0.1) 1px,
							transparent 1px
						);
					background-size: 20px 20px;
					width: 100%;
					height: 100%;
				}

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
			`}</style>
		</div>
	);
};

export default LoginPage;
