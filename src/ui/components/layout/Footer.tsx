import {Link} from "react-router-dom";
import {
	MapPinIcon,
	EnvelopeIcon,
	PhoneIcon,
	ClockIcon,
	ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import ThemeForced from "../common/ThemeForced";

const Footer = () => {
	return (
		<footer className="relative pt-16 pb-8 overflow-hidden text-white">
			{/* Background with architectural pattern */}
			<div
				className="absolute inset-0 z-0"
				style={{backgroundColor: "#263238"}}
			>
				<div className="absolute inset-0 opacity-15">
					<div className="grid-pattern"></div>
				</div>
				{/* Subtle blueprint line across the top */}
				<div className="absolute top-0 left-0 w-full h-1">
					<div className="h-full bg-gradient-to-r from-transparent via-secondary-500 to-transparent"></div>
				</div>
			</div>

			{/* Architectural decorative elements */}
			<div className="architectural-element absolute left-0 top-0 h-64 w-64 opacity-10"></div>
			<div className="architectural-element absolute right-0 bottom-0 h-64 w-64 opacity-10"></div>

			<div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
					{/* Company Info Column */}
					<div className="space-y-6">
						<div className="footer-logo">
							<h3 className="text-xl font-heading text-white mb-1">
								<span className="text-secondary-500">CONS</span>TRU
							</h3>
							<div className="w-12 h-0.5 bg-secondary-500"></div>
						</div>

						<p className="text-gray-400 leading-relaxed text-sm">
							Plataforma integral para profesionales de la construcción en
							Ecuador que automatiza y optimiza procesos críticos, conectando
							arquitectos, ingenieros y proveedores para resolver desafíos
							fundamentales de la industria.
						</p>
							{/* Newsletter subscription with architectural design */}
							<div className="pt-2">
								<h4 className="text-sm font-semibold text-white mb-3 flex items-center">
									<ClockIcon className="h-4 w-4 mr-2 text-secondary-500" />
									Actualizaciones Semanales
								</h4>
								<div className="flex">
									<input
										type="email"
										placeholder="Tu email profesional"
										className="bg-primary-800 text-sm border-0 rounded-l-md focus:outline-none focus:ring-1 focus:ring-secondary-500 px-4 py-2 text-white placeholder-gray-500 flex-1"
									/>
									<button className="bg-secondary-500 hover:bg-secondary-600 text-gray-900 px-3 py-2 rounded-r-md transition-colors duration-300 focus:outline-none">
										<ArrowTopRightOnSquareIcon className="h-4 w-4 text-black bg-none" />
									</button>
								</div>
							</div>
						{/* Social Media Icons */}
						<ThemeForced forceTheme="light">
							<div className="flex space-x-4">
								<a
									href="#"
									className="text-gray-400 hover:text-secondary-500 transition-colors duration-300 transform hover:scale-110"
									aria-label="Facebook"
								>
									<svg
										className="h-5 w-5"
										fill="var(--color-gray-400)"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path
											fillRule="evenodd"
											d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
											clipRule="evenodd"
										/>
									</svg>
								</a>
								<a
									href="#"
									className="text-gray-400 hover:text-secondary-500 transition-colors duration-300 transform hover:scale-110"
									aria-label="Twitter"
								>
									<svg
										className="h-5 w-5"
										fill="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
									</svg>
								</a>
								<a
									href="#"
									className="text-gray-400 hover:text-secondary-500 transition-colors duration-300 transform hover:scale-110"
									aria-label="Instagram"
								>
									<svg
										className="h-5 w-5"
										fill="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path
											fillRule="evenodd"
											d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
											clipRule="evenodd"
										/>
									</svg>
								</a>
							</div>
						</ThemeForced>
					</div>

					{/* Platform Links Column */}
					<div>
						<h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 relative inline-block">
							Plataforma
							<span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-secondary-500"></span>
						</h3>
						<ul className="space-y-3">
							<li>
								<Link
									to="/calculadoras"
									className="text-gray-400 hover:text-secondary-400 transition-all duration-300 flex items-center text-sm group"
								>
									<div className="w-1.5 h-1.5 rounded-full bg-secondary-500 opacity-0 group-hover:opacity-100 mr-2 transition-opacity"></div>
									<span className="group-hover:translate-x-1 transition-transform duration-300">
										Calculadoras
									</span>
								</Link>
							</li>
							<li>
								<Link
									to="/materiales"
									className="text-gray-400 hover:text-secondary-400 transition-all duration-300 flex items-center text-sm group"
								>
									<div className="w-1.5 h-1.5 rounded-full bg-secondary-500 opacity-0 group-hover:opacity-100 mr-2 transition-opacity"></div>
									<span className="group-hover:translate-x-1 transition-transform duration-300">
										Materiales
									</span>
								</Link>
							</li>
							<li>
								<Link
									to="/proyectos"
									className="text-gray-400 hover:text-secondary-400 transition-all duration-300 flex items-center text-sm group"
								>
									<div className="w-1.5 h-1.5 rounded-full bg-secondary-500 opacity-0 group-hover:opacity-100 mr-2 transition-opacity"></div>
									<span className="group-hover:translate-x-1 transition-transform duration-300">
										Proyectos
									</span>
								</Link>
							</li>
							<li>
								<Link
									to="/presupuestos"
									className="text-gray-400 hover:text-secondary-400 transition-all duration-300 flex items-center text-sm group"
								>
									<div className="w-1.5 h-1.5 rounded-full bg-secondary-500 opacity-0 group-hover:opacity-100 mr-2 transition-opacity"></div>
									<span className="group-hover:translate-x-1 transition-transform duration-300">
										Presupuestos
									</span>
								</Link>
							</li>
							<li>
								<Link
									to="/normativas"
									className="text-gray-400 hover:text-secondary-400 transition-all duration-300 flex items-center text-sm group"
								>
									<div className="w-1.5 h-1.5 rounded-full bg-secondary-500 opacity-0 group-hover:opacity-100 mr-2 transition-opacity"></div>
									<span className="group-hover:translate-x-1 transition-transform duration-300">
										Normativas NEC
									</span>
								</Link>
							</li>
						</ul>
					</div>

					{/* Resources Column */}
					<div>
						<h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 relative inline-block">
							Recursos
							<span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-secondary-500"></span>
						</h3>
						<ul className="space-y-3">
							<li>
								<Link
									to="/blog"
									className="text-gray-400 hover:text-secondary-400 transition-all duration-300 flex items-center text-sm group"
								>
									<div className="w-1.5 h-1.5 rounded-full bg-secondary-500 opacity-0 group-hover:opacity-100 mr-2 transition-opacity"></div>
									<span className="group-hover:translate-x-1 transition-transform duration-300">
										Blog
									</span>
								</Link>
							</li>
							<li>
								<Link
									to="/guias"
									className="text-gray-400 hover:text-secondary-400 transition-all duration-300 flex items-center text-sm group"
								>
									<div className="w-1.5 h-1.5 rounded-full bg-secondary-500 opacity-0 group-hover:opacity-100 mr-2 transition-opacity"></div>
									<span className="group-hover:translate-x-1 transition-transform duration-300">
										Guías y Tutoriales
									</span>
								</Link>
							</li>
							<li>
								<Link
									to="/faq"
									className="text-gray-400 hover:text-secondary-400 transition-all duration-300 flex items-center text-sm group"
								>
									<div className="w-1.5 h-1.5 rounded-full bg-secondary-500 opacity-0 group-hover:opacity-100 mr-2 transition-opacity"></div>
									<span className="group-hover:translate-x-1 transition-transform duration-300">
										Preguntas Frecuentes
									</span>
								</Link>
							</li>
							<li>
								<Link
									to="/soporte"
									className="text-gray-400 hover:text-secondary-400 transition-all duration-300 flex items-center text-sm group"
								>
									<div className="w-1.5 h-1.5 rounded-full bg-secondary-500 opacity-0 group-hover:opacity-100 mr-2 transition-opacity"></div>
									<span className="group-hover:translate-x-1 transition-transform duration-300">
										Soporte Técnico
									</span>
								</Link>
							</li>
						</ul>
					</div>

					{/* Contact Column */}
					<div>
						<h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 relative inline-block">
							Contacto
							<span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-secondary-500"></span>
						</h3>
						<ul className="space-y-4 text-gray-400">
							<li className="flex items-start group hover:text-secondary-400 transition-colors duration-300">
								<MapPinIcon className="h-5 w-5 mr-3 text-secondary-500 flex-shrink-0 group-hover:animate-bounce" />
								<span className="text-sm">
									Quito, Ecuador <br />
									Gil R. Dávalos y Av. Amazonas
									<br />
									Edificio Centro Amazonas - #402
								</span>
							</li>
							<li className="flex items-center group hover:text-secondary-400 transition-colors duration-300">
								<EnvelopeIcon className="h-5 w-5 mr-3 text-secondary-500 flex-shrink-0" />
								<span className="text-sm group-hover:translate-x-1 transition-transform duration-300">
									info@constru.ec
								</span>
							</li>
							<li className="flex items-center group hover:text-secondary-400 transition-colors duration-300">
								<PhoneIcon className="h-5 w-5 mr-3 text-secondary-500 flex-shrink-0" />
								<span className="text-sm group-hover:translate-x-1 transition-transform duration-300">
									+593 9-8765-4321
								</span>
							</li>
							<li className="flex items-center group hover:text-secondary-400 transition-colors duration-300">
								<ClockIcon className="h-5 w-5 mr-3 text-secondary-500 flex-shrink-0" />
								<span className="text-sm group-hover:translate-x-1 transition-transform duration-300">
									Lun - Vie: 8:00 AM - 6:00 PM
								</span>
							</li>
						</ul>
					</div>
				</div>

				{/* Architectural separator */}
				<div className="relative h-px my-8 overflow-visible">
					<div className="absolute inset-0 flex items-center">
						<div className="w-full border-t border-gray-800"></div>
					</div>
					<div className="relative flex justify-center">
						<div className="bg-secondary-500 text-gray-900 px-3 py-1 text-xs uppercase tracking-wider rounded">
							CONSTRU
						</div>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="flex flex-col md:flex-row justify-between items-center">
					<p className="text-gray-500 text-sm">
						&copy; {new Date().getFullYear()} CONSTRU. Todos los derechos
						reservados.
					</p>
					<div className="mt-4 md:mt-0 flex space-x-6">
						<Link
							to="/privacidad"
							className="text-gray-500 hover:text-secondary-400 text-sm transition-colors"
						>
							Política de Privacidad
						</Link>
						<Link
							to="/terminos"
							className="text-gray-500 hover:text-secondary-400 text-sm transition-colors"
						>
							Términos de Servicio
						</Link>
					</div>
				</div>
			</div>

			{/* CSS for architectural elements */}
			<style>{`
				.grid-pattern {
					background-image:
						linear-gradient(to right, #607d8b 1px, transparent 1px),
						linear-gradient(to bottom, #607d8b 1px, transparent 1px);
					background-size: 30px 30px;
					width: 100%;
					height: 100%;
				}

				.architectural-element {
					background-image: radial-gradient(
						circle,
						#78909c 1px,
						transparent 1px
					);
					background-size: 20px 20px;
				}

				.footer-logo {
					position: relative;
					display: inline-block;
				}

				@keyframes bounce {
					0%,
					100% {
						transform: translateY(0);
					}
					50% {
						transform: translateY(-5px);
					}
				}

				.group:hover .group-hover\\:animate-bounce {
					animation: bounce 1s infinite;
				}
			`}</style>
		</footer>
	);
};

export default Footer;
