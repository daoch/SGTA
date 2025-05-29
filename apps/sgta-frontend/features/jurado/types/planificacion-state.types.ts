import { EstadoPlanificacion, Tema, TimeSlot } from "./jurado.types";

export interface PlanificacionState {
  estadoPlanificacion: EstadoPlanificacion | undefined; // Estado actual de la planificación
  temas: Tema[]; // Lista completa de temas (no cambia)
  temasSinAsignar: Tema[]; // Lista de temas sin asignar
  temasAsignados: Record<string, Tema>; // Temas asignados a bloques
  bloques: TimeSlot[]; // Lista de bloques

  // Métodos para establecer los estados
  setEstadoPlanificacion: (estado: EstadoPlanificacion) => void;
  setTemas: (temas: Tema[]) => void;
  setTemasSinAsignar: (temas: Tema[]) => void;
  setTemasAsignados: (asignados: Record<string, Tema>) => void;
  setBloques: (bloques: TimeSlot[]) => void;

  actualizarBloque: (idBloque: number, datos: Partial<TimeSlot>) => void;
  actualizarBloqueByKey: (key: string, datos: Partial<TimeSlot>) => void;

  // Métodos para asignar y desasignar temas a bloques
  asignarTemaABloque: (tema: Tema, bloqueId: number) => void;
  desasignarTemaDeBloque: (bloqueId: number) => void;
  desasignarTodosLosTemas: () => void;
}
