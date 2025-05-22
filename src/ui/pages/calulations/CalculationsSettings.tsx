import React, {useState} from "react";
import {
	Cog6ToothIcon,
	CalculatorIcon,
	BellIcon,
	ShieldCheckIcon,
	DocumentTextIcon,
	CheckIcon,
	ExclamationTriangleIcon,
	ArrowPathIcon,
	DocumentArrowDownIcon,
	BuildingOfficeIcon,
} from "@heroicons/react/24/outline";

// Tipos de datos
interface UserPreferences {
	// Configuración general
	defaultUnits: {
		length: "mm" | "cm" | "m" | "ft" | "in";
		area: "mm²" | "cm²" | "m²" | "ft²" | "in²";
		volume: "mm³" | "cm³" | "m³" | "ft³" | "in³";
		force: "N" | "kN" | "kgf" | "lbf";
		pressure: "Pa" | "kPa" | "MPa" | "psi" | "kgf/cm²";
		temperature: "°C" | "°F" | "K";
	};
	language: "es" | "en";
	timezone: string;
	decimalPlaces: number;
	thousandsSeparator: "," | "." | " ";
	decimalSeparator: "," | ".";

	// Configuración de cálculos
	autoSave: boolean;
	autoSaveInterval: number; // minutos
	showTooltips: boolean;
	showParameterHelp: boolean;
	validateInputs: boolean;
	strictValidation: boolean;
	warningLevel: "low" | "medium" | "high";
	showFormulas: boolean;

	// Configuración de plantillas
	defaultCategory: string;
	favoriteTemplates: string[];
	recentTemplatesCount: number;
	showTemplatePreview: boolean;
	enableTemplateSharing: boolean;

	// Notificaciones
	emailNotifications: {
		calculationComplete: boolean;
		templateUpdates: boolean;
		necUpdates: boolean;
		weeklyReport: boolean;
	};
	pushNotifications: {
		enabled: boolean;
		calculationComplete: boolean;
		collaborationInvites: boolean;
		systemMaintenance: boolean;
	};

	// Exportación y reportes
	defaultExportFormat: "pdf" | "xlsx" | "docx" | "csv";
	includeCalculationDetails: boolean;
	includeNecReferences: boolean;
	includeTimestamp: boolean;
	companyLogo?: string;
	reportTemplate: "standard" | "detailed" | "summary";

	// Seguridad y privacidad
	twoFactorEnabled: boolean;
	shareCalculationsPublicly: boolean;
	allowDataCollection: boolean;
	sessionTimeout: number; // minutos
}

const defaultPreferences: UserPreferences = {
	defaultUnits: {
		length: "m",
		area: "m²",
		volume: "m³",
		force: "kN",
		pressure: "MPa",
		temperature: "°C",
	},
	language: "es",
	timezone: "America/Guayaquil",
	decimalPlaces: 2,
	thousandsSeparator: ",",
	decimalSeparator: ".",

	autoSave: true,
	autoSaveInterval: 5,
	showTooltips: true,
	showParameterHelp: true,
	validateInputs: true,
	strictValidation: false,
	warningLevel: "medium",
	showFormulas: false,

	defaultCategory: "structural",
	favoriteTemplates: [],
	recentTemplatesCount: 10,
	showTemplatePreview: true,
	enableTemplateSharing: true,

	emailNotifications: {
		calculationComplete: false,
		templateUpdates: true,
		necUpdates: true,
		weeklyReport: false,
	},
	pushNotifications: {
		enabled: true,
		calculationComplete: true,
		collaborationInvites: true,
		systemMaintenance: true,
	},

	defaultExportFormat: "pdf",
	includeCalculationDetails: true,
	includeNecReferences: true,
	includeTimestamp: true,
	reportTemplate: "standard",

	twoFactorEnabled: false,
	shareCalculationsPublicly: false,
	allowDataCollection: true,
	sessionTimeout: 60,
};

