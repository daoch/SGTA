"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostulacionesTable } from "@/features/temas/components/alumno/postulaciones-table";
import { Postulacion } from "@/features/temas/types/propuestas/entidades";
import { CheckCircle, X } from "lucide-react";
import { useState } from "react";

const PostulacionesRecibidas = () => {
  const [selectedPostulacion, setSelectedPostulacion] =
    useState<Postulacion | null>(null);

  return (
    <>
      <Tabs defaultValue="directas" className="w-full">
        <TabsList>
          <TabsTrigger value="directas">Directas</TabsTrigger>
          <TabsTrigger value="generales">Generales</TabsTrigger>
        </TabsList>
        <TabsContent value="directas">
          <Card>
            <CardHeader>
              <CardTitle>Postulaciones Directas</CardTitle>
              <CardDescription>
                Asesores interesados en tus propuestas dirigidas específicamente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PostulacionesTable
                filter="directa"
                setSelectedPostulacion={setSelectedPostulacion}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="generales">
          <Card>
            <CardHeader>
              <CardTitle>Postulaciones Generales</CardTitle>
              <CardDescription>
                Asesores interesados en tus propuestas generales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PostulacionesTable
                filter="general"
                setSelectedPostulacion={setSelectedPostulacion}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog
        open={!!selectedPostulacion}
        onOpenChange={(open: boolean) => !open && setSelectedPostulacion(null)}
      >
        <DialogContent className="w-[90vw] max-w-3xl sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalles de la Postulación</DialogTitle>
            <DialogDescription>
              Información sobre la postulación del asesor
            </DialogDescription>
          </DialogHeader>

          {selectedPostulacion && (
            <div className="space-y-6 py-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="font-medium">Tema</p>
                  <p>{selectedPostulacion.titulo}</p>
                </div>
                <Badge
                  className={
                    selectedPostulacion.estado === "pendiente"
                      ? "bg-yellow-100 text-yellow-800"
                      : selectedPostulacion.estado === "rechazado"
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                  }
                >
                  {selectedPostulacion.estado.charAt(0).toUpperCase() +
                    selectedPostulacion.estado.slice(1)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Área</p>
                  <p>{selectedPostulacion.area}</p>
                </div>
                <div>
                  <p className="font-medium">Fecha límite</p>
                  <p>{selectedPostulacion.fechaLimite}</p>
                </div>
              </div>

              <div>
                <p className="font-medium">Descripción del tema</p>
                <div className="p-3 bg-gray-50 rounded-md border text-sm text-gray-700">
                  {selectedPostulacion.descripcion}
                </div>
              </div>

              <div>
                <p className="font-medium">Información del Asesor</p>
                <div className="p-3 bg-gray-50 rounded-md border text-sm text-gray-700">
                  <p>{selectedPostulacion.asesor}</p>
                  <p className="text-muted-foreground">
                    {selectedPostulacion.correoAsesor}
                  </p>
                </div>
              </div>

              <div>
                <p className="font-medium">Comentario del Asesor</p>
                <div className="p-3 bg-gray-50 rounded-md border text-sm text-gray-700">
                  {selectedPostulacion.comentarioAsesor}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setSelectedPostulacion(null)}
            >
              Cancelar
            </Button>

            {selectedPostulacion?.estado === "pendiente" && (
              <div className="flex gap-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <X className="h-4 w-4 mr-1 text-white" />
                      Rechazar
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                      <AlertDialogDescription>
                        ¿Deseas rechazar a este asesor para tu tema de tesis?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => {
                          console.log("Asesor rechazado");
                          setSelectedPostulacion(null);
                        }}
                      >
                        Rechazar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      <CheckCircle className="h-4 w-4 mr-1 text-white" />
                      Aceptar
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                      <AlertDialogDescription>
                        ¿Deseas aceptar a este asesor para tu tema de tesis?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => {
                          console.log("Asesor aceptado");
                          setSelectedPostulacion(null);
                        }}
                      >
                        Aceptar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PostulacionesRecibidas;
