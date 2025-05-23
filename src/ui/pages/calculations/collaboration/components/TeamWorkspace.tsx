import React from "react";
import {
	UserGroupIcon,
	DocumentTextIcon,
	CalendarIcon,
	ArrowRightIcon,
	LockClosedIcon,
	GlobeAltIcon,
} from "@heroicons/react/24/outline";
import {Link} from "react-router-dom";

interface TeamMember {
	id: string;
	name: string;
	role: "owner" | "admin" | "editor" | "viewer";
	avatar?: string;
	status: "online" | "offline" | "away";
}

interface Workspace {
	id: string;
	name: string;
	description: string;
	memberCount: number;
	calculationCount: number;
	createdAt: string;
	lastActive: string;
	isPublic: boolean;
	members: TeamMember[];
	logoColor?: string;
}

interface TeamWorkspaceProps {
	workspace: Workspace;
	showActions?: boolean;
}

const TeamWorkspace: React.FC<TeamWorkspaceProps> = ({
	workspace,
	showActions = true,
}) => {
	// Formatear fecha
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("es-EC", {
			day: "2-digit",
			month: "short",
			year: "numeric",
		});
	};

	// Generar iniciales para el avatar de equipo
	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((word) => word[0])
			.join("")
			.toUpperCase()
			.substring(0, 2);
	};

	// Obtener color de fondo para el logo
	const getLogoColor = () => {
		return (
			workspace.logoColor ||
			[
				"bg-primary-100 text-primary-600",
				"bg-indigo-100 text-indigo-600",
				"bg-green-100 text-green-600",
				"bg-amber-100 text-amber-600",
				"bg-rose-100 text-rose-600",
			][Math.floor(Math.random() * 5)]
		);
	};

	return (
		<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
			<div className="p-5">
				{/* Encabezado con logo e info del espacio */}
				<div className="flex items-center gap-4 mb-4">
					<div
						className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg ${getLogoColor()}`}
					>
						{getInitials(workspace.name)}
					</div>
					<div className="flex-1">
						<div className="flex items-center gap-2">
							<h3 className="font-semibold text-gray-900">{workspace.name}</h3>
							{workspace.isPublic ? (
								<GlobeAltIcon
									className="h-4 w-4 text-green-600"
									title="Espacio público"
								/>
							) : (
								<LockClosedIcon
									className="h-4 w-4 text-gray-400"
									title="Espacio privado"
								/>
							)}
						</div>
						<p className="text-sm text-gray-600 line-clamp-1">
							{workspace.description}
						</p>
					</div>
				</div>

				{/* Estadísticas del espacio */}
				<div className="grid grid-cols-2 gap-3 mb-4">
					<div className="bg-gray-50 rounded-lg p-3 text-center">
						<div className="flex items-center justify-center gap-1 mb-1">
							<UserGroupIcon className="h-4 w-4 text-gray-500" />
							<span className="text-sm font-medium text-gray-900">
								{workspace.memberCount}
							</span>
						</div>
						<div className="text-xs text-gray-600">Miembros</div>
					</div>
					<div className="bg-gray-50 rounded-lg p-3 text-center">
						<div className="flex items-center justify-center gap-1 mb-1">
							<DocumentTextIcon className="h-4 w-4 text-gray-500" />
							<span className="text-sm font-medium text-gray-900">
								{workspace.calculationCount}
							</span>
						</div>
						<div className="text-xs text-gray-600">Cálculos</div>
					</div>
				</div>

				{/* Miembros con avatares */}
				<div className="mb-4">
					<div className="text-xs text-gray-500 mb-2">Miembros</div>
					<div className="flex -space-x-2 overflow-hidden">
						{workspace.members.slice(0, 5).map((member) => (
							<div
								key={member.id}
								className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border-2 border-white ${
									member.role === "owner"
										? "bg-primary-100 text-primary-600"
										: member.role === "admin"
											? "bg-indigo-100 text-indigo-600"
											: "bg-gray-100 text-gray-600"
								}`}
								title={`${member.name} (${
									member.role === "owner"
										? "Propietario"
										: member.role === "admin"
											? "Administrador"
											: member.role === "editor"
												? "Editor"
												: "Visualizador"
								})`}
							>
								{member.name
									.split(" ")
									.map((n) => n[0])
									.join("")}
							</div>
						))}
						{workspace.members.length > 5 && (
							<div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 text-xs font-medium border-2 border-white">
								+{workspace.members.length - 5}
							</div>
						)}
					</div>
				</div>

				{/* Fechas */}
				<div className="text-xs text-gray-500 flex justify-between mb-4">
					<div className="flex items-center gap-1">
						<CalendarIcon className="h-3 w-3" />
						<span>Creado: {formatDate(workspace.createdAt)}</span>
					</div>
					<div>Última actividad: {formatDate(workspace.lastActive)}</div>
				</div>

				{/* Botones de acción */}
				{showActions && (
					<div className="pt-3 border-t border-gray-100">
						<Link
							to={`/calculations/collaboration/workspace/${workspace.id}`}
							className="w-full flex items-center justify-center gap-1 px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors"
						>
							Acceder <ArrowRightIcon className="h-3 w-3" />
						</Link>
					</div>
				)}
			</div>
		</div>
	);
};

export default TeamWorkspace;
