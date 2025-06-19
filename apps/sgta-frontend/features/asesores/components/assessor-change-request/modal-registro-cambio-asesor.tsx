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
import { Asesor } from "../../types/perfil/entidades";

type EstadoRegistro = "idle" | "loading" | "success" | "error";

interface ModalCambioAsesorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  registroEstado: EstadoRegistro;
  setRegistroEstado: (estado: EstadoRegistro) => void;
  confirmarRegistro: () => void;
  handleVolver: () => void;
  verDetalleSolicitud: () => void;
  mensajeRegistro: string;
  asesorPorCambiar?: Asesor | null;
  nuevoAsesor?: Asesor | null;
}

const ModalCambioAsesor: FC<ModalCambioAsesorProps> = ({
  open,
  onOpenChange,
  registroEstado,
  setRegistroEstado,
  confirmarRegistro,
  handleVolver,
  verDetalleSolicitud,
  mensajeRegistro,
  asesorPorCambiar,
  nuevoAsesor,
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
          if (registroEstado === "success" || registroEstado === "error") {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          if (registroEstado === "success" || registroEstado === "error") {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {registroEstado === "idle" &&
              "Confirmar solicitud de cambio de asesor"}
            {registroEstado === "loading" && "Procesando solicitud"}
            {registroEstado === "success" && "Solicitud registrada con éxito"}
            {registroEstado === "error" && "Error al registrar solicitud"}
          </DialogTitle>
          <DialogDescription>
            {registroEstado === "idle" && (
              <>
                ¿Estás seguro que deseas solicitar el cambio de asesor de{" "}
                <span className="font-medium">{asesorPorCambiar?.nombre}</span>{" "}
                a <span className="font-medium">{nuevoAsesor?.nombre}</span>?
              </>
            )}
            {registroEstado === "loading" &&
              "Por favor espera mientras procesamos tu solicitud..."}
            {(registroEstado === "success" || registroEstado === "error") &&
              mensajeRegistro}
          </DialogDescription>
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

          {registroEstado === "success" && (
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

export default ModalCambioAsesor;
