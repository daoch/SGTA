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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { joinUsers } from "@/lib/temas/lib";
import { titleCase } from "@/lib/utils";
import { Eye } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  fetchCarrerasMiembroComite,
  listarTemasPorCarrera,
} from "../../types/solicitudes/data";
import { Tema } from "../../types/temas/entidades";
import { EstadoTemaNombre } from "../../types/temas/enums";

interface PropuestasTableProps {
  readonly filter?: string;
  readonly showPostulaciones?: boolean;
  readonly showEstado?: boolean;
  readonly showTipo?: boolean;
  readonly showCiclo?: boolean;
  readonly searchQuery?: string;
}

export function TemasTableCoordinador({
  filter,
  showPostulaciones = true,
  showEstado = true,
  showTipo = true,
  searchQuery = "",
}: PropuestasTableProps) {
  const [temas, setTemas] = useState<Tema[]>([]);
  const [loading, setLoading] = useState(true);
  const [carrerasIds, setCarrerasIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchTemas = async () => {
      try {
        setLoading(true);
        // Get CarrerasIds
        const carreras = await fetchCarrerasMiembroComite();
        const ids = (carreras || []).map((c) => c.id);
        setCarrerasIds(ids);

        if (ids.length > 0) {
          // Fetch temas
          const temasPorEstado = await Promise.all([
            listarTemasPorCarrera(ids[0], EstadoTemaNombre.REGISTRADO, 200, 0),
            listarTemasPorCarrera(ids[0], EstadoTemaNombre.INSCRITO, 200, 0),
            listarTemasPorCarrera(ids[0], EstadoTemaNombre.EN_PROGRESO, 200, 0),
            listarTemasPorCarrera(ids[0], EstadoTemaNombre.OBSERVADO, 200, 0),
          ]);
          // Save temas
          const data = temasPorEstado
            .filter(Boolean) // Remove null or undefined
            .flat();
          setTemas(data);
        }
      } catch (error) {
        console.error("Error At Fetching Registrados: " + error);
        setTemas([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTemas();
  }, []);

  // Filtrar por búsqueda
  let filtrados = temas;
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtrados = filtrados.filter(
      (tema) =>
        tema.coasesores?.[0]?.nombres?.toLowerCase().includes(query) ||
        tema.coasesores?.[0]?.primerApellido?.toLowerCase().includes(query) ||
        tema.coasesores?.[0]?.segundoApellido?.toLowerCase().includes(query) ||
        tema.tesistas?.[0]?.nombres?.toLowerCase().includes(query) ||
        tema.tesistas?.[0]?.primerApellido?.toLowerCase().includes(query) ||
        tema.tesistas?.[0]?.segundoApellido?.toLowerCase().includes(query) ||
        tema.titulo?.toLowerCase().includes(query),
    );
  }

  let tableContent;
  if (loading) {
    tableContent = (
      <TableRow>
        <TableCell
          colSpan={8}
          className="text-center py-8 text-muted-foreground"
        >
          Cargando temas ...
        </TableCell>
      </TableRow>
    );
  } else if (filtrados.length === 0) {
    tableContent = (
      <TableRow>
        <TableCell
          colSpan={8}
          className="text-center py-8 text-muted-foreground"
        >
          No hay propuestas disponibles
        </TableCell>
      </TableRow>
    );
  } else {
    // aca puse un cambio tema.coasesores?.[0]?.nombres prque no necesariamente hay coasesores
    // salia un error porque buscaba tema.coasesores?.[0].nombres y trataba de acceder nombres vacios
    tableContent = filtrados.map((tema) => (
      <TableRow key={tema.id}>
        <TableCell className="font-medium max-w-xs truncate">
          {tema.titulo}
        </TableCell>
        <TableCell>{tema.subareas?.[0]?.nombre || "-"}</TableCell>
        <TableCell>{tema.coasesores?.[0]?.nombres || "-"}</TableCell>
        <TableCell>
          {tema.tesistas && tema.tesistas.length > 0
            ? joinUsers(tema.tesistas)
            : "Sin asignar"}
        </TableCell>
        {/* {showPostulaciones && (
          <TableCell>{tema.postulaciones ?? "-"}</TableCell>
        )} // TODO */}
        {showEstado && (
          <TableCell>
            <Badge
              variant="outline"
              className="bg-green-100 text-green-800 hover:bg-green-100"
            >
              {titleCase(tema.estadoTemaNombre || "Registrado")}
            </Badge>
          </TableCell>
        )}
        {/* {showTipo && (
          <TableCell>
            <Badge
              variant="outline"
              className="bg-green-100 text-green-800 hover:bg-green-100"
            >
              {titleCase(tema.tipo || "-")}
            </Badge>
          </TableCell>
        )} */}
        {/* <TableCell>{tema.ciclo || "-"}</TableCell> */}
        <TableCell className="text-right">
          <div className="flex justify-end gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href={`/coordinador/temas/${tema.id}`} passHref>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Ver detalles</span>
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Ver detalles</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </DialogTrigger>
            </Dialog>
            {/* {tema.tipo === "general" && (
              <Button variant="ghost" size="icon" className="text-pucp-blue">
                <Send className="h-4 w-4" />
                <span className="sr-only">Postular</span>
              </Button>
            )}
            {tema.tipo === "directa" && (
              <>
                <Button variant="ghost" size="icon" className="text-red-500">
                  <X className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-green-500">
                  <CheckCircle className="h-4 w-4" />
                </Button>
              </>
            )} */}
          </div>
        </TableCell>
      </TableRow>
    ));
  }

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
              {/* {showPostulaciones && <TableHead>Postulaciones</TableHead>} // TODO */}
              {showEstado && <TableHead>Estado</TableHead>}
              {/* {showTipo && <TableHead>Tipo</TableHead>}
              <TableHead>Ciclo</TableHead> */}
              <TableHead className="text-right">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{tableContent}</TableBody>
        </Table>
      </div>
    </div>
  );
}

