"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Proyecto_M } from "../../types/propuestas/entidades";

const tiposRechazo = [
  {
    id: 1,
    nombre: "Inconsistencia en objetivos",
    descripcion:
      "Los objetivos planteados no guardan coherencia con la metodología propuesta.",
  },
  {
    id: 2,
    nombre: "Falta de viabilidad técnica",
    descripcion:
      "El proyecto propuesto no puede ser llevado a cabo con los recursos o conocimientos disponibles.",
  },
  {
    id: 3,
    nombre: "Duplicación de tema",
    descripcion: "El tema ya ha sido aprobado previamente por otro estudiante.",
  },
  {
    id: 4,
    nombre: "Contenido insuficiente",
    descripcion:
      "El planteamiento del problema o la justificación no es suficientemente sólido.",
  },
  {
    id: 5,
    nombre: "Fuera del alcance académico",
    descripcion:
      "El tema no se ajusta al perfil de la carrera o a los objetivos del curso.",
  },
  {
    id: 6,
    nombre: "Propuesta incompleta",
    descripcion: "El formulario fue entregado sin todos los campos requeridos.",
  },
  {
    id: 7,
    nombre: "Problemas éticos o legales",
    descripcion:
      "La propuesta presenta conflictos éticos o legales que impiden su aprobación.",
  },
  {
    id: 8,
    nombre: "Otro",
    descripcion: "Otra razón justificada",
  },
];

interface RechazarPropuestaCardProps {
  data?: Proyecto_M;
  setComentario?: (comentario: string) => void;
  setTipoRechazo?: (tipoRechazo: number) => void;
}
export function RechazarPropuestaCard({
  data,
  setComentario,
  setTipoRechazo,
}: RechazarPropuestaCardProps) {
  const [texto, setTexto] = useState("");
  const [rechazo, setRechazo] = useState<string>("");

  const handleComentarioChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setTexto(e.target.value);
    if (setComentario) {
      setComentario(e.target.value);
    }
  };

  const handleTipoRechazoChange = (nuevoRechazo: string) => {
    setRechazo(nuevoRechazo);
    if (setTipoRechazo) {
      setTipoRechazo(Number(nuevoRechazo));
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
        <Label htmlFor="comentario">Motivo de rechazo</Label>
        <Select value={rechazo} onValueChange={handleTipoRechazoChange}>
          <SelectTrigger>
            <SelectValue placeholder="Elige un motivo..." />
          </SelectTrigger>
          <SelectContent>
            {tiposRechazo.map((tipoRechazo) => (
              <SelectItem
                key={tipoRechazo.id}
                value={tipoRechazo.id.toString()}
              >
                {tipoRechazo.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
