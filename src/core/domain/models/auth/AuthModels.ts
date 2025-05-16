// src/core/domain/models/auth/AuthModels.ts

/**
 * Modelos relacionados con autenticación y usuario
 */

import {
	UserGender,
	ProfessionalType,
	UserRole,
	SubscriptionPlan,
	UserCompany,
	UserAddress,
	UserPreferences,
	UserStats,
} from "../../../domain/models/user/User";

// Solicitud de login
export interface LoginRequest {
	email: string;
	password: string;
	totpToken?: string;
}

// Respuesta del servidor al login
export interface LoginResponse {
	success: boolean;
	message: string;
	data?: User;
}

// Solicitud de registro
export interface RegisterRequest {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	professionalType: string;
	referralCode?: string;
}

// Respuesta del servidor al registro
export interface RegisterResponse {
	success: boolean;
	message: string;
	data?: {
		id: string;
		email: string;
	};
}

// Modelo de usuario
export interface User {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	role: string;
	subscriptionPlan: string;
	profilePicture?: string;
	professionalType: string;
	isActive?: boolean;
	isVerified?: boolean;

	// Campos adicionales que se usan en componentes de perfil
	phone?: string;
	mobilePhone?: string;
	dateOfBirth?: Date;
	nationalId?: string;
	gender?: UserGender;
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
	socialLinks?: {
		facebook?: string;
		instagram?: string;
		linkedin?: string;
		twitter?: string;
	};
	verificationToken?: string;
	passwordResetToken?: string;
	passwordResetExpires?: Date;
	adminId?: string;
	twoFactorEnabled?: boolean;
	twoFactorSecret?: string;
	recoveryCodes?: string[];
	createdAt?: Date;
	updatedAt?: Date;
	deletedAt?: Date;
}

// Estructura de error API
export interface ApiError {
	success: false;
	message: string;
	errors?: Array<{
		field: string;
		message: string;
	}>;
}
