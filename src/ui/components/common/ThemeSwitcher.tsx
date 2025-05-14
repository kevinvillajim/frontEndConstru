// src/ui/components/ThemeSwitcher.tsx
import React from "react";
import {SunIcon, MoonIcon} from "@heroicons/react/24/outline";
import {useTheme} from "../../context/ThemeContext";

const ThemeSwitcher: React.FC = () => {
	const {theme, toggleTheme} = useTheme();

	return (
		<button
			onClick={toggleTheme}
			className="p-2 rounded-full transition-colors focus:outline-none"
			aria-label={
				theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
			}
			title={
				theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
			}
		>
			{theme === "dark" ? (
				<SunIcon className="h-5 w-5 text-yellow-300" />
			) : (
				<MoonIcon className="h-5 w-5 text-gray-700" />
			)}
		</button>
	);
};

export default ThemeSwitcher;