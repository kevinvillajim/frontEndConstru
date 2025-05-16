import React, {useState, useEffect} from "react";
import {Link, useParams, useNavigate} from "react-router-dom";
import axios from "axios";
import endpoints from "../../../utils/endpoints";

/**
 * Página de verificación de correo electrónico
 */
const EmailVerificationPage: React.FC = () => {
	const {token} = useParams<{token: string}>();
	const navigate = useNavigate();

	const [status, setStatus] = useState<"loading" | "success" | "error">(
		"loading"
	);
	const [message, setMessage] = useState("");
	const [countdown, setCountdown] = useState(3);

	// Efecto para verificar el token
	useEffect(() => {
		const verifyToken = async () => {
			// Validar que exista el token
			if (!token) {
				setStatus("error");
				setMessage("No se encontró el token de verificación en la URL.");
				return;
			}

			try {
				console.log("Verificando token:", token);
				const response = await axios.get(endpoints.auth.verifyEmail(token), {
					timeout: 10000,
				});

				console.log("Respuesta del servidor:", response.data);

				// Verificar si la respuesta es exitosa
				if (response.data && response.data.success === true) {
					setStatus("success");
					setMessage("Tu cuenta ha sido verificada correctamente.");
				} else {
					setStatus("error");
					setMessage(
						response.data?.message ||
							"No se pudo verificar tu correo electrónico."
					);
				}
			} catch (error) {
				console.error("Error durante la verificación:", error);
				setStatus("error");

				if (axios.isAxiosError(error)) {
					if (!error.response) {
						setMessage(
							"Error de conexión. Por favor, verifica tu internet y vuelve a intentarlo."
						);
					} else if (error.response.status === 404) {
						setMessage("El enlace de verificación ha expirado o no es válido.");
					} else {
						setMessage(
							error.response.data?.message ||
								"Error al verificar tu correo electrónico."
						);
					}
				} else {
					setMessage(
						"Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde."
					);
				}
			}
		};

		verifyToken();
	}, [token]);

	// Efecto para la cuenta regresiva
	useEffect(() => {
		let intervalId: NodeJS.Timeout;

		if (status === "success" && countdown > 0) {
			intervalId = setInterval(() => {
				setCountdown((prevCount) => prevCount - 1);
			}, 1000);
		} else if (status === "success" && countdown === 0) {
			// Redirigir cuando el contador llega a 0
			navigate("/login");
		}

		return () => {
			if (intervalId) clearInterval(intervalId);
		};
	}, [status, countdown, navigate]);

	// Render según el estado
	const renderContent = () => {
		switch (status) {
			case "loading":
				return (
					<div className="text-center py-8">
						<div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mb-4"></div>
						<p className="text-gray-700">
							Verificando tu correo electrónico...
						</p>
					</div>
				);

			case "success":
				return (
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
						<p className="text-gray-600 mb-6">{message}</p>
						<p className="text-sm text-gray-500 mb-4">
							Serás redirigido automáticamente en {countdown} segundos...
						</p>
						<Link
							to="/login"
							className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 flex items-center justify-center"
						>
							Ir a Iniciar Sesión
						</Link>
					</div>
				);

			case "error":
				return (
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
						<p className="text-gray-600 mb-6">{message}</p>
						<div className="flex flex-col space-y-3">
							<Link
								to="/login"
								className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 flex items-center justify-center"
							>
								Ir a Iniciar Sesión
							</Link>
							<button
								onClick={() => window.location.reload()}
								className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
							>
								Intentar nuevamente
							</button>
							<Link
								to="/contact"
								className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
							>
								Contactar Soporte
							</Link>
						</div>
					</div>
				);

			default:
				return null;
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4 sm:px-6 lg:px-8">
			<div className="w-full max-w-md animate-fade-in">
				<div className="text-center mb-8">
					<h2 className="text-3xl font-bold mb-2 text-primary-700">
						Verificación de Correo
					</h2>
					<p className="text-gray-600">
						{status === "loading"
							? "Estamos verificando tu correo electrónico..."
							: status === "success"
								? "¡Tu correo ha sido verificado exitosamente!"
								: "Ha ocurrido un problema con la verificación"}
					</p>
				</div>

				<div className="bg-white rounded-xl shadow-card p-8 backdrop-filter backdrop-blur-md bg-opacity-80">
					{renderContent()}
				</div>

				{/* Decoración arquitectónica */}
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
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fade-in {
          animation: fade-in 0.4s ease-in-out;
        }
        
        .shadow-card {
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
        }
      `}</style>
		</div>
	);
};

export default EmailVerificationPage;
