import { EstadoTemaNombre } from "../temas/enums";
import { PagesList } from "./entities";

export const pageSolicitudes = {
  title: "Aprobaciones",
  description: "Gestión de solicitudes de cambios en tesis",
};

export const filters = {
  temaEstados: {
    [EstadoTemaNombre.INSCRITO]: {
      label: "Pendientes",
      title: "Solicitudes Pendientes",
      description: "Solicitudes de cambios que requieren aprobación",
      show: true,
    },
    [EstadoTemaNombre.REGISTRADO]: {
      label: "Aprobadas",
      title: "Solicitudes Aprobadas",
      description: "Solicitudes de cambios que han sido aprobadas",
      show: true,
    },
    [EstadoTemaNombre.OBSERVADO]: {
      label: "Observadas",
      title: "Solicitudes Observadas",
      description: "Solicitudes de cambios que quedaron observadas",
      show: true,
    },
    [EstadoTemaNombre.RECHAZADO]: {
      label: "Rechazadas",
      title: "Solicitudes Rechazadas",
      description: "Solicitudes de cambios que han sido rechazadas",
      show: true,
    },
  },
  search: {
    placeholder: "Buscar por título, tesis o solicitante ...",
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

export const initialPagesList: PagesList = {
  [EstadoTemaNombre.INSCRITO]: {
    pages: {},
    current: 1,
    totalCounts: 0,
  },
  [EstadoTemaNombre.OBSERVADO]: {
    pages: {},
    current: 1,
    totalCounts: 0,
  },
  [EstadoTemaNombre.RECHAZADO]: {
    pages: {},
    current: 1,
    totalCounts: 0,
  },
  [EstadoTemaNombre.REGISTRADO]: {
    pages: {},
    current: 1,
    totalCounts: 0,
  },
};

