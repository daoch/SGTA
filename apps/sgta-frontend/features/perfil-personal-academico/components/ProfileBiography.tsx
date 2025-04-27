// src/features/academic-staff-profile/components/ProfileBiography.tsx
import React from 'react';
import ProfileSection from './ProfileSection';
import { BookUser } from 'lucide-react'; // Icono ejemplo

const ProfileBiography = ({ biography }: { biography?: string }) => (
  <ProfileSection title="Biografía / Presentación" icon={BookUser}>
    {biography ? (
      <p className="whitespace-pre-wrap leading-relaxed">{biography}</p> // Mantener saltos de línea
    ) : (
      <p className="italic text-gray-500">No hay información biográfica disponible.</p>
    )}
  </ProfileSection>
);
export default ProfileBiography;