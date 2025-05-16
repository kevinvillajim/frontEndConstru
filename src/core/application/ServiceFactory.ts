// src/core/application/ServiceFactory.ts

import {AuthService} from "./auth/AuthService";
import {UserService} from "./user/UserService";
import {ApiAuthRepository} from "../adapters/api/ApiAuthRepository";
import {ApiUserRepository} from "../adapters/api/ApiUserRepository";
import type {AuthRepository} from "../domain/repositories/AuthRepository";
import type {UserRepository} from "../domain/repositories/UserRepository";

/**
 * Factory que proporciona instancias de servicios ya configuradas
 * Facilita el uso de inyección de dependencias y el testing
 */

// Crear instancias de repositorios
const authRepository = new ApiAuthRepository();
const userRepository = new ApiUserRepository();

// Crear y exportar instancias de servicios
export const authService = new AuthService(authRepository);
export const userService = new UserService(userRepository);

// Exportar función para crear servicios personalizados (útil para testing)
export const createAuthService = (
	customAuthRepository: AuthRepository
): AuthService => {
	return new AuthService(customAuthRepository);
};

export const createUserService = (
	customUserRepository: UserRepository
): UserService => {
	return new UserService(customUserRepository);
};
