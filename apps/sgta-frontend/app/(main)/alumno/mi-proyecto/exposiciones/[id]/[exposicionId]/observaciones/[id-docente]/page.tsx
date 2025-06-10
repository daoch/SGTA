"use client";

import ObservacionExposicion from "@/features/jurado/views/vista-exposiciones/alumno-observacion";
import { useParams } from "next/navigation";
import React from "react";

const Page: React.FC = () => {
  const params = useParams();
  const idExposicion = params?.["exposicionId"] as string;
  const idDocente = params?.["id-docente"] as string;

  return (
    <ObservacionExposicion idExposicion={idExposicion} idDocente={idDocente} />
  );
};

export default Page;

