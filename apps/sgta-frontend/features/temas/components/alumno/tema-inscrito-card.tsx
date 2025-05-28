"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { BookOpen, Eye, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Profesor {
  id: number;
  nombres: string;
  primerApellido: string;
  segundoApellido: string;
  correoElectronico: string;
}

interface Tesis {
  id: number;
  titulo: string;
  resumen: string;
  area?: {
    id: number;
    nombre: string;
  }[];
  subareas?: {
    id: number;
    nombre: string;
  }[];
  tesistas: {
    id: number;
    nombres: string;
    primerApellido: string;
    codigoPucp: string;
  }[];
  coasesores?: Profesor[];
}

const profesoresData = [
  { id: "1", nombre: "Dr. Roberto Sánchez" },
  { id: "2", nombre: "Dra. Carmen Vega" },
  { id: "3", nombre: "Dr. Miguel Torres" },
  { id: "4", nombre: "Dra. Laura Mendoza" },
  { id: "5", nombre: "Dr. Javier Pérez" },
];

export function TemaCard() {
  const [tesisData, setTesisData] = useState<Tesis | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    titulo: "",
    area: "",
    descripcion: "",
    asesor: "",
    coasesores: [] as string[],
  });
  const [nuevoCoasesor, setNuevoCoasesor] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTesis = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/temas/listarTemasPorUsuarioRolEstado/2?rolNombre=Tesista&estadoNombre=INSCRITO`);
        if (!response.ok) throw new Error("Error al obtener datos de tesis");
        const data = await response.json();
        const tesis = data[0];
        setTesisData(tesis);

        const asesorPrincipal = tesis.coasesores?.[0];
        const coasesoresRestantes = tesis.coasesores?.slice(1) ?? [];

        setFormData({
          titulo: tesis.titulo,
          area: tesis.area ?? "",
          descripcion: tesis.resumen,
          asesor: asesorPrincipal ? `${asesorPrincipal.nombres} ${asesorPrincipal.primerApellido}` : "No asignado",
          coasesores: coasesoresRestantes.map(
            (c: Profesor) => `${c.nombres} ${c.primerApellido}`
          ),
        });
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchTesis();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCoasesor = () => {
    if (nuevoCoasesor && !formData.coasesores.includes(nuevoCoasesor)) {
      setFormData((prev) => ({
        ...prev,
        coasesores: [...prev.coasesores, nuevoCoasesor],
      }));
      setNuevoCoasesor("");
    }
  };

  const handleRemoveCoasesor = (coasesor: string) => {
    setFormData((prev) => ({
      ...prev,
      coasesores: prev.coasesores.filter((c) => c !== coasesor),
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Tesis actualizada:", formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar tesis:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!tesisData) {
    return (
      <div className="text-center py-12">
        <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No tienes un proyecto de fin de carrera inscrito</h3>
        <p className="text-muted-foreground mb-6">Puedes postular a temas libres o proponer un nuevo tema de tesis</p>
        <div className="flex justify-center gap-4">
          <Link href="temas/catalogo-de-temas">
            <Button variant="outline">Ver temas libres</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Card className="border-2 border-pucp-blue/20 shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl text-pucp-blue">{tesisData.titulo}</CardTitle>
            <div className="mt-1 space-y-1 text-sm text-muted-foreground">
            <div>
              <span className="font-medium text-black">Área:</span>{" "}
              {tesisData.area && tesisData.area.length > 0
                ? tesisData.area[0].nombre
                : "No especificada"}
            </div>
            <div>
              <span className="font-medium text-black">Subáreas:</span>{" "}
              {tesisData.subareas && tesisData.subareas.length > 0
                ? tesisData.subareas.map((s) => s.nombre).join(", ")
                : "No especificadas"}
            </div>
          </div>
          </div>
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            En desarrollo
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Descripción</h3>
          <p className="text-sm text-muted-foreground">{tesisData.resumen}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium flex items-center gap-1">
              <Users className="h-4 w-4" /> <span>Asesor</span>
            </h3>
            <p className="text-sm">{formData.asesor}</p>
            {formData.coasesores.length > 0 && (
              <div className="mt-1">
                <h4 className="text-xs text-muted-foreground">Coasesores:</h4>
                <p className="text-sm">{formData.coasesores.join(", ")}</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium flex items-center gap-1">
              <Users className="h-4 w-4" /> <span>Tesistas</span>
            </h3>
            <ul className="space-y-1">
              {tesisData.tesistas.map((est) => (
                <li key={est.id} className="text-sm flex justify-between">
                  <span>{`${est.nombres} ${est.primerApellido}`}</span>
                  <span className="text-muted-foreground">{est.codigoPucp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link href={`/alumno/temas/${tesisData.id}`}>
          <Button variant="outline">
            <Eye className="mr-2 h-4 w-4" /> Ver observaciones
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
