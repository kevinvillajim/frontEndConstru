// src/ui/pages/profile/SubscriptionPage.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  CheckIcon,
  CreditCardIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import ToastService from "../../components/common/ToastService";

const SubscriptionPage = () => {
  const { user } = useAuth();
const [currentPlan, setCurrentPlan] = useState<string>("free");
const [nextBillingDate, setNextBillingDate] = useState<Date | null>(null);
const [isLoading, setIsLoading] = useState<boolean>(false);
const [paymentMethod, setPaymentMethod] = useState<{
  type: string;
  last4: string;
  expiryDate: string;
} | null>(null);
const [billingHistory, setBillingHistory] = useState<Array<{
  id: string;
  date: Date;
  amount: number;
  status: "paid" | "pending" | "failed";
  description: string;
}>>([]);

  // Cargar datos de suscripción al montar el componente
  useEffect(() => {
    const loadSubscriptionData = async () => {
      setIsLoading(true);
      try {
        // Aquí iría la llamada al backend para obtener los datos de suscripción
        // const subscriptionData = await subscriptionService.getCurrentSubscription();
        
        // Mock data for demonstration
        setTimeout(() => {
          setCurrentPlan(user?.subscriptionPlan || "free");
          setNextBillingDate(new Date(Date.now() + (30 * 24 * 60 * 60 * 1000))); // 30 días desde ahora
          
          if (currentPlan !== "free") {
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

  // Obtener los detalles del plan
  const getPlanDetails = (planName: string) => {
    switch (planName) {
      case "premium":
        return {
          name: "Premium",
          price: "$25/mes",
          features: [
            "Cálculos técnicos ilimitados",
            "Facturación electrónica",
            "Exportación de informes",
            "Cálculos estructurales completos",
          ],
        };
      case "enterprise":
        return {
          name: "Empresarial",
          price: "$60/mes",
          features: [
            "Todo lo de Premium",
            "Múltiples usuarios",
            "Trabajadores ilimitados",
            "Tablero empresarial",
            "Acceso API",
          ],
        };
      case "free":
      default:
        return {
          name: "Gratuito",
          price: "Gratis",
          features: [
            "Cálculos básicos de área/materiales",
            "Cotizaciones limitadas (3/mes)",
            "Acceso a tienda de materiales",
          ],
        };
    }
  };

  const currentPlanDetails = getPlanDetails(currentPlan);

  // Función para cancelar la suscripción
  const handleCancelSubscription = async () => {
    // TODO: Implementar lógica de cancelación
    if (window.confirm("¿Estás seguro de que deseas cancelar tu suscripción?")) {
      setIsLoading(true);
      
      try {
        // Simular una llamada a la API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        ToastService.success("Tu suscripción ha sido cancelada. Seguirás teniendo acceso hasta el final del período de facturación.");
      } catch (error) {
        console.error("Error al cancelar suscripción:", error);
        ToastService.error("Error al cancelar la suscripción");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
		<div>
			<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
				Suscripción
			</h2>

			{isLoading ? (
				<div className="flex justify-center items-center py-12">
					<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
				</div>
			) : (
				<div className="space-y-8">
					{/* Current Plan Section */}
					<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
						<div className="bg-primary-50 dark:bg-primary-900/30 px-6 py-4">
							<h3 className="text-lg font-medium text-primary-700 dark:text-primary-300">
								Plan Actual: {currentPlanDetails.name}
							</h3>
						</div>
						<div className="px-6 py-4">
							<div className="flex justify-between items-start mb-6">
								<div>
									<p className="text-3xl font-bold text-gray-900 dark:text-white">
										{currentPlanDetails.price}
									</p>
									{nextBillingDate && currentPlan !== "free" && (
										<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
											Próximo cobro el {nextBillingDate.toLocaleDateString()}
										</p>
									)}
								</div>
								{currentPlan !== "free" && (
									<button
										onClick={handleCancelSubscription}
										disabled={isLoading}
										className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
									>
										Cancelar Plan
									</button>
								)}
							</div>

							<h4 className="font-medium text-gray-900 dark:text-white mb-2">
								Características:
							</h4>
							<ul className="space-y-2">
								{currentPlanDetails.features.map((feature, index) => (
									<li key={index} className="flex items-start">
										<CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
										<span className="text-gray-700 dark:text-gray-300">
											{feature}
										</span>
									</li>
								))}
							</ul>

							{currentPlan === "free" && (
								<div className="mt-6">
									<Link
										to="/planes"
										className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
									>
										Actualizar Plan
									</Link>
								</div>
							)}
						</div>
					</div>

					{/* Payment Method Section */}
					{currentPlan !== "free" && (
						<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
							<div className="px-6 py-4">
								<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
									Método de Pago
								</h3>

								{paymentMethod ? (
									<div className="flex items-center justify-between">
										<div className="flex items-center">
											<CreditCardIcon className="h-8 w-8 text-gray-500 dark:text-gray-400 mr-3" />
											<div>
												<p className="font-medium text-gray-900 dark:text-white">
													{paymentMethod.type === "visa"
														? "Visa"
														: paymentMethod.type === "mastercard"
															? "Mastercard"
															: paymentMethod.type}
													•••• {paymentMethod.last4}
												</p>
												<p className="text-sm text-gray-500 dark:text-gray-400">
													Vence: {paymentMethod.expiryDate}
												</p>
											</div>
										</div>
										<button className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
											Actualizar
										</button>
									</div>
								) : (
									<div className="flex items-center text-yellow-600 dark:text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
										<ExclamationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
										<p className="text-sm">
											No hay método de pago registrado. Por favor, añade un
											método de pago.
										</p>
									</div>
								)}
							</div>
						</div>
					)}

					{/* Billing History Section */}
					{currentPlan !== "free" && (
						<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
							<div className="px-6 py-4">
								<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
									Historial de Facturación
								</h3>

								{billingHistory.length > 0 ? (
									<div className="overflow-x-auto">
										<table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
											<thead className="bg-gray-50 dark:bg-gray-700">
												<tr>
													<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
														Fecha
													</th>
													<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
														Descripción
													</th>
													<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
														Monto
													</th>
													<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
														Estado
													</th>
													<th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
														Recibo
													</th>
												</tr>
											</thead>
											<tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
												{billingHistory.map((invoice) => (
													<tr key={invoice.id}>
														<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
															{invoice.date.toLocaleDateString()}
														</td>
														<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
															{invoice.description}
														</td>
														<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
															${invoice.amount}
														</td>
														<td className="px-4 py-3 whitespace-nowrap">
															<span
																className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
																	invoice.status === "paid"
																		? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
																		: invoice.status === "pending"
																			? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
																			: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
																}`}
															>
																{invoice.status === "paid"
																	? "Pagado"
																	: invoice.status === "pending"
																		? "Pendiente"
																		: "Fallido"}
															</span>
														</td>
														<td className="px-4 py-3 whitespace-nowrap text-sm text-right">
															<a
																href="#"
																className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
															>
																Descargar
															</a>
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								) : (
									<p className="text-gray-500 dark:text-gray-400 text-sm">
										No hay historial de facturación disponible.
									</p>
								)}
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default SubscriptionPage;