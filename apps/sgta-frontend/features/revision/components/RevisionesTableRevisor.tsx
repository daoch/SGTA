"use client";

import {
  AlertTriangle,
  CheckCircle,
  Eye,
  FileText,
  Search
} from "lucide-react";
import Link from "next/link";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { DocumentoAgrupado } from "../dtos/DocumentoAgrupado";

interface RevisionesTableRevisorProps {
  data: DocumentoAgrupado[];
  filter?: string;
  searchQuery?: string;
  cursoFilter?: string;
}

export function RevisionesTableRevisor({
  data,
  filter,
  searchQuery = "",
  cursoFilter = "todos",
}: RevisionesTableRevisorProps) {

  // Filtrar las revisiones según los criterios
  let revisionesFiltradas = data;

  // Filtrar por estado
  if (filter) {
	revisionesFiltradas = revisionesFiltradas.filter(
	  (revision) => revision.estado === filter,
	);
  }

  // Filtrar por curso
  if (cursoFilter !== "todos") {
	revisionesFiltradas = revisionesFiltradas.filter(
	  (revision) => revision.curso === cursoFilter,
	);
  }

  if (searchQuery) {
	const query = searchQuery.toLowerCase();
	revisionesFiltradas = revisionesFiltradas.filter((revision) =>
	  revision.titulo.toLowerCase().includes(query) ||
	  revision.estudiantes.some(
		(est) =>
		  est.nombre.toLowerCase().includes(query) ||
		  est.codigo.includes(query)
	  )
	);
  }

  const renderEstudiantes = (estudiantes: { nombre: string; codigo: string }[]) => {
	if (estudiantes.length === 1) {
	  return (
		<div>
		  <div className="font-medium">{estudiantes[0].nombre}</div>
		  <div className="text-xs text-muted-foreground">{estudiantes[0].codigo}</div>
		</div>
	  );
	}

	return (
	  <div className="space-y-1">
		<div className="font-medium">
		  {estudiantes.length} estudiante{estudiantes.length > 1 ? "s" : ""}
		</div>
		<div className="text-xs text-muted-foreground break-words whitespace-pre-wrap">
		  {estudiantes.map((e) => `${e.nombre} (${e.codigo})`).join(", ")}
		</div>
	  </div>
	);
  };

  return (
	<div>
	  <div className="rounded-md border">
		<Table>
		  <TableHeader>
			<TableRow>
			  <TableHead>
				<span className="ml-2">Curso</span>
			  </TableHead>
			  <TableHead>Entregable</TableHead>
			  <TableHead>Documento</TableHead>
			  <TableHead>Estudiante</TableHead>
			  <TableHead>Similitud (%)</TableHead>
			  <TableHead>Gen. IA (%)</TableHead>
			  <TableHead>F. de Subida</TableHead>
			  <TableHead>Acciones</TableHead>
			</TableRow>
		  </TableHeader>
		  <TableBody>
			{revisionesFiltradas.length === 0 ? (
			  <TableRow>
				<TableCell
				  colSpan={8}
				  className="text-center py-8 text-muted-foreground"
				>
				  No hay revisiones disponibles
				</TableCell>
			  </TableRow>
			) : (
			  revisionesFiltradas.map((revision) => (
				<TableRow key={revision.id}>
				  <TableCell>
					<Badge variant="outline" className="bg-gray-100">
					  {revision.curso}
					</Badge>
				  </TableCell>
				  <TableCell className="font-medium max-w-xs truncate">
					<div className="flex items-center gap-2">
					  <span title={revision.entregable}>{revision.entregable}</span>
					</div>
				  </TableCell>
				  <TableCell className="font-medium max-w-xs truncate">
					<div className="flex items-center gap-2">
					  <span title={revision.titulo}>{revision.titulo}</span>
					</div>
				  </TableCell>
				  <TableCell className="max-w-xs">{renderEstudiantes(revision.estudiantes)}</TableCell>
				  <TableCell>
					{revision.porcentajeSimilitud !== null ? (
					  <div className="flex items-center gap-2">
						<span
						  className={
							revision.porcentajeSimilitud > 20
							  ? "text-red-600"
							  : revision.porcentajeSimilitud > 10
							  ? "text-yellow-600"
							  : "text-green-600"
						  }
						>
						  {revision.porcentajeSimilitud}%
						</span>
					  </div>
					) : (
					  <span className="text-muted-foreground">-</span>
					)}
				  </TableCell>
				  <TableCell>
					{revision.porcentajeGenIA !== null ? (
					  <div className="flex items-center gap-2">
						<span
						  className={
							revision.porcentajeGenIA > 20
							  ? "text-red-600"
							  : revision.porcentajeGenIA > 10
							  ? "text-yellow-600"
							  : "text-green-600"
						  }
						>
						  {revision.porcentajeGenIA}%
						</span>
					  </div>
					) : (
					  <span className="text-muted-foreground">-</span>
					)}
				  </TableCell>
				  <TableCell>
					<div className="flex items-center gap-2">
					  {new Date(revision.fechaEntrega).toLocaleDateString()}
					</div>
				  </TableCell>
				  <TableCell className="text-center">
					<div className="flex items-center gap-0.5">
					  {/* Botón "Ver detalles" (el ojito) */}
					  <Link href={`/revisor/revision/detalles-revision/${revision.id}`}>
						<Button variant="ghost" size="icon">
						  <Eye className="h-4 w-4" />
						  <span className="sr-only">Ver detalles</span>
						</Button>
					  </Link>
					  {/* Botón de estado: condicionalmente cambia el href */}
					  <Link
						href={
						  revision.estado === "pendiente"
							? `/revisor/revision/revisar-doc/${revision.id}`
							: `/revisor/revision/detalles-revision/${revision.id}`
						}
					  >
						<Button
						  variant="ghost"
						  size="sm"
						  className={
							revision.estado === "pendiente"
							  ? "text-yellow-600"
							  : revision.estado === "en_proceso"
							  ? "text-blue-600"
							  : revision.estado === "completados"
								? "text-green-600"
								: "text-muted-foreground"
						  }
						>
						  {revision.estado === "pendiente" ? (
							<>
							  <Search className="mr-1 h-4 w-4 text-yellow-600" />
							  <span className="text-yellow-600 font-semibold">Pendiente</span>
							</>
						  ) : revision.estado === "en_proceso" ? (
							<>
							  <Search className="mr-1 h-4 w-4 text-blue-600" />
							  <span className="text-blue-600 font-semibold">En proceso</span>
							</>
						  ) : revision.estado === "completados" ? (
							<>
							  <CheckCircle className="mr-1 h-4 w-4 text-green-600" />
							  <span className="text-green-600 font-semibold">Revisado</span>
							</>
						  ) : (
							<>
							  <Search className="mr-1 h-4 w-4 text-muted-foreground" />
							  <span className="text-muted-foreground font-semibold">Pendiente</span>
							</>
						  )}
						</Button>
					  </Link>

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
