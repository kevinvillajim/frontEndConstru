import React, {useState} from "react";
import {
	ClockIcon,
	UserIcon,
	CheckCircleIcon,
	ExclamationTriangleIcon,
	XMarkIcon,
	PlusIcon,
	MagnifyingGlassIcon,
	AdjustmentsHorizontalIcon,
	DocumentCheckIcon,
	CheckIcon,
} from "@heroicons/react/24/outline";
import VotingPanel from "./components/VotingPanel";

// Tipos
interface ProposalVote {
	id: string;
	name: string;
	description: string;
	type:
		| "new_template"
		| "improvement"
		| "parameter_addition"
		| "normative_update";
	category: "structural" | "electrical" | "architectural" | "hydraulic";
	author: {
		id: string;
		name: string;
		profession: string;
		avatar?: string;
	};
	status: "open" | "in_review" | "approved" | "rejected";
	votes: {
		up: number;
		down: number;
		userVote?: "up" | "down" | null;
	};
	tags: string[];
	createdAt: string;
	expiresAt: string;
	comments: number;
	hasContributed: boolean;
}

// Datos mock
const mockProposals: ProposalVote[] = [
	{
		id: "prop-001",
		name: "Cálculo de Paneles Solares Residenciales",
		description:
			"Nueva plantilla para calcular la capacidad, distribución y orientación óptima de paneles solares en viviendas.",
		type: "new_template",
		category: "electrical",
		author: {
			id: "user-123",
			name: "Ing. Roberto Castillo",
			profession: "Ingeniero Eléctrico",
		},
		status: "open",
		votes: {
			up: 48,
			down: 5,
			userVote: null,
		},
		tags: ["renovable", "solar", "energía", "residencial"],
		createdAt: "2024-03-01T10:30:00Z",
		expiresAt: "2024-04-01T10:30:00Z",
		comments: 12,
		hasContributed: false,
	},
	{
		id: "prop-002",
		name: "Actualización Norma NEC-SE-DS 2023",
		description:
			"Actualización de los parámetros sísmicos según la revisión 2023 de la Norma Ecuatoriana de Construcción.",
		type: "normative_update",
		category: "structural",
		author: {
			id: "user-456",
			name: "Ing. Carla Moreno",
			profession: "Ingeniera Civil",
		},
		status: "in_review",
		votes: {
			up: 86,
			down: 3,
			userVote: "up",
		},
		tags: ["sismo", "NEC", "actualización", "normativa"],
		createdAt: "2024-02-15T14:20:00Z",
		expiresAt: "2024-03-15T14:20:00Z",
		comments: 23,
		hasContributed: true,
	},
	{
		id: "prop-003",
		name: "Mejora del Cálculo de Demanda Eléctrica",
		description:
			"Agregar factores de demanda específicos para equipos modernos como cargadores de vehículos eléctricos.",
		type: "improvement",
		category: "electrical",
		author: {
			id: "user-789",
			name: "Ing. David Torres",
			profession: "Ingeniero Eléctrico",
		},
		status: "approved",
		votes: {
			up: 65,
			down: 12,
			userVote: "down",
		},
		tags: ["eléctrico", "demanda", "vehículos", "mejora"],
		createdAt: "2024-02-10T09:15:00Z",
		expiresAt: "2024-03-10T09:15:00Z",
		comments: 18,
		hasContributed: false,
	},
	{
		id: "prop-004",
		name: "Parámetros para Cálculo de Áreas según IRM 2024",
		description:
			"Incorporar nuevos parámetros para el cálculo de áreas de acuerdo al Informe de Regulación Metropolitana actualizado.",
		type: "parameter_addition",
		category: "architectural",
		author: {
			id: "user-321",
			name: "Arq. Lucía Andrade",
			profession: "Arquitecta Urbanista",
		},
		status: "open",
		votes: {
			up: 37,
			down: 8,
			userVote: null,
		},
		tags: ["áreas", "IRM", "municipal", "normativa"],
		createdAt: "2024-03-05T11:30:00Z",
		expiresAt: "2024-04-05T11:30:00Z",
		comments: 9,
		hasContributed: false,
	},
	{
		id: "prop-005",
		name: "Sistema de Cálculo de Redes Contraincendios",
		description:
			"Nueva plantilla para dimensionar redes de protección contra incendios según normativa NFPA actualizada.",
		type: "new_template",
		category: "hydraulic",
		author: {
			id: "user-654",
			name: "Ing. Martín Sánchez",
			profession: "Ingeniero Hidráulico",
		},
		status: "rejected",
		votes: {
			up: 25,
			down: 32,
			userVote: null,
		},
		tags: ["incendios", "hidráulico", "seguridad", "NFPA"],
		createdAt: "2024-02-20T16:45:00Z",
		expiresAt: "2024-03-20T16:45:00Z",
		comments: 15,
		hasContributed: false,
	},
	{
		id: "prop-006",
		name: "Mejora en Cálculo de Cargas de Viento",
		description:
			"Incorporar nuevos coeficientes de presión para diferentes geometrías de edificios.",
		type: "improvement",
		category: "structural",
		author: {
			id: "user-987",
			name: "Ing. Patricia Vega",
			profession: "Ingeniera Estructural",
		},
		status: "open",
		votes: {
			up: 42,
			down: 7,
			userVote: "up",
		},
		tags: ["viento", "estructural", "coeficientes", "mejora"],
		createdAt: "2024-03-08T13:20:00Z",
		expiresAt: "2024-04-08T13:20:00Z",
		comments: 11,
		hasContributed: true,
	},
];

