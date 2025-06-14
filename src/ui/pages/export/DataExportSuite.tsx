// src/ui/pages/calculations/export/DataExportSuite.tsx
import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import {
	ArrowDownTrayIcon,
	DocumentTextIcon,
	TableCellsIcon,
	ChartBarIcon,
	CalendarDaysIcon,
	CurrencyDollarIcon,
	BuildingOfficeIcon,
	ShareIcon,
	CloudArrowUpIcon,
	CogIcon,
	FunnelIcon,
	ClockIcon,
	CheckCircleIcon,
	ExclamationTriangleIcon,
	EyeIcon,
	TrashIcon,
	DocumentDuplicateIcon,
	ArrowPathIcon,
	ServerIcon,
	LinkIcon,
	UserGroupIcon,
	PhoneIcon,
	EnvelopeIcon,
} from "@heroicons/react/24/outline";
import {
	LoadingSpinner,
	Badge,
	ProgressBar,
} from "../shared/components/SharedComponents";

// Types
interface ExportTemplate {
	id: string;
	name: string;
	description: string;
	category: "standard" | "custom" | "integration";
	dataTypes: ExportDataType[];
	formats: ExportFormat[];
	filters: ExportFilter[];
	scheduling: {
		enabled: boolean;
		frequency: "daily" | "weekly" | "monthly" | "custom";
		customCron?: string;
		recipients: string[];
	};
	destinations: ExportDestination[];
	settings: ExportSettings;
	createdBy: string;
	createdAt: Date;
	lastUsed?: Date;
	usageCount: number;
	isActive: boolean;
}

interface ExportJob {
	id: string;
	templateId: string;
	templateName: string;
	projectId?: string;
	projectName?: string;
	status: "queued" | "processing" | "completed" | "failed" | "cancelled";
	progress: number;
	startTime: Date;
	endTime?: Date;
	format: ExportFormat;
	destination: ExportDestination;
	fileSize?: number;
	downloadUrl?: string;
	expiresAt?: Date;
	errorMessage?: string;
	metadata: {
		recordCount: number;
		processingTime?: number;
		dataRange?: {
			from: Date;
			to: Date;
		};
	};
	createdBy: string;
}

interface ExportPreview {
	templateId: string;
	sampleData: any[];
	columns: ExportColumn[];
	estimatedSize: number;
	estimatedRecords: number;
	warningMessages: string[];
}

interface ExportColumn {
	id: string;
	name: string;
	type: "text" | "number" | "date" | "currency" | "boolean" | "json";
	source: string;
	format?: string;
	required: boolean;
	visible: boolean;
	order: number;
}

interface ExportFilter {
	id: string;
	field: string;
	operator:
		| "equals"
		| "contains"
		| "starts_with"
		| "greater_than"
		| "less_than"
		| "between"
		| "in"
		| "not_null";
	value: any;
	label: string;
	dataType: "text" | "number" | "date" | "boolean" | "select";
}

interface ExportSettings {
	compression: boolean;
	encryption: boolean;
	password?: string;
	includeMetadata: boolean;
	includeImages: boolean;
	dateFormat: "ISO" | "US" | "EU" | "custom";
	customDateFormat?: string;
	numberFormat: "decimal" | "scientific" | "percentage";
	currencyCode: "USD" | "EUR" | "custom";
	customCurrencyCode?: string;
	timezone: string;
	encoding: "UTF-8" | "Latin1" | "ASCII";
	csvDelimiter: "," | ";" | "|" | "\t";
	includeHeaders: boolean;
	maxRecords?: number;
}

interface IntegrationEndpoint {
	id: string;
	name: string;
	type: "api" | "database" | "cloud_storage" | "email" | "webhook";
	config: {
		url?: string;
		method?: "GET" | "POST" | "PUT";
		headers?: Record<string, string>;
		authentication?: {
			type: "none" | "basic" | "bearer" | "oauth2" | "api_key";
			credentials?: any;
		};
		database?: {
			type: "mysql" | "postgresql" | "mssql" | "oracle";
			host: string;
			port: number;
			database: string;
			credentials: any;
		};
		storage?: {
			provider: "aws_s3" | "google_cloud" | "azure_blob" | "dropbox";
			bucket: string;
			path: string;
			credentials: any;
		};
	};
	status: "active" | "inactive" | "error";
	lastSync?: Date;
	createdAt: Date;
}

type ExportDataType =
	| "calculations"
	| "budgets"
	| "schedules"
	| "progress"
	| "materials"
	| "documents"
	| "analytics";
type ExportFormat =
	| "CSV"
	| "XLSX"
	| "PDF"
	| "JSON"
	| "XML"
	| "MS_PROJECT"
	| "PRIMAVERA";
type ExportDestination = "download" | "email" | "cloud" | "api" | "database";

