import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Edit, FileText, Plus, Presentation } from "lucide-react";
import Link from "next/link";

// Datos de ejemplo
const curso = {
  id: 1,
  nombre: "Proyecto de Fin de Carrera 1",
  descripcion:
    "Primera fase del proyecto de fin de carrera enfocada en la definición del problema y la propuesta de solución.",
  objetivos: "Definir el problema, realizar el estado del arte, proponer una solución preliminar.",
  entregables: [
    {
      id: 1,
      nombre: "Propuesta de Proyecto",
      plazo: "Semana 4",
      descripcion: "Documento que describe el problema a resolver y la propuesta de solución.",
    },
    {
      id: 2,
      nombre: "Estado del Arte",
      plazo: "Semana 8",
      descripcion: "Documento que presenta la revisión de literatura y soluciones existentes.",
    },
    {
      id: 3,
      nombre: "Informe Final",
      plazo: "Semana 16",
      descripcion: "Documento final que integra todos los componentes del proyecto.",
    },
  ],
  exposiciones: [
    {
      id: 1,
      nombre: "Exposición de Avance 1",
      fechas: "Semana 6-7",
      descripcion: "Primera presentación de avance del proyecto.",
      presencial: false,
      conJurados: false,
    },
    {
      id: 2,
      nombre: "Exposición de Avance 2",
      fechas: "Semana 12-13",
      descripcion: "Segunda presentación de avance del proyecto.",
      presencial: false,
      conJurados: false,
    },
    {
      id: 3,
      nombre: "Exposición Parcial",
      fechas: "Semana 16",
      descripcion: "Presentación final del primer curso.",
      presencial: true,
      conJurados: true,
    },
  ],
};

export default function CursoDetailPage({ }: { params: { id: string } }) {
  return (
    <div className="py-6 px-2">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/coordinador/configuracion/general">
          <Button variant="ghost" size="icon">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Detalles del Curso</h1>
      </div>

      <Card className="">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{curso.nombre}</CardTitle>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Edit size={16} />
            <span>Editar</span>
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-1">Descripción</h3>
            <p className="text-gray-600">{curso.descripcion}</p>
          </div>
          <div>
            <h3 className="font-medium mb-1">Objetivos</h3>
            <p className="text-gray-600">{curso.objetivos}</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="entregables" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="entregables">Entregables</TabsTrigger>
          <TabsTrigger value="exposiciones">Exposiciones</TabsTrigger>
        </TabsList>

        <TabsContent value="entregables" className="space-y-4">
          <div className="flex justify-end mb-4">
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              <span>Nuevo Entregable</span>
            </Button>
          </div>

          <div className="grid gap-4">
            {curso.entregables.map((entregable) => (
              <Card key={entregable.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[#0F1A3A]">
                      <FileText size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold mb-1">{entregable.nombre}</h3>
                          <div className="text-sm text-gray-500 mb-2">Plazo: {entregable.plazo}</div>
                          <p className="text-sm text-gray-600">{entregable.descripcion}</p>
                        </div>
                        <Link href={`/coordinador/configuracion/general/entregables/${entregable.id}`}>
                          <Button variant="outline" size="sm">
                            Ver detalles
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="exposiciones" className="space-y-4">
          <div className="flex justify-end mb-4">
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              <span>Nueva Exposición</span>
            </Button>
          </div>

          <div className="grid gap-4">
            {curso.exposiciones.map((exposicion) => (
              <Card key={exposicion.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[#0F1A3A]">
                      <Presentation size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold mb-1">{exposicion.nombre}</h3>
                          <div className="text-sm text-gray-500 mb-2">Fechas: {exposicion.fechas}</div>
                          <p className="text-sm text-gray-600 mb-2">{exposicion.descripcion}</p>

                          <div className="flex gap-3">
                            <div className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">
                              {exposicion.presencial ? "Presencial" : "Virtual"}
                            </div>
                            <div className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">
                              {exposicion.conJurados ? "Con jurados" : "Sin jurados"}
                            </div>
                          </div>
                        </div>
                        <Link href={`/configuracion/general/exposiciones/${exposicion.id}`}>
                          <Button variant="outline" size="sm">
                            Ver detalles
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
