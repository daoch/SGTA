// src/components/layout/Sidebar.tsx
'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation'; // Usar para active path
import { 
  LayoutDashboard, Users, BookOpen, Settings, GraduationCap, 
  FileText, UserCircle2, BellRing, Calendar, MessageSquare, 
  FolderGit2, // Icono para Proyectos/Temas
  SlidersHorizontal, // Icono para Configuración
  FileClock, // Icono para Ciclos
  FileUp, // Icono para Importar
  Tags, // Icono para Áreas Temáticas
  LineChart, // Icono para Reportes
  LifeBuoy, // Icono para Ayuda
  LogOut, // Icono para Cerrar Sesión
  ListChecks, // Icono para Habilitación/Roles
  Bell, // Icono para Solicitudes Cese
  RefreshCw, // Icono para Reasignación
  Search, // Icono para Explorar
  Eye, // Icono para Seguimiento Reuniones
  Briefcase, // Icono para Personal Académico (Alternativa)
  ChevronRight,
  ChevronLeft
  // Añadir más iconos de lucide-react según sea necesario
} from 'lucide-react';
import { cn } from '@/lib/utils'; // Asumiendo cn de Shadcn/ui
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'; // Importar Tooltip

// --- Hook simple para determinar ruta activa ---
// (Puedes usar uno más sofisticado si lo tienes)
const useActivePath = () => {
  const pathname = usePathname();
  const isActive = (path: string) => {
     // Considera lógica más robusta si tienes subrutas, ej. startsWith
     // O usar `useSelectedLayoutSegment` para rutas anidadas
     return pathname === path || (path !== '/' && pathname.startsWith(path + '/'));
  };
  return isActive;
};

// --- Definición de Items de Navegación por Rol ---
// (Podría estar en SidebarMenu.ts)
type NavItem = {
  path: string;
  icon: React.ElementType;
  label: string; // Texto para modo expandido
  section?: string; // Para agrupar en modo expandido
};

const getNavItems = (userRole: string | null | undefined): NavItem[] => {
  switch (userRole?.toLowerCase()) {
    case 'coordinador':
      return [
        { path: '/panel-control', icon: LayoutDashboard, label: 'Panel de Control', section: 'Principal' },
        // Gestión Académica
        { path: '/personal-academico', icon: Briefcase, label: 'Personal Académico', section: 'Gestión Académica' },
        { path: '/gestion-temas', icon: FolderGit2, label: 'Gestión de Temas', section: 'Gestión Académica' },
        { path: '/gestion-cronogramas', icon: Calendar, label: 'Gestión Cronogramas', section: 'Gestión Académica' },
        { path: '/jurado-exposiciones', icon: GraduationCap, label: 'Jurado y Exposiciones', section: 'Gestión Académica' },
        { path: '/seguimiento-reuniones', icon: Eye, label: 'Seguimiento Reuniones', section: 'Gestión Académica' },
        // Administración del Área
        { path: '/gestion-ciclos', icon: FileClock, label: 'Gestión de Ciclos', section: 'Administración Área' },
        { path: '/importar-matricula', icon: FileUp, label: 'Importar Matrícula', section: 'Administración Área' },
        { path: '/areas-tematicas', icon: Tags, label: 'Áreas Temáticas', section: 'Administración Área' },
         // Reportes y Configuración
        { path: '/reportes', icon: LineChart, label: 'Reportes', section: 'Reportes y Config.' },
        { path: '/configuracion-academica', icon: SlidersHorizontal, label: 'Configuración Académica', section: 'Reportes y Config.' },
      ];
    case 'asesor': // Asumiendo un rol de asesor
      return [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Panel de Control' }, // Ruta unificada para dashboard?
        { path: '/mis-tesistas', icon: GraduationCap, label: 'Mis Tesistas' },
        { path: '/gestion-temas', icon: FolderGit2, label: 'Gestión de Temas' }, // Propuestas, solicitudes
        { path: '/explorar-propuestas', icon: Search, label: 'Explorar Propuestas'}, // Si aplica
        { path: '/directorio-asesores', icon: Users, label: 'Directorio Asesores' },
        // { path: '/notificaciones', icon: BellRing, label: 'Notificaciones' }, // Si hay módulo
      ];
    case 'administrador': // Rol Administrador del Sistema del Área
       return [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard Admin', section: 'Sistema'},
        { path: '/admin/manage-users/professors', icon: Users, label: 'Gestionar Profesores', section: 'Gestión Cuentas'},
        { path: '/admin/manage-users/students', icon: GraduationCap, label: 'Gestionar Estudiantes', section: 'Gestión Cuentas'},
        { path: '/admin/manage-area', icon: Settings, label: 'Configuración Área', section: 'Configuración'},
        // { path: '/admin/audit-log', icon: FileText, label: 'Audit Log', section: 'Sistema'}, // Opcional
       ];
    // Añadir casos para 'estudiante', 'jurado', etc.
    default:
      return []; // O redirigir a login si no hay rol
  }
};


// --- Componente Sidebar ---
interface SidebarProps {
  userRole: string | null | undefined; // Rol del usuario actual
  isCollapsed: boolean; // Estado para saber si está colapsado
  setCollapsed: (collapsed: boolean) => void; // Función para cambiar el estado
  className?: string; // Clases adicionales
}

