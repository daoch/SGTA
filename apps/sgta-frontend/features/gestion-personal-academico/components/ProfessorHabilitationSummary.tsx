// src/features/academic-staff-management/components/ProfessorHabilitationSummary.tsx
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Chip } from '@heroui/react';

interface ProfessorHabilitationSummaryProps {
  isLoading: boolean;
  paginatedItemsCount: number;
  filteredCount: number;
  totalCount: number;
}

const ProfessorHabilitationSummary: React.FC<ProfessorHabilitationSummaryProps> = ({
  isLoading,
  paginatedItemsCount,
  filteredCount,
  totalCount
}) => {
  return (
    <div className="mb-4">
      {/* Resumen */}
      <p className="text-sm text-muted-foreground">
        {isLoading && !totalCount 
          ? 'Cargando...' 
          : `Mostrando ${paginatedItemsCount} de ${filteredCount} profesores activos encontrados 
             ${filteredCount !== totalCount ? ` (de ${totalCount} en total)` : ''}.`
        }
      </p>
      
      {/* Alerta sobre Cese */}
      <div className="inline-flex items-center text-xs text-orange-800 bg-orange-50 px-2 py-1 rounded-md border border-orange-200 mt-2">
        <AlertCircle className="h-3 w-3 mr-1.5 flex-shrink-0" />
        <span>
          Deshabilitar asesor con tesis 
          <Chip 
            size="sm" 
            color="warning" 
            variant="flat" 
            className="mx-1 h-4 px-1"
          > 
            &gt; 0 
          </Chip> 
          inicia proceso de cese.
        </span>
      </div>
    </div>
  );
};

export default ProfessorHabilitationSummary;