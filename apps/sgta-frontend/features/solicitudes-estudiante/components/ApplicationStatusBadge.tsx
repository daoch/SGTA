// src/features/student-applications/components/ApplicationStatusBadge.tsx
import React from 'react';
import { Chip } from '@heroui/react'; // Usar Chip de HeroUI
import { ApplicationStatus } from '../types';
import { CheckCircle, XCircle, Clock, Send, Loader, // Asumiendo Loader
AlertCircle
         } from 'lucide-react'; // Iconos

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
}

const statusConfig: Record<ApplicationStatus, { text: string; color: "success" | "danger" | "warning" | "primary" | "default"; icon: React.ElementType }> = {
  enviada: { text: "Enviada", color: "default", icon: Send },
  en_revision: { text: "En Revisión", color: "warning", icon: Clock },
  aceptada: { text: "Aceptada", color: "success", icon: CheckCircle },
  rechazada: { text: "Rechazada", color: "danger", icon: XCircle },
  inscrito: { text: "Inscrito", color: "success", icon: CheckCircle }, // O un icono diferente
};

const ApplicationStatusBadge: React.FC<ApplicationStatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status] || { text: 'Desconocido', color: 'default', icon: AlertCircle  };
  const Icon = config.icon;

  return (
    <Chip 
      color={config.color} 
      variant="flat" 
      size="sm" 
      startContent={<Icon size={14} className="mr-1" />} // Añadir icono
      className="capitalize"
    >
      {config.text}
    </Chip>
  );
};

export default ApplicationStatusBadge;