import React, {useState} from "react";
import {
	UserGroupIcon,
	ShareIcon,
	PlusIcon,
	XMarkIcon,
	ClockIcon,
	PencilIcon,
	ChatBubbleLeftRightIcon,
	DocumentTextIcon,
	UserIcon,
	LinkIcon,
	GlobeAltIcon,
	LockClosedIcon,
	MagnifyingGlassIcon,
	AdjustmentsHorizontalIcon,
	ArrowPathIcon,
} from "@heroicons/react/24/outline";
import {
	CheckCircleIcon,
} from "@heroicons/react/24/solid";

// Tipos de datos
interface TeamMember {
	id: string;
	name: string;
	email: string;
	role: "owner" | "admin" | "editor" | "viewer";
	profession: string;
	avatar?: string;
	status: "online" | "offline" | "away";
	lastActive: string;
	joinedAt: string;
}

interface SharedCalculation {
	id: string;
	name: string;
	description: string;
	templateName: string;
	category: string;
	owner: TeamMember;
	sharedWith: TeamMember[];
	permissions: {
		canEdit: boolean;
		canComment: boolean;
		canShare: boolean;
		canExport: boolean;
	};
	isPublic: boolean;
	shareLink?: string;
	createdAt: string;
	lastModified: string;
	modifiedBy: TeamMember;
	status: "draft" | "review" | "approved" | "archived";
	comments: Comment[];
	versions: CalculationVersion[];
}

interface Comment {
	id: string;
	author: TeamMember;
	content: string;
	timestamp: string;
	type: "comment" | "suggestion" | "question";
	resolved: boolean;
	replies: Comment[];
}

interface CalculationVersion {
	id: string;
	version: string;
	description: string;
	author: TeamMember;
	timestamp: string;
	changes: string[];
}

interface Workspace {
	id: string;
	name: string;
	description: string;
	members: TeamMember[];
	calculations: SharedCalculation[];
	createdAt: string;
	settings: {
		defaultPermissions: "viewer" | "editor";
		allowPublicSharing: boolean;
		requireApproval: boolean;
	};
}

// Datos mock
const mockMembers: TeamMember[] = [
	{
		id: "1",
		name: "María Vásquez",
		email: "maria.vasquez@constru.com",
		role: "owner",
		profession: "Ing. Estructural",
		status: "online",
		lastActive: "2024-03-15T10:30:00Z",
		joinedAt: "2024-01-15T08:00:00Z",
	},
	{
		id: "2",
		name: "Carlos Mendoza",
		email: "carlos.mendoza@constru.com",
		role: "admin",
		profession: "Ing. Eléctrico",
		status: "online",
		lastActive: "2024-03-15T09:45:00Z",
		joinedAt: "2024-01-20T10:00:00Z",
	},
	{
		id: "3",
		name: "Ana Torres",
		email: "ana.torres@constru.com",
		role: "editor",
		profession: "Arquitecta",
		status: "away",
		lastActive: "2024-03-15T08:15:00Z",
		joinedAt: "2024-02-01T14:30:00Z",
	},
	{
		id: "4",
		name: "Luis Ramos",
		email: "luis.ramos@constru.com",
		role: "viewer",
		profession: "Ing. Civil",
		status: "offline",
		lastActive: "2024-03-14T16:20:00Z",
		joinedAt: "2024-02-15T11:00:00Z",
	},
];

