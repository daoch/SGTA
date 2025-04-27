// src/app/(main)/mis-tesistas/page.tsx
'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, Spinner, Button, useDisclosure, Input } from "@heroui/react"; 
import { UserMinus, Search, Filter, AlertCircle } from 'lucide-react'; // Añadir Filter

// Importar componentes y hook
import MyTesistasTable from '@/features/supervision-estudiantes/components/MyTesistasTable';
import RequestCessationModal from '@/features/supervision-estudiantes/components/RequestCessationModal';
import { useMyTesistas } from '@/features/supervision-estudiantes/hooks/useMyTesistas';
import { TesistaInfo, CessationRequestPayload } from '@/features/supervision-estudiantes/types';
// Podrían necesitarse más filtros aquí si la tabla los soporta
// import TesistaFilters from '@/features/advisor-dashboard/components/TesistaFilters'; 

const MisTesistasPage = () => {

    // --- Usar el Hook ---
    const {
        tesistas, // Ya filtrados y ordenados por el hook
        isLoading,
        error,
        setError, // Para limpiar errores
        searchTerm,
        setSearchTerm,
        sortConfig,
        requestSort,
        requestCessation, // Función del hook para la acción
        isSubmittingCese, // Estado de carga del modal
        refreshTesistas,
    } = useMyTesistas();

    // --- Estados Locales ---
    // Selección para acciones masivas
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set()); 
    // Tesistas seleccionados para el modal (basado en selectedKeys)
    const [tesistasParaModal, setTesistasParaModal] = useState<TesistaInfo[]>([]); 
    // Control del Modal de Cese
    const { isOpen: isCeseModalOpen, onOpen: onCeseModalOpen, onClose: onCeseModalClose } = useDisclosure();

    // Limpiar selección cuando cambian los filtros/búsqueda/datos
    useEffect(() => {
        setSelectedKeys(new Set());
    }, [tesistas]); // O en searchTerm, etc. si es necesario

    // --- Manejadores ---
    const handleOpenCeseModal = useCallback(() => {
        const selectedTesistasData = tesistas.filter(t => selectedKeys.has(t.studentId));
        // Validar si alguno de los seleccionados NO puede solicitar cese (si esa lógica existe)
        const canRequestForAll = selectedTesistasData.every(t => t.puedeSolicitarCese !== false && !t.ceseSolicitado);

        if (selectedTesistasData.length === 0) {
            alert("Seleccione al menos un tesista para solicitar el cese."); // Reemplazar con notificación
            return;
        }
        if (!canRequestForAll) {
             alert("Una o más de las selecciones no permiten solicitar cese o ya tienen una solicitud enviada."); // Reemplazar
             return;
        }
        
        setTesistasParaModal(selectedTesistasData);
        setError(null); // Limpiar errores previos antes de abrir modal
        onCeseModalOpen();
    }, [selectedKeys, tesistas, onCeseModalOpen, setError]);

    const handleSubmitCese = useCallback(async (payload: CessationRequestPayload): Promise<boolean> => {
        const success = await requestCessation(payload); // Llama al hook
        if (success) {
            onCeseModalClose(); // Cerrar modal desde aquí
            setSelectedKeys(new Set()); // Limpiar selección
            alert("Solicitud de cese enviada exitosamente."); // Reemplazar con Toast
        } 
        // El hook ya setea el error si falla
        return success;
    }, [requestCessation, onCeseModalClose]);

    // --- Renderizado ---
    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-7xl space-y-6">
            {/* Header */}
            <div>
               <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
                 Mis Tesistas Asignados
               </h1>
               <p className="text-muted-foreground max-w-4xl">
                 Visualice y gestione el progreso de los estudiantes bajo su asesoría. Puede iniciar solicitudes de cese si es necesario.
               </p>
            </div>

            {/* Barra de Acciones y Búsqueda */}
            <Card className="p-4 shadow-sm border">
                <div className="flex flex-col md:flex-row justify-between items-center gap-3">
                    {/* Búsqueda */}
                     <Input
                        isClearable
                        aria-label="Buscar tesista"
                        className="w-full md:max-w-sm"
                        placeholder="Buscar por nombre, código, título..."
                        startContent={<Search className="h-4 w-4 text-gray-400 pointer-events-none" />}
                        value={searchTerm}
                        onClear={() => setSearchTerm('')}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        variant="bordered"
                        size="sm"
                    />
                    {/* Botón Acción Masiva Cese */}
                     <Button 
                        color="danger" 
                        variant="flat" // O 'bordered'
                        size="sm"
                        onPress={handleOpenCeseModal}
                        isDisabled={selectedKeys.size === 0 || isSubmittingCese} // Deshabilitar si no hay selección o se está enviando
                        startContent={<UserMinus size={16}/>}
                     >
                         Solicitar Cese ({selectedKeys.size})
                     </Button>
                </div>
                 {/* Aquí podrían ir más filtros si fueran necesarios */}
                 {/* <TesistaFilters ... /> */}
            </Card>

            {/* Mensaje de Error */}
            {error && !isLoading && !isSubmittingCese && (
                 <Card className="p-4 border-danger-200 bg-danger-50 text-danger-700">
                     <p className="font-medium">Error:</p>
                     <p>{error}</p>
                 </Card>
            )}

             {/* Tabla de Tesistas */}
            <Card className="shadow-sm border overflow-hidden">
              {isLoading && tesistas.length === 0 ? ( // Loader inicial
                  <div className="p-12 text-center flex flex-col items-center justify-center text-muted-foreground min-h-[400px]">
                    <Spinner color="primary" size="lg" label="Cargando tesistas..."/>
                  </div>
              ) : (
                  <MyTesistasTable
                    tesistas={tesistas} // Pasar lista ya filtrada/ordenada por el hook
                    selectedTesistas={selectedKeys} // Pasar estado de selección
                    onSelectionChange={setSelectedKeys} // Pasar función para actualizar selección
                    sortConfig={sortConfig}
                    isLoading={isLoading}
                    onSortChange={requestSort}
                    // Paginación (si el hook la manejara)
                    currentPage={1} // Placeholder, hook debería manejar esto
                    totalPages={1} // Placeholder
                    onPageChange={() => {}} // Placeholder
                    // onInitiateCessation={handleOpenCeseModal} // Ya no se necesita aquí
                  />
              )}
            </Card>

             {/* --- Modal de Solicitud de Cese --- */}
             <RequestCessationModal
                isOpen={isCeseModalOpen}
                onClose={onCeseModalClose}
                onSubmit={handleSubmitCese} // Llama a la función de submit de la página
                tesistasSeleccionados={tesistasParaModal} // Pasa los tesistas seleccionados
                isSubmitting={isSubmittingCese} // Pasa el estado de carga
                error={error} // Pasar el error del hook para mostrar en modal
             />

        </div>
    );
};

export default MisTesistasPage;