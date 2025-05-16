import {useState, useEffect} from "react";
import {Link, useParams, useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {
	EyeIcon,
	EyeSlashIcon,
	ArrowRightIcon,
} from "@heroicons/react/24/outline";
import {authService} from "../../../core/application/ServiceFactory";

// Definir el esquema de validación con Zod
const resetPasswordSchema = z
	.object({
		password: z
			.string()
			.min(8, "La contraseña debe tener al menos 8 caracteres")
			.regex(/[A-Z]/, "Debe incluir al menos una mayúscula")
			.regex(/[0-9]/, "Debe incluir al menos un número"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Las contraseñas no coinciden",
		path: ["confirmPassword"],
	});

// Tipo para los valores del formulario
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPasswordPage = () => {
	// Usar useParams para obtener el token de la URL
	const {token} = useParams<{token: string}>();
	const navigate = useNavigate();

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [resetError, setResetError] = useState<string | null>(null);
	const [resetSuccess, setResetSuccess] = useState(false);
	const [passwordStrength, setPasswordStrength] = useState(0);
	const [tokenValid, setTokenValid] = useState<boolean | null>(null);
	const [validatingToken, setValidatingToken] = useState(true);

	// Verificar la validez del token al cargar la página
	useEffect(() => {
		const verifyToken = async () => {
			if (!token) {
				setTokenValid(false);
				setValidatingToken(false);
				return;
			}

			try {
				// Implementar una verificación de token más adecuada
				// En lugar de hacer una solicitud POST al endpoint de restablecimiento,
				// debe haber un endpoint específico para verificar el token

				// Podemos simular esta verificación con una solicitud GET
				const response = await fetch(`/api/auth/verify-reset-token/${token}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});

				const data = await response.json();

				if (response.ok && data.success) {
					setTokenValid(true);
				} else {
					setTokenValid(false);
					setResetError(data.message || "Token inválido o expirado");
				}
			} catch (error) {
				console.error("Error validando token:", error);
				setTokenValid(false);
				setResetError(
					"Error al verificar el token. Por favor, solicita un nuevo enlace."
				);
			} finally {
				setValidatingToken(false);
			}
		};

		verifyToken();
	}, [token]);

	// Configurar react-hook-form con validación de Zod
	const {
		register,
		handleSubmit,
		formState: {errors},
		watch,
	} = useForm<ResetPasswordFormValues>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	});

	// Observar los cambios en el campo de contraseña para evaluar su fortaleza
	const password = watch("password");

	// Evaluar la fortaleza de la contraseña
	useEffect(() => {
		if (!password) {
			setPasswordStrength(0);
			return;
		}

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

		setPasswordStrength(strength);
	}, [password]);

	// Manejar el envío del formulario
	const onSubmit = async (data: ResetPasswordFormValues) => {
		if (!token) {
			setResetError("Token no válido o faltante.");
			return;
		}

		setIsLoading(true);
		setResetError(null);

		try {
			const response = await authService.resetPassword(
				token,
				data.password,
				data.confirmPassword
			);

			if (response.success) {
				setResetSuccess(true);
				// Redirigir al login después de 3 segundos
				setTimeout(() => {
					navigate("/login");
				}, 3000);
			} else {
				setResetError(response.message || "Error al restablecer contraseña.");
			}
		} catch (error: Error | unknown) {
			console.error("Error al restablecer contraseña:", error);
			const err = error as {message: string};
			throw {
				success: false,
				message: err.message || "Error al cambiar la contraseña",
			};
		} finally {
			setIsLoading(false);
		}
	};

	// Renderizado condicional según el estado del token
	if (validatingToken) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4 sm:px-6 lg:px-8">
				<div className="w-full max-w-md text-center">
					<div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
					<p className="mt-4 text-lg text-gray-700">
						Verificando enlace de recuperación...
					</p>
				</div>
			</div>
		);
	}

	if (tokenValid === false) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4 sm:px-6 lg:px-8">
				<div className="w-full max-w-md animate-fade-in">
					<div className="bg-white rounded-xl shadow-card p-8 text-center">
						<div className="rounded-full bg-red-100 p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
							<svg
								className="w-8 h-8 text-red-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M6 18L18 6M6 6l12 12"
								></path>
							</svg>
						</div>
						<h2 className="text-2xl font-bold mb-2 text-gray-800">
							Enlace Inválido
						</h2>
						<p className="text-gray-600 mb-6">
							{resetError ||
								"Este enlace de recuperación es inválido o ha expirado. Por favor, solicita un nuevo enlace."}
						</p>
						<Link
							to="/forgot-password"
							className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 inline-block"
						>
							Solicitar Nuevo Enlace
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4 sm:px-6 lg:px-8">
			<div className="w-full max-w-md animate-fade-in">
				<div className="text-center mb-8">
					<h2 className="text-3xl font-bold mb-2 text-primary-700">
						Restablecer Contraseña
					</h2>
					<p className="text-gray-600">
						Elige una nueva contraseña segura para tu cuenta
					</p>
				</div>

				<div className="bg-white rounded-xl shadow-card p-8 backdrop-filter backdrop-blur-md bg-opacity-80">
					{resetSuccess ? (
						<div className="text-center animate-fade-in">
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
								¡Contraseña Restablecida!
							</h3>
							<p className="text-gray-600 mb-6">
								Tu contraseña ha sido actualizada exitosamente. Ya puedes
								iniciar sesión con tu nueva contraseña.
							</p>
							<Link
								to="/login"
								className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 flex items-center justify-center"
							>
								<span>Iniciar Sesión</span>
								<ArrowRightIcon className="ml-2 h-5 w-5" />
							</Link>
						</div>
					) : (
						<>
							{resetError && (
								<div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6 text-sm animate-fade-in">
									{resetError}
								</div>
							)}

							<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
								{/* Campo de contraseña */}
								<div>
									<label
										htmlFor="password"
										className="block mb-2 text-sm font-medium text-gray-700"
									>
										Nueva Contraseña
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

								{/* Campo de confirmar contraseña */}
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
											} bg-white text-gray-900 transition-all duration-300 focus:outline-none focus:ring-2`}
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

								{/* Botón de restablecer */}
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
										<span>Restablecer Contraseña</span>
									)}
								</button>

								{/* Enlaces adicionales */}
								<div className="text-center pt-4">
									<Link
										to="/login"
										className="text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors"
									>
										Volver a Iniciar Sesión
									</Link>
								</div>
							</form>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default ResetPasswordPage;
