"use client";

import SolicitudDetalle from "@/features/asesores/views/detalle-solicitud-cambio-asesor";
import { useParams } from "next/navigation";

const Page: React.FC = () => {
  const params = useParams();
  const id = params?.id ? Number(params.id) : null;

  return <SolicitudDetalle rol="asesor" idSolicitud={id} />;
};

export default Page;
