// src/features/asesores/components/cessation-request/modals/RejectCessationModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useRejectTerminationRequest } from "@/features/asesores/queries/cessation-request";
import {
  ICessationRequestDataTransformed,
  ICessationRequestEstudianteBackend,
} from "@/features/asesores/types/cessation-request";
import { toast } from "sonner";
import {
  Loader2,
  AlertCircle,
  User as UserIcon,
  MessageSquare,
  BookOpen,
  Info, // For context section title
} from "lucide-react";
import { cn } from "@/lib/utils";
import { isAxiosError } from "axios";

interface RejectCessationModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: number | null;
  requestDetails?: ICessationRequestDataTransformed;
  refetchList: () => void;
}

const RejectCessationModal: React.FC<RejectCessationModalProps> = ({
  isOpen,
  onClose,
  requestId,
  requestDetails,
  refetchList,
}) => {
  const [rejectionReason, setRejectionReason] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const { mutate: rejectRequest, isPending: isRejecting } =
    useRejectTerminationRequest();

  useEffect(() => {
    if (isOpen) {
      setRejectionReason("");
      setFormError(null);
    }
  }, [isOpen, requestId]);

  const handleSubmit = () => {
    if (!rejectionReason.trim()) {
      setFormError("El motivo del rechazo es obligatorio.");
      return;
    }
    if (rejectionReason.trim().length < 10) {
      setFormError("El motivo debe tener al menos 10 caracteres.");
      return;
    }
    if (!requestId) {
      setFormError("ID de solicitud no válido. Por favor, cierre e intente de nuevo.");
      return;
    }
    setFormError(null);

    rejectRequest(
      { requestId, responseText: rejectionReason },
      {
        onSuccess: () => {
          toast.success("Solicitud rechazada con éxito.");
          refetchList();
          onClose();
        },
        onError: (err: unknown) => {
          let errorMessage = "Error al rechazar la solicitud.";

          // Si es un error de Axios y el backend envía { message: "..." }
          if (
            isAxiosError(err) &&
            err.response?.data &&
            typeof err.response.data.message === "string"
          ) {
            errorMessage = err.response.data.message;
          }
          // Si es un Error nativo de JS
          else if (err instanceof Error) {
            errorMessage = err.message;
          }

          toast.error(errorMessage);
          setFormError(errorMessage);
        },
      }
    );
  };

  if (!isOpen || !requestId) {
    return null;
  }

  const CHARACTER_LIMIT = 500;
  const MAX_STUDENTS_TO_LIST_IN_REJECT_MODAL = 2;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => open || onClose()}>
      <DialogContent className="sm:max-w-lg md:max-w-2xl lg:max-w-3xl p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-xl font-semibold text-red-700">
            Rechazar Solicitud de Cese #{requestId}
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-600">
            Proporcione un motivo claro para el rechazo. Esta información será visible para el asesor.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 px-6 py-5">
          {/* Left Column: Contextual Information */}
          <div className="space-y-4 md:border-r md:pr-8">
            <div className="flex items-center gap-2 mb-3">
              <Info size={18} className="text-blue-600" />
              <h3 className="text-md font-semibold text-slate-700">
                Información de la Solicitud
              </h3>
            </div>

            {requestDetails ? (
              <div className="space-y-4 text-sm">
                {/* Assessor Details */}
                {requestDetails.assessor && (
                  <div>
                    <p className="text-xs text-slate-500 font-medium mb-0.5">
                      Asesor Solicitante:
                    </p>
                    <div className="flex items-center gap-2 p-2.5 border rounded-md bg-slate-50">
                      <Avatar className="h-9 w-9">
                        {requestDetails.assessor.urlPhoto && (
                          <AvatarImage
                            src={requestDetails.assessor.urlPhoto}
                            alt={requestDetails.assessor.name ?? ""}
                          />
                        )}
                        <AvatarFallback className="bg-slate-300 text-slate-700 text-xs">
                          {requestDetails.assessor.name
                            ?.[0]
                            ?.toUpperCase()}
                          {requestDetails.assessor.lastName
                            ?.[0]
                            ?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-slate-800">
                          {requestDetails.assessor.name}{" "}
                          {requestDetails.assessor.lastName}
                        </p>
                        <p className="text-xs text-slate-500 -mt-0.5">
                          {requestDetails.assessor.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Assessor's Reason */}
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-0.5">
                    Motivo del Asesor:
                  </p>
                  <div
                    className="p-2.5 border rounded-md bg-slate-50 text-slate-600 text-xs italic line-clamp-3"
                    title={requestDetails.reason}
                  >
                    {requestDetails.reason || "No especificado"}
                  </div>
                </div>

                {/* Affected Students */}
                {requestDetails.students &&
                  requestDetails.students.length > 0 && (
                    <div>
                      <p className="text-xs text-slate-500 font-medium mb-0.5">
                        Tesista(s) Afectado(s) (
                        {requestDetails.students.length}):
                      </p>
                      <div className="space-y-1.5 max-h-[150px] overflow-y-auto simple-scrollbar pr-1 border rounded-md p-2 bg-slate-50">
                        {requestDetails.students
                          .slice(0, MAX_STUDENTS_TO_LIST_IN_REJECT_MODAL)
                          .map(
                            (
                              student: ICessationRequestEstudianteBackend
                            ) => (
                              <div
                                key={student.id}
                                className="text-xs p-1.5 bg-white border border-slate-200 rounded shadow-sm"
                              >
                                <div className="flex items-center gap-1.5">
                                  <UserIcon
                                    size={12}
                                    className="text-slate-400 flex-shrink-0"
                                  />
                                  <span className="font-medium text-slate-700">
                                    {student.name} {student.lastName}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 pl-[18px] text-slate-500 text-[0.7rem]">
                                  <BookOpen
                                    size={11}
                                    className="flex-shrink-0"
                                  />
                                  <span
                                    className="truncate"
                                    title={student.topic.name}
                                  >
                                    {student.topic.name.length > 30
                                      ? student.topic.name.substring(
                                          0,
                                          27
                                        ) + "..."
                                      : student.topic.name}
                                  </span>
                                </div>
                              </div>
                            )
                          )}
                        {requestDetails.students.length >
                          MAX_STUDENTS_TO_LIST_IN_REJECT_MODAL && (
                          <p className="text-xs text-slate-500 pt-1 pl-1">
                            ...y{" "}
                            {requestDetails.students.length -
                              MAX_STUDENTS_TO_LIST_IN_REJECT_MODAL}{" "}
                            más.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                No se pudieron cargar los detalles de la solicitud.
              </p>
            )}
          </div>

          {/* Right Column: Rejection Reason Input */}
          <div className="space-y-2 flex flex-col">
            <Label
              htmlFor="rejectionReason"
              className="text-sm font-medium text-slate-700 flex items-center"
            >
              <MessageSquare className="h-4 w-4 mr-2 text-slate-500" />
              Motivo Detallado del Rechazo{" "}
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Textarea
              id="rejectionReason"
              value={rejectionReason}
              onChange={(e) => {
                setRejectionReason(e.target.value);
                if (formError) setFormError(null);
              }}
              placeholder="Especifique claramente las razones del rechazo. Esta información es crucial para el asesor..."
              rows={8}
              maxLength={CHARACTER_LIMIT}
              className={cn(
                "w-full flex-grow",
                formError &&
                  (rejectionReason.trim().length === 0 ||
                    rejectionReason.trim().length < 10) &&
                  "border-red-500 focus-visible:ring-red-500"
              )}
              aria-describedby="reason-error"
            />
            <div className="flex justify-between items-center mt-1">
              {formError && (
                <p
                  id="reason-error"
                  className="text-xs text-red-600 flex items-center"
                >
                  <AlertCircle size={14} className="mr-1" /> {formError}
                </p>
              )}
              <p
                className={cn(
                  "text-xs text-slate-500",
                  formError ? "" : "ml-auto"
                )}
              >
                {rejectionReason.length}/{CHARACTER_LIMIT} caracteres
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-slate-50">
          <DialogClose asChild>
            <Button variant="outline" onClick={onClose} disabled={isRejecting}>
              Cancelar
            </Button>
          </DialogClose>
          <Button
            onClick={handleSubmit}
            disabled={
              isRejecting ||
              !rejectionReason.trim() ||
              rejectionReason.trim().length < 10
            }
            variant="destructive"
            className="min-w-[160px]"
          >
            {isRejecting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Confirmar Rechazo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectCessationModal;
