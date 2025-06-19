// src/features/asesores/components/asesor-invitations/modals/RejectInvitationModal.tsx
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
import { IInvitacionAsesoriaTransformed, IRechazarPropuestaPayload } from "@/features/asesores/types/asesor-invitations.types";

interface RejectInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  invitacion: IInvitacionAsesoriaTransformed | null;
  onConfirmReject: (solicitudOriginalId: number, payload: IRechazarPropuestaPayload) => void;
  isRejecting: boolean;
  errorMessage?: string | null;
}

const RejectInvitationModal: React.FC<RejectInvitationModalProps> = ({
  isOpen,
  onClose,
  invitacion,
  onConfirmReject,
  isRejecting,
  errorMessage,
}) => {
  const [motivoRechazo, setMotivoRechazo] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMotivoRechazo("");
      setLocalError(null);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!invitacion) return;
    if (motivoRechazo.trim().length < 10) {
      setLocalError("El motivo del rechazo es muy corto (mínimo 10 caracteres).");
      return;
    }
    setLocalError(null);
    onConfirmReject(invitacion.solicitudOriginalId, { motivoRechazo: motivoRechazo.trim() });
  };

  if (!isOpen || !invitacion) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(openState) => { if (!openState) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rechazar Propuesta de Asesoría</DialogTitle>
          <DialogDescription>
            Va a rechazar la propuesta de asesoría para el tema:{" "}
            <span className="font-semibold">&quot;{invitacion.temaTitulo}&quot;</span>.
            Por favor, indique el motivo.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-3">
          <div>
            <Label htmlFor="motivo-rechazo-propuesta">
              Motivo del Rechazo <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="motivo-rechazo-propuesta"
              value={motivoRechazo}
              onChange={(e) => setMotivoRechazo(e.target.value)}
              placeholder="Explique brevemente por qué rechaza esta propuesta de asesoría..."
              rows={4}
              disabled={isRejecting}
            />
          </div>
          {localError && <p className="text-sm text-red-500">{localError}</p>}
          {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={onClose} disabled={isRejecting}>
              Cancelar
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={isRejecting || motivoRechazo.trim().length < 10}
          >
            {isRejecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Rechazando...
              </>
            ) : (
              "Confirmar Rechazo"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectInvitationModal;
