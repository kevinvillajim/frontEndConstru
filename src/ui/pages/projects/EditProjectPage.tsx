import React, {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {
	PhotoIcon,
	MapPinIcon,
	CalendarIcon,
	CurrencyDollarIcon,
	UserGroupIcon,
	DocumentTextIcon,
	ArrowLeftIcon,
	PlusIcon,
	XMarkIcon,
	TrashIcon,
	EyeIcon,
} from "@heroicons/react/24/outline";

// Esquema de validación
const projectSchema = z.object({
	name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
	description: z
		.string()
		.min(10, "La descripción debe tener al menos 10 caracteres"),
	client: z.string().min(2, "El cliente es requerido"),
	location: z.string().min(5, "La ubicación es requerida"),
	startDate: z.string().min(1, "La fecha de inicio es requerida"),
	endDate: z.string().min(1, "La fecha de finalización es requerida"),
	budget: z.number().min(1, "El presupuesto debe ser mayor a 0"),
	teamMembers: z.number().min(1, "Debe tener al menos 1 miembro del equipo"),
	priority: z.enum(["low", "medium", "high"]),
	projectType: z.string().min(1, "El tipo de proyecto es requerido"),
	projectSize: z.string().min(1, "El tamaño del proyecto es requerido"),
	status: z.enum([
		"planning",
		"in_progress",
		"on_hold",
		"completed",
		"cancelled",
	]),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectData extends ProjectFormValues {
	id: string;
	images: string[];
	phase: string;
	progress: number;
	spent: number;
	isFavorite: boolean;
	createdAt: string;
	updatedAt: string;
}

// Mock data - En producción vendría de la API
const mockProject: ProjectData = {
	id: "1",
	name: "Torre Residencial Quito Centro",
	description:
		"Desarrollo de torre residencial de 20 pisos con departamentos de lujo en el centro histórico de Quito. El proyecto incluye amenidades de primera clase como gimnasio, spa, área social, piscina en la terraza y estacionamiento subterráneo para 150 vehículos.",
	client: "Inmobiliaria Del Centro",
	location: "Quito, Pichincha",
	startDate: "2024-01-15",
	endDate: "2025-06-30",
	budget: 850000,
	teamMembers: 12,
	priority: "high",
	projectType: "residential",
	projectSize: "large",
	status: "in_progress",
	images: [
		"/api/placeholder/600/400",
		"/api/placeholder/600/400",
		"/api/placeholder/600/400",
	],
	phase: "Estructura",
	progress: 65,
	spent: 420000,
	isFavorite: true,
	createdAt: "2024-01-10T10:00:00Z",
	updatedAt: "2024-05-15T14:30:00Z",
};

const EditProjectPage: React.FC = () => {
	const {projectId} = useParams<{projectId: string}>();
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const [loadingProject, setLoadingProject] = useState(true);
	const [uploadedImages, setUploadedImages] = useState<string[]>([]);
	const [dragActive, setDragActive] = useState(false);
	const [unsavedChanges, setUnsavedChanges] = useState(false);

	const {
		register,
		handleSubmit,
		formState: {errors, isDirty},
		watch,
		setValue,
		reset,
	} = useForm<ProjectFormValues>({
		resolver: zodResolver(projectSchema),
	});

	const watchedStartDate = watch("startDate");
	const watchedEndDate = watch("endDate");

	useEffect(() => {
		// Cargar datos del proyecto
		const loadProject = async () => {
			try {
				// En producción: await api.get(`/projects/${projectId}`)
				await new Promise((resolve) => setTimeout(resolve, 1000));

				// Cargar datos en el formulario
				reset({
					name: mockProject.name,
					description: mockProject.description,
					client: mockProject.client,
					location: mockProject.location,
					startDate: mockProject.startDate,
					endDate: mockProject.endDate,
					budget: mockProject.budget,
					teamMembers: mockProject.teamMembers,
					priority: mockProject.priority,
					projectType: mockProject.projectType,
					projectSize: mockProject.projectSize,
					status: mockProject.status,
				});

				setUploadedImages(mockProject.images);
			} catch (error) {
				console.error("Error loading project:", error);
			} finally {
				setLoadingProject(false);
			}
		};

		loadProject();
	}, [projectId, reset]);

	useEffect(() => {
		setUnsavedChanges(isDirty);
	}, [isDirty]);

	// Efecto para detectar cuando el usuario intenta salir con cambios sin guardar
	useEffect(() => {
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			if (unsavedChanges) {
				e.preventDefault();
				e.returnValue = "";
			}
		};

		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => window.removeEventListener("beforeunload", handleBeforeUnload);
	}, [unsavedChanges]);

	const onSubmit = async (data: ProjectFormValues) => {
		setIsLoading(true);
		try {
			// Simular llamada API
			await new Promise((resolve) => setTimeout(resolve, 2000));
			console.log("Actualizar proyecto:", data);
			setUnsavedChanges(false);
			navigate(`/projects/details/${projectId}`);
		} catch (error) {
			console.error("Error al actualizar proyecto:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files) {
			const newImages = Array.from(files).map((file) =>
				URL.createObjectURL(file)
			);
			setUploadedImages([...uploadedImages, ...newImages]);
		}
	};

	const removeImage = (index: number) => {
		setUploadedImages(uploadedImages.filter((_, i) => i !== index));
	};

	const handleDrag = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === "dragenter" || e.type === "dragover") {
			setDragActive(true);
		} else if (e.type === "dragleave") {
			setDragActive(false);
		}
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);

		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			const files = Array.from(e.dataTransfer.files);
			const newImages = files.map((file) => URL.createObjectURL(file));
			setUploadedImages([...uploadedImages, ...newImages]);
		}
	};

	const handleCancel = () => {
		if (unsavedChanges) {
			const confirmed = window.confirm(
				"Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?"
			);
			if (!confirmed) return;
		}
		navigate(`/projects/details/${projectId}`);
	};

	if (loadingProject) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin h-8 w-8 border-2 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
					<p className="text-gray-600">Cargando proyecto...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white border-b border-gray-200 sticky top-0 z-40">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<button
								onClick={handleCancel}
								className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
							>
								<ArrowLeftIcon className="h-5 w-5" />
							</button>
							<div>
								<h1 className="text-2xl font-bold text-gray-900">
									Editar Proyecto
								</h1>
								<p className="text-gray-600">
									Modifica la información de tu proyecto
								</p>
							</div>
						</div>

						<div className="flex items-center gap-3">
							<button
								onClick={() => navigate(`/projects/details/${projectId}`)}
								className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
							>
								<EyeIcon className="h-4 w-4" />
								Ver Proyecto
							</button>

							{unsavedChanges && (
								<div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
									Cambios sin guardar
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Form Container */}
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="max-w-4xl mx-auto">
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
						{/* Información Básica */}
						<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 animate-fade-in">
							<div className="flex items-center gap-3 mb-6">
								<div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center">
									<DocumentTextIcon className="h-5 w-5 text-primary-600" />
								</div>
								<div>
									<h2 className="text-xl font-semibold text-gray-900">
										Información Básica
									</h2>
									<p className="text-sm text-gray-600">
										Datos fundamentales del proyecto
									</p>
								</div>
							</div>

							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								<div className="lg:col-span-2">
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Nombre del Proyecto *
									</label>
									<input
										type="text"
										{...register("name")}
										className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
											errors.name ? "border-red-500" : "border-gray-300"
										}`}
										placeholder="Ej: Torre Residencial Centro Norte"
									/>
									{errors.name && (
										<p className="mt-1 text-sm text-red-600">
											{errors.name.message}
										</p>
									)}
								</div>

								<div className="lg:col-span-2">
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Descripción *
									</label>
									<textarea
										{...register("description")}
										rows={4}
										className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none ${
											errors.description ? "border-red-500" : "border-gray-300"
										}`}
										placeholder="Describe las características principales, alcance y objetivos del proyecto..."
									/>
									{errors.description && (
										<p className="mt-1 text-sm text-red-600">
											{errors.description.message}
										</p>
									)}
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Cliente *
									</label>
									<input
										type="text"
										{...register("client")}
										className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
											errors.client ? "border-red-500" : "border-gray-300"
										}`}
										placeholder="Nombre del cliente o empresa"
									/>
									{errors.client && (
										<p className="mt-1 text-sm text-red-600">
											{errors.client.message}
										</p>
									)}
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Ubicación *
									</label>
									<div className="relative">
										<MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
										<input
											type="text"
											{...register("location")}
											className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
												errors.location ? "border-red-500" : "border-gray-300"
											}`}
											placeholder="Ciudad, Provincia"
										/>
									</div>
									{errors.location && (
										<p className="mt-1 text-sm text-red-600">
											{errors.location.message}
										</p>
									)}
								</div>
							</div>
						</div>

						{/* Estado y Detalles del Proyecto */}
						<div
							className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 animate-fade-in"
							style={{animationDelay: "0.1s"}}
						>
							<div className="flex items-center gap-3 mb-6">
								<div className="h-10 w-10 bg-secondary-100 rounded-lg flex items-center justify-center">
									<CalendarIcon className="h-5 w-5 text-secondary-600" />
								</div>
								<div>
									<h2 className="text-xl font-semibold text-gray-900">
										Estado y Detalles
									</h2>
									<p className="text-sm text-gray-600">
										Configuración actual del proyecto
									</p>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Estado del Proyecto *
									</label>
									<select
										{...register("status")}
										className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
									>
										<option value="planning">Planificación</option>
										<option value="in_progress">En Progreso</option>
										<option value="on_hold">Pausado</option>
										<option value="completed">Completado</option>
										<option value="cancelled">Cancelado</option>
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Tipo de Proyecto *
									</label>
									<select
										{...register("projectType")}
										className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
									>
										<option value="">Seleccionar tipo</option>
										<option value="residential">Residencial</option>
										<option value="commercial">Comercial</option>
										<option value="industrial">Industrial</option>
										<option value="infrastructure">Infraestructura</option>
										<option value="renovation">Renovación</option>
									</select>
									{errors.projectType && (
										<p className="mt-1 text-sm text-red-600">
											{errors.projectType.message}
										</p>
									)}
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Tamaño del Proyecto *
									</label>
									<select
										{...register("projectSize")}
										className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
									>
										<option value="">Seleccionar tamaño</option>
										<option value="small">Pequeño (&lt; 500m²)</option>
										<option value="medium">Mediano (500m² - 2000m²)</option>
										<option value="large">Grande (2000m² - 10000m²)</option>
										<option value="mega">Mega (&gt; 10000m²)</option>
									</select>
									{errors.projectSize && (
										<p className="mt-1 text-sm text-red-600">
											{errors.projectSize.message}
										</p>
									)}
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Prioridad *
									</label>
									<select
										{...register("priority")}
										className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
									>
										<option value="low">Baja</option>
										<option value="medium">Media</option>
										<option value="high">Alta</option>
									</select>
								</div>
							</div>
						</div>

						{/* Cronograma y Presupuesto */}
						<div
							className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 animate-fade-in"
							style={{animationDelay: "0.2s"}}
						>
							<div className="flex items-center gap-3 mb-6">
								<div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
									<CurrencyDollarIcon className="h-5 w-5 text-green-600" />
								</div>
								<div>
									<h2 className="text-xl font-semibold text-gray-900">
										Cronograma y Presupuesto
									</h2>
									<p className="text-sm text-gray-600">
										Fechas clave y presupuesto estimado
									</p>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Fecha de Inicio *
									</label>
									<input
										type="date"
										{...register("startDate")}
										className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
											errors.startDate ? "border-red-500" : "border-gray-300"
										}`}
									/>
									{errors.startDate && (
										<p className="mt-1 text-sm text-red-600">
											{errors.startDate.message}
										</p>
									)}
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Fecha de Finalización *
									</label>
									<input
										type="date"
										{...register("endDate")}
										min={watchedStartDate}
										className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
											errors.endDate ? "border-red-500" : "border-gray-300"
										}`}
									/>
									{errors.endDate && (
										<p className="mt-1 text-sm text-red-600">
											{errors.endDate.message}
										</p>
									)}
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Presupuesto (USD) *
									</label>
									<div className="relative">
										<CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
										<input
											type="number"
											{...register("budget", {valueAsNumber: true})}
											min="1"
											step="0.01"
											className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
												errors.budget ? "border-red-500" : "border-gray-300"
											}`}
											placeholder="100000"
										/>
									</div>
									{errors.budget && (
										<p className="mt-1 text-sm text-red-600">
											{errors.budget.message}
										</p>
									)}
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Miembros del Equipo *
									</label>
									<div className="relative">
										<UserGroupIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
										<input
											type="number"
											{...register("teamMembers", {valueAsNumber: true})}
											min="1"
											className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
												errors.teamMembers
													? "border-red-500"
													: "border-gray-300"
											}`}
											placeholder="5"
										/>
									</div>
									{errors.teamMembers && (
										<p className="mt-1 text-sm text-red-600">
											{errors.teamMembers.message}
										</p>
									)}
								</div>
							</div>

							{/* Duración estimada */}
							{watchedStartDate && watchedEndDate && (
								<div className="mt-6 p-4 bg-primary-50 rounded-lg">
									<p className="text-sm text-primary-700">
										<strong>Duración estimada:</strong>{" "}
										{Math.ceil(
											(new Date(watchedEndDate).getTime() -
												new Date(watchedStartDate).getTime()) /
												(1000 * 3600 * 24)
										)}{" "}
										días
									</p>
								</div>
							)}
						</div>

						{/* Imágenes del Proyecto */}
						<div
							className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 animate-fade-in"
							style={{animationDelay: "0.3s"}}
						>
							<div className="flex items-center gap-3 mb-6">
								<div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
									<PhotoIcon className="h-5 w-5 text-purple-600" />
								</div>
								<div>
									<h2 className="text-xl font-semibold text-gray-900">
										Imágenes del Proyecto
									</h2>
									<p className="text-sm text-gray-600">
										Actualiza planos, renders o fotografías
									</p>
								</div>
							</div>

							{/* Imágenes existentes */}
							{uploadedImages.length > 0 && (
								<div className="mb-6">
									<h3 className="text-sm font-medium text-gray-700 mb-3">
										Imágenes actuales
									</h3>
									<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
										{uploadedImages.map((image, index) => (
											<div key={index} className="relative group">
												<img
													src={image}
													alt={`Preview ${index + 1}`}
													className="w-full h-24 object-cover rounded-lg"
												/>
												<button
													type="button"
													onClick={() => removeImage(index)}
													className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
												>
													<XMarkIcon className="h-4 w-4" />
												</button>
											</div>
										))}
									</div>
								</div>
							)}

							{/* Área de drag and drop */}
							<div
								className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
									dragActive
										? "border-primary-500 bg-primary-50"
										: "border-gray-300 hover:border-primary-400 hover:bg-gray-50"
								}`}
								onDragEnter={handleDrag}
								onDragLeave={handleDrag}
								onDragOver={handleDrag}
								onDrop={handleDrop}
							>
								<PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
								<div className="text-gray-600">
									<p className="mb-2">Arrastra nuevas imágenes aquí, o</p>
									<label className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors">
										<PlusIcon className="h-4 w-4" />
										Seleccionar archivos
										<input
											type="file"
											multiple
											accept="image/*"
											onChange={handleImageUpload}
											className="hidden"
										/>
									</label>
								</div>
								<p className="text-xs text-gray-500 mt-2">
									PNG, JPG, WEBP hasta 10MB cada una
								</p>
							</div>
						</div>

						{/* Botones de acción */}
						<div
							className="flex justify-end gap-4 animate-fade-in"
							style={{animationDelay: "0.4s"}}
						>
							<button
								type="button"
								onClick={handleCancel}
								className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
							>
								Cancelar
							</button>
							<button
								type="submit"
								disabled={isLoading}
								className="flex items-center gap-2 px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
							>
								{isLoading ? (
									<>
										<div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
										Guardando...
									</>
								) : (
									<>Guardar Cambios</>
								)}
							</button>
						</div>
					</form>
				</div>
			</div>

			{/* Estilos para animaciones */}
			<style>{`
				@keyframes fadeIn {
					from {
						opacity: 0;
						transform: translateY(20px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				.animate-fade-in {
					animation: fadeIn 0.5s ease-out forwards;
					opacity: 0;
				}
			`}</style>
		</div>
	);
};

export default EditProjectPage;
