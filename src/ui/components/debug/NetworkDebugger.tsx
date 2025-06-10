// src/ui/components/debug/NetworkDebugger.tsx
// Componente para diagnosticar problemas de red y API

import React, {useState, useEffect} from "react";
import {
	ClipboardDocumentIcon,
	CheckCircleIcon,
	XCircleIcon,
	ArrowPathIcon,
	InformationCircleIcon,
} from "@heroicons/react/24/outline";

interface DebugResult {
	url: string;
	method: string;
	status?: number;
	success: boolean;
	response?: any;
	error?: string;
	headers?: Record<string, string>;
	timing: number;
}

const NetworkDebugger: React.FC = () => {
	const [results, setResults] = useState<DebugResult[]>([]);
	const [loading, setLoading] = useState(false);
	const [backendStatus, setBackendStatus] = useState<
		"unknown" | "online" | "offline"
	>("unknown");

	// URLs de prueba
	const testUrls = [
		// Rutas que deberían funcionar
		{
			url: "http://localhost:4000/api/material-calculation/templates",
			label: "Backend directo (correcto)",
		},
		{
			url: "/api/material-calculation/templates",
			label: "Proxy Vite (correcto)",
		},

		// Rutas incorrectas para comparación
		{
			url: "/api/material-calculations/templates",
			label: "Proxy Vite (incorrecto - plural)",
		},

		// Verificación de backend
		{url: "http://localhost:4000/health", label: "Health check backend"},
		{
			url: "http://localhost:4000/api/calculations/templates",
			label: "Templates principales backend",
		},
	];

	// Función para verificar estado del backend
	const checkBackendStatus = async () => {
		try {
			const response = await fetch(
				"http://localhost:4000/api/material-calculation/templates",
				{
					method: "GET",
					headers: {"Content-Type": "application/json"},
				}
			);

			if (response.ok) {
				setBackendStatus("online");
			} else {
				setBackendStatus("offline");
			}
		} catch {
			setBackendStatus("offline");
		}
	};

	useEffect(() => {
		checkBackendStatus();
	}, []);

	// Función para probar una URL específica
	const testUrl = async (url: string, label: string): Promise<DebugResult> => {
		const startTime = Date.now();

		try {
			console.log(`🔍 Probando: ${label} -> ${url}`);

			const response = await fetch(url, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});

			const timing = Date.now() - startTime;

			// Obtener headers de respuesta
			const responseHeaders: Record<string, string> = {};
			response.headers.forEach((value, key) => {
				responseHeaders[key] = value;
			});

			console.log(`📊 Respuesta de ${label}:`, {
				status: response.status,
				statusText: response.statusText,
				headers: responseHeaders,
				url: response.url,
			});

			// Intentar parsear como JSON
			let responseData;
			const contentType = response.headers.get("content-type") || "";

			if (contentType.includes("application/json")) {
				responseData = await response.json();
				console.log(`✅ JSON válido de ${label}:`, responseData);
			} else {
				// Si no es JSON, obtener como texto para ver qué es
				const text = await response.text();
				console.log(
					`⚠️ Respuesta no-JSON de ${label}:`,
					text.substring(0, 200)
				);

				if (text.includes("<!doctype") || text.includes("<html>")) {
					throw new Error(
						`Recibido HTML en lugar de JSON. Content-Type: ${contentType}`
					);
				}

				responseData = text;
			}

			return {
				url,
				method: "GET",
				status: response.status,
				success: response.ok,
				response: responseData,
				headers: responseHeaders,
				timing,
			};
		} catch (error) {
			const timing = Date.now() - startTime;
			console.error(`❌ Error en ${label}:`, error);

			return {
				url,
				method: "GET",
				success: false,
				error: error instanceof Error ? error.message : "Error desconocido",
				timing,
			};
		}
	};

	// Función para ejecutar todas las pruebas
	const runAllTests = async () => {
		setLoading(true);
		setResults([]);

		console.log("🚀 Iniciando diagnóstico de red...");

		const testResults: DebugResult[] = [];

		for (const test of testUrls) {
			const result = await testUrl(test.url, test.label);
			testResults.push({
				...result,
				url: `${test.label}: ${result.url}`,
			});

			// Pequeña pausa entre tests
			await new Promise((resolve) => setTimeout(resolve, 500));
		}

		setResults(testResults);
		setLoading(false);

		console.log("✅ Diagnóstico completado. Revisa los resultados abajo.");
	};

	// Función para copiar logs al clipboard
	const copyLogsToClipboard = () => {
		const logs = results
			.map(
				(result) =>
					`${result.url}\nStatus: ${result.status || "N/A"}\nSuccess: ${result.success}\nError: ${result.error || "None"}\nTiming: ${result.timing}ms\n---`
			)
			.join("\n");

		navigator.clipboard.writeText(logs);
	};

	// Función para verificar configuración de Vite
	const checkViteConfig = () => {
		console.log("🔧 Información de configuración:");
		console.log("Base URL:", window.location.origin);
		console.log("Current URL:", window.location.href);
		console.log("Environment:", import.meta.env);

		// Verificar si hay proxy configurado
		console.log("Probando conexión directa al backend...");
		checkBackendStatus();
	};

	return (
		<div className="max-w-6xl mx-auto p-6 bg-white">
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-gray-900 mb-2">
					🔍 Diagnóstico de Red y API
				</h1>
				<p className="text-gray-600">
					Herramienta para diagnosticar problemas de conexión entre frontend y
					backend
				</p>
			</div>

			{/* Estado del backend */}
			<div className="mb-6 p-4 rounded-lg border">
				<div className="flex items-center space-x-2 mb-2">
					<InformationCircleIcon className="h-5 w-5 text-blue-500" />
					<h3 className="font-medium">Estado del Backend</h3>
				</div>
				<div className="flex items-center space-x-2">
					{backendStatus === "online" && (
						<>
							<CheckCircleIcon className="h-5 w-5 text-green-500" />
							<span className="text-green-700">
								Backend en línea (localhost:4000)
							</span>
						</>
					)}
					{backendStatus === "offline" && (
						<>
							<XCircleIcon className="h-5 w-5 text-red-500" />
							<span className="text-red-700">
								Backend no disponible (localhost:4000)
							</span>
						</>
					)}
					{backendStatus === "unknown" && (
						<>
							<ArrowPathIcon className="h-5 w-5 text-gray-500 animate-spin" />
							<span className="text-gray-700">Verificando backend...</span>
						</>
					)}
				</div>
			</div>

			{/* Controles */}
			<div className="mb-6 flex space-x-4">
				<button
					onClick={runAllTests}
					disabled={loading}
					className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
				>
					{loading ? (
						<ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
					) : (
						<CheckCircleIcon className="h-4 w-4 mr-2" />
					)}
					{loading ? "Ejecutando..." : "Ejecutar Diagnóstico"}
				</button>

				<button
					onClick={checkViteConfig}
					className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
				>
					<InformationCircleIcon className="h-4 w-4 mr-2" />
					Verificar Configuración
				</button>

				{results.length > 0 && (
					<button
						onClick={copyLogsToClipboard}
						className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
					>
						<ClipboardDocumentIcon className="h-4 w-4 mr-2" />
						Copiar Logs
					</button>
				)}
			</div>

			{/* Información de configuración actual */}
			<div className="mb-6 p-4 bg-gray-50 rounded-lg">
				<h3 className="font-medium mb-2">Configuración Actual:</h3>
				<div className="text-sm space-y-1">
					<div>
						<strong>Frontend:</strong> {window.location.origin}
					</div>
					<div>
						<strong>Backend esperado:</strong> http://localhost:4000
					</div>
					<div>
						<strong>Ruta correcta:</strong> /api/material-calculation/templates
					</div>
					<div>
						<strong>Ruta incorrecta:</strong>{" "}
						/api/material-calculations/templates
					</div>
				</div>
			</div>

			{/* Resultados */}
			{results.length > 0 && (
				<div className="space-y-4">
					<h2 className="text-xl font-semibold text-gray-900">
						Resultados del Diagnóstico
					</h2>

					{results.map((result, index) => (
						<div
							key={index}
							className={`p-4 rounded-lg border-2 ${
								result.success
									? "border-green-200 bg-green-50"
									: "border-red-200 bg-red-50"
							}`}
						>
							<div className="flex items-start justify-between mb-2">
								<div className="flex items-center space-x-2">
									{result.success ? (
										<CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
									) : (
										<XCircleIcon className="h-5 w-5 text-red-500 flex-shrink-0" />
									)}
									<h3 className="font-medium text-gray-900">{result.url}</h3>
								</div>
								<div className="text-right text-sm text-gray-600">
									<div>Status: {result.status || "N/A"}</div>
									<div>Tiempo: {result.timing}ms</div>
								</div>
							</div>

							{result.error && (
								<div className="mb-2 p-2 bg-red-100 rounded text-red-800 text-sm">
									<strong>Error:</strong> {result.error}
								</div>
							)}

							{result.response && (
								<div className="mb-2">
									<details className="cursor-pointer">
										<summary className="text-sm font-medium text-gray-700 mb-1">
											Ver Respuesta
										</summary>
										<pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-40">
											{typeof result.response === "object"
												? JSON.stringify(result.response, null, 2)
												: result.response}
										</pre>
									</details>
								</div>
							)}

							{result.headers && (
								<details className="cursor-pointer">
									<summary className="text-sm font-medium text-gray-700 mb-1">
										Ver Headers
									</summary>
									<pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-32">
										{JSON.stringify(result.headers, null, 2)}
									</pre>
								</details>
							)}
						</div>
					))}
				</div>
			)}

			{/* Instrucciones */}
			<div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
				<h3 className="font-medium text-blue-900 mb-2">
					💡 Cómo interpretar los resultados:
				</h3>
				<ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
					<li>
						<strong>Verde:</strong> Conexión exitosa, recibiendo JSON válido
					</li>
					<li>
						<strong>Rojo:</strong> Error de conexión o recibiendo HTML en lugar
						de JSON
					</li>
					<li>
						<strong>HTML en respuesta:</strong> Problema de proxy de Vite o
						backend no disponible
					</li>
					<li>
						<strong>404:</strong> Ruta no existe en el backend
					</li>
					<li>
						<strong>CORS:</strong> Problema de configuración de CORS
					</li>
				</ul>
			</div>

			{/* Debugging adicional */}
			<div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
				<h3 className="font-medium text-yellow-900 mb-2">
					🛠️ Pasos de solución:
				</h3>
				<ol className="text-sm text-yellow-800 space-y-1 list-decimal list-inside">
					<li>Verificar que el backend esté ejecutándose en localhost:4000</li>
					<li>Verificar configuración de proxy en vite.config.ts</li>
					<li>
						Verificar que las rutas del frontend coincidan con las del backend
					</li>
					<li>Revisar console.log en DevTools para errores adicionales</li>
					<li>Verificar que no haya conflictos de CORS</li>
				</ol>
			</div>
		</div>
	);
};

export default NetworkDebugger;
