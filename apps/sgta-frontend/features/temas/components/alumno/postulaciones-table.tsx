"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, Eye, X } from "lucide-react";
import { useEffect, useState } from "react";

interface Postulacion {
  id: string;
  titulo: string;
  area: string;
  asesor: string;
  correoAsesor: string;
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

export function PostulacionesTable({
  filter,
  setSelectedPostulacion,
}: PostulacionesTableProps) {
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
  const [searchTitulo, setSearchTitulo] = useState("");
  const [searchAsesor, setSearchAsesor] = useState("");
  const [areaFilter, setAreaFilter] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [dirRes, genRes] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/temas/listarPostulacionesDirectasAMisPropuestas/4`
          ),
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/temas/listarPostulacionesGeneralesAMisPropuestas/4`
          ),
        ]);
        const [dirData, genData] = await Promise.all([
          dirRes.json(),
          genRes.json(),
        ]);

        const directMapped: Postulacion[] = [];

        dirData.forEach((item: any) => {

          const coAceptado = item.coasesores.find((co: any) => co.asignado === true);
          if (coAceptado) {
            directMapped.push({
              id: `${item.id}-${coAceptado.id}`,
              titulo: item.titulo,
              area: item.subareas?.[0]?.nombre || "—",
              asesor: `${coAceptado.nombres} ${coAceptado.primerApellido ?? ""}`.trim(),
              correoAsesor: coAceptado.correoElectronico ?? "",
              fechaLimite: item.fechaLimite?.slice(0, 10) || "",
              estado: "aceptado",
              tipo: "directa",
              descripcion: item.resumen ?? "",
              comentarioAsesor: "",
            });
            return;
          }

          if (item.estadoTemaNombre === "RECHAZADO") {
            item.coasesores.forEach((co: any) => {
              directMapped.push({
                id: `${item.id}-${co.id}`,
                titulo: item.titulo,
                area: item.subareas?.[0]?.nombre || "—",
                asesor: `${co.nombres} ${co.primerApellido ?? ""}`.trim(),
                correoAsesor: co.correoElectronico ?? "",
                fechaLimite: item.fechaLimite?.slice(0, 10) || "",
                estado: "rechazado",
                tipo: "directa",
                descripcion: item.resumen ?? "",
                comentarioAsesor: "",
              });
            });
          }
        });

        const generalMapped: Postulacion[] = genData.flatMap((item: any) => {
          if (!item.coasesores?.length) return [];
          return item.coasesores.map((co: any) => {
            const estado: Postulacion["estado"] =
              co.rechazado === true
                ? "rechazado"
                : co.rechazado === false
                ? "aceptado"
                : "pendiente";

            return {
              id: `${item.id}-${co.id}`,
              titulo: item.titulo,
              area: item.subareas?.[0]?.nombre || "—",
              asesor: `${co.nombres} ${co.primerApellido ?? ""}`.trim(),
              correoAsesor: co.correoElectronico ?? "",
              fechaLimite: item.fechaLimite?.slice(0, 10) || "",
              estado,
              tipo: "general",
              descripcion: item.resumen ?? "",
              comentarioAsesor: "",
            };
          });
        });

        setPostulaciones([...directMapped, ...generalMapped]);
      } catch (err) {
        console.error("Error cargando postulaciones:", err);
      }
    }

    fetchAll();
  }, []);

  // Áreas únicas
  const areasUnicas = Array.from(new Set(postulaciones.map((p) => p.area)));

  // Filtrar por texto, área y tipo
  const postulacionesFiltradas = postulaciones.filter((p) => {
    const matchTitulo = p.titulo
      .toLowerCase()
      .includes(searchTitulo.toLowerCase());
    const matchAsesor = p.asesor
      .toLowerCase()
      .includes(searchAsesor.toLowerCase());
    const matchArea = !areaFilter || p.area === areaFilter;
    const matchTipo = !filter || p.tipo === filter;
    return matchTitulo && matchAsesor && matchArea && matchTipo;
  });

  // Badge de estado
  const renderEstado = (e: Postulacion["estado"]) => {
    switch (e) {
      case "pendiente":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
        );
      case "rechazado":
        return (
          <Badge className="bg-red-100 text-red-800">Rechazado</Badge>
        );
      case "aceptado":
        return (
          <Badge className="bg-green-100 text-green-800">Aceptado</Badge>
        );
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
          onValueChange={(v) => setAreaFilter(v === "todas" ? null : v)}
        >
          <SelectTrigger className="md:w-1/3">
            <SelectValue placeholder="Todas las áreas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas las áreas</SelectItem>
            {areasUnicas.map((a) => (
              <SelectItem key={a} value={a}>
                {a}
              </SelectItem>
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
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {postulacionesFiltradas.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-6 text-muted-foreground"
                >
                  No hay postulaciones
                </TableCell>
              </TableRow>
            ) : (
              postulacionesFiltradas.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="max-w-xs truncate">
                    {p.titulo}
                  </TableCell>
                  <TableCell>{p.area}</TableCell>
                  <TableCell>{p.asesor}</TableCell>
                  <TableCell>{renderEstado(p.estado)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedPostulacion(p)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {p.estado === "pendiente" && (
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
