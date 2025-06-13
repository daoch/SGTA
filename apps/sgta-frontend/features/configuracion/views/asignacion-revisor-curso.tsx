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
import { ArrowLeft } from "lucide-react";
import { Curso } from "../dtos/curso";
import { RevisorPorAsignar } from "../dtos/revisor-por-asignar"; // Renombra si lo deseas
import { toast } from "sonner";
import AppLoading from "@/components/loading/app-loading";
import { Input } from "@/components/ui/input";

const AsignacionRevisorCursoPage: React.FC = () => {
  const [loadingEtapas, setLoadingEtapas] = useState(true);
  const [loadingRevisores, setLoadingRevisores] = useState(true);
  const router = useRouter();
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState<Curso | null>();
  const [revisores, setRevisores] = useState<RevisorPorAsignar[]>([]);
  const [revisoresSeleccionados, setRevisoresSeleccionados] = useState<
    RevisorPorAsignar[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [filtro, setFiltro] = useState("");

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
        exitos++;
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
    return (
      r.nombres.toLowerCase().includes(filtroLower) ||
      r.primerApellido.toLowerCase().includes(filtroLower) ||
      r.segundoApellido.toLowerCase().includes(filtroLower) ||
      r.correoElectronico.toLowerCase().includes(filtroLower) ||
      r.codigoPucp.toLowerCase().includes(filtroLower)
    );
  });

  useEffect(() => {
    setRevisoresSeleccionados([]);
  }, [filtro]);

  if (loadingEtapas || loadingRevisores) {
    return <AppLoading />;
  }

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
          onClick={handleAsociar}
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Nombre del curso</TableHead>
                <TableHead>Ciclo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cursos.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center text-muted-foreground py-4"
                  >
                    No hay cursos para mostrar.
                  </TableCell>
                </TableRow>
              ) : (
                cursos.map((curso) => (
                  <TableRow key={curso.id}>
                    <TableCell>
                      <Checkbox
                        checked={cursoSeleccionado?.id === curso.id}
                        onCheckedChange={() => handleSelectCurso(curso)}
                        aria-label={`Seleccionar curso ${curso.etapaFormativaNombre} (${curso.cicloNombre})`}
                      />
                    </TableCell>
                    <TableCell>{curso.etapaFormativaNombre}</TableCell>
                    <TableCell>{curso.cicloNombre}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Input para filtrar revisores */}
      <div className="mb-2 flex items-center gap-2">
        <span className="font-medium">Filtrar revisores:</span>
        <Input
          placeholder="Buscar por nombre, apellido, correo o código PUCP"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {/* Card con tabla de revisores y checkbox para seleccionar todos */}
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
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
                <TableHead>Código PUCP</TableHead>
                <TableHead>Nombres</TableHead>
                <TableHead>Primer Apellido</TableHead>
                <TableHead>Segundo Apellido</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Carrera</TableHead>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default AsignacionRevisorCursoPage;
