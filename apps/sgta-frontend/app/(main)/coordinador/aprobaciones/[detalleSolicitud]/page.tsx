"use client";

import { buscarTemaPorId } from "@/features/temas/types/solicitudes/data";
import { getSolicitudFromTema } from "@/features/temas/types/solicitudes/lib";
import DetalleSolicitudesCoordinadorPage from "@/features/temas/views/detalle-solicitudes-coordinador-page";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const Page: React.FC = () => {
  const params = useParams();
  const idTema = Number(params.detalleSolicitud);

  const [tema, setTema] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSolicitud() {
      if (!idTema) return;
      const tema = await buscarTemaPorId(idTema);
      setTema(tema);
      setLoading(false);
    }
    fetchSolicitud();
  }, [idTema]);

  if (loading) {
    return <div>Cargando solicitud...</div>;
  }

  return (
    <DetalleSolicitudesCoordinadorPage
      solicitud={getSolicitudFromTema(tema, 0)}
      setTema={setTema}
    />
  );
};

export default Page;

