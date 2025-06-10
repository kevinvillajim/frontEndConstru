// src/ui/pages/DebugPage.tsx
// Página temporal para diagnosticar problemas de conexión API

import React, {useState, useEffect} from "react";
import {useSimpleApiTest} from "../hooks/useSimpleApiTest";
import NetworkDebugger from "../components/debug/NetworkDebugger";

const DebugPage: React.FC = () => {
	const {loading, lastResult, testBasicConnectivity} = useSimpleApiTest();
	const [autoTestResult, setAutoTestResult] = useState<any>(null);

	// Auto-ejecutar prueba al cargar la página
	useEffect(() => {
		const runAutoTest = async () => {
			console.log("🔧 Auto-ejecutando prueba de diagnóstico...");
			const results = await testBasicConnectivity();
			setAutoTestResult(results);
		};

		runAutoTest();
	}, [testBasicConnectivity]);

	// Información del entorno
	const envInfo = {
		currentUrl: window.location.href,
		origin: window.location.origin,
		nodeEnv: import.meta.env.MODE,
		dev: import.meta.env.DEV,
		baseUrl: import.meta.env.BASE_URL,
		allEnv: import.meta.env,
	};

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-7xl mx-auto px-4">
				{/* Header */}
				<div className="mb-8 text-center">
					<h1 className="text-3xl font-bold text-gray-900 mb-4">
						🛠️ Página de Diagnóstico
					</h1>
					<p className="text-lg text-gray-600">
						Herramienta temporal para diagnosticar problemas de conexión API
					</p>
					<div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
						<p className="text-yellow-800">
							<strong>Nota:</strong> Esta página es temporal y debe eliminarse
							en producción.
							<br />
							Acceso directo: <code>/debug</code>
						</p>
					</div>
				</div>

				{/* Información del entorno */}
				<div className="mb-8 bg-white rounded-lg shadow p-6">
					<h2 className="text-xl font-semibold mb-4">
						📋 Información del Entorno
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
						<div>
							<strong>URL Actual:</strong> {envInfo.currentUrl}
						</div>
						<div>
							<strong>Origin:</strong> {envInfo.origin}
						</div>
						<div>
							<strong>Modo:</strong> {envInfo.nodeEnv} (
							{envInfo.dev ? "Development" : "Production"})
						</div>
						<div>
							<strong>Base URL:</strong> {envInfo.baseUrl}
						</div>
					</div>
					<details className="mt-4">
						<summary className="cursor-pointer font-medium">
							Ver todas las variables de entorno
						</summary>
						<pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
							{JSON.stringify(envInfo.allEnv, null, 2)}
						</pre>
					</details>
				</div>

				{/* Auto-test results */}
				{autoTestResult && (
					<div className="mb-8 bg-white rounded-lg shadow p-6">
						<h2 className="text-xl font-semibold mb-4">
							🔍 Resultado de Prueba Automática
						</h2>
						<div className="space-y-3">
							{autoTestResult.map((test: any, index: number) => (
								<div
									key={index}
									className={`p-3 rounded-lg border-2 ${
										test.result.success
											? "border-green-200 bg-green-50"
											: "border-red-200 bg-red-50"
									}`}
								>
									<div className="flex justify-between items-start">
										<div>
											<div className="font-medium">
												{test.result.success ? "✅" : "❌"} {test.url}
											</div>
											<div className="text-sm text-gray-600">
												Status: {test.result.status} | Tipo:{" "}
												{test.result.responseType} | Tiempo:{" "}
												{test.result.timing}ms
											</div>
											{test.result.error && (
												<div className="text-sm text-red-600 mt-1">
													Error: {test.result.error}
												</div>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Quick actions */}
				<div className="mb-8 bg-white rounded-lg shadow p-6">
					<h2 className="text-xl font-semibold mb-4">⚡ Acciones Rápidas</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<button
							onClick={() =>
								window.open(
									"http://localhost:4000/api/material-calculation/templates",
									"_blank"
								)
							}
							className="p-4 bg-blue-100 hover:bg-blue-200 rounded-lg text-left transition-colors"
						>
							<div className="font-medium text-blue-900">
								🔗 Backend Directo
							</div>
							<div className="text-sm text-blue-700">
								Abrir backend directamente
							</div>
						</button>

						<button
							onClick={() => {
								fetch("/api/material-calculation/templates")
									.then((res) => res.text())
									.then((text) => {
										console.log("Respuesta de proxy:", text);
										alert("Ver console para respuesta completa");
									})
									.catch((err) => {
										console.error("Error de proxy:", err);
										alert("Error: " + err.message);
									});
							}}
							className="p-4 bg-green-100 hover:bg-green-200 rounded-lg text-left transition-colors"
						>
							<div className="font-medium text-green-900">🔄 Probar Proxy</div>
							<div className="text-sm text-green-700">Probar proxy de Vite</div>
						</button>

						<button
							onClick={() => {
								console.clear();
								testBasicConnectivity();
							}}
							className="p-4 bg-purple-100 hover:bg-purple-200 rounded-lg text-left transition-colors"
						>
							<div className="font-medium text-purple-900">
								🧪 Re-probar Todo
							</div>
							<div className="text-sm text-purple-700">
								Ejecutar pruebas nuevamente
							</div>
						</button>
					</div>
				</div>

				{/* Network Debugger Component */}
				<NetworkDebugger />

				{/* Console logs section */}
				<div className="mt-8 bg-white rounded-lg shadow p-6">
					<h2 className="text-xl font-semibold mb-4">📜 Instrucciones</h2>
					<div className="prose text-sm">
						<ol className="list-decimal list-inside space-y-2">
							<li>
								Abre las DevTools (F12) y ve a la pestaña{" "}
								<strong>Console</strong>
							</li>
							<li>
								Abre también la pestaña <strong>Network</strong> para ver las
								peticiones
							</li>
							<li>Haz clic en "Ejecutar Diagnóstico" arriba</li>
							<li>Revisa los logs en la consola y las peticiones en Network</li>
							<li>Los resultados aparecerán tanto aquí como en la consola</li>
						</ol>
						<div className="mt-4 p-3 bg-gray-100 rounded text-sm">
							<strong>Interpretación:</strong>
							<ul className="mt-2 space-y-1">
								<li>
									🟢 <strong>JSON válido:</strong> Conexión correcta
								</li>
								<li>
									🔴 <strong>HTML recibido:</strong> Problema de proxy o backend
									no disponible
								</li>
								<li>
									🔴 <strong>404:</strong> Ruta no existe
								</li>
								<li>
									🔴 <strong>CORS error:</strong> Problema de configuración
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DebugPage;
