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
import {
  ExposicionJurado,
  MiembroJuradoExpo,
} from "@/features/jurado/types/jurado.types";

import { ExposicionEstado } from "../types/exposicion.types"; 

interface ExposicionCardProps {
  exposicion: ExposicionJurado;
  onClick?: (exposicion: ExposicionJurado) => void;
}

export function ExposicionCard({ exposicion, onClick }: ExposicionCardProps) {
  const router = useRouter();

  const getAsesor = () =>
    exposicion.miembros.filter((m) => m.tipo === "asesor");
  const getEstudiantes = () =>
    exposicion.miembros.filter((m) => m.tipo === "estudiante");

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

  return (
    <div
      className="bg-gray-50 rounded-lg shadow-sm border p-5 flex flex-col md:flex-row gap-10"
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
            <EstadoBadge estado={mapEstadoToExposicionEstado(exposicion.estado)} />
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
            {mapEstadoToExposicionEstado(exposicion.estado) === "esperando_respuesta" && (
              <>
                <Button
                  asChild
                  variant="outline"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link href="">No Estoy Disponible</Link>
                </Button>

                <Button asChild onClick={(e) => e.stopPropagation()}>
                  <Link href="">Confirmar Asistencia</Link>
                </Button>
              </>
            )}
            {exposicion.estado === "esperando_aprobacion" && (
              <Button
                variant="outline"
                disabled
                onClick={(e) => e.stopPropagation()}
              >
                Esperando confirmacion
              </Button>
            )}
            {exposicion.estado === "programada" &&
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
