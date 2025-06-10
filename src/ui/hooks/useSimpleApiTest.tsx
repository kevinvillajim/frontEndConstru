// src/ui/hooks/useSimpleApiTest.tsx
// Hook simplificado para probar conexión API sin complicaciones

import {useState, useCallback} from "react";

interface ApiTestResult {
	success: boolean;
	data?: any;
	error?: string;
	status?: number;
	responseType?: string;
	timing?: number;
}

export const useSimpleApiTest = () => {
	const [loading, setLoading] = useState(false);
	const [lastResult, setLastResult] = useState<ApiTestResult | null>(null);

	const testEndpoint = useCallback(
		async (url: string): Promise<ApiTestResult> => {
			setLoading(true);
			const startTime = Date.now();

			try {
				console.log(`🧪 Probando endpoint: ${url}`);

				const response = await fetch(url, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
					},
				});

				const timing = Date.now() - startTime;
				const contentType = response.headers.get("content-type") || "";

				console.log(`📊 Respuesta recibida:`, {
					status: response.status,
					statusText: response.statusText,
					contentType,
					url: response.url,
					timing: `${timing}ms`,
				});

				let data;
				let responseType = "unknown";

				if (contentType.includes("application/json")) {
					data = await response.json();
					responseType = "json";
					console.log(`✅ JSON parseado correctamente:`, data);
				} else if (contentType.includes("text/html")) {
					const text = await response.text();
					responseType = "html";
					console.log(
						`⚠️ Recibido HTML (primeros 200 chars):`,
						text.substring(0, 200)
					);
					data = text.substring(0, 500); // Solo los primeros 500 caracteres
				} else {
					const text = await response.text();
					responseType = contentType || "text";
					console.log(`📄 Respuesta como texto:`, text.substring(0, 200));
					data = text;
				}

				const result: ApiTestResult = {
					success: response.ok && responseType === "json",
					data,
					status: response.status,
					responseType,
					timing,
				};

				if (!response.ok) {
					result.error = `HTTP ${response.status}: ${response.statusText}`;
				} else if (responseType !== "json") {
					result.error = `Esperaba JSON pero recibió ${responseType}`;
				}

				setLastResult(result);
				return result;
			} catch (error) {
				const timing = Date.now() - startTime;
				console.error(`❌ Error en fetch:`, error);

				const result: ApiTestResult = {
					success: false,
					error: error instanceof Error ? error.message : "Error desconocido",
					timing,
				};

				setLastResult(result);
				return result;
			} finally {
				setLoading(false);
			}
		},
		[]
	);

	// Función para probar múltiples endpoints
	const testMultipleEndpoints = useCallback(
		async (urls: string[]) => {
			const results: Array<{url: string; result: ApiTestResult}> = [];

			for (const url of urls) {
				console.log(`🔄 Probando: ${url}`);
				const result = await testEndpoint(url);
				results.push({url, result});

				// Pausa pequeña entre requests
				await new Promise((resolve) => setTimeout(resolve, 500));
			}

			return results;
		},
		[testEndpoint]
	);

	// Función para probar conectividad básica
	const testBasicConnectivity = useCallback(async () => {
		const endpoints = [
			"http://localhost:4000/api/material-calculation/templates",
			"/api/material-calculation/templates",
			"/api/material-calculations/templates", // incorrecto para comparar
		];

		console.log("🚀 Iniciando prueba de conectividad básica...");
		const results = await testMultipleEndpoints(endpoints);

		console.log("📋 Resumen de pruebas:");
		results.forEach(({url, result}) => {
			console.log(
				`${result.success ? "✅" : "❌"} ${url}: ${result.success ? "OK" : result.error}`
			);
		});

		return results;
	}, [testMultipleEndpoints]);

	return {
		loading,
		lastResult,
		testEndpoint,
		testMultipleEndpoints,
		testBasicConnectivity,
	};
};
