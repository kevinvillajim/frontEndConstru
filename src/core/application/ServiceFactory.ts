// src/core/application/ServiceFactory.ts

import {AuthService} from "./auth/AuthService";
import { ApiAuthRepository } from "../adapters/api/ApiAuthRepository";
import type {AuthRepository} from "../domain/repositories/AuthRepository";

/**
 * Factory que proporciona instancias de servicios ya configuradas
 * Facilita el uso de inyección de dependencias y el testing
 */

// Crear instancias de repositorios
const authRepository = new ApiAuthRepository();

// Crear y exportar instancias de servicios
export const authService = new AuthService(authRepository);

// Exportar función para crear servicios personalizados (útil para testing)
export const createAuthService = (
	customAuthRepository: AuthRepository
): AuthService => {
	return new AuthService(customAuthRepository);
};

