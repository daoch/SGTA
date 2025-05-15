"use client";

import {
  coasesoresData,
  emptyTemaForm,
  estudiantesData,
} from "@/app/types/temas/data";
import {
  AreaDeInvestigacion,
  Coasesor,
  Tesista,
} from "@/app/types/temas/entidades";
import { Tipo } from "@/app/types/temas/enums";
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
import { useEffect, useState } from "react";

/**
 * Rol: Asesor
 * Muestra lista de temas y permite inscribir nuevos temas.
 * @returns Vista Temas
 */
const page = () => {
  const [isNuevoTemaDialogOpen, setIsNuevoTemaDialogOpen] = useState(false);
  const [coasesoresDisponibles, setCoasesoresDisponibles] =
    useState<Coasesor[]>(coasesoresData);
  const [estudiantesDisponibles, setEstudiantesDisponibles] =
    useState<Tesista[]>(estudiantesData);
  const [subareasDisponibles, setSubareasDisponibles] = useState<
    AreaDeInvestigacion[]
  >([]);

  useEffect(() => {
    const fetchSubareas = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}subAreaConocimiento/list`,
        );
        if (!response.ok) throw new Error("Error al obtener subáreas");
        const data = await response.json();
        setSubareasDisponibles(data);
      } catch (error) {
        console.error("Error cargando subáreas:", error);
      }
    };
    fetchSubareas();
  }, []);

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
            coasesoresDisponibles={coasesoresDisponibles}
            estudiantesDisponibles={estudiantesDisponibles}
            subareasDisponibles={subareasDisponibles}
          />
        </Dialog>
      </div>

      {/* Tabs */}
      <Tabs defaultValue={Tipo.TODOS} className="w-full">
        <TabsList>
          <TabsTrigger value={Tipo.TODOS}>Todos</TabsTrigger>
          <TabsTrigger value={Tipo.INSCRITO}>Inscritos</TabsTrigger>
          <TabsTrigger value={Tipo.LIBRE}>Libres</TabsTrigger>
          <TabsTrigger value={Tipo.INTERESADO}>Interesantes</TabsTrigger>
        </TabsList>
        <TabsContent value={Tipo.TODOS}>
          <Card>
            <CardHeader>
              <CardTitle>Todos los temas</CardTitle>
              <CardDescription>
                Lista de todos los temas de tesis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TemasTable filter={Tipo.TODOS} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value={Tipo.INSCRITO}>
          <Card>
            <CardHeader>
              <CardTitle>Temas inscritos</CardTitle>
              <CardDescription>
                Temas de tesis en los que estás inscrito
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TemasTable filter={Tipo.INSCRITO} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value={Tipo.LIBRE}>
          <Card>
            <CardHeader>
              <CardTitle>Temas libres</CardTitle>
              <CardDescription>
                Temas de tesis disponibles para postular
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TemasTable filter={Tipo.LIBRE} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value={Tipo.INTERESADO}>
          <Card>
            <CardHeader>
              <CardTitle>Temas de interés</CardTitle>
              <CardDescription>
                Temas de tesis que has marcado como interesantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TemasTable filter={Tipo.INTERESADO} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default page;
