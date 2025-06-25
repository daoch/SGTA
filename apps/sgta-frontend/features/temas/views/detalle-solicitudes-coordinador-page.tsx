"use client";

import { Dispatch, useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import { AccionesDetalleSoliTema } from "../components/coordinador/detalle-solicitud-tema/acciones-detalle-soli-tema";
import { AnalisisSimilitudTema } from "../components/coordinador/detalle-solicitud-tema/analisis-similitud-tema";
import { ComentariosDetalleSolicitudTema } from "../components/coordinador/detalle-solicitud-tema/comentarios-detalle-solicitud-tema";
import { DialogSolicitudes } from "../components/coordinador/detalle-solicitud-tema/dialog-solicitudes";
import { EncabezadoDetalleSolicitudTema } from "../components/coordinador/detalle-solicitud-tema/encabezado-detalle-solicitud-tema";
import { HistorialDetalleSolicitudTema } from "../components/coordinador/detalle-solicitud-tema/historial-detalle-solicitud-tema";
import { InfoDetalleSolicitudTema } from "../components/coordinador/detalle-solicitud-tema/info-detalle-solicitud-tema";
import {
  buscarTemaPorId,
  cambiarEstadoTemaPorCoordinador,
  crearSolicitudCambioResumen,
  crearSolicitudCambioTitulo,
  eliminarTemaPorCoordinador,
  fetchSolicitudesDeTema,
  fetchTemasSimilares,
  fetchTodasSolicitudesPendientes,
} from "../types/solicitudes/data";
import {
  SolicitudAction,
  SolicitudGeneral,
  SolicitudPendiente,
  SolicitudTema,
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
  const [tipoSolicitud, setTipoSolicitud] =
    useState<TypeSolicitud>("no-enviar");
  const [errorTipoSolicitud, setErrorTipoSolicitud] = useState("");
  const [loading, setLoading] = useState(false);
  const [similares, setSimilares] = useState<TemaSimilar[] | []>([]);
  const [solicitudes, setSolicitudes] = useState<SolicitudTema[] | []>([]);
  const [listoSolicitudes, setListoSolicitudes] = useState(
    solicitud.estado !== EstadoTemaNombre.OBSERVADO,
  );

  const errorTexts = {
    tipoSolicitud: "Ingresar el tipo de solicitud.",
    comentario: "Debe ingresar un comentario para la solicitud.",
  };

  /*
    Ejecuta lógica de crear solicitudes.
    Cambia el estado en caso el tema está en estado INSCRITO
  */
  const handleAccion = async (accion: SolicitudAction) => {
    try {
      setLoading(true);
      if (accion === "Eliminada") {
        await eliminarTemaPorCoordinador(solicitud.tema.id);
        router.push("/coordinador/aprobaciones");
      } else {
        // Actualizar Estado del tema
        if (
          [EstadoTemaNombre.INSCRITO].includes(solicitud.estado) ||
          (solicitud.estado === EstadoTemaNombre.OBSERVADO &&
            accion !== "Observada")
        ) {
          const payload = {
            tema: {
              id: solicitud.tema.id,
              estadoTemaNombre: actionToStateMap[accion],
            },
            usuarioSolicitud: {
              comentario,
            },
          };

          await cambiarEstadoTemaPorCoordinador(payload);

          setTema(await buscarTemaPorId(solicitud.tema.id)); // Visualizar cambios
        }

        // Crear solicitud
        if (
          tipoSolicitud &&
          tipoSolicitud !== "no-enviar" &&
          accion === "Observada"
        ) {
          if (tipoSolicitud === "resumen") {
            await crearSolicitudCambioResumen(solicitud.tema.id, comentario);
          } else {
            await crearSolicitudCambioTitulo(solicitud.tema.id, comentario);
          }
        }

        // Lists Updated Solicitudes
        getSolicitudes();
      }

      // Show Succes Message
      toast.success(`Solicitud ${accion.toLowerCase()} exitosamente.`);

      // Reestablecer campos
      setDialogAbierto("");
      setComentario("");
      setTipoSolicitud("no-enviar");
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

  async function getSolicitudes() {
    try {
      const data: SolicitudGeneral[] | [] =
        await fetchTodasSolicitudesPendientes();

      setSolicitudes(data.filter((sol) => sol.tema_id === solicitud.tema.id));
      setListoSolicitudes(
        data.reduce(
          (acc, curr) => acc && curr.estado_solicitud !== "PENDIENTE",
          true,
        ),
      );
    } catch (error) {
      console.error("Error al obtener las solicitudes del tema:", error);
      setSolicitudes([]);
    }
  }

  useEffect(() => {
    getSolicitudes();
  }, []);

  // Config Actions
  const accionesConfig = {
    observar: {
      show: [EstadoTemaNombre.INSCRITO, EstadoTemaNombre.OBSERVADO].includes(
        solicitud.estado,
      ),
      disabled:
        tipoSolicitud === "no-enviar" ||
        !comentario.trim().length ||
        !tipoSolicitud?.trim().length ||
        loading,
    },
    aprobar: {
      show: [EstadoTemaNombre.INSCRITO, EstadoTemaNombre.OBSERVADO].includes(
        solicitud.estado,
      ),
      disabled:
        // (!listoSolicitudes &&
        //   solicitud.estado === EstadoTemaNombre.OBSERVADO) ||
        tipoSolicitud !== "no-enviar" || loading,
    },
    rechazar: {
      show: [EstadoTemaNombre.INSCRITO, EstadoTemaNombre.OBSERVADO].includes(
        solicitud.estado,
      ),
      disabled: tipoSolicitud !== "no-enviar" || loading,
    },
    eliminar: { show: true, disabled: loading },
  };

  const moduloAnalisisSimilitud = (
    <AnalisisSimilitudTema similares={similares} />
  );

  const moduloSolicitudes = (
    <DialogSolicitudes
      solicitudes={solicitudes}
      estadoTema={solicitud.estado}
      listoSolicitudes={listoSolicitudes}
      setListoSolicitudes={setListoSolicitudes}
    />
  );

  const temaPorAprobar = [
    EstadoTemaNombre.INSCRITO,
    EstadoTemaNombre.OBSERVADO,
  ].includes(solicitud.estado);
  return (
    <>
      <Toaster position="top-right" richColors />
      <form className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-6xl mx-auto space-y-6 flex flex-col md:flex-row gap-6">
          {/* #1 Detalles del tema */}
          <div className="flex flex-col gap-4 md:w-3/5">
            <EncabezadoDetalleSolicitudTema solicitud={solicitud} />
            <InfoDetalleSolicitudTema solicitud={solicitud} />
            {temaPorAprobar && moduloAnalisisSimilitud}
            <HistorialDetalleSolicitudTema historial={historialMock} />
          </div>

          {/* # 2 Acciones */}
          <div className="flex flex-col gap-4 md:w-2/5">
            {/* Similitudes */}
            {moduloSolicitudes}

            {/* Comentarios del Comité y selección del tipo de solicitud */}
            {temaPorAprobar && (
              <ComentariosDetalleSolicitudTema
                tipoSolicitud={tipoSolicitud}
                setTipoSolicitud={setTipoSolicitud}
                comentario={comentario}
                setComentario={setComentario}
                errorComentario={errorComentario}
                errorTipoSolicitud={errorTipoSolicitud}
                comentarioOpcional={tipoSolicitud === "no-enviar"}
              />
            )}

            {/* Similitud */}
            {!temaPorAprobar && moduloAnalisisSimilitud}

            {/* Actions */}
            <AccionesDetalleSoliTema
              accionesConfig={accionesConfig}
              dialogAbierto={dialogAbierto}
              handleAccion={handleAccion}
              setDialogAbierto={setDialogAbierto}
              loading={loading}
            />
          </div>
        </div>
      </form>
    </>
  );
}

