"use client";

import DetalleExposicion from "@/features/alumno/views/vista-exposiciones/detalle-exposicion";
import { useParams } from "next/navigation";
import React from "react";

const Page: React.FC = () => {
  const params = useParams();
  const id = params?.id as string;

  return <DetalleExposicion id={id} />;
};

export default Page;

