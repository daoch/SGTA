// src/app/(main)/personal-academico/gestion-roles/page.tsx 
'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ChevronLeft, Info } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, Button, useDisclosure, Spinner } from "@heroui/react"; 

// Importar componentes componentizados de la feature

// Importar hook
import { useProfessorHabilitation } from '@/features/gestion-personal-academico/hooks/useProfessorHabilitation';
import { Profesor } from '@/features/gestion-personal-academico/types';
import { CeseConfirmationModal, CeseSuccessModal, InfoHabilitationModal, ProfessorHabilitationFilters, ProfessorHabilitationHeader, ProfessorHabilitationSummary, ProfessorHabilitationTable } from '@/features/gestion-personal-academico/components';
import MassActionsToolbar from '@/features/gestion-personal-academico/components/MassActionsToolbar';

const GestionRolesPage = () => {
  const router = useRouter();

  // --- Usar el Hook ---
  const {
    profesores,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    sortConfig,
    requestSort,
    toggleHabilitation,
    initiateCessation,
    executeBulkAction,
    actionLoading,
    originalProfessorCount,
  } = useProfessorHabilitation();

  // --- Estados locales ---
  const [confirmModalProfesor, setConfirmModalProfesor] = useState<Profesor | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ROWS_PER_PAGE = 10;
  
  // Estados para selección múltiple (usando Set nativo)
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [isBulkActionLoading, setIsBulkActionLoading] = useState(false);

  // --- Disclosure hooks para modales ---
  const { 
    isOpen: isConfirmCeseModalOpen, 
    onOpen: onConfirmCeseModalOpen, 
    onClose: onConfirmCeseModalClose 
  } = useDisclosure();
  
  const { 
    isOpen: isInfoModalOpen, 
    onOpen: onInfoModalOpen, 
    onClose: onInfoModalClose 
  } = useDisclosure();
  
  const { 
    isOpen: isSuccessCeseModalOpen, 
    onOpen: onSuccessCeseModalOpen, 
    onClose: onSuccessCeseModalClose 
  } = useDisclosure();

  // --- Elementos paginados ---
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ROWS_PER_PAGE;
    const end = start + ROWS_PER_PAGE;
    return profesores.slice(start, end);
  }, [profesores, currentPage]);

  const totalPages = Math.ceil(profesores.length / ROWS_PER_PAGE);

  // Obtener los profesores seleccionados completos (objetos, no solo IDs)
  const selectedProfesoresObjects = useMemo(() => {
    return profesores.filter(p => selectedKeys.has(p.id));
  }, [profesores, selectedKeys]);

  // --- Resetear página al cambiar filtros/búsqueda ---
  useEffect(() => {
    setCurrentPage(1);
    clearSelection(); // Limpiar selección al cambiar filtros
  }, [searchTerm, filters]);

  // --- Manejadores para selección múltiple ---
  const handleSelectionChange = useCallback((keys: "all" | Set<string | number>) => {
    if (keys === "all") {
      // Select all professors
      setSelectedKeys(new Set(profesores.map(p => p.id)));
    } else {
      setSelectedKeys(new Set([...keys].map(String)));
    }
  }, [profesores]);

  const clearSelection = useCallback(() => {
    setSelectedKeys(new Set());
  }, []);

  // --- Manejador para acciones masivas ---
  const handleExecuteBulkAction = useCallback(async (
    action: 'habilitar_asesor' | 'deshabilitar_asesor' | 'habilitar_jurado' | 'deshabilitar_jurado'
  ) => {
    setIsBulkActionLoading(true);
    
    try {
      // Convertir el Set a Array para enviarlo a la API
      const selectedIds = Array.from(selectedKeys);
      
      // Llamar a la función del hook para ejecutar la acción masiva
      const success = await executeBulkAction(selectedIds, action);
      
      if (success) {
        // Mostrar mensaje de éxito
        console.log(`Acción masiva ${action} completada exitosamente para ${selectedIds.length} profesores`);
        // Limpiar selección después de una acción exitosa
        clearSelection();
      } else {
        // Mostrar mensaje de error
        console.error(`Error al ejecutar acción masiva ${action}`);
      }
    } catch (error) {
      console.error('Error inesperado al ejecutar acción masiva:', error);
    } finally {
      setIsBulkActionLoading(false);
    }
  }, [selectedKeys, executeBulkAction, clearSelection]);

  // --- Manejadores de acciones individuales ---
  const handleInitiateCessationClick = (profesor: Profesor) => {
    setConfirmModalProfesor(profesor);
    onConfirmCeseModalOpen();
  };

  const handleConfirmCese = async () => {
    if (!confirmModalProfesor) return;
    
    const success = await initiateCessation(confirmModalProfesor.id);
    onConfirmCeseModalClose();
    
    if (success) {
      onSuccessCeseModalOpen();
    } else {
      alert(`Error al iniciar cese: ${error || 'Intente de nuevo.'}`);
    }
  };

  const handleGoToReasignaciones = () => {
    onSuccessCeseModalClose();
    router.push('/personal-academico/reasignaciones');
  };

  // --- Manejador para cambio de filtros ---
  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

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
        
        <ProfessorHabilitationHeader 
          onInfoButtonClick={onInfoModalOpen}
        />
      </div>

      {/* Barra de acciones masivas (solo visible cuando hay selección) */}
      <MassActionsToolbar
        selectedCount={selectedKeys.size}
        selectedProfesores={selectedProfesoresObjects}
        onClearSelection={clearSelection}
        onExecuteMassAction={handleExecuteBulkAction}
        isLoading={isBulkActionLoading}
      />

      {/* Panel de Resumen y Filtros */}
      <Card className="p-4 shadow-sm border border-gray-200">
        <ProfessorHabilitationSummary 
          isLoading={isLoading}
          paginatedItemsCount={paginatedItems.length}
          filteredCount={profesores.length}
          totalCount={originalProfessorCount}
        />
        
        <ProfessorHabilitationFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </Card>
      
      {/* Mensaje de Error General */}
      {error && !isLoading && (
        <Card className="p-4 border-danger-200 bg-danger-50 text-danger-700">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </Card>
      )}

      {/* Tabla de Profesores */}
      <Card className="shadow-sm overflow-hidden relative">
        {isBulkActionLoading && (
          <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center gap-3">
              <Spinner size="md" color="primary" />
              <span className="text-gray-700 font-medium">Procesando acción masiva...</span>
            </div>
          </div>
        )}
        
        <ProfessorHabilitationTable
          profesores={paginatedItems}
          isLoading={isLoading && profesores.length === 0}
          actionLoading={actionLoading}
          sortConfig={sortConfig}
          onSortChange={requestSort}
          onToggleHabilitation={toggleHabilitation}
          onInitiateCessation={handleInitiateCessationClick}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          selectedKeys={selectedKeys}
          onSelectionChange={handleSelectionChange}
        />
      </Card>

      {/* Modales */}
      <CeseConfirmationModal
        isOpen={isConfirmCeseModalOpen}
        onClose={onConfirmCeseModalClose}
        onConfirm={handleConfirmCese}
        profesor={confirmModalProfesor}
        isLoading={actionLoading[`${confirmModalProfesor?.id}-cese`]}
      />
      
      <CeseSuccessModal
        isOpen={isSuccessCeseModalOpen}
        onClose={onSuccessCeseModalClose}
        onGoToReasignaciones={handleGoToReasignaciones}
        profesor={confirmModalProfesor}
      />
      
      <InfoHabilitationModal
        isOpen={isInfoModalOpen}
        onClose={onInfoModalClose}
      />
    </div>
  );
};

export default GestionRolesPage;