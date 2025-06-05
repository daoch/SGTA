// src/features/asesores/components/cessation-request/modals/ApproveCessationModal.tsx
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
import { Loader2 } from "lucide-react";
import { useApproveTerminationRequest } from "@/features/asesores/queries/cessation-request";
import { ICessationRequestDataTransformed } from "@/features/asesores/types/cessation-request";
import { toast } from "react-toastify";

interface ApiError {
  response?: { data?: { message?: string } };
  message?: string;
}

interface ApproveCessationModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: ICessationRequestDataTransformed | null;
  onApprovalSuccess: (approvedRequestData: ICessationRequestDataTransformed) => void;
}

const ApproveCessationModal: React.FC<ApproveCessationModalProps> = ({
  isOpen,
  onClose,
  request,
  onApprovalSuccess,
}) => {
  const [comentario, setComentario] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutate: approveMutate, isPending: isApproving } = useApproveTerminationRequest();

  useEffect(() => {
    if (isOpen && request) {
      setComentario("");
      setErrorMessage(null);
    }
  }, [isOpen, request]);

  const handleSubmit = () => {
    if (!request) return;
    if (comentario.trim().length < 5) {
      setErrorMessage("El comentario de aprobación es muy corto (mínimo 5 caracteres).");
      return;
    }
    setErrorMessage(null);

    approveMutate(
      { requestId: request.id, comentarioAprobacion: comentario.trim() },
      {
        onSuccess: () => {
          toast.success("Solicitud aprobada con éxito.");
          onClose();
          onApprovalSuccess(request);
        },
        onError: (err: ApiError) => {
          const apiError =
            typeof err.response?.data?.message === "string"
              ? err.response!.data!.message!
              : err.message || "Error al aprobar la solicitud.";
          setErrorMessage(apiError);
        },
      }
    );
  };

  if (!isOpen || !request) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(openState) => { if (!openState) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Aprobar Solicitud de Cese</DialogTitle>
          <DialogDescription>
            Va a aprobar la solicitud de cese para el tema&nbsp;
            <span className="font-semibold">&quot;{request.tema?.name || request.students[0]?.topic?.name}&quot;</span>.
            Asesor: {request.assessor?.name} {request.assessor?.lastName}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <p className="text-sm font-medium">Motivo del Asesor:</p>
            <p className="text-sm text-muted-foreground p-2 border rounded-md bg-slate-50">
              {request.reason}
            </p>
          </div>
          <div>
            <Label htmlFor="comentario-aprobacion">
              Comentario de Aprobación <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="comentario-aprobacion"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Añada un comentario o justificación para la aprobación..."
              rows={3}
              disabled={isApproving}
            />
          </div>
          {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={onClose} disabled={isApproving}>
              Cancelar
            </Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={isApproving}>
            {isApproving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Aprobando...
              </>
            ) : (
              "Confirmar Aprobación"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApproveCessationModal;
