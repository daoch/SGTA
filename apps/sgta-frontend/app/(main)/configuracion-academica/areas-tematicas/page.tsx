// src/app/(main)/configuracion-academica/areas-tematicas/page.tsx
'use client'

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, Plus, Loader2, Search } from 'lucide-react';
import { Card, Spinner, Button, Input, useDisclosure } from "@heroui/react"; 

// Importar componentes y hook
import AreaTematicaTable from '@/features/configuracion-academica/components/AreaTematicaTable';
import AreaTematicaFormModal from '@/features/configuracion-academica/components/AreaTematicaFormModal';
import ConfirmationModal from '@/components/ui/ConfirmationModal'; // Reutilizar modal genérico
import { useAreasTematicas } from '@/features/configuracion-academica/hooks/useAreasTematicas';
import { AreaTematica, AreaTematicaFormValues } from '@/features/configuracion-academica/types';

const AreasTematicasPage = () => {
    
  // --- Usar el Hook ---
  const {
    areas, // Ya viene filtrada y ordenada
    isLoading,
    error,
    setError, // Para limpiar error al abrir modal, por ejemplo
    searchTerm,
    setSearchTerm,
    isSubmitting, // Estado de carga para CUD
    addArea,
    updateArea,
    deleteArea,
    refreshAreas, // Para botón de recarga
  } = useAreasTematicas();

  // --- Estados Locales (Modales) ---
  const [areaParaEditar, setAreaParaEditar] = useState<AreaTematica | null>(null);
  const [areaParaEliminar, setAreaParaEliminar] = useState<AreaTematica | null>(null);
  const { isOpen: isFormModalOpen, onOpen: onFormModalOpen, onClose: onFormModalClose, onOpenChange: onFormModalOpenChange } = useDisclosure();
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure();

  // --- Manejadores de Modales ---
  const handleOpenCreateModal = useCallback(() => {
    setAreaParaEditar(null); // Asegurar que es modo creación
    setError(null); // Limpiar errores previos
    onFormModalOpen();
  }, [onFormModalOpen, setError]);

  const handleOpenEditModal = useCallback((area: AreaTematica) => {
    setAreaParaEditar(area);
    setError(null); // Limpiar errores previos
    onFormModalOpen();
  }, [onFormModalOpen, setError]);

  const handleOpenDeleteModal = useCallback((area: AreaTematica) => {
    // Validar de nuevo por si acaso (aunque el botón debería estar deshabilitado)
     if ((area.proyectosAsociados ?? 0) > 0 || (area.asesoresAsociados ?? 0) > 0) {
         alert("Esta área no se puede eliminar porque está en uso."); // Reemplazar con toast
         return;
     }
    setAreaParaEliminar(area);
    setError(null);
    onDeleteModalOpen();
  }, [onDeleteModalOpen, setError]);

  const handleSaveArea = useCallback(async (formData: AreaTematicaFormValues): Promise<boolean> => {
    let success = false;
    if (areaParaEditar?.id) { // Modo Edición
       success = await updateArea(areaParaEditar.id, formData);
    } else { // Modo Creación
       success = await addArea(formData);
    }
    // El hook maneja el error, el modal se cierra si success es true
    return success;
  }, [areaParaEditar, addArea, updateArea]);

   const handleConfirmDelete = useCallback(async () => {
       if (!areaParaEliminar) return;
       const success = await deleteArea(areaParaEliminar.id);
       if (success) {
           onDeleteModalClose();
           setAreaParaEliminar(null);
           // Mostrar toast éxito
       } 
       // El hook maneja el error, se mostrará en la página o como toast
   }, [areaParaEliminar, deleteArea, onDeleteModalClose]);


  // --- Renderizado ---
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-7xl space-y-6">
       {/* Header y Breadcrumbs */}
       <div>
         <div className="flex items-center text-sm text-muted-foreground mb-3">
           <Link href="/configuracion-academica" className="hover:text-primary flex items-center">
             <ChevronLeft className="h-4 w-4 mr-1" />
             Volver a Configuración Académica
           </Link>
         </div>
         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
             <div>
                 <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
                 Gestión de Áreas Temáticas
                 </h1>
                 <p className="text-muted-foreground max-w-3xl">
                 Cree, edite o elimine las áreas temáticas utilizadas para clasificar proyectos y asesores.
                 </p>
             </div>
             <Button color="primary" onPress={handleOpenCreateModal} startContent={<Plus size={18}/>}>
                Nueva Área Temática
             </Button>
         </div>
       </div>

       {/* Barra de Búsqueda */}
        <Input
            isClearable
            aria-label="Buscar área temática"
            className="w-full md:max-w-sm"
            placeholder="Buscar por nombre o descripción..."
            startContent={<Search className="h-4 w-4 text-gray-400 pointer-events-none flex-shrink-0" />}
            value={searchTerm}
            onClear={() => setSearchTerm('')}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="bordered"
            size="md"
        />
       
       {/* Mensaje de Error General */}
       {error && !isLoading && !isSubmitting && ( // No mostrar si está cargando o guardando
           <Card className="p-4 border-danger-200 bg-danger-50 text-danger-700">
               <p className="font-medium">Error:</p>
               <p>{error}</p>
           </Card>
       )}

       {/* Tabla de Áreas */}
        <Card className="shadow-sm border overflow-hidden">
            <AreaTematicaTable
                areas={areas} // Pasar la lista filtrada y ordenada desde el hook
                isLoading={isLoading}
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDeleteModal}
            />
       </Card>

       {/* --- Modales --- */}
        <AreaTematicaFormModal
            isOpen={isFormModalOpen}
            onClose={onFormModalClose}
            onSave={handleSaveArea} // Pasa la función de guardado/actualización
            initialData={areaParaEditar} // Pasa el área a editar o null
            isSubmitting={isSubmitting} // Pasa el estado de carga
            error={error} // Pasar el error para mostrarlo dentro del modal
        />

         <ConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={onDeleteModalClose}
            onConfirm={handleConfirmDelete}
            title="¿Eliminar Área Temática?"
            confirmText="Sí, Eliminar"
            variant="danger"
            isConfirmLoading={isSubmitting} // Usar el estado de carga general
         >
            ¿Está seguro de que desea eliminar el área temática "{areaParaEliminar?.nombre || ''}"? 
            Esta acción no se puede deshacer.
         </ConfirmationModal>

    </div>
  );
};

export default AreasTematicasPage;