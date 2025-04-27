// src/features/academic-staff-profile/components/ProfileCurrentProjects.tsx
import React from 'react';
import ProfileSection from './ProfileSection';
import { ListChecks } from 'lucide-react'; // Icono
import { ProfileProjectInfo } from '../types';
import Link from 'next/link';
import { Button } from '@heroui/react';

const ProfileCurrentProjects = ({ projects }: { projects: ProfileProjectInfo[] }) => (
  <ProfileSection title="Proyectos de Fin de Carrera en Curso" icon={ListChecks}>
    {projects.length > 0 ? (
      <ul className="space-y-3">
        {projects.map(p => (
          <li key={p.id} className="pb-3 border-b last:border-none last:pb-0">
             <p className="font-medium text-gray-800">{p.titulo}</p>
             <p className="text-xs text-gray-500">Estudiante: {p.estudianteNombre}</p>
             {p.estadoActual && <p className="text-xs text-blue-600 mt-0.5">Estado: {p.estadoActual}</p>}
             {p.linkToProject && (
                <Button as={Link} href={p.linkToProject} size="sm" variant="light" color="primary" className="h-auto p-0 text-xs mt-1">Ver Proyecto</Button>
             )}
          </li>
        ))}
      </ul>
    ) : (
      <p className="italic text-gray-500">Actualmente no asesora proyectos en curso.</p>
    )}
  </ProfileSection>
);
export default ProfileCurrentProjects;
