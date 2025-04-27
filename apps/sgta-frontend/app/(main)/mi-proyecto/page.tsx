// src/app/(main)/mi-proyecto/page.tsx 
'use client'

import React, { useCallback, useState } from 'react';
import { Card, Spinner, useDisclosure, Button, CardHeader, CardBody } from "@heroui/react"; 
import { useMyProjectData } from '@/features/proyecto-estudiante/hooks/useMyProjectData';
import ProjectHeader from '@/features/proyecto-estudiante/components/ProjectHeader';
import ProjectTimelineOrSteps from '@/features/proyecto-estudiante/components/ProjectTimelineOrSteps'; // Necesita implementación
import UpcomingDeliverables from '@/features/proyecto-estudiante/components/UpcomingDeliverables'; // Necesita implementación
import RecentActivityFeed from '@/features/proyecto-estudiante/components/RecentActivityFeed'; // Necesita implementación
import AdvisorInfoCard from '@/features/proyecto-estudiante/components/AdvisorInfoCard';
import RequestAdvisorChangeModal from '@/features/proyecto-estudiante/components/RequestAdvisorChangeModal';
// Podrías necesitar el hook de asesores si el modal de cambio los carga
import { useAdvisorDirectory } from '@/features/busqueda-personal-academico/hooks/useAdvisorDirectory'; 

// Placeholder para componentes no implementados
const PlaceholderComponent = ({ title }: {title: string}) => <Card className="p-4 border border-dashed text-center text-gray-400">{title} - Próximamente</Card>;

const MiProyectoPage = () => {
  
  const { 
    projectData, 
    isLoading, 
    error, 
    refreshProjectData, 
    requestAdvisorChange, // Función para solicitar cambio
    isSubmittingChange,   // Estado de carga para esa acción
    upcomingMilestones    // Datos para widget de próximos hitos
  } = useMyProjectData();

  // Hook para obtener asesores disponibles (para el modal de sugerencia)
   const { advisors: availableAdvisors, isLoading: isLoadingAdvisors } = useAdvisorDirectory(); // Carga la lista de asesores

  // Estado y control del modal de cambio de asesor
  const { isOpen: isChangeModalOpen, onOpen: onChangeModalOpen, onClose: onChangeModalClose } = useDisclosure();
  
  // Función para manejar el submit del modal de cambio
  const handleSubmitAdvisorChange = useCallback(async (payload: { motivo: string; asesorSugeridoId?: string | null }): Promise<boolean> => {
     const success = await requestAdvisorChange(payload);
     if (success) {
         onChangeModalClose(); // Cerrar modal en éxito
         alert("Solicitud de cambio enviada exitosamente."); // Reemplazar con Toast
     } else {
        // El hook maneja el estado 'error', se mostrará en el modal
     }
     return success;
  }, [requestAdvisorChange, onChangeModalClose]);


  // --- Renderizado ---
  const renderContent = () => {
     if (isLoading || isLoadingAdvisors) { // Considerar ambos loadings
        return <div className="flex justify-center items-center min-h-[400px]"><Spinner size="lg" color="primary" label="Cargando información del proyecto..." /></div>;
     }
     if (error) {
        return <Card className="p-6 border-danger-200 bg-danger-50 text-danger-700 text-center">{error} <Button color="danger" variant="light" size="sm" onPress={refreshProjectData} className="mt-2">Reintentar</Button></Card>;
     }
     if (!projectData) {
        return <Card className="p-6 text-center text-gray-500 border-dashed">Aún no tienes un proyecto de fin de carrera activo asignado.</Card>;
     }

     // Si hay datos del proyecto
     return (
        <div className="space-y-6">
            {/* Cabecera del Proyecto */}
            <ProjectHeader 
                title={projectData.tituloProyecto} 
                status={projectData.estadoProyecto} 
                cycle={projectData.cicloActual}
                course={projectData.cursoActual}
                progress={projectData.progresoGeneral}
            />

            {/* Grid Principal */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Columna Izquierda (más ancha) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Cronograma / Próximos Pasos */}
                    {projectData.cronograma ? (
                         <ProjectTimelineOrSteps milestones={projectData.cronograma}/> // Pasar hitos
                    ) : (
                        <PlaceholderComponent title="Visualización Cronograma" />
                    )}
                    {/* Actividad Reciente */}
                     {projectData.actividadReciente ? (
                         <RecentActivityFeed activities={projectData.actividadReciente} />
                     ) : (
                         <PlaceholderComponent title="Actividad Reciente" />
                     )}
                </div>

                {/* Columna Derecha */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Próximos Entregables */}
                    <UpcomingDeliverables deadlines={upcomingMilestones}/> 
                    {/* Información del Asesor */}
                    <AdvisorInfoCard 
                       advisor={projectData.asesorPrincipal}
                       changeRequestStatus={projectData.solicitudCambioAsesor}
                       onOpenChangeRequestModal={onChangeModalOpen} // Abre el modal
                    />
                    {/* Información Co-Asesor (si existe) */}
                    {projectData.coAsesor && (
                       <Card className="shadow-sm border">
                          <CardHeader className="border-b pb-2"><h3 className="text-base font-semibold text-gray-800">Co-Asesor</h3></CardHeader>
                          <CardBody className="p-4"> {/* ... mostrar info co-asesor ... */} </CardBody>
                       </Card>
                    )}
                </div>
            </div>
        </div>
     );
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-7xl">
      {renderContent()}

      {/* Modal para Solicitar Cambio de Asesor */}
      {projectData?.asesorPrincipal && ( // Asegurarse que hay asesor actual
         <RequestAdvisorChangeModal
            isOpen={isChangeModalOpen}
            onClose={onChangeModalClose}
            onSubmit={handleSubmitAdvisorChange}
            currentAdvisor={projectData.asesorPrincipal}
            availableAdvisors={availableAdvisors} // Pasar lista de asesores para sugerir
            isSubmitting={isSubmittingChange}
            error={error} // Pasar error del hook para mostrar en modal
         />
      )}
    </div>
  );
};

export default MiProyectoPage;