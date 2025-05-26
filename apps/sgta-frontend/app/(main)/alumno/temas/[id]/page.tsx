"use client";

import { useParams } from "next/navigation";
import { ObservacionesAlumnoView } from "@/features/temas/views/observaciones-card-alumno";

export default function TemaDetallePage() {
  const { id } = useParams();
  return <ObservacionesAlumnoView id={id as string} />;
}
