// src/features/advisor-dashboard/components/TesistaStatusChip.tsx
import React from 'react';
import { Chip } from "@heroui/react";
import { ProjectStatus } from '../types';
import { AlertCircle, CheckCircle, Clock, Loader, Play, Pause, Award, Eye } from 'lucide-react'; // Más iconos

interface TesistaStatusChipProps {
  status: ProjectStatus;
}

const statusConfig: Record<ProjectStatus, { text: string; color: "default" | "primary" | "secondary" | "success" | "warning" | "danger"; icon: React.ElementType }> = {
  planificacion: { text: "Planificación", color: "default", icon: Clock },
  desarrollo_t1: { text: "Desarrollo T1", color: "primary", icon: Play },
  revision_t1: { text: "Revisión T1", color: "warning", icon: Eye },
  esperando_t2: { text: "Esperando T2", color: "secondary", icon: Pause },
  desarrollo_t2: { text: "Desarrollo T2", color: "primary", icon: Play },
  revision_t2: { text: "Revisión T2", color: "warning", icon: Eye },
  listo_defensa: { text: "Listo Defensa", color: "success", icon: Award },
  aprobado: { text: "Aprobado", color: "success", icon: CheckCircle },
  pausa: { text: "En Pausa", color: "default", icon: Pause },
};

const TesistaStatusChip: React.FC<TesistaStatusChipProps> = ({ status }) => {
  const config = statusConfig[status] || { text: "Desconocido", color: "default", icon: AlertCircle };
  const Icon = config.icon;

  return (
    <Chip
      color={config.color}
      variant="flat"
      size="sm"
      startContent={<Icon size={14} />}
      className="capitalize"
    >
      {config.text}
    </Chip>
  );
};

export default TesistaStatusChip;