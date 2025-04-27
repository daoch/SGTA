// src/features/academic-staff-profile/components/ProfileHeader.tsx
import React from 'react';
import { Avatar, Button, Chip } from '@heroui/react';
import { Mail, ExternalLink, Check, Clock, Download, GraduationCap } from 'lucide-react'; // Añadir Download
import { AsesorProfileData } from '../types';
import { ProfileViewerRole } from '../types'; // Importar rol

interface ProfileHeaderProps {
  profile: AsesorProfileData;
  viewerRole: ProfileViewerRole; // Para mostrar/ocultar email/carga
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, viewerRole }) => {
  const showSensitiveInfo = viewerRole === 'asesor' || viewerRole === 'coordinador' || viewerRole === 'admin';

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 shadow-sm mb-6">
      {/* Avatar */}
      <Avatar 
        src={profile.avatar} 
        name={profile.nombre} 
        size="lg" // Más grande para perfil
        className="w-24 h-24 md:w-28 md:h-28 text-xl flex-shrink-0 border-2 border-white shadow-md" 
      />
      {/* Información Principal */}
      <div className="flex-1 text-center sm:text-left">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{profile.nombre}</h1>
        {profile.rolAcademico && <p className="text-md text-blue-700 font-medium mt-0.5">{profile.rolAcademico}</p>}
        {profile.departamento && <p className="text-sm text-gray-600">{profile.departamento}</p>}
        
        {/* Email (Condicional) */}
        {showSensitiveInfo && (
            <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary mt-1">
            <Mail size={14}/> {profile.email}
            </a>
        )}

         {/* Estado Disponibilidad y Carga (Condicional) */}
         <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 flex-wrap">
             <Chip 
                 size="sm" variant="flat" 
                 color={profile.disponibleNuevos ? "success" : "warning"}
                 startContent={profile.disponibleNuevos ? <Check size={12} /> : <Clock size={12}/>}
             >
                 {profile.disponibleNuevos ? "Disponible nuevos proyectos" : "Cupo lleno actualmente"} 
             </Chip>
             {showSensitiveInfo && (
                 <Chip size="sm" variant="bordered" color="default">
                     Carga: {profile.cargaActual} tesis
                 </Chip>
             )}
        </div>

        {/* Enlaces Externos */}
        <div className="flex items-center justify-center sm:justify-start gap-3 mt-3 pt-3 border-t border-blue-100">
            {profile.googleScholarLink && <Button as="a" href={profile.googleScholarLink} target="_blank" rel="noopener noreferrer" size="sm" variant="light" color="default" startContent={<GraduationCap size={14}/>}>Scholar</Button>}
            {profile.orcidLink && <Button as="a" href={profile.orcidLink} target="_blank" rel="noopener noreferrer" size="sm" variant="light" color="default" startContent={<i className="fab fa-orcid text-green-600"></i>}>ORCID</Button>} {/* Asumiendo FontAwesome o similar para ORCID */}
            {profile.personalWebLink && <Button as="a" href={profile.personalWebLink} target="_blank" rel="noopener noreferrer" size="sm" variant="light" color="default" startContent={<ExternalLink size={14}/>}>Web</Button>}
             {/* Botón CV (Funcionalidad pendiente) */}
             <Button size="sm" variant="light" color="default" startContent={<Download size={14}/>} isDisabled>Descargar CV</Button>
        </div>
      </div>
    </div>
  );
};
export default ProfileHeader;