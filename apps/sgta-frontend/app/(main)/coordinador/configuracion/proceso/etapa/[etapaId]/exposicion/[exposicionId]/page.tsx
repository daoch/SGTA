"use client";

import type React from "react";
import { useParams } from "next/navigation";
import DetalleExposicionPage from "@/features/configuracion/views/detalle-exposicion-page";

const Page: React.FC = () => {
  const params = useParams();
  const etapaId = params?.etapaId as string;
  const exposicionId = params?.exposicionId as string;
  return (
    <DetalleExposicionPage etapaId={etapaId} exposicionId={exposicionId} />
  );
};

export default Page;
