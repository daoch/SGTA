"use client";

import SolicitudCeseDetalle from "@/features/asesores/views/detalle-solicitud-cese-tema";
import { useParams } from "next/navigation";

const Page: React.FC = () => {
  const params = useParams();
  const id = params?.id ? Number(params.id) : null;
  if (id === null || isNaN(id)) {
    return <div>Error: ID de solicitud inválido.</div>;
  }
  return <SolicitudCeseDetalle idSolicitud={id} />;
};

export default Page;
