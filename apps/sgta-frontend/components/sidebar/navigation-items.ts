import {
  BarChart3,
  Calendar,
  CalendarIcon,
  CheckSquare,
  ClipboardList,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  Home,
  MailQuestion,
  MessageSquare,
  RefreshCcw,
  Search,
  Settings,
  Shuffle,
  Users,
  UserX2
} from "lucide-react";

export interface NavigationGroup {
  label: string;
  items: NavigationItem[];
}

export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ElementType;
  children?: NavigationItem[];
  isActive?: boolean;
}

export const navigationItems: Record<string, NavigationItem[]> = {
  common: [{ name: "Dashboard", href: "/dashboard", icon: Home }],
  administrador: [
    {
      name: "Configuración",
      href: "/administrador/configuracion",
      icon: Settings,
    },
  ],
  alumno: [
    {
      name: "Temas",
      href: "/alumno/temas",
      icon: FileText,
      children: [
        { name: "Temas", 
          href: "/alumno/temas/temas", 
          icon: FileText
        },
        {
          name: "Catálogo de temas libres",
          href: "/alumno/temas/catalogo-de-temas",
          icon: FolderOpen,
        },
        
        {
          name: "Postulaciones de asesores",
          href: "/alumno/temas/postulaciones-de-asesores",
          icon: CheckSquare,
        },
      ],
    },
    {
      name: "Mi proyecto",
      href: "/alumno/mi-proyecto",
      icon: FileText,
      children: [
/*         {
          name: "Información del proyecto",
          href: "/alumno/mi-proyecto/informacion-del-proyecto",
          icon: FileText,
        }, */
        {
          name: "Cronograma",
          href: "/alumno/mi-proyecto/cronograma",
          icon: Calendar,
        },
        {
          name: "Entregables",
          href: "/alumno/mi-proyecto/entregables",
          icon: FileSpreadsheet,
        },
        {
          name: "Exposiciones",
          href: "/alumno/mi-proyecto/exposiciones",
          icon: MessageSquare,
        },
        /* {
          name: "Reuniones",
          href: "/alumno/mi-proyecto/reuniones",
          icon: Users,
        }, */
      ],
    },
    {
      name: "Directorio de asesores",
      href: "/alumno/directorio-de-asesores",
      icon: Users,
    },
    {
      name: "Solicitudes académicas",
      href: "/alumno/solicitudes-academicas",
      icon: FileText,
    },
    { name: "Reportes", href: "/alumno/reportes", icon: BarChart3 },
    {
      name: "Configuración",
      href: "/alumno/configuracion/notificaciones",
      icon: Settings,
    },
  ],
  jurado: [
    /* { name: "Calendario", href: "/jurado/calendario", icon: CalendarIcon }, */
    { name: "Exposiciones", href: "/jurado/exposiciones", icon: MessageSquare },
    { name: "Revisión", href: "/jurado/revision", icon: Search },
/*     { name: "Temas de tesis", href: "/jurado/temas", icon: FileText }, */
  ],
  asesor: [
    { name: "Temas", href: "/asesor/temas", icon: FileText },
    {
      name: "Postulaciones",
      href: "/asesor/postulaciones",
      icon: ClipboardList,
    },
    { name: "Propuestas", href: "/asesor/propuestas", icon: FileText },
    {
      name: "Invitaciones de Asesoría",
      href: "/asesor/propuestas-recibidas",
      icon: MailQuestion,
    },
    { name: "Tesistas", href: "/asesor/tesistas", icon: Users },
    {
      name: "Asesores",
      href: "/asesor/asesores",
      icon: Users,
      children: [
        {
          name: "Directorio de asesores",
          href: "/asesor/asesores/directorio-de-asesores",
          icon: Users,
        },
        {
          name: "Cese de asesoria",
          href: "/asesor/asesores/cese-de-asesoria",
          icon: UserX2,
        },
        {
          name: "Cese de tema",
          href: "/asesor/asesores/cese-tema",
          icon: UserX2,
        },
        {
          name: "Cambios de asesor",
          href: "/asesor/asesores/cambio-asesor",
          icon: RefreshCcw,
        },
      ],
    },
    { name: "Exposiciones", href: "/asesor/exposiciones", icon: MessageSquare },
    { name: "Revisión", href: "/asesor/revision", icon: Search },
    { name: "Reportes", href: "/asesor/reportes", icon: BarChart3 },
  ],
  coordinador: [
    { name: "Temas", href: "/coordinador/temas", icon: FileText },
   // { name: "Propuestas", href: "/coordinador/propuestas", icon: FileText },
    {
      name: "Aprobaciones",
      href: "/coordinador/aprobaciones",
      icon: CheckSquare,
    },
    {
      name: "Reasignaciones Pendientes",
      href: "/coordinador/reasignaciones-pendientes", // La ruta de la nueva página
      icon: Shuffle, // Ícono para reasignaciones/cambios
    },
    {
      name: "Exposiciones",
      href: "/coordinador/exposiciones",
      icon: MessageSquare,
    },
/*     { name: "Revisión", href: "/coordinador/revision", icon: Search }, */
    {
      name: "Asesores",
      href: "/coordinador/asesores",
      icon: Users,
      children: [
        {
          name: "Directorio de asesores",
          href: "/coordinador/asesores/directorio-de-asesores",
          icon: Users,
        },
        {
          name: "Cese de tema",
          href: "/coordinador/asesores/cese-tema",
          icon: UserX2,
        },
        {
          name: "Cese de asesoria",
          href: "/coordinador/asesores/cese-de-asesoria",
          icon: UserX2,
        },
        {
          name: "Cambio de asesor",
          href: "/coordinador/asesores/cambio-asesor",
          icon: RefreshCcw,
        },
       /*  {
          name: "Areas temáticas",
          href: "/coordinador/asesores/areas-tematicas",
          icon: BookOpenText,
        }, */
        {
          name: "Reuniones",
          href: "/coordinador/asesores/reuniones",
          icon: CalendarIcon,
        },
      ],
    },
    { name: "Jurados", href: "/coordinador/jurados", icon: Users },
    { name: "Reportes", href: "/coordinador/reportes", icon: BarChart3 },
    {
      name: "Configuración",
      href: "/coordinador/configuracion",
      icon: Settings,
    },
  ],
  revisor: [
    { name: "Revisión", href: "/revisor/revision", icon: Search },
    { name: "Reportes", href: "/revisor/reportes", icon: BarChart3 },
  ],
};
