// src/ui/pages/calculations/schedule/mobile/FieldProgressApp.tsx
import React, {useState, useEffect, useRef} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {
	CameraIcon,
	MapPinIcon,
	CheckCircleIcon,
	ClockIcon,
	ExclamationTriangleIcon,
	CloudArrowUpIcon,
	ArrowLeftIcon,
	MicrophoneIcon,
	StopIcon,
	XMarkIcon,
	WifiIcon,
	SignalSlashIcon,
} from "@heroicons/react/24/outline";
import {useFieldProgress} from "../../shared/hooks/useFieldProgress";
import {useGeolocation} from "../../shared/hooks/useGeolocation";
import {useOfflineSync} from "../../shared/hooks/useOfflineSync";

interface ActivityProgress {
	id: string;
	name: string;
	plannedProgress: number;
	actualProgress: number;
	status: "not_started" | "in_progress" | "completed" | "delayed";
	lastUpdate: Date;
}

interface ProgressEntry {
	id?: string;
	activityId: string;
	progress: number;
	photos: File[];
	notes: string;
	audioNote?: Blob;
	location?: GeolocationPosition;
	timestamp: Date;
	worker: string;
	quality: "good" | "needs_attention" | "defective";
}

const ActivityCard: React.FC<{
	activity: ActivityProgress;
	onProgressUpdate: (activityId: string, progress: number) => void;
}> = ({activity, onProgressUpdate}) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [quickProgress, setQuickProgress] = useState(activity.actualProgress);

	const getStatusColor = (status: string) => {
		switch (status) {
			case "completed":
				return "bg-green-100 border-green-300 text-green-800";
			case "in_progress":
				return "bg-blue-100 border-blue-300 text-blue-800";
			case "delayed":
				return "bg-red-100 border-red-300 text-red-800";
			default:
				return "bg-gray-100 border-gray-300 text-gray-800";
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "completed":
				return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
			case "in_progress":
				return <ClockIcon className="h-5 w-5 text-blue-600" />;
			case "delayed":
				return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />;
			default:
				return <div className="h-5 w-5 rounded-full bg-gray-400" />;
		}
	};

	const handleQuickUpdate = (value: number) => {
		setQuickProgress(value);
		onProgressUpdate(activity.id, value);
	};

	return (
		<div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-4">
			<div
				className="p-4 cursor-pointer"
				onClick={() => setIsExpanded(!isExpanded)}
			>
				<div className="flex items-center justify-between mb-3">
					<div className="flex items-center gap-3">
						{getStatusIcon(activity.status)}
						<h3 className="font-semibold text-gray-900 text-sm">
							{activity.name}
						</h3>
					</div>
					<div
						className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}
					>
						{activity.status.replace("_", " ").toUpperCase()}
					</div>
				</div>

				<div className="space-y-2">
					<div className="flex justify-between text-xs text-gray-600">
						<span>Progreso: {activity.actualProgress}%</span>
						<span>Planificado: {activity.plannedProgress}%</span>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-2">
						<div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
							<div
								className="absolute top-0 left-0 h-full bg-blue-200 rounded-full"
								style={{width: `${activity.plannedProgress}%`}}
							/>
							<div
								className="absolute top-0 left-0 h-full bg-blue-600 rounded-full"
								style={{width: `${activity.actualProgress}%`}}
							/>
						</div>
					</div>
				</div>
			</div>

			{isExpanded && (
				<div className="border-t border-gray-100 p-4 space-y-4">
					{/* Quick Progress Update */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Actualizar progreso rápido
						</label>
						<div className="grid grid-cols-4 gap-2">
							{[25, 50, 75, 100].map((value) => (
								<button
									key={value}
									onClick={() => handleQuickUpdate(value)}
									className={`p-2 rounded-lg text-sm font-medium transition-colors ${
										quickProgress === value
											? "bg-blue-600 text-white"
											: "bg-gray-100 text-gray-700 hover:bg-gray-200"
									}`}
								>
									{value}%
								</button>
							))}
						</div>
					</div>

					{/* Custom Progress */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Progreso personalizado
						</label>
						<input
							type="range"
							min="0"
							max="100"
							value={quickProgress}
							onChange={(e) => handleQuickUpdate(parseInt(e.target.value))}
							className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
						/>
					</div>

					<button
						onClick={() =>
							window.dispatchEvent(
								new CustomEvent("openProgressModal", {
									detail: {activityId: activity.id},
								})
							)
						}
						className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
					>
						Agregar Detalle Completo
					</button>
				</div>
			)}
		</div>
	);
};

