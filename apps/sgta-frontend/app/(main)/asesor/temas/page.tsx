"use client";

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
import { fetchUsers } from "@/features/temas/types/inscripcion/data";
import {
  AreaDeInvestigacion,
  Carrera,
  Coasesor,
  Tema,
  Tesista,
} from "@/features/temas/types/inscripcion/entities";
import { Tipo } from "@/features/temas/types/inscripcion/enums";
import {
  fetchTemasAPI,
  fetchUsuariosFindById,
  obtenerCarrerasPorUsuario,
} from "@/features/temas/types/temas/data";
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
  const [carrera, setCarrera] = useState<Carrera[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const usuarioId = 1;

  // Función para recargar los temas
  const fetchTemas = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const inscritosData = (await fetchTemasAPI("Asesor", "INSCRITO")) || [];
      const libresData =
        (await fetchTemasAPI("Asesor", "PROPUESTO_LIBRE")) || [];
      const interesadosData =
        (await fetchTemasAPI("Asesor", "PROPUESTO_GENERAL")) || [];
      const preInscritosData =
        (await fetchTemasAPI("Asesor", "PREINSCRITO")) || [];
      setTemasData([
        ...inscritosData,
        ...libresData,
        ...interesadosData,
        ...preInscritosData,
      ]);
      console.log("consegui los temas data");
    } catch (err: unknown) {
      console.log(err);
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

        //setAsesorData(coasesoresData[0]); // TODO El asesor logeado debe traerse globalmente

        //llenar datos del asesor mediante su id y no por su carrera
        const usuario = await fetchUsuariosFindById(usuarioId);
        const coasesor: Coasesor = {
          id: usuario.id,
          tipoUsuario: usuario.tipoUsuario.nombre,
          codigoPucp: usuario.codigoPucp,
          nombres: usuario.nombres,
          primerApellido: usuario.primerApellido,
          segundoApellido: usuario.segundoApellido,
          correoElectronico: usuario.correoElectronico || "",
          nivelEstudios: usuario.nivelEstudios,
          contrasena: usuario.contrasena,
          biografia: usuario.biografia,
          enlaceRepositorio: usuario.enlaceRepositorio,
          enlaceLinkedin: usuario.enlaceLinkedin,
          disponibilidad: usuario.disponibilidad,
          tipoDisponibilidad: usuario.tipoDisponibilidad,
          activo: usuario.activo,
          fechaCreacion: usuario.fechaCreacion,
          fechaModificacion: usuario.fechaModificacion,
        };
        setAsesorData(coasesor);

        //obtener la carrera
        const carreras = await obtenerCarrerasPorUsuario(usuarioId);
        setCarrera(carreras);
        console.log({ carreras });
        if (carreras) {
          //SE ESTA TOMANDO SOLO LA PRIMERA CARRERA, CAMBIAR
          const tesistasData: Tesista[] = await fetchUsers(
            carreras[0].id,
            "alumno",
          );
          setEstudiantesDisponibles(tesistasData.filter((t) => !t.asignado)); // No deben estar asignados

          const coasesoresData: Coasesor[] = await fetchUsers(
            carreras[0].id,
            "profesor",
          );
          setCoasesoresDisponibles(coasesoresData);
        }
      } catch (error) {
        console.error("Error cargando subáreas:", error);
      }
    };

    fetchData().then(() => fetchTemas());
  }, [usuarioId, fetchTemas]);

  return (
    <div className="space-y-8 mt-4">
      <div className="flex items-end justify-between">
        {/* Intro */}
        <div className="w-4/5">
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
            <div className="w-1/5 flex justify-end">
              <Button disabled={!asesorData}>
                <Plus></Plus>Nuevo Tema
              </Button>
            </div>
          </DialogTrigger>
          {asesorData && carrera && (
            <NuevoTemaDialog
              isOpen={isNuevoTemaDialogOpen}
              setIsNuevoTemaDialogOpen={setIsNuevoTemaDialogOpen}
              coasesoresDisponibles={coasesoresDisponibles}
              estudiantesDisponibles={estudiantesDisponibles}
              subareasDisponibles={subareasDisponibles}
              carrera={carrera[0]}
              onTemaGuardado={fetchTemas}
              asesor={asesorData}
            />
          )}
        </Dialog>
      </div>

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
                filter={[Tipo.TODOS]}
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
                filter={[Tipo.INSCRITO]}
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
                filter={[Tipo.LIBRE]}
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
                filter={[Tipo.INTERESADO, Tipo.PREINSCRITO]}
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
