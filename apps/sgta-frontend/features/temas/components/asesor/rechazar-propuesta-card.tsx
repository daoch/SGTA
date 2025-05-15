"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Proyecto_M } from "../../types/propuestas/entidades";

interface RechazarPropuestaCardProps {
  data?: Proyecto_M;
  setComentario?: (comentario: string) => void;
}
export function RechazarPropuestaCard({
  data,
  setComentario,
}: RechazarPropuestaCardProps) {
  const [texto, setTexto] = useState("");

  const handleComentarioChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setTexto(e.target.value);
    if (setComentario) {
      setComentario(e.target.value);
    }
  };

  return (
    <div className="space-y-6 py-4">
      <div className="space-y-2">
        <Label>Título de la propuesta</Label>
        <div className="p-3 bg-gray-50 rounded-md border">
          <p className="font-medium">{data?.titulo}</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="comentario">Comentario para el estudiante</Label>
        <Textarea
          id="comentario"
          placeholder="Explica por qué rechazas este tema..."
          value={texto}
          onChange={handleComentarioChange}
          rows={5}
        />
        <p className="text-xs text-muted-foreground">
          Este comentario será visible para el estudiante que propuso el tema.
        </p>
      </div>
    </div>
  );
}
