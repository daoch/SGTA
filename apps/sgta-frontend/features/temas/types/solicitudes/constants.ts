import { EstadoTemaNombre } from "../temas/enums";
import { PagesList } from "./entities";

export const pageTexts = {
  title: "Aprobaciones",
  description: "Gestión de solicitudes de cambios en tesis",
};

const initialPagesListTemas: PagesList = {
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

export const pageTemasTexts = {
  states: {
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
  searhbar: {
    placeholder: "Buscar por título, tesis o solicitante ...",
  },
  initialPagesList: initialPagesListTemas,
};

export const pageSolitudesTexts = {
  states: {},
  searchbar: {
    placeholder: "Buscar por nombre de solicitud ...",
  },
  initialPagesList: null,
};

