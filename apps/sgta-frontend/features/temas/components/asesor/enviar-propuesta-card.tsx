"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Proyecto } from "../../types/propuestas/entidades";

interface EnviarPropuestaCardProps {
  data?: Proyecto;
  setComentario?: (comentario: string) => void;
}
export function EnviarPropuestaCard({
  data,
  setComentario,
}: EnviarPropuestaCardProps) {
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
          placeholder="Explica por qué quieres ser asesor de esta tesis..."
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
