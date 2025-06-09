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
  obtenerAreasDelUsuario,
  obtenerCarrerasPorUsuario,
} from "@/features/temas/types/inscripcion/data";
import { Carrera, Coasesor } from "@/features/temas/types/inscripcion/entities";
import { AreaConocimiento } from "@/features/temas/types/postulaciones/entidades";
import { buscarUsuarioPorToken } from "@/features/temas/types/propuestas/data";
import { fetchUsuariosFindById } from "@/features/temas/types/temas/data";
import { Tema, Usuario } from "@/features/temas/types/temas/entidades";
import { EstadoTemaNombre } from "@/features/temas/types/temas/enums";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

/**
 * Rol: Asesor
 * Muestra lista de temas y permite inscribir nuevos temas.
 * @returns Vista Temas
 */
const Page = () => {
  const [isNuevoTemaDialogOpen, setIsNuevoTemaDialogOpen] = useState(false);
  const [asesorData, setAsesorData] = useState<Coasesor>();
  const [areasDisponibles, setAreasDisponibles] = useState<AreaConocimiento[]>(
    [],
  );
  const [temasData, setTemasData] = useState<Tema[]>([]);
  const [carrera, setCarrera] = useState<Carrera[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [usuarioLoggeado, setUsuarioLoggeado] = useState<Usuario>();
  const [estadoTema, setEstadoTema] = useState<EstadoTemaNombre>(
    EstadoTemaNombre.INSCRITO,
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
      console.log("Entro a recoger los temas.");
      setIsLoading(true);
      setError(null);
      let data: Tema[] = [];
      switch (estadoTema) {
        case EstadoTemaNombre.INSCRITO:
          const temasInscritos = (await fetchTemasAPI("", estadoTema)) || [];
          const temasEnProgres =
            (await fetchTemasAPI("", EstadoTemaNombre.EN_PROGRESO)) || [];
          const temasObservado =
            (await fetchTemasAPI("", EstadoTemaNombre.OBSERVADO)) || [];
          const temasRegistrado =
            (await fetchTemasAPI("", EstadoTemaNombre.REGISTRADO)) || [];
          data = [
            ...temasInscritos,
            ...temasEnProgres,
            ...temasObservado,
            ...temasRegistrado,
          ];
          break;
        case EstadoTemaNombre.PROPUESTO_LIBRE:
          data = (await fetchTemasAPI("", estadoTema)) || [];
          break;
        case EstadoTemaNombre.PROPUESTO_GENERAL:
          const temasGenerales = (await fetchTemasAPI("", estadoTema)) || [];
          const temasPreInscrito =
            (await fetchTemasAPI("", EstadoTemaNombre.PREINSCRITO)) || [];
          data = [...temasGenerales, ...temasPreInscrito];
          break;
        default:
          console.log("Entro al defaul");
          break;
      }

      setTemasData(data);
      console.log("consegui los temas data");
    } catch (err: unknown) {
      console.log(err);
      setError("Error al cargar los temas");
    } finally {
      setIsLoading(false);
    }
  }, [estadoTema]);

  useEffect(() => {
    fetchTemas();
  }, [fetchTemas]);

  useEffect(() => {
    if (!usuarioLoggeado) return;
    const fetchData = async () => {
      try {
        //obtener la carrera
        const carreras = await obtenerCarrerasPorUsuario();
        setCarrera(carreras);
        console.log("Sus carreras son: ", { carreras });

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

        const areas = await obtenerAreasDelUsuario(Number(usuario.id));
        console.log("Sus areas son: ", { areas });
        setAreasDisponibles(areas);
      } catch (error) {
        console.error("Error los datos de entrada", error);
      }
    };

    fetchData();
  }, [usuarioLoggeado]);

  console.log({ areasDisponibles });
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
              setIsNuevoTemaDialogOpen={setIsNuevoTemaDialogOpen}
              areasDisponibles={areasDisponibles}
              carreras={carrera}
              onTemaGuardado={fetchTemas}
              asesor={asesorData}
            />
          )}
        </Dialog>
      </div>

      {/* Tabs */}
      <Tabs
        value={estadoTema}
        onValueChange={(value) => {
          setEstadoTema(value as EstadoTemaNombre);
          console.log(value);
        }}
        className="w-full"
      >
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
