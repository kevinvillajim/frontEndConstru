// src/ui/pages/profile/SecurityPage.tsx
import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useAuth} from "../../context/AuthContext";
import ToastService from "../../components/common/ToastService";
import {
	ShieldCheckIcon,
	KeyIcon,
	EyeIcon,
	EyeSlashIcon,
} from "@heroicons/react/24/outline";

// Definir el esquema de validación con Zod
const changePasswordSchema = z
	.object({
		currentPassword: z.string().min(1, "La contraseña actual es requerida"),
		newPassword: z
			.string()
			.min(8, "La contraseña debe tener al menos 8 caracteres")
			.regex(/[A-Z]/, "Debe incluir al menos una mayúscula")
			.regex(/[0-9]/, "Debe incluir al menos un número"),
		confirmPassword: z.string().min(1, "Confirma tu nueva contraseña"),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Las contraseñas no coinciden",
		path: ["confirmPassword"],
	});

// Tipo para los valores del formulario
type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

const SecurityPage = () => {
	const {user, changePassword} = useAuth();
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [passwordStrength, setPasswordStrength] = useState(0);
	const [has2FAEnabled, setHas2FAEnabled] = useState(false);

	// Configurar react-hook-form con validación de Zod
	const {
		register,
		handleSubmit,
		watch,
		reset,
		formState: {errors},
	} = useForm<ChangePasswordFormValues>({
		resolver: zodResolver(changePasswordSchema),
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		},
	});

	const newPassword = watch("newPassword");

	// Effect para calcular la fortaleza de la contraseña
	useEffect(() => {
		if (!newPassword) {
			setPasswordStrength(0);
			return;
		}

		let strength = 0;

		// Longitud mínima
		if (newPassword.length >= 8) strength += 1;

		// Contiene mayúsculas
		if (/[A-Z]/.test(newPassword)) strength += 1;

		// Contiene minúsculas
		if (/[a-z]/.test(newPassword)) strength += 1;

		// Contiene números
		if (/[0-9]/.test(newPassword)) strength += 1;

		// Contiene caracteres especiales
		if (/[^A-Za-z0-9]/.test(newPassword)) strength += 1;

		setPasswordStrength(strength);
	}, [newPassword]);

	// Verificar si el usuario tiene 2FA habilitado
	useEffect(() => {
		// Aquí iría la llamada para verificar si el usuario tiene 2FA habilitado
		// Por ahora, establecemos un valor de ejemplo
		setHas2FAEnabled(false);
	}, []);

	// Manejar el cambio de contraseña
	const onSubmit = async (data: ChangePasswordFormValues) => {
		setIsLoading(true);

		try {
			// Simular operación de cambio de contraseña
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Aquí iría la llamada real al backend
			// await changePassword(data.currentPassword, data.newPassword);

			ToastService.success("Contraseña actualizada correctamente");
			reset(); // Limpiar el formulario después del éxito
		} catch (error) {
			console.error("Error al cambiar contraseña:", error);
			ToastService.error(
				"Error al cambiar la contraseña. Verifica que la contraseña actual sea correcta."
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div>
			<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
				Seguridad
			</h2>

			<div className="space-y-8">
				{/* Two-Factor Authentication Section */}
				<div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
					<div className="flex items-start">
						<div className="flex-shrink-0">
							<ShieldCheckIcon className="h-8 w-8 text-gray-500 dark:text-gray-400" />
						</div>
						<div className="ml-4 flex-1">
							<h3 className="text-lg font-medium text-gray-900 dark:text-white">
								Autenticación de Dos Factores (2FA)
							</h3>
							<p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
								Añade una capa extra de seguridad a tu cuenta. Cuando 2FA está
								habilitado, necesitarás tanto tu contraseña como un código
								temporal para iniciar sesión.
							</p>
							<div className="mt-4">
								{has2FAEnabled ? (
									<div className="flex items-center">
										<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 mr-3">
											Habilitado
										</span>
										<Link
											to="/profile/2fa-setup"
											className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
										>
											Configurar dispositivos
										</Link>
									</div>
								) : (
									<Link
										to="/profile/2fa-setup"
										className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
									>
										Habilitar 2FA
									</Link>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Change Password Section */}
				<div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
					<div className="flex items-start">
						<div className="flex-shrink-0">
							<KeyIcon className="h-8 w-8 text-gray-500 dark:text-gray-400" />
						</div>
						<div className="ml-4 flex-1">
							<h3 className="text-lg font-medium text-gray-900 dark:text-white">
								Cambiar Contraseña
							</h3>
							<p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
								Actualiza tu contraseña regularmente para mantener tu cuenta
								segura.
							</p>
							<form
								onSubmit={handleSubmit(onSubmit)}
								className="mt-4 space-y-4"
							>
								{/* Current Password */}
								<div>
									<label
										htmlFor="currentPassword"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300"
									>
										Contraseña Actual
									</label>
									<div className="mt-1 relative rounded-md shadow-sm">
										<input
											type={showCurrentPassword ? "text" : "password"}
											id="currentPassword"
											{...register("currentPassword")}
											className={`w-full px-4 py-2 rounded-lg border ${
												errors.currentPassword
													? "border-red-500 focus:ring-red-500 focus:border-red-500"
													: "border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
											} bg-white dark:bg-gray-700 text-gray-900 dark:text-white pr-10`}
										/>
										<button
											type="button"
											className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
											onClick={() =>
												setShowCurrentPassword(!showCurrentPassword)
											}
										>
											{showCurrentPassword ? (
												<EyeSlashIcon className="h-5 w-5" />
											) : (
												<EyeIcon className="h-5 w-5" />
											)}
										</button>
									</div>
									{errors.currentPassword && (
										<p className="mt-1 text-sm text-red-600 dark:text-red-400">
											{errors.currentPassword.message}
										</p>
									)}
								</div>

								{/* New Password */}
								<div>
									<label
										htmlFor="newPassword"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300"
									>
										Nueva Contraseña
									</label>
									<div className="mt-1 relative rounded-md shadow-sm">
										<input
											type={showNewPassword ? "text" : "password"}
											id="newPassword"
											{...register("newPassword")}
											className={`w-full px-4 py-2 rounded-lg border ${
												errors.newPassword
													? "border-red-500 focus:ring-red-500 focus:border-red-500"
													: "border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
											} bg-white dark:bg-gray-700 text-gray-900 dark:text-white pr-10`}
										/>
										<button
											type="button"
											className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
											onClick={() => setShowNewPassword(!showNewPassword)}
										>
											{showNewPassword ? (
												<EyeSlashIcon className="h-5 w-5" />
											) : (
												<EyeIcon className="h-5 w-5" />
											)}
										</button>
									</div>
									{errors.newPassword && (
										<p className="mt-1 text-sm text-red-600 dark:text-red-400">
											{errors.newPassword.message}
										</p>
									)}

									{/* Password Strength Indicator */}
									{newPassword && (
										<div className="mt-2">
											<div className="flex justify-between items-center mb-1">
												<span className="text-xs text-gray-500 dark:text-gray-400">
													Fortaleza de la contraseña
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
											<div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
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

								{/* Confirm Password */}
								<div>
									<label
										htmlFor="confirmPassword"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300"
									>
										Confirmar Nueva Contraseña
									</label>
									<div className="mt-1 relative rounded-md shadow-sm">
										<input
											type={showConfirmPassword ? "text" : "password"}
											id="confirmPassword"
											{...register("confirmPassword")}
											className={`w-full px-4 py-2 rounded-lg border ${
												errors.confirmPassword
													? "border-red-500 focus:ring-red-500 focus:border-red-500"
													: "border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
											} bg-white dark:bg-gray-700 text-gray-900 dark:text-white pr-10`}
										/>
										<button
											type="button"
											className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
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
										<p className="mt-1 text-sm text-red-600 dark:text-red-400">
											{errors.confirmPassword.message}
										</p>
									)}
								</div>

								<div className="pt-2">
									<button
										type="submit"
										disabled={isLoading}
										className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
									>
										{isLoading ? (
											<>
												<svg
													className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
												Actualizando...
											</>
										) : (
											"Cambiar Contraseña"
										)}
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>

				{/* Login Activity and Session Management */}
				<div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
					<h3 className="text-lg font-medium text-gray-900 dark:text-white">
						Actividad de Inicio de Sesión
					</h3>
					<p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
						Aquí puedes ver tu actividad reciente y gestionar tus sesiones
						activas.
					</p>
					<div className="mt-4">
						<h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
							Sesiones Activas
						</h4>
						<div className="mt-2 space-y-3">
							<div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
								<div className="flex items-center">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
										/>
									</svg>
									<div>
										<div className="text-sm font-medium text-gray-700 dark:text-gray-300">
											Navegador en este dispositivo
										</div>
										<div className="text-xs text-gray-500 dark:text-gray-400">
											Quito, Ecuador • {new Date().toLocaleDateString()}
										</div>
									</div>
								</div>
								<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
									Activa
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SecurityPage;
