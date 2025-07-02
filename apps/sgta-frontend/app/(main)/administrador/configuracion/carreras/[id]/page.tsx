"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { carreraService, Carrera } from "@/features/configuracion/services/carrera-service";
import { unidadAcademicaService, UnidadAcademica } from "@/features/configuracion/services/carrera-service";

export default function DetalleCarreraPage({ params }: { params: Promise<{ id: string }> }) {
  const [carrera, setCarrera] = useState<Carrera | null>(null);
  const [unidadAcademica, setUnidadAcademica] = useState<UnidadAcademica | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCarrera = async () => {
      try {
        setLoading(true);
        const resolvedParams = await params;
        const carreraId = parseInt(resolvedParams.id);
        
        const carreraData = await carreraService.getById(carreraId);
        setCarrera(carreraData);
        
        if (carreraData.unidadAcademicaId) {
          const unidades = await unidadAcademicaService.getAll();
          const unidad = unidades.find(u => u.id === carreraData.unidadAcademicaId);
          setUnidadAcademica(unidad || null);
        }
      } catch (error) {
        console.error("Error al cargar la carrera:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCarrera();
  }, [params]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-gray-500">Cargando carrera...</p>
      </div>
    );
  }

  if (!carrera) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-gray-500">Carrera no encontrada</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/administrador/configuracion/carreras">
          <Button variant="ghost" size="icon">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Detalle de Carrera</h1>
      </div>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle>{carrera.nombre}</CardTitle>
            <Badge variant={carrera.activo ? "default" : "secondary"}>
              {carrera.activo ? "Activo" : "Inactivo"}
            </Badge>
          </div>
          <Link href={`/administrador/configuracion/carreras/${carrera.id}/editar`}>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Edit size={16} />
              <span>Editar</span>
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Código</h3>
              <p>{carrera.codigo}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Unidad Académica</h3>
              <p>{unidadAcademica?.nombre || "No asignada"}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Descripción</h3>
            <p className="text-gray-600">{carrera.descripcion || "Sin descripción"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
