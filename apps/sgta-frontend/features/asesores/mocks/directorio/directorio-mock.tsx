import {
  AreaTematica,
  Asesor,
  TemaInteres,
} from "@/features/asesores/types/perfil/entidades"; // ajusta según tu estructura

// Función para obtener todas las áreas temáticas
export const getAllAreasTematicas = (): AreaTematica[] => {
  return [
    { idArea: 1, nombre: "Inteligencia Artificial" },
    { idArea: 2, nombre: "Ciencia de Datos" },
    { idArea: 3, nombre: "Ingeniería de Software" },
    { idArea: 4, nombre: "Redes y Comunicaciones" },
    { idArea: 5, nombre: "Seguridad Informática" },
    { idArea: 6, nombre: "Computación Gráfica" },
    { idArea: 7, nombre: "Sistemas Distribuidos" },
  ];
};

// Función para obtener todos los temas de interés
export const getAllTemasInteres = (): TemaInteres[] => {
  const areas = getAllAreasTematicas();
  return [
    { idTema: 1, nombre: "Redes Neuronales", areaTematica: areas[0] },
    { idTema: 2, nombre: "Visión por Computadora", areaTematica: areas[0] },
    {
      idTema: 3,
      nombre: "Procesamiento de Lenguaje Natural",
      areaTematica: areas[0],
    },
    { idTema: 4, nombre: "Aprendizaje Automático", areaTematica: areas[0] },
    { idTema: 5, nombre: "Big Data", areaTematica: areas[1] },
    { idTema: 6, nombre: "Blockchain", areaTematica: areas[4] },
    { idTema: 7, nombre: "Internet de las Cosas", areaTematica: areas[3] },
    { idTema: 8, nombre: "Computación en la Nube", areaTematica: areas[6] },
  ];
};

// Función para generar asesores de prueba
export const generateMockAsesores = (): Asesor[] => {
  const allAreaTematica = getAllAreasTematicas();
  const allTemasInteres = getAllTemasInteres();

  const baseAsesores: Asesor[] = [
    {
      id: 1,
      nombre: "Dr. Roberto Sánchez",
      especialidad: "Ingeniero Informático",
      email: "roberto.sanchez@pucp.edu.pe",
      linkedin: "roberto-sanchez-9f242/",
      repositorio: "#",
      biografia:
        "Doctor en Ciencias de la Computación con especialización en Inteligencia Artificial.",
      estado: true,
      limiteTesis: 8,
      tesistasActuales: 2,
      areasTematicas: [allAreaTematica[0], allAreaTematica[1]],
      temasIntereses: [
        allTemasInteres[0],
        allTemasInteres[1],
        allTemasInteres[2],
      ],
      fotoPerfil: null,
      foto: null,
    },
    {
      id: 2,
      nombre: "Dra. Ana Martínez",
      especialidad: "Ingeniera de Sistemas",
      email: "ana.martinez@pucp.edu.pe",
      linkedin: "ana-martinez-8h321/",
      repositorio: "#",
      biografia:
        "Doctora en Ingeniería de Sistemas con especialización en Seguridad Informática.",
      estado: true,
      limiteTesis: 6,
      tesistasActuales: 4,
      areasTematicas: [allAreaTematica[2], allAreaTematica[4]],
      temasIntereses: [allTemasInteres[5], allTemasInteres[7]],
      fotoPerfil: null,
      foto: null,
    },
  ];

  const nombres = ["Pedro Ramírez", "Valentina Castro", "Javier Mendoza"];
  const especialidades = [
    "Doctor en Computación",
    "Ingeniera Electrónica",
    "Doctor en Redes",
  ];
  const biografias = [
    "Experto en análisis de datos y arquitecturas distribuidas.",
    "Investigadora en sistemas inteligentes y robótica.",
    "Profesor con experiencia en telecomunicaciones y ciberseguridad.",
  ];

  const moreAsesores: Asesor[] = [];

  for (let i = 0; i < 10; i++) {
    moreAsesores.push({
      id: i + 3,
      nombre: `Dr. ${nombres[i % nombres.length]}`,
      especialidad: especialidades[i % especialidades.length],
      email: `email${i + 3}@pucp.edu.pe`,
      linkedin: `linkedin-${i + 3}`,
      repositorio: "#",
      biografia: biografias[i % biografias.length],
      estado: i % 3 !== 0,
      limiteTesis: 6,
      tesistasActuales: i % 6,
      areasTematicas: [allAreaTematica[i % allAreaTematica.length]],
      temasIntereses: [
        allTemasInteres[(i * 2) % allTemasInteres.length],
        allTemasInteres[(i * 2 + 1) % allTemasInteres.length],
      ],
      fotoPerfil: null,
      foto: null,
    });
  }

  return [...baseAsesores, ...moreAsesores];
};
