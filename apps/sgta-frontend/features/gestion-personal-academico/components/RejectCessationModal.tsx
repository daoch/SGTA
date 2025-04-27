// src/features/academic-staff-management/components/RejectCessationModal.tsx
import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Textarea } from "@heroui/react";
import { X } from 'lucide-react';
import { SolicitudCese } from '../types';

interface RejectCessationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (motivo: string) => Promise<void>; // Función que maneja la lógica de rechazo
  solicitud: SolicitudCese | null;
  isSubmitting: boolean;
}

const RejectCessationModal: React.FC<RejectCessationModalProps> = ({ 
  isOpen, onClose, onSubmit, solicitud, isSubmitting 
}) => {
  const [motivoRechazo, setMotivoRechazo] = useState('');

  const handleSubmit = async () => {
    if (!motivoRechazo.trim()) return;
    await onSubmit(motivoRechazo);
    setMotivoRechazo(''); // Limpiar al cerrar/enviar
  };
  
  // Limpiar motivo si el modal se cierra externamente
  React.useEffect(() => {
      if (!isOpen) {
          setMotivoRechazo('');
      }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} backdrop="blur">
      <ModalContent>
          <ModalHeader className="flex flex-col gap-1 text-danger-600">
            Rechazar Solicitud de Cese
          </ModalHeader>
          <ModalBody>
            <p className="text-gray-600 mb-4">
              Está a punto de rechazar la solicitud de cese para el profesor <span className="font-semibold">{solicitud?.profesorNombre}</span>.
            </p>
            <Textarea
              label="Motivo del rechazo"
              placeholder="Explique el motivo por el cual se rechaza esta solicitud..."
              value={motivoRechazo}
              onValueChange={setMotivoRechazo}
              minRows={3}
              isRequired
              description="Este motivo será enviado al profesor solicitante."
              variant="bordered"
              className="w-full"
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" color="default" onPress={onClose}>
              Cancelar
            </Button>
            <Button 
              color="danger" 
              onPress={handleSubmit}
              isDisabled={!motivoRechazo.trim()}
              isLoading={isSubmitting}
            >
              Confirmar Rechazo
            </Button>
          </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default RejectCessationModal;