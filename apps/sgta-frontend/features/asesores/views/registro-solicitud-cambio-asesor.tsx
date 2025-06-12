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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/features/auth";
import { cn } from "@/lib/utils";
import { ArrowLeft, Check, ChevronsUpDown, Loader2, UserX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  getInformacionTesisPorAlumno,
  registrarSolicitudCambioAsesor,
} from "../services/cambio-asesor-services";
import { getAsesoresPorFiltros } from "../services/directorio-services";
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
  const [asesorActual, setAsesorActual] = useState<Asesor | null>(null);

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
          const resultado = await getAsesoresPorFiltros({
            alumnoId: userId,
            cadenaBusqueda: busqueda,
            activo: true,
            idAreas: [],
            idTemas: [],
          });
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
        const { temaActual, asesorActual } =
          await getInformacionTesisPorAlumno(userId);
        setTemaActual(temaActual);
        setAsesorActual(asesorActual);
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

    if (!nuevoAsesor || !temaActual || !asesorActual || !userId) {
      setRegistroEstado("error");
      setMensajeRegistro(
        "Debes seleccionar un nuevo asesor antes de continuar.",
      );
      return;
    }

    try {
      const resultado = await registrarSolicitudCambioAsesor({
        alumnoId: userId,
        temaId: temaActual.id,
        asesorActualId: asesorActual.id,
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

  /*
  if (!temaActual || !asesorActual) {
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
  }*/

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
        </CardContent>
      </Card>

      {/* Información del asesor actual */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Asesor Actual</CardTitle>
          <CardDescription>Información de tu asesor actual</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={asesorActual?.foto ?? undefined}
                alt={`${asesorActual?.nombre}`}
              />
              <AvatarFallback>{asesorActual?.nombre.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-lg">{asesorActual?.nombre}</h3>
              <p className="text-muted-foreground">{asesorActual?.email}</p>
              {asesorActual?.areasTematicas &&
                asesorActual?.areasTematicas.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Área:{" "}
                    {asesorActual.areasTematicas
                      .map((a) => a.nombre)
                      .join(", ")}
                  </p>
                )}
            </div>
          </div>
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
      <Dialog
        open={modalOpen}
        onOpenChange={(open) => {
          // Solo permitir cerrar el modal si está en estado "idle" o "loading"
          if (registroEstado === "idle" || registroEstado === "loading") {
            setModalOpen(open);
          }
        }}
      >
        <DialogContent
          className="sm:max-w-md"
          onPointerDownOutside={(e) => {
            // Prevenir cerrar el modal haciendo clic fuera cuando está en estado success o error
            if (registroEstado === "success" || registroEstado === "error") {
              e.preventDefault();
            }
          }}
          onEscapeKeyDown={(e) => {
            // Prevenir cerrar el modal con ESC cuando está en estado success o error
            if (registroEstado === "success" || registroEstado === "error") {
              e.preventDefault();
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>
              {registroEstado === "idle" &&
                "Confirmar solicitud de cambio de asesor"}
              {registroEstado === "loading" && "Procesando solicitud"}
              {registroEstado === "success" && "Solicitud registrada con éxito"}
              {registroEstado === "error" && "Error al registrar solicitud"}
            </DialogTitle>
            <DialogDescription>
              {registroEstado === "idle" && (
                <>
                  ¿Estás seguro que deseas solicitar el cambio de asesor de{" "}
                  <span className="font-medium">{asesorActual?.nombre}</span> a{" "}
                  <span className="font-medium">{nuevoAsesor?.nombre}</span>?
                </>
              )}
              {registroEstado === "loading" &&
                "Por favor espera mientras procesamos tu solicitud..."}
              {registroEstado === "success" && mensajeRegistro}
              {registroEstado === "error" && mensajeRegistro}
            </DialogDescription>
          </DialogHeader>

          {registroEstado === "loading" && (
            <div className="flex justify-center py-6">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          <DialogFooter className="sm:justify-center">
            {registroEstado === "idle" && (
              <>
                <Button variant="outline" onClick={() => setModalOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={confirmarRegistro}>Confirmar</Button>
              </>
            )}

            {registroEstado === "success" && (
              <>
                <Button variant="outline" onClick={handleVolver}>
                  Volver a Solicitudes
                </Button>
                <Button onClick={verDetalleSolicitud}>Ver Detalle</Button>
              </>
            )}

            {registroEstado === "error" && (
              <Button
                onClick={() => {
                  setModalOpen(false);
                  setRegistroEstado("idle");
                }}
              >
                Cerrar
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
