// Ajusta el path si es necesario

import {
  DetalleSolicitudCambioAsesor,
  SolicitudCambioAsesorResumen,
  TemaActual,
} from "../../types/cambio-asesor/entidades";
import { Asesor } from "../../types/perfil/entidades";

export function getMockSolicitudCambioAsesorResumen(): SolicitudCambioAsesorResumen[] {
  return [
    {
      solicitudId: 101,
      fechaEnvio: "2025-05-25",
      estadoGlobal: "PENDIENTE",
      estadoAccion: "PENDIENTE_ACCION",
      temaId: 701,
      temaTitulo: "Desarrollo de Sistemas Inteligentes para Diagnóstico Médico",
      nombreSolicitante: "Ana Salas",
      correoSolicitante: "ana.s@pucp.edu.pe",
      nombreAsesorActual: "Dr. Marco Gómez",
      nombreAsesorNuevo: "Dra. Teresa López",
    },
    {
      solicitudId: 102,
      fechaEnvio: "2025-04-20",
      estadoGlobal: "ACEPTADA",
      estadoAccion: "APROBADO",
      temaId: 702,
      temaTitulo: "Aplicación de Redes Neuronales en Sistemas de Recomendación",
      nombreSolicitante: "Luis Reyes",
      correoSolicitante: "luis.r@pucp.edu.pe",
      nombreAsesorActual: "Dr. Jorge Salazar",
      nombreAsesorNuevo: "Dra. Marta Fernández",
    },
    {
      solicitudId: 103,
      fechaEnvio: "2025-03-15",
      estadoGlobal: "RECHAZADA",
      estadoAccion: "RECHAZADO",
      temaId: 703,
      temaTitulo: "Evaluación de Interfaces Conversacionales con IA",
      nombreSolicitante: "Carmen Delgado",
      correoSolicitante: "carmen.d@pucp.edu.pe",
      nombreAsesorActual: "Dr. Ricardo Velásquez",
      nombreAsesorNuevo: "Dra. Marta Fernández",
    },
    {
      solicitudId: 104,
      fechaEnvio: "2025-02-10",
      estadoGlobal: "PENDIENTE",
      estadoAccion: "PENDIENTE_ACCION",
      temaId: 704,
      temaTitulo: "Automatización de Procesos con RPA en Entornos Educativos",
      nombreSolicitante: "Miguel Torres",
      correoSolicitante: "miguel.t@pucp.edu.pe",
      nombreAsesorActual: "Dra. Laura Jiménez",
      nombreAsesorNuevo: "Dr. Esteban Rojas",
    },
    {
      solicitudId: 105,
      fechaEnvio: "2025-01-12",
      estadoGlobal: "ACEPTADA",
      estadoAccion: "APROBADO",
      temaId: 705,
      temaTitulo: "Sistemas Predictivos en el Comercio Electrónico",
      nombreSolicitante: "Valeria Campos",
      correoSolicitante: "valeria.c@pucp.edu.pe",
      nombreAsesorActual: "Dr. Marco Gómez",
      nombreAsesorNuevo: "Dra. Natalia Paredes",
    },
  ];
}

export function getMockDetalleSolicitudCambioAsesor(): DetalleSolicitudCambioAsesor {
  return {
    solicitudId: 101,
    fechaEnvio: "2025-05-25",
    estadoGlobal: "PENDIENTE",
    motivoEstudiante:
      "El asesor actual no está disponible por motivos de salud.",
    temaId: 701,
    temaTitulo: "Desarrollo de Sistemas Inteligentes para Diagnóstico Médico",

    solicitante: {
      id: 11001,
      nombres: "Ana Salas",
      correoElectronico: "ana.s@pucp.edu.pe",
      rolSolicitud: "REMITENTE",
      foto: null,
      accionSolicitud: "SIN_ACCION",
      fechaAccion: null,
      comentario: null,
    },

    asesorActual: {
      id: 21001,
      nombres: "Dr. Marco Gómez",
      correoElectronico: "marco.g@pucp.edu.pe",
      rolSolicitud: "ASESOR_ACTUAL",
      foto: null,
      accionSolicitud: "SIN_ACCION",
      fechaAccion: null,
      comentario: null,
    },

    asesorNuevo: {
      id: 21005,
      nombres: "Dra. Teresa López",
      correoElectronico: "teresa.l@pucp.edu.pe",
      rolSolicitud: "ASESOR_ENTRADA",
      foto: null,
      accionSolicitud: "PENDIENTE_ACCION",
      fechaAccion: null,
      comentario: null,
    },

    coordinador: {
      id: 30001,
      nombres: "Mg. Felipe Ramírez",
      correoElectronico: "felipe.r@pucp.edu.pe",
      rolSolicitud: "DESTINATARIO",
      foto: null,
      accionSolicitud: "PENDIENTE_ACCION",
      fechaAccion: null,
      comentario: null,
    },

    fechaResolucion: null,
  };
}

export function getMockTemaYAsesor(): {
  temaActual: TemaActual;
  asesorActual: Asesor;
} {
  const temaActual: TemaActual = {
    id: 501,
    titulo:
      "Implementación de algoritmos de aprendizaje profundo para detección de patrones en imágenes médicas",
    areas: "Ciencia de la computación",
  };

  const asesorActual: Asesor = {
    id: 101,
    nombre: "Dra. Mariana López",
    especialidad: "Inteligencia Artificial",
    email: "mariana.lopez@pucp.edu.pe",
    fotoPerfil: "https://miweb.com/fotos/mariana.jpg",
    linkedin: "https://www.linkedin.com/in/marianalopez",
    repositorio: "https://github.com/marianalopez",
    biografia:
      "Profesora e investigadora especializada en IA aplicada a la educación. Cuenta con más de 10 años de experiencia en asesoría de tesis.",
    limiteTesis: 10,
    tesistasActuales: 6,
    areasTematicas: [
      { idArea: 1, nombre: "Inteligencia Artificial" },
      { idArea: 2, nombre: "Aprendizaje Automático" },
    ],
    temasIntereses: [
      {
        idTema: 1,
        nombre: "Redes Neuronales",
        areaTematica: { idArea: 1, nombre: "Inteligencia Artificial" },
      },
      {
        idTema: 2,
        nombre: "Procesamiento de Lenguaje Natural",
        areaTematica: { idArea: 2, nombre: "Aprendizaje Automático" },
      },
    ],
    estado: true,
    foto: null,
  };

  return { temaActual, asesorActual };
}