const PhotoCapture: React.FC<{
	onPhotoCaptured: (file: File) => void;
	onClose: () => void;
}> = ({onPhotoCaptured, onClose}) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [stream, setStream] = useState<MediaStream | null>(null);
	const [isCapturing, setIsCapturing] = useState(false);

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
				video: {facingMode: "environment"},
				audio: false,
			});
			setStream(mediaStream);
			if (videoRef.current) {
				videoRef.current.srcObject = mediaStream;
			}
		} catch (error) {
			console.error("Error accessing camera:", error);
		}
	};

	const capturePhoto = () => {
		if (!videoRef.current || !canvasRef.current) return;

		const video = videoRef.current;
		const canvas = canvasRef.current;
		const context = canvas.getContext("2d");

		if (!context) return;

		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		context.drawImage(video, 0, 0);

		canvas.toBlob(
			(blob) => {
				if (blob) {
					const file = new File([blob], `progress_${Date.now()}.jpg`, {
						type: "image/jpeg",
					});
					onPhotoCaptured(file);
					onClose();
				}
			},
			"image/jpeg",
			0.8
		);
	};

	return (
		<div className="fixed inset-0 bg-black z-50 flex flex-col">
			<div className="flex items-center justify-between p-4">
				<button
					onClick={onClose}
					className="text-white p-2 rounded-full bg-black bg-opacity-50"
				>
					<XMarkIcon className="h-6 w-6" />
				</button>
				<h2 className="text-white font-medium">Capturar Progreso</h2>
				<div className="w-10" />
			</div>

			<div className="flex-1 relative">
				<video
					ref={videoRef}
					autoPlay
					playsInline
					className="w-full h-full object-cover"
				/>
				<canvas ref={canvasRef} className="hidden" />
			</div>

			<div className="p-6 flex justify-center">
				<button
					onClick={capturePhoto}
					disabled={isCapturing}
					className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg disabled:opacity-50"
				>
					<CameraIcon className="h-8 w-8 text-gray-800" />
				</button>
			</div>
		</div>
	);
};

const AudioRecorder: React.FC<{
	onAudioRecorded: (audio: Blob) => void;
	onClose: () => void;
}> = ({onAudioRecorded, onClose}) => {
	const [isRecording, setIsRecording] = useState(false);
	const [recordingTime, setRecordingTime] = useState(0);
	const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
		null
	);
	const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

	useEffect(() => {
		let interval: NodeJS.Timeout;
		if (isRecording) {
			interval = setInterval(() => {
				setRecordingTime((prev) => prev + 1);
			}, 1000);
		}
		return () => clearInterval(interval);
	}, [isRecording]);

	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({audio: true});
			const recorder = new MediaRecorder(stream);

			recorder.ondataavailable = (event) => {
				if (event.data.size > 0) {
					setAudioChunks((prev) => [...prev, event.data]);
				}
			};

			recorder.onstop = () => {
				const audioBlob = new Blob(audioChunks, {type: "audio/webm"});
				onAudioRecorded(audioBlob);
				stream.getTracks().forEach((track) => track.stop());
				onClose();
			};

			setMediaRecorder(recorder);
			setAudioChunks([]);
			recorder.start();
			setIsRecording(true);
		} catch (error) {
			console.error("Error accessing microphone:", error);
		}
	};

	const stopRecording = () => {
		if (mediaRecorder && isRecording) {
			mediaRecorder.stop();
			setIsRecording(false);
		}
	};

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
			<div className="bg-white rounded-2xl p-6 w-full max-w-sm">
				<div className="flex items-center justify-between mb-6">
					<h3 className="text-lg font-semibold">Grabar Nota de Voz</h3>
					<button onClick={onClose} className="text-gray-500">
						<XMarkIcon className="h-6 w-6" />
					</button>
				</div>

				<div className="text-center space-y-6">
					<div className="text-3xl font-mono text-red-600">
						{formatTime(recordingTime)}
					</div>

					<div className="flex justify-center">
						{!isRecording ? (
							<button
								onClick={startRecording}
								className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-red-700 transition-colors"
							>
								<MicrophoneIcon className="h-8 w-8" />
							</button>
						) : (
							<button
								onClick={stopRecording}
								className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-gray-700 transition-colors"
							>
								<StopIcon className="h-8 w-8" />
							</button>
						)}
					</div>

					<p className="text-sm text-gray-600">
						{isRecording
							? "Grabando... Toca para detener"
							: "Toca para comenzar a grabar"}
					</p>
				</div>
			</div>
		</div>
	);
};

