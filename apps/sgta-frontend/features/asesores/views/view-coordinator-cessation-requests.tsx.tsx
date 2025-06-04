// Page.tsx
import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { useCessationRequestSearchCriteriaStore } from "@/features/asesores/store/cessation-request-filters";

import RequestSearchFilters from "@/features/asesores/components/cessation-request/search-filters-request-list";
import PendingAssessorChangeRequestsList from "@/features/asesores/components/cessation-request/list-pending-requests";
import CessationRequestHistoryTable from "@/features/asesores/components/cessation-request/list-approved-rejected-requests";
import CessationRequestPagination from "@/features/asesores/components/cessation-request/pagination-cessation-request";
import NotCessationRequestFound from "@/features/asesores/components/cessation-request/not-cessation-request-found";
import { Loader2 } from "lucide-react";
import { useRequestTerminationList } from "@/features/asesores/queries/cessation-request"; // Asumiendo que es el correcto
import {
  IRequestTerminationConsultancyListSearchCriteria,
  CessationRequestFrontendStatusFilter,
  ICessationRequestDataTransformed,
} from "@/features/asesores/types/cessation-request";

// Importar los modales
import RejectCessationModal from "@/features/asesores/components/cessation-request/modals/RejectCessationModal"; // Ajusta la ruta
import CessationRequestDetailModal from "@/features/asesores/components/cessation-request/modals/CessationRequestDetailModal"; // Ajusta la ruta
import ApproveCessationModal from "@/features/asesores/components/cessation-request/modals/ApproveCessationModal"; // NUEVO - Ajusta la ruta
import ReassignAdvisorModal from "../components/cessation-request/modals/ReassignAdvisorModal";
// import ReassignAdvisorModal from "@/features/asesores/components/cessation-request/modals/ReassignAdvisorModal"; // NUEVO (comentado por ahora)


// Tipo para las opciones de los modales
type ModalOptionType = "detail" | "denny" | "accept" | "propose_reassign" | null;

interface ModalState {
  id: number | null;
  option: ModalOptionType;
  openModal: boolean;
  // requestData podría ser útil para no tener que buscarlo de nuevo
  requestData?: ICessationRequestDataTransformed;
}


