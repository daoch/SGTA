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
import {
  pageTexts,
  tableTexts,
} from "@/features/temas/types/inscripcion/constants";
import {
  fetchTemasAPI,
  fetchUsers,
  obtenerCarrerasPorUsuario,
} from "@/features/temas/types/inscripcion/data";
import {
  AreaDeInvestigacion,
  Carrera,
  Coasesor,
  Tesista,
} from "@/features/temas/types/inscripcion/entities";
import { Tipo } from "@/features/temas/types/inscripcion/enums";
import { buscarUsuarioPorToken } from "@/features/temas/types/propuestas/data";
import { fetchUsuariosFindById } from "@/features/temas/types/temas/data";
import { Tema, Usuario } from "@/features/temas/types/temas/entidades";
import { EstadoTemaNombre } from "@/features/temas/types/temas/enums";
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

  const [usuarioLoggeado, setUsuarioLoggeado] = useState<Usuario>();
  const [estadoTema, setEstadoTema] = useState<EstadoTemaNombre>(
    EstadoTemaNombre.REGISTRADO,
  );

  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        const usuario = await buscarUsuarioPorToken();
        setUsuarioLoggeado(usuario);
      } catch (err: unknown) {
        console.error(err);
        setError("Error al traer al usuario loggeado.");
      }
    };
    obtenerUsuario();
  }, []);

  // Función para recargar los temas
  const fetchTemas = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const inscritosData =
        (await fetchTemasAPI("Asesor", EstadoTemaNombre.INSCRITO)) || [];
      const libresData =
        (await fetchTemasAPI("Asesor", EstadoTemaNombre.PROPUESTO_LIBRE)) || [];
      const interesadosData =
        (await fetchTemasAPI("Asesor", EstadoTemaNombre.PROPUESTO_GENERAL)) ||
        [];
      const preInscritosData =
        (await fetchTemasAPI("Asesor", EstadoTemaNombre.PREINSCRITO)) || [];
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
    if (!usuarioLoggeado) return;
    const fetchData = async () => {
      try {
        //obtener la carrera
        const carreras = await obtenerCarrerasPorUsuario();
        setCarrera(carreras);

        const response = await axiosInstance.get("subAreaConocimiento/list");
        setSubareasDisponibles(response.data);

        //llenar datos del asesor mediante su id y no por su carrera
        const usuario = await fetchUsuariosFindById(Number(usuarioLoggeado.id));
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

        console.log({ carreras });
        if (carreras) {
          const tesistasData: Tesista[] = await fetchUsers(
            carreras[0].id, // TODO: SE ESTA TOMANDO SOLO LA PRIMERA CARRERA, CAMBIAR
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
  }, [usuarioLoggeado, fetchTemas]);

  return (
    <div className="space-y-8 mt-4">
      <div className="flex items-end justify-between">
        {/* About Page */}
        <div className="w-4/5">
          <h1 className="text-3xl font-bold text-[#042354]">
            {pageTexts.title}
          </h1>
          <p className="text-muted-foreground">{pageTexts.description}</p>
        </div>

        {/* Button Nuevo Tema */}
        <Dialog
          open={isNuevoTemaDialogOpen}
          onOpenChange={setIsNuevoTemaDialogOpen}
        >
          <DialogTrigger asChild>
            <div className="w-1/5 flex justify-end">
              <Button disabled={!asesorData}>
                <Plus></Plus>
                {pageTexts.newTemaButton.displayName}
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
      <Tabs defaultValue={estadoTema} className="w-full">
        <TabsList>
          {Object.entries(tableTexts)
            .filter(([, value]) => value.show)
            .map(([key, value]) => (
              <TabsTrigger key={key} value={key}>
                {value.tabLabel}
              </TabsTrigger>
            ))}
        </TabsList>

        {/* Table Content */}
        {Object.entries(tableTexts)
          .filter(([, value]) => value.show)
          .map(([key, value]) => (
            <TabsContent key={key} value={key}>
              <Card>
                <CardHeader>
                  <CardTitle>{value.title}</CardTitle>
                  <CardDescription>{value.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <TemasTable
                    temasData={temasData}
                    filter={
                      key === Tipo.INTERESADO
                        ? [Tipo.INTERESADO, Tipo.PREINSCRITO]
                        : [key]
                    }
                    isLoading={isLoading}
                    error={error}
                    asesor={asesorData}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          ))}
      </Tabs>
    </div>
  );
};

export default Page;
