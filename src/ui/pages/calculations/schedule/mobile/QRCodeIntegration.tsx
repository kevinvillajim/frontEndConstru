// src/ui/pages/calculations/schedule/mobile/QRCodeIntegration.tsx
import React, {useState, useEffect, useRef} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {
	QrCodeIcon,
	CameraIcon,
	CheckCircleIcon,
	MapPinIcon,
	ClockIcon,
	UserIcon,
	XMarkIcon,
	ArrowLeftIcon,
	DocumentTextIcon,
	PhotoIcon,
	PrinterIcon,
} from "@heroicons/react/24/outline";
import {useQRCodeTracking} from "../../shared/hooks/useQRCodeTracking";
import {useGeolocation} from "../../shared/hooks/useGeolocation";

interface QRActivity {
	id: string;
	name: string;
	qrCode: string;
	location: string;
	expectedLocation: {
		latitude: number;
		longitude: number;
		radius: number; // meters
	};
	status: "pending" | "in_progress" | "completed";
	lastScan?: Date;
	scanHistory: QRScan[];
}

interface QRScan {
	id: string;
	timestamp: Date;
	worker: string;
	location: GeolocationPosition;
	photos: string[];
	notes: string;
	verified: boolean;
}

interface QRGeneratorProps {
	activities: QRActivity[];
	onGenerate: (activityId: string) => void;
	onPrint: (activityId: string) => void;
}

const QRScanner: React.FC<{
	onScanSuccess: (data: string) => void;
	onClose: () => void;
}> = ({onScanSuccess, onClose}) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [stream, setStream] = useState<MediaStream | null>(null);
	const [scanning, setScanning] = useState(false);
	const [error, setError] = useState<string>("");

	useEffect(() => {
		startCamera();
		return () => {
			if (stream) {
				stream.getTracks().forEach((track) => track.stop());
			}
		};
	}, []);

	const startCamera = async () => {
		try {
			const mediaStream = await navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: "environment",
					width: {ideal: 1280},
					height: {ideal: 720},
				},
			});
			setStream(mediaStream);
			if (videoRef.current) {
				videoRef.current.srcObject = mediaStream;
				videoRef.current.play();
			}
			startScanning();
		} catch (err) {
			setError("No se pudo acceder a la cámara");
			console.error("Camera error:", err);
		}
	};

	const startScanning = () => {
		setScanning(true);
		scanFrame();
	};

	const scanFrame = () => {
		if (!videoRef.current || !canvasRef.current || !scanning) return;

		const video = videoRef.current;
		const canvas = canvasRef.current;
		const context = canvas.getContext("2d");

		if (!context) return;

		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		context.drawImage(video, 0, 0);

		try {
			const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
			const qrCode = scanQRFromImageData(imageData);

			if (qrCode) {
				setScanning(false);
				onScanSuccess(qrCode);
				return;
			}
		} catch (err) {
			console.error("QR scan error:", err);
		}

		if (scanning) {
			requestAnimationFrame(scanFrame);
		}
	};

	// Simplified QR detection - in real implementation, use a library like jsQR
	const scanQRFromImageData = (imageData: ImageData): string | null => {
		// This is a placeholder - implement actual QR code detection
		// In production, use a library like jsQR or zxing-js
		return null;
	};

	return (
		<div className="fixed inset-0 bg-black z-50">
			<div className="flex items-center justify-between p-4 bg-black bg-opacity-75">
				<button
					onClick={onClose}
					className="text-white p-2 rounded-full bg-black bg-opacity-50"
				>
					<XMarkIcon className="h-6 w-6" />
				</button>
				<h2 className="text-white font-medium">Escanear Código QR</h2>
				<div className="w-10" />
			</div>

			<div className="flex-1 relative">
				<video
					ref={videoRef}
					className="w-full h-full object-cover"
					playsInline
				/>
				<canvas ref={canvasRef} className="hidden" />

				{/* Scanning overlay */}
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="w-64 h-64 border-2 border-white rounded-lg relative">
						<div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-lg" />
						<div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-lg" />
						<div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-lg" />
						<div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-lg" />

						{scanning && (
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="w-full h-1 bg-blue-500 animate-pulse" />
							</div>
						)}
					</div>
				</div>

				<div className="absolute bottom-20 left-0 right-0 text-center text-white">
					<p>Centra el código QR dentro del marco</p>
				</div>
			</div>

			{error && (
				<div className="absolute bottom-4 left-4 right-4 bg-red-600 text-white p-3 rounded-lg">
					{error}
				</div>
			)}
		</div>
	);
};

