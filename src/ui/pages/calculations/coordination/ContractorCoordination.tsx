// src/ui/pages/calculations/coordination/ContractorCoordination.tsx
import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import {
	UsersIcon,
	ClockIcon,
	CheckCircleIcon,
	ExclamationTriangleIcon,
	XCircleIcon,
	ChatBubbleLeftIcon,
	DocumentTextIcon,
	CalendarDaysIcon,
	StarIcon,
	PhoneIcon,
	EnvelopeIcon,
	MapPinIcon,
	CurrencyDollarIcon,
	ChartBarIcon,
	PlusIcon,
	FunnelIcon,
	ArrowPathIcon,
	BellIcon,
	EyeIcon,
	PencilIcon,
	TrashIcon,
} from "@heroicons/react/24/outline";
import {
	LoadingSpinner,
	Badge,
	ProgressBar,
} from "../shared/components/SharedComponents";

// Types
interface Contractor {
	id: string;
	name: string;
	company: string;
	trade: ContractorTrade;
	contact: {
		phone: string;
		email: string;
		address: string;
	};
	rating: number;
	status: "active" | "inactive" | "pending" | "suspended";
	specializations: string[];
	certification: {
		hasLicense: boolean;
		licenseNumber?: string;
		expiryDate?: Date;
		hasInsurance: boolean;
		insuranceAmount?: number;
	};
	performance: {
		completedProjects: number;
		onTimeDelivery: number;
		qualityScore: number;
		communicationScore: number;
	};
	currentAssignments: Assignment[];
	availability: {
		startDate: Date;
		endDate: Date;
		capacity: number; // percentage
	};
}

interface Assignment {
	id: string;
	projectId: string;
	projectName: string;
	activities: AssignedActivity[];
	startDate: Date;
	endDate: Date;
	status: "assigned" | "in_progress" | "completed" | "overdue" | "cancelled";
	budget: {
		agreed: number;
		spent: number;
		pending: number;
	};
	progress: number;
	issues: Issue[];
	lastUpdate: Date;
}

interface AssignedActivity {
	id: string;
	name: string;
	description: string;
	status: "pending" | "in_progress" | "completed" | "delayed";
	progress: number;
	startDate: Date;
	endDate: Date;
	dependencies: string[];
	resources: string[];
}

interface Issue {
	id: string;
	title: string;
	description: string;
	severity: "low" | "medium" | "high" | "critical";
	type: "quality" | "safety" | "schedule" | "communication" | "materials";
	reportedDate: Date;
	reportedBy: string;
	status: "open" | "in_progress" | "resolved" | "closed";
	assignedTo?: string;
	resolution?: string;
	resolvedDate?: Date;
}

interface Notification {
	id: string;
	contractorId: string;
	type: "assignment" | "deadline" | "issue" | "payment" | "performance";
	title: string;
	message: string;
	date: Date;
	read: boolean;
	actionRequired: boolean;
	priority: "low" | "medium" | "high";
}

type ContractorTrade =
	| "estructuras"
	| "mamposteria"
	| "electricidad"
	| "plomeria"
	| "acabados"
	| "pintura"
	| "ceramica"
	| "carpinteria"
	| "metalurgia"
	| "jardineria";

