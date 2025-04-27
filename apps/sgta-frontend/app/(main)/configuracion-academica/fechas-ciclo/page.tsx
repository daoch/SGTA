// src/app/(main)/configuracion-academica/fechas-ciclo/page.tsx
'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { Card, Spinner, Button } from "@heroui/react"; 

// Importar componentes y hook de la feature
import CycleSelector from '@/features/academic-cycle-settings/components/CycleSelector';
import DeadlineTable from '@/features/academic-cycle-settings/components/DeadlineTable';
import { useCycleDeadlines } from '@/features/academic-cycle-settings/hooks/useCycleDeadlines';

const GestionFechasCicloPage = () => {
  
  // Usar el hook para manejar estado y lógica
  const {
    availableCycles,
    selectedCycleId,
    setSelectedCycleId,
    selectedCycleDetails,
    deadlines,
    handleDateChange,
    saveChanges,
    isLoading: isLoadingData, // Renombrado para claridad
    isSaving,
    error,
    hasChanges,
  } = useCycleDeadlines();

  // Estado local para feedback de guardado
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSaveChanges = async () => {
      setSaveStatus('idle'); // Resetear estado
      const success = await saveChanges();
      if (success) {
          setSaveStatus('success');
          // Ocultar mensaje después de unos segundos
          setTimeout(() => setSaveStatus('idle'), 3000); 
      } else {
          setSaveStatus('error');
          // El error detallado ya está en la variable 'error' del hook
      }
  };


  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-7xl space-y-6">
      {/* Header y Breadcrumbs */}
       <div>
         <div className="flex items-center text-sm text-muted-foreground mb-3">
           {/* Ajusta el href del Link según la estructura real del Hub */}
           <Link href="/configuracion-academica" className="hover:text-primary flex items-center">
             <ChevronLeft className="h-4 w-4 mr-1" />
             Volver a Configuración Académica
           </Link>
         </div>
         <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
           Gestión de Fechas Clave por Ciclo
         </h1>
         <p className="text-muted-foreground max-w-4xl">
           Seleccione un ciclo académico activo o próximo para definir o modificar las fechas límite importantes del proceso de Proyectos de Fin de Carrera (PFC).
         </p>
       </div>

       {/* Selector de Ciclo */}
       <CycleSelector 
           cycles={availableCycles}
           selectedCycleId={selectedCycleId}
           onCycleChange={setSelectedCycleId}
           isLoading={isLoadingData && availableCycles.length === 0} // Mostrar loading solo si no hay ciclos aún
           label="Configurar fechas para el ciclo:"
       />
       
       {/* Detalles del Ciclo Seleccionado (Opcional pero útil) */}
       {selectedCycleDetails && !isLoadingData && (
           <Card className="p-3 bg-primary/5 border border-primary/10 text-sm">
               <p>
                   Configurando ciclo <span className="font-semibold">{selectedCycleDetails.nombre}</span> ({selectedCycleDetails.estado}). 
                   Fechas: {new Date(selectedCycleDetails.fechaInicio).toLocaleDateString('es-ES')} - {new Date(selectedCycleDetails.fechaFin).toLocaleDateString('es-ES')}.
               </p>
           </Card>
       )}


       {/* Mensaje de Error General */}
       {error && !isLoadingData && (
           <Card className="p-4 border-danger-200 bg-danger-50 text-danger-700">
               <p className="font-medium">Error:</p>
               <p>{error}</p>
               {/* Podrías añadir un botón de reintento que llame a refreshData del hook si lo implementas */}
           </Card>
       )}
       
       {/* Tabla de Fechas Límite */}
       <div className="mt-4"> {/* Espacio antes de la tabla */}
            <DeadlineTable
                deadlines={deadlines}
                onDateChange={handleDateChange}
                cycleDetails={selectedCycleDetails}
                isLoading={isLoadingData && deadlines.length === 0} // Loading si no hay deadlines cargados aún
            />
       </div>

        {/* Botón Guardar y Feedback */}
        {selectedCycleId && !isLoadingData && ( // Mostrar solo si hay un ciclo seleccionado y no está cargando
            <div className="flex justify-end items-center gap-4 mt-6 pt-4 border-t">
                 {/* Feedback de Guardado */}
                {saveStatus === 'success' && <span className="text-sm text-success-600">Fechas guardadas exitosamente.</span>}
                {saveStatus === 'error' && <span className="text-sm text-danger-600">Error al guardar. {error}</span>} 
                
                <Button 
                    color="primary"
                    onPress={handleSaveChanges}
                    isLoading={isSaving} // Muestra spinner si está guardando
                    isDisabled={!hasChanges || isSaving} // Deshabilitar si no hay cambios o está guardando
                >
                    {isSaving ? 'Guardando...' : 'Guardar Fechas Límite'}
                </Button>
            </div>
        )}

    </div>
  );
};

export default GestionFechasCicloPage;