// components/EliminarAreaDialog.tsx

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
import type { AreaTematica, TemaInteres } from "../../types/perfil/entidades";

interface Props {
  open: boolean;
  areaToDelete: AreaTematica | null;
  temasToDelete: TemaInteres[];
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function EliminarAreaDialog({
  open,
  areaToDelete,
  temasToDelete,
  onOpenChange,
  onCancel,
  onConfirm,
}: Readonly<Props>) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Confirmar eliminación?</AlertDialogTitle>
          <AlertDialogDescription>
            Al eliminar el área temática <strong>{areaToDelete?.nombre}</strong>
            , también se eliminarán los siguientes temas de interés:
          </AlertDialogDescription>
          <ul className="mt-2 list-disc pl-5">
            {temasToDelete.map((tema) => (
              <li key={tema.idTema} className="text-sm">
                {tema.nombre}
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted-foreground mt-2">
            Esta acción no se puede deshacer.
          </p>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
