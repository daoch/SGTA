// src/app/(main)/mis-propuestas/page.tsx 
'use client'

import React from 'react';
import { Spinner, Card, Button } from '@heroui/react'; // Asumiendo Spinner
import { useStudentApplications } from '@/features/solicitudes-estudiante/hooks/useStudentApplications';
import ProposalCard from '@/features/solicitudes-estudiante/components/ProposalCard';
import PostulationCard from '@/features/solicitudes-estudiante/components/PostulationCard';
import { FileText, ThumbsUp } from 'lucide-react';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

const MisPostulacionesPage = () => {

    const { 
        propuestas, 
        postulaciones, 
        isLoading, 
        error, 
        refreshApplications,
        requestWithdrawProposal, // Función para ABRIR modal de propuesta
        requestWithdrawPostulation, // Función para ABRIR modal de postulación
        cancelWithdraw, // Función para CERRAR modal
        confirmWithdraw, // Función para CONFIRMAR acción en modal
        confirmationState, // Estado del modal { isOpen, type, itemId, message }
        isSubmittingAction // Estado de carga para la acción del modal
    } = useStudentApplications();

    // Lógica para retirar (ejemplo)
    // const handleWithdrawProposal = async (id: string) => {
    //    if(confirm("¿Seguro que quieres retirar esta propuesta?")) {
    //        await withdrawProposal(id); // Llamar al hook
    //        // Mostrar toast/feedback
    //    }
    // }
    // const handleWithdrawPostulation = async (id: string) => { ... }

    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-7xl space-y-8">
            {/* Header */}
            <div>
               <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
                 Mis Postulaciones y Propuestas
               </h1>
               <p className="text-muted-foreground max-w-3xl">
                 Realiza el seguimiento del estado de las propuestas de tema que has enviado a asesores y de tus postulaciones a temas libres publicados.
               </p>
            </div>

            {/* Mensaje de Error */}
            {error && !isLoading && (
                 <Card className="p-4 border-danger-200 bg-danger-50 text-danger-700">
                     <p className="font-medium">Error:</p>
                     <p>{error}</p>
                     <Button color="danger" variant="light" size="sm" onPress={refreshApplications} className="mt-2">Reintentar</Button>
                 </Card>
             )}

            {/* Contenido Principal */}
            {isLoading ? (
                 <div className="text-center p-10"><Spinner size="lg" color="primary" label="Cargando aplicaciones..."/></div>
            ) : (
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    {/* Columna Propuestas Enviadas */}
                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b flex items-center gap-2">
                            <FileText size={20} className="text-primary"/> Propuestas Enviadas a Asesores
                        </h2>
                        {propuestas.length === 0 ? (
                           <Card className="p-6 text-center text-gray-500 border-dashed">
                               No has enviado ninguna propuesta directa a un asesor aún.
                           </Card>
                        ) : (
                            <div className="space-y-4">
                                {propuestas.map(prop => (
                                    <ProposalCard 
                                        key={prop.id} 
                                        proposal={prop} 
                                        // Pasar la función para solicitar el retiro
                                        onRequestWithdraw={requestWithdrawProposal} 
                                        isSubmitting={isSubmittingAction} // Pasar estado de carga global
                                    />
                                ))}
                            </div>
                        )}
                    </section>

                     {/* Columna Postulaciones a Temas Libres */}
                    <section>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b flex items-center gap-2">
                           <ThumbsUp size={20} className="text-secondary"/> Postulaciones a Temas Libres
                        </h2>
                         {postulaciones.length === 0 ? (
                           <Card className="p-6 text-center text-gray-500 border-dashed">
                               No has postulado a ningún tema libre publicado por asesores.
                           </Card>
                        ) : (
                             <div className="space-y-4">
                                {postulaciones.map(post => (
                                    <PostulationCard 
                                        key={post.id} 
                                        postulation={post} 
                                        // Pasar la función para solicitar el retiro
                                        onRequestWithdraw={requestWithdrawPostulation} 
                                        isSubmitting={isSubmittingAction} // Pasar estado de carga global
                                    />
                                ))}
                            </div>
                        )}
                    </section>
                 </div>
            )}

            {/* --- Modal de Confirmación Genérico --- */}
            <ConfirmationModal
                isOpen={confirmationState.isOpen}
                onClose={cancelWithdraw} // Llama a la función de cancelar del hook
                onConfirm={confirmWithdraw} // Llama a la función de confirmar del hook
                title={`¿Retirar ${confirmationState.type === 'proposal' ? 'Propuesta' : 'Postulación'}?`}
                confirmText="Sí, Retirar"
                variant="danger" 
                isConfirmLoading={isSubmittingAction} // Usa el estado de carga del hook
            >
                {/* Muestra el mensaje generado por el hook */}
                {confirmationState.message} 
            </ConfirmationModal>
        </div>
    );
}

export default MisPostulacionesPage;