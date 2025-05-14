// src/ui/components/layout/ThemeSwitcher.tsx
import {useTheme} from "../../context/ThemeContext";
import {SunIcon, MoonIcon} from "@heroicons/react/24/outline";

const ThemeSwitcher = () => {
	const {isDarkMode, toggleDarkMode} = useTheme();

	return (
		<button
			onClick={toggleDarkMode}
			className="p-2 rounded-full focus:outline-none transition-colors duration-300"
			style={{
				backgroundColor: isDarkMode
					? "rgba(255, 255, 255, 0.1)"
					: "rgba(0, 0, 0, 0.05)",
			}}
			aria-label={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
		>
			{isDarkMode ? (
				<SunIcon className="h-5 w-5 text-yellow-300" />
			) : (
				<MoonIcon className="h-5 w-5 text-gray-700" />
			)}
		</button>
	);
};

export default ThemeSwitcher;
