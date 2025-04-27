// --- Crear componente ProposalFormModal.tsx ---
// src/features/academic-staff-search/components/ProposalFormModal.tsx 
import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea, Avatar, Spinner } from "@heroui/react";
import { AsesorInfo } from '../types';
import { Send } from 'lucide-react';

interface ProposalFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    asesor: AsesorInfo;
    onSubmit: (data: { titulo: string; descripcion: string; asesorId: string }) => Promise<boolean>;
}

const ProposalFormModal: React.FC<ProposalFormModalProps> = ({ isOpen, onClose, asesor, onSubmit }) => {
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!titulo.trim() || !descripcion.trim()) {
            setError("El título y la descripción son obligatorios.");
            return;
        }
        setError(null);
        setIsSubmitting(true);
        const success = await onSubmit({ titulo, descripcion, asesorId: asesor.id });
        setIsSubmitting(false);
        if (success) {
            onClose(); // Cerrar al éxito
        } else {
            setError("Error al enviar la propuesta. Intente de nuevo.");
        }
    };

    // Resetear form al cerrar
    React.useEffect(() => {
        if (!isOpen) {
            setTitulo('');
            setDescripcion('');
            setError(null);
        }
    }, [isOpen]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="2xl" backdrop="blur">
            <ModalContent>
                {(modalOnClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Enviar Propuesta de Tema</ModalHeader>
                        <ModalBody>
                            <div className="flex items-center gap-3 mb-4 border-b pb-3">
                                <Avatar src={asesor.avatar} name={asesor.nombre} size="md" />
                                <div>
                                    <p className="text-sm text-gray-500">Enviar propuesta a:</p>
                                    <p className="font-medium">{asesor.nombre}</p>
                                </div>
                            </div>
                            {error && <p className="text-sm text-danger-600 bg-danger-50 p-2 rounded border border-danger-100 mb-3">{error}</p>}
                            <div className="space-y-4">
                                <Input 
                                    label="Título de la Propuesta" 
                                    value={titulo} 
                                    onValueChange={setTitulo} // Asumiendo onValueChange
                                    variant="bordered" 
                                    isRequired
                                    maxLength={150}
                                />
                                <Textarea 
                                    label="Descripción / Resumen de la Propuesta"
                                    value={descripcion}
                                    onValueChange={setDescripcion}
                                    variant="bordered"
                                    minRows={5}
                                    isRequired
                                    description="Detalle su idea de proyecto, objetivos iniciales y alcance."
                                />
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="flat" color="default" onPress={modalOnClose} disabled={isSubmitting}>
                                Cancelar
                            </Button>
                            <Button 
                                color="primary" 
                                onPress={handleSubmit} 
                                isLoading={isSubmitting}
                                isDisabled={!titulo.trim() || !descripcion.trim()}
                                startContent={!isSubmitting ? <Send size={16}/> : null}
                            >
                                {isSubmitting ? 'Enviando...' : 'Enviar Propuesta'}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};
export default ProposalFormModal;