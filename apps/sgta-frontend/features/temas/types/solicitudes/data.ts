import { Carrera, Tema } from "@/features/temas/types/temas/entidades";
import axiosInstance from "@/lib/axios/axios-instance";
import { EstadoTemaNombre } from "../temas/enums";

/**
 * 1) Obtener las carreras (y el ID implícito del usuario) de un miembro del comité
 *    GET /usuario/{usuarioId}/carreras
 */
export async function fetchCarrerasMiembroComite(): Promise<Carrera[]> {
  const { data } = await axiosInstance.get<Carrera[]>("/usuario/carreras");
  return data;
}

/**
 * 2) Listar temas pendientes de aprobación de tipo "Inscripción de tema"
 *    GET /temas/listarTemasPorCarrera/{carreraId}/{estado}
 */
export async function listarTemasPorCarrera(
  carreraId: number,
  estado: EstadoTemaNombre,
  limit: number = 10,
  offset: number = 0,
): Promise<Tema[]> {
  const { data } = await axiosInstance.get<Tema[]>(
    `/temas/listarTemasPorCarrera/${carreraId}/${estado}?limit=${limit}&offset=${offset}`,
  );
  return data;
}

// Get tamaño
export async function lenTemasPorCarrera(
  carreraId: number,
  estado: EstadoTemaNombre,
): Promise<number> {
  const temas = await listarTemasPorCarrera(carreraId, estado, 200, 0); // TODO: Debe traer un number
  return temas.length;
}

/**
 * 3) Cambiar el estado de un tema (aprobar, rechazar u observar)
 *    PATCH /temas/CambiarEstadoTemaPorCoordinador
 */
export interface CambioEstadoPayload {
  tema: {
    id: number;
    estadoTemaNombre: EstadoTemaNombre;
  };
  usuarioSolicitud: {
    usuarioId: number;
    comentario: string;
  };
}

export async function cambiarEstadoTemaPorCoordinador(
  payload: CambioEstadoPayload,
): Promise<void> {
  await axiosInstance.patch("/temas/CambiarEstadoTemaPorCoordinador", payload);
}

/**
 * 4) Eliminar un tema como coordinador
 *    DELETE /temas/{temaId}/eliminar?usuarioId=...
 */
export async function eliminarTemaPorCoordinador(
  temaId: number,
): Promise<void> {
  await axiosInstance.patch(`/temas/${temaId}/eliminar`);
}

/**
 * 5) Obtener un tema específico por su ID
 *    GET /temas/buscarTemaPorId?idTema=...
 *
 *    Ejemplo:
 *    GET http://localhost:5000/temas/buscarTemaPorId?idTema=22
 */
export async function buscarTemaPorId(idTema: number): Promise<Tema> {
  const { data } = await axiosInstance.get<Tema>("/temas/buscarTemaPorId", {
    params: { idTema },
  });
  console.log("Tema obtenido:", data);
  return data;
}
/**
 * 7) Crear solicitud de cambio de resumen
 *    POST /temas/solicitud/cambio-resumen/{tema_id}
 *    body: { usuarioSolicitud: { comentario: string } }
 */
export async function crearSolicitudCambioResumen(
  temaId: number,
  comentario: string,
): Promise<void> {
  await axiosInstance.post(`/temas/solicitud/cambio-resumen/${temaId}`, {
    usuarioSolicitud: {
      comentario,
    },
  });
}

/**
 * 6) Crear solicitud de cambio de título
 *    POST /temas/solicitud/cambio-titulo/{tema_id}
 *    body: { usuarioSolicitud: { comentario: string } }
 */
export async function crearSolicitudCambioTitulo(
  temaId: number,
  comentario: string,
): Promise<void> {
  await axiosInstance.post(`/temas/solicitud/cambio-titulo/${temaId}`, {
    usuarioSolicitud: {
      comentario,
    },
  });
}

