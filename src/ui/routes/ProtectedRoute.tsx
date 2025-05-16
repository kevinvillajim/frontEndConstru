// src/ui/routes/ProtectedRoute.tsx

import React from "react";
import {Navigate, Outlet, useLocation} from "react-router-dom";
import {useAuth} from "../context/AuthContext";

/**
 * Componente que protege rutas que requieren autenticación
 * Redirige a la página de login si el usuario no está autenticado
 */
const ProtectedRoute: React.FC = () => {
	const {isAuthenticated, isLoading} = useAuth();
	const location = useLocation();

	// Mostrar spinner mientras verificamos autenticación
	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
			</div>
		);
	}

	// Redirigir a login si no está autenticado
	if (!isAuthenticated) {
		// Guardar la ruta a la que intentaban acceder para redirigir después del login
		return <Navigate to="/login" state={{from: location}} replace />;
	}

	// Si está autenticado, mostrar la ruta protegida
	return <Outlet />;
};

export default ProtectedRoute;
