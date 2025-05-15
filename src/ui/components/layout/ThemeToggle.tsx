import React from "react";
import {MoonIcon, SunIcon} from "@heroicons/react/24/outline";
import {useTheme} from "../../hooks/useTheme";

interface ThemeToggleProps {
	className?: string;
}

/**
 * Componente para cambiar entre modo claro y oscuro
 */
const ThemeToggle: React.FC<ThemeToggleProps> = ({className = ""}) => {
	const {theme, toggleTheme} = useTheme();

	return (
		<button
			onClick={toggleTheme}
			className={`cursor-pointer text-gray-700 transition-colors dark:text-gray-300 ${className}`}
			aria-label={
				theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
			}
			title={
				theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
			}
		>
			{theme === "dark" ? (
				<SunIcon className="h-5 w-5 sun-icon hover:text-yellow-400" />
			) : (
				<MoonIcon className="h-5 w-5 hover:text-primary-600" />
			)}
		</button>
	);
};

export default ThemeToggle;
