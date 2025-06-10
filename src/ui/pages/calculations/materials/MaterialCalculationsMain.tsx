// src/ui/pages/calculations/materials/MaterialCalculationsMain.tsx
import React, {useState, useRef, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import {
	BeakerIcon,
	RectangleStackIcon,
	ClockIcon,
	ArrowTrendingUpIcon,
	PlayIcon,
	SparklesIcon,
	UserGroupIcon,
	PlusIcon,
	CpuChipIcon,
} from "@heroicons/react/24/outline";

// Configuración de navegación principal mejorada
const MAIN_SECTIONS = [
	{
		id: "catalog",
		name: "Catálogo de Materiales",
		description:
			"Plantillas públicas verificadas para cálculos de materiales y propiedades",
		icon: RectangleStackIcon,
		route: "/calculations/materials/catalog",
		color: "from-blue-500 to-blue-600",
		bgColor: "bg-blue-50",
		borderColor: "border-blue-200",
		textColor: "text-blue-700",
		badge: "156 plantillas",
		isMain: true,
	},
	{
		id: "templates",
		name: "Mis Plantillas",
		description: "Crea y gestiona tus plantillas personales de materiales",
		icon: BeakerIcon,
		route: "/calculations/materials/templates",
		color: "from-emerald-500 to-emerald-600",
		bgColor: "bg-emerald-50",
		borderColor: "border-emerald-200",
		textColor: "text-emerald-700",
		badge: "Crear nueva",
		isMain: true,
	},
	{
		id: "results",
		name: "Historial de Resultados",
		description: "Resultados guardados y historial de cálculos ejecutados",
		icon: ClockIcon,
		route: "/calculations/materials/results",
		color: "from-amber-500 to-amber-600",
		bgColor: "bg-amber-50",
		borderColor: "border-amber-200",
		textColor: "text-amber-700",
		badge: "42 resultados",
		isMain: true,
	},
	{
		id: "trending",
		name: "Tendencias y Analytics",
		description: "Plantillas populares, análisis de uso y estadísticas",
		icon: ArrowTrendingUpIcon,
		route: "/calculations/materials/trending",
		color: "from-purple-500 to-purple-600",
		bgColor: "bg-purple-50",
		borderColor: "border-purple-200",
		textColor: "text-purple-700",
		badge: "Análisis",
		isMain: true,
	},
];

// Estadísticas rápidas mejoradas
const QUICK_STATS = [
	{
		label: "Plantillas Activas",
		value: "156",
		change: "+12",
		icon: RectangleStackIcon,
		color: "from-blue-500 to-blue-600",
	},
	{
		label: "Cálculos Este Mes",
		value: "2.4k",
		change: "+18",
		icon: CpuChipIcon,
		color: "from-emerald-500 to-emerald-600",
	},
	{
		label: "Usuarios Activos",
		value: "834",
		change: "+7",
		icon: UserGroupIcon,
		color: "from-purple-500 to-purple-600",
	},
	{
		label: "Nuevas Plantillas",
		value: "23",
		change: "+5",
		icon: SparklesIcon,
		color: "from-amber-500 to-amber-600",
	},
];

// Actividad reciente simulada
const RECENT_ACTIVITY = [
	{
		id: 1,
		type: "calculation",
		title: "Dosificación de Hormigón H21",
		user: "María García",
		time: "Hace 2 minutos",
		icon: PlayIcon,
		color: "text-green-600",
	},
	{
		id: 2,
		type: "template",
		title: "Nueva plantilla: Acero Estructural",
		user: "Carlos Ruiz",
		time: "Hace 15 minutos",
		icon: PlusIcon,
		color: "text-blue-600",
	},
	{
		id: 3,
		type: "trending",
		title: "Cálculo de Agregados trending",
		time: "Hace 1 hora",
		icon: ArrowTrendingUpIcon,
		color: "text-purple-600",
	},
];

const MaterialCalculationsMain: React.FC = () => {
	const navigate = useNavigate();
	const [selectedSection, setSelectedSection] = useState<string | null>(null);
	const [isDesktop, setIsDesktop] = useState(false);
	const [headerHeight, setHeaderHeight] = useState(0);
	const secondSectionRef = useRef<HTMLDivElement>(null);

	const handleSectionClick = (route: string, sectionId: string) => {
		setSelectedSection(sectionId);
		// Pequeño delay para la animación
		setTimeout(() => {
			navigate(route);
		}, 150);
	};

	useEffect(() => {
		// Detectar si es desktop
		const checkScreenSize = () => {
			setIsDesktop(window.innerWidth >= 1024);
		};

		// Calcular altura del header
		const header =
			document.querySelector("header") || document.querySelector("nav");
		if (header) {
			setHeaderHeight(header.getBoundingClientRect().height);
		} else {
			setHeaderHeight(64); // fallback
		}

		checkScreenSize();
		window.addEventListener("resize", checkScreenSize);

		return () => window.removeEventListener("resize", checkScreenSize);
	}, []);

	const scrollToNextSection = () => {
		if (secondSectionRef.current) {
			secondSectionRef.current.scrollIntoView({behavior: "smooth"});
		}
	};

	const renderHeader = () => (
		<div className="text-center mb-8 lg:mb-12">
			<div className="inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 lg:mb-6 shadow-lg">
				<BeakerIcon className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
			</div>
			<h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 lg:mb-3">
				Cálculos de Materiales
			</h1>
			<p className="text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
				Herramientas especializadas para cálculos de materiales de construcción,
				dosificaciones y propiedades según normativa ecuatoriana
			</p>
		</div>
	);

	const renderQuickStats = () => (
		<div className="mb-8 lg:mb-12">
			<h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4 lg:mb-6 text-center">
				Resumen de Actividad
			</h2>
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
				{QUICK_STATS.map((stat, index) => (
					<div
						key={index}
						className="bg-white rounded-xl lg:rounded-2xl border border-gray-100 p-4 lg:p-6 hover:shadow-lg transition-all duration-300 group"
					>
						<div className="flex items-center justify-between mb-3 lg:mb-4">
							<div
								className={`w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r ${stat.color} rounded-lg lg:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
							>
								<stat.icon className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
							</div>
							{stat.change && (
								<div className="flex items-center gap-1 text-xs lg:text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">
									<ArrowTrendingUpIcon className="h-3 w-3" />
									<span className="font-medium">{stat.change}%</span>
								</div>
							)}
						</div>
						<div>
							<div className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">
								{stat.value}
							</div>
							<div className="text-xs lg:text-sm text-gray-600">
								{stat.label}
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);

	const renderMainSections = () => (
		<div className="mb-8 lg:mb-12">
			<h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4 lg:mb-6 text-center">
				Herramientas Principales
			</h2>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
				{MAIN_SECTIONS.map((section) => (
					<div
						key={section.id}
						className={`
							bg-white rounded-xl lg:rounded-2xl border-2 p-6 lg:p-8 cursor-pointer transition-all duration-300 group
							hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]
							${
								selectedSection === section.id
									? "border-blue-300 shadow-lg scale-[1.02]"
									: "border-gray-100 hover:border-gray-200"
							}
						`}
						onClick={() => handleSectionClick(section.route, section.id)}
					>
						<div className="flex items-start justify-between mb-4 lg:mb-6">
							<div
								className={`w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-r ${section.color} rounded-lg lg:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
							>
								<section.icon className="h-6 w-6 lg:h-7 lg:w-7 text-white" />
							</div>
							<div
								className={`px-2 lg:px-3 py-1 ${section.bgColor} ${section.textColor} text-xs font-medium rounded-full border ${section.borderColor}`}
							>
								{section.badge}
							</div>
						</div>

						<div>
							<h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2 lg:mb-3 group-hover:text-blue-700 transition-colors">
								{section.name}
							</h3>
							<p className="text-sm lg:text-base text-gray-600 leading-relaxed">
								{section.description}
							</p>
						</div>

						{/* Indicador visual de hover */}
						<div className="mt-4 lg:mt-6 flex items-center text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
							<span>Acceder</span>
							<ArrowTrendingUpIcon className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
						</div>
					</div>
				))}
			</div>
		</div>
	);

	const renderRecentActivity = () => (
		<div className="max-w-4xl mx-auto">
			<h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4 lg:mb-6 text-center">
				Actividad Reciente
			</h2>
			<div className="bg-white rounded-xl lg:rounded-2xl border border-gray-100 p-4 lg:p-6">
				<div className="space-y-3 lg:space-y-4">
					{RECENT_ACTIVITY.map((activity) => (
						<div
							key={activity.id}
							className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4 hover:bg-gray-50 rounded-lg lg:rounded-xl transition-colors"
						>
							<div
								className={`w-8 h-8 lg:w-10 lg:h-10 ${activity.color} bg-opacity-10 rounded-lg flex items-center justify-center`}
							>
								<activity.icon
									className={`h-4 w-4 lg:h-5 lg:w-5 ${activity.color}`}
								/>
							</div>
							<div className="flex-1">
								<div className="font-medium text-gray-900 text-sm lg:text-base">
									{activity.title}
								</div>
								<div className="text-xs lg:text-sm text-gray-600">
									{activity.user && `${activity.user} • `}
									{activity.time}
								</div>
							</div>
						</div>
					))}
				</div>

				<div className="mt-4 lg:mt-6 text-center">
					<Link
						to="/calculations/materials/results"
						className="text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline"
					>
						Ver toda la actividad →
					</Link>
				</div>
			</div>
		</div>
	);

	// Layout responsivo: Desktop con scroll snap, Mobile con scroll normal
	if (isDesktop) {
		// DESKTOP: Layout con scroll snap
		return (
			<div className="bg-gradient-to-br from-gray-50 to-gray-100">
				{/* Contenedor con scroll snap SOLO en desktop */}
				<div
					className="desktop-snap-container"
					style={{
						height: `calc(100vh - ${headerHeight}px)`,
						overflowY: "auto",
						scrollSnapType: "y mandatory",
						scrollBehavior: "smooth",
					}}
				>
					{/* Primera sección */}
					<div
						className="flex flex-col justify-center items-center relative mx-auto px-4 sm:px-6 lg:px-8"
						style={{
							height: `calc(100vh - ${headerHeight}px)`,
							maxWidth: "80rem",
							scrollSnapAlign: "start",
						}}
					>
						<div className="flex flex-col justify-center items-center h-full">
							{renderHeader()}
							{renderQuickStats()}
						</div>

						{/* Flecha animada */}
						<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
							<button
								onClick={scrollToNextSection}
								className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 bounce-animation"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth="1.5"
									stroke="currentColor"
									className="size-6"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="m19.5 8.25-7.5 7.5-7.5-7.5"
									/>
								</svg>
							</button>
						</div>
					</div>

					{/* Segunda sección */}
					<div
						ref={secondSectionRef}
						className="flex justify-center items-center relative mx-auto px-4 sm:px-6 lg:px-8"
						style={{
							height: `calc(100vh - ${headerHeight}px)`,
							maxWidth: "90rem",
							scrollSnapAlign: "start",
						}}
					>
						<div className="flex justify-center m-auto w-full gap-3">
							{renderMainSections()}
							{renderRecentActivity()}
						</div>
					</div>
				</div>

				{/* CSS solo para desktop */}
				<style>{`
					@keyframes bounce {
						0%, 20%, 53%, 80%, 100% {
							transform: translate3d(0, 0, 0);
						}
						40%, 43% {
							transform: translate3d(0, -10px, 0);
						}
						70% {
							transform: translate3d(0, -5px, 0);
						}
						90% {
							transform: translate3d(0, -2px, 0);
						}
					}

					.bounce-animation {
						animation: bounce 2s infinite;
					}

					/* Prevenir scroll horizontal */
					body {
						overflow-x: hidden;
					}
				`}</style>
			</div>
		);
	}

	// MOBILE: Layout normal sin scroll snap
	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Layout en columna para móvil */}
				<div className="space-y-8">
					{renderHeader()}
					{renderQuickStats()}
					{renderMainSections()}
					{renderRecentActivity()}
				</div>
			</div>
		</div>
	);
};

export default MaterialCalculationsMain;
