"use client";

import { emptyTemaForm } from "@/app/types/temas/data";
import { TabValues } from "@/app/types/temas/enums";
import NuevoTemaDialog from "@/components/asesor/tema-nuevo-modal";
import { TemasTable } from "@/components/asesor/temas-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { useState } from "react";

/**
 * Muestra la vista de temas, donde se puede inscribir temas, filtrar mis temas.
 * @returns Vista Temas
 */
const page = () => {
  const [isNuevoTemaDialogOpen, setIsNuevoTemaDialogOpen] = useState(false);

  return (
    <div className="space-y-8 mt-4">
      <div className="flex items-end justify-between">
        {/* Intro */}
        <div>
          <h1 className="text-3xl font-bold text-[#042354]">Mis Temas</h1>
          <p className="text-muted-foreground">
            Gestión de temas de tesis propuestos y asignados
          </p>
        </div>

        {/* Button Nuevo Tema */}
        <Dialog
          open={isNuevoTemaDialogOpen}
          onOpenChange={setIsNuevoTemaDialogOpen}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus></Plus>Nuevo Tema
            </Button>
          </DialogTrigger>
          <NuevoTemaDialog
            isOpen={isNuevoTemaDialogOpen}
            setIsNuevoTemaDialogOpen={setIsNuevoTemaDialogOpen}
          />
        </Dialog>
      </div>

      {/* Tabs {todos, inscritos, etc ..} */}
      <Tabs defaultValue={TabValues.TODOS} className="w-full">
        <TabsList>
          <TabsTrigger value={TabValues.TODOS}>Todos</TabsTrigger>
          <TabsTrigger value={TabValues.INSCRITO}>Inscritos</TabsTrigger>
          <TabsTrigger value={TabValues.LIBRE}>Libres</TabsTrigger>
          <TabsTrigger value={TabValues.INTERESADO}>Interesantes</TabsTrigger>
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
        <TabsContent value={TabValues.INSCRITO}>
          <Card>
            <CardHeader>
              <CardTitle>Temas inscritos</CardTitle>
              <CardDescription>
                Temas de tesis en los que estás inscrito
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TemasTable filter={TabValues.INSCRITO} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value={TabValues.LIBRE}>
          <Card>
            <CardHeader>
              <CardTitle>Temas libres</CardTitle>
              <CardDescription>
                Temas de tesis disponibles para postular
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TemasTable filter={TabValues.LIBRE} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value={TabValues.INTERESADO}>
          <Card>
            <CardHeader>
              <CardTitle>Temas de interés</CardTitle>
              <CardDescription>
                Temas de tesis que has marcado como interesantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TemasTable filter={TabValues.INTERESADO} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default page;
