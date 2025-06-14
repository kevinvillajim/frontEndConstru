// src/ui/pages/calculations/admin/SystemConfiguration.tsx
import React, {useState, useEffect} from "react";
import {
	CogIcon,
	BuildingOfficeIcon,
	UserGroupIcon,
	ShieldCheckIcon,
	CloudArrowUpIcon,
	DocumentTextIcon,
	ChartBarIcon,
	BellIcon,
	KeyIcon,
	GlobeAltIcon,
	ServerIcon,
	DatabaseIcon,
	LockClosedIcon,
	ExclamationTriangleIcon,
	CheckCircleIcon,
	ClockIcon,
	EyeIcon,
	PencilIcon,
	TrashIcon,
	PlusIcon,
	ArrowPathIcon,
	InformationCircleIcon,
	ExclamationCircleIcon,
	XMarkIcon,
	ChevronDownIcon,
	ChevronRightIcon,
	CurrencyDollarIcon,
	CalendarDaysIcon,
	PhotoIcon,
	EnvelopeIcon,
	PhoneIcon,
} from "@heroicons/react/24/outline";
import {LoadingSpinner, Badge} from "../shared/components/SharedComponents";

// Types
interface SystemConfig {
	general: GeneralSettings;
	company: CompanySettings;
	security: SecuritySettings;
	integrations: IntegrationSettings;
	templates: TemplateSettings;
	notifications: NotificationSettings;
	backup: BackupSettings;
	branding: BrandingSettings;
	compliance: ComplianceSettings;
	performance: PerformanceSettings;
}

interface GeneralSettings {
	systemName: string;
	systemDescription: string;
	defaultLanguage: "es" | "en";
	defaultTimezone: string;
	defaultCurrency: "USD" | "EUR" | "custom";
	customCurrencyCode?: string;
	dateFormat: "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD";
	numberFormat: "decimal" | "thousand_separator";
	maintenanceMode: boolean;
	maintenanceMessage?: string;
	debugMode: boolean;
	analyticsEnabled: boolean;
	feedbackEnabled: boolean;
}

interface CompanySettings {
	name: string;
	legalName: string;
	taxId: string;
	address: string;
	city: string;
	country: string;
	phone: string;
	email: string;
	website?: string;
	logo?: string;
	industry: string;
	size: "small" | "medium" | "large" | "enterprise";
	foundedYear?: number;
	description?: string;
}

interface SecuritySettings {
	passwordPolicy: {
		minLength: number;
		requireUppercase: boolean;
		requireLowercase: boolean;
		requireNumbers: boolean;
		requireSpecialChars: boolean;
		expireDays: number;
		preventReuse: number;
	};
	sessionSettings: {
		timeout: number; // minutes
		maxConcurrentSessions: number;
		requireMFA: boolean;
		allowRememberMe: boolean;
	};
	ipWhitelist: string[];
	auditLog: {
		enabled: boolean;
		retentionDays: number;
		logLevel: "basic" | "detailed" | "verbose";
	};
	dataEncryption: {
		enabled: boolean;
		algorithm: "AES-256" | "RSA-2048";
		keyRotationDays: number;
	};
}

interface IntegrationSettings {
	apiSettings: {
		enabled: boolean;
		rateLimit: number;
		requireAuthentication: boolean;
		allowedOrigins: string[];
	};
	webhooks: {
		enabled: boolean;
		retryAttempts: number;
		timeoutSeconds: number;
	};
	externalServices: ExternalService[];
	sso: {
		enabled: boolean;
		provider: "google" | "microsoft" | "okta" | "custom";
		configuration: any;
	};
}

interface ExternalService {
	id: string;
	name: string;
	type: "database" | "storage" | "email" | "payment" | "analytics" | "custom";
	status: "active" | "inactive" | "error";
	configuration: any;
	lastSync?: Date;
	createdAt: Date;
}

interface TemplateSettings {
	corporateTemplates: CorporateTemplate[];
	defaultTemplates: {
		calculation: string;
		budget: string;
		schedule: string;
		document: string;
	};
	approvalWorkflow: {
		enabled: boolean;
		requireApproval: boolean;
		approvers: string[];
	};
	versionControl: {
		enabled: boolean;
		maxVersions: number;
		autoArchive: boolean;
	};
}

