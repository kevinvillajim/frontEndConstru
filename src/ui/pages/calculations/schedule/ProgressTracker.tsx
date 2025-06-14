// src/ui/pages/calculations/schedule/ProgressTracker.tsx
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CameraIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CloudArrowUpIcon,
  ArrowLeftIcon,
  PlayIcon,
  PauseIcon,
  DocumentTextIcon,
  UserIcon,
  CalendarDaysIcon,
  WifiIcon,
  SignalSlashIcon,
  PhotoIcon,
  MicrophoneIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";
import { LoadingSpinner, ProgressBar, Badge, Alert } from "../shared/components/SharedComponents";
import { useProgressTracking } from "../shared/hooks/useProgressTracking";

// Types
interface ProgressFormData {
  activityId: string;
  progress: number;
  description: string;
  photos: File[];
  issues: string;
  materials: string[];
  equipment: string[];
  weather: string;
  workers: string[];
  notes: string;
  location: string;
}

interface ActivityProgress {
  id: string;
  name: string;
  currentProgress: number;
  targetProgress: number;
  status: "on_track" | "behind" | "ahead" | "blocked";
  lastUpdate: Date;
  assignedWorkers: string[];
  phase: string;
}

const WEATHER_OPTIONS = [
  { value: "sunny", label: "Soleado", icon: "☀️" },
  { value: "cloudy", label: "Nublado", icon: "☁️" },
  { value: "rainy", label: "Lluvioso", icon: "🌧️" },
  { value: "stormy", label: "Tormenta", icon: "⛈️" },
];

const COMMON_MATERIALS = [
  "Cemento", "Arena", "Grava", "Hierro", "Ladrillos", 
  "Tubería PVC", "Cable eléctrico", "Madera", "Clavos", "Herramientas"
];

const COMMON_EQUIPMENT = [
  "Mezcladora", "Taladro", "Sierra", "Grúa", "Montacargas",
  "Compresor", "Soldadora", "Andamios", "Carretilla", "Escalera"
];

