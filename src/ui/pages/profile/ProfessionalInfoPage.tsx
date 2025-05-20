import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../context/AuthContext";
import ToastService from "../../components/common/ToastService";

// Tipo para la educación
interface EducationItem {
  institution: string;
  degree: string;
  graduationYear: string;
}

// Definir el esquema de validación con Zod
const professionalInfoSchema = z.object({
  professionalType: z.enum([
    "architect",
    "civil_engineer",
    "constructor",
    "contractor",
    "electrician",
    "plumber",
    "designer",
    "other",
  ]),
  companyName: z.string().optional(),
  position: z.string().optional(),
  licenseNumber: z.string().optional(),
  professionalBio: z.string().max(500, "La biografía no debe exceder los 500 caracteres").optional(),
  website: z.string().url("Ingresa una URL válida").optional().or(z.literal("")),
  yearsOfExperience: z.string().optional(),
});

// Tipo para los valores del formulario
type ProfessionalInfoFormValues = z.infer<typeof professionalInfoSchema>;

const ProfessionalInfoPage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [newSpecialty, setNewSpecialty] = useState("");
  const [education, setEducation] = useState<EducationItem[]>([]);

  // Configurar react-hook-form con validación de Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ProfessionalInfoFormValues>({
    resolver: zodResolver(professionalInfoSchema),
    defaultValues: {
      professionalType: (user?.professionalType as ProfessionalInfoFormValues["professionalType"]) || "architect",
      companyName: user?.company?.name || "",
      position: user?.company?.position || "",
      licenseNumber: user?.nationalId || "", // Usando nationalId como licenseNumber
      professionalBio: user?.bio || "",
      website: user?.socialLinks?.website || "",
      yearsOfExperience: user?.yearsOfExperience?.toString() || "",
    },
  });

  // Inicializar datos de educación y especialidades desde el usuario
  useEffect(() => {
    if (user) {
      if (user.specializations) {
        setSpecialties(user.specializations);
      }
      if (user.certifications) {
        // Usar certifications como educación (ejemplo)
        setEducation(
          user.certifications.map((cert) => ({
            institution: "Institución",
            degree: cert,
            graduationYear: "-"
          }))
        );
      }
    }
  }, [user]);

  // Manejar el envío del formulario
  const onSubmit = async (data: ProfessionalInfoFormValues) => {
    setIsLoading(true);
    
    try {
      // Aquí iría la llamada al backend para actualizar la información
      console.log("Datos a enviar:", {
        ...data,
        specialties,
        education
      });
      
      // Simular un delay para la demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      ToastService.success("Información profesional actualizada correctamente");
      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar información profesional:", error);
      ToastService.error("Error al actualizar la información profesional");
    } finally {
      setIsLoading(false);
    }
  };

  // Agregar una nueva especialidad
  const handleAddSpecialty = () => {
    if (newSpecialty && !specialties.includes(newSpecialty)) {
      setSpecialties([...specialties, newSpecialty]);
      setNewSpecialty("");
    }
  };

  // Eliminar una especialidad
  const handleRemoveSpecialty = (specialty: string) => {
    setSpecialties(specialties.filter(item => item !== specialty));
  };

  // Agregar un nuevo registro de educación
  const handleAddEducation = () => {
    setEducation([...education, { institution: "", degree: "", graduationYear: "" }]);
  };

  // Actualizar un registro de educación
  const handleUpdateEducation = (index: number, field: string, value: string) => {
    const newEducation = [...education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    setEducation(newEducation);
  };

  // Eliminar un registro de educación
  const handleRemoveEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  // Cancelar la edición y restablecer los valores
  const handleCancel = () => {
    reset({
      professionalType: user?.professionalType as ProfessionalInfoFormValues["professionalType"] || "architect",
      companyName: user?.company?.name || "",
      position: user?.company?.position || "",
      licenseNumber: user?.nationalId || "",
      professionalBio: user?.bio || "",
      website: user?.socialLinks?.website || "",
      yearsOfExperience: user?.yearsOfExperience?.toString() || "",
    });
    
    if (user?.specializations) {
      setSpecialties(user.specializations);
    } else {
      setSpecialties([]);
    }
    
    if (user?.certifications) {
      // Reset education based on certifications
      setEducation(
        user.certifications.map((cert) => ({
          institution: "Institución",
          degree: cert,
          graduationYear: "-"
        }))
      );
    } else {
      setEducation([]);
    }
    
    setIsEditing(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Información Profesional
        </h2>
        {!isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
          >
            Editar Información
          </button>
        ) : (
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
            >
              Cancelar
            </button>
            <button
              form="professional-info-form"
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 flex items-center"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Guardando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <form id="professional-info-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="professionalType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tipo de Profesional
              </label>
              <select
                id="professionalType"
                {...register("professionalType")}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900"
              >
                <option value="architect">Arquitecto</option>
                <option value="civil_engineer">Ingeniero Civil</option>
                <option value="constructor">Constructor</option>
                <option value="contractor">Contratista</option>
                <option value="electrician">Electricista</option>
                <option value="plumber">Plomero</option>
                <option value="designer">Diseñador</option>
                <option value="other">Otro</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="licenseNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Número de Licencia Profesional
              </label>
              <input
                type="text"
                id="licenseNumber"
                {...register("licenseNumber")}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900"
              />
            </div>

            <div>
              <label
                htmlFor="companyName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Empresa / Estudio
              </label>
              <input
                type="text"
                id="companyName"
                {...register("companyName")}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900"
              />
            </div>

            <div>
              <label
                htmlFor="position"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Cargo / Posición
              </label>
              <input
                type="text"
                id="position"
                {...register("position")}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900"
              />
            </div>

            <div>
              <label
                htmlFor="yearsOfExperience"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Años de Experiencia
              </label>
              <input
                type="number"
                id="yearsOfExperience"
                {...register("yearsOfExperience")}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900"
              />
            </div>

            <div>
              <label
                htmlFor="website"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Sitio Web
              </label>
              <input
                type="url"
                id="website"
                {...register("website")}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.website
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                } bg-white text-gray-900`}
                placeholder="https://tuwebsite.com"
              />
              {errors.website && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.website.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="professionalBio"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Biografía Profesional
            </label>
            <textarea
              id="professionalBio"
              {...register("professionalBio")}
              rows={4}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.professionalBio
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-primary-500 focus:border-primary-500"
              } bg-white text-gray-900`}
              placeholder="Describe tu experiencia profesional, especialidades y enfoque..."
            ></textarea>
            {errors.professionalBio && (
              <p className="mt-1 text-sm text-red-600">
                {errors.professionalBio.message}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Máximo 500 caracteres
            </p>
          </div>

          {/* Especialidades */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Especialidades
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {specialties.map((specialty, index) => (
                <div
                  key={index}
                  className="inline-flex items-center bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm"
                >
                  {specialty}
                  <button
                    type="button"
                    onClick={() => handleRemoveSpecialty(specialty)}
                    className="ml-1.5 text-primary-500 hover:text-primary-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
                className="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900"
                placeholder="Añadir nueva especialidad"
              />
              <button
                type="button"
                onClick={handleAddSpecialty}
                className="px-4 py-2 rounded-r-lg bg-primary-600 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
              >
                Añadir
              </button>
            </div>
          </div>

          {/* Educación */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Educación
              </label>
              <button
                type="button"
                onClick={handleAddEducation}
                className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Añadir
              </button>
            </div>
            <div className="space-y-3">
              {education.map((edu, index) => (
                <div
                  key={index}
                  className="p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-medium text-gray-700">
                      Registro {index + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => handleRemoveEducation(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Institución
                      </label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) =>
                          handleUpdateEducation(index, "institution", e.target.value)
                        }
                        className="w-full px-3 py-1.5 rounded border border-gray-300 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Título/Grado
                      </label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) =>
                          handleUpdateEducation(index, "degree", e.target.value)
                        }
                        className="w-full px-3 py-1.5 rounded border border-gray-300 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Año de Graduación
                      </label>
                      <input
                        type="text"
                        value={edu.graduationYear}
                        onChange={(e) =>
                          handleUpdateEducation(index, "graduationYear", e.target.value)
                        }
                        className="w-full px-3 py-1.5 rounded border border-gray-300 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900 text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
              {education.length === 0 && (
                <div className="text-center py-3 text-gray-500 text-sm">
                  No hay información de educación agregada.
                </div>
              )}
            </div>
          </div>
        </form>
      ) : (
        <div className="space-y-8">
          {/* Información básica profesional */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Tipo de Profesional
              </h3>
              <p className="mt-1 text-lg text-gray-900">
                {user?.professionalType === "architect"
                  ? "Arquitecto"
                  : user?.professionalType === "civil_engineer"
                  ? "Ingeniero Civil"
                  : user?.professionalType === "constructor"
                  ? "Constructor"
                  : user?.professionalType === "contractor"
                  ? "Contratista"
                  : user?.professionalType === "electrician"
                  ? "Electricista"
                  : user?.professionalType === "plumber"
                  ? "Plomero"
                  : user?.professionalType === "designer"
                  ? "Diseñador"
                  : "Otro"}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Número de Licencia
              </h3>
              <p className="mt-1 text-lg text-gray-900">
                {user?.nationalId || "No especificado"}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Empresa / Estudio
              </h3>
              <p className="mt-1 text-lg text-gray-900">
                {user?.company?.name || "No especificado"}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Cargo / Posición
              </h3>
              <p className="mt-1 text-lg text-gray-900">
                {user?.company?.position || "No especificado"}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Años de Experiencia
              </h3>
              <p className="mt-1 text-lg text-gray-900">
                {user?.yearsOfExperience || "No especificado"}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Sitio Web
              </h3>
              <p className="mt-1 text-lg text-gray-900">
                {user?.socialLinks?.website ? (
                  <a
                    href={user.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline"
                  >
                    {user.socialLinks.website}
                  </a>
                ) : (
                  "No especificado"
                )}
              </p>
            </div>
          </div>

          {/* Biografía profesional */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Biografía Profesional
            </h3>
            <div className="p-4 bg-gray-100 rounded-lg">
              <p className="text-gray-900">
                {user?.bio || "No hay biografía profesional."}
              </p>
            </div>
          </div>

          {/* Especialidades */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Especialidades
            </h3>
            <div className="flex flex-wrap gap-2">
              {specialties && specialties.length > 0 ? (
                specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="inline-block bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm"
                  >
                    {specialty}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">
                  No hay especialidades registradas.
                </p>
              )}
            </div>
          </div>

          {/* Educación */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Educación
            </h3>
            {education && education.length > 0 ? (
              <div className="space-y-4">
                {education.map((edu, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 rounded-lg"
                  >
                    <h4 className="font-medium text-lg text-gray-900">
                      {edu.degree}
                    </h4>
                    <p className="text-gray-700">
                      {edu.institution}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {edu.graduationYear}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                No hay información de educación registrada.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalInfoPage;