"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { EditTemaModal } from "@/features/temas/components/alumno/modal-editar-tema";
import HistorialTemaCard from "@/features/temas/components/asesor/historial-tema-card";
import { Calendar, ChevronLeft, Edit, FileText, Target, User } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { useEffect, useState } from "react";

// Tipos para solicitudes
interface SolicitudUsuario {
  usuario_solicitud_id: number;
  usuario_id: number;
  nombres: string;
  primer_apellido: string;
  segundo_apellido: string;
  codigo: string;
  accion_solicitud: string;
  rol_solicitud: string;
  comentario: string | null;
  fecha_creacion: string;
  fecha_modificacion: string;
}

interface Solicitud {
  solicitud_id: number;
  descripcion: string;
  tipo_solicitud: string;
  estado_solicitud: string;
  tema_id: number;
  fecha_creacion: string;
  fecha_modificacion: string;
  usuarios: SolicitudUsuario[];
}

type Tesista = {
  id: number;
  nombres: string;
  primerApellido: string;
  segundoApellido?: string;
};

type Coasesor = {
  id: number;
  nombres: string;
  primerApellido: string;
  segundoApellido?: string;
  rol: "Asesor" | "Coasesor";
};

type Area = {
  id: number;
  nombre: string;
};

type Tema = {
  id: number;
  codigo: string;
  titulo: string;
  resumen: string;
  objetivos: string;
  estadoTemaNombre: string;
  fechaCreacion?: string;
  tesistas: Tesista[];
  coasesores: Coasesor[];
  area?: Area;
  subareas?: Area[];
};

