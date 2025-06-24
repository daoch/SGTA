"use client";

import {
  BarChart3,
  BarChart4,
  BookOpen,
  CalendarCheck,
  ClipboardList,
  FileCheck2,
  FileText,
  LockKeyhole,
  MailQuestion,
  MessageSquare,
  Search,
  SearchCheck,
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
    alumno: [
      { title: "Temas", 
        description: "Propuesta, revisión y aprobación de temas", 
        href: "/alumno/temas/temas",
        icon: FileText,
      },
      { title: "Mi Proyecto", 
        description: "Propuesta, revisión y aprobación de temas", 
        href: "/alumno/mi-proyecto/informacion-del-proyecto",
        icon: BookOpen,
      },
      { title: "Asesores", 
        description: "Seguimiento de avances y cronogramas", 
        href: "/alumno/directorio-de-asesores",
        icon: Users, 
      },
      { title: "Solicitudes Académicas", 
        description: "Seguimiento de avances y cronogramas", 
        href: "/alumno/solicitudes-academicas",
        icon: FileText, 
      },
      { title: "Reportes", 
        description: "Seguimiento de avances y cronogramas", 
        href: "/alumno/reportes",
        icon: BarChart3, 
      },
    ],
    asesor: [
      { title: "Temas", 
        description: "Propuesta, revisión y aprobación de temas", 
        href: "/asesor/temas",
        icon: FileText,
      },
      { title: "Postulaciones", 
        description: "Propuesta, revisión y aprobación de temas", 
        href: "/asesor/postulaciones",
        icon: ClipboardList,
      },
      { title: "Propuestas", 
        description: "Seguimiento de avances y cronogramas", 
        href: "/asesor/propuestas",
        icon: FileText, 
      },
      { title: "Invitaciones de Asesoría", 
        description: "Seguimiento de avances y cronogramas", 
        href: "/asesor/propuestas-recibidas",
        icon: MailQuestion, 
      },
      { title: "Tesistas", 
        description: "Seguimiento de avances y cronogramas", 
        href: "/asesor/tesistas",
        icon: Users, 
      },
      { title: "Asesores", 
        description: "Seguimiento de avances y cronogramas", 
        href: "/asesor/asesores/directorio-de-asesores",
        icon: Users, 
      },
      { title: "Exposiciones", 
        description: "Seguimiento de avances y cronogramas", 
        href: "/asesor/exposiciones",
        icon: MessageSquare, 
      },
      { title: "Revisión", 
        description: "Seguimiento de avances y cronogramas", 
        href: "/asesor/revision",
        icon: Search, 
      },
      { title: "Reportes", 
        description: "Seguimiento de avances y cronogramas", 
        href: "/asesor/reportes",
        icon: BarChart3, 
      },
    ],
    coordinador: [
      { title: "Temas", 
        description: "Propuesta, revisión y aprobación de temas", 
        href: "/alumno/temas/temas",
        icon: BookOpen,
      },
      { title: "Propuestas", 
        description: "Seguimiento de avances y cronogramas", 
        href: "/alumno/gestion",
        icon: CalendarCheck, 
      },
      { title: "Aprobaciones", 
        description: "Propuesta, revisión y aprobación de temas", 
        href: "/alumno/temas",
        icon: BookOpen,
      },
      { title: "Reasignaciones Pendientes", 
        description: "Seguimiento de avances y cronogramas", 
        href: "/alumno/gestion",
        icon: CalendarCheck, 
      },
      { title: "Exposiciones", 
        description: "Seguimiento de avances y cronogramas", 
        href: "/alumno/gestion",
        icon: CalendarCheck, 
      },
      { title: "Revisión", 
        description: "Seguimiento de avances y cronogramas", 
        href: "/alumno/gestion",
        icon: CalendarCheck, 
      },
      { title: "Asesores", 
        description: "Seguimiento de avances y cronogramas", 
        href: "/alumno/gestion",
        icon: CalendarCheck, 
      },
      { title: "Jurados", 
        description: "Seguimiento de avances y cronogramas", 
        href: "/alumno/gestion",
        icon: CalendarCheck, 
      },
      { title: "Reportes", 
        description: "Seguimiento de avances y cronogramas", 
        href: "/alumno/gestion",
        icon: CalendarCheck, 
      },
      { title: "Configuración", 
        description: "Seguimiento de avances y cronogramas", 
        href: "/alumno/gestion",
        icon: CalendarCheck, 
      },
    ],
  };

const rolesDisponibles = ["alumno", "asesor", "coordinador"] as const;
type Rol = typeof rolesDisponibles[number];

export default function DashboardPage() {
  const [rolActivo, setRolActivo] = useState<Rol>("alumno");

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-1">Bienvenido al SGTA</h1>
        <p className="text-muted-foreground text-sm">
          Sistema de Gestión de Tesis Académicas de la Facultad de Ciencias e Ingeniería
        </p>
      </div>

      <div className="space-y-4">
        {/* <p className="text-muted-foreground">Selecciona un rol para continuar:</p> */}
        <div className="flex gap-4">
          {rolesDisponibles.map((rol) => (
            <Button
              key={rol}
              onClick={() => setRolActivo(rol)}
              variant={rolActivo === rol ? "default" : "secondary"}
            >
              {rol.charAt(0).toUpperCase() + rol.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
      </div>

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
