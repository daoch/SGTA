"use client";

import { AdvisorReports } from "@/features/reportes/views/advisor-reports";


export default function ReportsPage() {

  return (
    <div className="py-6 px-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-[#002855]">Módulo de Reportes</h1>
          <p className="text-gray-600 mt-1">Visualiza estadísticas y reportes sobre el progreso de las tesis</p>
        </div>
        {/*<ScheduleReportsDialog defaultEmail="asesor@pucp.edu.pe" />*/}
      </div>
      <AdvisorReports />
    
    </div>
  );
}
