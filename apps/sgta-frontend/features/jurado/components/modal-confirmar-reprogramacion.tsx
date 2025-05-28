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
    const handleConfirm = async (e: React.MouseEvent) => {

        e.stopPropagation();

        try {
            await onConfirm();
        } finally {
            onClose();
        }
    };

    const handleClose = (e?: React.MouseEvent) => {
        if (e) {
            e.stopPropagation();
        }
        onClose();
    };

    const handleContentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (

        <div onClick={(e) => e.stopPropagation()}>
            <AlertDialog open={open} onOpenChange={onClose}>
                <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Confirmar solicitud de reprogramación
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            ¿Estás seguro de que deseas solicitar la reprogramación de esta exposición?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={(e) => {
                            e.stopPropagation();
                            handleClose();
                        }}>
                            Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirm}>
                            Confirmar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default ModalConfirmarReprogramacion;