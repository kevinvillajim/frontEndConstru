// src/ui/pages/calculations/Collaboration.tsx
import React, {useState, useEffect} from "react";
import {
	HandThumbUpIcon,
	UserGroupIcon,
	PlusIcon,
	GlobeAmericasIcon,
	MapPinIcon,
	ArrowDownIcon,
	ChevronRightIcon,
	BookmarkIcon,
	ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import {
	StarIcon as StarSolidIcon,
	HandThumbUpIcon as HandThumbUpSolidIcon,
} from "@heroicons/react/24/solid";

interface TrendingTemplate {
	id: string;
	name: string;
	description: string;
	type: string;
	usage_count: number;
	average_rating: number;
	rating_count: number;
	country: string;
	created_by_name: string;
	tags: string[];
	growth_rate: number;
}

interface VotingProposal {
	id: string;
	title: string;
	description: string;
	type: "improvement" | "new_formula" | "fix";
	target_template_id?: string;
	votes_count: number;
	user_vote?: "up" | "down" | null;
	status: "active" | "approved" | "rejected";
	country_ranking: number;
	global_ranking: number;
	created_by_name: string;
	created_at: string;
}

interface TeamTemplate {
	id: string;
	name: string;
	description: string;
	created_by_name: string;
	usage_count: number;
	shared_with_team: boolean;
	tags: string[];
	updated_at: string;
}

const Collaboration: React.FC = () => {
	const [activeTab, setActiveTab] = useState("trending");
	const [trendingTemplates, setTrendingTemplates] = useState<
		TrendingTemplate[]
	>([]);
	const [votingProposals, setVotingProposals] = useState<VotingProposal[]>([]);
	const [teamTemplates, setTeamTemplates] = useState<TeamTemplate[]>([]);
	const [showGlobalRanking, setShowGlobalRanking] = useState(false);
	const [userCountry] = useState("Ecuador");
	const [loading, setLoading] = useState(true);

	const tabs = [
		{
			id: "trending",
			name: "Tendencias",
			icon: ArrowTrendingUpIcon,
			color: "text-green-600",
		},
		{
			id: "voting",
			name: "Votaciones",
			icon: HandThumbUpIcon,
			color: "text-blue-600",
		},
		{
			id: "team",
			name: "Mi Equipo",
			icon: UserGroupIcon,
			color: "text-purple-600",
		},
	];

	useEffect(() => {
		fetchData();
	}, [activeTab]);

	const fetchData = async () => {
		setLoading(true);
		try {
			switch (activeTab) {
				case "trending":
					await fetchTrendingTemplates();
					break;
				case "voting":
					await fetchVotingProposals();
					break;
				case "team":
					await fetchTeamTemplates();
					break;
			}
		} catch (error) {
			console.error(`Error fetching ${activeTab} data:`, error);
		} finally {
			setLoading(false);
		}
	};

	const fetchTrendingTemplates = async () => {
		// Simular llamada API
		const mockData: TrendingTemplate[] = [
			{
				id: "1",
				name: "Cálculo de Carga Sísmica Mejorado",
				description:
					"Versión optimizada del cálculo sísmico con factores locales",
				type: "structural",
				usage_count: 1247,
				average_rating: 4.8,
				rating_count: 89,
				country: "Colombia",
				created_by_name: "Ing. Carlos Mendoza",
				tags: ["sísmico", "estructural", "optimizado"],
				growth_rate: 45.2,
			},
			{
				id: "2",
				name: "Demanda Eléctrica Residencial Plus",
				description: "Incluye cálculos para sistemas solares y domótica",
				type: "electrical",
				usage_count: 892,
				average_rating: 4.6,
				rating_count: 67,
				country: "Ecuador",
				created_by_name: "Ing. María Vásquez",
				tags: ["eléctrico", "residencial", "solar"],
				growth_rate: 32.1,
			},
		];
		setTrendingTemplates(mockData);
	};

	const fetchVotingProposals = async () => {
		const mockData: VotingProposal[] = [
			{
				id: "1",
				title: "Mejora al factor de suelo tipo S3",
				description:
					"Propuesta para actualizar el factor de suelo S3 según nuevos estudios geotécnicos",
				type: "improvement",
				target_template_id: "template-123",
				votes_count: 156,
				user_vote: null,
				status: "active",
				country_ranking: 2,
				global_ranking: 8,
				created_by_name: "Ing. Roberto Silva",
				created_at: "2025-05-15T10:00:00Z",
			},
			{
				id: "2",
				title: "Nueva fórmula para cálculo de viento",
				description:
					"Fórmula específica para zona costera considerando vientos huracanados",
				type: "new_formula",
				votes_count: 203,
				user_vote: "up",
				status: "active",
				country_ranking: 1,
				global_ranking: 3,
				created_by_name: "Ing. Ana Delgado",
				created_at: "2025-05-12T14:30:00Z",
			},
		];
		setVotingProposals(mockData);
	};

	const fetchTeamTemplates = async () => {
		const mockData: TeamTemplate[] = [
			{
				id: "1",
				name: "Estándar Corporativo - Zapatas",
				description: "Plantilla estándar de la empresa para cálculo de zapatas",
				created_by_name: "Ing. Luis Herrera",
				usage_count: 45,
				shared_with_team: true,
				tags: ["corporativo", "zapatas", "estándar"],
				updated_at: "2025-05-20T09:15:00Z",
			},
		];
		setTeamTemplates(mockData);
	};

	const handleAddToMyTemplates = async (templateId: string) => {
		try {
			const response = await fetch(
				"/api/calculations/templates/add-collaborative",
				{
					method: "POST",
					headers: {"Content-Type": "application/json"},
					body: JSON.stringify({templateId}),
				}
			);

			if (response.ok) {
				// Mostrar notificación de éxito
				console.log("Plantilla agregada a mis plantillas");
			}
		} catch (error) {
			console.error("Error adding template:", error);
		}
	};

	const handleVote = async (proposalId: string, voteType: "up" | "down") => {
		try {
			const response = await fetch(`/api/voting/proposals/${proposalId}/vote`, {
				method: "POST",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify({vote: voteType}),
			});

			if (response.ok) {
				fetchVotingProposals();
			}
		} catch (error) {
			console.error("Error voting:", error);
		}
	};

	const renderTrendingTab = () => (
		<div className="space-y-6">
			{/* Header con filtros */}
			<div className="flex items-center justify-between">
				<h2 className="text-xl font-semibold text-gray-900">
					Cálculos en Tendencia
				</h2>
				<div className="flex items-center gap-3">
					<button
						onClick={() => setShowGlobalRanking(!showGlobalRanking)}
						className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
							showGlobalRanking
								? "bg-blue-50 border-blue-200 text-blue-700"
								: "bg-gray-50 border-gray-200 text-gray-700"
						}`}
					>
						{showGlobalRanking ? (
							<GlobeAmericasIcon className="h-4 w-4" />
						) : (
							<MapPinIcon className="h-4 w-4" />
						)}
						{showGlobalRanking ? "Ranking Global" : `Ranking ${userCountry}`}
					</button>
				</div>
			</div>

			{/* Lista de tendencias */}
			<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
				{trendingTemplates.map((template, index) => (
					<div
						key={template.id}
						className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 p-6"
					>
						{/* Ranking badge */}
						<div className="flex items-center justify-between mb-3">
							<div className="flex items-center gap-2">
								<div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
									#{index + 1}
								</div>
								<div className="flex items-center gap-1 text-green-600">
									<ArrowTrendingUpIcon className="h-4 w-4" />
									<span className="text-sm font-medium">
										+{template.growth_rate}%
									</span>
								</div>
							</div>
							<div className="flex items-center gap-1">
								<StarSolidIcon className="h-4 w-4 text-yellow-400" />
								<span className="text-sm font-medium">
									{template.average_rating}
								</span>
							</div>
						</div>

						{/* Contenido */}
						<h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
							{template.name}
						</h3>
						<p className="text-gray-600 text-sm mb-3 line-clamp-3">
							{template.description}
						</p>

						{/* Metadata */}
						<div className="space-y-2 mb-4">
							<div className="flex items-center justify-between text-xs text-gray-500">
								<span>{template.usage_count.toLocaleString()} usos</span>
								<span>{template.country}</span>
							</div>
							<div className="text-xs text-gray-500">
								Por {template.created_by_name}
							</div>
						</div>

						{/* Tags */}
						<div className="flex flex-wrap gap-1 mb-4">
							{template.tags.slice(0, 3).map((tag, tagIndex) => (
								<span
									key={tagIndex}
									className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
								>
									{tag}
								</span>
							))}
						</div>

						{/* Botón */}
						<button
							onClick={() => handleAddToMyTemplates(template.id)}
							className="w-full bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-700 hover:to-secondary-600 text-white py-2 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-medium"
						>
							<BookmarkIcon className="h-4 w-4" />
							Agregar a Mis Plantillas
						</button>
					</div>
				))}
			</div>
		</div>
	);

	const renderVotingTab = () => (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-xl font-semibold text-gray-900">
						Votaciones Activas
					</h2>
					<p className="text-gray-600 text-sm">
						Vota por mejoras y nuevas fórmulas propuestas por la comunidad
					</p>
				</div>
				<div className="flex items-center gap-2">
					<button
						onClick={() => setShowGlobalRanking(!showGlobalRanking)}
						className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors ${
							showGlobalRanking
								? "bg-blue-50 border-blue-200 text-blue-700"
								: "bg-gray-50 border-gray-200 text-gray-700"
						}`}
					>
						{showGlobalRanking ? (
							<GlobeAmericasIcon className="h-4 w-4" />
						) : (
							<MapPinIcon className="h-4 w-4" />
						)}
						{showGlobalRanking ? "Ranking Global" : `Ranking ${userCountry}`}
					</button>
				</div>
			</div>

			{/* Lista de propuestas */}
			<div className="space-y-4">
				{votingProposals.map((proposal) => (
					<div
						key={proposal.id}
						className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
					>
						<div className="flex items-start gap-4">
							{/* Ranking */}
							<div className="text-center">
								<div className="text-2xl font-bold text-primary-600">
									#
									{showGlobalRanking
										? proposal.global_ranking
										: proposal.country_ranking}
								</div>
								<div className="text-xs text-gray-500">
									{showGlobalRanking ? "Global" : userCountry}
								</div>
							</div>

							{/* Contenido */}
							<div className="flex-1">
								<div className="flex items-start justify-between mb-3">
									<div>
										<h3 className="font-semibold text-gray-900 mb-1">
											{proposal.title}
										</h3>
										<p className="text-gray-600 text-sm mb-2">
											{proposal.description}
										</p>
										<div className="flex items-center gap-4 text-xs text-gray-500">
											<span>Por {proposal.created_by_name}</span>
											<span>
												{new Date(proposal.created_at).toLocaleDateString(
													"es-EC"
												)}
											</span>
											<span
												className={`px-2 py-1 rounded-full ${
													proposal.type === "improvement"
														? "bg-blue-100 text-blue-700"
														: proposal.type === "new_formula"
															? "bg-green-100 text-green-700"
															: "bg-red-100 text-red-700"
												}`}
											>
												{proposal.type === "improvement"
													? "Mejora"
													: proposal.type === "new_formula"
														? "Nueva Fórmula"
														: "Corrección"}
											</span>
										</div>
									</div>
								</div>

								{/* Controles de votación */}
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<button
											onClick={() => handleVote(proposal.id, "up")}
											className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
												proposal.user_vote === "up"
													? "bg-green-100 text-green-700"
													: "bg-gray-100 hover:bg-green-50 text-gray-600"
											}`}
										>
											{proposal.user_vote === "up" ? (
												<HandThumbUpSolidIcon className="h-4 w-4" />
											) : (
												<HandThumbUpIcon className="h-4 w-4" />
											)}
											<span className="text-sm font-medium">
												{proposal.votes_count}
											</span>
										</button>

										<button
											onClick={() => handleVote(proposal.id, "down")}
											className={`p-2 rounded-lg transition-colors ${
												proposal.user_vote === "down"
													? "bg-red-100 text-red-700"
													: "bg-gray-100 hover:bg-red-50 text-gray-600"
											}`}
										>
											<ArrowDownIcon className="h-4 w-4" />
										</button>
									</div>

									<button className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1">
										Ver Detalles
										<ChevronRightIcon className="h-4 w-4" />
									</button>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);

	const renderTeamTab = () => (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-xl font-semibold text-gray-900">
						Plantillas del Equipo
					</h2>
					<p className="text-gray-600 text-sm">
						Colabora con tu equipo y comparte fórmulas empresariales
					</p>
				</div>
				<button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center gap-2">
					<PlusIcon className="h-4 w-4" />
					Compartir Plantilla
				</button>
			</div>

			{/* Plantillas del equipo */}
			{teamTemplates.length > 0 ? (
				<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
					{teamTemplates.map((template) => (
						<div
							key={template.id}
							className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 p-6"
						>
							<div className="flex items-start justify-between mb-3">
								<div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
									<UserGroupIcon className="h-6 w-6 text-white" />
								</div>
								<span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
									Equipo
								</span>
							</div>

							<h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
								{template.name}
							</h3>
							<p className="text-gray-600 text-sm mb-3 line-clamp-3">
								{template.description}
							</p>

							<div className="space-y-2 mb-4">
								<div className="flex items-center justify-between text-xs text-gray-500">
									<span>{template.usage_count} usos del equipo</span>
									<span>Por {template.created_by_name}</span>
								</div>
								<div className="text-xs text-gray-500">
									Actualizada:{" "}
									{new Date(template.updated_at).toLocaleDateString("es-EC")}
								</div>
							</div>

							<div className="flex flex-wrap gap-1 mb-4">
								{template.tags.map((tag, index) => (
									<span
										key={index}
										className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-md"
									>
										{tag}
									</span>
								))}
							</div>

							<button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-xl transition-all duration-200 font-medium">
								Usar Plantilla
							</button>
						</div>
					))}
				</div>
			) : (
				<div className="text-center py-16">
					<div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<UserGroupIcon className="h-12 w-12 text-purple-500" />
					</div>
					<h3 className="text-lg font-medium text-gray-900 mb-2">
						No hay plantillas del equipo
					</h3>
					<p className="text-gray-600 mb-6">
						Comparte tus plantillas con el equipo para comenzar a colaborar.
					</p>
					<button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors">
						Compartir Primera Plantilla
					</button>
				</div>
			)}
		</div>
	);

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white border-b border-gray-200">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
						<div>
							<h1 className="text-3xl font-bold text-gray-900 tracking-tight">
								Colaboración
							</h1>
							<p className="text-gray-600 mt-1">
								Descubre tendencias, vota por mejoras y colabora con tu equipo
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Tabs */}
				<div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-8">
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
								activeTab === tab.id
									? "bg-white text-gray-900 shadow-sm"
									: "text-gray-600 hover:text-gray-900"
							}`}
						>
							<tab.icon
								className={`h-5 w-5 ${activeTab === tab.id ? tab.color : ""}`}
							/>
							{tab.name}
						</button>
					))}
				</div>

				{/* Contenido */}
				{loading ? (
					<div className="flex items-center justify-center py-16">
						<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
					</div>
				) : (
					<div>
						{activeTab === "trending" && renderTrendingTab()}
						{activeTab === "voting" && renderVotingTab()}
						{activeTab === "team" && renderTeamTab()}
					</div>
				)}
			</div>

			<style>{`
				.line-clamp-2 {
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					overflow: hidden;
				}
				
				.line-clamp-3 {
					display: -webkit-box;
					-webkit-line-clamp: 3;
					-webkit-box-orient: vertical;
					overflow: hidden;
				}
			`}</style>
		</div>
	);
};

export default Collaboration;
