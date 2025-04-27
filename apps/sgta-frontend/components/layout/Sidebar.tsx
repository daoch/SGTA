'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  GraduationCap,
  FolderGit2,
  Search,
  Users,
  CheckCircle,
  Calendar,
  Hand,
  Briefcase,
  Eye,
  FileClock,
  FileUp,
  Tags,
  LineChart,
  SlidersHorizontal,
  Settings,
  UserCircle2,
  LifeBuoy,
  ChevronDown,
  Menu,
  X,
  LogOut,
  CircleUser,
  BookMarked,
  FileText
} from 'lucide-react';

// Tipos
type Role = 'coordinador' | 'asesor' | 'jurado' | 'administrador' | 'estudiante';

type NavItem = {
  path: string;
  icon: React.ElementType;
  label: string;
  section: string;
  roles: Role[];
};

type SidebarProps = {
  userRoles: Role[];
  userName: string;
  userAvatar?: string;
  onLogout: () => void;
};

// Definir TODOS los items posibles y a qué roles pertenecen
const ALL_NAV_ITEMS: NavItem[] = [
  // Comunes / Dashboard
  {
    path: '/panel-control',
    icon: LayoutDashboard,
    label: 'Panel de Control',
    section: 'Principal',
    roles: ['coordinador', 'asesor', 'jurado', 'administrador', 'estudiante']
  },

  // --- Proceso de Tesis (Estudiante) --- NUEVA SECCIÓN O AJUSTAR
  {
    // Enlace a la vista principal de SU proyecto activo
    path: '/mi-proyecto', // O una ruta dinámica como /proyectos/[miProyectoId]
    icon: BookMarked,   // Icono diferente para SU proyecto
    label: 'Mi Proyecto', 
    section: 'Mi Proyecto', // Sección dedicada para el estudiante
    roles: ['estudiante'] 
  },
   {
    path: '/mis-propuestas', // Página para ver estado de postulaciones/propuestas enviadas
    icon: FileText, // O Send
    label: 'Mis Postulaciones', 
    section: 'Mi Proyecto', 
    roles: ['estudiante'] 
  },
  
  // --- Asesoría ---
  {
    path: '/mis-tesistas',
    icon: GraduationCap,
    label: 'Mis Tesistas',
    section: 'Asesoría',
    roles: ['asesor']
  },
  {
    path: '/gestion-temas',
    icon: FolderGit2,
    label: 'Gestión de Temas',
    section: 'Asesoría',
    roles: ['asesor']
  },
  {
    path: '/explorar-propuestas',
    icon: Search,
    label: 'Explorar Propuestas',
    section: 'Asesoría',
    roles: ['asesor', 'estudiante']
  },
  {
    path: '/directorio-asesores',
    icon: Users,
    label: 'Directorio Asesores',
    section: 'Asesoría',
    roles: ['asesor', 'estudiante']
  },
  
  // --- Jurado ---
  {
    path: '/mis-evaluaciones',
    icon: CheckCircle,
    label: 'Mis Evaluaciones',
    section: 'Jurado',
    roles: ['jurado']
  },
  {
    path: '/gestionar-disponibilidad',
    icon: Calendar,
    label: 'Gestionar Disponibilidad',
    section: 'Jurado',
    roles: ['jurado']
  },
  {
    path: '/voluntariado-jurado',
    icon: Hand,
    label: 'Voluntariado Jurado',
    section: 'Jurado',
    roles: ['jurado']
  },
  
  // --- Coordinación ---
  {
    path: '/personal-academico',
    icon: Briefcase,
    label: 'Personal Académico',
    section: 'Coordinación',
    roles: ['coordinador']
  },
  {
    path: '/jurado-exposiciones',
    icon: GraduationCap,
    label: 'Jurado y Exposiciones',
    section: 'Coordinación',
    roles: ['coordinador']
  },
  {
    path: '/seguimiento-reuniones',
    icon: Eye,
    label: 'Seguimiento Reuniones',
    section: 'Coordinación',
    roles: ['coordinador']
  },
  {
    path: '/gestion-ciclos',
    icon: FileClock,
    label: 'Gestión de Ciclos',
    section: 'Coordinación',
    roles: ['coordinador']
  },
  {
    path: '/importar-matricula',
    icon: FileUp,
    label: 'Importar Matrícula',
    section: 'Coordinación',
    roles: ['coordinador']
  },
  {
    path: '/reportes',
    icon: LineChart,
    label: 'Reportes',
    section: 'Coordinación',
    roles: ['coordinador']
  },
  {
    path: '/configuracion-academica',
    icon: SlidersHorizontal,
    label: 'Configuración Académica',
    section: 'Coordinación',
    roles: ['coordinador']
  },
  
  // --- Administración Sistema ---
  {
    path: '/admin/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard Admin',
    section: 'Administración Sistema',
    roles: ['administrador']
  },
  {
    path: '/admin/manage-users/professors',
    icon: Users,
    label: 'Gestionar Profesores',
    section: 'Administración Sistema',
    roles: ['administrador']
  },
  {
    path: '/admin/manage-users/students',
    icon: GraduationCap,
    label: 'Gestionar Estudiantes',
    section: 'Administración Sistema',
    roles: ['administrador']
  },
  {
    path: '/admin/manage-area',
    icon: Settings,
    label: 'Configuración Área',
    section: 'Administración Sistema',
    roles: ['administrador']
  },
  
  // --- Común Inferior ---
  {
    path: '/perfil',
    icon: UserCircle2,
    label: 'Mi Perfil',
    section: 'Cuenta',
    roles: ['coordinador', 'asesor', 'jurado', 'administrador', 'estudiante']
  },
  {
    path: '/ayuda',
    icon: LifeBuoy,
    label: 'Ayuda',
    section: 'Cuenta',
    roles: ['coordinador', 'asesor', 'jurado', 'administrador', 'estudiante']
  },
];

