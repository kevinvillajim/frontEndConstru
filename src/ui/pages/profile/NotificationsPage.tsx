// src/ui/pages/profile/NotificationsPage.tsx
import React, {useState, useEffect} from "react";
import {BellIcon, InformationCircleIcon} from "@heroicons/react/24/outline";
import {useUserProfile} from "../../context/UserProfileContext";
import ToastService from "../../components/common/ToastService";

const NotificationsPage = () => {
	const {
		profile,
		updateNotificationPreferences,
		isLoading: profileLoading,
	} = useUserProfile();
	const [isLoading, setIsLoading] = useState(false);
	const [settings, setSettings] = useState({
		email: true,
		push: true,
		sms: false,
		projectUpdates: true,
		materialRecommendations: true,
		pricingAlerts: true,
		weeklyReports: true,
		systemAnnouncements: true,
		marketingEmails: false,
	});

	// Cargar preferencias de notificaciones cuando el perfil se carga
	useEffect(() => {
		if (profile && profile.preferences && profile.preferences.notifications) {
			const notifications = profile.preferences.notifications;
			setSettings({
				email: notifications.email ?? true,
				push: notifications.push ?? true,
				sms: notifications.sms ?? false,
				projectUpdates: notifications.projectUpdates ?? true,
				materialRecommendations: notifications.materialRecommendations ?? true,
				pricingAlerts: notifications.pricingAlerts ?? true,
				weeklyReports: notifications.weeklyReports ?? true,
				systemAnnouncements: notifications.systemAnnouncements ?? true,
				marketingEmails: notifications.marketingEmails ?? false,
			});
		}
	}, [profile]);

	const handleChange = (field: string, value: boolean) => {
		setSettings((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			await updateNotificationPreferences(settings);
			ToastService.success(
				"Preferencias de notificaciones actualizadas correctamente"
			);
		} catch (error) {
			console.error(
				"Error al actualizar preferencias de notificaciones:",
				error
			);
			ToastService.error(
				"Error al actualizar las preferencias de notificaciones"
			);
		} finally {
			setIsLoading(false);
		}
	};

	if (profileLoading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
			</div>
		);
	}

	return (
		<div>
			<h2 className="text-2xl font-bold text-gray-900 mb-6">
				Preferencias de Notificaciones
			</h2>

			<form onSubmit={handleSubmit} className="space-y-8">
				{/* Canales de Notificación */}
				<div>
					<h3 className="text-lg font-medium text-gray-900 mb-4">
						Canales de Notificación
					</h3>
					<p className="text-sm text-gray-500 mb-4">
						Selecciona cómo quieres recibir las notificaciones
					</p>
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<div className="flex items-center">
								<BellIcon className="h-5 w-5 text-gray-500 mr-3" />
								<label
									htmlFor="email"
									className="text-sm text-gray-700"
								>
									Correo electrónico
								</label>
							</div>
							<div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
								<input
									type="checkbox"
									id="email"
									checked={settings.email}
									onChange={(e) => handleChange("email", e.target.checked)}
									className="sr-only"
								/>
								<span
									className={`block w-12 h-6 rounded-full ${
										settings.email
											? "bg-primary-600"
											: "bg-gray-300"
									}`}
								></span>
								<span
									className={`absolute left-1 top-1 block w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out ${
										settings.email ? "transform translate-x-6" : ""
									}`}
								></span>
							</div>
						</div>

						<div className="flex items-center justify-between">
							<div className="flex items-center">
								<BellIcon className="h-5 w-5 text-gray-500" />
								<label
									htmlFor="push"
									className="text-sm text-gray-700"
								>
									Notificaciones push (navegador)
								</label>
							</div>
							<div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
								<input
									type="checkbox"
									id="push"
									checked={settings.push}
									onChange={(e) => handleChange("push", e.target.checked)}
									className="sr-only"
								/>
								<span
									className={`block w-12 h-6 rounded-full ${
										settings.push
											? "bg-primary-600"
											: "bg-gray-300"
									}`}
								></span>
								<span
									className={`absolute left-1 top-1 block w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out ${
										settings.push ? "transform translate-x-6" : ""
									}`}
								></span>
							</div>
						</div>

						<div className="flex items-center justify-between">
							<div className="flex items-center">
								<BellIcon className="h-5 w-5 text-gray-500 mr-3" />
								<label
									htmlFor="sms"
									className="text-sm text-gray-700"
								>
									SMS
								</label>
							</div>
							<div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
								<input
									type="checkbox"
									id="sms"
									checked={settings.sms}
									onChange={(e) => handleChange("sms", e.target.checked)}
									className="sr-only"
								/>
								<span
									className={`block w-12 h-6 rounded-full ${
										settings.sms
											? "bg-primary-600"
											: "bg-gray-300"
									}`}
								></span>
								<span
									className={`absolute left-1 top-1 block w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out ${
										settings.sms ? "transform translate-x-6" : ""
									}`}
								></span>
							</div>
						</div>
					</div>
				</div>

				{/* Tipos de Notificaciones */}
				<div>
					<h3 className="text-lg font-medium text-gray-900 mb-4">
						Tipos de Notificaciones
					</h3>
					<div className="bg-primary-50 p-4 rounded-lg flex items-start mb-4">
						<InformationCircleIcon className="h-5 w-5 text-primary-600 mt-0.5 mr-2 flex-shrink-0" />
						<p className="text-sm">
							Las notificaciones críticas relacionadas con tu cuenta, seguridad
							y transacciones siempre serán enviadas independientemente de esta
							configuración.
						</p>
					</div>
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<div>
								<h4 className="text-sm font-medium text-gray-700">
									Actualizaciones de Proyectos
								</h4>
								<p className="text-xs text-gray-500 mt-1">
									Notificaciones sobre cambios, asignaciones y fechas límite en
									tus proyectos
								</p>
							</div>
							<div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
								<input
									type="checkbox"
									id="projectUpdates"
									checked={settings.projectUpdates}
									onChange={(e) =>
										handleChange("projectUpdates", e.target.checked)
									}
									className="sr-only"
								/>
								<span
									className={`block w-12 h-6 rounded-full ${
										settings.projectUpdates
											? "bg-primary-600"
											: "bg-gray-300"
									}`}
								></span>
								<span
									className={`absolute left-1 top-1 block w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out ${
										settings.projectUpdates ? "transform translate-x-6" : ""
									}`}
								></span>
							</div>
						</div>

						<div className="flex items-center justify-between">
							<div>
								<h4 className="text-sm font-medium text-gray-700">
									Recomendaciones de Materiales
								</h4>
								<p className="text-xs text-gray-500 mt-1">
									Recibe recomendaciones personalizadas de materiales basadas en
									tus proyectos
								</p>
							</div>
							<div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
								<input
									type="checkbox"
									id="materialRecommendations"
									checked={settings.materialRecommendations}
									onChange={(e) =>
										handleChange("materialRecommendations", e.target.checked)
									}
									className="sr-only"
								/>
								<span
									className={`block w-12 h-6 rounded-full ${
										settings.materialRecommendations
											? "bg-primary-600"
											: "bg-gray-300"
									}`}
								></span>
								<span
									className={`absolute left-1 top-1 block w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out ${
										settings.materialRecommendations
											? "transform translate-x-6"
											: ""
									}`}
								></span>
							</div>
						</div>

						<div className="flex items-center justify-between">
							<div>
								<h4 className="text-sm font-medium text-gray-700">
									Alertas de Precios
								</h4>
								<p className="text-xs text-gray-500 mt-1">
									Notificaciones sobre cambios significativos en precios de
									materiales
								</p>
							</div>
							<div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
								<input
									type="checkbox"
									id="pricingAlerts"
									checked={settings.pricingAlerts}
									onChange={(e) =>
										handleChange("pricingAlerts", e.target.checked)
									}
									className="sr-only"
								/>
								<span
									className={`block w-12 h-6 rounded-full ${
										settings.pricingAlerts
											? "bg-primary-600"
											: "bg-gray-300"
									}`}
								></span>
								<span
									className={`absolute left-1 top-1 block w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out ${
										settings.pricingAlerts ? "transform translate-x-6" : ""
									}`}
								></span>
							</div>
						</div>

						<div className="flex items-center justify-between">
							<div>
								<h4 className="text-sm font-medium text-gray-700">
									Informes Semanales
								</h4>
								<p className="text-xs text-gray-500 mt-1">
									Recibe un resumen semanal del progreso de tus proyectos
								</p>
							</div>
							<div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
								<input
									type="checkbox"
									id="weeklyReports"
									checked={settings.weeklyReports}
									onChange={(e) =>
										handleChange("weeklyReports", e.target.checked)
									}
									className="sr-only"
								/>
								<span
									className={`block w-12 h-6 rounded-full ${
										settings.weeklyReports
											? "bg-primary-600"
											: "bg-gray-300"
									}`}
								></span>
								<span
									className={`absolute left-1 top-1 block w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out ${
										settings.weeklyReports ? "transform translate-x-6" : ""
									}`}
								></span>
							</div>
						</div>

						<div className="flex items-center justify-between">
							<div>
								<h4 className="text-sm font-medium text-gray-700">
									Anuncios del Sistema
								</h4>
								<p className="text-xs text-gray-500 mt-1">
									Actualizaciones importantes sobre CONSTRU, nuevas
									funcionalidades y mantenimiento
								</p>
							</div>
							<div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
								<input
									type="checkbox"
									id="systemAnnouncements"
									checked={settings.systemAnnouncements}
									onChange={(e) =>
										handleChange("systemAnnouncements", e.target.checked)
									}
									className="sr-only"
								/>
								<span
									className={`block w-12 h-6 rounded-full ${
										settings.systemAnnouncements
											? "bg-primary-600"
											: "bg-gray-300"
									}`}
								></span>
								<span
									className={`absolute left-1 top-1 block w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out ${
										settings.systemAnnouncements
											? "transform translate-x-6"
											: ""
									}`}
								></span>
							</div>
						</div>

						<div className="flex items-center justify-between">
							<div>
								<h4 className="text-sm font-medium text-gray-700">
									Correos de Marketing
								</h4>
								<p className="text-xs text-gray-500 mt-1">
									Promociones, ofertas especiales y novedades sobre CONSTRU
								</p>
							</div>
							<div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
								<input
									type="checkbox"
									id="marketingEmails"
									checked={settings.marketingEmails}
									onChange={(e) =>
										handleChange("marketingEmails", e.target.checked)
									}
									className="sr-only"
								/>
								<span
									className={`block w-12 h-6 rounded-full ${
										settings.marketingEmails
											? "bg-primary-600"
											: "bg-gray-300"
									}`}
								></span>
								<span
									className={`absolute left-1 top-1 block w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out ${
										settings.marketingEmails ? "transform translate-x-6" : ""
									}`}
								></span>
							</div>
						</div>
					</div>
				</div>

				{/* Frecuencia de Notificaciones */}
				<div>
					<h3 className="text-lg font-medium text-gray-900 mb-4">
						Frecuencia de Notificaciones
					</h3>
					<div className="space-y-3">
						<div className="flex items-center">
							<input
								id="immediate"
								type="radio"
								name="frequency"
								defaultChecked
								className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500 accent-secondary-500"
							/>
							<label
								htmlFor="immediate"
								className="ml-2 block text-sm text-gray-700"
							>
								Inmediata (recibe cada notificación cuando ocurre)
							</label>
						</div>
						<div className="flex items-center">
							<input
								id="daily"
								type="radio"
								name="frequency"
								className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500 accent-secondary-500"
							/>
							<label
								htmlFor="daily"
								className="ml-2 block text-sm text-gray-700"
							>
								Resumen diario (una vez al día)
							</label>
						</div>
						<div className="flex items-center">
							<input
								id="weekly"
								type="radio"
								name="frequency"
								className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500 accent-secondary-500"
							/>
							<label
								htmlFor="weekly"
								className="ml-2 block text-sm text-gray-700"
							>
								Resumen semanal (una vez por semana)
							</label>
						</div>
					</div>
				</div>

				{/* Botones de acción */}
				<div className="flex justify-end">
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

export default NotificationsPage;
