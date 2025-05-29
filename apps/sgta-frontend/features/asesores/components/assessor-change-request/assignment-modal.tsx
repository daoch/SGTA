"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { differenceInDays, format } from "date-fns";
import {
  BookOpen,
  CheckCircle,
  GraduationCap,
  Loader2,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import {
  IAssessorChangeRequestAssignmentModalProps,
  IAssessorChangeSearchCriteriaAssessorListProps,
} from "../../types/cambio-asesor/entidades";

import { useEffect, useState } from "react";
import {
  useApproveAssesorChangeRequest,
  useRequestAssessorChangeDetail,
} from "../../queries/assessor-change-request";
import AssessorListAssessorChangeRequest from "./list-available-assessors";
//import { useDebounce } from "../../hooks/use-debounce"

export function AssessorChangeAssignmentModal({
  open,
  onOpenChange,
  idRequest,
  refetch,
}: Readonly<IAssessorChangeRequestAssignmentModalProps>) {
  const initialSearchFilterAssessorsState: IAssessorChangeSearchCriteriaAssessorListProps =
    { fullNameEmail: "", page: 1 };
  const [searchCriteria, setSearchCriteria] =
    useState<IAssessorChangeSearchCriteriaAssessorListProps>(
      initialSearchFilterAssessorsState,
    );
  const [selectedAssessorId, setSelectedAssessorId] = useState<number | null>(
    null,
  );
  const { isLoading: loadingRequestDetail, data: dataRequestDetail } =
    useRequestAssessorChangeDetail(idRequest);
  const approveMutation = useApproveAssesorChangeRequest();
  useEffect(() => {
    setSearchCriteria((prev) => ({
      ...prev,
      page: 1,
    }));
  }, [searchCriteria.fullNameEmail]);

  const isProcessing = approveMutation.status === "pending";

  const handleSubmit = () => {
    try {
      if (!dataRequestDetail?.id) {
        console.error(
          "No se obtuvo la informacion del detalle de la solicitud",
        );
        return;
      }
      approveMutation.mutate(
        {
          requestId: dataRequestDetail.id,
          responseText: "Text placeholder",
        },
        {
          onSuccess: () => {
            toast.success("Asignación completada", {
              description: "Todos los alumnos han sido asignados correctamente",
            });
            refetch();
            onOpenChange(false);
          },
          onError: (error) => {
            const message =
              error instanceof Error ? error.message : "Error desconocido";
            toast.error("Error del servidor", {
              description: message,
            });
          },
        },
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error("Error de validación", {
          description: error.errors[0].message,
        });
      } else {
        toast.error("Error inesperado", {
          description: "Ha ocurrido un error al procesar la asignación",
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Asignación de Asesor a Alumno
          </DialogTitle>
        </DialogHeader>
        {(() => {
          if (loadingRequestDetail)
            return (
              <div className="p-12 text-center flex flex-col items-center justify-center text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <p className="mt-4">Cargando detalle de solicitud...</p>
              </div>
            );
          if (dataRequestDetail)
            return (
              <>
                <div className="w-full mb-6 space-y-4">
                  {/* Primera fila: Alumno (2/6) y Tema (4/6) */}
                  <div className="grid grid-cols-6 gap-4">
                    {/* Alumno section - 2/6 */}
                    <div className="col-span-6 md:col-span-2 border rounded-md p-3">
                      <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                        <Users size={14} />
                        <span>Alumno</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-10 w-10">
                          {dataRequestDetail.student.urlPhoto ? (
                            <img
                              src={dataRequestDetail.student.urlPhoto}
                              alt={`User-photo-${dataRequestDetail.student.id}`}
                              className="rounded-full"
                            />
                          ) : (
                            <AvatarFallback className="bg-gray-400" />
                          )}
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{`${dataRequestDetail.student.name} ${dataRequestDetail.student.lastName}`}</p>
                          <p className="text-xs text-muted-foreground">
                            {dataRequestDetail.student.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Tema section - 4/6 */}
                    <div className="col-span-6 md:col-span-4 border rounded-md p-3">
                      <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                        <BookOpen size={14} />
                        <span>Tema</span>
                      </div>
                      <p className="text-sm font-medium mb-2">
                        Algoritmos metaheurísticos para la predicción de
                        temperatura en zonas Rurales en invierno
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        Ciencias de la Computación
                      </Badge>
                    </div>
                  </div>

                  {/* Segunda fila: Fecha (2/6) y Asesor actual (4/6) */}
                  <div className="grid grid-cols-6 gap-4">
                    {/* Fecha section - 2/6 */}
                    <div className="col-span-6 md:col-span-2 border rounded-md p-3">
                      <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                        <CheckCircle size={14} />
                        <span>Fecha de Solicitud</span>
                      </div>
                      <p className="text-sm font-medium">
                        {`${format(dataRequestDetail.registerTime, "dd/MM/yyyy")} - ${format(dataRequestDetail.registerTime, "hh:mm a")}`}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{`Hace ${differenceInDays(new Date(), dataRequestDetail.registerTime)} días`}</p>
                    </div>

                    {/* Asesor section - 4/6 */}
                    <div className="col-span-6 md:col-span-4 border rounded-md p-3">
                      <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                        <GraduationCap size={14} />
                        <span>Asesor Actual</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gray-400">
                            AA
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">Dr. Juan Pérez</p>
                          <p className="text-xs text-muted-foreground">
                            juan.perez@universidad.edu
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Advisors section - full width */}
                <div className="w-full border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">
                      Asesores disponibles
                    </h2>
                  </div>
                </div>
                <div className="h-[350px]">
                  <AssessorListAssessorChangeRequest
                    selectedAssessorId={selectedAssessorId}
                    setSelectedAssessorId={setSelectedAssessorId}
                    selectedIdThematicAreas={
                      dataRequestDetail?.student?.topic?.thematicAreas.map(
                        (thematicArea) => thematicArea.id,
                      ) ?? []
                    }
                  />
                </div>
              </>
            );
        })()}

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
            }}
          >
            Cancelar
          </Button>
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" /> Procesando...
            </>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={selectedAssessorId === null}
            >
              {selectedAssessorId !== null
                ? "Guardar asignaciones"
                : "Faltan asignar un asesor"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
