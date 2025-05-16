import {useState, useEffect} from "react";
import {Link, useParams, useNavigate} from "react-router-dom";
import axios from "axios";
import endpoints from "../../../utils/endpoints";

/**
 * Página de verificación de correo electrónico
 * Esta página se accede mediante el enlace enviado al correo del usuario
 * Extrae el token de los parámetros y lo envía al backend para verificación
 */
const EmailVerificationPage = () => {
	const {token} = useParams<{token: string}>();
	const navigate = useNavigate();

	const [verificationStatus, setVerificationStatus] = useState<
		"loading" | "success" | "error"
	>("loading");
	const [errorMessage, setErrorMessage] = useState<string>("");
	const [countdown, setCountdown] = useState<number>(3);

	// Verificar el token al cargar la página
	useEffect(() => {
		const verifyEmail = async () => {
			if (!token) {
				setVerificationStatus("error");
				setErrorMessage("No se encontró el token de verificación en la URL.");
				return;
			}

			try {
				const response = await axios.get(endpoints.auth.verifyEmail(token));

				if (response.data.success) {
					setVerificationStatus("success");
					// Iniciar redirección después de éxito
					setTimeout(() => {
						navigate("/");
					}, 3000);
				} else {
					setVerificationStatus("error");
					setErrorMessage(
						response.data.message ||
							"No se pudo verificar tu correo electrónico."
					);
				}
			} catch (error) {
				console.error("Error durante la verificación de correo:", error);
				setVerificationStatus("error");

				if (axios.isAxiosError(error) && error.response) {
					setErrorMessage(
						error.response.data.message ||
							"Error al verificar tu correo electrónico."
					);
				} else {
					setErrorMessage("Ocurrió un error al comunicarse con el servidor.");
				}
			}
		};

		verifyEmail();
	}, [token, navigate]);

	// Temporizador de cuenta regresiva para el mensaje de éxito
	useEffect(() => {
		let timer: NodeJS.Timeout;

		if (verificationStatus === "success" && countdown > 0) {
			timer = setTimeout(() => {
				setCountdown(countdown - 1);
			}, 1000);
		}

		return () => {
			if (timer) clearTimeout(timer);
		};
	}, [verificationStatus, countdown]);

	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4 sm:px-6 lg:px-8">
			<div className="w-full max-w-md animate-fade-in">
				<div className="text-center mb-8">
					<h2 className="text-3xl font-bold mb-2 text-primary-700">
						Verificación de Correo
					</h2>
					<p className="text-gray-600">
						{verificationStatus === "loading"
							? "Estamos verificando tu correo electrónico..."
							: verificationStatus === "success"
								? "¡Tu correo ha sido verificado exitosamente!"
								: "Ha ocurrido un problema con la verificación"}
					</p>
				</div>

				<div className="bg-white rounded-xl shadow-card p-8 backdrop-filter backdrop-blur-md bg-opacity-80">
					{verificationStatus === "loading" && (
						<div className="text-center py-8">
							<div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mb-4"></div>
							<p className="text-gray-700">
								Verificando tu correo electrónico...
							</p>
						</div>
					)}

					{verificationStatus === "success" && (
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
								¡Verificación Exitosa!
							</h3>
							<p className="text-gray-600 mb-6">
								Tu cuenta ha sido verificada correctamente. Ahora puedes
								disfrutar de todos los beneficios de CONSTRU.
							</p>
							<p className="text-sm text-gray-500 mb-4">
								Serás redirigido automáticamente en {countdown} segundos...
							</p>
							<Link
								to="/"
								className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 flex items-center justify-center"
							>
								Ir al Inicio
							</Link>
						</div>
					)}

					{verificationStatus === "error" && (
						<div className="text-center animate-fade-in">
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
							<h3 className="text-xl font-semibold mb-2 text-gray-800">
								Verificación Fallida
							</h3>
							<p className="text-gray-600 mb-6">
								{errorMessage ||
									"No pudimos verificar tu correo electrónico. El enlace puede haber expirado o ser inválido."}
							</p>
							<div className="flex flex-col space-y-3">
								<Link
									to="/login"
									className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 flex items-center justify-center"
								>
									Ir a Iniciar Sesión
								</Link>
								<Link
									to="/contact"
									className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
								>
									Contactar Soporte
								</Link>
							</div>
						</div>
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

        .animate-fade-in {
          animation: fade-in 0.4s ease-in-out;
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

export default EmailVerificationPage;
