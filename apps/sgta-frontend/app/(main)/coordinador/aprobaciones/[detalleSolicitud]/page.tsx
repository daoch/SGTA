"use client";

import { ejemploSolicitudPendiente } from "@/features/temas/types/solicitudes/mock";
import DetalleSolicitudesCoordinadorPage from "@/features/temas/views/detalle-solicitudes-coordinador-page";
import React from "react";

const Page: React.FC = () => {
  return (
    <DetalleSolicitudesCoordinadorPage solicitud={ejemploSolicitudPendiente} />
  );
};

export default Page;