// Tipos de propuestas
const proposalTypes = [
	{
		id: "all",
		name: "Todas",
		color: "bg-gray-100 text-gray-700",
	},
	{
		id: "new_template",
		name: "Nueva Plantilla",
		color: "bg-blue-100 text-blue-700",
	},
	{
		id: "improvement",
		name: "Mejora",
		color: "bg-green-100 text-green-700",
	},
	{
		id: "parameter_addition",
		name: "Nuevos Parámetros",
		color: "bg-yellow-100 text-yellow-700",
	},
	{
		id: "normative_update",
		name: "Actualización Normativa",
		color: "bg-purple-100 text-purple-700",
	},
];

// Estados de propuestas
const proposalStatuses = [
	{
		id: "all",
		name: "Todos",
		color: "bg-gray-100 text-gray-700",
	},
	{
		id: "open",
		name: "Abierta",
		color: "bg-blue-100 text-blue-700",
	},
	{
		id: "in_review",
		name: "En Revisión",
		color: "bg-yellow-100 text-yellow-700",
	},
	{
		id: "approved",
		name: "Aprobada",
		color: "bg-green-100 text-green-700",
	},
	{
		id: "rejected",
		name: "Rechazada",
		color: "bg-red-100 text-red-700",
	},
];

// Categorías con iconos y colores
const categories = [
	{
		id: "all",
		name: "Todas",
		icon: "🔍",
		color: "bg-gray-100 text-gray-700",
	},
	{
		id: "structural",
		name: "Estructural",
		icon: "🏗️",
		color: "bg-blue-50 text-blue-700",
	},
	{
		id: "electrical",
		name: "Eléctrico",
		icon: "⚡",
		color: "bg-yellow-50 text-yellow-700",
	},
	{
		id: "architectural",
		name: "Arquitectónico",
		icon: "🏛️",
		color: "bg-green-50 text-green-700",
	},
	{
		id: "hydraulic",
		name: "Hidráulico",
		icon: "🚰",
		color: "bg-cyan-50 text-cyan-700",
	},
];

