// src/features/advisor-dashboard/components/RequestCessationModal.tsx
import React, { useState, useEffect } from 'react';
import { 
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, 
    Button, Textarea, Input, Spinner 
} from "@heroui/react";
import { UserMinus, AlertCircle } from 'lucide-react';
import { TesistaInfo, CessationRequestPayload } from '../types';

interface RequestCessationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CessationRequestPayload) => Promise<boolean>; // Recibe el payload completo
  tesistasSeleccionados: TesistaInfo[]; // Lista de tesistas para mostrar
  isSubmitting: boolean;
  error?: string | null; // Para mostrar errores de submit
}

const RequestCessationModal: React.FC<RequestCessationModalProps> = ({
  isOpen, onClose, onSubmit, tesistasSeleccionados, isSubmitting, error
}) => {
  const [motivo, setMotivo] = useState('');
  // const [fechaPropuesta, setFechaPropuesta] = useState<string | null>(null); // Opcional

  // Limpiar estado al cerrar
  useEffect(() => {
    if (!isOpen) {
      setMotivo('');
      // setFechaPropuesta(null);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
      if (!motivo.trim()) {
          alert("Debe ingresar un motivo para la solicitud de cese."); // Reemplazar con validación/toast
          return;
      }
      const payload: CessationRequestPayload = {
          studentIds: tesistasSeleccionados.map(t => t.studentId),
          motivo: motivo,
          // fechaPropuesta: fechaPropuesta ? new Date(fechaPropuesta) : null
      };
      const success = await onSubmit(payload);
      // El modal se cierra desde la página principal si success es true
      // if(success) onClose(); // Podría cerrarse aquí también
  };

  return (
     <Modal isOpen={isOpen} onClose={onClose} size="2xl" backdrop="blur">
        <ModalContent>
            {(modalOnClose) => (
                <>
                    <ModalHeader className="flex items-center gap-2">
                        <UserMinus size={20} className="text-danger-500"/>
                        <span className="text-lg font-semibold">Solicitar Cese de Asesoría</span>
                    </ModalHeader>
                    <ModalBody>
                        {error && (
                            <div className="mb-4 p-3 bg-danger-50 text-danger-700 border border-danger-200 rounded text-sm">
                                Error al enviar solicitud: {error}
                            </div>
                        )}
                        <p className="text-sm text-gray-600 mb-3">
                            Está solicitando el cese de su rol como asesor para el/los siguiente(s) estudiante(s):
                        </p>
                        <div className="max-h-32 overflow-y-auto bg-gray-50 border rounded p-2 mb-4 space-y-1">
                            {tesistasSeleccionados.map(t => (
                                <p key={t.studentId} className="text-sm font-medium text-gray-800">
                                    - {t.nombreEstudiante} ({t.codigoEstudiante})
                                </p>
                            ))}
                        </div>
                        <Textarea
                            isRequired
                            label="Motivo de la Solicitud"
                            name="motivo"
                            value={motivo}
                            onValueChange={setMotivo} // Asumiendo onValueChange
                            variant="bordered"
                            minRows={4}
                            maxLength={1000}
                            placeholder="Explique detalladamente las razones para solicitar el cese..."
                            description="Esta información será revisada por el Coordinador."
                        />
                        {/* Opcional: Input para fecha propuesta */}
                         {/* <Input type="date" label="Fecha Propuesta para Cese (Opcional)" ... /> */}
                         <div className="mt-4 p-3 border border-amber-200 bg-amber-50 rounded-md text-amber-800 text-xs flex items-start gap-2">
                             <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5"/>
                             <span>La aprobación de esta solicitud está sujeta a la evaluación del Coordinador y puede requerir la reasignación de los tesistas.</span>
                         </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="flat" color="default" onPress={modalOnClose} disabled={isSubmitting}>
                            Cancelar
                        </Button>
                        <Button 
                           color="danger" 
                           onPress={handleSubmit}
                           isLoading={isSubmitting}
                           isDisabled={!motivo.trim() || tesistasSeleccionados.length === 0 || isSubmitting}
                        >
                            Enviar Solicitud de Cese
                        </Button>
                    </ModalFooter>
                </>
            )}
        </ModalContent>
     </Modal>
  );
};
export default RequestCessationModal;