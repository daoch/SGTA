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
    { idTema: 1, nombre: "Redes Neuronales", area: areas[0] },
    { idTema: 2, nombre: "Visión por Computadora", area: areas[0] },
    { idTema: 3, nombre: "Procesamiento de Lenguaje Natural", area: areas[0] },
    { idTema: 4, nombre: "Aprendizaje Profundo", area: areas[0] },
    { idTema: 5, nombre: "Aprendizaje por Refuerzo", area: areas[0] },
    { idTema: 6, nombre: "Algoritmos Genéticos", area: areas[0] },
    { idTema: 7, nombre: "Minería de Datos", area: areas[1] },
    { idTema: 8, nombre: "Big Data", area: areas[1] },
    { idTema: 9, nombre: "Análisis Predictivo", area: areas[1] },
    { idTema: 10, nombre: "Seguridad Informática", area: areas[3] },
    { idTema: 11, nombre: "Criptografía", area: areas[3] },
    { idTema: 12, nombre: "Desarrollo Frontend", area: areas[2] },
    { idTema: 13, nombre: "Desarrollo Backend", area: areas[2] },
    { idTema: 14, nombre: "DevOps", area: areas[15] },
    { idTema: 15, nombre: "Microservicios", area: areas[14] },
    { idTema: 16, nombre: "Contenedores", area: areas[4] },
    { idTema: 17, nombre: "Computación Distribuida", area: areas[4] },
    { idTema: 18, nombre: "Computación Paralela", area: areas[4] },
    { idTema: 19, nombre: "Sistemas Embebidos", area: areas[6] },
    { idTema: 20, nombre: "Automatización", area: areas[7] },
  ];
};

export const getAsesorMock = (): Asesor => {
  const areas = getAreasDisponibles();
  const temas = getTemasDisponibles();
  return {
    nombre: "Dr. Roberto Sánchez",
    especialidad: "Ingeniería Informático",
    email: "roberto.sanchez@pucp.edu.pe",
    linkedin: "https://www.linkedin.com/in/roberto-sanchez-9f242/",
    repositorio: "Ver repositorio completo",
    biografia:
      "Doctor en Ciencias de la Computación con especialización en Inteligencia Artificial...",
    disponible: true,
    limiteTesis: 8,
    tesis: [
      {
        titulo:
          "Sistema de detección de objetos en tiempo real para vehículos autónomos",
        estudiante: "Carlos Mendoza",
        año: "2023",
        nivel: "Finalizada",
        estado: "terminada",
      },
      {
        titulo: "Reconocimiento facial en entornos no controlados",
        estudiante: "Ana García",
        año: "2022",
        nivel: "Finalizada",
        estado: "terminada",
      },
      {
        titulo:
          "Clasificación de imágenes médicas mediante redes neuronales convolucionales",
        estudiante: "Pedro López",
        año: "2021",
        nivel: "Finalizada",
        estado: "terminada",
      },
      {
        titulo:
          "Análisis de sentimientos en redes sociales usando transformers",
        estudiante: "María Rodríguez",
        año: "2024",
        nivel: "Tesis 1",
        estado: "en_proceso",
      },
      {
        titulo: "Desarrollo de un asistente virtual para atención médica",
        estudiante: "Juan Pérez",
        año: "2024",
        nivel: "Tesis 2",
        estado: "en_proceso",
      },
    ],
    areasTematicas: [
      areas.find((a) => a.nombre === "Inteligencia Artificial")!,
      areas.find((a) => a.nombre === "Ciencia de Datos")!,
    ],
    temasInteres: [
      temas.find((t) => t.nombre === "Redes Neuronales")!,
      temas.find((t) => t.nombre === "Visión por Computadora")!,
      temas.find((t) => t.nombre === "Procesamiento de Lenguaje Natural")!,
    ],
  };
};
