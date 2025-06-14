// src/ui/pages/calculations/documents/DocumentGenerator.tsx
import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import {
	DocumentTextIcon,
	ArrowDownTrayIcon,
	PrinterIcon,
	ShareIcon,
	EyeIcon,
	CogIcon,
	PhotoIcon,
	PaperClipIcon,
	CheckCircleIcon,
	ExclamationTriangleIcon,
	ClockIcon,
	BuildingOfficeIcon,
	UserIcon,
	PhoneIcon,
	EnvelopeIcon,
	MapPinIcon,
	CalendarDaysIcon,
	CurrencyDollarIcon,
	DocumentChartBarIcon,
	PencilIcon,
	TrashIcon,
	DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import {LoadingSpinner, Badge} from "../shared/components/SharedComponents";

// Types
interface DocumentTemplate {
	id: string;
	name: string;
	description: string;
	type: DocumentType;
	category: "official" | "custom" | "shared";
	sections: DocumentSection[];
	settings: DocumentSettings;
	createdBy: string;
	createdAt: Date;
	lastModified: Date;
	isActive: boolean;
	usageCount: number;
}

interface DocumentSection {
	id: string;
	name: string;
	type: "header" | "content" | "table" | "chart" | "signature" | "footer";
	required: boolean;
	editable: boolean;
	order: number;
	content?: any;
	variables?: DocumentVariable[];
}

interface DocumentVariable {
	id: string;
	name: string;
	type:
		| "text"
		| "number"
		| "date"
		| "currency"
		| "boolean"
		| "image"
		| "calculation";
	source: "project" | "budget" | "schedule" | "calculation" | "user" | "manual";
	defaultValue?: any;
	format?: string;
	required: boolean;
}

interface DocumentSettings {
	format: "PDF" | "DOCX" | "HTML";
	orientation: "portrait" | "landscape";
	pageSize: "A4" | "A3" | "Letter" | "Legal";
	margins: {
		top: number;
		right: number;
		bottom: number;
		left: number;
	};
	branding: {
		logo?: string;
		companyName?: string;
		colors: {
			primary: string;
			secondary: string;
			accent: string;
		};
		fonts: {
			heading: string;
			body: string;
		};
	};
	watermark?: {
		text: string;
		opacity: number;
		position: "center" | "corner";
	};
}

interface GeneratedDocument {
	id: string;
	templateId: string;
	templateName: string;
	projectId: string;
	name: string;
	type: DocumentType;
	status: "generating" | "ready" | "error" | "expired";
	createdAt: Date;
	expiresAt: Date;
	downloadUrl?: string;
	previewUrl?: string;
	size: string;
	format: string;
	version: number;
	generatedBy: string;
	metadata: {
		projectName: string;
		client: string;
		variables: Record<string, any>;
	};
}

interface BrandingProfile {
	id: string;
	name: string;
	isDefault: boolean;
	companyInfo: {
		name: string;
		legalName: string;
		ruc: string;
		address: string;
		phone: string;
		email: string;
		website?: string;
	};
	professional: {
		name: string;
		title: string;
		registration: string;
		signature?: string;
	};
	visual: {
		logo: string;
		colors: {
			primary: string;
			secondary: string;
			accent: string;
		};
		fonts: {
			heading: string;
			body: string;
		};
	};
}

type DocumentType =
	| "budget_estimate"
	| "final_budget"
	| "schedule_report"
	| "progress_report"
	| "calculation_report"
	| "contract_proposal"
	| "change_order"
	| "invoice"
	| "certificate"
	| "technical_spec";

// Custom Hook
const useDocumentGenerator = () => {
	const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
	const [generatedDocuments, setGeneratedDocuments] = useState<
		GeneratedDocument[]
	>([]);
	const [brandingProfiles, setBrandingProfiles] = useState<BrandingProfile[]>(
		[]
	);
	const [isLoading, setIsLoading] = useState(true);
	const [isGenerating, setIsGenerating] = useState(false);

	const loadTemplates = async () => {
		setIsLoading(true);
		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			const mockTemplates: DocumentTemplate[] = [
				{
					id: "1",
					name: "Presupuesto Profesional",
					description:
						"Plantilla para presupuestos con desglose detallado y especificaciones técnicas",
					type: "budget_estimate",
					category: "official",
					sections: [
						{
							id: "header",
							name: "Encabezado",
							type: "header",
							required: true,
							editable: false,
							order: 1,
						},
						{
							id: "project_info",
							name: "Información del Proyecto",
							type: "content",
							required: true,
							editable: true,
							order: 2,
						},
						{
							id: "budget_breakdown",
							name: "Desglose Presupuestario",
							type: "table",
							required: true,
							editable: true,
							order: 3,
						},
					],
					settings: {
						format: "PDF",
						orientation: "portrait",
						pageSize: "A4",
						margins: {top: 2, right: 2, bottom: 2, left: 2},
						branding: {
							colors: {
								primary: "#2563eb",
								secondary: "#64748b",
								accent: "#059669",
							},
							fonts: {heading: "Arial", body: "Arial"},
						},
					},
					createdBy: "Sistema",
					createdAt: new Date(2024, 0, 1),
					lastModified: new Date(2024, 5, 1),
					isActive: true,
					usageCount: 145,
				},
				{
					id: "2",
					name: "Reporte de Progreso",
					description:
						"Reporte semanal/mensual de avance con fotografías y métricas",
					type: "progress_report",
					category: "official",
					sections: [
						{
							id: "header",
							name: "Encabezado",
							type: "header",
							required: true,
							editable: false,
							order: 1,
						},
						{
							id: "summary",
							name: "Resumen Ejecutivo",
							type: "content",
							required: true,
							editable: true,
							order: 2,
						},
						{
							id: "progress_chart",
							name: "Gráfico de Progreso",
							type: "chart",
							required: true,
							editable: false,
							order: 3,
						},
					],
					settings: {
						format: "PDF",
						orientation: "portrait",
						pageSize: "A4",
						margins: {top: 2, right: 2, bottom: 2, left: 2},
						branding: {
							colors: {
								primary: "#7c3aed",
								secondary: "#64748b",
								accent: "#059669",
							},
							fonts: {heading: "Arial", body: "Arial"},
						},
					},
					createdBy: "Sistema",
					createdAt: new Date(2024, 0, 1),
					lastModified: new Date(2024, 4, 15),
					isActive: true,
					usageCount: 89,
				},
			];

			const mockBranding: BrandingProfile[] = [
				{
					id: "1",
					name: "Perfil Corporativo",
					isDefault: true,
					companyInfo: {
						name: "CONSTRU Ingeniería",
						legalName: "CONSTRU Ingeniería S.A.",
						ruc: "1792123456001",
						address: "Av. República del Salvador 123, Quito - Ecuador",
						phone: "+593 2 123 4567",
						email: "contacto@construingenieria.com",
						website: "www.construingenieria.com",
					},
					professional: {
						name: "Ing. Carlos Mendoza",
						title: "Ingeniero Civil",
						registration: "IC-2024-001",
					},
					visual: {
						logo: "/images/logo-constru.png",
						colors: {
							primary: "#2563eb",
							secondary: "#64748b",
							accent: "#059669",
						},
						fonts: {
							heading: "Arial Black",
							body: "Arial",
						},
					},
				},
			];

			const mockGenerated: GeneratedDocument[] = [
				{
					id: "1",
					templateId: "1",
					templateName: "Presupuesto Profesional",
					projectId: "proj-1",
					name: "Presupuesto - Edificio Plaza Norte v2.1",
					type: "budget_estimate",
					status: "ready",
					createdAt: new Date(2024, 5, 12, 14, 30),
					expiresAt: new Date(2024, 8, 12),
					downloadUrl: "/downloads/presupuesto-plaza-norte-v21.pdf",
					previewUrl: "/preview/presupuesto-plaza-norte-v21.pdf",
					size: "2.4 MB",
					format: "PDF",
					version: 2,
					generatedBy: "Ana García",
					metadata: {
						projectName: "Edificio Residencial Plaza Norte",
						client: "Inmobiliaria Constructora S.A.",
						variables: {
							totalBudget: 2500000,
							projectDuration: "12 meses",
							startDate: "2024-01-15",
						},
					},
				},
			];

			setTemplates(mockTemplates);
			setBrandingProfiles(mockBranding);
			setGeneratedDocuments(mockGenerated);
		} catch (error) {
			console.error("Error loading templates:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const generateDocument = async (
		templateId: string,
		projectId: string,
		variables: Record<string, any>,
		brandingId: string,
		customSettings?: Partial<DocumentSettings>
	) => {
		setIsGenerating(true);
		try {
			// Simulate document generation
			await new Promise((resolve) => setTimeout(resolve, 3000));

			console.log("Generating document:", {
				templateId,
				projectId,
				variables,
				brandingId,
				customSettings,
			});

			return {
				id: `doc-${Date.now()}`,
				downloadUrl: "/downloads/generated-document.pdf",
				previewUrl: "/preview/generated-document.pdf",
			};
		} finally {
			setIsGenerating(false);
		}
	};

	const downloadDocument = async (documentId: string) => {
		// Simulate download
		console.log("Downloading document:", documentId);
	};

	const previewDocument = async (documentId: string) => {
		// Simulate preview
		console.log("Previewing document:", documentId);
	};

	const deleteDocument = async (documentId: string) => {
		// Simulate deletion
		setGeneratedDocuments((prev) =>
			prev.filter((doc) => doc.id !== documentId)
		);
	};

	return {
		templates,
		generatedDocuments,
		brandingProfiles,
		isLoading,
		isGenerating,
		loadTemplates,
		generateDocument,
		downloadDocument,
		previewDocument,
		deleteDocument,
	};
};

// Components
const TemplateCard: React.FC<{
	template: DocumentTemplate;
	onGenerate: (templateId: string) => void;
	onPreview: (templateId: string) => void;
	onEdit: (templateId: string) => void;
}> = ({template, onGenerate, onPreview, onEdit}) => {
	const getTypeColor = (type: DocumentType) => {
		const colors = {
			budget_estimate: "bg-green-100 text-green-800",
			final_budget: "bg-blue-100 text-blue-800",
			schedule_report: "bg-purple-100 text-purple-800",
			progress_report: "bg-yellow-100 text-yellow-800",
			calculation_report: "bg-indigo-100 text-indigo-800",
			contract_proposal: "bg-red-100 text-red-800",
			change_order: "bg-orange-100 text-orange-800",
			invoice: "bg-cyan-100 text-cyan-800",
			certificate: "bg-pink-100 text-pink-800",
			technical_spec: "bg-gray-100 text-gray-800",
		};
		return colors[type] || "bg-gray-100 text-gray-800";
	};

	const getCategoryBadge = (category: DocumentTemplate["category"]) => {
		switch (category) {
			case "official":
				return <Badge variant="info">Oficial</Badge>;
			case "custom":
				return <Badge variant="success">Personalizada</Badge>;
			case "shared":
				return <Badge variant="warning">Compartida</Badge>;
			default:
				return <Badge variant="default">Estándar</Badge>;
		}
	};

	return (
		<div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
			<div className="flex items-start justify-between mb-4">
				<div className="flex items-start gap-3">
					<div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
						<DocumentTextIcon className="h-6 w-6 text-white" />
					</div>
					<div>
						<h3 className="font-semibold text-gray-900 mb-1">
							{template.name}
						</h3>
						<p className="text-sm text-gray-600 mb-2">{template.description}</p>
						<div className="flex items-center gap-2">
							<span
								className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(template.type)}`}
							>
								{template.type
									.replace("_", " ")
									.split(" ")
									.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
									.join(" ")}
							</span>
							{getCategoryBadge(template.category)}
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

			{/* Template Settings */}
			<div className="grid grid-cols-2 gap-4 mb-4">
				<div>
					<div className="text-sm text-gray-600 mb-1">Formato</div>
					<div className="text-sm font-medium text-gray-900">
						{template.settings.format} • {template.settings.pageSize}
					</div>
				</div>
				<div>
					<div className="text-sm text-gray-600 mb-1">Secciones</div>
					<div className="text-sm font-medium text-gray-900">
						{template.sections.length} secciones
					</div>
				</div>
			</div>

			{/* Sections Preview */}
			<div className="mb-4">
				<div className="text-sm text-gray-600 mb-2">Contenido</div>
				<div className="flex flex-wrap gap-1">
					{template.sections.slice(0, 3).map((section) => (
						<span
							key={section.id}
							className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
						>
							{section.name}
						</span>
					))}
					{template.sections.length > 3 && (
						<span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
							+{template.sections.length - 3} más
						</span>
					)}
				</div>
			</div>

			{/* Template Info */}
			<div className="mb-4 text-sm text-gray-600">
				<div>Creado por: {template.createdBy}</div>
				<div>
					Última modificación:{" "}
					{template.lastModified.toLocaleDateString("es-EC")}
				</div>
			</div>

			{/* Actions */}
			<div className="flex gap-2">
				<button
					onClick={() => onGenerate(template.id)}
					className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
				>
					Generar
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
						<PencilIcon className="h-4 w-4" />
					</button>
				)}
			</div>
		</div>
	);
};

const DocumentGenerationModal: React.FC<{
	template: DocumentTemplate;
	brandingProfiles: BrandingProfile[];
	onGenerate: (
		variables: Record<string, any>,
		brandingId: string,
		settings?: Partial<DocumentSettings>
	) => void;
	onClose: () => void;
	isGenerating: boolean;
}> = ({template, brandingProfiles, onGenerate, onClose, isGenerating}) => {
	const [variables, setVariables] = useState<Record<string, any>>({});
	const [selectedBranding, setSelectedBranding] = useState(
		brandingProfiles.find((b) => b.isDefault)?.id || ""
	);
	const [customSettings, setCustomSettings] = useState<
		Partial<DocumentSettings>
	>({});
	const [step, setStep] = useState<
		"variables" | "branding" | "settings" | "preview"
	>("variables");

	const handleGenerate = () => {
		onGenerate(variables, selectedBranding, customSettings);
	};

	const renderVariablesStep = () => (
		<div className="space-y-4">
			<h3 className="text-lg font-semibold text-gray-900 mb-4">
				Variables del Documento
			</h3>

			{/* Mock variables for demo */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Nombre del Cliente
					</label>
					<input
						type="text"
						value={variables.clientName || ""}
						onChange={(e) =>
							setVariables({...variables, clientName: e.target.value})
						}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						placeholder="Nombre del cliente"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Fecha del Documento
					</label>
					<input
						type="date"
						value={variables.documentDate || ""}
						onChange={(e) =>
							setVariables({...variables, documentDate: e.target.value})
						}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Presupuesto Total
					</label>
					<input
						type="number"
						value={variables.totalBudget || ""}
						onChange={(e) =>
							setVariables({
								...variables,
								totalBudget: parseFloat(e.target.value),
							})
						}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						placeholder="0.00"
						step="0.01"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Duración del Proyecto
					</label>
					<input
						type="text"
						value={variables.projectDuration || ""}
						onChange={(e) =>
							setVariables({...variables, projectDuration: e.target.value})
						}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						placeholder="ej: 12 meses"
					/>
				</div>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Descripción del Proyecto
				</label>
				<textarea
					value={variables.projectDescription || ""}
					onChange={(e) =>
						setVariables({...variables, projectDescription: e.target.value})
					}
					className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
					rows={3}
					placeholder="Descripción detallada del proyecto..."
				/>
			</div>
		</div>
	);

	const renderBrandingStep = () => (
		<div className="space-y-4">
			<h3 className="text-lg font-semibold text-gray-900 mb-4">
				Seleccionar Marca Profesional
			</h3>

			<div className="space-y-4">
				{brandingProfiles.map((profile) => (
					<div
						key={profile.id}
						className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
							selectedBranding === profile.id
								? "border-blue-500 bg-blue-50"
								: "border-gray-200 hover:border-gray-300"
						}`}
						onClick={() => setSelectedBranding(profile.id)}
					>
						<div className="flex items-start justify-between mb-3">
							<div>
								<h4 className="font-medium text-gray-900 mb-1">
									{profile.name}
								</h4>
								{profile.isDefault && <Badge variant="info">Por defecto</Badge>}
							</div>
							<div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
								{profile.visual.logo ? (
									<img
										src={profile.visual.logo}
										alt="Logo"
										className="w-full h-full object-contain rounded-lg"
									/>
								) : (
									<BuildingOfficeIcon className="h-8 w-8 text-gray-400" />
								)}
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
							<div>
								<div className="text-gray-600">Empresa</div>
								<div className="font-medium text-gray-900">
									{profile.companyInfo.name}
								</div>
								<div className="text-gray-600">{profile.companyInfo.email}</div>
							</div>
							<div>
								<div className="text-gray-600">Profesional</div>
								<div className="font-medium text-gray-900">
									{profile.professional.name}
								</div>
								<div className="text-gray-600">
									{profile.professional.title}
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);

	const renderSettingsStep = () => (
		<div className="space-y-4">
			<h3 className="text-lg font-semibold text-gray-900 mb-4">
				Configuración del Documento
			</h3>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Formato
					</label>
					<select
						value={customSettings.format || template.settings.format}
						onChange={(e) =>
							setCustomSettings({
								...customSettings,
								format: e.target.value as DocumentSettings["format"],
							})
						}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					>
						<option value="PDF">PDF</option>
						<option value="DOCX">Word (DOCX)</option>
						<option value="HTML">HTML</option>
					</select>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Tamaño de Página
					</label>
					<select
						value={customSettings.pageSize || template.settings.pageSize}
						onChange={(e) =>
							setCustomSettings({
								...customSettings,
								pageSize: e.target.value as DocumentSettings["pageSize"],
							})
						}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					>
						<option value="A4">A4</option>
						<option value="A3">A3</option>
						<option value="Letter">Carta</option>
						<option value="Legal">Legal</option>
					</select>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Orientación
					</label>
					<select
						value={customSettings.orientation || template.settings.orientation}
						onChange={(e) =>
							setCustomSettings({
								...customSettings,
								orientation: e.target.value as DocumentSettings["orientation"],
							})
						}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					>
						<option value="portrait">Vertical</option>
						<option value="landscape">Horizontal</option>
					</select>
				</div>
			</div>

			{/* Watermark Settings */}
			<div>
				<div className="flex items-center gap-2 mb-3">
					<input
						type="checkbox"
						id="watermark"
						checked={!!customSettings.watermark}
						onChange={(e) => {
							if (e.target.checked) {
								setCustomSettings({
									...customSettings,
									watermark: {
										text: "BORRADOR",
										opacity: 0.3,
										position: "center",
									},
								});
							} else {
								const {watermark, ...rest} = customSettings;
								setCustomSettings(rest);
							}
						}}
						className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
					/>
					<label
						htmlFor="watermark"
						className="text-sm font-medium text-gray-700"
					>
						Agregar marca de agua
					</label>
				</div>

				{customSettings.watermark && (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Texto
							</label>
							<input
								type="text"
								value={customSettings.watermark.text}
								onChange={(e) =>
									setCustomSettings({
										...customSettings,
										watermark: {
											...customSettings.watermark!,
											text: e.target.value,
										},
									})
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Opacidad
							</label>
							<input
								type="range"
								min="0.1"
								max="1"
								step="0.1"
								value={customSettings.watermark.opacity}
								onChange={(e) =>
									setCustomSettings({
										...customSettings,
										watermark: {
											...customSettings.watermark!,
											opacity: parseFloat(e.target.value),
										},
									})
								}
								className="w-full"
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	);

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
				<div className="px-6 py-4 border-b border-gray-200">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-bold text-gray-900">
							Generar: {template.name}
						</h2>
						<button
							onClick={onClose}
							className="text-gray-400 hover:text-gray-600 transition-colors"
							disabled={isGenerating}
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
							{key: "variables", label: "Variables"},
							{key: "branding", label: "Marca"},
							{key: "settings", label: "Configuración"},
						].map(({key, label}, index) => (
							<div key={key} className="flex items-center">
								<div
									className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
										step === key
											? "bg-blue-600 text-white"
											: ["variables", "branding", "settings"].indexOf(step) >
												  index
												? "bg-green-600 text-white"
												: "bg-gray-200 text-gray-600"
									}`}
								>
									{["variables", "branding", "settings"].indexOf(step) > index
										? "✓"
										: index + 1}
								</div>
								<span className="ml-2 text-sm font-medium text-gray-700">
									{label}
								</span>
								{index < 2 && (
									<div className="w-8 h-0.5 bg-gray-200 ml-4"></div>
								)}
							</div>
						))}
					</div>
				</div>

				<div className="px-6 py-6 max-h-96 overflow-y-auto">
					{step === "variables" && renderVariablesStep()}
					{step === "branding" && renderBrandingStep()}
					{step === "settings" && renderSettingsStep()}
				</div>

				<div className="px-6 py-4 border-t border-gray-200 flex justify-between">
					<button
						onClick={() => {
							if (step === "variables") return;
							const steps = ["variables", "branding", "settings"];
							const currentIndex = steps.indexOf(step);
							setStep(steps[currentIndex - 1] as typeof step);
						}}
						disabled={step === "variables" || isGenerating}
						className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
					>
						Anterior
					</button>

					<div className="flex gap-2">
						{step !== "settings" ? (
							<button
								onClick={() => {
									const steps = ["variables", "branding", "settings"];
									const currentIndex = steps.indexOf(step);
									setStep(steps[currentIndex + 1] as typeof step);
								}}
								disabled={isGenerating}
								className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
							>
								Siguiente
							</button>
						) : (
							<button
								onClick={handleGenerate}
								disabled={isGenerating}
								className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
							>
								{isGenerating ? (
									<>
										<LoadingSpinner size="sm" />
										Generando...
									</>
								) : (
									<>
										<DocumentTextIcon className="h-4 w-4" />
										Generar Documento
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

const GeneratedDocumentsList: React.FC<{
	documents: GeneratedDocument[];
	onDownload: (documentId: string) => void;
	onPreview: (documentId: string) => void;
	onDelete: (documentId: string) => void;
}> = ({documents, onDownload, onPreview, onDelete}) => {
	const getStatusColor = (status: GeneratedDocument["status"]) => {
		switch (status) {
			case "ready":
				return "bg-green-100 text-green-800";
			case "generating":
				return "bg-blue-100 text-blue-800";
			case "error":
				return "bg-red-100 text-red-800";
			case "expired":
				return "bg-gray-100 text-gray-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getStatusIcon = (status: GeneratedDocument["status"]) => {
		switch (status) {
			case "ready":
				return CheckCircleIcon;
			case "generating":
				return ClockIcon;
			case "error":
				return ExclamationTriangleIcon;
			default:
				return DocumentTextIcon;
		}
	};

	if (documents.length === 0) {
		return (
			<div className="bg-white rounded-xl border border-gray-200 p-6">
				<div className="text-center py-8">
					<DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
					<p className="text-gray-600">No hay documentos generados</p>
					<p className="text-sm text-gray-500">
						Los documentos generados aparecerán aquí
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-xl border border-gray-200 p-6">
			<h3 className="text-lg font-semibold text-gray-900 mb-6">
				Documentos Generados ({documents.length})
			</h3>

			<div className="space-y-4">
				{documents.map((doc) => {
					const StatusIcon = getStatusIcon(doc.status);

					return (
						<div key={doc.id} className="border border-gray-200 rounded-lg p-4">
							<div className="flex items-start justify-between mb-3">
								<div className="flex items-start gap-3">
									<div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
										<StatusIcon className="h-5 w-5 text-gray-600" />
									</div>
									<div>
										<h4 className="font-medium text-gray-900 mb-1">
											{doc.name}
										</h4>
										<p className="text-sm text-gray-600">
											{doc.metadata.projectName} • {doc.metadata.client}
										</p>
										<div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
											<span>v{doc.version}</span>
											<span>{doc.size}</span>
											<span>{doc.format}</span>
											<span>
												Generado: {doc.createdAt.toLocaleDateString("es-EC")}
											</span>
										</div>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<span
										className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(doc.status)}`}
									>
										{doc.status === "ready"
											? "Listo"
											: doc.status === "generating"
												? "Generando"
												: doc.status === "error"
													? "Error"
													: "Expirado"}
									</span>
								</div>
							</div>

							{doc.status === "ready" && (
								<div className="flex gap-2">
									<button
										onClick={() => onDownload(doc.id)}
										className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
									>
										<ArrowDownTrayIcon className="h-4 w-4" />
										Descargar
									</button>
									<button
										onClick={() => onPreview(doc.id)}
										className="flex items-center gap-2 px-3 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
									>
										<EyeIcon className="h-4 w-4" />
										Vista Previa
									</button>
									<button
										onClick={() => onDelete(doc.id)}
										className="flex items-center gap-2 px-3 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-sm"
									>
										<TrashIcon className="h-4 w-4" />
										Eliminar
									</button>
								</div>
							)}

							{doc.status === "error" && (
								<div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
									<p className="text-sm text-red-700">
										Error al generar el documento. Intente nuevamente.
									</p>
								</div>
							)}

							{doc.status === "expired" && (
								<div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
									<p className="text-sm text-gray-700">
										Este documento ha expirado. Genere una nueva versión.
									</p>
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
};

const DocumentGenerator: React.FC = () => {
	const {projectId} = useParams<{projectId: string}>();
	const {
		templates,
		generatedDocuments,
		brandingProfiles,
		isLoading,
		isGenerating,
		loadTemplates,
		generateDocument,
		downloadDocument,
		previewDocument,
		deleteDocument,
	} = useDocumentGenerator();

	const [selectedTab, setSelectedTab] = useState<"templates" | "generated">(
		"templates"
	);
	const [selectedTemplate, setSelectedTemplate] =
		useState<DocumentTemplate | null>(null);
	const [filters, setFilters] = useState({
		type: "",
		category: "",
	});

	useEffect(() => {
		loadTemplates();
	}, []);

	const filteredTemplates = templates.filter((template) => {
		if (filters.type && template.type !== filters.type) return false;
		if (filters.category && template.category !== filters.category)
			return false;
		return template.isActive;
	});

	const handleGenerateTemplate = (templateId: string) => {
		const template = templates.find((t) => t.id === templateId);
		if (template) {
			setSelectedTemplate(template);
		}
	};

	const handleGenerateDocument = async (
		variables: Record<string, any>,
		brandingId: string,
		settings?: Partial<DocumentSettings>
	) => {
		if (!selectedTemplate || !projectId) return;

		try {
			await generateDocument(
				selectedTemplate.id,
				projectId,
				variables,
				brandingId,
				settings
			);
			setSelectedTemplate(null);
			// Reload documents
			loadTemplates();
		} catch (error) {
			console.error("Error generating document:", error);
		}
	};

	if (isLoading) {
		return (
			<div className="max-w-7xl mx-auto px-4 py-8">
				<div className="flex items-center justify-center h-64">
					<div className="text-center">
						<LoadingSpinner size="lg" className="mx-auto mb-4" />
						<p className="text-gray-600">Cargando generador de documentos...</p>
					</div>
				</div>
			</div>
		);
	}

	const renderHeader = () => (
		<div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-4">
					<div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
						<DocumentTextIcon className="h-6 w-6 text-white" />
					</div>
					<div>
						<h1 className="text-2xl font-bold text-gray-900">
							Generador de Documentos
						</h1>
						<p className="text-gray-600">
							Crea documentos profesionales con plantillas personalizables
						</p>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
						<CogIcon className="h-4 w-4" />
						Configurar Marca
					</button>
					<button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
						<DocumentDuplicateIcon className="h-4 w-4" />
						Nueva Plantilla
					</button>
				</div>
			</div>

			{/* Navigation Tabs */}
			<div className="flex gap-1 bg-gray-100 rounded-lg p-1">
				{[
					{
						key: "templates",
						label: "Plantillas",
						icon: DocumentTextIcon,
						count: templates.length,
					},
					{
						key: "generated",
						label: "Generados",
						icon: ArrowDownTrayIcon,
						count: generatedDocuments.length,
					},
				].map(({key, label, icon: Icon, count}) => (
					<button
						key={key}
						onClick={() => setSelectedTab(key as typeof selectedTab)}
						className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
							selectedTab === key
								? "bg-white text-purple-600 shadow-sm"
								: "text-gray-600 hover:text-gray-900"
						}`}
					>
						<Icon className="h-4 w-4" />
						{label}
						{count > 0 && (
							<span
								className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
									selectedTab === key
										? "bg-purple-100 text-purple-600"
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
		<div className="space-y-6">
			{/* Filters */}
			<div className="bg-white rounded-xl border border-gray-200 p-4">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<select
						value={filters.type}
						onChange={(e) => setFilters({...filters, type: e.target.value})}
						className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
					>
						<option value="">Todos los tipos</option>
						<option value="budget_estimate">Presupuesto</option>
						<option value="progress_report">Reporte de Progreso</option>
						<option value="calculation_report">Reporte de Cálculos</option>
						<option value="contract_proposal">Propuesta de Contrato</option>
						<option value="invoice">Factura</option>
					</select>

					<select
						value={filters.category}
						onChange={(e) => setFilters({...filters, category: e.target.value})}
						className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
					>
						<option value="">Todas las categorías</option>
						<option value="official">Oficiales</option>
						<option value="custom">Personalizadas</option>
						<option value="shared">Compartidas</option>
					</select>

					<button
						onClick={() => setFilters({type: "", category: ""})}
						className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
					>
						Limpiar Filtros
					</button>
				</div>
			</div>

			{/* Templates Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{filteredTemplates.map((template) => (
					<TemplateCard
						key={template.id}
						template={template}
						onGenerate={handleGenerateTemplate}
						onPreview={(id) => console.log("Preview template:", id)}
						onEdit={(id) => console.log("Edit template:", id)}
					/>
				))}
			</div>

			{filteredTemplates.length === 0 && (
				<div className="text-center py-12">
					<DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
					<p className="text-gray-600">No se encontraron plantillas</p>
					<p className="text-sm text-gray-500">
						Ajusta los filtros o crea una nueva plantilla
					</p>
				</div>
			)}
		</div>
	);

	return (
		<div className="max-w-7xl mx-auto px-4 py-8">
			{renderHeader()}

			{selectedTab === "templates" && renderTemplates()}
			{selectedTab === "generated" && (
				<GeneratedDocumentsList
					documents={generatedDocuments}
					onDownload={downloadDocument}
					onPreview={previewDocument}
					onDelete={deleteDocument}
				/>
			)}

			{/* Generation Modal */}
			{selectedTemplate && (
				<DocumentGenerationModal
					template={selectedTemplate}
					brandingProfiles={brandingProfiles}
					onGenerate={handleGenerateDocument}
					onClose={() => setSelectedTemplate(null)}
					isGenerating={isGenerating}
				/>
			)}
		</div>
	);
};

export default DocumentGenerator;
