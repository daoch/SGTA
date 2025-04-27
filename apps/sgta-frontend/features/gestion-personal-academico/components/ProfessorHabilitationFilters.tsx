// src/features/academic-staff-management/components/ProfessorHabilitationFilters.tsx
import React from 'react';
import { Input, Select, SelectItem } from "@heroui/react";
import { Search, Filter } from 'lucide-react';

interface ProfessorHabilitationFiltersProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
    filters: { asesor: string; jurado: string };
    onFilterChange: (filterName: 'asesor' | 'jurado', value: string) => void;
}

const ProfessorHabilitationFilters: React.FC<ProfessorHabilitationFiltersProps> = ({
    searchTerm, onSearchChange, filters, onFilterChange
}) => {
    return (
        <div className="flex flex-col sm:flex-row gap-3 items-center">
            {/* Búsqueda */}
            <div className="relative flex-grow w-full sm:max-w-sm">
                <Input
                    isClearable className="w-full" placeholder="Buscar por nombre, email, código..."
                    startContent={<Search className="h-4 w-4 text-gray-400 pointer-events-none" />}
                    value={searchTerm} onClear={() => onSearchChange('')} onChange={(e) => onSearchChange(e.target.value)}
                    variant="bordered" size="sm"
                />
            </div>
            {/* Filtros */}
            <div className="flex flex-wrap gap-2 justify-start w-full sm:w-auto">
               <Select aria-label="Filtrar por rol de asesor" size="sm" variant="bordered" className="w-full sm:w-[180px]" selectedKeys={new Set([filters.asesor])} onChange={(e) => onFilterChange('asesor', e.target.value)}>
                  <SelectItem key="todos">Asesor: Todos</SelectItem>
                  <SelectItem key="si">Asesor: Habilitados</SelectItem>
                  <SelectItem key="no">Asesor: No Habilitados</SelectItem>
                </Select>
                <Select aria-label="Filtrar por rol de jurado" size="sm" variant="bordered" className="w-full sm:w-[180px]" selectedKeys={new Set([filters.jurado])} onChange={(e) => onFilterChange('jurado', e.target.value)}>
                  <SelectItem key="todos">Jurado: Todos</SelectItem>
                  <SelectItem key="si">Jurado: Habilitados</SelectItem>
                  <SelectItem key="no">Jurado: No Habilitados</SelectItem>
                </Select>
            </div>
        </div>
    );
}
export default ProfessorHabilitationFilters;