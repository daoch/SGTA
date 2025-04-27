// src/features/configuracion-academica/components/CronogramaHitoFormModal.tsx
import React, { useState, useEffect } from 'react';
import { 
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, 
    Button, Input, Textarea, Select, SelectItem, Switch // Usar Switch de HeroUI
} from "@heroui/react";
import { Hito } from '../types';
import { X } from 'lucide-react';

interface CronogramaHitoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (hito: Hito) => void; // Recibe el hito completo para guardar
  hitoInicial: Hito | null; // Null para crear, objeto Hito para editar
}

// Crear un Hito por defecto para el modo creación
const DEFAULT_HITO: Omit<Hito, 'id' | 'orden'> = {
    tipo: 'Entregable', nombre: '', descripcion: '', semana: 1, 
    requiereAsesor: false, requiereJurado: false
};

const CronogramaHitoFormModal: React.FC<CronogramaHitoFormModalProps> = ({
  isOpen, onClose, onSave, hitoInicial
}) => {
  const [hitoEditado, setHitoEditado] = useState<Omit<Hito, 'id' | 'orden'>>(DEFAULT_HITO);
  const [isEditMode, setIsEditMode] = useState(false);

  // Cargar datos del hito cuando se abre para editar
  useEffect(() => {
    if (hitoInicial && isOpen) {
       setHitoEditado({
           tipo: hitoInicial.tipo,
           nombre: hitoInicial.nombre,
           descripcion: hitoInicial.descripcion,
           semana: hitoInicial.semana,
           requiereAsesor: hitoInicial.requiereAsesor,
           requiereJurado: hitoInicial.requiereJurado,
       });
       setIsEditMode(true);
    } else if (!hitoInicial && isOpen) {
       setHitoEditado(DEFAULT_HITO); // Resetear para creación
       setIsEditMode(false);
    }
  }, [hitoInicial, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;
      setHitoEditado(prev => ({ ...prev, [name]: type === 'number' ? (parseInt(value) || 1) : value }));
  };

  const handleSelectChange = (name: 'tipo', value: 'Entregable' | 'Exposición') => {
      setHitoEditado(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (name: 'requiereAsesor' | 'requiereJurado', checked: boolean) => {
      setHitoEditado(prev => ({ ...prev, [name]: checked }));
  };

  const handleSaveClick = () => {
      // Crear objeto Hito completo (con id y orden si es edición)
      const hitoParaGuardar: Hito = {
          ...(hitoInicial ? { id: hitoInicial.id, orden: hitoInicial.orden } : { id: '', orden: 0 }), // Añadir ID/orden si edita
          ...hitoEditado,
      };
      onSave(hitoParaGuardar);
      onClose(); // Cerrar modal después de guardar
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" backdrop="blur">
      <ModalContent>
          {(modalOnClose) => ( // Función para cerrar
            <>
              <ModalHeader className="flex flex-col gap-1">
                {isEditMode ? `Editar Hito: ${hitoInicial?.nombre}` : 'Añadir Nuevo Hito'}
              </ModalHeader>
              <ModalBody>
                {/* Formulario */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                   {/* Nombre */}
                   <Input 
                       label="Nombre del Hito" 
                       name="nombre" 
                       value={hitoEditado.nombre} 
                       onChange={handleInputChange} 
                       variant="bordered" 
                       isRequired 
                       className="md:col-span-2" // Ocupar todo el ancho
                   />
                   {/* Tipo */}
                   <Select 
                       label="Tipo de Hito" 
                       name="tipo" 
                       selectedKeys={[hitoEditado.tipo]}
                       onChange={(e) => handleSelectChange('tipo', e.target.value as 'Entregable' | 'Exposición')}
                       variant="bordered"
                       isRequired
                    >
                       <SelectItem key="Entregable">Entregable</SelectItem>
                       <SelectItem key="Exposición">Exposición</SelectItem>
                   </Select>
                   {/* Semana */}
                   <Input 
                      label="Semana Estimada" 
                      name="semana" 
                      type="number" 
                      min="1" max="18" 
                      value={String(hitoEditado.semana)} 
                      onChange={handleInputChange} 
                      variant="bordered" 
                      isRequired 
                   />
                   {/* Descripción */}
                   <Textarea 
                       label="Descripción (Opcional)" 
                       name="descripcion" 
                       value={hitoEditado.descripcion} 
                       onChange={handleInputChange} 
                       variant="bordered" 
                       minRows={3} 
                       className="md:col-span-2"
                   />
                   {/* Requisitos */}
                   <div className="md:col-span-2 mt-2 space-y-3">
                      <p className="block text-sm font-medium text-gray-700">Requisitos de Aprobación</p>
                      {/* Asumiendo Switch de HeroUI */}
                      <Switch 
                          isSelected={hitoEditado.requiereAsesor} 
                          onValueChange={(checked) => handleSwitchChange('requiereAsesor', checked)}
                          size="sm"
                       >
                          Requiere Asesor
                       </Switch>
                      <Switch 
                          isSelected={hitoEditado.requiereJurado} 
                          onValueChange={(checked) => handleSwitchChange('requiereJurado', checked)}
                          size="sm"
                      >
                          Requiere Jurado
                      </Switch>
                   </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" color="default" onPress={modalOnClose}>
                  Cancelar
                </Button>
                <Button 
                   color="primary" 
                   onPress={handleSaveClick} 
                   // Deshabilitar si el nombre está vacío
                   isDisabled={!hitoEditado.nombre.trim()} 
                >
                  {isEditMode ? 'Guardar Cambios' : 'Añadir Hito'}
                </Button>
              </ModalFooter>
            </>
          )}
      </ModalContent>
    </Modal>
  );
};
export default CronogramaHitoFormModal;