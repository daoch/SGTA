"use client";
import type React from "react";

interface DetalleObservacionExposicionProps {
  idExposicion: string;
  idDocente: string;
}

const ObservacionExposicion: React.FC<DetalleObservacionExposicionProps> = ({
  idExposicion,
  idDocente,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Observación de la exposición</h1>
      <p className="text-gray-500">
        Observaciones para la exposición con ID {idExposicion} evaluadas por el
        docente con ID {idDocente}.
      </p>
    </div>
  );
};
export default ObservacionExposicion;

