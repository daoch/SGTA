// src/features/asesores/components/asesor-invitations/modals/AcceptInvitationModal.tsx
"use client";
import React from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { IInvitacionAsesoriaTransformed } from "../../../types/asesor-invitations.types";

interface AcceptInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  invitacion: IInvitacionAsesoriaTransformed | null; // La invitación a aceptar
  onConfirmAccept: (solicitudOriginalId: number) => void; // Función que llama a la mutación
  isAccepting: boolean; // Estado de carga de la mutación de aceptación
}

const AcceptInvitationModal: React.FC<AcceptInvitationModalProps> = ({
  isOpen,
  onClose,
  invitacion,
  onConfirmAccept,
  isAccepting,
}) => {
  if (!isOpen || !invitacion) return null;

  const handleConfirm = () => {
    onConfirmAccept(invitacion.solicitudOriginalId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(openState) => { if (!openState) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Aceptar Propuesta de Asesoría</DialogTitle>
          <DialogDescription>
            ¿Está seguro de que desea aceptar la asesoría para el tema:
            <br />
            <span className="font-semibold">"{invitacion.temaTitulo}"</span>?
            <br />
            Tesista(s): {invitacion.estudiantes.map(e => `${e.nombres} ${e.primerApellido}`).join(', ')}.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="outline" onClick={onClose} disabled={isAccepting}>Cancelar</Button>
          </DialogClose>
          <Button onClick={handleConfirm} disabled={isAccepting}>
            {isAccepting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Aceptando...</> : "Sí, Aceptar Asesoría"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AcceptInvitationModal;