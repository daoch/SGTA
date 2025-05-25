"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Edit, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Datos de ejemplo
const ciclo = {
  id: 3,
  nombre: "2024-1",
  semestre: "1",
  año: 2024,
  fechaInicio: "01/04/2024",
  fechaFin: "31/07/2024",
  estado: "En curso",
  descripcion:
    "Ciclo académico correspondiente al primer semestre del año 2024.",
  etapasFormativas: [
    {
      id: 1,
      nombre: "Proyecto de Tesis 1",
      carrera: "Ingeniería de Sistemas",
      orden: 1,
      estudiantes: 45,
    },
    {
      id: 2,
      nombre: "Proyecto de Tesis 2",
      carrera: "Ingeniería de Sistemas",
      orden: 2,
      estudiantes: 42,
    },
    {
      id: 3,
      nombre: "Tesis 1",
      carrera: "Ingeniería Industrial",
      orden: 1,
      estudiantes: 38,
    },
    {
      id: 4,
      nombre: "Tesis 2",
      carrera: "Ingeniería Industrial",
      orden: 2,
      estudiantes: 35,
    },
    {
      id: 5,
      nombre: "Proyecto de Investigación",
      carrera: "Administración",
      orden: 1,
      estudiantes: 50,
    },
    {
      id: 6,
      nombre: "Tesis",
      carrera: "Administración",
      orden: 2,
      estudiantes: 48,
    },
  ],
};

// Lista de carreras disponibles
const carreras = [
  { id: 1, nombre: "Ingeniería de Sistemas" },
  { id: 2, nombre: "Ingeniería Industrial" },
  { id: 3, nombre: "Administración" },
];

export default function DetalleCicloPage({}: {
  params: Promise<{ id: string }>;
}) {
  const [carreraSeleccionada, setCarreraSeleccionada] = useState("");
  const [busqueda, setBusqueda] = useState("");

  // Filtrar etapas formativas por carrera seleccionada y búsqueda
  const etapasFiltradas = ciclo.etapasFormativas.filter((etapa) => {
    const coincideCarrera = carreraSeleccionada
      ? etapa.carrera === carreraSeleccionada
      : true;
    const coincideBusqueda = etapa.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    return coincideCarrera && coincideBusqueda;
  });

  return (
    <div className="">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/administrador/configuracion/ciclos">
          <Button variant="ghost" size="icon">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Detalle del Ciclo</h1>
      </div>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle>{ciclo.nombre}</CardTitle>
            <Badge
              variant={ciclo.estado === "En curso" ? "default" : "secondary"}
            >
              {ciclo.estado}
            </Badge>
          </div>
          <Link href={`/administrador/configuracion/ciclos/${ciclo.id}/editar`}>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Edit size={16} />
              <span>Editar</span>
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Fecha de Inicio
              </h3>
              <p>{ciclo.fechaInicio}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Fecha de Fin
              </h3>
              <p>{ciclo.fechaFin}</p>
            </div>
          </div>
          {ciclo.descripcion && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Descripción
              </h3>
              <p className="text-gray-600">{ciclo.descripcion}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Etapas Formativas Asociadas
        </h2>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Buscar etapa formativa..."
                className="pl-8"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full md:w-64">
            <Select
              value={carreraSeleccionada}
              onValueChange={setCarreraSeleccionada}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por carrera" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las carreras</SelectItem>
                {carreras.map((carrera) => (
                  <SelectItem key={carrera.id} value={carrera.nombre}>
                    {carrera.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Card>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 text-left border-b">
              <th className="px-6 py-3 text-sm font-medium text-gray-500">
                Nombre
              </th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500">
                Carrera
              </th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500">
                Orden
              </th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500">
                Estudiantes
              </th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {etapasFiltradas.length > 0 ? (
              etapasFiltradas.map((etapa) => (
                <tr key={etapa.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium">
                    {etapa.nombre}
                  </td>
                  <td className="px-6 py-4 text-sm">{etapa.carrera}</td>
                  <td className="px-6 py-4 text-sm">{etapa.orden}</td>
                  <td className="px-6 py-4 text-sm">{etapa.estudiantes}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <Link
                        href={`/administrador/configuracion/etapas-formativas/${etapa.id}`}
                      >
                        <Button variant="ghost" size="sm">
                          Ver detalle
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-4 text-sm text-center text-gray-500"
                >
                  No se encontraron etapas formativas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
