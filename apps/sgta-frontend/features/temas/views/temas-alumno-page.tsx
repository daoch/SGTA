"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { PostulacionesTable } from "@/features/temas/components/alumno/mis-postulaciones-table";
import { PropuestasTable } from "@/features/temas/components/alumno/propuestas-table";
import { TemaCard } from "@/features/temas/components/alumno/tema-inscrito-card";
import Link from "next/link";
import { useEffect, useState } from "react";

export interface Propuesta {
  id: string;
  titulo: string;
  area: string;
  estudiantes: string[];
  codigos: string[];
  postulaciones: number;
  fechaLimite: string;
  tipo: "general" | "directa";
  descripcion: string;
  objetivos: string;
  asesor?: string;
  estado: "propuesta" | "cotesista_pendiente";
}

interface TemaInscrito {
  id: number;
  titulo: string;
  resumen: string;
  area: { id: number; nombre: string };
  tesistas: { id: number; nombres: string; primerApellido: string; codigoPucp: string }[];
}

const MisTemasPage = () => {
  const [selectedPropuesta, setSelectedPropuesta] = useState<Propuesta | null>(null);
  const [temaInscrito, setTemaInscrito] = useState<TemaInscrito | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchTema = async () => {
      try {
        const { idToken } = useAuthStore.getState();
        if (!idToken) {
          console.error("No authentication token available");
          return;
        }

        let res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/temas/listarTemasPorUsuarioRolEstado?rolNombre=Tesista&estadoNombre=INSCRITO`,
          {
            headers: {
              "Authorization": `Bearer ${idToken}`,
              "Content-Type": "application/json"
            }
          }
        );
        let data = await res.json();

        if (!data || data.length === 0) {
          res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/temas/listarTemasPorUsuarioRolEstado?rolNombre=Tesista&estadoNombre=REGISTRADO`,
            {
              headers: {
                "Authorization": `Bearer ${idToken}`,
                "Content-Type": "application/json"
              }
            }
          );
          data = await res.json();
        }

        setTemaInscrito(data.length > 0 ? data[0] : null);
      } catch (error) {
        console.error("Error al obtener tema inscrito o registrado", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTema();
  }, []);

  return (
    <div className="space-y-8 mt-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#042354]">Temas</h1>
          <p className="text-muted-foreground">
            Gestión de tus temas de proyecto de fin de carrera, postulaciones y propuestas
          </p>
        </div>
        {!isLoading && !temaInscrito && (
          <Link href="/alumno/temas/nueva-propuesta">
            <Button className="bg-[#042354] hover:bg-[#0e2f7a] text-white">+ Nueva Propuesta</Button>
          </Link>
        )}
      </div>

      <Tabs defaultValue="inscrito" className="w-full">
        <TabsList>
          <TabsTrigger value="inscrito">Inscrito</TabsTrigger>
          <TabsTrigger value="postulaciones">Postulaciones</TabsTrigger>
          <TabsTrigger value="propuestas">Propuestas</TabsTrigger>
        </TabsList>

        <TabsContent value="inscrito">
          <Card>
            <CardHeader>
              <CardTitle>Tema Inscrito</CardTitle>
              <CardDescription>Información sobre tu tema actualmente inscrito</CardDescription>
            </CardHeader>
            <CardContent>
              <TemaCard />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="postulaciones">
          <Card>
            <CardHeader>
              <CardTitle>Mis Postulaciones</CardTitle>
              <CardDescription>Temas de proyectos a los que has postulado</CardDescription>
            </CardHeader>
            <CardContent>
              <PostulacionesTable/>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="propuestas">
          <Card>
            <CardHeader>
              <CardTitle>Mis Propuestas</CardTitle>
              <CardDescription>Temas que has propuesto</CardDescription>
            </CardHeader>
            <CardContent>
              {/*<PendientesCotesistasCard
                propuestasPendientes={propuestasPendientes}
                onView={(id) => {
                  const found = propuestas.find((p) => p.id === id);
                  if (found) setSelectedPropuesta(found);
                }}
                onDelete={() => {}}
              />*/}
              <div className="mt-6" />
              <PropuestasTable/>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedPropuesta} onOpenChange={(open) => !open && setSelectedPropuesta(null)}>
        <DialogContent className="w-[90vw] max-w-3xl sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedPropuesta?.estado === "cotesista_pendiente"
                ? "Propuesta con cotesista pendiente"
                : "Detalles de la Propuesta"}
            </DialogTitle>
            <DialogDescription>
              {selectedPropuesta?.estado === "cotesista_pendiente"
                ? "Esta propuesta está pendiente de aceptación por parte del cotesista invitado"
                : "Información completa sobre la propuesta seleccionada"}
            </DialogDescription>
          </DialogHeader>

          {selectedPropuesta && (
            <div className="space-y-6 py-4">
              <div className="space-y-1">
                <h3 className="font-medium">Título</h3>
                <p>{selectedPropuesta.titulo}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h3 className="font-medium">Área</h3>
                  <p>{selectedPropuesta.area}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium">
                    {selectedPropuesta.estado === "cotesista_pendiente" ? "Fecha de creación" : "Fecha límite"}
                  </h3>
                  <p>{new Date(selectedPropuesta.fechaLimite).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h3 className="font-medium">Tipo</h3>
                  <Badge
                    variant="outline"
                    className={
                      selectedPropuesta.tipo === "directa"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-green-100 text-green-800"
                    }
                  >
                    {selectedPropuesta.tipo === "directa" ? "Directa" : "General"}
                  </Badge>
                </div>
                {selectedPropuesta.estado !== "cotesista_pendiente" && (
                  <div className="space-y-1">
                    <h3 className="font-medium">Postulaciones</h3>
                    <p>{selectedPropuesta.postulaciones}</p>
                  </div>
                )}
              </div>
              {selectedPropuesta.estudiantes.length > 0 && (
                <div className="space-y-1">
                  <h3 className="font-medium">Cotesista invitado</h3>
                  <div className="p-3 bg-gray-50 rounded-md border">
                    <div className="flex justify-between items-center">
                      <span>{selectedPropuesta.estudiantes[0]}</span>
                      {selectedPropuesta.estado === "cotesista_pendiente" && (
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                          Pendiente
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {selectedPropuesta.tipo === "directa" && (
                <div className="space-y-2">
                  <Label>Asesor propuesto</Label>
                  <p>{selectedPropuesta.asesor || "No asignado"}</p>
                </div>
              )}
              <Separator />
              <div className="space-y-2">
                <Label>Descripción</Label>
                <div className="p-3 bg-gray-50 rounded-md border">
                  <p>{selectedPropuesta.descripcion}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Objetivos</Label>
                <div className="p-3 bg-gray-50 rounded-md border">
                  <p>{selectedPropuesta.objetivos}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedPropuesta(null)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MisTemasPage;