const ProgressTracker: React.FC = () => {
  const { scheduleId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const {
    progressEntries,
    alerts,
    isSubmitting,
    isOnline,
    submitProgress,
    uploadPhoto,
    resolveAlert,
    syncPendingProgress,
  } = useProgressTracking();

  const [activities, setActivities] = useState<ActivityProgress[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<ActivityProgress | null>(null);
  const [formData, setFormData] = useState<ProgressFormData>({
    activityId: "",
    progress: 0,
    description: "",
    photos: [],
    issues: "",
    materials: [],
    equipment: [],
    weather: "sunny",
    workers: [],
    notes: "",
    location: "",
  });
  const [cameraMode, setCameraMode] = useState<"photo" | "video" | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<Blob | null>(null);

  useEffect(() => {
    loadActivities();
    getCurrentLocation();
    
    // Set up online/offline detection
    const handleOnline = () => syncPendingProgress();
    window.addEventListener('online', handleOnline);
    
    return () => window.removeEventListener('online', handleOnline);
  }, [scheduleId]);

  const loadActivities = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockActivities: ActivityProgress[] = [
        {
          id: "act-1",
          name: "Excavación y Cimentación",
          currentProgress: 85,
          targetProgress: 90,
          status: "behind",
          lastUpdate: new Date(2024, 6, 13, 16, 30),
          assignedWorkers: ["Juan Pérez", "María López"],
          phase: "Estructural",
        },
        {
          id: "act-2",
          name: "Estructura Nivel 1-3",
          currentProgress: 45,
          targetProgress: 40,
          status: "ahead",
          lastUpdate: new Date(2024, 6, 12, 14, 15),
          assignedWorkers: ["Carlos Mendoza", "Ana García"],
          phase: "Estructural",
        },
        {
          id: "act-3",
          name: "Instalaciones Eléctricas Nivel 1",
          currentProgress: 20,
          targetProgress: 25,
          status: "behind",
          lastUpdate: new Date(2024, 6, 11, 10, 0),
          assignedWorkers: ["Roberto Silva"],
          phase: "Instalaciones",
        },
      ];
      
      setActivities(mockActivities);
    } catch (error) {
      console.error("Error loading activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData(prev => ({
            ...prev,
            location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
          setFormData(prev => ({
            ...prev,
            location: "Ubicación no disponible",
          }));
        }
      );
    }
  };

  const handleActivitySelect = (activity: ActivityProgress) => {
    setSelectedActivity(activity);
    setFormData(prev => ({
      ...prev,
      activityId: activity.id,
      progress: activity.currentProgress,
      workers: activity.assignedWorkers,
    }));
    setShowForm(true);
  };

  const handlePhotoCapture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...files],
    }));
  };

  const startCamera = async (mode: "photo" | "video") => {
    setCameraMode(mode);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: mode === "video" 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("No se pudo acceder a la cámara");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
            setFormData(prev => ({
              ...prev,
              photos: [...prev.photos, file],
            }));
          }
        });
      }
    }
    setCameraMode(null);
  };

  const startVideoRecording = async () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        setRecordedVideo(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Auto-stop after 30 seconds
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
          setIsRecording(false);
        }
      }, 30000);
    }
  };

  const stopVideoRecording = () => {
    setIsRecording(false);
    setCameraMode(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedActivity) return;

    try {
      // Upload photos first
      const photoUrls = [];
      for (const photo of formData.photos) {
        const url = await uploadPhoto(photo);
        photoUrls.push(url);
      }

      // Submit progress entry
      await submitProgress({
        activityId: formData.activityId,
        date: new Date(),
        progress: formData.progress,
        description: formData.description,
        photos: photoUrls,
        worker: "Usuario Actual", // This would come from auth context
        workerId: "current-user",
        location: formData.location,
        weather: formData.weather,
        issues: formData.issues || undefined,
        materials: formData.materials.length > 0 ? formData.materials : undefined,
        equipment: formData.equipment.length > 0 ? formData.equipment : undefined,
      });

      // Update activity progress
      setActivities(prev => prev.map(activity => 
        activity.id === formData.activityId 
          ? { 
              ...activity, 
              currentProgress: formData.progress, 
              lastUpdate: new Date(),
              status: getProgressStatus(formData.progress, activity.targetProgress)
            }
          : activity
      ));

      // Reset form
      setFormData({
        activityId: "",
        progress: 0,
        description: "",
        photos: [],
        issues: "",
        materials: [],
        equipment: [],
        weather: "sunny",
        workers: [],
        notes: "",
        location: "",
      });
      
      setShowForm(false);
      setSelectedActivity(null);
      
    } catch (error) {
      console.error("Error submitting progress:", error);
      alert("Error al enviar el progreso. Se guardó localmente para sincronizar más tarde.");
    }
  };

  const getProgressStatus = (current: number, target: number): ActivityProgress["status"] => {
    const difference = current - target;
    if (difference >= 5) return "ahead";
    if (difference <= -10) return "behind";
    if (difference <= -5) return "behind";
    return "on_track";
  };

  const getStatusColor = (status: ActivityProgress["status"]) => {
    switch (status) {
      case "ahead": return "text-green-600 bg-green-100";
      case "on_track": return "text-blue-600 bg-blue-100";
      case "behind": return "text-red-600 bg-red-100";
      case "blocked": return "text-gray-600 bg-gray-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = (status: ActivityProgress["status"]) => {
    switch (status) {
      case "ahead": return "Adelantado";
      case "on_track": return "En tiempo";
      case "behind": return "Retrasado";
      case "blocked": return "Bloqueado";
      default: return "Desconocido";
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/calculations/schedule")}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Seguimiento de Progreso
                </h1>
                <p className="text-sm text-gray-600">
                  Captura avances desde el campo
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Online/Offline Indicator */}
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                isOnline ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}>
                {isOnline ? (
                  <WifiIcon className="h-4 w-4" />
                ) : (
                  <SignalSlashIcon className="h-4 w-4" />
                )}
                {isOnline ? "En línea" : "Sin conexión"}
              </div>

              {/* Sync Button */}
              {!isOnline && (
                <button
                  onClick={syncPendingProgress}
                  className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <CloudArrowUpIcon className="h-4 w-4 inline mr-1" />
                  Sincronizar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Offline Alert */}
        {!isOnline && (
          <Alert variant="warning" className="mb-6">
            <SignalSlashIcon className="h-5 w-5" />
            <div>
              <strong>Modo Sin Conexión</strong>
              <p className="text-sm mt-1">
                Los datos se guardarán localmente y se sincronizarán cuando recuperes la conexión.
              </p>
            </div>
          </Alert>
        )}

        {/* Active Alerts */}
        {alerts.filter(a => !a.resolved).length > 0 && (
          <div className="mb-6 space-y-3">
            {alerts.filter(a => !a.resolved).map((alert) => (
              <Alert
                key={alert.id}
                variant={alert.severity === "high" || alert.severity === "critical" ? "error" : "warning"}
              >
                <ExclamationTriangleIcon className="h-5 w-5" />
                <div className="flex-1">
                  <strong>{alert.message}</strong>
                  <p className="text-sm mt-1">
                    {alert.timestamp.toLocaleString('es-EC')}
                  </p>
                </div>
                <button
                  onClick={() => resolveAlert(alert.id)}
                  className="text-sm font-medium hover:underline"
                >
                  Resolver
                </button>
              </Alert>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Activities List */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Actividades del Día
              </h2>
              
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedActivity?.id === activity.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => handleActivitySelect(activity)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{activity.name}</h3>
                      <Badge className={getStatusColor(activity.status)}>
                        {getStatusText(activity.status)}
                      </Badge>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progreso: {activity.currentProgress}%</span>
                        <span>Objetivo: {activity.targetProgress}%</span>
                      </div>
                      <ProgressBar
                        progress={activity.currentProgress}
                        color={
                          activity.status === "ahead" ? "green" :
                          activity.status === "behind" ? "red" : "blue"
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <UserIcon className="h-4 w-4" />
                        {activity.assignedWorkers.length} trabajadores
                      </span>
                      <span className="flex items-center gap-1">
                        <ClockIcon className="h-4 w-4" />
                        {activity.lastUpdate.toLocaleDateString('es-EC')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Progress Form */}
          <div className="space-y-6">
            {showForm && selectedActivity ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Actualizar Progreso
                  </h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Activity Info */}
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-blue-900">{selectedActivity.name}</h3>
                    <p className="text-sm text-blue-700">{selectedActivity.phase}</p>
                  </div>

                  {/* Progress Slider */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Progreso Actual: {formData.progress}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={formData.progress}
                      onChange={(e) => setFormData(prev => ({ ...prev, progress: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0%</span>
                      <span>Objetivo: {selectedActivity.targetProgress}%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción del Avance *
                    </label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Describe el trabajo realizado, avances logrados..."
                    />
                  </div>

                  {/* Photos */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Evidencia Fotográfica
                    </label>
                    
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                      >
                        <PhotoIcon className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-600">Subir Fotos</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => startCamera("photo")}
                        className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                      >
                        <CameraIcon className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-600">Tomar Foto</span>
                      </button>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoCapture}
                      className="hidden"
                    />

                    {/* Photo Preview */}
                    {formData.photos.length > 0 && (
                      <div className="grid grid-cols-3 gap-2">
                        {formData.photos.map((photo, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(photo)}
                              alt={`Foto ${index + 1}`}
                              className="w-full h-20 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removePhoto(index)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Weather */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Condiciones Climáticas
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {WEATHER_OPTIONS.map((weather) => (
                        <button
                          key={weather.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, weather: weather.value }))}
                          className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                            formData.weather === weather.value
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          <span className="text-lg">{weather.icon}</span>
                          <span className="text-sm">{weather.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Issues */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Problemas o Inconvenientes
                    </label>
                    <textarea
                      value={formData.issues}
                      onChange={(e) => setFormData(prev => ({ ...prev, issues: e.target.value }))}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Describe cualquier problema encontrado..."
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ubicación
                    </label>
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-600">{formData.location}</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <LoadingSpinner size="sm" className="mx-auto" />
                      ) : (
                        "Enviar Progreso"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                <ClockIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Selecciona una Actividad
                </h3>
                <p className="text-gray-600">
                  Elige una actividad de la lista para actualizar su progreso
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Camera Modal */}
        {cameraMode && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {cameraMode === "photo" ? "Tomar Foto" : "Grabar Video"}
                </h3>
              </div>
              
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full rounded-lg mb-4"
              />
              
              <div className="flex gap-3">
                <button
                  onClick={() => setCameraMode(null)}
                  className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                {cameraMode === "photo" ? (
                  <button
                    onClick={capturePhoto}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <CameraIcon className="h-5 w-5 inline mr-2" />
                    Capturar
                  </button>
                ) : (
                  <button
                    onClick={isRecording ? stopVideoRecording : startVideoRecording}
                    className={`flex-1 px-4 py-3 rounded-lg transition-colors ${
                      isRecording 
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {isRecording ? (
                      <>
                        <PauseIcon className="h-5 w-5 inline mr-2" />
                        Detener
                      </>
                    ) : (
                      <>
                        <PlayIcon className="h-5 w-5 inline mr-2" />
                        Grabar
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressTracker;