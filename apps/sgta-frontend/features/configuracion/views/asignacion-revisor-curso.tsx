"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axios/axios-instance";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { Curso } from "../dtos/curso";
import { RevisorPorAsignar } from "../dtos/revisor-por-asignar"; // Renombra si lo deseas
import { toast } from "sonner";
import AppLoading from "@/components/loading/app-loading";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const AsignacionRevisorCursoPage: React.FC = () => {
  const [loadingEtapas, setLoadingEtapas] = useState(true);
  const [loadingRevisores, setLoadingRevisores] = useState(true);
  const [loadingRevisoresAsignados, setLoadingRevisoresAsignados] =
    useState(true);
  const router = useRouter();
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState<Curso | null>();
  const [revisores, setRevisores] = useState<RevisorPorAsignar[]>([]);
  const [revisoresAsignados, setRevisoresAsignados] = useState<
    RevisorPorAsignar[]
  >([]);
  const [revisoresSeleccionados, setRevisoresSeleccionados] = useState<
    RevisorPorAsignar[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [filtro, setFiltro] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const response = await axiosInstance.get(
          "/etapa-formativa-x-ciclo/listarEtapasFormativasXCicloXCarrera",
        );
        setCursos(response.data);
      } catch (error) {
        console.error("Error al cargar los cursos:", error);
        toast.error("Error al cargar los cursos.");
      } finally {
        setLoadingEtapas(false);
      }
    };
    fetchCursos();
  }, []);

  useEffect(() => {
    const fetchRevisores = async () => {
      try {
        const response = await axiosInstance.get(
          "/usuario/listarRevisoresPorCarrera",
        );
        setRevisores(response.data);
      } catch (error) {
        console.error("Error al cargar los revisores:", error);
        toast.error("Error al cargar los revisores.");
      } finally {
        setLoadingRevisores(false);
      }
    };
    fetchRevisores();
  }, []);

  useEffect(() => {
    const fetchRevisoresAsignados = async () => {
      try {
        const response = await axiosInstance.get(
          "/etapaFormativaXCicloXUsuarioRol/revisores",
        );
        setRevisoresAsignados(response.data);
      } catch (error) {
        console.error("Error al cargar los revisores asignados:", error);
        toast.error("Error al cargar los revisores asignados.");
      } finally {
        setLoadingRevisoresAsignados(false);
      }
    };
    fetchRevisoresAsignados();
  }, []);

  // Selección de curso (solo uno)
  const handleSelectCurso = (curso: Curso) => {
    setCursoSeleccionado(
      cursoSeleccionado && cursoSeleccionado.id === curso.id ? null : curso,
    );
  };

  // Selección múltiple de revisores (para el checkbox del header)
  const handleSelectAllRevisores = (checked: boolean) => {
    if (checked) {
      setRevisoresSeleccionados(revisoresFiltrados);
    } else {
      setRevisoresSeleccionados([]);
    }
  };

  // Selección individual de revisores (para el checkbox de cada fila)
  const handleRevisorCheckbox = (
    revisor: RevisorPorAsignar,
    checked: boolean,
  ) => {
    setRevisoresSeleccionados((prev) =>
      checked ? [...prev, revisor] : prev.filter((t) => t.id !== revisor.id),
    );
  };

  const handleAsociar = async () => {
    if (
      !cursoSeleccionado ||
      revisoresSeleccionados?.length === 0 ||
      revisoresSeleccionados === null
    )
      return;
    setLoading(true);

    let exitos = 0;
    const countRevisoresSeleccionados = revisoresSeleccionados.length;
    for (const revisor of revisoresSeleccionados) {
      try {
        await axiosInstance.post(
          `/etapaFormativaXCicloXUsuarioRol/asignarRevisor/curso/${cursoSeleccionado.id}/revisor/${revisor.id}`,
        );
        console.log("Revisores seleccionados:", revisoresSeleccionados);
        exitos++;
        revisor.etapaFormativaXCicloId = cursoSeleccionado.id;
        setRevisoresAsignados((prev) => [...prev, revisor]);
      } catch (error) {
        console.error(
          `No se pudo asignar a ${revisor.nombres} ${revisor.primerApellido}: ${error}`,
        );
        toast.error(
          `No se pudo asignar a ${revisor.nombres} ${revisor.primerApellido}: Ya existe este revisor asignado al curso ${cursoSeleccionado.etapaFormativaNombre} (${cursoSeleccionado.cicloNombre})`,
        );
      }
    }

    if (exitos > 0 && exitos == countRevisoresSeleccionados) {
      toast.success("Todos los revisores fueron asignados correctamente.");
    } else {
      toast.warning(
        `${exitos} de ${countRevisoresSeleccionados} revisores fueron asignados correctamente.`,
      );
    }
    setCursoSeleccionado(null);
    setRevisoresSeleccionados([]);
    setLoading(false);
  };

  // Filtrado por input
  const revisoresFiltrados = revisores.filter((r) => {
    const filtroLower = filtro.toLowerCase();
    const nombreCompleto =
      `${r.nombres} ${r.primerApellido} ${r.segundoApellido}`.toLowerCase();
    return (
      nombreCompleto.includes(filtroLower) ||
      r.nombres.toLowerCase().includes(filtroLower) ||
      r.primerApellido.toLowerCase().includes(filtroLower) ||
      r.segundoApellido.toLowerCase().includes(filtroLower) ||
      r.correoElectronico.toLowerCase().includes(filtroLower) ||
      r.codigoPucp.toLowerCase().includes(filtroLower)
    );
  });

  if (loadingEtapas || loadingRevisores || loadingRevisoresAsignados) {
    return <AppLoading />;
  }

  const handleAsignarClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmAsignar = async () => {
    setShowConfirmModal(false);
    await handleAsociar();
  };

  return (
    <div className="w-full px-6 py-6">
      <div className="flex items-center mb-6 justify-between">
        <div className="flex items-center">
          <Button
            id="btnBack"
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">
            Asignación de revisores a cursos
          </h1>
        </div>
        <Button
          className="bg-[#042354] text-white"
          disabled={
            !cursoSeleccionado || revisoresSeleccionados.length === 0 || loading
          }
          onClick={handleAsignarClick}
        >
          {loading ? "Asignando..." : "Asignar revisores"}
        </Button>
      </div>

      {/* Label Selecciona un curso */}
      <div className="mb-2">
        <span className="font-medium">Selecciona un curso:</span>
      </div>

      {/* Card con tabla de cursos y checkbox para seleccionar uno */}
      <Card className="mb-6">
        <CardContent>
          <div className="w-full overflow-x-auto">
            <Table className="min-w-[900px] w-full table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/32"></TableHead>
                  <TableHead className="w-29/32 text-left">
                    Nombre del curso
                  </TableHead>
                  <TableHead className="w-1/16 text-left">Ciclo</TableHead>
                  <TableHead className="w-1/4 text-left">
                    Revisores asignados
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cursos.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground py-4"
                    >
                      No hay cursos para mostrar.
                    </TableCell>
                  </TableRow>
                ) : (
                  cursos.map((curso) => {
                    // Filtra los revisores asignados a este curso
                    const revisoresCurso = revisoresAsignados.filter(
                      (rev) => rev.etapaFormativaXCicloId === curso.id,
                    );
                    return (
                      <TableRow key={curso.id}>
                        <TableCell>
                          <Checkbox
                            checked={cursoSeleccionado?.id === curso.id}
                            onCheckedChange={() => handleSelectCurso(curso)}
                            aria-label={`Seleccionar curso ${curso.etapaFormativaNombre} (${curso.cicloNombre})`}
                          />
                        </TableCell>
                        <TableCell className="text-left">
                          {curso.etapaFormativaNombre}
                        </TableCell>
                        <TableCell className="text-left">
                          {curso.cicloNombre}
                        </TableCell>
                        <TableCell className="text-left">
                          {revisoresCurso.length > 0 ? (
                            <div className="flex items-center gap-2">
                              <span>
                                {revisoresCurso[0].nombres}{" "}
                                {revisoresCurso[0].primerApellido}
                                {revisoresCurso.length > 1 && (
                                  <> + {revisoresCurso.length - 1}</>
                                )}
                              </span>
                              {revisoresCurso.length > 1 && (
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 p-0"
                                      aria-label="Ver todos los revisores"
                                    >
                                      <ChevronDown className="h-4 w-4" />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-56">
                                    <div>
                                      <span className="font-semibold text-sm mb-2 block">
                                        Revisores:
                                      </span>
                                      <ul className="list-disc pl-4">
                                        {revisoresCurso.map((rev) => (
                                          <li key={rev.id}>
                                            {rev.nombres} {rev.primerApellido}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-xs">
                              Sin revisores
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Input para filtrar revisores */}
      <div className="mb-2 flex items-center gap-2">
        <span className="font-medium">Filtrar revisores:</span>
        <Input
          placeholder="Buscar por nombres, apellidos, correo o código PUCP"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="max-w-92"
        />
      </div>

      {/* Card con tabla de revisores y checkbox para seleccionar todos */}
      <Card>
        <CardContent>
          <div className="w-full overflow-x-auto">
            <Table className="min-w-[700px] w-full table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/16">
                    <Checkbox
                      checked={
                        revisoresSeleccionados !== null &&
                        revisoresSeleccionados.length ===
                          revisoresFiltrados.length &&
                        revisoresFiltrados.length > 0
                      }
                      onCheckedChange={handleSelectAllRevisores}
                      aria-label="Seleccionar todos los revisores"
                      id="select-all-checkbox"
                    />
                  </TableHead>
                  <TableHead className="w-37/288">Código PUCP</TableHead>
                  <TableHead className="w-37/288">Nombres</TableHead>
                  <TableHead className="w-37/288">Primer Apellido</TableHead>
                  <TableHead className="w-37/288">Segundo Apellido</TableHead>
                  <TableHead className="w-1/6">Correo</TableHead>
                  <TableHead className="w-37/288">Rol</TableHead>
                  <TableHead className="w-37/288">Carrera</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {revisoresFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center text-muted-foreground py-8"
                    >
                      No hay revisores para mostrar.
                    </TableCell>
                  </TableRow>
                ) : (
                  revisoresFiltrados.map((revisor) => (
                    <TableRow key={revisor.id}>
                      <TableCell>
                        <Checkbox
                          checked={revisoresSeleccionados?.some(
                            (t) => t.id === revisor.id,
                          )}
                          onCheckedChange={(checked) =>
                            handleRevisorCheckbox(revisor, !!checked)
                          }
                          aria-label={`Seleccionar revisor ${revisor.nombres} ${revisor.primerApellido}`}
                        />
                      </TableCell>
                      <TableCell>{revisor.codigoPucp}</TableCell>
                      <TableCell>{revisor.nombres}</TableCell>
                      <TableCell>{revisor.primerApellido}</TableCell>
                      <TableCell>{revisor.segundoApellido}</TableCell>
                      <TableCell>{revisor.correoElectronico}</TableCell>
                      <TableCell>{revisor.rolNombre}</TableCell>
                      <TableCell>{revisor.carreraNombre}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar asignación de revisores</DialogTitle>
          </DialogHeader>
          <div className="py-2 text-sm text-muted-foreground">
            ¿Estás seguro de que deseas asignar los revisores seleccionados al
            curso{" "}
            <b>
              {cursoSeleccionado?.etapaFormativaNombre} (
              {cursoSeleccionado?.cicloNombre})
            </b>
            ?<br />
            <span className="text-red-600 font-semibold">
              Esta acción no se puede revertir.
            </span>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmModal(false)}
            >
              Cancelar
            </Button>
            <Button
              className="bg-[#042354] text-white"
              onClick={handleConfirmAsignar}
              disabled={loading}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AsignacionRevisorCursoPage;
