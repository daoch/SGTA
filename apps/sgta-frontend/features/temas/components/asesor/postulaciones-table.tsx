"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PostulacionModal } from "@/features/temas/components/asesor/postulacion-modal";
import { CheckCircle, Eye, Filter, X } from "lucide-react";
import { useState } from "react";
import { Postulacion } from "../../types/postulaciones/entidades";
import { AceptarPostulacionModal } from "./aceptar-postulacion-modal";

const postulacionesData = [
  {
    id: "1",
    titulo:
      "Desarrollo de un sistema de monitoreo de calidad del aire utilizando IoT",
    area: "Internet de las Cosas",
    codigos: ["20190123", "20190456"],
    estudiantes: ["Ana García", "Pedro López"],
    estado: "pendiente",
    fechaPostulacion: "2023-11-15",
    fechaLimite: "2023-11-30",
    motivacion:
      "Nos interesa este tema porque tenemos experiencia previa en proyectos de IoT y queremos profundizar en aplicaciones ambientales. Hemos trabajado con sensores y plataformas como Arduino y Raspberry Pi.",
    experiencia:
      "Hemos desarrollado proyectos de domótica y sistemas de monitoreo de temperatura. Tenemos conocimientos en programación de microcontroladores, protocolos de comunicación IoT y desarrollo web.",

    cursosTomados: [
      "Sistemas Embebidos",
      "Redes de Computadoras",
      "Programación Web",
    ],
    comentario: "",
  },
  {
    id: "2",
    titulo:
      "Optimización de consultas en bases de datos NoSQL para aplicaciones de big data",
    area: "Bases de Datos",
    codigos: ["20180789"],
    estudiantes: ["Carlos Mendoza"],
    estado: "aprobado",
    fechaPostulacion: "2023-11-10",
    fechaLimite: "2023-12-05",
    motivacion:
      "Me interesa este tema porque quiero especializarme en bases de datos NoSQL y big data. Considero que es un área con mucho potencial y demanda en el mercado laboral.",
    experiencia:
      "He trabajado con MongoDB y Cassandra en proyectos académicos. También tengo experiencia en análisis de datos con Python y herramientas de visualización.",

    cursosTomados: [
      "Bases de Datos Avanzadas",
      "Minería de Datos",
      "Programación Paralela",
    ],
    comentario:
      "Tu perfil es ideal para este tema. Tienes la experiencia necesaria en bases de datos NoSQL y tus conocimientos en análisis de datos serán muy útiles para el proyecto.",
  },
];

