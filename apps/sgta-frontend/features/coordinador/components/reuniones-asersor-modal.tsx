import {
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
// import { EntregableDto } from "../../dtos/EntregableDto";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UsuarioXReunionDto } from "../dtos/UsuarioXReunionDto";
import { useEffect, useState } from "react";
import { getReunionesXUsuario, getReunionPorId } from "../services/reuniones-asesor-service";


const formatFecha = (fechaString?: string) => {
    if (!fechaString) return "Sin fecha";
    const fecha = new Date(fechaString);
    return fecha.toLocaleString("es-PE", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
};

export function ReunionesAsesorModal({
  asesorId,
  alumnoId,
  onClose,
}: {
  asesorId: number;
  alumnoId: number;
  onClose: () => void;
}) {
    const [reuniones, setReuniones] = useState<UsuarioXReunionDto[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const reunionesAsesor = await getReunionesXUsuario(asesorId);
                const reunionesAlumno = await getReunionesXUsuario(alumnoId);

                const reunionesComunes = reunionesAsesor
                    .filter((r1) =>
                    reunionesAlumno.some((r2) => r2.reunionId === r1.reunionId)
                    );
                    // .map((r1) => {
                    // const r2 = reunionesAlumno.find((r2) => r2.reunionId === r1.reunionId);
                    // return {
                    //     ...r1,
                    //     asistenciaAsesor: r1.estadoAsistencia,
                    //     asistenciaAlumno: r2?.estadoAsistencia ?? "PENDIENTE",
                    // };
                    // });

                // Obtener los detalles adicionales por ID
                const reunionesCompletas = await Promise.all(
                    reunionesComunes.map(async (r1) => {
                    const r2 = reunionesAlumno.find((r2) => r2.reunionId === r1.reunionId);
                    try {
                        const reunionDetalle = await getReunionPorId(r1.reunionId);
                        return {
                            ...r1,
                            asistenciaAsesor: r1.estadoAsistencia,
                            asistenciaAlumno: r2?.estadoAsistencia ?? "PENDIENTE",
                            descripcion: reunionDetalle.descripcion,
                        };
                    } catch (error) {
                        console.warn(`No se pudo obtener la reunión ${r1.reunionId}`, error);
                        return {
                            ...r1,
                            asistenciaAsesor: r1.estadoAsistencia,
                            asistenciaAlumno: r2?.estadoAsistencia ?? "PENDIENTE",
                            titulo: "-",
                            descripcion: "-",
                        };
                    }
                    })
                );
                

                setReuniones(reunionesCompletas);
            } catch (error) {
            console.error("Error cargando reuniones", error);
            }
        };

        fetchData();
    }, [asesorId, alumnoId]);

    const ahora = new Date();
    const totalReuniones = reuniones.length;
    const reunionesValidas = reuniones.filter(
    (r) =>
        r.reunionFechaHoraInicio &&
        new Date(r.reunionFechaHoraInicio) <= ahora &&
        r.asistenciaAsesor !== "RECHAZADO" &&
        r.asistenciaAlumno !== "RECHAZADO"
    );

    const totalValidas = reunionesValidas.length;

    const asistidasAsesor = reuniones.filter(
    (r) => r.asistenciaAsesor === "CONFIRMADO"
    ).length;

    const asistidasTesista = reuniones.filter(
    (r) => r.asistenciaAlumno === "CONFIRMADO"
    ).length;

    const porcentajeAsesor =
    totalValidas > 0 ? Math.round((asistidasAsesor / totalReuniones) * 100) : 0;

    const porcentajeTesista =
    totalValidas > 0 ? Math.round((asistidasTesista / totalReuniones) * 100) : 0;

    const formatSoloFecha = (fechaString?: string) => {
        if (!fechaString) return "Sin fecha";
        const fecha = new Date(fechaString);
        return fecha.toLocaleDateString("es-PE"); // Esto da formato corto: dd/mm/yyyy
    };

    const formatSoloHora = (fechaString?: string) => {
        if (!fechaString) return "Sin hora";
        const fecha = new Date(fechaString);
        return fecha.toLocaleTimeString("es-PE", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    };

    const calcularDuracion = (inicio?: string, fin?: string) => {
        if (!inicio || !fin) return "Sin duración";
        const fechaInicio = new Date(inicio);
        const fechaFin = new Date(fin);
        const diffMs = fechaFin.getTime() - fechaInicio.getTime();
        const diffMin = Math.round(diffMs / 60000);
        return `${diffMin} min`;
    };

    const proxima = (() => {
        const ahora = new Date();
        // Filtra solo reuniones futuras
        const futuras = reuniones
            .filter(r => r.reunionFechaHoraInicio && new Date(r.reunionFechaHoraInicio) > ahora)
            .sort((a, b) => new Date(a.reunionFechaHoraInicio).getTime() - new Date(b.reunionFechaHoraInicio).getTime());
        if (futuras.length === 0) return "Sin próximas reuniones";
        return formatSoloFecha(futuras[0].reunionFechaHoraInicio);
    })();

    return (
        <DialogContent className="w-full sm:max-w-full md:max-w-4xl px-6">
        <DialogHeader>
            <DialogTitle>Historial de Reuniones</DialogTitle>
            <p className="text-muted-foreground">
                Calendario de reuniones con el asesor actual
            </p>
        </DialogHeader>

        <div className="flex items-center justify-between mb-4 mt-2 px-1">
            <div className="flex flex-col text-base font-medium">
                <p>Total de reuniones agendadas: {totalReuniones}</p>
                <p>Total de reuniones realizadas: {totalValidas}</p>
                <p className="text-sm text-muted-foreground font-normal">
                    Asistencia Asesor: {porcentajeAsesor}%   |   Asistencia Tesista: {porcentajeTesista}%
                </p>
                {/* <p className="text-sm text-muted-foreground font-normal">Asistencia: {porcentaje}%</p> */}
            </div>
            <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-sm">
                Próxima: {proxima}
            </Badge>
        </div>

        <ScrollArea className="max-h-[400px] rounded-md border text-sm">
            <Table>
                <TableHeader>
                <TableRow className="bg-gray-100 text-gray-800" >
                    <TableHead>Fecha</TableHead>
                    <TableHead>Hora</TableHead>
                    <TableHead>Duración</TableHead>
                    <TableHead>Asistencia Asesor</TableHead>
                    <TableHead>Asistencia Tesista</TableHead>
                    <TableHead>Tema</TableHead>
                    <TableHead>Detalle</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {reuniones.map((r, idx) => (
                    <TableRow key={idx}>
                    <TableCell className="py-4 whitespace-normal break-words max-w-xs">{formatSoloFecha(r.reunionFechaHoraInicio)}</TableCell>
                    <TableCell className="py-4 whitespace-normal break-words max-w-xs">{formatSoloHora(r.reunionFechaHoraInicio)}</TableCell>
                    <TableCell className="py-4 whitespace-normal break-words max-w-xs">{calcularDuracion(r.reunionFechaHoraInicio,r.reunionFechaHoraFin)}</TableCell>
                    <TableCell className="py-4 whitespace-normal break-words max-w-xs">
                        <Badge
                            className={
                                r.asistenciaAsesor === "CONFIRMADO"
                                    ? "bg-green-100 text-green-700"
                                    : r.asistenciaAsesor === "PENDIENTE"
                                        ? "bg-gray-200 text-gray-700"
                                        : r.asistenciaAsesor === "RECHAZADO"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-gray-200 text-gray-700"
                            }
                        >
                            {r.asistenciaAsesor === "CONFIRMADO"
                                ? "Asistió"
                                : r.asistenciaAsesor === "PENDIENTE"
                                    ? "Pendiente"
                                    : r.asistenciaAsesor === "RECHAZADO"
                                        ? "Falta"
                                        : "Falta"
                            }
                        </Badge>
                    </TableCell>
                    <TableCell className="py-4 whitespace-normal break-words max-w-xs">
                        <Badge
                            className={
                                r.asistenciaAlumno === "CONFIRMADO"
                                    ? "bg-green-100 text-green-700"
                                    : r.asistenciaAlumno === "PENDIENTE"
                                        ? "bg-gray-200 text-gray-700"
                                        : r.asistenciaAlumno === "RECHAZADO"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-gray-200 text-gray-700"
                            }
                        >
                            {r.asistenciaAlumno === "CONFIRMADO"
                                ? "Asistió"
                                : r.asistenciaAlumno === "PENDIENTE"
                                    ? "Pendiente"
                                    : r.asistenciaAlumno === "RECHAZADO"
                                        ? "Falta"
                                        : "Falta"
                            }
                        </Badge>
                    </TableCell>
                    <TableCell className="py-4 whitespace-normal break-words max-w-xs">{r.reunionTitulo}</TableCell>
                    <TableCell className="py-4 whitespace-normal break-words max-w-xs">{r.descripcion}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </ScrollArea>
        </DialogContent>
    );
}
  