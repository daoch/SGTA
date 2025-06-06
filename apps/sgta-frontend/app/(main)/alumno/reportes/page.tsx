"use client";

import { ModalProgramarReporte } from "@/features/reportes/components/general/modal-programar";
import { StudentReports } from "@/features/reportes/views/student-reports";


export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#002855]">Módulo de Reportes</h1>
          <p className="text-gray-600 mt-1">Visualiza estadísticas y reportes sobre el progreso de las tesis</p>
        </div>
        <ModalProgramarReporte />
      </div>
      <StudentReports />
    </div>
  );
}
