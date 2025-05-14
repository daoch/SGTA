"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

// Datos de ejemplo
const carreras = [
  {
    id: 1,
    codigo: "INF",
    nombre: "Ingeniería Informática",
    facultad: "Facultad de Ciencias e Ingeniería",
    estado: "Activo",
  },
  {
    id: 2,
    codigo: "CIV",
    nombre: "Ingeniería Civil",
    facultad: "Facultad de Ciencias e Ingeniería",
    estado: "Activo",
  },
  {
    id: 3,
    codigo: "IND",
    nombre: "Ingeniería Industrial",
    facultad: "Facultad de Ciencias e Ingeniería",
    estado: "Activo",
  },
  {
    id: 4,
    codigo: "MEC",
    nombre: "Ingeniería Mecánica",
    facultad: "Facultad de Ciencias e Ingeniería",
    estado: "Inactivo",
  },
  {
    id: 5,
    codigo: "ADM",
    nombre: "Administración",
    facultad: "Facultad de Ciencias Empresariales",
    estado: "Activo",
  },
];

// Unidades académicas disponibles
const unidadesAcademicas = [
  { id: 1, nombre: "Facultad de Ciencias e Ingeniería" },
  { id: 2, nombre: "Facultad de Ciencias Empresariales" },
];

export function CarrerasList() {
  const [unidadAcademica, setUnidadAcademica] = useState("1"); // Por defecto, Facultad de Ciencias e Ingeniería

  // Filtrar carreras por unidad académica seleccionada
  const carrerasFiltradas = carreras.filter(
    (carrera) => carrera.facultad === unidadesAcademicas.find((u) => u.id.toString() === unidadAcademica)?.nombre,
  );

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="unidadAcademica" className="block text-sm font-medium text-gray-700 mb-1">
          Filtrar por Unidad Académica
        </label>
        <Select value={unidadAcademica} onValueChange={setUnidadAcademica}>
          <SelectTrigger id="unidadAcademica" className="w-full md:w-72">
            <SelectValue placeholder="Seleccionar unidad académica" />
          </SelectTrigger>
          <SelectContent>
            {unidadesAcademicas.map((unidad) => (
              <SelectItem key={unidad.id} value={unidad.id.toString()}>
                {unidad.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-4 py-3 text-sm font-medium text-gray-500">Código</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500">Nombre</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500">Estado</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {carrerasFiltradas.map((carrera) => (
              <tr key={carrera.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium">{carrera.codigo}</td>
                <td className="px-4 py-3 text-sm">{carrera.nombre}</td>
                <td className="px-4 py-3 text-sm">
                  <Badge variant={carrera.estado === "Activo" ? "default" : "secondary"}>{carrera.estado}</Badge>
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex gap-2">
                    <Link href={`/admin/configuracion/carreras/${carrera.id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye size={16} />
                      </Button>
                    </Link>
                    <Link href={`/admin/configuracion/carreras/${carrera.id}/editar`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit size={16} />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
