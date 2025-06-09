"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axios/axios-instance";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Curso } from "../dtos/curso";
import { TemaPorAsociar } from "../dtos/tema-por-asociar";
import { toast } from "sonner";

const ESTADOS = [
  { value: "todos", label: "Todos" },
  { value: "REGISTRADO", label: "Registrado" },
  { value: "EN_PROGRESO", label: "En Progreso" },
  { value: "PAUSADO", label: "Pausado" },
];

const estadoColors: Record<string, string> = {
  pendiente: "bg-yellow-100 text-yellow-800",
  aprobado: "bg-green-100 text-green-800",
  rechazado: "bg-red-100 text-red-800",
};

const AsociacionTemaCursoPage: React.FC = () => {
  const router = useRouter();
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState<Curso | null>();
  const [temas, setTemas] = useState<TemaPorAsociar[]>([]);
  const [tabEstado, setTabEstado] = useState<string>("todos");
  const [temasSeleccionados, setTemasSeleccionados] = useState<
    TemaPorAsociar[]
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const carreraId = 1; // TODO: Reemplazar con el ID de la carrera actual
        const response = await axiosInstance.get(
          `/etapa-formativa-x-ciclo/listarEtapasFormativasXCicloXCarrera/${carreraId}`,
        );
        setCursos(response.data);
      } catch (error) {
        console.error("Error al cargar los cursos:", error);
      }
    };
    fetchCursos();
  }, []);

  useEffect(() => {
    const fetchTemas = async () => {
      try {
        const carreraId = 1; // TODO: Reemplazar con el ID de la carrera actual
        const response = await axiosInstance.get(
          `/temas/listarTemasPorAsociarPorCarrera/${carreraId}`,
        );
        setTemas(response.data);
      } catch (error) {
        console.error("Error al cargar los temas:", error);
      }
    };
    fetchTemas();
  }, []); // Solo una vez al montar

  // Selección de curso (solo uno)
  const handleSelectCurso = (curso: Curso) => {
    setCursoSeleccionado(
      cursoSeleccionado && cursoSeleccionado.id === curso.id ? null : curso,
    );
  };

  // Selección múltiple de temas (para el checkbox del header)
  const handleSelectAllTemas = (checked: boolean) => {
    if (checked) {
      setTemasSeleccionados(temasFiltrados);
    } else {
      setTemasSeleccionados([]);
    }
  };

  // Selección individual de temas (para el checkbox de cada fila)
  const handleTemaCheckbox = (tema: TemaPorAsociar, checked: boolean) => {
    setTemasSeleccionados((prev) =>
      checked ? [...prev, tema] : prev.filter((t) => t.id !== tema.id),
    );
  };

  const handleAsociar = async () => {
    if (
      !cursoSeleccionado ||
      temasSeleccionados?.length === 0 ||
      temasSeleccionados === null
    )
      return;
    setLoading(true);
    try {
      await Promise.all(
        temasSeleccionados.map((tema) =>
          axiosInstance.post(
            `/temas/asociar-tema-curso/curso/${cursoSeleccionado.id}/tema/${tema.id}`,
          ),
        ),
      );
      toast.success("Temas asociados al curso correctamente.");
      // Refresca la lista de temas no asociados
      setTemas((prev) =>
        prev.map((t) =>
          temasSeleccionados.some((sel) => sel.id === t.id)
            ? { ...t, estadoTemaNombre: "EN_PROGRESO" }
            : t,
        ),
      );
      setTemasSeleccionados([]);
    } catch (error) {
      console.error("Error al asociar temas al curso:", error);
    } finally {
      setLoading(false);
    }
  };

  const temasFiltrados = temas.filter((tema) =>
    tabEstado === "todos" ? true : tema.estadoTemaNombre === tabEstado,
  );

  useEffect(() => {
    // Busca el input interno del Checkbox de shadcn/ui
    const checkboxButton = document.getElementById("select-all-checkbox");
    if (checkboxButton && temasSeleccionados !== null) {
      const input = checkboxButton.querySelector("input[type='checkbox']");
      if (input instanceof HTMLInputElement) {
        input.indeterminate =
          temasSeleccionados.length > 0 &&
          temasSeleccionados.length < temasFiltrados.length;
      }
    }
  }, [temasSeleccionados, temasFiltrados]);

  useEffect(() => {
    setTemasSeleccionados([]);
  }, [tabEstado]);

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
            Asociación de temas a cursos
          </h1>
        </div>
        <Button
          className="bg-[#042354] text-white"
          disabled={
            !cursoSeleccionado ||
            temasSeleccionados.length === 0 ||
            loading
          }
          onClick={handleAsociar}
        >
          {loading ? "Asociando..." : "Asociar temas"}
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

      {/* Label Selecciona los temas a asociar */}
      <div className="mb-2">
        <span className="font-medium">Selecciona los temas a asociar:</span>
      </div>

      {/* Tabs para filtrar temas */}
      <Tabs value={tabEstado} onValueChange={setTabEstado} className="mb-4">
        <TabsList>
          {ESTADOS.map((estado) => (
            <TabsTrigger key={estado.value} value={estado.value}>
              {estado.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Card con tabla de temas y checkbox para seleccionar todos */}
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox
                    checked={
                      temasSeleccionados !== null &&
                      temasSeleccionados.length === temasFiltrados.length &&
                      temasFiltrados.length > 0
                    }
                    onCheckedChange={handleSelectAllTemas}
                    aria-label="Seleccionar todos los temas"
                    id="select-all-checkbox"
                  />
                </TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {temasFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground py-8"
                  >
                    No hay temas para mostrar.
                  </TableCell>
                </TableRow>
              ) : (
                temasFiltrados.map((tema) => (
                  <TableRow key={tema.id}>
                    <TableCell>
                      <Checkbox
                        checked={temasSeleccionados?.some(
                          (t) => t.id === tema.id,
                        )}
                        onCheckedChange={(checked) =>
                          handleTemaCheckbox(tema, !!checked)
                        }
                        aria-label={`Seleccionar tema ${tema.titulo}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{tema.titulo}</TableCell>
                    <TableCell>{tema.codigo}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          estadoColors[tema.estadoTemaNombre] ||
                          "bg-gray-100 text-gray-800"
                        }
                      >
                        {ESTADOS.find((e) => e.value === tema.estadoTemaNombre)
                          ?.label ?? tema.estadoTemaNombre}
                      </Badge>
                    </TableCell>
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

export default AsociacionTemaCursoPage;
