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
} from "@heroicons/react/24/outline";

interface ConfigurationSection {
	id: string;
	title: string;
	description: string;
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
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
					title: "Recomendaciones",
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

	// Corregir las llamadas a las funciones
	const topIssues = getTopIssues;
	const completionSummary = getCompletionSummary;

	if (isLoading) {
		return (
			<div className="min-h-screen" style={{backgroundColor: "var(--bg-main)"}}>
				<div className="max-w-4xl mx-auto px-6 py-16">
					<div className="flex items-center justify-center">
						<div className="animate-spin h-8 w-8 border-2 border-primary-600 border-t-transparent rounded-full"></div>
					</div>
				</div>
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

	const getStatusText = (status: string) => {
		switch (status) {
			case "complete":
				return "Completo";
			case "attention":
				return "Atención";
			default:
				return "Pendiente";
		}
	};

	const formatDate = (dateString?: string) => {
		if (!dateString) return "No actualizado";
		return new Date(dateString).toLocaleDateString("es-EC", {
			day: "numeric",
			month: "short",
		});
	};

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
								Configuración
							</h1>
							<p
								className="text-sm mt-1"
								style={{color: "var(--text-secondary)"}}
							>
								{completionSummary.complete} de {completionSummary.total} secciones completadas
							</p>
						</div>

						<div className="flex items-center space-x-6">
							<div className="text-right">
								<div
									className="text-2xl font-light"
									style={{color: "var(--text-main)"}}
								>
									{overallProgress}%
								</div>
								<div
									className="text-xs"
									style={{color: "var(--text-secondary)"}}
								>
									Completado
								</div>
							</div>

							<button
								onClick={refreshStatus}
								className="p-2 rounded-full transition-colors duration-200 hover:bg-gray-200"
								style={{color: "var(--text-secondary)"}}
								title="Actualizar estado"
							>
								<ArrowPathIcon className="h-5 w-5" />
							</button>
						</div>
					</div>

					{/* Progress bar minimalista */}
					<div className="mt-6">
						<div className="w-full bg-gray-200 rounded-full h-1">
							<div
								className="bg-primary-500 h-1 rounded-full transition-all duration-1000 ease-out"
								style={{width: `${overallProgress}%`}}
							></div>
						</div>
					</div>
				</div>
			</div>

			<div className="max-w-4xl mx-auto px-6 py-8">
				{/* Secciones de configuración */}
				<div className="space-y-1">
					{sections.map((section, index) => (
						<Link
							key={section.id}
							to={section.href}
							className="group flex items-center space-x-4 p-6 rounded-lg transition-all duration-200 bg-gray-100 hover:bg-gray-200 animate-fade-in"
							style={{animationDelay: `${index * 0.05}s`}}
						>
							{/* Icono */}
							<div className="flex-shrink-0">
								<section.icon
									className="h-5 w-5"
									style={{color: "var(--text-muted)"}}
								/>
							</div>

							{/* Contenido */}
							<div className="flex-1 min-w-0">
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<h3
											className="font-medium leading-snug"
											style={{color: "var(--text-main)"}}
										>
											{section.title}
										</h3>
										<p
											className="text-sm mt-1 leading-relaxed"
											style={{color: "var(--text-secondary)"}}
										>
											{section.description}
										</p>

										{/* Issues si existen */}
										{section.issues && section.issues.length > 0 && (
											<div className="mt-2">
												<p className="text-xs text-secondary-500">
													{section.issues[0]}
												</p>
											</div>
										)}

										{/* Progress bar individual */}
										{section.progress !== undefined && (
											<div className="flex items-center space-x-3 mt-3">
												<div className="flex-1 bg-gray-200 rounded-full h-1">
													<div
														className="bg-primary-500 h-1 rounded-full transition-all duration-500"
														style={{width: `${section.progress}%`}}
													></div>
												</div>
												<span
													className="text-xs"
													style={{color: "var(--text-muted)"}}
												>
													{section.progress}%
												</span>
											</div>
										)}
									</div>

									{/* Estado y acciones */}
									<div className="flex items-center space-x-4 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
										<div className="text-right">
											<div className="flex items-center space-x-2 mb-1">
												{getStatusIcon(section.status)}
												<span
													className="text-sm"
													style={{color: "var(--text-secondary)"}}
												>
													{getStatusText(section.status)}
												</span>
											</div>
											<div
												className="text-xs"
												style={{color: "var(--text-muted)"}}
											>
												{formatDate(section.lastUpdated)}
											</div>
										</div>

										<ChevronRightIcon
											className="h-4 w-4 transition-colors duration-200"
											style={{color: "var(--text-muted)"}}
										/>
									</div>
								</div>
							</div>
						</Link>
					))}
				</div>

				{/* Accesos rápidos */}
				<div className="mt-12">
					<h3
						className="text-lg font-medium mb-6"
						style={{color: "var(--text-main)"}}
					>
						Accesos Rápidos
					</h3>
					
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<button 
							onClick={() => handleQuickAction("change-password")}
							className="flex items-center p-4 rounded-lg border transition-colors duration-200 hover:bg-gray-50 group"
							style={{borderColor: "var(--border-subtle)"}}
						>
							<ShieldCheckIcon
								className="h-5 w-5 mr-3"
								style={{color: "var(--text-muted)"}}
							/>
							<span
								className="text-sm font-medium"
								style={{color: "var(--text-main)"}}
							>
								Cambiar Contraseña
							</span>
						</button>
						
						<button 
							onClick={() => handleQuickAction("notifications")}
							className="flex items-center p-4 rounded-lg border transition-colors duration-200 hover:bg-gray-50 group"
							style={{borderColor: "var(--border-subtle)"}}
						>
							<BellIcon
								className="h-5 w-5 mr-3"
								style={{color: "var(--text-muted)"}}
							/>
							<span
								className="text-sm font-medium"
								style={{color: "var(--text-main)"}}
							>
								Configurar Alertas
							</span>
						</button>
						
						<button 
							onClick={() => handleQuickAction("upgrade")}
							className="flex items-center p-4 rounded-lg border transition-colors duration-200 hover:bg-gray-50 group"
							style={{borderColor: "var(--border-subtle)"}}
						>
							<CreditCardIcon
								className="h-5 w-5 mr-3"
								style={{color: "var(--text-muted)"}}
							/>
							<span
								className="text-sm font-medium"
								style={{color: "var(--text-main)"}}
							>
								Gestionar Plan
							</span>
						</button>
					</div>
				</div>

				{/* Problemas prioritarios */}
				{topIssues.length > 0 && (
					<div className="mt-8 p-6 rounded-lg border-l-4 border-yellow-500 bg-yellow-50">
						<div className="flex items-start space-x-3">
							<ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
							<div>
								<h4 className="text-sm font-medium text-yellow-900 mb-2">
									Requiere Atención
								</h4>
								<ul className="text-sm text-yellow-700 space-y-1">
									{topIssues.map((issue: string, index: number) => (
										<li key={index} className="flex items-center">
											<span className="w-1 h-1 bg-yellow-600 rounded-full mr-2 flex-shrink-0"></span>
											{issue}
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
				)}

				{/* Información adicional */}
				<div className="mt-8 p-6 rounded-lg bg-blue-50 border border-blue-200">
					<div className="flex items-start space-x-3">
						<div className="flex-shrink-0">
							<svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
								<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
							</svg>
						</div>
						<div>
							<h4 className="text-sm font-medium text-blue-900 mb-1">
								Optimiza tu Perfil Profesional
							</h4>
							<p className="text-sm text-blue-700">
								Un perfil completo te ayuda a obtener mejores recomendaciones y conectar con proyectos relevantes.
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Estilos para animaciones */}
			<style>{`
				@keyframes fadeIn {
					from {
						opacity: 0;
						transform: translateY(10px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				.animate-fade-in {
					animation: fadeIn 0.3s ease-out forwards;
					opacity: 0;
				}

				/* Hover effects */
				.group:hover .opacity-0 {
					opacity: 1;
				}

				/* Focus states */
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