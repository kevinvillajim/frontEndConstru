import {useState} from "react";
import {Link} from "react-router-dom";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {ArrowLeftIcon} from "@heroicons/react/24/outline";

// Definir el esquema de validación con Zod
const forgotPasswordSchema = z.object({
	email: z.string().email("Ingresa un correo electrónico válido"),
});

// Tipo para los valores del formulario
type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [resetError, setResetError] = useState<string | null>(null);
	const [resetSuccess, setResetSuccess] = useState(false);

	// Configurar react-hook-form con validación de Zod
	const {
		register,
		handleSubmit,
		formState: {errors},
	} = useForm<ForgotPasswordFormValues>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: "",
		},
	});

	// Manejar el envío del formulario
	const onSubmit = async (data: ForgotPasswordFormValues) => {
		setIsLoading(true);
		setResetError(null);

		try {
			// Aquí iría la lógica real de restablecimiento con la API
			console.log("Solicitud de restablecimiento para:", data.email);

			// Simulación de retraso para demostrar el estado de carga
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// Mostrar mensaje de éxito
			setResetSuccess(true);
		} catch (error) {
			console.error("Error al solicitar restablecimiento:", error);
			setResetError(
				"Ocurrió un error al procesar tu solicitud. Por favor, inténtalo de nuevo."
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4 sm:px-6 lg:px-8">
			<div className="w-full max-w-md animate-fade-in">
				<div className="text-center mb-8">
					<h2 className="text-3xl font-bold mb-2 text-primary-700">
						Recuperar Contraseña
					</h2>
					<p className="text-gray-600">
						Te enviaremos un enlace para restablecer tu contraseña
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
								¡Correo Enviado!
							</h3>
							<p className="text-gray-600 mb-6">
								Por favor, revisa tu bandeja de entrada y sigue las
								instrucciones para restablecer tu contraseña.
							</p>
							<Link
								to="/login"
								className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 flex items-center justify-center"
							>
								<ArrowLeftIcon className="h-5 w-5 mr-2" />
								Volver a Iniciar Sesión
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
								{/* Campo de correo electrónico */}
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

								{/* Botón de enviar */}
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
											<span>Enviando...</span>
										</div>
									) : (
										<span>Enviar Enlace de Recuperación</span>
									)}
								</button>

								{/* Enlace a iniciar sesión */}
								<div className="text-center pt-4">
									<Link
										to="/login"
										className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors"
									>
										<ArrowLeftIcon className="h-4 w-4 mr-1" />
										Volver a Iniciar Sesión
									</Link>
								</div>
							</form>
						</>
					)}
				</div>

				{/* Decoración arquitectónica sutil */}
				<div className="mt-10 mx-auto w-full max-w-md opacity-30">
					<svg viewBox="0 0 400 40" xmlns="http://www.w3.org/2000/svg">
						<line
							x1="0"
							y1="20"
							x2="400"
							y2="20"
							stroke="currentColor"
							strokeWidth="1"
						/>
						<circle cx="200" cy="20" r="5" fill="currentColor" />
						<circle cx="180" cy="20" r="2" fill="currentColor" />
						<circle cx="160" cy="20" r="2" fill="currentColor" />
						<circle cx="140" cy="20" r="2" fill="currentColor" />
						<circle cx="220" cy="20" r="2" fill="currentColor" />
						<circle cx="240" cy="20" r="2" fill="currentColor" />
						<circle cx="260" cy="20" r="2" fill="currentColor" />
					</svg>
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

export default ForgotPasswordPage;
