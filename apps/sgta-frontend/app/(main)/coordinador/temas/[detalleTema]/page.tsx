"use client";

import { buscarTemaPorId } from "@/features/temas/types/solicitudes/data";
import { Tema } from "@/features/temas/types/temas/entidades";
import DetalleTemasCoordinadorPage from "@/features/temas/views/detalle-temas-coordinador-page";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page: React.FC = () => {
  const params = useParams();
  const idTema = Number(params.detalleTema);
  const [tema, setTema] = useState<Tema | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTema() {
      if (!idTema) return;
      const tema = await buscarTemaPorId(idTema);
      setTema(tema);
      setLoading(false);
    }
    fetchTema();
  }, [idTema]);
  return (
    <DetalleTemasCoordinadorPage
      tema={tema}
      setTema={setTema}
      loading={loading}
    />
  );
};

export default Page;

