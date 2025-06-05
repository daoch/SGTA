import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { IAssessorChangeRejectModalProps } from "@/features/asesores/types/assessor-change-request";
import { useRejectAssessorChangeRequest, useRequestAssessorChangeDetail } from "../../queries/assessor-change-request";

const MAX_CHARACTERS_ALLOWED = 250;

const motivoSchema = z
  .string()
  .min(1, "El motivo es requerido")
  .max(MAX_CHARACTERS_ALLOWED,`Máximo ${MAX_CHARACTERS_ALLOWED} caracteres`)
  .regex(/^[A-Za-zÑñ.,;\-_\u00bf?!¡ ]*$/, "Caracteres inválidos");

export default function RejectAssessorChangeModal({
  isOpen,
  onClose,
  idRequest,
  refetch,
}: Readonly<IAssessorChangeRejectModalProps>) {
  const [motivo, setMotivo] = useState("");
  const [clientError, setClientError] = useState<string | null>(null);
  const [validText, setValidText] = useState(true);
  const { isLoading: loadingRequestDetail, data: dataRequestDetail} = useRequestAssessorChangeDetail(idRequest);
  const rejectMutation = useRejectAssessorChangeRequest();

  const validateMutation = useMutation({
    mutationFn: async (text: string) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      if (text.length > MAX_CHARACTERS_ALLOWED) {
        throw new Error(`Máximo ${MAX_CHARACTERS_ALLOWED} caracteres`);
      }
    },
    onError: (error: Error) => {
      setClientError(error.message);
    },
    onSuccess: () => {
      setClientError(null);
    },
  });


  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const filtered = e.target.value.replace(/[^A-Za-zÑñ.,;:\-_\u00bf?!¡ ]/g, "");
    setMotivo(filtered);
    setValidText(motivoSchema.safeParse(filtered).success);
    validateMutation.mutate(filtered);
  };

  const handleSubmit = async () => {
    try {
      motivoSchema.parse(motivo);
      if (!dataRequestDetail?.id) return;
      
      rejectMutation.mutate(
        {
          requestId: dataRequestDetail.id,
          responseText: motivo.trim(),
        },
        {
          onSuccess: () => {
            setMotivo("");
            refetch();
            onClose();
          },
          onError: (error) => {
            setClientError(error instanceof Error ? error.message : "Error desconocido");
          },
        }
      );
      
      
    } catch (err) {
      if (err instanceof z.ZodError) {
        setClientError(err.issues[0].message);
      }
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setMotivo("");
      setClientError(null);
    }
  }, [isOpen]);

  const hasError = !!clientError;
  const isProcessing = rejectMutation.status === "pending";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-danger-600 text-lg font-semibold">
            Rechazar Solicitud de Cese
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Está a punto de rechazar la solicitud de cese para el alumno {" "}
            <span className="font-semibold">{`${dataRequestDetail?.student.name} ${dataRequestDetail?.student.lastName}`}</span>
          </DialogDescription>
        </DialogHeader>

        {(()=>{
          if (loadingRequestDetail)
            return (
              <div className="p-12 text-center flex flex-col items-center justify-center text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <p className="mt-4">Cargando detalle de solicitud...</p>
              </div>
          );
          if (dataRequestDetail) 
            return (
          <div className="mt-4 max-w-[380px]">
            <Textarea
              placeholder="Explique el motivo por el cual se rechaza esta solicitud..."
              value={motivo}
              onChange={handleChange}
              required
              minLength={3}
              className={`w-full min-h-[145px] break-words whitespace-pre-wrap ${hasError ? "border-red-500" : ""}`}
              style={{ resize: "none" }}
              maxLength={MAX_CHARACTERS_ALLOWED}
            />
            {hasError && (
              <p className="text-xs text-red-600 mt-1">{clientError}</p>
            )}
            {!hasError && (
              <p className="text-xs text-muted-foreground mt-1">
                Este motivo será enviado al profesor solicitante.
              </p>
            )}
          </div>
          );
         
          return (
            <div>No se encontró información sobre esta solicitud de cese</div>
          );
        })()}

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={hasError || !validText || !motivo.trim() || isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Procesando...
              </>
            ) : (
              "Confirmar Rechazo"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}