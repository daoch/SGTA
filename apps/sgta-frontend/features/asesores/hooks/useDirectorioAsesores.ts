// features/asesores/hooks/useDirectorioAsesores.ts
import { useState, useMemo } from 'react';
import { profesoresMock } from '../services/profesores';
import { FiltrosProfesores } from '../types';

export function useDirectorioAsesores() {
  const [search, setSearch] = useState('');
  const [rolAsignado, setRolAsignado] = useState<FiltrosProfesores['rolAsignado']>('todos');
  const [estado, setEstado] = useState<FiltrosProfesores['estado']>('todos');

  const profesoresFiltrados = useMemo(() => {
    return profesoresMock.filter((p) => {
      const coincideBusqueda =
        p.nombre.toLowerCase().includes(search.toLowerCase()) ||
        p.correo.toLowerCase().includes(search.toLowerCase()) ||
        p.codigo.includes(search);

      const coincideRol =
        rolAsignado === 'todos' || p.rolesAsignados.includes(rolAsignado);

      const coincideEstado =
        estado === 'todos' || p.estado === estado;

      return coincideBusqueda && coincideRol && coincideEstado;
    });
  }, [search, rolAsignado, estado]);

  return {
    profesores: profesoresFiltrados,
    search,
    setSearch,
    rolAsignado,
    setRolAsignado,
    estado,
    setEstado,
  };
}
