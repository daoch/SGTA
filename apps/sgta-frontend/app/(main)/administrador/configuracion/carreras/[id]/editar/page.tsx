"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { carreraService, Carrera, unidadAcademicaService, UnidadAcademica } from "@/features/configuracion/services/carrera-service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function EditarCarreraPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [carrera, setCarrera] = useState<Carrera | null>(null);
  const [unidadesAcademicas, setUnidadesAcademicas] = useState<UnidadAcademica[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    codigo: "",
    nombre: "",
    descripcion: "",
    unidadAcademicaId: "",
    activo: true,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const resolvedParams = await params;
        const carreraId = parseInt(resolvedParams.id);
        
        const [carreraData, unidadesData] = await Promise.all([
          carreraService.getById(carreraId),
          unidadAcademicaService.getAll()
        ]);
        
        setCarrera(carreraData);
        setUnidadesAcademicas(unidadesData);
        
        // Set form data
        setFormData({
          codigo: carreraData.codigo,
          nombre: carreraData.nombre,
          descripcion: carreraData.descripcion || "",
          unidadAcademicaId: carreraData.unidadAcademicaId?.toString() || "",
          activo: carreraData.activo,
        });
      } catch (error) {
        console.error("Error al cargar datos:", error);
        toast.error("Error al cargar la carrera");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [params]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!carrera) return;

    try {
      setSaving(true);
      
      const updatedCarrera: Carrera = {
        ...carrera,
        codigo: formData.codigo,
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        unidadAcademicaId: parseInt(formData.unidadAcademicaId),
        activo: formData.activo,
      };

      await carreraService.update(updatedCarrera);
      toast.success("Carrera actualizada exitosamente");
      router.push(`/administrador/configuracion/carreras/${carrera.id}`);
    } catch (error) {
      console.error("Error al actualizar la carrera:", error);
      toast.error("Error al actualizar la carrera");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-gray-500">Cargando carrera...</p>
      </div>
    );
  }

  if (!carrera) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-gray-500">Carrera no encontrada</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/administrador/configuracion/carreras/${carrera.id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Editar Carrera</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información de la Carrera</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="codigo">Código</Label>
                <Input
                  id="codigo"
                  name="codigo"
                  value={formData.codigo}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="unidadAcademicaId">Unidad Académica</Label>
                <Select
                  value={formData.unidadAcademicaId}
                  onValueChange={(value) => handleSelectChange("unidadAcademicaId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar unidad académica" />
                  </SelectTrigger>
                  <SelectContent>
                    {unidadesAcademicas.map((unidad) => (
                      <SelectItem key={unidad.id} value={unidad.id.toString()}>
                        {unidad.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows={3}
              />
            </div>


            <div className="flex gap-4 pt-4">
              <Link href={`/administrador/configuracion/carreras/${carrera.id}`}>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={saving} className="flex items-center gap-2">
                <Save size={16} />
                {saving ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 