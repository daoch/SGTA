// src/features/academic-staff-management/hooks/useCessationRequests.ts
import { useState, useEffect, useMemo, useCallback } from 'react';
import { SolicitudCese, FiltroEstado } from '../types';
import * as cessationService from '../services/cessationService'; // Importar el servicio

export const useCessationRequests = () => {
  // --- Estado Interno del Hook ---
  const [solicitudes, setSolicitudes] = useState<SolicitudCese[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Para manejar errores de API
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState<FiltroEstado>('pendiente');
  const [selectedRequest, setSelectedRequest] = useState<SolicitudCese | null>(null); // Para modales
  const [isSubmitting, setIsSubmitting] = useState(false); // Para acciones de modal

  // --- Carga Inicial de Datos ---
  const loadRequests = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await cessationService.fetchCessationRequests();
      setSolicitudes(data);
    } catch (err) {
      console.error("Failed to fetch cessation requests:", err);
      setError("Error al cargar las solicitudes. Intente de nuevo."); // Mensaje amigable
    } finally {
      setIsLoading(false);
    }
  }, []); // Sin dependencias, se llama una vez

  useEffect(() => {
    loadRequests();
  }, [loadRequests]); // Ejecutar al montar

  // --- Filtrado y Ordenamiento Memoizado ---
  const processedRequests = useMemo(() => {
    let filtered = [...solicitudes];
    if (filterState !== 'todas') {
      filtered = filtered.filter(s => s.estado === filterState);
    }
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(s => 
        s.profesorNombre.toLowerCase().includes(lowerSearchTerm) ||
        s.profesorEmail.toLowerCase().includes(lowerSearchTerm) ||
        s.id.toLowerCase().includes(lowerSearchTerm)
      );
    }
    filtered.sort((a, b) => new Date(b.fechaSolicitud).getTime() - new Date(a.fechaSolicitud).getTime());
    return filtered;
  }, [solicitudes, filterState, searchTerm]);

  // --- Acciones (Aprobar/Rechazar) ---
  const approveRequest = useCallback(async (solicitudId: string): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);
    try {
      const success = await cessationService.approveCessationRequest(solicitudId);
      if (success) {
        // Actualizar estado local O volver a cargar la lista completa
        setSolicitudes(prev => 
          prev.map(s => 
            s.id === solicitudId 
            ? { ...s, estado: 'aprobada', fechaDecision: new Date().toISOString(), coordinadorDecision: 'Usuario Coordinador' } // Simulación local
            : s
          )
        );
        // Opcional: await loadRequests(); // Si prefieres recargar todo
        return true;
      } else {
         throw new Error("La aprobación falló en el servicio.");
      }
    } catch (err) {
      console.error(`Error approving request ${solicitudId}:`, err);
      setError("Error al aprobar la solicitud.");
      return false;
    } finally {
      setIsSubmitting(false);
      setSelectedRequest(null); // Limpiar selección después de la acción
    }
  }, [loadRequests]); // Incluir loadRequests si se usa para recargar

  const rejectRequest = useCallback(async (solicitudId: string, motivoRechazo: string): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);
    try {
       const success = await cessationService.rejectCessationRequest(solicitudId, motivoRechazo);
       if (success) {
         setSolicitudes(prev => 
           prev.map(s => 
             s.id === solicitudId
               ? { ...s, estado: 'rechazada', fechaDecision: new Date().toISOString(), motivoRechazo, coordinadorDecision: 'Usuario Coordinador' } // Simulación local
               : s
           )
         );
         // Opcional: await loadRequests();
         return true;
       } else {
           throw new Error("El rechazo falló en el servicio.");
       }
    } catch (err) {
      console.error(`Error rejecting request ${solicitudId}:`, err);
      setError("Error al rechazar la solicitud.");
       return false;
    } finally {
      setIsSubmitting(false);
      setSelectedRequest(null); // Limpiar selección
    }
  }, [loadRequests]);

   // --- Manejo de Selección para Modales ---
   const selectRequestForModal = useCallback((solicitud: SolicitudCese | null) => {
       setSelectedRequest(solicitud);
   }, []);

  // --- Devolver Estado y Acciones ---
  return {
    requests: processedRequests, // Devuelve la lista ya filtrada/ordenada
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    filterState,
    setFilterState,
    approveRequest, // Función para llamar desde el modal de aprobación
    rejectRequest,  // Función para llamar desde el modal de rechazo
    isSubmitting,
    selectedRequest, // La solicitud actualmente seleccionada para un modal
    selectRequestForModal, // Función para seleccionar una solicitud antes de abrir el modal
  };
};