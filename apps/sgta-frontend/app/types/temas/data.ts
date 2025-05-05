import { TemaForm } from "./entidades";

export const emptyTemaForm: TemaForm = {
  tipoRegistro: "",
  titulo: "",
  areaInvestigacion: "",
  descripcion: "",
  coasesores: [],
  asesorPrincipal: "Dr. Roberto Sánchez",
  estudiantes: [],
  requisitos: "",
  fechaLimite: "",
};

export const coasesoresDisponibles = [
  "Dra. Carmen Vega",
  "Dr. Miguel Torres",
  "Dra. Laura Mendoza",
  "Dr. Javier Pérez",
];

export const estudiantesDisponibles = [
  "Ana García (20190123)",
  "Pedro López (20190456)",
  "Carlos Mendoza (20180789)",
  "María Torres (20180111)",
  "Juan Pérez (20180222)",
  "Roberto Sánchez (20190789)",
  "Diego Flores (20191000)",
];

export const areasDeInvestigacion = [
  { key: "ia", name: "Inteligencia Artificial" },
  { key: "web", name: "Desarrollo Web" },
  { key: "datos", name: "Ciencia de Datos" },
  { key: "iot", name: "Internet de las Cosas" },
  { key: "seguridad", name: "Seguridad Informática" },
  { key: "bd", name: "Bases de Datos" },
  { key: "grafica", name: "Computación Gráfica" },
  { key: "redes", name: "Redes y Comunicaciones" },
  { key: "pln", name: "Procesamiento de Lenguaje Natural" },
  { key: "vr", name: "Realidad Virtual y Aumentada" },
];

