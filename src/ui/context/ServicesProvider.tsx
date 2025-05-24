// src/ui/context/ServicesProvider.tsx

import React, {
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";
import type {ReactNode} from "react";
import {
	initializeServices,
	templateApplicationService,
	authService,
	userService,
} from "../../core/application/ServiceFactory";

// ==================== TYPES ====================
interface ServicesContextType {
	isInitialized: boolean;
	isLoading: boolean;
	error: string | null;
}

// ==================== CONTEXT ====================
const ServicesContext = createContext<ServicesContextType | undefined>(
	undefined
);

// ==================== PROVIDER ====================
interface ServicesProviderProps {
	children: ReactNode;
}

export const ServicesProvider: React.FC<ServicesProviderProps> = ({
	children,
}) => {
	const [isInitialized, setIsInitialized] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const initialize = async () => {
			try {
				setIsLoading(true);
				setError(null);

				const success = await initializeServices();

				if (success) {
					setIsInitialized(true);
				} else {
					setError("Error inicializando servicios");
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : "Error desconocido");
			} finally {
				setIsLoading(false);
			}
		};

		initialize();
	}, []);

	const contextValue: ServicesContextType = {
		isInitialized,
		isLoading,
		error,
	};

	// Si hay error o está cargando, mostrar los children de todas formas
	// para mantener la compatibilidad con tu App existente
	return (
		<ServicesContext.Provider value={contextValue}>
			{children}
		</ServicesContext.Provider>
	);
};

// ==================== HOOK ====================
export const useServices = (): ServicesContextType => {
	const context = useContext(ServicesContext);

	if (context === undefined) {
		throw new Error("useServices debe ser usado dentro de un ServicesProvider");
	}

	return context;
};

export default ServicesProvider;
