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
import { PendientesCotesistasCard } from "@/features/temas/components/alumno/pendientes-cotesistas-card";
import { PropuestasTable } from "@/features/temas/components/alumno/propuestas-table";
import { TemaCard } from "@/features/temas/components/alumno/tema-inscrito-card";
import Link from "next/link";
import { useState } from "react";

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

const propuestas: Propuesta[] = [
  {
    id: "1",
    titulo: "Plataforma de gestión de eventos académicos con IA",
    area: "Desarrollo Web",
    estudiantes: ["Laura Martínez"],
    codigos: ["20201234"],
    postulaciones: 0,
    fechaLimite: "2023-11-17",
    tipo: "directa",
    descripcion:
      "Desarrollo de una plataforma web para la gestión integral de eventos académicos que utilice inteligencia artificial para optimizar la programación y asignación de recursos.",
    objetivos:
      "Crear una interfaz intuitiva para la gestión de eventos. Implementar algoritmos de IA para optimizar horarios. Desarrollar un sistema de notificaciones automáticas.",
    asesor: "Dr. Miguel Ángel Torres",
    estado: "cotesista_pendiente"
  },
  {
    id: "2",
    titulo: "Sistema de monitoreo ambiental con IoT",
    area: "Internet de las Cosas",
    estudiantes: ["Pedro Sánchez"],
    codigos: ["20193345"],
    postulaciones: 1,
    fechaLimite: "2023-11-30",
    tipo: "general",
    descripcion:
      "Diseño e implementación de un sistema de monitoreo ambiental en tiempo real usando sensores conectados mediante IoT.",
    objetivos:
      "Recolectar datos ambientales. Procesar datos en la nube. Visualizar información en dashboard.",
    estado: "propuesta"
  },
  {
    id: "3",
    titulo: "Análisis de sentimientos en redes sociales",
    area: "Ciencia de Datos",
    estudiantes: ["Carla Rodríguez", "Luis Pérez"],
    codigos: ["20181234", "20191234"],
    postulaciones: 2,
    fechaLimite: "2023-12-10",
    tipo: "directa",
    descripcion:
      "Aplicación de técnicas de NLP para analizar sentimientos en publicaciones de redes sociales con fines de estudio de mercado.",
    objetivos:
      "Clasificar publicaciones por sentimiento. Evaluar tendencias por marca. Automatizar alertas de menciones negativas.",
    asesor: "Dra. Carmen Vega",
    estado: "propuesta"
  },
  {
    id: "4",
    titulo: "Sistema de predicción de demanda con aprendizaje automático",
    area: "Inteligencia Artificial",
    estudiantes: ["Marco Antonio"],
    codigos: ["20204567"],
    postulaciones: 1,
    fechaLimite: "2023-12-05",
    tipo: "general",
    descripcion:
      "Desarrollar un sistema que prediga la demanda de productos usando modelos de machine learning supervisado.",
    objetivos:
      "Obtener histórico de ventas. Entrenar modelos predictivos. Validar predicciones con nuevas ventas.",
    estado: "propuesta"
  }
];

const MisTemasPage = () => {
  const [selectedPropuesta, setSelectedPropuesta] = useState<Propuesta | null>(null);

  const propuestasPendientes = propuestas.filter((p) => p.estado === "cotesista_pendiente");
  const propuestasConfirmadas = propuestas.filter((p) => p.estado === "propuesta");

  return (
    <div className="space-y-8 mt-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#042354]">Mis Temas</h1>
          <p className="text-muted-foreground">
            Gestión de tus temas de proyecto de fin de carrera, postulaciones y propuestas
          </p>
        </div>
        <Link href="/alumno/temas/nueva-propuesta">
          <Button className="bg-[#042354] hover:bg-[#0e2f7a] text-white">+ Nueva Propuesta</Button>
        </Link>
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
              <PropuestasTable propuestas={propuestasConfirmadas} setSelectedPropuesta={setSelectedPropuesta} />
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
              <PendientesCotesistasCard
                propuestasPendientes={propuestasPendientes}
                onView={(id) => {
                  const found = propuestas.find((p) => p.id === id);
                  if (found) setSelectedPropuesta(found);
                }}
                onDelete={() => {}}
              />
              <div className="mt-6" />
              <PropuestasTable propuestas={propuestasConfirmadas} setSelectedPropuesta={setSelectedPropuesta} />
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