// Custom Hook
const useDataExportSuite = () => {
	const [templates, setTemplates] = useState<ExportTemplate[]>([]);
	const [jobs, setJobs] = useState<ExportJob[]>([]);
	const [integrations, setIntegrations] = useState<IntegrationEndpoint[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isProcessing, setIsProcessing] = useState(false);

	const loadData = async () => {
		setIsLoading(true);
		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			const mockTemplates: ExportTemplate[] = [
				{
					id: "1",
					name: "Reporte Completo de Proyecto",
					description:
						"Exportación completa incluyendo cálculos, presupuestos, cronograma y progreso",
					category: "standard",
					dataTypes: ["calculations", "budgets", "schedules", "progress"],
					formats: ["PDF", "XLSX", "CSV"],
					filters: [
						{
							id: "date_range",
							field: "created_date",
							operator: "between",
							value: null,
							label: "Rango de fechas",
							dataType: "date",
						},
					],
					scheduling: {
						enabled: false,
						frequency: "weekly",
						recipients: [],
					},
					destinations: ["download", "email"],
					settings: {
						compression: true,
						encryption: false,
						includeMetadata: true,
						includeImages: true,
						dateFormat: "ISO",
						numberFormat: "decimal",
						currencyCode: "USD",
						timezone: "America/Guayaquil",
						encoding: "UTF-8",
						csvDelimiter: ",",
						includeHeaders: true,
					},
					createdBy: "Sistema",
					createdAt: new Date(2024, 0, 1),
					lastUsed: new Date(2024, 5, 10),
					usageCount: 45,
					isActive: true,
				},
				{
					id: "2",
					name: "Exportación para MS Project",
					description: "Cronograma compatible con Microsoft Project",
					category: "integration",
					dataTypes: ["schedules"],
					formats: ["MS_PROJECT"],
					filters: [],
					scheduling: {
						enabled: true,
						frequency: "weekly",
						recipients: ["project.manager@company.com"],
					},
					destinations: ["download", "cloud"],
					settings: {
						compression: false,
						encryption: false,
						includeMetadata: true,
						includeImages: false,
						dateFormat: "US",
						numberFormat: "decimal",
						currencyCode: "USD",
						timezone: "America/Guayaquil",
						encoding: "UTF-8",
						csvDelimiter: ",",
						includeHeaders: true,
					},
					createdBy: "Admin",
					createdAt: new Date(2024, 2, 15),
					lastUsed: new Date(2024, 5, 12),
					usageCount: 23,
					isActive: true,
				},
			];

			const mockJobs: ExportJob[] = [
				{
					id: "1",
					templateId: "1",
					templateName: "Reporte Completo de Proyecto",
					projectId: "proj-1",
					projectName: "Edificio Plaza Norte",
					status: "completed",
					progress: 100,
					startTime: new Date(2024, 5, 13, 14, 30),
					endTime: new Date(2024, 5, 13, 14, 33),
					format: "PDF",
					destination: "download",
					fileSize: 2048000, // 2MB
					downloadUrl: "/downloads/reporte-completo-plaza-norte.pdf",
					expiresAt: new Date(2024, 8, 13),
					metadata: {
						recordCount: 1250,
						processingTime: 180,
						dataRange: {
							from: new Date(2024, 0, 15),
							to: new Date(2024, 5, 13),
						},
					},
					createdBy: "Ana García",
				},
				{
					id: "2",
					templateId: "2",
					templateName: "Exportación para MS Project",
					projectId: "proj-1",
					projectName: "Edificio Plaza Norte",
					status: "processing",
					progress: 65,
					startTime: new Date(2024, 5, 13, 15, 0),
					format: "MS_PROJECT",
					destination: "cloud",
					metadata: {
						recordCount: 234,
					},
					createdBy: "Carlos Mendoza",
				},
			];

			const mockIntegrations: IntegrationEndpoint[] = [
				{
					id: "1",
					name: "AWS S3 Storage",
					type: "cloud_storage",
					config: {
						storage: {
							provider: "aws_s3",
							bucket: "constru-exports",
							path: "/exports",
							credentials: {},
						},
					},
					status: "active",
					lastSync: new Date(2024, 5, 13, 12, 0),
					createdAt: new Date(2024, 3, 1),
				},
				{
					id: "2",
					name: "Webhook de Notificaciones",
					type: "webhook",
					config: {
						url: "https://hooks.slack.com/services/...",
						method: "POST",
						headers: {"Content-Type": "application/json"},
						authentication: {type: "none"},
					},
					status: "active",
					lastSync: new Date(2024, 5, 13, 10, 30),
					createdAt: new Date(2024, 4, 15),
				},
			];

			setTemplates(mockTemplates);
			setJobs(mockJobs);
			setIntegrations(mockIntegrations);
		} catch (error) {
			console.error("Error loading export data:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const createExportJob = async (
		templateId: string,
		overrides?: Partial<ExportTemplate>
	) => {
		setIsProcessing(true);
		try {
			// Simulate export job creation
			await new Promise((resolve) => setTimeout(resolve, 2000));

			const newJob: ExportJob = {
				id: `job-${Date.now()}`,
				templateId,
				templateName:
					templates.find((t) => t.id === templateId)?.name || "Export Job",
				status: "queued",
				progress: 0,
				startTime: new Date(),
				format: "PDF",
				destination: "download",
				metadata: {
					recordCount: 0,
				},
				createdBy: "Current User",
			};

			setJobs((prev) => [newJob, ...prev]);
			return newJob.id;
		} finally {
			setIsProcessing(false);
		}
	};

	const getExportPreview = async (
		templateId: string,
		filters: ExportFilter[]
	) => {
		// Simulate preview generation
		await new Promise((resolve) => setTimeout(resolve, 500));

		const preview: ExportPreview = {
			templateId,
			sampleData: [
				{
					id: 1,
					name: "Cálculo estructural nivel 1",
					type: "calculation",
					date: "2024-06-01",
					value: 25000,
				},
				{
					id: 2,
					name: "Presupuesto materiales",
					type: "budget",
					date: "2024-06-02",
					value: 150000,
				},
				{
					id: 3,
					name: "Cronograma fase 1",
					type: "schedule",
					date: "2024-06-03",
					value: 0,
				},
			],
			columns: [
				{
					id: "id",
					name: "ID",
					type: "number",
					source: "system.id",
					required: true,
					visible: true,
					order: 1,
				},
				{
					id: "name",
					name: "Nombre",
					type: "text",
					source: "entity.name",
					required: true,
					visible: true,
					order: 2,
				},
				{
					id: "type",
					name: "Tipo",
					type: "text",
					source: "entity.type",
					required: false,
					visible: true,
					order: 3,
				},
				{
					id: "date",
					name: "Fecha",
					type: "date",
					source: "entity.created_date",
					required: false,
					visible: true,
					order: 4,
				},
				{
					id: "value",
					name: "Valor",
					type: "currency",
					source: "entity.value",
					required: false,
					visible: true,
					order: 5,
				},
			],
			estimatedSize: 1024000, // 1MB
			estimatedRecords: 1250,
			warningMessages: [],
		};

		return preview;
	};

	const cancelJob = async (jobId: string) => {
		setJobs((prev) =>
			prev.map((job) =>
				job.id === jobId &&
				(job.status === "queued" || job.status === "processing")
					? {...job, status: "cancelled" as const}
					: job
			)
		);
	};

	const deleteJob = async (jobId: string) => {
		setJobs((prev) => prev.filter((job) => job.id !== jobId));
	};

	const downloadJob = async (jobId: string) => {
		const job = jobs.find((j) => j.id === jobId);
		if (job?.downloadUrl) {
			// Simulate download
			window.open(job.downloadUrl, "_blank");
		}
	};

	return {
		templates,
		jobs,
		integrations,
		isLoading,
		isProcessing,
		loadData,
		createExportJob,
		getExportPreview,
		cancelJob,
		deleteJob,
		downloadJob,
	};
};

// Components
const ExportTemplateCard: React.FC<{
	template: ExportTemplate;
	onUse: (templateId: string) => void;
	onEdit: (templateId: string) => void;
	onPreview: (templateId: string) => void;
}> = ({template, onUse, onEdit, onPreview}) => {
	const getCategoryColor = (category: ExportTemplate["category"]) => {
		switch (category) {
			case "standard":
				return "bg-blue-100 text-blue-800";
			case "custom":
				return "bg-green-100 text-green-800";
			case "integration":
				return "bg-purple-100 text-purple-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getDataTypeIcon = (type: ExportDataType) => {
		switch (type) {
			case "calculations":
				return ChartBarIcon;
			case "budgets":
				return CurrencyDollarIcon;
			case "schedules":
				return CalendarDaysIcon;
			case "progress":
				return BuildingOfficeIcon;
			case "materials":
				return TableCellsIcon;
			case "documents":
				return DocumentTextIcon;
			default:
				return DocumentTextIcon;
		}
	};

	return (
		<div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
			<div className="flex items-start justify-between mb-4">
				<div className="flex items-start gap-3">
					<div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-600 rounded-xl flex items-center justify-center">
						<ArrowDownTrayIcon className="h-6 w-6 text-white" />
					</div>
					<div>
						<h3 className="font-semibold text-gray-900 mb-1">
							{template.name}
						</h3>
						<p className="text-sm text-gray-600 mb-2">{template.description}</p>
						<div className="flex items-center gap-2">
							<span
								className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(template.category)}`}
							>
								{template.category === "standard"
									? "Estándar"
									: template.category === "custom"
										? "Personalizada"
										: "Integración"}
							</span>
							{template.scheduling.enabled && (
								<Badge variant="info">Programada</Badge>
							)}
						</div>
					</div>
				</div>
				<div className="text-right">
					<div className="text-lg font-bold text-gray-900">
						{template.usageCount}
					</div>
					<div className="text-sm text-gray-600">usos</div>
				</div>
			</div>

			{/* Data Types */}
			<div className="mb-4">
				<div className="text-sm text-gray-600 mb-2">Tipos de datos</div>
				<div className="flex flex-wrap gap-2">
					{template.dataTypes.map((type) => {
						const Icon = getDataTypeIcon(type);
						return (
							<span
								key={type}
								className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
							>
								<Icon className="h-3 w-3" />
								{type === "calculations"
									? "Cálculos"
									: type === "budgets"
										? "Presupuestos"
										: type === "schedules"
											? "Cronogramas"
											: type === "progress"
												? "Progreso"
												: type === "materials"
													? "Materiales"
													: "Documentos"}
							</span>
						);
					})}
				</div>
			</div>

			{/* Formats */}
			<div className="mb-4">
				<div className="text-sm text-gray-600 mb-2">Formatos disponibles</div>
				<div className="flex flex-wrap gap-2">
					{template.formats.map((format) => (
						<span
							key={format}
							className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
						>
							{format}
						</span>
					))}
				</div>
			</div>

			{/* Destinations */}
			<div className="mb-4">
				<div className="text-sm text-gray-600 mb-2">Destinos</div>
				<div className="flex flex-wrap gap-2">
					{template.destinations.map((destination) => (
						<span
							key={destination}
							className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs"
						>
							{destination === "download"
								? "Descarga"
								: destination === "email"
									? "Email"
									: destination === "cloud"
										? "Nube"
										: destination === "api"
											? "API"
											: "Base de datos"}
						</span>
					))}
				</div>
			</div>

			{/* Template Info */}
			<div className="mb-4 text-sm text-gray-600">
				<div>Creado por: {template.createdBy}</div>
				{template.lastUsed && (
					<div>Último uso: {template.lastUsed.toLocaleDateString("es-EC")}</div>
				)}
			</div>

			{/* Actions */}
			<div className="flex gap-2">
				<button
					onClick={() => onUse(template.id)}
					className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
				>
					Usar Plantilla
				</button>
				<button
					onClick={() => onPreview(template.id)}
					className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
				>
					<EyeIcon className="h-4 w-4" />
				</button>
				{template.category === "custom" && (
					<button
						onClick={() => onEdit(template.id)}
						className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
					>
						<CogIcon className="h-4 w-4" />
					</button>
				)}
			</div>
		</div>
	);
};

const ExportJobsList: React.FC<{
	jobs: ExportJob[];
	onCancel: (jobId: string) => void;
	onDelete: (jobId: string) => void;
	onDownload: (jobId: string) => void;
	onRetry: (jobId: string) => void;
}> = ({jobs, onCancel, onDelete, onDownload, onRetry}) => {
	const getStatusColor = (status: ExportJob["status"]) => {
		switch (status) {
			case "queued":
				return "bg-blue-100 text-blue-800";
			case "processing":
				return "bg-yellow-100 text-yellow-800";
			case "completed":
				return "bg-green-100 text-green-800";
			case "failed":
				return "bg-red-100 text-red-800";
			case "cancelled":
				return "bg-gray-100 text-gray-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getStatusIcon = (status: ExportJob["status"]) => {
		switch (status) {
			case "queued":
				return ClockIcon;
			case "processing":
				return ArrowPathIcon;
			case "completed":
				return CheckCircleIcon;
			case "failed":
				return ExclamationTriangleIcon;
			case "cancelled":
				return ExclamationTriangleIcon;
			default:
				return ClockIcon;
		}
	};

	const formatBytes = (bytes: number) => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
	};

	if (jobs.length === 0) {
		return (
			<div className="bg-white rounded-xl border border-gray-200 p-6">
				<div className="text-center py-8">
					<ArrowDownTrayIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
					<p className="text-gray-600">No hay trabajos de exportación</p>
					<p className="text-sm text-gray-500">
						Los trabajos de exportación aparecerán aquí
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-xl border border-gray-200 p-6">
			<h3 className="text-lg font-semibold text-gray-900 mb-6">
				Trabajos de Exportación ({jobs.length})
			</h3>

			<div className="space-y-4">
				{jobs.map((job) => {
					const StatusIcon = getStatusIcon(job.status);

					return (
						<div key={job.id} className="border border-gray-200 rounded-lg p-4">
							<div className="flex items-start justify-between mb-3">
								<div className="flex items-start gap-3">
									<div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
										<StatusIcon className="h-5 w-5 text-gray-600" />
									</div>
									<div>
										<h4 className="font-medium text-gray-900 mb-1">
											{job.templateName}
										</h4>
										{job.projectName && (
											<p className="text-sm text-gray-600 mb-1">
												Proyecto: {job.projectName}
											</p>
										)}
										<div className="flex items-center gap-4 text-sm text-gray-600">
											<span>Formato: {job.format}</span>
											<span>
												Destino:{" "}
												{job.destination === "download"
													? "Descarga"
													: job.destination === "email"
														? "Email"
														: job.destination === "cloud"
															? "Nube"
															: job.destination === "api"
																? "API"
																: "Base de datos"}
											</span>
											<span>
												Iniciado: {job.startTime.toLocaleString("es-EC")}
											</span>
										</div>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<span
										className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}
									>
										{job.status === "queued"
											? "En cola"
											: job.status === "processing"
												? "Procesando"
												: job.status === "completed"
													? "Completado"
													: job.status === "failed"
														? "Error"
														: "Cancelado"}
									</span>
								</div>
							</div>

							{/* Progress Bar */}
							{job.status === "processing" && (
								<div className="mb-3">
									<div className="flex items-center justify-between mb-1">
										<span className="text-sm text-gray-600">Progreso</span>
										<span className="text-sm font-medium text-gray-700">
											{job.progress}%
										</span>
									</div>
									<ProgressBar progress={job.progress} className="h-2" />
								</div>
							)}

							{/* Job Details */}
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 text-sm">
								<div>
									<div className="text-gray-600">Registros</div>
									<div className="font-medium text-gray-900">
										{job.metadata.recordCount.toLocaleString()}
									</div>
								</div>
								{job.fileSize && (
									<div>
										<div className="text-gray-600">Tamaño del archivo</div>
										<div className="font-medium text-gray-900">
											{formatBytes(job.fileSize)}
										</div>
									</div>
								)}
								{job.metadata.processingTime && (
									<div>
										<div className="text-gray-600">Tiempo de procesamiento</div>
										<div className="font-medium text-gray-900">
											{job.metadata.processingTime} segundos
										</div>
									</div>
								)}
							</div>

							{/* Error Message */}
							{job.errorMessage && (
								<div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
									<p className="text-sm text-red-700">{job.errorMessage}</p>
								</div>
							)}

							{/* Data Range */}
							{job.metadata.dataRange && (
								<div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
									<div className="text-sm text-blue-700">
										Rango de datos:{" "}
										{job.metadata.dataRange.from.toLocaleDateString("es-EC")} -{" "}
										{job.metadata.dataRange.to.toLocaleDateString("es-EC")}
									</div>
								</div>
							)}

							{/* Expiration Warning */}
							{job.expiresAt && job.status === "completed" && (
								<div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
									<div className="text-sm text-yellow-700">
										Expira: {job.expiresAt.toLocaleDateString("es-EC")}
									</div>
								</div>
							)}

							{/* Actions */}
							<div className="flex gap-2">
								{job.status === "completed" && job.downloadUrl && (
									<button
										onClick={() => onDownload(job.id)}
										className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
									>
										<ArrowDownTrayIcon className="h-4 w-4" />
										Descargar
									</button>
								)}
								{job.status === "failed" && (
									<button
										onClick={() => onRetry(job.id)}
										className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
									>
										<ArrowPathIcon className="h-4 w-4" />
										Reintentar
									</button>
								)}
								{(job.status === "queued" || job.status === "processing") && (
									<button
										onClick={() => onCancel(job.id)}
										className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
									>
										Cancelar
									</button>
								)}
								<button
									onClick={() => onDelete(job.id)}
									disabled={job.status === "processing"}
									className="flex items-center gap-2 px-3 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-sm disabled:opacity-50"
								>
									<TrashIcon className="h-4 w-4" />
									Eliminar
								</button>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

const IntegrationsList: React.FC<{
	integrations: IntegrationEndpoint[];
	onTest: (integrationId: string) => void;
	onEdit: (integrationId: string) => void;
	onDelete: (integrationId: string) => void;
}> = ({integrations, onTest, onEdit, onDelete}) => {
	const getTypeIcon = (type: IntegrationEndpoint["type"]) => {
		switch (type) {
			case "api":
				return LinkIcon;
			case "database":
				return ServerIcon;
			case "cloud_storage":
				return CloudArrowUpIcon;
			case "email":
				return EnvelopeIcon;
			case "webhook":
				return ShareIcon;
			default:
				return ServerIcon;
		}
	};

	const getStatusColor = (status: IntegrationEndpoint["status"]) => {
		switch (status) {
			case "active":
				return "bg-green-100 text-green-800";
			case "inactive":
				return "bg-gray-100 text-gray-800";
			case "error":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	if (integrations.length === 0) {
		return (
			<div className="bg-white rounded-xl border border-gray-200 p-6">
				<div className="text-center py-8">
					<LinkIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
					<p className="text-gray-600">No hay integraciones configuradas</p>
					<p className="text-sm text-gray-500">
						Configura integraciones para automatizar exportaciones
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-xl border border-gray-200 p-6">
			<h3 className="text-lg font-semibold text-gray-900 mb-6">
				Integraciones Configuradas ({integrations.length})
			</h3>

			<div className="space-y-4">
				{integrations.map((integration) => {
					const Icon = getTypeIcon(integration.type);

					return (
						<div
							key={integration.id}
							className="border border-gray-200 rounded-lg p-4"
						>
							<div className="flex items-center justify-between mb-3">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
										<Icon className="h-5 w-5 text-gray-600" />
									</div>
									<div>
										<h4 className="font-medium text-gray-900">
											{integration.name}
										</h4>
										<p className="text-sm text-gray-600">
											{integration.type === "api"
												? "API REST"
												: integration.type === "database"
													? "Base de datos"
													: integration.type === "cloud_storage"
														? "Almacenamiento en la nube"
														: integration.type === "email"
															? "Correo electrónico"
															: "Webhook"}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<span
										className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(integration.status)}`}
									>
										{integration.status === "active"
											? "Activo"
											: integration.status === "inactive"
												? "Inactivo"
												: "Error"}
									</span>
								</div>
							</div>

							{/* Integration Details */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3 text-sm">
								<div>
									<div className="text-gray-600">Creado</div>
									<div className="font-medium text-gray-900">
										{integration.createdAt.toLocaleDateString("es-EC")}
									</div>
								</div>
								{integration.lastSync && (
									<div>
										<div className="text-gray-600">Última sincronización</div>
										<div className="font-medium text-gray-900">
											{integration.lastSync.toLocaleString("es-EC")}
										</div>
									</div>
								)}
							</div>

							{/* Configuration Preview */}
							<div className="bg-gray-50 rounded-lg p-3 mb-3">
								<div className="text-sm text-gray-600 mb-1">Configuración</div>
								<div className="text-sm font-mono text-gray-800">
									{integration.config.url && (
										<div>URL: {integration.config.url}</div>
									)}
									{integration.config.storage && (
										<div>Bucket: {integration.config.storage.bucket}</div>
									)}
									{integration.config.database && (
										<div>
											Host: {integration.config.database.host}:
											{integration.config.database.port}
										</div>
									)}
								</div>
							</div>

							{/* Actions */}
							<div className="flex gap-2">
								<button
									onClick={() => onTest(integration.id)}
									className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
								>
									<CheckCircleIcon className="h-4 w-4" />
									Probar
								</button>
								<button
									onClick={() => onEdit(integration.id)}
									className="flex items-center gap-2 px-3 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
								>
									<CogIcon className="h-4 w-4" />
									Configurar
								</button>
								<button
									onClick={() => onDelete(integration.id)}
									className="flex items-center gap-2 px-3 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-sm"
								>
									<TrashIcon className="h-4 w-4" />
									Eliminar
								</button>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

const ExportWizardModal: React.FC<{
	template: ExportTemplate;
	onExport: (settings: any) => void;
	onClose: () => void;
	isProcessing: boolean;
}> = ({template, onExport, onClose, isProcessing}) => {
	const [step, setStep] = useState<
		"filters" | "format" | "destination" | "confirm"
	>("filters");
	const [filters, setFilters] = useState<Record<string, any>>({});
	const [format, setFormat] = useState(template.formats[0]);
	const [destination, setDestination] = useState(template.destinations[0]);
	const [settings, setSettings] = useState(template.settings);

	const handleExport = () => {
		onExport({
			templateId: template.id,
			filters,
			format,
			destination,
			settings,
		});
	};

	const renderFiltersStep = () => (
		<div className="space-y-4">
			<h3 className="text-lg font-semibold text-gray-900 mb-4">
				Configurar Filtros
			</h3>

			{template.filters.length === 0 ? (
				<div className="text-center py-8">
					<FunnelIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
					<p className="text-gray-600">Esta plantilla no requiere filtros</p>
					<p className="text-sm text-gray-500">
						Se exportarán todos los datos disponibles
					</p>
				</div>
			) : (
				<div className="space-y-4">
					{template.filters.map((filter) => (
						<div key={filter.id}>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								{filter.label}
							</label>
							{filter.dataType === "date" ? (
								<div className="grid grid-cols-2 gap-2">
									<input
										type="date"
										value={filters[`${filter.id}_from`] || ""}
										onChange={(e) =>
											setFilters({
												...filters,
												[`${filter.id}_from`]: e.target.value,
											})
										}
										className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									/>
									<input
										type="date"
										value={filters[`${filter.id}_to`] || ""}
										onChange={(e) =>
											setFilters({
												...filters,
												[`${filter.id}_to`]: e.target.value,
											})
										}
										className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									/>
								</div>
							) : filter.dataType === "select" ? (
								<select
									value={filters[filter.id] || ""}
									onChange={(e) =>
										setFilters({
											...filters,
											[filter.id]: e.target.value,
										})
									}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								>
									<option value="">Seleccionar...</option>
									{/* Add options based on filter configuration */}
								</select>
							) : (
								<input
									type={filter.dataType === "number" ? "number" : "text"}
									value={filters[filter.id] || ""}
									onChange={(e) =>
										setFilters({
											...filters,
											[filter.id]: e.target.value,
										})
									}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								/>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);

	const renderFormatStep = () => (
		<div className="space-y-4">
			<h3 className="text-lg font-semibold text-gray-900 mb-4">
				Seleccionar Formato
			</h3>

			<div className="space-y-3">
				{template.formats.map((formatOption) => (
					<div
						key={formatOption}
						className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
							format === formatOption
								? "border-blue-500 bg-blue-50"
								: "border-gray-200 hover:border-gray-300"
						}`}
						onClick={() => setFormat(formatOption)}
					>
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
								{formatOption === "PDF" ? (
									<DocumentTextIcon className="h-5 w-5 text-red-600" />
								) : formatOption === "XLSX" ? (
									<TableCellsIcon className="h-5 w-5 text-green-600" />
								) : formatOption === "CSV" ? (
									<TableCellsIcon className="h-5 w-5 text-blue-600" />
								) : (
									<DocumentTextIcon className="h-5 w-5 text-gray-600" />
								)}
							</div>
							<div>
								<div className="font-medium text-gray-900">{formatOption}</div>
								<div className="text-sm text-gray-600">
									{formatOption === "PDF"
										? "Documento portátil para impresión"
										: formatOption === "XLSX"
											? "Hoja de cálculo de Excel"
											: formatOption === "CSV"
												? "Valores separados por comas"
												: formatOption === "MS_PROJECT"
													? "Compatible con Microsoft Project"
													: formatOption === "PRIMAVERA"
														? "Compatible con Oracle Primavera"
														: "Formato de intercambio de datos"}
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);

	const renderDestinationStep = () => (
		<div className="space-y-4">
			<h3 className="text-lg font-semibold text-gray-900 mb-4">
				Seleccionar Destino
			</h3>

			<div className="space-y-3">
				{template.destinations.map((destOption) => (
					<div
						key={destOption}
						className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
							destination === destOption
								? "border-blue-500 bg-blue-50"
								: "border-gray-200 hover:border-gray-300"
						}`}
						onClick={() => setDestination(destOption)}
					>
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
								{destOption === "download" ? (
									<ArrowDownTrayIcon className="h-5 w-5 text-blue-600" />
								) : destOption === "email" ? (
									<EnvelopeIcon className="h-5 w-5 text-green-600" />
								) : destOption === "cloud" ? (
									<CloudArrowUpIcon className="h-5 w-5 text-purple-600" />
								) : (
									<ServerIcon className="h-5 w-5 text-gray-600" />
								)}
							</div>
							<div>
								<div className="font-medium text-gray-900">
									{destOption === "download"
										? "Descarga directa"
										: destOption === "email"
											? "Envío por correo"
											: destOption === "cloud"
												? "Almacenamiento en la nube"
												: destOption === "api"
													? "Integración API"
													: "Base de datos"}
								</div>
								<div className="text-sm text-gray-600">
									{destOption === "download"
										? "Descargar archivo inmediatamente"
										: destOption === "email"
											? "Enviar por correo electrónico"
											: destOption === "cloud"
												? "Subir a almacenamiento en la nube"
												: destOption === "api"
													? "Enviar a sistema externo"
													: "Guardar en base de datos"}
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);

	const renderConfirmStep = () => (
		<div className="space-y-4">
			<h3 className="text-lg font-semibold text-gray-900 mb-4">
				Confirmar Exportación
			</h3>

			<div className="bg-gray-50 rounded-lg p-4 space-y-3">
				<div>
					<div className="text-sm text-gray-600">Plantilla</div>
					<div className="font-medium text-gray-900">{template.name}</div>
				</div>
				<div>
					<div className="text-sm text-gray-600">Formato</div>
					<div className="font-medium text-gray-900">{format}</div>
				</div>
				<div>
					<div className="text-sm text-gray-600">Destino</div>
					<div className="font-medium text-gray-900">
						{destination === "download"
							? "Descarga directa"
							: destination === "email"
								? "Correo electrónico"
								: destination === "cloud"
									? "Almacenamiento en la nube"
									: destination === "api"
										? "Integración API"
										: "Base de datos"}
					</div>
				</div>
				{Object.keys(filters).length > 0 && (
					<div>
						<div className="text-sm text-gray-600">Filtros aplicados</div>
						<div className="text-sm text-gray-800">
							{Object.keys(filters).length} filtro(s) configurado(s)
						</div>
					</div>
				)}
			</div>

			<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
				<p className="text-sm text-blue-700">
					La exportación comenzará inmediatamente. Recibirás una notificación
					cuando esté lista.
				</p>
			</div>
		</div>
	);

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
				<div className="px-6 py-4 border-b border-gray-200">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-bold text-gray-900">
							Exportar: {template.name}
						</h2>
						<button
							onClick={onClose}
							className="text-gray-400 hover:text-gray-600 transition-colors"
							disabled={isProcessing}
						>
							<svg
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>

					{/* Step Indicator */}
					<div className="flex items-center gap-4 mt-4">
						{[
							{key: "filters", label: "Filtros"},
							{key: "format", label: "Formato"},
							{key: "destination", label: "Destino"},
							{key: "confirm", label: "Confirmar"},
						].map(({key, label}, index) => (
							<div key={key} className="flex items-center">
								<div
									className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
										step === key
											? "bg-blue-600 text-white"
											: ["filters", "format", "destination", "confirm"].indexOf(
														step
												  ) > index
												? "bg-green-600 text-white"
												: "bg-gray-200 text-gray-600"
									}`}
								>
									{["filters", "format", "destination", "confirm"].indexOf(
										step
									) > index
										? "✓"
										: index + 1}
								</div>
								<span className="ml-2 text-sm font-medium text-gray-700">
									{label}
								</span>
								{index < 3 && (
									<div className="w-8 h-0.5 bg-gray-200 ml-4"></div>
								)}
							</div>
						))}
					</div>
				</div>

				<div className="px-6 py-6 max-h-96 overflow-y-auto">
					{step === "filters" && renderFiltersStep()}
					{step === "format" && renderFormatStep()}
					{step === "destination" && renderDestinationStep()}
					{step === "confirm" && renderConfirmStep()}
				</div>

				<div className="px-6 py-4 border-t border-gray-200 flex justify-between">
					<button
						onClick={() => {
							if (step === "filters") return;
							const steps = ["filters", "format", "destination", "confirm"];
							const currentIndex = steps.indexOf(step);
							setStep(steps[currentIndex - 1] as typeof step);
						}}
						disabled={step === "filters" || isProcessing}
						className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
					>
						Anterior
					</button>

					<div className="flex gap-2">
						{step !== "confirm" ? (
							<button
								onClick={() => {
									const steps = ["filters", "format", "destination", "confirm"];
									const currentIndex = steps.indexOf(step);
									setStep(steps[currentIndex + 1] as typeof step);
								}}
								disabled={isProcessing}
								className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
							>
								Siguiente
							</button>
						) : (
							<button
								onClick={handleExport}
								disabled={isProcessing}
								className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
							>
								{isProcessing ? (
									<>
										<LoadingSpinner size="sm" />
										Procesando...
									</>
								) : (
									<>
										<ArrowDownTrayIcon className="h-4 w-4" />
										Iniciar Exportación
									</>
								)}
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

const DataExportSuite: React.FC = () => {
	const {projectId} = useParams<{projectId: string}>();
	const {
		templates,
		jobs,
		integrations,
		isLoading,
		isProcessing,
		loadData,
		createExportJob,
		getExportPreview,
		cancelJob,
		deleteJob,
		downloadJob,
	} = useDataExportSuite();

	const [selectedTab, setSelectedTab] = useState<
		"templates" | "jobs" | "integrations"
	>("templates");
	const [selectedTemplate, setSelectedTemplate] =
		useState<ExportTemplate | null>(null);

	useEffect(() => {
		loadData();
	}, []);

	const handleUseTemplate = (templateId: string) => {
		const template = templates.find((t) => t.id === templateId);
		if (template) {
			setSelectedTemplate(template);
		}
	};

	const handleExport = async (exportSettings: any) => {
		try {
			await createExportJob(exportSettings.templateId, exportSettings);
			setSelectedTemplate(null);
		} catch (error) {
			console.error("Error creating export job:", error);
		}
	};

	const handleRetryJob = async (jobId: string) => {
		const job = jobs.find((j) => j.id === jobId);
		if (job) {
			await createExportJob(job.templateId);
		}
	};

	if (isLoading) {
		return (
			<div className="max-w-7xl mx-auto px-4 py-8">
				<div className="flex items-center justify-center h-64">
					<div className="text-center">
						<LoadingSpinner size="lg" className="mx-auto mb-4" />
						<p className="text-gray-600">Cargando suite de exportación...</p>
					</div>
				</div>
			</div>
		);
	}

	const renderHeader = () => (
		<div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-4">
					<div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
						<ArrowDownTrayIcon className="h-6 w-6 text-white" />
					</div>
					<div>
						<h1 className="text-2xl font-bold text-gray-900">
							Suite de Exportación de Datos
						</h1>
						<p className="text-gray-600">
							Exportación avanzada con integración MS Project y Primavera
						</p>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
						<CogIcon className="h-4 w-4" />
						Configurar
					</button>
					<button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
						<DocumentDuplicateIcon className="h-4 w-4" />
						Nueva Plantilla
					</button>
				</div>
			</div>

			{/* Summary Stats */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
				<div className="bg-blue-50 rounded-lg p-4">
					<div className="flex items-center gap-2 mb-2">
						<DocumentDuplicateIcon className="h-5 w-5 text-blue-600" />
						<span className="text-sm font-medium text-blue-700">
							Plantillas
						</span>
					</div>
					<div className="text-2xl font-bold text-blue-900">
						{templates.length}
					</div>
				</div>
				<div className="bg-green-50 rounded-lg p-4">
					<div className="flex items-center gap-2 mb-2">
						<CheckCircleIcon className="h-5 w-5 text-green-600" />
						<span className="text-sm font-medium text-green-700">
							Completados
						</span>
					</div>
					<div className="text-2xl font-bold text-green-900">
						{jobs.filter((j) => j.status === "completed").length}
					</div>
				</div>
				<div className="bg-yellow-50 rounded-lg p-4">
					<div className="flex items-center gap-2 mb-2">
						<ClockIcon className="h-5 w-5 text-yellow-600" />
						<span className="text-sm font-medium text-yellow-700">
							En proceso
						</span>
					</div>
					<div className="text-2xl font-bold text-yellow-900">
						{
							jobs.filter(
								(j) => j.status === "processing" || j.status === "queued"
							).length
						}
					</div>
				</div>
				<div className="bg-purple-50 rounded-lg p-4">
					<div className="flex items-center gap-2 mb-2">
						<LinkIcon className="h-5 w-5 text-purple-600" />
						<span className="text-sm font-medium text-purple-700">
							Integraciones
						</span>
					</div>
					<div className="text-2xl font-bold text-purple-900">
						{integrations.filter((i) => i.status === "active").length}
					</div>
				</div>
			</div>

			{/* Navigation Tabs */}
			<div className="flex gap-1 bg-gray-100 rounded-lg p-1">
				{[
					{
						key: "templates",
						label: "Plantillas",
						icon: DocumentDuplicateIcon,
						count: templates.length,
					},
					{
						key: "jobs",
						label: "Trabajos",
						icon: ArrowDownTrayIcon,
						count: jobs.length,
					},
					{
						key: "integrations",
						label: "Integraciones",
						icon: LinkIcon,
						count: integrations.length,
					},
				].map(({key, label, icon: Icon, count}) => (
					<button
						key={key}
						onClick={() => setSelectedTab(key as typeof selectedTab)}
						className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
							selectedTab === key
								? "bg-white text-green-600 shadow-sm"
								: "text-gray-600 hover:text-gray-900"
						}`}
					>
						<Icon className="h-4 w-4" />
						{label}
						{count > 0 && (
							<span
								className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
									selectedTab === key
										? "bg-green-100 text-green-600"
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

	const renderTemplates = () => (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{templates.map((template) => (
				<ExportTemplateCard
					key={template.id}
					template={template}
					onUse={handleUseTemplate}
					onEdit={(id) => console.log("Edit template:", id)}
					onPreview={(id) => console.log("Preview template:", id)}
				/>
			))}
		</div>
	);

	return (
		<div className="max-w-7xl mx-auto px-4 py-8">
			{renderHeader()}

			{selectedTab === "templates" && renderTemplates()}
			{selectedTab === "jobs" && (
				<ExportJobsList
					jobs={jobs}
					onCancel={cancelJob}
					onDelete={deleteJob}
					onDownload={downloadJob}
					onRetry={handleRetryJob}
				/>
			)}
			{selectedTab === "integrations" && (
				<IntegrationsList
					integrations={integrations}
					onTest={(id) => console.log("Test integration:", id)}
					onEdit={(id) => console.log("Edit integration:", id)}
					onDelete={(id) => console.log("Delete integration:", id)}
				/>
			)}

			{/* Export Wizard Modal */}
			{selectedTemplate && (
				<ExportWizardModal
					template={selectedTemplate}
					onExport={handleExport}
					onClose={() => setSelectedTemplate(null)}
					isProcessing={isProcessing}
				/>
			)}
		</div>
	);
};

export default DataExportSuite;
