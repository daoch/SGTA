"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/features/auth";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  BookX,
  Check,
  ChevronsUpDown,
  Loader2,
  UserX,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ModalCambioAsesor from "../components/assessor-change-request/modal-registro-cambio-asesor";
import {
  getInformacionTesisPorAlumno,
  registrarSolicitudCambioAsesor,
} from "../services/cambio-asesor-services";
import { buscarAsesoresPorNombre } from "../services/directorio-services";
import { getIdByCorreo } from "../services/perfil-services";
import { TemaActual } from "../types/cambio-asesor/entidades";
import { Asesor } from "../types/perfil/entidades";

export default function RegistrarSolicitudCambioAsesor() {
  const router = useRouter();
  const { user } = useAuth();
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const hasFetchedId = useRef(false);
  const [motivo, setMotivo] = useState("");
  const [nuevoAsesor, setNuevoAsesor] = useState<Asesor | null>(null);
  const [asesores, setAsesores] = useState<Asesor[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [openCombobox, setOpenCombobox] = useState(false);
  const [temaActual, setTemaActual] = useState<TemaActual | null>(null);
  const [asesoresActuales, setAsesoresActuales] = useState<Asesor[] | null>(
    null,
  );
  const [asesorPorCambiar, setAsesorPorCambiar] = useState<Asesor | null>(null);
  const [propuestoXAsesor, setPropuestoXAsesor] = useState<boolean>(false);

  // Estados para el modal
  const [modalOpen, setModalOpen] = useState(false);
  const [registroEstado, setRegistroEstado] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [mensajeRegistro, setMensajeRegistro] = useState("");
  const [solicitudId, setSolicitudId] = useState<number | null>(null);

  const loadUsuarioId = async () => {
    if (!user) return;

    setIsLoading(true);

    try {
      const id = await getIdByCorreo(user.email);

      if (id !== null) {
        setUserId(id);
        console.log("ID del asesor obtenido:", id);
      } else {
        console.warn("No se encontró un asesor con ese correo.");
        // puedes mostrar un mensaje de advertencia aquí si deseas
      }
    } catch (error) {
      console.error("Error inesperado al obtener el ID del asesor:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && !hasFetchedId.current) {
      hasFetchedId.current = true;
      loadUsuarioId();
    }
  }, [user]);

  // Buscar asesores cuando cambia la búsqueda
  useEffect(() => {
    const buscarAsesores = async () => {
      if (busqueda.length >= 2 && userId) {
        try {
          const resultado = await buscarAsesoresPorNombre(busqueda);
          setAsesores(resultado);
        } catch (error) {
          console.error("Error al buscar asesores:", error);
        }
      }
    };

    buscarAsesores();
  }, [busqueda]);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      try {
        setIsLoading(true);
        const { temaActual, asesores, roles } =
          await getInformacionTesisPorAlumno(userId);
        const asesoresConRol = asesores.map((asesor, index) => ({
          ...asesor,
          rol: roles[index] || null,
        }));
        setTemaActual(temaActual);
        setAsesoresActuales(asesoresConRol);

        const existe = asesoresConRol.some(
          (asesor) => asesor.id === temaActual.idCreador,
        );
        setPropuestoXAsesor(existe);
      } catch (error) {
        console.error("Error al cargar información de tesis:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // Función para manejar el registro de la solicitud
  const handleRegistrarSolicitud = async () => {
    if (!nuevoAsesor || !motivo.trim()) {
      return;
    }

    setModalOpen(true);
  };

  // Función para confirmar y enviar la solicitud
  const confirmarRegistro = async () => {
    setRegistroEstado("loading");

    if (!nuevoAsesor || !temaActual || !asesorPorCambiar || !userId) {
      setRegistroEstado("error");
      setMensajeRegistro(
        "Debes seleccionar un nuevo asesor antes de continuar.",
      );
      return;
    }

    try {
      const resultado = await registrarSolicitudCambioAsesor({
        creadorId: temaActual.idCreador,
        temaId: temaActual.id,
        estadoTema: temaActual.estado ?? "Vencido",
        asesorActualId: asesorPorCambiar.id,
        nuevoAsesorId: nuevoAsesor.id,
        motivo,
      });

      if (resultado.success) {
        setRegistroEstado("success");
        setMensajeRegistro(resultado.message);
        setSolicitudId(resultado.solicitudId ?? null);
      } else {
        setRegistroEstado("error");
        setMensajeRegistro(
          resultado.message || "Error al registrar la solicitud",
        );
      }
    } catch (error) {
      console.error("Error al registrar solicitud:", error);
      setRegistroEstado("error");
      setMensajeRegistro("Ocurrió un error inesperado. Inténtelo nuevamente.");
    }
  };

  // Función para volver a la pantalla anterior
  const handleVolver = () => {
    router.push("/alumno/solicitudes-academicas");
  };

  const handleAsesorPorCambiarChange = (asesorId: string) => {
    if (!asesoresActuales) {
      setAsesorPorCambiar(null);
      return;
    }

    const asesor = asesoresActuales.find((a) => a.id.toString() === asesorId);
    setAsesorPorCambiar(asesor || null);
  };

  // Función para ver detalle de la solicitud
  const verDetalleSolicitud = () => {
    if (solicitudId) {
      router.push(
        `/alumno/solicitudes-academicas/cambio-asesor/mis-solicitudes/detalle/${solicitudId}`,
      );
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen w-full flex-col gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="text-muted-foreground text-lg">
          Cargando información...
        </span>
      </div>
    );

  if ((!user || !userId) && hasFetchedId.current === true)
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-gray-500">
        <UserX className="w-16 h-16 mb-4" />
        <p className="text-base font-medium">Usuario no encontrado</p>
        <div className="mt-4">
          <Button
            onClick={loadUsuarioId}
            variant="outline"
            className="bg-white text-black border border-gray-300 hover:bg-gray-100"
          >
            Volver a intentar
          </Button>
        </div>
      </div>
    );

  if (!temaActual) {
    return (
      <div className="relative h-screen w-full flex items-center justify-center flex-col gap-4">
        <div
          onClick={() => router.back()}
          className="absolute top-4 left-4 cursor-pointer flex items-center text-sm font-semibold text-black hover:underline"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Regresar
        </div>

        <BookX className="h-16 w-16 text-muted-foreground" />
        <span className="text-muted-foreground text-lg text-center px-4">
          Usted no cuenta con una tesis o asesor registrado actual
        </span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <Button
        variant="ghost"
        onClick={handleVolver}
        className="mb-6 pl-0 flex items-center"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a Solicitudes Académicas
      </Button>

      <h1 className="text-3xl font-bold mb-6">
        Registrar Solicitud de Cambio de Asesor
      </h1>

      {/* Información del tema actual */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Tema de Tesis Actual</CardTitle>
          <CardDescription>
            Información sobre tu tema de tesis actual
          </CardDescription>
        </CardHeader>
        <CardContent>
          <h3 className="font-medium text-lg">{temaActual?.titulo}</h3>
          {temaActual?.areas && (
            <p className="text-muted-foreground mt-2">{temaActual.areas}</p>
          )}
          {propuestoXAsesor && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <div className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-amber-800">
                    Tema propuesto por asesor
                  </h4>
                  <p className="text-sm text-amber-700 mt-1">
                    Este tema ha sido propuesto por tu asesor actual. Cualquier
                    cambio de asesor también requerirá la aprobación del asesor
                    que propuso el tema.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selección del asesor por cambiar */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">
            Seleccionar Asesor Por Cambiar
          </CardTitle>
          <CardDescription>
            Selecciona el asesor actual que deseas cambiar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select onValueChange={handleAsesorPorCambiarChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccionar asesor por cambiar..." />
            </SelectTrigger>
            <SelectContent>
              {asesoresActuales?.map((asesor) => (
                <SelectItem key={asesor.id} value={asesor.id.toString()}>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={asesor.foto ?? undefined}
                        alt={`${asesor.nombre}`}
                      />
                      <AvatarFallback className="text-xs">
                        {asesor.nombre.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{asesor.nombre}</span>
                    <span>{asesor?.rol}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {asesorPorCambiar && (
            <div className="mt-4 p-4 border rounded-md">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={asesorPorCambiar.foto ?? undefined}
                    alt={`${asesorPorCambiar.nombre}`}
                  />
                  <AvatarFallback>
                    {asesorPorCambiar.nombre.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{asesorPorCambiar.nombre}</h3>
                  <p className="text-sm text-muted-foreground">
                    {asesorPorCambiar?.email}
                  </p>
                  {asesorPorCambiar?.areasTematicas &&
                    asesorPorCambiar?.areasTematicas.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Área:{" "}
                        {asesorPorCambiar.areasTematicas
                          .map((a) => a.nombre)
                          .join(", ")}
                      </p>
                    )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selección del nuevo asesor */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Seleccionar Nuevo Asesor</CardTitle>
          <CardDescription>
            Busca y selecciona al asesor que deseas solicitar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                aria-expanded={openCombobox}
                className="w-full justify-between"
              >
                {nuevoAsesor ? nuevoAsesor.nombre : "Seleccionar asesor..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0">
              <Command>
                <CommandInput
                  placeholder="Buscar asesor..."
                  value={busqueda}
                  onValueChange={setBusqueda}
                />
                <CommandList>
                  {isLoading ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <>
                      <CommandEmpty>No se encontraron asesores.</CommandEmpty>
                      <CommandGroup>
                        {asesores.map((asesor) => (
                          <CommandItem
                            key={asesor.id}
                            value={`${asesor.nombre}`}
                            onSelect={() => {
                              setNuevoAsesor(asesor);
                              setOpenCombobox(false);
                            }}
                            className="flex items-center gap-2"
                          >
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={asesor.foto ?? undefined}
                                alt={`${asesor.nombre}`}
                              />
                              <AvatarFallback>
                                {asesor.nombre.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p>{asesor.nombre}</p>
                              <p className="text-xs text-muted-foreground">
                                {asesor.email}
                              </p>
                            </div>
                            <Check
                              className={cn(
                                "h-4 w-4",
                                nuevoAsesor?.id === asesor.id
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {nuevoAsesor && (
            <div className="mt-4 p-4 border rounded-md">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={nuevoAsesor.foto ?? undefined}
                    alt={`${nuevoAsesor.nombre}`}
                  />
                  <AvatarFallback>
                    {nuevoAsesor.nombre.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{nuevoAsesor.nombre}</h3>
                  <p className="text-sm text-muted-foreground">
                    {nuevoAsesor.email}
                  </p>
                  {nuevoAsesor.areasTematicas &&
                    nuevoAsesor.areasTematicas.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Área:{" "}
                        {nuevoAsesor.areasTematicas
                          .map((a) => a.nombre)
                          .join(", ")}
                      </p>
                    )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Motivo de la solicitud */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Motivo de la Solicitud</CardTitle>
          <CardDescription>
            Explica brevemente el motivo por el cual solicitas el cambio de
            asesor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Escribe aquí el motivo de tu solicitud..."
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            className="min-h-[120px]"
          />
        </CardContent>
      </Card>

      {/* Botones de acción */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={handleVolver}>
          Cancelar
        </Button>
        <Button
          onClick={handleRegistrarSolicitud}
          disabled={!nuevoAsesor || !motivo.trim()}
        >
          Registrar Solicitud
        </Button>
      </div>

      {/* Modal de confirmación */}
      <ModalCambioAsesor
        open={modalOpen}
        onOpenChange={setModalOpen}
        registroEstado={registroEstado}
        setRegistroEstado={setRegistroEstado}
        confirmarRegistro={confirmarRegistro}
        handleVolver={handleVolver}
        verDetalleSolicitud={verDetalleSolicitud}
        mensajeRegistro={mensajeRegistro}
        asesorPorCambiar={asesorPorCambiar}
        nuevoAsesor={nuevoAsesor}
      />
    </div>
  );
}
