// src/core/domain/models/user/User.ts
/**
 * Modelos relacionados con usuarios y perfiles
 */

// Tipos de género para usuarios
export enum UserGender {
	MALE = "male",
	FEMALE = "female",
	OTHER = "other",
	PREFER_NOT_TO_SAY = "prefer_not_to_say",
}

// Tipos de profesionales
export enum ProfessionalType {
	ARCHITECT = "architect",
	CIVIL_ENGINEER = "civil_engineer",
	CONSTRUCTOR = "constructor",
	CONTRACTOR = "contractor",
	ELECTRICIAN = "electrician",
	PLUMBER = "plumber",
	DESIGNER = "designer",
	OTHER = "other",
}

// Roles de usuario
export enum UserRole {
	ADMIN = "admin",
	USER = "user",
	SELLER = "seller",
	WORKER = "worker",
}

// Planes de suscripción
export enum SubscriptionPlan {
	FREE = "free",
	PREMIUM = "premium",
	ENTERPRISE = "enterprise",
	CUSTOM = "custom",
}

// Información de empresa del usuario
export interface UserCompany {
	name?: string;
	position?: string;
	industry?: string;
	website?: string;
	employeeCount?: number;
}

// Dirección del usuario
export interface UserAddress {
	id?: string;
	street?: string;
	city?: string;
	province?: string;
	postalCode?: string;
	country?: string;
	isMain?: boolean;
}

// Preferencias del usuario
export interface UserPreferences {
	language?: string;
	theme?: "light" | "dark" | "system";
	currency?: string;
	dateFormat?: string;
	timeFormat?: string; // 12h o 24h
	distanceUnit?: "metric" | "imperial";
	notifications?: {
		email?: boolean;
		push?: boolean;
		sms?: boolean;
		projectUpdates?: boolean;
		materialRecommendations?: boolean;
		pricingAlerts?: boolean;
		weeklyReports?: boolean;
		systemAnnouncements?: boolean;
		marketingEmails?: boolean;
	};
	accessibility?: {
		reducedMotion?: boolean;
		highContrast?: boolean;
		largeText?: boolean;
	};
}

// Estadísticas del usuario
export interface UserStats {
	projectsCompleted?: number;
	projectsInProgress?: number;
	projectsPlanned?: number;
	totalBudgetManaged?: number;
	averageProjectDuration?: number;
	memberSince?: Date;
	lastActive?: Date;
}

// Enlaces a redes sociales
export interface SocialLinks {
	facebook?: string;
	instagram?: string;
	linkedin?: string;
	twitter?: string;
	youtube?: string;
	website?: string;
}

// Dispositivo de notificaciones
export interface UserDevice {
	id?: string;
	deviceToken: string;
	deviceType?: string;
	lastUsed?: Date;
}

// Respuesta a operaciones de actualización de perfil
export interface ProfileUpdateResponse {
	success: boolean;
	message: string;
	data?: any;
}

// Modelo de usuario ampliado con toda la información de perfil
export interface UserProfile {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	phone?: string;
	mobilePhone?: string;
	dateOfBirth?: Date | string;
	nationalId?: string;
	gender?: UserGender;
	role: UserRole | string;
	professionalType: ProfessionalType | string;
	subscriptionPlan: SubscriptionPlan | string;
	profilePicture?: string;
	isActive?: boolean;
	isVerified?: boolean;
	specializations?: string[];
	yearsOfExperience?: number;
	educationLevel?: string;
	certifications?: string[];
	bio?: string;
	company?: UserCompany;
	addresses?: UserAddress[];
	preferences?: UserPreferences;
	stats?: UserStats;
	interests?: string[];
	referralCode?: string;
	referredBy?: string;
	socialLinks?: SocialLinks;
	verificationToken?: string;
	passwordResetToken?: string;
	passwordResetExpires?: Date;
	twoFactorEnabled?: boolean;
	twoFactorSecret?: string;
	recoveryCodes?: string[];
	devices?: UserDevice[];
	createdAt?: Date | string;
	updatedAt?: Date | string;
	deletedAt?: Date | string;
}
