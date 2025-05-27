"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Upload } from "lucide-react";
import { useState } from "react";
import { EntregablesModal } from "./subida-entregable-modal";
import Link from "next/link";
import { EntregableAlumnoDto } from "../../dtos/EntregableAlumnoDto";

interface EntregablesTableProps {
    filter?: string,
    entregables?: EntregableAlumnoDto[],
}

export function EntregablesTable({ filter, entregables }: EntregablesTableProps) {
    const [selectedEntregable, setSelectedEntregable] = useState< EntregableAlumnoDto | null>(null);

    
        const entregablesFiltradas = (entregables ?? []).filter((entregable: EntregableAlumnoDto) => {
            // Filtrar por tipo
            if (filter && filter != "Todos" && entregable.entregableEstado.toLowerCase() !== filter.toLowerCase()) {
                return false;
            }
            return true;
        });
    

    const handleOpenDialog = (entregable: EntregableAlumnoDto) => {
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
                                <TableRow key={entregable.entregableId}>
                                    <TableCell>{entregable.entregableId}</TableCell>
                                    <TableCell className="font-medium max-w-xs truncate">{entregable.entregableNombre}</TableCell>
                                    <TableCell>{entregable.entregableFechaFin ? new Date(entregable.entregableFechaFin).toLocaleDateString("es-PE") : "-"}</TableCell>
                                    <TableCell>{entregable.entregableFechaEnvio ? new Date(entregable.entregableFechaEnvio).toLocaleDateString("es-PE") : "-"}</TableCell>
                                    <TableCell>
                                        {(() => {
                                            let badgeClass = "bg-purple-100 text-purple-800 hover:bg-purple-100";
                                            if (entregable.entregableEstado === "no_iniciado") {
                                                badgeClass = "bg-gray-100 text-gray-800 hover:bg-gray-100";
                                            } else if (entregable.entregableEstado === "Revisado") {
                                                badgeClass = "bg-green-100 text-green-800 hover:bg-green-100";
                                            } else if (entregable.entregableEstado === "En Revisión") {
                                                badgeClass = "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
                                            }
                                            return (
                                                <Badge variant="outline" className={badgeClass}>
                                                    {entregable.entregableEstado === "no_iniciado"
                                                        ? "Pendiente"
                                                        : entregable.entregableEstado}
                                                </Badge>
                                            );
                                        })()}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-end gap-2">
                                            {entregable.entregableEstado != "no_iniciado" && (
                                                <Dialog> 
                                                    <Link href={`/alumno/mi-proyecto/entregables/${entregable.entregableId}`} passHref>
                                                        <Button variant="ghost" size="icon">
                                                            <Eye className="h-4 w-4" />
                                                            <span className="sr-only">Ver detalles</span>
                                                        </Button>
                                                    </Link>
                                                </Dialog>
                                            )}
                                            {entregable.entregableEstado === "no_enviado" && (
                                                <Dialog> 
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" onClick={() =>handleOpenDialog(entregable)}>
                                                            <Upload className="h-4 w-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    { selectedEntregable &&(
                                                        <EntregablesModal
                                                            entregable={selectedEntregable} 
                                                            setSelectedEntregable={setSelectedEntregable}
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