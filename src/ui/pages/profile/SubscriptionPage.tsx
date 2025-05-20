// src/ui/pages/profile/SubscriptionPage.tsx
import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {useAuth} from "../../context/AuthContext";
import {
	CheckIcon,
	XMarkIcon,
	StarIcon,
	CreditCardIcon,
	ExclamationCircleIcon,
	SparklesIcon,
	BoltIcon,
	ShieldCheckIcon,
	UsersIcon,
	ChartBarIcon,
	CogIcon,
} from "@heroicons/react/24/outline";
import {
	CheckIcon as CheckIconSolid,
	StarIcon as StarIconSolid,
} from "@heroicons/react/24/solid";
import ToastService from "../../components/common/ToastService";

const SubscriptionPage = () => {
	const {user} = useAuth();
	const [currentPlan, setCurrentPlan] = useState<string>("free");
	const [nextBillingDate, setNextBillingDate] = useState<Date | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [selectedPlan, setSelectedPlan] = useState<string>(currentPlan);
	const [showBillingHistory, setShowBillingHistory] = useState<boolean>(false);
	const [paymentMethod, setPaymentMethod] = useState<{
		type: string;
		last4: string;
		expiryDate: string;
	} | null>(null);
	const [billingHistory, setBillingHistory] = useState<
		Array<{
			id: string;
			date: Date;
			amount: number;
			status: "paid" | "pending" | "failed";
			description: string;
		}>
	>([]);

	// Definición de planes con información completa
	const plans = [
		{
			id: "free",
			name: "Gratuito",
			description: "Perfecto para profesionales que están empezando",
			price: 0,
			priceText: "Gratis",
			period: "para siempre",
			icon: ShieldCheckIcon,
			color: "gray",
			features: [
				"Cálculos básicos de área/materiales",
				"Cotizaciones limitadas (3/mes)",
				"Acceso a tienda de materiales",
				"Soporte por email",
			],
			limitations: [
				"Sin cálculos estructurales",
				"Sin facturación electrónica",
				"Exportación limitada",
			],
			buttonText: "Plan Actual",
			popular: false,
		},
		{
			id: "premium",
			name: "Premium",
			description: "La mejor opción para profesionales independientes",
			price: 25,
			priceText: "$25",
			period: "por mes",
			icon: BoltIcon,
			color: "blue",
			features: [
				"Cálculos técnicos ilimitados",
				"Facturación electrónica con SRI",
				"Exportación de informes completos",
				"Cálculos estructurales (NEC Ecuador)",
				"Sincronización contable",
				"Plantillas personalizadas",
				"Soporte prioritario",
				"Backup automático",
			],
			limitations: [],
			buttonText: "Actualizar a Premium",
			popular: true,
			savings: "¡Ahorra $75 vs plan mensual!",
		},
		{
			id: "enterprise",
			name: "Empresarial",
			description: "Solución completa para empresas constructoras",
			price: 60,
			priceText: "$60",
			period: "por mes",
			icon: UsersIcon,
			color: "purple",
			features: [
				"Todo lo incluido en Premium",
				"Usuarios múltiples (hasta 10)",
				"Trabajadores ilimitados",
				"Tablero empresarial con KPIs",
				"API para integraciones",
				"Reportes avanzados con BI",
				"Gestión de proyectos multiusuario",
				"Soporte dedicado 24/7",
				"Capacitación personalizada",
			],
			limitations: [],
			buttonText: "Actualizar a Empresarial",
			popular: false,
			enterprise: true,
		},
	];

	// Cargar datos de suscripción al montar el componente
	useEffect(() => {
		const loadSubscriptionData = async () => {
			setIsLoading(true);
			try {
				// Mock data - En producción esto vendría del backend
				setTimeout(() => {
					const userPlan = user?.subscriptionPlan || "free";
					setCurrentPlan(userPlan);
					setSelectedPlan(userPlan);
					setNextBillingDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));

					if (userPlan !== "free") {
						setPaymentMethod({
							type: "visa",
							last4: "4242",
							expiryDate: "12/25",
						});

						setBillingHistory([
							{
								id: "inv_123456",
								date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
								amount: 25,
								status: "paid",
								description: "Plan Premium - Mensual",
							},
							{
								id: "inv_123455",
								date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
								amount: 25,
								status: "paid",
								description: "Plan Premium - Mensual",
							},
						]);
					}

					setIsLoading(false);
				}, 1000);
			} catch (error) {
				console.error("Error al cargar datos de suscripción:", error);
				ToastService.error("Error al cargar datos de suscripción");
				setIsLoading(false);
			}
		};

		loadSubscriptionData();
	}, [user]);

	const handlePlanChange = async (planId: string) => {
		if (planId === currentPlan) return;

		setIsLoading(true);
		try {
			// Aquí iría la lógica de cambio de plan
			await new Promise((resolve) => setTimeout(resolve, 1500));

			setCurrentPlan(planId);
			setSelectedPlan(planId);
			ToastService.success(
				`¡Plan actualizado exitosamente a ${plans.find((p) => p.id === planId)?.name}!`
			);
		} catch (error) {
			console.error("Error al cambiar plan:", error);
			ToastService.error("Error al cambiar el plan");
		} finally {
			setIsLoading(false);
		}
	};

	const handleCancelSubscription = async () => {
		if (
			window.confirm("¿Estás seguro de que deseas cancelar tu suscripción?")
		) {
			setIsLoading(true);
			try {
				await new Promise((resolve) => setTimeout(resolve, 1000));
				ToastService.success(
					"Tu suscripción ha sido cancelada. Seguirás teniendo acceso hasta el final del período de facturación."
				);
			} catch (error) {
				console.error("Error al cancelar suscripción:", error);
				ToastService.error("Error al cancelar la suscripción");
			} finally {
				setIsLoading(false);
			}
		}
	};

	if (isLoading) {
		return (
			<div className="flex justify-center items-center py-24">
				<div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto">
			{/* Header Section */}
			<div className="text-center mb-12">
				<h1 className="text-4xl font-bold text-gray-900 mb-4">
					Potencia tu trabajo con CONSTRU
				</h1>
				<p className="text-xl text-gray-600 max-w-3xl mx-auto">
					Elige el plan perfecto para acelerar tus proyectos de construcción.
					Todos los planes incluyen acceso completo al marketplace de
					materiales.
				</p>

				{currentPlan !== "free" && (
					<div className="mt-6 inline-flex items-center bg-green-50 px-4 py-2 rounded-full">
						<CheckIconSolid className="h-5 w-5 text-green-500 mr-2" />
						<span className="text-green-800 font-medium">
							Plan actual: {plans.find((p) => p.id === currentPlan)?.name}
						</span>
					</div>
				)}
			</div>

			{/* Plans Grid */}
			<div className="grid md:grid-cols-3 gap-8 mb-12">
				{plans.map((plan) => {
					const Icon = plan.icon;
					const isCurrentPlan = plan.id === currentPlan;
					const isPlanSelected = plan.id === selectedPlan;

					return (
						<div
							key={plan.id}
							className={`relative bg-white rounded-2xl border-2 transition-all duration-300 hover:shadow-xl ${
								plan.popular
									? "border-primary-500 shadow-lg scale-105"
									: isPlanSelected
										? "border-primary-300 shadow-md"
										: "border-gray-200 hover:border-gray-300"
							}`}
						>
							{/* Popular Badge */}
							{plan.popular && (
								<div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
									<div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center">
										<StarIconSolid className="h-4 w-4 mr-1" />
										Más Popular
									</div>
								</div>
							)}

							{/* Current Plan Badge */}
							{isCurrentPlan && (
								<div className="absolute -top-4 right-6">
									<div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
										Actual
									</div>
								</div>
							)}

							<div className="p-8">
								{/* Plan Header */}
								<div className="text-center mb-6">
									<div
										className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
											plan.color === "blue"
												? "bg-blue-100 text-blue-600"
												: plan.color === "purple"
													? "bg-purple-100 text-purple-600"
													: "bg-gray-100 text-gray-600"
										}`}
									>
										<Icon className="h-8 w-8" />
									</div>

									<h3 className="text-2xl font-bold text-gray-900 mb-2">
										{plan.name}
									</h3>

									<p className="text-gray-600 text-sm mb-4">
										{plan.description}
									</p>

									<div className="mb-2">
										<span className="text-4xl font-bold text-gray-900">
											{plan.priceText}
										</span>
										<span className="text-gray-500 ml-2">{plan.period}</span>
									</div>

									{plan.savings && (
										<p className="text-green-600 font-medium text-sm">
											{plan.savings}
										</p>
									)}
								</div>

								{/* Features List */}
								<div className="space-y-3 mb-8">
									{plan.features.map((feature, index) => (
										<div key={index} className="flex items-start">
											<CheckIconSolid className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
											<span className="text-gray-700 text-sm">{feature}</span>
										</div>
									))}

									{plan.limitations.map((limitation, index) => (
										<div key={index} className="flex items-start opacity-60">
											<XMarkIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
											<span className="text-gray-500 text-sm line-through">
												{limitation}
											</span>
										</div>
									))}
								</div>

								{/* Action Button */}
								<button
									onClick={() => !isCurrentPlan && handlePlanChange(plan.id)}
									disabled={isCurrentPlan || isLoading}
									className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
										isCurrentPlan
											? "bg-gray-100 text-gray-500 cursor-not-allowed"
											: plan.popular
												? "bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1"
												: plan.enterprise
													? "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1"
													: "bg-gray-800 hover:bg-gray-900 text-white"
									}`}
								>
									{isCurrentPlan ? "Plan Actual" : plan.buttonText}
								</button>

								{plan.enterprise && (
									<p className="text-center text-gray-500 text-xs mt-3">
										Incluye configuración personalizada
									</p>
								)}
							</div>
						</div>
					);
				})}
			</div>

			{/* Features Comparison Table */}
			<div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-12">
				<div className="bg-gray-50 px-8 py-6">
					<h3 className="text-2xl font-bold text-gray-900 text-center">
						Comparación Detallada de Características
					</h3>
				</div>

				<div className="overflow-x-auto">
					<table className="min-w-full">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
									Características
								</th>
								{plans.map((plan) => (
									<th
										key={plan.id}
										className="px-6 py-4 text-center text-sm font-semibold text-gray-900"
									>
										{plan.name}
									</th>
								))}
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200">
							{[
								{
									feature: "Cálculos básicos",
									free: true,
									premium: true,
									enterprise: true,
								},
								{
									feature: "Cotizaciones por mes",
									free: "3",
									premium: "Ilimitadas",
									enterprise: "Ilimitadas",
								},
								{
									feature: "Facturación electrónica",
									free: false,
									premium: true,
									enterprise: true,
								},
								{
									feature: "Cálculos estructurales (NEC)",
									free: false,
									premium: true,
									enterprise: true,
								},
								{
									feature: "Reportes avanzados",
									free: false,
									premium: true,
									enterprise: true,
								},
								{
									feature: "Usuarios múltiples",
									free: "1",
									premium: "1",
									enterprise: "Hasta 10",
								},
								{
									feature: "Trabajadores",
									free: "No",
									premium: "Limitado",
									enterprise: "Ilimitados",
								},
								{
									feature: "API Access",
									free: false,
									premium: false,
									enterprise: true,
								},
								{
									feature: "Soporte",
									free: "Email",
									premium: "Prioritario",
									enterprise: "Dedicado 24/7",
								},
							].map((row, index) => (
								<tr key={index} className="hover:bg-gray-50">
									<td className="px-6 py-4 text-sm font-medium text-gray-900">
										{row.feature}
									</td>
									<td className="px-6 py-4 text-center">
										{typeof row.free === "boolean" ? (
											row.free ? (
												<CheckIconSolid className="h-5 w-5 text-green-500 mx-auto" />
											) : (
												<XMarkIcon className="h-5 w-5 text-gray-400 mx-auto" />
											)
										) : (
											<span className="text-sm text-gray-700">{row.free}</span>
										)}
									</td>
									<td className="px-6 py-4 text-center">
										{typeof row.premium === "boolean" ? (
											row.premium ? (
												<CheckIconSolid className="h-5 w-5 text-green-500 mx-auto" />
											) : (
												<XMarkIcon className="h-5 w-5 text-gray-400 mx-auto" />
											)
										) : (
											<span className="text-sm text-gray-700">
												{row.premium}
											</span>
										)}
									</td>
									<td className="px-6 py-4 text-center">
										{typeof row.enterprise === "boolean" ? (
											row.enterprise ? (
												<CheckIconSolid className="h-5 w-5 text-green-500 mx-auto" />
											) : (
												<XMarkIcon className="h-5 w-5 text-gray-400 mx-auto" />
											)
										) : (
											<span className="text-sm text-gray-700">
												{row.enterprise}
											</span>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Stats and Social Proof */}
			<div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl p-8 mb-12">
				<div className="text-center mb-8">
					<h3 className="text-2xl font-bold text-gray-900 mb-4">
						Únete a miles de profesionales que ya confían en CONSTRU
					</h3>
				</div>

				<div className="grid md:grid-cols-4 gap-6 text-center">
					<div>
						<div className="text-3xl font-bold text-primary-600 mb-2">500+</div>
						<div className="text-gray-600">Usuarios activos</div>
					</div>
					<div>
						<div className="text-3xl font-bold text-primary-600 mb-2">$2M+</div>
						<div className="text-gray-600">En proyectos gestionados</div>
					</div>
					<div>
						<div className="text-3xl font-bold text-primary-600 mb-2">98%</div>
						<div className="text-gray-600">Tasa de satisfacción</div>
					</div>
					<div>
						<div className="text-3xl font-bold text-primary-600 mb-2">24/7</div>
						<div className="text-gray-600">Soporte disponible</div>
					</div>
				</div>
			</div>

			{/* Current Subscription Details (for paid plans) */}
			{currentPlan !== "free" && (
				<div className="grid md:grid-cols-2 gap-8 mb-12">
					{/* Payment Method */}
					<div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
						<div className="bg-gray-50 px-6 py-4">
							<h3 className="text-lg font-semibold text-gray-900">
								Método de Pago
							</h3>
						</div>
						<div className="p-6">
							{paymentMethod ? (
								<div className="flex items-center justify-between">
									<div className="flex items-center">
										<CreditCardIcon className="h-10 w-10 text-gray-500 mr-4" />
										<div>
											<p className="font-semibold text-gray-900">
												{paymentMethod.type.toUpperCase()} ••••{" "}
												{paymentMethod.last4}
											</p>
											<p className="text-sm text-gray-500">
												Vence: {paymentMethod.expiryDate}
											</p>
										</div>
									</div>
									<button className="text-primary-600 hover:text-primary-700 font-medium">
										Actualizar
									</button>
								</div>
							) : (
								<div className="flex items-center text-amber-600 bg-amber-50 p-4 rounded-xl">
									<ExclamationCircleIcon className="h-6 w-6 mr-3 flex-shrink-0" />
									<div>
										<p className="font-medium">Método de pago requerido</p>
										<p className="text-sm">
											Añade un método de pago para continuar.
										</p>
									</div>
								</div>
							)}
						</div>
					</div>

					{/* Next Billing */}
					<div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
						<div className="bg-gray-50 px-6 py-4">
							<h3 className="text-lg font-semibold text-gray-900">
								Próxima Facturación
							</h3>
						</div>
						<div className="p-6">
							<div className="text-center">
								<div className="text-3xl font-bold text-gray-900 mb-2">
									${plans.find((p) => p.id === currentPlan)?.price}
								</div>
								<p className="text-gray-600 mb-4">
									{nextBillingDate?.toLocaleDateString("es-ES", {
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
								</p>
								<button
									onClick={handleCancelSubscription}
									className="text-red-600 hover:text-red-700 font-medium text-sm"
								>
									Cancelar suscripción
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Billing History (for paid plans) */}
			{currentPlan !== "free" && billingHistory.length > 0 && (
				<div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
					<div
						className="bg-gray-50 px-6 py-4 cursor-pointer flex items-center justify-between"
						onClick={() => setShowBillingHistory(!showBillingHistory)}
					>
						<h3 className="text-lg font-semibold text-gray-900">
							Historial de Facturación
						</h3>
						<ChartBarIcon
							className={`h-5 w-5 text-gray-500 transition-transform ${showBillingHistory ? "rotate-180" : ""}`}
						/>
					</div>

					{showBillingHistory && (
						<div className="p-6">
							<div className="overflow-hidden">
								<table className="min-w-full">
									<thead className="bg-gray-50">
										<tr>
											<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
												Fecha
											</th>
											<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
												Descripción
											</th>
											<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
												Monto
											</th>
											<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
												Estado
											</th>
											<th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
												Recibo
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-200">
										{billingHistory.map((invoice) => (
											<tr key={invoice.id} className="hover:bg-gray-50">
												<td className="px-4 py-4 text-sm text-gray-900">
													{invoice.date.toLocaleDateString()}
												</td>
												<td className="px-4 py-4 text-sm text-gray-900">
													{invoice.description}
												</td>
												<td className="px-4 py-4 text-sm font-semibold text-gray-900">
													${invoice.amount}
												</td>
												<td className="px-4 py-4">
													<span
														className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
															invoice.status === "paid"
																? "bg-green-100 text-green-800"
																: invoice.status === "pending"
																	? "bg-yellow-100 text-yellow-800"
																	: "bg-red-100 text-red-800"
														}`}
													>
														{invoice.status === "paid"
															? "Pagado"
															: invoice.status === "pending"
																? "Pendiente"
																: "Fallido"}
													</span>
												</td>
												<td className="px-4 py-4 text-right">
													<a
														href="#"
														className="text-primary-600 hover:text-primary-700 font-medium text-sm"
													>
														Descargar PDF
													</a>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)}
				</div>
			)}

			{/* FAQ Section */}
			<div className="mt-16 text-center">
				<h3 className="text-2xl font-bold text-gray-900 mb-4">
					¿Tienes preguntas?
				</h3>
				<p className="text-gray-600 mb-6">
					Nuestro equipo está aquí para ayudarte a elegir el plan perfecto para
					tu negocio.
				</p>
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<a
						href="mailto:soporte@constru.app"
						className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-xl text-gray-700 bg-white hover:bg-gray-50 font-medium"
					>
						Contactar Soporte
					</a>
					<Link
						to="/demo"
						className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium"
					>
						Solicitar Demo
					</Link>
				</div>
			</div>
		</div>
	);
};

export default SubscriptionPage;
