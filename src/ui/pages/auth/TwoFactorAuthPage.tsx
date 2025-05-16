import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {
	ArrowLeftIcon,
	ClipboardDocumentIcon,
	CheckCircleIcon,
	ShieldCheckIcon,
	ExclamationCircleIcon,
	LockClosedIcon,
} from "@heroicons/react/24/outline";
import {useAuth} from "../../context/AuthContext";

type SetupStep = 
	| "initial"
	| "setup"
	| "verify"
	| "recovery"
	| "complete"
	| "disable";

const SetupStep = {
	INITIAL: "initial" as SetupStep,
	SETUP: "setup" as SetupStep,
	VERIFY: "verify" as SetupStep,
	RECOVERY: "recovery" as SetupStep,
	COMPLETE: "complete" as SetupStep,
	DISABLE: "disable" as SetupStep,
};

const TwoFactorAuthPage = () => {
	const {user} = useAuth();
	const navigate = useNavigate();

	// States for the component
	const [currentStep, setCurrentStep] = useState<SetupStep>(SetupStep.INITIAL);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// 2FA setup states
	const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
	const [secret, setSecret] = useState<string>("");
	const [verificationCode, setVerificationCode] = useState<string>("");
	const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
	const [isEnabled, setIsEnabled] = useState<boolean>(false);
	const [copiedCodes, setCopiedCodes] = useState<boolean>(false);
	const [disablePassword, setDisablePassword] = useState<string>("");

	// Check if 2FA is already enabled on component mount
	useEffect(() => {
		// This would typically be determined from the user's profile
		// For now, we'll just check if the user has 2FA enabled in their profile
		if (user?.twoFactorEnabled) {
			setIsEnabled(true);
		}
	}, [user]);

	// Function to start the 2FA setup process
	const startSetup = async () => {
		setIsLoading(true);
		setError(null);

		try {
			// API call to get QR code and secret
			const response = await fetch("/api/auth/2fa/setup", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			});

			const data = await response.json();

			if (data.success) {
				setQrCodeUrl(data.data.qrCodeUrl);
				setSecret(data.data.secret);
				setCurrentStep(SetupStep.SETUP);
			} else {
				setError(data.message || "Error al iniciar configuración de 2FA");
			}
		} catch (err) {
			console.error("Error al iniciar configuración de 2FA:", err);
			setError("Error de conexión. Por favor, intenta de nuevo.");
		} finally {
			setIsLoading(false);
		}
	};

	// Function to verify the 2FA setup
	const verifySetup = async () => {
		if (!verificationCode || verificationCode.length !== 6) {
			setError("Por favor, ingresa un código de 6 dígitos");
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			// API call to verify the code
			const response = await fetch("/api/auth/2fa/verify", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({token: verificationCode}),
			});

			const data = await response.json();

			if (data.success) {
				setRecoveryCodes(data.data.recoveryCodes);
				setIsEnabled(true);
				setCurrentStep(SetupStep.RECOVERY);
			} else {
				setError(data.message || "Código de verificación incorrecto");
			}
		} catch (err) {
			console.error("Error al verificar código 2FA:", err);
			setError("Error de conexión. Por favor, intenta de nuevo.");
		} finally {
			setIsLoading(false);
		}
	};

	// Function to disable 2FA
	const disableTwoFactor = async () => {
		if (!disablePassword) {
			setError("Por favor, ingresa tu contraseña para desactivar 2FA");
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			// API call to disable 2FA
			const response = await fetch("/api/auth/2fa/disable", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({password: disablePassword}),
			});

			const data = await response.json();

			if (data.success) {
				setIsEnabled(false);
				setCurrentStep(SetupStep.INITIAL);
				setDisablePassword("");
			} else {
				setError(data.message || "Error al desactivar 2FA");
			}
		} catch (err) {
			console.error("Error al desactivar 2FA:", err);
			setError("Error de conexión. Por favor, intenta de nuevo.");
		} finally {
			setIsLoading(false);
		}
	};

	// Function to copy recovery codes to clipboard
	const copyRecoveryCodes = () => {
		navigator.clipboard
			.writeText(recoveryCodes.join("\n"))
			.then(() => {
				setCopiedCodes(true);
				setTimeout(() => setCopiedCodes(false), 3000);
			})
			.catch((err) => {
				console.error("Error al copiar códigos:", err);
				setError(
					"No se pudieron copiar los códigos. Por favor, cópialos manualmente."
				);
			});
	};

	// Render the initial step (2FA status)
	const renderInitialStep = () => (
		<div className="text-center">
			<div className="inline-block mb-6">
				{isEnabled ? (
					<div className="bg-green-100 p-4 rounded-full">
						<ShieldCheckIcon className="h-12 w-12 text-green-600" />
					</div>
				) : (
					<div className="bg-primary-50 p-4 rounded-full">
						<LockClosedIcon className="h-12 w-12 text-primary-600" />
					</div>
				)}
			</div>

			<h3 className="text-xl font-semibold mb-2 text-gray-800">
				{isEnabled
					? "Autenticación de dos factores está habilitada"
					: "Autenticación de dos factores no está habilitada"}
			</h3>

			<p className="text-gray-600 mb-6">
				{isEnabled
					? "Tu cuenta está protegida con autenticación de dos factores (2FA). Esto añade una capa adicional de seguridad a tu cuenta."
					: "La autenticación de dos factores añade una capa adicional de seguridad a tu cuenta solicitando un código temporal además de tu contraseña al iniciar sesión."}
			</p>

			{isEnabled ? (
				<button
					type="button"
					onClick={() => setCurrentStep(SetupStep.DISABLE)}
					className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 flex items-center justify-center"
				>
					Desactivar 2FA
				</button>
			) : (
				<button
					type="button"
					onClick={startSetup}
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
							<span>Configurando...</span>
						</div>
					) : (
						<span>Configurar Autenticación de Dos Factores</span>
					)}
				</button>
			)}

			<button
				type="button"
				onClick={() => navigate("/profile")}
				className="w-full mt-4 text-primary-600 hover:text-primary-700 font-medium py-2 transition-colors"
			>
				<span className="flex items-center justify-center">
					<ArrowLeftIcon className="h-4 w-4 mr-1" />
					Volver al Perfil
				</span>
			</button>
		</div>
	);

	// Render the setup step (QR code scanning)
	const renderSetupStep = () => (
		<div className="text-center">
			<h3 className="text-xl font-semibold mb-4 text-gray-800">
				Configura la Autenticación de Dos Factores
			</h3>

			<p className="text-gray-600 mb-6">
				Escanea el código QR con una aplicación de autenticación como Google
				Authenticator o Authy.
			</p>

			<div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 text-center">
				<img
					src={qrCodeUrl}
					alt="Código QR para autenticación de dos factores"
					className="mx-auto mb-4 w-56 h-56"
				/>

				<div className="mb-4">
					<p className="text-sm text-gray-500 mb-1">
						Si no puedes escanear el código QR, ingresa este código en tu
						aplicación:
					</p>
					<div className="bg-gray-100 p-2 rounded font-mono text-sm break-all">
						{secret}
					</div>
				</div>
			</div>

			<button
				type="button"
				onClick={() => setCurrentStep(SetupStep.VERIFY)}
				className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
			>
				Continuar
			</button>

			<button
				type="button"
				onClick={() => setCurrentStep(SetupStep.INITIAL)}
				className="w-full mt-4 text-primary-600 hover:text-primary-700 font-medium py-2 transition-colors"
			>
				Cancelar
			</button>
		</div>
	);

	// Render the verification step
	const renderVerifyStep = () => (
		<div className="text-center">
			<h3 className="text-xl font-semibold mb-4 text-gray-800">
				Verifica la Configuración
			</h3>

			<p className="text-gray-600 mb-6">
				Ingresa el código de 6 dígitos que aparece en tu aplicación de
				autenticación para verificar que la configuración es correcta.
			</p>

			<div className="mb-6">
				<label
					htmlFor="verificationCode"
					className="block mb-2 text-sm font-medium text-gray-700"
				>
					Código de Verificación
				</label>
				<input
					id="verificationCode"
					type="text"
					inputMode="numeric"
					pattern="[0-9]*"
					maxLength={6}
					value={verificationCode}
					onChange={(e) =>
						setVerificationCode(e.target.value.replace(/\D/g, ""))
					}
					className={`w-full px-4 py-3 rounded-lg border ${
						error
							? "border-red-500 focus:ring-red-500 focus:border-red-500"
							: "border-gray-300 focus:ring-primary-500 focus:border-primary-500"
					} bg-white text-gray-900 transition-all duration-300 focus:outline-none focus:ring-2 text-center text-2xl tracking-widest`}
					placeholder="000000"
				/>
				{error && (
					<p className="mt-1 text-sm text-red-600 animate-fade-in">{error}</p>
				)}
			</div>

			<button
				type="button"
				onClick={verifySetup}
				disabled={isLoading}
				className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
			>
				{isLoading ? (
					<div className="flex items-center justify-center">
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
						<span>Verificando...</span>
					</div>
				) : (
					<span>Verificar Código</span>
				)}
			</button>

			<button
				type="button"
				onClick={() => setCurrentStep(SetupStep.SETUP)}
				className="w-full mt-4 text-primary-600 hover:text-primary-700 font-medium py-2 transition-colors"
			>
				Volver
			</button>
		</div>
	);

	// Render the recovery codes step
	const renderRecoveryStep = () => (
		<div className="text-center">
			<div className="mb-6">
				<div className="inline-block rounded-full bg-green-100 p-3">
					<CheckCircleIcon className="h-8 w-8 text-green-600" />
				</div>
				<h3 className="text-xl font-semibold my-2 text-gray-800">
					¡2FA Activado Exitosamente!
				</h3>
				<p className="text-gray-600">
					Guarda estos códigos de recuperación en un lugar seguro. Podrás
					usarlos para acceder a tu cuenta si pierdes acceso a tu dispositivo de
					autenticación.
				</p>
			</div>

			<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
				<div className="flex justify-between items-center mb-2">
					<h4 className="text-sm font-semibold text-yellow-800">
						Códigos de recuperación
					</h4>
					<button
						type="button"
						onClick={copyRecoveryCodes}
						className="text-primary-600 hover:text-primary-700 focus:outline-none"
						title="Copiar códigos"
					>
						<div className="flex items-center">
							{copiedCodes ? (
								<>
									<CheckCircleIcon className="h-4 w-4 mr-1 text-green-500" />
									<span className="text-xs text-green-500">Copiado</span>
								</>
							) : (
								<>
									<ClipboardDocumentIcon className="h-4 w-4 mr-1" />
									<span className="text-xs">Copiar</span>
								</>
							)}
						</div>
					</button>
				</div>

				<div className="grid grid-cols-2 gap-2 text-sm font-mono">
					{recoveryCodes.map((code, index) => (
						<div
							key={index}
							className="bg-white px-2 py-1 rounded border border-gray-200"
						>
							{code}
						</div>
					))}
				</div>

				<div className="mt-3 flex items-start text-xs text-yellow-700">
					<ExclamationCircleIcon className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
					<p>
						Estos códigos solo se muestran una vez. Guárdalos en un lugar
						seguro. Cada código solo puede usarse una vez.
					</p>
				</div>
			</div>

			<button
				type="button"
				onClick={() => setCurrentStep(SetupStep.COMPLETE)}
				className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
			>
				He guardado mis códigos
			</button>
		</div>
	);

	// Render the complete step
	const renderCompleteStep = () => (
		<div className="text-center">
			<div className="inline-block mb-6">
				<div className="bg-green-100 p-4 rounded-full">
					<ShieldCheckIcon className="h-12 w-12 text-green-600" />
				</div>
			</div>

			<h3 className="text-xl font-semibold mb-2 text-gray-800">
				Configuración Completada
			</h3>

			<p className="text-gray-600 mb-6">
				Tu cuenta ahora está protegida con autenticación de dos factores. La
				próxima vez que inicies sesión, se te pedirá un código de autenticación
				además de tu contraseña.
			</p>

			<button
				type="button"
				onClick={() => navigate("/profile")}
				className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
			>
				Volver al Perfil
			</button>
		</div>
	);

	// Render the disable step
	const renderDisableStep = () => (
		<div>
			<h3 className="text-xl font-semibold mb-4 text-center text-gray-800">
				Desactivar Autenticación de Dos Factores
			</h3>

			<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
				<div className="flex items-start">
					<ExclamationCircleIcon className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
					<p className="text-yellow-700 text-sm">
						Al desactivar la autenticación de dos factores, tu cuenta será menos
						segura. Tendrás que volver a configurarla si deseas habilitarla
						nuevamente.
					</p>
				</div>
			</div>

			<div className="mb-6">
				<label
					htmlFor="disablePassword"
					className="block mb-2 text-sm font-medium text-gray-700"
				>
					Confirma tu Contraseña
				</label>
				<input
					id="disablePassword"
					type="password"
					value={disablePassword}
					onChange={(e) => setDisablePassword(e.target.value)}
					className={`w-full px-4 py-3 rounded-lg border ${
						error
							? "border-red-500 focus:ring-red-500 focus:border-red-500"
							: "border-gray-300 focus:ring-primary-500 focus:border-primary-500"
					} bg-white text-gray-900 transition-all duration-300 focus:outline-none focus:ring-2`}
					placeholder="••••••••"
				/>
				{error && (
					<p className="mt-1 text-sm text-red-600 animate-fade-in">{error}</p>
				)}
			</div>

			<button
				type="button"
				onClick={disableTwoFactor}
				disabled={isLoading}
				className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
			>
				{isLoading ? (
					<div className="flex items-center justify-center">
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
						<span>Desactivando...</span>
					</div>
				) : (
					<span>Desactivar Autenticación de Dos Factores</span>
				)}
			</button>

			<button
				type="button"
				onClick={() => setCurrentStep(SetupStep.INITIAL)}
				className="w-full mt-4 text-primary-600 hover:text-primary-700 font-medium py-2 transition-colors"
			>
				Cancelar
			</button>
		</div>
	);

	// Render the appropriate step based on current state
	const renderStep = () => {
		switch (currentStep) {
			case SetupStep.SETUP:
				return renderSetupStep();
			case SetupStep.VERIFY:
				return renderVerifyStep();
			case SetupStep.RECOVERY:
				return renderRecoveryStep();
			case SetupStep.COMPLETE:
				return renderCompleteStep();
			case SetupStep.DISABLE:
				return renderDisableStep();
			case SetupStep.INITIAL:
			default:
				return renderInitialStep();
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4 sm:px-6 lg:px-8">
			<div className="w-full max-w-md animate-fade-in">
				<div className="text-center mb-8">
					<h2 className="text-3xl font-bold mb-2 text-primary-700">
						Autenticación de Dos Factores
					</h2>
					<p className="text-gray-600">
						Protege tu cuenta con una capa adicional de seguridad
					</p>
				</div>

				<div className="bg-white rounded-xl shadow-card p-8 backdrop-filter backdrop-blur-md bg-opacity-80">
					{renderStep()}
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

export default TwoFactorAuthPage;
