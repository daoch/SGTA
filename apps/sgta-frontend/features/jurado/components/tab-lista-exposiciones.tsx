import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { ExposicionJurado } from "../types/jurado.types";
import { getExposicionesCoordinador } from "../services/jurado-service";
import { useAuthStore } from "@/features/auth";
import ModalDetallesExposicionCoordinador from "./modal-detalles-exposicion-coordinador";
import { ListExposicionCoordinadorCard } from "./list-exposicion-coordinador-card";
import { FilterExposicionCoordinador } from "./filters-exposicion-coordinador";
import { getCiclos } from "../services/exposicion-service";
import { Ciclo } from "@/features/jurado/types/juradoDetalle.types";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios/axios-instance";

const estados = [
  { value: "todos", label: "Todos" },
  { value: "esperando_respuesta", label: "Esperando Respuesta" },
  { value: "esperando_aprobación", label: "Esperando Aprobación" },
  { value: "programada", label: "Programada" },
  { value: "completada", label: "Completada" },
  { value: "calificada", label: "Calificada" },
];

const expoTest: ExposicionJurado = {
  id_exposicion: 3,
  fechahora: new Date("2025-06-25T19:00:00Z"),
  sala: "V201",
  estado: "PROGRAMADA",
  id_etapa_formativa: 1,
  nombre_etapa_formativa: "Proyecto de fin de carrera 1",
  titulo:
    "Modelo de red neuronal convolucional para la clasificación de tipos de nubes en imágenes de webcam",
  ciclo_id: 4,
  estado_control: "ESPERANDO_RESPUESTA",
  nombre_exposicion: "Exposicion parcial",
  enlace_grabacion: "xd",
  enlace_sesion:
    "https://us05web.zoom.us/j/82863224408?pwd=RLr4K3nH5mABrWOuhyI8eRpwPcARkb.1",
  criterios_calificados: false,
  miembros: [
    {
      id_persona: 73,
      nombre: "Johan Hinojosa Salazar",
      tipo: "Tesista",
    },
    {
      id_persona: 70,
      nombre: "Luis Manuel Falcon Baca",
      tipo: "Asesor",
    },
  ],
};