export function DetalleTemaAlumnoView() {
  const params = useParams();
  const idTema = params?.id as string;
  const router = useRouter();

  const [tema, setTema] = useState<Tema | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!idTema) return;
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/temas/findById?idTema=${idTema}`
    )
      .then((res) => res.json())
      .then((data: Tema) => {
        setTema(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [idTema]);

  const [tab, setTab] = useState("detalle");

  // Estado para el modal
  const [openEditModal, setOpenEditModal] = useState(false);
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loadingSolicitudes, setLoadingSolicitudes] = useState(true);
  const [openSolicitudesModal, setOpenSolicitudesModal] = useState(false);

  const { idToken } = useAuthStore();

  useEffect(() => {
    if (!idTema) return;
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/temas/findById?idTema=${idTema}`
    )
      .then((res) => res.json())
      .then((data: Tema) => {
        setTema(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/temas/TodasSolicitudesPendientes?offset=0&limit=100`,
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data: Solicitud[]) => {
        setSolicitudes(data.filter((s) => s.tema_id === tema?.id));
        setLoadingSolicitudes(false);
      })
      .catch(() => setLoadingSolicitudes(false));
  }, [idTema, tema?.id, idToken]);

  if (loading) {
    return (
      <div className="w-full pl-2 pr-4 py-8 max-w-screen-xl">
        <div className="text-gray-500">Cargando...</div>
      </div>
    );
  }

  if (!tema) {
    return (
      <div className="w-full pl-0 pr-2 py-8 max-w-full">
        <div className="text-red-500">No se encontró el tema.</div>
      </div>
    );
  }

  const nombreTesistas = tema.tesistas
    ?.map(
      (t: Tesista) =>
        `${t.nombres} ${t.primerApellido}${t.segundoApellido ? " " + t.segundoApellido : ""}`
    )
    .join(", ");

  // Separa asesores y coasesores
  const asesores = tema.coasesores?.filter((a: Coasesor) => a.rol === "Asesor") ?? [];
  const coasesores = tema.coasesores?.filter((a: Coasesor) => a.rol === "Coasesor") ?? [];

  const nombresAsesores = asesores.map(
    (a: Coasesor) => `${a.nombres} ${a.primerApellido}${a.segundoApellido ? " " + a.segundoApellido : ""}`
  ).join(", ");

  const nombresCoasesores = coasesores.map(
    (a: Coasesor) => `${a.nombres} ${a.primerApellido}${a.segundoApellido ? " " + a.segundoApellido : ""}`
  ).join(", ");

  const estadoNombre = tema.estadoTemaNombre === "EN_PROGRESO"
    ? "EN PROGRESO"
    : tema.estadoTemaNombre;

  const estadoColor =
    estadoNombre === "REGISTRADO"
      ? "bg-green-100 text-green-800"
      : estadoNombre === "INSCRITO"
      ? "bg-purple-100 text-purple-700"
      : estadoNombre === "OBSERVADO"
      ? "bg-yellow-100 text-yellow-800"
      : estadoNombre === "EN PROGRESO"
      ? "bg-blue-100 text-blue-800"
      : "bg-gray-100 text-gray-700";

  // Prepara los datos del tema para el modal
  const temaData = {
    id: tema.id,
    titulo: tema.titulo,
    resumen: tema.resumen,
    objetivos: tema.objetivos,
    area: {
      id: tema.area?.id || tema.subareas?.[0]?.id || 0,
      nombre: tema.area?.nombre || tema.subareas?.[0]?.nombre || "",
    },
    subareas: tema.subareas || [], 
    asesor: {
      id: (tema.coasesores?.find((a: Coasesor) => a.rol === "Asesor")?.id ?? "") + "",
      nombre:
        tema.coasesores?.find((a: Coasesor) => a.rol === "Asesor")
          ? `${tema.coasesores.find((a: Coasesor) => a.rol === "Asesor")!.nombres} ${tema.coasesores.find((a: Coasesor) => a.rol === "Asesor")!.primerApellido}`
          : "",
    },
  };

  const totalSolicitudes = solicitudes.length;
  const pendientes = solicitudes.filter((s) => s.estado_solicitud === "PENDIENTE").length;

  function getCambioYComentario(solicitud: Solicitud): { cambio: string; comentario: string } {
    const destinatario = solicitud.usuarios.find((u) => u.rol_solicitud === "DESTINATARIO" && u.comentario);
    if (destinatario && destinatario.comentario) {
      const [cambio, comentario] = destinatario.comentario.split("|@@|");
      return { cambio: cambio?.trim() || "", comentario: comentario?.trim() || "" };
    }
    return { cambio: "", comentario: "" };
  }

  return (
    <div className="w-full px-4 py-8 max-w-7xl">
      {/* Botón volver + Tabs */}
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => router.push("/alumno/temas")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition"
        >
          <div className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center justify-center">
            <ChevronLeft className="w-4 h-4" />
          </div>
        </button>
        <div className="inline-flex bg-gray-100 rounded-lg p-1 ml-2">
          <button
            className={`px-5 py-0.5 rounded-md text-sm font-normal transition ${
              tab === "detalle" ? "bg-white shadow text-black" : "text-black/80"
            }`}
            onClick={() => setTab("detalle")}
          >
            Detalle del tema
          </button>
          <button
            className={`px-5 py-0.5 rounded-md text-sm font-normal transition ${
              tab === "historial" ? "bg-white shadow text-black" : "text-black/80"
            }`}
            onClick={() => setTab("historial")}
          >
            Historial
          </button>
          <button
            className={`px-5 py-0.5 rounded-md text-sm font-normal transition ${
              tab === "exposiciones" ? "bg-white shadow text-black" : "text-black/80"
            }`}
            onClick={() => setTab("exposiciones")}
          >
            Información de exposiciones
          </button>
        </div>
      </div>

      {tab === "historial" ? (
        <div className="w-full mb-8">
          <HistorialTemaCard idTema={tema.id} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 flex flex-col gap-6">
            {tab === "detalle" && (
              <>
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <h1 className="text-2xl font-bold mb-2 text-gray-900">
                    {tema.titulo}
                  </h1>
                  <div className="flex items-center gap-3 mb-5">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${estadoColor}`}
                    >
                      {estadoNombre}
                    </span>
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                      #{tema.codigo}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-8 text-sm text-gray-700 mb-2">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-semibold">Estudiantes:</span>
                      <span className="ml-1">{nombreTesistas}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-semibold">Asesores:</span>
                      <span className="ml-1">{nombresAsesores}</span>
                      {coasesores.length > 0 && (
                        <>
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="font-semibold ml-4">Coasesores:</span>
                          <span className="ml-1">{nombresCoasesores}</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="font-semibold">Fecha:</span>
                      <span className="ml-1">
                        {tema.fechaCreacion
                          ? new Date(tema.fechaCreacion).toLocaleDateString("es-PE", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : ""}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <div className="font-semibold mb-3 flex items-center gap-2 text-gray-900 text-base">
                    Información del Tema
                  </div>
                  <div className="mb-4">
                    <div className="font-semibold flex items-center gap-2 mb-1 text-gray-800">
                      <FileText className="w-4 h-4" />
                      Resumen del proyecto
                    </div>
                    <div className="text-gray-700 text-sm">{tema.resumen}</div>
                  </div>
                  <div>
                    <div className="font-semibold flex items-center gap-2 mb-1 text-gray-800">
                      <Target className="w-4 h-4" />
                      Objetivos del proyecto
                    </div>
                    <div className="text-gray-700 text-sm">{tema.objetivos}</div>
                  </div>
                </div>
              </>
            )}
          </div>
          {tab === "detalle" && (
            <div className="flex flex-col gap-6">
              {/* Solicitudes del Tema */}
              <div
                className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm cursor-pointer hover:shadow-md transition"
                onClick={() => setOpenSolicitudesModal(true)}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-red-100 rounded-full p-2">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M8 6h8M8 10h8M8 14h5" stroke="#e53e3e" strokeWidth="2" strokeLinecap="round"/></svg>
                  </div>
                  <div className="font-semibold text-lg text-[#0a2342]">Solicitudes del Tema</div>
                </div>
                <div className="flex items-center gap-2 text-3xl font-bold text-[#0a2342]">
                  {loadingSolicitudes ? <span className="text-gray-400 text-base">Cargando...</span> : totalSolicitudes}
                  <span className="text-base font-normal text-gray-500">solicitudes</span>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <span className="flex items-center gap-1 text-green-600 text-sm"><span className="inline-block w-4 h-4"><svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M4 8l3 3 5-5" stroke="#38a169" strokeWidth="2" strokeLinecap="round"/></svg></span>0</span>
                  <span className="flex items-center gap-1 text-red-600 text-sm"><span className="inline-block w-4 h-4"><svg width="16" height="16" fill="none" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" stroke="#e53e3e" strokeWidth="2"/><path d="M8 5v3" stroke="#e53e3e" strokeWidth="2" strokeLinecap="round"/><circle cx="8" cy="11" r="1" fill="#e53e3e"/></svg></span>{pendientes}</span>
                  <span className="flex items-center gap-1 text-gray-500 text-sm"><span className="inline-block w-4 h-4"><svg width="16" height="16" fill="none" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" stroke="#a0aec0" strokeWidth="2"/><path d="M5 8h6" stroke="#a0aec0" strokeWidth="2" strokeLinecap="round"/></svg></span>0</span>
                </div>
                {pendientes > 0 && (
                  <div className="mt-2"><span className="bg-red-200 text-red-800 px-3 py-1 rounded text-xs font-semibold">Pendiente de respuesta</span></div>
                )}
              </div>

              {/* Modal de solicitudes con Dialog */}
              <Dialog open={openSolicitudesModal} onOpenChange={setOpenSolicitudesModal}>
                <DialogContent className="max-w-lg w-full">
                  <DialogHeader>
                    <DialogTitle>Solicitudes ({totalSolicitudes})</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {solicitudes.length === 0 && <div className="text-gray-500">No hay solicitudes pendientes.</div>}
                    {solicitudes.map((solicitud) => {
                      const { cambio, comentario } = getCambioYComentario(solicitud);
                      return (
                        <div key={solicitud.solicitud_id} className="border-b pb-3 last:border-b-0 last:pb-0">
                          <div className="font-semibold text-base text-[#0a2342]">{solicitud.descripcion}</div>
                          <div className="text-xs text-gray-500 mb-1">{solicitud.tipo_solicitud}</div>
                          <div className="inline-block bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-semibold mb-1">{solicitud.estado_solicitud}</div>
                          {cambio && (
                            <div className="mt-1 text-sm"><span className="font-semibold">Cambio propuesto:</span> {cambio}</div>
                          )}
                          {comentario && (
                            <div className="mt-1 text-xs text-gray-600"><span className="font-semibold">Comentario:</span> {comentario}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </DialogContent>
              </Dialog>

              {/* Acciones Disponibles */}
              {["REGISTRADO", "INSCRITO", "EN_PROGRESO", "PAUSADO"].includes(tema.estadoTemaNombre) && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <div className="font-semibold mb-2">Acciones Disponibles</div>
                  <Button
                    className="w-full bg-[#ffb347] text-white hover:bg-[#ffac2f] border border-amber-300 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    onClick={() => setOpenEditModal(true)}
                  >
                    <Edit className="w-5 h-5" />
                    Editar Tema
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Modal para editar tema */}
      {openEditModal && (
        <EditTemaModal
          open={openEditModal}
          tema={temaData}
          onOpenChange={setOpenEditModal}
          onTemaUpdated={(updatedTema) => {
            setTema((prevTema) =>
              prevTema
                ? {
                    ...prevTema,
                    titulo: updatedTema.titulo,
                    resumen: updatedTema.resumen,
                    objetivos: updatedTema.objetivos,
                    area: updatedTema.area,
                  }
                : null
            );
            setOpenEditModal(false);
          }}
        />
      )}
    </div>
  );
}

