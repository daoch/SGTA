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
import { FiltrosPostulacionModal } from "@/features/temas/components/asesor/filtros-postulacion-modal";
import { PostulacionModal } from "@/features/temas/components/asesor/postulacion-modal";
import { fetchPostulacionesAlAsesor } from "@/features/temas/types/postulaciones/data";
import { CheckCircle, Eye, Filter, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Postulacion } from "../../types/postulaciones/entidades";
import { AceptarPostulacionModal } from "./aceptar-postulacion-modal";
import { RechazarPostulacionModal } from "./rechazar-postulacion-modal";

export function PostulacionesTable() {
  const [selectedPostulacion, setSelectedPostulacion] =
    useState<Postulacion | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [abrirModal, setAbrirModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [postulacionesData, setPostulacionesData] = useState<
    Postulacion[] | null
  >();
  const [debounceFechaFin, setDebounceFechaFin] = useState<string>("");
  const [debounceEstado, setDebounceEstado] = useState<string>("");

  useEffect(() => {
    const fetchPostulaciones = async () => {
      try {
        setLoading(true);
        console.log({ debounceEstado });
        console.log({ debounceFechaFin });
        const data = await fetchPostulacionesAlAsesor(
          debouncedSearchTerm,
          debounceEstado,
          debounceFechaFin,
        );
        setPostulacionesData(data);
      } catch {
        console.log("No se logró listar las postulaciones");
      } finally {
        setLoading(false);
      }
    };

    fetchPostulaciones();
  }, [debouncedSearchTerm, debounceEstado, debounceFechaFin]);

  const handleOpenDialog = (postulacion: Postulacion) => {
    setAbrirModal(true);
    setSelectedPostulacion(postulacion);
    setFeedbackText(postulacion.coasesores || ""); /*CAMBIAR*/
  };

  const handleOpenAcceptDialog = (postulacion: Postulacion) => {
    setAbrirModal(false);
    setSelectedPostulacion(postulacion);
    setFeedbackText("");
    setShowAcceptDialog(true);
  };

  const handleOpenRejectDialog = (postulacion: Postulacion) => {
    setAbrirModal(false);
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
    setFiltroEstado("");
    setFechaFin("");
    setShowFilterDialog(false);
    filtrarLosCampos();
  };

  useEffect(() => {
    console.log({ searchTerm });
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filtrarLosCampos = () => {
    setShowFilterDialog(false);
    setDebounceEstado(filtroEstado);
    setDebounceFechaFin(fechaFin);
  };

  console.log({ postulacionesData });
  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1">
          <Input
            type="search"
            placeholder="Buscar por título o estudiante..."
            value={searchTerm}
            onChange={handleChangeText}
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
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  Cargando...
                </TableCell>
              </TableRow>
            ) : postulacionesData?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  No hay postulaciones disponibles
                </TableCell>
              </TableRow>
            ) : (
              postulacionesData?.map((postulacion) => (
                <TableRow key={postulacion.id}>
                  <TableCell className="font-medium max-w-xs truncate">
                    {postulacion.titulo}
                  </TableCell>
                  <TableCell>
                    {postulacion.subareas[0].areaConocimiento.nombre}
                  </TableCell>
                  <TableCell>
                    {postulacion.tesistas
                      .map((tesista) => tesista.codigoPucp)
                      .join(", ")}
                  </TableCell>
                  <TableCell>
                    {postulacion.tesistas
                      .map(
                        (tesista) =>
                          `${tesista.nombres} ${tesista.primerApellido}`,
                      )
                      .join(", ")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        postulacion.estadoUsuarioTema === "Aprobado"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : postulacion.estadoUsuarioTema === "Rechazado"
                            ? "bg-red-100 text-red-800 hover:bg-red-100"
                            : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                      }
                    >
                      {postulacion.estadoUsuarioTema === "Aprobado"
                        ? "Aprobado"
                        : postulacion.estadoUsuarioTema === "Rechazado"
                          ? "Rechazado"
                          : "Pendiente"}
                    </Badge>
                  </TableCell>
                  <TableCell>{postulacion.fechaLimite.split("T")[0]}</TableCell>
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
                            handleOpenRejectDialog={handleOpenRejectDialog}
                            handleOpenAcceptDialog={handleOpenAcceptDialog}
                          />
                        )}
                      </Dialog>
                      {postulacion.estadoUsuarioTema === "Pendiente" && (
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
      {/* Modal para rechazar postulación */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <RechazarPostulacionModal
          selectedPostulacion={selectedPostulacion}
          feedbackText={feedbackText}
          setFeedbackText={setFeedbackText}
          setShowRejectDialog={setShowRejectDialog}
          handleReject={handleReject}
        />
      </Dialog>
      {/* Modal para filtros */}
      <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
        <FiltrosPostulacionModal
          filtroEstado={filtroEstado}
          setFiltroEstado={setFiltroEstado}
          fechaFin={fechaFin}
          setFechaFin={setFechaFin}
          handleClearFilters={handleClearFilters}
          filtrarLosCampos={filtrarLosCampos}
        />
      </Dialog>
    </div>
  );
}
