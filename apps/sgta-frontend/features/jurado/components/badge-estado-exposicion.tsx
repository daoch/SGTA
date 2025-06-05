"use client";

import { Badge } from "@/components/ui/badge";
import { ExposicionEstado } from "../types/exposicion.types"; // ajusta la ruta según tu estructura

interface EstadoBadgeProps {
  estado: ExposicionEstado;
}

const estadoEstilos: Record<ExposicionEstado, string> = {
  sin_programar: "bg-gray-200 text-gray-700 border-gray-300",
  esperando_respuesta: "bg-yellow-100 text-yellow-800 border-yellow-300",
  esperando_aprobación: "bg-orange-100 text-orange-800 border-orange-300",
  programada: "bg-blue-100 text-blue-800 border-blue-300",
  completada: "bg-green-600 text-white border-green-500",
  calificada: "bg-purple-100 text-purple-800 border-purple-300",
};

export function EstadoBadge({ estado }: EstadoBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={`
        ${estadoEstilos[estado]}
        capitalize px-2 py-1 text-sm rounded-full
      `}
    >
      {estado.replace(/_/g, " ")}
    </Badge>
  );
}
