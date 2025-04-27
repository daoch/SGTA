// src/app/(main)/panel-control/page.tsx // Asumiendo esta ruta
'use client'

import React from 'react';
import { Spinner } from '@heroui/react'; // Asumiendo Spinner de HeroUI

// Importar Hook y Componentes del Dashboard
import { useDashboardData } from '@/features/dashboard/hooks/useDashboardData';
import DashboardHeader from '@/features/dashboard/components/DashboardHeader';
import StatCard from '@/features/dashboard/components/StatCard'; // Asumiendo un StatCard genérico
import PendingActionsCard from '@/features/dashboard/components/PendingActionsCard';
import UpcomingDeadlinesCard from '@/features/dashboard/components/UpcomingDeadlinesCard';
import MyStudentsProgressCard from '@/features/dashboard/components/MyStudentsProgressCard';
import MyProposalsCard from '@/features/dashboard/components/MyProposalsCard';
import MyEvaluationsCard from '@/features/dashboard/components/MyEvaluationsCard';
import CoordinationStatsCard from '@/features/dashboard/components/CoordinationStatsCard';
import AreaDistributionChart from '@/features/dashboard/components/AreaDistributionChart';
import CycleProgressChart from '@/features/dashboard/components/CycleProgressChart';
import ThemeStatusChart from '@/features/dashboard/components/ThemeStatusChart'; // Nuevo para Pie chart

// Importar el hook de autenticación para obtener el rol
// import { useAuth } from '@/contexts/AuthContext'; 

// Simulación del hook de autenticación (Reemplazar con el real)
const useAuth = () => ({
    user: { 
        name: "Profesor Coordinador Ejemplo", 
        // ¡Roles que determinan qué se muestra!
        roles: ['coordinador', 'asesor', 'jurado'] 
    },
    isLoading: false, 
});


const DashboardPage = () => {
  const { dashboardData, isLoading, error, refreshDashboard } = useDashboardData();
  const { user, isLoading: isLoadingAuth } = useAuth(); // Obtener roles del usuario

  const roles = user?.roles?.map(r => r.toLowerCase()) || []; // Roles en minúscula

  // Determinar qué widgets mostrar basado en roles y datos
  const showAsesorWidgets = roles.includes('asesor') && dashboardData.asesorData;
  const showJuradoWidgets = roles.includes('jurado') && dashboardData.juradoData;
  const showCoordinadorWidgets = roles.includes('coordinador') && dashboardData.coordinadorData;

  if (isLoading || isLoadingAuth) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-150px)]"> {/* Ajustar altura */}
        <Spinner size="lg" color="primary" label="Cargando Panel de Control..." />
      </div>
    );
  }

  if (error) {
     return <div className="p-6 bg-danger-50 text-danger-700 rounded border border-danger-200">Error al cargar: {error}</div>;
  }

  return (
    <div className="space-y-6 p-1"> {/* Añadido padding pequeño para ver bordes */}
      {/* 1. Cabecera del Dashboard */}
      <DashboardHeader 
         userName={user?.name || "Usuario"} 
         currentCycle={dashboardData.globalStats?.find(s => s.label === 'Ciclo Actual')?.value || 'N/A'} 
      />

      {/* 2. Widgets Principales (Acciones y Deadlines - Comunes o filtrados por rol en backend) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2">
             {dashboardData.pendingActions && dashboardData.pendingActions.length > 0 && (
                <PendingActionsCard actions={dashboardData.pendingActions} />
             )}
         </div>
         <div className="lg:col-span-1">
             {dashboardData.upcomingDeadlines && dashboardData.upcomingDeadlines.length > 0 && (
                 <UpcomingDeadlinesCard deadlines={dashboardData.upcomingDeadlines} />
             )}
         </div>
      </div>


      {/* 3. Widgets Específicos de Rol */}
      <div className="space-y-6">
          {/* === Widgets Coordinador === */}
          {showCoordinadorWidgets && dashboardData.coordinadorData && (
              <>
                <h2 className="text-xl font-semibold text-gray-700 border-b border-gray-200 pb-2">Vista de Coordinación</h2>
                <CoordinationStatsCard stats={dashboardData.coordinadorData.coordinationStats || []} />
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dashboardData.coordinadorData.areaDistribution && <AreaDistributionChart data={dashboardData.coordinadorData.areaDistribution} />}
                    {dashboardData.coordinadorData.themeStatusDistribution && <ThemeStatusChart data={dashboardData.coordinadorData.themeStatusDistribution} />}
                    {dashboardData.coordinadorData.cycleProgress && <CycleProgressChart data={dashboardData.coordinadorData.cycleProgress} />}
                 </div>
              </>
          )}

           {/* === Widgets Asesor === */}
           {showAsesorWidgets && dashboardData.asesorData && (
               <>
                 <h2 className="text-xl font-semibold text-gray-700 border-b border-gray-200 pb-2 mt-6">Vista de Asesor</h2>
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {dashboardData.asesorData.myStudents && <MyStudentsProgressCard students={dashboardData.asesorData.myStudents} />}
                    {dashboardData.asesorData.myProposals && <MyProposalsCard proposals={dashboardData.asesorData.myProposals} />}
                 </div>
               </>
           )}

            {/* === Widgets Jurado === */}
            {showJuradoWidgets && dashboardData.juradoData && (
               <>
                 <h2 className="text-xl font-semibold text-gray-700 border-b border-gray-200 pb-2 mt-6">Vista de Jurado</h2>
                 {dashboardData.juradoData.myEvaluations && <MyEvaluationsCard evaluations={dashboardData.juradoData.myEvaluations} />}
               </>
           )}
      </div>


    </div>
  );
};

export default DashboardPage;