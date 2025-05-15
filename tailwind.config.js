/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				primary: {
					50: "var(--color-primary-50)",
					100: "var(--color-primary-100)",
					200: "var(--color-primary-200)",
					300: "var(--color-primary-300)",
					400: "var(--color-primary-400)",
					500: "var(--color-primary-500)",
					600: "var(--color-primary-600)",
					700: "var(--color-primary-700)",
					800: "var(--color-primary-800)",
					900: "var(--color-primary-900)",
				},
				secondary: {
					50: "var(--color-secondary-50)",
					100: "var(--color-secondary-100)",
					200: "var(--color-secondary-200)",
					300: "var(--color-secondary-300)",
					400: "var(--color-secondary-400)",
					500: "var(--color-secondary-500)",
					600: "var(--color-secondary-600)",
					700: "var(--color-secondary-700)",
					800: "var(--color-secondary-800)",
					900: "var(--color-secondary-900)",
				},
				// Colores para dark mode
				dark: {
					bg: "var(--bg-main)",
					card: "var(--bg-card)",
					input: "var(--bg-input)",
					text: "var(--text-main)",
					textSecondary: "var(--text-secondary)",
					muted: "var(--text-muted)",
					border: "var(--border-color)",
				},
			},
			backgroundColor: {
				dark: "#263238",
				"dark-card": "#2c393f",
				"dark-hover": "#37474f",
			},
			textColor: {
				"dark-primary": "#fafafa",
				"dark-secondary": "#cfd8dc",
				"dark-muted": "#90a4ae",
			},
			borderColor: {
				"dark-border": "#37474f",
			},
			fontFamily: {
				sans: ["Raleway", "system-ui", "sans-serif"],
			},
		},
	},
	plugins: [darkModePlugin],
};
