"use client";

// Strict interfaces for tema, tesistas, coasesores, and area
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

import { EditTemaModal } from "@/features/temas/components/alumno/modal-editar-tema";
import { Calendar, ChevronLeft, Edit2, FileText, Target, User } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

  const estadoColor =
    tema.estadoTemaNombre === "REGISTRADO"
      ? "bg-green-100 text-green-700"
      : tema.estadoTemaNombre === "INSCRITO"
      ? "bg-purple-100 text-purple-700"
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
    asesor: {
      id: (tema.coasesores?.find((a: Coasesor) => a.rol === "Asesor")?.id ?? "") + "",
      nombre:
        tema.coasesores?.find((a: Coasesor) => a.rol === "Asesor")
          ? `${tema.coasesores.find((a: Coasesor) => a.rol === "Asesor")!.nombres} ${tema.coasesores.find((a: Coasesor) => a.rol === "Asesor")!.primerApellido}`
          : "",
    },
  };

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
                    {tema.estadoTemaNombre}
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
          {tab === "historial" && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <span className="text-gray-500">Aquí irá el historial del tema.</span>
            </div>
          )}
          {tab === "exposiciones" && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <span className="text-gray-500">Aquí irá la información de exposiciones.</span>
            </div>
          )}
        </div>

        {tab === "detalle" && (
          <div className="flex flex-col gap-6">
            {/* Análisis de Similitud */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="font-semibold mb-2">Análisis de Similitud</div>
              <div className="text-gray-600 text-sm">
                No se encontraron temas similares. Puede solicitar una nueva revisión.
              </div>
            </div>
            {/* Acciones Disponibles */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="font-semibold mb-2">Acciones Disponibles</div>
              <button
                className={`w-full flex items-center justify-center gap-2 rounded-md py-2 text-base font-semibold transition
                  ${["REGISTRADO", "EN_PROGRESO", "PAUSADO"].includes(tema.estadoTemaNombre)
                    ? "bg-[#ffb347] text-white hover:bg-[#ffac2f] cursor-pointer"
                    : "bg-[#ffb347] text-white opacity-60 cursor-not-allowed"
                  }`}
                disabled={!["REGISTRADO", "EN_PROGRESO", "PAUSADO"].includes(tema.estadoTemaNombre)}
                onClick={() => {
                  if (["REGISTRADO", "EN_PROGRESO", "PAUSADO"].includes(tema.estadoTemaNombre)) {
                    setOpenEditModal(true);
                  }
                }}
              >
                <Edit2 className="w-5 h-5" />
                Editar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal para editar tema */}
      {openEditModal && (
        <EditTemaModal
          open={openEditModal}
          tema={temaData}
          onOpenChange={setOpenEditModal}
          onTemaUpdated={(updatedTema) => {
            // Optionally, fetch the updated Tema from the backend or merge fields as needed
            setTema((prevTema) =>
              prevTema
                ? {
                    ...prevTema,
                    titulo: updatedTema.titulo,
                    resumen: updatedTema.resumen,
                    objetivos: updatedTema.objetivos,
                    area: updatedTema.area,
                    // Add/merge other fields from updatedTema if needed
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