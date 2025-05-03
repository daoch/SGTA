import { useState, useEffect, useCallback, useMemo } from 'react';
import { Asesor } from '../types';
import { asesoresMock } from '../services/data';

export function useAsesorHabilitation() {
  const [asesores, setAsesores] = useState<Asesor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    setTimeout(() => {
      setAsesores(asesoresMock);
      setIsLoading(false);
    }, 500);
  }, []);

  const filteredAsesores = useMemo(() => {
    return asesores.filter(a =>
      a.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.correo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [asesores, searchTerm]);

  const toggleHabilitacion = useCallback((id: string) => {
    setAsesores(prev =>
      prev.map(a =>
        a.id === id ? { ...a, habilitado: !a.habilitado } : a
      )
    );
  }, []);

  return {
    asesores: filteredAsesores,
    isLoading,
    searchTerm,
    setSearchTerm,
    toggleHabilitacion,
    selectedKeys,
    setSelectedKeys,
  };
}
