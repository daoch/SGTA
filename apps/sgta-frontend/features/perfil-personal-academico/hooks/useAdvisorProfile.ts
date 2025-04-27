// src/features/academic-staff-profile/hooks/useAdvisorProfile.ts
import { useState, useEffect, useCallback } from 'react';
import { AsesorProfileData } from '../types';
import * as advisorProfileService from '../services/advisorProfileService';

export const useAdvisorProfile = (asesorId: string | undefined | null) => {
  const [profileData, setProfileData] = useState<AsesorProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    if (!asesorId) {
      setIsLoading(false); // No hay ID, no cargar
      setProfileData(null);
      return;
    }
    
    console.log(`HOOK: Loading profile for ${asesorId}`);
    setIsLoading(true);
    setError(null);
    try {
      const data = await advisorProfileService.fetchAdvisorProfile(asesorId);
      setProfileData(data);
       if (!data) { // Manejar caso 404 devuelto como null por el servicio
           setError("Perfil de asesor no encontrado.");
       }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar el perfil.");
      setProfileData(null);
    } finally {
      setIsLoading(false);
    }
  }, [asesorId]); // Dependencia: asesorId

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    profileData,
    isLoading,
    error,
    refreshProfile: loadProfile, // Para botón de recarga
  };
};