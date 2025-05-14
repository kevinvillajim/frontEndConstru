// src/ui/context/ThemeContext.tsx
import React, {createContext, useContext, useEffect, useState} from "react";

type ThemeContextType = {
	isDarkMode: boolean;
	toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
	isDarkMode: false,
	toggleDarkMode: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({
	children,
}) => {
	// Verificar localStorage o preferencia del sistema
	const [isDarkMode, setIsDarkMode] = useState(() => {
		if (typeof window !== "undefined") {
			const savedTheme = localStorage.getItem("theme");
			return (
				savedTheme === "dark" ||
				(!savedTheme &&
					window.matchMedia("(prefers-color-scheme: dark)").matches)
			);
		}
		return false;
	});

	// Actualizar el DOM cuando cambia el modo
	useEffect(() => {
		if (typeof window !== "undefined") {
			const root = window.document.documentElement;

			if (isDarkMode) {
				root.classList.add("dark");
				localStorage.setItem("theme", "dark");
			} else {
				root.classList.remove("dark");
				localStorage.setItem("theme", "light");
			}
		}
	}, [isDarkMode]);

	// Función para cambiar el tema
	const toggleDarkMode = () => {
		setIsDarkMode((prev) => !prev);
	};

	return (
		<ThemeContext.Provider value={{isDarkMode, toggleDarkMode}}>
			{children}
		</ThemeContext.Provider>
	);
};