const CalculationsSettings: React.FC = () => {
	const [preferences, setPreferences] =
		useState<UserPreferences>(defaultPreferences);
	const [activeSection, setActiveSection] = useState("general");
	const [hasChanges, setHasChanges] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [showResetConfirm, setShowResetConfirm] = useState(false);

	const sections = [
		{id: "general", name: "General", icon: Cog6ToothIcon},
		{id: "calculations", name: "Cálculos", icon: CalculatorIcon},
		{id: "templates", name: "Plantillas", icon: DocumentTextIcon},
		{id: "notifications", name: "Notificaciones", icon: BellIcon},
		{id: "export", name: "Exportación", icon: DocumentArrowDownIcon},
		{id: "security", name: "Seguridad", icon: ShieldCheckIcon},
	];

	const unitOptions = {
		length: [
			{value: "mm", label: "Milímetros (mm)"},
			{value: "cm", label: "Centímetros (cm)"},
			{value: "m", label: "Metros (m)"},
			{value: "ft", label: "Pies (ft)"},
			{value: "in", label: "Pulgadas (in)"},
		],
		area: [
			{value: "mm²", label: "Milímetros cuadrados (mm²)"},
			{value: "cm²", label: "Centímetros cuadrados (cm²)"},
			{value: "m²", label: "Metros cuadrados (m²)"},
			{value: "ft²", label: "Pies cuadrados (ft²)"},
			{value: "in²", label: "Pulgadas cuadradas (in²)"},
		],
		force: [
			{value: "N", label: "Newtons (N)"},
			{value: "kN", label: "Kilonewtons (kN)"},
			{value: "kgf", label: "Kilogramos fuerza (kgf)"},
			{value: "lbf", label: "Libras fuerza (lbf)"},
		],
		pressure: [
			{value: "Pa", label: "Pascales (Pa)"},
			{value: "kPa", label: "Kilopascales (kPa)"},
			{value: "MPa", label: "Megapascales (MPa)"},
			{value: "psi", label: "Libras por pulgada cuadrada (psi)"},
			{value: "kgf/cm²", label: "Kilogramos fuerza por cm² (kgf/cm²)"},
		],
	};

	const updatePreference = <K extends keyof UserPreferences>(
		key: K,
		value: UserPreferences[K]
	) => {
		setPreferences((prev) => ({...prev, [key]: value}));
		setHasChanges(true);
	};

	const updateNestedPreference = <T extends keyof UserPreferences>(
		section: T,
		key: keyof UserPreferences[T],
		value: any
	) => {
		setPreferences((prev) => ({
			...prev,
			[section]: {
				...(prev[section] as Record<string, unknown>),
				[key]: value,
			},
		}));
		setHasChanges(true);
	};

	const saveSettings = async () => {
		setIsSaving(true);
		try {
			// Aquí iría la lógica para guardar en el backend
			await new Promise((resolve) => setTimeout(resolve, 1000));
			setHasChanges(false);
			console.log("Configuración guardada:", preferences);
		} catch (error) {
			console.error("Error al guardar configuración:", error);
		} finally {
			setIsSaving(false);
		}
	};

	const resetToDefaults = () => {
		setPreferences(defaultPreferences);
		setHasChanges(true);
		setShowResetConfirm(false);
	};

	const renderGeneralSettings = () => (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-semibold text-gray-900 mb-4">
					Configuración Regional
				</h3>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Idioma
						</label>
						<select
							value={preferences.language}
							onChange={(e) =>
								updatePreference("language", e.target.value as "es" | "en")
							}
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
							value={preferences.timezone}
							onChange={(e) => updatePreference("timezone", e.target.value)}
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
						>
							<option value="America/Guayaquil">Ecuador (-05:00)</option>
							<option value="America/Bogota">Colombia (-05:00)</option>
							<option value="America/Lima">Perú (-05:00)</option>
							<option value="America/New_York">Nueva York (-05:00)</option>
						</select>
					</div>
				</div>
			</div>

			<div>
				<h3 className="text-lg font-semibold text-gray-900 mb-4">
					Formato de Números
				</h3>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Lugares Decimales
						</label>
						<select
							value={preferences.decimalPlaces}
							onChange={(e) =>
								updatePreference("decimalPlaces", Number(e.target.value))
							}
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
						>
							<option value={0}>0 decimales</option>
							<option value={1}>1 decimal</option>
							<option value={2}>2 decimales</option>
							<option value={3}>3 decimales</option>
							<option value={4}>4 decimales</option>
						</select>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Separador de Miles
						</label>
						<select
							value={preferences.thousandsSeparator}
							onChange={(e) =>
								updatePreference(
									"thousandsSeparator",
									e.target.value as "," | "." | " "
								)
							}
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
						>
							<option value=",">Coma (1,000)</option>
							<option value=".">Punto (1.000)</option>
							<option value=" ">Espacio (1 000)</option>
						</select>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Separador Decimal
						</label>
						<select
							value={preferences.decimalSeparator}
							onChange={(e) =>
								updatePreference(
									"decimalSeparator",
									e.target.value as "," | "."
								)
							}
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
						>
							<option value=".">Punto (12.34)</option>
							<option value=",">Coma (12,34)</option>
						</select>
					</div>
				</div>
			</div>

			<div>
				<h3 className="text-lg font-semibold text-gray-900 mb-4">
					Unidades por Defecto
				</h3>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{Object.entries(unitOptions).map(([unitType, options]) => (
						<div key={unitType}>
							<label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
								{unitType === "length"
									? "Longitud"
									: unitType === "area"
										? "Área"
										: unitType === "force"
											? "Fuerza"
											: unitType === "pressure"
												? "Presión"
												: unitType}
							</label>
							<select
								value={
									preferences.defaultUnits[
										unitType as keyof typeof preferences.defaultUnits
									]
								}
								onChange={(e) =>
									updateNestedPreference(
										"defaultUnits",
										unitType as any,
										e.target.value
									)
								}
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
							>
								{options.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</select>
						</div>
					))}
				</div>
			</div>
		</div>
	);

	const renderCalculationSettings = () => (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-semibold text-gray-900 mb-4">
					Autoguardado
				</h3>

				<div className="space-y-4">
					<label className="flex items-center">
						<input
							type="checkbox"
							checked={preferences.autoSave}
							onChange={(e) => updatePreference("autoSave", e.target.checked)}
							className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
						/>
						<span className="ml-3 text-sm text-gray-700">
							Activar autoguardado automático
						</span>
					</label>

					{preferences.autoSave && (
						<div className="ml-7">
							<label className="block text-sm text-gray-600 mb-2">
								Intervalo de autoguardado
							</label>
							<select
								value={preferences.autoSaveInterval}
								onChange={(e) =>
									updatePreference("autoSaveInterval", Number(e.target.value))
								}
								className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
							>
								<option value={1}>Cada 1 minuto</option>
								<option value={2}>Cada 2 minutos</option>
								<option value={5}>Cada 5 minutos</option>
								<option value={10}>Cada 10 minutos</option>
								<option value={15}>Cada 15 minutos</option>
							</select>
						</div>
					)}
				</div>
			</div>

			<div>
				<h3 className="text-lg font-semibold text-gray-900 mb-4">
					Ayuda y Asistencia
				</h3>

				<div className="space-y-4">
					<label className="flex items-center">
						<input
							type="checkbox"
							checked={preferences.showTooltips}
							onChange={(e) =>
								updatePreference("showTooltips", e.target.checked)
							}
							className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
						/>
						<span className="ml-3 text-sm text-gray-700">
							Mostrar tooltips informativos
						</span>
					</label>

					<label className="flex items-center">
						<input
							type="checkbox"
							checked={preferences.showParameterHelp}
							onChange={(e) =>
								updatePreference("showParameterHelp", e.target.checked)
							}
							className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
						/>
						<span className="ml-3 text-sm text-gray-700">
							Mostrar ayuda de parámetros
						</span>
					</label>

					<label className="flex items-center">
						<input
							type="checkbox"
							checked={preferences.showFormulas}
							onChange={(e) =>
								updatePreference("showFormulas", e.target.checked)
							}
							className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
						/>
						<span className="ml-3 text-sm text-gray-700">
							Mostrar fórmulas matemáticas utilizadas
						</span>
					</label>
				</div>
			</div>

			<div>
				<h3 className="text-lg font-semibold text-gray-900 mb-4">
					Validación de Entradas
				</h3>

				<div className="space-y-4">
					<label className="flex items-center">
						<input
							type="checkbox"
							checked={preferences.validateInputs}
							onChange={(e) =>
								updatePreference("validateInputs", e.target.checked)
							}
							className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
						/>
						<span className="ml-3 text-sm text-gray-700">
							Validar entradas en tiempo real
						</span>
					</label>

					{preferences.validateInputs && (
						<div className="ml-7 space-y-3">
							<label className="flex items-center">
								<input
									type="checkbox"
									checked={preferences.strictValidation}
									onChange={(e) =>
										updatePreference("strictValidation", e.target.checked)
									}
									className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
								/>
								<span className="ml-3 text-sm text-gray-600">
									Validación estricta (no permitir valores fuera de rango)
								</span>
							</label>

							<div>
								<label className="block text-sm text-gray-600 mb-2">
									Nivel de advertencias
								</label>
								<select
									value={preferences.warningLevel}
									onChange={(e) =>
										updatePreference(
											"warningLevel",
											e.target.value as "low" | "medium" | "high"
										)
									}
									className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
								>
									<option value="low">Bajo - Solo errores críticos</option>
									<option value="medium">
										Medio - Errores y advertencias importantes
									</option>
									<option value="high">Alto - Todas las advertencias</option>
								</select>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);

	const renderTemplateSettings = () => (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-semibold text-gray-900 mb-4">
					Configuración de Plantillas
				</h3>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Categoría por Defecto
						</label>
						<select
							value={preferences.defaultCategory}
							onChange={(e) =>
								updatePreference("defaultCategory", e.target.value)
							}
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
						>
							<option value="structural">🏗️ Estructural</option>
							<option value="electrical">⚡ Eléctrico</option>
							<option value="architectural">🏛️ Arquitectónico</option>
							<option value="hydraulic">🚰 Hidráulico</option>
						</select>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Plantillas Recientes a Mostrar
						</label>
						<select
							value={preferences.recentTemplatesCount}
							onChange={(e) =>
								updatePreference("recentTemplatesCount", Number(e.target.value))
							}
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
						>
							<option value={5}>5 plantillas</option>
							<option value={10}>10 plantillas</option>
							<option value={15}>15 plantillas</option>
							<option value={20}>20 plantillas</option>
						</select>
					</div>
				</div>
			</div>

			<div>
				<h3 className="text-lg font-semibold text-gray-900 mb-4">
					Opciones de Visualización
				</h3>

				<div className="space-y-4">
					<label className="flex items-center">
						<input
							type="checkbox"
							checked={preferences.showTemplatePreview}
							onChange={(e) =>
								updatePreference("showTemplatePreview", e.target.checked)
							}
							className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
						/>
						<span className="ml-3 text-sm text-gray-700">
							Mostrar vista previa de plantillas
						</span>
					</label>

					<label className="flex items-center">
						<input
							type="checkbox"
							checked={preferences.enableTemplateSharing}
							onChange={(e) =>
								updatePreference("enableTemplateSharing", e.target.checked)
							}
							className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
						/>
						<span className="ml-3 text-sm text-gray-700">
							Permitir compartir plantillas con otros usuarios
						</span>
					</label>
				</div>
			</div>
		</div>
	);

	const renderNotificationSettings = () => (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-semibold text-gray-900 mb-4">
					Notificaciones por Email
				</h3>

				<div className="space-y-4">
					<label className="flex items-center justify-between">
						<div>
							<span className="text-sm font-medium text-gray-700">
								Cálculo completado
							</span>
							<p className="text-xs text-gray-500">
								Recibir email cuando un cálculo largo termine
							</p>
						</div>
						<input
							type="checkbox"
							checked={preferences.emailNotifications.calculationComplete}
							onChange={(e) =>
								updateNestedPreference(
									"emailNotifications",
									"calculationComplete",
									e.target.checked
								)
							}
							className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
						/>
					</label>

					<label className="flex items-center justify-between">
						<div>
							<span className="text-sm font-medium text-gray-700">
								Actualizaciones de plantillas
							</span>
							<p className="text-xs text-gray-500">
								Nuevas versiones de plantillas que usas frecuentemente
							</p>
						</div>
						<input
							type="checkbox"
							checked={preferences.emailNotifications.templateUpdates}
							onChange={(e) =>
								updateNestedPreference(
									"emailNotifications",
									"templateUpdates",
									e.target.checked
								)
							}
							className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
						/>
					</label>

					<label className="flex items-center justify-between">
						<div>
							<span className="text-sm font-medium text-gray-700">
								Actualizaciones NEC
							</span>
							<p className="text-xs text-gray-500">
								Cambios en la normativa ecuatoriana de construcción
							</p>
						</div>
						<input
							type="checkbox"
							checked={preferences.emailNotifications.necUpdates}
							onChange={(e) =>
								updateNestedPreference(
									"emailNotifications",
									"necUpdates",
									e.target.checked
								)
							}
							className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
						/>
					</label>

					<label className="flex items-center justify-between">
						<div>
							<span className="text-sm font-medium text-gray-700">
								Reporte semanal
							</span>
							<p className="text-xs text-gray-500">
								Resumen de tu actividad semanal
							</p>
						</div>
						<input
							type="checkbox"
							checked={preferences.emailNotifications.weeklyReport}
							onChange={(e) =>
								updateNestedPreference(
									"emailNotifications",
									"weeklyReport",
									e.target.checked
								)
							}
							className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
						/>
					</label>
				</div>
			</div>

			<div>
				<h3 className="text-lg font-semibold text-gray-900 mb-4">
					Notificaciones Push
				</h3>

				<div className="space-y-4">
					<label className="flex items-center justify-between">
						<div>
							<span className="text-sm font-medium text-gray-700">
								Habilitar notificaciones push
							</span>
							<p className="text-xs text-gray-500">
								Recibir notificaciones en tiempo real en el navegador
							</p>
						</div>
						<input
							type="checkbox"
							checked={preferences.pushNotifications.enabled}
							onChange={(e) =>
								updateNestedPreference(
									"pushNotifications",
									"enabled",
									e.target.checked
								)
							}
							className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
						/>
					</label>

					{preferences.pushNotifications.enabled && (
						<div className="ml-4 space-y-3 border-l-2 border-gray-200 pl-4">
							<label className="flex items-center justify-between">
								<span className="text-sm text-gray-700">
									Cálculo completado
								</span>
								<input
									type="checkbox"
									checked={preferences.pushNotifications.calculationComplete}
									onChange={(e) =>
										updateNestedPreference(
											"pushNotifications",
											"calculationComplete",
											e.target.checked
										)
									}
									className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
								/>
							</label>

							<label className="flex items-center justify-between">
								<span className="text-sm text-gray-700">
									Invitaciones de colaboración
								</span>
								<input
									type="checkbox"
									checked={preferences.pushNotifications.collaborationInvites}
									onChange={(e) =>
										updateNestedPreference(
											"pushNotifications",
											"collaborationInvites",
											e.target.checked
										)
									}
									className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
								/>
							</label>

							<label className="flex items-center justify-between">
								<span className="text-sm text-gray-700">
									Mantenimiento del sistema
								</span>
								<input
									type="checkbox"
									checked={preferences.pushNotifications.systemMaintenance}
									onChange={(e) =>
										updateNestedPreference(
											"pushNotifications",
											"systemMaintenance",
											e.target.checked
										)
									}
									className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
								/>
							</label>
						</div>
					)}
				</div>
			</div>
		</div>
	);

	const renderExportSettings = () => (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-semibold text-gray-900 mb-4">
					Configuración de Exportación
				</h3>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Formato por Defecto
						</label>
						<select
							value={preferences.defaultExportFormat}
							onChange={(e) =>
								updatePreference("defaultExportFormat", e.target.value as any)
							}
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
						>
							<option value="pdf">PDF - Reporte completo</option>
							<option value="xlsx">Excel - Datos y cálculos</option>
							<option value="docx">Word - Documento técnico</option>
							<option value="csv">CSV - Solo datos</option>
						</select>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Plantilla de Reporte
						</label>
						<select
							value={preferences.reportTemplate}
							onChange={(e) =>
								updatePreference("reportTemplate", e.target.value as any)
							}
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
						>
							<option value="standard">Estándar - Información esencial</option>
							<option value="detailed">
								Detallado - Incluye todos los datos
							</option>
							<option value="summary">
								Resumen - Solo resultados principales
							</option>
						</select>
					</div>
				</div>
			</div>

			<div>
				<h3 className="text-lg font-semibold text-gray-900 mb-4">
					Contenido a Incluir
				</h3>

				<div className="space-y-4">
					<label className="flex items-center">
						<input
							type="checkbox"
							checked={preferences.includeCalculationDetails}
							onChange={(e) =>
								updatePreference("includeCalculationDetails", e.target.checked)
							}
							className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
						/>
						<span className="ml-3 text-sm text-gray-700">
							Incluir detalles de cálculo y fórmulas
						</span>
					</label>

					<label className="flex items-center">
						<input
							type="checkbox"
							checked={preferences.includeNecReferences}
							onChange={(e) =>
								updatePreference("includeNecReferences", e.target.checked)
							}
							className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
						/>
						<span className="ml-3 text-sm text-gray-700">
							Incluir referencias normativas NEC
						</span>
					</label>

					<label className="flex items-center">
						<input
							type="checkbox"
							checked={preferences.includeTimestamp}
							onChange={(e) =>
								updatePreference("includeTimestamp", e.target.checked)
							}
							className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
						/>
						<span className="ml-3 text-sm text-gray-700">
							Incluir fecha y hora de generación
						</span>
					</label>
				</div>
			</div>

			<div>
				<h3 className="text-lg font-semibold text-gray-900 mb-4">
					Personalización
				</h3>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Logo de Empresa (Opcional)
					</label>
					<div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-primary-400 transition-colors">
						<div className="space-y-1 text-center">
							<BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
							<div className="flex text-sm text-gray-600">
								<label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
									<span>Subir logo</span>
									<input type="file" className="sr-only" accept="image/*" />
								</label>
								<p className="pl-1">o arrastrar y soltar</p>
							</div>
							<p className="text-xs text-gray-500">PNG, JPG hasta 10MB</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);

	const renderSecuritySettings = () => (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-semibold text-gray-900 mb-4">
					Autenticación
				</h3>

				<div className="space-y-4">
					<div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
						<div>
							<span className="text-sm font-medium text-gray-700">
								Autenticación de Dos Factores (2FA)
							</span>
							<p className="text-xs text-gray-500">
								Agregar una capa extra de seguridad a tu cuenta
							</p>
						</div>
						<div className="flex items-center gap-3">
							{preferences.twoFactorEnabled ? (
								<span className="text-green-600 text-sm font-medium">
									Activado
								</span>
							) : (
								<span className="text-gray-500 text-sm">Desactivado</span>
							)}
							<button className="px-3 py-1 text-sm border border-primary-600 text-primary-600 rounded hover:bg-primary-50 transition-colors">
								{preferences.twoFactorEnabled ? "Configurar" : "Activar"}
							</button>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Tiempo de Sesión (minutos)
						</label>
						<select
							value={preferences.sessionTimeout}
							onChange={(e) =>
								updatePreference("sessionTimeout", Number(e.target.value))
							}
							className="w-full max-w-xs px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
						>
							<option value={15}>15 minutos</option>
							<option value={30}>30 minutos</option>
							<option value={60}>1 hora</option>
							<option value={120}>2 horas</option>
							<option value={240}>4 horas</option>
							<option value={480}>8 horas</option>
						</select>
						<p className="text-xs text-gray-500 mt-1">
							Tu sesión se cerrará automáticamente después de este tiempo de
							inactividad
						</p>
					</div>
				</div>
			</div>

			<div>
				<h3 className="text-lg font-semibold text-gray-900 mb-4">Privacidad</h3>

				<div className="space-y-4">
					<label className="flex items-center justify-between">
						<div>
							<span className="text-sm font-medium text-gray-700">
								Compartir cálculos públicamente
							</span>
							<p className="text-xs text-gray-500">
								Permitir que otros usuarios vean tus cálculos públicos
							</p>
						</div>
						<input
							type="checkbox"
							checked={preferences.shareCalculationsPublicly}
							onChange={(e) =>
								updatePreference("shareCalculationsPublicly", e.target.checked)
							}
							className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
						/>
					</label>

					<label className="flex items-center justify-between">
						<div>
							<span className="text-sm font-medium text-gray-700">
								Permitir recopilación de datos de uso
							</span>
							<p className="text-xs text-gray-500">
								Ayúdanos a mejorar la plataforma compartiendo datos anónimos de
								uso
							</p>
						</div>
						<input
							type="checkbox"
							checked={preferences.allowDataCollection}
							onChange={(e) =>
								updatePreference("allowDataCollection", e.target.checked)
							}
							className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
						/>
					</label>
				</div>
			</div>
		</div>
	);

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white border-b border-gray-200 sticky top-0 z-40">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-2xl font-bold text-gray-900">
								Configuración de Cálculos
							</h1>
							<p className="text-sm text-gray-600">
								Personaliza tu experiencia con las herramientas de cálculo
							</p>
						</div>

						<div className="flex items-center gap-3">
							{hasChanges && (
								<div className="flex items-center gap-2 text-sm text-yellow-600 bg-yellow-50 px-3 py-1 rounded-lg">
									<ExclamationTriangleIcon className="h-4 w-4" />
									Cambios sin guardar
								</div>
							)}

							<button
								onClick={() => setShowResetConfirm(true)}
								className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
							>
								<ArrowPathIcon className="h-4 w-4" />
								Restablecer
							</button>

							<button
								onClick={saveSettings}
								disabled={!hasChanges || isSaving}
								className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
							>
								{isSaving ? (
									<>
										<div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent" />
										Guardando...
									</>
								) : (
									<>
										<CheckIcon className="h-4 w-4" />
										Guardar Cambios
									</>
								)}
							</button>
						</div>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex gap-8">
					{/* Navegación por secciones */}
					<div className="w-64 flex-shrink-0">
						<nav className="space-y-2">
							{sections.map((section) => (
								<button
									key={section.id}
									onClick={() => setActiveSection(section.id)}
									className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition-colors ${
										activeSection === section.id
											? "bg-primary-100 text-primary-700 border border-primary-200"
											: "text-gray-600 hover:bg-gray-100"
									}`}
								>
									<section.icon className="h-5 w-5" />
									{section.name}
								</button>
							))}
						</nav>
					</div>

					{/* Contenido principal */}
					<div className="flex-1">
						<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
							{activeSection === "general" && renderGeneralSettings()}
							{activeSection === "calculations" && renderCalculationSettings()}
							{activeSection === "templates" && renderTemplateSettings()}
							{activeSection === "notifications" &&
								renderNotificationSettings()}
							{activeSection === "export" && renderExportSettings()}
							{activeSection === "security" && renderSecuritySettings()}
						</div>
					</div>
				</div>
			</div>

			{/* Modal de confirmación para restablecer */}
			{showResetConfirm && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
						<div className="flex items-center gap-3 mb-4">
							<ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />
							<h3 className="text-lg font-semibold text-gray-900">
								Restablecer Configuración
							</h3>
						</div>

						<p className="text-gray-600 mb-6">
							¿Estás seguro de que quieres restablecer toda la configuración a
							los valores por defecto? Esta acción no se puede deshacer.
						</p>

						<div className="flex justify-end gap-3">
							<button
								onClick={() => setShowResetConfirm(false)}
								className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
							>
								Cancelar
							</button>
							<button
								onClick={resetToDefaults}
								className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
							>
								Restablecer
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default CalculationsSettings;