// Custom Hook
const useContractorCoordination = () => {
	const [contractors, setContractors] = useState<Contractor[]>([]);
	const [assignments, setAssignments] = useState<Assignment[]>([]);
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const loadContractors = async (projectId: string) => {
		setIsLoading(true);
		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			const mockContractors: Contractor[] = [
				{
					id: "1",
					name: "Mario Peñaherrera",
					company: "Estructuras M&P",
					trade: "estructuras",
					contact: {
						phone: "+593 99 888 7777",
						email: "mario@estructurasmp.com",
						address: "Av. República del Salvador 123, Quito",
					},
					rating: 4.8,
					status: "active",
					specializations: [
						"Concreto armado",
						"Estructuras metálicas",
						"Cimentaciones",
					],
					certification: {
						hasLicense: true,
						licenseNumber: "EC-EST-2024-001",
						expiryDate: new Date(2025, 11, 31),
						hasInsurance: true,
						insuranceAmount: 100000,
					},
					performance: {
						completedProjects: 25,
						onTimeDelivery: 92,
						qualityScore: 4.7,
						communicationScore: 4.5,
					},
					currentAssignments: [],
					availability: {
						startDate: new Date(2024, 5, 20),
						endDate: new Date(2024, 8, 15),
						capacity: 80,
					},
				},
				{
					id: "2",
					name: "Carlos Vásquez",
					company: "Instalaciones CV",
					trade: "electricidad",
					contact: {
						phone: "+593 98 777 6666",
						email: "carlos@instalacionescv.com",
						address: "Calle Lizardo García 456, Quito",
					},
					rating: 4.6,
					status: "active",
					specializations: [
						"Instalaciones residenciales",
						"Sistemas de seguridad",
						"Domótica",
					],
					certification: {
						hasLicense: true,
						licenseNumber: "EC-ELE-2024-002",
						expiryDate: new Date(2025, 5, 30),
						hasInsurance: true,
						insuranceAmount: 75000,
					},
					performance: {
						completedProjects: 18,
						onTimeDelivery: 88,
						qualityScore: 4.6,
						communicationScore: 4.8,
					},
					currentAssignments: [],
					availability: {
						startDate: new Date(2024, 6, 1),
						endDate: new Date(2024, 9, 30),
						capacity: 60,
					},
				},
				{
					id: "3",
					name: "Ana Morales",
					company: "Acabados Premium",
					trade: "acabados",
					contact: {
						phone: "+593 97 666 5555",
						email: "ana@acabadospremium.com",
						address: "Av. Eloy Alfaro 789, Quito",
					},
					rating: 4.9,
					status: "active",
					specializations: [
						"Pisos laminados",
						"Pintura decorativa",
						"Molduras",
					],
					certification: {
						hasLicense: true,
						licenseNumber: "EC-ACA-2024-003",
						expiryDate: new Date(2026, 2, 28),
						hasInsurance: true,
						insuranceAmount: 50000,
					},
					performance: {
						completedProjects: 32,
						onTimeDelivery: 95,
						qualityScore: 4.9,
						communicationScore: 4.7,
					},
					currentAssignments: [],
					availability: {
						startDate: new Date(2024, 7, 15),
						endDate: new Date(2024, 11, 30),
						capacity: 70,
					},
				},
			];

			const mockAssignments: Assignment[] = [
				{
					id: "1",
					projectId: "proj-1",
					projectName: "Edificio Residencial Plaza Norte",
					activities: [
						{
							id: "act-1",
							name: "Fundición columnas nivel 2",
							description: "Armado y fundición de columnas del segundo nivel",
							status: "in_progress",
							progress: 75,
							startDate: new Date(2024, 5, 10),
							endDate: new Date(2024, 5, 20),
							dependencies: ["act-0"],
							resources: ["Concreto", "Hierro", "Formaleta"],
						},
						{
							id: "act-2",
							name: "Vigas de amarre nivel 2",
							description: "Armado y fundición de vigas de amarre",
							status: "pending",
							progress: 0,
							startDate: new Date(2024, 5, 21),
							endDate: new Date(2024, 5, 28),
							dependencies: ["act-1"],
							resources: ["Concreto", "Hierro", "Formaleta"],
						},
					],
					startDate: new Date(2024, 5, 10),
					endDate: new Date(2024, 6, 15),
					status: "in_progress",
					budget: {
						agreed: 25000,
						spent: 18750,
						pending: 6250,
					},
					progress: 75,
					issues: [
						{
							id: "issue-1",
							title: "Retraso en entrega de hierro",
							description:
								"El proveedor de hierro ha retrasado la entrega 2 días",
							severity: "medium",
							type: "materials",
							reportedDate: new Date(2024, 5, 12),
							reportedBy: "Mario Peñaherrera",
							status: "in_progress",
							assignedTo: "Coordinador de Materiales",
						},
					],
					lastUpdate: new Date(2024, 5, 13, 16, 30),
				},
			];

			// Assign contractors to assignments
			mockContractors[0].currentAssignments = [mockAssignments[0]];

			const mockNotifications: Notification[] = [
				{
					id: "1",
					contractorId: "1",
					type: "deadline",
					title: "Actividad próxima a vencer",
					message: "La fundición de columnas nivel 2 vence en 2 días",
					date: new Date(2024, 5, 13, 9, 0),
					read: false,
					actionRequired: true,
					priority: "high",
				},
				{
					id: "2",
					contractorId: "2",
					type: "assignment",
					title: "Nueva asignación disponible",
					message: "Instalaciones eléctricas nivel 1 - Edificio Plaza Norte",
					date: new Date(2024, 5, 12, 14, 30),
					read: false,
					actionRequired: true,
					priority: "medium",
				},
			];

			setContractors(mockContractors);
			setAssignments(mockAssignments);
			setNotifications(mockNotifications);
		} catch (error) {
			console.error("Error loading contractor data:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const assignContractor = async (
		contractorId: string,
		assignment: Partial<Assignment>
	) => {
		// Simulate assignment
		console.log("Assigning contractor:", contractorId, assignment);
	};

	const updateAssignmentProgress = async (
		assignmentId: string,
		progress: number
	) => {
		// Simulate progress update
		console.log("Updating assignment progress:", assignmentId, progress);
	};

	const reportIssue = async (assignmentId: string, issue: Partial<Issue>) => {
		// Simulate issue reporting
		console.log("Reporting issue:", assignmentId, issue);
	};

	const sendNotification = async (
		contractorId: string,
		notification: Partial<Notification>
	) => {
		// Simulate notification
		console.log("Sending notification:", contractorId, notification);
	};

	return {
		contractors,
		assignments,
		notifications,
		isLoading,
		loadContractors,
		assignContractor,
		updateAssignmentProgress,
		reportIssue,
		sendNotification,
	};
};

// Components
const ContractorCard: React.FC<{
	contractor: Contractor;
	onAssign: (contractorId: string) => void;
	onViewDetails: (contractorId: string) => void;
}> = ({contractor, onAssign, onViewDetails}) => {
	const getStatusColor = (status: Contractor["status"]) => {
		switch (status) {
			case "active":
				return "bg-green-100 text-green-800";
			case "inactive":
				return "bg-gray-100 text-gray-800";
			case "pending":
				return "bg-yellow-100 text-yellow-800";
			case "suspended":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getTradeColor = (trade: ContractorTrade) => {
		const colors = {
			estructuras: "bg-blue-100 text-blue-800",
			mamposteria: "bg-orange-100 text-orange-800",
			electricidad: "bg-yellow-100 text-yellow-800",
			plomeria: "bg-cyan-100 text-cyan-800",
			acabados: "bg-purple-100 text-purple-800",
			pintura: "bg-pink-100 text-pink-800",
			ceramica: "bg-indigo-100 text-indigo-800",
			carpinteria: "bg-amber-100 text-amber-800",
			metalurgia: "bg-gray-100 text-gray-800",
			jardineria: "bg-green-100 text-green-800",
		};
		return colors[trade];
	};

	const renderRatingStars = (rating: number) => {
		return (
			<div className="flex items-center gap-1">
				{[1, 2, 3, 4, 5].map((star) => (
					<StarIcon
						key={star}
						className={`h-4 w-4 ${
							star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
						}`}
					/>
				))}
				<span className="ml-1 text-sm text-gray-600">({rating})</span>
			</div>
		);
	};

	return (
		<div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
			<div className="flex items-start justify-between mb-4">
				<div className="flex items-start gap-3">
					<div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
						<UsersIcon className="h-6 w-6 text-white" />
					</div>
					<div>
						<h3 className="font-semibold text-gray-900">{contractor.name}</h3>
						<p className="text-sm text-gray-600">{contractor.company}</p>
						<div className="flex items-center gap-2 mt-1">
							<span
								className={`px-2 py-1 rounded-full text-xs font-medium ${getTradeColor(contractor.trade)}`}
							>
								{contractor.trade.charAt(0).toUpperCase() +
									contractor.trade.slice(1)}
							</span>
							<span
								className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contractor.status)}`}
							>
								{contractor.status === "active"
									? "Activo"
									: contractor.status === "inactive"
										? "Inactivo"
										: contractor.status === "pending"
											? "Pendiente"
											: "Suspendido"}
							</span>
						</div>
					</div>
				</div>
				<div className="text-right">
					{renderRatingStars(contractor.rating)}
					<div className="text-sm text-gray-600 mt-1">
						{contractor.performance.completedProjects} proyectos
					</div>
				</div>
			</div>

			{/* Performance Metrics */}
			<div className="grid grid-cols-2 gap-4 mb-4">
				<div>
					<div className="text-sm text-gray-600 mb-1">Puntualidad</div>
					<div className="flex items-center gap-2">
						<ProgressBar
							progress={contractor.performance.onTimeDelivery}
							className="flex-1 h-2"
							color="green"
						/>
						<span className="text-sm font-medium text-gray-700">
							{contractor.performance.onTimeDelivery}%
						</span>
					</div>
				</div>
				<div>
					<div className="text-sm text-gray-600 mb-1">Disponibilidad</div>
					<div className="flex items-center gap-2">
						<ProgressBar
							progress={contractor.availability.capacity}
							className="flex-1 h-2"
							color="blue"
						/>
						<span className="text-sm font-medium text-gray-700">
							{contractor.availability.capacity}%
						</span>
					</div>
				</div>
			</div>

			{/* Specializations */}
			<div className="mb-4">
				<div className="text-sm text-gray-600 mb-2">Especialidades</div>
				<div className="flex flex-wrap gap-2">
					{contractor.specializations.map((spec, index) => (
						<span
							key={index}
							className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
						>
							{spec}
						</span>
					))}
				</div>
			</div>

			{/* Contact */}
			<div className="mb-4 space-y-2">
				<div className="flex items-center gap-2 text-sm text-gray-600">
					<PhoneIcon className="h-4 w-4" />
					{contractor.contact.phone}
				</div>
				<div className="flex items-center gap-2 text-sm text-gray-600">
					<EnvelopeIcon className="h-4 w-4" />
					{contractor.contact.email}
				</div>
			</div>

			{/* Current Assignments */}
			{contractor.currentAssignments.length > 0 && (
				<div className="mb-4">
					<div className="text-sm text-gray-600 mb-2">
						Asignaciones Actuales
					</div>
					<div className="space-y-2">
						{contractor.currentAssignments.slice(0, 2).map((assignment) => (
							<div key={assignment.id} className="bg-gray-50 rounded-lg p-3">
								<div className="flex items-center justify-between mb-1">
									<h4 className="text-sm font-medium text-gray-900">
										{assignment.projectName}
									</h4>
									<Badge
										variant={
											assignment.status === "completed"
												? "success"
												: assignment.status === "in_progress"
													? "info"
													: assignment.status === "overdue"
														? "error"
														: "default"
										}
									>
										{assignment.progress}%
									</Badge>
								</div>
								<ProgressBar
									progress={assignment.progress}
									className="h-1 mb-2"
								/>
								<div className="text-xs text-gray-600">
									{assignment.activities.length} actividades
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Certification */}
			<div className="mb-4">
				<div className="flex items-center gap-4 text-sm">
					<div className="flex items-center gap-1">
						{contractor.certification.hasLicense ? (
							<CheckCircleIcon className="h-4 w-4 text-green-600" />
						) : (
							<XCircleIcon className="h-4 w-4 text-red-600" />
						)}
						<span className="text-gray-600">Licencia</span>
					</div>
					<div className="flex items-center gap-1">
						{contractor.certification.hasInsurance ? (
							<CheckCircleIcon className="h-4 w-4 text-green-600" />
						) : (
							<XCircleIcon className="h-4 w-4 text-red-600" />
						)}
						<span className="text-gray-600">Seguro</span>
					</div>
				</div>
			</div>

			{/* Actions */}
			<div className="flex gap-2">
				<button
					onClick={() => onAssign(contractor.id)}
					disabled={contractor.status !== "active"}
					className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
				>
					Asignar
				</button>
				<button
					onClick={() => onViewDetails(contractor.id)}
					className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
				>
					<EyeIcon className="h-4 w-4" />
				</button>
			</div>
		</div>
	);
};

const AssignmentTracker: React.FC<{
	assignments: Assignment[];
	onUpdateProgress: (assignmentId: string, progress: number) => void;
	onReportIssue: (assignmentId: string) => void;
}> = ({assignments, onUpdateProgress, onReportIssue}) => {
	const [selectedAssignment, setSelectedAssignment] = useState<string | null>(
		null
	);

	const getStatusColor = (status: Assignment["status"]) => {
		switch (status) {
			case "completed":
				return "bg-green-100 text-green-800";
			case "in_progress":
				return "bg-blue-100 text-blue-800";
			case "overdue":
				return "bg-red-100 text-red-800";
			case "cancelled":
				return "bg-gray-100 text-gray-800";
			default:
				return "bg-yellow-100 text-yellow-800";
		}
	};

	if (assignments.length === 0) {
		return (
			<div className="bg-white rounded-xl border border-gray-200 p-6">
				<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
					<CalendarDaysIcon className="h-5 w-5 text-blue-600" />
					Asignaciones Activas
				</h3>
				<div className="text-center py-8">
					<CalendarDaysIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
					<p className="text-gray-600">No hay asignaciones activas</p>
					<p className="text-sm text-gray-500">
						Las asignaciones aparecerán aquí
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-xl border border-gray-200 p-6">
			<h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
				<CalendarDaysIcon className="h-5 w-5 text-blue-600" />
				Asignaciones Activas ({assignments.length})
			</h3>

			<div className="space-y-6">
				{assignments.map((assignment) => (
					<div
						key={assignment.id}
						className="border border-gray-200 rounded-lg p-4"
					>
						<div className="flex items-start justify-between mb-4">
							<div>
								<h4 className="font-medium text-gray-900 mb-1">
									{assignment.projectName}
								</h4>
								<p className="text-sm text-gray-600">
									{assignment.startDate.toLocaleDateString("es-EC")} -{" "}
									{assignment.endDate.toLocaleDateString("es-EC")}
								</p>
							</div>
							<div className="flex items-center gap-2">
								<span
									className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(assignment.status)}`}
								>
									{assignment.status === "assigned"
										? "Asignado"
										: assignment.status === "in_progress"
											? "En Progreso"
											: assignment.status === "completed"
												? "Completado"
												: assignment.status === "overdue"
													? "Atrasado"
													: "Cancelado"}
								</span>
								<button
									onClick={() =>
										setSelectedAssignment(
											selectedAssignment === assignment.id
												? null
												: assignment.id
										)
									}
									className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
								>
									<EyeIcon className="h-4 w-4" />
								</button>
							</div>
						</div>

						{/* Progress Overview */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
							<div>
								<div className="text-sm text-gray-600 mb-1">
									Progreso General
								</div>
								<div className="flex items-center gap-2">
									<ProgressBar
										progress={assignment.progress}
										className="flex-1 h-3"
									/>
									<span className="text-sm font-medium text-gray-700">
										{assignment.progress}%
									</span>
								</div>
							</div>
							<div>
								<div className="text-sm text-gray-600 mb-1">Presupuesto</div>
								<div className="flex items-center gap-2">
									<ProgressBar
										progress={
											(assignment.budget.spent / assignment.budget.agreed) * 100
										}
										className="flex-1 h-3"
										color="green"
									/>
									<span className="text-sm font-medium text-gray-700">
										${assignment.budget.spent.toLocaleString()}
									</span>
								</div>
							</div>
							<div>
								<div className="text-sm text-gray-600 mb-1">Actividades</div>
								<div className="text-sm font-medium text-gray-900">
									{
										assignment.activities.filter(
											(a) => a.status === "completed"
										).length
									}{" "}
									/ {assignment.activities.length}
								</div>
							</div>
						</div>

						{/* Issues Alert */}
						{assignment.issues.length > 0 && (
							<div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
								<div className="flex items-center gap-2 mb-2">
									<ExclamationTriangleIcon className="h-4 w-4 text-yellow-600" />
									<span className="text-sm font-medium text-yellow-800">
										{assignment.issues.length} problema(s) reportado(s)
									</span>
								</div>
								<div className="text-sm text-yellow-700">
									{assignment.issues[0].title}
								</div>
							</div>
						)}

						{/* Expanded Details */}
						{selectedAssignment === assignment.id && (
							<div className="border-t border-gray-200 pt-4 mt-4">
								<h5 className="font-medium text-gray-900 mb-3">
									Actividades Detalladas
								</h5>
								<div className="space-y-3">
									{assignment.activities.map((activity) => (
										<div
											key={activity.id}
											className="bg-gray-50 rounded-lg p-3"
										>
											<div className="flex items-start justify-between mb-2">
												<div>
													<h6 className="font-medium text-gray-900">
														{activity.name}
													</h6>
													<p className="text-sm text-gray-600">
														{activity.description}
													</p>
												</div>
												<Badge
													variant={
														activity.status === "completed"
															? "success"
															: activity.status === "in_progress"
																? "info"
																: activity.status === "delayed"
																	? "error"
																	: "default"
													}
												>
													{activity.status === "completed"
														? "Completado"
														: activity.status === "in_progress"
															? "En Progreso"
															: activity.status === "delayed"
																? "Retrasado"
																: "Pendiente"}
												</Badge>
											</div>
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
												<div>
													<div className="text-xs text-gray-600 mb-1">
														Progreso
													</div>
													<ProgressBar
														progress={activity.progress}
														className="h-2"
													/>
												</div>
												<div>
													<div className="text-xs text-gray-600 mb-1">
														Fechas
													</div>
													<div className="text-xs text-gray-700">
														{activity.startDate.toLocaleDateString("es-EC")} -{" "}
														{activity.endDate.toLocaleDateString("es-EC")}
													</div>
												</div>
											</div>
											{activity.resources.length > 0 && (
												<div>
													<div className="text-xs text-gray-600 mb-1">
														Recursos
													</div>
													<div className="flex flex-wrap gap-1">
														{activity.resources.map((resource, index) => (
															<span
																key={index}
																className="px-2 py-1 bg-white text-gray-700 rounded text-xs"
															>
																{resource}
															</span>
														))}
													</div>
												</div>
											)}
										</div>
									))}
								</div>

								{/* Action Buttons */}
								<div className="flex gap-2 mt-4">
									<button
										onClick={() => onReportIssue(assignment.id)}
										className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-sm"
									>
										<ExclamationTriangleIcon className="h-4 w-4" />
										Reportar Problema
									</button>
									<button className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-sm">
										<ChatBubbleLeftIcon className="h-4 w-4" />
										Enviar Mensaje
									</button>
									<button className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm">
										<DocumentTextIcon className="h-4 w-4" />
										Documentos
									</button>
								</div>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

const NotificationCenter: React.FC<{
	notifications: Notification[];
	onMarkAsRead: (notificationId: string) => void;
	onTakeAction: (notificationId: string) => void;
}> = ({notifications, onMarkAsRead, onTakeAction}) => {
	const unreadCount = notifications.filter((n) => !n.read).length;

	const getPriorityColor = (priority: Notification["priority"]) => {
		switch (priority) {
			case "high":
				return "border-red-400 bg-red-50";
			case "medium":
				return "border-yellow-400 bg-yellow-50";
			default:
				return "border-blue-400 bg-blue-50";
		}
	};

	const getTypeIcon = (type: Notification["type"]) => {
		switch (type) {
			case "assignment":
				return CalendarDaysIcon;
			case "deadline":
				return ClockIcon;
			case "issue":
				return ExclamationTriangleIcon;
			case "payment":
				return CurrencyDollarIcon;
			case "performance":
				return ChartBarIcon;
			default:
				return BellIcon;
		}
	};

	return (
		<div className="bg-white rounded-xl border border-gray-200 p-6">
			<h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
				<BellIcon className="h-5 w-5 text-blue-600" />
				Centro de Notificaciones
				{unreadCount > 0 && (
					<span className="ml-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
						{unreadCount}
					</span>
				)}
			</h3>

			{notifications.length === 0 ? (
				<div className="text-center py-8">
					<BellIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
					<p className="text-gray-600">No hay notificaciones</p>
					<p className="text-sm text-gray-500">
						Todas las notificaciones aparecerán aquí
					</p>
				</div>
			) : (
				<div className="space-y-4">
					{notifications.map((notification) => {
						const Icon = getTypeIcon(notification.type);

						return (
							<div
								key={notification.id}
								className={`p-4 rounded-lg border-l-4 ${getPriorityColor(notification.priority)} ${
									!notification.read ? "bg-opacity-100" : "bg-opacity-50"
								}`}
							>
								<div className="flex items-start justify-between mb-2">
									<div className="flex items-start gap-3">
										<Icon className="h-5 w-5 text-gray-600 mt-0.5" />
										<div>
											<h4
												className={`font-medium ${!notification.read ? "text-gray-900" : "text-gray-700"}`}
											>
												{notification.title}
											</h4>
											<p className="text-sm text-gray-600 mt-1">
												{notification.message}
											</p>
										</div>
									</div>
									<div className="flex items-center gap-2">
										<Badge
											variant={
												notification.priority === "high"
													? "error"
													: notification.priority === "medium"
														? "warning"
														: "info"
											}
										>
											{notification.priority === "high"
												? "Alta"
												: notification.priority === "medium"
													? "Media"
													: "Baja"}
										</Badge>
										{!notification.read && (
											<div className="w-2 h-2 bg-blue-600 rounded-full"></div>
										)}
									</div>
								</div>

								<div className="flex items-center justify-between">
									<span className="text-xs text-gray-500">
										{notification.date.toLocaleString("es-EC")}
									</span>
									<div className="flex gap-2">
										{!notification.read && (
											<button
												onClick={() => onMarkAsRead(notification.id)}
												className="text-xs text-blue-600 hover:text-blue-700 transition-colors"
											>
												Marcar como leído
											</button>
										)}
										{notification.actionRequired && (
											<button
												onClick={() => onTakeAction(notification.id)}
												className="text-xs text-green-600 hover:text-green-700 font-medium transition-colors"
											>
												Tomar acción →
											</button>
										)}
									</div>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};

const ContractorCoordination: React.FC = () => {
	const {projectId} = useParams<{projectId: string}>();
	const {
		contractors,
		assignments,
		notifications,
		isLoading,
		loadContractors,
		assignContractor,
		updateAssignmentProgress,
		reportIssue,
		sendNotification,
	} = useContractorCoordination();

	const [selectedTab, setSelectedTab] = useState<
		"contractors" | "assignments" | "notifications"
	>("contractors");
	const [filters, setFilters] = useState({
		trade: "",
		status: "",
		availability: "",
	});

	useEffect(() => {
		if (projectId) {
			loadContractors(projectId);
		}
	}, [projectId]);

	const filteredContractors = contractors.filter((contractor) => {
		if (filters.trade && contractor.trade !== filters.trade) return false;
		if (filters.status && contractor.status !== filters.status) return false;
		return true;
	});

	const handleAssignContractor = (contractorId: string) => {
		// Open assignment modal or navigate to assignment page
		console.log("Assigning contractor:", contractorId);
	};

	const handleViewContractorDetails = (contractorId: string) => {
		// Open contractor details modal or navigate to details page
		console.log("Viewing contractor details:", contractorId);
	};

	const handleMarkNotificationAsRead = (notificationId: string) => {
		console.log("Marking notification as read:", notificationId);
	};

	const handleTakeNotificationAction = (notificationId: string) => {
		console.log("Taking action on notification:", notificationId);
	};

	if (isLoading) {
		return (
			<div className="max-w-7xl mx-auto px-4 py-8">
				<div className="flex items-center justify-center h-64">
					<div className="text-center">
						<LoadingSpinner size="lg" className="mx-auto mb-4" />
						<p className="text-gray-600">
							Cargando coordinación de contratistas...
						</p>
					</div>
				</div>
			</div>
		);
	}

	const renderHeader = () => (
		<div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-4">
					<div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
						<UsersIcon className="h-6 w-6 text-white" />
					</div>
					<div>
						<h1 className="text-2xl font-bold text-gray-900">
							Coordinación de Contratistas
						</h1>
						<p className="text-gray-600">
							Gestión integral de subcontratistas y asignaciones
						</p>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
						<FunnelIcon className="h-4 w-4" />
						Filtros
					</button>
					<button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
						<PlusIcon className="h-4 w-4" />
						Nuevo Contratista
					</button>
				</div>
			</div>

			{/* Navigation Tabs */}
			<div className="flex gap-1 bg-gray-100 rounded-lg p-1">
				{[
					{
						key: "contractors",
						label: "Contratistas",
						icon: UsersIcon,
						count: contractors.length,
					},
					{
						key: "assignments",
						label: "Asignaciones",
						icon: CalendarDaysIcon,
						count: assignments.length,
					},
					{
						key: "notifications",
						label: "Notificaciones",
						icon: BellIcon,
						count: notifications.filter((n) => !n.read).length,
					},
				].map(({key, label, icon: Icon, count}) => (
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
						{count > 0 && (
							<span
								className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
									selectedTab === key
										? "bg-blue-100 text-blue-600"
										: "bg-gray-200 text-gray-600"
								}`}
							>
								{count}
							</span>
						)}
					</button>
				))}
			</div>
		</div>
	);

	const renderContractors = () => (
		<div className="space-y-6">
			{/* Filters */}
			<div className="bg-white rounded-xl border border-gray-200 p-4">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<select
						value={filters.trade}
						onChange={(e) => setFilters({...filters, trade: e.target.value})}
						className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					>
						<option value="">Todos los oficios</option>
						<option value="estructuras">Estructuras</option>
						<option value="electricidad">Electricidad</option>
						<option value="plomeria">Plomería</option>
						<option value="acabados">Acabados</option>
						<option value="mamposteria">Mampostería</option>
					</select>

					<select
						value={filters.status}
						onChange={(e) => setFilters({...filters, status: e.target.value})}
						className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					>
						<option value="">Todos los estados</option>
						<option value="active">Activo</option>
						<option value="inactive">Inactivo</option>
						<option value="pending">Pendiente</option>
						<option value="suspended">Suspendido</option>
					</select>

					<button
						onClick={() =>
							setFilters({trade: "", status: "", availability: ""})
						}
						className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
					>
						Limpiar Filtros
					</button>
				</div>
			</div>

			{/* Contractors Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{filteredContractors.map((contractor) => (
					<ContractorCard
						key={contractor.id}
						contractor={contractor}
						onAssign={handleAssignContractor}
						onViewDetails={handleViewContractorDetails}
					/>
				))}
			</div>

			{filteredContractors.length === 0 && (
				<div className="text-center py-12">
					<UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
					<p className="text-gray-600">No se encontraron contratistas</p>
					<p className="text-sm text-gray-500">
						Ajusta los filtros o agrega nuevos contratistas
					</p>
				</div>
			)}
		</div>
	);

	return (
		<div className="max-w-7xl mx-auto px-4 py-8">
			{renderHeader()}

			{selectedTab === "contractors" && renderContractors()}
			{selectedTab === "assignments" && (
				<AssignmentTracker
					assignments={assignments}
					onUpdateProgress={updateAssignmentProgress}
					onReportIssue={reportIssue}
				/>
			)}
			{selectedTab === "notifications" && (
				<NotificationCenter
					notifications={notifications}
					onMarkAsRead={handleMarkNotificationAsRead}
					onTakeAction={handleTakeNotificationAction}
				/>
			)}
		</div>
	);
};

export default ContractorCoordination;
