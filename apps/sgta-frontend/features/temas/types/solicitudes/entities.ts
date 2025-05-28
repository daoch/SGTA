import { Tema, Usuario } from "../temas/entidades";
import { EstadoSolicitud, TipoSolicitud } from "./enums";

export interface SolicitudPendiente {
  id: number;
  tipo: TipoSolicitud;
  titulo: string;
  tema: Tema;
  solicitante: Usuario;
  fechaSolicitud: string; // formato ISO
  estado: EstadoSolicitud;
}

