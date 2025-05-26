"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ReunionesAsesorModal } from "../components/reuniones-asersor-modal";

// Ciclos disponibles
const ciclos = ["2023-1", "2024-2", "2025-1"];

// Cursos por ciclo
const cursosPorCiclo: Record<string, { codigo: string; nombre: string }[]> = {
  "2023-1": [
    { codigo: "1INF40", nombre: "Taller de Innovación" },
    { codigo: "1INF41", nombre: "Proyecto Integrador 1" },
  ],
  "2024-2": [
    { codigo: "1INF47", nombre: "Seminario de Tesis" },
  ],
  "2025-1": [
    { codigo: "1INF46", nombre: "Proyecto de Fin de Carrera 2" },
    { codigo: "1INF48", nombre: "Proyecto de Innovación" },
  ],
};

// Datos quemados de ejemplo
const asesoresDummy = [
  {
    asesor: "Julia Ríos García",
    codAsesor: "AS123",
    tesista: "Carlos Herrera",
    codTesista: "TS456",
    estado: "Activo",
    ciclo: "2025-1",
    curso: "1INF46",
  },
  {
    asesor: "Pablo Díaz Rojas",
    codAsesor: "AS124",
    tesista: "Lucía Pérez",
    codTesista: "TS457",
    estado: "Finalizado",
    ciclo: "2024-2",
    curso: "1INF47",
  },
  {
    asesor: "Diego Torres López",
    codAsesor: "AS123",
    tesista: "Carlos Herrera",
    codTesista: "TS456",
    estado: "Activo",
    ciclo: "2025-1",
    curso: "1INF46",
  },
  {
    asesor: "Angie Martínez Sánchez",
    codAsesor: "AS124",
    tesista: "Lucía Pérez",
    codTesista: "TS457",
    estado: "Finalizado",
    ciclo: "2024-2",
    curso: "1INF47",
  },
];

export default function ReunionesAsesoresPage() {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [cicloSeleccionado, setCicloSeleccionado] = useState<string | undefined>(undefined);
    const [cursoSeleccionado, setCursoSeleccionado] = useState<string | undefined>(undefined);

    const handleCicloChange = (value: string) => {
        setCicloSeleccionado(value);
        const primerCurso = cursosPorCiclo[value]?.[0]?.codigo ?? "";
        setCursoSeleccionado(primerCurso);
    };

    const filtrados = asesoresDummy.filter((a) => {
        const matchesSearch =
            a.asesor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.codAsesor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.tesista.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.codTesista.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCiclo = !cicloSeleccionado || a.ciclo === cicloSeleccionado;
        const matchesCurso = !cursoSeleccionado || a.curso === cursoSeleccionado;

        return matchesSearch && matchesCiclo && matchesCurso;
    });

    return (
        
        <div className="space-y-6 mt-4">
            <h1 className="text-3xl font-bold text-[#042354]">Reuniones</h1>
            <div className="flex flex-col md:flex-row items-center gap-3 w-full">
                <Input
                    type="search"
                    placeholder="Buscar por nombre o código"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="md:w-[300px] w-full"
                />
                <Select
                    value={cicloSeleccionado}
                    onValueChange={(value) => {
                        if (value === "TODOS") {
                        setCicloSeleccionado(undefined);
                        setCursoSeleccionado(undefined);
                        } else {
                        setCicloSeleccionado(value);
                        setCursoSeleccionado(undefined);
                        }
                    }}
                >
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Ciclo" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="TODOS">Todos</SelectItem>
                        {ciclos.map((ciclo) => (
                            <SelectItem key={ciclo} value={ciclo}>
                                {ciclo}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select
                    value={cursoSeleccionado}
                    onValueChange={(value) => {
                        if (value === "TODOS") {
                        setCursoSeleccionado(undefined);
                        } else {
                        setCursoSeleccionado(value);
                        }
                    }}
                    disabled={!cicloSeleccionado}
                >
                    <SelectTrigger className="w-[220px]">
                        <SelectValue placeholder="Curso" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="TODOS">Todos</SelectItem>
                        {(cursosPorCiclo[cicloSeleccionado || ""] || []).map((curso) => (
                            <SelectItem key={curso.codigo} value={curso.codigo}>
                                {curso.nombre}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="rounded-md border text-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-100 text-gray-800">
                        <TableHead>Asesor</TableHead>
                        <TableHead>Código</TableHead>
                        <TableHead>Tesista</TableHead>
                        <TableHead>Código Tesista</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Curso</TableHead>
                        <TableHead>Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtrados.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                                No se encontraron resultados.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtrados.map((fila, i) => (
                                <TableRow key={i}>
                                <TableCell>{fila.asesor}</TableCell>
                                <TableCell>{fila.codAsesor}</TableCell>
                                <TableCell>{fila.tesista}</TableCell>
                                <TableCell>{fila.codTesista}</TableCell>
                                <TableCell>{fila.estado}</TableCell>
                                <TableCell>
                                    {cursosPorCiclo[fila.ciclo]?.find((c) => c.codigo === fila.curso)?.nombre ??
                                    fila.curso}
                                </TableCell>
                                <TableCell>
                                    <Dialog open={open} onOpenChange={setOpen}>
                                        <DialogTrigger asChild>
                                        <Button variant="outline">
                                            Ver reuniones
                                        </Button>
                                        </DialogTrigger>
                                        <ReunionesAsesorModal onClose={() => setOpen(false)} />
                                    </Dialog>
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