interface CorporateTemplate {
	id: string;
	name: string;
	description: string;
	type: "calculation" | "budget" | "schedule" | "document" | "workflow";
	category: string;
	status: "active" | "draft" | "archived";
	mandatory: boolean;
	departmentRestricted: boolean;
	departments: string[];
	createdBy: string;
	createdAt: Date;
	lastModified: Date;
	usageCount: number;
}

interface NotificationSettings {
	email: {
		enabled: boolean;
		smtpSettings: {
			host: string;
			port: number;
			secure: boolean;
			username: string;
			password: string;
		};
		templates: NotificationTemplate[];
	};
	push: {
		enabled: boolean;
		webPushSettings: any;
	};
	sms: {
		enabled: boolean;
		provider: "twilio" | "nexmo" | "custom";
		configuration: any;
	};
	slack: {
		enabled: boolean;
		webhookUrl?: string;
		channels: string[];
	};
}

interface NotificationTemplate {
	id: string;
	name: string;
	subject: string;
	body: string;
	type: "email" | "push" | "sms";
	trigger: "user_registration" | "project_update" | "system_alert" | "custom";
	variables: string[];
	active: boolean;
}

interface BackupSettings {
	enabled: boolean;
	frequency: "daily" | "weekly" | "monthly";
	retention: number; // days
	location: "local" | "cloud";
	cloudProvider?: "aws" | "google" | "azure";
	encryption: boolean;
	compression: boolean;
	autoRestore: boolean;
	lastBackup?: Date;
	nextBackup?: Date;
}

interface BrandingSettings {
	primaryColor: string;
	secondaryColor: string;
	accentColor: string;
	fontFamily: string;
	logoUrl?: string;
	faviconUrl?: string;
	customCSS?: string;
	emailFooter?: string;
	documentWatermark?: {
		enabled: boolean;
		text: string;
		opacity: number;
	};
}

interface ComplianceSettings {
	gdpr: {
		enabled: boolean;
		dataRetentionDays: number;
		consentRequired: boolean;
		cookieBanner: boolean;
	};
	sox: {
		enabled: boolean;
		auditTrail: boolean;
		financialReports: boolean;
	};
	iso: {
		enabled: boolean;
		standard: "ISO9001" | "ISO27001" | "ISO14001";
		certificationDate?: Date;
		expiryDate?: Date;
	};
	customCompliance: ComplianceRule[];
}

interface ComplianceRule {
	id: string;
	name: string;
	description: string;
	type: "data_retention" | "access_control" | "audit" | "reporting";
	mandatory: boolean;
	checkFrequency: "daily" | "weekly" | "monthly";
	lastCheck?: Date;
	status: "compliant" | "non_compliant" | "pending";
}

interface PerformanceSettings {
	caching: {
		enabled: boolean;
		ttl: number; // seconds
		maxSize: number; // MB
		strategy: "lru" | "lfu" | "ttl";
	};
	compression: {
		enabled: boolean;
		level: number; // 1-9
		types: string[];
	};
	cdn: {
		enabled: boolean;
		provider: "cloudflare" | "aws" | "custom";
		configuration: any;
	};
	monitoring: {
		enabled: boolean;
		alertThresholds: {
			responseTime: number;
			errorRate: number;
			memoryUsage: number;
			diskUsage: number;
		};
	};
}

