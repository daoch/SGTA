"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface TemaDisponible {
  id: number;
  titulo: string;
  area: string;
  asesor: string;
  coasesores?: string[];
  fechaLimite: string;
  resumen?: string;
  objetivos?: string;
}

interface EnviarPropuestaCardProps {
  data?: TemaDisponible;
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
        <Label>Título del tema libre</Label>
        <div className="p-3 bg-gray-50 rounded-md border">
          <p className="font-medium">{data?.titulo}</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="comentario">Comentario para el asesor</Label>
        <Textarea
          id="comentario"
          placeholder="Explica por qué este tema es de tu interés..."
          value={texto}
          onChange={handleComentarioChange}
          rows={5}
        />
        <p className="text-xs text-muted-foreground">
          Este comentario será visible para el asesor que propuso el tema.
        </p>
      </div>
    </div>
  );
}
