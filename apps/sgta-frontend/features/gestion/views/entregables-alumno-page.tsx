import AppLoading from "@/components/loading/app-loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/features/auth/store/auth-store";
import axiosInstance from "@/lib/axios/axios-instance";
import { useEffect, useState } from "react";
import { EntregablesTable } from "../components/alumno/entregables-table";
import { EntregableAlumnoDto } from "../dtos/EntregableAlumnoDto";
import { EtapaFormativaAlumnoDto } from "../dtos/EtapaFormativaAlumnoDto";

interface Ciclo {
  cicloId: number;
  cicloNombre: string;
}

const EntregablesAlumnoPage = () => {
  const [loading, setLoading] = useState(true);
  const [ciclos, setCiclos] = useState<Ciclo[]>([]);
  const [cicloSeleccionado, setCicloSeleccionado] = useState("");
  const [entregables, setEntregables] = useState<EntregableAlumnoDto[]>([]);
  const [etapasFormativas, setEtapasFormativas] = useState<
    EtapaFormativaAlumnoDto[]
  >([]);
  const [entregaTab, setEntregaTab] =
    useState<keyof typeof ENTREGA_TABS>("todos");
  const [correccionTab, setCorreccionTab] =
    useState<keyof typeof CORRECCION_TABS>("todos");

  const fetchEtapasFormativas = async () => {
    try {
      const { idToken } = useAuthStore.getState();
      if (!idToken) {
        console.error("No authentication token available");
        return;
      }
      const response = await axiosInstance.get("/etapas-formativas/alumno", {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      setEtapasFormativas(response.data);
      setCiclos(
        response.data.map((etapa: EtapaFormativaAlumnoDto) => ({
          cicloId: etapa.cicloId,
          cicloNombre: etapa.cicloNombre,
        })),
      );
    } catch (error) {
      console.error("Error al cargar las etapas formativas:", error);
    }
  };

  const fetchEntregables = async () => {
    try {
      const { idToken } = useAuthStore.getState();
      if (!idToken) {
        console.error("No authentication token available");
        return;
      }
      const response = await axiosInstance.get("/entregable/alumno", {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      setEntregables(response.data);
    } catch (error) {
      console.error("Error al cargar los entregables:", error);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        await Promise.all([fetchEtapasFormativas(), fetchEntregables()]);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    if (etapasFormativas.length > 0) {
      setCicloSeleccionado(
        etapasFormativas[etapasFormativas.length - 1].cicloNombre,
      );
    }
  }, [etapasFormativas]);

  const hoy = new Date();

  const entregablesFiltrados = entregables
    .slice()
    .sort(
      (a, b) =>
        new Date(a.entregableFechaFin).getTime() -
        new Date(b.entregableFechaFin).getTime(),
    )
    .filter((entregable) => {
      // Filtro por ciclo
      if (
        cicloSeleccionado !== "" &&
        entregable.cicloNombre !== cicloSeleccionado
      ) {
        return false;
      }

      // Filtro por estado de entrega
      if (entregaTab !== "todos") {
        if (entregaTab === "por_enviar") {
          // Solo mostrar si estado es no_enviado, fecha actual < fecha límite y fecha de entrega es null
          const fechaLimite = new Date(entregable.entregableFechaFin);
          if (
            !(
              entregable.entregableEstado === "no_enviado" &&
              hoy < fechaLimite &&
              entregable.entregableFechaEnvio === null
            )
          ) {
            return false;
          }
        } else if (entregaTab === "enviado") {
          if (entregable.entregableEstado !== "enviado_a_tiempo") return false;
        } else if (entregaTab === "no_enviado") {
          // No enviado: fecha actual > fecha límite y fecha de entrega es null
          const fechaLimite = new Date(entregable.entregableFechaFin);
          if (!(entregable.entregableFechaEnvio === null && hoy > fechaLimite))
            return false;
        }
      }

      // Filtro por estado de corrección
      if (correccionTab !== "todos") {
        if (entregable.corregido !== CORRECCION_TABS[correccionTab].filter)
          return false;
      }

      return true;
    });

  if (loading) {
    return <AppLoading />;
  }

  if (!etapasFormativas || etapasFormativas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <div className="text-center text-lg font-semibold text-red-700">
          Aún no cuentas con un tema definido para tu proyecto de fin de
          carrera, dirígete a Temas para inscribir un tema o seleccionar un tema
          libre
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 mt-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="text-3xl font-bold text-[#042354] mb-2 md:mb-0">
          Entregables
        </h1>
        <div className="sm:w-24 w-full">
          <Select
            value={cicloSeleccionado}
            onValueChange={(value) => setCicloSeleccionado(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione el ciclo" />
            </SelectTrigger>
            <SelectContent>
              {ciclos.map((ciclo) => (
                <SelectItem key={ciclo.cicloId} value={ciclo.cicloNombre}>
                  {ciclo.cicloNombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="text-lg font-medium text-[#042354]">
        {(() => {
          const etapa = etapasFormativas.find(
            (e) => e.cicloNombre === cicloSeleccionado,
          );
          return (
            <>
              {etapa?.temaTitulo
                ? `Curso: ${etapa.etapaFormativaNombre}`
                : "No hay curso asociado"}
              <br />
              {etapa?.temaTitulo
                ? `Tema: ${etapa.temaTitulo}`
                : "No hay tema asociado"}
            </>
          );
        })()}
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <Tabs
          value={entregaTab}
          onValueChange={(v) => setEntregaTab(v as keyof typeof ENTREGA_TABS)}
        >
          <TabsList>
            {Object.entries(ENTREGA_TABS).map(([key, val]) => (
              <TabsTrigger key={key} value={key}>
                {val.title}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Tabs
          value={correccionTab}
          onValueChange={(v) =>
            setCorreccionTab(v as keyof typeof CORRECCION_TABS)
          }
        >
          <TabsList>
            {Object.entries(CORRECCION_TABS).map(([key, val]) => (
              <TabsTrigger key={key} value={key}>
                {val.title}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <EntregablesTable
        entregables={entregablesFiltrados}
        setEntregables={setEntregables}
      />
    </div>
  );
};

export default EntregablesAlumnoPage;

const ENTREGA_TABS = {
  todos: { title: "Todos", filter: "todos" },
  por_enviar: { title: "Por enviar", filter: "por_enviar" },
  enviado: { title: "Enviado", filter: "enviado" },
  no_enviado: { title: "No enviado", filter: "no_enviado" },
};

const CORRECCION_TABS = {
  todos: { title: "Todos", filter: "todos" },
  por_revisar: { title: "Por revisar", filter: false },
  revisado: { title: "Revisado", filter: true },
};
