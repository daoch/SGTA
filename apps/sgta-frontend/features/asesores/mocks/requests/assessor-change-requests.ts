// Ajusta el path si es necesario

import {
  DetalleSolicitudCambioAsesor,
  SolicitudCambioAsesorResumen,
} from "../../types/cambio-asesor/entidades";

export function getMockSolicitudCambioAsesorResumen(): SolicitudCambioAsesorResumen[] {
  return [
    {
      solicitudId: 101,
      fechaEnvio: "2025-05-25",
      estadoGlobal: "PENDIENTE",
      estadoAccion: "PENDIENTE_ACCION",
      tema: 701,
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
      tema: 702,
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
      tema: 703,
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
      tema: 704,
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
      tema: 705,
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
