// src/features/academic-staff-management/components/MassActionsToolbar.tsx
import React, { useState } from 'react';
import { 
  Button, 
  ButtonGroup, 
  Tooltip, 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  useDisclosure,
  Spinner
} from '@heroui/react';
import { UserCheck, UserX, Check, AlertTriangle, X } from 'lucide-react';
import { Profesor } from '../types';

interface MassActionsToolbarProps {
  selectedCount: number;
  selectedProfesores: Profesor[];
  onClearSelection: () => void;
  onExecuteMassAction: (action: 'habilitar_asesor' | 'deshabilitar_asesor' | 'habilitar_jurado' | 'deshabilitar_jurado') => void;
  isLoading: boolean;
}

type ActionType = 'habilitar_asesor' | 'deshabilitar_asesor' | 'habilitar_jurado' | 'deshabilitar_jurado';

const MassActionsToolbar: React.FC<MassActionsToolbarProps> = ({
  selectedCount,
  selectedProfesores,
  onClearSelection,
  onExecuteMassAction,
  isLoading
}) => {
  // Estado para la acción seleccionada en el modal de confirmación
  const [selectedAction, setSelectedAction] = useState<ActionType | null>(null);
  
  // Estado para el modal de advertencia de cese masivo
  const [ceseWarningInfo, setCeseWarningInfo] = useState<{
    profesoresAfectados: Profesor[],
    totalTesis: number
  } | null>(null);
  
  // Hooks para los modales
  const { 
    isOpen: isConfirmModalOpen, 
    onOpen: onConfirmModalOpen, 
    onClose: onConfirmModalClose 
  } = useDisclosure();
  
  const { 
    isOpen: isCeseWarningOpen, 
    onOpen: onCeseWarningOpen, 
    onClose: onCeseWarningClose 
  } = useDisclosure();

  // Verificar si hay profesores con tesis activas que serían afectados por un deshabilitar_asesor
  const handleActionClick = (action: ActionType) => {
    setSelectedAction(action);
    
    // Si es deshabilitar asesor, verificamos si hay profesores con tesis que se verían afectados
    if (action === 'deshabilitar_asesor') {
      const profesoresAfectados = selectedProfesores.filter(p => 
        p.habilitadoAsesor && 
        p.numTesis > 0 &&
        p.academicStatus !== 'cessation_in_progress'
      );
      
      if (profesoresAfectados.length > 0) {
        const totalTesis = profesoresAfectados.reduce((sum, p) => sum + p.numTesis, 0);
        setCeseWarningInfo({ profesoresAfectados, totalTesis });
        onCeseWarningOpen();
        return;
      }
    }
    
    // Para otras acciones, mostramos el modal de confirmación normal
    onConfirmModalOpen();
  };

  // Ejecutar la acción masiva
  const executeAction = () => {
    if (!selectedAction) return;
    
    onConfirmModalClose();
    onCeseWarningClose();
    onExecuteMassAction(selectedAction);
  };

  // Texto para el mensaje de confirmación
  const getConfirmationMessage = () => {
    if (!selectedAction) return '';
    
    const actionText = {
      'habilitar_asesor': 'habilitar como asesores',
      'deshabilitar_asesor': 'deshabilitar como asesores',
      'habilitar_jurado': 'habilitar como jurados',
      'deshabilitar_jurado': 'deshabilitar como jurados'
    }[selectedAction];
    
    return `¿Está seguro que desea ${actionText} a los ${selectedCount} profesores seleccionados?`;
  };

  // Botones de acción masiva
  const actionButtons = [
    {
      key: 'habilitar_asesor',
      label: `Habilitar como Asesor (${selectedCount})`,
      icon: <UserCheck className="h-4 w-4" />,
      color: 'success',
      tooltip: 'Habilitar a todos los seleccionados como asesores'
    },
    {
      key: 'deshabilitar_asesor',
      label: `Deshabilitar como Asesor (${selectedCount})`,
      icon: <UserX className="h-4 w-4" />,
      color: 'danger',
      tooltip: 'Deshabilitar a todos los seleccionados como asesores'
    },
    {
      key: 'habilitar_jurado',
      label: `Habilitar como Jurado (${selectedCount})`,
      icon: <UserCheck className="h-4 w-4" />,
      color: 'primary',
      tooltip: 'Habilitar a todos los seleccionados como jurados'
    },
    {
      key: 'deshabilitar_jurado',
      label: `Deshabilitar como Jurado (${selectedCount})`,
      icon: <UserX className="h-4 w-4" />,
      color: 'danger',
      tooltip: 'Deshabilitar a todos los seleccionados como jurados'
    }
  ];

  if (selectedCount === 0) return null;

  return (
    <>
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 text-blue-700 rounded-full w-7 h-7 flex items-center justify-center font-semibold">
            {selectedCount}
          </div>
          <span className="text-blue-700 font-medium">
            profesores seleccionados
          </span>
          <Button 
            size="sm" 
            variant="light" 
            color="primary" 
            onPress={onClearSelection}
            startContent={<X className="h-3 w-3" />}
          >
            Limpiar
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {actionButtons.map((button) => (
            <Tooltip key={button.key} content={button.tooltip}>
              <Button
                size="sm"
                color={button.color as any}
                startContent={button.icon}
                onPress={() => handleActionClick(button.key as ActionType)}
                isDisabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner size="sm" className="mr-1" />
                    Procesando...
                  </>
                ) : (
                  button.label
                )}
              </Button>
            </Tooltip>
          ))}
        </div>
      </div>

      {/* Modal de confirmación estándar */}
      <Modal isOpen={isConfirmModalOpen} onClose={onConfirmModalClose} backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-2">
                <div className="text-lg font-semibold text-gray-800">
                  Confirmar Acción Masiva
                </div>
              </ModalHeader>
              
              <ModalBody>
                <p className="text-gray-700">{getConfirmationMessage()}</p>
                <p className="text-gray-600 mt-2 text-sm">
                  Esta acción aplica a todos los profesores seleccionados para los que sea válida.
                </p>
              </ModalBody>
              
              <ModalFooter>
                <Button variant="flat" color="default" onPress={onClose} isDisabled={isLoading}>
                  Cancelar
                </Button>
                <Button color="primary" onPress={executeAction} isLoading={isLoading}>
                  {isLoading ? 'Procesando...' : 'Confirmar'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Modal de advertencia para deshabilitar asesores con tesis */}
      <Modal isOpen={isCeseWarningOpen} onClose={onCeseWarningClose} backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning-600" />
                <div className="text-lg font-semibold text-warning-800">
                  Advertencia: Proceso de Cese Masivo
                </div>
              </ModalHeader>
              
              <ModalBody>
                <p className="text-gray-700">
                  Entre los profesores seleccionados, <span className="font-semibold">{ceseWarningInfo?.profesoresAfectados.length}</span> tienen 
                  tesis activas (total: <span className="font-semibold">{ceseWarningInfo?.totalTesis}</span> tesis).
                </p>
                
                <p className="text-gray-700 mt-2">
                  Al deshabilitar asesores con tesis activas, se iniciará un <span className="font-semibold text-warning-700">proceso de cese</span> para cada uno.
                </p>
                
                <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-md text-sm">
                  <p className="font-medium text-orange-800">Consideraciones importantes:</p>
                  <ul className="list-disc pl-5 mt-1 text-orange-700 space-y-1">
                    <li>Deberá reasignar manualmente todas estas tesis a otros asesores habilitados.</li>
                    <li>Los profesores permanecerán marcados para cese hasta que todas sus tesis sean reasignadas.</li>
                    <li>Este proceso no se puede deshacer una vez iniciado.</li>
                  </ul>
                </div>
                
                <p className="text-gray-700 mt-3 font-medium">
                  ¿Está seguro que desea iniciar el proceso de cese para estos profesores?
                </p>
              </ModalBody>
              
              <ModalFooter>
                <Button variant="flat" color="default" onPress={onClose} isDisabled={isLoading}>
                  Cancelar
                </Button>
                <Button color="warning" onPress={executeAction} isLoading={isLoading} startContent={!isLoading ? <Check className="h-4 w-4" /> : null}>
                  {isLoading ? 'Procesando...' : 'Sí, Iniciar Proceso de Cese'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default MassActionsToolbar;