// Custom Hook
const useSystemConfiguration = () => {
	const [config, setConfig] = useState<SystemConfig | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [lastSaved, setLastSaved] = useState<Date | null>(null);
	const [unsavedChanges, setUnsavedChanges] = useState(false);

	useEffect(() => {
		loadConfiguration();
	}, []);

	const loadConfiguration = async () => {
		setIsLoading(true);
		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			const mockConfig: SystemConfig = {
				general: {
					systemName: "CONSTRU Enterprise",
					systemDescription:
						"Plataforma integral de construcción para empresas",
					defaultLanguage: "es",
					defaultTimezone: "America/Guayaquil",
					defaultCurrency: "USD",
					dateFormat: "DD/MM/YYYY",
					numberFormat: "decimal",
					maintenanceMode: false,
					debugMode: false,
					analyticsEnabled: true,
					feedbackEnabled: true,
				},
				company: {
					name: "CONSTRU SA",
					legalName: "CONSTRU Ingeniería y Construcción S.A.",
					taxId: "1792123456001",
					address: "Av. República del Salvador 123",
					city: "Quito",
					country: "Ecuador",
					phone: "+593 2 123 4567",
					email: "info@constru.ec",
					website: "https://www.constru.ec",
					industry: "Construcción",
					size: "large",
					foundedYear: 2018,
					description: "Empresa líder en soluciones de construcción en Ecuador",
				},
				security: {
					passwordPolicy: {
						minLength: 8,
						requireUppercase: true,
						requireLowercase: true,
						requireNumbers: true,
						requireSpecialChars: false,
						expireDays: 90,
						preventReuse: 5,
					},
					sessionSettings: {
						timeout: 30,
						maxConcurrentSessions: 3,
						requireMFA: false,
						allowRememberMe: true,
					},
					ipWhitelist: [],
					auditLog: {
						enabled: true,
						retentionDays: 365,
						logLevel: "detailed",
					},
					dataEncryption: {
						enabled: true,
						algorithm: "AES-256",
						keyRotationDays: 90,
					},
				},
				integrations: {
					apiSettings: {
						enabled: true,
						rateLimit: 1000,
						requireAuthentication: true,
						allowedOrigins: ["https://constru.ec", "https://app.constru.ec"],
					},
					webhooks: {
						enabled: true,
						retryAttempts: 3,
						timeoutSeconds: 30,
					},
					externalServices: [
						{
							id: "1",
							name: "AWS S3 Storage",
							type: "storage",
							status: "active",
							configuration: {},
							lastSync: new Date(2024, 5, 13, 12, 0),
							createdAt: new Date(2024, 3, 1),
						},
						{
							id: "2",
							name: "SendGrid Email",
							type: "email",
							status: "active",
							configuration: {},
							lastSync: new Date(2024, 5, 13, 10, 30),
							createdAt: new Date(2024, 3, 15),
						},
					],
					sso: {
						enabled: false,
						provider: "google",
						configuration: {},
					},
				},
				templates: {
					corporateTemplates: [
						{
							id: "1",
							name: "Plantilla Corporativa de Presupuestos",
							description:
								"Plantilla estándar para todos los presupuestos de la empresa",
							type: "budget",
							category: "Presupuestos",
							status: "active",
							mandatory: true,
							departmentRestricted: false,
							departments: [],
							createdBy: "Admin",
							createdAt: new Date(2024, 0, 1),
							lastModified: new Date(2024, 4, 15),
							usageCount: 234,
						},
					],
					defaultTemplates: {
						calculation: "nec-standard",
						budget: "corporate-budget",
						schedule: "standard-schedule",
						document: "corporate-document",
					},
					approvalWorkflow: {
						enabled: true,
						requireApproval: true,
						approvers: ["supervisor@constru.ec", "admin@constru.ec"],
					},
					versionControl: {
						enabled: true,
						maxVersions: 10,
						autoArchive: true,
					},
				},
				notifications: {
					email: {
						enabled: true,
						smtpSettings: {
							host: "smtp.sendgrid.net",
							port: 587,
							secure: true,
							username: "apikey",
							password: "***",
						},
						templates: [
							{
								id: "1",
								name: "Bienvenida Usuario",
								subject: "Bienvenido a CONSTRU",
								body: "Estimado {{name}}, bienvenido a la plataforma...",
								type: "email",
								trigger: "user_registration",
								variables: ["name", "email", "company"],
								active: true,
							},
						],
					},
					push: {
						enabled: true,
						webPushSettings: {},
					},
					sms: {
						enabled: false,
						provider: "twilio",
						configuration: {},
					},
					slack: {
						enabled: true,
						webhookUrl: "https://hooks.slack.com/services/...",
						channels: ["#general", "#projects"],
					},
				},
				backup: {
					enabled: true,
					frequency: "daily",
					retention: 30,
					location: "cloud",
					cloudProvider: "aws",
					encryption: true,
					compression: true,
					autoRestore: false,
					lastBackup: new Date(2024, 5, 13, 2, 0),
					nextBackup: new Date(2024, 5, 14, 2, 0),
				},
				branding: {
					primaryColor: "#2563eb",
					secondaryColor: "#64748b",
					accentColor: "#059669",
					fontFamily: "Inter",
					logoUrl: "/images/logo.png",
					faviconUrl: "/images/favicon.ico",
					customCSS: "",
					emailFooter: "CONSTRU - Construyendo el futuro",
					documentWatermark: {
						enabled: false,
						text: "CONFIDENCIAL",
						opacity: 0.3,
					},
				},
				compliance: {
					gdpr: {
						enabled: false,
						dataRetentionDays: 365,
						consentRequired: false,
						cookieBanner: false,
					},
					sox: {
						enabled: false,
						auditTrail: false,
						financialReports: false,
					},
					iso: {
						enabled: true,
						standard: "ISO9001",
						certificationDate: new Date(2023, 6, 15),
						expiryDate: new Date(2026, 6, 15),
					},
					customCompliance: [],
				},
				performance: {
					caching: {
						enabled: true,
						ttl: 3600,
						maxSize: 100,
						strategy: "lru",
					},
					compression: {
						enabled: true,
						level: 6,
						types: ["text/html", "text/css", "application/javascript"],
					},
					cdn: {
						enabled: false,
						provider: "cloudflare",
						configuration: {},
					},
					monitoring: {
						enabled: true,
						alertThresholds: {
							responseTime: 5000,
							errorRate: 5,
							memoryUsage: 80,
							diskUsage: 85,
						},
					},
				},
			};

			setConfig(mockConfig);
			setLastSaved(new Date());
		} catch (error) {
			console.error("Error loading configuration:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const saveConfiguration = async (newConfig: SystemConfig) => {
		setIsSaving(true);
		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1500));

			setConfig(newConfig);
			setLastSaved(new Date());
			setUnsavedChanges(false);

			console.log("Configuration saved:", newConfig);
		} catch (error) {
			console.error("Error saving configuration:", error);
			throw error;
		} finally {
			setIsSaving(false);
		}
	};

	const updateConfig = (section: keyof SystemConfig, data: any) => {
		if (!config) return;

		const newConfig = {
			...config,
			[section]: {
				...config[section],
				...data,
			},
		};

		setConfig(newConfig);
		setUnsavedChanges(true);
	};

	const testConnection = async (serviceId: string) => {
		// Simulate connection test
		await new Promise((resolve) => setTimeout(resolve, 2000));
		return Math.random() > 0.3; // 70% success rate
	};

	const exportConfiguration = () => {
		if (!config) return;

		const configJson = JSON.stringify(config, null, 2);
		const blob = new Blob([configJson], {type: "application/json"});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `constru-config-${new Date().toISOString().split("T")[0]}.json`;
		a.click();
		URL.revokeObjectURL(url);
	};

	return {
		config,
		isLoading,
		isSaving,
		lastSaved,
		unsavedChanges,
		updateConfig,
		saveConfiguration,
		testConnection,
		exportConfiguration,
	};
};

