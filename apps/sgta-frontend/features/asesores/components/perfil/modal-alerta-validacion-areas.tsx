// components/AlertaValidacionDialog.tsx

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAcknowledge?: () => void; // opcional, por si quieres hacer algo más
}

export default function AlertaValidacionDialog({
  open,
  onOpenChange,
  onAcknowledge,
}: Props) {
  const handleClose = () => {
    onAcknowledge?.();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Información incompleta</AlertDialogTitle>
          <AlertDialogDescription>
            Debe seleccionar al menos un área temática antes de guardar el
            perfil.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleClose}>Entendido</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
