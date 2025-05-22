// src/ui/config/settingsConfig.ts
import {
	UserCircleIcon,
	ShieldCheckIcon,
	BellIcon,
	BuildingOfficeIcon,
	StarIcon,
	GlobeAltIcon,
	CreditCardIcon,
} from "@heroicons/react/24/outline";
import type { ComponentType } from "react";

export interface SettingsSectionConfig {
	id: string;
	title: string;
	description: string;
	icon: ComponentType<React.SVGProps<SVGSVGElement>>;
	href: string;
	weight: number; // Para calcular progreso general
}

export const SETTINGS_SECTIONS: SettingsSectionConfig[] = [
	{
		id: "personal",
		title: "Información Personal",
		description: "Datos básicos, foto de perfil y contacto",
		icon: UserCircleIcon,
		href: "/profile/personal",
		weight: 0.2,
	},
	{
		id: "professional",
		title: "Información Profesional",
		description: "Experiencia, especialización y certificaciones",
		icon: BuildingOfficeIcon,
		href: "/profile/professional",
		weight: 0.2,
	},
	{
		id: "security",
		title: "Seguridad y Privacidad",
		description: "Contraseña, 2FA y configuraciones de seguridad",
		icon: ShieldCheckIcon,
		href: "/profile/security",
		weight: 0.15,
	},
	{
		id: "notifications",
		title: "Notificaciones",
		description: "Preferencias de comunicación y alertas",
		icon: BellIcon,
		href: "/profile/notifications",
		weight: 0.1,
	},
	{
		id: "preferences",
		title: "Preferencias Generales",
		description: "Idioma, moneda, formato de fecha y accesibilidad",
		icon: GlobeAltIcon,
		href: "/profile/preferences",
		weight: 0.1,
	},
	{
		id: "subscription",
		title: "Plan y Facturación",
		description: "Gestión de suscripción y métodos de pago",
		icon: CreditCardIcon,
		href: "/profile/subscription",
		weight: 0.15,
	},
	{
		id: "recommendations",
		title: "Recomendaciones y Analytics",
		description: "Análisis de comportamiento y sugerencias personalizadas",
		icon: StarIcon,
		href: "/profile/recommendations",
		weight: 0.1,
	},
];

export const QUICK_ACTIONS = [
	{
		id: "change-password",
		label: "Cambiar Contraseña",
		href: "/profile/security",
		priority: "high" as const,
	},
	{
		id: "notifications",
		label: "Configurar Alertas",
		href: "/profile/notifications",
		priority: "medium" as const,
	},
	{
		id: "upgrade",
		label: "Gestionar Plan",
		href: "/profile/subscription",
		priority: "medium" as const,
	},
] as const;

export const STATUS_COLORS = {
	complete: "border-green-200 bg-green-50",
	attention: "border-yellow-200 bg-yellow-50",
	incomplete: "border-gray-200 bg-gray-50",
} as const;

export const STATUS_MESSAGES = {
	complete: "Completo",
	attention: "Atención",
	incomplete: "Pendiente",
} as const;