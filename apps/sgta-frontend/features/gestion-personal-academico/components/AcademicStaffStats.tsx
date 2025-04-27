'use client';

import React from 'react';
import { Users, Check, GraduationCap, RefreshCw } from 'lucide-react';
import { AcademicStats } from '../types';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  bgColor: string;
  iconBgColor: string;
  textColor: string;
  valueColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  value,
  bgColor,
  iconBgColor,
  textColor,
  valueColor
}) => (
  <div className={`flex items-center p-4 ${bgColor} rounded-lg shadow`}>
    <div className={`flex-shrink-0 h-12 w-12 ${iconBgColor} rounded-full flex items-center justify-center`}>
      {icon}
    </div>
    <div className="ml-4">
      <p className={`text-sm font-medium ${textColor}`}>{title}</p>
      <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
    </div>
  </div>
);

interface AcademicStaffStatsProps {
  stats: AcademicStats;
}

export const AcademicStaffStats: React.FC<AcademicStaffStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
      <StatCard
        icon={<Users className="h-6 w-6 text-blue-600" />}
        title="Total Profesores"
        value={stats.totalProfesores ?? 0}
        bgColor="bg-blue-50"
        iconBgColor="bg-blue-100"
        textColor="text-blue-800"
        valueColor="text-blue-900"
      />

      <StatCard
        icon={<Check className="h-6 w-6 text-green-600" />}
        title="Habilitados Asesor"
        value={stats.habilitadosAsesorar ?? 0}
        bgColor="bg-green-50"
        iconBgColor="bg-green-100"
        textColor="text-green-800"
        valueColor="text-green-900"
      />

      <StatCard
        icon={<GraduationCap className="h-6 w-6 text-purple-600" />}
        title="Habilitados Jurado"
        value={stats.habilitadosJurado ?? 0}
        bgColor="bg-purple-50"
        iconBgColor="bg-purple-100"
        textColor="text-purple-800"
        valueColor="text-purple-900"
      />

      <StatCard
        icon={<RefreshCw className="h-6 w-6 text-amber-600" />}
        title="Pendientes Reasignación"
        value={stats.tesisPendientesReasignacion ?? 0}
        bgColor="bg-amber-50"
        iconBgColor="bg-amber-100"
        textColor="text-amber-800"
        valueColor="text-amber-900"
      />
    </div>
  );
};

export default AcademicStaffStats;