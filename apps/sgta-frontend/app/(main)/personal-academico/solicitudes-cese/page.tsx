// src/app/(main)/personal-academico/solicitudes-cese/page.tsx
'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ChevronLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Card, Spinner, useDisclosure } from "@heroui/react"; // Hook para los modales

// Importar los nuevos componentes y tipos
import RequestFilters from '@/features/gestion-personal-academico/components/RequestFilters';
import PendingRequestsList from '@/features/gestion-personal-academico/components/PendingRequestsList';
import RequestHistoryTable from '@/features/gestion-personal-academico/components/RequestHistoryTable';
import RejectCessationModal from '@/features/gestion-personal-academico/components/RejectCessationModal';
import ApproveCessationModal from '@/features/gestion-personal-academico/components/ApproveCessationModal';
import { SolicitudCese, FiltroEstado, Tesista } from '@/features/gestion-personal-academico/types'; // Asumiendo que están en types/index.ts

import { useCessationRequests } from '@/features/gestion-personal-academico/hooks/useCessationRequests';

// --- Componente de Pantalla Principal (MUCHO MÁS LIMPIO) ---
const SolicitudesCesePage = () => {
  
  // Usar el Hook para obtener estado y lógica
  const {
    requests: solicitudesFiltradas, // Renombrado para claridad, ya viene filtrada
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    filterState,
    setFilterState,
    approveRequest,
    rejectRequest,
    isSubmitting,
    selectedRequest,
    selectRequestForModal,
  } = useCessationRequests();

  // Controladores de Modales (aún necesarios para la UI de HeroUI)
  const { isOpen: isRechazarModalOpen, onOpen: onRechazarModalOpen, onClose: onRechazarModalClose } = useDisclosure();
  const { isOpen: isAprobarModalOpen, onOpen: onAprobarModalOpen, onClose: onAprobarModalClose } = useDisclosure();
  
  // --- Manejadores para abrir modales (ahora más simples) ---
  const handleRechazarClick = useCallback((solicitud: SolicitudCese) => {
    selectRequestForModal(solicitud); // Selecciona la solicitud usando el hook
    onRechazarModalOpen();           // Abre el modal de HeroUI
  }, [selectRequestForModal, onRechazarModalOpen]);
  
  const handleAprobarClick = useCallback((solicitud: SolicitudCese) => {
    selectRequestForModal(solicitud); // Selecciona la solicitud usando el hook
    onAprobarModalOpen();            // Abre el modal de HeroUI
  }, [selectRequestForModal, onAprobarModalOpen]);

   const handleVerDetalleClick = useCallback((solicitud: SolicitudCese) => {
      selectRequestForModal(solicitud); // Podrías usar esto para un modal de detalle
      console.log("Ver detalle de:", solicitud.id);
      // onDetalleModalOpen(); // Si tuvieras modal de detalle
   }, [selectRequestForModal]);

  // --- Lógica de Submit de Modales (ahora llaman al hook) ---
  const submitRechazo = useCallback(async (motivo: string) => {
    if (!selectedRequest) return;
    const success = await rejectRequest(selectedRequest.id, motivo); // Llama al hook
    if (success) {
      onRechazarModalClose(); // Cierra el modal si la acción del hook fue exitosa
    } // El hook maneja el estado isSubmitting y errores
  }, [selectedRequest, rejectRequest, onRechazarModalClose]);

  const submitAprobacion = useCallback(async (): Promise<boolean> => { // Ahora retorna Promise<boolean>
      if (!selectedRequest) return false; // Retorna false si no hay solicitud
      const success = await approveRequest(selectedRequest.id); // approveRequest ya retorna boolean
      // No cerramos el modal aquí, el componente modal lo hará si success es true
      return success; 
  }, [selectedRequest, approveRequest]); 


  // --- Renderizado JSX de la Página ---
  return (
     <div className="container mx-auto py-8 px-4 max-w-7xl space-y-6"> {/* Añadido space-y */}
       {/* Header y Breadcrumbs */}
       <div>
         <div className="flex items-center text-sm text-muted-foreground mb-3"> {/* Asumiendo text-muted-foreground */}
           <Link href="/personal-academico" className="hover:text-primary flex items-center">
             <ChevronLeft className="h-4 w-4 mr-1" />
             Volver a Personal Académico
           </Link>
         </div>
         <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2"> {/* Asumiendo text-foreground */}
           Solicitudes de Cese de Asesoría
         </h1>
         <p className="text-gray-500 max-w-3xl">
            Revise y gestione las solicitudes de cese de asesoría enviadas por los profesores. Al aprobar una solicitud, deberá reasignar los tesistas afectados a nuevos asesores.
          </p>
       </div>
       
       {/* Panel de control superior - Usando el componente */}
        <Card className="p-4 shadow-sm">
          <RequestFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm} // Pasamos la función del hook
            filterState={filterState}
            onFilterChange={setFilterState} // Pasamos la función del hook
            requests={solicitudesFiltradas} // Pasar las solicitudes filtradas (o las originales si el filtro se aplica dentro)
          />
       </Card>
       
       {/* Contenido principal: Lista o Tabla */}
       <div>
         {isLoading ? (
           <div className="p-12 text-center flex flex-col items-center justify-center text-muted-foreground">
             <Spinner color="primary" size="lg" />
             <p className="mt-4">Cargando solicitudes...</p>
           </div>
         ) : solicitudesFiltradas.length === 0 ? (
           <Card className="p-12 text-center shadow-sm">
             <p className="text-lg text-muted-foreground mb-2">No se encontraron solicitudes</p>
             <p className="text-sm text-muted-foreground">Ajuste los filtros o el término de búsqueda.</p>
           </Card>
         ) : (
           <>
             {filterState === 'pendiente' ? (
               <PendingRequestsList 
                 requests={solicitudesFiltradas} 
                 onApprove={handleAprobarClick} // Pasa el manejador que abre el modal
                 onReject={handleRechazarClick}  // Pasa el manejador que abre el modal
                 // El componente Card interno ahora podría recibir onVerDetalle si es necesario
               />
             ) : (
               <Card className="shadow-sm overflow-hidden border border-gray-300/80"> 
                  <RequestHistoryTable 
                     requests={solicitudesFiltradas} 
                     onViewDetails={handleVerDetalleClick} 
                  />
               </Card>
             )}
           </>
         )}
       </div>
       
       {/* --- Modales (Ahora reciben props del hook y de la página) --- */}
       <RejectCessationModal
         isOpen={isRechazarModalOpen}
         onClose={onRechazarModalClose} // Cierre manejado por la página
         onSubmit={submitRechazo}       // Lógica de submit manejada por la página (llama al hook)
         solicitud={selectedRequest}    // Solicitud seleccionada desde el hook
         isSubmitting={isSubmitting}    // Estado de carga desde el hook
       />
       
       <ApproveCessationModal
         isOpen={isAprobarModalOpen}
         onClose={onAprobarModalClose} // Cierre manejado por la página
         onSubmit={submitAprobacion}      // Lógica de submit manejada por la página (llama al hook)
         solicitud={selectedRequest}   // Solicitud seleccionada desde el hook
         isSubmitting={isSubmitting}   // Estado de carga desde el hook
       />

       {/* Si necesitas un modal de detalle a nivel de página, actívalo aquí */}
       {/* <RequestDetailModal isOpen={isDetalleModalOpen} onClose={onDetalleModalClose} solicitud={solicitudActual} /> */}

     </div>
  );
};

export default SolicitudesCesePage;