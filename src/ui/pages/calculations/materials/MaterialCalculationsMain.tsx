// src/ui/pages/calculations/materials/MaterialCalculationsMain.tsx

import MaterialCalculationsRouter from "./MaterialCalculationsRouter";
import {ErrorBoundary} from "./components/SharedComponents";

// Componente principal que se integra con el sistema de navegación existente
const MaterialCalculationsMain: React.FC = () => {
	return (
		<ErrorBoundary>
			<div className="w-full min-h-screen">
				<MaterialCalculationsRouter />
			</div>
		</ErrorBoundary>
	);
};

export default MaterialCalculationsMain;