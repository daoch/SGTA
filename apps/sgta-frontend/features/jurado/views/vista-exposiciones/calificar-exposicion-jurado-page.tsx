"use client";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  EvaluacionExposicionJurado,
  CriterioEvaluacion,
} from "../../types/jurado.types";
import {
  getExposicionCalificarJurado,
  actualizarComentarioFinalJurado,
  actualizarCriteriosEvaluacion,
  actualizarCalificacionFinalJurado,
  actualizarCalificacionFinalExposicionTema
} from "../../services/jurado-service";
import React from "react";
import { useEffect, useState } from "react";
import { CalificacionItem } from "../../components/item-calificacion";
import { Button } from "@/components/ui/button";
import { Save, X, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import ModalConfirmarGuardado from "../../components/modal-confirmar-calificacion-jurado";

import { useAuthStore } from "@/features/auth/store/auth-store";
const criterios = [
  {
    titulo: "Nivel de avance",
    descripcion:
      "El estudiante expone el progreso alcanzado según el cronograma propuesto y justifica los posibles desfases.",
  },
  {
    titulo: "Presentación",
    descripcion:
      "La exposición es clara, estructurada, con uso adecuado de recursos visuales y manejo del tiempo asignado.",
  },
  {
    titulo: "Dominio del tema",
    descripcion:
      "El estudiante demuestra conocimiento profundo del tema, maneja con solvencia los conceptos clave y responde adecuadamente a las preguntas del jurado.",
  },
  {
    titulo: "Claridad y coherencia",
    descripcion:
      "La argumentación es lógica, coherente y fácil de seguir, manteniendo el hilo conductor de la investigación.",
  },
  {
    titulo: "Aporte del trabajo",
    descripcion:
      "Se identifica claramente el aporte original del trabajo, su relevancia y aplicabilidad en el campo de estudio.",
  },
];

type Props = {
  id_exposicion: string;
};

const CalificarExposicionJuradoPage: React.FC<Props> = ({ id_exposicion }) => {
  // const [id_exposicion_tema] = id_exposicion;
  const [isLoading, setIsLoading] = useState(true);
  const [evaluacion, setEvaluacion] = useState<EvaluacionExposicionJurado>();
  const [observacionesFinales, setObservacionesFinales] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const router = useRouter();

  const handleCancel = () => {
    router.back(); // Regresa a la página anterior
  };

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const cargarDatosEvaluacion = async () => {
      setIsLoading(true);
      try {
        const { idToken } = useAuthStore.getState();
        console.log("ID Token:", idToken, "ID Exposición Tema:", id_exposicion);
        setToken(idToken);

        const datosEvaluacion = await getExposicionCalificarJurado(
          token!,
          id_exposicion,
        );
        setEvaluacion(datosEvaluacion);
        setObservacionesFinales(datosEvaluacion.observaciones_finales);
        console.log("Datos de evaluación cargados:", datosEvaluacion);
      } catch (error) {
        console.error("Error al cargar los datos de evaluación:", error);
      } finally {
        setIsLoading(false);
      }
    };

    cargarDatosEvaluacion();
  }, [id_exposicion, token]);

  const handleCriterioChange = (
    id: number,
    value: number | null,
    observacion: string,
  ) => {
    if (!evaluacion) return;

    const nuevosCriterios = evaluacion.criterios.map((criterio) =>
      criterio.id === id
        ? { ...criterio, calificacion: value, observacion }
        : criterio,
    );

    setEvaluacion({
      ...evaluacion,
      criterios: nuevosCriterios,
    });
  };

  if (isLoading) {
    return <div className="p-4 text-center">Cargando datos...</div>;
  }

  if (!evaluacion) {
    return (
      <div className="p-4 text-center">
        No se pudieron cargar los datos de la exposición.
      </div>
    );
  }

  const handleSave = async () => {
    if (!evaluacion) {
      toast.error("No hay datos de evaluación disponibles");
      return;
    }

    const camposIncompletos = evaluacion.criterios.filter(
      (criterio) =>
        criterio.calificacion === 0 ||
        criterio.calificacion === null ||
        criterio.calificacion === undefined,
    );
    {
      /*
    if (hayCamposVacios()) {
      toast.error(
        "Debes completar la calificación de todos los criterios antes de guardar",
        {
          description: "Revisa los criterios sin calificar y asigna un valor."
        }
      );
      return;
    }*/
    }

    try {
      setIsLoading(true);
      let successMessage = "";
      let hasError = false;

      const exposicionId = evaluacion.criterios[0].id;

      try {
        // 1. Guardar observaciones finales
        const resultadoObservaciones = await actualizarComentarioFinalJurado(
          token!,
          exposicionId,
          observacionesFinales,
        );

        if (resultadoObservaciones) {
          successMessage += "Observaciones finales guardadas correctamente. ";
        }

        // 2. Guardar la calificación final (nuevo)
        const notaFinal = evaluacion.criterios.reduce(
          (sum, criterio) => sum + (criterio.calificacion || 0), 
          0
        );
        
        const resultadoCalificacionFinal = await actualizarCalificacionFinalJurado(
          token!,
          exposicionId,
          parseFloat(notaFinal.toFixed(2))
        );

        if (resultadoCalificacionFinal) {
          successMessage += "Nota final guardada correctamente. ";
        }

        // 3. Actualizar la calificación final de la exposición (consolidada de todos los jurados)
        try {
          // Convertir id_exposicion a número si viene como string
          const exposicionTemaId = typeof id_exposicion === "string" ? 
            parseInt(id_exposicion) : id_exposicion;
            
          const resultadoCalificacionFinalExposicion = await actualizarCalificacionFinalExposicionTema(
            token!,
            exposicionTemaId
          );
          
          if (resultadoCalificacionFinalExposicion) {
            successMessage += "Nota final de la exposición actualizada correctamente. ";
          }
        } catch (error) {
          console.error("Error al actualizar la nota final de la exposición:", error);
          hasError = true;
        }
        

      } catch (error) {
        console.error("Error al guardar observaciones finales:", error);
        hasError = true;
      }

      try {
        const criteriosParaActualizar = evaluacion.criterios.map(
          (criterio) => ({
            id: criterio.id,
            calificacion: criterio.calificacion as number,
            observacion: criterio.observacion,
          }),
        );
        if (criteriosParaActualizar.length > 0) {
          const resultadoCriterios = await actualizarCriteriosEvaluacion(
            token!,
            criteriosParaActualizar,
          );

          if (resultadoCriterios) {
            successMessage +=
              "Criterios de evaluación guardados correctamente.";
          }
        } else {
          console.log("No hay criterios con calificación para actualizar");
        }
      } catch (error) {
        console.error("Error al guardar criterios:", error);
        hasError = true;
      }

      if (successMessage) {
        if (hasError) {
          toast.success(
            "Algunos elementos se guardaron correctamente, pero otros fallaron.",
          );
        } else {
          toast.success("Todos los datos se guardaron correctamente.");
        }
      } else if (hasError) {
        toast.error("No se pudo guardar la información. Intenta nuevamente.");
      }
    } catch (error) {
      console.error("Error al guardar las observaciones:", error);
    } finally {
      setIsLoading(false);
      setIsConfirmModalOpen(false);
    }
  };

  const hayCamposVacios = (): boolean => {
    if (!evaluacion) return true;

    return evaluacion.criterios.some(
      (criterio) =>
        criterio.calificacion === null ||
        criterio.calificacion === undefined ||
        (typeof criterio.calificacion === "number" &&
          (criterio.calificacion < 0 ||
            criterio.calificacion > criterio.nota_maxima)),
    );
  };

  return (
    <div className="p-2 w-full mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={handleCancel}
          className="hover:bg-gray-100 p-2 rounded-full transition-colors"
          title="Volver a la página anterior"
        >
          <ArrowLeft className="h-6 w-6 text-gray-600" />
        </button>
        <h1 className="text-3xl font-bold text-[#042354]">
          Registro de Observaciones del Tema de Proyecto
        </h1>
      </div>

      <Label className="!text-[15px] leading-none font-semibold">Título del Proyecto</Label>
      <Input disabled value={evaluacion.titulo} />

      <Label className="!text-[15px] leading-none font-semibold">Título del Descripción</Label>
      <Textarea disabled value={evaluacion.descripcion} />

      <Label className="!text-[15px] leading-none font-semibold">Estudiantes</Label>
      {/* Reemplazar el estudiante hardcodeado con la lista dinámica */}
      {evaluacion.estudiantes.map((estudiante) => (
        <div
          key={estudiante.id}
          className="flex items-center gap-2 flex-1 justify-start"
        >
          <Avatar>
            <AvatarFallback>
              {estudiante.nombre
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-muted-foreground text-[14px]">{estudiante.nombre}</span>
        </div>
      ))}

      <div className="flex flex-col gap-5">
        <h1 className="text-2xl font-bold">Criterios de Calificación</h1>
        {evaluacion.criterios.map((criterio) => (
          <CalificacionItem
            key={criterio.id}
            criterio={criterio}
            onChange={handleCriterioChange}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="border rounded-2xl p-4 space-y-2 shadow-sm md:col-span-2">
        <Label className="text-lg font-semibold">Observaciones Finales</Label>
        <Textarea
          placeholder="Escribe tus observaciones aquí"
          value={observacionesFinales}
          onChange={(e) => setObservacionesFinales(e.target.value)}
          className="min-h-32"
        />
      </div>

      <div className="border rounded-2xl p-4 space-y-2 shadow-sm flex flex-col justify-center items-center">
        <Label className="text-lg font-semibold">Nota Final</Label>
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-5xl font-bold">
            <span className="text-gray-600">
              {evaluacion.criterios.reduce((sum, criterio) => sum + (criterio.calificacion || 0), 0).toFixed(2)}
            </span>
            <span className="text-gray-500">/</span>
            <span className="text-gray-600">
              {evaluacion.criterios.reduce((sum, criterio) => sum + criterio.nota_maxima, 0)}
            </span>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            {hayCamposVacios() ? (
              <span className="text-red-500">
                * Completa todas las calificaciones para confirmar la nota final
              </span>
            ) : (
              <span className="text-blue-500">
                Todas las calificaciones completadas
              </span>
            )}
          </div>
        </div>
      </div>

      </div>
      <div className="flex justify-center gap-4">
        <Button variant="destructive" onClick={handleCancel}>
          <X />
          Cancelar
        </Button>

        <Button
          onClick={handleSave}
          disabled={hayCamposVacios() || isLoading} //? "opacity-50 cursor-not-allowed" : ""}>
          className={hayCamposVacios() ? "opacity-50 cursor-not-allowed" : ""}
        >
          <Save />
          Guardar
        </Button>
      </div>

      {/* modal de confirmación 
      <ModalConfirmarGuardado
        open={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleSave}
      />*/}
    </div>
  );
};

export default CalificarExposicionJuradoPage;