const Page = () => {
  const {
    fullNameEmail,
    page,
    status,
    setPage,
    setStatusTabFilter,
    setFullNameEmailPage,
  } = useCessationRequestSearchCriteriaStore();

  const initialModalState: ModalState = {
    id: null,
    option: null,
    openModal: false,
    requestData: undefined,
  };
  const [modalController, setModalController] = useState<ModalState>(initialModalState);

  const searchCriteriaForHook: IRequestTerminationConsultancyListSearchCriteria = {
    page,
    status,
    fullNameEmail,
  };

  const {
    data: cessationListData,
    isLoading,
    isError,
    error,
    refetch,
  } = useRequestTerminationList(searchCriteriaForHook);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRefetchList = async () => { // Renombrado para claridad
    await refetch();
  };

  // Memoiza la solicitud seleccionada para pasarla a los modales
  const selectedRequestDataForModal = useMemo(() => {
    if (!modalController.id || !cessationListData?.requestTermmination) return undefined;
    return cessationListData.requestTermmination.find(
      (req) => req.id === modalController.id
    );
  }, [modalController.id, cessationListData]);


  // Función para abrir el modal de Reasignación (se llamará después de una aprobación exitosa)
  const openReassignModal = (approvedRequest: ICessationRequestDataTransformed) => {

    console.log("[Page.tsx] handleApprovalSuccessAndOpenReassign, approvedRequestData:", JSON.stringify(approvedRequest, null, 2));
    console.log("[Page.tsx] Tema ID en approvedRequestData:", approvedRequest.tema?.id);
    console.log("[Page.tsx] Asesor en approvedRequestData:", approvedRequest.assessor?.id);

    setModalController({
      id: approvedRequest.id,
      option: "propose_reassign", // Nueva opción para este modal
      openModal: true,
      requestData: approvedRequest,
    });
  };


  if (isError) {
    return (
      <div className="p-12 text-center text-red-500">
        <p>Error al cargar las solicitudes: {error?.message || "Error desconocido"}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="container mx-auto py-8 px-4 max-w-7xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
            Solicitudes de Cese de Asesoría
          </h1>
          <p className="text-muted-foreground max-w-3xl">
            Revise y gestione las solicitudes de cese de asesoría enviadas por los profesores.
            Al aprobar una solicitud, deberá reasignar los tesistas afectados a nuevos asesores.
          </p>
        </div>

        <Card className="p-4 shadow-sm">
          <RequestSearchFilters
            searchTerm={fullNameEmail}
            onSearchChange={setFullNameEmailPage}
            statusValue={status}
            onStatusValueChange={(newStatusValue: CessationRequestFrontendStatusFilter) => {
              setStatusTabFilter(newStatusValue);
            }}
          />
        </Card>

        {(() => {
          if (isLoading) {
            return ( /* ... Loader ... */ 
              <div className="p-12 text-center flex flex-col items-center justify-center text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <p className="mt-4">Cargando solicitudes...</p>
              </div>
            );
          }
          if (!cessationListData || cessationListData.requestTermmination.length === 0) {
            return ( <NotCessationRequestFound type={status} appliedFilters={fullNameEmail !== ""} /> );
          }

          if (status === "pending") {
            return (
              <PendingAssessorChangeRequestsList
                requests={cessationListData.requestTermmination}
                onApprove={(requestId) => setModalController({ id: requestId, option: "accept", openModal: true, requestData: undefined })}
                onReject={(requestId) => setModalController({ id: requestId, option: "denny", openModal: true, requestData: undefined })}
                onViewDetails={(requestId) => setModalController({ id: requestId, option: "detail", openModal: true, requestData: undefined })}
              />
            );
          } else { // status === "history"
            return (
              <CessationRequestHistoryTable
                requests={cessationListData.requestTermmination}
                onViewDetails={(requestId) => setModalController({ id: requestId, option: "detail", openModal: true, requestData: undefined })}
              />
            );
          }
        })()}

        <br />
        {!isLoading && cessationListData && cessationListData.requestTermmination.length > 0 && (
          <CessationRequestPagination
            currentPage={page}
            totalPages={cessationListData.totalPages ?? 1}
            onPageChange={handlePageChange}
          />
        )}

        {/* --- MODALES --- */}

        {/* Modal de Detalles */}
        {modalController.id !== null && selectedRequestDataForModal && (
            <CessationRequestDetailModal
              isOpen={modalController.openModal && modalController.option === "detail"}
              onClose={() => setModalController(initialModalState)}
              requestId={modalController.id} // El modal de detalle probablemente haga su propio fetch por ID
            />
        )}

        {/* Modal de Rechazo */}
        {modalController.id !== null && selectedRequestDataForModal && (
            <RejectCessationModal
              isOpen={modalController.openModal && modalController.option === "denny"}
              onClose={() => setModalController(initialModalState)}
              requestId={modalController.id}
              requestDetails={selectedRequestDataForModal} // Pasar los detalles de la solicitud
              refetchList={handleRefetchList}
            />
        )}

        {/* Modal de Aprobación */}
        {modalController.id !== null && selectedRequestDataForModal && (
            <ApproveCessationModal
                isOpen={modalController.openModal && modalController.option === "accept"}
                onClose={() => setModalController(initialModalState)}
                request={selectedRequestDataForModal} // Pasar la solicitud completa
                onApprovalSuccess={openReassignModal} // Al aprobar, abre el modal de reasignación
            />
        )}
        
        {/* Modal de Reasignación (Proponer Asesor) */}
        {modalController.option === "propose_reassign" && modalController.requestData && (
          <ReassignAdvisorModal 
            isOpen={modalController.openModal}
            onClose={() => setModalController(initialModalState)}
            requestData={modalController.requestData} 
            refetchMainList={handleRefetchList}
          />
        )}
      </div>
    </div>
  );
};

export default Page;