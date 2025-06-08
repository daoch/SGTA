"use client";

import { Button } from "@/components/ui/button";
import type { TemaSimilar } from "@/features/temas/components/alumno/formulario-propuesta"; // ajusta la ruta si es necesario
import clsx from "clsx";
import { AlertTriangle } from "lucide-react";

interface PropuestasSimilaresCardProps {
  propuestas: TemaSimilar[];
  onCancel?: () => void;
}

export default function PropuestasSimilaresCard({
  propuestas,
  onCancel,
}: PropuestasSimilaresCardProps) {
  function getColorClass(similitud: number) {
    if (similitud >= 80) return "text-red-600";
    if (similitud >= 30) return "text-yellow-600";
    return "text-green-600";
  }

  return (
    <div className="w-full max-w-xl mx-auto p-6 bg-white rounded-xl">
      <div className="flex items-center gap-2 text-red-600 font-semibold text-lg">
        <AlertTriangle className="h-5 w-5" />
        Se han encontrado propuestas similares
      </div>
      <p className="text-sm text-muted-foreground mt-1 mb-4">
        Hemos detectado que tu propuesta tiene similitudes con los siguientes
        proyectos de fin de carrera existentes. Revisa las coincidencias antes de
        continuar.
      </p>

      <div className="space-y-2">
        {propuestas.map((p, idx) => (
          <div
            key={idx}
            className="flex justify-between items-start p-3 bg-gray-50 border rounded-md"
          >
            <div>
              <p className="text-sm font-medium">{p.tema.titulo}</p>
              <p
                className={clsx(
                  "text-xs font-semibold",
                  getColorClass(p.similarityScore)
                )}
              >
                Similitud: {p.similarityScore}%
              </p>
            </div>
            <span className="text-sm text-muted-foreground">
              {p.tema.fechaCreacion
                ? new Date(p.tema.fechaCreacion).getFullYear()
                : ""}
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <Button variant="outline">Continuar de todos modos</Button>
        <Button className="bg-blue-900 text-white hover:bg-blue-950" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}
