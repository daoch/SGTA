"use client";

import ObservacionExposicion from "@/features/alumno/views/vista-exposiciones/observacion";
import { useParams } from "next/navigation";
import React from "react";

const Page: React.FC = () => {
  const params = useParams();
  const idExposicion = params?.id as string;
  const idDocente = params?.["id-docente"] as string;

  return (
    <ObservacionExposicion idExposicion={idExposicion} idDocente={idDocente} />
  );
};

export default Page;
