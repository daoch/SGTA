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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PaginatedList from "@/features/temas/components/asesor/paginacion";
import {
  pageTexts,
  tableTexts,
} from "@/features/temas/types/inscripcion/constants";
import {
  fetchCantidadTemas,
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

  const [comentario, setComentario] = useState("");
  const [areaFilter, setAreaFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10); // Puedes ajustar el número de items por página
  const [totalItems, setTotalItems] = useState(0); // Total de items para la paginación

  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        console.log("Obteniendo al usuario");
        const usuario = await buscarUsuarioPorToken();
        setUsuarioLoggeado(usuario);
        console.log("Usuario:", { usuario });
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
      console.log("Entro a recoger los temas.", { comentario, areaFilter });
      setIsLoading(true);
      const offset = (page - 1) * itemsPerPage;
      setError(null);
      if (areaFilter === "all" || areaFilter === null) {
        console.log("Entro al if de areaFilter");
        setAreaFilter("0");
      }
      const dataSinFiltrar: Tema[] =
        (await fetchTemasAPI(
          comentario,
          Number(areaFilter),
          "",
          itemsPerPage,
          offset,
        )) || [];
      let data: Tema[] = [];
      switch (estadoTema) {
        case EstadoTemaNombre.INSCRITO:
          data = dataSinFiltrar.filter(
            (tema) =>
              tema.estadoTemaNombre === EstadoTemaNombre.INSCRITO ||
              tema.estadoTemaNombre === EstadoTemaNombre.OBSERVADO ||
              tema.estadoTemaNombre === EstadoTemaNombre.REGISTRADO ||
              tema.estadoTemaNombre === EstadoTemaNombre.INSCRITO,
          );
          break;
        case EstadoTemaNombre.PROPUESTO_LIBRE:
          data = dataSinFiltrar.filter(
            (tema) =>
              tema.estadoTemaNombre === EstadoTemaNombre.PROPUESTO_LIBRE,
          );
          break;
        case EstadoTemaNombre.PROPUESTO_GENERAL:
          data = dataSinFiltrar.filter(
            (tema) =>
              tema.estadoTemaNombre === EstadoTemaNombre.PROPUESTO_GENERAL ||
              tema.estadoTemaNombre === EstadoTemaNombre.PREINSCRITO,
          );
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
  }, [estadoTema, comentario, areaFilter, page, itemsPerPage]);

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

  useEffect(() => {
    console.log({ searchTerm });
    const timer = setTimeout(() => {
      setComentario(searchTerm);
    }, 1500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const fetchTotalItems = async () => {
      try {
        const total = await fetchCantidadTemas(
          comentario,
          Number(areaFilter),
          "",
          100,
          0,
        );
        setTotalItems(total);
        console.log("Total de temas:", total);
      } catch (error) {
        console.error("Error al obtener el total de temas:", error);
      }
    };
    fetchTotalItems();
  }, [comentario, areaFilter]);

  //console.log({ areasDisponibles });
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
                  <div className="mb-6 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                      <Input
                        type="search"
                        placeholder="Buscar por título..."
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
                          {areasDisponibles?.map((area) => (
                            <SelectItem
                              key={area.id}
                              value={area.id.toString()}
                            >
                              {area.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <TemasTable
                    temasData={temasData}
                    isLoading={isLoading}
                    error={error}
                    asesor={asesorData}
                    onTemaInscrito={fetchTemas}
                    areasDisponibles={areasDisponibles}
                    carreras={carrera}
                  />
                  {/*Paginación*/}
                  <div className="mt-6">
                    <PaginatedList
                      totalItems={totalItems}
                      itemsPerPage={itemsPerPage}
                      page={page}
                      setPage={setPage}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
      </Tabs>
    </div>
  );
};

export default Page;
