// src/features/academic-staff-management/components/ProfessorHabilitationHeader.tsx
import React from 'react';
import { Info } from 'lucide-react';
import { Button } from '@heroui/react';

interface ProfessorHabilitationHeaderProps {
  onInfoButtonClick: () => void;
}

const ProfessorHabilitationHeader: React.FC<ProfessorHabilitationHeaderProps> = ({
  onInfoButtonClick
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
          Gestión de Roles (Asesor/Jurado)
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          Habilite o deshabilite la participación de profesores activos en roles académicos clave del proceso de PFC.
        </p>
      </div>
      <Button 
        isIconOnly 
        variant="light" 
        color="primary" 
        onPress={onInfoButtonClick} 
        aria-label="Información sobre habilitaciones"
      >
        <Info className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default ProfessorHabilitationHeader;