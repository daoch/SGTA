'use client'
import { ModalAsignarTesis } from '@/features/jurado/components/tesis-asignacion-modal'
import { JuradoDetalleView } from '@/features/jurado/views/jurado-detalle-page'

export default function JuradoDetallePage() {
  return <JuradoDetalleView modalAsignarTesisComponent={ModalAsignarTesis} />;
}