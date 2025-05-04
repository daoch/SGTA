'use client'
import { ModalAsignarTesis } from '@/features/jurado/components/TesisAsignacionModal'
import { JuradoDetalleView } from '@/features/jurado/views/JuradoDetallePage'

export default function JuradoDetallePage() {
  return <JuradoDetalleView modalAsignarTesisComponent={ModalAsignarTesis} />;
}