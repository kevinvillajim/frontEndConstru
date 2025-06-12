import {useState, useEffect, useRef} from "react";
import {Link, useNavigate} from "react-router-dom";
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
	UserCircleIcon,
	Cog6ToothIcon,
	BellIcon,
	ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import ThemeToggle from "./ThemeToggle";
import {useAuth} from "../../context/AuthContext";

// Define navigation items with submenu support
const navigationItems = [
	{name: "Inicio", to: "/", icon: HomeIcon},
	{
		name: "Calculadoras",
		to: "/calculations",
		icon: CalculatorIcon,
		submenu: [
			{name: "Cálculos Técnicos", to: "/calculations"},
			{name: "Estimación de Materiales", to: "/calculations/materials"},
			{name: "Presupuestos", to: "/calculations/budget"},
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
		to: "/projects",
		icon: DocumentTextIcon,
		submenu: [
			{name: "Mis Proyectos", to: "/projects/my-projects"},
			{name: "Crear Proyecto", to: "/projects/create-new"},
			{name: "Plantillas", to: "/projects/templates"},
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
	const navigate = useNavigate();
	const {user, isAuthenticated, logout} = useAuth();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);
	const [isScrolled, setIsScrolled] = useState(false);
	const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
	const submenuRefs = useRef<Array<HTMLDivElement | null>>([]);
	const userMenuRef = useRef<HTMLDivElement | null>(null);

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
			// Close navigation submenus when clicking outside
			if (activeSubmenu !== null) {
				const activeRef = submenuRefs.current[activeSubmenu];
				if (activeRef && !activeRef.contains(event.target as Node)) {
					setActiveSubmenu(null);
				}
			}

			// Close user menu when clicking outside
			if (isUserMenuOpen) {
				if (
					userMenuRef.current &&
					!userMenuRef.current.contains(event.target as Node)
				) {
					setIsUserMenuOpen(false);
				}
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [activeSubmenu, isUserMenuOpen]);

	const toggleSubmenu = (index: number) => {
		setActiveSubmenu(activeSubmenu === index ? null : index);
	};

	const toggleUserMenu = () => {
		setIsUserMenuOpen(!isUserMenuOpen);
	};

	const handleLogout = async () => {
		try {
			await logout();
			setIsUserMenuOpen(false);
			navigate("/login");
		} catch (error) {
			console.error("Error al cerrar sesión:", error);
		}
	};

	// Function to get user initials for avatar
	const getUserInitials = () => {
		if (!user) return "U";

		const firstName = user.firstName || "";
		const lastName = user.lastName || "";

		return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
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

						{/* Conditional rendering based on authentication status */}
						<div className="flex space-x-2 ml-2">
							{isAuthenticated ? (
								<div className="relative" ref={userMenuRef}>
									{/* User avatar and menu button */}
									<button
										onClick={toggleUserMenu}
										className="flex items-center space-x-1 px-2 py-1 rounded-md hover:bg-primary-50 transition-colors duration-200"
										aria-expanded={isUserMenuOpen}
									>
										<div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
											{getUserInitials()}
										</div>
										<ChevronDownIcon
											className={`h-4 w-4 transition-transform duration-300 ${
												isUserMenuOpen ? "rotate-180" : ""
											}`}
											style={{color: "var(--text-main)"}}
										/>
									</button>

									{/* User dropdown menu */}
									{isUserMenuOpen && (
										<div
											className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-10 border dropdown-menu-animation"
											style={{
												borderColor: "var(--border-subtle)",
											}}
										>
											{/* User info at top */}
											<div
												className="px-4 py-3 border-b border-gray-100"
												style={{borderColor: "var(--border-subtle)"}}
											>
												<p
													className="text-sm font-medium text-gray-900"
													style={{color: "var(--text-main)"}}
												>
													{user?.firstName} {user?.lastName}
												</p>
												<p
													className="text-xs text-gray-500 truncate"
													style={{color: "var(--text-secondary)"}}
												>
													{user?.email}
												</p>
											</div>

											{/* Menu options */}
											<div className="py-1">
												<Link
													to="/profile"
													className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
													style={{color: "var(--text-main)"}}
													onClick={() => setIsUserMenuOpen(false)}
												>
													<UserCircleIcon className="h-4 w-4 mr-2" />
													Mi Perfil
												</Link>

												<Link
													to="/dashboard"
													className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
													style={{color: "var(--text-main)"}}
													onClick={() => setIsUserMenuOpen(false)}
												>
													<HomeIcon className="h-4 w-4 mr-2" />
													Dashboard
												</Link>

												<Link
													to="/projects/my-projects"
													className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
													style={{color: "var(--text-main)"}}
													onClick={() => setIsUserMenuOpen(false)}
												>
													<DocumentTextIcon className="h-4 w-4 mr-2" />
													Mis Proyectos
												</Link>

												<Link
													to="/notifications"
													className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
													style={{color: "var(--text-main)"}}
													onClick={() => setIsUserMenuOpen(false)}
												>
													<BellIcon className="h-4 w-4 mr-2" />
													Notificaciones
												</Link>

												<Link
													to="/account/settings"
													className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
													style={{color: "var(--text-main)"}}
													onClick={() => setIsUserMenuOpen(false)}
												>
													<Cog6ToothIcon className="h-4 w-4 mr-2" />
													Configuración
												</Link>

												<hr
													className="my-1 border-gray-100"
													style={{borderColor: "var(--border-subtle)"}}
												/>

												{/* Logout button */}
												<button
													onClick={handleLogout}
													className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
												>
													<ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
													Cerrar Sesión
												</button>
											</div>
										</div>
									)}
								</div>
							) : (
								<>
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
								</>
							)}
						</div>
					</nav>

					{/* Mobile Menu Button */}
					<div className="md:hidden flex items-center space-x-4">
						<ThemeToggle />

						{/* If authenticated, show user avatar in mobile view */}
						{isAuthenticated && (
							<button
								onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
								className="flex items-center"
							>
								<div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
									{getUserInitials()}
								</div>
							</button>
						)}

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

						{/* User account options in mobile menu */}
						{isAuthenticated ? (
							<div className="pt-4 space-y-2">
								<div
									className="px-3 py-2 border-b"
									style={{borderColor: "var(--border-subtle)"}}
								>
									<div className="flex items-center mb-2">
										<div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold mr-3">
											{getUserInitials()}
										</div>
										<div>
											<p
												className="font-medium"
												style={{color: "var(--text-main)"}}
											>
												{user?.firstName} {user?.lastName}
											</p>
											<p
												className="text-xs text-gray-500 truncate"
												style={{color: "var(--text-secondary)"}}
											>
												{user?.email}
											</p>
										</div>
									</div>
								</div>

								<Link
									to="/profile"
									className="flex items-center px-3 py-2 text-base font-medium hover:text-primary-500 transition-colors"
									style={{color: "var(--text-main)"}}
									onClick={() => setIsMenuOpen(false)}
								>
									<UserCircleIcon className="h-5 w-5 mr-2" />
									Mi Perfil
								</Link>

								<Link
									to="/dashboard"
									className="flex items-center px-3 py-2 text-base font-medium hover:text-primary-500 transition-colors"
									style={{color: "var(--text-main)"}}
									onClick={() => setIsMenuOpen(false)}
								>
									<HomeIcon className="h-5 w-5 mr-2" />
									Dashboard
								</Link>

								<Link
									to="/proyectos/mis-proyectos"
									className="flex items-center px-3 py-2 text-base font-medium hover:text-primary-500 transition-colors"
									style={{color: "var(--text-main)"}}
									onClick={() => setIsMenuOpen(false)}
								>
									<DocumentTextIcon className="h-5 w-5 mr-2" />
									Mis Proyectos
								</Link>

								<Link
									to="/account/settings"
									className="flex items-center px-3 py-2 text-base font-medium hover:text-primary-500 transition-colors"
									style={{color: "var(--text-main)"}}
									onClick={() => setIsMenuOpen(false)}
								>
									<Cog6ToothIcon className="h-5 w-5 mr-2" />
									Configuración
								</Link>

								<button
									onClick={handleLogout}
									className="w-full flex items-center px-3 py-2 text-base font-medium text-red-600 hover:text-red-700 transition-colors"
								>
									<ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
									Cerrar Sesión
								</button>
							</div>
						) : (
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
						)}
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
