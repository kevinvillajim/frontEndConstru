import {useState} from "react";
import {
	BellIcon,
	CheckIcon,
	XMarkIcon,
	Cog6ToothIcon,
	CalculatorIcon,
	CubeIcon,
	DocumentTextIcon,
	ExclamationTriangleIcon,
	InformationCircleIcon,
	CurrencyDollarIcon,
	ClockIcon,
	UserGroupIcon,
} from "@heroicons/react/24/outline";

// Tipos de notificaciones
const NOTIFICATION_TYPES = {
	PROJECT_UPDATE: "project_update",
	MATERIAL_REQUEST: "material_request",
	BUDGET_ALERT: "budget_alert",
	TASK_ASSIGNMENT: "task_assignment",
	CALCULATION_COMPLETE: "calculation_complete",
	PRICE_CHANGE: "price_change",
	SYSTEM_UPDATE: "system_update",
	REMINDER: "reminder",
};

// Iconos minimalistas para cada tipo
const getNotificationIcon = (type) => {
	const icons = {
		[NOTIFICATION_TYPES.PROJECT_UPDATE]: DocumentTextIcon,
		[NOTIFICATION_TYPES.MATERIAL_REQUEST]: CubeIcon,
		[NOTIFICATION_TYPES.BUDGET_ALERT]: CurrencyDollarIcon,
		[NOTIFICATION_TYPES.TASK_ASSIGNMENT]: UserGroupIcon,
		[NOTIFICATION_TYPES.CALCULATION_COMPLETE]: CalculatorIcon,
		[NOTIFICATION_TYPES.PRICE_CHANGE]: ExclamationTriangleIcon,
		[NOTIFICATION_TYPES.SYSTEM_UPDATE]: InformationCircleIcon,
		[NOTIFICATION_TYPES.REMINDER]: ClockIcon,
	};
	return icons[type] || BellIcon;
};

// Datos mock de notificaciones
const mockNotifications = [
	{
		id: "1",
		type: NOTIFICATION_TYPES.CALCULATION_COMPLETE,
		title: "Cálculo de estructura completado",
		message:
			"El cálculo de vigas para el Proyecto Torres del Norte ha sido finalizado.",
		isRead: false,
		createdAt: new Date(Date.now() - 30 * 60 * 1000),
		projectName: "Torres del Norte",
	},
	{
		id: "2",
		type: NOTIFICATION_TYPES.MATERIAL_REQUEST,
		title: "Solicitud de material aprobada",
		message:
			"Se ha aprobado la solicitud de 50 sacos de cemento para la fase de cimentación.",
		isRead: false,
		createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
		projectName: "Edificio Amazonas",
	},
	{
		id: "3",
		type: NOTIFICATION_TYPES.BUDGET_ALERT,
		title: "Alerta de presupuesto",
		message: "El proyecto ha alcanzado el 85% del presupuesto asignado.",
		isRead: true,
		createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
		projectName: "Residencial Los Pinos",
	},
	{
		id: "4",
		type: NOTIFICATION_TYPES.PRICE_CHANGE,
		title: "Cambio de precio detectado",
		message: "El precio del acero de refuerzo ha aumentado un 8%.",
		isRead: false,
		createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
	},
	{
		id: "5",
		type: NOTIFICATION_TYPES.TASK_ASSIGNMENT,
		title: "Nueva tarea asignada",
		message: "Supervisión de la instalación eléctrica en el segundo piso.",
		isRead: true,
		createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
		projectName: "Centro Comercial Plaza Sur",
	},
	{
		id: "6",
		type: NOTIFICATION_TYPES.SYSTEM_UPDATE,
		title: "Actualización del sistema",
		message: "Nueva versión disponible con mejoras en calculadoras sísmicas.",
		isRead: true,
		createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
	},
];

