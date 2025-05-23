import React from "react";
import {
	ArrowUpIcon,
	ArrowDownIcon,
	ChatBubbleLeftRightIcon,
	ClockIcon,
	UserIcon,
	TagIcon,
	ArrowRightIcon,
	EyeIcon,
} from "@heroicons/react/24/outline";

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

interface VotingPanelProps {
	proposal: ProposalVote;
	onVote: (proposalId: string, voteType: "up" | "down" | null) => void;
	getTimeRemaining: (expiresAt: string) => string;
	formatDate: (dateString: string) => string;
	getStatusColor: (status: string) => string;
	getTypeColor: (type: string) => string;
	getStatusIcon: (status: string) => React.ReactNode;
}

const VotingPanel: React.FC<VotingPanelProps> = ({
	proposal,
	onVote,
	getTimeRemaining,
	formatDate,
	getStatusColor,
	getTypeColor,
	getStatusIcon,
}) => {
	// Calcular votos netos y porcentaje de aprobación
	const netVotes = proposal.votes.up - proposal.votes.down;
	const totalVotes = proposal.votes.up + proposal.votes.down;
	const approvalPercentage =
		totalVotes > 0 ? Math.round((proposal.votes.up / totalVotes) * 100) : 0;

	// Determinar si la propuesta está cerrada (ya no se puede votar)
	const isClosed =
		proposal.status === "approved" || proposal.status === "rejected";

	// Determinar si la votación ha expirado
	const isExpired = new Date(proposal.expiresAt) < new Date();

	// Estado de votación: si está cerrado, expirado o abierto
	const votingStatus = isClosed ? "closed" : isExpired ? "expired" : "open";

	return (
		<div
			className={`bg-white rounded-xl shadow-sm border ${proposal.hasContributed ? "border-primary-200" : "border-gray-200"} overflow-hidden`}
		>
			<div className="p-5">
				<div className="flex flex-col md:flex-row gap-4">
					{/* Sección de votos */}
					<div
						className={`flex flex-row md:flex-col items-center justify-center gap-2 p-2 rounded-lg ${
							votingStatus === "closed" || votingStatus === "expired"
								? "bg-gray-100 text-gray-400"
								: "bg-gray-50"
						}`}
					>
						<button
							onClick={() =>
								votingStatus === "open" &&
								onVote(
									proposal.id,
									proposal.votes.userVote === "up" ? null : "up"
								)
							}
							className={`p-2 rounded-lg transition-colors ${
								votingStatus !== "open"
									? "cursor-not-allowed opacity-50"
									: proposal.votes.userVote === "up"
										? "bg-primary-100 text-primary-600"
										: "hover:bg-gray-200 text-gray-600"
							}`}
							disabled={votingStatus !== "open"}
						>
							<ArrowUpIcon className="h-5 w-5" />
						</button>

						<div
							className={`text-center font-semibold ${
								netVotes > 0
									? "text-green-600"
									: netVotes < 0
										? "text-red-600"
										: "text-gray-600"
							}`}
						>
							{netVotes > 0 ? "+" : ""}
							{netVotes}
						</div>

						<button
							onClick={() =>
								votingStatus === "open" &&
								onVote(
									proposal.id,
									proposal.votes.userVote === "down" ? null : "down"
								)
							}
							className={`p-2 rounded-lg transition-colors ${
								votingStatus !== "open"
									? "cursor-not-allowed opacity-50"
									: proposal.votes.userVote === "down"
										? "bg-red-100 text-red-600"
										: "hover:bg-gray-200 text-gray-600"
							}`}
							disabled={votingStatus !== "open"}
						>
							<ArrowDownIcon className="h-5 w-5" />
						</button>
					</div>

					{/* Contenido principal */}
					<div className="flex-1">
						<div className="flex items-start justify-between mb-3">
							<div className="flex-1">
								<div className="flex flex-wrap gap-2 mb-2">
									<span
										className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(proposal.type)}`}
									>
										{proposal.type === "new_template" && "Nueva Plantilla"}
										{proposal.type === "improvement" && "Mejora"}
										{proposal.type === "parameter_addition" &&
											"Nuevos Parámetros"}
										{proposal.type === "normative_update" &&
											"Actualización Normativa"}
									</span>

									<span
										className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}
									>
										{getStatusIcon(proposal.status)}
										{proposal.status === "open" && "Abierta"}
										{proposal.status === "in_review" && "En Revisión"}
										{proposal.status === "approved" && "Aprobada"}
										{proposal.status === "rejected" && "Rechazada"}
									</span>
								</div>

								<h3 className="font-semibold text-gray-900 mb-1">
									{proposal.name}
								</h3>

								<p className="text-sm text-gray-600 mb-3 line-clamp-2">
									{proposal.description}
								</p>

								<div className="flex flex-wrap gap-2 mb-3">
									{proposal.tags.map((tag, index) => (
										<span
											key={index}
											className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
										>
											<TagIcon className="h-3 w-3" />
											{tag}
										</span>
									))}
								</div>

								<div className="flex flex-wrap gap-4 text-xs text-gray-500">
									<div className="flex items-center gap-1">
										<UserIcon className="h-3 w-3" />
										<span>{proposal.author.name}</span>
										<span className="text-gray-400">
											• {proposal.author.profession}
										</span>
									</div>

									<div className="flex items-center gap-1">
										<ClockIcon className="h-3 w-3" />
										<span>
											{votingStatus === "closed"
												? `Finalizada el ${formatDate(proposal.expiresAt)}`
												: getTimeRemaining(proposal.expiresAt)}
										</span>
									</div>

									<div className="flex items-center gap-1">
										<ChatBubbleLeftRightIcon className="h-3 w-3" />
										<span>{proposal.comments} comentarios</span>
									</div>
								</div>
							</div>
						</div>

						<div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-3">
							<div className="flex items-center gap-3">
								<div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
									<div
										className={`h-full ${approvalPercentage >= 70 ? "bg-green-500" : approvalPercentage >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
										style={{width: `${approvalPercentage}%`}}
									></div>
								</div>
								<span className="text-xs font-medium text-gray-600">
									{approvalPercentage}% aprobación
								</span>
								<span className="text-xs text-gray-500">
									{totalVotes} votos
								</span>
							</div>

							<div className="flex gap-2">
								<button className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors">
									<ChatBubbleLeftRightIcon className="h-4 w-4" />
								</button>
								<button className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors">
									<EyeIcon className="h-4 w-4" />
								</button>
								<button className="px-3 py-1 bg-primary-600 text-white text-xs rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-1">
									Ver Detalle <ArrowRightIcon className="h-3 w-3" />
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default VotingPanel;
