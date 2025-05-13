"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, Eye, X } from "lucide-react";
import { useEffect, useState } from "react";

interface Postulacion {
  id: string;
  titulo: string;
  area: string;
  asesor: string;
  correoAsesor: string;
  fechaPostulacion: string;
  fechaLimite: string;
  estado: "pendiente" | "rechazado" | "aceptado";
  tipo: "general" | "directa";
  descripcion: string;
  comentarioAsesor: string;
}

interface PostulacionesTableProps {
  filter?: "general" | "directa";
  setSelectedPostulacion: (p: Postulacion) => void;
}

export function PostulacionesTable({ filter, setSelectedPostulacion }: PostulacionesTableProps) {
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
  const [searchTitulo, setSearchTitulo] = useState("");
  const [searchAsesor, setSearchAsesor] = useState("");
  const [areaFilter, setAreaFilter] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [directRes, generalRes] = await Promise.all([
          fetch(`http://localhost:5000/temas/listarPostulacionesDirectasAMisPropuestas/4`),
          fetch(`http://localhost:5000/temas/listarPostulacionesGeneralesAMisPropuestas/4`),
        ]);
        const [directData, generalData] = await Promise.all([directRes.json(), generalRes.json()]);

        const mapItem = (item: any, tipo: "general" | "directa"): Postulacion => {
          // asesor invitado (coasesor)
          const co = item.coasesores?.[0];
          const asesorNombre = co
            ? `${co.nombres} ${co.primerApellido} ${co.segundoApellido}`.trim()
            : "—";
          const correo = co?.correoElectronico || "";
          // estado: rechazado? item.rechazado===true → 'rechazado', false → 'aceptado', null → 'pendiente'
          const estado: Postulacion["estado"] =
            item.rechazado === true
              ? "rechazado"
              : item.rechazado === false
              ? "aceptado"
              : "pendiente";

          return {
            id: String(item.id),
            titulo: item.titulo,
            area: item.subareas?.[0]?.nombre || "—",
            asesor: asesorNombre,
            correoAsesor: correo,
            fechaPostulacion: new Date(item.fechaCreacion).toISOString().slice(0, 10),
            fechaLimite: item.fechaLimite?.slice(0, 10) || "",
            estado,
            tipo,
            descripcion: item.resumen,
            comentarioAsesor: "", // si tu API no devuelve comentario, déjalo vacío
          };
        };

        const directMapped = directData.map((i: any) => mapItem(i, "directa"));
        const generalMapped = generalData.map((i: any) => mapItem(i, "general"));

        setPostulaciones([...directMapped, ...generalMapped]);
      } catch (err) {
        console.error("Error cargando postulaciones:", err);
      }
    };

    fetchAll();
  }, []);

  // creamos lista de áreas únicas para el filtro
  const areasUnicas = Array.from(new Set(postulaciones.map((p) => p.area)));

  const postulacionesFiltradas = postulaciones.filter((p) => {
    const tituloMatch = p.titulo.toLowerCase().includes(searchTitulo.toLowerCase());
    const asesorMatch = p.asesor.toLowerCase().includes(searchAsesor.toLowerCase());
    const areaMatch = !areaFilter || p.area === areaFilter;
    const tipoMatch = !filter || p.tipo === filter;
    return tituloMatch && asesorMatch && areaMatch && tipoMatch;
  });

  const renderEstado = (estado: Postulacion["estado"]) => {
    switch (estado) {
      case "pendiente":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
      case "rechazado":
        return <Badge className="bg-red-100 text-red-800">Rechazado</Badge>;
      case "aceptado":
        return <Badge className="bg-green-100 text-green-800">Aceptado</Badge>;
    }
  };

  return (
    <div>
      {/* filtros */}
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
          onValueChange={(v) => setAreaFilter(v === "todas" ? null : v)}
        >
          <SelectTrigger className="md:w-1/3">
            <SelectValue placeholder="Todas las áreas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas las áreas</SelectItem>
            {areasUnicas.map((area) => (
              <SelectItem key={area} value={area}>
                {area}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* tabla */}
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
