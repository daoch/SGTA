"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { EvaluacionExposicionJurado,CriterioEvaluacion } from "../types/jurado.types";

interface CalificacionItemProps {
  criterio: CriterioEvaluacion
  onChange?: (id: number, calificacion: number, observacion: string) => void;
}

export function CalificacionItem({
  criterio,
  onChange
}: CalificacionItemProps) {
  const [calificacion, setCalificacion] = useState(criterio.calificacion);
  const [observacion, setObservacion] = useState(criterio.observacion);

  // Manejador para cuando cambia la calificación
  const handleCalificacionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    // Asegurar que el valor esté dentro del rango permitido
    if (!isNaN(newValue) && newValue >= 0 && newValue <= criterio.nota_maxima) {
      setCalificacion(newValue);
      onChange?.(criterio.id, newValue, observacion);
    }
  };

  // Manejador para cuando cambia la observación
  const handleObservacionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setObservacion(e.target.value);
    onChange?.(criterio.id, calificacion, e.target.value);
  };


  return (
    <div className="border rounded-2xl p-4 space-y-2 shadow-sm">
      <Label className="text-lg font-semibold">{criterio.titulo}</Label>
      <p className="text-sm">{criterio.descripcion}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <div className="flex flex-col space-y-2">
          <Label>Calificación</Label>
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              min="0"
              max={criterio.nota_maxima}
              step="0.5"
              value={calificacion}
              placeholder="0.0"
              className="w-24"
              onChange={handleCalificacionChange}
            />
            <span>/ {criterio.nota_maxima}</span>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <Label>Observaciones</Label>
          <Textarea placeholder="Escribe tus observaciones aquí"
             value={observacion}
            onChange={handleObservacionChange} />
        </div>
      </div>
    </div>
  );
}
