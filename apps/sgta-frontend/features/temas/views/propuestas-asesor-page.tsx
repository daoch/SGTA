import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  fetchAreaConocimientoFindByUsuarioId,
  fetchSubAreaConocimientoFindByUsuarioId,
  fetchTemasPropuestosAlAsesor,
  fetchTemasPropuestosPorSubAreaConocimiento,
} from "@/features/temas/types/propuestas/data";
import { PropuestasTable } from "../components/asesor/propuestas-table";

const PropuestasAsesorPage = async () => {
  const propuestasDirectaData = await fetchTemasPropuestosAlAsesor(1);
  const areasData = await fetchAreaConocimientoFindByUsuarioId(1);
  console.log({ areasData });
  const subAreasData = await fetchSubAreaConocimientoFindByUsuarioId(1);
  const idsSubAreas = subAreasData.map((item) => item.id);
  const propuestasGeneralData =
    await fetchTemasPropuestosPorSubAreaConocimiento(idsSubAreas, 1);

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
                propuestas={propuestasDirectaData}
                areasData={areasData}
                idsSubAreas={idsSubAreas}
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
                propuestas={propuestasGeneralData}
                areasData={areasData}
                idsSubAreas={idsSubAreas}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PropuestasAsesorPage;
