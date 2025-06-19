"use client";

import { format, isBefore } from "date-fns";
import { es } from "date-fns/locale";
import { MapPin } from "lucide-react";
import { EstadoBadge } from "./badge-estado-exposicion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ExposicionJurado,
  MiembroJuradoExpo,
} from "@/features/jurado/types/jurado.types";
import { ExposicionEstado } from "../types/exposicion.types";

interface ListExposicionCoordinadorCardProps {
  readonly exposicion: ExposicionJurado;
  readonly onClick?: (exposicion: ExposicionJurado) => void;
}

export function ListExposicionCoordinadorCard({
  exposicion,
  onClick,
}: ListExposicionCoordinadorCardProps) {

  // Estado para manejar el control de estado
  const [estadoControlActual, setEstadoControlActual] = useState(
    exposicion.estado_control,
  );

  const getAsesor = () =>
    exposicion.miembros.filter((m) => m.tipo === "Asesor");
  const getEstudiantes = () =>
    exposicion.miembros.filter((m) => m.tipo === "Tesista");
  const getJurados = () =>
    exposicion.miembros.filter((m) => m.tipo === "Jurado");

  const handleClick = () => {
    if (onClick) {
      onClick(exposicion);
    }
  };

  const mapEstadoToExposicionEstado = (estadoApi: string): ExposicionEstado => {
    // Normalizar el estado (quitar mayúsculas, espacios extras)
    const estadoNormalizado = estadoApi
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "_");

    // Comprobar si el estado ya coincide exactamente con alguno de los valores esperados
    if (
      estadoNormalizado === "sin_programar" ||
      estadoNormalizado === "esperando_respuesta" ||
      estadoNormalizado === "esperando_aprobación" ||
      estadoNormalizado === "programada" ||
      estadoNormalizado === "completada" ||
      estadoNormalizado === "calificada"
    ) {
      return estadoNormalizado;
    }

    // Si no hay coincidencia exacta, buscar la mejor coincidencia
    if (estadoNormalizado.includes("planificacion")) return "programada";
    if (
      estadoNormalizado.includes("esperando") &&
      estadoNormalizado.includes("respuesta")
    )
      return "esperando_respuesta";
    if (
      estadoNormalizado.includes("esperando") &&
      estadoNormalizado.includes("aprobación")
    )
      return "esperando_aprobación";
    if (estadoNormalizado.includes("completa")) return "completada";
    if (estadoNormalizado.includes("califica")) return "calificada";

    // Si no se encuentra ninguna coincidencia, devolver un valor por defecto
    return "sin_programar";
  };

  const determinarEstadoMostrado = (): ExposicionEstado => {
    // Obtener el estado base normalizado
    const estadoBase = mapEstadoToExposicionEstado(exposicion.estado);

    if (estadoBase === "completada" && exposicion.criterios_calificados === true) {
      return "calificada";
    }

    // Si el estado base es "esperando_respuesta" pero el estado_control es "ACEPTADO" o "RECHAZADO",
    // mostrar como "esperando_aprobacion"
    if (
      estadoBase === "esperando_respuesta" &&
      (estadoControlActual === "ACEPTADO" ||
        estadoControlActual === "RECHAZADO")
    ) {
      return "esperando_aprobación";
    }

    // En cualquier otro caso, mostrar el estado base
    return estadoBase;
  };

  return (
    <div
    className={`rounded-lg shadow-sm border p-5 flex flex-col md:flex-row gap-10
      ${
        !(
          mapEstadoToExposicionEstado(exposicion.estado) === "programada" ||
          mapEstadoToExposicionEstado(exposicion.estado) === "completada" ||
          mapEstadoToExposicionEstado(exposicion.estado) === "calificada"
        )
          ? "bg-red-50 border-red-200"
          : "bg-gray-50"
      }`}
    onClick={handleClick}
    >
      {/* HORA, FECHA Y SALA */}
      <div className="flex flex-col items-center space-y-2 md:min-w-[180px] justify-center">
        <div className="text-4xl font-semibold">
          {format(exposicion.fechahora, "HH:mm")} hrs
        </div>
        <div className="flex items-center gap-1 mt-1">
          <span>
            {format(exposicion.fechahora, "d")} de {format(exposicion.fechahora, "MMMM", { locale: es })} del {format(exposicion.fechahora, "yyyy")}
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
            {getJurados().map((jurado, index) => (
              <div
                key={jurado.id_persona}
                className="flex flex-col items-start gap-2 flex-1"
              >
                <Label>{`Jurado ${index+1}`}</Label>
                <div className="flex items-center gap-2 flex-1 justify-start">
                  <Avatar>
                    <AvatarFallback>JR</AvatarFallback>
                  </Avatar>
                  <div className="text-base">{jurado.nombre}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