const ProposedVoting: React.FC = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedType, setSelectedType] = useState("all");
	const [selectedStatus, setSelectedStatus] = useState("all");
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [sortBy, setSortBy] = useState("votes");
	const [showContributed, setShowContributed] = useState(false);
	const [proposals, setProposals] = useState(mockProposals);

	// Función para votar
	const vote = (proposalId: string, voteType: "up" | "down" | null) => {
		setProposals((prev) =>
			prev.map((proposal) => {
				if (proposal.id !== proposalId) return proposal;

				const currentVote = proposal.votes.userVote;
				let upVotes = proposal.votes.up;
				let downVotes = proposal.votes.down;

				// Restablecer votos si ya había votado
				if (currentVote === "up") upVotes--;
				if (currentVote === "down") downVotes--;

				// Agregar nuevo voto si no es null
				if (voteType === "up") upVotes++;
				if (voteType === "down") downVotes++;

				return {
					...proposal,
					votes: {
						up: upVotes,
						down: downVotes,
						userVote: voteType,
					},
				};
			})
		);
	};

	// Filtrar propuestas
	const filteredProposals = proposals.filter((proposal) => {
		const matchesSearch =
			proposal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			proposal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
			proposal.tags.some((tag) =>
				tag.toLowerCase().includes(searchTerm.toLowerCase())
			);

		const matchesType =
			selectedType === "all" || proposal.type === selectedType;
		const matchesStatus =
			selectedStatus === "all" || proposal.status === selectedStatus;
		const matchesCategory =
			selectedCategory === "all" || proposal.category === selectedCategory;
		const matchesContributed = !showContributed || proposal.hasContributed;

		return (
			matchesSearch &&
			matchesType &&
			matchesStatus &&
			matchesCategory &&
			matchesContributed
		);
	});

	// Ordenar propuestas
	const sortedProposals = [...filteredProposals].sort((a, b) => {
		switch (sortBy) {
			case "votes":
				return b.votes.up - b.votes.down - (a.votes.up - a.votes.down);
			case "recent":
				return (
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				);
			case "comments":
				return b.comments - a.comments;
			case "expiring":
				return (
					new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime()
				);
			default:
				return 0;
		}
	});

	// Formatear fecha
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("es-EC", {
			day: "2-digit",
			month: "short",
			year: "numeric",
		});
	};

	// Obtener tiempo restante
	const getTimeRemaining = (expiresAt: string) => {
		const now = new Date();
		const expiry = new Date(expiresAt);
		const diff = expiry.getTime() - now.getTime();

		if (diff <= 0) return "Finalizada";

		const days = Math.floor(diff / (1000 * 60 * 60 * 24));

		if (days > 0) {
			return `${days} día${days > 1 ? "s" : ""} restante${days > 1 ? "s" : ""}`;
		}

		const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		return `${hours} hora${hours > 1 ? "s" : ""} restante${hours > 1 ? "s" : ""}`;
	};

	// Obtener color de estado
	const getStatusColor = (status: string) => {
		const statusOption = proposalStatuses.find((s) => s.id === status);
		return statusOption ? statusOption.color : proposalStatuses[0].color;
	};

	// Obtener color de tipo
	const getTypeColor = (type: string) => {
		const typeOption = proposalTypes.find((t) => t.id === type);
		return typeOption ? typeOption.color : proposalTypes[0].color;
	};

	// Obtener ícono de estado
	const getStatusIcon = (status: string) => {
		switch (status) {
			case "open":
				return <ClockIcon className="h-4 w-4 text-blue-600" />;
			case "in_review":
				return <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600" />;
			case "approved":
				return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
			case "rejected":
				return <XMarkIcon className="h-4 w-4 text-red-600" />;
			default:
				return null;
		}
	};

	return (
		<div className="space-y-6">
			{/* Filtros y búsqueda */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
				<div className="flex flex-col lg:flex-row gap-4">
					<div className="flex-1">
						<div className="relative">
							<MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
							<input
								type="text"
								placeholder="Buscar propuestas de cálculos..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
							/>
						</div>
					</div>

					<div className="flex flex-wrap gap-3">
						<select
							value={selectedType}
							onChange={(e) => setSelectedType(e.target.value)}
							className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
						>
							{proposalTypes.map((type) => (
								<option key={type.id} value={type.id}>
									{type.name}
								</option>
							))}
						</select>

						<select
							value={selectedStatus}
							onChange={(e) => setSelectedStatus(e.target.value)}
							className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
						>
							{proposalStatuses.map((status) => (
								<option key={status.id} value={status.id}>
									{status.name}
								</option>
							))}
						</select>

						<select
							value={selectedCategory}
							onChange={(e) => setSelectedCategory(e.target.value)}
							className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
						>
							{categories.map((category) => (
								<option key={category.id} value={category.id}>
									{category.icon} {category.name}
								</option>
							))}
						</select>

						<select
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value)}
							className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
						>
							<option value="votes">Más votados</option>
							<option value="recent">Más recientes</option>
							<option value="comments">Más comentados</option>
							<option value="expiring">Por vencer</option>
						</select>

						<button
							onClick={() => setShowContributed(!showContributed)}
							className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
								showContributed
									? "bg-primary-50 border-primary-300 text-primary-700"
									: "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
							}`}
						>
							{showContributed ? <CheckIcon className="h-4 w-4" /> : null}
							Mis Contribuciones
						</button>
					</div>
				</div>
			</div>

			{/* Estadísticas de propuestas */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center">
					<div className="p-3 bg-blue-100 rounded-lg">
						<DocumentCheckIcon className="h-6 w-6 text-blue-600" />
					</div>
					<div className="ml-4">
						<p className="text-xl font-semibold text-gray-900">
							{proposals.length}
						</p>
						<p className="text-gray-600 text-sm">Propuestas Totales</p>
					</div>
				</div>

				<div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center">
					<div className="p-3 bg-green-100 rounded-lg">
						<CheckCircleIcon className="h-6 w-6 text-green-600" />
					</div>
					<div className="ml-4">
						<p className="text-xl font-semibold text-gray-900">
							{proposals.filter((p) => p.status === "approved").length}
						</p>
						<p className="text-gray-600 text-sm">Aprobadas</p>
					</div>
				</div>

				<div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center">
					<div className="p-3 bg-yellow-100 rounded-lg">
						<ClockIcon className="h-6 w-6 text-yellow-600" />
					</div>
					<div className="ml-4">
						<p className="text-xl font-semibold text-gray-900">
							{
								proposals.filter(
									(p) => p.status === "open" || p.status === "in_review"
								).length
							}
						</p>
						<p className="text-gray-600 text-sm">En Proceso</p>
					</div>
				</div>

				<div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center">
					<div className="p-3 bg-purple-100 rounded-lg">
						<UserIcon className="h-6 w-6 text-purple-600" />
					</div>
					<div className="ml-4">
						<p className="text-xl font-semibold text-gray-900">
							{proposals.filter((p) => p.hasContributed).length}
						</p>
						<p className="text-gray-600 text-sm">Tus Contribuciones</p>
					</div>
				</div>
			</div>

			{/* Botón para crear propuesta */}
			<div className="flex justify-end">
				<button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2">
					<PlusIcon className="h-4 w-4" />
					Nueva Propuesta
				</button>
			</div>

			{/* Listado de propuestas */}
			<div className="space-y-4">
				{sortedProposals.map((proposal) => (
					<VotingPanel
						key={proposal.id}
						proposal={proposal}
						onVote={vote}
						getTimeRemaining={getTimeRemaining}
						formatDate={formatDate}
						getStatusColor={getStatusColor}
						getTypeColor={getTypeColor}
						getStatusIcon={getStatusIcon}
					/>
				))}

				{sortedProposals.length === 0 && (
					<div className="text-center py-12 bg-white rounded-xl border border-gray-200">
						<AdjustmentsHorizontalIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
						<h3 className="text-lg font-medium text-gray-900 mb-2">
							No se encontraron propuestas
						</h3>
						<p className="text-gray-600 mb-6">
							Intenta ajustar los filtros o términos de búsqueda.
						</p>
						<button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 mx-auto">
							<PlusIcon className="h-4 w-4" />
							Crear Nueva Propuesta
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default ProposedVoting;
