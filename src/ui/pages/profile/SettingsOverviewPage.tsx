// src/ui/pages/profile/SettingsOverviewPage.tsx
import React, {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../../context/AuthContext";
import {useTheme} from "../../hooks/useTheme";
import {useUserProfile} from "../../context/UserProfileContext";
import {useUserSettings} from "../../hooks/useUserSettings";
import {
	UserCircleIcon,
	ShieldCheckIcon,
	BellIcon,
	CogIcon,
	BuildingOfficeIcon,
	StarIcon,
	GlobeAltIcon,
	DevicePhoneMobileIcon,
	CreditCardIcon,
	ChevronRightIcon,
	CheckCircleIcon,
	ExclamationTriangleIcon,
	ClockIcon,
	ArrowPathIcon,
	InformationCircleIcon,
} from "@heroicons/react/24/outline";

interface ConfigurationSection {
	id: string;
	title: string;
	description: string;
	icon: any;
	href: string;
	status: "complete" | "incomplete" | "attention";
	progress?: number;
	lastUpdated?: string;
	issues?: string[];
}

const SettingsOverviewPage = () => {
	const {user} = useAuth();
	const {theme} = useTheme(); // Usando tu implementación existente
	const {profile} = useUserProfile();
	const navigate = useNavigate();
	const {
		settingsStatus,
		overallProgress,
		isLoading,
		getTopIssues,
		getCompletionSummary,
		refreshStatus,
	} = useUserSettings();
	const [sections, setSections] = useState<ConfigurationSection[]>([]);

	useEffect(() => {
		if (settingsStatus) {
			const configSections: ConfigurationSection[] = [
				{
					id: "personal",
					title: "Información Personal",
					description: "Datos básicos, foto de perfil y contacto",
					icon: UserCircleIcon,
					href: "/profile/personal",
					status: settingsStatus.personal.complete ? "complete" : "incomplete",
					progress: settingsStatus.personal.progress,
					lastUpdated: profile?.updatedAt,
					issues: settingsStatus.personal.issues,
				},
				{
					id: "professional",
					title: "Información Profesional",
					description: "Experiencia, especialización y certificaciones",
					icon: BuildingOfficeIcon,
					href: "/profile/professional",
					status: settingsStatus.professional.complete ? "complete" : "incomplete",
					progress: settingsStatus.professional.progress,
					lastUpdated: profile?.professionalInfo?.updatedAt,
					issues: settingsStatus.professional.issues,
				},
				{
					id: "security",
					title: "Seguridad y Privacidad",
					description: "Contraseña, 2FA y configuraciones de seguridad",
					icon: ShieldCheckIcon,
					href: "/profile/security",
					status: settingsStatus.security.needsAttention 
						? "attention" 
						: settingsStatus.security.complete 
						? "complete" 
						: "incomplete",
					progress: settingsStatus.security.progress,
					lastUpdated: "2024-05-15",
					issues: settingsStatus.security.issues,
				},
				{
					id: "notifications",
					title: "Notificaciones",
					description: "Preferencias de comunicación y alertas",
					icon: BellIcon,
					href: "/profile/notifications",
					status: settingsStatus.notifications.complete ? "complete" : "incomplete",
					progress: settingsStatus.notifications.progress,
					lastUpdated: "2024-05-10",
					issues: settingsStatus.notifications.issues,
				},
				{
					id: "preferences",
					title: "Preferencias Generales",
					description: "Idioma, moneda, formato de fecha y accesibilidad",
					icon: GlobeAltIcon,
					href: "/profile/preferences",
					status: settingsStatus.preferences.complete ? "complete" : "incomplete",
					progress: settingsStatus.preferences.progress,
					lastUpdated: "2024-05-12",
					issues: settingsStatus.preferences.issues,
				},
				{
					id: "subscription",
					title: "Plan y Facturación",
					description: "Gestión de suscripción y métodos de pago",
					icon: CreditCardIcon,
					href: "/profile/subscription",
					status: settingsStatus.subscription.needsUpgrade 
						? "attention" 
						: settingsStatus.subscription.complete 
						? "complete" 
						: "incomplete",
					progress: settingsStatus.subscription.progress,
					lastUpdated: "2024-04-20",
					issues: settingsStatus.subscription.issues,
				},
				{
					id: "recommendations",
					title: "Recomendaciones y Analytics",
					description: "Análisis de comportamiento y sugerencias personalizadas",
					icon: StarIcon,
					href: "/profile/recommendations",
					status: settingsStatus.recommendations.complete ? "complete" : "incomplete",
					progress: settingsStatus.recommendations.progress,
					lastUpdated: "2024-05-14",
					issues: settingsStatus.recommendations.issues,
				},
			];

			setSections(configSections);
		}
	}, [settingsStatus, user, profile]);

	const handleQuickAction = (action: string) => {
		switch (action) {
			case "change-password":
				navigate("/profile/security");
				break;
			case "notifications":
				navigate("/profile/notifications");
				break;
			case "upgrade":
				navigate("/profile/subscription");
				break;
		}
	};

	const getTopIssuesDisplay = () => {
		const issues = getTopIssues();
		return issues.slice(0, 3); // Mostrar solo los 3 principales
	};

	const completionSummary = getCompletionSummary();

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="animate-spin h-8 w-8 border-2 border-primary-600 border-t-transparent rounded-full"></div>
			</div>
		);
	}

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "complete":
				return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
			case "attention":
				return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
			default:
				return <ClockIcon className="h-5 w-5 text-gray-400" />;
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "complete":
				return "border-green-200 bg-green-50";
			case "attention":
				return "border-yellow-200 bg-yellow-50";
			default:
				return "border-gray-200 bg-gray-50";
		}
	};

	const formatDate = (dateString?: string) => {
		if (!dateString) return "No actualizado";
		return new Date(dateString).toLocaleDateString("es-EC", {
			day: "numeric",
			month: "short",
			year: "numeric",
		});
	};

	const completeSections = sections.filter(s => s.status === "complete").length;
	const totalSections = sections.length;

	return (
		<div className="space-y-8">
			{/* Header con resumen general */}
			<div className="relative overflow-hidden">
				<div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white relative">
					{/* Patrón arquitectónico de fondo */}
					<div className="absolute inset-0 opacity-10">
						<div className="grid-pattern"></div>
					</div>
					
					<div className="relative z-10">
						<div className="flex items-center justify-between mb-6">
							<div>
								<h1 className="text-3xl font-bold mb-2">
									Configuración de la Cuenta
								</h1>
								<p className="text-primary-100 text-lg">
									Personaliza tu experiencia en CONSTRU
								</p>
							</div>
							<div className="text-right">
								<div className="text-3xl font-bold">
									{overallProgress}%
								</div>
								<div className="text-sm text-primary-200">
									Configuración completa
								</div>
								<button
									onClick={refreshStatus}
									className="text-primary-200 hover:text-white mt-2 transition-colors"
									title="Actualizar estado"
								>
									<ArrowPathIcon className="h-4 w-4" />
								</button>
							</div>
						</div>

						{/* Barra de progreso general */}
						<div className="w-full bg-primary-800 rounded-full h-3 mb-4">
							<div
								className="bg-secondary-400 h-3 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
								style={{width: `${overallProgress}%`}}
							>
								<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
							</div>
						</div>

						<div className="flex items-center text-primary-100">
							<span className="text-sm">
								{completionSummary.complete} de {completionSummary.total} secciones completadas
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Lista de secciones de configuración */}
			<div className="grid gap-6">
				{sections.map((section, index) => (
					<Link
						key={section.id}
						to={section.href}
						className={`block animate-fade-in group`}
						style={{animationDelay: `${index * 0.1}s`}}
					>
						<div className={`border-2 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${getStatusColor(section.status)}`}>
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-4 flex-1">
									<div className="flex-shrink-0">
										<div className="h-12 w-12 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
											<section.icon className="h-6 w-6 text-primary-600" />
										</div>
									</div>
									
									<div className="flex-1 min-w-0">
										<h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
											{section.title}
										</h3>
										<p className="text-gray-600 text-sm mb-3">
											{section.description}
										</p>
										
										{/* Mostrar issues si existen */}
										{section.issues && section.issues.length > 0 && (
											<div className="mb-3">
												<div className="text-xs text-red-600 font-medium">
													{section.issues[0]}
												</div>
											</div>
										)}
										
										{/* Barra de progreso individual */}
										{section.progress !== undefined && (
											<div className="flex items-center space-x-3">
												<div className="flex-1 bg-gray-200 rounded-full h-2">
													<div
														className="bg-primary-500 h-2 rounded-full transition-all duration-500"
														style={{width: `${section.progress}%`}}
													></div>
												</div>
												<span className="text-xs font-medium text-gray-500">
													{section.progress}%
												</span>
											</div>
										)}
									</div>
								</div>

								<div className="flex items-center space-x-4">
									<div className="text-right">
										<div className="flex items-center space-x-2 mb-1">
											{getStatusIcon(section.status)}
											<span className="text-sm font-medium text-gray-700">
												{section.status === "complete" 
													? "Completo" 
													: section.status === "attention" 
													? "Atención" 
													: "Pendiente"
												}
											</span>
										</div>
										<div className="text-xs text-gray-500">
											{formatDate(section.lastUpdated)}
										</div>
									</div>
									
									<ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all duration-300" />
								</div>
							</div>
						</div>
					</Link>
				))}
			</div>

			{/* Accesos rápidos */}
			<div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
				<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
					<CogIcon className="h-5 w-5 mr-2 text-primary-600" />
					Accesos Rápidos
				</h3>
				
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<button 
						onClick={() => handleQuickAction("change-password")}
						className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 group"
					>
						<DevicePhoneMobileIcon className="h-5 w-5 text-gray-400 group-hover:text-primary-600 mr-3" />
						<span className="text-sm font-medium text-gray-700">
							Cambiar Contraseña
						</span>
					</button>
					
					<button 
						onClick={() => handleQuickAction("notifications")}
						className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 group"
					>
						<BellIcon className="h-5 w-5 text-gray-400 group-hover:text-primary-600 mr-3" />
						<span className="text-sm font-medium text-gray-700">
							Configurar Alertas
						</span>
					</button>
					
					<button 
						onClick={() => handleQuickAction("upgrade")}
						className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 group"
					>
						<CreditCardIcon className="h-5 w-5 text-gray-400 group-hover:text-primary-600 mr-3" />
						<span className="text-sm font-medium text-gray-700">
							Gestionar Plan
						</span>
					</button>
				</div>
			</div>

			{/* Resumen de problemas prioritarios */}
			{getTopIssuesDisplay().length > 0 && (
				<div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
					<div className="flex items-start space-x-3">
						<div className="flex-shrink-0">
							<div className="h-8 w-8 bg-yellow-100 rounded-lg flex items-center justify-center">
								<ExclamationTriangleIcon className="h-4 w-4 text-yellow-600" />
							</div>
						</div>
						<div>
							<h4 className="text-sm font-semibold text-yellow-900 mb-2">
								Requiere Atención
							</h4>
							<ul className="text-sm text-yellow-700 space-y-1">
								{getTopIssuesDisplay().map((issue, index) => (
									<li key={index} className="flex items-center">
										<span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>
										{issue}
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			)}

			{/* Información adicional */}
			<div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
				<div className="flex items-start space-x-3">
					<div className="flex-shrink-0">
						<div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
							<svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
								<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
							</svg>
						</div>
					</div>
					<div>
						<h4 className="text-sm font-semibold text-blue-900 mb-1">
							Optimiza tu Perfil Profesional
						</h4>
						<p className="text-sm text-blue-700">
							Un perfil completo te ayuda a obtener mejores recomendaciones y conectar con proyectos relevantes. 
							Completa todas las secciones para aprovechar al máximo CONSTRU.
						</p>
					</div>
				</div>
			</div>

			{/* Estilos para animaciones */}
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

				@keyframes fadeIn {
					from {
						opacity: 0;
						transform: translateY(20px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				@keyframes shimmer {
					0% {
						transform: translateX(-100%);
					}
					100% {
						transform: translateX(100%);
					}
				}

				.animate-fade-in {
					animation: fadeIn 0.5s ease-out forwards;
					opacity: 0;
				}

				.animate-shimmer {
					animation: shimmer 2s infinite;
				}
			`}</style>
		</div>
	);
};

export default SettingsOverviewPage;