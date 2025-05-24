"use client";

import {
  AreaDeInvestigacion,
  Carrera,
  Coasesor,
  Tema,
  Tesista,
} from "@/features/temas/types/inscripcion/entities";
import { Tipo } from "@/features/temas/types/inscripcion/enums";
import NuevoTemaDialog from "@/components/asesor/tema-nuevo-modal";
import { TemasTable } from "@/components/asesor/temas-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axiosInstance from "@/lib/axios/axios-instance";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

/**
 * Rol: Asesor
 * Muestra lista de temas y permite inscribir nuevos temas.
 * @returns Vista Temas
 */
const Page = () => {
  const [isNuevoTemaDialogOpen, setIsNuevoTemaDialogOpen] = useState(false);
  const [coasesoresDisponibles, setCoasesoresDisponibles] = useState<
    Coasesor[]
  >([]);
  const [asesorData, setAsesorData] = useState<Coasesor>();
  const [estudiantesDisponibles, setEstudiantesDisponibles] = useState<
    Tesista[]
  >([]);
  const [subareasDisponibles, setSubareasDisponibles] = useState<
    AreaDeInvestigacion[]
  >([]);
  const [temasData, setTemasData] = useState<Tema[]>([]);
  const [carrera] = useState<Carrera | null>({
    id: 1,
    unidadAcademicaId: null,
    codigo: "INF",
    nombre: "ingeniería informática",
    descripcion: "Carrera de software y sistemas",
    activo: null,
    fechaCreacion: null,
    fechaModificacion: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTemasAPI = async (rol: string, estado: string) => {
    if (asesorData) {
      const url = `temas/listarTemasPorUsuarioRolEstado/${asesorData.id}?rolNombre=${rol}&estadoNombre=${estado}`;
      const response = await axiosInstance.get<Tema[]>(url);
      return response.data;
    }
  };

  // Función para recargar los temas
  const fetchTemas = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const inscritosData = (await fetchTemasAPI("Asesor", "INSCRITO")) || [];
      const libresData =
        (await fetchTemasAPI("Asesor", "PROPUESTO_LIBRE")) || [];
      setTemasData([...inscritosData, ...libresData]);
    } catch (err: unknown) {
      setError("Error al cargar los temas");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("subAreaConocimiento/list");
        setSubareasDisponibles(response.data);

        const tesistasData: Tesista[] = await fetchUsers(1, "alumno");
        setEstudiantesDisponibles(tesistasData.filter((t) => !t.asignado)); // No deben estar asignados

        const coasesoresData: Coasesor[] = await fetchUsers(1, "profesor");
        setCoasesoresDisponibles(coasesoresData);

        setAsesorData(coasesoresData[0]); // TODO El asesor logeado debe traerse globalmente
      } catch (error) {
        console.error("Error cargando subáreas:", error);
      }
    };

    fetchData().then(() => fetchTemas());
  }, [fetchTemas]);

  return (
    <div className="space-y-8 mt-4">
      <div className="flex items-end justify-between">
        {/* Intro */}
        <div>
          <h1 className="text-3xl font-bold text-[#042354]">Mis Temas</h1>
          <p className="text-muted-foreground">
            Gestión de temas de tesis propuestos y asignados
          </p>
        </div>

        {/* Button Nuevo Tema */}
        <Dialog
          open={isNuevoTemaDialogOpen}
          onOpenChange={setIsNuevoTemaDialogOpen}
        >
          <DialogTrigger asChild>
            <Button disabled={!asesorData}>
              <Plus></Plus>Nuevo Tema
            </Button>
          </DialogTrigger>
          {asesorData && (
            <NuevoTemaDialog
              isOpen={isNuevoTemaDialogOpen}
              setIsNuevoTemaDialogOpen={setIsNuevoTemaDialogOpen}
              coasesoresDisponibles={coasesoresDisponibles}
              estudiantesDisponibles={estudiantesDisponibles}
              subareasDisponibles={subareasDisponibles}
              carrera={carrera}
              onTemaGuardado={fetchTemas}
              asesor={asesorData}
            />
          )}
        </Dialog>
      </div>

      {!asesorData && (
        <p className="text-red-500 font-semibold mt-2">
          Error al cargar datos del asesor
        </p>
      )}

      {/* Tabs */}
      <Tabs defaultValue={Tipo.TODOS} className="w-full">
        <TabsList>
          <TabsTrigger value={Tipo.TODOS}>Todos</TabsTrigger>
          <TabsTrigger value={Tipo.INSCRITO}>Inscritos</TabsTrigger>
          <TabsTrigger value={Tipo.LIBRE}>Libres</TabsTrigger>
          <TabsTrigger value={Tipo.INTERESADO}>Interesantes</TabsTrigger>
        </TabsList>
        <TabsContent value={Tipo.TODOS}>
          <Card>
            <CardHeader>
              <CardTitle>Todos los temas</CardTitle>
              <CardDescription>
                Lista de todos los temas de tesis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TemasTable
                temasData={temasData}
                filter={Tipo.TODOS}
                isLoading={isLoading}
                error={error}
                asesor={asesorData}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value={Tipo.INSCRITO}>
          <Card>
            <CardHeader>
              <CardTitle>Temas inscritos</CardTitle>
              <CardDescription>
                Temas de tesis en los que estás inscrito
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TemasTable
                temasData={temasData}
                filter={Tipo.INSCRITO}
                isLoading={isLoading}
                error={error}
                asesor={asesorData}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value={Tipo.LIBRE}>
          <Card>
            <CardHeader>
              <CardTitle>Temas libres</CardTitle>
              <CardDescription>
                Temas de tesis disponibles para postular
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TemasTable
                temasData={temasData}
                filter={Tipo.LIBRE}
                isLoading={isLoading}
                error={error}
                asesor={asesorData}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value={Tipo.INTERESADO}>
          <Card>
            <CardHeader>
              <CardTitle>Temas de interés</CardTitle>
              <CardDescription>
                Temas de tesis que has marcado como interesantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TemasTable
                temasData={temasData}
                filter={Tipo.INTERESADO}
                isLoading={isLoading}
                error={error}
                asesor={asesorData}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;

const fetchUsers = async (
  carreraId: number,
  tipoUsuarioNombre: string,
  cadenaBusqueda: string = "",
) => {
  const url = `/usuario/findByTipoUsuarioAndCarrera?carreraId=${carreraId}&tipoUsuarioNombre=${tipoUsuarioNombre}&cadenaBusqueda=${cadenaBusqueda}`;
  const response = await axiosInstance.get(url);
  return response.data;
};
