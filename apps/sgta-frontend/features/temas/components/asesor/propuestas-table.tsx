"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PropuestasModal } from "@/features/temas/components/asesor/propuesta-modal";
import { Proyecto } from "@/features/temas/types/propuestas/entidades";
import { CheckCircle, Eye, Send, X } from "lucide-react";
import { useState } from "react";

// Datos de ejemplo
const propuestasData = [
    {
      id: "1",
      titulo: "Desarrollo de un sistema de reconocimiento facial para control de acceso",
      area: "Inteligencia Artificial",
      estudiantes: ["Ana García", "Pedro López"],
      codigos: ["20190123", "20190456"],
      postulaciones: 3,
      fechaLimite: "2023-12-15",
      tipo: "general",
      descripcion:
        "Propuesta para desarrollar un sistema de reconocimiento facial utilizando técnicas de deep learning para control de acceso en instalaciones. El sistema debe ser capaz de identificar personas en tiempo real y mantener un registro de entradas y salidas.",
      objetivos:
        "Implementar un sistema de reconocimiento facial con una precisión superior al 95%. Desarrollar una interfaz de usuario intuitiva para la gestión de usuarios y registros. Integrar el sistema con hardware de control de acceso.",
      metodologia:
        "Se utilizará Python con las bibliotecas OpenCV y TensorFlow para el desarrollo del sistema. Se implementará una arquitectura basada en redes neuronales convolucionales (CNN) para el reconocimiento facial. Se realizarán pruebas con diferentes algoritmos y se evaluará su rendimiento.",
      recursos: [
        { nombre: "Propuesta detallada.pdf", tipo: "pdf", fecha: "2023-11-10" },
        { nombre: "Cronograma preliminar.xlsx", tipo: "excel", fecha: "2023-11-12" },
      ],
    },
    {
      id: "2",
      titulo: "Análisis de sentimientos en redes sociales para detección de tendencias de mercado",
      area: "Ciencia de Datos",
      estudiantes: ["Carlos Mendoza"],
      codigos: ["20180789"],
      postulaciones: 2,
      fechaLimite: "2023-12-20",
      tipo: "directa",
      descripcion:
        "Propuesta para desarrollar un sistema de análisis de sentimientos en redes sociales que permita detectar tendencias de mercado y opiniones sobre productos o servicios. El sistema procesará datos de Twitter, Facebook e Instagram para generar insights valiosos para empresas.",
      objetivos:
        "Desarrollar un modelo de análisis de sentimientos con una precisión superior al 85%. Implementar un sistema de recolección de datos de redes sociales. Crear un dashboard para visualización de tendencias y sentimientos.",
      metodologia:
        "Se utilizarán técnicas de procesamiento de lenguaje natural (NLP) y aprendizaje automático para el análisis de sentimientos. Se implementará un sistema de recolección de datos mediante APIs de redes sociales. Se desarrollará un dashboard web para la visualización de resultados.",
      recursos: [{ nombre: "Propuesta de investigación.pdf", tipo: "pdf", fecha: "2023-11-05" }],
    },
];

// Obtener todas las áreas únicas para el filtro
const areasUnicas = Array.from(new Set(propuestasData.map((propuesta) => propuesta.area)));

interface PropuestasTableProps {
    filter?: string
}

export function PropuestasTable({ filter }: PropuestasTableProps) {
    const [areaFilter, setAreaFilter] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPropuesta, setSelectedPropuesta] = useState< Proyecto | null>(null);
    const [comentario, setComentario] = useState("");

    console.log({comentario});
    const propuestasFiltradas = propuestasData.filter((propuesta) => {
        // Filtrar por tipo
        if (filter && propuesta.tipo !== filter) {
            return false;
        }
        // Filtrar por área si hay un filtro de área seleccionado
        if (areaFilter && propuesta.area !== areaFilter) {
            return false;
        }
        // Filtrar por término de búsqueda (título o estudiante)
        if (searchTerm) {
            const searchTermLower = searchTerm.toLowerCase();
            const tituloMatch = propuesta.titulo.toLowerCase().includes(searchTermLower);
            const estudiantesMatch = propuesta.estudiantes.some((estudiante) =>
            estudiante.toLowerCase().includes(searchTermLower),
            );
            return tituloMatch || estudiantesMatch;
        }
        return true;
    });

    const handleOpenDialog = (propuesta: Proyecto) => {
        setSelectedPropuesta(propuesta);
    };

    return(
        <div>
            <div className="mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Input
                        type="search"
                        placeholder="Buscar por título o estudiante..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                    />
                </div>
                <div className="w-full md:w-64">
                    <Select value={areaFilter || "all"} onValueChange={(value) => setAreaFilter(value === "all" ? null : value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filtrar por área" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas las áreas</SelectItem>
                            {areasUnicas.map((area) => (
                                <SelectItem key={area} value={area}>
                                    {area}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Título</TableHead>
                            <TableHead>Área</TableHead>
                            <TableHead>Estudiante(s)</TableHead>
                            <TableHead>Postulaciones</TableHead>
                            <TableHead>Fecha límite</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead className="text-right">Acción</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {propuestasFiltradas.length === 0? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                    No hay propuestas disponibles
                                </TableCell>
                            </TableRow>
                        ):(
                            propuestasFiltradas.map((propuesta)=>(
                                <TableRow key={propuesta.id}>
                                    <TableCell className="font-medium max-w-xs truncate">{propuesta.titulo}</TableCell>
                                    <TableCell>{propuesta.area}</TableCell>
                                    <TableCell>{propuesta.estudiantes.join(", ")}</TableCell>
                                    <TableCell>
                                        {propuesta.postulaciones > 0 ? (
                                        <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                                            {propuesta.postulaciones}
                                        </Badge>
                                        ) : (
                                        <span>-</span>
                                        )}
                                    </TableCell>
                                    <TableCell>{new Date(propuesta.fechaLimite).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Badge
                                        variant="outline"
                                        className={
                                            propuesta.tipo === "directa"
                                            ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
                                            : "bg-green-100 text-green-800 hover:bg-green-100"
                                        }
                                        >
                                        {propuesta.tipo === "directa" ? "Directa" : "General"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Dialog> 
                                                <DialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" onClick={() =>handleOpenDialog(propuesta)}>
                                                        <Eye className="h-4 w-4" />
                                                        <span className="sr-only">Ver detalles</span>
                                                    </Button>
                                                </DialogTrigger>
                                                { selectedPropuesta &&(
                                                    <PropuestasModal
                                                    data={selectedPropuesta} setSelectedPropuesta={setSelectedPropuesta} setComentario={setComentario}
                                                    ></PropuestasModal>
                                                )}
                                            </Dialog>
                                            {propuesta.tipo === "general" && (
                                                <Button variant="ghost" size="icon" className="text-[#042354]">
                                                <Send className="h-4 w-4" />
                                                <span className="sr-only">Postular</span>
                                                </Button>
                                            )}
                                            {propuesta.tipo === "directa" && (
                                                <>
                                                <Button variant="ghost" size="icon" className="text-red-500">
                                                    <X className="h-4 w-4" /> {/* Rechazar */}
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-green-500">
                                                    <CheckCircle className="h-4 w-4" /> {/* Aceptar */}
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
};