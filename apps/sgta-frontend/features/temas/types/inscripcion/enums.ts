// Enum para manejar Tipos en la interfaz de usuario
// Tipos Generales vs Tema.estadoTemaNombre.
export enum Tipo {
  TODOS = "TODOS",
  INSCRITO = "INSCRITO",
  LIBRE = "PROPUESTO_LIBRE",
  INTERESADO = "REGISTRADO",
}

// Estados
export enum estadosValues {
  PROPUESTO_LIBRE = "disponible",
  INSCRITO = "inscrito",
  REGISTRADO = "aprobado",
  RECHAZADO = "rechazado",
  EN_PROGRESO = "en progreso",
  PAUSADO = "pausado",
  FINALIZADO = "finalizado",
  OBSERVADO = "observado",
  VENCIDO = "vencido",
}