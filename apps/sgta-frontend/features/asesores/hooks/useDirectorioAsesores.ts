import { useState, useMemo } from 'react';
import { profesoresMock } from '../services/profesores';
import { FiltrosProfesores, Profesor } from '../types';

export function useDirectorioAsesores() {
  const [search, setSearch] = useState('');
  const [rolAsignado, setRolAsignado] = useState<FiltrosProfesores['rolAsignado']>('todos');
  const [profesores, setProfesores] = useState<Profesor[]>(profesoresMock);

  const updateRoles = (id: string, nuevosRoles: ('asesor' | 'jurado')[]) => {
    setProfesores(prev =>
      prev.map(p =>
        p.id === id ? { ...p, rolesAsignados: nuevosRoles } : p
      )
    );
  };

  const profesoresFiltrados = useMemo(() => {
    return profesores.filter((p) => {
      const coincideBusqueda =
        p.nombre.toLowerCase().includes(search.toLowerCase()) ||
        p.correo.toLowerCase().includes(search.toLowerCase()) ||
        p.codigo.includes(search);

      const coincideRol =
        rolAsignado === 'todos' || p.rolesAsignados.includes(rolAsignado);

      return coincideBusqueda && coincideRol;
    });
  }, [search, rolAsignado, profesores]);

  return {
    profesores: profesoresFiltrados,
    search,
    setSearch,
    rolAsignado,
    setRolAsignado,
    updateRoles,
  };
}
