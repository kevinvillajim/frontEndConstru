// src/ui/components/layout/Header.tsx
import {useState, useEffect, useRef} from "react";
import {Link} from "react-router-dom";
import {
	Bars3Icon,
	XMarkIcon,
	ChevronDownIcon,
	CalculatorIcon,
	CubeIcon,
	DocumentTextIcon,
	HomeIcon,
	UserGroupIcon,
	ShieldCheckIcon,
	AcademicCapIcon,
} from "@heroicons/react/24/outline";
import ThemeToggle from "./ThemeToggle";

// Define navigation items with submenu support
const navigationItems = [
	{name: "Inicio", to: "/", icon: HomeIcon},
	{
		name: "Calculadoras",
		to: "/calculadoras",
		icon: CalculatorIcon,
		submenu: [
			{name: "Cálculos Estructurales", to: "/calculadoras/estructurales"},
			{name: "Estimación de Materiales", to: "/calculadoras/materiales"},
			{name: "Presupuestos", to: "/calculadoras/presupuestos"},
			{name: "Cronogramas", to: "/calculadoras/cronogramas"},
		],
	},
	{
		name: "Materiales",
		to: "/materiales",
		icon: CubeIcon,
		submenu: [
			{name: "Catálogo", to: "/materiales/catalogo"},
			{name: "Comparativa de Precios", to: "/materiales/comparativa"},
			{name: "Proveedores", to: "/materiales/proveedores"},
		],
	},
	{
		name: "Proyectos",
		to: "/proyectos",
		icon: DocumentTextIcon,
		submenu: [
			{name: "Mis Proyectos", to: "/proyectos/mis-proyectos"},
			{name: "Crear Proyecto", to: "/proyectos/crear"},
			{name: "Plantillas", to: "/proyectos/plantillas"},
		],
	},
	{
		name: "Recursos",
		to: "/recursos",
		icon: AcademicCapIcon,
		submenu: [
			{name: "Blog", to: "/recursos/blog"},
			{name: "Guías y Tutoriales", to: "/recursos/guias"},
			{name: "Normativa NEC", to: "/recursos/normativa"},
		],
	},
];

