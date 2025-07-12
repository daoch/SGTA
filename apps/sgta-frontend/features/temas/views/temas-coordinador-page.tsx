"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { TemasTableCoordinador } from "../components/coordinador/temas-table-coordinador";
import { Search } from "lucide-react";
import { ciclosService } from "@/features/configuracion/services/etapa-formativa-ciclo";
import { useAuthStore } from "@/features/auth/store/auth-store";

enum TabValues {
  TODOS = "todos",
  INSCRITOS = "inscrito",
  LIBRES = "libre",
  INTERESADOS = "interesado",
}

const TemasCoordinadorPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [ciclos, setCiclos] = useState<{id: number, semestre: string, anio: number, activo: boolean}[]>([]);
  const [selectedCiclo, setSelectedCiclo] = useState<string>("todos");
  const [loadingCiclos, setLoadingCiclos] = useState(true);
  const [areas, setAreas] = useState<{ id: number; nombre: string }[]>([]);
  const [selectedArea, setSelectedArea] = useState<string>("todas");
  const [loadingAreas, setLoadingAreas] = useState(true);
  const [subareasForSelectedArea, setSubareasForSelectedArea] = useState<number[]>([]);

  useEffect(() => {
    const fetchCiclos = async () => {
      try {
        const data = await ciclosService.getAllYears();
        // Ordenar por año desc (más reciente primero) y tomar los últimos 5
        const sortedCiclos = data
          .sort((a: {id: number, semestre: string, anio: number, activo: boolean}, b: {id: number, semestre: string, anio: number, activo: boolean}) => {
            if (b.anio !== a.anio) return b.anio - a.anio;
            return b.semestre.localeCompare(a.semestre);
          })
          .slice(0, 5);
        setCiclos(sortedCiclos);
      } catch (error) {
        console.error("Error al cargar ciclos:", error);
        setCiclos([]);
      } finally {
        setLoadingCiclos(false);
      }
    };

    const fetchAreas = async () => {
      try {
        const { idToken } = useAuthStore.getState();
        if (!idToken) {
          console.error("No authentication token available");
          return;
        }
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/areaConocimiento/listarPorUsuarioSub`,
          {
            headers: {
              "Authorization": `Bearer ${idToken}`,
              "Content-Type": "application/json"
            }
          }
        );
        if (!res.ok) throw new Error("Error loading áreas");
        const data: Array<{ id: number; nombre: string }> = await res.json();
        setAreas(data);
      } catch (error) {
        console.error("Error al cargar áreas:", error);
      } finally {
        setLoadingAreas(false);
      }
    };

    fetchCiclos();
    fetchAreas();
  }, []);

  // Fetch subareas when area selection changes
  useEffect(() => {
    const fetchSubareasForArea = async () => {
      if (selectedArea === "todas") {
        setSubareasForSelectedArea([]);
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/subAreaConocimiento/list/${selectedArea}`
        );
        if (!res.ok) throw new Error("Error loading subareas");
        const subareas: Array<{ id: number; nombre: string }> = await res.json();
        const subareaIds = subareas.map(s => s.id);
        setSubareasForSelectedArea(subareaIds);
      } catch (error) {
        console.error("Error al cargar subareas para el área seleccionada:", error);
        setSubareasForSelectedArea([]);
      }
    };

    fetchSubareasForArea();
  }, [selectedArea]);

  return (
    <div className="space-y-8 mt-4">
      <div>
        <h1 className="text-3xl font-bold text-[#042354]">Temas Inscritos</h1>
        <p className="text-muted-foreground">
          Gestión de temas de tesis inscritos en el sistema
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            {/* <Input placeholder="Buscar por título, estudiante o asesor..." /> */}

            {/* Searchbar */}
            <div className="relative w-full md:flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={"Buscar por título, estudiante o asesor..."}
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {selectedCiclo === "todos" 
                    ? "Todos los ciclos" 
                    : ciclos.find(c => c.id.toString() === selectedCiclo)
                      ? `${ciclos.find(c => c.id.toString() === selectedCiclo)?.anio}-${ciclos.find(c => c.id.toString() === selectedCiclo)?.semestre}`
                      : "Seleccionar ciclo"
                  }
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Filtrar por Ciclo</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={selectedCiclo}
                  onValueChange={setSelectedCiclo}
                >
                  <DropdownMenuRadioItem value="todos">
                    Todos los ciclos
                  </DropdownMenuRadioItem>
                  {loadingCiclos ? (
                    <DropdownMenuRadioItem value="loading" disabled>
                      Cargando...
                    </DropdownMenuRadioItem>
                  ) : (
                    ciclos.map((ciclo) => (
                      <DropdownMenuRadioItem 
                        key={ciclo.id} 
                        value={ciclo.id.toString()}
                      >
                        {ciclo.anio}-{ciclo.semestre}
                        {ciclo.activo && " (Activo)"}
                      </DropdownMenuRadioItem>
                    ))
                  )}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {selectedArea === "todas" 
                    ? "Todas las áreas" 
                    : areas.find(a => a.id.toString() === selectedArea)?.nombre || "Seleccionar área"
                  }
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Filtrar por Área</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={selectedArea}
                  onValueChange={setSelectedArea}
                >
                  <DropdownMenuRadioItem value="todas">
                    Todas las áreas
                  </DropdownMenuRadioItem>
                  {loadingAreas ? (
                    <DropdownMenuRadioItem value="loading" disabled>
                      Cargando...
                    </DropdownMenuRadioItem>
                  ) : (
                    areas.map((area) => (
                      <DropdownMenuRadioItem 
                        key={area.id} 
                        value={area.id.toString()}
                      >
                        {area.nombre}
                      </DropdownMenuRadioItem>
                    ))
                  )}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <TemasTableCoordinador
            filter={TabValues.TODOS}
            showPostulaciones={false}
            showTipo={false}
            searchQuery={searchQuery}
            cicloId={selectedCiclo === "todos" ? undefined : parseInt(selectedCiclo)}
            subareaIds={selectedArea === "todas" ? [] : subareasForSelectedArea}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TemasCoordinadorPage;

