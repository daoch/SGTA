// src/app/(main)/directorio-asesores/page.tsx 
'use client'

import React, { useCallback, useState } from 'react';
import { Button, Card, Spinner, useDisclosure } from "@heroui/react"; 

// Importar componentes y hook de la feature
import AdvisorFilters from '@/features/busqueda-personal-academico/components/AdvisorFilters';
import AdvisorList from '@/features/busqueda-personal-academico/components/AdvisorList';
import { useAdvisorDirectory } from '@/features/busqueda-personal-academico/hooks/useAdvisorDirectory';
import { AsesorInfo } from '@/features/busqueda-personal-academico/types';
import ProposalFormModal from '@/features/busqueda-personal-academico/components/ProposalFormModal';
// Importar hook de autenticación para saber el rol del usuario actual
// import { useAuth } from '@/contexts/AuthContext'; 

// Simular hook de auth
const useAuth = () => ({ user: { roles: ['estudiante'] } }); 

const DirectorioAsesoresPage = () => {
  
  const { user } = useAuth(); // Obtener rol del usuario actual
  const isStudent = user?.roles?.includes('estudiante'); // Verificar si es estudiante

  // Hook para el modal de propuesta
  const { isOpen: isProposalModalOpen, onOpen: onProposalModalOpen, onClose: onProposalModalClose } = useDisclosure();
  const [selectedAdvisorForProposal, setSelectedAdvisorForProposal] = useState<AsesorInfo | null>(null);

  // Manejador para abrir el modal de propuesta
  const handleProposeClick = useCallback((asesor: AsesorInfo) => { // Recibir AsesorInfo completo
    if (!isStudent) return;
    setSelectedAdvisorForProposal(asesor);
    onProposalModalOpen();
  }, [isStudent, onProposalModalOpen]);

  // Función para enviar la propuesta desde el modal (simulada)
  const submitProposal = async (proposalData: { titulo: string; descripcion: string; asesorId: string }) => {
     console.log("Enviando propuesta:", proposalData);
     // Llamar al servicio de temas/propuestas
     await new Promise(resolve => setTimeout(resolve, 1000));
     alert("Propuesta enviada exitosamente (simulado)");
     return true; // Indicar éxito
  };
  
  const {
    advisors,
    areas,
    filters,
    handleSearchChange,
    handleAreaChange,
    isLoading,
    error,
    refreshAdvisors,
  } = useAdvisorDirectory();

  // Función para manejar el clic en "Enviar Propuesta" (solo si es estudiante)
  const handlePropose = (asesorId: string) => {
      if (!isStudent) return; 
      console.log(`ESTUDIANTE: Iniciar flujo de propuesta para asesor ${asesorId}`);
      // Aquí iría la lógica para abrir un modal de propuesta o navegar a una página
      // router.push(`/gestion-temas/nueva-propuesta?asesor=${asesorId}`);
      alert(`Iniciar propuesta para Asesor ID: ${asesorId}`); 
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-7xl space-y-6">
       {/* Header */}
       <div>
         <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
           Directorio de Asesores
         </h1>
         <p className="text-muted-foreground max-w-4xl">
           {isStudent 
             ? "Encuentra un profesor habilitado para asesorar tu Proyecto de Fin de Carrera (PFC) buscando por nombre, área de expertise o temas de interés." 
             : "Explora el perfil y las áreas de expertise de tus colegas habilitados como asesores."
           }
         </p>
       </div>

       {/* Filtros */}
       <Card className="p-4 shadow-sm border">
          <AdvisorFilters 
             filters={filters}
             onSearchChange={handleSearchChange}
             onAreaChange={handleAreaChange}
             areaOptions={areas} // Pasar las áreas cargadas
          />
       </Card>

       {/* Mensaje de Error */}
       {error && !isLoading && (
           <Card className="p-4 border-danger-200 bg-danger-50 text-danger-700">
               <p className="font-medium">Error al cargar asesores:</p>
               <p>{error}</p>
               <Button color="danger" variant="light" size="sm" onPress={refreshAdvisors} className="mt-2">Reintentar</Button>
           </Card>
       )}

       {/* Lista de Asesores */}
       <div>
          <AdvisorList 
             advisors={advisors} 
             isLoading={isLoading}
             // Pasar la función onProposeClick solo si es estudiante
             // Pasar la función que abre el modal, pero ahora necesita el objeto asesor
             onProposeClick={isStudent ? (asesorId) => {
                const advisor = advisors.find(a => a.id === asesorId);
                if(advisor) handleProposeClick(advisor);
            } : undefined} 
          />
       </div>

       {/* --- Modal para Enviar Propuesta (NUEVO) --- */}
        {selectedAdvisorForProposal && (
            <ProposalFormModal 
                isOpen={isProposalModalOpen}
                onClose={() => { setSelectedAdvisorForProposal(null); onProposalModalClose(); }}
                asesor={selectedAdvisorForProposal}
                onSubmit={submitProposal}
            />
        )}
       
       {/* Paginación (si fuera necesaria en el futuro, se añadiría aquí) */}
       
    </div>
  );
};

export default DirectorioAsesoresPage;