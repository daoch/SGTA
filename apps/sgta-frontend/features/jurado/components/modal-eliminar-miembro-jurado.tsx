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
import { toast, Toaster } from "sonner";
import { desasignarMiembroJuradoTemaTodos } from "../services/jurado-service";

interface ModalEliminarMiembroJuradoProps {
  open: boolean;
  onClose: () => void;
  juradoId: string;
  onSuccess: () => void;
}

const ModalEliminarMiembroJurado = ({
  open,
  onClose,
  juradoId,
  onSuccess,
}: ModalEliminarMiembroJuradoProps) => {
  const handleConfirm = async () => {
    try {
      await desasignarMiembroJuradoTemaTodos(Number(juradoId));
      toast.success(
        "El jurado fue desasignado exitosamente de todos los temas en los que participaba.",
      );
      onSuccess();
    } catch (error) {
      toast.error("Hubo un error al desasignar al jurado");
      console.error(error);
    } finally {
      onClose();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Confirmar eliminación del miembro de jurado
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción eliminará al jurado de todos los temas en los que haya
            sido asignado como miembro. Ten en cuenta que esta operación no se
            puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ModalEliminarMiembroJurado;
