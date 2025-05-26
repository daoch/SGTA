"use client";

import { ObservacionesAlumnoView } from "@/features/temas/views/observaciones-card-alumno";
import { useParams } from "next/navigation";

export default function TemaDetallePage() {
  const { id } = useParams();
  //return <ObservacionesAlumnoView id={id as string} />;
  return <ObservacionesAlumnoView id={"1"} />;
}
