// src/features/academic-staff-search/components/AdvisorList.tsx
import React from 'react';
import { Spinner } from '@heroui/react';
import { AsesorInfo } from '../types';
import AdvisorCard from './AdvisorCard'; // Importar la tarjeta

interface AdvisorListProps {
  advisors: AsesorInfo[];
  isLoading: boolean;
  onProposeClick?: (asesorId: string) => void; // Pasar la función si aplica
}

const AdvisorList: React.FC<AdvisorListProps> = ({ advisors, isLoading, onProposeClick }) => {
  
  if (isLoading) {
    // Mostrar esqueletos o spinner grande
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 animate-pulse">
           {[...Array(6)].map((_, i) => <div key={i} className="h-72 bg-gray-200 rounded-lg"></div>)}
        </div>
    );
  }

  if (advisors.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="text-xl mb-2">😔</p>
        <p>No se encontraron asesores que coincidan con tu búsqueda.</p>
        <p className="text-sm mt-1">Intenta con otros filtros o términos.</p>
      </div>
    );
  }

  return (
    // Grid responsivo para las tarjetas
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"> 
      {advisors.map((asesor) => (
        <AdvisorCard 
          key={asesor.id} 
          asesor={asesor} 
          onProposeClick={onProposeClick} // Pasar la función
        />
      ))}
    </div>
  );
};

export default AdvisorList;