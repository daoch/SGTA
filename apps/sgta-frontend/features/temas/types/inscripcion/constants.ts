import { PagesList } from "../solicitudes/entities";
import { EstadoTemaNombre } from "../temas/enums";

export const pageTexts = {
  title: "Mis Temas",
  description: "Gestión de temas de tesis propuestos y asignados",
  newTemaButton: {
    displayName: "Nuevo Tema",
  },
};

export const tableTexts = {
  [EstadoTemaNombre.REGISTRADO]: {
    title: "Temas registrados",
    description: "Temas de tesis que han sido aprobados por el comité de tesis",
    tabLabel: "Registrados",
    show: true,
  },
  [EstadoTemaNombre.INSCRITO]: {
    title: "Temas inscritos",
    description: "Temas de tesis en los que estás inscrito",
    tabLabel: "Inscritos",
    show: true,
  },
  [EstadoTemaNombre.PROPUESTO_LIBRE]: {
    title: "Temas libres",
    description: "Temas de tesis disponibles para postular",
    tabLabel: "Libres",
    show: true,
  },
  [EstadoTemaNombre.PROPUESTO_GENERAL]: {
    title: "Temas de interés",
    description: "Temas de tesis que has marcado como interesantes",
    tabLabel: "Interesantes",
    show: true,
  },
};

export const initialPagination: PagesList = {
  [EstadoTemaNombre.REGISTRADO]: {
    pages: {},
    current: 1,
    totalCounts: 0,
  },
  [EstadoTemaNombre.INSCRITO]: {
    pages: {},
    current: 1,
    totalCounts: 0,
  },
  [EstadoTemaNombre.PROPUESTO_LIBRE]: {
    pages: {},
    current: 1,
    totalCounts: 0,
  },
  [EstadoTemaNombre.PROPUESTO_GENERAL]: {
    pages: {},
    current: 1,
    totalCounts: 0,
  },
};

