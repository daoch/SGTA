import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PropuestasTable } from "@/components/asesor/propuestas-table";
const page = () => {
  return (
    <div className="space-y-8 mt-4">
      <div>
        <h1 className="text-3xl font-bold text-[#042354]">Propuestas</h1>
        <p className="text-muted-foreground">Propuestas realizadas por otros estudiantes</p>
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
              <CardDescription>Propuestas enviadas directamente a ti como asesor</CardDescription>
            </CardHeader>
            <CardContent>
              <PropuestasTable filter="directa" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="generales">
          <Card>
            <CardHeader>
              <CardTitle>Propuestas Generales</CardTitle>
              <CardDescription>Propuestas abiertas para cualquier asesor interesado</CardDescription>
            </CardHeader>
            <CardContent>
              <PropuestasTable filter="general" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default page