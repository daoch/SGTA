"use client";

import { getSolicitudFromTema } from "@/features/temas/types/solicitudes/lib";
import {
  fetchCarrerasMiembroComite,
  listarTemasPorCarrera,
} from "@/features/temas/types/solicitudes/data";
import { SolicitudPendiente } from "@/features/temas/types/solicitudes/entities";
import { idCoasesor } from "@/features/temas/types/solicitudes/mock";
import { Tema } from "@/features/temas/types/temas/entidades";
import SolicitudesPendientes from "@/features/temas/views/solicitudes-pendientes";
import React, { useEffect, useState } from "react";

const Page: React.FC = () => {
  const [temas, setTemas] = useState<Tema[]>([]);
  const [loading, setLoading] = useState(true);
  const usuarioId = idCoasesor;

  useEffect(() => {
    async function fetchAllTemas() {
      // 1. Obtener carreras del usuario
      const carreras = await fetchCarrerasMiembroComite(usuarioId);
      const carreraIds = (carreras || []).map((c) => c.id);

      // 2. Obtener temas de todas las carreras
      const temasPorCarrera = await Promise.all(
        carreraIds.flatMap((id) => [
          listarTemasPorCarrera(id, "INSCRITO"),
          listarTemasPorCarrera(id, "REGISTRADO"),
          listarTemasPorCarrera(id, "RECHAZADO"),
          listarTemasPorCarrera(id, "OBSERVADO"),
        ]),
      );
      // 3. Unir todos los temas en una sola lista
      const todosLosTemas = temasPorCarrera.flat();
      setTemas(todosLosTemas);
      setLoading(false);
    }
    fetchAllTemas();
  }, [usuarioId]);

  // Mapea los temas a solicitudes
  const solicitudes: SolicitudPendiente[] = temas.map((tema, idx) =>
    getSolicitudFromTema(tema, idx),
  );

  return <SolicitudesPendientes solicitudes={solicitudes} loading={loading} />;
};

export default Page;

