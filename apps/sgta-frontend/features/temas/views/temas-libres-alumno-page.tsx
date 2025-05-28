"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PropuestasTable } from "@/features/temas/components/alumno/temas-libres-table";
import { useEffect, useState } from "react";

interface Subarea {
  nombre: string;
  [key: string]: unknown; 
}

export default function TemasLibresAlumnoPage() {
  const [searchTitulo, setSearchTitulo] = useState("");
  const [searchAsesor, setSearchAsesor] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [subareas, setSubareas] = useState<string[]>([]);

  useEffect(() => {
    const fetchSubareas = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/subAreaConocimiento/listarPorCarreraDeUsuario?usuarioId=2`
        );
        if (!res.ok) throw new Error("Error al obtener subáreas");
        const data = await res.json();
        const nombresUnicos = Array.from(
          new Set((data as Subarea[]).map((item) => item.nombre).filter(Boolean))
        ).sort();
        setSubareas(nombresUnicos);
      } catch (err) {
        console.error("Error cargando subáreas:", err);
      }
    };

    fetchSubareas();
  }, []);

  return (
    <div className="space-y-8 mt-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#042354]">Temas Libres</h1>
          <p className="text-muted-foreground">
            Explora y postula a temas de proyecto de fin de carrera disponibles.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Catálogo de Temas</CardTitle>
          <CardDescription>Filtra por título, asesor o subárea</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Buscar por título..."
              value={searchTitulo}
              onChange={(e) => setSearchTitulo(e.target.value)}
              className="md:w-1/3"
            />
            <Input
              placeholder="Buscar por asesor..."
              value={searchAsesor}
              onChange={(e) => setSearchAsesor(e.target.value)}
              className="md:w-1/3"
            />
            <Select value={selectedArea} onValueChange={(v) => setSelectedArea(v === "all" ? "" : v)}>
              <SelectTrigger className="md:w-1/3">
                <SelectValue placeholder="Todas las subáreas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las subáreas</SelectItem>
                {subareas.map((subarea) => (
                  <SelectItem key={subarea} value={subarea}>
                    {subarea}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <PropuestasTable
            filtroTitulo={searchTitulo}
            filtroAsesor={searchAsesor}
            filtroArea={selectedArea}
          />
        </CardContent>
      </Card>
    </div>
  );
}