const Header = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);
	const [isScrolled, setIsScrolled] = useState(false);
	const submenuRefs = useRef<Array<HTMLDivElement | null>>([]);

	// Handle scroll effect
	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 20) {
				setIsScrolled(true);
			} else {
				setIsScrolled(false);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Handle click outside submenu to close it
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (activeSubmenu !== null) {
				const activeRef = submenuRefs.current[activeSubmenu];
				if (activeRef && !activeRef.contains(event.target as Node)) {
					setActiveSubmenu(null);
				}
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [activeSubmenu]);

	const toggleSubmenu = (index: number) => {
		setActiveSubmenu(activeSubmenu === index ? null : index);
	};

	return (
		<header
			className={`border-b sticky top-0 z-50 transition-all duration-300 ${
				isScrolled ? "shadow-md" : ""
			}`}
			style={{
				backgroundColor: "var(--color-primary-25)",
				borderColor: "var(--border-subtle)",
			}}
		>
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Logo with architectural accent */}
					<div className="flex items-center">
						<Link to="/" className="flex items-center group">
							<div className="relative">
								<span className="font-heading font-bold text-2xl">
									<span className="text-secondary-500">CONS</span>
									<span style={{color: "var(--text-main)"}}>TRU</span>
								</span>
								<div className="absolute -bottom-1 left-0 w-full h-0.5 bg-secondary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
							</div>
							<span
								className="ml-1 text-xs uppercase tracking-widest opacity-70 mt-1"
								style={{color: "var(--text-main)"}}
							>
								Platform
							</span>
						</Link>
					</div>

					{/* Desktop Navigation with animated dropdown menus */}
					<nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
						{navigationItems.map((item, index) => (
							<div
								key={index}
								className="relative group"
								ref={(el) => {
									submenuRefs.current[index] = el;
								}}
							>
								{item.submenu ? (
									<button
										className="flex items-center px-3 py-2 font-medium transition-colors duration-200 hover:text-primary-500 rounded-md group relative"
										style={{color: "var(--text-main)"}}
										onClick={() => toggleSubmenu(index)}
										aria-expanded={activeSubmenu === index}
									>
										<span>{item.name}</span>
										<ChevronDownIcon
											className={`ml-1 h-4 w-4 transition-transform duration-300 ${
												activeSubmenu === index ? "rotate-180" : ""
											}`}
										/>
										<span className="absolute bottom-0 left-3 right-3 h-0.5 bg-secondary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
									</button>
								) : (
									<Link
										to={item.to}
										className="flex items-center px-3 py-2 font-medium transition-colors duration-200 hover:text-primary-500 rounded-md group relative"
										style={{color: "var(--text-main)"}}
									>
										<span>{item.name}</span>
										<span className="absolute bottom-0 left-3 right-3 h-0.5 bg-secondary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
									</Link>
								)}

								{/* Dropdown menu */}
								{item.submenu && activeSubmenu === index && (
									<div
										className="absolute left-0 mt-1 min-w-[230px] origin-top-left rounded-md shadow-lg overflow-hidden z-10 border bg-white"
										style={{
											borderColor: "var(--border-subtle)",
										}}
									>
										<div className="py-1 dropdown-menu-animation">
											{item.submenu.map((subItem, subIndex) => (
												<Link
													key={subIndex}
													to={subItem.to}
													className="flex items-center px-4 py-2 text-sm transition-colors duration-200 hover:text-primary-500 hover:bg-primary-300 group"
													style={{color: "var(--text-main)"}}
													onClick={() => setActiveSubmenu(null)}
												>
													<div className="w-1.5 h-1.5 bg-secondary-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
													<span className="group-hover:translate-x-1 transition-transform duration-300">
														{subItem.name}
													</span>
												</Link>
											))}
										</div>
									</div>
								)}
							</div>
						))}

						<div className="ml-2">
							<ThemeToggle />
						</div>

						<div className="flex space-x-2 ml-2">
							<Link
								to="/login"
								className="btn-outline flex items-center justify-center transition-transform hover:scale-[1.02] duration-300 px-4 py-1.5 text-sm"
							>
								Iniciar Sesión
							</Link>
							<Link
								to="/register"
								className="btn-primary flex items-center justify-center transition-transform hover:scale-[1.02] duration-300 px-4 py-1.5 text-sm"
							>
								Registrarse
							</Link>
						</div>
					</nav>

					{/* Mobile Menu Button */}
					<div className="md:hidden flex items-center space-x-4">
						<ThemeToggle />
						<button
							type="button"
							className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none transition-transform active:scale-90"
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							style={{color: "var(--text-main)"}}
							aria-expanded={isMenuOpen}
						>
							{isMenuOpen ? (
								<XMarkIcon className="h-6 w-6" aria-hidden="true" />
							) : (
								<Bars3Icon className="h-6 w-6" aria-hidden="true" />
							)}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile Menu with animations */}
			{isMenuOpen && (
				<div
					className="md:hidden border-t mobile-menu-animation"
					style={{
						backgroundColor: "var(--bg-card)",
						borderColor: "var(--border-subtle)",
					}}
				>
					<div className="container mx-auto px-4 pt-2 pb-4 space-y-1">
						{navigationItems.map((item, index) => (
							<div
								key={index}
								className="border-b"
								style={{borderColor: "var(--border-subtle)"}}
							>
								{item.submenu ? (
									<div>
										<button
											onClick={() => toggleSubmenu(index)}
											className="flex items-center justify-between w-full px-3 py-2 text-base font-medium"
											style={{color: "var(--text-main)"}}
										>
											<span className="flex items-center">
												{item.icon && <item.icon className="h-5 w-5 mr-2" />}
												{item.name}
											</span>
											<ChevronDownIcon
												className={`h-5 w-5 transition-transform duration-300 ${
													activeSubmenu === index ? "rotate-180" : ""
												}`}
											/>
										</button>

										{/* Mobile submenu */}
										{activeSubmenu === index && (
											<div
												className="pl-10 pb-2 mobile-submenu-animation"
												style={{
													backgroundColor: "var(--bg-elevated)",
												}}
											>
												{item.submenu.map((subItem, subIndex) => (
													<Link
														key={subIndex}
														to={subItem.to}
														className="block px-3 py-2 text-sm font-medium hover:text-primary-500 transition-colors"
														style={{color: "var(--text-secondary)"}}
														onClick={() => setIsMenuOpen(false)}
													>
														{subItem.name}
													</Link>
												))}
											</div>
										)}
									</div>
								) : (
									<Link
										to={item.to}
										className="flex items-center px-3 py-2 text-base font-medium hover:text-primary-500 transition-colors"
										style={{color: "var(--text-main)"}}
										onClick={() => setIsMenuOpen(false)}
									>
										{item.icon && <item.icon className="h-5 w-5 mr-2" />}
										{item.name}
									</Link>
								)}
							</div>
						))}

						<div className="pt-4 flex flex-col space-y-3">
							<Link
								to="/login"
								className="w-full px-4 py-2 text-center rounded-md btn-outline transition-transform active:scale-95 flex items-center justify-center"
								onClick={() => setIsMenuOpen(false)}
							>
								<UserGroupIcon className="h-5 w-5 mr-2" />
								Iniciar Sesión
							</Link>
							<Link
								to="/register"
								className="w-full px-4 py-2 text-center rounded-md btn-primary transition-transform active:scale-95 flex items-center justify-center"
								onClick={() => setIsMenuOpen(false)}
							>
								<ShieldCheckIcon className="h-5 w-5 mr-2" />
								Registrarse
							</Link>
						</div>
					</div>
				</div>
			)}

			{/* CSS Animations */}
			<style>{`
				.dropdown-menu-animation {
					animation: dropdownFadeIn 0.2s ease-out forwards;
				}

				.mobile-menu-animation {
					animation: slideDown 0.3s ease-out forwards;
				}

				.mobile-submenu-animation {
					animation: fadeIn 0.2s ease-out forwards;
				}

				@keyframes dropdownFadeIn {
					from {
						opacity: 0;
						transform: translateY(-10px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				@keyframes slideDown {
					from {
						opacity: 0;
						transform: translateY(-10px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				@keyframes fadeIn {
					from {
						opacity: 0;
					}
					to {
						opacity: 1;
					}
				}
			`}</style>
		</header>
	);
};

export default Header;
