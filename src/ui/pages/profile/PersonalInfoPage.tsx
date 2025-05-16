import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useAuth} from "../../context/AuthContext";
import ToastService from "../../components/common/ToastService";

// Definir el esquema de validación con Zod
const personalInfoSchema = z.object({
	firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
	lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
	email: z.string().email("Ingresa un correo electrónico válido"),
	phone: z.string().optional(),
	mobilePhone: z.string().optional(),
	street: z.string().optional(),
	city: z.string().optional(),
	province: z.string().optional(),
	postalCode: z.string().optional(),
});

// Tipo para los valores del formulario
type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;

const PersonalInfoPage = () => {
	const {user} = useAuth();
	const [isEditing, setIsEditing] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	// Obtener la dirección principal (o la primera disponible)
	const mainAddress =
		user?.addresses?.find((addr) => addr.isMain) || user?.addresses?.[0];

	// Configurar react-hook-form con validación de Zod
	const {
		register,
		handleSubmit,
		formState: {errors},
		reset,
	} = useForm<PersonalInfoFormValues>({
		resolver: zodResolver(personalInfoSchema),
		defaultValues: {
			firstName: user?.firstName || "",
			lastName: user?.lastName || "",
			email: user?.email || "",
			phone: user?.phone || "",
			mobilePhone: user?.mobilePhone || "",
			street: mainAddress?.street || "",
			city: mainAddress?.city || "",
			province: mainAddress?.province || "",
			postalCode: mainAddress?.postalCode || "",
		},
	});

	// Manejar el envío del formulario
	const onSubmit = async (formData: PersonalInfoFormValues) => {
		setIsLoading(true);

		try {
			// Aquí iría la llamada al backend para actualizar la información
			// await userService.updatePersonalInfo(data);

			// Simular un delay para la demo
			await new Promise((resolve) => setTimeout(resolve, 1000));

			ToastService.success("Información personal actualizada correctamente");
			setIsEditing(false);
		} catch (error) {
			console.error("Error al actualizar información personal:", error);
			ToastService.error("Error al actualizar la información personal");
		} finally {
			setIsLoading(false);
		}
	};

	// Cancelar la edición y restablecer los valores
	const handleCancel = () => {
		reset({
			firstName: user?.firstName || "",
			lastName: user?.lastName || "",
			email: user?.email || "",
			phone: user?.phone || "",
			mobilePhone: user?.mobilePhone || "",
			street: mainAddress?.street || "",
			city: mainAddress?.city || "",
			province: mainAddress?.province || "",
			postalCode: mainAddress?.postalCode || "",
		});
		setIsEditing(false);
	};

	return (
		<div>
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
					Información Personal
				</h2>
				{!isEditing ? (
					<button
						type="button"
						onClick={() => setIsEditing(true)}
						className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
					>
						Editar Información
					</button>
				) : (
					<div className="flex space-x-3">
						<button
							type="button"
							onClick={handleCancel}
							className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
						>
							Cancelar
						</button>
						<button
							form="personal-info-form"
							type="submit"
							disabled={isLoading}
							className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 flex items-center"
						>
							{isLoading ? (
								<>
									<svg
										className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										></circle>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
									Guardando...
								</>
							) : (
								"Guardar Cambios"
							)}
						</button>
					</div>
				)}
			</div>

			{isEditing ? (
				<form
					id="personal-info-form"
					onSubmit={handleSubmit(onSubmit)}
					className="space-y-6"
				>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label
								htmlFor="firstName"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
							>
								Nombre
							</label>
							<input
								type="text"
								id="firstName"
								{...register("firstName")}
								className={`w-full px-4 py-2 rounded-lg border ${
									errors.firstName
										? "border-red-500 focus:ring-red-500 focus:border-red-500"
										: "border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
								} bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
							/>
							{errors.firstName && (
								<p className="mt-1 text-sm text-red-600 dark:text-red-400">
									{errors.firstName.message}
								</p>
							)}
						</div>

						<div>
							<label
								htmlFor="lastName"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
							>
								Apellido
							</label>
							<input
								type="text"
								id="lastName"
								{...register("lastName")}
								className={`w-full px-4 py-2 rounded-lg border ${
									errors.lastName
										? "border-red-500 focus:ring-red-500 focus:border-red-500"
										: "border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
								} bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
							/>
							{errors.lastName && (
								<p className="mt-1 text-sm text-red-600 dark:text-red-400">
									{errors.lastName.message}
								</p>
							)}
						</div>

						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
							>
								Correo Electrónico
							</label>
							<input
								type="email"
								id="email"
								{...register("email")}
								className={`w-full px-4 py-2 rounded-lg border ${
									errors.email
										? "border-red-500 focus:ring-red-500 focus:border-red-500"
										: "border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
								} bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
							/>
							{errors.email && (
								<p className="mt-1 text-sm text-red-600 dark:text-red-400">
									{errors.email.message}
								</p>
							)}
						</div>

						<div>
							<label
								htmlFor="phone"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
							>
								Teléfono
							</label>
							<input
								type="tel"
								id="phone"
								{...register("phone")}
								className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
							/>
						</div>

						<div>
							<label
								htmlFor="mobilePhone"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
							>
								Teléfono Móvil
							</label>
							<input
								type="tel"
								id="mobilePhone"
								{...register("mobilePhone")}
								className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
							/>
						</div>

						<div className="md:col-span-2">
							<label
								htmlFor="street"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
							>
								Dirección
							</label>
							<input
								type="text"
								id="street"
								{...register("street")}
								className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
							/>
						</div>

						<div>
							<label
								htmlFor="city"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
							>
								Ciudad
							</label>
							<input
								type="text"
								id="city"
								{...register("city")}
								className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
							/>
						</div>

						<div>
							<label
								htmlFor="province"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
							>
								Provincia
							</label>
							<input
								type="text"
								id="province"
								{...register("province")}
								className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
							/>
						</div>

						<div>
							<label
								htmlFor="postalCode"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
							>
								Código Postal
							</label>
							<input
								type="text"
								id="postalCode"
								{...register("postalCode")}
								className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
							/>
						</div>
					</div>
				</form>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
							Nombre
						</h3>
						<p className="mt-1 text-lg text-gray-900 dark:text-white">
							{user?.firstName}
						</p>
					</div>

					<div>
						<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
							Apellido
						</h3>
						<p className="mt-1 text-lg text-gray-900 dark:text-white">
							{user?.lastName}
						</p>
					</div>

					<div>
						<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
							Correo Electrónico
						</h3>
						<p className="mt-1 text-lg text-gray-900 dark:text-white">
							{user?.email}
						</p>
					</div>

					<div>
						<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
							Teléfono
						</h3>
						<p className="mt-1 text-lg text-gray-900 dark:text-white">
							{user?.phone || "No especificado"}
						</p>
					</div>

					<div>
						<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
							Teléfono Móvil
						</h3>
						<p className="mt-1 text-lg text-gray-900 dark:text-white">
							{user?.mobilePhone || "No especificado"}
						</p>
					</div>

					<div className="md:col-span-2">
						<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
							Dirección
						</h3>
						<p className="mt-1 text-lg text-gray-900 dark:text-white">
							{mainAddress?.street || "No especificada"}
						</p>
					</div>

					<div>
						<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
							Ciudad
						</h3>
						<p className="mt-1 text-lg text-gray-900 dark:text-white">
							{mainAddress?.city || "No especificada"}
						</p>
					</div>

					<div>
						<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
							Provincia
						</h3>
						<p className="mt-1 text-lg text-gray-900 dark:text-white">
							{mainAddress?.province || "No especificada"}
						</p>
					</div>

					<div>
						<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
							Código Postal
						</h3>
						<p className="mt-1 text-lg text-gray-900 dark:text-white">
							{mainAddress?.postalCode || "No especificado"}
						</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default PersonalInfoPage;
