// src/app/(main)/configuracion-academica/cronograma/page.tsx 
'use client'

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Card, Spinner, useDisclosure, Button } from "@heroui/react"; 

// Importar componentes de la feature y el hook
import CronogramaCycleCourseSelector from '@/features/configuracion-academica/components/CronogramaCycleCourseSelector'; 
import CronogramaCreationOptions from '@/features/configuracion-academica/components/CronogramaCreationOptions'; 
import CronogramaEditor from '@/features/configuracion-academica/components/CronogramaEditor'; 
import { useCronogramaConfig } from '@/features/configuracion-academica/hooks/useCronogramaConfig'; 
import { Hito, CursoType } from '@/features/configuracion-academica/types'; 
import ConfirmationModal from '@/components/ui/ConfirmationModal'; // Asumiendo componente genérico
import CronogramaHitoFormModal from '@/features/configuracion-academica/components/CronogramaHitoFormModal'; 

const ConfigCronogramaPage = () => { 
  
  // --- Usar el Hook para obtener estado y lógica ---
  const {
    ciclosDisponibles, cicloSeleccionado, setCicloSeleccionado,
    cursoSeleccionado, setCursoSeleccionado,
    hitosActuales, estadoActual, fechaPublicacion, esBorrador, esPublicado, esArchivado,
    esNoCreado, esCicloEditable, puedeCrear, isLoadingCiclos, isLoading, isSaving,
    isPublishing, error, modoCreacion, setModoCreacion,
    ciclosParaCopiar, iniciarCreacion, 
    // Acciones CRUD Hitos (ya ligadas al estado local del hook)
    addHito, updateHito, deleteHito, reorderHitos, 
    // Acciones Guardar/Publicar
    saveDraft, publishSchedule,
  } = useCronogramaConfig(); // No se necesita pasar initialCiclo/Curso si el hook maneja defecto

  // --- Estados Locales para Modales ---
  const [hitoParaOperacion, setHitoParaOperacion] = useState<Hito | null>(null); // Para editar o eliminar
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure();
  const { isOpen: isPublishModalOpen, onOpen: onPublishModalOpen, onClose: onPublishModalClose } = useDisclosure();
  const { isOpen: isHitoModalOpen, onOpen: onHitoModalOpen, onClose: onHitoModalClose } = useDisclosure();

  // --- Manejadores para abrir Modales ---
  const abrirModalEliminar = useCallback((hito: Hito) => {
      setHitoParaOperacion(hito);
      onDeleteModalOpen();
  }, [onDeleteModalOpen]);

  const confirmarEliminarHito = useCallback(() => {
      if (hitoParaOperacion) { deleteHito(hitoParaOperacion.id); }
      setHitoParaOperacion(null);
      onDeleteModalClose();
  }, [hitoParaOperacion, deleteHito, onDeleteModalClose]);

  const abrirModalPublicar = useCallback(() => {
      if (!hitosActuales || hitosActuales.length === 0) { 
          alert("No se puede publicar un cronograma vacío."); // Reemplazar con Toast/Notificación
          return; 
      }
      onPublishModalOpen();
  }, [hitosActuales, onPublishModalOpen]);

  const confirmarPublicacion = useCallback(async () => {
      const success = await publishSchedule();
      if (success) { 
          onPublishModalClose();
          alert("Cronograma publicado exitosamente."); // Reemplazar con Toast
      } else {
          // El hook setea el estado de error, mostrarlo o usar un toast
          alert(`Error al publicar: ${error || 'Intente de nuevo.'}`); 
      }
  }, [publishSchedule, onPublishModalClose, error]);

  // Abrir modal para Añadir Hito (resetea hitoParaOperacion)
  const handleAddHitoClick = useCallback(() => {
    setHitoParaOperacion(null); 
    onHitoModalOpen();
  }, [onHitoModalOpen]);

  // Abrir modal para Editar Hito (setea hitoParaOperacion)
  const handleEditHitoClick = useCallback((hito: Hito) => {
      setHitoParaOperacion(hito);
      onHitoModalOpen();
  }, [onHitoModalOpen]);

  // Guardar desde el Modal de Hito (llama a addHito o updateHito del hook)
  const handleSaveHito = useCallback((hitoGuardado: Hito) => {
      if(hitoParaOperacion) { // Es edición
          updateHito(hitoGuardado);
      } else { // Es creación
          // La función addHito del hook ahora recibe Omit<Hito, 'id' | 'orden'>
          // Necesitamos asegurar que pasamos los datos correctos
          const { id, orden, ...newHitoData } = hitoGuardado; // Extraer datos sin id/orden
          addHito(newHitoData); 
      }
      onHitoModalClose(); 
      setHitoParaOperacion(null); 
  }, [hitoParaOperacion, updateHito, addHito, onHitoModalClose]); 

  // --- Renderizado Condicional del Contenido ---
  const renderContent = () => {
      if (isLoading) { // Solo mostrar loading principal al inicio
          return <div className="text-center p-10"><Spinner size="lg" color="primary" label="Cargando configuración..."/></div>;
      }
      if (error && !isLoading) { 
          return <Card className="p-6 border-danger-200 bg-danger-50 text-danger-700 text-center">{error}</Card>;
      }
      
      if (esNoCreado && puedeCrear) {
          return (
             <Card className="p-6 shadow-md border">
                <CronogramaCreationOptions 
                    cicloId={cicloSeleccionado!}
                    curso={cursoSeleccionado}
                    modoCreacion={modoCreacion}
                    setModoCreacion={setModoCreacion}
                    ciclosParaCopiar={ciclosParaCopiar}
                    onIniciarCreacion={iniciarCreacion}
                    isLoading={isLoading} // El loading general aplica aquí también
                />
             </Card>
          );
      }
      
      if (esBorrador || esPublicado || esArchivado || (esNoCreado && !puedeCrear)) {
           return (
               // Renderizar el Editor (que contiene la Tabla)
               <CronogramaEditor
                  cicloId={cicloSeleccionado!}
                  curso={cursoSeleccionado}
                  hitos={hitosActuales} // Pasar los hitos en edición
                  estado={estadoActual}
                  fechaPublicacion={fechaPublicacion}
                  esEditable={esCicloEditable}
                  onAgregarHito={handleAddHitoClick} // Abre modal de creación
                  onActualizarHito={handleEditHitoClick} // Abre modal de edición
                  onEliminarHito={abrirModalEliminar} // Abre modal de confirmación
                  onReordenarHitos={reorderHitos} // Pasa la función del hook
                  onGuardarBorrador={saveDraft} // Pasa la función del hook
                  onPublicar={abrirModalPublicar} // Abre modal de confirmación
                  isSaving={isSaving}
                  isPublishing={isPublishing}
                  isReadOnly={!esCicloEditable} // Indicar modo lectura
               />
           );
       }

      return <div className="text-center p-10 text-red-500">Error: Estado de cronograma inesperado o ciclo no seleccionable.</div>; 
  };

  // --- Renderizado JSX de la Página Completa ---
  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl space-y-6">
       {/* Header y Breadcrumbs */}
        <div>
         <div className="flex items-center text-sm text-muted-foreground mb-3">
           <Link href="/configuracion-academica" className="hover:text-primary flex items-center">
             <ChevronLeft className="h-4 w-4 mr-1" />
             Volver a Configuración Académica
           </Link>
         </div>
         <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
           Configuración de Cronograma por Curso y Ciclo
         </h1>
         <p className="text-muted-foreground max-w-4xl">
           Defina la estructura de hitos y entregables para los cursos PFC 1 y PFC 2. Publique el cronograma para hacerlo oficial en cada ciclo académico.
         </p>
       </div>

       {/* Selector de Ciclo y Curso */}
       <Card className="p-4 shadow-sm border-gray-200">
          <CronogramaCycleCourseSelector 
             ciclos={ciclosDisponibles}
             cicloSeleccionado={cicloSeleccionado}
             onCicloChange={setCicloSeleccionado}
             cursoSeleccionado={cursoSeleccionado}
             onCursoChange={setCursoSeleccionado}
             isLoading={isLoadingCiclos} // Solo el loading de ciclos aquí
          />
       </Card>

       {/* Contenido Principal (Depende del estado) */}
       {renderContent()}

        {/* --- Modales --- */}
         <CronogramaHitoFormModal
            isOpen={isHitoModalOpen}
            onClose={onHitoModalClose} // Usa el onClose del hook useDisclosure
            onSave={handleSaveHito}   // Llama a la función de guardado de la página
            hitoInicial={hitoParaOperacion} // Pasa el hito a editar o null
         />

         <ConfirmationModal // Componente genérico
            isOpen={isDeleteModalOpen}
            onClose={onDeleteModalClose}
            onConfirm={confirmarEliminarHito}
            title="¿Eliminar Hito?"
            confirmText="Sí, Eliminar"
            variant="danger"
         >
            ¿Está seguro de que desea eliminar el hito "{hitoParaOperacion?.nombre || ''}"? Esta acción no se puede deshacer.
         </ConfirmationModal>

          <ConfirmationModal // Componente genérico
            isOpen={isPublishModalOpen}
            onClose={onPublishModalClose}
            onConfirm={confirmarPublicacion}
            title="¿Confirmar Publicación?"
            confirmText="Confirmar Publicación"
            variant="warning" 
            isConfirmLoading={isPublishing} 
         >
             Está a punto de publicar el cronograma oficial para {cursoSeleccionado} - Ciclo {cicloSeleccionado}. 
             Una vez publicado, no podrá añadir, eliminar ni reordenar hitos (podría permitir editar detalles menores).
         </ConfirmationModal>
    </div>
  );
};

export default ConfigCronogramaPage;