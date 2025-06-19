// src/app/asesor/asesores/cese-de-asesoria/page.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Loader2, AlertTriangle } from "lucide-react";
import SolicitarCeseModal from "@/features/asesores/components/cessation-request/modals/SolicitarCeseModal";
import { useAsesorActiveSupervisingTopics } from "@/features/asesores/queries/asesorQueries"; // Hook para temas del modal
import MisSolicitudesDeCeseTable from "@/features/asesores/components/cessation-request/MisSolicitudesDeCeseTable"; // TU NUEVO COMPONENTE
import { useMisSolicitudesDeCese } from "@/features/asesores/queries/asesorQueries"; // Hook para "Mis Solicitudes"
import CessationRequestPagination from "@/features/asesores/components/cessation-request/pagination-cessation-request"; // Componente de paginación

const AsesorCeseDeAsesoriaPage = () => {
  const [isSolicitarCeseModalOpen, setIsSolicitarCeseModalOpen] = useState(false);
  
  // Estado para la paginación de "Mis Solicitudes"
  const [currentPageMisSolicitudes, setCurrentPageMisSolicitudes] = useState(0); // 0-indexed

  // Hook para obtener los temas que el asesor supervisa (para el modal de nueva solicitud)
  const { 
    data: temasAsesorados, 
    isLoading: isLoadingTemasAsesorados, 
    isError: isErrorTemasAsesorados,
    error: errorTemasAsesorados,
    refetch: refetchTemasAsesorados 
  } = useAsesorActiveSupervisingTopics();
  
  const ELEMENTS_PER_PAGE = 10;

  // Hook para obtener las solicitudes de cese ya creadas por este asesor
  const { 
    data: misSolicitudesData, // Será IMyCessationRequestListProcessed | undefined
    isLoading: isLoadingMisSolicitudes, 
    isError: isErrorMisSolicitudes,
    error: errorMisSolicitudes,
    refetch: refetchMisSolicitudes 
  } = useMisSolicitudesDeCese(currentPageMisSolicitudes, ELEMENTS_PER_PAGE);

  const handleOpenModal = () => setIsSolicitarCeseModalOpen(true);
  const handleCloseModal = () => setIsSolicitarCeseModalOpen(false);

  const handleSolicitudCeseSuccess = () => {
    refetchTemasAsesorados?.(); 
    refetchMisSolicitudes?.(); // Refrescar la lista de "mis solicitudes"
    console.log("Nueva solicitud de cese creada, listas relevantes refetcheadas.");
  };

  const handleMyRequestsPageChange = (newPage: number) => { // newPage es 0-indexed
    setCurrentPageMisSolicitudes(newPage);
    // React Query refetcheará automáticamente porque 'currentPageMisSolicitudes' es parte de la queryKey
    // en useMisSolicitudesDeCese (indirectamente, a través del parámetro 'page')
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Solicitudes de Cese de Asesoría
          </h1>
          <p className="text-muted-foreground mt-1">
            Inicie una nueva solicitud de cese o revise el estado de sus solicitudes enviadas.
          </p>
        </div>
        <Button 
          onClick={handleOpenModal} 
          disabled={isLoadingTemasAsesorados}
        >
          {isLoadingTemasAsesorados ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <PlusCircle className="mr-2 h-4 w-4" />
          )}
          Nueva Solicitud de Cese
        </Button>
      </div>

      {/* Sección para listar las solicitudes de cese ya enviadas por este asesor */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Mis Solicitudes Enviadas</CardTitle>
          <CardDescription>
            Estado de las solicitudes de cese que ha iniciado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingMisSolicitudes && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <p className="ml-2 text-muted-foreground">Cargando sus solicitudes...</p>
            </div>
          )}
          {isErrorMisSolicitudes && !isLoadingMisSolicitudes && (
             <div className="p-4 text-center text-red-500">
                <p>Error al cargar sus solicitudes: {errorMisSolicitudes?.message || "Error desconocido"}</p>
                <Button variant="outline" size="sm" onClick={() => refetchMisSolicitudes()} className="mt-2">
                    Reintentar
                </Button>
            </div>
          )}
          {!isLoadingMisSolicitudes && !isErrorMisSolicitudes && misSolicitudesData && (
            misSolicitudesData.requests.length > 0 ? (
              <>
                <MisSolicitudesDeCeseTable requests={misSolicitudesData.requests} />
                {misSolicitudesData.totalPages > 1 && (
                  <div className="mt-6 flex justify-center">
                    <CessationRequestPagination
                      currentPage={misSolicitudesData.currentPage} // Viene del backend (0-indexed)
                      totalPages={misSolicitudesData.totalPages}
                      onPageChange={handleMyRequestsPageChange} // Pasa la nueva página (0-indexed)
                    />
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground py-12 text-center">
                No ha enviado ninguna solicitud de cese todavía.
              </p>
            )
          )}
        </CardContent>
      </Card>

      <SolicitarCeseModal
        isOpen={isSolicitarCeseModalOpen}
        onClose={handleCloseModal}
        temasDisponibles={temasAsesorados || []}
        isLoadingTemas={isLoadingTemasAsesorados}
        onSuccess={handleSolicitudCeseSuccess}
      />

      {isErrorTemasAsesorados && !isLoadingTemasAsesorados && !isSolicitarCeseModalOpen && (
         <Card className="mt-6 border-red-500 bg-red-50">
            <CardHeader className="flex flex-row items-center space-x-2 !pb-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <CardTitle className="text-red-700 text-lg">Error al Cargar Temas para Nueva Solicitud</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-red-600">
                    No se pudieron cargar sus temas de asesoría. No podrá crear una nueva solicitud de cese en este momento.
                </p>
                {errorTemasAsesorados?.message && <p className="text-xs mt-1">Detalle: {errorTemasAsesorados.message}</p>}
                 <Button variant="outline" size="sm" onClick={() => refetchTemasAsesorados()} className="mt-2">
                    Reintentar Carga de Temas
                </Button>
            </CardContent>
         </Card>
      )}
    </div>
  );
};

export default AsesorCeseDeAsesoriaPage;