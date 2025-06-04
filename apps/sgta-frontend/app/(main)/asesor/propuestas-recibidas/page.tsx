// src/app/asesor/propuestas-recibidas/page.tsx
"use client";

import React, { useState } from "react";
import { Loader2, AlertTriangle, Inbox, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button"; // Ajusta si es necesario
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Hooks de React Query para este flujo
import {
  useGetMisInvitacionesDeAsesoria,
  useAcceptInvitacionAsesoria,
  useRejectInvitacionAsesoria,
} from "@/features/asesores/queries/asesor-invitations.queries"; // Ajusta la ruta

// Tipos para este flujo
import {
  IInvitacionAsesoriaTransformed,
  IRechazarPropuestaPayload,
  IInvitacionesAsesoriaSearchCriteria, // Para el hook de lista
} from "@/features/asesores/types/asesor-invitations.types"; // Ajusta la ruta

// Componentes para este flujo
import InvitacionAsesoriaCard from "@/features/asesores/components/asesor-invitations/InvitacionAsesoriaCard"; // Ajusta la ruta
import AcceptInvitationModal from "@/features/asesores/components/asesor-invitations/modals/AcceptInvitationModal"; // Ajusta la ruta
import RejectInvitationModal from "@/features/asesores/components/asesor-invitations/modals/RejectInvitationModal"; // Ajusta la ruta
import CessationRequestPagination from "@/features/asesores/components/cessation-request/pagination-cessation-request"; // Reutiliza tu paginación
import { toast } from "react-toastify";

// import { toast } from "sonner"; // O tu sistema de notificaciones

const ELEMENTS_PER_PAGE_INVITATIONS = 5; // O una constante global

interface ModalControlState {
  action: "accept" | "reject" | null;
  invitacion: IInvitacionAsesoriaTransformed | null;
  isOpen: boolean;
  errorMessage?: string | null; // Para errores en modales de acción
}

const AsesorPropuestasRecibidasPage = () => {
  const [currentPage, setCurrentPage] = useState(0); // 0-indexed
  const [modalState, setModalState] = useState<ModalControlState>({
    action: null,
    invitacion: null,
    isOpen: false,
  });

  const searchCriteria: IInvitacionesAsesoriaSearchCriteria = {
    page: currentPage,
    size: ELEMENTS_PER_PAGE_INVITATIONS,
  };

  const {
    data: invitacionesData, // IInvitacionesAsesoriaListProcessed | undefined
    isLoading,
    isError,
    error,
    refetch,
    isFetching, // Útil para mostrar un loader durante refetches/paginación
  } = useGetMisInvitacionesDeAsesoria(searchCriteria);

  const { mutate: acceptMutate, isPending: isAccepting } = useAcceptInvitacionAsesoria();
  const { mutate: rejectMutate, isPending: isRejecting } = useRejectInvitacionAsesoria();

  const handleOpenAcceptModal = (invitacion: IInvitacionAsesoriaTransformed) => {
    setModalState({ action: "accept", invitacion, isOpen: true });
  };

  const handleOpenRejectModal = (invitacion: IInvitacionAsesoriaTransformed) => {
    setModalState({ action: "reject", invitacion, isOpen: true });
  };

  const handleCloseModal = () => {
    setModalState({ action: null, invitacion: null, isOpen: false });
  };

  const handleConfirmAccept = (solicitudOriginalId: number) => {
    acceptMutate(solicitudOriginalId, {
      onSuccess: () => {
        // toast.success("Asesoría aceptada con éxito.");
        alert("Asesoría aceptada con éxito. El tema ahora aparecerá en 'Mis Temas Activos'.");
        refetch(); // Refresca la lista de invitaciones
        handleCloseModal();
      },
      onError: (error: any) => {
        const apiError = error?.response?.data?.message || error?.response?.data || error?.message || "Error al aceptar la asesoría.";
        setModalState(prev => ({ ...prev, errorMessage: apiError })); // Mostrar error en el modal
        // toast.error(apiError);
      },
    });
  };

  const handleConfirmReject = (solicitudOriginalId: number, payload: IRechazarPropuestaPayload) => {
    rejectMutate({ solicitudOriginalId, payload }, {
      onSuccess: () => {
        toast.info("Invitación de asesoría rechazada.");
        //alert("Invitación de asesoría rechazada.");
        refetch(); // Refresca la lista de invitaciones
        handleCloseModal();
      },
      onError: (error: any) => {
        const apiError = error?.response?.data?.message || error?.response?.data || error?.message || "Error al rechazar la asesoría.";
        setModalState(prev => ({ ...prev, errorMessage: apiError })); // Mostrar error en el modal
        // toast.error(apiError);
      },
    });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage); // React Query refetcheará debido al cambio en queryKey
  };


  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Cargando invitaciones de asesoría...</p>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="p-8 text-center text-red-500 bg-red-50 border border-red-200 rounded-md">
          <AlertTriangle className="h-10 w-10 mx-auto mb-2 text-red-600" />
          <p className="font-semibold">Error al cargar las invitaciones:</p>
          <p className="text-sm mt-1">{(error as Error)?.message || "Ocurrió un error desconocido."}</p>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-4">Reintentar</Button>
        </div>
      );
    }

    if (!invitacionesData || invitacionesData.invitaciones.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center text-center py-20 border rounded-md bg-slate-50">
          <Inbox className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-foreground">No tiene invitaciones pendientes</h3>
          <p className="text-muted-foreground mt-1">
            Cuando un coordinador le proponga una asesoría, aparecerá aquí.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {invitacionesData.invitaciones.map((invitacion) => (
          <InvitacionAsesoriaCard
            key={invitacion.solicitudOriginalId}
            invitacion={invitacion}
            onAccept={() => handleOpenAcceptModal(invitacion)}
            onReject={() => handleOpenRejectModal(invitacion)}
          />
        ))}
        {invitacionesData.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <CessationRequestPagination
              currentPage={invitacionesData.currentPage}
              totalPages={invitacionesData.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    );
  };


  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl"> {/* Un poco más estrecho que la del coordinador */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Invitaciones de Asesoría Pendientes
        </h1>
        <p className="text-muted-foreground mt-1">
          Revise las propuestas de asesoría enviadas por la coordinación y tome una decisión.
        </p>
      </div>

      {isFetching && !isLoading && ( // Indicador de carga para refetches/paginación
        <div className="fixed top-4 right-4 z-50 bg-background border p-2 rounded-md shadow-lg text-sm flex items-center">
            <Loader2 className="h-4 w-4 animate-spin mr-2" /> Actualizando...
        </div>
      )}

      {renderContent()}

      {/* Modales */}
      <AcceptInvitationModal
        isOpen={modalState.isOpen && modalState.action === "accept"}
        onClose={handleCloseModal}
        invitacion={modalState.invitacion}
        onConfirmAccept={handleConfirmAccept}
        isAccepting={isAccepting}
        // errorMessage={modalState.action === "accept" ? modalState.errorMessage : null} // Podrías pasar errores específicos del modal
      />
      <RejectInvitationModal
        isOpen={modalState.isOpen && modalState.action === "reject"}
        onClose={handleCloseModal}
        invitacion={modalState.invitacion}
        onConfirmReject={handleConfirmReject}
        isRejecting={isRejecting}
        errorMessage={modalState.action === "reject" ? modalState.errorMessage : null}
      />
    </div>
  );
};

export default AsesorPropuestasRecibidasPage;