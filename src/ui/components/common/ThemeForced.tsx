// src/ui/components/common/ThemeForced.tsx
import React from "react";
import {useTheme} from "../../context/ThemeContext";

interface ThemeForcedProps {
	forceTheme: "light" | "dark";
	children: React.ReactNode;
}

const ThemeForced: React.FC<ThemeForcedProps> = ({forceTheme, children}) => {
	// Aplicar estilos inline que sobrescriben cualquier estilo
	return (
		<div
			data-forced-theme={forceTheme}
			style={{
				// Para usar variables CSS customizadas en TypeScript
				["--override-color" as string]: "initial",
				// Truco para evitar herencia
				colorScheme: forceTheme as any,
			}}
			className={`theme-forced theme-forced-${forceTheme}`}
		>
			{children}
		</div>
	);
};

export default ThemeForced;
