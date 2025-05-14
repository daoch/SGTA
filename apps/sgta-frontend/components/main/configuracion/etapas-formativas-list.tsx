"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// Datos de ejemplo
const etapasFormativas = [
  {
    id: 1,
    nombre: "Proyecto de Tesis 1",
    carrera: "Ingeniería de Sistemas",
    estado: "En curso",
  },
  {
    id: 2,
    nombre: "Proyecto de Tesis 2",
    carrera: "Ingeniería de Sistemas",
    estado: "En curso",
  },
  {
    id: 3,
    nombre: "Tesis 1",
    carrera: "Ingeniería Industrial",
    estado: "En curso",
  },
  {
    id: 4,
    nombre: "Tesis 2",
    carrera: "Ingeniería Industrial",
    estado: "En curso",
  },
  {
    id: 5,
    nombre: "Proyecto de Tesis 1",
    carrera: "Ingeniería de Sistemas",
    estado: "Finalizado",
  },
  {
    id: 6,
    nombre: "Proyecto de Tesis 2",
    carrera: "Ingeniería de Sistemas",
    estado: "Finalizado",
  },
];

// Datos para filtros
const carreras = [
  { id: 1, nombre: "Ingeniería de Sistemas" },
  { id: 2, nombre: "Ingeniería Industrial" },
  { id: 3, nombre: "Administración" },
];

const estados = [
  { id: 1, nombre: "En curso" },
  { id: 2, nombre: "Finalizado" },
];

export function EtapasFormativasList() {
  const [carreraSeleccionada, setCarreraSeleccionada] = useState("");
  const [estadoSeleccionado, setEstadoSeleccionado] = useState("");
  const [busqueda, setBusqueda] = useState("");

  // Filtrar etapas formativas
  const etapasFiltradas = etapasFormativas.filter((etapa) => {
    const coincideCarrera = carreraSeleccionada ? etapa.carrera === carreraSeleccionada : true;
    const coincideEstado = estadoSeleccionado ? etapa.estado === estadoSeleccionado : true;
    const coincideBusqueda = etapa.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCarrera && coincideEstado && coincideBusqueda;
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
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
          <Select value={carreraSeleccionada} onValueChange={setCarreraSeleccionada}>
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
        <div className="w-full md:w-64">
          <Select value={estadoSeleccionado} onValueChange={setEstadoSeleccionado}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              {estados.map((estado) => (
                <SelectItem key={estado.id} value={estado.nombre}>
                  {estado.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-4 py-3 text-sm font-medium text-gray-500">Nombre</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500">Carrera</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500">Estado</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {etapasFiltradas.length > 0 ? (
              etapasFiltradas.map((etapa) => (
                <tr key={etapa.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium">{etapa.nombre}</td>
                  <td className="px-4 py-3 text-sm">{etapa.carrera}</td>
                  <td className="px-4 py-3 text-sm">
                    <Badge variant={etapa.estado === "En curso" ? "default" : "secondary"}>{etapa.estado}</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <Link href={`/admin/configuracion/etapas-formativas/${etapa.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye size={16} />
                        </Button>
                      </Link>
                      <Link href={`/admin/configuracion/etapas-formativas/${etapa.id}/editar`}>
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
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-3 text-sm text-center text-gray-500">
                  No se encontraron etapas formativas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
