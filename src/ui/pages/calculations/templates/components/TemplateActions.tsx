import React, {useState} from "react";
import {
	ExclamationTriangleIcon,
	ShareIcon,
	LinkIcon,
	EnvelopeIcon,
	CheckIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import type {MyCalculationTemplate} from "../../shared/types/template.types";

interface DeleteModalProps {
	template: MyCalculationTemplate | null;
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (templateId: string) => void;
	isDeleting?: boolean;
}

interface ShareModalProps {
	template: MyCalculationTemplate | null;
	isOpen: boolean;
	onClose: () => void;
}

// Modal de confirmación de eliminación
export const DeleteModal: React.FC<DeleteModalProps> = ({
	template,
	isOpen,
	onClose,
	onConfirm,
	isDeleting = false,
}) => {
	if (!isOpen || !template) return null;

	const handleConfirm = () => {
		onConfirm(template.id);
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in-0 zoom-in-95 duration-200">
				<div className="p-6">
					<div className="flex items-center gap-3 mb-4">
						<div className="p-2 bg-red-100 rounded-full">
							<ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
						</div>
						<h3 className="text-lg font-semibold text-gray-900">
							Eliminar Plantilla
						</h3>
					</div>

					<div className="mb-6">
						<p className="text-gray-600 mb-3">
							¿Estás seguro de que deseas eliminar la plantilla{" "}
							<span className="font-medium text-gray-900">
								"{template.name}"
							</span>
							?
						</p>
						<div className="bg-red-50 border border-red-200 rounded-lg p-3">
							<p className="text-sm text-red-800">
								<strong>Esta acción no se puede deshacer.</strong> Se
								eliminarán:
							</p>
							<ul className="text-sm text-red-700 mt-2 space-y-1">
								<li>• La plantilla y toda su configuración</li>
								<li>• Los parámetros y fórmulas definidas</li>
								{template.usageCount > 0 && (
									<li>
										• El historial de {template.usageCount} cálculos realizados
									</li>
								)}
							</ul>
						</div>
					</div>

					<div className="flex justify-end gap-3">
						<button
							onClick={onClose}
							disabled={isDeleting}
							className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
						>
							Cancelar
						</button>
						<button
							onClick={handleConfirm}
							disabled={isDeleting}
							className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
						>
							{isDeleting ? (
								<>
									<div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent" />
									Eliminando...
								</>
							) : (
								"Eliminar Plantilla"
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

// Modal de compartir plantilla
export const ShareModal: React.FC<ShareModalProps> = ({
	template,
	isOpen,
	onClose,
}) => {
	const [copied, setCopied] = useState(false);
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [isSending, setIsSending] = useState(false);

	if (!isOpen || !template) return null;

	// URL ficticia para compartir
	const shareUrl = `https://constru.app/templates/${template.id}`;

	const handleCopyLink = async () => {
		try {
			await navigator.clipboard.writeText(shareUrl);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (error) {
			console.error("Error copying to clipboard:", error);
		}
	};

	const handleSendByEmail = async () => {
		if (!email.trim()) return;

		setIsSending(true);
		try {
			// Simular envío por email
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// Resetear formulario
			setEmail("");
			setMessage("");

			// Mostrar confirmación (podrías usar un toast aquí)
			alert("Invitación enviada correctamente");
			onClose();
		} catch (error) {
			console.error("Error sending email:", error);
		} finally {
			setIsSending(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-in fade-in-0 zoom-in-95 duration-200">
				<div className="p-6">
					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-primary-100 rounded-full">
								<ShareIcon className="h-6 w-6 text-primary-600" />
							</div>
							<h3 className="text-lg font-semibold text-gray-900">
								Compartir Plantilla
							</h3>
						</div>
						<button
							onClick={onClose}
							className="p-1 hover:bg-gray-100 rounded-full transition-colors"
						>
							<XMarkIcon className="h-5 w-5 text-gray-500" />
						</button>
					</div>

					<div className="mb-6">
						<p className="text-gray-600 mb-4">
							Compartir "{template.name}" con otros profesionales
						</p>

						{/* Información de la plantilla */}
						<div className="bg-gray-50 rounded-lg p-4 mb-4">
							<h4 className="font-medium text-gray-900 mb-2">
								{template.name}
							</h4>
							<p className="text-sm text-gray-600 mb-2">
								{template.description}
							</p>
							<div className="flex items-center gap-4 text-xs text-gray-500">
								<span>Categoría: {template.category}</span>
								<span>Versión: {template.version}</span>
								<span>{template.usageCount} usos</span>
							</div>
						</div>

						{/* Copiar enlace */}
						<div className="mb-4">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Enlace directo
							</label>
							<div className="flex gap-2">
								<input
									type="text"
									value={shareUrl}
									readOnly
									className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
								/>
								<button
									onClick={handleCopyLink}
									className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
										copied
											? "bg-green-100 text-green-700"
											: "bg-primary-100 text-primary-700 hover:bg-primary-200"
									}`}
								>
									{copied ? (
										<>
											<CheckIcon className="h-4 w-4" />
											Copiado
										</>
									) : (
										<>
											<LinkIcon className="h-4 w-4" />
											Copiar
										</>
									)}
								</button>
							</div>
						</div>

						{/* Enviar por email */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Invitar por email
							</label>
							<div className="space-y-3">
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="email@ejemplo.com"
									className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
								/>
								<textarea
									value={message}
									onChange={(e) => setMessage(e.target.value)}
									placeholder="Mensaje personalizado (opcional)"
									rows={3}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
								/>
								<button
									onClick={handleSendByEmail}
									disabled={!email.trim() || isSending}
									className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
								>
									{isSending ? (
										<>
											<div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent" />
											Enviando...
										</>
									) : (
										<>
											<EnvelopeIcon className="h-4 w-4" />
											Enviar Invitación
										</>
									)}
								</button>
							</div>
						</div>
					</div>

					<div className="text-xs text-gray-500 bg-blue-50 border border-blue-200 rounded-lg p-3">
						<p className="font-medium text-blue-900 mb-1">
							Nota sobre privacidad
						</p>
						<p className="text-blue-800">
							Solo usuarios registrados en CONSTRU podrán acceder a tu
							plantilla. Mantienes el control total sobre los permisos de
							acceso.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

// Hook para manejar acciones de plantillas
interface UseTemplateActionsProps {
	templates: MyCalculationTemplate[];
	setTemplates: React.Dispatch<React.SetStateAction<MyCalculationTemplate[]>>;
}

export const useTemplateActions = ({
	templates,
	setTemplates,
}: UseTemplateActionsProps) => {
	const [deleteModal, setDeleteModal] = useState<{
		isOpen: boolean;
		template: MyCalculationTemplate | null;
		isDeleting: boolean;
	}>({
		isOpen: false,
		template: null,
		isDeleting: false,
	});

	const [shareModal, setShareModal] = useState<{
		isOpen: boolean;
		template: MyCalculationTemplate | null;
	}>({
		isOpen: false,
		template: null,
	});

	const toggleFavorite = (templateId: string) => {
		setTemplates(
			templates.map((template) =>
				template.id === templateId
					? {...template, isFavorite: !template.isFavorite}
					: template
			)
		);
	};

	// CORREGIDO: Duplicación inmediata con notificación mejorada
	const duplicateTemplate = (templateId: string) => {
		const template = templates.find((t) => t.id === templateId);
		if (template) {
			const duplicated: MyCalculationTemplate = {
				...template,
				id: `my-${Date.now()}`,
				name: `${template.name} (Copia)`,
				createdAt: new Date().toISOString(),
				lastModified: new Date().toISOString(),
				usageCount: 0,
				version: "1.0",
				isPublic: false,
				status: "draft",
				sharedWith: [],
			};
			setTemplates([duplicated, ...templates]);

			// Mostrar notificación de éxito mejorada
			// En una implementación real, podrías usar un toast/notification system
			setTimeout(() => {
				alert(
					`✅ Plantilla duplicada exitosamente!\n\n"${template.name}" → "${duplicated.name}"\n\nPuedes encontrarla al inicio de tu lista de plantillas.`
				);
			}, 100);
		}
	};

	const openDeleteModal = (template: MyCalculationTemplate) => {
		setDeleteModal({
			isOpen: true,
			template,
			isDeleting: false,
		});
	};

	const closeDeleteModal = () => {
		setDeleteModal({
			isOpen: false,
			template: null,
			isDeleting: false,
		});
	};

	const confirmDelete = async (templateId: string) => {
		setDeleteModal((prev) => ({...prev, isDeleting: true}));

		try {
			// Simular delay de API
			await new Promise((resolve) => setTimeout(resolve, 1000));

			setTemplates(templates.filter((t) => t.id !== templateId));
			closeDeleteModal();
		} catch (error) {
			console.error("Error deleting template:", error);
			setDeleteModal((prev) => ({...prev, isDeleting: false}));
		}
	};

	const toggleTemplateStatus = (templateId: string) => {
		setTemplates(
			templates.map((template) =>
				template.id === templateId
					? {
							...template,
							isActive: !template.isActive,
							status: template.isActive ? "archived" : "active",
							lastModified: new Date().toISOString(),
						}
					: template
			)
		);
	};

	const openShareModal = (template: MyCalculationTemplate) => {
		setShareModal({
			isOpen: true,
			template,
		});
	};

	const closeShareModal = () => {
		setShareModal({
			isOpen: false,
			template: null,
		});
	};

	return {
		// Estado de modales
		deleteModal,
		shareModal,

		// Acciones
		toggleFavorite,
		duplicateTemplate,
		toggleTemplateStatus,

		// Manejo de modales
		openDeleteModal,
		closeDeleteModal,
		confirmDelete,
		openShareModal,
		closeShareModal,
	};
};
