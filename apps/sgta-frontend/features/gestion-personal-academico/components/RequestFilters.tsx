// src/features/academic-staff-management/components/RequestFilters.tsx
import React from 'react';
import { Input, Tabs, Tab, Badge } from "@heroui/react";
import { Search } from 'lucide-react';
import { FiltroEstado, SolicitudCese } from '../types'; // Importar tipos

interface RequestFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filterState: FiltroEstado;
  onFilterChange: (state: FiltroEstado) => void;
  requests: SolicitudCese[]; // Para calcular contadores
}

const RequestFilters: React.FC<RequestFiltersProps> = ({
  searchTerm,
  onSearchChange,
  filterState,
  onFilterChange,
  requests
}) => {
  const pendingCount = requests.filter(s => s.estado === 'pendiente').length;
  // Podrías calcular otros contadores si los necesitas mostrar

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      {/* Filtros (Tabs) */}
      <div className="w-full md:w-auto">
        <Tabs 
          selectedKey={filterState}
          onSelectionChange={(key) => onFilterChange(key as FiltroEstado)}
          color="primary"
          variant="underlined"
          className="overflow-visible" // Ajustar estilos si es necesario
        >
          <Tab 
            key="pendiente" 
            title={
              <div className="flex items-center gap-2">
                Pendientes
                <Badge color="warning" variant="flat" size="sm" isInvisible={pendingCount === 0}>
                  {pendingCount}
                </Badge>
              </div>
            }
          />
          <Tab key="aprobada" title="Aprobadas" />
          <Tab key="rechazada" title="Rechazadas" />
          <Tab key="todas" title="Todas" />
        </Tabs>
      </div>
      
      {/* Búsqueda */}
      <div className="relative w-full md:w-72">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <Search className="h-4 w-4 text-gray-400" />
        </span>
        <Input 
          className="pl-10 w-full"
          placeholder="Buscar por profesor o ID..." 
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          variant="bordered"
          size="sm"
          aria-label="Buscar solicitud"
        />
      </div>
    </div>
  );
};

export default RequestFilters;