export function PostulacionesTable() {
  const [selectedPostulacion, setSelectedPostulacion] =
    useState<Postulacion | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState<string | null>(null);
  const [fechaFin, setFechaFin] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [abrirModal, setAbrirModal] = useState(false);

  const handleOpenDialog = (postulacion: Postulacion) => {
    setAbrirModal(true);
    setSelectedPostulacion(postulacion);
    setFeedbackText(postulacion.comentario || "");
  };

  const handleOpenAcceptDialog = (postulacion: Postulacion) => {
    setAbrirModal(false);
    setSelectedPostulacion(postulacion);
    setFeedbackText("");
    setShowAcceptDialog(true);
  };

  const handleOpenRejectDialog = (postulacion: Postulacion) => {
    setSelectedPostulacion(postulacion);
    setFeedbackText("");
    setShowRejectDialog(true);
  };

  const handleApprove = () => {
    // Aquí iría la lógica para aprobar la postulación
    console.log(
      "Aprobando postulación:",
      selectedPostulacion?.id,
      "Feedback:",
      feedbackText,
    );

    setSelectedPostulacion(null);
    setFeedbackText("");
    setShowAcceptDialog(false);
  };

  const handleReject = () => {
    // Aquí iría la lógica para rechazar la postulación
    console.log(
      "Rechazando postulación:",
      selectedPostulacion?.id,
      "Feedback:",
      feedbackText,
    );

    setSelectedPostulacion(null);
    setFeedbackText("");
    setShowRejectDialog(false);
  };

  const handleClearFilters = () => {
    setFiltroEstado(null);
    setFechaFin("");
    setShowFilterDialog(false);
  };

  const postulacionesFiltradas = postulacionesData.filter((postulacion) => {
    // Filtrar por término de búsqueda
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      const tituloMatch = postulacion.titulo
        .toLowerCase()
        .includes(searchTermLower);
      const estudiantesMatch = postulacion.estudiantes.some((estudiante) =>
        estudiante.toLowerCase().includes(searchTermLower),
      );
      if (!tituloMatch && !estudiantesMatch) return false;
    }

    // Filtrar por estado
    if (filtroEstado && postulacion.estado !== filtroEstado) {
      return false;
    }

    if (fechaFin) {
      const fechaPostulacion = new Date(postulacion.fechaPostulacion);
      const fechaFinObj = new Date(fechaFin);
      // Ajustar la fecha fin para incluir todo el día
      fechaFinObj.setHours(23, 59, 59, 999);
      if (fechaPostulacion > fechaFinObj) {
        return false;
      }
    }

    return true;
  });

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1">
          <Input
            type="search"
            placeholder="Buscar por título o estudiante..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilterDialog(true)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filtros
          {(filtroEstado || fechaFin) && (
            <Badge variant="secondary" className="ml-1">
              {[filtroEstado ? 1 : 0, fechaFin ? 1 : 0].reduce(
                (a, b) => a + b,
                0,
              )}
            </Badge>
          )}
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Área</TableHead>
              <TableHead>Código(s)</TableHead>
              <TableHead>Estudiante(s)</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha Límite</TableHead>
              <TableHead className="text-right">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {postulacionesFiltradas.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  No hay postulaciones disponibles
                </TableCell>
              </TableRow>
            ) : (
              postulacionesFiltradas.map((postulacion) => (
                <TableRow key={postulacion.id}>
                  <TableCell className="font-medium max-w-xs truncate">
                    {postulacion.titulo}
                  </TableCell>
                  <TableCell>{postulacion.area}</TableCell>
                  <TableCell>{postulacion.codigos.join(", ")}</TableCell>
                  <TableCell>{postulacion.estudiantes.join(", ")}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        postulacion.estado === "aprobado"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : postulacion.estado === "rechazado"
                            ? "bg-red-100 text-red-800 hover:bg-red-100"
                            : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                      }
                    >
                      {postulacion.estado === "aprobado"
                        ? "Aprobado"
                        : postulacion.estado === "rechazado"
                          ? "Rechazado"
                          : "Pendiente"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(postulacion.fechaLimite).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(postulacion)}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Ver detalles</span>
                          </Button>
                        </DialogTrigger>
                        {selectedPostulacion && abrirModal && (
                          <PostulacionModal
                            selectedPostulacion={selectedPostulacion}
                            setSelectedPostulacion={setSelectedPostulacion}
                            feedbackText={feedbackText}
                            setFeedbackText={setFeedbackText}
                            handleReject={handleReject}
                            handleOpenAcceptDialog={handleOpenAcceptDialog}
                          />
                        )}
                      </Dialog>
                      {postulacion.estado === "pendiente" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500"
                            onClick={() => handleOpenRejectDialog(postulacion)}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Rechazar</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-green-500"
                            onClick={() => handleOpenAcceptDialog(postulacion)}
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span className="sr-only">Aprobar</span>
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
      {/* Modal para aceptar postulación */}
      <Dialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
        <AceptarPostulacionModal
          selectedPostulacion={selectedPostulacion}
          feedbackText={feedbackText}
          setFeedbackText={setFeedbackText}
          setShowAcceptDialog={setShowAcceptDialog}
          handleApprove={handleApprove}
        />
      </Dialog>
    </div>
  );
}
