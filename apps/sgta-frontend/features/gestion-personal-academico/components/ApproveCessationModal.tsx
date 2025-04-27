// src/features/academic-staff-management/components/ApproveCessationModal.tsx
'use client' // Necesario por useState, useEffect, useRouter

import React, { useState, useEffect } from 'react';
import { 
    Modal, 
    ModalContent, 
    ModalHeader, 
    ModalBody, 
    ModalFooter, 
    Button, 
    Badge, 
    Spinner // Asumiendo Spinner de HeroUI para isLoading
} from "@heroui/react";
import { Check, AlertCircle, User, RefreshCw } from 'lucide-react';
import { SolicitudCese } from '../types'; // Asegúrate que la ruta sea correcta
import { useRouter } from 'next/navigation'; // Para la navegación

// --- Interfaz de Props ---
interface ApproveCessationModalProps {
  isOpen: boolean;
  onClose: () => void;
  // onSubmit ahora retorna Promise<boolean> para indicar éxito/fallo
  onSubmit: () => Promise<boolean>; 
  solicitud: SolicitudCese | null; // La solicitud actual a procesar
  isSubmitting: boolean; // Estado de carga pasado desde la página
}

// --- Estado para Información de Éxito ---
interface SuccessInfo {
  professorName: string;
  affectedCount: number;
}

