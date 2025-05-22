// src/ui/hooks/useUserSettings.ts
import {useState, useEffect, useMemo} from "react";
import {useAuth} from "../context/AuthContext";
import {useUserProfile} from "../context/UserProfileContext";
import type { User } from "../../core/domain/models/auth/AuthModels";
import type { UserProfile } from "../../core/domain/models/user/User";

export interface UserSettingsStatus {
	personal: {
		complete: boolean;
		progress: number;
		issues: string[];
	};
	professional: {
		complete: boolean;
		progress: number;
		issues: string[];
	};
	security: {
		complete: boolean;
		progress: number;
		issues: string[];
		needsAttention: boolean;
	};
	notifications: {
		complete: boolean;
		progress: number;
		issues: string[];
	};
	preferences: {
		complete: boolean;
		progress: number;
		issues: string[];
	};
	subscription: {
		complete: boolean;
		progress: number;
		issues: string[];
		needsUpgrade: boolean;
	};
	recommendations: {
		complete: boolean;
		progress: number;
		issues: string[];
	};
}

// Funciones de cálculo fuera del hook para evitar problemas de dependencias
const calculatePersonalStatus = (user: User | null, profile: UserProfile | null) => {
	const issues: string[] = [];
	let progress = 0;

	// Información básica (60% del progreso)
	if (user?.firstName) progress += 15;
	else issues.push("Falta nombre");

	if (user?.lastName) progress += 15;
	else issues.push("Falta apellido");

	if (user?.email) progress += 15;
	else issues.push("Falta email");

	if (user?.isVerified) progress += 15;
	else issues.push("Email no verificado");

	// Información adicional (40% del progreso)
	if (profile?.profilePicture) progress += 20;
	else issues.push("Falta foto de perfil");

	if (profile?.phone) progress += 10;
	else issues.push("Falta número de teléfono");

	if (profile?.location) progress += 10;
	else issues.push("Falta ubicación");

	return {
		complete: progress >= 90,
		progress,
		issues,
	};
};

const calculateProfessionalStatus = (_user: User | null, profile: UserProfile | null) => {
	const issues: string[] = [];
	let progress = 0;

	if (!profile?.professionalInfo) {
		return {
			complete: false,
			progress: 0,
			issues: ["Información profesional no completada"],
		};
	}

	const info = profile.professionalInfo;

	if (info.yearsOfExperience) progress += 20;
	else issues.push("Falta años de experiencia");

	if (info.specializations?.length && info.specializations.length > 0) progress += 20;
	else issues.push("Falta especialización");

	if (info.educationLevel) progress += 20;
	else issues.push("Falta información educativa");

	if (info.certifications?.length && info.certifications.length > 0) progress += 20;
	else issues.push("Falta certificaciones");

	if (info.portfolio?.length && info.portfolio.length > 0) progress += 20;
	else issues.push("Falta portafolio");

	return {
		complete: progress >= 80,
		progress,
		issues,
	};
};

const calculateSecurityStatus = (user: User | null) => {
	const issues: string[] = [];
	let progress = 40; // Base por tener cuenta
	let needsAttention = false;

	if (user?.twoFactorEnabled) {
		progress += 40;
	} else {
		issues.push("Autenticación de dos factores desactivada");
		needsAttention = true;
	}

	if (user?.isVerified) {
		progress += 20;
	} else {
		issues.push("Email no verificado");
		needsAttention = true;
	}

	return {
		complete: progress >= 90,
		progress,
		issues,
		needsAttention,
	};
};

const calculateNotificationsStatus = () => {
	// Asumimos que las notificaciones están configuradas por defecto
	return {
		complete: true,
		progress: 100,
		issues: [],
	};
};

const calculatePreferencesStatus = () => {
	// Asumimos que las preferencias básicas están configuradas
	return {
		complete: true,
		progress: 100,
		issues: [],
	};
};

const calculateSubscriptionStatus = (user: User | null) => {
	const issues: string[] = [];
	let progress = 60; // Base por tener cuenta
	let needsUpgrade = false;

	if (user?.subscriptionPlan === "free") {
		issues.push("Plan gratuito - funcionalidad limitada");
		needsUpgrade = true;
	} else {
		progress = 100;
	}

	return {
		complete: progress >= 90,
		progress,
		issues,
		needsUpgrade,
	};
};

const calculateRecommendationsStatus = (user: User | null) => {
	// El sistema de recomendaciones se considera completo si el usuario ha usado la plataforma
	const hasActivity = user?.createdAt;
	const progress = hasActivity ? 85 : 20;

	return {
		complete: progress >= 80,
		progress,
		issues: hasActivity ? [] : ["Sin actividad suficiente para recomendaciones"],
	};
};

const calculateOverallProgress = (status: UserSettingsStatus): number => {
	const weights = {
		personal: 0.2,
		professional: 0.2,
		security: 0.15,
		notifications: 0.1,
		preferences: 0.1,
		subscription: 0.15,
		recommendations: 0.1,
	};

	let totalProgress = 0;
	Object.entries(status).forEach(([key, value]) => {
		const weight = weights[key as keyof typeof weights];
		totalProgress += value.progress * weight;
	});

	return Math.round(totalProgress);
};

export const useUserSettings = () => {
	const {user} = useAuth();
	const {profile} = useUserProfile();
	const [isLoading, setIsLoading] = useState(true);

	// Usar useMemo para calcular el estado de configuración
	const settingsStatus = useMemo((): UserSettingsStatus | null => {
		if (!user) return null;

		return {
			personal: calculatePersonalStatus(user, profile),
			professional: calculateProfessionalStatus(user, profile),
			security: calculateSecurityStatus(user),
			notifications: calculateNotificationsStatus(),
			preferences: calculatePreferencesStatus(),
			subscription: calculateSubscriptionStatus(user),
			recommendations: calculateRecommendationsStatus(user),
		};
	}, [user, profile]);

	// Calcular progreso general
	const overallProgress = useMemo(() => {
		if (!settingsStatus) return 0;
		return calculateOverallProgress(settingsStatus);
	}, [settingsStatus]);

	// Obtener principales problemas
	const getTopIssues = useMemo((): string[] => {
		if (!settingsStatus) return [];

		const allIssues: string[] = [];
		
		// Priorizar issues de seguridad
		if (settingsStatus.security.needsAttention) {
			allIssues.push(...settingsStatus.security.issues);
		}

		// Luego issues de información personal
		allIssues.push(...settingsStatus.personal.issues.slice(0, 2));

		// Finalmente issues profesionales
		allIssues.push(...settingsStatus.professional.issues.slice(0, 2));

		return allIssues.slice(0, 5); // Máximo 5 issues
	}, [settingsStatus]);

	// Obtener resumen de completación
	const getCompletionSummary = useMemo(() => {
		if (!settingsStatus) return { complete: 0, total: 0 };

		const sections = Object.values(settingsStatus);
		const complete = sections.filter(s => s.complete).length;
		
		return {
			complete,
			total: sections.length,
		};
	}, [settingsStatus]);

	// Función para forzar recálculo
	const refreshStatus = () => {
		setIsLoading(true);
		// El estado se recalculará automáticamente gracias a useMemo
		setTimeout(() => setIsLoading(false), 100);
	};

	// Manejar estado de carga
	useEffect(() => {
		if (user) {
			setIsLoading(false);
		} else {
			setIsLoading(true);
		}
	}, [user, profile]);

	return {
		settingsStatus,
		overallProgress,
		isLoading,
		getTopIssues,
		getCompletionSummary,
		refreshStatus,
	};
};