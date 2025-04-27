// src/features/student-applications/hooks/useStudentApplications.ts
import { useState, useEffect, useCallback } from 'react';
import { StudentApplicationsData } from '../types';
import * as studentApplicationService from '../services/studentApplicationService';

// Tipo para el estado del modal de confirmación
interface ConfirmationState {
  isOpen: boolean;
  type: 'proposal' | 'postulation' | null;
  itemId: string | null;
  message: string;
}

export const useStudentApplications = () => {
  const [applications, setApplications] = useState<StudentApplicationsData>({ propuestasEnviadas: [], postulacionesRealizadas: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmittingAction, setIsSubmittingAction] = useState(false); 

  // --- NUEVO: Estado para el Modal de Confirmación ---
  const [confirmation, setConfirmation] = useState<ConfirmationState>({ 
      isOpen: false, type: null, itemId: null, message: '' 
  });

  const loadApplications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await studentApplicationService.fetchMyApplications();
      // Ordenar ambas listas por fecha (más recientes primero)
      data.propuestasEnviadas.sort((a, b) => new Date(b.fechaEnvio).getTime() - new Date(a.fechaEnvio).getTime());
      data.postulacionesRealizadas.sort((a, b) => new Date(b.fechaPostulacion).getTime() - new Date(a.fechaPostulacion).getTime());
      setApplications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar aplicaciones.");
      setApplications({ propuestasEnviadas: [], postulacionesRealizadas: [] });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  // --- Funciones para ABRIR el modal ---
  const requestWithdrawProposal = useCallback((proposal: ProposalSummary) => {
      setConfirmation({
          isOpen: true,
          type: 'proposal',
          itemId: proposal.id,
          message: `¿Estás seguro de que quieres retirar tu propuesta "${proposal.tituloPropuesto}" enviada a ${proposal.asesorDestino.nombre}? Esta acción no se puede deshacer.`
      });
  }, []);

  const requestWithdrawPostulation = useCallback((postulation: PostulationSummary) => {
       setConfirmation({
          isOpen: true,
          type: 'postulation',
          itemId: postulation.id,
          message: `¿Estás seguro de que quieres retirar tu postulación al tema "${postulation.temaLibre.titulo}" (${postulation.asesorTema.nombre})? Esta acción no se puede deshacer.`
      });
  }, []);

  // --- Función para CERRAR el modal ---
  const cancelWithdraw = useCallback(() => {
      setConfirmation({ isOpen: false, type: null, itemId: null, message: '' });
  }, []);

  // --- Función para CONFIRMAR el retiro (llamada desde el modal) ---
  const confirmWithdraw = useCallback(async () => {
    if (!confirmation.type || !confirmation.itemId) return false; // Seguridad

    setIsSubmittingAction(true);
    setError(null);
    let success = false;

    try {
        if (confirmation.type === 'proposal') {
            success = await studentApplicationService.withdrawProposal(confirmation.itemId);
        } else if (confirmation.type === 'postulation') {
            success = await studentApplicationService.withdrawPostulation(confirmation.itemId);
        }

        if (success) {
            // Actualizar estado local o recargar
            // await loadApplications(); // Opcion recargar
            setApplications(prev => ({ // Opcion actualizar local
                propuestasEnviadas: confirmation.type === 'proposal' 
                    ? prev.propuestasEnviadas.filter(p => p.id !== confirmation.itemId) 
                    : prev.propuestasEnviadas,
                postulacionesRealizadas: confirmation.type === 'postulation' 
                    ? prev.postulacionesRealizadas.filter(p => p.id !== confirmation.itemId) 
                    : prev.postulacionesRealizadas,
            }));
            cancelWithdraw(); // Cerrar modal en éxito
            // Aquí podrías disparar un evento o devolver algo para mostrar un Toast en la UI
            console.log(`${confirmation.type} ${confirmation.itemId} retirado con éxito.`);
            return true;
        } else {
            throw new Error(`Fallo en el servicio al retirar ${confirmation.type}.`);
        }

    } catch (err) {
        setError(err instanceof Error ? err.message : `Error al retirar ${confirmation.type}.`);
        // Mantener el modal abierto para mostrar el error? O cerrarlo? Decisión de UX
        // cancelWithdraw(); 
        return false;
    } finally {
        setIsSubmittingAction(false);
    }
  }, [confirmation, /* loadApplications, */ cancelWithdraw]); // Dependencias


  // --- Retorno del Hook ---
  return {
    propuestas: applications.propuestasEnviadas,
    postulaciones: applications.postulacionesRealizadas,
    isLoading,
    error, // Error general de carga o de la última acción
    refreshApplications: loadApplications,
    
    // Funciones para interactuar con el modal desde la UI
    requestWithdrawProposal,
    requestWithdrawPostulation,
    cancelWithdraw,
    confirmWithdraw, // Función que ejecuta la acción

    // Estado para el modal de confirmación
    confirmationState: confirmation, // Pasar el estado completo
    isSubmittingAction, // Para el botón de confirmación en el modal
  };
};