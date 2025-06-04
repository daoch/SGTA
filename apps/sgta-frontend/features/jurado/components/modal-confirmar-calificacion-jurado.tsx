
"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ModalConfirmarGuardadoProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const ModalConfirmarGuardado = ({
  open,
  onClose,
  onConfirm,
}: ModalConfirmarGuardadoProps) => {
  const handleConfirm = async () => {
    
      await onConfirm();
    
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Confirmar guardado de calificación
          </AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de que deseas guardar esta calificación? Una vez guardada, los cambios serán permanentes.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            Guardar calificación
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ModalConfirmarGuardado;