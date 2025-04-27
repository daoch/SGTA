// src/features/academic-staff-management/components/CeseSuccessModal.tsx
import React from 'react';
import { Check, MoveRight } from 'lucide-react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react';
import { Profesor } from '../types';

interface CeseSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToReasignaciones: () => void;
  profesor: Profesor | null;
}

const CeseSuccessModal: React.FC<CeseSuccessModalProps> = ({
  isOpen,
  onClose,
  onGoToReasignaciones,
  profesor
}) => {
  if (!profesor) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} backdrop="blur">
      <ModalContent>
        {(modalOnClose) => (
          <>
            <ModalHeader className="flex items-center gap-2">
              <Check className="h-6 w-6 text-success-600 flex-shrink-0" />
              <span className="text-lg font-semibold text-gray-800">
                Proceso de Cese Iniciado
              </span>
            </ModalHeader>
            
            <ModalBody>
              <p className="text-gray-700">
                Se ha iniciado el proceso de cese académico para el profesor
                <span className="font-semibold"> {profesor.nombre}</span>.
              </p>
              
              <p className="text-gray-700 mt-2">
                El siguiente paso es reasignar las <span className="font-semibold">{profesor.numTesis}</span> tesis 
                activas a otros asesores habilitados.
              </p>
              
              <div className="mt-4 bg-blue-50 p-3 rounded-md border border-blue-200 text-blue-800">
                <p className="text-sm font-medium">
                  ¿Desea ir a la pantalla de reasignaciones ahora?
                </p>
                <p className="text-xs mt-1">
                  También puede acceder más tarde desde el menú <span className="font-medium">Tesis {'>'} Reasignaciones</span>.
                </p>
              </div>
            </ModalBody>
            
            <ModalFooter>
              <Button variant="flat" color="default" onPress={onClose}>
                Más tarde
              </Button>
              <Button 
                color="primary" 
                onPress={onGoToReasignaciones}
                endContent={<MoveRight size={16} />}
              >
                Ir a Reasignaciones
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CeseSuccessModal;