"use client";

import {
  BarChart3,
  BarChart4,
  BookOpen,
  CalendarCheck,
  CalendarIcon,
  CheckSquare,
  ClipboardList,
  FileCheck2,
  FileText,
  LockKeyhole,
  MailQuestion,
  MessageSquare,
  Search,
  SearchCheck,
  Settings,
  Shuffle,
  User2,
  Users,
  Users2,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/features/auth";

const estadisticas = [
    { 
      title: "Tesis en Proceso", 
      value: 124, 
      change: "+4% desde el mes pasado", 
      icon: FileText
    },
    { 
      title: "Asesores Activos", 
      value: 38, 
      change: "+2 desde el mes pasado", 
      icon: Users2 
    },
    { 
      title: "Tesis Aprobadas", 
      value: 29, 
      change: "+7 desde el mes pasado", 
      icon: FileCheck2 
    },
    { 
      title: "Revisiones Pendientes", 
      value: 12, 
      change: "-3 desde el mes pasado", 
      icon: SearchCheck 
    },
  ];

  const modulosPorRol: Record<string, { title: string; description: string; icon: any; href: string }[]> = {
    administrador: [
      { title: "Configuración", 
        description: "Administra los parámetros generales del sistema.", 
        href: "/administrador/configuracion",
        icon: Settings, 
      },
    ],
    alumno: [
      { title: "Temas", 
        description: "Gestiona tus temas de tesis", 
        href: "/alumno/temas/temas",
        icon: FileText,
      },
      { title: "Mi Proyecto", 
        description: "Consulta la información de tu proyecto", 
        href: "/alumno/mi-proyecto/informacion-del-proyecto",
        icon: FileText,
      },
      { title: "Asesores", 
        description: "Explora el directorio de asesores", 
        href: "/alumno/directorio-de-asesores",
        icon: Users, 
      },
      { title: "Solicitudes Académicas", 
        description: "Envía y revisa tus solicitudes académicas", 
        href: "/alumno/solicitudes-academicas",
        icon: FileText, 
      },
      { title: "Reportes", 
        description: "Visualiza reportes y estado de tu tesis", 
        href: "/alumno/reportes",
        icon: BarChart3, 
      },
    ],
    jurado: [
        { title: "Calendario", 
          description: "Consulta tu cronograma de evaluaciones", 
          href: "/jurado/calendario", 
          icon: CalendarIcon, 
        },
        { title: "Exposiciones", 
          description: "Revisa detalles de exposiciones", 
          href: "/jurado/exposiciones", 
          icon: MessageSquare 
        },
        { title: "Revisión", 
          description: "Gestiona la revisión de entregables", 
          href: "/jurado/revision", 
          icon: Search 
        },
        { title: "Temas de tesis", 
          description: "Accede a los temaS", 
          href: "/jurado/temas", 
          icon: FileText 
        },
    ],
    asesor: [
      { title: "Temas", 
        description: "Visualiza y gestiona los temas propuestos y asignados", 
        href: "/asesor/temas",
        icon: FileText,
      },
      { title: "Postulaciones", 
        description: "Gestiona las postulaciones de estudiantes a tus temas", 
        href: "/asesor/postulaciones",
        icon: ClipboardList,
      },
      { title: "Propuestas", 
        description: "Visualiza y gestiona propuestas realizadas por otros estudiantes", 
        href: "/asesor/propuestas",
        icon: FileText, 
      },
      { title: "Invitaciones de Asesoría", 
        description: "Revisa propuestas de asesoría enviadas por la coordinación", 
        href: "/asesor/propuestas-recibidas",
        icon: MailQuestion, 
      },
      { title: "Tesistas", 
        description: "Visualiza información de tesistas y sus eventos", 
        href: "/asesor/tesistas",
        icon: Users, 
      },
      { title: "Asesores", 
        description: "Explora el directorio de asesores", 
        href: "/asesor/asesores/directorio-de-asesores",
        icon: Users, 
      },
      { title: "Exposiciones", 
        description: "Consulta tus exposiciones", 
        href: "/asesor/exposiciones",
        icon: MessageSquare, 
      },
      { title: "Revisión", 
        description: "Revisa entregables y documentos", 
        href: "/asesor/revision",
        icon: Search, 
      },
      { title: "Reportes", 
        description: "Visualiza reportes de seguimiento y progreso", 
        href: "/asesor/reportes",
        icon: BarChart3, 
      },
    ],
    coordinador: [
      { title: "Temas", 
        description: "Gestiona temas de tesis inscritos", 
        href: "/coordinador/temas",
        icon: FileText,
      },
      { title: "Propuestas", 
        description: "Visualiza y gestiona propuestas realizadas", 
        href: "/coordinador/propuestas",
        icon: CalendarCheck, 
      },
      { title: "Aprobaciones", 
        description: "Gestiona solicitudes de cambios en tesis", 
        href: "/coordinador/aprobaciones",
        icon: CheckSquare,
      },
      { title: "Reasignaciones Pendientes", 
        description: "Gestiona las solicitudes de cese aprobadas ", 
        href: "/coordinador/reasignaciones-pendientes",
        icon: Shuffle, 
      },
      { title: "Exposiciones", 
        description: "Consulta y planifica las exposiciones", 
        href: "/coordinador/exposiciones",
        icon: MessageSquare, 
      },
      { title: "Revisión", 
        description: "Revisa entregables y documentos", 
        href: "/coordinador/revision",
        icon: Search, 
      },
      { title: "Asesores", 
        description: "Consulta y gestiona el directorio de asesores", 
        href: "/coordinador/asesores/directorio-de-asesores",
        icon: Users, 
      },
      { title: "Jurados", 
        description: "Consulta y gestiona el directorio de jurados", 
        href: "/coordinador/jurados",
        icon: Users, 
      },
      { title: "Reportes", 
        description: "Visualiza estadísticas y reportes sobre el progreso de las tesis", 
        href: "/coordinador/reportes",
        icon: BarChart3, 
      },
      { title: "Configuración", 
        description: "Configura los parámetros generales del sistema", 
        href: "/coordinador/configuracion",
        icon: Settings, 
      },
    ],
    revisor: [
      { title: "Revisión", 
        description: "Gestiona la revisión de entregables",
        href: "/revisor/revision", 
        icon: Search 
      },
      { title: "Reportes", 
        description: "Visualiza reportes sobre el progreso de las tesis",
        href: "/revisor/reportes", 
        icon: BarChart3 
      },
    ],
  };

// const rolesDisponibles = ["alumno", "coordinador","administrador","jurado","revisor","asesor"] as const;
// type Rol = typeof rolesDisponibles[number];

export default function DashboardPage() {
  const { user } = useAuth();
  const rolesDisponibles = user?.roles ?? [];
  type Rol = string;
  const [rolActivo, setRolActivo] = useState<Rol>(rolesDisponibles[0] ?? "");
  // const [rolActivo, setRolActivo] = useState<Rol>("alumno");

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-1">Bienvenido al SGTA</h1>
        <p className="text-muted-foreground text-sm">
          Sistema de Gestión de Tesis Académicas de la Facultad de Ciencias e Ingeniería
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {rolesDisponibles.map((rol) => (
          <Button
            key={rol}
            onClick={() => setRolActivo(rol)}
            variant={rolActivo === rol ? "default" : "outline"}
            className={`rounded-full px-4 py-2 capitalize text-sm transition-colors duration-200 ${
              rolActivo === rol ? "bg-primary text-white" : "hover:bg-muted"
            }`}
          >
            {rol}
          </Button>
        ))}
      </div>

      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {estadisticas.map(({ title, value, change, icon: Icon }) => (
          <Card key={title} className="border border-muted">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
              <p className="text-xs text-muted-foreground mt-1">{change}</p>
            </CardContent>
          </Card>
        ))}
      </div> */}

      <div>
        <h2 className="text-xl font-semibold mb-4">Módulos del Sistema ({rolActivo})</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modulosPorRol[rolActivo].map(({ title, description, icon: Icon, href }) => (
            <Link key={href} href={href} className="group">
              <Card key={title} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-start gap-4">
                  <div className="bg-muted p-2 rounded-md">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
