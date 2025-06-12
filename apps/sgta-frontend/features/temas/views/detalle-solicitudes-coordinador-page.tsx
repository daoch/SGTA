"use client";

import { Dispatch, useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import { AccionesDetalleSoliTema } from "../components/coordinador/detalle-solicitud-tema/acciones-detalle-soli-tema";
import { AnalisisSimilitudTema } from "../components/coordinador/detalle-solicitud-tema/analisis-similitud-tema";
import { ComentariosDetalleSolicitudTema } from "../components/coordinador/detalle-solicitud-tema/comentarios-detalle-solicitud-tema";
import { EncabezadoDetalleSolicitudTema } from "../components/coordinador/detalle-solicitud-tema/encabezado-detalle-solicitud-tema";
import { HistorialDetalleSolicitudTema } from "../components/coordinador/detalle-solicitud-tema/historial-detalle-solicitud-tema";
import { InfoDetalleSolicitudTema } from "../components/coordinador/detalle-solicitud-tema/info-detalle-solicitud-tema";
import {
  buscarTemaPorId,
  cambiarEstadoTemaPorCoordinador,
  crearSolicitudCambioResumen,
  crearSolicitudCambioTitulo,
  eliminarTemaPorCoordinador,
  fetchTemasSimilares,
} from "../types/solicitudes/data";
import {
  SolicitudAction,
  SolicitudPendiente,
  TemaSimilar,
  TypeSolicitud,
} from "../types/solicitudes/entities";
import { Tema } from "../types/temas/entidades";
import { EstadoTemaNombre } from "../types/temas/enums";

const actionToStateMap: Record<SolicitudAction, EstadoTemaNombre> = {
  Aprobada: EstadoTemaNombre.REGISTRADO,
  Rechazada: EstadoTemaNombre.RECHAZADO,
  Observada: EstadoTemaNombre.OBSERVADO,
  Eliminada: EstadoTemaNombre.RECHAZADO,
};

interface Props {
  solicitud: SolicitudPendiente;
  setTema: Dispatch<Tema>;
}

// MOCK de historial
const historialMock = [
  {
    fecha: "2024-01-15",
    accion: "Solicitud creada",
    responsable: "Sistema",
    comentario: "Solicitud enviada por el estudiante",
  },
  {
    fecha: "2024-01-16",
    accion: "Asignada para evaluación",
    responsable: "Dr. Ana Pérez",
    comentario: "Asignada al comité de evaluación",
  },
];

export default function DetalleSolicitudesCoordinadorPage({
  solicitud,
  setTema,
}: Readonly<Props>) {
  const router = useRouter();
  const [comentario, setComentario] = useState("");
  const [dialogAbierto, setDialogAbierto] = useState<
    "aprobar" | "rechazar" | "observar" | "eliminar" | ""
  >("");
  const [errorComentario, setErrorComentario] = useState("");
  const [tipoSolicitud, setTipoSolicitud] = useState<TypeSolicitud>();
  const [errorTipoSolicitud, setErrorTipoSolicitud] = useState("");
  const [loading, setLoading] = useState(false);
  const [similares, setSimilares] = useState<TemaSimilar[] | []>([]);

  const errorTexts = {
    tipoSolicitud: "Ingresar el tipo de solicitud.",
    comentario: "Debe ingresar un comentario para la solicitud.",
  };

  const handleAccion = async (accion: SolicitudAction) => {
    try {
      setLoading(true);
      if (accion === "Eliminada") {
        await eliminarTemaPorCoordinador(solicitud.tema.id);
        router.push("/coordinador/aprobaciones");
      } else {
        // Actualizar Estado del tema
        const payload = {
          tema: {
            id: solicitud.tema.id,
            estadoTemaNombre: actionToStateMap[accion],
          },
          usuarioSolicitud: {
            usuarioId: 3, // !: Id de coordinador
            comentario,
          },
        };

        await cambiarEstadoTemaPorCoordinador(payload);

        // Crear solicitud
        if (
          tipoSolicitud &&
          tipoSolicitud !== "no-enviar" &&
          accion !== "Rechazada"
        ) {
          if (tipoSolicitud === "resumen") {
            await crearSolicitudCambioResumen(solicitud.tema.id, comentario);
          } else {
            await crearSolicitudCambioTitulo(solicitud.tema.id, comentario);
          }
        }
      }

      toast.success(`Solicitud ${accion.toLowerCase()} exitosamente.`);
      setDialogAbierto("");
      await buscarTemaPorId(solicitud.tema.id).then(setTema);
    } catch (error) {
      console.error("Error al procesar la solicitud:", error);
      toast.error("Ocurrió un error. Por favor, intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const validateComment = () => {
    if (!comentario.trim() && tipoSolicitud !== "no-enviar") {
      setErrorComentario(errorTexts.comentario);
    } else {
      setErrorComentario("");
    }
  };

  const validateTipoSolicitud = () => {
    if (!tipoSolicitud?.trim()) {
      setErrorTipoSolicitud(errorTexts.tipoSolicitud);
    } else {
      setErrorTipoSolicitud("");
    }
  };

  useEffect(() => {
    validateComment();
    validateTipoSolicitud();
  }, [tipoSolicitud, comentario]);

  async function obtenerTemasSimilares(
    temaId: number,
    setSimilares: (s: TemaSimilar[]) => void,
  ) {
    try {
      const similares = await fetchTemasSimilares(temaId);
      setSimilares(similares);
    } catch (error) {
      console.error("Error al obtener temas similares:", error);
      setSimilares([]);
    }
  }

  useEffect(() => {
    obtenerTemasSimilares(solicitud.tema.id, setSimilares);
  }, [solicitud.tema.id]);

  // Config Actions
  const accionesConfig = {
    observar: {
      show: true,
      disabled:
        tipoSolicitud === "no-enviar" ||
        !comentario.trim().length ||
        !tipoSolicitud?.trim().length ||
        loading,
    },
    aprobar: {
      show: true,
      disabled: !tipoSolicitud || loading,
    },
    rechazar: {
      show: true,
      disabled: loading,
    },
    eliminar: { show: true, disabled: loading },
  };

  const moduloAnalisisSimilitud = (
    <AnalisisSimilitudTema similares={similares} />
  );

  return (
    <>
      <Toaster position="top-right" richColors />
      <form className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-6xl mx-auto space-y-6 flex flex-col md:flex-row gap-6">
          <div className="flex flex-col gap-4 md:w-3/5">
            <EncabezadoDetalleSolicitudTema solicitud={solicitud} />
            <InfoDetalleSolicitudTema solicitud={solicitud} />
            {solicitud.estado === EstadoTemaNombre.INSCRITO &&
              moduloAnalisisSimilitud}
            <HistorialDetalleSolicitudTema historial={historialMock} />
          </div>

          <div className="flex flex-col gap-4 md:w-2/5">
            {/* Comentarios del Comité y selección del tipo de solicitud */}
            {solicitud.estado === EstadoTemaNombre.INSCRITO ? (
              <>
                <ComentariosDetalleSolicitudTema
                  comentario={comentario}
                  setComentario={setComentario}
                  errorComentario={errorComentario}
                  setTipoSolicitud={setTipoSolicitud}
                  errorTipoSolicitud={errorTipoSolicitud}
                  comentarioOpcional={tipoSolicitud === "no-enviar"}
                />

                {/* Actions */}
                <AccionesDetalleSoliTema
                  accionesConfig={accionesConfig}
                  dialogAbierto={dialogAbierto}
                  handleAccion={handleAccion}
                  setDialogAbierto={setDialogAbierto}
                />
              </>
            ) : (
              moduloAnalisisSimilitud
            )}
          </div>
        </div>
      </form>
    </>
  );
}