const NotificationsPage = () => {
	const [notifications, setNotifications] = useState(mockNotifications);
	const [filter, setFilter] = useState("unread");
	const [showPreferences, setShowPreferences] = useState(false);

	// Filtrar notificaciones
	const filteredNotifications = notifications.filter((notification) => {
		if (filter === "unread") return !notification.isRead;
		if (filter === "read") return notification.isRead;
		return true;
	});

	// Formatear tiempo relativo
	const formatTimeAgo = (date) => {
		const now = new Date();
		const diffMs = now - new Date(date);
		const diffMins = Math.floor(diffMs / (1000 * 60));
		const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
		const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

		if (diffMins < 60) return `${diffMins}m`;
		if (diffHours < 24) return `${diffHours}h`;
		return `${diffDays}d`;
	};

	// Marcar como leída
	const markAsRead = (id) => {
		setNotifications(
			notifications.map((n) => (n.id === id ? {...n, isRead: true} : n))
		);
	};

	// Marcar todas como leídas
	const markAllAsRead = () => {
		setNotifications(notifications.map((n) => ({...n, isRead: true})));
	};

	// Eliminar notificación
	const deleteNotification = (id) => {
		setNotifications(notifications.filter((n) => n.id !== id));
	};

	const unreadCount = notifications.filter((n) => !n.isRead).length;

	return (
		<div className="min-h-screen" style={{backgroundColor: "var(--bg-main)"}}>
			{/* Header minimalista */}
			<div
				className="border-b"
				style={{
					backgroundColor: "var(--bg-card)",
					borderColor: "var(--border-subtle)",
				}}
			>
				<div className="max-w-4xl mx-auto px-6 py-8">
					<div className="flex items-center justify-between">
						<div>
							<h1
								className="text-3xl font-light tracking-tight"
								style={{color: "var(--text-main)"}}
							>
								Notificaciones
							</h1>
							{unreadCount > 0 && (
								<p
									className="text-sm mt-1"
									style={{color: "var(--text-secondary)"}}
								>
									{unreadCount} nuevas notificaciones
								</p>
							)}
						</div>

						<div className="flex items-center space-x-6">
							{unreadCount > 0 && (
								<button
									onClick={markAllAsRead}
									className="text-sm transition-colors duration-200"
									style={{color: "var(--color-primary-600)"}}
								>
									Marcar todas como leídas
								</button>
							)}

							<button
								onClick={() => setShowPreferences(!showPreferences)}
								className="p-2 rounded-full transition-colors duration-200 hover:bg-primary-50"
								style={{color: "var(--text-secondary)"}}
							>
								<Cog6ToothIcon className="h-5 w-5" />
							</button>
						</div>
					</div>

					{/* Filtros elegantes */}
					<div className="flex items-center space-x-8 mt-8">
						{[
							{key: "unread", label: "Sin leer", count: unreadCount},
							{
								key: "read",
								label: "Leídas",
								count: notifications.filter((n) => n.isRead).length,
							},{key: "all", label: "Todas", count: notifications.length},
						].map(({key, label, count}) => (
							<button
								key={key}
								onClick={() => setFilter(key)}
								className={`pb-4 border-b-2 transition-all duration-300 ${
									filter === key
										? "border-primary-600 text-primary-600"
										: "border-transparent hover:border-gray-300"
								}`}
								style={{
									color:
										filter === key
											? "var(--color-primary-600)"
											: "var(--text-secondary)",
								}}
							>
								<span className="font-medium">{label}</span>
								<span className="ml-2 text-xs opacity-60">({count})</span>
							</button>
						))}
					</div>
				</div>
			</div>

			<div className="max-w-4xl mx-auto px-6 py-8">
				<div className="flex gap-8">
					{/* Lista principal de notificaciones */}
					<div className="flex-1">
						{filteredNotifications.length === 0 ? (
							<div className="text-center py-16">
								<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
									<BellIcon className="h-8 w-8 text-gray-400" />
								</div>
								<h3
									className="text-lg font-medium mb-2"
									style={{color: "var(--text-main)"}}
								>
									{filter === "unread"
										? "Todo al día"
										: filter === "read"
											? "Sin notificaciones leídas"
											: "Sin notificaciones"}
								</h3>
								<p className="text-sm" style={{color: "var(--text-secondary)"}}>
									{filter === "unread"
										? "No tienes notificaciones pendientes"
										: "Las notificaciones aparecerán aquí"}
								</p>
							</div>
						) : (
							<div className="space-y-1">
								{filteredNotifications.map((notification) => {
									const IconComponent = getNotificationIcon(notification.type);

									return (
										<div
											key={notification.id}
											className={`group flex items-start space-x-4 p-6 rounded-lg transition-all duration-200 hover:bg-gray-100 ${
												!notification.isRead ? "bg-blue-50/30" : ""
											}`}
											style={{
												backgroundColor: !notification.isRead
													? "rgba(96, 125, 139, 0.05)"
													: "transparent",
											}}
										>
											{/* Indicador de no leída */}
											<div className="flex-shrink-0 w-2 pt-2">
												{!notification.isRead && (
													<div className="w-2 h-2 bg-primary-500 rounded-full"></div>
												)}
											</div>

											{/* Icono minimalista */}
											<div className="flex-shrink-0 pt-1">
												<IconComponent
													className="h-5 w-5"
													style={{color: "var(--text-muted)"}}
												/>
											</div>

											{/* Contenido */}
											<div className="flex-1 min-w-0">
												<div className="flex items-start justify-between">
													<div className="flex-1">
														<h4
															className={`font-medium leading-snug ${
																notification.isRead
																	? "text-gray-700"
																	: "text-gray-900"
															}`}
															style={{color: "var(--text-main)"}}
														>
															{notification.title}
														</h4>

														{notification.projectName && (
															<p
																className="text-xs font-medium mt-1"
																style={{color: "var(--color-primary-600)"}}
															>
																{notification.projectName}
															</p>
														)}

														<p
															className={`text-sm mt-2 leading-relaxed ${
																notification.isRead
																	? "text-gray-600"
																	: "text-gray-700"
															}`}
															style={{color: "var(--text-secondary)"}}
														>
															{notification.message}
														</p>
													</div>

													{/* Acciones */}
													<div className="flex items-center space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
														<span
															className="text-xs"
															style={{color: "var(--text-muted)"}}
														>
															{formatTimeAgo(notification.createdAt)}
														</span>

														{!notification.isRead && (
															<button
																onClick={() => markAsRead(notification.id)}
																className="p-1.5 rounded-md hover:bg-gray-200 transition-colors duration-200"
																title="Marcar como leída"
															>
																<CheckIcon
																	className="h-4 w-4"
																	style={{color: "var(--text-muted)"}}
																/>
															</button>
														)}

														<button
															onClick={() =>
																deleteNotification(notification.id)
															}
															className="p-1.5 rounded-md hover:bg-red-100 transition-colors duration-200"
															title="Eliminar"
														>
															<XMarkIcon className="h-4 w-4 text-red-500" />
														</button>
													</div>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						)}
					</div>

					{/* Panel de preferencias minimalista */}
					{showPreferences && (
						<div className="w-80 animate-fade-in">
							<div
								className="border rounded-lg p-6 sticky top-6"
								style={{
									backgroundColor: "var(--bg-card)",
									borderColor: "var(--border-subtle)",
								}}
							>
								<h3
									className="text-lg font-medium mb-6"
									style={{color: "var(--text-main)"}}
								>
									Preferencias
								</h3>

								<div className="space-y-6">
									<div>
										<h4
											className="text-sm font-medium mb-4"
											style={{color: "var(--text-main)"}}
										>
											Canales de entrega
										</h4>
										<div className="space-y-3">
											{[
												{
													key: "email",
													label: "Correo electrónico",
													checked: true,
												},
												{
													key: "push",
													label: "Notificaciones push",
													checked: true,
												},
												{key: "sms", label: "SMS", checked: false},
											].map(({key, label, checked}) => (
												<label key={key} className="flex items-center">
													<input
														type="checkbox"
														defaultChecked={checked}
														className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500 accent-secondary-500"
													/>
													<span
														className="ml-3 text-sm"
														style={{color: "var(--text-main)"}}
													>
														{label}
													</span>
												</label>
											))}
										</div>
									</div>

									<div
										className="border-t pt-6"
										style={{borderColor: "var(--border-subtle)"}}
									>
										<h4
											className="text-sm font-medium mb-4"
											style={{color: "var(--text-main)"}}
										>
											Tipos de notificación
										</h4>
										<div className="space-y-3">
											{[
												{
													key: "projects",
													label: "Actualizaciones de proyecto",
													checked: true,
												},
												{
													key: "materials",
													label: "Solicitudes de material",
													checked: true,
												},
												{
													key: "budget",
													label: "Alertas de presupuesto",
													checked: true,
												},
												{
													key: "prices",
													label: "Cambios de precios",
													checked: false,
												},
											].map(({key, label, checked}) => (
												<label key={key} className="flex items-center">
													<input
														type="checkbox"
														defaultChecked={checked}
														className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500 accent-secondary-500"
													/>
													<span
														className="ml-3 text-sm"
														style={{color: "var(--text-main)"}}
													>
														{label}
													</span>
												</label>
											))}
										</div>
									</div>

									<button className="w-full bg-primary-600 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-primary-700">
										Guardar cambios
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			<style>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Transiciones suaves */
        * {
          transition-property: color, background-color, border-color, opacity, transform;
        }

        /* Hover states elegantes */
        .group:hover .opacity-0 {
          opacity: 1;
        }

        /* Focus states para accesibilidad */
        button:focus,
        input:focus {
          outline: 2px solid var(--color-primary-500);
          outline-offset: 2px;
        }
      `}</style>
		</div>
	);
};

export default NotificationsPage;
