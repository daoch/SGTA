// src/app/(main)/personal-academico/page.tsx
'use client'

import React from 'react';
import { Users, Check, GraduationCap, RefreshCw, Bell } from 'lucide-react'; // Iconos necesarios

// Importar los nuevos componentes y el hook
import AcademicStaffStats from '@/features/gestion-personal-academico/components/AcademicStaffStats';
import HubNavigationCard from '@/features/gestion-personal-academico/components/HubNavigationCard';
import { useAcademicStaffHub } from '@/features/gestion-personal-academico/hooks/useAcademicStaffHub';
import { Badge, Card, Spinner } from '@heroui/react'; // Para mostrar errores o carga
import HelpInfo from '@/features/gestion-personal-academico/components/HelpInfo';
import HubNavigation from '@/features/gestion-personal-academico/components/HubNavigation';

const PersonalAcademicoPage: React.FC = () => {
  const { hubData, isLoading, error } = useAcademicStaffHub();

  // Manejo de estados de carga y error
  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-4 rounded-lg shadow text-red-800">
          <h2 className="text-lg font-semibold">Error al cargar datos</h2>
          <p>{error}</p>
          <button 
            className="mt-4 bg-red-100 hover:bg-red-200 text-red-800 font-bold py-2 px-4 rounded"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Gestión del Personal Académico</h1>
          <p className="text-gray-500 max-w-2xl">
            Administre todas las tareas relacionadas con profesores asesores y jurados en un solo lugar.
          </p>
        </div>

        {/* Estadísticas Clave */}
        <AcademicStaffStats stats={hubData} />

        {/* Tarjetas Principales de Navegación */}
        <HubNavigation stats={hubData} />

        {/* Footer con información de ayuda */}
        <HelpInfo />
      </div>
    </div>
  );
};

export default PersonalAcademicoPage;