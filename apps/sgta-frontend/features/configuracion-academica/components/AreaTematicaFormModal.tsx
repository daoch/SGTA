// src/features/configuracion-academica/components/AreaTematicaFormModal.tsx
import React, { useState, useEffect } from 'react';
import { 
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, 
    Button, Input, Textarea, Spinner 
} from "@heroui/react";
import { AreaTematica, AreaTematicaFormValues } from '../types';

interface AreaTematicaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AreaTematicaFormValues) => Promise<boolean>; // Retorna éxito/fallo
  initialData: AreaTematica | null; // Null para crear, objeto para editar
  isSubmitting: boolean; // Estado de carga
  error?: string | null; // Para mostrar errores de API en el modal
}

const AreaTematicaFormModal: React.FC<AreaTematicaFormModalProps> = ({
  isOpen, onClose, onSave, initialData, isSubmitting, error
}) => {
  const [formData, setFormData] = useState<AreaTematicaFormValues>({ nombre: '', descripcion: '' });
  const isEditMode = !!initialData;

  useEffect(() => {
    if (isOpen) {
        if (initialData) {
            setFormData({ 
                id: initialData.id, // Pasar ID si es edición
                nombre: initialData.nombre, 
                descripcion: initialData.descripcion 
            });
        } else {
            setFormData({ nombre: '', descripcion: '' }); // Resetear para crear
        }
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
      // Validación básica
      if (!formData.nombre.trim()) {
          alert("El nombre del área es obligatorio."); // Reemplazar con validación inline/toast
          return;
      }
      const success = await onSave(formData); // Llama a la función del hook/página
      if (success) {
          onClose(); // Cierra solo si tuvo éxito
      } 
      // Si hay error, se mostrará en el modal (ver abajo)
  };

  return (
     <Modal isOpen={isOpen} onClose={onClose} backdrop="blur" size="xl">
        <ModalContent>
            {(modalOnClose) => (
                <>
                    <ModalHeader className="flex flex-col gap-1">
                       {isEditMode ? `Editar Área Temática: ${initialData?.nombre}` : 'Crear Nueva Área Temática'}
                    </ModalHeader>
                    <ModalBody>
                       {/* Mostrar error de API si existe */}
                       {error && (
                           <div className="mb-4 p-3 bg-danger-50 text-danger-700 border border-danger-200 rounded text-sm">
                               {error}
                           </div>
                       )}
                       <div className="space-y-4">
                           <Input
                               isRequired
                               label="Nombre del Área"
                               name="nombre"
                               value={formData.nombre}
                               onChange={handleChange}
                               variant="bordered"
                               maxLength={100} // Limitar longitud
                           />
                           <Textarea
                               label="Descripción"
                               name="descripcion"
                               value={formData.descripcion}
                               onChange={handleChange}
                               variant="bordered"
                               minRows={3}
                               maxLength={500} // Limitar longitud
                               description="Breve descripción del alcance del área temática."
                           />
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
                           isDisabled={!formData.nombre.trim() || isSubmitting} // Deshabilitar si no hay nombre o está guardando
                        >
                            {isEditMode ? 'Guardar Cambios' : 'Crear Área'}
                        </Button>
                    </ModalFooter>
                </>
            )}
        </ModalContent>
     </Modal>
  );
};
export default AreaTematicaFormModal;