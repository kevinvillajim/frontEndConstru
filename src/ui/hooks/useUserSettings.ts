// src/ui/hooks/useUserSettings.ts
import {useState, useEffect} from "react";
import {useAuth} from "../context/AuthContext";
import {useUserProfile} from "../context/UserProfileContext";

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

export const useUserSettings = () => {
	const {user} = useAuth();
	const {profile} = useUserProfile();
	const [settingsStatus, setSettingsStatus] = useState<UserSettingsStatus | null>(null);
	const [overallProgress, setOverallProgress] = useState(0);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (user && profile) {
			calculateSettingsStatus();
		}
	}, [user, profile]);

	const calculateSettingsStatus = () => {
		setIsLoading(true);
		
		const status: UserSettingsStatus = {
			personal: calculatePersonalStatus(),
			professional: calculateProfessionalStatus(),
			security: calculateSecurityStatus(),
			notifications: calculateNotificationsStatus(),
			preferences: calculatePreferencesStatus(),
			subscription: calculateSubscriptionStatus(),
			recommendations: calculateRecommendationsStatus(),
		};

		setSettingsStatus(status);
		setOverallProgress(calculateOverallProgress(status));
		setIsLoading(false);
	};

	const calculatePersonalStatus = () => {
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

		if (profile?.phoneNumber) progress += 10;
		else issues.push("Falta número de teléfono");

		if (profile?.location) progress += 10;
		else issues.push("Falta ubicación");

		return {
			complete: progress >= 90,
			progress,
			issues,
		};
	};

	const calculateProfessionalStatus = () => {
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

		if (info.specializations?.length > 0) progress += 20;
		else issues.push("Falta especialización");

		if (info.education?.length > 0) progress += 20;
		else issues.push("Falta información educativa");

		if (info.certifications?.length > 0) progress += 20;
		else issues.push("Falta certificaciones");

		if (info.portfolio?.length > 0) progress += 20;
		else issues.push("Falta portafolio");

		return {
			complete: progress >= 80,
			progress,
			issues,
		};
	};

	const calculateSecurityStatus = () => {
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

		// Verificar última actualización de contraseña
		const lastPasswordChange = profile?.lastPasswordChange || profile?.updatedAt;
		if (lastPasswordChange) {
			const daysSince = Math.floor(
				(Date.now() - new Date(lastPasswordChange).getTime()) / (1000 * 60 * 60 * 24)
			);
			if (daysSince > 180) {
				issues.push("Contraseña antigua (más de 6 meses)");
				needsAttention = true;
			}
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

	const calculateSubscriptionStatus = () => {
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

	const calculateRecommendationsStatus = () => {
		// El sistema de recomendaciones se considera completo si el usuario ha usado la plataforma
		const hasActivity = profile?.lastLogin || user?.createdAt;
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

	const getTopIssues = (): string[] => {
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
	};

	const getCompletionSummary = () => {
		if (!settingsStatus) return { complete: 0, total: 0 };

		const sections = Object.values(settingsStatus);
		const complete = sections.filter(s => s.complete).length;
		
		return {
			complete,
			total: sections.length,
		};
	};

	return {
		settingsStatus,
		overallProgress,
		isLoading,
		getTopIssues,
		getCompletionSummary,
		refreshStatus: calculateSettingsStatus,
	};
};