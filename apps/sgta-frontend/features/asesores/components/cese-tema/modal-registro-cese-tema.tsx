"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import type { FC } from "react";

type EstadoRegistro =
  | "idle"
  | "loading"
  | "success"
  | "error"
  | "already_processed";

interface ModalConfirmacionRegistroProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  registroEstado: EstadoRegistro;
  setRegistroEstado: (estado: EstadoRegistro) => void;
  getModalTitle: () => string;
  getModalDescription: () => string;
  confirmarRegistro: () => void;
  handleVolver: () => void;
  verDetalleSolicitud: () => void;
}

const ModalConfirmacionRegistro: FC<ModalConfirmacionRegistroProps> = ({
  open,
  onOpenChange,
  registroEstado,
  setRegistroEstado,
  getModalTitle,
  getModalDescription,
  confirmarRegistro,
  handleVolver,
  verDetalleSolicitud,
}) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (registroEstado === "idle" || registroEstado === "loading") {
          onOpenChange(open);
        }
      }}
    >
      <DialogContent
        className="sm:max-w-md"
        onPointerDownOutside={(e) => {
          if (
            registroEstado === "success" ||
            registroEstado === "error" ||
            registroEstado === "already_processed"
          ) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          if (
            registroEstado === "success" ||
            registroEstado === "error" ||
            registroEstado === "already_processed"
          ) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>{getModalTitle()}</DialogTitle>
          <DialogDescription>{getModalDescription()}</DialogDescription>
        </DialogHeader>

        {registroEstado === "loading" && (
          <div className="flex justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        <DialogFooter className="sm:justify-center">
          {registroEstado === "idle" && (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={confirmarRegistro}>Confirmar</Button>
            </>
          )}

          {(registroEstado === "success" ||
            registroEstado === "already_processed") && (
            <>
              <Button variant="outline" onClick={handleVolver}>
                Volver a Solicitudes
              </Button>
              <Button onClick={verDetalleSolicitud}>Ver Detalle</Button>
            </>
          )}

          {registroEstado === "error" && (
            <Button
              onClick={() => {
                onOpenChange(false);
                setRegistroEstado("idle");
              }}
            >
              Cerrar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalConfirmacionRegistro;
