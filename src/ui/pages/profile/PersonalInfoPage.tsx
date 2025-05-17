// src/ui/pages/profile/PersonalInfoPage.tsx
import {useState, useEffect} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useUserProfile} from "../../context/UserProfileContext";
import ToastService from "../../components/common/ToastService";
import type { UserAddress } from "../../../core/domain/models/user/User";

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
	const {profile, isLoading, updatePersonalInfo, updateAddress} =
		useUserProfile();
	const [isEditing, setIsEditing] = useState(false);
	const [submitLoading, setSubmitLoading] = useState(false);

	// Obtener la dirección principal (o la primera disponible)
	const mainAddress =
		profile?.addresses?.find((addr) => addr.isMain) || profile?.addresses?.[0];

	// Direcciones adicionales
	const [additionalAddresses, setAdditionalAddresses] = useState<UserAddress[]>(
		[]
	);

	// Configurar react-hook-form con validación de Zod
	const {
		register,
		handleSubmit,
		formState: {errors},
		reset,
	} = useForm<PersonalInfoFormValues>({
		resolver: zodResolver(personalInfoSchema),
		defaultValues: {
			firstName: profile?.firstName || "",
			lastName: profile?.lastName || "",
			email: profile?.email || "",
			phone: profile?.phone || "",
			mobilePhone: profile?.mobilePhone || "",
			street: mainAddress?.street || "",
			city: mainAddress?.city || "",
			province: mainAddress?.province || "",
			postalCode: mainAddress?.postalCode || "",
		},
	});

	// Actualizar los valores del formulario cuando se carga el perfil
	useEffect(() => {
		if (profile) {
			reset({
				firstName: profile.firstName,
				lastName: profile.lastName,
				email: profile.email,
				phone: profile.phone || "",
				mobilePhone: profile.mobilePhone || "",
				street: mainAddress?.street || "",
				city: mainAddress?.city || "",
				province: mainAddress?.province || "",
				postalCode: mainAddress?.postalCode || "",
			});

			// Filtrar direcciones adicionales (todas excepto la principal)
			if (profile.addresses && profile.addresses.length > 0) {
				const otherAddresses = profile.addresses.filter(
					(addr) => !addr.isMain && addr.id !== mainAddress?.id
				);
				setAdditionalAddresses(otherAddresses);
			}
		}
	}, [profile, mainAddress, reset]);

	// Manejar el envío del formulario
	const onSubmit = async (formData: PersonalInfoFormValues) => {
		setSubmitLoading(true);

		try {
			// Datos personales
			const personalData = {
				firstName: formData.firstName,
				lastName: formData.lastName,
				phone: formData.phone,
				mobilePhone: formData.mobilePhone,
			};

			// Actualizar datos personales
			await updatePersonalInfo(personalData);

			// Actualizar dirección principal si hay cambios
			if (
				mainAddress &&
				(formData.street !== mainAddress.street ||
					formData.city !== mainAddress.city ||
					formData.province !== mainAddress.province ||
					formData.postalCode !== mainAddress.postalCode)
			) {
				const addressData = {
					id: mainAddress.id,
					street: formData.street,
					city: formData.city,
					province: formData.province,
					postalCode: formData.postalCode,
					isMain: true,
				};

				await updateAddress(mainAddress.id, addressData);
			} else if (
				!mainAddress &&
				(formData.street ||
					formData.city ||
					formData.province ||
					formData.postalCode)
			) {
				// Crear nueva dirección principal si no existe
				const addressData = {
					street: formData.street,
					city: formData.city,
					province: formData.province,
					postalCode: formData.postalCode,
					isMain: true,
				};

				await updateAddress(undefined, addressData);
			}

			setIsEditing(false);
			ToastService.success("Información personal actualizada correctamente");
		} catch (error) {
			console.error("Error al actualizar información personal:", error);
			ToastService.error("Error al actualizar la información personal");
		} finally {
			setSubmitLoading(false);
		}
	};

	// Cancelar la edición y restablecer los valores
	const handleCancel = () => {
		reset({
			firstName: profile?.firstName || "",
			lastName: profile?.lastName || "",
			email: profile?.email || "",
			phone: profile?.phone || "",
			mobilePhone: profile?.mobilePhone || "",
			street: mainAddress?.street || "",
			city: mainAddress?.city || "",
			province: mainAddress?.province || "",
			postalCode: mainAddress?.postalCode || "",
		});
		setIsEditing(false);
	};

	if (isLoading && !profile) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
			</div>
		);
	}

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
							disabled={submitLoading}
							className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 flex items-center"
						>
							{submitLoading ? (
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
								disabled={true} // Email no se puede cambiar
								className={`w-full px-4 py-2 rounded-lg border ${
									errors.email
										? "border-red-500 focus:ring-red-500 focus:border-red-500"
										: "border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
								} bg-white dark:bg-gray-700 text-gray-900 dark:text-white opacity-70`}
							/>
							{errors.email && (
								<p className="mt-1 text-sm text-red-600 dark:text-red-400">
									{errors.email.message}
								</p>
							)}
							<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
								Para cambiar tu correo electrónico, contacta a soporte
							</p>
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
							<h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
								Dirección Principal
							</h3>
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

					{/* Mostrar direcciones adicionales en modo edición */}
					{additionalAddresses.length > 0 && (
						<div className="mt-6">
							<h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
								Direcciones Adicionales
							</h3>
							<div className="space-y-4">
								{additionalAddresses.map((address, index) => (
									<div
										key={address.id || index}
										className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
									>
										<p className="text-gray-900 dark:text-white">
											{address.street}
										</p>
										<p className="text-gray-600 dark:text-gray-400">
											{address.city}, {address.province}, {address.postalCode}
										</p>
										<div className="mt-2">
											<button
												type="button"
												className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
												onClick={() => {
													// Implementar edición de dirección adicional
												}}
											>
												Editar
											</button>
											<span className="text-gray-400 mx-2">|</span>
											<button
												type="button"
												className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
												onClick={() => {
													// Implementar eliminación de dirección
												}}
											>
												Eliminar
											</button>
										</div>
									</div>
								))}
							</div>
							<button
								type="button"
								className="mt-4 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center"
								onClick={() => {
									// Implementar agregado de nueva dirección
								}}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 mr-1"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 4v16m8-8H4"
									/>
								</svg>
								Agregar dirección
							</button>
						</div>
					)}
				</form>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
							Nombre
						</h3>
						<p className="mt-1 text-lg text-gray-900 dark:text-white">
							{profile?.firstName}
						</p>
					</div>

					<div>
						<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
							Apellido
						</h3>
						<p className="mt-1 text-lg text-gray-900 dark:text-white">
							{profile?.lastName}
						</p>
					</div>

					<div>
						<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
							Correo Electrónico
						</h3>
						<p className="mt-1 text-lg text-gray-900 dark:text-white">
							{profile?.email}
						</p>
					</div>

					<div>
						<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
							Teléfono
						</h3>
						<p className="mt-1 text-lg text-gray-900 dark:text-white">
							{profile?.phone || "No especificado"}
						</p>
					</div>

					<div>
						<h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
							Teléfono Móvil
						</h3>
						<p className="mt-1 text-lg text-gray-900 dark:text-white">
							{profile?.mobilePhone || "No especificado"}
						</p>
					</div>

					<div className="md:col-span-2">
						<h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
							Dirección Principal
						</h3>
						<div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
							{mainAddress ? (
								<>
									<p className="text-gray-900 dark:text-white">
										{mainAddress.street}
									</p>
									<p className="text-gray-600 dark:text-gray-400">
										{mainAddress.city}, {mainAddress.province},{" "}
										{mainAddress.postalCode}
									</p>
								</>
							) : (
								<p className="text-gray-500 dark:text-gray-400">
									No hay dirección registrada
								</p>
							)}
						</div>
					</div>

					{/* Mostrar direcciones adicionales en modo vista */}
					{additionalAddresses.length > 0 && (
						<div className="md:col-span-2 mt-4">
							<h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
								Direcciones Adicionales
							</h3>
							<div className="space-y-3">
								{additionalAddresses.map((address, index) => (
									<div
										key={address.id || index}
										className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
									>
										<p className="text-gray-900 dark:text-white">
											{(address as UserAddress).street}
										</p>
										<p className="text-gray-600 dark:text-gray-400">
											{(address as UserAddress).city},{" "}
											{(address as UserAddress).province},{" "}
											{(address as UserAddress).postalCode}
										</p>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default PersonalInfoPage;
