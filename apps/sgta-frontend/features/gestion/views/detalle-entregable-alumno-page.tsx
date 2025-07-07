"use client";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useMemo } from "react";
import { CheckCircle, Download, FileText, XCircle } from "lucide-react";
import { Entregable } from "../types/entregables/entidades";
import { useAuthStore } from "@/features/auth";
import axiosInstance from "@/lib/axios/axios-instance";
import { Observacion } from "@/features/temas/types/temas/entidades";
import TabsObservacionesAlumno from "@/features/revision/components/Tabs_observaciones_alumno";
import { RevisionCriterioEntregableDto } from "@/features/revision/dtos/RevisionCriterioEntregableDto";
import { ProfesoresTemaDto } from "@/features/revision/dtos/ProfesoresTemaDto";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useDownloadAnnotated } from "@/features/revision/lib/useDownloadAnnotated";
import { toast } from "@/components/ui/use-toast";

// Add the correct import for ObservacionesRevisionDTO



export default function DetalleEntregableAlumnoPage() {
  const [selectedRevisor, setSelectedRevisor] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const id = params?.DetalleEntregable;
  const searchParams = useSearchParams();
  const temaId = searchParams.get("tema");
  const [criterios, setCriterios] = useState<RevisionCriterioEntregableDto[]>([]);
  const [observaciones, setObservaciones] = useState<ObservacionAlumnoDTO[]>([]);
  const [detalleEntregable, setDetalleEntregable] = useState<DetalleSimplificadoEntregable | null>(null);
  console.log("Tema ID:", temaId);
  const [usuarios, setUsuarios] = useState<ProfesoresTemaDto[]>([]);
  const [orden, setOrden] = useState("pagina");
  const [busqueda, setBusqueda] = useState("");
  const [filtroCorregido, setFiltroCorregido] = useState<"todos" | "corregidos" | "sin_corregir">("todos");
  const getTipoObs = (tipo: number) =>
    tipo === 1
      ? "Contenido"
      : tipo === 2
      ? "Similitud"
      : tipo === 3
      ? "Citado"
      : tipo === 4
      ? "Inteligencia Artificial"
      : "";

  useEffect(() => {
    const fetchObservaciones = async () => {
      try {
        const { idToken } = useAuthStore.getState();
        if (!idToken) {
          console.error("No authentication token available");
          return;
        } 
        console.log("token:", idToken);
        if (!id || !temaId) {
          console.error("Faltan parámetros para la consulta de observaciones");
          return;
        }
        const response = await axiosInstance.get(
        `/revision/tema/${temaId}/entregable/${id}/observaciones`, // <-- corregido
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
        
        setObservaciones(response.data);
        console.log("Observaciones cargadas:", response.data);
      } catch (error) {
        console.error("Error al cargar las observaciones:", error);
      }
    };
    fetchObservaciones();
    
  }, [id, temaId]);

  useEffect(() => {
  const fetchRevisoresYJurados = async () => {
    try {
      const { idToken } = useAuthStore.getState();

      if (!idToken) {
        console.error("No authentication token available");
        return;
      }

      if (!temaId) {
        console.error("Falta el parámetro temaId para consultar revisores y jurados");
        return;
      }

      const response = await axiosInstance.get(
        `/revision/usuarios/tema/${temaId}`,   // <-- Endpoint del servicio backend
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      setUsuarios(response.data); // Asumiendo que tienes un estado llamado usuarios
      console.log("Usuarios cargados:", response.data);

    } catch (error) {
      console.error("Error al cargar los revisores y jurados:", error);
    }
  };

  fetchRevisoresYJurados();

}, [temaId]);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const { idToken } = useAuthStore.getState();
      if (!idToken) {
        console.error("No authentication token available");
        return;
      }
      if (!id || !temaId) {
        console.error("Faltan parámetros para la consulta del detalle del entregable");
        return;
      }

      // Primero, traer el detalle del entregable y tema
      const detalleResponse = await axiosInstance.get(
        `/entregable/${id}/tema/${temaId}/detalle-simplificado`,
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const detalle = detalleResponse.data;
      setDetalleEntregable(detalle);
      console.log("Detalle simplificado cargado:", detalle);

      // Segundo, con el entregableXTemaId, traer los criterios de revisión
      if (detalle.entregableXTemaId) {
        const criteriosResponse = await axiosInstance.get(
          `/criterio-entregable/revision/entregable-tema/${detalle.entregableXTemaId}`,
          {
            headers: {
              Authorization: `Bearer ${idToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        setCriterios(criteriosResponse.data);
        console.log("Criterios cargados:", criteriosResponse.data);
      }
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    }
  };
    fetchData();
}, [id, temaId]);
  const observacionesConRoles = observaciones.map((obs: ObservacionAlumnoDTO) => ({
  ...obs,
  roles: obs.rolesUsuario
    ? obs.rolesUsuario.split(",").map((r) => Number(r.trim()))
    : [],
}));
const agrupado: { [nombreCompleto: string]: RevisionCriterioEntregableDto[] } = {};
const totalObservaciones = observaciones.length;
const totalResueltas = observaciones.filter((obs) => obs.corregido).length;
const totalPendientes = totalObservaciones - totalResueltas;
const detalle = Array.isArray(detalleEntregable) ? detalleEntregable[0] : detalleEntregable;
console.log("Detalle del entregable:", detalle);
const observacionesFiltradas = useMemo(() => {
    let arr = [...observacionesConRoles];

    // Filtrado por corregido
    if (filtroCorregido === "corregidos") {
      arr = arr.filter((obs) => obs.corregido);
    } else if (filtroCorregido === "sin_corregir") {
      arr = arr.filter((obs) => !obs.corregido);
    }

    // Filtrado por búsqueda
    if (busqueda.trim() !== "") {
      arr = arr.filter((obs) => {
        const paginaInicio = obs.numeroPaginaInicio?.toString() || "";
        const paginaFin = obs.numeroPaginaFin?.toString() || "";
        const busq = busqueda.toLowerCase();

        return (
          obs.comentario?.toLowerCase().includes(busq) ||
          obs.contenido?.toLowerCase().includes(busq) ||
          getTipoObs(obs.tipoObservacionId).toLowerCase().includes(busq) ||
          paginaInicio.includes(busq) ||
          paginaFin.includes(busq) ||
          `pagina ${paginaInicio}`.includes(busq) ||
          `página ${paginaInicio}`.includes(busq) ||
          `pagina ${paginaFin}`.includes(busq) ||
          `página ${paginaFin}`.includes(busq)
        );
      });
    }

    // Ordenamiento
    switch (orden) {
      case "tipo":
        arr.sort((a, b) => a.tipoObservacionId - b.tipoObservacionId);
        break;
      case "usuario":
        arr.sort((a, b) => a.usuarioCreacionId - b.usuarioCreacionId);
        break;
      case "fecha":
        arr.sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());
        break;
      case "pagina":
        arr.sort((a, b) => a.numeroPaginaInicio - b.numeroPaginaInicio);
        break;
      default:
        break;
    }
    return arr;
  }, [observacionesConRoles, orden, busqueda, filtroCorregido]);
  const criteriosAgrupadosPorUsuario = useMemo(() => {
  const agrupado: { [nombreCompleto: string]: RevisionCriterioEntregableDto[] } = {};

  criterios.forEach((criterio) => {
    const usuario = usuarios.find((u) => u.usuarioId === criterio.usuarioId);
    const nombreCompleto = usuario
      ? `${usuario.nombres} ${usuario.primerApellido} ${usuario.segundoApellido}`
      : "Desconocido";

    if (!agrupado[nombreCompleto]) {
      agrupado[nombreCompleto] = [];
    }

    agrupado[nombreCompleto].push(criterio);
  });

  return agrupado;
}, [criterios, usuarios]);
  const [open, setOpen] = useState(false);

  function onClose(open: boolean): void {
    setOpen(open);
  }

  // Función para obtener el revisionDocumentoId del revisor seleccionado
  const getRevisionIdForSelectedRevisor = useMemo(() => {
    if (!selectedRevisor || !criteriosAgrupadosPorUsuario[selectedRevisor]) {
      return null;
    }
    
    const criteriosDelRevisor = criteriosAgrupadosPorUsuario[selectedRevisor];
    if (criteriosDelRevisor.length > 0) {
      return criteriosDelRevisor[0].revisionDocumentoId;
    }
    
    return null;
  }, [selectedRevisor, criteriosAgrupadosPorUsuario]);

  // Hook para descargar PDF anotado (solo se activa si hay un revisor seleccionado)
  const downloadAnnotatedPdf = useDownloadAnnotated(getRevisionIdForSelectedRevisor || 0);

  // Función para manejar la descarga
  const handleDownload = async () => {
    if (!selectedRevisor) {
      toast({
        title: "Seleccionar revisor",
        description: "Por favor selecciona un revisor antes de descargar el PDF.",
        variant: "destructive",
      });
      return;
    }

    if (!getRevisionIdForSelectedRevisor) {
      toast({
        title: "Error",
        description: "No se pudo obtener la información de revisión para este revisor.",
        variant: "destructive",
      });
      return;
    }

    try {
      await downloadAnnotatedPdf();
      toast({
        title: "Descarga exitosa",
        description: "El PDF anotado se ha descargado correctamente.",
      });
    } catch (error) {
      console.error("Error al descargar:", error);
      toast({
        title: "Error en la descarga",
        description: "No se pudo descargar el PDF. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start p-6">
      <div className="flex-1 space-y-6">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full w-8 h-8"
          onClick={() => router.back()}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Detalles de Revisión</h1>
        </div>

        <div className="bg-white border rounded-md p-4 space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-3">
            <div>
              {detalle && (
                <>
                  <h2 className="font-bold text-lg text-gray-900">{detalle.entregableDescripcion}</h2>
                  <p className="text-sm text-muted-foreground">Entrega:</p>
                  <div className="text-sm text-black">
                    <strong>{detalle.entregableNombre}</strong>
                  </div>
                </>
              )}
            </div>
          </div>
            <div className="flex flex-col gap-2">
              {selectedRevisor && (
                <div className="text-xs text-muted-foreground text-right">
                  PDF de: {selectedRevisor}
                </div>
              )}
              <Button 
                variant="outline" 
                onClick={handleDownload}
                disabled={!selectedRevisor || !getRevisionIdForSelectedRevisor}
              >
                <Download className="w-4 h-4 mr-2" /> 
                {selectedRevisor ? "Descargar PDF Revisado" : "Seleccionar Revisor"}
              </Button>
            </div>
          </div>

          <hr className="border-gray-200" />

          <div className="text-sm space-y-1">
            <h2 className="font-semibold text-gray-900">Cronograma</h2>
            <div className="flex gap-12 text-muted-foreground">
              <div>
                <span>
                  <strong>Fecha de Entrega:</strong>{" "}
                  {detalle?.entregableFechaEnvio
                    ? new Date(detalle.entregableFechaEnvio).toLocaleDateString()
                    : "No disponible"}
                </span>
              </div>
              <div>
                <span>
                  <strong>Fecha Límite:</strong>{" "}
                  {detalle?.entregableFechaFin
                    ? new Date(detalle.entregableFechaFin).toLocaleDateString()
                    : "No disponible"}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <TabsObservacionesAlumno
          observaciones={observaciones}
          setObservaciones={setObservaciones}
          detalle={detalle}
          orden={orden}
          setOrden={setOrden}
          filtroCorregido={filtroCorregido}
          setFiltroCorregido={setFiltroCorregido}
          busqueda={busqueda}
          setBusqueda={setBusqueda}
        />
      </div>


      <div className="w-full md:w-80 space-y-6 mt-14">       
        <div className="bg-white border rounded-md p-4">
          <h3 className="font-semibold mb-2">Estado de la Revisión</h3>
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span>Estado:</span>
              <Badge
                className={
                  detalle?.entregableEstado === "aprobado"
                    ? "bg-blue-100 text-blue-800"
                    : detalle?.entregableEstado === "rechazado"
                    ? "bg-red-100 text-red-800"
                    : detalle?.entregableEstado === "revisado"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }
              >
                {detalle?.entregableEstado
                  ? detalle.entregableEstado.charAt(0).toUpperCase() + detalle.entregableEstado.slice(1)
                  : "Sin estado"}
              </Badge>
            </div>
            <div>
              <span className="block mb-1">Detección de Plagio</span>
             {/*  <progress value={1} className="h-2" />
              <span className="text-xs text-muted-foreground mt-1 block">Nivel aceptable de plagio</span>
              */}
            </div>
            <div className="flex items-center justify-between text-green-700">
              <span>Formato válido:</span>
              <CheckCircle className="w-4 h-4" />
            </div>
            <div className={`flex items-center justify-between ${detalle?.entregableFechaEnvio && detalle?.entregableFechaFin && new Date(detalle.entregableFechaEnvio) > new Date(detalle.entregableFechaFin) ? "text-red-700" : "text-green-700"}`}>
              <span>
                Entrega a tiempo:
              </span>
              {detalle?.entregableFechaEnvio && detalle?.entregableFechaFin && new Date(detalle.entregableFechaEnvio) > new Date(detalle.entregableFechaFin) ? (
                <XCircle className="w-4 h-4 text-red-700" />
              ) : (
                <CheckCircle className="w-4 h-4 text-green-700" />
              )}
            </div>
            <div className="text-sm mt-2">
            <strong>Observaciones:</strong> {totalObservaciones}
            <div className="text-xs text-muted-foreground">
              {totalResueltas} resueltas / {totalPendientes} pendientes
            </div>
          </div>
          </div>
        </div>

    

        {/* Sección con tarjetas de usuarios y suma de notas */}
      <div className="bg-white border rounded-md p-4">
        <h3 className="font-semibold mb-2">Historial de Revisión</h3>
        
        {/* Selector de revisor para descarga */}
        {Object.keys(criteriosAgrupadosPorUsuario).length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold mb-2 text-sm text-blue-800">Descargar PDF Anotado</h4>
            <Select value={selectedRevisor || ""} onValueChange={setSelectedRevisor}>
              <SelectTrigger className="w-full mb-2">
                <SelectValue placeholder="Selecciona un revisor" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(criteriosAgrupadosPorUsuario).map((nombreRevisor) => {
                  const usuario = usuarios.find(u => `${u.nombres} ${u.primerApellido} ${u.segundoApellido}` === nombreRevisor);
                  let rolLabel = "";
                  if (usuario?.rolId === 2) {
                    const jurados = usuarios.filter(u => u.rolId === 2);
                    const juradoIndex = jurados.findIndex(u => u.usuarioId === usuario.usuarioId) + 1;
                    rolLabel = `Jurado ${juradoIndex}`;
                  } else if (usuario?.rolId === 1) {
                    rolLabel = "Asesor";
                  } else if (usuario?.rolId === 4) {
                    rolLabel = "Revisor";
                  }
                  
                  return (
                    <SelectItem key={nombreRevisor} value={nombreRevisor}>
                      {nombreRevisor} {rolLabel && `(${rolLabel})`}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <Button 
              onClick={handleDownload} 
              disabled={!selectedRevisor || !getRevisionIdForSelectedRevisor}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Descargar PDF Revisado
            </Button>
          </div>
        )}

        {/* Revisores y Notas */}
        <div className="space-y-4">
          <h4 className="font-semibold mb-2 text-xs">Revisores y Notas</h4>
          <div className="space-y-2">
            {Object.entries(criteriosAgrupadosPorUsuario).map(([nombre, lista], idx) => {
              const sumaNotas = lista.reduce((acc, crit) => acc + (crit.nota || 0), 0);
              const usuario = usuarios.find(u => `${u.nombres} ${u.primerApellido} ${u.segundoApellido}` === nombre);
              let rolLabel = "";
              let nombreLabel = nombre;
              if (usuario?.rolId === 2) {
                // Jurado numerado
                const jurados = usuarios.filter(u => u.rolId === 2);
                const juradoIndex = jurados.findIndex(u => u.usuarioId === usuario.usuarioId) + 1;
                rolLabel = `Jurado ${juradoIndex}`;
                nombreLabel = `${usuario.nombres} ${usuario.primerApellido} ${usuario.segundoApellido}`;
              } else if (usuario?.rolId === 1) {
                rolLabel = "Asesor";
                nombreLabel = `${usuario.nombres} ${usuario.primerApellido} ${usuario.segundoApellido}`;
              } else if (usuario?.rolId === 4) {
                rolLabel = "Revisor";
                nombreLabel = `${usuario.nombres} ${usuario.primerApellido} ${usuario.segundoApellido}`;
              }
              
              return (
                <Card key={nombre} className="shadow-sm border">
                  <CardHeader className="pb-1">
                    <CardTitle className="text-xs font-normal">
                      <span className="font-semibold">Revisado por:</span>{" "}
                      <span className="font-normal">{nombreLabel}</span>
                      {rolLabel && (
                        <span className="font-normal text-muted-foreground"> ({rolLabel})</span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground flex items-center justify-between w-full">
                    <span className="font-semibold text-black mt-1">
                      Nota: {sumaNotas.toFixed(1)}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="ml-2 py-1 px-2"
                      onClick={() => setSelectedRevisor(nombre)}
                    >
                      Ver Detalles
                    </Button>
                  </CardContent>
                </Card>
              );
            })}

            {/* Nota final */}
            <div className="pt-3 text-xs">
              <h4 className="font-semibold mb-1">Nota Final</h4>
              <div className="text-muted-foreground text-base font-bold">
                {criterios.length > 0
                  ? (
                      criterios.reduce((acc, crit) => acc + (crit.nota || 0), 0) / criterios.length
                    ).toFixed(2)
                  : "Sin nota"}
              </div>
            </div>
          </div>
        </div>
        <Dialog open={!!selectedRevisor} onOpenChange={() => setSelectedRevisor(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Rúbrica de Evaluación</DialogTitle>
              <p className="text-sm text-muted-foreground">
                {selectedRevisor && criteriosAgrupadosPorUsuario[selectedRevisor]?.[0]?.entregableDescripcion
                  ? `Entregable: ${criteriosAgrupadosPorUsuario[selectedRevisor][0].entregableDescripcion}`
                  : ""}
              </p>
            </DialogHeader>

            {selectedRevisor && (
              <>
                <div className="flex items-center justify-between mb-4 p-4 bg-muted rounded-lg">
                  <div>
                    <h3 className="font-medium text-sm">Puntuación Total</h3>
                    <p className="text-sm text-muted-foreground">
                      {criteriosAgrupadosPorUsuario[selectedRevisor]
                        .reduce((acc, crit) => acc + (crit.nota || 0), 0)
                        .toFixed(1)}{" "}
                      /{" "}
                      {criteriosAgrupadosPorUsuario[selectedRevisor]
                        .reduce((acc, crit) => acc + (crit.notaMaxima || 0), 0)}
                      {" "}puntos
                    </p>
                  </div>
                </div>

                <Card>
                  <CardContent className="pt-4">
                    <Accordion type="multiple">
                      {criteriosAgrupadosPorUsuario[selectedRevisor].map((item) => (
                        <AccordionItem
                          key={item.criterioEntregableId}
                          value={item.criterioEntregableId?.toString()}
                        >
                          <AccordionTrigger>
                            <div className="flex justify-between w-full">
                              <div className="flex items-center gap-2 text-left">
                                <span>{item.nombreCriterio}</span>
                                {(item.nota ?? 0) > 0 && (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                )}
                              </div>
                              <Badge variant="outline">{item.notaMaxima} pts</Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-3 text-sm">
                              <div>
                                <h4 className="font-medium">Descripción:</h4>
                                <p className="whitespace-pre-line">
                                  {item.descripcionCriterio}
                                </p>
                              </div>
                              <div>
                                <h4 className="font-medium">Comentario:</h4>
                                <p className="whitespace-pre-line">
                                  {item.observacion || "Sin comentario"}
                                </p>
                              </div>
                              <div>
                                <h4 className="font-medium">Nota:</h4>
                                <p>
                                  {item.nota} / {item.notaMaxima} pts
                                </p>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </>
            )}

            <DialogFooter className="pt-4">
              <Button onClick={() => setSelectedRevisor(null)}>Cerrar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>  
      </div>
    </div>
  );
}
