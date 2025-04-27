// src/components/ui/ConfirmationModal.tsx 
// (O donde decidas poner componentes UI genéricos)
import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Spinner } from "@heroui/react";
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react'; // Para iconos según variante

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<any>; // Puede ser async
  title: string;
  children: React.ReactNode; // Mensaje principal
  confirmText?: string;
  cancelText?: string;
  variant?: 'warning' | 'danger' | 'info' | 'success'; // Para estilo
  isConfirmLoading?: boolean; // Estado de carga
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "warning",
  isConfirmLoading = false
}) => {

  const config = {
    warning: { icon: AlertCircle, color: "warning", buttonColor: "warning" as const, titleColor: "text-warning-600" },
    danger: { icon: XCircle, color: "danger", buttonColor: "danger" as const, titleColor: "text-danger-600" },
    info: { icon: Info, color: "primary", buttonColor: "primary" as const, titleColor: "text-primary-600" },
    success: { icon: CheckCircle, color: "success", buttonColor: "success" as const, titleColor: "text-success-600" },
  };
  const selectedConfig = config[variant];
  const IconComponent = selectedConfig.icon;

  return (
     <Modal isOpen={isOpen} onClose={onClose} backdrop="blur" size="lg">
      <ModalContent>
          {(modalOnClose) => ( // Función de cierre de HeroUI
            <>
              <ModalHeader className={`flex items-center gap-2 ${selectedConfig.titleColor}`}>
                 <IconComponent size={20} />
                 <span className="text-lg font-semibold">{title}</span>
              </ModalHeader>
              <ModalBody className="py-4 text-gray-600">
                 {children}
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" color="default" onPress={modalOnClose} disabled={isConfirmLoading}>
                  {cancelText}
                </Button>
                <Button 
                   color={selectedConfig.buttonColor} 
                   onPress={onConfirm}
                   isLoading={isConfirmLoading}
                   disabled={isConfirmLoading}
                >
                  {confirmText}
                </Button>
              </ModalFooter>
            </>
          )}
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationModal;