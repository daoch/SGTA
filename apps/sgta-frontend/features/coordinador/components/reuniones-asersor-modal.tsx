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
import { getReunionesXUsuario } from "../services/reuniones-asesor-service";
  
// interface ReunionesAsesorModalProps {
//     data?: EntregableDto;
//     setSelectedEntregable?: (selectedEntregable: EntregableDto | null) => void;
//     setComentario?: (comentario: string) => void;
// }

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

const reunionesDummy = [
  {
    fecha: "14/9/2023",
    hora: "15:00",
    duracion: "60 min",
    asistencia: "Asistió",
    tema: "Definición del alcance del proyecto",
    acuerdos: "Revisar bibliografía sobre YOLO y SSD",
  },
  {
    fecha: "28/9/2023",
    hora: "15:00",
    duracion: "60 min",
    asistencia: "Asistió",
    tema: "Revisión de bibliografía",
    acuerdos: "Comenzar implementación de YOLO",
  },
  {
    fecha: "12/10/2023",
    hora: "15:00",
    duracion: "60 min",
    asistencia: "No asistió",
    tema: "Avance de implementación",
    acuerdos: "-",
  },
  {
    fecha: "26/10/2023",
    hora: "15:00",
    duracion: "60 min",
    asistencia: "Asistió",
    tema: "Revisión de implementación de YOLO",
    acuerdos: "Corregir problemas de rendimiento",
  },
  {
    fecha: "9/11/2023",
    hora: "15:00",
    duracion: "60 min",
    asistencia: "Asistió",
    tema: "Avance de implementación",
    acuerdos: "Comenzar validación",
  },
];

  
// export function ReunionesAsesorModal({
//     data,
//     setSelectedEntregable,
//     setComentario,
// }: ReunionesAsesorModalProps) {
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
    const reuniones2 = reunionesDummy;

    useEffect(() => {
        const fetchData = async () => {
        try {
            const reunionesAsesor = await getReunionesXUsuario(asesorId);
            const reunionesAlumno = await getReunionesXUsuario(alumnoId);

            const reunionesComunes = reunionesAsesor.filter((r1) =>
            reunionesAlumno.some((r2) => r2.reunionId === r1.reunionId)
            );

            setReuniones(reunionesComunes);
        } catch (error) {
            console.error("Error cargando reuniones", error);
        }
        };

        fetchData();
    }, [asesorId, alumnoId]);

    const total = reuniones.length;
    const asistidas = reuniones.filter((r) => r.estadoAsistencia === "CONFIRMADO").length;
    const porcentaje = Math.round((asistidas / total) * 100);

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
                <p>Total de reuniones: {total}</p>
                <p className="text-sm text-muted-foreground font-normal">Asistencia: {porcentaje}%</p>
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
                    <TableHead>Asistencia</TableHead>
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
                            r.estadoAsistencia === "CONFIRMADO"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }
                        >
                        {r.estadoAsistencia === "CONFIRMADO" ? "Asistió" : "No asistió"}
                        </Badge>
                    </TableCell>
                    <TableCell className="py-4 whitespace-normal break-words max-w-xs">{r.reunionTitulo}</TableCell>
                    <TableCell className="py-4 whitespace-normal break-words max-w-xs">{r.estadoDetalle}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </ScrollArea>
        </DialogContent>
    );
}
  