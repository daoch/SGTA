import { EstadoSolicitud } from "./enums";

export const pageSolicitudes = {
  title: "Aprobaciones",
  description: "Gestión de solicitudes de cambios en tesis",
};

export const filters = {
  temaEstados: {
    [EstadoSolicitud.PENDIENTE]: {
      label: "Pendientes",
      title: "Solicitudes Pendientes",
      description: "Solicitudes de cambios que requieren aprobación",
    },
    [EstadoSolicitud.ACEPTADA]: {
      label: "Aprobadas",
      title: "Solicitudes Aprobadas",
      description: "Solicitudes de cambios que han sido aprobadas",
    },
    [EstadoSolicitud.OBSEVADA]: {
      label: "Observadas",
      title: "Solicitudes Observadas",
      description: "Solicitudes de cambios que quedaron observadas",
    },
    [EstadoSolicitud.RECHAZADA]: {
      label: "Rechazadas",
      title: "Solicitudes Rechazadas",
      description: "Solicitudes de cambios que han sido rechazadas",
    },
  },
  search: {
    placeholder: "Buscar por título o tesis",
  },
  filterTipos: {
    todos: {
      label: "Todos los temas",
      title: "Todos los temas",
      description: "Muestra todos los temas sin filtrar por tipo.",
    },
    inscripcion: {
      label: "Incripción de tema",
      title: "Incripción de tema",
      description: "Filtra solo las solicitudes de inscripción de tema.",
    },
  },
};
