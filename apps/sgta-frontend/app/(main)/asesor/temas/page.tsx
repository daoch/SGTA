"use client";

import { TemasTable } from "@/components/asesor/temas-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

enum TabValues {
  TODOS = "todos",
  INSCRITOS = "inscrito",
  LIBRES = "libre",
  INTERESADOS = "interesado",
}

const page = () => {
  return (
    <div className="space-y-8 mt-4">
      <div>
        <h1 className="text-3xl font-bold text-[#042354]">Mis Temas</h1>
        <p className="text-muted-foreground">
          Gestión de temas de tesis propuestos y asignados
        </p>
      </div>

      <Tabs defaultValue={TabValues.TODOS} className="w-full">
        <TabsList>
          <TabsTrigger value={TabValues.TODOS}>Todos</TabsTrigger>
          <TabsTrigger value={TabValues.INSCRITOS}>Inscritos</TabsTrigger>
          <TabsTrigger value={TabValues.LIBRES}>Libres</TabsTrigger>
          <TabsTrigger value={TabValues.INTERESADOS}>Interesados</TabsTrigger>
        </TabsList>
        <TabsContent value={TabValues.TODOS}>
          <Card>
            <CardHeader>
              <CardTitle>Todos los temas</CardTitle>
              <CardDescription>
                Lista de todos los temas de tesis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TemasTable filter={TabValues.TODOS} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value={TabValues.INSCRITOS}>
          <Card>
            <CardHeader>
              <CardTitle>Temas inscritos</CardTitle>
              <CardDescription>
                Temas de tesis en los que estás inscrito
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TemasTable filter={TabValues.INSCRITOS} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value={TabValues.LIBRES}>
          <Card>
            <CardHeader>
              <CardTitle>Temas libres</CardTitle>
              <CardDescription>
                Temas de tesis disponibles para postular
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TemasTable filter={TabValues.LIBRES} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value={TabValues.INTERESADOS}>
          <Card>
            <CardHeader>
              <CardTitle>Temas de interés</CardTitle>
              <CardDescription>
                Temas de tesis que has marcado como interesantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TemasTable filter={TabValues.INTERESADOS} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default page;
