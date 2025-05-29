import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { solicitudesItems } from "../components/menu-solicitudes/solicitudes-items";

const solicitudes = solicitudesItems;

export default function SolicitudesAcademicas() {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Solicitudes Académicas</h1>
        <p className="text-muted-foreground">
          Gestiona y realiza seguimiento a tus solicitudes académicas de manera
          sencilla y eficiente.
        </p>
      </div>

      <div className="space-y-4">
        <Accordion type="single" collapsible className="w-full">
          {solicitudes.map((solicitud) => {
            const Icon = solicitud.icono;
            return (
              <AccordionItem
                key={solicitud.id}
                value={solicitud.id}
                className="border border-gray-200 rounded-lg px-6"
              >
                <AccordionTrigger className="hover:no-underline py-6">
                  <div className="flex items-start gap-4 text-left">
                    <div className="mt-1">
                      <Icon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        {solicitud.nombre}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {solicitud.descripcion}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <div className="ml-10 space-y-3">
                    {solicitud.acciones.map((accion, index) => {
                      const AccionIcon = accion.icono;
                      return (
                        <Button
                          key={index}
                          asChild
                          variant={accion.variante}
                          className="w-full justify-start"
                        >
                          <Link href={accion.ruta}>
                            <AccionIcon className="h-4 w-4 mr-2" />
                            {accion.label}
                          </Link>
                        </Button>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
}
