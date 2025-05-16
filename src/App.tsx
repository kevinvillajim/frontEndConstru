import React, {Suspense} from "react";
import {useRoutes} from "react-router-dom";
import appRoutes from "./ui/routes/AppRoute";
import AuthProvider from "./ui/context/AuthContext";
import "./App.css";
import "./core/adapters/api/AxiosConfig";
import ApiDebugger from "./ui/components/debug/ApiDebugger";

const LoadingFallback = () => (
	<div className="flex items-center justify-center min-h-screen">
		<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
	</div>
);

// Componente que renderiza las rutas definidas en appRoutes
const AppRoutes: React.FC = () => {
	const routes = useRoutes(appRoutes);
	return routes;
};

const App: React.FC = () => {
	return (
		<AuthProvider>
			<Suspense fallback={<LoadingFallback />}>
				<AppRoutes />
				{import.meta.env.DEV && <ApiDebugger />}
			</Suspense>
		</AuthProvider>
	);
};

export default App;