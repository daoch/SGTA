// src/features/student-project/components/RequestAdvisorChangeModal.tsx
import React, { useState, useEffect } from 'react';
import { 
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, 
    Button, Textarea, Input, Select, SelectItem, // Añadir Select
    Spinner, Avatar 
} from "@heroui/react";
import { Edit, AlertCircle } from 'lucide-react';
import { AdvisorContactInfo } from '../types';
import { AsesorInfo } from '@/features/busqueda-personal-academico/types';

interface RequestAdvisorChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: { motivo: string; asesorSugeridoId?: string | null }) => Promise<boolean>;
  currentAdvisor: AdvisorContactInfo;
  availableAdvisors?: AsesorInfo[]; // Lista para sugerir (opcional)
  isSubmitting: boolean;
  error?: string | null;
}

const RequestAdvisorChangeModal: React.FC<RequestAdvisorChangeModalProps> = ({
  isOpen, onClose, onSubmit, currentAdvisor, availableAdvisors = [], isSubmitting, error
}) => {
  const [motivo, setMotivo] = useState('');
  const [selectedSuggestedAdvisor, setSelectedSuggestedAdvisor] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setMotivo('');
      setSelectedSuggestedAdvisor(null);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!motivo.trim()) {
       alert("Debe ingresar el motivo de la solicitud."); // Reemplazar con validación
       return;
    }
    const success = await onSubmit({ motivo, asesorSugeridoId: selectedSuggestedAdvisor });
    // El modal se cierra en la página si success es true
  };

  // Opciones para el Select de sugerencia
  const advisorOptions = [
      { key: "ninguno", label: "No sugerir asesor" },
      // Filtrar al asesor actual de las opciones
      ...availableAdvisors.filter(a => a.id !== currentAdvisor.id).map(a => ({ key: a.id, label: a.nombre }))
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" backdrop="blur">
        <ModalContent>
            {(modalOnClose) => (
                <>
                    <ModalHeader className="flex items-center gap-2">
                        <Edit size={20} className="text-warning-600"/>
                        <span className="text-lg font-semibold">Solicitar Cambio de Asesor</span>
                    </ModalHeader>
                    <ModalBody>
                         {error && (
                           <div className="mb-4 p-3 bg-danger-50 text-danger-700 border border-danger-200 rounded text-sm">{error}</div>
                         )}
                        <div className="mb-4 p-3 bg-gray-50 border rounded-md">
                            <p className="text-sm font-medium text-gray-500 mb-1">Asesor Actual:</p>
                            <div className="flex items-center gap-2">
                                 <Avatar src={currentAdvisor.avatar} name={currentAdvisor.nombre} size="sm"/>
                                 <span className="text-gray-800">{currentAdvisor.nombre}</span>
                            </div>
                        </div>

                        <Textarea
                            isRequired
                            label="Motivo del Cambio"
                            name="motivo"
                            value={motivo}
                            onValueChange={setMotivo}
                            variant="bordered"
                            minRows={5}
                            maxLength={1500}
                            placeholder="Explique detalladamente las razones por las que solicita un cambio de asesor. Esta información será confidencial y revisada por el Coordinador."
                            description="Sea lo más específico posible."
                        />
                        
                        {/* Selector Opcional para Sugerir Asesor */}
                         <Select
                            label="Sugerir Nuevo Asesor (Opcional)"
                            placeholder="Seleccione un profesor si tiene una sugerencia"
                            items={advisorOptions}
                            selectedKeys={selectedSuggestedAdvisor ? [selectedSuggestedAdvisor] : []}
                            onSelectionChange={(keys) => {
                                const key = keys instanceof Set ? Array.from(keys)[0] as string : null;
                                setSelectedSuggestedAdvisor(key === 'ninguno' ? null : key);
                            }}
                            variant="bordered"
                            className="mt-4"
                            description="Puede sugerir un asesor si ya ha conversado con él/ella. La asignación final depende del Coordinador."
                         >
                            {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
                         </Select>


                        <div className="mt-4 p-3 border border-amber-200 bg-amber-50 rounded-md text-amber-800 text-xs flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5"/>
                            <span>Su solicitud será enviada al Coordinador para su evaluación. El asesor actual podría ser notificado dependiendo de las políticas del área.</span>
                        </div>

                    </ModalBody>
                    <ModalFooter>
                        <Button variant="flat" color="default" onPress={modalOnClose} disabled={isSubmitting}>
                            Cancelar
                        </Button>
                        <Button 
                           color="primary" 
                           onPress={handleSubmit}
                           isLoading={isSubmitting}
                           isDisabled={!motivo.trim() || isSubmitting}
                        >
                            Enviar Solicitud
                        </Button>
                    </ModalFooter>
                </>
            )}
        </ModalContent>
    </Modal>
  );
};
export default RequestAdvisorChangeModal;