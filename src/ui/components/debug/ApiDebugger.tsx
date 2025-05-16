import React, {useEffect, useState} from "react";
import axios from "axios";
import endpoints from "../../../utils/endpoints";

/**
 * Componente para depurar la conexión a la API durante desarrollo
 * Solo se muestra en modo desarrollo
 */
const ApiDebugger: React.FC = () => {
	const [apiStatus, setApiStatus] = useState<"loading" | "online" | "offline">(
		"loading"
	);
	const [debugInfo, setDebugInfo] = useState<any>({});

	useEffect(() => {
		const checkApiStatus = async () => {
			try {
				// Intentar una petición simple al backend
				const response = await axios.get(
					endpoints.auth.login.replace("/login", ""),
					{
						timeout: 3000, // Timeout rápido para no bloquear
					}
				);

				setApiStatus("online");
				setDebugInfo({
					status: response.status,
					baseUrl: endpoints.auth.login,
					headers: response.headers,
					data: response.data,
				});
			} catch (error) {
				console.error("Error al verificar API:", error);
				setApiStatus("offline");

				if (axios.isAxiosError(error)) {
					setDebugInfo({
						error: error.message,
						code: error.code,
						baseUrl: endpoints.auth.login,
						config: error.config,
						response: error.response,
					});
				} else {
					setDebugInfo({error: String(error)});
				}
			}
		};

		checkApiStatus();
	}, []);

	// Solo mostrar en modo desarrollo
	if (import.meta.env.MODE !== "development") {
		return null;
	}

	return (
		<div
			style={{
				position: "fixed",
				bottom: "10px",
				right: "10px",
				zIndex: 9999,
				padding: "10px",
				backgroundColor:
					apiStatus === "online"
						? "rgba(0, 128, 0, 0.1)"
						: "rgba(255, 0, 0, 0.1)",
				border: `1px solid ${apiStatus === "online" ? "green" : "red"}`,
				borderRadius: "4px",
				fontSize: "12px",
				maxWidth: "300px",
				maxHeight: "200px",
				overflow: "auto",
			}}
		>
			<div style={{fontWeight: "bold", marginBottom: "5px"}}>
				API:{" "}
				{apiStatus === "loading"
					? "Verificando..."
					: apiStatus === "online"
						? "Online ✅"
						: "Offline ❌"}
			</div>
			<div>
				<strong>Base URL:</strong> {endpoints.auth.login}
			</div>
			<div>
				<button
					style={{
						marginTop: "5px",
						padding: "2px 5px",
						fontSize: "10px",
						cursor: "pointer",
					}}
					onClick={() => console.log("Debug Info:", debugInfo)}
				>
					Ver detalles en consola
				</button>
			</div>
		</div>
	);
};

export default ApiDebugger;