const QRGenerator: React.FC<QRGeneratorProps> = ({
	activities,
	onGenerate,
	onPrint,
}) => {
	const [selectedActivity, setSelectedActivity] = useState<string>("");
	const [generatedCodes, setGeneratedCodes] = useState<Map<string, string>>(
		new Map()
	);

	const generateQRCode = (activityId: string, activityName: string): string => {
		// In production, use a QR code generation library
		const qrData = {
			type: "CONSTRU_ACTIVITY",
			activityId,
			activityName,
			timestamp: Date.now(),
			projectId: "current-project", // Get from context
		};

		return btoa(JSON.stringify(qrData));
	};

	const handleGenerate = (activityId: string) => {
		const activity = activities.find((a) => a.id === activityId);
		if (!activity) return;

		const qrCode = generateQRCode(activityId, activity.name);
		setGeneratedCodes(new Map(generatedCodes.set(activityId, qrCode)));
		onGenerate(activityId);
	};

	const handlePrint = (activityId: string) => {
		const qrCode = generatedCodes.get(activityId);
		if (!qrCode) return;

		// Generate printable QR code
		const printWindow = window.open("", "_blank");
		if (printWindow) {
			const activity = activities.find((a) => a.id === activityId);
			printWindow.document.write(`
        <html>
          <head>
            <title>Código QR - ${activity?.name}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                text-align: center; 
                padding: 20px; 
              }
              .qr-container { 
                border: 2px solid #000; 
                padding: 20px; 
                margin: 20px auto; 
                max-width: 300px; 
              }
              .qr-code { 
                width: 200px; 
                height: 200px; 
                margin: 20px auto; 
                background: url('data:image/svg+xml;base64,${btoa(`
                  <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
                    <rect width="200" height="200" fill="white"/>
                    <text x="100" y="100" text-anchor="middle" font-size="12">QR Code</text>
                  </svg>
                `)}'); 
              }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <h2>${activity?.name}</h2>
              <div class="qr-code"></div>
              <p>Ubicación: ${activity?.location}</p>
              <p>Código: ${activityId}</p>
            </div>
          </body>
        </html>
      `);
			printWindow.document.close();
			printWindow.print();
		}

		onPrint(activityId);
	};

	return (
		<div className="bg-white rounded-2xl border border-gray-200 p-6">
			<h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
				<QrCodeIcon className="h-5 w-5 text-blue-600" />
				Generar Códigos QR
			</h2>

			<div className="space-y-4">
				{activities.map((activity) => (
					<div
						key={activity.id}
						className="border border-gray-200 rounded-lg p-4"
					>
						<div className="flex items-center justify-between mb-3">
							<div>
								<h3 className="font-medium text-gray-900">{activity.name}</h3>
								<p className="text-sm text-gray-600">{activity.location}</p>
							</div>
							<div className="flex gap-2">
								{generatedCodes.has(activity.id) ? (
									<>
										<button
											onClick={() => handlePrint(activity.id)}
											className="flex items-center gap-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition-colors"
										>
											<PrinterIcon className="h-4 w-4" />
											Imprimir
										</button>
										<div className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm">
											<CheckCircleIcon className="h-4 w-4 text-green-600" />
											Generado
										</div>
									</>
								) : (
									<button
										onClick={() => handleGenerate(activity.id)}
										className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
									>
										<QrCodeIcon className="h-4 w-4" />
										Generar
									</button>
								)}
							</div>
						</div>

						{generatedCodes.has(activity.id) && (
							<div className="mt-3 p-3 bg-gray-50 rounded-lg">
								<div className="text-xs text-gray-600 break-all">
									Código: {generatedCodes.get(activity.id)}
								</div>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

const ActivityScanResult: React.FC<{
	activity: QRActivity;
	scan: QRScan;
	onUpdateProgress: (activityId: string, progress: number) => void;
	onAddPhotos: (scanId: string, photos: File[]) => void;
	onAddNotes: (scanId: string, notes: string) => void;
}> = ({activity, scan, onUpdateProgress, onAddPhotos, onAddNotes}) => {
	const [progress, setProgress] = useState(0);
	const [notes, setNotes] = useState(scan.notes);
	const [photos, setPhotos] = useState<File[]>([]);

	const handleProgressUpdate = () => {
		onUpdateProgress(activity.id, progress);
	};

	const handleNotesUpdate = () => {
		onAddNotes(scan.id, notes);
	};

	const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(event.target.files || []);
		setPhotos([...photos, ...files]);
		onAddPhotos(scan.id, files);
	};

	return (
		<div className="bg-white rounded-2xl border border-gray-200 p-6">
			<div className="flex items-center gap-3 mb-4">
				<CheckCircleIcon className="h-8 w-8 text-green-600" />
				<div>
					<h2 className="text-lg font-semibold text-gray-900">
						Escaneo Exitoso
					</h2>
					<p className="text-sm text-gray-600">{activity.name}</p>
				</div>
			</div>

			<div className="space-y-4">
				{/* Location Verification */}
				<div
					className={`p-3 rounded-lg ${scan.verified ? "bg-green-50" : "bg-yellow-50"}`}
				>
					<div className="flex items-center gap-2">
						<MapPinIcon
							className={`h-4 w-4 ${scan.verified ? "text-green-600" : "text-yellow-600"}`}
						/>
						<span
							className={`text-sm font-medium ${scan.verified ? "text-green-800" : "text-yellow-800"}`}
						>
							{scan.verified ? "Ubicación verificada" : "Ubicación aproximada"}
						</span>
					</div>
				</div>

				{/* Progress Update */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Actualizar progreso ({progress}%)
					</label>
					<input
						type="range"
						min="0"
						max="100"
						value={progress}
						onChange={(e) => setProgress(parseInt(e.target.value))}
						className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
					/>
					<button
						onClick={handleProgressUpdate}
						className="mt-2 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
					>
						Actualizar Progreso
					</button>
				</div>

				{/* Photo Upload */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Agregar Fotos
					</label>
					<input
						type="file"
						multiple
						accept="image/*"
						onChange={handlePhotoUpload}
						className="hidden"
						id="photo-upload"
					/>
					<label
						htmlFor="photo-upload"
						className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors cursor-pointer flex items-center justify-center gap-2"
					>
						<PhotoIcon className="h-5 w-5" />
						Seleccionar Fotos
					</label>
					{photos.length > 0 && (
						<div className="mt-2 text-sm text-gray-600">
							{photos.length} foto(s) seleccionada(s)
						</div>
					)}
				</div>

				{/* Notes */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Notas Adicionales
					</label>
					<textarea
						value={notes}
						onChange={(e) => setNotes(e.target.value)}
						rows={3}
						className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						placeholder="Observaciones, problemas encontrados, etc."
					/>
					<button
						onClick={handleNotesUpdate}
						className="mt-2 w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
					>
						Guardar Notas
					</button>
				</div>

				{/* Scan Details */}
				<div className="bg-gray-50 rounded-lg p-3">
					<h4 className="font-medium text-gray-900 mb-2">
						Detalles del Escaneo
					</h4>
					<div className="space-y-1 text-sm text-gray-600">
						<div className="flex items-center gap-2">
							<ClockIcon className="h-4 w-4" />
							<span>Escaneado: {scan.timestamp.toLocaleString("es-EC")}</span>
						</div>
						<div className="flex items-center gap-2">
							<UserIcon className="h-4 w-4" />
							<span>Trabajador: {scan.worker}</span>
						</div>
						<div className="flex items-center gap-2">
							<MapPinIcon className="h-4 w-4" />
							<span>
								Coordenadas: {scan.location.coords.latitude.toFixed(6)},{" "}
								{scan.location.coords.longitude.toFixed(6)}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const QRCodeIntegration: React.FC = () => {
	const {projectId} = useParams<{projectId: string}>();
	const navigate = useNavigate();
	const {
		activities,
		scanActivity,
		updateActivityProgress,
		generateQRCodes,
		loadQRActivities,
		isLoading,
	} = useQRCodeTracking();
	const {location, requestLocation} = useGeolocation();

	const [showScanner, setShowScanner] = useState(false);
	const [showGenerator, setShowGenerator] = useState(false);
	const [scanResult, setScanResult] = useState<{
		activity: QRActivity;
		scan: QRScan;
	} | null>(null);
	const [activeTab, setActiveTab] = useState<"scan" | "generate" | "history">(
		"scan"
	);

	useEffect(() => {
		if (projectId) {
			loadQRActivities(projectId);
			requestLocation();
		}
	}, [projectId, loadQRActivities, requestLocation]);

	const handleScanSuccess = async (qrData: string) => {
		try {
			const data = JSON.parse(atob(qrData));
			if (data.type === "CONSTRU_ACTIVITY") {
				const result = await scanActivity(data.activityId, location);
				setScanResult(result);
				setShowScanner(false);
			}
		} catch (error) {
			console.error("Invalid QR code:", error);
		}
	};

	const handleUpdateProgress = async (activityId: string, progress: number) => {
		await updateActivityProgress(activityId, progress);
		// Refresh activities
		if (projectId) {
			loadQRActivities(projectId);
		}
	};

	const handleAddPhotos = async (scanId: string, photos: File[]) => {
		// Implementation for adding photos to scan
		console.log("Adding photos to scan:", scanId, photos);
	};

	const handleAddNotes = async (scanId: string, notes: string) => {
		// Implementation for adding notes to scan
		console.log("Adding notes to scan:", scanId, notes);
	};

	const renderTabContent = () => {
		switch (activeTab) {
			case "scan":
				return (
					<div className="space-y-6">
						<div className="text-center py-8">
							<QrCodeIcon className="h-16 w-16 text-blue-600 mx-auto mb-4" />
							<h2 className="text-xl font-semibold text-gray-900 mb-2">
								Escanear Actividad
							</h2>
							<p className="text-gray-600 mb-6">
								Escanea el código QR de una actividad para registrar progreso
							</p>
							<button
								onClick={() => setShowScanner(true)}
								className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
							>
								<CameraIcon className="h-5 w-5" />
								Abrir Escáner
							</button>
						</div>

						{scanResult && (
							<ActivityScanResult
								activity={scanResult.activity}
								scan={scanResult.scan}
								onUpdateProgress={handleUpdateProgress}
								onAddPhotos={handleAddPhotos}
								onAddNotes={handleAddNotes}
							/>
						)}
					</div>
				);

			case "generate":
				return (
					<QRGenerator
						activities={activities}
						onGenerate={generateQRCodes}
						onPrint={(activityId) => console.log("Print QR for:", activityId)}
					/>
				);

			case "history":
				return (
					<div className="bg-white rounded-2xl border border-gray-200 p-6">
						<h2 className="text-lg font-semibold text-gray-900 mb-4">
							Historial de Escaneos
						</h2>
						<div className="space-y-4">
							{activities.map((activity) => (
								<div
									key={activity.id}
									className="border border-gray-200 rounded-lg p-4"
								>
									<div className="flex items-center justify-between mb-2">
										<h3 className="font-medium text-gray-900">
											{activity.name}
										</h3>
										<span
											className={`px-2 py-1 rounded-full text-xs font-medium ${
												activity.status === "completed"
													? "bg-green-100 text-green-800"
													: activity.status === "in_progress"
														? "bg-blue-100 text-blue-800"
														: "bg-gray-100 text-gray-800"
											}`}
										>
											{activity.status.replace("_", " ").toUpperCase()}
										</span>
									</div>
									<p className="text-sm text-gray-600 mb-2">
										{activity.location}
									</p>
									{activity.lastScan && (
										<p className="text-xs text-gray-500">
											Último escaneo:{" "}
											{activity.lastScan.toLocaleString("es-EC")}
										</p>
									)}
									<div className="mt-2 text-xs text-gray-500">
										{activity.scanHistory.length} escaneo(s) total
									</div>
								</div>
							))}
						</div>
					</div>
				);

			default:
				return null;
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Cargando sistema QR...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white border-b border-gray-200">
				<div className="flex items-center justify-between p-4">
					<div className="flex items-center gap-3">
						<button
							onClick={() => navigate(-1)}
							className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
						>
							<ArrowLeftIcon className="h-5 w-5" />
						</button>
						<div>
							<h1 className="text-lg font-semibold text-gray-900">
								Seguimiento QR
							</h1>
							<p className="text-sm text-gray-600">
								Trazabilidad completa de actividades
							</p>
						</div>
					</div>
				</div>

				{/* Tabs */}
				<div className="flex border-t border-gray-200">
					{[
						{key: "scan", label: "Escanear", icon: QrCodeIcon},
						{key: "generate", label: "Generar", icon: DocumentTextIcon},
						{key: "history", label: "Historial", icon: ClockIcon},
					].map((tab) => (
						<button
							key={tab.key}
							onClick={() => setActiveTab(tab.key as typeof activeTab)}
							className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
								activeTab === tab.key
									? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
									: "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
							}`}
						>
							<tab.icon className="h-4 w-4" />
							{tab.label}
						</button>
					))}
				</div>
			</div>

			{/* Content */}
			<div className="p-4">{renderTabContent()}</div>

			{/* QR Scanner Modal */}
			{showScanner && (
				<QRScanner
					onScanSuccess={handleScanSuccess}
					onClose={() => setShowScanner(false)}
				/>
			)}
		</div>
	);
};

export default QRCodeIntegration;
