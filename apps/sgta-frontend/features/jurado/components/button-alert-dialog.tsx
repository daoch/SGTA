import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface BotonAlertDialogProps {
  /** Texto o elemento React que dispara el diálogo */
  trigger: React.ReactElement;
  /** Mensaje principal que se muestra en el diálogo */
  message: string;
  /** Título opcional para el diálogo */
  title?: string;
  /** Etiqueta para el botón de confirmación */
  actionLabel?: string;
  /** Etiqueta para el botón de cancelación */
  cancelLabel?: string;
  /** Función que se ejecuta al confirmar la acción */
  onConfirm?: () => void;
  /** Función que se ejecuta al cancelar */
  onCancel?: () => void;
}

export default function ButtonAlertDialog({
  trigger,
  message,
  title = "¡Atención!",
  actionLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
}: BotonAlertDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
