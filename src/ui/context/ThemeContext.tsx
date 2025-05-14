// src/ui/context/ThemeContext.tsx
import React, {createContext, useContext, useEffect, useState} from "react";

type ThemeContextType = {
	theme: "light" | "dark";
	toggleTheme: () => void;
	setTheme: (theme: "light" | "dark") => void;
};

const ThemeContext = createContext<ThemeContextType>({
	theme: "light",
	toggleTheme: () => {},
	setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({
	children,
}) => {
	// Inicializar tema desde localStorage o preferencia del sistema
	const [theme, setThemeState] = useState<"light" | "dark">(() => {
		if (typeof window !== "undefined") {
			const savedTheme = localStorage.getItem("theme") as
				| "light"
				| "dark"
				| null;
			if (savedTheme === "dark" || savedTheme === "light") {
				return savedTheme;
			}

			// Si no hay tema guardado, verificar preferencia del sistema
			return window.matchMedia("(prefers-color-scheme: dark)").matches
				? "dark"
				: "light";
		}
		return "light";
	});

	// Aplicar el tema al DOM
	useEffect(() => {
		if (typeof window !== "undefined") {
			const root = window.document.documentElement;

			// Eliminar clase anterior
			root.classList.remove("light", "dark");

			// Añadir la clase del tema actual
			root.classList.add(theme);

			// Guardar el tema en localStorage
			localStorage.setItem("theme", theme);
		}
	}, [theme]);

	// Escuchar cambios en la preferencia del sistema
	useEffect(() => {
		if (typeof window !== "undefined") {
			const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

			const handleChange = () => {
				// Solo cambiar automáticamente si el usuario no ha establecido una preferencia
				if (!localStorage.getItem("theme")) {
					setThemeState(mediaQuery.matches ? "dark" : "light");
				}
			};

			mediaQuery.addEventListener("change", handleChange);
			return () => mediaQuery.removeEventListener("change", handleChange);
		}
	}, []);

	const toggleTheme = () => {
		setThemeState((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
	};

	const setTheme = (newTheme: "light" | "dark") => {
		setThemeState(newTheme);
	};

	return (
		<ThemeContext.Provider value={{theme, toggleTheme, setTheme}}>
			{children}
		</ThemeContext.Provider>
	);
};

export default ThemeProvider;
