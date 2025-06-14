// src/ui/pages/testing/IntegrationTestSuite.tsx
import React, {useState, useEffect} from "react";
import {
	PlayIcon,
	PauseIcon,
	StopIcon,
	CheckCircleIcon,
	XCircleIcon,
	ExclamationTriangleIcon,
	ClockIcon,
	DocumentTextIcon,
	ChartBarIcon,
	CogIcon,
	BugAntIcon,
	ArrowPathIcon,
	EyeIcon,
	DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";
import {
	LoadingSpinner,
	Badge,
	ProgressBar,
} from "../shared/components/SharedComponents";

interface TestSuite {
	id: string;
	name: string;
	description: string;
	category:
		| "integration"
		| "e2e"
		| "performance"
		| "security"
		| "compatibility";
	tests: Test[];
	status: "idle" | "running" | "completed" | "failed" | "paused";
	duration?: number;
	lastRun?: Date;
	successRate: number;
}

interface Test {
	id: string;
	name: string;
	description: string;
	priority: "low" | "medium" | "high" | "critical";
	status: "pending" | "running" | "passed" | "failed" | "skipped";
	duration?: number;
	error?: string;
	steps: TestStep[];
	data?: any;
}

interface TestStep {
	id: string;
	name: string;
	action: string;
	expected: string;
	actual?: string;
	status: "pending" | "running" | "passed" | "failed";
	screenshot?: string;
	timestamp?: Date;
}

interface TestRun {
	id: string;
	suiteId: string;
	startTime: Date;
	endTime?: Date;
	status: "running" | "completed" | "failed" | "cancelled";
	results: TestResult[];
	environment: string;
	browser?: string;
	coverage?: number;
}

interface TestResult {
	testId: string;
	status: "passed" | "failed" | "skipped";
	duration: number;
	error?: string;
	screenshots: string[];
	logs: string[];
}

// Custom Hook
const useIntegrationTests = () => {
	const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
	const [currentRun, setCurrentRun] = useState<TestRun | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isRunning, setIsRunning] = useState(false);

	const loadTestSuites = async () => {
		setIsLoading(true);
		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			const mockSuites: TestSuite[] = [
				{
					id: "1",
					name: "Flujo Completo Budget-Schedule",
					description:
						"Test end-to-end del flujo completo desde cálculos hasta cronograma",
					category: "e2e",
					status: "idle",
					successRate: 95.2,
					tests: [
						{
							id: "1.1",
							name: "Crear Cálculo Técnico",
							description: "Crear un cálculo técnico desde template",
							priority: "critical",
							status: "passed",
							duration: 2.5,
							steps: [
								{
									id: "1.1.1",
									name: "Seleccionar Template",
									action:
										"Navegar a catálogo y seleccionar template de cálculo",
									expected: "Template seleccionado correctamente",
									status: "passed",
								},
								{
									id: "1.1.2",
									name: "Ingresar Parámetros",
									action: "Completar formulario con parámetros técnicos",
									expected: "Parámetros validados y guardados",
									status: "passed",
								},
								{
									id: "1.1.3",
									name: "Ejecutar Cálculo",
									action: "Ejecutar cálculo y verificar resultados",
									expected: "Resultados generados correctamente",
									status: "passed",
								},
							],
						},
						{
							id: "1.2",
							name: "Generar Presupuesto",
							description: "Generar presupuesto desde cálculo técnico",
							priority: "critical",
							status: "passed",
							duration: 3.2,
							steps: [
								{
									id: "1.2.1",
									name: "Abrir Generador de Presupuesto",
									action: "Navegar desde cálculo a generador de presupuesto",
									expected: "Interfaz de presupuesto cargada",
									status: "passed",
								},
								{
									id: "1.2.2",
									name: "Aplicar Template",
									action: "Seleccionar y aplicar template de presupuesto",
									expected: "Template aplicado con costos actualizados",
									status: "passed",
								},
								{
									id: "1.2.3",
									name: "Verificar Integración",
									action: "Verificar que cantidades coincidan con cálculo",
									expected: "Cantidades integradas correctamente",
									status: "passed",
								},
							],
						},
						{
							id: "1.3",
							name: "Crear Cronograma",
							description: "Crear cronograma integrado con presupuesto",
							priority: "critical",
							status: "failed",
							duration: 4.1,
							error: "Error en sincronización de recursos",
							steps: [
								{
									id: "1.3.1",
									name: "Generar Cronograma Base",
									action: "Crear cronograma desde presupuesto",
									expected: "Cronograma generado con actividades",
									status: "passed",
								},
								{
									id: "1.3.2",
									name: "Asignar Recursos",
									action: "Asignar recursos y equipos a actividades",
									expected: "Recursos asignados correctamente",
									status: "failed",
									actual: "Error en carga de recursos disponibles",
								},
							],
						},
					],
				},
				{
					id: "2",
					name: "Sincronización en Tiempo Real",
					description: "Verificar sincronización bidireccional entre módulos",
					category: "integration",
					status: "idle",
					successRate: 88.7,
					tests: [
						{
							id: "2.1",
							name: "Cambio en Presupuesto",
							description:
								"Verificar impacto de cambios en presupuesto hacia cronograma",
							priority: "high",
							status: "passed",
							duration: 1.8,
							steps: [],
						},
						{
							id: "2.2",
							name: "Cambio en Cronograma",
							description:
								"Verificar impacto de cambios en cronograma hacia presupuesto",
							priority: "high",
							status: "passed",
							duration: 2.1,
							steps: [],
						},
					],
				},
				{
					id: "3",
					name: "Performance y Carga",
					description:
						"Tests de performance bajo diferentes condiciones de carga",
					category: "performance",
					status: "idle",
					successRate: 92.3,
					tests: [
						{
							id: "3.1",
							name: "Carga de Proyecto Grande",
							description:
								"Verificar performance con proyecto de 1000+ actividades",
							priority: "medium",
							status: "passed",
							duration: 8.5,
							steps: [],
						},
						{
							id: "3.2",
							name: "Sincronización Masiva",
							description:
								"Verificar sincronización con múltiples cambios simultáneos",
							priority: "high",
							status: "passed",
							duration: 5.3,
							steps: [],
						},
					],
				},
			];

			setTestSuites(mockSuites);
		} catch (error) {
			console.error("Error loading test suites:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const runTestSuite = async (suiteId: string) => {
		setIsRunning(true);
		const newRun: TestRun = {
			id: Date.now().toString(),
			suiteId,
			startTime: new Date(),
			status: "running",
			results: [],
			environment: "development",
			browser: "Chrome",
		};
		setCurrentRun(newRun);

		try {
			// Simulate test execution
			const suite = testSuites.find((s) => s.id === suiteId);
			if (!suite) return;

			for (const test of suite.tests) {
				// Update test status to running
				setTestSuites((prev) =>
					prev.map((s) =>
						s.id === suiteId
							? {
									...s,
									tests: s.tests.map((t) =>
										t.id === test.id ? {...t, status: "running" as const} : t
									),
								}
							: s
					)
				);

				// Simulate test execution time
				await new Promise((resolve) => setTimeout(resolve, 1000));

				// Update test status to completed
				const finalStatus = Math.random() > 0.1 ? "passed" : "failed";
				setTestSuites((prev) =>
					prev.map((s) =>
						s.id === suiteId
							? {
									...s,
									tests: s.tests.map((t) =>
										t.id === test.id
											? {
													...t,
													status: finalStatus as const,
													duration: Math.random() * 5 + 1,
												}
											: t
									),
								}
							: s
					)
				);
			}

			// Complete the run
			newRun.endTime = new Date();
			newRun.status = "completed";
			setCurrentRun(newRun);
		} catch (error) {
			console.error("Error running tests:", error);
			newRun.status = "failed";
			setCurrentRun(newRun);
		} finally {
			setIsRunning(false);
		}
	};

	const generateReport = async (runId: string) => {
		// Simulate report generation
		console.log("Generating test report for run:", runId);
	};

	useEffect(() => {
		loadTestSuites();
	}, []);

	return {
		testSuites,
		currentRun,
		isLoading,
		isRunning,
		runTestSuite,
		generateReport,
	};
};

// Components
const TestSuiteCard: React.FC<{
	suite: TestSuite;
	onRun: (suiteId: string) => void;
	onViewDetails: (suiteId: string) => void;
	isRunning: boolean;
}> = ({suite, onRun, onViewDetails, isRunning}) => {
	const getStatusIcon = () => {
		switch (suite.status) {
			case "running":
				return <LoadingSpinner size="sm" />;
			case "completed":
				return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
			case "failed":
				return <XCircleIcon className="h-5 w-5 text-red-600" />;
			default:
				return <ClockIcon className="h-5 w-5 text-gray-400" />;
		}
	};

	return (
		<div className="bg-white rounded-xl border border-gray-200 p-6">
			<div className="flex items-start justify-between mb-4">
				<div className="flex items-center gap-3">
					{getStatusIcon()}
					<div>
						<h3 className="font-semibold text-gray-900">{suite.name}</h3>
						<p className="text-sm text-gray-600">{suite.description}</p>
					</div>
				</div>
				<Badge
					variant={
						suite.category === "e2e"
							? "primary"
							: suite.category === "integration"
								? "success"
								: suite.category === "performance"
									? "warning"
									: "secondary"
					}
				>
					{suite.category.toUpperCase()}
				</Badge>
			</div>

			<div className="grid grid-cols-3 gap-4 mb-6">
				<div>
					<div className="text-sm text-gray-600">Tests</div>
					<div className="text-lg font-semibold">{suite.tests.length}</div>
				</div>
				<div>
					<div className="text-sm text-gray-600">Éxito</div>
					<div className="text-lg font-semibold text-green-600">
						{suite.successRate}%
					</div>
				</div>
				<div>
					<div className="text-sm text-gray-600">Última ejecución</div>
					<div className="text-sm">
						{suite.lastRun ? suite.lastRun.toLocaleDateString() : "Nunca"}
					</div>
				</div>
			</div>

			<div className="flex gap-2">
				<button
					onClick={() => onRun(suite.id)}
					disabled={isRunning}
					className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
				>
					<PlayIcon className="h-4 w-4" />
					Ejecutar
				</button>
				<button
					onClick={() => onViewDetails(suite.id)}
					className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
				>
					<EyeIcon className="h-4 w-4" />
					Ver Detalles
				</button>
			</div>
		</div>
	);
};

const TestDetailsModal: React.FC<{
	suite: TestSuite;
	isOpen: boolean;
	onClose: () => void;
}> = ({suite, isOpen, onClose}) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
			<div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
				<div className="p-6 border-b border-gray-200">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-semibold text-gray-900">
							{suite.name}
						</h2>
						<button
							onClick={onClose}
							className="text-gray-400 hover:text-gray-600"
						>
							<XCircleIcon className="h-6 w-6" />
						</button>
					</div>
				</div>

				<div className="p-6">
					<div className="space-y-6">
						{suite.tests.map((test) => (
							<div key={test.id} className="bg-gray-50 rounded-lg p-4">
								<div className="flex items-center justify-between mb-3">
									<div className="flex items-center gap-3">
										{test.status === "passed" && (
											<CheckCircleIcon className="h-5 w-5 text-green-600" />
										)}
										{test.status === "failed" && (
											<XCircleIcon className="h-5 w-5 text-red-600" />
										)}
										{test.status === "running" && <LoadingSpinner size="sm" />}
										<h3 className="font-medium text-gray-900">{test.name}</h3>
									</div>
									<Badge
										variant={
											test.priority === "critical"
												? "danger"
												: test.priority === "high"
													? "warning"
													: "secondary"
										}
									>
										{test.priority}
									</Badge>
								</div>

								<p className="text-sm text-gray-600 mb-3">{test.description}</p>

								{test.error && (
									<div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
										<div className="flex items-center gap-2 mb-1">
											<BugAntIcon className="h-4 w-4 text-red-600" />
											<span className="text-sm font-medium text-red-800">
												Error
											</span>
										</div>
										<p className="text-sm text-red-700">{test.error}</p>
									</div>
								)}

								{test.steps.length > 0 && (
									<div className="space-y-2">
										<h4 className="text-sm font-medium text-gray-700">
											Pasos:
										</h4>
										{test.steps.map((step) => (
											<div
												key={step.id}
												className="flex items-start gap-3 text-sm"
											>
												{step.status === "passed" && (
													<CheckCircleIcon className="h-4 w-4 text-green-600 mt-0.5" />
												)}
												{step.status === "failed" && (
													<XCircleIcon className="h-4 w-4 text-red-600 mt-0.5" />
												)}
												{step.status === "pending" && (
													<div className="w-4 h-4 rounded-full border-2 border-gray-300 mt-0.5" />
												)}
												<div className="flex-1">
													<div className="font-medium">{step.name}</div>
													<div className="text-gray-600">{step.action}</div>
													<div className="text-gray-500">
														Esperado: {step.expected}
													</div>
													{step.actual && step.status === "failed" && (
														<div className="text-red-600">
															Actual: {step.actual}
														</div>
													)}
												</div>
											</div>
										))}
									</div>
								)}
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

// Main Component
const IntegrationTestSuite: React.FC = () => {
	const {
		testSuites,
		currentRun,
		isLoading,
		isRunning,
		runTestSuite,
		generateReport,
	} = useIntegrationTests();

	const [selectedSuite, setSelectedSuite] = useState<TestSuite | null>(null);
	const [showDetails, setShowDetails] = useState(false);

	const handleViewDetails = (suiteId: string) => {
		const suite = testSuites.find((s) => s.id === suiteId);
		if (suite) {
			setSelectedSuite(suite);
			setShowDetails(true);
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<LoadingSpinner />
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto p-6">
			{/* Header */}
			<div className="mb-8">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold text-gray-900">
							Suite de Tests de Integración
						</h1>
						<p className="text-gray-600 mt-1">
							Tests end-to-end del sistema completo Budget-Schedule
						</p>
					</div>

					<div className="flex gap-3">
						<button
							onClick={() => generateReport(currentRun?.id || "")}
							disabled={!currentRun}
							className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							<DocumentArrowDownIcon className="h-4 w-4" />
							Generar Reporte
						</button>
					</div>
				</div>
			</div>

			{/* Current Run Status */}
			{currentRun && (
				<div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							{isRunning ? (
								<LoadingSpinner size="sm" />
							) : (
								<CheckCircleIcon className="h-5 w-5 text-blue-600" />
							)}
							<div>
								<div className="font-medium text-blue-900">
									{isRunning ? "Ejecutando tests..." : "Ejecución completada"}
								</div>
								<div className="text-sm text-blue-700">
									Iniciado: {currentRun.startTime.toLocaleTimeString()}
									{currentRun.endTime && (
										<span>
											{" "}
											- Completado: {currentRun.endTime.toLocaleTimeString()}
										</span>
									)}
								</div>
							</div>
						</div>

						{isRunning && (
							<div className="text-sm text-blue-700">
								Entorno: {currentRun.environment} | Navegador:{" "}
								{currentRun.browser}
							</div>
						)}
					</div>
				</div>
			)}

			{/* Test Suites Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{testSuites.map((suite) => (
					<TestSuiteCard
						key={suite.id}
						suite={suite}
						onRun={runTestSuite}
						onViewDetails={handleViewDetails}
						isRunning={isRunning}
					/>
				))}
			</div>

			{/* Test Details Modal */}
			{selectedSuite && (
				<TestDetailsModal
					suite={selectedSuite}
					isOpen={showDetails}
					onClose={() => setShowDetails(false)}
				/>
			)}
		</div>
	);
};

export default IntegrationTestSuite;
