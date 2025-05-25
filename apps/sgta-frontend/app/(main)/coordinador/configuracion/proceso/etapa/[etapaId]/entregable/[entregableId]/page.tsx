"use client";

import DetalleEntregablePage from "@/features/configuracion/views/detalle-entregable-page";
import type React from "react";
import { useParams } from "next/navigation";

const Page: React.FC = () => {
  const params = useParams();
  const etapaId = params?.etapaId as string;
  const entregableId = params?.entregableId as string;
  return (
    <DetalleEntregablePage etapaId={etapaId} entregableId={entregableId} />
  );
};

export default Page;
