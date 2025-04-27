// src/features/academic-staff-management/components/CeseConfirmationModal.tsx
import React from 'react';
import { Profesor } from '../types';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

interface CeseConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  profesor: Profesor | null;
  isLoading: boolean;
}

const CeseConfirmationModal: React.FC<CeseConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  profesor,
  isLoading
}) => {
  if (!profesor) return null;

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Iniciar Proceso de Cese de Asesor"
      confirmText={isLoading ? 'Procesando...' : 'Sí, Iniciar Proceso'}
      variant="warning"
      isConfirmLoading={isLoading}
    >
      <p className="text-gray-700">
        Está por iniciar el proceso para eventualmente deshabilitar como asesor al profesor
        <span className="font-semibold"> {profesor.nombre}</span>.
      </p>
      
      <p className="text-gray-700 mt-2">
        Este profesor tiene <span className="font-semibold">{profesor.numTesis}</span> proyecto(s) activos.
      </p>
      
      <p className="text-gray-600 mt-3 text-sm bg-orange-50 p-3 rounded-md border border-orange-200">
        <span className="font-semibold">Acción Requerida:</span> Al confirmar, deberá <span className="font-semibold text-orange-700">reasignar manualmente cada uno de sus proyectos</span>.
      </p>
      
      <p className="text-gray-600 mt-2 text-sm">
        El profesor no será deshabilitado hasta completar las reasignaciones.
      </p>
      
      <p className="text-gray-700 mt-3 font-medium">
        ¿Desea iniciar este proceso?
      </p>
    </ConfirmationModal>
  );
};

export default CeseConfirmationModal;