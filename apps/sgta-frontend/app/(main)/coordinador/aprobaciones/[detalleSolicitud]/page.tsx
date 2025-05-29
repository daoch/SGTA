"use client";

import DetalleSolicitudesCoordinadorPage from "@/features/temas/views/detalle-solicitudes-coordinador-page";
import { buscarTemaPorId } from "@/features/temas/types/solicitudes/data";
import { useParams } from "next/navigation";
import { getSolicitudFromTema } from "@/features/temas/types/solicitudes/lib";
import { useEffect, useState } from "react";

const Page: React.FC = () => {
  const params = useParams();
  const idTema = Number(params.detalleSolicitud);

  const [solicitud, setSolicitud] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSolicitud() {
      if (!idTema) return;
      const tema = await buscarTemaPorId(idTema);
      const solicitudGenerada = getSolicitudFromTema(tema, 0);
      setSolicitud(solicitudGenerada);
      setLoading(false);
    }
    fetchSolicitud();
  }, [idTema]);

  if (loading) {
    return <div>Cargando solicitud...</div>;
  }

  return <DetalleSolicitudesCoordinadorPage solicitud={solicitud} />;
};

export default Page;
