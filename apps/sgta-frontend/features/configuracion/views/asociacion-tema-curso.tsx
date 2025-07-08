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
import { ArrowLeft, ChevronDown } from "lucide-react";
import { Curso } from "../dtos/curso";
import { TemaPorAsociar } from "../dtos/tema-por-asociar";
import { toast } from "sonner";
import AppLoading from "@/components/loading/app-loading";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ESTADOS = [
  { value: "REGISTRADO", label: "Registrado" },
  { value: "PAUSADO", label: "Pausado" },
];

const estadoColors: Record<string, string> = {
  pendiente: "bg-yellow-100 text-yellow-800",
  aprobado: "bg-green-100 text-green-800",
  rechazado: "bg-red-100 text-red-800",
};

const AsociacionTemaCursoPage: React.FC = () => {
  const [loadingEtapas, setLoadingEtapas] = useState(true);
  const [loadingTemas, setLoadingTemas] = useState(true);
  const router = useRouter();
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState<Curso | null>();
  const [temas, setTemas] = useState<TemaPorAsociar[]>([]);
  const [tabEstado, setTabEstado] = useState<string>("REGISTRADO");
  const [temasSeleccionados, setTemasSeleccionados] = useState<
    TemaPorAsociar[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [filtroCodigo, setFiltroCodigo] = useState("");

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
    const fetchTemas = async () => {
      try {
        const response = await axiosInstance.get(
          "/temas/listarTemasPorAsociarPorCarrera",
        );
        setTemas(response.data);
      } catch (error) {
        console.error("Error al cargar los temas:", error);
        toast.error("Error al cargar los temas.");
      } finally {
        setLoadingTemas(false);
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
    let exitos = 0;
    const countTemasSeleccionados = temasSeleccionados.length;
    for (const tema of temasSeleccionados) {
      try {
        await axiosInstance.post(
          `/temas/asociar-tema-curso/curso/${cursoSeleccionado.id}/tema/${tema.id}`,
        );
        exitos++;
        setTemas((prev) =>
          prev.map((t) =>
            t.id !== undefined && t.id === tema.id
              ? { ...t, estadoTemaNombre: "EN_PROGRESO" }
              : t,
          ),
        );
      } catch (error) {
        console.error("Error al asociar temas al curso:", error);
        toast.error(
          `Error al asociar el tema "${tema.titulo}" al curso ${cursoSeleccionado.etapaFormativaNombre}`,
        );
      }
    }

    if (exitos > 0 && exitos == countTemasSeleccionados) {
      toast.success("Todos los temas fueron asociados correctamente.");
    } else {
      toast.warning(
        `${exitos} de ${countTemasSeleccionados} temas fueron asociados correctamente.`,
      );
    }
    setCursoSeleccionado(null);
    setTemasSeleccionados([]);
    setLoading(false);
  };

  const temasFiltrados = temas.filter((tema) => {
    // Filtrado por estado
    const estadoOk =
      tabEstado === "" ? true : tema.estadoTemaNombre === tabEstado;

    // Filtrado por códigos separados por coma
    if (filtroCodigo.trim() === "") return estadoOk;

    // Procesar los códigos ingresados
    const codigos = filtroCodigo
      .split(",")
      .map((c) => c.trim().toLowerCase())
      .filter((c) => c.length > 0);

    // Si no hay códigos válidos, no filtrar por código
    if (codigos.length === 0) return estadoOk;

    // Verifica si el código del tema está en la lista
    return estadoOk && codigos.includes((tema.codigo ?? "").toLowerCase());
  });

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

  if (loadingEtapas || loadingTemas) {
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
            Asociación de temas a cursos
          </h1>
        </div>
        <Button
          className="bg-[#042354] text-white"
          disabled={
            !cursoSeleccionado || temasSeleccionados.length === 0 || loading
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
          <div className="w-full overflow-x-auto">
            <Table className="min-w-[700px] w-full table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/32"></TableHead>
                  <TableHead className="w-29/32 text-left">
                    Nombre del curso
                  </TableHead>
                  <TableHead className="w-1/16 text-left">Ciclo</TableHead>
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
                      <TableCell className="w-12">
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
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
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

      <div className="mb-2 flex items-center gap-2">
        <span className="font-medium">Buscar temas por código:</span>
        <Input
          placeholder="Ingrese el código de los temas separados por comas"
          value={filtroCodigo}
          onChange={(e) => setFiltroCodigo(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Card con tabla de temas y checkbox para seleccionar todos */}
      <Card>
        <CardContent>
          <div className="w-full overflow-x-auto">
            <Table className="min-w-[700px] w-full table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/16">
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
                  <TableHead className="w-1/8">Código</TableHead>
                  <TableHead className="w-5/8">Título</TableHead>
                  <TableHead className="w-1/8 text-left">Tesista</TableHead>
                  <TableHead className="w-1/16 text-left">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {temasFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
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
                      <TableCell>{tema.codigo}</TableCell>
                      <TableCell className="font-medium truncate max-w-[180px]">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="truncate block cursor-pointer">
                                {tema.titulo}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>{tema.titulo}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell className="text-left">
                        {tema.tesistas && tema.tesistas.length > 0 ? (
                          <div className="flex items-center gap-2">
                            <span>
                              {tema.tesistas[0].nombres}{" "}
                              {tema.tesistas[0].primerApellido}
                              {tema.tesistas.length > 1 && (
                                <> + {tema.tesistas.length - 1}</>
                              )}
                            </span>
                            {tema.tesistas.length > 1 && (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 p-0"
                                    aria-label="Ver todos los tesistas"
                                  >
                                    <ChevronDown className="h-4 w-4" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-56">
                                  <div>
                                    <span className="font-semibold text-sm mb-2 block">
                                      Tesistas:
                                    </span>
                                    <ul className="list-disc pl-4">
                                      {tema.tesistas.map(
                                        (tesista: {
                                          nombres: string;
                                          primerApellido: string;
                                          id: string;
                                        }) => (
                                          <li key={tesista.id}>
                                            {tesista.nombres}{" "}
                                            {tesista.primerApellido}
                                          </li>
                                        ),
                                      )}
                                    </ul>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs">
                            Sin tesistas
                          </span>
                        )}
                      </TableCell>

                      <TableCell className="text-left">
                        <Badge
                          className={
                            estadoColors[tema.estadoTemaNombre] ||
                            "bg-gray-100 text-gray-800"
                          }
                        >
                          {ESTADOS.find(
                            (e) => e.value === tema.estadoTemaNombre,
                          )?.label ?? tema.estadoTemaNombre}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AsociacionTemaCursoPage;