// Components
const ConfigurationSection: React.FC<{
	title: string;
	description: string;
	icon: React.ComponentType<{className?: string}>;
	children: React.ReactNode;
	expanded: boolean;
	onToggle: () => void;
}> = ({title, description, icon: Icon, children, expanded, onToggle}) => {
	return (
		<div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
			<button
				onClick={onToggle}
				className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
			>
				<div className="flex items-center gap-3">
					<Icon className="h-6 w-6 text-blue-600" />
					<div className="text-left">
						<h3 className="font-semibold text-gray-900">{title}</h3>
						<p className="text-sm text-gray-600">{description}</p>
					</div>
				</div>
				{expanded ? (
					<ChevronDownIcon className="h-5 w-5 text-gray-400" />
				) : (
					<ChevronRightIcon className="h-5 w-5 text-gray-400" />
				)}
			</button>

			{expanded && (
				<div className="px-6 pb-6 border-t border-gray-200">{children}</div>
			)}
		</div>
	);
};

const GeneralSettingsPanel: React.FC<{
	settings: GeneralSettings;
	onUpdate: (settings: Partial<GeneralSettings>) => void;
}> = ({settings, onUpdate}) => {
	return (
		<div className="space-y-6 pt-6">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Nombre del Sistema
					</label>
					<input
						type="text"
						value={settings.systemName}
						onChange={(e) => onUpdate({systemName: e.target.value})}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Idioma por Defecto
					</label>
					<select
						value={settings.defaultLanguage}
						onChange={(e) =>
							onUpdate({defaultLanguage: e.target.value as "es" | "en"})
						}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					>
						<option value="es">Español</option>
						<option value="en">English</option>
					</select>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Zona Horaria
					</label>
					<select
						value={settings.defaultTimezone}
						onChange={(e) => onUpdate({defaultTimezone: e.target.value})}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					>
						<option value="America/Guayaquil">Ecuador (GMT-5)</option>
						<option value="America/Bogota">Colombia (GMT-5)</option>
						<option value="America/Lima">Perú (GMT-5)</option>
						<option value="UTC">UTC</option>
					</select>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Moneda por Defecto
					</label>
					<select
						value={settings.defaultCurrency}
						onChange={(e) =>
							onUpdate({
								defaultCurrency: e.target.value as "USD" | "EUR" | "custom",
							})
						}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					>
						<option value="USD">Dólar Americano (USD)</option>
						<option value="EUR">Euro (EUR)</option>
						<option value="custom">Personalizada</option>
					</select>
				</div>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Descripción del Sistema
				</label>
				<textarea
					value={settings.systemDescription}
					onChange={(e) => onUpdate({systemDescription: e.target.value})}
					className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
					rows={3}
				/>
			</div>

			{/* System Toggles */}
			<div className="space-y-4">
				<h4 className="font-medium text-gray-900">Configuración del Sistema</h4>

				<div className="space-y-3">
					<div className="flex items-center justify-between">
						<div>
							<div className="font-medium text-gray-900">
								Modo Mantenimiento
							</div>
							<div className="text-sm text-gray-600">
								Deshabilita el acceso para usuarios regulares
							</div>
						</div>
						<button
							onClick={() =>
								onUpdate({maintenanceMode: !settings.maintenanceMode})
							}
							className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
								settings.maintenanceMode ? "bg-red-600" : "bg-gray-200"
							}`}
						>
							<span
								className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
									settings.maintenanceMode ? "translate-x-6" : "translate-x-1"
								}`}
							/>
						</button>
					</div>

					<div className="flex items-center justify-between">
						<div>
							<div className="font-medium text-gray-900">Modo Debug</div>
							<div className="text-sm text-gray-600">
								Muestra información de depuración
							</div>
						</div>
						<button
							onClick={() => onUpdate({debugMode: !settings.debugMode})}
							className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
								settings.debugMode ? "bg-blue-600" : "bg-gray-200"
							}`}
						>
							<span
								className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
									settings.debugMode ? "translate-x-6" : "translate-x-1"
								}`}
							/>
						</button>
					</div>

					<div className="flex items-center justify-between">
						<div>
							<div className="font-medium text-gray-900">Analytics</div>
							<div className="text-sm text-gray-600">
								Recopila estadísticas de uso
							</div>
						</div>
						<button
							onClick={() =>
								onUpdate({analyticsEnabled: !settings.analyticsEnabled})
							}
							className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
								settings.analyticsEnabled ? "bg-blue-600" : "bg-gray-200"
							}`}
						>
							<span
								className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
									settings.analyticsEnabled ? "translate-x-6" : "translate-x-1"
								}`}
							/>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

