"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, Calendar, Check, FileSpreadsheet, FileText, MessageSquare, Users } from "lucide-react";
import Link from "next/link";
import { title } from "process";

const cards = [
  {
    title: "Información del proyecto",
    description: "Visualiza el detalle de tu proyecto",
    href: "/alumno/mi-proyecto/informacion-del-proyecto",
    icon: FileText,
  },
  {
    title: "Cronograma",
    description: "Consulta y registra tus eventos",
    href: "/alumno/mi-proyecto/cronograma",
    icon: Calendar,
  },
  {
    title: "Entregables",
    description: "Revisa y entrega tus documentos",
    href: "/alumno/mi-proyecto/entregables",
    icon: FileSpreadsheet,
  },
  {
    title: "Exposiciones",
    description: "Consulta tus exposiciones",
    href: "/alumno/mi-proyecto/exposiciones",
    icon: MessageSquare,
  },
  {
    title: "Reuniones",
    description: "Accede al historial de tus reuniones",
    href: "/alumno/mi-proyecto/reuniones",
    icon: Users,
  },
];

export default function AlumnoMiProyectoDashboard() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Mi Proyecto
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Accede a toda la información y herramientas de tu proyecto académico.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map(({ title, description, href, icon: Icon }) => (
            <Link key={href} href={href} className="group">
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-start gap-4">
                  <div className="bg-muted p-2 rounded-md">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="group-hover:text-primary">
                      {title}
                    </CardTitle>
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