export function Sidebar({ userRole, isCollapsed, setCollapsed, className }: SidebarProps) {
  const isActive = useActivePath();
  const navItems = getNavItems(userRole);

  // Agrupar items por sección para modo expandido
  const groupedItems: { [key: string]: NavItem[] } = {};
  navItems.forEach(item => {
      const section = item.section || 'General'; // Grupo por defecto
      if (!groupedItems[section]) {
          groupedItems[section] = [];
      }
      groupedItems[section].push(item);
  });

  // --- Renderizado ---
  return (
    <div
      className={cn(
        "relative h-screen z-50 flex flex-col bg-[#012652] text-white transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64", // Ancho colapsado vs expandido
        className
      )}
    >
      {/* Logo */}
      <div className={cn(
          "flex items-center justify-center h-16 border-b border-white/10",
          isCollapsed ? "" : "px-4 justify-start" // Alinear a la izquierda en modo expandido
      )}>
        <Link href="/" className="flex items-center gap-2 min-w-0"> {/* min-w-0 para truncar */}
          <img src="/logo-pucp.svg" alt="PUCP Logo" className="h-8 flex-shrink-0" />
          {!isCollapsed && (
            <span className="font-bold text-lg truncate">SGPFC</span> // Mostrar texto si no está colapsado
          )}
        </Link>
      </div>

      {/* Navegación */}
      <ScrollArea className="flex-1 py-4">
        <TooltipProvider delayDuration={100}> {/* Provider para Tooltips */}
           {isCollapsed ? (
             // --- MODO COLAPSADO ---
             <div className="space-y-1 px-2">
                {navItems.map((item, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                       <Link href={item.path}>
                          <Button
                            variant="ghost"
                            className={cn(
                              "h-10 w-10 justify-center", // Centrado
                              isActive(item.path) 
                                ? "bg-white/15 text-white hover:bg-white/20" 
                                : "text-gray-300 hover:text-white hover:bg-white/10"
                            )}
                            size="icon"
                            aria-label={item.label} // Accesibilidad
                          >
                            <item.icon className="h-5 w-5" />
                          </Button>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={5}> {/* Mostrar tooltip a la derecha */}
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
           ) : (
             // --- MODO EXPANDIDO ---
             <nav className="px-3 space-y-4">
               {Object.entries(groupedItems).map(([sectionName, items]) => (
                 <div key={sectionName}>
                    {/* Mostrar nombre de sección si no es 'General' o si hay más de una sección */}
                    {(sectionName !== 'General' || Object.keys(groupedItems).length > 1) && (
                        <h2 className="mb-1 px-2 text-xs font-semibold text-white/50 uppercase tracking-wider">
                            {sectionName}
                        </h2>
                    )}
                    <div className="space-y-1">
                      {items.map((item, index) => (
                         <Link href={item.path} key={index} legacyBehavior passHref>
                            <Button
                              variant="ghost"
                              className={cn(
                                "w-full justify-start h-9", // Ajustar altura si es necesario
                                isActive(item.path) 
                                  ? "bg-white/15 text-white hover:bg-white/20" 
                                  : "text-gray-300 hover:text-white hover:bg-white/10"
                              )}
                            >
                              <item.icon className="mr-2 h-4 w-4" />
                              {item.label}
                            </Button>
                          </Link>
                      ))}
                    </div>
                 </div>
               ))}
             </nav>
           )}
        </TooltipProvider>
      </ScrollArea>

      {/* Botón Colapsar/Expandir */}
      <div className="p-3 border-t border-white/10 mt-auto">
         <TooltipProvider delayDuration={100}>
             <Tooltip>
                 <TooltipTrigger asChild>
                     <Button
                        variant="outline"
                        size="icon"
                        className={cn(
                            "h-9 w-full border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white",
                            isCollapsed ? "w-9 mx-auto" : "" // Centrado si colapsado
                        )}
                        onClick={() => setCollapsed(!isCollapsed)}
                        aria-label={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
                      >
                       {/* Icono cambia según estado - PanelLeft no existe en lucide, usar PanelLeftOpen/Close */}
                       {/* Asumiré que tienes iconos similares o usa los de lucide que más se parezcan */}
                       {/* <PanelLeft className={cn("h-5 w-5", isCollapsed ? "" : "rotate-180")} /> */}
                       {/* Alternativa con Chevrons */}
                       {isCollapsed ? <ChevronRight className="h-5 w-5"/> : <ChevronLeft className="h-5 w-5"/>}
                     </Button>
                 </TooltipTrigger>
                 <TooltipContent side="right" sideOffset={5}>
                     {isCollapsed ? "Expandir" : "Colapsar"}
                 </TooltipContent>
             </Tooltip>
         </TooltipProvider>
      </div>

      {/* Footer opcional con perfil/logout */}
      {!isCollapsed && (
          <div className="p-3 border-t border-white/10">
              {/* Aquí podría ir un mini perfil o botón de logout */}
               <Link href="/perfil" legacyBehavior passHref>
                  <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10 h-9">
                      <UserCircle2 className="mr-2 h-4 w-4" /> Mi Perfil
                  </Button>
                </Link>
                 <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10 h-9" onClick={() => console.log('Logout!')}>
                      <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
                 </Button>
          </div>
      )}
    </div>
  );
}