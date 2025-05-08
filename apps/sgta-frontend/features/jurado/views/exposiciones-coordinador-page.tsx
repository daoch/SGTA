"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CursoSelect } from "@/features/jurado/components/curso-select";
import { EstadoSelect } from "@/features/jurado/components/estado-select";
import { PeriodoSelect } from "@/features/jurado/components/periodo-select";

import React, { useState } from "react";
const ExposicionesCoordinadorPage: React.FC = () => {
  const [curso, setCurso] = useState("");
  const [tipoExposicion, setTipoExposicion] = useState("");
  const [fechaExposicion, setFechaExposicion] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [sala, setSala] = useState("");
  const [periodo, setPeriodo] = useState("2025-1");
  const [estado, setEstado] = useState("Pendiente");
  const [fechas, setFechas] = useState([
    { fecha: "", horaInicio: "", horaFin: "", sala: "" },
  ]);
  const [isAdded, setIsAdded] = useState(false);

  // Estado para abrir los modales
  const [openStep1, setOpenStep1] = useState(false);
  const [openStep2, setOpenStep2] = useState(false);
  const [openStep3, setOpenStep3] = useState(false);

  const agregarFila = () => {
    if (!isAdded) {
      setFechas([
        ...fechas,
        { fecha: "", horaInicio: "", horaFin: "", sala: "" },
      ]);
      setIsAdded(true);
    }
  };

  const eliminarFila = (index: number) => {
    const nuevasFechas = fechas.filter((_, i) => i !== index);
    setFechas(nuevasFechas);

    if (index === 1) {
      setIsAdded(false);
    }
  };

  const handleFechaChange = (
    index: number,
    field: "fecha" | "horaInicio" | "horaFin" | "sala",
    value: string,
  ) => {
    const nuevasFechas = [...fechas];
    nuevasFechas[index][field] = value;
    setFechas(nuevasFechas);
  };

  const resetForm = () => {
    setCurso("");
    setTipoExposicion("");
    setFechaExposicion("");
    setHoraInicio("");
    setHoraFin("");
    setSala("");
    setPeriodo("2025-1");
    setEstado("Pendiente");
    setFechas([{ fecha: "", horaInicio: "", horaFin: "", sala: "" }]);
    setIsAdded(false);
  };

  const handleAceptar = () => {
    console.log("Fechas registradas:", fechas);
    setOpenStep3(false);
    resetForm();
  };

  const handleCloseModal = () => {
    resetForm();
    setOpenStep1(false);
    setOpenStep2(false);
    setOpenStep3(false);
  };

  return (
    <div className="flex flex-col p-6 w-full">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Exposiciones
      </h1>

      <div className="flex items-end flex-wrap gap-4 mb-6">
        {/* Contenedor de los tres combo boxes y el botón "Exportar" */}
        <div className="flex gap-4 flex-1 items-end">
          <div className="flex flex-col">
            <CursoSelect curso={curso} setCurso={setCurso} />
          </div>
          <div className="flex flex-col">
            <PeriodoSelect periodo={periodo} setPeriodo={setPeriodo} />
          </div>
          <div className="flex flex-col">
            <EstadoSelect estado={estado} setEstado={setEstado} />
          </div>

          {/* Botón Exportar Lista */}
          <Button
            onClick={() => console.log("Exportar lista")}
            variant="secondary"
            className="text-indigo-700 bg-indigo-200 hover:bg-indigo-300 py-2 px-6"
          >
            Exportar Lista
          </Button>
        </div>

        {/* Botón Planificador de Exposiciones alineado a la derecha */}
        <div className="ml-auto flex items-end">
          <Button
            onClick={() => setOpenStep1(true)}
            variant="default"
            className="text-white bg-blue-900 hover:bg-blue-800 py-2 px-6"
          >
            Planificador de Exposiciones
          </Button>
        </div>
      </div>

      {/* Modal Step 1 */}
      <Dialog
        open={openStep1}
        onOpenChange={(val) => {
          setOpenStep1(val);
          if (!val) handleCloseModal();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Selecciona el Curso</DialogTitle>
          </DialogHeader>
          <p className="text-gray-700 dark:text-gray-300">
            Antes de ingresar al planificador de exposiciones, ingrese el curso
            que desea planificar.
          </p>
          <div className="flex flex-col mt-4">
            <Label htmlFor="curso" className="text-sm mb-1">
              Curso
            </Label>
            <Select value={curso} onValueChange={setCurso}>
              <SelectTrigger className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-white">
                <SelectValue placeholder="Seleccione el curso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Proyecto de Fin de Carrera 1">
                  Proyecto de Fin de Carrera 1
                </SelectItem>
                <SelectItem value="Proyecto de Fin de Carrera 2">
                  Proyecto de Fin de Carrera 2
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              onClick={() => {
                setOpenStep1(false);
                setOpenStep2(true);
              }}
              disabled={!curso}
              variant="default"
              className="text-white bg-blue-900 hover:bg-blue-800 py-2 px-6"
            >
              Continuar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Step 2 */}
      <Dialog
        open={openStep2}
        onOpenChange={(val) => {
          setOpenStep2(val);
          if (!val) handleCloseModal();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Selecciona el Tipo de Exposición</DialogTitle>
          </DialogHeader>
          <p className="text-gray-700 dark:text-gray-300">
            Antes de ingresar al planificador de exposiciones, ingrese el tipo
            de exposición.
          </p>

          {/* Curso seleccionado bloqueado */}
          <div className="flex flex-col mt-4">
            <Label htmlFor="curso" className="text-sm mb-1">
              Curso
            </Label>
            <Input
              type="text"
              value={curso}
              disabled
              className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* Tipo de exposición */}
          <div className="flex flex-col mt-4">
            <Label htmlFor="tipoExposicion" className="text-sm mb-1">
              Tipo Exposición
            </Label>
            <Select value={tipoExposicion} onValueChange={setTipoExposicion}>
              <SelectTrigger className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-white">
                <SelectValue placeholder="Seleccione tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Final">Final</SelectItem>
                <SelectItem value="Parcial">Parcial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-6 flex justify-between">
            <Button
              onClick={() => {
                setOpenStep2(false);
                setOpenStep1(true);
              }}
              variant="outline"
              className="py-2 px-6"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                setOpenStep2(false);
                setOpenStep3(true);
              }}
              disabled={!tipoExposicion}
              variant="default"
              className="text-white bg-blue-900 hover:bg-blue-800 py-2 px-6"
            >
              Continuar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Step 3 */}
      <Dialog
        open={openStep3}
        onOpenChange={(val) => {
          setOpenStep3(val);
          if (!val) handleCloseModal();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Fechas de Exposición</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col mt-4">
            <Label htmlFor="curso" className="text-sm mb-1">
              Curso
            </Label>
            <Input
              type="text"
              value={curso}
              disabled
              className="border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div className="flex flex-col mt-4">
            <Label htmlFor="tipoExposicion" className="text-sm mb-1">
              Tipo Exposición
            </Label>
            <Input
              type="text"
              value={tipoExposicion}
              disabled
              className="border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {fechas.map((f, index) => (
            <div key={index} className="flex gap-4 mt-4 items-end">
              <div className="flex flex-col w-1/4">
                <Label htmlFor="fecha" className="text-sm mb-1">
                  Fecha Exposición
                </Label>
                <Input
                  type="date"
                  value={f.fecha}
                  onChange={(e) =>
                    handleFechaChange(index, "fecha", e.target.value)
                  }
                  className="border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div className="flex flex-col w-1/4">
                <Label htmlFor="horaInicio" className="text-sm mb-1">
                  Hora Inicio
                </Label>
                <Input
                  type="time"
                  value={f.horaInicio}
                  onChange={(e) =>
                    handleFechaChange(index, "horaInicio", e.target.value)
                  }
                  className="px-3 py-2"
                />
              </div>

              <div className="flex flex-col w-1/4">
                <Label htmlFor="horaFin" className="text-sm mb-1">
                  Hora Fin
                </Label>
                <Input
                  type="time"
                  value={f.horaFin}
                  onChange={(e) =>
                    handleFechaChange(index, "horaFin", e.target.value)
                  }
                  className="px-3 py-2"
                />
              </div>

              <div className="flex flex-col w-1/4">
                <Label htmlFor="sala" className="text-sm mb-1">
                  Sala Habilitada
                </Label>
                <Select
                  value={f.sala}
                  onValueChange={(value) =>
                    handleFechaChange(index, "sala", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione sala" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sala A">Sala A</SelectItem>
                    <SelectItem value="Sala B">Sala B</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {index === 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => eliminarFila(index)}
                  className="h-10 w-10 text-red-500 hover:text-red-600"
                >
                  X
                </Button>
              )}
            </div>
          ))}
          <div className="mt-4">
            <Button
              onClick={agregarFila}
              variant="default"
              className="text-white bg-blue-900 hover:bg-blue-800 py-2 px-6"
            >
              + Agregar Fecha de Exposición
            </Button>
          </div>

          <div className="mt-6 flex justify-between">
            <Button
              onClick={() => {
                setOpenStep3(false);
                setOpenStep2(true);
              }}
              variant="outline"
              className="py-2 px-6"
            >
              Cancelar
            </Button>

            <Button
              onClick={handleAceptar}
              variant="default"
              className="text-white bg-blue-900 hover:bg-blue-800 py-2 px-6"
            >
              Continuar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExposicionesCoordinadorPage;
