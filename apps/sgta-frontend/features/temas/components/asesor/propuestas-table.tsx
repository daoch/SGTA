"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PropuestasModal } from "@/features/temas/components/asesor/propuesta-modal";
import {
  enlazarTesistasATemaPropuestoDirecta,
  fetchTemasPropuestosAlAsesor,
  fetchTemasPropuestosPorSubAreaConocimiento,
  postularTemaPropuestoGeneral,
  rechazarTema,
} from "@/features/temas/types/propuestas/data";
import {
  Area,
  Proyecto_M,
  SubAreaConocimiento,
} from "@/features/temas/types/propuestas/entidades";
import { CheckCircle, Eye, Send, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast, Toaster } from "sonner";
// Datos de ejemplo
/*const propuestasData = [
  {
    id: "1",
    titulo:
      "Desarrollo de un sistema de reconocimiento facial para control de acceso",
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
      {
        nombre: "Cronograma preliminar.xlsx",
        tipo: "excel",
        fecha: "2023-11-12",
      },
    ],
  },
  {
    id: "2",
    titulo:
      "Análisis de sentimientos en redes sociales para detección de tendencias de mercado",
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
    recursos: [
      {
        nombre: "Propuesta de investigación.pdf",
        tipo: "pdf",
        fecha: "2023-11-05",
      },
    ],
  },
];*/

// Obtener todas las áreas únicas para el filtro

interface PropuestasTableProps {
  propuestasData?: Proyecto_M[];
  setPropuestasData?: (propuestasData: Proyecto_M[]) => void;
  areasData?: Area[];
  searchTerm?: string;
  setSearchTerm?: (searchTerm: string) => void;
  subAreasData?: SubAreaConocimiento[];
  isLoading?: boolean;
}

