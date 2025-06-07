import { Usuario } from "../temas/entidades";
import { Solicitante, SolicitudPendiente } from "./entities";
import { EstadoSolicitud, TipoSolicitud } from "./enums";

// export const ejemploTemaInscrito: Tema = {
//   id: 22,
//   codigo: "TT2025-001",
//   carrera: {
//     id: 2,
//     unidadAcademicaId: 1,
//     codigo: "CS",
//     nombre: "Ciencias de la Computación",
//     descripcion: "Carrera de pregrado en computación y ciencias informáticas.",
//     activo: true,
//     fechaCreacion: "2020-01-15",
//     fechaModificacion: "2024-11-10",
//   },
//   titulo:
//     "Sistema Inteligente para el Diagnóstico Temprano de Enfermedades Respiratorias Usando Aprendizaje Profundo",
//   resumen:
//     "Este proyecto propone el desarrollo de un sistema basado en redes neuronales convolucionales para diagnosticar enfermedades respiratorias a partir de imágenes de rayos X.",
//   objetivos:
//     "1. Diseñar un modelo de aprendizaje profundo para detectar patrones patológicos en imágenes médicas.\n2. Evaluar el rendimiento del sistema usando métricas clínicas estándar.",
//   metodologia:
//     "Se utilizarán datasets públicos, técnicas de aumento de datos y modelos preentrenados para desarrollar y validar el sistema.",
//   portafolioUrl:
//     "https://repositorio.pucp.edu.pe/handle/123456789/tesis-diagnostico-respiratorio",
//   activo: true,
//   fechaLimite: "2025-09-30",
//   fechaCreacion: "2025-05-01",
//   fechaModificacion: null,
//   estadoTemaNombre: "INSCRITO",
//   idUsuarioInvolucradosList: [1001, 1002, 2001],
//   idCoasesorInvolucradosList: [2001],
//   idEstudianteInvolucradosList: [1001, 1002],
//   idSubAreasConocimientoList: [301],
//   coasesores: [
//     {
//       id: 2001,
//       tipoUsuario: "COASESOR",
//       codigoPucp: "CO20251001",
//       nombres: "Lucía",
//       primerApellido: "Fernández",
//       segundoApellido: "Ramos",
//       correoElectronico: "lfernandez@pucp.edu.pe",
//       nivelEstudios: "Doctorado",
//       contrasena: null,
//       biografia: "Especialista en procesamiento de imágenes médicas.",
//       enlaceRepositorio: null,
//       enlaceLinkedin: "https://linkedin.com/in/lfernandez",
//       disponibilidad: "Parcial",
//       tipoDisponibilidad: "Mañanas",
//       activo: true,
//       fechaCreacion: "2023-03-10",
//       fechaModificacion: null,
//     },
//   ],
//   tesistas: [
//     {
//       id: 1001,
//       tipoUsuario: "ESTUDIANTE",
//       codigoPucp: "202055321",
//       nombres: "Juan",
//       primerApellido: "Pérez",
//       segundoApellido: "Lopez",
//       correoElectronico: "jperez@pucp.edu.pe",
//       nivelEstudios: "Pregrado",
//       contrasena: null,
//       biografia: null,
//       enlaceRepositorio: null,
//       enlaceLinkedin: null,
//       disponibilidad: "Completa",
//       tipoDisponibilidad: "Remoto",
//       activo: true,
//       fechaCreacion: "2024-03-12",
//       fechaModificacion: null,
//       asignado: true,
//     },
//     {
//       id: 1002,
//       tipoUsuario: "ESTUDIANTE",
//       codigoPucp: "202055322",
//       nombres: "María",
//       primerApellido: "Gonzales",
//       segundoApellido: "Ruiz",
//       correoElectronico: "mgonzales@pucp.edu.pe",
//       nivelEstudios: "Pregrado",
//       contrasena: null,
//       biografia: null,
//       enlaceRepositorio: null,
//       enlaceLinkedin: null,
//       disponibilidad: "Parcial",
//       tipoDisponibilidad: "Presencial",
//       activo: true,
//       fechaCreacion: "2024-03-15",
//       fechaModificacion: null,
//       asignado: true,
//     },
//   ],
//   subareas: [
//     {
//       id: 301,
//       nombre: "Inteligencia Artificial",
//       descripcion: "Estudio y desarrollo de sistemas inteligentes.",
//       activo: true,
//       fechaCreacion: "2020-03-10",
//       fechaModificacion: "2023-12-01",
//       areaConocimiento: {
//         id: 30,
//         nombre: "Ciencias de la Computación",
//         descripcion:
//           "Área dedicada al estudio de algoritmos, datos y sistemas computacionales.",
//         activo: true,
//         fechaCreacion: "2015-05-12",
//         fechaModificacion: "2022-11-01",
//         idCarrera: 2,
//       },
//     },
//   ],
//   requisitos:
//     "Conocimientos básicos en procesamiento de imágenes y aprendizaje profundo.",
// };

// Usuario de ejemplo
export const ejemploUsuario: Usuario = {
  id: 1001,
  tipoUsuario: {
    id: 1,
    nombre: "ESTUDIANTE",
    activo: true,
    fechaCreacion: "2024-01-01",
    fechaModificacion: "2024-01-01",
  },
  codigoPucp: "202055321",
  nombres: "Juan",
  primerApellido: "Pérez",
  segundoApellido: "Lopez",
  correoElectronico: "jperez@pucp.edu.pe",
  nivelEstudios: "Pregrado",
  contrasena: null,
  biografia: "Estudiante de Ciencias de la Computación.",
  enlaceRepositorio: null,
  enlaceLinkedin: null,
  disponibilidad: "Completa",
  tipoDisponibilidad: "Remoto",
  asignado: true,
  creador: false,
  rechazado: false,
  activo: true,
  fechaCreacion: "2024-03-12",
  fechaModificacion: "2024-03-12",
};

export const ejemploSolicitanteCooasesor: Solicitante = {
  id: 1001,
  codigoPucp: "202055321",
  tipoSolicitante: "Coasesor",
  nombres: "Juan",
  primerApellido: "Pérez",
  segundoApellido: "Lopez",
  correoElectronico: "jperez@pucp.edu.pe",
};

// export const ejemploSolicitudPendiente: SolicitudPendiente = {
//   id: 1,
//   fechaSolicitud: "2025-05-10",
//   estado: EstadoSolicitud.PENDIENTE,
//   tipo: TipoSolicitud.INCRIPCION_TEMA,
//   titulo: "Solicitud de inscripción de tema de tesis",
//   solicitante: ejemploSolicitanteCooasesor,
//   tema: ejemploTemaInscrito,
// };

export const idCoasesor = 3;

