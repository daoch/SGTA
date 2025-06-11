"use client";

import { DialogTitle } from "@radix-ui/react-dialog";
import clsx from "clsx";
import { AlertTriangle } from "lucide-react";
import { TemaSimilar } from "../../types/propuestas/entidades";

type TemasSimilaresModalProps = {
  temasSilimares: TemaSimilar[] | [];
};

export function TemasSimilaresModal({
  temasSilimares,
}: TemasSimilaresModalProps) {
  function getColorClass(similitud: number) {
    if (similitud >= 80) return "text-red-600";
    if (similitud >= 30) return "text-yellow-600";
    return "text-green-600";
  }
  return (
    <div className="w-full max-w-xl mx-auto p-6 bg-white rounded-xl">
      <DialogTitle className="sr-only"></DialogTitle>
      <div className="flex items-center gap-2 text-red-600 font-semibold text-lg">
        <AlertTriangle className="h-5 w-5" />
        Se han encontrado temas similares
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Hemos encontrado temas similares a la esta propuesta. Por favor, revisar
        las coincidencias antes de continuar.
      </p>
      <div className="space-y-2">
        {temasSilimares.map((p, idx) => (
          <div
            key={idx}
            className="flex justify-between items-start p-3 bg-gray-50 border rounded-md"
          >
            <div>
              <p className="text-sm font-medium">{p.codigo}</p>
              <p className="text-sm font-medium">{p.titulo}</p>
              <p
                className={clsx(
                  "text-xs font-semibold",
                  getColorClass(p.porcentajeSimilitud),
                )}
              >
                Similitud: {p.porcentajeSimilitud.toFixed(2)}%
              </p>
            </div>
            <span className="text-sm text-muted-foreground">
              {p.fechaCreacion ? new Date(p.fechaCreacion).getFullYear() : ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
