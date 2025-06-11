import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EntregablesTable } from "../components/alumno/entregables-table";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axiosInstance from "@/lib/axios/axios-instance";
import { EtapaFormativaAlumnoDto } from "../dtos/EtapaFormativaAlumnoDto";
import { EntregableAlumnoDto } from "../dtos/EntregableAlumnoDto";
import { useAuthStore } from "@/features/auth/store/auth-store";

interface Ciclo {
    cicloId: number;
    cicloNombre: string;
}

const EntregablesAlumnoPage = () => {
    const [ciclos, setCiclos] = useState<Ciclo[]>([]);
    const [cicloSeleccionado, setCicloSeleccionado] = useState("");
    const [entregables, setEntregables] = useState<EntregableAlumnoDto[]>([]);
    const [etapasFormativas, setEtapasFormativas] = useState<EtapaFormativaAlumnoDto[]>([]);
    const [tabValue, setTabValue] = useState<keyof typeof TABS_VALUES>("todos");

    useEffect(() => {
        const fetchEtapasFormativas = async () => {
            try{
                const { idToken } = useAuthStore.getState();
                console.log("Token de autenticación:", idToken);
                if (!idToken) {
                    console.error("No authentication token available");
                    return;
                }
                const response = await axiosInstance.get("/etapas-formativas/alumno",{
                    headers: {
                        Authorization: `Bearer ${idToken}`
                    }
                });
                setEtapasFormativas(response.data);
                setCiclos(response.data.map((etapa: EtapaFormativaAlumnoDto) => ({
                    cicloId: etapa.cicloId,
                    cicloNombre: etapa.cicloNombre
                })));
            } catch (error) {
                console.error("Error al cargar las etapas formativas:", error);
            }
        };
        fetchEtapasFormativas();
    }, []);

    useEffect(() => {
        const fetchEntregables = async () => {
            try{
                const { idToken } = useAuthStore.getState();
                if (!idToken) {
                    console.error("No authentication token available");
                    return;
                }
                const response = await axiosInstance.get("/entregable/alumno",{
                    headers: {
                        Authorization: `Bearer ${idToken}`
                    }
                });
                setEntregables(response.data);
            } catch (error) {
                console.error("Error al cargar los entregables:", error);
            }
        };
        fetchEntregables();
    }, []);

    useEffect(() => {
        if (etapasFormativas.length > 0) {
            setCicloSeleccionado(etapasFormativas[etapasFormativas.length - 1].cicloNombre);
        }
    }, [etapasFormativas]);

    /*const entregablesFiltrados = entregables.filter(
        (entregable) => cicloSeleccionado === "" || entregable.cicloNombre === cicloSeleccionado
    );*/

    const entregablesFiltrados = entregables
    .slice() // para no mutar el array original
    .sort((a, b) => new Date(a.entregableFechaFin).getTime() - new Date(b.entregableFechaFin).getTime())
    .filter(
        (entregable) => cicloSeleccionado === "" || entregable.cicloNombre === cicloSeleccionado
    );


    return (
        <div className="space-y-8 mt-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <h1 className="text-3xl font-bold text-[#042354] mb-2 md:mb-0">Entregables</h1>
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

        {/* Mostrar el nombre del tema asociado a la etapa formativa seleccionada */}
        <div className="text-lg font-medium text-[#042354]">
            {(() => {
                // Busca la etapa formativa seleccionada según el ciclo
                const etapa = etapasFormativas.find(
                    (e) => e.cicloNombre === cicloSeleccionado
                );
                return etapa?.temaTitulo
                    ? `Tema: ${etapa.temaTitulo}`
                    : "No hay tema asociado";
            })()}
        </div>

        <Tabs 
            value={tabValue} 
            onValueChange={(value) => setTabValue(value as keyof typeof TABS_VALUES)}
            className="w-full">
            <TabsList>
                <TabsTrigger value="no_iniciado">Pendientes</TabsTrigger>
                <TabsTrigger value="entregados">Entregados</TabsTrigger>
                <TabsTrigger value="revision">En Revisión</TabsTrigger>
                <TabsTrigger value="revisados">Revisados</TabsTrigger> 
                <TabsTrigger value="todos">Todos</TabsTrigger>
            </TabsList>
            <TabsContent value={tabValue}>
                <Card>
                    <CardHeader>
                        <CardTitle>{TABS_VALUES[tabValue].title}</CardTitle>
                        <CardDescription>{TABS_VALUES[tabValue].description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <EntregablesTable
                        filter={TABS_VALUES[tabValue].filter}
                        entregables={entregablesFiltrados}
                        setEntregables={setEntregables}
                        />
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
        </div>
    );
};

export default EntregablesAlumnoPage;

const TABS_VALUES= {
   no_iniciado: {
    title: "Pendientes",
    description: "Lista de entregables pendientes de revisión",
    filter: "no_iniciado",
  },
  entregados: {
    title: "Entregados",
    description: "Lista de entregables presentados",
    filter: "Entregado",
  },
  revision: {
    title: "En Revisión",
    description: "Lista de entregables en revisión",
    filter: "En Revisión",
  },
  revisados: {
    title: "Revisados",
    description: "Lista de entregables revisados",
    filter: "Revisado",
  },
  todos: {
    title: "Todos",
    description: "Lista completa de entregables",
    filter: "Todos",
  },
};