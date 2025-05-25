"use client";

import { format, isBefore } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import Link from "next/link";
import { Exposicion } from "../types/exposicion.types";
import { EstadoBadge } from "./badge-estado-exposicion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  ExposicionJurado,
  MiembroJuradoExpo,
} from "@/features/jurado/types/jurado.types";

import { ExposicionEstado } from "../types/exposicion.types"; 
import { actualizarEstadoExposicion,actualizarEstadoControlExposicion } from "../services/jurado-service";

interface ExposicionCardProps {
  exposicion: ExposicionJurado;
  onClick?: (exposicion: ExposicionJurado) => void;
  onStatusChange?: () => Promise<void>;
}

export function ExposicionCard({ exposicion, onClick,onStatusChange }: ExposicionCardProps) {
  const router = useRouter();

  // Estado local para manejar actualizaciones sin recargar la página
  const [estadoActual, setEstadoActual] = useState(exposicion.estado);
  // Estado para manejar la carga mientras se envía la solicitud
  const [isLoading, setIsLoading] = useState(false);
  // Estado para manejar el control de estado
  const [estadoControlActual, setEstadoControlActual] = useState(exposicion.estado_control);
  
  const [isReprogramacionSolicitada, setIsReprogramacionSolicitada] = useState(exposicion.estado_control === "RECHAZADO");

  const getAsesor = () =>
    exposicion.miembros.filter((m) => m.tipo === "Asesor");
  const getEstudiantes = () =>
    exposicion.miembros.filter((m) => m.tipo === "Tesista");
  

  const handleClick = () => {
    if (onClick) {
      onClick(exposicion);
    }
  };

  const mapEstadoToExposicionEstado = (estadoApi: string): ExposicionEstado => {
    // Normalizar el estado (quitar mayúsculas, espacios extras)
    const estadoNormalizado = estadoApi.toLowerCase().trim().replace(/\s+/g, "_");
    
    // Comprobar si el estado ya coincide exactamente con alguno de los valores esperados
    if (estadoNormalizado === "sin_programar" || 
        estadoNormalizado === "esperando_respuesta" || 
        estadoNormalizado === "esperando_aprobacion" || 
        estadoNormalizado === "programada" || 
        estadoNormalizado === "completada" || 
        estadoNormalizado === "finalizada") {
      return estadoNormalizado as ExposicionEstado;
    }
    
    // Si no hay coincidencia exacta, buscar la mejor coincidencia
    if (estadoNormalizado.includes("planificacion")) return "programada";
    if (estadoNormalizado.includes("esperando") && estadoNormalizado.includes("respuesta")) return "esperando_respuesta";
    if (estadoNormalizado.includes("esperando") && estadoNormalizado.includes("aprobacion")) return "esperando_aprobacion";
    if (estadoNormalizado.includes("completa")) return "completada";
    if (estadoNormalizado.includes("finaliza")) return "finalizada";
    
    // Si no se encuentra ninguna coincidencia, devolver un valor por defecto
    return "sin_programar";
  };

  const handleConfirmarAsistencia = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    
    try {
      const idJurado=6; 
      // Llamar al endpoint para actualizar el estado
      await actualizarEstadoControlExposicion(
        exposicion.id_exposicion, 
        idJurado, 
        "ACEPTADO"
      );

      if (onStatusChange) {
        await onStatusChange();
      }
      // Actualizar el estado local para reflejar el cambio inmediatamente
      setEstadoControlActual("ACEPTADO");
      
      // Mostrar mensaje de éxito
      toast.success("Se ha confirmado tu asistencia. Esperando aprobación oficial.");
    } catch (error) {
      console.error("Error al confirmar asistencia:", error);
      toast.error("No se pudo confirmar la asistencia. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  // Función para solicitar reprogramación
  const handleSolicitarReprogramacion =async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
  
    try {
      // Cambiar el estado para mostrar "Reprogramación Solicitada"
      
      const idJurado = 6;

      await actualizarEstadoControlExposicion(
        exposicion.id_exposicion, 
        idJurado, 
        "RECHAZADO"
      );
      if (onStatusChange) {
        await onStatusChange();
      }

      setIsReprogramacionSolicitada(true);

      setEstadoControlActual("RECHAZADO");
      // Mostrar mensaje de éxito
      toast.success("Se ha solicitado la reprogramación de la exposición.");
    } catch (error) {
      console.error("Error al solicitar reprogramación:", error);
      toast.error("No se pudo solicitar la reprogramación. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNoDisponible = async (e: React.MouseEvent) => {
  e.stopPropagation();
  setIsLoading(true);
  
  try {
    // Puedes agregar aquí una llamada API específica para registrar la no disponibilidad
    const idJurado = 6;

    
    await actualizarEstadoControlExposicion(
      exposicion.id_exposicion, 
      idJurado, 
      "RECHAZADO"
    );

    if (onStatusChange) {
        await onStatusChange();
    }
    // Activar el estado de reprogramación solicitada
    setIsReprogramacionSolicitada(true);
    // Actualizar el estado actual a "esperando_aprobacion" (opcional, dependiendo de tu lógica de negocio)
    setEstadoControlActual("RECHAZADO");
    
    // Mostrar mensaje de éxito
    toast.success("Has indicado que no estás disponible para esta exposición.");
  } catch (error) {
    console.error("Error al indicar no disponibilidad:", error);
    toast.error("No se pudo registrar tu indisponibilidad. Inténtalo de nuevo.");
  } finally {
    setIsLoading(false);
  }
};


  const mostrarEsperandoRespuesta = () => {
    const estado = mapEstadoToExposicionEstado(estadoActual);
    return estado === "esperando_respuesta" && 
           estadoControlActual !== "ACEPTADO" && 
           estadoControlActual !== "RECHAZADO" && 
           !isReprogramacionSolicitada;
  };

  const mostrarEsperandoAprobacion = () => {
    const estado = mapEstadoToExposicionEstado(estadoActual);
    return ((estado === "esperando_aprobacion" && estadoControlActual !== "RECHAZADO") || 
         (estado === "esperando_respuesta" && estadoControlActual === "ACEPTADO")) && 
         !isReprogramacionSolicitada;
  };

  const mostrarReprogramacionSolicitada = () => {
    return isReprogramacionSolicitada || estadoControlActual === "RECHAZADO";
  };

  const determinarEstadoMostrado = (): ExposicionEstado => {
  // Obtener el estado base normalizado
  const estadoBase = mapEstadoToExposicionEstado(exposicion.estado);
  
  // Si el estado base es "esperando_respuesta" pero el estado_control es "ACEPTADO" o "RECHAZADO",
  // mostrar como "esperando_aprobacion"
  if (estadoBase === "esperando_respuesta" && 
      (estadoControlActual === "ACEPTADO" || estadoControlActual === "RECHAZADO")) {
    return "esperando_aprobacion";
  }
  
  // En cualquier otro caso, mostrar el estado base
  return estadoBase;
};


  return (
    <div
      className={`bg-gray-50 rounded-lg shadow-sm border p-5 flex flex-col md:flex-row gap-10
        ${
        mostrarReprogramacionSolicitada() 
          ? "bg-red-50 border-red-200" 
          : "bg-gray-50"
        }`}
      onClick={handleClick}
    >
      {/* HORA, FECHA Y SALA */}
      <div className="flex flex-col items-center space-y-2 md:min-w-[180px] justify-center">
        <div className="text-4xl font-semibold">
          {format(exposicion.fechahora, "HH:mm 'hrs'")}
        </div>
        <div className="flex items-center gap-1 mt-1">
          <span>
            {format(exposicion.fechahora, "d 'de' MMMM 'del' yyyy", {
              locale: es,
            })}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="h-6 w-6" />
          <span className="text-2xl font-semibold">{exposicion.sala}</span>
        </div>
      </div>

      <div className="flex flex-col w-full gap-4 justify-between">
        {/* TITULO Y ESTADO */}
        <div className="flex gap-2 w-full">
          <div className="flex items-start w-4/5">
            <h3 className="text-xl font-semibold">{exposicion.titulo}</h3>
          </div>
          <div className="w-1/5 justify-end flex items-start">
            <EstadoBadge estado={determinarEstadoMostrado()} />
          </div>
        </div>

        {/* ESTADO Y ACCIONES */}
        <div className="flex gap-3 flex-1 justify-between">
          <div className="flex items-start gap-2 md:min-w-[500px]">
            {getEstudiantes().map((estudiante) => (
              <div
                key={estudiante.id_persona}
                className="flex flex-col items-start gap-2 flex-1"
              >
                <Label>Tesista</Label>
                <div className="flex items-center gap-2 flex-1 justify-start">
                  <Avatar>
                    <AvatarFallback>TS</AvatarFallback>
                  </Avatar>
                  <div className="text-base">{estudiante.nombre}</div>
                </div>
              </div>
            ))}

            {getAsesor().map((asesor, index) => (
              <div
                key={asesor.id_persona}
                className="flex flex-col items-start gap-2 flex-1"
              >
                <Label>{index === 0 ? "Asesor" : "Coasesor"}</Label>
                <div className="flex items-center gap-2 flex-1 justify-start">
                  <Avatar>
                    <AvatarFallback>AS</AvatarFallback>
                  </Avatar>
                  <div className="text-base">{asesor.nombre}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-row gap-2 items-end">
            {mostrarEsperandoRespuesta() &&(
              <>
                <Button
                  variant="outline"
                  onClick={handleNoDisponible}
                  disabled={isLoading}
                >
                  {isLoading ? "Procesando..." : "No Estoy Disponible"}
                </Button>

                <Button 
                  onClick={handleConfirmarAsistencia}
                  disabled={isLoading}
                >
                  {/*<Link href="">Confirmar Asistencia</Link>*/}
                 {isLoading ? "Procesando..." : "Confirmar Asistencia"}
                </Button>
              </>
            )}
            {mostrarEsperandoAprobacion() && (
              <>
              <Button
                  variant="outline"
                  onClick={handleSolicitarReprogramacion}
                >
                  Solicitar Reprogramación
                </Button>

              <Button
               // variant="outline"
                disabled
              >
                Esperando confirmacion Oficial
              </Button>
              </>
            )}

            {mostrarReprogramacionSolicitada()  && (
              <Button
                variant="outline"
                disabled
              >
                Reprogramación Solicitada
              </Button>
            )}
            
            {mapEstadoToExposicionEstado(exposicion.estado)  === "programada" &&
              isBefore(new Date(exposicion.fechahora), new Date()) && (
                <Button
                  asChild
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Link
                    href={`/jurado/exposiciones/calificar/${exposicion.id_exposicion}`}
                  >
                    Calificar
                  </Link>
                </Button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
