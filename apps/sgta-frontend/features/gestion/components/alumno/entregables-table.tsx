"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Upload } from "lucide-react";
import { useState } from "react";
import { Entregable } from "../../types/entregables/entidades";
import { EntregablesModal } from "./subida-entregable-modal";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EntregableDto } from "../../dtos/EntregableDto";

interface EntregablesTableProps {
    filter?: string,
    entregablesData?: EntregableDto[],
}

export function EntregablesTable({ filter, entregablesData }: EntregablesTableProps) {
    const [estadoFilter, setEstadoFilter] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedEntregable, setSelectedEntregable] = useState< EntregableDto | null>(null);
    const [comentario, setComentario] = useState("");
    const router = useRouter();

    
        const entregablesFiltradas = (entregablesData ?? []).filter((entregable: EntregableDto) => {
            // Filtrar por tipo
            if (filter && filter != "Todos" && entregable.estado.toLowerCase() !== filter.toLowerCase()) {
                return false;
            }

            if (estadoFilter && entregable.estado !== estadoFilter && filter != "Todos") {
                return false;
            }
           
            return true;
        });
    

    const handleOpenDialog = (entregable: EntregableDto) => {
        setSelectedEntregable(entregable);
    };

    return(
        <div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Entregable</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Fecha limite</TableHead>
                            <TableHead>Fecha Entrega</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {entregablesFiltradas.length === 0? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                    No hay entregables disponibles
                                </TableCell>
                            </TableRow>
                        ):(
                            entregablesFiltradas.map((entregable)=>(
                                <TableRow key={entregable.id}>
                                    <TableCell>{entregable.id}</TableCell>
                                    <TableCell className="font-medium max-w-xs truncate">{entregable.nombre}</TableCell>
                                    <TableCell>{entregable.fechaFin ? new Date(entregable.fechaFin).toLocaleDateString("es-PE") : "-"}</TableCell>
                                    <TableCell>{entregable.fechaEnvio ? new Date(entregable.fechaEnvio).toLocaleDateString("es-PE") : "-"}</TableCell>
                                    <TableCell>
                                        <Badge
                                        variant="outline"
                                        className={
                                            entregable.estado === "no_iniciado"
                                                ? "bg-gray-100 text-gray-800 hover:bg-gray-100"
                                                : entregable.estado === "Revisado"
                                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                                : entregable.estado === "En Revisión"
                                                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                                : "bg-purple-100 text-purple-800 hover:bg-purple-100" 
                                        }
                                        >
                                        {entregable.estado === "no_iniciado"
                                        ? "Pendiente"
                                        : entregable.estado}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-end gap-2">
                                            {entregable.estado != "no_iniciado" && (
                                                <Dialog> 
                                                    <Link href={`/alumno/mi-proyecto/entregables/${entregable.id}`} passHref>
                                                        <Button variant="ghost" size="icon">
                                                            <Eye className="h-4 w-4" />
                                                            <span className="sr-only">Ver detalles</span>
                                                        </Button>
                                                    </Link>
                                                </Dialog>
                                            )}
                                            {entregable.estado === "no_iniciado" && (
                                                <Dialog> 
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" onClick={() =>handleOpenDialog(entregable)}>
                                                            <Upload className="h-4 w-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    { selectedEntregable &&(
                                                        <EntregablesModal
                                                            data={selectedEntregable} 
                                                            setSelectedEntregable={setSelectedEntregable} 
                                                            setComentario={setComentario}
                                                        ></EntregablesModal>
                                                    )}
                                                </Dialog>
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
};