const Sidebar: React.FC<SidebarProps> = ({ userRoles, userName, userAvatar, onLogout }) => {
  const pathname = usePathname();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});

  // Filtrar items según los roles del usuario
  const filteredNavItems = ALL_NAV_ITEMS.filter(item => 
    item.roles.some(role => userRoles.includes(role))
  );

  // Agrupar items por sección
  const sections = filteredNavItems.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {} as { [key: string]: NavItem[] });

  // Inicializar las secciones expandidas (todas expandidas por defecto)
  useEffect(() => {
    const initialExpandedState = Object.keys(sections).reduce((acc, section) => {
      acc[section] = true; // Todas las secciones expandidas por defecto
      return acc;
    }, {} as { [key: string]: boolean });
    
    setExpandedSections(initialExpandedState);
  }, [userRoles]);

  // Manejar la expansión/contracción de secciones
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Renderizado de los roles del usuario
  const renderUserRoleBadges = () => {
    const roleTitles: { [key in Role]: string } = {
      coordinador: 'Coordinador',
      asesor: 'Asesor',
      jurado: 'Jurado',
      administrador: 'Admin',
      estudiante: 'Estudiante'
    };

    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {userRoles.map(role => (
          <span 
            key={role}
            className="inline-flex text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
          >
            {roleTitles[role]}
          </span>
        ))}
      </div>
    );
  };

  // Renderizado de cada item de navegación
  const renderNavItem = (item: NavItem) => {
    const isActive = pathname === item.path;
    const Icon = item.icon;
    
    return (
      <Link 
        href={item.path} 
        key={item.path}
        className={cn(
          "flex items-center py-2 px-3 my-1 text-sm rounded-lg transition-all duration-200",
          "hover:bg-primary/10 hover:text-primary",
          isActive 
            ? "bg-primary/10 text-primary font-medium" 
            : "text-gray-600 dark:text-gray-300"
        )}
        onClick={() => setIsMobileSidebarOpen(false)}
      >
        <Icon size={18} className="mr-2 flex-shrink-0" />
        <span>{item.label}</span>
      </Link>
    );
  };

  // Contenido del sidebar
  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Perfil del usuario */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          {userAvatar ? (
            <img src={userAvatar} alt={userName} className="w-10 h-10 rounded-full" />
          ) : (
            <CircleUser size={40} className="text-primary/80" />
          )}
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              {userName}
            </h3>
            {renderUserRoleBadges()}
          </div>
        </div>
      </div>
      
      {/* Navegación */}
      <div className="flex-1 overflow-y-auto py-2 px-3">
        {Object.entries(sections).map(([sectionName, items]) => (
          <div key={sectionName} className="mb-4">
            <button
              onClick={() => toggleSection(sectionName)}
              className="flex items-center justify-between w-full mb-1 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-primary"
            >
              <span>{sectionName}</span>
              <ChevronDown 
                size={16} 
                className={cn(
                  "transition-transform duration-200",
                  expandedSections[sectionName] ? "transform rotate-180" : ""
                )} 
              />
            </button>
            
            {expandedSections[sectionName] && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                {items.map(renderNavItem)}
              </motion.div>
            )}
          </div>
        ))}
      </div>
      
      {/* Sección de cerrar sesión */}
      <div className="p-3 mt-auto border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onLogout}
          className="flex items-center py-2 px-3 w-full text-sm rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <LogOut size={18} className="mr-2" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Botón para abrir el sidebar en móviles */}
      <button
        onClick={() => setIsMobileSidebarOpen(true)}
        className="lg:hidden fixed bottom-4 right-4 z-30 bg-primary text-white p-3 rounded-full shadow-lg"
        aria-label="Abrir menú"
      >
        <Menu size={24} />
      </button>
      
      {/* Sidebar para escritorio */}
      <aside className="hidden lg:block w-64 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm fixed left-0 top-0 z-20">
        {sidebarContent}
      </aside>
      
      {/* Sidebar para móviles */}
      {isMobileSidebarOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <aside className="fixed left-0 top-0 w-72 h-screen bg-white dark:bg-gray-800 shadow-lg z-50 lg:hidden overflow-y-auto">
            <div className="flex justify-end p-4">
              <button 
                onClick={() => setIsMobileSidebarOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={24} />
              </button>
            </div>
            {sidebarContent}
          </aside>
        </>
      )}
      
      {/* Espacio para el contenido principal */}
      <div className="lg:pl-64">
        {/* Aquí irá el contenido principal de la aplicación */}
      </div>
    </>
  );
};

export default Sidebar;