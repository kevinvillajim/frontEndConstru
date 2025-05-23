import React, {useState} from "react";
import {
	UserGroupIcon,
	ChartBarIcon,
	CheckBadgeIcon,
	ShareIcon,
	ArrowRightIcon,
} from "@heroicons/react/24/outline";
import {Link} from "react-router-dom";
import TrendingCalculations from "./TrendingCalculations";
import ProposedVoting from "./ProposedVoting";

const CollaborationHub: React.FC = () => {
	const [activeTab, setActiveTab] = useState<string>("trending");

	const collaborationSections = [
		{
			id: "trending",
			name: "Cálculos en Tendencia",
			description:
				"Descubre los cálculos más populares utilizados por la comunidad",
			icon: ChartBarIcon,
			component: TrendingCalculations,
		},
		{
			id: "voting",
			name: "Propuestas y Votaciones",
			description:
				"Vota por nuevas plantillas y mejoras propuestas por la comunidad",
			icon: CheckBadgeIcon,
			component: ProposedVoting,
		},
		{
			id: "workspaces",
			name: "Espacios de Trabajo",
			description: "Colabora con tu equipo en cálculos compartidos",
			icon: UserGroupIcon,
			path: "/calculations/collaboration/workspace",
		},
	];

	// Renderiza el componente activo o un enlace al path correspondiente
	const renderActiveSection = () => {
		const activeSection = collaborationSections.find(
			(section) => section.id === activeTab
		);

		if (!activeSection) return null;

		if (activeSection.component) {
			const Component = activeSection.component;
			return <Component />;
		}

		return (
			<div className="text-center py-12">
				<div className="w-20 h-20 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
					<activeSection.icon className="h-10 w-10 text-primary-600" />
				</div>
				<h3 className="text-lg font-medium text-gray-900 mb-2">
					Ir a {activeSection.name}
				</h3>
				<p className="text-gray-600 mb-6 max-w-md mx-auto">
					{activeSection.description}
				</p>
				<Link
					to={activeSection.path || "#"}
					className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors inline-flex items-center gap-2"
				>
					Acceder <ArrowRightIcon className="h-4 w-4" />
				</Link>
			</div>
		);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white border-b border-gray-200">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
						<div>
							<h1 className="text-3xl font-bold text-gray-900 tracking-tight">
								Espacio de Colaboración
							</h1>
							<p className="text-gray-600 mt-1">
								Trabaja junto a la comunidad y descubre cálculos populares
							</p>
						</div>

						<div className="flex items-center gap-3">
							<Link
								to="/calculations/collaboration/workspace"
								className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
							>
								<UserGroupIcon className="h-4 w-4" />
								Tu Equipo
							</Link>
							<button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2">
								<ShareIcon className="h-4 w-4" />
								Compartir Cálculo
							</button>
						</div>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Navegación por secciones */}
				<div className="bg-white rounded-xl border border-gray-200 p-1 mb-8">
					<nav className="flex flex-wrap">
						{collaborationSections.map((section) => (
							<button
								key={section.id}
								onClick={() => setActiveTab(section.id)}
								className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
									activeTab === section.id
										? "bg-primary-100 text-primary-700"
										: "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
								}`}
							>
								<section.icon className="h-4 w-4" />
								{section.name}
							</button>
						))}
					</nav>
				</div>

				{/* Tarjetas de colaboración */}
				{activeTab === "home" ? (
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
						{collaborationSections.map((section) => (
							<div
								key={section.id}
								className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
							>
								<div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
									<section.icon className="h-6 w-6 text-primary-600" />
								</div>
								<h3 className="text-lg font-semibold text-gray-900 mb-2">
									{section.name}
								</h3>
								<p className="text-gray-600 mb-4">{section.description}</p>

								{section.path ? (
									<Link
										to={section.path}
										className="text-primary-600 font-medium hover:text-primary-700 inline-flex items-center gap-1"
									>
										Acceder <ArrowRightIcon className="h-4 w-4" />
									</Link>
								) : (
									<button
										onClick={() => setActiveTab(section.id)}
										className="text-primary-600 font-medium hover:text-primary-700 inline-flex items-center gap-1"
									>
										Explorar <ArrowRightIcon className="h-4 w-4" />
									</button>
								)}
							</div>
						))}
					</div>
				) : (
					renderActiveSection()
				)}
			</div>
		</div>
	);
};

export default CollaborationHub;
