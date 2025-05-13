import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EntregablesTable } from "../components/alumno/entregables-table";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Datos de ejemplo
const entregablesData = [
    {
      id: "E0",
      nombre: "Cronograma",
      fechaLimite: "22/03/2025",
      fechaEntrega: "18/03/2025",
      estado: "Revisado",
    },
    {
        id: "E1",
        nombre: "Revisión de Avances",
        fechaLimite: "29/03/2025",
        fechaEntrega: "28/03/2025",
        estado: "Revisado",
    },
    {
        id: "E2",
        nombre: "Implementación Completa",
        fechaLimite: "26/04/2025",
        fechaEntrega: "25/04/2025",
        estado: "En Revisión",
    },
    {
        id: "E3",
        nombre: "Validación",
        fechaLimite: "17/05/2025",
        fechaEntrega: "No entregado",
        estado: "Pendiente",
    },
    {
        id: "E4",
        nombre: "Informe Final",
        fechaLimite: "20/06/2025",
        fechaEntrega: "No entregado",
        estado: "Pendiente",
    },
    {
        id: "E5",
        nombre: "Informe Parcial",
        fechaLimite: "20/06/2025",
        fechaEntrega: "19/06/2025",
        estado: "Entregado",
    },
];

const ciclos = ["2023-1", "2023-2", "2024-1", "2024-2", "2025-1"];

const EntregablesAlumnoPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [estadoFilter, setEstadoFilter] = useState<string | null>(null);
    const [cicloSeleccionado, setCicloSeleccionado] = useState("2025-1");

    const entregablesDataFiltradas = entregablesData.filter((entregable) => {
        if (searchTerm) {
            const searchTermLower = searchTerm.toLowerCase();
            const nombreMatch = entregable.nombre.toLowerCase().includes(searchTermLower);
            return nombreMatch;
        }
        return true;
    });

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
                        <SelectItem key={ciclo} value={ciclo}>
                            {ciclo}
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="relative flex-1">
                <Input
                    type="search"
                    placeholder="Buscar por nombre de documento"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                />
            </div>

        <Tabs defaultValue="pendientes" className="w-full">
            <TabsList>
            <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
            <TabsTrigger value="entregados">Entregados</TabsTrigger>
            <TabsTrigger value="revision">En Revisión</TabsTrigger>
            <TabsTrigger value="revisados">Revisados</TabsTrigger>
            <TabsTrigger value="todos">Todos</TabsTrigger>
            </TabsList>
            <TabsContent value="pendientes">
            <Card>
                <CardHeader>
                <CardTitle>Pendientes</CardTitle>
                <CardDescription>
                    Lista de entregables pendientes de revisión
                </CardDescription>
                </CardHeader>
                <CardContent>
                <EntregablesTable 
                    filter="Pendiente" 
                    entregablesData ={entregablesDataFiltradas} 
                />
                </CardContent>
            </Card>
            </TabsContent>
            <TabsContent value="entregados">
            <Card>
                <CardHeader>
                <CardTitle>Entregados</CardTitle>
                <CardDescription>
                    Lista de entregables presentados
                </CardDescription>
                </CardHeader>
                <CardContent>
                <EntregablesTable 
                    filter="Entregado" 
                    entregablesData ={entregablesDataFiltradas} 
                />
                </CardContent>
            </Card>
            </TabsContent>
            <TabsContent value="revision">
            <Card>
                <CardHeader>
                <CardTitle>En Revisión</CardTitle>
                <CardDescription>
                    Lista de entregables en revisión
                </CardDescription>
                </CardHeader>
                <CardContent>
                <EntregablesTable 
                    filter="En Revisión" 
                    entregablesData ={entregablesDataFiltradas} 
                />
                </CardContent>
            </Card>
            </TabsContent>
            <TabsContent value="revisados">
            <Card>
                <CardHeader>
                <CardTitle>Revisados</CardTitle>
                <CardDescription>
                    Lista de entregables revisados
                </CardDescription>
                </CardHeader>
                <CardContent>
                <EntregablesTable 
                    filter="Revisado" 
                    entregablesData ={entregablesDataFiltradas} 
                />
                </CardContent>
            </Card>
            </TabsContent>
            <TabsContent value="todos">
            <Card>
                <CardHeader>
                <CardTitle>Todos</CardTitle>
                <CardDescription>
                    Lista completa de entregables
                </CardDescription>
                </CardHeader>
                <CardContent>
                <EntregablesTable 
                    filter="Todos" 
                    entregablesData ={entregablesDataFiltradas} 
                />
                </CardContent>
            </Card>
            </TabsContent>
        </Tabs>
        </div>
    );
};

export default EntregablesAlumnoPage;
