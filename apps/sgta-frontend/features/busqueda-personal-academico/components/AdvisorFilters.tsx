// src/features/academic-staff-search/components/AdvisorFilters.tsx
import React from 'react';
import { Input, Select, SelectItem } from "@heroui/react";
import { Search, Filter, Tag } from 'lucide-react'; // Icono Tag para áreas
import { AreaTematica, AdvisorFilters } from '../types';

interface AdvisorFiltersProps {
  filters: AdvisorFilters;
  onSearchChange: (term: string) => void;
  onAreaChange: (areaId: string | null) => void;
  areaOptions: AreaTematica[]; // Lista completa de áreas
}

const AdvisorFilters: React.FC<AdvisorFiltersProps> = ({
  filters, onSearchChange, onAreaChange, areaOptions
}) => {
    
   const handleAreaSelectionChange = (keys: Set<React.Key> | any) => {
       const selectedKey = keys instanceof Set ? (Array.from(keys)[0] as string) : null;
       // Si se selecciona la opción "Todas", enviar null
       onAreaChange(selectedKey === 'all' ? null : selectedKey); 
   };

  return (
    <div className="flex flex-col md:flex-row gap-3 items-center">
      {/* Búsqueda */}
      <Input
        isClearable
        aria-label="Buscar asesor"
        className="w-full md:flex-grow" // Ocupa espacio disponible
        placeholder="Buscar por nombre, área, tema..."
        startContent={<Search className="h-4 w-4 text-gray-400 pointer-events-none" />}
        value={filters.searchTerm}
        onClear={() => onSearchChange('')}
        onChange={(e) => onSearchChange(e.target.value)}
        variant="bordered"
        size="md"
      />
      {/* Filtro Área Temática */}
      <div className="flex items-center gap-2 w-full md:w-auto flex-shrink-0">
          <Tag className="h-4 w-4 text-gray-500" /> {/* Icono de Área */}
           <Select
              aria-label="Filtrar por área temática"
              placeholder="Filtrar por área"
              items={[{id: 'all', nombre: 'Todas las Áreas'}, ...areaOptions]} // Añadir opción "Todas"
              selectedKeys={filters.areaTematicaId ? [filters.areaTematicaId] : ['all']} // Seleccionar 'all' si es null
              onSelectionChange={handleAreaSelectionChange}
              variant="bordered"
              size="md"
              className="w-full md:w-60" // Ancho fijo o adaptable
           >
              {(area) => <SelectItem key={area.id}>{area.nombre}</SelectItem>}
           </Select>
      </div>
      {/* Otros filtros podrían ir aquí */}
    </div>
  );
};
export default AdvisorFilters;