const CompanySettingsPanel: React.FC<{
	settings: CompanySettings;
	onUpdate: (settings: Partial<CompanySettings>) => void;
}> = ({settings, onUpdate}) => {
	return (
		<div className="space-y-6 pt-6">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Nombre de la Empresa
					</label>
					<input
						type="text"
						value={settings.name}
						onChange={(e) => onUpdate({name: e.target.value})}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Razón Social
					</label>
					<input
						type="text"
						value={settings.legalName}
						onChange={(e) => onUpdate({legalName: e.target.value})}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						RUC / Tax ID
					</label>
					<input
						type="text"
						value={settings.taxId}
						onChange={(e) => onUpdate({taxId: e.target.value})}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Teléfono
					</label>
					<input
						type="tel"
						value={settings.phone}
						onChange={(e) => onUpdate({phone: e.target.value})}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Email
					</label>
					<input
						type="email"
						value={settings.email}
						onChange={(e) => onUpdate({email: e.target.value})}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Sitio Web
					</label>
					<input
						type="url"
						value={settings.website || ""}
						onChange={(e) => onUpdate({website: e.target.value})}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Ciudad
					</label>
					<input
						type="text"
						value={settings.city}
						onChange={(e) => onUpdate({city: e.target.value})}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Tamaño de Empresa
					</label>
					<select
						value={settings.size}
						onChange={(e) =>
							onUpdate({size: e.target.value as CompanySettings["size"]})
						}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					>
						<option value="small">Pequeña (1-50 empleados)</option>
						<option value="medium">Mediana (51-250 empleados)</option>
						<option value="large">Grande (251-1000 empleados)</option>
						<option value="enterprise">Empresa (1000+ empleados)</option>
					</select>
				</div>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Dirección
				</label>
				<input
					type="text"
					value={settings.address}
					onChange={(e) => onUpdate({address: e.target.value})}
					className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
				/>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Descripción de la Empresa
				</label>
				<textarea
					value={settings.description || ""}
					onChange={(e) => onUpdate({description: e.target.value})}
					className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
					rows={3}
				/>
			</div>

			{/* Logo Upload Section */}
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Logo de la Empresa
				</label>
				<div className="flex items-center gap-4">
					{settings.logo && (
						<div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
							<img
								src={settings.logo}
								alt="Logo"
								className="max-w-full max-h-full"
							/>
						</div>
					)}
					<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
						Subir Logo
					</button>
				</div>
			</div>
		</div>
	);
};

