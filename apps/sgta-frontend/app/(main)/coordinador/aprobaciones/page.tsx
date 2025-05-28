"use client";

import SolicitudesPendientes from "@/features/temas/views/solicitudes-pendientes";
import { listarTemasPorCarrera } from "@/features/temas/types/solicitudes/data";
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
  const carreraId = 1; // Cambia esto por el id real de la carrera
  const estado = "INSCRITO"; // O el estado que necesites

  useEffect(() => {
    listarTemasPorCarrera(carreraId, estado).then(setTemas);
  }, [carreraId, estado]);

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

