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

  async function fetchSolicitud(
    idTema: number,
    setTema: (t: Tema | null) => void,
    setLoading: (l: boolean) => void,
  ) {
    setLoading(true);
    try {
      if (!idTema) return;
      const tema = await buscarTemaPorId(idTema);
      setTema(tema);
    } catch (error) {
      console.error("Error al buscar la solicitud:", error);
      setTema(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSolicitud(idTema, setTema, setLoading);
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