// --- Componente del Modal ---
const ApproveCessationModal: React.FC<ApproveCessationModalProps> = ({
  isOpen, 
  onClose, 
  onSubmit, 
  solicitud, 
  isSubmitting 
}) => {
  // Estado local para controlar la vista de éxito y almacenar datos
  const [successInfo, setSuccessInfo] = useState<SuccessInfo | null>(null); 
  const router = useRouter(); // Hook para navegar

  // Función que maneja el clic en el botón de aprobación
  const handleApprove = async () => {
    setSuccessInfo(null); // Resetear por si hubo un intento anterior fallido
    if (!solicitud) return; // Seguridad

    // Guardar datos necesarios ANTES de llamar a onSubmit
    const currentProfessorName = solicitud.profesorNombre;
    const currentAffectedCount = solicitud.tesistasAfectados?.length || 0;

    const success = await onSubmit(); // Ejecuta la lógica de la página (que llama al hook/API)
    
    if (success) {
      // Si onSubmit fue exitoso, guardar la info para el mensaje de éxito
      setSuccessInfo({ professorName: currentProfessorName, affectedCount: currentAffectedCount });
    }
    // Si onSubmit falla, el hook/página debería manejar el error (ej. un toast)
    // y este modal simplemente permanecerá en el estado de confirmación.
  };

  // Función para navegar a reasignaciones y cerrar modal
  const handleNavigateToReassignments = () => {
    onClose(); // Cierra el modal actual
    // Ajusta la ruta si es diferente
    router.push('/personal-academico/reasignaciones'); 
  };

  // Resetear el estado de éxito cuando el modal se cierra (importante)
  useEffect(() => {
    if (!isOpen) {
      // Añadir un pequeño delay puede ayudar a evitar flashes visuales si el cierre es muy rápido
      const timer = setTimeout(() => setSuccessInfo(null), 150); 
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // --- Renderizado ---
  return (
    <Modal isOpen={isOpen} onClose={onClose} backdrop="blur" size="lg">
      <ModalContent>
          {/* Renderizado Condicional: Muestra Éxito o Confirmación */}
          
          {/* --- VISTA DE ÉXITO --- */}
          {successInfo ? ( 
            <>
              <ModalHeader className="flex flex-col gap-2 text-success-600 items-center text-center pt-4"> {/* Añadido pt-4 */}
                 <div className="bg-success-100 p-2 rounded-full mb-1"> {/* Estilo de fondo/padding */}
                    <Check size={28} className="text-success-600" /> {/* Icono más grande */}
                 </div>
                 <span className="text-lg font-semibold">Solicitud Aprobada</span>
              </ModalHeader>
              <ModalBody className="text-center px-6 pb-4"> {/* Ajuste de padding */}
                  <p className="text-gray-700 mb-4">
                      La solicitud de cese para <span className="font-semibold">{successInfo.professorName}</span> ha sido aprobada exitosamente.
                  </p>
                  <p className="text-gray-600 mb-1">
                      Se han marcado <span className="font-semibold">{successInfo.affectedCount}</span> proyecto(s) como pendientes de reasignación.
                  </p>
                  <p className="text-sm text-gray-500 mt-4"> {/* Separado para claridad */}
                      Puede proceder a reasignarlos ahora o hacerlo más tarde desde la sección de Personal Académico.
                  </p>
              </ModalBody>
              <ModalFooter className="flex flex-col sm:flex-row gap-2 p-4 bg-gray-50 border-t border-gray-300"> {/* Estilo footer */}
                 {/* Botón Ir a Reasignaciones (Condicional) */}
                 {successInfo.affectedCount > 0 && ( 
                    <Button 
                       color="primary" 
                       onPress={handleNavigateToReassignments} 
                       className="w-full sm:w-auto order-first sm:order-none" // Ajuste de orden responsivo
                       startContent={<RefreshCw size={16}/>}
                    >
                       Ir a Reasignaciones
                    </Button>
                 )}
                  {/* Botón Cerrar */}
                 <Button variant="flat" color="default" onPress={onClose} className="w-full sm:w-auto">
                    Cerrar
                 </Button>
              </ModalFooter>
            </>
          
          /* --- VISTA DE CONFIRMACIÓN (Estado Inicial) --- */
          ) : ( 
            <>
              <ModalHeader className="flex flex-col gap-1 text-success-600"> {/* Podría ser un color neutro */}
                Aprobar Solicitud de Cese
              </ModalHeader>
              <ModalBody className="pb-4"> {/* Ajuste padding */}
                {/* Alerta */}
                <div className="p-3 border border-warning-200 bg-warning-50 rounded-md mb-4 flex items-start space-x-2">
                   <AlertCircle className="h-5 w-5 text-warning-500 flex-shrink-0 mt-0.5" />
                   <p className="text-warning-800 text-sm">
                     <strong>Advertencia:</strong> Esta acción requerirá la reasignación manual de los proyectos afectados.
                   </p>
                </div>
                {/* Párrafo confirmación */}
                <p className="text-gray-600 mb-4">
                  Está a punto de aprobar la solicitud de cese para el profesor <span className="font-semibold">{solicitud?.profesorNombre}</span>.
                </p>
                {/* Contenedor Tesistas Afectados */}
                <div className="bg-gray-50 p-3 rounded-md mb-3 border border-gray-200">
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    Proyectos de tesis afectados:{' '}
                    <Badge color="warning" variant="flat" size="sm"> 
                      {solicitud?.tesistasAfectados?.length || 0}
                    </Badge>
                  </div>
                  {solicitud && solicitud.tesistasAfectados.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 max-h-32 overflow-y-auto pr-2">
                      {solicitud.tesistasAfectados.map(tesista => (
                        <li key={tesista.id}>
                          <span className="font-medium">{tesista.nombre}</span> - {tesista.titulo}
                        </li>
                      ))}
                    </ul>
                  ) : (
                       <p className="text-sm text-gray-500 italic">No hay tesistas afectados directamente.</p>
                  )}
                </div>
                 {/* Párrafo final */}
                <p className="text-gray-600 text-sm">
                  Al confirmar, el profesor <strong>no quedará deshabilitado como asesor</strong> hasta que las reasignaciones se completen. Será notificado y usted podrá proceder a la reasignación.
                </p>
              </ModalBody>
              <ModalFooter className="p-4 bg-gray-50 border-t border-gray-300">
                <Button variant="flat" color="default" onPress={onClose} disabled={isSubmitting}>
                  Cancelar
                </Button>
                <Button 
                  color="success" 
                  onPress={handleApprove} // Llama a la función local
                  isLoading={isSubmitting} // Usa el estado de carga
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Procesando...' : 'Aprobar e Iniciar Reasignación'}
                </Button>
              </ModalFooter>
            </>
          )}
      </ModalContent>
    </Modal>
  );
};
export default ApproveCessationModal;