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

interface ModalConfirmarReprogramacionProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (e?: React.MouseEvent) => Promise<void>;
}

const ModalConfirmarReprogramacion = ({
    open,
    onClose,
    onConfirm,
}: ModalConfirmarReprogramacionProps) => {
    const handleConfirm = async () => {
        try {
            await onConfirm();
        } finally {
            onClose();
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Confirmar solicitud de reprogramación
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        ¿Estás seguro de que deseas solicitar la reprogramación de esta exposición?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirm}>
                        Confirmar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ModalConfirmarReprogramacion;