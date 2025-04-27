// src/features/academic-staff-management/components/ReassignmentFilters.tsx
import React from 'react';
import { Input, Select, SelectItem } from "@heroui/react";
import { Filter, Search } from 'lucide-react';

interface FilterOption { key: string; label: string; }

interface ReassignmentFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedAdvisor: string;
  onAdvisorChange: (advisorId: string) => void;
  selectedArea: string;
  onAreaChange: (area: string) => void;
  advisorOptions: FilterOption[];
  areaOptions: FilterOption[];
}

const ReassignmentFilters: React.FC<ReassignmentFiltersProps> = ({
  searchTerm, onSearchChange,
  selectedAdvisor, onAdvisorChange,
  selectedArea, onAreaChange,
  advisorOptions, areaOptions
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
        <div className="flex items-center flex-shrink-0">
          <Filter className="h-4 w-4 mr-1 text-gray-500" />
          <span className="text-sm font-medium text-gray-600 mr-2">Filtros:</span>
        </div>
        {/* Select Asesor Original */}
        <Select
          items={advisorOptions}
          aria-label="Filtrar por asesor original"
          placeholder="Asesor original"
          className="w-full sm:w-48"
          size="sm"
          variant="bordered"
          selectedKeys={selectedAdvisor ? [selectedAdvisor] : []}
          onSelectionChange={(keys) => onAdvisorChange(keys instanceof Set ? (Array.from(keys)[0] as string ?? '') : '')}
        >
          {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
        </Select>
        {/* Select Área Temática */}
        <Select
          items={areaOptions}
          aria-label="Filtrar por área temática"
          placeholder="Área temática"
          className="w-full sm:w-48"
          size="sm"
          variant="bordered"
          selectedKeys={selectedArea ? [selectedArea] : []}
          onSelectionChange={(keys) => onAreaChange(keys instanceof Set ? (Array.from(keys)[0] as string ?? '') : '')}
        >
          {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
        </Select>
      </div>
      {/* Búsqueda */}
      <div className="relative w-full md:max-w-xs mt-2 md:mt-0">
        <Input
          isClearable
          aria-label="Buscar proyecto"
          className="w-full"
          placeholder="Buscar por título, estudiante, código..."
          startContent={<Search className="h-4 w-4 text-gray-400 pointer-events-none flex-shrink-0" />}
          value={searchTerm}
          onClear={() => onSearchChange('')}
          onChange={(e) => onSearchChange(e.target.value)}
          size="sm"
          variant="bordered"
        />
      </div>
    </div>
  );
};
export default ReassignmentFilters;