import { useState, useCallback } from 'react';
import { asesoresData } from '../services/data';
import { AsesorInfo } from '../types';

export function useAsesores() {
  const [asesores, setAsesores] = useState<AsesorInfo[]>(asesoresData);

  const toggleEstado = useCallback((id: string) => {
    setAsesores(prev =>
      prev.map(a =>
        a.id === id ? { ...a, estado: a.estado === 'habilitado' ? 'inhabilitado' : 'habilitado' } : a
      )
    );
  }, []);

  return {
    asesores,
    toggleEstado,
  };
}
