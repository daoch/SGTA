import { Tipo } from "./enums";

export const pageTexts = {
  title: "Mis Temas",
  description: "Gestión de temas de tesis propuestos y asignados",
  newTemaButton: {
    displayName: "Nuevo Tema",
  },
};

export const tableTexts = {
  [Tipo.TODOS]: {
    title: "Todos los temas",
    description: "Lista de todos los temas de tesis",
    tabLabel: "Todos",
    show: false,
  },
  [Tipo.INSCRITO]: {
    title: "Temas inscritos",
    description: "Temas de tesis en los que estás inscrito",
    tabLabel: "Inscritos",
    show: true,
  },
  [Tipo.LIBRE]: {
    title: "Temas libres",
    description: "Temas de tesis disponibles para postular",
    tabLabel: "Libres",
    show: true,
  },
  [Tipo.INTERESADO]: {
    title: "Temas de interés",
    description: "Temas de tesis que has marcado como interesantes",
    tabLabel: "Interesantes",
    show: true,
  },
};

