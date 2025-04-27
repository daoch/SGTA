// src/app/(main)/personal-academico/perfil/[asesorId]/page.tsx
'use client'

import React from 'react';
import { useParams, useRouter } from 'next/navigation'; // Para obtener el ID de la URL
import Link from 'next/link';
import { ChevronLeft, Loader2, AlertCircle } from 'lucide-react';
import { Spinner, Card, Button } from "@heroui/react"; // Importar Spinner

// Importar hook y componentes de la feature
import { useAdvisorProfile } from '@/features/perfil-personal-academico/hooks/useAdvisorProfile';
import ProfileHeader from '@/features/perfil-personal-academico/components/ProfileHeader';
import ProfileBiography from '@/features/perfil-personal-academico/components/ProfileBiography';
import ProfileAreasExpertise from '@/features/perfil-personal-academico/components/ProfileAreasExpertise';
import ProfileCurrentProjects from '@/features/perfil-personal-academico/components/ProfileCurrentProjects';
import ProfilePastProjects from '@/features/perfil-personal-academico/components/ProfilePastProjects';
// Importar hook de autenticación para determinar el rol del visitante
// import { useAuth } from '@/contexts/AuthContext'; 

// Simular hook de auth
const useAuth = () => ({ 
    user: { roles: ['estudiante'] }, // Cambiar según el visitante para probar
    isLoading: false 
}); 

const AsesorProfilePage = () => {
  const params = useParams();
  const router = useRouter(); // Para el botón de volver si es necesario
  const asesorId = params?.asesorId as string | undefined; // Obtener ID de la URL

  const { user, isLoading: isLoadingAuth } = useAuth(); // Obtener rol del visitante
  const { profileData, isLoading, error, refreshProfile } = useAdvisorProfile(asesorId);

  // Determinar el rol del visitante para pasarlo a los componentes
  // En una app real, obtendrías esto de tu contexto de autenticación
  const viewerRole = user?.roles?.includes('coordinador') ? 'coordinador' :
                     user?.roles?.includes('asesor') ? 'asesor' :
                     user?.roles?.includes('admin') ? 'admin' :
                     user?.roles?.includes('estudiante') ? 'estudiante' :
                     'public'; // Rol por defecto o si no está logueado

  // --- Renderizado Condicional ---
  const renderContent = () => {
      if (isLoading || isLoadingAuth) {
          return (
              <div className="flex justify-center items-center min-h-[400px]">
                 <Spinner size="lg" color="primary" label="Cargando perfil del asesor..." />
              </div>
          );
      }

      if (error) {
          return (
             <Card className="p-6 border-danger-200 bg-danger-50 text-danger-700 text-center">
                 <AlertCircle className="mx-auto h-12 w-12 text-danger-400" />
                 <h3 className="mt-2 text-lg font-medium">Error al Cargar Perfil</h3>
                 <p className="mt-1 text-sm">{error}</p>
                  <Button color="danger" variant="light" onPress={refreshProfile} className="mt-4">Reintentar</Button>
             </Card>
          );
      }
      
      if (!profileData) {
           return (
             <Card className="p-6 border-warning-200 bg-warning-50 text-warning-700 text-center">
                 <AlertCircle className="mx-auto h-12 w-12 text-warning-400" />
                 <h3 className="mt-2 text-lg font-medium">Perfil No Encontrado</h3>
                 <p className="mt-1 text-sm">No se encontró el perfil para el asesor solicitado.</p>
                 <Button as={Link} href="/directorio-asesores" color="warning" variant="flat" className="mt-4">Volver al Directorio</Button>
             </Card>
          );
      }

      // Si hay datos, renderizar el perfil
      return (
          <div className="space-y-6">
              <ProfileHeader profile={profileData} viewerRole={viewerRole}/>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 {/* Columna Principal (más ancha) */}
                 <div className="lg:col-span-2 space-y-6">
                    <ProfileBiography biography={profileData.biografiaCompleta} />
                    <ProfileCurrentProjects projects={profileData.proyectosActuales} />
                    <ProfilePastProjects projects={profileData.proyectosPasados} />
                 </div>
                 {/* Columna Lateral */}
                 <div className="lg:col-span-1 space-y-6">
                     <ProfileAreasExpertise 
                         areas={profileData.areasExpertise} 
                         temas={profileData.temasInteres} 
                     />
                     {/* Aquí podrían ir otras secciones: Cursos, Publicaciones, etc. */}
                 </div>
              </div>
          </div>
      );
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-7xl">
      {/* Navegación para Volver */}
      <div className="mb-6">
        <Button 
           as={Link} 
           href="/directorio-asesores" // O la ruta anterior
           variant="light" 
           color="default" 
           className="text-muted-foreground hover:text-foreground"
           startContent={<ChevronLeft className="h-4 w-4"/>}
        >
           Volver al Directorio
        </Button>
      </div>
      
      {/* Renderizar contenido */}
      {renderContent()}
    </div>
  );
};

export default AsesorProfilePage;