export function PropuestasTable({
  propuestasData,
  setPropuestasData,
  areasData,
  searchTerm,
  setSearchTerm,
  subAreasData,
  isLoading,
}: PropuestasTableProps) {
  const [areaFilter, setAreaFilter] = useState<string | null>(null);
  const [selectedPropuesta, setSelectedPropuesta] = useState<Proyecto_M | null>(
    null,
  );
  const [comentario, setComentario] = useState("");
  const [aceptarPropuesta, setAceptarPropuesta] = useState(false);
  const [postularPropuesta, setPostularPropuesta] = useState(false);
  const [rechazarPropuesta, setRechazarPropuesta] = useState(false);

  const router = useRouter();

  const propuestasFiltradas = propuestasData?.filter((propuesta) => {
    // Filtrar por área si hay un filtro de área seleccionado
    if (
      areaFilter &&
      !propuesta.subareas.some(
        (subArea) => subArea.areaConocimiento.nombre === areaFilter,
      )
    ) {
      return false;
    }
    return true;
  });

  const handleOpenDialog = (propuesta: Proyecto_M) => {
    console.log("abriendo detalle ...");
    console.log({ propuesta });
    setSelectedPropuesta(propuesta);
    setRechazarPropuesta(false);
    setAceptarPropuesta(false);
    setPostularPropuesta(false);
  };

  const submitPostulacion = async () => {
    console.log({ comentario });
    console.log({ selectedPropuesta });
    if (selectedPropuesta) {
      try {
        await postularTemaPropuestoGeneral(
          selectedPropuesta?.estudiantes[0]?.id,
          40,
          selectedPropuesta?.id,
          comentario,
        );

        toast.success("¡La postulación al tema se registró correctamente!");
      } catch (error) {
        console.error("Error al postular el tema:", error);
        toast.error("Hubo un error al postular al tema. Intentelo de nuevo.");
      }
    }
    if (subAreasData) {
      const propuestasGenerales =
        await fetchTemasPropuestosPorSubAreaConocimiento(subAreasData, 1);
      setPropuestasData?.(propuestasGenerales);
    }
    router.refresh();
  };

  const submitAceptacion = async () => {
    console.log("Ingresando a aceptación...");
    console.log({ comentario });
    console.log({ selectedPropuesta });
    if (selectedPropuesta) {
      try {
        await enlazarTesistasATemaPropuestoDirecta(
          selectedPropuesta?.estudiantes?.map((item) => item.id),
          selectedPropuesta?.id,
          40,
          comentario,
        );

        toast.success("¡La inscripción al tema se registró correctamente!");
      } catch (error) {
        console.error("Error al inscribirse el tema:", error);
        toast.error(
          "Hubo un error al inscribirse al tema. Intentelo de nuevo.",
        );
      }
    }
    const propuestasDirectas = await fetchTemasPropuestosAlAsesor(1);
    setPropuestasData?.(propuestasDirectas);
    router.refresh();
  };

  const submitRechazo = async () => {
    console.log({ comentario });
    console.log({ selectedPropuesta });
    if (selectedPropuesta) {
      try {
        if (selectedPropuesta) {
          await rechazarTema(
            selectedPropuesta?.estudiantes[0]?.id,
            selectedPropuesta?.id,
            comentario,
          );
        }

        toast.success("¡El rechazo al tema se registró correctamente!");
      } catch (error) {
        console.error("Error al rechazar el tema:", error);
        toast.error("Hubo un error al rechazar al tema. Intentelo de nuevo.");
      }
    }

    const propuestasDirectas = await fetchTemasPropuestosAlAsesor(1);
    setPropuestasData?.(propuestasDirectas);
    router.refresh();
  };

  const handlerAceptarPropuesta = (propuesta: Proyecto_M) => {
    setPostularPropuesta(false);
    setRechazarPropuesta(false);
    setAceptarPropuesta(true);
    setSelectedPropuesta(propuesta);
  };

  const handlerPostularPropuesta = (propuesta: Proyecto_M) => {
    setAceptarPropuesta(false);
    setRechazarPropuesta(false);
    setPostularPropuesta(true);
    setSelectedPropuesta(propuesta);
  };

  const handlerRechazarPropuesta = (propuesta: Proyecto_M) => {
    setAceptarPropuesta(false);
    setRechazarPropuesta(true);
    setPostularPropuesta(false);
    setSelectedPropuesta(propuesta);
  };

  return (
    <>
      <Toaster position="bottom-right" richColors />
      <div>
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Input
              type="search"
              placeholder="Buscar por título o estudiante..."
              value={searchTerm}
              onChange={(e) => setSearchTerm?.(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="w-full md:w-64">
            <Select
              value={areaFilter || "all"}
              onValueChange={(value) =>
                setAreaFilter(value === "all" ? null : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por área" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las áreas</SelectItem>
                {areasData?.map((area) => (
                  <SelectItem key={area.id} value={area.nombre}>
                    {area.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {isLoading && propuestasData ? (
          <p className="text-sm text-muted-foreground">
            Cargando propuestas...
          </p>
        ) : (
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
                {propuestasFiltradas?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No hay propuestas disponibles
                    </TableCell>
                  </TableRow>
                ) : (
                  propuestasFiltradas?.map((propuesta) => (
                    <TableRow key={propuesta.id}>
                      <TableCell className="font-medium max-w-xs truncate">
                        {propuesta.titulo}
                      </TableCell>
                      <TableCell>
                        {Array.from(
                          new Set(
                            propuesta.subAreas.map(
                              (subArea) => subArea.areaConocimiento.nombre,
                            ),
                          ),
                        ).join(", ")}
                      </TableCell>
                      <TableCell>
                        {propuesta.estudiantes
                          .map(
                            (estudiante) =>
                              `${estudiante.nombres} ${estudiante.primerApellido} ${estudiante.segundoApellido}`,
                          )
                          .join(", ")}
                      </TableCell>
                      <TableCell>
                        {" "}
                        {/*Se necesita ver la cantidad de asesores postulando (Pendiente)*/}
                        {propuesta.cantPostulaciones &&
                        propuesta.cantPostulaciones > 0 ? (
                          <Badge
                            variant="outline"
                            className="bg-blue-100 text-blue-800 hover:bg-blue-100"
                          >
                            {propuesta.cantPostulaciones}
                          </Badge>
                        ) : (
                          <span>-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(propuesta.fechaLimite).toLocaleDateString()}
                      </TableCell>
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
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleOpenDialog(propuesta)}
                              >
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">Ver detalles</span>
                              </Button>
                            </DialogTrigger>
                            {selectedPropuesta &&
                              !aceptarPropuesta &&
                              !postularPropuesta &&
                              !rechazarPropuesta && (
                                <PropuestasModal
                                  data={selectedPropuesta}
                                  setSelectedPropuesta={setSelectedPropuesta}
                                  setComentario={setComentario}
                                  submitPostulacion={submitPostulacion}
                                  submitAceptacion={submitAceptacion}
                                  submitRechazo={submitRechazo}
                                  aceptarPropuesta={aceptarPropuesta}
                                  setAceptarPropuesta={setAceptarPropuesta}
                                  postularPropuesta={postularPropuesta}
                                  setPostularPropuesta={setPostularPropuesta}
                                  rechazarPropuesta={rechazarPropuesta}
                                  setRechazarPropuesta={setRechazarPropuesta}
                                ></PropuestasModal>
                              )}
                          </Dialog>
                          {propuesta.tipo === "general" && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-[#042354]"
                                  onClick={() =>
                                    handlerPostularPropuesta(propuesta)
                                  }
                                >
                                  <Send className="h-4 w-4" />
                                  <span className="sr-only">Postular</span>
                                </Button>
                              </DialogTrigger>
                              {selectedPropuesta && postularPropuesta && (
                                <PropuestasModal
                                  data={selectedPropuesta}
                                  setSelectedPropuesta={setSelectedPropuesta}
                                  setComentario={setComentario}
                                  submitPostulacion={submitPostulacion}
                                  submitAceptacion={submitAceptacion}
                                  submitRechazo={submitRechazo}
                                  aceptarPropuesta={aceptarPropuesta}
                                  setAceptarPropuesta={setAceptarPropuesta}
                                  postularPropuesta={postularPropuesta}
                                  setPostularPropuesta={setPostularPropuesta}
                                  rechazarPropuesta={rechazarPropuesta}
                                  setRechazarPropuesta={setRechazarPropuesta}
                                ></PropuestasModal>
                              )}
                            </Dialog>
                          )}
                          {propuesta.tipo === "directa" && (
                            <>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500"
                                    onClick={() =>
                                      handlerRechazarPropuesta(propuesta)
                                    }
                                  >
                                    <X className="h-4 w-4" /> {/* Rechazar */}
                                  </Button>
                                </DialogTrigger>
                                {selectedPropuesta && rechazarPropuesta && (
                                  <PropuestasModal
                                    data={selectedPropuesta}
                                    setSelectedPropuesta={setSelectedPropuesta}
                                    setComentario={setComentario}
                                    submitPostulacion={submitPostulacion}
                                    submitAceptacion={submitAceptacion}
                                    submitRechazo={submitRechazo}
                                    aceptarPropuesta={aceptarPropuesta}
                                    setAceptarPropuesta={setAceptarPropuesta}
                                    postularPropuesta={postularPropuesta}
                                    setPostularPropuesta={setPostularPropuesta}
                                    rechazarPropuesta={rechazarPropuesta}
                                    setRechazarPropuesta={setRechazarPropuesta}
                                  ></PropuestasModal>
                                )}
                              </Dialog>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-green-500"
                                    onClick={() =>
                                      handlerAceptarPropuesta(propuesta)
                                    }
                                  >
                                    <CheckCircle className="h-4 w-4" />{" "}
                                    {/* Aceptar */}
                                  </Button>
                                </DialogTrigger>
                                {selectedPropuesta && aceptarPropuesta && (
                                  <PropuestasModal
                                    data={selectedPropuesta}
                                    setSelectedPropuesta={setSelectedPropuesta}
                                    setComentario={setComentario}
                                    submitPostulacion={submitPostulacion}
                                    submitAceptacion={submitAceptacion}
                                    submitRechazo={submitRechazo}
                                    aceptarPropuesta={aceptarPropuesta}
                                    setAceptarPropuesta={setAceptarPropuesta}
                                    postularPropuesta={postularPropuesta}
                                    setPostularPropuesta={setPostularPropuesta}
                                    rechazarPropuesta={rechazarPropuesta}
                                    setRechazarPropuesta={setRechazarPropuesta}
                                  ></PropuestasModal>
                                )}
                              </Dialog>
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
        )}
      </div>
    </>
  );
}
