// src/features/academic-staff-management/components/AdvisorSelectionList.tsx
import React from 'react';
import { Input } from "@heroui/react";
import { Search, Users } from 'lucide-react';
import { Asesor } from '../types';
import AdvisorCandidateCard from './AdvisorCandidateCard'; // Importar la tarjeta

interface AdvisorSelectionListProps {
  asesores: Asesor[]; // Asesores ya filtrados y ordenados
  proyectoAreas: string[]; // Para pasarlo a las tarjetas
  searchAsesor: string; // Término de búsqueda actual
  onSearchChange: (term: string) => void; // Función para actualizar búsqueda
  onSelectAdvisor: (asesor: Asesor) => void; // Función al seleccionar un asesor
  isLoading?: boolean; // Opcional: Para mostrar estado de carga si la lista se carga dinámicamente
}

const AdvisorSelectionList: React.FC<AdvisorSelectionListProps> = ({
  asesores,
  proyectoAreas,
  searchAsesor,
  onSearchChange,
  onSelectAdvisor,
  isLoading = false // Valor por defecto
}) => {
  return (
    <div className="space-y-4">
      {/* Búsqueda específica para asesores */}
      <Input
        isClearable
        aria-label="Buscar nuevo asesor"
        className="w-full"
        placeholder="Buscar por nombre, email, área de expertise..."
        startContent={<Search className="h-4 w-4 text-gray-400 pointer-events-none flex-shrink-0" />}
        value={searchAsesor}
        onClear={() => onSearchChange('')}
        onChange={(e) => onSearchChange(e.target.value)}
        size="sm"
        variant="bordered"
      />

      {/* Lista de Asesores Candidatos */}
      <div className="space-y-2 max-h-[400px] lg:max-h-[45vh] overflow-y-auto pr-2 -mr-2"> {/* Scroll interno */}
        {isLoading ? (
            <div className="text-center py-10 text-gray-500">Cargando asesores...</div>
        ) : asesores.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <Users size={32} className="mx-auto mb-2 text-gray-400"/>
            {searchAsesor ? (
              <p>No se encontraron asesores habilitados que coincidan.</p>
            ) : (
              <p>No hay otros asesores habilitados disponibles.</p>
            )}
          </div>
        ) : (
          asesores.map(asesor => (
            <AdvisorCandidateCard 
              key={asesor.id} 
              asesor={asesor} 
              proyectoAreas={proyectoAreas}
              onSelect={onSelectAdvisor} 
            />
          ))
        )}
      </div>
    </div>
  );
};

export default AdvisorSelectionList;