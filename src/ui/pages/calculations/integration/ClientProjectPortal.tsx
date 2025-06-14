// src/ui/pages/calculations/client/ClientProjectPortal.tsx
import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import {
	BuildingOfficeIcon,
	EyeIcon,
	ClockIcon,
	CurrencyDollarIcon,
	CalendarDaysIcon,
	DocumentTextIcon,
	PhotoIcon,
	CheckCircleIcon,
	ExclamationTriangleIcon,
	ChatBubbleLeftIcon,
	HandThumbUpIcon,
	HandThumbDownIcon,
	ArrowDownTrayIcon,
	BellIcon,
	UserCircleIcon,
	MapPinIcon,
	ChartBarIcon,
} from "@heroicons/react/24/outline";
import {
	LoadingSpinner,
	ProgressBar,
	Badge,
} from "../shared/components/SharedComponents";

// Types
interface ClientProject {
	id: string;
	name: string;
	description: string;
	status: "planning" | "active" | "paused" | "review" | "completed";
	startDate: Date;
	estimatedEndDate: Date;
	currentPhase: string;
	progress: {
		overall: number;
		currentPhase: number;
	};
	milestones: Milestone[];
	budget: {
		approved: number;
		spent: number;
		remaining: number;
		nextPayment?: {
			amount: number;
			dueDate: Date;
			description: string;
		};
	};
	team: {
		projectManager: string;
		architect: string;
		contact: {
			name: string;
			phone: string;
			email: string;
		};
	};
	recentUpdates: ProjectUpdate[];
	galleryImages: GalleryImage[];
	pendingApprovals: PendingApproval[];
	communications: Communication[];
}

interface Milestone {
	id: string;
	name: string;
	description: string;
	targetDate: Date;
	actualDate?: Date;
	status: "upcoming" | "current" | "completed" | "delayed";
	progress: number;
}

interface ProjectUpdate {
	id: string;
	title: string;
	description: string;
	date: Date;
	author: string;
	type: "progress" | "milestone" | "issue" | "approval" | "payment";
	attachments?: string[];
	images?: string[];
}

interface GalleryImage {
	id: string;
	url: string;
	thumbnail: string;
	caption: string;
	date: Date;
	category: "progress" | "materials" | "quality" | "safety";
}

interface PendingApproval {
	id: string;
	title: string;
	description: string;
	type: "design" | "change_order" | "payment" | "materials" | "schedule";
	submittedDate: Date;
	urgency: "low" | "medium" | "high";
	attachments: string[];
	estimatedValue?: number;
}

interface Communication {
	id: string;
	message: string;
	date: Date;
	author: string;
	isClient: boolean;
	attachments?: string[];
	status: "sent" | "read" | "replied";
}

