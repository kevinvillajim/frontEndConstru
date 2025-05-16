// src/ui/pages/profile/PreferencesPage.tsx
import React, { useState, useEffect } from "react";
import { useTheme } from "../../hooks/useTheme";
import ToastService from "../../components/common/ToastService";

const PreferencesPage = () => {
	const {theme, setTheme} = useTheme();
	const [isLoading, setIsLoading] = useState(false);
	const [preferences, setPreferences] = useState({
		language: "es",
		currency: "USD",
		dateFormat: "dd/MM/yyyy",
		timeFormat: "24h",
		distanceUnit: "metric",
		notifications: {
			email: true,
			browser: true,
			mobile: false,
		},
	});

	useEffect(() => {
		// Cargar preferencias del usuario desde el backend
		// Por ahora usamos datos ficticios
	}, []);

	const handleChange = (field: string, value: unknown) => {
		setPreferences((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	// const handleNotificationChange = (channel: string, value: boolean) => {
	// 	setPreferences((prev) => ({
	// 		...prev,
	// 		notifications: {
	// 			...prev.notifications,
	// 			[channel]: value,
	// 		},
	// 	}));
	// };

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			// Simular una llamada a la API
			await new Promise((resolve) => setTimeout(resolve, 1000));

			ToastService.success("Preferencias actualizadas correctamente");
		} catch (error) {
			console.error("Error al actualizar preferencias:", error);
			ToastService.error("Error al actualizar las preferencias");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div>
			<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
				Preferencias
			</h2>

			<form onSubmit={handleSubmit} className="space-y-8">
				{/* Interfaz y Apariencia */}
				<div>
					<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
						Interfaz y Apariencia
					</h3>
					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Tema
							</label>
							<div className="flex space-x-4">
								<button
									type="button"
									onClick={() => setTheme("light")}
									className={`px-4 py-2 rounded-lg border ${
										theme === "light"
											? "bg-primary-50 dark:bg-primary-900/30 border-primary-500 dark:border-primary-500 text-primary-700 dark:text-primary-300"
											: "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
									}`}
								>
									Claro
								</button>
								<button
									type="button"
									onClick={() => setTheme("dark")}
									className={`px-4 py-2 rounded-lg border ${
										theme === "dark"
											? "bg-primary-50 dark:bg-primary-900/30 border-primary-500 dark:border-primary-500 text-primary-700 dark:text-primary-300"
											: "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
									}`}
								>
									Oscuro
								</button>
								<button
									type="button"
									onClick={() =>
										setTheme(
											window.matchMedia("(prefers-color-scheme: dark)").matches
												? "dark"
												: "light"
										)
									}
									className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
								>
									Sistema
								</button>
							</div>
						</div>

						<div>
							<label
								htmlFor="language"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
							>
								Idioma
							</label>
							<select
								id="language"
								value={preferences.language}
								onChange={(e) => handleChange("language", e.target.value)}
								className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
							>
								<option value="es">Español</option>
								<option value="en">English</option>
								<option value="pt">Português</option>
							</select>
						</div>
					</div>
				</div>

				{/* Formato y Unidades */}
				<div>
					<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
						Formato y Unidades
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label
								htmlFor="currency"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
							>
								Moneda
							</label>
							<select
								id="currency"
								value={preferences.currency}
								onChange={(e) => handleChange("currency", e.target.value)}
								className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
							>
								<option value="USD">Dólar estadounidense (USD)</option>
								<option value="EUR">Euro (EUR)</option>
								<option value="GBP">Libra esterlina (GBP)</option>
							</select>
						</div>

						<div>
							<label
								htmlFor="dateFormat"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
							>
								Formato de Fecha
							</label>
							<select
								id="dateFormat"
								value={preferences.dateFormat}
								onChange={(e) => handleChange("dateFormat", e.target.value)}
								className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
							>
								<option value="dd/MM/yyyy">DD/MM/AAAA</option>
								<option value="MM/dd/yyyy">MM/DD/AAAA</option>
								<option value="yyyy-MM-dd">AAAA-MM-DD</option>
							</select>
						</div>

						<div>
							<label
								htmlFor="timeFormat"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
							>
								Formato de Hora
							</label>
							<select
								id="timeFormat"
								value={preferences.timeFormat}
								onChange={(e) => handleChange("timeFormat", e.target.value)}
								className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
							>
								<option value="12h">12 horas (AM/PM)</option>
								<option value="24h">24 horas</option>
							</select>
						</div>

						<div>
							<label
								htmlFor="distanceUnit"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
							>
								Sistema de Medidas
							</label>
							<select
								id="distanceUnit"
								value={preferences.distanceUnit}
								onChange={(e) => handleChange("distanceUnit", e.target.value)}
								className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
							>
								<option value="metric">Métrico (m, kg, etc.)</option>
								<option value="imperial">Imperial (pies, libras, etc.)</option>
							</select>
						</div>
					</div>
				</div>

				{/* Accesibilidad */}
				<div>
					<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
						Accesibilidad
					</h3>
					<div className="space-y-4">
						<div className="flex items-center">
							<input
								id="reducedMotion"
								type="checkbox"
								className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
							/>
							<label
								htmlFor="reducedMotion"
								className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
							>
								Reducir movimiento (evitar animaciones)
							</label>
						</div>
						<div className="flex items-center">
							<input
								id="highContrast"
								type="checkbox"
								className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
							/>
							<label
								htmlFor="highContrast"
								className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
							>
								Alto contraste
							</label>
						</div>
						<div className="flex items-center">
							<input
								id="largeText"
								type="checkbox"
								className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
							/>
							<label
								htmlFor="largeText"
								className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
							>
								Texto grande
							</label>
						</div>
					</div>
				</div>

				{/* Botones de acción */}
				<div className="flex justify-end">
					<button
						type="button"
						className="mr-3 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
					>
						Restablecer Valores Predeterminados
					</button>
					<button
						type="submit"
						disabled={isLoading}
						className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 flex items-center"
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
								Guardando...
							</>
						) : (
							"Guardar Preferencias"
						)}
					</button>
				</div>
			</form>
		</div>
	);
};

export default PreferencesPage;