// src/app/coordinador/reasignaciones-pendientes/page.tsx
"use client";

import React, { useState } from "react"; // Eliminado useMemo ya que no se usa explícitamente
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertTriangle, Inbox, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useGetReasignacionesPendientes } from "@/features/asesores/queries/reasignacion.queries";
import {
  IReasignacionesPendientesSearchCriteria,
  IReasignacionPendienteTransformed,
} from "@/features/asesores/types/reasignacion.types";

import ReasignacionPendienteCard from "@/features/asesores/components/reasignacion/ReasignacionPendienteCard";
import CessationRequestPagination from "@/features/asesores/components/cessation-request/pagination-cessation-request";
import ReassignAdvisorModal from "@/features/asesores/components/cessation-request/modals/ReassignAdvisorModal"; // Ajusta ruta
import { useDebounce } from "@/features/asesores/hooks/use-debounce";
import { ICessationRequestDataTransformed, ICessationRequestTemaSimpleBackend } from "@/features/asesores/types/cessation-request"; // Para el modal
import { ELEMENTS_PER_PAGE_DEFAULT } from "@/lib/constants";

interface ReassignModalState {
  isOpen: boolean;
  // Para pasar al ReassignAdvisorModal, que espera ICessationRequestDataTransformed
  requestDataForReassignModal?: ICessationRequestDataTransformed;
}

const CoordinadorReasignacionesPendientesPage = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const initialReassignModalState: ReassignModalState = {
    isOpen: false,
    requestDataForReassignModal: undefined,
  };
  const [reassignModalState, setReassignModalState] = useState<ReassignModalState>(initialReassignModalState);

  const searchCriteria: IReasignacionesPendientesSearchCriteria = {
    page: currentPage,
    size: ELEMENTS_PER_PAGE_DEFAULT, // Usar la constante
    searchTerm: debouncedSearchTerm,
  };

  const {
    data: reasignacionesData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetReasignacionesPendientes(searchCriteria);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(0);
  };

  const handleOpenReassignModal = (dataDeReasignacionPendiente: IReasignacionPendienteTransformed) => {
    if (dataDeReasignacionPendiente.temaId === null || dataDeReasignacionPendiente.temaTitulo === null) {
      alert("Error: Faltan datos del tema para la reasignación.");
      console.error("Faltan datos del tema en IReasignacionPendienteTransformed:", dataDeReasignacionPendiente);
      return;
    }
    if (dataDeReasignacionPendiente.asesorOriginalId === null) {
        alert("Error: Faltan datos del asesor original.");
        console.error("Faltan datos del asesor original en IReasignacionPendienteTransformed:", dataDeReasignacionPendiente);
        return;
    }

    // Construir el objeto ICessationRequestDataTransformed que espera ReassignAdvisorModal
    const temaParaModal: ICessationRequestTemaSimpleBackend = {
        id: dataDeReasignacionPendiente.temaId,
        name: dataDeReasignacionPendiente.temaTitulo,
    };

    const requestDataForModal: ICessationRequestDataTransformed = {
      id: dataDeReasignacionPendiente.solicitudOriginalId,
      tema: temaParaModal, // Correctamente tipado
      assessor: { // Asesor que cesó
        id: dataDeReasignacionPendiente.asesorOriginalId,
        name: dataDeReasignacionPendiente.asesorOriginalNombres || "",
        lastName: dataDeReasignacionPendiente.asesorOriginalPrimerApellido || "",
        email: dataDeReasignacionPendiente.asesorOriginalCorreo || "",
        quantityCurrentProyects: 0, // Este dato no está en ReasignacionPendienteDto, poner placeholder o buscarlo si es crucial
        urlPhoto: null, // Este dato no está en ReasignacionPendienteDto
      },
      students: dataDeReasignacionPendiente.estudiantes.map(e => ({
        id: e.id,
        name: e.nombres,
        lastName: e.primerApellido || "",
        topic: temaParaModal, // Reutilizar el objeto temaParaModal que ya tiene ID y nombre
      })),
      registerTime: dataDeReasignacionPendiente.fechaAprobacionCese, // Usar fechaAprobacionCese
      status: "aprobada", // El estado de la solicitud de cese original siempre será "aprobada" en este flujo
      reason: dataDeReasignacionPendiente.motivoCeseOriginal,
      response: null, // La respuesta a la solicitud de cese original (podría ser el comentario de aprobación del coord.)
      responseTime: dataDeReasignacionPendiente.fechaAprobacionCese, // O la fecha de resolución del cese
    };

    setReassignModalState({
      isOpen: true,
      requestDataForReassignModal: requestDataForModal,
    });
  };

  const handleCloseReassignModal = () => {
    setReassignModalState(initialReassignModalState);
  };

  const handleReassignSuccess = () => {
    refetch(); // Refresca la lista de reasignaciones pendientes
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Cargando reasignaciones pendientes...</p>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="p-8 text-center text-red-500 bg-red-50 border border-red-200 rounded-md">
          <AlertTriangle className="h-10 w-10 mx-auto mb-2 text-red-600" />
          <p className="font-semibold">Error al cargar las reasignaciones:</p>
          <p className="text-sm mt-1">{(error as Error)?.message || "Ocurrió un error desconocido."}</p>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-4">Reintentar</Button>
        </div>
      );
    }

    if (!reasignacionesData || reasignacionesData.reasignaciones.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center text-center py-20 border rounded-md bg-slate-50">
          <Inbox className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-foreground">No hay reasignaciones pendientes</h3>
          <p className="text-muted-foreground mt-1">
            Todas las solicitudes de cese aprobadas han sido gestionadas o no hay ninguna que requiera su acción.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {reasignacionesData.reasignaciones.map((reasignacion) => (
          <ReasignacionPendienteCard
            key={reasignacion.solicitudOriginalId}
            reasignacion={reasignacion}
            onProponerNuevoAsesor={() => {
                if (reasignacion.temaId !== null) { // Asegurarse de que temaId no sea null
                    handleOpenReassignModal(reasignacion);
                } else {
                    alert("Error: No se puede proponer reasignación porque falta el ID del tema.");
                }
            }}
          />
        ))}
        {reasignacionesData.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <CessationRequestPagination
              currentPage={reasignacionesData.currentPage}
              totalPages={reasignacionesData.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Gestión de Reasignaciones de Asesoría Pendientes
        </h1>
        <p className="text-muted-foreground mt-1">
          Revise las solicitudes de cese aprobadas y proponga un nuevo asesor para los temas afectados.
        </p>
      </div>

      <Card className="mb-6 p-4 shadow-sm">
        <div className="relative w-full sm:w-1/2 md:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar por tema, asesor original..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
      </Card>
      
      {isFetching && !isLoading && (
        <div className="fixed top-4 right-4 z-50 bg-background border p-2 rounded-md shadow-lg text-sm flex items-center">
            <Loader2 className="h-4 w-4 animate-spin mr-2" /> Actualizando...
        </div>
      )}

      {renderContent()}

      {reassignModalState.isOpen && reassignModalState.requestDataForReassignModal && (
        <ReassignAdvisorModal
          isOpen={reassignModalState.isOpen}
          onClose={handleCloseReassignModal}
          requestData={reassignModalState.requestDataForReassignModal}
          refetchMainList={handleReassignSuccess}
        />
      )}
    </div>
  );
};

export default CoordinadorReasignacionesPendientesPage;