"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PostulacionesTable } from "@/features/temas/components/asesor/postulaciones-table";

export default function PostulacionesDeAlumnosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-pucp-blue">Postulaciones</h1>
        <p className="text-muted-foreground">
          Postulaciones realizadas por estudiantes a mis temas
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de postulaciones</CardTitle>
          <CardDescription>
            Gestiona las postulaciones de estudiantes a tus temas propuestos
          </CardDescription>
        </CardHeader>
        <CardContent>{<PostulacionesTable />}</CardContent>
      </Card>
    </div>
  );
}
