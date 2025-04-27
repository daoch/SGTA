// src/app/(main)/personal-academico/reasignaciones/page.tsx
'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ChevronLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Card, Spinner, useDisclosure, Pagination, Button } from "@heroui/react"; 

// Importar componentes y hook
import ReassignmentFilters from '@/features/gestion-personal-academico/components/ReassignmentFilters';
import PendingReassignmentTable from '@/features/gestion-personal-academico/components/PendingReassignmentTable';
import ReassignmentModal from '@/features/gestion-personal-academico/components/ReassignmentModal';
import { ProyectoReasignacion, Asesor } from '@/features/gestion-personal-academico/types'; // Ajusta la ruta
import { useReassignments } from '@/features/gestion-personal-academico/hooks/useReassignments'; // Importar el Hook

// --- Componente de Página Principal ---
const ReasignacionesPage = () => {
  
  // Usar el Hook para obtener estado y lógica de datos
  const { 
    pendingProjects: allPendingProjects, 
    availableAdvisors,   
    isLoading, 
    error, 
    reassignProject,
    refreshData // Obtener función para recargar si es necesario
  } = useReassignments();

  // Estados locales de la página para UI (filtros, modal, paginación)
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroAsesorOriginal, setFiltroAsesorOriginal] = useState<string>('');
  const [filtroAreaTematica, setFiltroAreaTematica] = useState<string>('');
  const [proyectoActualModal, setProyectoActualModal] = useState<ProyectoReasignacion | null>(null);
  const [isSubmittingModal, setIsSubmittingModal] = useState(false); 
  const { isOpen: isReasignarModalOpen, onOpen: onReasignarModalOpen, onClose: onReasignarModalClose, onOpenChange: onReasignarModalOpenChange } = useDisclosure();
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5; // O hacerlo configurable

  // --- Opciones para Filtros (Memoizadas, usan datos del hook) ---
  const asesoresParaSelect = useMemo(() => { /* ... (igual que antes, usando allPendingProjects) ... */ 
     const uniqueAsesores = new Map<string, { id: string; nombre: string }>();
     (allPendingProjects || []).forEach(proyecto => { 
       if (!uniqueAsesores.has(proyecto.asesorOriginal.id)) {
         uniqueAsesores.set(proyecto.asesorOriginal.id, { id: proyecto.asesorOriginal.id, nombre: proyecto.asesorOriginal.nombre });
       }
     });
     const sortedAsesores = Array.from(uniqueAsesores.values()).sort((a, b) => a.nombre.localeCompare(b.nombre));
     return [{ key: '', label: 'Todos los asesores' }, ...sortedAsesores.map(a => ({ key: a.id, label: a.nombre }))];
   }, [allPendingProjects]);

  const areasParaSelect = useMemo(() => { /* ... (igual que antes, usando allPendingProjects) ... */ 
    const uniqueAreas = new Set<string>();
    (allPendingProjects || []).forEach(proyecto => {
      proyecto.areasTematicas.forEach(area => uniqueAreas.add(area));
    });
    const sortedAreas = Array.from(uniqueAreas).sort();
    return [{ key: '', label: 'Todas las áreas' }, ...sortedAreas.map(area => ({ key: area, label: area }))];
  }, [allPendingProjects]);

  // --- Filtrado de Proyectos para la Tabla (Memoizado, usa datos del hook) ---
  const proyectosFiltrados = useMemo(() => { /* ... (igual que antes, usando allPendingProjects) ... */ 
      let filtered = [...(allPendingProjects || [])]; 
      if (filtroAsesorOriginal) {
          filtered = filtered.filter(p => p.asesorOriginal.id === filtroAsesorOriginal);
      }
      if (filtroAreaTematica) {
          filtered = filtered.filter(p => p.areasTematicas.includes(filtroAreaTematica));
      }
      if (searchTerm) {
          const lowerSearchTerm = searchTerm.toLowerCase();
          filtered = filtered.filter(p =>
              p.tesista.nombre.toLowerCase().includes(lowerSearchTerm) ||
              p.tesista.codigo.toLowerCase().includes(lowerSearchTerm) ||
              p.titulo.toLowerCase().includes(lowerSearchTerm)
          );
      }
      // El ordenamiento por fecha ya debería venir del hook o servicio si es relevante
      return filtered;
  }, [allPendingProjects, filtroAsesorOriginal, filtroAreaTematica, searchTerm]);

  // Paginación
  const totalPages = Math.ceil(proyectosFiltrados.length / rowsPerPage);
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return proyectosFiltrados.slice(start, end);
  }, [proyectosFiltrados, currentPage]);

  useEffect(() => {
      setCurrentPage(1); // Resetear página al cambiar filtros
  }, [searchTerm, filtroAsesorOriginal, filtroAreaTematica]);

  // --- Manejadores de Acciones ---
  const handleOpenReassignModal = useCallback((proyecto: ProyectoReasignacion) => {
    setProyectoActualModal(proyecto);
    onReasignarModalOpen();
  }, [onReasignarModalOpen]);

  // Función que se pasa al Modal para confirmar
  const handleConfirmReassignment = useCallback(async (proyectoId: string, nuevoAsesorId: string): Promise<boolean> => {
    setIsSubmittingModal(true); 
    const success = await reassignProject(proyectoId, nuevoAsesorId); // Llama al hook
    setIsSubmittingModal(false); 
    if (!success && error) {
        // Mostrar el error del hook (ej. con un toast)
        console.error("Error en reasignación:", error);
        alert(`Error al reasignar: ${error}`); // Reemplazar con un toast
    }
    // El hook ya actualizó los datos (o falló), el modal se cerrará si success es true
    return success; // Devolver éxito/fallo
  }, [reassignProject, error]); // Dependencia de la función del hook y del error


  // --- Renderizado JSX (Usa los componentes y datos del hook) ---
  return (
     <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-7xl space-y-6">
       {/* Header y Breadcrumbs */}
       <div>
         <div className="flex items-center text-sm text-muted-foreground mb-3">
           <Link href="/personal-academico" className="hover:text-primary flex items-center">
             <ChevronLeft className="h-4 w-4 mr-1" />
             Volver a Personal Académico
           </Link>
         </div>
         <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
           Reasignación de Proyectos de Tesis
         </h1>
         <p className="text-muted-foreground max-w-4xl">
           Asigne nuevos asesores a los proyectos pendientes.
         </p>
       </div>

       {/* Panel de filtros */}
        <Card className="p-4 shadow-sm border-gray-300/80">
            <ReassignmentFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedAdvisor={filtroAsesorOriginal}
                onAdvisorChange={setFiltroAsesorOriginal}
                selectedArea={filtroAreaTematica}
                onAreaChange={setFiltroAreaTematica}
                advisorOptions={asesoresParaSelect}
                areaOptions={areasParaSelect}
            />
        </Card>

       {/* Mensaje de Error General */}
       {error && !isLoading && ( // Mostrar solo si no está cargando
           <Card className="p-4 border-danger-200 bg-danger-50 text-danger-700">
               <p className="font-medium">Error al cargar datos:</p>
               <p>{error}</p>
               <Button color="danger" variant="light" size="sm" onPress={refreshData} className="mt-2">Reintentar</Button>
           </Card>
       )}

       {/* Tabla de Proyectos Pendientes */}
       <Card className="shadow-sm border-gray-300 overflow-hidden">
         {isLoading ? (
            <div className="p-12 text-center flex flex-col items-center justify-center text-muted-foreground min-h-[300px]">
              <Spinner color="primary" size="lg" />
              <p className="mt-4">Cargando proyectos...</p>
            </div>
         ) : (
            <PendingReassignmentTable
                proyectos={paginatedItems}
                onReassignClick={handleOpenReassignModal}
                // onViewDetailsClick={handleOpenDetailsModal} 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
         )}
       </Card>

       {/* --- Modal de Reasignación --- */}
       <ReassignmentModal
          isOpen={isReasignarModalOpen}
          onClose={onReasignarModalClose} // Pasa la función de cierre de HeroUI
          proyecto={proyectoActualModal}         
          asesoresDisponibles={availableAdvisors || []} // Pasar lista de asesores desde el hook
          onConfirmReassignment={handleConfirmReassignment} // Pasar la función de confirmación
          isLoading={isSubmittingModal} // Pasar el estado de carga del modal
       />
     </div>
  );
};

export default ReasignacionesPage;