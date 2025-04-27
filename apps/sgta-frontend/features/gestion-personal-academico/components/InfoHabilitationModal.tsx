// src/features/academic-staff-management/components/InfoHabilitationModal.tsx
import React from 'react';
import { Info, AlertCircle } from 'lucide-react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Chip } from '@heroui/react';

interface InfoHabilitationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InfoHabilitationModal: React.FC<InfoHabilitationModalProps> = ({
  isOpen,
  onClose
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} backdrop="blur">
      <ModalContent>
        {(modalOnClose) => (
          <>
            <ModalHeader className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              <span className="text-lg font-semibold text-gray-800">
                Gestión de Habilitaciones Académicas
              </span>
            </ModalHeader>
            
            <ModalBody>
              <p className="text-gray-600">
                Esta pantalla permite gestionar la <span className="font-semibold">participación académica</span> de los profesores en roles específicos del proceso de tesis.
              </p>
              
              <p className="text-gray-600 mt-2 text-sm">
                Solo se listan profesores con <span className="font-semibold">cuenta ACTIVA</span> en el sistema (gestionado por el Administrador).
              </p>
              
              <ul className="list-disc pl-5 space-y-2 text-gray-600 mt-4 text-sm">
                <li>
                  <Chip size="sm" variant="flat" color="success">Asesor</Chip> Habilitado: El profesor puede ser asignado para guiar nuevas tesis.
                </li>
                <li>
                  <Chip size="sm" variant="flat" color="primary">Jurado</Chip> Habilitado: El profesor puede ser seleccionado para participar en defensas.
                </li>
                <li>
                  Un profesor activo puede estar académicamente deshabilitado para uno o ambos roles (ej. durante un sabático).
                </li>
                <li>
                  Deshabilitar <Chip size="sm" variant="flat" color="success">Asesor</Chip> con tesis (<Chip size="sm" color="warning" variant="flat">{'>'} 0</Chip>) requiere <span className="font-semibold text-orange-700">iniciar proceso de cese y reasignación</span> (<AlertCircle className="inline h-4 w-4 text-orange-500" />).
                </li>
                <li>
                  La activación/desactivación de la cuenta de usuario es responsabilidad del Administrador.
                </li>
              </ul>
            </ModalBody>
            
            <ModalFooter>
              <Button color="primary" variant="solid" onPress={modalOnClose}>
                Entendido
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default InfoHabilitationModal;