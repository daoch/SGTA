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
 *
 *    Body:
 *    {
 *      tema: {
 *        id: number,
 *        estadoTemaNombre: "REGISTRADO" | "RECHAZADO" | "OBSERVADO"
 *      },
 *      usuarioSolicitud: {
 *        usuarioId: number,
 *        comentario: string
 *      }
 *    }
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
 *
 *  Recomendación de diseño:
 *  - Sí, es muy conveniente que esta acción quede registrada en el historial de la tesis
 *    (por trazabilidad).
 *  - Deberíamos permitir además un comentario opcional para explicar la razón.
 *
 *  Para ello, podemos ampliar el endpoint para aceptar:
 *    • usuarioId           → como query param (ya lo tenías)
 *    • comentario?         → como query param opcional, o bien en el body.
 *
 *  En este ejemplo lo pasamos por query params:
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

