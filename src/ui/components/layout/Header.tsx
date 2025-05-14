import {useState} from "react";
import {Link} from "react-router-dom";
import {Bars3Icon, XMarkIcon} from "@heroicons/react/24/outline";
import ThemeSwitcher from "./ThemeSwitcher";

const Header = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<header
			className="border-b sticky top-0 z-50"
			style={{
				backgroundColor: "var(--bg-card)",
				borderColor: "var(--border-subtle)",
			}}
		>
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Logo */}
					<div className="flex items-center">
						<Link to="/" className="flex items-center">
							<span className="font-heading font-bold text-2xl text-primary-500">
								CONSTRU
							</span>
						</Link>
					</div>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center space-x-8">
						<Link
							to="/"
							className="font-medium transition-colors duration-200 hover:text-primary-500"
							style={{color: "var(--text-main)"}}
						>
							Inicio
						</Link>
						<Link
							to="/calculadoras"
							className="font-medium transition-colors duration-200 hover:text-primary-500"
							style={{color: "var(--text-main)"}}
						>
							Calculadoras
						</Link>
						<Link
							to="/materiales"
							className="font-medium transition-colors duration-200 hover:text-primary-500"
							style={{color: "var(--text-main)"}}
						>
							Materiales
						</Link>
						<Link
							to="/proyectos"
							className="font-medium transition-colors duration-200 hover:text-primary-500"
							style={{color: "var(--text-main)"}}
						>
							Proyectos
						</Link>
						<ThemeSwitcher />
						<Link to="/login" className="btn-outline">
							Iniciar Sesión
						</Link>
						<Link to="/register" className="btn-primary">
							Registrarse
						</Link>
					</nav>

					{/* Mobile Menu Button */}
					<div className="md:hidden flex items-center space-x-4">
						<ThemeSwitcher />
						<button
							type="button"
							className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none"
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							style={{color: "var(--text-main)"}}
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

			{/* Mobile Menu */}
			{isMenuOpen && (
				<div
					className="md:hidden border-t"
					style={{
						backgroundColor: "var(--bg-card)",
						borderColor: "var(--border-subtle)",
					}}
				>
					<div className="container mx-auto px-4 pt-2 pb-4 space-y-1">
						<Link
							to="/"
							className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
							onClick={() => setIsMenuOpen(false)}
							style={{color: "var(--text-main)"}}
						>
							Inicio
						</Link>
						<Link
							to="/calculadoras"
							className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
							onClick={() => setIsMenuOpen(false)}
							style={{color: "var(--text-main)"}}
						>
							Calculadoras
						</Link>
						<Link
							to="/materiales"
							className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
							onClick={() => setIsMenuOpen(false)}
							style={{color: "var(--text-main)"}}
						>
							Materiales
						</Link>
						<Link
							to="/proyectos"
							className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
							onClick={() => setIsMenuOpen(false)}
							style={{color: "var(--text-main)"}}
						>
							Proyectos
						</Link>
						<div className="pt-4 flex flex-col space-y-3">
							<Link
								to="/login"
								className="w-full px-4 py-2 text-center rounded-md btn-outline"
								onClick={() => setIsMenuOpen(false)}
							>
								Iniciar Sesión
							</Link>
							<Link
								to="/register"
								className="w-full px-4 py-2 text-center rounded-md btn-primary"
								onClick={() => setIsMenuOpen(false)}
							>
								Registrarse
							</Link>
						</div>
					</div>
				</div>
			)}
		</header>
	);
};

export default Header;
