export interface RevisionCriterioEntregableDto {
  revisionCriterioEntregableId: number | null;   // ID de la revisión del criterio (puede ser null si es nuevo)
  entregableXTemaId: number | null;              // ID del entregable x tema
  criterioEntregableId: number;                  // ID del criterio de evaluación
  revisionDocumentoId: number;                   // ID del documento revisado
  usuarioId: number;                             // ID del revisor (usuario)
  descripcionCriterio: string;                  // Descripción del criterio de evaluación
  nombre: string;                                // Nombre del criterio
  descripcion: string;                           // Descripción del criterio
  notaMaxima: number;                            // Nota máxima para este criterio
  nota: number | null;                           // Nota asignada (puede ser null si no se ha evaluado)
  observacion: string | null;                    // Comentario del revisor
  nombreCompletoUsuario: string;          // Nombre completo del revisor
  entregableDescripcion: string;
  nombreCriterio: string;                  // Nombre del criterio (para mostrar en la UI)
}