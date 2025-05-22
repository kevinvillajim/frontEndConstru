// src/ui/pages/profile/SettingsOverviewPage.tsx
import {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../../context/AuthContext";
import {useUserProfile} from "../../context/UserProfileContext";
import {useUserSettings} from "../../hooks/useUserSettings";
import {
	UserCircleIcon,
	ShieldCheckIcon,
	BellIcon,
	BuildingOfficeIcon,
	StarIcon,
	GlobeAltIcon,
	CreditCardIcon,
	ChevronRightIcon,
	CheckCircleIcon,
	ExclamationTriangleIcon,
	ClockIcon,
	ArrowPathIcon,
	CogIcon,
	SparklesIcon,
} from "@heroicons/react/24/outline";

interface ConfigurationSection {
	id: string;
	title: string;
	description: string;
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
	iconColor: string;
	href: string;
	status: "complete" | "incomplete" | "attention";
	progress?: number;
	lastUpdated?: string;
	issues?: string[];
}

const SettingsOverviewPage = () => {
	const {user} = useAuth();
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
					iconColor: "text-blue-600",
					href: "/profile/personal",
					status: settingsStatus.personal.complete ? "complete" : "incomplete",
					progress: settingsStatus.personal.progress,
					lastUpdated: profile?.updatedAt ? 
						(typeof profile.updatedAt === 'string' ? profile.updatedAt : profile.updatedAt.toISOString())
						: undefined,
					issues: settingsStatus.personal.issues,
				},
				{
					id: "professional",
					title: "Información Profesional",
					description: "Experiencia, especialización y certificaciones",
					icon: BuildingOfficeIcon,
					iconColor: "text-secondary-600",
					href: "/profile/professional",
					status: settingsStatus.professional.complete ? "complete" : "incomplete",
					progress: settingsStatus.professional.progress,
					lastUpdated: profile?.professionalInfo?.updatedAt ? 
						(typeof profile.professionalInfo.updatedAt === 'string' ? profile.professionalInfo.updatedAt : profile.professionalInfo.updatedAt.toISOString())
						: undefined,
					issues: settingsStatus.professional.issues,
				},
				{
					id: "security",
					title: "Seguridad y Privacidad",
					description: "Contraseña, 2FA y configuraciones de seguridad",
					icon: ShieldCheckIcon,
					iconColor: "text-red-600",
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
					iconColor: "text-purple-600",
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
					iconColor: "text-green-600",
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
					iconColor: "text-primary-600",
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
					title: "Recomendaciones",
					description: "Análisis de comportamiento y sugerencias personalizadas",
					icon: StarIcon,
					iconColor: "text-secondary-500",
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

	const topIssues = getTopIssues;
	const completionSummary = getCompletionSummary;

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-50">
				<div className="max-w-6xl mx-auto px-6 py-16">
					<div className="flex items-center justify-center">
						<div className="animate-spin h-8 w-8 border-2 border-primary-600 border-t-transparent rounded-full"></div>
					</div>
				</div>
			</div>
		);
	}

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "complete":
				return (
					<div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
						<CheckCircleIcon className="h-4 w-4" />
						Completo
					</div>
				);
			case "attention":
				return (
					<div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
						<ExclamationTriangleIcon className="h-4 w-4" />
						Atención
					</div>
				);
			default:
				return (
					<div className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
						<ClockIcon className="h-4 w-4" />
						Pendiente
					</div>
				);
		}
	};

	const formatDate = (dateString?: string) => {
		if (!dateString) return "No actualizado";
		return new Date(dateString).toLocaleDateString("es-EC", {
			day: "numeric",
			month: "short",
		});
	};

	const getCompletionMessage = () => {
		if (overallProgress === 100) {
			return "¡Perfil completamente configurado! 🎉";
		} else if (overallProgress >= 80) {
			return "¡Casi terminamos! Solo faltan algunos detalles";
		} else if (overallProgress >= 50) {
			return "Vamos por buen camino, sigamos completando";
		} else {
			return "Comencemos a personalizar tu experiencia";
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header Hero con Gradiente */}
			<div className="relative overflow-hidden">
				<div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 relative">
					{/* Patrón arquitectónico de fondo */}
					<div className="absolute inset-0 opacity-10">
						<div className="grid-pattern"></div>
					</div>
					
					{/* Elementos decorativos */}
					<div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-secondary-400 opacity-20 blur-3xl"></div>
					<div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-primary-300 opacity-30 blur-2xl"></div>
					
					<div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
						<div className="flex items-center justify-between mb-8">
							<div className="flex items-center gap-4">
								<div className="h-16 w-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
									<CogIcon className="h-8 w-8 text-white" />
								</div>
								<div>
									<h1 className="text-4xl font-bold text-white mb-2">
										Configuración de tu Cuenta
									</h1>
									<p className="text-primary-100 text-lg">
										{getCompletionMessage()}
									</p>
								</div>
							</div>

							<button
								onClick={refreshStatus}
								className="p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl transition-all duration-200 backdrop-blur-sm"
								title="Actualizar estado"
							>
								<ArrowPathIcon className="h-6 w-6 text-white" />
							</button>
						</div>

						{/* Progress Hero */}
						<div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 border border-white border-opacity-20">
							<div className="flex items-center justify-between mb-6">
								<div>
									<div className="text-4xl font-bold text-white mb-1">
										{overallProgress}%
									</div>
									<div className="text-primary-100">
										{completionSummary.complete} de {completionSummary.total} secciones completadas
									</div>
								</div>
								
								{overallProgress === 100 && (
									<div className="flex items-center gap-2 px-4 py-2 bg-secondary-500 text-gray-900 rounded-full font-medium">
										<SparklesIcon className="h-5 w-5" />
										¡Completado!
									</div>
								)}
							</div>

							{/* Barra de progreso mejorada */}
							<div className="relative">
								<div className="w-full bg-primary-800 bg-opacity-50 rounded-full h-4 overflow-hidden">
									<div
										className="bg-gradient-to-r from-secondary-400 to-secondary-500 h-4 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
										style={{width: `${overallProgress}%`}}
									>
										<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
									</div>
								</div>
								
								{/* Marcadores de progreso */}
								<div className="flex justify-between mt-2 text-xs text-primary-200">
									<span>0%</span>
									<span>25%</span>
									<span>50%</span>
									<span>75%</span>
									<span>100%</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="max-w-6xl mx-auto px-6 py-12">
				{/* Secciones de configuración rediseñadas */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
					{sections.map((section, index) => (
						<Link
							key={section.id}
							to={section.href}
							className="group relative animate-fade-in"
							style={{animationDelay: `${index * 0.1}s`}}
						>
							<div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
								{/* Decoración superior */}
								<div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${
									section.status === 'complete' 
										? 'from-green-400 to-green-600' 
										: section.status === 'attention'
										? 'from-yellow-400 to-yellow-600'
										: 'from-gray-300 to-gray-400'
								}`}></div>

								{/* Header de la tarjeta */}
								<div className="flex items-start justify-between mb-6">
									<div className="flex items-start gap-4">
										<div className={`h-14 w-14 rounded-xl bg-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${
											section.status === 'complete' ? 'bg-green-50' : 
											section.status === 'attention' ? 'bg-yellow-50' : 'bg-gray-50'
										}`}>
											<section.icon className={`h-7 w-7 ${section.iconColor}`} />
										</div>
										<div className="flex-1">
											<h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
												{section.title}
											</h3>
											<p className="text-gray-600 leading-relaxed">
												{section.description}
											</p>
										</div>
									</div>

									<ChevronRightIcon className="h-6 w-6 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
								</div>

								{/* Issues si existen */}
								{section.issues && section.issues.length > 0 && (
									<div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
										<div className="flex items-start gap-2">
											<ExclamationTriangleIcon className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
											<p className="text-sm text-yellow-700 font-medium">
												{section.issues[0]}
											</p>
										</div>
									</div>
								)}

								{/* Progress y estado */}
								<div className="space-y-4">
									{section.progress !== undefined && (
										<div>
											<div className="flex items-center justify-between mb-3">
												<span className="text-sm font-medium text-gray-700">
													Progreso
												</span>
												<span className="text-sm font-bold text-primary-600">
													{section.progress}%
												</span>
											</div>
											<div className="w-full bg-gray-200 rounded-full h-2">
												<div
													className={`h-2 rounded-full transition-all duration-700 ${
														section.status === 'complete' 
															? 'bg-gradient-to-r from-green-400 to-green-500' 
															: section.status === 'attention'
															? 'bg-gradient-to-r from-yellow-400 to-yellow-500'
															: 'bg-gradient-to-r from-primary-400 to-primary-500'
													}`}
													style={{width: `${section.progress}%`}}
												></div>
											</div>
										</div>
									)}

									<div className="flex items-center justify-between">
										{getStatusBadge(section.status)}
										
										<div className="text-right">
											<div className="text-xs text-gray-500">
												Actualizado
											</div>
											<div className="text-sm font-medium text-gray-700">
												{formatDate(section.lastUpdated)}
											</div>
										</div>
									</div>
								</div>
							</div>
						</Link>
					))}
				</div>

				{/* Accesos rápidos mejorados */}
				<div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
					<div className="flex items-center gap-3 mb-6">
						<div className="h-10 w-10 bg-secondary-100 rounded-lg flex items-center justify-center">
							<SparklesIcon className="h-5 w-5 text-secondary-600" />
						</div>
						<div>
							<h3 className="text-xl font-semibold text-gray-900">
								Acciones Rápidas
							</h3>
							<p className="text-gray-600">
								Accede directamente a las configuraciones más importantes
							</p>
						</div>
					</div>
					
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<button 
							onClick={() => handleQuickAction("change-password")}
							className="group flex items-center gap-4 p-6 bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 rounded-xl border border-red-200 transition-all duration-200 hover:shadow-md"
						>
							<div className="h-12 w-12 bg-red-500 bg-opacity-10 rounded-lg flex items-center justify-center group-hover:bg-opacity-20 transition-colors">
								<ShieldCheckIcon className="h-6 w-6 text-red-600" />
							</div>
							<div className="text-left">
								<div className="font-semibold text-red-900">
									Cambiar Contraseña
								</div>
								<div className="text-sm text-red-700">
									Actualizar seguridad
								</div>
							</div>
						</button>
						
						<button 
							onClick={() => handleQuickAction("notifications")}
							className="group flex items-center gap-4 p-6 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl border border-purple-200 transition-all duration-200 hover:shadow-md"
						>
							<div className="h-12 w-12 bg-purple-500 bg-opacity-10 rounded-lg flex items-center justify-center group-hover:bg-opacity-20 transition-colors">
								<BellIcon className="h-6 w-6 text-purple-600" />
							</div>
							<div className="text-left">
								<div className="font-semibold text-purple-900">
									Configurar Alertas
								</div>
								<div className="text-sm text-purple-700">
									Personalizar notificaciones
								</div>
							</div>
						</button>
						
						<button 
							onClick={() => handleQuickAction("upgrade")}
							className="group flex items-center gap-4 p-6 bg-gradient-to-br from-secondary-50 to-secondary-100 hover:from-secondary-100 hover:to-secondary-200 rounded-xl border border-secondary-200 transition-all duration-200 hover:shadow-md"
						>
							<div className="h-12 w-12 bg-secondary-500 bg-opacity-20 rounded-lg flex items-center justify-center group-hover:bg-opacity-30 transition-colors">
								<CreditCardIcon className="h-6 w-6 text-secondary-700" />
							</div>
							<div className="text-left">
								<div className="font-semibold text-secondary-900">
									Gestionar Plan
								</div>
								<div className="text-sm text-secondary-700">
									Suscripción y facturación
								</div>
							</div>
						</button>
					</div>
				</div>

				{/* Problemas prioritarios */}
				{topIssues.length > 0 && (
					<div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 rounded-lg p-6 mb-8">
						<div className="flex items-start gap-4">
							<div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
								<ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
							</div>
							<div className="flex-1">
								<h4 className="text-lg font-semibold text-yellow-900 mb-3">
									Requiere tu Atención
								</h4>
								<div className="space-y-2">
									{topIssues.map((issue: string, index: number) => (
										<div key={index} className="flex items-center gap-3">
											<div className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></div>
											<span className="text-yellow-800 font-medium">
												{issue}
											</span>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Motivación final */}
				<div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white relative overflow-hidden">
					<div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-secondary-400 opacity-20 blur-2xl"></div>
					<div className="relative z-10">
						<div className="flex items-center gap-4 mb-4">
							<div className="h-12 w-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
								<StarIcon className="h-6 w-6 text-secondary-400" />
							</div>
							<div>
								<h4 className="text-xl font-semibold mb-1">
									Optimiza tu Experiencia en CONSTRU
								</h4>
								<p className="text-primary-100">
									Un perfil completo te ayuda a obtener mejores recomendaciones, conectar con proyectos relevantes y aprovechar al máximo todas las herramientas disponibles.
								</p>
							</div>
						</div>
						
						{overallProgress < 100 && (
							<div className="flex items-center gap-2 text-secondary-400 font-medium">
								<SparklesIcon className="h-4 w-4" />
								¡Solo te faltan {100 - overallProgress} puntos para completar tu perfil!
							</div>
						)}
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
					animation: fadeIn 0.6s ease-out forwards;
					opacity: 0;
				}

				.animate-shimmer {
					animation: shimmer 2s infinite;
				}

				/* Focus states para accesibilidad */
				button:focus,
				a:focus {
					outline: 2px solid var(--color-primary-500);
					outline-offset: 2px;
				}
			`}</style>
		</div>
	);
};

export default SettingsOverviewPage;