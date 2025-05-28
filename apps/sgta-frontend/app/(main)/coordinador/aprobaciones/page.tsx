"use client";

import SolicitudesPendientes from "@/features/temas/views/solicitudes-pendientes";
import {
  fetchCarrerasMiembroComite,
  listarTemasPorCarrera,
} from "@/features/temas/types/solicitudes/data";
import React, { useEffect, useState } from "react";
import { Tema } from "@/features/temas/types/temas/entidades";
import { SolicitudPendiente } from "@/features/temas/types/solicitudes/entities";
import {
  EstadoSolicitud,
  TipoSolicitud,
} from "@/features/temas/types/solicitudes/enums";
import { ejemploUsuario } from "@/features/temas/types/solicitudes/mock"; // O importa un usuario de ejemplo

const Page: React.FC = () => {
  const [temas, setTemas] = useState<Tema[]>([]);
  const usuarioId = Number(process.env.NEXT_PUBLIC_ID_USUARIO) || 1;

  useEffect(() => {
    async function fetchAllTemas() {
      // 1. Obtener carreras del usuario
      const carreras = await fetchCarrerasMiembroComite(usuarioId);
      const carreraIds = (carreras || []).map((c) => c.id);

      // 2. Obtener temas de todas las carreras con estado INSCRITO
      const temasPorCarrera = await Promise.all(
        carreraIds.map((id) => listarTemasPorCarrera(id, "INSCRITO")),
      );
      // 3. Unir todos los temas en una sola lista
      const todosLosTemas = temasPorCarrera.flat();
      setTemas(todosLosTemas);
    }
    fetchAllTemas();
  }, [usuarioId]);

  // Mapea los temas a solicitudes con data harcodeada
  const solicitudes: SolicitudPendiente[] = temas.map((tema, idx) => ({
    id: idx + 1,
    tipo: TipoSolicitud.INCRIPCION_TEMA,
    titulo: tema.titulo,
    tema,
    solicitante: ejemploUsuario, // Usuario de ejemplo
    fechaSolicitud: tema.fechaCreacion || new Date().toISOString(),
    estado: EstadoSolicitud.PENDIENTE,
  }));

  return <SolicitudesPendientes solicitudes={solicitudes} />;
};

export default Page;

