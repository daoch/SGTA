// src/features/academic-staff-management/components/ReassignmentModal.tsx
import React, { useState, useMemo, useCallback } from 'react';
import { 
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, 
    Button, Input, Avatar, Chip, Card, CardBody, Spinner, Tooltip 
} from "@heroui/react";
import { RefreshCw, BookOpen, Users, Search, X, Check, Award } from 'lucide-react';
import { ProyectoReasignacion, Asesor } from '../types';
// Podríamos crear subcomponentes aquí o importarlos
import ProjectInfoCard from './ProjectInfoCard';
import AdvisorSelectionList from './AdvisorSelectionList';

interface ReassignmentModalProps {
  isOpen: boolean;
  onClose: () => void; // Para cerrar el modal
  proyecto: ProyectoReasignacion | null;
  asesoresDisponibles: Asesor[]; // Lista completa de candidatos posibles
  onConfirmReassignment: (proyectoId: string, nuevoAsesorId: string) => Promise<boolean>; // Lógica de confirmación
  isLoading: boolean; // Para el estado de envío general
}

const ReassignmentModal: React.FC<ReassignmentModalProps> = ({
  isOpen, onClose, proyecto, asesoresDisponibles, onConfirmReassignment, isLoading
}) => {
  const [searchAsesor, setSearchAsesor] = useState('');
  const [asesorSeleccionado, setAsesorSeleccionado] = useState<Asesor | null>(null);
  const [isConfirmingSelection, setIsConfirmingSelection] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado de envío local para el botón

  // Limpiar estado interno cuando el modal se cierra o cambia el proyecto
  React.useEffect(() => {
    if (!isOpen || !proyecto) {
      setSearchAsesor('');
      setAsesorSeleccionado(null);
      setIsConfirmingSelection(false);
      setIsSubmitting(false);
    }
  }, [isOpen, proyecto]);

  // Filtrar y ordenar asesores para la lista
  const asesoresFiltrados = useMemo(() => {
    if (!proyecto) return [];
    let filtered = asesoresDisponibles.filter(a => a.id !== proyecto.asesorOriginal.id); // Excluir original

    if (searchAsesor) {
      const lowerSearchTerm = searchAsesor.toLowerCase();
      filtered = filtered.filter(a =>
        a.nombre.toLowerCase().includes(lowerSearchTerm) ||
        a.email.toLowerCase().includes(lowerSearchTerm) ||
        a.areasExpertise.some(area => area.toLowerCase().includes(lowerSearchTerm))
      );
    }

    return filtered.sort((a, b) => {
      const coincidenciasA = a.areasExpertise.filter(area => proyecto.areasTematicas.includes(area)).length;
      const coincidenciasB = b.areasExpertise.filter(area => proyecto.areasTematicas.includes(area)).length;
      if (coincidenciasB !== coincidenciasA) return coincidenciasB - coincidenciasA;
      return a.cargaActual - b.cargaActual;
    });
  }, [asesoresDisponibles, proyecto, searchAsesor]);

  // Manejadores internos del modal
  const handleSelectAdvisor = useCallback((asesor: Asesor) => {
    setAsesorSeleccionado(asesor);
    setIsConfirmingSelection(true);
  }, []);

  const handleCancelSelection = useCallback(() => {
    setAsesorSeleccionado(null);
    setIsConfirmingSelection(false);
  }, []);

  const handleConfirmClick = async () => {
    if (!proyecto || !asesorSeleccionado) return;
    setIsSubmitting(true);
    const success = await onConfirmReassignment(proyecto.id, asesorSeleccionado.id);
    setIsSubmitting(false);
    if (success) {
      onClose(); // Cierra el modal si la operación fue exitosa
    } 
    // El manejo de errores se haría en la página principal a través del hook
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside" backdrop="blur">
      <ModalContent>
        {(modalOnClose) => ( // modalOnClose es la función para cerrar el modal
          <>
            <ModalHeader className="flex items-center gap-2 border-b pb-3">
              <RefreshCw size={18} className="text-primary" />
              <span className="text-lg font-semibold">Reasignar Asesor de Tesis</span>
            </ModalHeader>
            <ModalBody className="py-4">
              {!proyecto ? (
                <div className="flex justify-center items-center min-h-[300px]">
                   <Spinner color="primary" size="lg" />
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Columna Izquierda: Info Proyecto */}
                  <ProjectInfoCard proyecto={proyecto} />

                  {/* Columna Derecha: Selección Asesor */}
                  <div className="space-y-4">
                    <h3 className="text-md font-semibold text-gray-800 flex items-center border-b pb-2 mb-3">
                       <Users size={16} className="mr-2 text-gray-600" />
                       Seleccionar Nuevo Asesor
                     </h3>
                    {isConfirmingSelection && asesorSeleccionado ? (
                       // --- Vista de Confirmación ---
                       <div className="border border-success-300 bg-success-50 p-4 rounded-lg shadow-sm">
                         <p className="font-medium text-success-800 mb-3 text-center text-base">Confirmar asignación</p>
                         <div className="flex flex-col items-center text-center mb-4">
                           {/* ... (Avatar, Nombre, Email, Carga del asesor seleccionado) ... */}
                           <Avatar src={asesorSeleccionado.avatar} className="mb-2" size="lg" />
                           <p className="font-semibold text-lg">{asesorSeleccionado.nombre}</p>
                           <p className="text-sm text-gray-600">{asesorSeleccionado.email}</p>
                           <div className="flex items-center mt-1 text-sm text-gray-700">
                             <Award className="h-4 w-4 text-amber-600 mr-1" />
                             Carga actual: <span className="font-medium ml-1">{asesorSeleccionado.cargaActual}</span> tesis
                           </div>
                         </div>
                         {/* ... (Áreas coincidentes) ... */}
                          <div className="mb-4">
                            <p className="text-xs text-gray-500 text-center mb-1">Áreas de expertise coincidentes:</p>
                            <div className="flex flex-wrap gap-1 justify-center">
                            {asesorSeleccionado.areasExpertise
                                .filter(area => proyecto.areasTematicas.includes(area))
                                .map((area, index) => (
                                    <Chip key={`confirm-${index}`} size="sm" variant="flat" color="success">{area}</Chip>
                                ))
                            }
                            {asesorSeleccionado.areasExpertise
                                .filter(area => proyecto.areasTematicas.includes(area))
                                .length === 0 && <span className="text-xs text-gray-500">Ninguna</span>}
                            </div>
                          </div>
                         {/* Botones de Confirmación/Cancelar Selección */}
                         <div className="flex justify-center gap-3 mt-5">
                           <Button size="sm" variant="bordered" color="default" onPress={handleCancelSelection} disabled={isSubmitting}>
                             <X size={16} className="mr-1"/> Cambiar Asesor
                           </Button>
                           <Button size="sm" color="success" variant="solid" onPress={handleConfirmClick} isLoading={isSubmitting} startContent={!isSubmitting ? <Check size={16} /> : null}>
                             Confirmar Asignación
                           </Button>
                         </div>
                       </div>
                    ) : (
                       // --- Vista de Selección ---
                       <>
                         {/* Búsqueda */}
                         <Input isClearable aria-label="Buscar nuevo asesor" className="w-full" placeholder="Buscar por nombre, email, área..." startContent={<Search className="h-4 w-4 text-gray-400 pointer-events-none" />} value={searchAsesor} onClear={() => setSearchAsesor('')} onChange={(e) => setSearchAsesor(e.target.value)} size="sm" variant="bordered"/>
                         {/* Lista de Candidatos */}
                         <AdvisorSelectionList 
                            asesores={asesoresFiltrados} 
                            proyectoAreas={proyecto.areasTematicas}
                            onSelectAdvisor={handleSelectAdvisor}
                            searchAsesor={searchAsesor}
                            onSearchChange={setSearchAsesor}
                         />
                       </>
                    )}
                  </div>
                </div>
              )}
            </ModalBody>
            <ModalFooter className="border-t pt-3">
               <Button variant="light" color="default" onPress={modalOnClose}>
                Cancelar
              </Button>
               {/* El botón de confirmación final está en la vista de confirmación */}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
export default ReassignmentModal;