"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/features/auth";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ReunionesAsesorModal } from "../components/reuniones-asersor-modal";
import { ReunionesXUsuariosDto } from "../dtos/ReunionesXUsuariosDto";
import { getReunionesXAlumno } from "../services/reuniones-asesor-service";
import { getIdByCorreo } from "@/features/asesores/hooks/perfil/perfil-apis";
import { CarreraDto } from "../dtos/CarreraDto";
import { getCarrerasByUsuario } from "../services/carreras-usuario-service";
import { getAsesoresTesistasPorCarrera } from "../services/asesor-tesista-service";
import { AsesorTesistaDto } from "../dtos/AsesorTesistaDto";
import { EtapaFormativaDto } from "../dtos/EtapaFormativa";
import { getEtapasFormativasDelCoordinador } from "../services/etapas-formativas-coordinador-service";

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

export default function ReunionesAsesoresPage() {
    const { user } = useAuth();
    const [userId, setUserId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [cicloSeleccionado, setCicloSeleccionado] = useState<string | undefined>(undefined);
    const [etapaFormativaSeleccionada, setEtapaFormativaSeleccionada] = useState<EtapaFormativaDto | null>(null);
    const[etapasFormativas, setEtapasFormativas] = useState<EtapaFormativaDto[]>([]);
    const [alumnosXasesores, setAlumnosXasesores] = useState<AsesorTesistaDto[]>([]);
    const hasFetchedId = useRef(false);
    const [carreraCoordinada, setCarreraCoordinada] = useState<CarreraDto | null>(null);

    //Obtener el ID del usuario una sola vez
    const loadUsuarioId = async () => {
        if (!user) return;

        try {
            const id = await getIdByCorreo(user.email);
            if (id !== null) {
                setUserId(id);
                console.log("ID del usuario obtenido:", id);
            } else {
                console.warn("No se encontró un ausuario con ese correo.");
            }
        } catch (error) {
            console.error("Error inesperado al obtener el ID del usuario:", error);
        }
    };

    useEffect(() => {
        if (user && !hasFetchedId.current) {
            hasFetchedId.current = true;
            loadUsuarioId();
        }
    }, [user]);

    // Obtener la carrera coordinada por el usuario una vez que se tenga el ID
    useEffect(() => {
        if (userId !== null) {
            const fetchCarreraCoordinada = async () => {
                try {
                    const carrera = await getCarrerasByUsuario(userId);
                    setCarreraCoordinada(carrera[0]); 
                    console.log("Carrera coordinada obtenida:", carrera[0]);
                } catch (error) {
                    console.error("Error al obtener la carrera coordinada:", error);
                }
            };

            fetchCarreraCoordinada();
        }
    }, [userId]);

    useEffect(() => {
        const fetchEtapas = async () => {
            if (userId == null) return; // valida null y undefined

            try {
            const etapas = await getEtapasFormativasDelCoordinador(userId);
            setEtapasFormativas(etapas);
            console.log("Etapas formativas del coordinador:", etapas);
            } catch (error) {
            console.error("Error al obtener etapas formativas:", error);
            }
        };

        fetchEtapas();
    }, [userId]);


    //Obtener asesores con sus alumnos
    useEffect(() => {
        const fetchAsesorTesista = async () => {
            if (!carreraCoordinada) return; // si no hay carrera, no hace nada

            try {
                const resultado = await getAsesoresTesistasPorCarrera(carreraCoordinada.nombre);
                setAlumnosXasesores(resultado);
                console.log("datos asesor-tesista recibidos:", resultado);
            } catch (error) {
                console.error("Error al obtener asesores y tesistas:", error);
            }
        };

        fetchAsesorTesista();
    }, [carreraCoordinada]);


    const filtrados = alumnosXasesores
        .map((r) => ({
            asesor: r.asesorNombre + " " + r.asesorPrimerApellido + " " + r.asesorSegundoApellido,
            tesista: r.tesistaNombre + " " + r.tesistaPrimerApellido + " " + r.tesistaSegundoApellido,
            asesorCodigoPucp: r.asesorCodigoPucp,
            tesistaCodigoPucp: r.tesistaCodigoPucp,
            codAsesor: r.asesorEmail,
            codTesista: r.tesistaEmail,
            estado: "-", 
            etapaFormativaNombre: r.etapaFormativaNombre,
            asesorId: r.asesorId,
            alumnoId: r.tesistaId,
        }))
        .filter((a) => {
            const matchesSearch =
            a.asesor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.asesorCodigoPucp.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.tesista.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.tesistaCodigoPucp.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCurso = !etapaFormativaSeleccionada || a.etapaFormativaNombre === etapaFormativaSeleccionada.nombre;

            return matchesSearch && matchesCurso;
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
                    value={etapaFormativaSeleccionada?.nombre || "TODOS"}
                    onValueChange={(value) => {
                    if (value === "TODOS") {
                        setEtapaFormativaSeleccionada(null);
                    } else {
                        const etapaSeleccionada = etapasFormativas.find(e => e.nombre === value);
                        setEtapaFormativaSeleccionada(etapaSeleccionada || null);
                    }
                    }}
                >
                    <SelectTrigger className="w-[220px]">
                        <SelectValue placeholder="Curso" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="TODOS">Todos</SelectItem>
                            {etapasFormativas.map((etapa) => (
                                <SelectItem key={etapa.id} value={etapa.nombre}>
                                    {etapa.nombre}
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
                        <TableHead>Código Asesor</TableHead>
                        <TableHead>Tesista</TableHead>
                        <TableHead>Código Tesista</TableHead>
                        <TableHead>Etapa Formativa</TableHead>
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
                                <TableCell>{fila.asesorCodigoPucp}</TableCell>
                                <TableCell>{fila.tesista}</TableCell>
                                <TableCell>{fila.tesistaCodigoPucp}</TableCell>
                                <TableCell>{fila.etapaFormativaNombre}</TableCell>
                                <TableCell>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline">Ver reuniones</Button>
                                        </DialogTrigger>
                                        <ReunionesAsesorModal 
                                            asesorId={fila.asesorId}
                                            alumnoId={fila.alumnoId}
                                            onClose={() => {}} 
                                        />
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
