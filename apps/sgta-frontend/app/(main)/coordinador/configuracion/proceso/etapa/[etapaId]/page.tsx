"use client";

import type React from "react";
import DetalleEtapaPage from "@/features/configuracion/views/detalle-etapa-page";
import { useParams } from "next/navigation";

const Page: React.FC = () => {
  const params = useParams();
  const etapaId = params?.etapaId as string;
  return <DetalleEtapaPage etapaId={etapaId} />;
};

export default Page;