// Custom Hook
const useClientProject = () => {
	const [project, setProject] = useState<ClientProject | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const loadProject = async (projectId: string) => {
		setIsLoading(true);
		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			const mockProject: ClientProject = {
				id: projectId,
				name: "Residencia Familiar Los Ceibos",
				description:
					"Construcción de casa familiar de 250m² con 3 dormitorios, 2.5 baños, sala, comedor, cocina, estudio y garaje doble",
				status: "active",
				startDate: new Date(2024, 0, 15),
				estimatedEndDate: new Date(2024, 9, 15),
				currentPhase: "Estructura y mampostería",
				progress: {
					overall: 45,
					currentPhase: 78,
				},
				milestones: [
					{
						id: "1",
						name: "Cimentación",
						description: "Excavación, armado y fundición de cimientos",
						targetDate: new Date(2024, 1, 28),
						actualDate: new Date(2024, 1, 25),
						status: "completed",
						progress: 100,
					},
					{
						id: "2",
						name: "Estructura",
						description: "Columnas, vigas y losa de entrepiso",
						targetDate: new Date(2024, 3, 15),
						status: "current",
						progress: 78,
					},
					{
						id: "3",
						name: "Mampostería",
						description: "Levantado de paredes",
						targetDate: new Date(2024, 4, 30),
						status: "upcoming",
						progress: 25,
					},
					{
						id: "4",
						name: "Instalaciones",
						description: "Plomería, electricidad y comunicaciones",
						targetDate: new Date(2024, 6, 15),
						status: "upcoming",
						progress: 0,
					},
				],
				budget: {
					approved: 150000,
					spent: 67500,
					remaining: 82500,
					nextPayment: {
						amount: 25000,
						dueDate: new Date(2024, 5, 30),
						description: "Pago por avance de estructura - 75%",
					},
				},
				team: {
					projectManager: "Ing. Carlos Mendoza",
					architect: "Arq. Ana García",
					contact: {
						name: "María López",
						phone: "+593 99 123 4567",
						email: "maria.lopez@construecuador.com",
					},
				},
				recentUpdates: [
					{
						id: "1",
						title: "Avance en estructura nivel 2",
						description:
							"Se completó el 78% de las columnas y vigas del segundo nivel. El cronograma se mantiene según lo planificado.",
						date: new Date(2024, 5, 12),
						author: "Ing. Carlos Mendoza",
						type: "progress",
						images: ["progress1.jpg", "progress2.jpg"],
					},
					{
						id: "2",
						title: "Cambio en especificación de ventanas",
						description:
							"Se requiere aprobación para cambio de ventanas aluminio por PVC según solicitud del cliente.",
						date: new Date(2024, 5, 10),
						author: "Arq. Ana García",
						type: "approval",
					},
				],
				galleryImages: [
					{
						id: "1",
						url: "/images/progress1.jpg",
						thumbnail: "/images/thumb1.jpg",
						caption: "Avance estructura segundo nivel",
						date: new Date(2024, 5, 12),
						category: "progress",
					},
					{
						id: "2",
						url: "/images/materials1.jpg",
						thumbnail: "/images/thumb2.jpg",
						caption: "Llegada de materiales certificados",
						date: new Date(2024, 5, 8),
						category: "materials",
					},
				],
				pendingApprovals: [
					{
						id: "1",
						title: "Cambio de ventanas",
						description:
							"Modificación de ventanas de aluminio a PVC con doble vidrio para mejor aislamiento térmico",
						type: "change_order",
						submittedDate: new Date(2024, 5, 10),
						urgency: "medium",
						attachments: ["ventanas_spec.pdf", "cotizacion_pvc.pdf"],
						estimatedValue: 3500,
					},
					{
						id: "2",
						title: "Aprobación de acabados baño principales",
						description:
							"Selección final de cerámicos y griferías para baño principal",
						type: "design",
						submittedDate: new Date(2024, 5, 8),
						urgency: "low",
						attachments: ["acabados_catalogo.pdf"],
					},
				],
				communications: [
					{
						id: "1",
						message:
							"Buenos días, me gustaría saber el estado actual del proyecto y si seguimos en cronograma.",
						date: new Date(2024, 5, 11, 9, 30),
						author: "Cliente",
						isClient: true,
						status: "replied",
					},
					{
						id: "2",
						message:
							"Buenos días Sr. Pérez. El proyecto avanza muy bien, estamos al 78% de la estructura y dentro del cronograma planificado. Adjunto fotos del avance de hoy.",
						date: new Date(2024, 5, 11, 14, 15),
						author: "Ing. Carlos Mendoza",
						isClient: false,
						attachments: ["avance_11jun.pdf"],
						status: "read",
					},
				],
			};

			setProject(mockProject);
		} catch (error) {
			console.error("Error loading client project:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const approveRequest = async (
		approvalId: string,
		approved: boolean,
		notes?: string
	) => {
		// Simulate approval process
		console.log(
			`Approval ${approvalId}: ${approved ? "approved" : "rejected"}`,
			notes
		);
	};

	const sendMessage = async (message: string, attachments?: File[]) => {
		// Simulate message sending
		console.log("Sending message:", message, attachments);
	};

	return {
		project,
		isLoading,
		loadProject,
		approveRequest,
		sendMessage,
	};
};

// Components
const ProjectStatusBadge: React.FC<{status: ClientProject["status"]}> = ({
	status,
}) => {
	const statusConfig = {
		planning: {color: "bg-blue-100 text-blue-800", label: "Planificación"},
		active: {color: "bg-green-100 text-green-800", label: "En Construcción"},
		paused: {color: "bg-yellow-100 text-yellow-800", label: "Pausado"},
		review: {color: "bg-purple-100 text-purple-800", label: "En Revisión"},
		completed: {color: "bg-gray-100 text-gray-800", label: "Completado"},
	};

	const config = statusConfig[status];

	return (
		<span
			className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
		>
			{config.label}
		</span>
	);
};

const MilestoneTimeline: React.FC<{milestones: Milestone[]}> = ({
	milestones,
}) => {
	return (
		<div className="bg-white rounded-xl border border-gray-200 p-6">
			<h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
				<CalendarDaysIcon className="h-5 w-5 text-blue-600" />
				Cronograma de Hitos
			</h3>

			<div className="space-y-6">
				{milestones.map((milestone, index) => (
					<div key={milestone.id} className="relative">
						{/* Timeline line */}
						{index < milestones.length - 1 && (
							<div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
						)}

						<div className="flex items-start gap-4">
							{/* Status indicator */}
							<div
								className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
									milestone.status === "completed"
										? "bg-green-100"
										: milestone.status === "current"
											? "bg-blue-100"
											: milestone.status === "delayed"
												? "bg-red-100"
												: "bg-gray-100"
								}`}
							>
								{milestone.status === "completed" ? (
									<CheckCircleIcon className="h-6 w-6 text-green-600" />
								) : milestone.status === "delayed" ? (
									<ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
								) : (
									<ClockIcon
										className={`h-6 w-6 ${
											milestone.status === "current"
												? "text-blue-600"
												: "text-gray-400"
										}`}
									/>
								)}
							</div>

							{/* Content */}
							<div className="flex-1">
								<div className="flex items-start justify-between mb-2">
									<div>
										<h4 className="font-medium text-gray-900">
											{milestone.name}
										</h4>
										<p className="text-sm text-gray-600">
											{milestone.description}
										</p>
									</div>
									<Badge
										variant={
											milestone.status === "completed"
												? "success"
												: milestone.status === "current"
													? "info"
													: milestone.status === "delayed"
														? "error"
														: "default"
										}
									>
										{milestone.status === "completed"
											? "Completado"
											: milestone.status === "current"
												? "En Progreso"
												: milestone.status === "delayed"
													? "Retrasado"
													: "Pendiente"}
									</Badge>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<div className="text-sm text-gray-600 mb-1">
											Fecha objetivo
										</div>
										<div className="text-sm font-medium text-gray-900">
											{milestone.targetDate.toLocaleDateString("es-EC")}
										</div>
										{milestone.actualDate && (
											<div className="text-sm text-gray-600">
												Completado:{" "}
												{milestone.actualDate.toLocaleDateString("es-EC")}
											</div>
										)}
									</div>

									<div>
										<div className="text-sm text-gray-600 mb-2">Progreso</div>
										<div className="flex items-center gap-2">
											<ProgressBar
												progress={milestone.progress}
												className="flex-1 h-2"
											/>
											<span className="text-sm font-medium text-gray-700">
												{milestone.progress}%
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

const PendingApprovalsSection: React.FC<{
	approvals: PendingApproval[];
	onApprove: (id: string, approved: boolean, notes?: string) => void;
}> = ({approvals, onApprove}) => {
	const [selectedApproval, setSelectedApproval] = useState<string | null>(null);
	const [approvalNotes, setApprovalNotes] = useState("");

	if (approvals.length === 0) {
		return (
			<div className="bg-white rounded-xl border border-gray-200 p-6">
				<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
					<CheckCircleIcon className="h-5 w-5 text-green-600" />
					Aprobaciones Pendientes
				</h3>
				<div className="text-center py-8">
					<CheckCircleIcon className="h-12 w-12 text-green-400 mx-auto mb-4" />
					<p className="text-gray-600">No hay aprobaciones pendientes</p>
					<p className="text-sm text-gray-500">
						Todas las solicitudes han sido procesadas
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-xl border border-gray-200 p-6">
			<h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
				<BellIcon className="h-5 w-5 text-yellow-600" />
				Aprobaciones Pendientes ({approvals.length})
			</h3>

			<div className="space-y-4">
				{approvals.map((approval) => (
					<div
						key={approval.id}
						className={`border rounded-lg p-4 ${
							approval.urgency === "high"
								? "border-red-200 bg-red-50"
								: approval.urgency === "medium"
									? "border-yellow-200 bg-yellow-50"
									: "border-gray-200 bg-gray-50"
						}`}
					>
						<div className="flex items-start justify-between mb-3">
							<div>
								<h4 className="font-medium text-gray-900 mb-1">
									{approval.title}
								</h4>
								<p className="text-sm text-gray-600">{approval.description}</p>
							</div>
							<div className="flex items-center gap-2">
								<Badge
									variant={
										approval.urgency === "high"
											? "error"
											: approval.urgency === "medium"
												? "warning"
												: "info"
									}
								>
									{approval.urgency === "high"
										? "Urgente"
										: approval.urgency === "medium"
											? "Medio"
											: "Bajo"}
								</Badge>
								{approval.estimatedValue && (
									<Badge variant="default">
										${approval.estimatedValue.toLocaleString()}
									</Badge>
								)}
							</div>
						</div>

						<div className="text-sm text-gray-600 mb-4">
							Enviado: {approval.submittedDate.toLocaleDateString("es-EC")}
						</div>

						{approval.attachments.length > 0 && (
							<div className="mb-4">
								<div className="text-sm font-medium text-gray-700 mb-2">
									Documentos adjuntos:
								</div>
								<div className="flex flex-wrap gap-2">
									{approval.attachments.map((attachment, index) => (
										<button
											key={index}
											className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition-colors"
										>
											<DocumentTextIcon className="h-3 w-3" />
											{attachment}
										</button>
									))}
								</div>
							</div>
						)}

						{selectedApproval === approval.id ? (
							<div className="space-y-3">
								<textarea
									value={approvalNotes}
									onChange={(e) => setApprovalNotes(e.target.value)}
									placeholder="Comentarios adicionales (opcional)..."
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
									rows={3}
								/>
								<div className="flex gap-3">
									<button
										onClick={() => {
											onApprove(approval.id, true, approvalNotes);
											setSelectedApproval(null);
											setApprovalNotes("");
										}}
										className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
									>
										<HandThumbUpIcon className="h-4 w-4" />
										Aprobar
									</button>
									<button
										onClick={() => {
											onApprove(approval.id, false, approvalNotes);
											setSelectedApproval(null);
											setApprovalNotes("");
										}}
										className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
									>
										<HandThumbDownIcon className="h-4 w-4" />
										Rechazar
									</button>
									<button
										onClick={() => {
											setSelectedApproval(null);
											setApprovalNotes("");
										}}
										className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
									>
										Cancelar
									</button>
								</div>
							</div>
						) : (
							<div className="flex gap-2">
								<button
									onClick={() => setSelectedApproval(approval.id)}
									className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
								>
									Revisar y Decidir
								</button>
								<button className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm">
									Ver Detalles
								</button>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

const CommunicationCenter: React.FC<{
	communications: Communication[];
	onSendMessage: (message: string, attachments?: File[]) => void;
}> = ({communications, onSendMessage}) => {
	const [newMessage, setNewMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSendMessage = async () => {
		if (!newMessage.trim()) return;

		setIsLoading(true);
		try {
			await onSendMessage(newMessage);
			setNewMessage("");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="bg-white rounded-xl border border-gray-200 p-6">
			<h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
				<ChatBubbleLeftIcon className="h-5 w-5 text-blue-600" />
				Centro de Comunicaciones
			</h3>

			{/* Message History */}
			<div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
				{communications.map((comm) => (
					<div
						key={comm.id}
						className={`flex ${comm.isClient ? "justify-end" : "justify-start"}`}
					>
						<div
							className={`max-w-md p-4 rounded-lg ${
								comm.isClient
									? "bg-blue-600 text-white"
									: "bg-gray-100 text-gray-900"
							}`}
						>
							<div className="flex items-center gap-2 mb-2">
								<UserCircleIcon className="h-4 w-4" />
								<span className="text-sm font-medium">{comm.author}</span>
								<span className="text-xs opacity-75">
									{comm.date.toLocaleString("es-EC")}
								</span>
							</div>
							<p className="text-sm">{comm.message}</p>

							{comm.attachments && comm.attachments.length > 0 && (
								<div className="mt-2 space-y-1">
									{comm.attachments.map((attachment, index) => (
										<div
											key={index}
											className="flex items-center gap-1 text-xs"
										>
											<DocumentTextIcon className="h-3 w-3" />
											{attachment}
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				))}
			</div>

			{/* New Message */}
			<div className="border-t border-gray-200 pt-4">
				<div className="space-y-3">
					<textarea
						value={newMessage}
						onChange={(e) => setNewMessage(e.target.value)}
						placeholder="Escriba su mensaje aquí..."
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
						rows={3}
					/>
					<div className="flex justify-between items-center">
						<button className="text-sm text-gray-600 hover:text-gray-800 transition-colors">
							📎 Adjuntar archivo
						</button>
						<button
							onClick={handleSendMessage}
							disabled={!newMessage.trim() || isLoading}
							className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
						>
							{isLoading ? <LoadingSpinner size="sm" /> : null}
							Enviar Mensaje
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

const ClientProjectPortal: React.FC = () => {
	const {projectId} = useParams<{projectId: string}>();
	const {project, isLoading, loadProject, approveRequest, sendMessage} =
		useClientProject();

	const [selectedTab, setSelectedTab] = useState<
		"overview" | "timeline" | "gallery" | "approvals" | "communication"
	>("overview");

	useEffect(() => {
		if (projectId) {
			loadProject(projectId);
		}
	}, [projectId]);

	if (isLoading) {
		return (
			<div className="max-w-6xl mx-auto px-4 py-8">
				<div className="flex items-center justify-center h-64">
					<div className="text-center">
						<LoadingSpinner size="lg" className="mx-auto mb-4" />
						<p className="text-gray-600">
							Cargando información del proyecto...
						</p>
					</div>
				</div>
			</div>
		);
	}

	if (!project) {
		return (
			<div className="max-w-6xl mx-auto px-4 py-8">
				<div className="text-center py-12">
					<BuildingOfficeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
					<h3 className="text-lg font-medium text-gray-900 mb-2">
						Proyecto no encontrado
					</h3>
					<p className="text-gray-600">
						No se pudo cargar la información de su proyecto.
					</p>
				</div>
			</div>
		);
	}

	const renderHeader = () => (
		<div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
			<div className="flex items-start justify-between mb-6">
				<div className="flex items-start gap-4">
					<div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-600 rounded-2xl flex items-center justify-center">
						<BuildingOfficeIcon className="h-8 w-8 text-white" />
					</div>
					<div>
						<h1 className="text-2xl font-bold text-gray-900 mb-1">
							{project.name}
						</h1>
						<p className="text-gray-600 mb-3">{project.description}</p>
						<div className="flex items-center gap-4 mb-3">
							<ProjectStatusBadge status={project.status} />
							<span className="text-sm text-gray-500">
								Fase actual: {project.currentPhase}
							</span>
						</div>
						<div className="text-sm text-gray-600">
							Inicio: {project.startDate.toLocaleDateString("es-EC")} •
							Estimado: {project.estimatedEndDate.toLocaleDateString("es-EC")}
						</div>
					</div>
				</div>

				<div className="text-right">
					<div className="text-3xl font-bold text-gray-900 mb-1">
						{project.progress.overall}%
					</div>
					<div className="text-sm text-gray-600 mb-2">Progreso general</div>
					<ProgressBar
						progress={project.progress.overall}
						className="w-32 h-2"
					/>
				</div>
			</div>

			{/* Contact Information */}
			<div className="bg-gray-50 rounded-lg p-4">
				<h3 className="font-medium text-gray-900 mb-3">Equipo del Proyecto</h3>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
					<div>
						<div className="text-gray-600">Director del Proyecto</div>
						<div className="font-medium text-gray-900">
							{project.team.projectManager}
						</div>
					</div>
					<div>
						<div className="text-gray-600">Arquitecto</div>
						<div className="font-medium text-gray-900">
							{project.team.architect}
						</div>
					</div>
					<div>
						<div className="text-gray-600">Contacto</div>
						<div className="font-medium text-gray-900">
							{project.team.contact.name}
						</div>
						<div className="text-gray-600">{project.team.contact.phone}</div>
						<div className="text-gray-600">{project.team.contact.email}</div>
					</div>
				</div>
			</div>

			{/* Navigation Tabs */}
			<div className="flex gap-1 bg-gray-100 rounded-lg p-1 mt-6">
				{[
					{key: "overview", label: "Resumen", icon: ChartBarIcon},
					{key: "timeline", label: "Cronograma", icon: CalendarDaysIcon},
					{key: "gallery", label: "Galería", icon: PhotoIcon},
					{key: "approvals", label: "Aprobaciones", icon: CheckCircleIcon},
					{
						key: "communication",
						label: "Comunicación",
						icon: ChatBubbleLeftIcon,
					},
				].map(({key, label, icon: Icon}) => (
					<button
						key={key}
						onClick={() => setSelectedTab(key as typeof selectedTab)}
						className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
							selectedTab === key
								? "bg-white text-blue-600 shadow-sm"
								: "text-gray-600 hover:text-gray-900"
						}`}
					>
						<Icon className="h-4 w-4" />
						{label}
						{key === "approvals" && project.pendingApprovals.length > 0 && (
							<span className="ml-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
								{project.pendingApprovals.length}
							</span>
						)}
					</button>
				))}
			</div>
		</div>
	);

	const renderOverview = () => (
		<div className="space-y-6">
			{/* Budget Summary */}
			<div className="bg-white rounded-xl border border-gray-200 p-6">
				<h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
					<CurrencyDollarIcon className="h-5 w-5 text-green-600" />
					Resumen Financiero
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					<div className="text-center">
						<div className="text-2xl font-bold text-gray-900 mb-1">
							${project.budget.approved.toLocaleString()}
						</div>
						<div className="text-sm text-gray-600">Presupuesto Aprobado</div>
					</div>
					<div className="text-center">
						<div className="text-2xl font-bold text-red-600 mb-1">
							${project.budget.spent.toLocaleString()}
						</div>
						<div className="text-sm text-gray-600">Gastado</div>
					</div>
					<div className="text-center">
						<div className="text-2xl font-bold text-green-600 mb-1">
							${project.budget.remaining.toLocaleString()}
						</div>
						<div className="text-sm text-gray-600">Disponible</div>
					</div>
					<div className="text-center">
						<div className="text-sm text-gray-600 mb-1">Utilización</div>
						<ProgressBar
							progress={(project.budget.spent / project.budget.approved) * 100}
							className="mb-2"
						/>
						<div className="text-sm font-medium text-gray-900">
							{((project.budget.spent / project.budget.approved) * 100).toFixed(
								1
							)}
							%
						</div>
					</div>
				</div>

				{project.budget.nextPayment && (
					<div className="mt-6 p-4 bg-blue-50 rounded-lg">
						<h4 className="font-medium text-blue-900 mb-2">Próximo Pago</h4>
						<div className="flex justify-between items-center">
							<div>
								<div className="text-lg font-bold text-blue-900">
									${project.budget.nextPayment.amount.toLocaleString()}
								</div>
								<div className="text-sm text-blue-700">
									{project.budget.nextPayment.description}
								</div>
							</div>
							<div className="text-right">
								<div className="text-sm text-blue-700">Vencimiento</div>
								<div className="font-medium text-blue-900">
									{project.budget.nextPayment.dueDate.toLocaleDateString(
										"es-EC"
									)}
								</div>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Recent Updates */}
			<div className="bg-white rounded-xl border border-gray-200 p-6">
				<h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
					<ClockIcon className="h-5 w-5 text-blue-600" />
					Actualizaciones Recientes
				</h3>
				<div className="space-y-4">
					{project.recentUpdates.map((update) => (
						<div
							key={update.id}
							className="border-l-4 border-blue-400 pl-4 py-2"
						>
							<div className="flex items-start justify-between mb-2">
								<h4 className="font-medium text-gray-900">{update.title}</h4>
								<Badge
									variant={
										update.type === "progress"
											? "success"
											: update.type === "approval"
												? "warning"
												: "info"
									}
								>
									{update.type === "progress"
										? "Progreso"
										: update.type === "approval"
											? "Aprobación"
											: update.type === "milestone"
												? "Hito"
												: "Actualización"}
								</Badge>
							</div>
							<p className="text-sm text-gray-600 mb-2">{update.description}</p>
							<div className="text-xs text-gray-500">
								{update.author} • {update.date.toLocaleDateString("es-EC")}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);

	const renderGallery = () => (
		<div className="bg-white rounded-xl border border-gray-200 p-6">
			<h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
				<PhotoIcon className="h-5 w-5 text-purple-600" />
				Galería del Proyecto
			</h3>

			{project.galleryImages.length === 0 ? (
				<div className="text-center py-12">
					<PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
					<p className="text-gray-600">No hay imágenes disponibles</p>
					<p className="text-sm text-gray-500">
						Las fotos del progreso aparecerán aquí
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{project.galleryImages.map((image) => (
						<div key={image.id} className="group relative">
							<div className="aspect-w-16 aspect-h-12 bg-gray-200 rounded-lg overflow-hidden">
								<img
									src={image.thumbnail}
									alt={image.caption}
									className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
								/>
							</div>
							<div className="mt-3">
								<h4 className="font-medium text-gray-900">{image.caption}</h4>
								<div className="flex items-center justify-between mt-1">
									<Badge
										variant={
											image.category === "progress"
												? "info"
												: image.category === "materials"
													? "warning"
													: image.category === "quality"
														? "success"
														: "default"
										}
									>
										{image.category === "progress"
											? "Progreso"
											: image.category === "materials"
												? "Materiales"
												: image.category === "quality"
													? "Calidad"
													: "Seguridad"}
									</Badge>
									<span className="text-sm text-gray-500">
										{image.date.toLocaleDateString("es-EC")}
									</span>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);

	return (
		<div className="max-w-6xl mx-auto px-4 py-8">
			{renderHeader()}

			{selectedTab === "overview" && renderOverview()}
			{selectedTab === "timeline" && (
				<MilestoneTimeline milestones={project.milestones} />
			)}
			{selectedTab === "gallery" && renderGallery()}
			{selectedTab === "approvals" && (
				<PendingApprovalsSection
					approvals={project.pendingApprovals}
					onApprove={approveRequest}
				/>
			)}
			{selectedTab === "communication" && (
				<CommunicationCenter
					communications={project.communications}
					onSendMessage={sendMessage}
				/>
			)}
		</div>
	);
};

export default ClientProjectPortal;
