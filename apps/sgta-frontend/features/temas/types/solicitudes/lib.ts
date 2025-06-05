import { Tema } from "@/features/temas/types/temas/entidades";
import {
  SolicitudPendiente,
  Solicitante,
} from "@/features/temas/types/solicitudes/entities";
import {
  EstadoSolicitud,
  TipoSolicitud,
} from "@/features/temas/types/solicitudes/enums";
import { ejemploSolicitanteCooasesor } from "@/features/temas/types/solicitudes/mock";
import { EstadoTemaNombre } from "../temas/enums";

/**
 * Transforma un Tema en una SolicitudPendiente.
 * @param tema Tema a transformar
 * @param idx Índice para el id de la solicitud
 * @returns SolicitudPendiente
 */
export function getSolicitudFromTema(
  tema: Tema,
  idx: number,
): SolicitudPendiente {
  let solicitante: Solicitante;
  const asesor = tema.coasesores?.[0];
  if (asesor) {
    solicitante = {
      id: asesor.id,
      tipoSolicitante: asesor.tipoUsuario || "Usuario",
      codigoPucp: asesor.codigoPucp || "",
      nombres: asesor.nombres,
      primerApellido: asesor.primerApellido,
      segundoApellido: asesor.segundoApellido,
      correoElectronico: asesor.correoElectronico,
    };
  } else {
    solicitante = ejemploSolicitanteCooasesor;
  }

  return {
    id: idx + 1,
    tipo: TipoSolicitud.INCRIPCION_TEMA,
    titulo: "Aprobación de tema de tesis",
    tema,
    solicitante,
    fechaSolicitud: tema.fechaCreacion || new Date().toISOString(),
    estado:
      (tema.estadoTemaNombre as EstadoTemaNombre) || EstadoTemaNombre.INSCRITO,
  };
}

function mapEstadoTemaToEstadoSolicitud(estadoTema: string): EstadoSolicitud {
  switch (estadoTema) {
    case "INSCRITO":
      return EstadoSolicitud.PENDIENTE;
    case "REGISTRADO":
      return EstadoSolicitud.ACEPTADA;
    case "RECHAZADO":
      return EstadoSolicitud.RECHAZADA;
    case "OBSERVADO":
      return EstadoSolicitud.OBSEVADA;
    default:
      return EstadoSolicitud.PENDIENTE;
  }
}

export function mapEstadoSolToClassName(estado: EstadoTemaNombre): string {
  switch (estado) {
    case EstadoTemaNombre.INSCRITO:
      return "bg-purple-100 text-purple-800 hover:bg-purple-100";
    case EstadoTemaNombre.REGISTRADO:
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case EstadoTemaNombre.OBSERVADO:
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case EstadoTemaNombre.RECHAZADO:
      return "bg-red-100 text-red-800 hover:bg-red-100";
    default:
      return "bg-purple-100 text-purple-800 hover:bg-purple-100";
  }
}

