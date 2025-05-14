import {Link} from "react-router-dom";

const NotFoundPage = () => {
	return (
		<div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
			<div className="text-center">
				<div className="inline-block mb-8">
					<div className="relative">
						<svg
							className="w-40 h-40 text-primary-100"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<circle cx="12" cy="12" r="12"></circle>
						</svg>
						<h1 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl font-bold text-primary-600">
							404
						</h1>
					</div>
				</div>
				<h2 className="text-3xl font-bold text-neutral-900 mb-4">
					Página no encontrada
				</h2>
				<p className="text-xl text-neutral-600 mb-8 max-w-md mx-auto">
					Lo sentimos, la página que estás buscando no existe o ha sido movida.
				</p>
				<div className="flex flex-wrap justify-center gap-4">
					<Link to="/" className="btn-primary px-6 py-3">
						Volver al Inicio
					</Link>
					<Link to="/soporte" className="btn-outline px-6 py-3">
						Contactar Soporte
					</Link>
				</div>
			</div>
		</div>
	);
};

export default NotFoundPage;