export const TabListaExposiciones: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [exposiciones, setExposiciones] = useState<ExposicionJurado[]>([]);
  const [ciclos, setCiclos] = useState<Ciclo[]>([]);
  const [saving, setSaving] = useState(false);

  const { control, watch, getValues, reset } = useForm({
    defaultValues: {
      buscador: "",
      curso: "TODOS",
      periodo: "",
      //ciclos?.length > 0 ? `${ciclos[0].anio}-${ciclos[0].semestre}` : "",
      estado: estados[0].value,
    },
  });

  useEffect(() => {
    const fetchExposiciones = async () => {
      setIsLoading(true);
      try {
        const { idToken } = useAuthStore.getState();
        console.log("ID Token:", idToken);
        const exposicionesData = await getExposicionesCoordinador(idToken!);
        console.log("Exposiciones Data:", exposicionesData);
        const exposicionesFiltradas = exposicionesData.filter(
          (expo) =>
            expo.estado !== "ESPERANDO_RESPUESTA" &&
            expo.estado !== "ESPERANDO_APROBACIÓN",
        );
        setExposiciones(exposicionesFiltradas);
      } catch (error) {
        console.error("Error al cargar exposiciones:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchExposiciones();
  }, []);

  useEffect(() => {
    const fetchCiclos = async () => {
      try {
        const ciclos = await getCiclos();
        setCiclos(ciclos);
      } catch (error) {
        console.error("Error fetching ciclos:", error);
      }
    };
    fetchCiclos();
  }, []);

  useEffect(() => {
    if (ciclos.length > 0) {
      const periodoDefault = `${ciclos[0].anio}-${ciclos[0].semestre}`;

      // Actualizar el formulario con el valor por defecto
      reset({
        ...getValues(),
        periodo: periodoDefault,
      });
    }
  }, [ciclos, getValues, reset]);

  const [searchTerm, setSearchTerm] = useState("");

  const estadoSeleccionado = watch("estado");
  const cursoSeleccionado = watch("curso");
  const periodoSeleccionado = watch("periodo");

  const handleSearch = () => {
    // Obtiene el valor actual del campo buscador
    const searchValue = getValues("buscador").toLowerCase();
    // Actualiza el término de búsqueda
    setSearchTerm(searchValue);
  };

  const determinarEstadoMostradoParaFiltro = (
    exposicion: ExposicionJurado,
  ): string => {
    // Obtener el estado base normalizado
    const estadoBase = exposicion.estado
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "_");

    // Si el estado es "completada" y los criterios ya están calificados, mostrar como "calificada"
    if (
      estadoBase === "completada" &&
      exposicion.criterios_calificados === true
    ) {
      return "calificada";
    }

    // Si el estado base es "esperando_respuesta" pero el estado_control es "ACEPTADO" o "RECHAZADO",
    // mostrar como "esperando_aprobacion"
    if (
      estadoBase === "esperando_respuesta" &&
      (exposicion.estado_control === "ACEPTADO" ||
        exposicion.estado_control === "RECHAZADO")
    ) {
      return "esperando_aprobación";
    }

    // En cualquier otro caso, mostrar el estado base
    return estadoBase;
  };

  const filteredExposiciones = exposiciones.filter((exposicion) => {
    const estadoMostrado = determinarEstadoMostradoParaFiltro(exposicion);
    const matchesEstado =
      estadoSeleccionado === "todos" ||
      estadoMostrado.toLowerCase() === estadoSeleccionado.toLowerCase();
    // Filtro por curso (añadir lógica según tus datos)
    const matchesCurso =
      cursoSeleccionado === "TODOS" ||
      exposicion.nombre_etapa_formativa === cursoSeleccionado;

    // Filtro por periodo (añadir lógica según tus datos)
    const fechaExposicion = exposicion.fechahora;
    // Extraer año y semestre de la fecha de exposición
    const anioExposicion = fechaExposicion.getFullYear();
    // Determinar semestre (1 o 2) según el mes
    const semestreExposicion = fechaExposicion.getMonth() < 6 ? 1 : 2;
    const periodoExposicion = `${anioExposicion}-${semestreExposicion}`;

    const matchesPeriodo =
      periodoSeleccionado === "" || // Si no hay selección
      periodoExposicion === periodoSeleccionado;

    const titulo = exposicion.titulo.toLowerCase();
    const nombresEstudiantes = exposicion.miembros
      .filter((m) => m.tipo === "Tesista")
      .map((m) => m.nombre.toLowerCase())
      .join(" ");

    const matchesBuscador =
      titulo.includes(searchTerm) || nombresEstudiantes.includes(searchTerm);

    return matchesEstado && matchesCurso && matchesPeriodo && matchesBuscador;
  });

  const [selectedExposicion, setSelectedExposicion] =
    useState<ExposicionJurado | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = (exposicion: ExposicionJurado) => {
    setSelectedExposicion(exposicion);
    setModalOpen(true);
  };

  const handleGuardarGrabacion = async (enlaceGrabacion: string) => {
    if (!selectedExposicion) return;
    setSaving(true);
    try {
      axiosInstance.put("/jurado/actualizar-link-grabacion", {
        exposicionXTemaId: selectedExposicion.id_exposicion,
        nuevoLinkGrabacion: enlaceGrabacion,
      });
      setExposiciones((prev) =>
        prev.map((expo) =>
          expo.id_exposicion === selectedExposicion.id_exposicion
            ? { ...expo, enlace_grabacion: enlaceGrabacion }
            : expo,
        ),
      );

      // Actualiza la exposición seleccionada (para que el modal muestre el nuevo valor)
      setSelectedExposicion((prev) =>
        prev ? { ...prev, enlace_grabacion: enlaceGrabacion } : prev,
      );

      toast.success("Enlace de grabación guardado");
    } catch (error) {
      console.error("Error al guardar el enlace de grabación:", error);
      toast.error("Error al guardar el enlace");
    } finally {
      setSaving(false);
      setModalOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <FilterExposicionCoordinador control={control} onSearch={handleSearch} />
      {isLoading ? (
        <div className="mt-4">Cargando exposiciones...</div>
      ) : (
        <div>
          {filteredExposiciones.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No se encontraron exposiciones que coincidan con los criterios de
              búsqueda.
            </div>
          )}
          <div className="space-y-4">
            {filteredExposiciones.map((exposicion) => (
              <ListExposicionCoordinadorCard
                key={exposicion.id_exposicion}
                exposicion={exposicion}
                onClick={() => handleOpenModal(exposicion)}
              />
            ))}
          </div>
          <ModalDetallesExposicionCoordinador
            open={modalOpen}
            onOpenChange={setModalOpen}
            exposicion={selectedExposicion}
            handleGuardarGrabacion={handleGuardarGrabacion}
            saving={saving}
          />
        </div>
      )}
    </div>
  );
};
