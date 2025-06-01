"use client";

import { buscarTemaPorId } from "@/features/temas/types/solicitudes/data";
import { getSolicitudFromTema } from "@/features/temas/types/solicitudes/lib";
import { Tema } from "@/features/temas/types/temas/entidades";
import DetalleSolicitudesCoordinadorPage from "@/features/temas/views/detalle-solicitudes-coordinador-page";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const Page: React.FC = () => {
  const params = useParams();
  const idTema = Number(params.detalleSolicitud);

  const [tema, setTema] = useState<Tema | null>(null);
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

  if (!tema) {
    return <div>Error: No se encontró la solicitud.</div>;
  }

  return (
    <DetalleSolicitudesCoordinadorPage
      solicitud={getSolicitudFromTema(tema, 0)}
      setTema={setTema}
    />
  );
};

export default Page;

