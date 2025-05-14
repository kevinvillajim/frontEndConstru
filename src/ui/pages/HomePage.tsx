import {Link} from "react-router-dom";

const HomePage = () => {
	return (
		<div>
			{/* Hero Section */}
			<section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16 md:py-24">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
						<div>
							<h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
								La plataforma integral para profesionales de la construcción en
								Ecuador
							</h1>
							<p className="text-xl text-primary-100 mb-8">
								Automatiza presupuestos, gestiona materiales y optimiza tus
								proyectos de construcción con nuestras herramientas
								especializadas.
							</p>
							<div className="flex flex-wrap gap-4">
								<Link
									to="/register"
									className="btn bg-white text-primary-600 hover:bg-primary-50 focus:ring-white"
								>
									Empezar Ahora
								</Link>
								<Link
									to="/calculadoras"
									className="btn bg-transparent border border-white text-white hover:bg-primary-600 focus:ring-white"
								>
									Probar Calculadoras
								</Link>
							</div>
						</div>
						<div className="hidden md:block">
							<img
								src="/src/assets/hero-image.svg"
								alt="Plataforma CONSTRU"
								className="w-full h-auto max-h-96"
								onError={(e) => {
									e.currentTarget.src =
										"https://placehold.co/600x400/0066C4/FFFFFF?text=CONSTRU&font=montserrat";
								}}
							/>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-16 bg-white">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-3xl font-bold text-neutral-900 mb-4">
							Soluciones para cada etapa de tu proyecto
						</h2>
						<p className="text-xl text-neutral-600 max-w-3xl mx-auto">
							CONSTRU ofrece herramientas especializadas para arquitectos,
							ingenieros civiles y profesionales de la construcción.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{/* Feature 1 */}
						<div className="card">
							<div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mb-5">
								<svg
									className="w-8 h-8 text-primary-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
									/>
								</svg>
							</div>
							<h3 className="text-xl font-semibold mb-3">Cálculos Técnicos</h3>
							<p className="text-neutral-600 mb-4">
								Calcula áreas, volúmenes y cantidades de materiales con
								precisión siguiendo las regulaciones NEC de Ecuador.
							</p>
							<Link
								to="/calculadoras"
								className="text-primary-500 font-medium hover:text-primary-600 flex items-center"
							>
								Explorar calculadoras
								<svg
									className="w-5 h-5 ml-1"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 5l7 7-7 7"
									/>
								</svg>
							</Link>
						</div>

						{/* Feature 2 */}
						<div className="card">
							<div className="w-14 h-14 bg-secondary-100 rounded-full flex items-center justify-center mb-5">
								<svg
									className="w-8 h-8 text-secondary-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
							<h3 className="text-xl font-semibold mb-3">Presupuestos</h3>
							<p className="text-neutral-600 mb-4">
								Genera presupuestos detallados automáticamente a partir de tus
								cálculos con precios actualizados del mercado.
							</p>
							<Link
								to="/presupuestos"
								className="text-secondary-500 font-medium hover:text-secondary-600 flex items-center"
							>
								Ver presupuestos
								<svg
									className="w-5 h-5 ml-1"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 5l7 7-7 7"
									/>
								</svg>
							</Link>
						</div>

						{/* Feature 3 */}
						<div className="card">
							<div className="w-14 h-14 bg-accent-100 rounded-full flex items-center justify-center mb-5">
								<svg
									className="w-8 h-8 text-accent-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
									/>
								</svg>
							</div>
							<h3 className="text-xl font-semibold mb-3">
								Seguimiento de Progreso
							</h3>
							<p className="text-neutral-600 mb-4">
								Monitorea el avance de tus proyectos en tiempo real con tableros
								visuales y reportes de progreso.
							</p>
							<Link
								to="/proyectos"
								className="text-accent-500 font-medium hover:text-accent-600 flex items-center"
							>
								Gestionar proyectos
								<svg
									className="w-5 h-5 ml-1"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 5l7 7-7 7"
									/>
								</svg>
							</Link>
						</div>

						{/* Feature 4 */}
						<div className="card">
							<div className="w-14 h-14 bg-neutral-100 rounded-full flex items-center justify-center mb-5">
								<svg
									className="w-8 h-8 text-neutral-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
									/>
								</svg>
							</div>
							<h3 className="text-xl font-semibold mb-3">
								Marketplace de Materiales
							</h3>
							<p className="text-neutral-600 mb-4">
								Compara precios entre proveedores y gestiona pedidos de
								materiales directamente desde la plataforma.
							</p>
							<Link
								to="/materiales"
								className="text-neutral-700 font-medium hover:text-neutral-900 flex items-center"
							>
								Explorar materiales
								<svg
									className="w-5 h-5 ml-1"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 5l7 7-7 7"
									/>
								</svg>
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Testimonials Section */}
			<section className="py-16 bg-neutral-50">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-3xl font-bold text-neutral-900 mb-4">
							Lo que dicen nuestros usuarios
						</h2>
						<p className="text-xl text-neutral-600 max-w-3xl mx-auto">
							Profesionales de la construcción en Ecuador confían en CONSTRU
							para optimizar sus proyectos.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{/* Testimonial 1 */}
						<div className="bg-white rounded-lg shadow-card p-6">
							<div className="flex items-center mb-4">
								<div className="text-yellow-400 flex">
									{[...Array(5)].map((_, i) => (
										<svg
											key={i}
											className="w-5 h-5"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
										</svg>
									))}
								</div>
							</div>
							<p className="text-neutral-700 mb-6">
								"CONSTRU ha reducido el tiempo que dedico a hacer presupuestos
								de 3 días a apenas unas horas. Las calculadoras técnicas siguen
								perfectamente las normativas ecuatorianas."
							</p>
							<div className="flex items-center">
								<div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
									MV
								</div>
								<div className="ml-3">
									<h4 className="font-semibold">María Velasco</h4>
									<p className="text-sm text-neutral-500">Arquitecta, Quito</p>
								</div>
							</div>
						</div>

						{/* Testimonial 2 */}
						<div className="bg-white rounded-lg shadow-card p-6">
							<div className="flex items-center mb-4">
								<div className="text-yellow-400 flex">
									{[...Array(5)].map((_, i) => (
										<svg
											key={i}
											className="w-5 h-5"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
										</svg>
									))}
								</div>
							</div>
							<p className="text-neutral-700 mb-6">
								"El seguimiento de proyectos en tiempo real nos ha permitido
								identificar retrasos potenciales antes de que se conviertan en
								problemas. La integración con proveedores es excelente."
							</p>
							<div className="flex items-center">
								<div className="h-10 w-10 rounded-full bg-secondary-100 flex items-center justify-center text-secondary-600 font-bold">
									JM
								</div>
								<div className="ml-3">
									<h4 className="font-semibold">Juan Morales</h4>
									<p className="text-sm text-neutral-500">
										Ingeniero Civil, Guayaquil
									</p>
								</div>
							</div>
						</div>

						{/* Testimonial 3 */}
						<div className="bg-white rounded-lg shadow-card p-6">
							<div className="flex items-center mb-4">
								<div className="text-yellow-400 flex">
									{[...Array(5)].map((_, i) => (
										<svg
											key={i}
											className="w-5 h-5"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
										</svg>
									))}
								</div>
							</div>
							<p className="text-neutral-700 mb-6">
								"La capacidad de comparar precios entre diferentes proveedores
								en tiempo real nos ha ayudado a optimizar nuestros costos.
								Excelente plataforma para profesionales ecuatorianos."
							</p>
							<div className="flex items-center">
								<div className="h-10 w-10 rounded-full bg-accent-100 flex items-center justify-center text-accent-600 font-bold">
									CA
								</div>
								<div className="ml-3">
									<h4 className="font-semibold">Carla Andrade</h4>
									<p className="text-sm text-neutral-500">
										Constructora, Cuenca
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-16 bg-primary-600 text-white">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<h2 className="text-3xl font-bold mb-6">
						¿Listo para optimizar tus proyectos de construcción?
					</h2>
					<p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
						Únete a cientos de profesionales que ya están ahorrando tiempo y
						optimizando costos con CONSTRU.
					</p>
					<div className="flex flex-wrap justify-center gap-4">
						<Link
							to="/register"
							className="btn bg-white text-primary-600 hover:bg-primary-50 focus:ring-white px-6 py-3 text-lg"
						>
							Registrarse Gratis
						</Link>
						<Link
							to="/planes"
							className="btn bg-transparent border border-white text-white hover:bg-primary-700 focus:ring-white px-6 py-3 text-lg"
						>
							Ver Planes
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
};

export default HomePage;
