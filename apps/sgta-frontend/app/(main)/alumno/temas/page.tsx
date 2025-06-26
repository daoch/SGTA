"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckSquare, FileText, FolderOpen } from "lucide-react";
import Link from "next/link";

const cards = [
  {
    title: "Catálogo de temas libres",
    description: "Explora temas propuestos de forma libre",
    href: "/alumno/temas/catalogo-de-temas",
    icon: FolderOpen,
  },
  {
    title: "Temas",
    description: "Visualiza y gestiona tus temas, postulaciones y propuestas",
    href: "/alumno/temas/temas",
    icon: FileText,
  },
  {
    title: "Postulaciones de asesores",
    description: "Consulta las postulaciones de los asesores",
    href: "/alumno/temas/postulaciones-de-asesores",
    icon: CheckSquare,
  },
];

export default function AlumnoTemasDashboard() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Gestión del Personal Académico
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Administre las funciones relacionadas con asesores académicos.
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
