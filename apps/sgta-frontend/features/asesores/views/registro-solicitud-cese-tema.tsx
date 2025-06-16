"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/features/auth";
import { ArrowLeft, BookX, Loader2, UserX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ModalConfirmacionRegistro from "../components/cese-tema/modal-registro-cese-tema";
import {
  getInformacionTesisPorAlumno,
  registrarSolicitudCeseTema,
} from "../services/cambio-asesor-services";
import { getIdByCorreo } from "../services/perfil-services";
import { TemaActual } from "../types/cambio-asesor/entidades";
import { Asesor } from "../types/perfil/entidades";

export default function registrarSolicitudCeseTemaAlumno() {
  const router = useRouter();
  const { user } = useAuth();
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const hasFetchedId = useRef(false);
  const [motivo, setMotivo] = useState("");
  const [temaActual, setTemaActual] = useState<TemaActual | null>(null);
  const [asesoresActuales, setAsesoresActuales] = useState<Asesor[] | null>(
    null,
  );

  // Estados para el modal
  const [modalOpen, setModalOpen] = useState(false);
  const [registroEstado, setRegistroEstado] = useState<
    "idle" | "loading" | "success" | "error" | "already_processed"
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
    if (!motivo.trim()) {
      return;
    }

    setModalOpen(true);
  };

  // Función para confirmar y enviar la solicitud
  const confirmarRegistro = async () => {
    setRegistroEstado("loading");

    if (!temaActual || !userId) {
      setRegistroEstado("error");
      setMensajeRegistro(
        "No cuenta con un tema de tesis activo o no se ha encontrado el usuario.",
      );
      return;
    }

    try {
      const resultado = await registrarSolicitudCeseTema({
        alumnoId: userId,
        temaId: temaActual.id,
        estadoTema: temaActual.estado ?? "VENCIDO",
        motivo,
      });

      if (resultado.success) {
        const estadoTema = temaActual.estado?.toLowerCase();

        if (estadoTema === "inscrito" || estadoTema === "preinscrito") {
          setRegistroEstado("already_processed");
          setMensajeRegistro(
            "Ya se ha procedido con el cese del tema. Ya no está asociado al tema que indicó y puede ver el detalle de su solicitud.",
          );
        } else {
          setRegistroEstado("success");
          setMensajeRegistro(
            "Su solicitud ha sido registrada exitosamente. La solicitud debe ser aceptada por la coordinadora.",
          );
        }

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
        `/alumno/solicitudes-academicas/cese-tema/mis-solicitudes/detalle/${solicitudId}`,
      );
    }
  };

  const getModalTitle = () => {
    switch (registroEstado) {
      case "idle":
        return "Confirmar solicitud de cese de tema";
      case "loading":
        return "Procesando solicitud";
      case "success":
        return "Solicitud registrada con éxito";
      case "already_processed":
        return "Cese de tema procesado";
      case "error":
        return "Error al registrar solicitud";
      default:
        return "";
    }
  };

  const getModalDescription = () => {
    switch (registroEstado) {
      case "idle":
        const estadoTema = temaActual?.estado?.toLowerCase();
        if (estadoTema === "inscrito" || estadoTema === "preinscrito") {
          return `¿Estás seguro que deseas dejar el tema "${temaActual?.titulo}"? Nota: El tema ya tiene estado ${temaActual?.estado}, por lo que el cese será procesado inmediatamente.`;
        } else {
          return `¿Estás seguro que deseas dejar el tema "${temaActual?.titulo}"? La solicitud deberá ser aceptada por la coordinadora.`;
        }
      case "loading":
        return "Por favor espera mientras procesamos tu solicitud...";
      case "success":
      case "already_processed":
      case "error":
        return mensajeRegistro;
      default:
        return "";
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
          Usted no cuenta con un tema de tesis registrado actualmente.
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
        Registrar Solicitud de Cese de tema
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
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Asesores:
            {asesoresActuales && asesoresActuales.length > 0 ? (
              asesoresActuales.map((asesor, index) => (
                <span key={index} className="block">
                  {asesor.nombre} {" - "} ({asesor.rol})
                </span>
              ))
            ) : (
              <span className="text-muted-foreground">No hay asesores</span>
            )}
          </p>
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
        <Button onClick={handleRegistrarSolicitud} disabled={!motivo.trim()}>
          Registrar Solicitud
        </Button>
      </div>

      <ModalConfirmacionRegistro
        open={modalOpen}
        onOpenChange={setModalOpen}
        registroEstado={registroEstado}
        setRegistroEstado={setRegistroEstado}
        getModalTitle={getModalTitle}
        getModalDescription={getModalDescription}
        confirmarRegistro={confirmarRegistro}
        handleVolver={handleVolver}
        verDetalleSolicitud={verDetalleSolicitud}
      />
    </div>
  );
}
