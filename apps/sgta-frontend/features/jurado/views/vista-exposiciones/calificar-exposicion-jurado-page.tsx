"use client";

import { useRouter } from "next/navigation"; 
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EvaluacionExposicionJurado,CriterioEvaluacion } from "../../types/jurado.types";
import { getExposicionCalificarJurado,actualizarComentarioFinalJurado,actualizarCriteriosEvaluacion } from "../../services/jurado-service";
import React from "react";
import { useEffect, useState } from "react";
import { CalificacionItem } from "../../components/item-calificacion";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ModalConfirmarGuardado from "../../components/modal-confirmar-calificacion-jurado";

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
  const [id_exposicion_tema, id_jurado] = id_exposicion.split('-');
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [evaluacion, setEvaluacion] = useState<EvaluacionExposicionJurado>();
  const [observacionesFinales, setObservacionesFinales] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const router = useRouter(); 

  const handleCancel = () => {
    router.back(); // Regresa a la página anterior
  };

  const handleSaveClick = () => {
  setIsConfirmModalOpen(true);
  };

  useEffect(() => {
    const cargarDatosEvaluacion = async () => {
      setIsLoading(true);
      try {
        
        const datosEvaluacion = await getExposicionCalificarJurado(id_jurado, id_exposicion_tema);
        setEvaluacion(datosEvaluacion);
        setObservacionesFinales(datosEvaluacion.observaciones_finales);
      } catch (error) {
        console.error("Error al cargar los datos de evaluación:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    cargarDatosEvaluacion();
  }, [id_exposicion_tema, id_jurado]);

  const handleCriterioChange = (id: number, value: number, observacion: string) => {
    if (!evaluacion) return;
    
    const nuevosCriterios = evaluacion.criterios.map(criterio => 
      criterio.id === id 
        ? { ...criterio, calificacion: value, observacion } 
        : criterio
    );
    
    setEvaluacion({
      ...evaluacion,
      criterios: nuevosCriterios
    });
  };
  
  if (isLoading) {
  return <div className="p-4 text-center">Cargando datos...</div>;
  }

  if (!evaluacion) {
    return <div className="p-4 text-center">No se pudieron cargar los datos de la exposición.</div>;
  }

  const handleSave = async () => {
  try {
    setIsLoading(true);
    let successMessage = "";
    let hasError = false;

      const exposicionId = evaluacion.id_exposicion || evaluacion.criterios[0].id;
      
      
      try {
        const resultadoObservaciones = await actualizarComentarioFinalJurado(
          exposicionId,
          observacionesFinales
        );
        
        if (resultadoObservaciones) {
          successMessage += "Observaciones finales guardadas correctamente. ";
        }
      } catch (error) {
        console.error("Error al guardar observaciones finales:", error);
        hasError = true;
      }

    try {
        const criteriosParaActualizar = evaluacion.criterios.map(criterio => ({
          id: criterio.id,
          calificacion: criterio.calificacion,
          observacion: criterio.observacion
        }));

        const resultadoCriterios = await actualizarCriteriosEvaluacion(
          criteriosParaActualizar
        );
        
        if (resultadoCriterios) {
          successMessage += "Criterios de evaluación guardados correctamente.";
        }
      } catch (error) {
        console.error("Error al guardar criterios:", error);
        hasError = true;
      }

      if (successMessage) {
      if (hasError) {
        toast({
          title: "Guardado parcial",
          description: "Algunos elementos se guardaron correctamente, pero otros fallaron.",
          variant: "default"
        });
      } else {
        toast({
          title: "¡Guardado exitoso!",
          description: "Todos los datos se guardaron correctamente.",
          variant: "default"
        });
        
      }
    } else if (hasError) {
      toast({
        title: "Error",
        description: "No se pudo guardar la información. Intenta nuevamente.",
        variant: "destructive"
      });
    }
    
   
  } catch (error) {
    console.error("Error al guardar las observaciones:", error);
    
  } finally {
    setIsLoading(false);
    setIsConfirmModalOpen(false);
  }
  };
  
  

  return (
    <div className="p-2 w-full mx-auto space-y-6">
      <h1 className="text-2xl font-bold">
        Registro de Observaciones del Tema de Proyecto
      </h1>

      <Label>Título del Proyecto</Label>
      <Input
        disabled
        value={evaluacion.titulo}
      />

      <Label>Título del Descripción</Label>
      <Textarea
        disabled
        value={evaluacion.descripcion}
      />

      <Label>Estudiantes</Label>
      {/* Reemplazar el estudiante hardcodeado con la lista dinámica */}
      {evaluacion.estudiantes.map(estudiante => (
        <div key={estudiante.id} className="flex items-center gap-2 flex-1 justify-start">
          <Avatar>
            <AvatarFallback>
              {estudiante.nombre.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span>{estudiante.nombre}</span>
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
      <div className="border rounded-2xl p-4 space-y-2 shadow-sm">
        <Label className="text-lg font-semibold">Observaciones Finales</Label>
        <Textarea 
        placeholder="Escribe tus observaciones aquí"
        value={observacionesFinales}
        onChange={(e) => setObservacionesFinales(e.target.value)}
         />
      </div>
      <div className="flex justify-center gap-4">
        <Button variant="destructive" onClick={handleCancel}>
          <X />
          Cancelar
        </Button>

        <Button onClick={handleSaveClick}>
          <Save />
          Guardar
        </Button>
      </div>

      {/* Agregar el modal de confirmación */}
      <ModalConfirmarGuardado
        open={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleSave}
      />

    </div>
  );
};

export default CalificarExposicionJuradoPage;