const FieldProgressApp: React.FC = () => {
	const {projectId} = useParams<{projectId: string}>();
	const navigate = useNavigate();
	const {activities, syncProgress, submitProgress, loadActivities, isLoading} =
		useFieldProgress();
	const {location, requestLocation} = useGeolocation();
	const {isOnline, syncQueue, forcSync} = useOfflineSync();

	const [showPhotoCapture, setShowPhotoCapture] = useState(false);
	const [showAudioRecorder, setShowAudioRecorder] = useState(false);
	const [currentProgressEntry, setCurrentProgressEntry] =
		useState<ProgressEntry | null>(null);
	const [showProgressModal, setShowProgressModal] = useState(false);
	const [selectedActivityId, setSelectedActivityId] = useState<string>("");

	useEffect(() => {
		if (projectId) {
			loadActivities(projectId);
			requestLocation();
		}
	}, [projectId, loadActivities, requestLocation]);

	useEffect(() => {
		const handleOpenProgressModal = (event: any) => {
			setSelectedActivityId(event.detail.activityId);
			setShowProgressModal(true);
			setCurrentProgressEntry({
				activityId: event.detail.activityId,
				progress: 0,
				photos: [],
				notes: "",
				timestamp: new Date(),
				worker: "Campo", // This should come from user context
				quality: "good",
				location: location || undefined,
			});
		};

		window.addEventListener("openProgressModal", handleOpenProgressModal);
		return () =>
			window.removeEventListener("openProgressModal", handleOpenProgressModal);
	}, [location]);

	const handleProgressUpdate = async (activityId: string, progress: number) => {
		const entry: ProgressEntry = {
			activityId,
			progress,
			photos: [],
			notes: `Progreso actualizado a ${progress}%`,
			timestamp: new Date(),
			worker: "Campo",
			quality: "good",
			location: location || undefined,
		};

		await submitProgress(entry);
	};

	const handlePhotoCapture = (file: File) => {
		if (currentProgressEntry) {
			setCurrentProgressEntry({
				...currentProgressEntry,
				photos: [...currentProgressEntry.photos, file],
			});
		}
	};

	const handleAudioCapture = (audio: Blob) => {
		if (currentProgressEntry) {
			setCurrentProgressEntry({
				...currentProgressEntry,
				audioNote: audio,
			});
		}
	};

	const handleSubmitProgress = async () => {
		if (!currentProgressEntry) return;

		await submitProgress(currentProgressEntry);
		setShowProgressModal(false);
		setCurrentProgressEntry(null);
	};

	const renderConnectionStatus = () => (
		<div
			className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
				isOnline ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
			}`}
		>
			{isOnline ? (
				<>
					<WifiIcon className="h-4 w-4" />
					<span>Conectado</span>
				</>
			) : (
				<>
					<SignalSlashIcon className="h-4 w-4" />
					<span>Sin conexión</span>
				</>
			)}
			{syncQueue.length > 0 && (
				<span className="ml-2 bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs">
					{syncQueue.length} pendientes
				</span>
			)}
		</div>
	);

	const renderProgressModal = () => {
		if (!showProgressModal || !currentProgressEntry) return null;

		return (
			<div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-end">
				<div className="bg-white rounded-t-3xl w-full max-h-[90vh] overflow-y-auto">
					<div className="p-4 border-b border-gray-200">
						<div className="flex items-center justify-between">
							<h2 className="text-lg font-semibold">Registrar Progreso</h2>
							<button
								onClick={() => setShowProgressModal(false)}
								className="text-gray-500 p-1"
							>
								<XMarkIcon className="h-6 w-6" />
							</button>
						</div>
					</div>

					<div className="p-4 space-y-6">
						{/* Progress Slider */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Progreso ({currentProgressEntry.progress}%)
							</label>
							<input
								type="range"
								min="0"
								max="100"
								value={currentProgressEntry.progress}
								onChange={(e) =>
									setCurrentProgressEntry({
										...currentProgressEntry,
										progress: parseInt(e.target.value),
									})
								}
								className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
							/>
						</div>

						{/* Quality Selection */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Calidad del Trabajo
							</label>
							<div className="grid grid-cols-3 gap-2">
								{[
									{
										key: "good",
										label: "Buena",
										color: "bg-green-100 text-green-800",
									},
									{
										key: "needs_attention",
										label: "Atención",
										color: "bg-yellow-100 text-yellow-800",
									},
									{
										key: "defective",
										label: "Defectuosa",
										color: "bg-red-100 text-red-800",
									},
								].map((quality) => (
									<button
										key={quality.key}
										onClick={() =>
											setCurrentProgressEntry({
												...currentProgressEntry,
												quality: quality.key as any,
											})
										}
										className={`p-2 rounded-lg text-sm font-medium border-2 transition-colors ${
											currentProgressEntry.quality === quality.key
												? `${quality.color} border-current`
												: "bg-gray-50 text-gray-700 border-gray-200"
										}`}
									>
										{quality.label}
									</button>
								))}
							</div>
						</div>

						{/* Photos */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Fotos ({currentProgressEntry.photos.length})
							</label>
							<div className="flex gap-2 mb-2 overflow-x-auto">
								{currentProgressEntry.photos.map((photo, index) => (
									<div key={index} className="relative flex-shrink-0">
										<img
											src={URL.createObjectURL(photo)}
											alt={`Photo ${index + 1}`}
											className="w-16 h-16 object-cover rounded-lg"
										/>
									</div>
								))}
							</div>
							<button
								onClick={() => setShowPhotoCapture(true)}
								className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
							>
								<CameraIcon className="h-6 w-6 mx-auto mb-1" />
								Agregar Foto
							</button>
						</div>

						{/* Audio Note */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Nota de Voz
							</label>
							{currentProgressEntry.audioNote ? (
								<div className="bg-gray-100 p-3 rounded-lg">
									<p className="text-sm text-gray-600">Nota de voz grabada</p>
								</div>
							) : (
								<button
									onClick={() => setShowAudioRecorder(true)}
									className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
								>
									<MicrophoneIcon className="h-6 w-6 mx-auto mb-1" />
									Grabar Nota
								</button>
							)}
						</div>

						{/* Written Notes */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Notas Escritas
							</label>
							<textarea
								value={currentProgressEntry.notes}
								onChange={(e) =>
									setCurrentProgressEntry({
										...currentProgressEntry,
										notes: e.target.value,
									})
								}
								rows={3}
								className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								placeholder="Detalles adicionales, observaciones, etc."
							/>
						</div>

						{/* Location Info */}
						{location && (
							<div className="bg-blue-50 p-3 rounded-lg">
								<div className="flex items-center gap-2 text-blue-800">
									<MapPinIcon className="h-4 w-4" />
									<span className="text-sm">Ubicación registrada</span>
								</div>
							</div>
						)}

						{/* Submit Button */}
						<button
							onClick={handleSubmitProgress}
							className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
						>
							{isOnline ? "Guardar Progreso" : "Guardar (se sincronizará)"}
						</button>
					</div>
				</div>
			</div>
		);
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Cargando actividades...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white border-b border-gray-200 sticky top-0 z-30">
				<div className="flex items-center justify-between p-4">
					<div className="flex items-center gap-3">
						<button
							onClick={() => navigate(-1)}
							className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
						>
							<ArrowLeftIcon className="h-5 w-5" />
						</button>
						<div>
							<h1 className="font-semibold text-gray-900">Progreso de Campo</h1>
							<p className="text-sm text-gray-600">
								{activities.length} actividades
							</p>
						</div>
					</div>
					{renderConnectionStatus()}
				</div>
			</div>

			{/* Activities List */}
			<div className="p-4 space-y-4">
				{activities.map((activity) => (
					<ActivityCard
						key={activity.id}
						activity={activity}
						onProgressUpdate={handleProgressUpdate}
					/>
				))}
			</div>

			{/* Sync Button */}
			{!isOnline && syncQueue.length > 0 && (
				<div className="fixed bottom-4 right-4">
					<button
						onClick={forcSync}
						className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
					>
						<CloudArrowUpIcon className="h-6 w-6" />
					</button>
				</div>
			)}

			{/* Modals */}
			{renderProgressModal()}

			{showPhotoCapture && (
				<PhotoCapture
					onPhotoCaptured={handlePhotoCapture}
					onClose={() => setShowPhotoCapture(false)}
				/>
			)}

			{showAudioRecorder && (
				<AudioRecorder
					onAudioRecorded={handleAudioCapture}
					onClose={() => setShowAudioRecorder(false)}
				/>
			)}
		</div>
	);
};

export default FieldProgressApp;
