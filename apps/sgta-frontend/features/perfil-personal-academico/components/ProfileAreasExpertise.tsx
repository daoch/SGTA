// src/features/academic-staff-profile/components/ProfileAreasExpertise.tsx
import React from 'react';
import ProfileSection from './ProfileSection';
import { Tag } from 'lucide-react'; // Icono ejemplo
import { Chip } from '@heroui/react';
import { AreaTematica } from '../types';

const ProfileAreasExpertise = ({ areas, temas }: { areas: AreaTematica[], temas?: string[] }) => (
  <ProfileSection title="Áreas y Temas de Interés" icon={Tag}>
    <div className="space-y-3">
       <div>
          <p className="text-xs font-medium text-gray-500 mb-1">Áreas de Expertise Principales:</p>
          {areas.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                 {areas.map(area => <Chip key={area.id} size="sm" color="secondary" variant="flat">{area.nombre}</Chip>)}
              </div>
          ) : (<p className="italic text-gray-500 text-xs">No especificadas.</p>)}
       </div>
       {temas && temas.length > 0 && (
          <div>
             <p className="text-xs font-medium text-gray-500 mb-1">Temas Específicos de Interés:</p>
             <div className="flex flex-wrap gap-1.5">
                 {temas.map((tema, i) => <Chip key={i} size="sm" variant="bordered">{tema}</Chip>)}
              </div>
          </div>
       )}
    </div>
  </ProfileSection>
);
export default ProfileAreasExpertise;