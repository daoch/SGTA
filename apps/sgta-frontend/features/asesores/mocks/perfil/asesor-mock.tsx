import type {
  AreaTematica,
  Asesor,
  TemaInteres,
} from "@/features/asesores/types/perfil/entidades"; // ajusta según tu estructura

export const getAreasDisponibles = (): AreaTematica[] => [
  { idArea: 1, nombre: "Inteligencia Artificial" },
  { idArea: 2, nombre: "Ciencia de Datos" },
  { idArea: 3, nombre: "Desarrollo Web" },
  { idArea: 4, nombre: "Ciberseguridad" },
  { idArea: 5, nombre: "Computación en la Nube" },
  { idArea: 6, nombre: "Blockchain" },
  { idArea: 7, nombre: "Internet de las Cosas" },
  { idArea: 8, nombre: "Robótica" },
  { idArea: 9, nombre: "Realidad Virtual" },
  { idArea: 10, nombre: "Realidad Aumentada" },
  { idArea: 11, nombre: "Aprendizaje Automático" },
  { idArea: 12, nombre: "Procesamiento de Lenguaje Natural" },
  { idArea: 13, nombre: "Visión por Computadora" },
  { idArea: 14, nombre: "Bases de Datos" },
  { idArea: 15, nombre: "Arquitectura de Software" },
  { idArea: 16, nombre: "Ingeniería de Software" },
  { idArea: 17, nombre: "Redes de Computadoras" },
  { idArea: 18, nombre: "Sistemas Operativos" },
  { idArea: 19, nombre: "Computación Cuántica" },
  { idArea: 20, nombre: "Bioinformática" },
];

export const getTemasDisponibles = (): TemaInteres[] => {
  const areas = getAreasDisponibles();
  return [
    { idTema: 1, nombre: "Redes Neuronales", areaTematica: areas[0] },
    { idTema: 2, nombre: "Visión por Computadora", areaTematica: areas[0] },
    {
      idTema: 3,
      nombre: "Procesamiento de Lenguaje Natural",
      areaTematica: areas[0],
    },
    { idTema: 4, nombre: "Aprendizaje Profundo", areaTematica: areas[0] },
    { idTema: 5, nombre: "Aprendizaje por Refuerzo", areaTematica: areas[0] },
    { idTema: 6, nombre: "Algoritmos Genéticos", areaTematica: areas[0] },
    { idTema: 7, nombre: "Minería de Datos", areaTematica: areas[1] },
    { idTema: 8, nombre: "Big Data", areaTematica: areas[1] },
    { idTema: 9, nombre: "Análisis Predictivo", areaTematica: areas[1] },
    { idTema: 10, nombre: "Seguridad Informática", areaTematica: areas[3] },
    { idTema: 11, nombre: "Criptografía", areaTematica: areas[3] },
    { idTema: 12, nombre: "Desarrollo Frontend", areaTematica: areas[2] },
    { idTema: 13, nombre: "Desarrollo Backend", areaTematica: areas[2] },
    { idTema: 14, nombre: "DevOps", areaTematica: areas[15] },
    { idTema: 15, nombre: "Microservicios", areaTematica: areas[14] },
    { idTema: 16, nombre: "Contenedores", areaTematica: areas[4] },
    { idTema: 17, nombre: "Computación Distribuida", areaTematica: areas[4] },
    { idTema: 18, nombre: "Computación Paralela", areaTematica: areas[4] },
    { idTema: 19, nombre: "Sistemas Embebidos", areaTematica: areas[6] },
    { idTema: 20, nombre: "Automatización", areaTematica: areas[7] },
  ];
};

export const getAsesorMock = (): Asesor => {
  const areas = getAreasDisponibles();
  const temas = getTemasDisponibles();
  return {
    id: 1,
    nombre: "Dr. Roberto Sánchez",
    especialidad: "Ingeniería Informático",
    email: "roberto.sanchez@pucp.edu.pe",
    linkedin: "https://www.linkedin.com/in/roberto-sanchez-9f242/",
    repositorio: "Ver repositorio completo",
    biografia:
      "Doctor en Ciencias de la Computación con especialización en Inteligencia Artificial...",
    tesistasActuales: 6,
    limiteTesis: 8,
    areasTematicas: [
      areas.find((a) => a.nombre === "Inteligencia Artificial")!,
      areas.find((a) => a.nombre === "Ciencia de Datos")!,
    ],
    temasIntereses: [
      temas.find((t) => t.nombre === "Redes Neuronales")!,
      temas.find((t) => t.nombre === "Visión por Computadora")!,
      temas.find((t) => t.nombre === "Procesamiento de Lenguaje Natural")!,
    ],
    estado: true,
  };
};
