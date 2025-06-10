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
} from "../types/solicitudes/data";
import {
  SolicitudAction,
  SolicitudPendiente,
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

  // MOCK de similitud
  const similitudMock = {
    porcentaje: 35,
    temasRelacionados: [
      {
        id: "TEMA-2023-089",
        titulo: "Sistema de Inventario para Retail",
        similitud: 45,
      },
      {
        id: "TEMA-2023-156",
        titulo: "Aplicación de IA en Gestión Empresarial",
        similitud: 30,
      },
      {
        id: "TEMA-2024-003",
        titulo: "Dashboard Analítico para PYMES",
        similitud: 25,
      },
    ],
  };

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

  const handleAccion = async (accion: SolicitudAction) => {
    try {
      setLoading(true);
      if (!tipoSolicitud) return;
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
        if (tipoSolicitud === "resumen") {
          await crearSolicitudCambioResumen(solicitud.tema.id, comentario);
        } else {
          await crearSolicitudCambioTitulo(solicitud.tema.id, comentario);
        }

        // Actualizar solicitud
        buscarTemaPorId(solicitud.tema.id).then(setTema);
      }

      toast.success(`Solicitud ${accion.toLowerCase()} exitosamente.`);
      setDialogAbierto("");
    } catch (error) {
      console.error("Error al procesar la solicitud:", error);
      toast.error("Ocurrió un error. Por favor, intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const validateComment = () => {
    if (!comentario.trim()) {
      setErrorComentario("El comentario es obligatorio.");
    } else {
      setErrorComentario("");
    }
  };

  const validateTipoSolicitud = () => {
    if (!tipoSolicitud?.trim()) {
      setErrorTipoSolicitud("Debe ingresar el tipo de solicitud.");
    } else {
      setErrorTipoSolicitud("");
    }
  };

  useEffect(() => {
    validateComment();
    validateTipoSolicitud();
  }, [comentario]);

  // Config Actions
  const accionesConfig = {
    aprobar: {
      show: true,
      disabled:
        !comentario.trim().length || !tipoSolicitud?.trim().length || loading,
    },
    rechazar: {
      show: true,
      disabled:
        !comentario.trim().length || !tipoSolicitud?.trim().length || loading,
    },
    observar: {
      show: true,
      disabled:
        !comentario.trim().length || !tipoSolicitud?.trim().length || loading,
    },
    eliminar: { show: true, disabled: loading },
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      <form className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <EncabezadoDetalleSolicitudTema solicitud={solicitud} />
          <InfoDetalleSolicitudTema solicitud={solicitud} />

          {solicitud.estado === EstadoTemaNombre.INSCRITO && (
            <>
              {/* Comentarios del Comité y selección del tipo de solicitud */}
              <ComentariosDetalleSolicitudTema
                comentario={comentario}
                setComentario={setComentario}
                errorComentario={errorComentario}
                setTipoSolicitud={setTipoSolicitud}
                errorTipoSolicitud={errorTipoSolicitud}
              />

              {/* Actions */}
              <AccionesDetalleSoliTema
                accionesConfig={accionesConfig}
                dialogAbierto={dialogAbierto}
                handleAccion={handleAccion}
                setDialogAbierto={setDialogAbierto}
              />

              {/* Análisis de Similitud */}
              <AnalisisSimilitudTema similitud={similitudMock} />
            </>
          )}

          <HistorialDetalleSolicitudTema historial={historialMock} />
        </div>
      </form>
    </>
  );
}

