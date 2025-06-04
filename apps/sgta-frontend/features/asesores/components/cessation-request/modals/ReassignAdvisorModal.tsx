// src/features/coordinador/components/cessation-request/modals/ReassignAdvisorModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertTriangle, Loader2, Search, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  ICessationRequestDataTransformed,
  ICessationRequestAvailableAdvisor,
  ICessationRequestSearchCriteriaAvailableAdvisorList, // Para el hook useAvailableAdvisorList
  IListAvailableAdvisorResponseFetched // Para el tipo de dato del hook
} from "@/features/asesores/types/cessation-request";
import { useAvailableAdvisorList, useProposeReassignment } from "@/features/asesores/queries/cessation-request"; // Ajusta ruta
import { useDebounce } from "@/features/asesores/hooks/use-debounce";
import CessationRequestPagination from "@/features/asesores/components/cessation-request/pagination-cessation-request";
import { toast } from "react-toastify";
// import { toast } from "sonner";

interface ReassignAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestData: ICessationRequestDataTransformed | null;
  refetchMainList: () => void;
}

const ReassignAdvisorModal: React.FC<ReassignAdvisorModalProps> = ({
  isOpen,
  onClose,
  requestData,
  refetchMainList,
}) => {
  const [selectedNewAdvisor, setSelectedNewAdvisor] = useState<ICessationRequestAvailableAdvisor | null>(null);
  const [advisorSearchTerm, setAdvisorSearchTerm] = useState("");
  const [advisorCurrentPage, setAdvisorCurrentPage] = useState(0);
  const debouncedAdvisorSearchTerm = useDebounce(advisorSearchTerm, 500);
  // const ADVISORS_PER_PAGE = 5; // El tamaño de página se maneja en el hook o servicio API

  const searchCriteriaForAvailableAdvisors: ICessationRequestSearchCriteriaAvailableAdvisorList = {
    fullNameEmailCode: debouncedAdvisorSearchTerm,
    idThematicAreas: [], // TODO: Obtener áreas del requestData.tema.id si es posible y pasarlas
    page: advisorCurrentPage,
    // size: ADVISORS_PER_PAGE, // Si el backend lo necesita explícitamente y el hook no lo maneja
  };

  const {
    data: availableAdvisorsApiResponse,
    isLoading: isLoadingAdvisors,
    isError: isErrorAdvisors,
    error: errorAdvisors, // Este es el objeto de error
    refetch: refetchAvailableAdvisors,
  } = useAvailableAdvisorList(searchCriteriaForAvailableAdvisors);

  const { mutate: proposeReassignmentMutate, isPending: isProposing } = useProposeReassignment();

  useEffect(() => {
    if (isOpen && requestData) {
      setSelectedNewAdvisor(null);
      setAdvisorSearchTerm("");
      setAdvisorCurrentPage(0);
      // Considera si refetchAvailableAdvisors es necesario aquí o si la queryKey dinámica es suficiente
      // para React Query. Si los criterios de búsqueda se resetean, la queryKey cambiará y
      // React Query podría refetchear. Si quieres forzar data fresca siempre:
      // refetchAvailableAdvisors();
    }
  }, [isOpen, requestData]); // Eliminado refetchAvailableAdvisors de dependencias si no se quiere un bucle.


  const handleProposeReassignment = () => {
    if (!selectedNewAdvisor || !requestData || !requestData.assessor || !requestData.tema) {
      console.error("Datos incompletos para proponer reasignación:", { selectedNewAdvisor, requestData });
      toast.error("Error: Faltan datos para la propuesta (asesor seleccionado, datos de la solicitud o del tema).");
      return;
    }
    if (typeof requestData.tema.id !== 'number') {
      toast.error("Error crítico: ID del tema no disponible en requestData. No se puede proponer reasignación.");
      return;
    }
    if (selectedNewAdvisor.id === requestData.assessor.id) {
      toast.error("No puede proponer al mismo asesor que está cesando.");
      return;
    }

    proposeReassignmentMutate(
      {
        solicitudDeCeseOriginalId: requestData.id,
        nuevoAsesorPropuestoId: selectedNewAdvisor.id,
      },
      {
        onSuccess: () => {
          alert(`Propuesta enviada a ${selectedNewAdvisor.nombres} ${selectedNewAdvisor.primerApellido}.`);
          refetchMainList();
          onClose();
        },
        onError: (error: any) => {
          const apiError = error?.response?.data?.message || error?.response?.data || error?.message || "Error al enviar la propuesta.";
          alert(`Error al enviar propuesta: ${apiError}`);
          console.error("Error al proponer reasignación:", error);
        },
      }
    );
  };

  if (!isOpen || !requestData) return null;

  const temaInfo = requestData.tema?.name || requestData.students[0]?.topic?.name || "Tema Desconocido";
  const asesoresPaginados = availableAdvisorsApiResponse?.content || [];
  const totalPagesAsesores = availableAdvisorsApiResponse?.totalPages || 0;

  // Para el botón de proponer, obtener el nombre del asesor seleccionado
  const selectedAdvisorDisplayName = selectedNewAdvisor
    ? `${selectedNewAdvisor.nombres} ${selectedNewAdvisor.primerApellido}`
    : "Seleccione un Asesor";

  return (
    <Dialog open={isOpen} onOpenChange={(openState) => { if (!openState) onClose(); }}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Proponer Nuevo Asesor</DialogTitle>
          <DialogDescription>
            Para el tema "<span className="font-semibold">{temaInfo}</span>" (Solicitud ID: {requestData.id}).
            Asesor original: {requestData.assessor?.name} {requestData.assessor?.lastName}.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4 flex-grow overflow-y-auto">
          <div className="mb-4">
            <h4 className="font-medium text-sm mb-1 text-foreground flex items-center">
              <Users className="h-4 w-4 mr-2" /> Tesista(s) Afectado(s):
            </h4>
            <ul className="list-disc list-inside pl-2 text-sm text-muted-foreground">
              {requestData.students.map(student => (
                <li key={student.id}>{student.name} {student.lastName}</li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar asesor por nombre, apellido o correo..."
              value={advisorSearchTerm}
              onChange={(e) => {
                setAdvisorSearchTerm(e.target.value);
                setAdvisorCurrentPage(0); 
              }}
              className="pl-10"
            />
          </div>

          <div className="border rounded-md">
            <h4 className="font-medium text-sm p-3 border-b bg-slate-50 text-slate-700">Asesores Disponibles</h4>
            {isLoadingAdvisors && (
              <div className="p-6 text-center text-muted-foreground flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin mr-2" /> Cargando asesores...
              </div>
            )}
            {isErrorAdvisors && !isLoadingAdvisors && ( // MOSTRAR ERROR AQUÍ
              <div className="p-4 m-2 border border-red-200 bg-red-50 rounded-md text-sm text-red-700" role="alert">
                <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    <span className="font-semibold">Error al cargar asesores</span>
                </div>
                <p className="mt-1 ml-7 text-xs">
                  { (errorAdvisors as Error)?.message || "No se pudieron obtener los asesores. Intente de nuevo."}
                </p>
                <Button variant="outline" size="sm" onClick={() => refetchAvailableAdvisors()} className="mt-2 ml-7">
                  Reintentar
                </Button>
              </div>
            )}
            {!isLoadingAdvisors && !isErrorAdvisors && (
              asesoresPaginados.length > 0 ? (
                <ScrollArea className="h-[250px] sm:h-[300px]">
                  <div className="divide-y">
                    {asesoresPaginados.map((advisor) => (
                      <div
                        key={advisor.id}
                        className={`p-3 hover:bg-slate-100 cursor-pointer flex items-center gap-3 ${
                          selectedNewAdvisor?.id === advisor.id ? "bg-blue-100 ring-2 ring-blue-500" : ""
                        }`}
                        onClick={() => setSelectedNewAdvisor(advisor)}
                      >
                        <Avatar className="h-9 w-9">
                          {advisor.urlFoto && <AvatarImage src={advisor.urlFoto} alt={`${advisor.nombres} ${advisor.primerApellido}`} />}
                          <AvatarFallback>
                            {advisor.nombres?.[0]?.toUpperCase()}
                            {advisor.primerApellido?.[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-grow">
                          <p className="text-sm font-medium text-foreground">
                            {advisor.nombres} {advisor.primerApellido} {advisor.segundoApellido || ""}
                          </p>
                          <p className="text-xs text-muted-foreground">{advisor.correoElectronico}</p>
                        </div>
                        <Badge variant="secondary" className="text-xs whitespace-nowrap">
                          Carga: {advisor.cantidadTesistasActuales ?? 0}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <p className="p-6 text-sm text-center text-muted-foreground">
                  No se encontraron asesores disponibles con los criterios actuales.
                </p>
              )
            )}
          </div>
          {totalPagesAsesores > 1 && (
            <div className="mt-4 flex justify-center">
              <CessationRequestPagination
                currentPage={advisorCurrentPage}
                totalPages={totalPagesAsesores}
                onPageChange={setAdvisorCurrentPage}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild><Button variant="outline" onClick={onClose} disabled={isProposing}>Cancelar</Button></DialogClose>
          <Button
            onClick={handleProposeReassignment}
            disabled={isProposing || !selectedNewAdvisor || isLoadingAdvisors}
          >
            {isProposing ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Proponiendo...</>
            ) : (
              selectedNewAdvisor ? `Proponer a ${selectedAdvisorDisplayName}` : "Seleccione un Asesor"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReassignAdvisorModal;