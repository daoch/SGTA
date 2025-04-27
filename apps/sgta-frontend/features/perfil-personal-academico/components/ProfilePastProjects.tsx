// src/features/academic-staff-profile/components/ProfilePastProjects.tsx
import React from 'react';
import ProfileSection from './ProfileSection';
import { History } from 'lucide-react'; // Icono
import { ProfileProjectInfo } from '../types';
import Link from 'next/link';
import { Button } from '@heroui/react';


const ProfilePastProjects = ({ projects }: { projects: ProfileProjectInfo[] }) => (
  <ProfileSection title="Proyectos Dirigidos Anteriormente" icon={History}>
     {projects.length > 0 ? (
      <ul className="space-y-3">
        {projects.map(p => (
          <li key={p.id} className="pb-3 border-b last:border-none last:pb-0">
             <p className="font-medium text-gray-800">{p.titulo}</p>
             <p className="text-xs text-gray-500">Estudiante: {p.estudianteNombre} {p.cicloFinalizacion ? `(Finalizado ${p.cicloFinalizacion})` : ''}</p>
             {/* Podría haber enlace al repositorio si existiera */}
             {p.linkToProject && (
                <Button as={Link} href={p.linkToProject} size="sm" variant="light" color="primary" className="h-auto p-0 text-xs mt-1">Ver Detalles</Button>
             )}
          </li>
        ))}
      </ul>
    ) : (
      <p className="italic text-gray-500">No hay registro de proyectos dirigidos anteriormente.</p>
    )}
  </ProfileSection>
);
export default ProfilePastProjects;