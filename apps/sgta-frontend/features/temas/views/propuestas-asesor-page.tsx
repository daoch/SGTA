"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { PropuestasTable } from "../components/asesor/propuestas-table";
import {
  fetchAreaConocimientoFindByUsuarioId,
  fetchSubAreaConocimientoFindByUsuarioId,
  fetchTemasPropuestosAlAsesor,
  fetchTemasPropuestosPorSubAreaConocimiento,
} from "../types/propuestas/data";
import {
  Area,
  Proyecto_M,
  SubAreaConocimiento,
} from "../types/propuestas/entidades";
const PropuestasAsesorPage = () => {
  const [propuestasDirectas, setPropuestasDirectas] = useState<Proyecto_M[]>([]);
  const [propuestasGenerales, setPropuestasGenerales] = useState<Proyecto_M[]>(
    [],
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage] = useState(1);
  const limit = 10;
  //const limiteTotal = 50;
  const [areasData, setAreasData] = useState<Area[]>([]);
  const [subAreasData, setSubAreasData] = useState<SubAreaConocimiento[]>([]);
  //const [totalPropuestasGenerales, setTotalPropuestasGenerales] = useState(0);
  //const [totalPropuestasDirectas, setTotalPropuestasDirectas] = useState(0);
  const [usuarioId] = useState(40);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cargarAreasYSubareas = async () => {
      const areas = await fetchAreaConocimientoFindByUsuarioId(usuarioId);
      const subareas = await fetchSubAreaConocimientoFindByUsuarioId(usuarioId);
      setAreasData(areas);
      setSubAreasData(subareas);
    };
    cargarAreasYSubareas();
    console.log("Todos los basicos cargados");
  }, [usuarioId]);

  useEffect(() => {
    if (subAreasData.length === 0) return;

    const cargarPropuestas = async () => {
      setIsLoading(true);
      const offset = (currentPage - 1) * limit;

      const dataDirecta = await fetchTemasPropuestosAlAsesor(
        usuarioId,
        searchTerm,
        limit,
        offset,
      );
      setPropuestasDirectas(dataDirecta);

      const dataGeneral = await fetchTemasPropuestosPorSubAreaConocimiento(
        subAreasData,
        usuarioId,
        searchTerm,
        limit,
        0,
      );
      setPropuestasGenerales(dataGeneral);
      setIsLoading(false);
    };

    cargarPropuestas();
  }, [currentPage, searchTerm, usuarioId, subAreasData]);

  return (
    <div className="space-y-8 mt-4">
      <div>
        <h1 className="text-3xl font-bold text-[#042354]">Propuestas</h1>
        <p className="text-muted-foreground">
          Propuestas realizadas por otros estudiantes
        </p>
      </div>

      <Tabs defaultValue="directas" className="w-full">
        <TabsList>
          <TabsTrigger value="directas">Directas</TabsTrigger>
          <TabsTrigger value="generales">Generales</TabsTrigger>
        </TabsList>
        <TabsContent value="directas">
          <Card>
            <CardHeader>
              <CardTitle>Propuestas Directas</CardTitle>
              <CardDescription>
                Propuestas enviadas directamente a ti como asesor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PropuestasTable
                propuestasData={propuestasDirectas}
                setPropuestasData={setPropuestasDirectas}
                areasData={areasData}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                subAreasData={subAreasData}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="generales">
          <Card>
            <CardHeader>
              <CardTitle>Propuestas Generales</CardTitle>
              <CardDescription>
                Propuestas abiertas para cualquier asesor interesado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PropuestasTable
                propuestasData={propuestasGenerales}
                setPropuestasData={setPropuestasGenerales}
                areasData={areasData}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                subAreasData={subAreasData}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PropuestasAsesorPage;
