'use client';

import React from 'react';
import { Users, Bell, RefreshCw } from 'lucide-react';
import HubNavigationCard from './HubNavigationCard';
import { NavigationCard, AcademicStats } from '../types';

interface HubNavigationProps {
  stats: AcademicStats;
}

export const HubNavigation: React.FC<HubNavigationProps> = ({ stats }) => {
  const navigationCards: NavigationCard[] = [
    {
      id: 'roles',
      title: 'Gestión de Roles Académicos',
      description: 'Define qué profesores pueden actuar como asesores o jurados de tesis según sus calificaciones académicas.',
      icon: <Users className="h-6 w-6 text-indigo-600" />,
      href: '/personal-academico/gestion-roles',
      linkText: 'Ir a Gestión de Roles',
      iconBgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      linkColor: 'text-indigo-600',
      linkHoverColor: 'text-indigo-800'
    },
    {
      id: 'cese',
      title: 'Solicitudes de Cese',
      description: 'Revise y gestione las solicitudes de cese de asesoría presentadas por los profesores.',
      icon: <Bell className="h-6 w-6 text-blue-600" />,
      href: '/personal-academico/solicitudes-cese',
      linkText: 'Ir a Solicitudes de Cese',
      pendingCount: stats.solicitudesPendientes,
      pendingText: 'pendientes',
      alertText: '¡Requiere atención!',
      iconBgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      linkColor: 'text-blue-600',
      linkHoverColor: 'text-blue-800'
    },
    {
      id: 'reasignacion',
      title: 'Reasignación de Tesis',
      description: 'Asigne nuevos asesores para proyectos cuyos asesores originales han cesado o han sido inhabilitados.',
      icon: <RefreshCw className="h-6 w-6 text-amber-600" />,
      href: '/personal-academico/reasignaciones',
      linkText: 'Ir a Reasignaciones',
      pendingCount: stats.tesisPendientesReasignacion,
      pendingText: 'pendientes',
      alertText: '¡Requiere atención!',
      iconBgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
      linkColor: 'text-amber-600',
      linkHoverColor: 'text-amber-800'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {navigationCards.map(card => (
        <HubNavigationCard key={card.id} card={card} />
      ))}
    </div>
  );
};

export default HubNavigation;