const mockCalculations: SharedCalculation[] = [
	{
		id: "calc-1",
		name: "Análisis Sísmico Torre Residencial",
		description: "Cálculo de fuerzas sísmicas para edificio de 15 pisos",
		templateName: "Análisis Sísmico Estático",
		category: "Estructural",
		owner: mockMembers[0],
		sharedWith: [mockMembers[1], mockMembers[2], mockMembers[3]],
		permissions: {
			canEdit: true,
			canComment: true,
			canShare: true,
			canExport: true,
		},
		isPublic: false,
		createdAt: "2024-03-10T14:30:00Z",
		lastModified: "2024-03-15T10:30:00Z",
		modifiedBy: mockMembers[0],
		status: "review",
		comments: [],
		versions: [],
	},
	{
		id: "calc-2",
		name: "Demanda Eléctrica Residencial",
		description: "Cálculo de carga eléctrica para conjunto habitacional",
		templateName: "Demanda Eléctrica Residencial",
		category: "Eléctrico",
		owner: mockMembers[1],
		sharedWith: [mockMembers[0], mockMembers[3]],
		permissions: {
			canEdit: false,
			canComment: true,
			canShare: false,
			canExport: true,
		},
		isPublic: true,
		shareLink: "https://constru.com/share/calc-2-abc123",
		createdAt: "2024-03-12T09:15:00Z",
		lastModified: "2024-03-14T16:45:00Z",
		modifiedBy: mockMembers[1],
		status: "approved",
		comments: [],
		versions: [],
	},
];

