"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, X, CheckCircle } from "lucide-react";

interface Postulacion {
    id: string;
    titulo: string;
    area: string;
    asesor: string;
    correoAsesor: string;
    fechaPostulacion: string;
    fechaLimite: string;
    estado: string;
    tipo: "general" | "directa";
    descripcion: string;
    comentarioAsesor: string;
  }

interface PostulacionesTableProps {
  filter?: "general" | "directa";
  setSelectedPostulacion: (p: Postulacion) => void;
}

const postulacionesData: Postulacion[] = [
    {
      id: "1",
      titulo: "Análisis de sentimientos en redes sociales para detección de tendencias de mercado",
      area: "Ciencia de Datos",
      asesor: "Dra. Carmen Vega",
      correoAsesor: "carmen.vega@pucp.edu.pe",
      fechaPostulacion: "2023-11-14",
      fechaLimite: "2023-12-19",
      estado: "pendiente",
      tipo: "general",
      descripcion:
        "Propuesta para desarrollar un sistema de análisis de sentimientos en redes sociales que permita detectar tendencias de mercado y opiniones sobre productos o servicios. El sistema procesará datos de Twitter, Facebook e Instagram para generar insights valiosos para empresas.",
      comentarioAsesor:
        "Me interesa mucho tu propuesta sobre análisis de sentimientos. Tengo experiencia en este campo y podría ayudarte a desarrollar un modelo más preciso utilizando técnicas avanzadas de NLP."
    },
    {
      id: "2",
      titulo: "Desarrollo de una plataforma de e-learning con IA",
      area: "Desarrollo Web",
      asesor: "Dr. Miguel Torres",
      correoAsesor: "miguel.torres@pucp.edu.pe",
      fechaPostulacion: "2023-11-17",
      fechaLimite: "2023-12-22",
      estado: "rechazado",
      tipo: "directa",
      descripcion:
        "Se busca crear una plataforma de educación virtual que emplee algoritmos de inteligencia artificial para personalizar los contenidos según el perfil de cada estudiante. Además, se integrarán módulos de seguimiento de progreso y retroalimentación automática.",
      comentarioAsesor:
        "Considero que esta propuesta tiene gran potencial. Cuento con experiencia previa desarrollando plataformas similares y puedo aportar en la parte de IA y arquitectura del sistema."
    }
  ];
  

const areasUnicas = Array.from(new Set(postulacionesData.map((p) => p.area)));

export function PostulacionesTable({ filter, setSelectedPostulacion }: PostulacionesTableProps) {
  const [searchTitulo, setSearchTitulo] = useState("");
  const [searchAsesor, setSearchAsesor] = useState("");
  const [areaFilter, setAreaFilter] = useState<string | null>(null);

  const postulacionesFiltradas = postulacionesData.filter((p) => {
    const tituloMatch = p.titulo.toLowerCase().includes(searchTitulo.toLowerCase());
    const asesorMatch = p.asesor.toLowerCase().includes(searchAsesor.toLowerCase());
    const areaMatch = !areaFilter || p.area === areaFilter;
    const tipoMatch = !filter || p.tipo === filter;
    return tituloMatch && asesorMatch && areaMatch && tipoMatch;
  });

  const renderEstado = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
      case "rechazado":
        return <Badge className="bg-red-100 text-red-800">Rechazado</Badge>;
      case "aceptado":
        return <Badge className="bg-green-100 text-green-800">Aceptado</Badge>;
      default:
        return <Badge>{estado}</Badge>;
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
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
        <Select
          value={areaFilter || "todas"}
          onValueChange={(value) => setAreaFilter(value === "todas" ? null : value)}
        >
          <SelectTrigger className="md:w-1/3">
            <SelectValue placeholder="Todas las áreas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas las áreas</SelectItem>
            {areasUnicas.map((area) => (
              <SelectItem key={area} value={area}>{area}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tema</TableHead>
              <TableHead>Área</TableHead>
              <TableHead>Asesor</TableHead>
              <TableHead>Fecha Postulación</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {postulacionesFiltradas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  No hay postulaciones
                </TableCell>
              </TableRow>
            ) : (
              postulacionesFiltradas.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="max-w-xs truncate">{p.titulo}</TableCell>
                  <TableCell>{p.area}</TableCell>
                  <TableCell>{p.asesor}</TableCell>
                  <TableCell>{p.fechaPostulacion}</TableCell>
                  <TableCell>{renderEstado(p.estado)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => setSelectedPostulacion(p)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {p.estado === "pendiente" && (
                        <>
                          <Button variant="ghost" size="icon" className="text-red-500">
                            <X className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-green-500">
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
