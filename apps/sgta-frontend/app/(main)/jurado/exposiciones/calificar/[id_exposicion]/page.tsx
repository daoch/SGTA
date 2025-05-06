"use client";

import CalificarExposicionJuradoPage from "@/features/jurado/views/vista-exposiciones/calificar-exposicion-jurado-page";
import { useParams } from "next/navigation";
import React from "react";

const Page: React.FC = () => {
  const params = useParams();
  const id_exposicion = params?.id_exposicion as string;

  return <CalificarExposicionJuradoPage id_exposicion={id_exposicion} />;
};

export default Page;