const CollaborationWorkspace: React.FC = () => {
	const [activeTab, setActiveTab] = useState("calculations");
	const [selectedCalculation, setSelectedCalculation] =
		useState<SharedCalculation | null>(null);
	const [showShareModal, setShowShareModal] = useState(false);
	const [showInviteModal, setShowInviteModal] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [filterStatus, setFilterStatus] = useState<string>("");
	const [filterCategory, setFilterCategory] = useState<string>("");

	const tabs = [
		{
			id: "calculations",
			name: "Cálculos Compartidos",
			icon: DocumentTextIcon,
			count: mockCalculations.length,
		},
		{
			id: "members",
			name: "Miembros del Equipo",
			icon: UserGroupIcon,
			count: mockMembers.length,
		},
		{id: "activity", name: "Actividad Reciente", icon: ClockIcon, count: 5},
		{
			id: "settings",
			name: "Configuración",
			icon: AdjustmentsHorizontalIcon,
			count: 0,
		},
	];

	const roles = [
		{
			id: "owner",
			name: "Propietario",
			description: "Control total del espacio de trabajo",
		},
		{
			id: "admin",
			name: "Administrador",
			description: "Puede gestionar miembros y configuración",
		},
		{
			id: "editor",
			name: "Editor",
			description: "Puede crear y editar cálculos",
		},
		{
			id: "viewer",
			name: "Visualizador",
			description: "Solo puede ver y comentar",
		},
	];

	const statusOptions = [
		{value: "draft", label: "Borrador", color: "bg-gray-100 text-gray-700"},
		{
			value: "review",
			label: "En Revisión",
			color: "bg-yellow-100 text-yellow-700",
		},
		{
			value: "approved",
			label: "Aprobado",
			color: "bg-green-100 text-green-700",
		},
		{value: "archived", label: "Archivado", color: "bg-gray-100 text-gray-500"},
	];

	const getStatusBadge = (status: string) => {
		const statusOption = statusOptions.find((opt) => opt.value === status);
		return statusOption ? (
			<span
				className={`px-2 py-1 rounded-full text-xs font-medium ${statusOption.color}`}
			>
				{statusOption.label}
			</span>
		) : null;
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "online":
				return "bg-green-500";
			case "away":
				return "bg-yellow-500";
			case "offline":
				return "bg-gray-400";
			default:
				return "bg-gray-400";
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("es-EC", {
			day: "2-digit",
			month: "short",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const filteredCalculations = mockCalculations.filter((calc) => {
		const matchesSearch =
			calc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			calc.description.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesStatus = !filterStatus || calc.status === filterStatus;
		const matchesCategory = !filterCategory || calc.category === filterCategory;

		return matchesSearch && matchesStatus && matchesCategory;
	});

	const renderCalculations = () => (
		<div className="space-y-6">
			{/* Filtros */}
			<div className="bg-white rounded-xl border border-gray-200 p-4">
				<div className="flex flex-col lg:flex-row gap-4">
					<div className="flex-1">
						<div className="relative">
							<MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
							<input
								type="text"
								placeholder="Buscar cálculos compartidos..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
							/>
						</div>
					</div>

					<div className="flex gap-3">
						<select
							value={filterStatus}
							onChange={(e) => setFilterStatus(e.target.value)}
							className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
						>
							<option value="">Todos los estados</option>
							{statusOptions.map((status) => (
								<option key={status.value} value={status.value}>
									{status.label}
								</option>
							))}
						</select>

						<select
							value={filterCategory}
							onChange={(e) => setFilterCategory(e.target.value)}
							className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
						>
							<option value="">Todas las categorías</option>
							<option value="Estructural">🏗️ Estructural</option>
							<option value="Eléctrico">⚡ Eléctrico</option>
							<option value="Arquitectónico">🏛️ Arquitectónico</option>
							<option value="Hidráulico">🚰 Hidráulico</option>
						</select>

						<button
							onClick={() => setShowShareModal(true)}
							className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
						>
							<ShareIcon className="h-4 w-4" />
							Compartir Nuevo
						</button>
					</div>
				</div>
			</div>

			{/* Lista de cálculos */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{filteredCalculations.map((calculation) => (
					<div
						key={calculation.id}
						className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
						onClick={() => setSelectedCalculation(calculation)}
					>
						<div className="flex items-start justify-between mb-4">
							<div className="flex-1">
								<div className="flex items-center gap-2 mb-2">
									<h3 className="font-semibold text-gray-900 text-lg">
										{calculation.name}
									</h3>
									{calculation.isPublic ? (
										<GlobeAltIcon className="h-4 w-4 text-green-600" />
									) : (
										<LockClosedIcon className="h-4 w-4 text-gray-400" />
									)}
								</div>
								<p className="text-gray-600 text-sm mb-3">
									{calculation.description}
								</p>
								<div className="flex items-center gap-2">
									{getStatusBadge(calculation.status)}
									<span className="text-xs text-gray-500">
										{calculation.category}
									</span>
								</div>
							</div>
						</div>

						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<div className="flex -space-x-2">
									{calculation.sharedWith.slice(0, 3).map((member, index) => (
										<div
											key={member.id}
											className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-xs font-medium border-2 border-white"
											title={member.name}
										>
											{member.name
												.split(" ")
												.map((n) => n[0])
												.join("")}
										</div>
									))}
									{calculation.sharedWith.length > 3 && (
										<div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 text-xs font-medium border-2 border-white">
											+{calculation.sharedWith.length - 3}
										</div>
									)}
								</div>
								<span className="text-xs text-gray-500">
									{calculation.sharedWith.length} miembro
									{calculation.sharedWith.length !== 1 ? "s" : ""}
								</span>
							</div>

							<div className="text-right">
								<div className="text-xs text-gray-500">
									Modificado {formatDate(calculation.lastModified)}
								</div>
								<div className="text-xs text-gray-400">
									por {calculation.modifiedBy.name}
								</div>
							</div>
						</div>

						<div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
							<div className="flex items-center gap-3 text-xs text-gray-500">
								{calculation.permissions.canEdit && (
									<div className="flex items-center gap-1">
										<PencilIcon className="h-3 w-3" />
										<span>Editable</span>
									</div>
								)}
								{calculation.permissions.canComment && (
									<div className="flex items-center gap-1">
										<ChatBubbleLeftRightIcon className="h-3 w-3" />
										<span>Comentarios</span>
									</div>
								)}
								{calculation.permissions.canShare && (
									<div className="flex items-center gap-1">
										<ShareIcon className="h-3 w-3" />
										<span>Compartible</span>
									</div>
								)}
							</div>

							<button
								onClick={(e) => {
									e.stopPropagation();
									setSelectedCalculation(calculation);
									setShowShareModal(true);
								}}
								className="text-primary-600 hover:text-primary-700 text-sm font-medium"
							>
								Gestionar
							</button>
						</div>
					</div>
				))}
			</div>

			{filteredCalculations.length === 0 && (
				<div className="text-center py-12 bg-white rounded-xl border border-gray-200">
					<DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
					<h3 className="text-lg font-medium text-gray-900 mb-2">
						No se encontraron cálculos
					</h3>
					<p className="text-gray-600 mb-6">
						{searchTerm || filterStatus || filterCategory
							? "Intenta ajustar los filtros de búsqueda."
							: "Aún no tienes cálculos compartidos en este espacio de trabajo."}
					</p>
					<button
						onClick={() => setShowShareModal(true)}
						className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
					>
						Compartir Primer Cálculo
					</button>
				</div>
			)}
		</div>
	);

	const renderMembers = () => (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h3 className="text-lg font-semibold text-gray-900">
						Miembros del Equipo ({mockMembers.length})
					</h3>
					<p className="text-sm text-gray-600">
						Gestiona los miembros y sus permisos en el espacio de trabajo
					</p>
				</div>
				<button
					onClick={() => setShowInviteModal(true)}
					className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
				>
					<PlusIcon className="h-4 w-4" />
					Invitar Miembro
				</button>
			</div>

			<div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
				<div className="divide-y divide-gray-200">
					{mockMembers.map((member) => (
						<div
							key={member.id}
							className="p-6 hover:bg-gray-50 transition-colors"
						>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-4">
									<div className="relative">
										<div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-medium">
											{member.name
												.split(" ")
												.map((n) => n[0])
												.join("")}
										</div>
										<div
											className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(member.status)} rounded-full border-2 border-white`}
										/>
									</div>

									<div>
										<div className="flex items-center gap-2">
											<h4 className="font-medium text-gray-900">
												{member.name}
											</h4>
											{member.role === "owner" && (
												<span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
													Propietario
												</span>
											)}
										</div>
										<p className="text-sm text-gray-600">{member.email}</p>
										<p className="text-xs text-gray-500">{member.profession}</p>
									</div>
								</div>

								<div className="flex items-center gap-4">
									<div className="text-right">
										<div className="text-sm font-medium text-gray-700 capitalize">
											{member.role === "owner"
												? "Propietario"
												: member.role === "admin"
													? "Administrador"
													: member.role === "editor"
														? "Editor"
														: "Visualizador"}
										</div>
										<div className="text-xs text-gray-500">
											{member.status === "online"
												? "En línea"
												: member.status === "away"
													? "Ausente"
													: `Visto ${formatDate(member.lastActive)}`}
										</div>
									</div>

									{member.role !== "owner" && (
										<div className="flex items-center gap-2">
											<select
												defaultValue={member.role}
												className="px-2 py-1 text-sm border border-gray-300 rounded"
											>
												<option value="admin">Administrador</option>
												<option value="editor">Editor</option>
												<option value="viewer">Visualizador</option>
											</select>
											<button className="p-1 text-red-600 hover:bg-red-50 rounded">
												<XMarkIcon className="h-4 w-4" />
											</button>
										</div>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);

	const renderActivity = () => (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-semibold text-gray-900 mb-4">
					Actividad Reciente
				</h3>
			</div>

			<div className="bg-white rounded-xl border border-gray-200 p-6">
				<div className="space-y-6">
					{[
						{
							type: "calculation_shared",
							user: "María Vásquez",
							action: "compartió",
							target: "Análisis Sísmico Torre Residencial",
							time: "Hace 2 horas",
							icon: ShareIcon,
							color: "text-blue-600 bg-blue-50",
						},
						{
							type: "comment_added",
							user: "Carlos Mendoza",
							action: "comentó en",
							target: "Demanda Eléctrica Residencial",
							time: "Hace 4 horas",
							icon: ChatBubbleLeftRightIcon,
							color: "text-green-600 bg-green-50",
						},
						{
							type: "member_joined",
							user: "Luis Ramos",
							action: "se unió al equipo",
							target: "",
							time: "Hace 1 día",
							icon: UserIcon,
							color: "text-purple-600 bg-purple-50",
						},
						{
							type: "calculation_approved",
							user: "Ana Torres",
							action: "aprobó",
							target: "Cálculo de Áreas Comerciales",
							time: "Hace 2 días",
							icon: CheckCircleIcon,
							color: "text-emerald-600 bg-emerald-50",
						},
						{
							type: "calculation_edited",
							user: "María Vásquez",
							action: "editó",
							target: "Diseño de Vigas Principales",
							time: "Hace 3 días",
							icon: PencilIcon,
							color: "text-orange-600 bg-orange-50",
						},
					].map((activity, index) => (
						<div key={index} className="flex items-start gap-4">
							<div
								className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.color}`}
							>
								<activity.icon className="h-5 w-5" />
							</div>
							<div className="flex-1">
								<p className="text-sm text-gray-900">
									<span className="font-medium">{activity.user}</span>{" "}
									{activity.action}{" "}
									{activity.target && (
										<span className="font-medium text-primary-600">
											{activity.target}
										</span>
									)}
								</p>
								<p className="text-xs text-gray-500 mt-1">{activity.time}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);

	const renderSettings = () => (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-semibold text-gray-900 mb-4">
					Configuración del Espacio de Trabajo
				</h3>
			</div>

			<div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
				<div>
					<h4 className="font-medium text-gray-900 mb-4">
						Permisos por Defecto
					</h4>
					<div className="space-y-3">
						<label className="flex items-center">
							<input
								type="radio"
								name="defaultPermissions"
								value="viewer"
								className="h-4 w-4 text-primary-600"
							/>
							<span className="ml-3 text-sm text-gray-700">
								<span className="font-medium">Visualizador</span> - Los nuevos
								miembros solo pueden ver
							</span>
						</label>
						<label className="flex items-center">
							<input
								type="radio"
								name="defaultPermissions"
								value="editor"
								className="h-4 w-4 text-primary-600"
								defaultChecked
							/>
							<span className="ml-3 text-sm text-gray-700">
								<span className="font-medium">Editor</span> - Los nuevos
								miembros pueden crear y editar
							</span>
						</label>
					</div>
				</div>

				<div>
					<h4 className="font-medium text-gray-900 mb-4">
						Opciones de Compartición
					</h4>
					<div className="space-y-3">
						<label className="flex items-center justify-between">
							<div>
								<span className="text-sm font-medium text-gray-700">
									Permitir compartición pública
								</span>
								<p className="text-xs text-gray-500">
									Los miembros pueden hacer públicos sus cálculos
								</p>
							</div>
							<input
								type="checkbox"
								className="h-4 w-4 text-primary-600"
								defaultChecked
							/>
						</label>

						<label className="flex items-center justify-between">
							<div>
								<span className="text-sm font-medium text-gray-700">
									Requerir aprobación para compartir
								</span>
								<p className="text-xs text-gray-500">
									Los administradores deben aprobar antes de compartir
								</p>
							</div>
							<input type="checkbox" className="h-4 w-4 text-primary-600" />
						</label>

						<label className="flex items-center justify-between">
							<div>
								<span className="text-sm font-medium text-gray-700">
									Permitir enlaces públicos
								</span>
								<p className="text-xs text-gray-500">
									Crear enlaces para acceso sin cuenta
								</p>
							</div>
							<input
								type="checkbox"
								className="h-4 w-4 text-primary-600"
								defaultChecked
							/>
						</label>
					</div>
				</div>

				<div>
					<h4 className="font-medium text-gray-900 mb-4">
						Notificaciones del Equipo
					</h4>
					<div className="space-y-3">
						<label className="flex items-center justify-between">
							<span className="text-sm text-gray-700">
								Nuevos cálculos compartidos
							</span>
							<input
								type="checkbox"
								className="h-4 w-4 text-primary-600"
								defaultChecked
							/>
						</label>
						<label className="flex items-center justify-between">
							<span className="text-sm text-gray-700">
								Comentarios y sugerencias
							</span>
							<input
								type="checkbox"
								className="h-4 w-4 text-primary-600"
								defaultChecked
							/>
						</label>
						<label className="flex items-center justify-between">
							<span className="text-sm text-gray-700">Cambios en permisos</span>
							<input type="checkbox" className="h-4 w-4 text-primary-600" />
						</label>
						<label className="flex items-center justify-between">
							<span className="text-sm text-gray-700">
								Nuevos miembros del equipo
							</span>
							<input
								type="checkbox"
								className="h-4 w-4 text-primary-600"
								defaultChecked
							/>
						</label>
					</div>
				</div>

				<div className="pt-6 border-t border-gray-200">
					<button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
						Guardar Configuración
					</button>
				</div>
			</div>
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
								Espacio de Colaboración
							</h1>
							<p className="text-gray-600 mt-1">
								Trabaja en equipo y comparte cálculos técnicos con tu equipo
							</p>
						</div>

						<div className="flex items-center gap-3">
							<button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
								<ArrowPathIcon className="h-4 w-4" />
								Sincronizar
							</button>
							<button
								onClick={() => setShowInviteModal(true)}
								className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
							>
								<UserGroupIcon className="h-4 w-4" />
								Invitar Equipo
							</button>
						</div>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Navegación por tabs */}
				<div className="bg-white rounded-xl border border-gray-200 p-1 mb-8">
					<nav className="flex space-x-1">
						{tabs.map((tab) => (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
									activeTab === tab.id
										? "bg-primary-100 text-primary-700"
										: "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
								}`}
							>
								<tab.icon className="h-4 w-4" />
								{tab.name}
								{tab.count > 0 && (
									<span
										className={`px-2 py-1 text-xs rounded-full ${
											activeTab === tab.id
												? "bg-primary-200 text-primary-800"
												: "bg-gray-200 text-gray-600"
										}`}
									>
										{tab.count}
									</span>
								)}
							</button>
						))}
					</nav>
				</div>

				{/* Contenido de tabs */}
				{activeTab === "calculations" && renderCalculations()}
				{activeTab === "members" && renderMembers()}
				{activeTab === "activity" && renderActivity()}
				{activeTab === "settings" && renderSettings()}
			</div>

			{/* Modal para invitar miembros */}
			{showInviteModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
						<div className="border-b border-gray-200 p-6">
							<div className="flex items-center justify-between">
								<h3 className="text-xl font-semibold text-gray-900">
									Invitar Miembro al Equipo
								</h3>
								<button
									onClick={() => setShowInviteModal(false)}
									className="p-2 hover:bg-gray-100 rounded-full transition-colors"
								>
									<XMarkIcon className="h-5 w-5 text-gray-500" />
								</button>
							</div>
						</div>

						<div className="p-6">
							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Correo Electrónico
									</label>
									<input
										type="email"
										placeholder="usuario@ejemplo.com"
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Rol
									</label>
									<select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
										<option value="viewer">Visualizador</option>
										<option value="editor">Editor</option>
										<option value="admin">Administrador</option>
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Mensaje Personalizado (Opcional)
									</label>
									<textarea
										rows={3}
										placeholder="Únete a nuestro equipo de cálculos técnicos..."
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
									/>
								</div>
							</div>
						</div>

						<div className="border-t border-gray-200 p-6 flex justify-end gap-3">
							<button
								onClick={() => setShowInviteModal(false)}
								className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
							>
								Cancelar
							</button>
							<button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
								Enviar Invitación
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Modal para compartir cálculo */}
			{showShareModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
						<div className="border-b border-gray-200 p-6">
							<div className="flex items-center justify-between">
								<h3 className="text-xl font-semibold text-gray-900">
									Compartir Cálculo
								</h3>
								<button
									onClick={() => setShowShareModal(false)}
									className="p-2 hover:bg-gray-100 rounded-full transition-colors"
								>
									<XMarkIcon className="h-5 w-5 text-gray-500" />
								</button>
							</div>
						</div>

						<div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
							<div className="space-y-6">
								<div>
									<h4 className="font-medium text-gray-900 mb-3">
										Configuración de Acceso
									</h4>
									<div className="space-y-3">
										<label className="flex items-center">
											<input
												type="radio"
												name="access"
												value="private"
												className="h-4 w-4 text-primary-600"
												defaultChecked
											/>
											<span className="ml-3 text-sm text-gray-700">
												<span className="font-medium">Privado</span> - Solo
												miembros específicos
											</span>
										</label>
										<label className="flex items-center">
											<input
												type="radio"
												name="access"
												value="team"
												className="h-4 w-4 text-primary-600"
											/>
											<span className="ml-3 text-sm text-gray-700">
												<span className="font-medium">Todo el equipo</span> -
												Todos los miembros del espacio
											</span>
										</label>
										<label className="flex items-center">
											<input
												type="radio"
												name="access"
												value="public"
												className="h-4 w-4 text-primary-600"
											/>
											<span className="ml-3 text-sm text-gray-700">
												<span className="font-medium">Público</span> -
												Cualquiera con el enlace
											</span>
										</label>
									</div>
								</div>

								<div>
									<h4 className="font-medium text-gray-900 mb-3">Permisos</h4>
									<div className="space-y-2">
										<label className="flex items-center justify-between">
											<span className="text-sm text-gray-700">
												Puede editar
											</span>
											<input
												type="checkbox"
												className="h-4 w-4 text-primary-600"
											/>
										</label>
										<label className="flex items-center justify-between">
											<span className="text-sm text-gray-700">
												Puede comentar
											</span>
											<input
												type="checkbox"
												className="h-4 w-4 text-primary-600"
												defaultChecked
											/>
										</label>
										<label className="flex items-center justify-between">
											<span className="text-sm text-gray-700">
												Puede compartir
											</span>
											<input
												type="checkbox"
												className="h-4 w-4 text-primary-600"
											/>
										</label>
										<label className="flex items-center justify-between">
											<span className="text-sm text-gray-700">
												Puede exportar
											</span>
											<input
												type="checkbox"
												className="h-4 w-4 text-primary-600"
												defaultChecked
											/>
										</label>
									</div>
								</div>

								<div>
									<h4 className="font-medium text-gray-900 mb-3">
										Compartir con Miembros Específicos
									</h4>
									<div className="space-y-2">
										{mockMembers.map((member) => (
											<label
												key={member.id}
												className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
											>
												<div className="flex items-center gap-3">
													<div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-xs font-medium">
														{member.name
															.split(" ")
															.map((n) => n[0])
															.join("")}
													</div>
													<div>
														<div className="text-sm font-medium text-gray-900">
															{member.name}
														</div>
														<div className="text-xs text-gray-500">
															{member.profession}
														</div>
													</div>
												</div>
												<input
													type="checkbox"
													className="h-4 w-4 text-primary-600"
												/>
											</label>
										))}
									</div>
								</div>

								<div>
									<h4 className="font-medium text-gray-900 mb-3">
										Enlace de Compartición
									</h4>
									<div className="flex gap-2">
										<input
											type="text"
											value="https://constru.com/share/calc-abc123"
											readOnly
											className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm"
										/>
										<button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
											<LinkIcon className="h-4 w-4" />
										</button>
									</div>
								</div>
							</div>
						</div>

						<div className="border-t border-gray-200 p-6 flex justify-end gap-3">
							<button
								onClick={() => setShowShareModal(false)}
								className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
							>
								Cancelar
							</button>
							<button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
								Compartir Cálculo
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default CollaborationWorkspace;
