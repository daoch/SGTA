"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Entregable } from "../../dtos/entregable";
import { toast } from "sonner";

interface EntregableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (entregable: Entregable) => Promise<void>;
  entregable?: Entregable | null;
  mode: "create" | "edit";
}

export const EntregableModal: React.FC<EntregableModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  entregable,
  mode,
}) => {
  const isEditMode = mode === "edit";

  const [formData, setFormData] = useState<Entregable>({
    id: "",
    nombre: "",
    descripcion: "",
    fechaInicio: "",
    fechaFin: "",
    esEvaluable: true,
    maximoDocumentos: null,
    extensionesPermitidas: "",
    pesoMaximoDocumento: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [extensionesSeleccionadas, setExtensionesSeleccionadas] = useState<
    string[]
  >(
    formData.extensionesPermitidas
      ? formData.extensionesPermitidas.split(",")
      : [],
  );
  const [pesoSeleccionado, setPesoSeleccionado] = useState<string>(
    formData.pesoMaximoDocumento ? String(formData.pesoMaximoDocumento) : "",
  );
  const [opcionalMaxDocs, setOpcionalMaxDocs] = useState(false);
  const [opcionalExtensiones, setOpcionalExtensiones] = useState(false);
  const [opcionalPesoMax, setOpcionalPesoMax] = useState(false);

  useEffect(() => {
    if (opcionalMaxDocs) {
      setFormData((prev) => ({ ...prev, maximoDocumentos: null }));
    }
    if (opcionalExtensiones) {
      setExtensionesSeleccionadas([]);
    }
    if (opcionalPesoMax) {
      setPesoSeleccionado("");
      setFormData((prev) => ({ ...prev, pesoMaximoDocumento: null }));
    }
  }, [opcionalMaxDocs, opcionalExtensiones, opcionalPesoMax]);

  const handleExtensionChange = (ext: string) => {
    setExtensionesSeleccionadas((prev) =>
      prev.includes(ext) ? prev.filter((e) => e !== ext) : [...prev, ext],
    );
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      extensionesPermitidas: extensionesSeleccionadas.join(","),
      pesoMaximoDocumento: pesoSeleccionado
        ? parseInt(pesoSeleccionado, 10)
        : null,
    }));
  }, [extensionesSeleccionadas,pesoSeleccionado]);

  useEffect(() => {
    if (isEditMode && entregable) {
      setExtensionesSeleccionadas(
        (entregable.extensionesPermitidas ?? "")
          .split(",")
          .map((ext) => ext.trim())
          .filter((ext) => ext !== ""),
      );
      if (entregable.pesoMaximoDocumento) {
        setPesoSeleccionado(String(entregable.pesoMaximoDocumento));
      }
    } else if (!isEditMode) {
      setExtensionesSeleccionadas([]);
      setPesoSeleccionado("");
    }
  }, [isEditMode, entregable, isOpen]);

  // Cargar datos del entregable cuando cambie (en modo edición)
  useEffect(() => {
    if (isEditMode && entregable) {
      setFormData({
        id: entregable.id,
        nombre: entregable.nombre,
        descripcion: entregable.descripcion,
        fechaInicio: entregable.fechaInicio
          ? toLocalDatetime(entregable.fechaInicio) // Convertir a zona horaria local
          : "",
        fechaFin: entregable.fechaFin
          ? toLocalDatetime(entregable.fechaFin) // Convertir a zona horaria local
          : "",
        esEvaluable: entregable.esEvaluable,
        maximoDocumentos: entregable.maximoDocumentos,
        extensionesPermitidas: entregable.extensionesPermitidas,
        pesoMaximoDocumento: entregable.pesoMaximoDocumento,
      });
      setOpcionalMaxDocs(entregable.maximoDocumentos === null);
      setOpcionalExtensiones(
        entregable.extensionesPermitidas === null ||
          entregable.extensionesPermitidas === "",
      );
      setOpcionalPesoMax(entregable.pesoMaximoDocumento === null);
    } else {
      // Resetear el formulario en modo creación
      setFormData({
        id: "",
        nombre: "",
        descripcion: "",
        fechaInicio: "",
        fechaFin: "",
        esEvaluable: true,
        maximoDocumentos: null,
        extensionesPermitidas: "",
        pesoMaximoDocumento: null,
      });
      setOpcionalMaxDocs(false);
      setOpcionalExtensiones(false);
      setOpcionalPesoMax(false);
    }
  }, [entregable, isEditMode, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "maximoDocumentos" || name === "pesoMaximoDocumento"
          ? parseInt(value, 10) || 0 // Convertir a entero
          : value, // Mantener como string para otros campos
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const fechaInicio = new Date(formData.fechaInicio);
    const fechaFin = new Date(formData.fechaFin);
    if (fechaFin <= fechaInicio) {
      toast.error("La fecha de fin debe ser posterior a la fecha de inicio.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Convertir las fechas al formato ISO completo
      const formattedData = {
        ...formData,
        fechaInicio: new Date(formData.fechaInicio).toISOString(),
        fechaFin: new Date(formData.fechaFin).toISOString(),
        maximoDocumentos: formData.maximoDocumentos ?? null,
        extensionesPermitidas:
          !formData.extensionesPermitidas ||
          formData.extensionesPermitidas.trim() === ""
            ? null
            : formData.extensionesPermitidas,
        pesoMaximoDocumento: formData.pesoMaximoDocumento ?? null,
      };
      await onSubmit(formattedData);
      toast.success(
        `Entregable ${isEditMode ? "actualizado" : "creado"} correctamente.`,
      );
    } catch (error) {
      console.error(
        `Error al ${isEditMode ? "actualizar" : "crear"} el entregable:`,
        error,
      );
      toast.error(
        `Error al ${isEditMode ? "actualizar" : "crear"} el entregable:`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const toLocalDatetime = (isoDate: string): string => {
    const date = new Date(isoDate); // Crear un objeto Date desde la fecha ISO
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Meses van de 0 a 11
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    // Formato compatible con datetime-local: "YYYY-MM-DDTHH:mm"
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  let buttonText = "";
  if (isSubmitting) {
    buttonText = isEditMode ? "Guardando..." : "Creando...";
  } else {
    buttonText = isEditMode ? "Guardar Cambios" : "Crear Entregable";
  }

  const isFormValid = () => {
    if (
      !formData.nombre ||
      !formData.descripcion ||
      !formData.fechaInicio ||
      !formData.fechaFin
    ) {
      return false;
    }
    if (
      !opcionalMaxDocs &&
      (!formData.maximoDocumentos || formData.maximoDocumentos < 1)
    ) {
      return false;
    }
    if (!opcionalExtensiones && extensionesSeleccionadas.length === 0) {
      return false;
    }
    if (
      !opcionalPesoMax &&
      (!formData.pesoMaximoDocumento || formData.pesoMaximoDocumento < 1)
    ) {
      return false;
    }
    return true;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Editar Entregable" : "Nuevo Entregable"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Modifique los datos del entregable existente."
              : "Agregue un nuevo entregable a la etapa. Los entregables son documentos o archivos que los estudiantes deben presentar."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre del Entregable</Label>
              <Input
                id="txtNombreEntregable"
                name="nombre"
                placeholder="Ej: Propuesta de Proyecto"
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fechaInicio">Fecha y Hora de Inicio</Label>
              <Input
                id="txtFechaInicio"
                name="fechaInicio"
                type="datetime-local"
                value={formData.fechaInicio}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fechaFin">Fecha y Hora de Fin</Label>
              <Input
                id="txtFechaFin"
                name="fechaFin"
                type="datetime-local"
                value={formData.fechaFin}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="txtDescripcion"
                name="descripcion"
                placeholder="Descripción general del entregable"
                value={formData.descripcion}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="maximoDocumentos">Máximo de Documentos</Label>
                <Checkbox
                  id="chkOpcionalMaxDocs"
                  checked={opcionalMaxDocs}
                  onCheckedChange={(checked) => setOpcionalMaxDocs(!!checked)}
                />
                <span className="text-xs text-muted-foreground">Opcional</span>
              </div>
              <Input
                id="maximoDocumentos"
                name="maximoDocumentos"
                type="number"
                min="1"
                placeholder="Ej: 5"
                value={formData.maximoDocumentos ?? ""}
                onChange={handleInputChange}
                required={!opcionalMaxDocs}
                disabled={opcionalMaxDocs}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="extensionesPermitidas">
                  Extensiones Permitidas
                </Label>
                <Checkbox
                  id="chkOpcionalExtensiones"
                  checked={opcionalExtensiones}
                  onCheckedChange={(checked) =>
                    setOpcionalExtensiones(!!checked)
                  }
                />
                <span className="text-xs text-muted-foreground">Opcional</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    type="button"
                    className="w-full justify-between"
                    disabled={opcionalExtensiones}
                  >
                    {extensionesSeleccionadas.length > 0
                      ? extensionesSeleccionadas.join(", ")
                      : "Seleccionar extensiones"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {EXTENSIONES.map((ext) => (
                    <DropdownMenuCheckboxItem
                      key={ext.value}
                      checked={extensionesSeleccionadas.includes(ext.value)}
                      onCheckedChange={() => handleExtensionChange(ext.value)}
                      disabled={opcionalExtensiones}
                    >
                      {ext.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="pesoMaximoDocumento">
                  Peso Máximo por Documento (MB)
                </Label>
                <Checkbox
                  id="chkOpcionalPesoMax"
                  checked={opcionalPesoMax}
                  onCheckedChange={(checked) => setOpcionalPesoMax(!!checked)}
                />
                <span className="text-xs text-muted-foreground">Opcional</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    type="button"
                    className="w-full justify-between"
                    disabled={opcionalPesoMax}
                  >
                    {pesoSeleccionado
                      ? PESOS_MAXIMOS.find((p) => p.value === pesoSeleccionado)
                          ?.label
                      : "Seleccionar peso máximo"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuRadioGroup
                    value={pesoSeleccionado}
                    onValueChange={setPesoSeleccionado}
                  >
                    {PESOS_MAXIMOS.map((peso) => (
                      <DropdownMenuRadioItem
                        key={peso.value}
                        value={peso.value}
                        disabled={opcionalPesoMax}
                      >
                        {peso.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <DialogFooter>
            <Button
              id="btnCancel"
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              id="btnSave"
              type="submit"
              className="bg-black hover:bg-gray-800"
              disabled={isSubmitting || !isFormValid()}
            >
              {buttonText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const EXTENSIONES = [
  { value: ".pdf", label: "Archivo PDF" },
  { value: ".docx", label: "Archivo Word (.docx)" },
  { value: ".xlsx", label: "Excel (.xlsx)" },
  { value: ".pptx", label: "PowerPoint (.pptx)" },
  { value: ".zip", label: "Carpeta comprimida (.zip)" },
];

const PESOS_MAXIMOS = [
  { value: "5", label: "5 MB" },
  { value: "25", label: "25 MB" },
  { value: "50", label: "50 MB" },
  { value: "100", label: "100 MB" },
  { value: "250", label: "250 MB" },
];
