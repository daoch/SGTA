import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import FormularioPropuesta from "@/components/alumno/formulario-propuesta";

const page = () => {
  return (
    <div className="space-y-8 mt-4">
      <div className="flex items-center gap-2">
        <Link href="/alumno/temas">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-[#042354]">Nueva Propuesta</h1>
          <p className="text-muted-foreground text-sm">Proponer un nuevo tema de tesis</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Formulario de Propuesta</CardTitle>
          <CardDescription>Complete la información para registrar una nueva propuesta</CardDescription>
        </CardHeader>
        <CardContent>
          <FormularioPropuesta />
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