const SecuritySettingsPanel: React.FC<{
	settings: SecuritySettings;
	onUpdate: (settings: Partial<SecuritySettings>) => void;
}> = ({settings, onUpdate}) => {
	return (
		<div className="space-y-6 pt-6">
			{/* Password Policy */}
			<div>
				<h4 className="font-medium text-gray-900 mb-4">
					Política de Contraseñas
				</h4>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Longitud Mínima
						</label>
						<input
							type="number"
							min="6"
							max="32"
							value={settings.passwordPolicy.minLength}
							onChange={(e) =>
								onUpdate({
									passwordPolicy: {
										...settings.passwordPolicy,
										minLength: parseInt(e.target.value),
									},
								})
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Expiración (días)
						</label>
						<input
							type="number"
							min="30"
							max="365"
							value={settings.passwordPolicy.expireDays}
							onChange={(e) =>
								onUpdate({
									passwordPolicy: {
										...settings.passwordPolicy,
										expireDays: parseInt(e.target.value),
									},
								})
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
				</div>

				<div className="space-y-3 mt-4">
					{[
						{key: "requireUppercase", label: "Requiere mayúsculas"},
						{key: "requireLowercase", label: "Requiere minúsculas"},
						{key: "requireNumbers", label: "Requiere números"},
						{
							key: "requireSpecialChars",
							label: "Requiere caracteres especiales",
						},
					].map(({key, label}) => (
						<div key={key} className="flex items-center justify-between">
							<span className="text-sm text-gray-700">{label}</span>
							<button
								onClick={() =>
									onUpdate({
										passwordPolicy: {
											...settings.passwordPolicy,
											[key]:
												!settings.passwordPolicy[
													key as keyof typeof settings.passwordPolicy
												],
										},
									})
								}
								className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
									settings.passwordPolicy[
										key as keyof typeof settings.passwordPolicy
									]
										? "bg-blue-600"
										: "bg-gray-200"
								}`}
							>
								<span
									className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
										settings.passwordPolicy[
											key as keyof typeof settings.passwordPolicy
										]
											? "translate-x-6"
											: "translate-x-1"
									}`}
								/>
							</button>
						</div>
					))}
				</div>
			</div>

			{/* Session Settings */}
			<div>
				<h4 className="font-medium text-gray-900 mb-4">
					Configuración de Sesión
				</h4>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Timeout (minutos)
						</label>
						<input
							type="number"
							min="5"
							max="480"
							value={settings.sessionSettings.timeout}
							onChange={(e) =>
								onUpdate({
									sessionSettings: {
										...settings.sessionSettings,
										timeout: parseInt(e.target.value),
									},
								})
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Sesiones Concurrentes
						</label>
						<input
							type="number"
							min="1"
							max="10"
							value={settings.sessionSettings.maxConcurrentSessions}
							onChange={(e) =>
								onUpdate({
									sessionSettings: {
										...settings.sessionSettings,
										maxConcurrentSessions: parseInt(e.target.value),
									},
								})
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
				</div>

				<div className="space-y-3 mt-4">
					<div className="flex items-center justify-between">
						<div>
							<div className="font-medium text-gray-900">Requiere MFA</div>
							<div className="text-sm text-gray-600">
								Autenticación de dos factores obligatoria
							</div>
						</div>
						<button
							onClick={() =>
								onUpdate({
									sessionSettings: {
										...settings.sessionSettings,
										requireMFA: !settings.sessionSettings.requireMFA,
									},
								})
							}
							className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
								settings.sessionSettings.requireMFA
									? "bg-blue-600"
									: "bg-gray-200"
							}`}
						>
							<span
								className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
									settings.sessionSettings.requireMFA
										? "translate-x-6"
										: "translate-x-1"
								}`}
							/>
						</button>
					</div>
				</div>
			</div>

			{/* Audit Log */}
			<div>
				<h4 className="font-medium text-gray-900 mb-4">Auditoría y Registro</h4>
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<div className="font-medium text-gray-900">
								Registro de Auditoría
							</div>
							<div className="text-sm text-gray-600">
								Registra todas las acciones del sistema
							</div>
						</div>
						<button
							onClick={() =>
								onUpdate({
									auditLog: {
										...settings.auditLog,
										enabled: !settings.auditLog.enabled,
									},
								})
							}
							className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
								settings.auditLog.enabled ? "bg-blue-600" : "bg-gray-200"
							}`}
						>
							<span
								className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
									settings.auditLog.enabled ? "translate-x-6" : "translate-x-1"
								}`}
							/>
						</button>
					</div>

					{settings.auditLog.enabled && (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Retención (días)
								</label>
								<input
									type="number"
									min="30"
									max="2555"
									value={settings.auditLog.retentionDays}
									onChange={(e) =>
										onUpdate({
											auditLog: {
												...settings.auditLog,
												retentionDays: parseInt(e.target.value),
											},
										})
									}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Nivel de Detalle
								</label>
								<select
									value={settings.auditLog.logLevel}
									onChange={(e) =>
										onUpdate({
											auditLog: {
												...settings.auditLog,
												logLevel: e.target
													.value as SecuritySettings["auditLog"]["logLevel"],
											},
										})
									}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								>
									<option value="basic">Básico</option>
									<option value="detailed">Detallado</option>
									<option value="verbose">Completo</option>
								</select>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

const SystemConfiguration: React.FC = () => {
	const {
		config,
		isLoading,
		isSaving,
		lastSaved,
		unsavedChanges,
		updateConfig,
		saveConfiguration,
		exportConfiguration,
	} = useSystemConfiguration();

	const [expandedSections, setExpandedSections] = useState<Set<string>>(
		new Set(["general"])
	);
	const [showSaveDialog, setShowSaveDialog] = useState(false);

	const toggleSection = (sectionId: string) => {
		const newExpanded = new Set(expandedSections);
		if (newExpanded.has(sectionId)) {
			newExpanded.delete(sectionId);
		} else {
			newExpanded.add(sectionId);
		}
		setExpandedSections(newExpanded);
	};

	const handleSave = async () => {
		if (!config) return;

		try {
			await saveConfiguration(config);
			setShowSaveDialog(false);
		} catch (error) {
			console.error("Error saving configuration:", error);
		}
	};

	if (isLoading) {
		return (
			<div className="max-w-7xl mx-auto px-4 py-8">
				<div className="flex items-center justify-center h-64">
					<div className="text-center">
						<LoadingSpinner size="lg" className="mx-auto mb-4" />
						<p className="text-gray-600">
							Cargando configuración del sistema...
						</p>
					</div>
				</div>
			</div>
		);
	}

	if (!config) {
		return (
			<div className="max-w-7xl mx-auto px-4 py-8">
				<div className="text-center py-12">
					<ExclamationTriangleIcon className="h-12 w-12 text-red-400 mx-auto mb-4" />
					<h3 className="text-lg font-medium text-gray-900 mb-2">
						Error al cargar configuración
					</h3>
					<p className="text-gray-600">
						No se pudo cargar la configuración del sistema.
					</p>
				</div>
			</div>
		);
	}

	const sections = [
		{
			id: "general",
			title: "Configuración General",
			description: "Configuración básica del sistema",
			icon: CogIcon,
			component: (
				<GeneralSettingsPanel
					settings={config.general}
					onUpdate={(data) => updateConfig("general", data)}
				/>
			),
		},
		{
			id: "company",
			title: "Información de la Empresa",
			description: "Datos corporativos y de contacto",
			icon: BuildingOfficeIcon,
			component: (
				<CompanySettingsPanel
					settings={config.company}
					onUpdate={(data) => updateConfig("company", data)}
				/>
			),
		},
		{
			id: "security",
			title: "Seguridad",
			description: "Políticas de seguridad y autenticación",
			icon: ShieldCheckIcon,
			component: (
				<SecuritySettingsPanel
					settings={config.security}
					onUpdate={(data) => updateConfig("security", data)}
				/>
			),
		},
	];

	return (
		<div className="max-w-7xl mx-auto px-4 py-8">
			{/* Header */}
			<div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center gap-4">
						<div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
							<CogIcon className="h-6 w-6 text-white" />
						</div>
						<div>
							<h1 className="text-2xl font-bold text-gray-900">
								Configuración del Sistema
							</h1>
							<p className="text-gray-600">
								Configuración empresarial centralizada y políticas de seguridad
							</p>
						</div>
					</div>

					<div className="flex items-center gap-3">
						{lastSaved && (
							<div className="text-sm text-gray-500">
								Guardado: {lastSaved.toLocaleString("es-EC")}
							</div>
						)}
						<button
							onClick={exportConfiguration}
							className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
						>
							<ArrowPathIcon className="h-4 w-4" />
							Exportar
						</button>
						<button
							onClick={() => setShowSaveDialog(true)}
							disabled={!unsavedChanges || isSaving}
							className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isSaving ? (
								<LoadingSpinner size="sm" />
							) : (
								<CheckCircleIcon className="h-4 w-4" />
							)}
							{isSaving ? "Guardando..." : "Guardar Cambios"}
						</button>
					</div>
				</div>

				{/* Status Indicators */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div className="bg-blue-50 rounded-lg p-4">
						<div className="flex items-center gap-2 mb-2">
							<CheckCircleIcon className="h-5 w-5 text-blue-600" />
							<span className="text-sm font-medium text-blue-700">Sistema</span>
						</div>
						<div className="text-sm text-blue-600">Operativo</div>
					</div>
					<div className="bg-green-50 rounded-lg p-4">
						<div className="flex items-center gap-2 mb-2">
							<ShieldCheckIcon className="h-5 w-5 text-green-600" />
							<span className="text-sm font-medium text-green-700">
								Seguridad
							</span>
						</div>
						<div className="text-sm text-green-600">Configurada</div>
					</div>
					<div className="bg-yellow-50 rounded-lg p-4">
						<div className="flex items-center gap-2 mb-2">
							<ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
							<span className="text-sm font-medium text-yellow-700">
								Alertas
							</span>
						</div>
						<div className="text-sm text-yellow-600">0 pendientes</div>
					</div>
					<div className="bg-purple-50 rounded-lg p-4">
						<div className="flex items-center gap-2 mb-2">
							<CloudArrowUpIcon className="h-5 w-5 text-purple-600" />
							<span className="text-sm font-medium text-purple-700">
								Respaldo
							</span>
						</div>
						<div className="text-sm text-purple-600">Programado</div>
					</div>
				</div>

				{unsavedChanges && (
					<div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
						<div className="flex items-center gap-2">
							<ExclamationCircleIcon className="h-5 w-5 text-yellow-600" />
							<span className="text-sm font-medium text-yellow-800">
								Tienes cambios sin guardar. No olvides guardar la configuración.
							</span>
						</div>
					</div>
				)}
			</div>

			{/* Configuration Sections */}
			<div className="space-y-4">
				{sections.map((section) => (
					<ConfigurationSection
						key={section.id}
						title={section.title}
						description={section.description}
						icon={section.icon}
						expanded={expandedSections.has(section.id)}
						onToggle={() => toggleSection(section.id)}
					>
						{section.component}
					</ConfigurationSection>
				))}
			</div>

			{/* Save Confirmation Dialog */}
			{showSaveDialog && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg max-w-md w-full mx-4 p-6">
						<div className="flex items-center gap-3 mb-4">
							<CheckCircleIcon className="h-6 w-6 text-green-600" />
							<h3 className="text-lg font-semibold text-gray-900">
								Confirmar Cambios
							</h3>
						</div>

						<p className="text-gray-600 mb-6">
							¿Estás seguro de que quieres guardar los cambios en la
							configuración del sistema? Algunos cambios pueden requerir
							reiniciar el sistema.
						</p>

						<div className="flex gap-3 justify-end">
							<button
								onClick={() => setShowSaveDialog(false)}
								className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
							>
								Cancelar
							</button>
							<button
								onClick={handleSave}
								disabled={isSaving}
								className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
							>
								{isSaving ? (
									<LoadingSpinner size="sm" />
								) : (
									<CheckCircleIcon className="h-4 w-4" />
								)}
								{isSaving ? "Guardando..." : "Guardar"}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default SystemConfiguration;
