"use client";

import { Users, Check, BookOpen } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const cards = [
  {
    title: "Directorio de Asesores",
    description: "Gestiona la habilitación de profesores como asesores.",
    href: "/coordinador/asesores/directorio-de-asesores",
    icon: Users,
  },
  {
    title: "Cese de Asesoría",
    description: "Administra solicitudes de cese de función de asesoría.",
    href: "/coordinador/asesores/cese-de-asesoria",
    icon: Check,
  },
  {
    title: "Áreas Temáticas",
    description: "Configura las áreas temáticas disponibles para tesis.",
    href: "/coordinador/asesores/areas-tematicas",
    icon: BookOpen,
  },
];

export default function PersonalAcademicoDashboard() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Gestión del Personal Académico</h1>
          <p className="text-muted-foreground max-w-2xl">
            Administre las funciones relacionadas con asesores académicos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map(({ title, description, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group"
            >
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
