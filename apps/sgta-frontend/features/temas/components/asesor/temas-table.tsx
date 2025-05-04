"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { titleCase } from "@/lib/utils";
import { CheckCircle, Eye, Send, X } from "lucide-react";
// Datos de ejemplo
const temasData = [
  {
    id: 1,
    titulo: "Implementación de algoritmos de aprendizaje",
    area: "Inteligencia Artificial",
    asesor: "Dr. Roberto Sánchez",
    estudiantes: [{ nombre: "Carlos Mendoza", codigo: "" }],
    postulaciones: null,
    estado: "aprobado",
    tipo: "inscrito",
    ciclo: "2023-2",
    descripcion: "",
    coasesores: [],
    recursos: [{ nombre: "", tipo: "", fecha: "" }],
  },
  {
    id: 2,
    titulo: "Desarrollo de un sistema de monitoreo",
    area: "Internet de las Cosas",
    asesor: "Dr. Roberto Sánchez",
    estudiantes: null,
    postulaciones: 3,
    estado: "disponible",
    tipo: "libre",
    ciclo: "2023-2",
    descripcion: "",
    coasesores: [],
    recursos: [{ nombre: "", tipo: "", fecha: "" }],
  },
  {
    id: 3,
    titulo: "Análisis comparativo de frameworks de desarrollo web",
    area: "Desarrollo Web",
    asesor: "Dr. Miguel Torres",
    estudiantes: [
      { nombre: "Luis Rodríguez", codigo: "" },
      { nombre: "María Pérez", codigo: "" },
    ],
    postulaciones: null,
    estado: "aprobado",
    tipo: "interesado",
    ciclo: "2023-1",
    descripcion: "",
    coasesores: [],
    recursos: [{ nombre: "", tipo: "", fecha: "" }],
  },
  {
    id: 4,
    titulo: "Diseño e implementación de un sistema de datos",
    area: "Ciencia de Datos",
    asesor: "Dr. Roberto Sánchez",
    estudiantes: [{ nombre: "María Torres", codigo: "" }],
    postulaciones: null,
    estado: "aprobado",
    tipo: "inscrito",
    ciclo: "2023-2",
    descripcion: "",
    coasesores: [],
    recursos: [{ nombre: "", tipo: "", fecha: "" }],
  },
  {
    id: 5,
    titulo: "Optimización de consultas en bases de datos",
    area: "Bases de Datos",
    asesor: "Dr. Roberto Sánchez",
    estudiantes: null,
    postulaciones: 5,
    estado: "disponible",
    tipo: "libre",
    ciclo: "2023-2",
    descripcion: "",
    coasesores: [],
    recursos: [{ nombre: "", tipo: "", fecha: "" }],
  },
];

// Obtener todas las áreas únicas para el filtro
//const areasUnicas = Array.from(new Set(temasData.map((tema) => tema.area)));

interface PropuestasTableProps {
  filter?: string;
}

export function TemasTable({ filter }: PropuestasTableProps) {
  const propuestasFiltradas = temasData.filter((tema) => {
    // Filtrar todo
    if (filter === null || filter === "todos") return true;

    // Filtrar por tipo
    if (filter && tema.tipo !== filter) {
      return false;
    }
    return true;
  });

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Área</TableHead>
              <TableHead>Asesor</TableHead>
              <TableHead>Estudiante(s)</TableHead>
              <TableHead>Postulaciones</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Ciclo</TableHead>
              <TableHead className="text-right">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {propuestasFiltradas.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  No hay propuestas disponibles
                </TableCell>
              </TableRow>
            ) : (
              propuestasFiltradas.map((tema) => (
                <TableRow key={tema.id}>
                  <TableCell className="font-medium max-w-xs truncate">
                    {tema.titulo}
                  </TableCell>
                  <TableCell>{tema.area}</TableCell>
                  <TableCell>{tema.asesor}</TableCell>
                  <TableCell>
                    {!tema.estudiantes
                      ? "Sin asignar"
                      : tema.estudiantes.map((e) => e.nombre).join(", ")}
                  </TableCell>
                  <TableCell>
                    {!tema.postulaciones ? "-" : tema.postulaciones}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        tema.tipo === "directa"
                          ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
                          : "bg-green-100 text-green-800 hover:bg-green-100"
                      }
                    >
                      {titleCase(tema.estado)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        tema.tipo === "directa"
                          ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
                          : "bg-green-100 text-green-800 hover:bg-green-100"
                      }
                    >
                      {titleCase(tema.tipo)}
                    </Badge>
                  </TableCell>
                  <TableCell>{tema.ciclo}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Ver detalles</span>
                          </Button>
                        </DialogTrigger>
                      </Dialog>
                      {tema.tipo === "general" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-pucp-blue"
                        >
                          <Send className="h-4 w-4" />
                          <span className="sr-only">Postular</span>
                        </Button>
                      )}
                      {tema.tipo === "directa" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-green-500"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
