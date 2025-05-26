"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react"; // ícono opcional
import { useRouter } from "next/navigation";

import { ObservacionesCard } from "@/features/temas/components/alumno/observaciones-card";

interface Props {
  id: string;
}

const tesisData = {
  id: "1",
  titulo: "Implementación de algoritmos de aprendizaje profundo para detección de objetos en tiempo real",
  descripcion:
    "Este proyecto busca desarrollar un sistema de detección de objetos en tiempo real utilizando técnicas de aprendizaje profundo, específicamente redes neuronales convolucionales.",
};

const observaciones: {
  campo: "título" | "descripción" | "asesor";
  detalle: string;
  autor: string;
  fecha: string;
}[] = [
  {
    campo: "título",
    detalle: "El título es demasiado genérico. Especificar el tipo de objetos a detectar y el contexto de aplicación.",
    autor: "Dr. Manuel Rodríguez",
    fecha: "4/11/2023",
  },
  {
    campo: "descripción",
    detalle: "La descripción debe incluir el problema específico que se busca resolver y la relevancia del proyecto.",
    autor: "Dr. Manuel Rodríguez",
    fecha: "4/11/2023",
  },
  {
    campo: "asesor",
    detalle: "El asesor propuesto no tiene experiencia en el área específica. Considerar otro asesor o justificar la elección.",
    autor: "Dr. Manuel Rodríguez",
    fecha: "4/11/2023",
  },
];

export function ObservacionesAlumnoView({ id }: Props) {
  const router = useRouter();

  if (id !== tesisData.id) {
    return <p className="p-6">No se encontró el tema con ID: {id}</p>;
  }

  return (
  <div className="space-y-8 mt-4">
    <div className="flex flex-col items-start gap-2">
      {/* Botón + título */}
      <div className="flex items-center">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold text-[#042354] ml-3">
          {tesisData.titulo}
        </h1>
      </div>

      {/* Descripción */}
      <p className="text-muted-foreground">{tesisData.descripcion}</p>
    </div>

    <ObservacionesCard observaciones={observaciones} />
  </div>
);

}

