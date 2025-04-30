"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CursoSelect } from "@/features/jurado/components/curso-select";
import { EstadoSelect } from "@/features/jurado/components/estado-select";
import { PeriodoSelect } from "@/features/jurado/components/periodo-select";

import React, { useState } from "react";
const Page: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [curso, setCurso] = useState('');
  const [tipoExposicion, setTipoExposicion] = useState('');
  const [modalStep, setModalStep] = useState<number>(0); // 0: cerrado, 1: seleccionar curso, 2: seleccionar tipo, 3: registrar fechas
  const [fechaExposicion, setFechaExposicion] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [sala, setSala] = useState('');
  const [periodo, setPeriodo] = useState<string>('2025-1');
  const [estado, setEstado] = useState<string>('Pendiente');
   
  const [isAdded, setIsAdded] = useState(false);
  const [fechas, setFechas] = useState([
    { fecha: '', horaInicio: '', horaFin: '', sala: '' }
  ]);
  type CampoFecha = 'fecha' | 'horaInicio' | 'horaFin' | 'sala';
  const agregarFila = () => {
    if (!isAdded) {
      setFechas([...fechas, { fecha: '', horaInicio: '', horaFin: '', sala: '' }]);
      setIsAdded(true); // Bloquea la acción de agregar más filas
    }
  };

  // Función para manejar cambios en los campos de fecha
  const handleFechaChange = (index: number, field: CampoFecha, value: string) => {
    const nuevasFechas = [...fechas];
    nuevasFechas[index][field] = value;
    setFechas(nuevasFechas);
  };

  // Resetear los campos del formulario
  const resetForm = () => {
    setCurso('');
    setTipoExposicion('');
    setFechaExposicion('');
    setHoraInicio('');
    setHoraFin('');
    setSala('');
    setPeriodo('2025-1');
    setEstado('Pendiente');
    setFechas([{ fecha: '', horaInicio: '', horaFin: '', sala: '' }]);
    setIsAdded(false); // Permite agregar una fila nuevamente
  };

  // Acción cuando se acepta el formulario
  const handleAceptar = () => {
    console.log('Fechas registradas:', fechas);
    setOpen(false);
    setModalStep(1);
    resetForm(); // Limpiar los datos después de cerrar el modal
  };

  // Lógica de los pasos del modal
  const nextStep = () => setModalStep((prev) => prev + 1);
  const prevStep = () => setModalStep((prev) => prev - 1);

  // Función para abrir el modal
  const openModal = () => {
    setModalStep(1);
    setOpen(true);
    resetForm(); 
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
            onClick={() => console.log('Exportar lista')}
            variant="secondary"
            className="text-indigo-700 bg-indigo-200 hover:bg-indigo-300 py-2 px-6"
          >
            Exportar Lista
          </Button>
        </div>

        {/* Botón Planificador de Exposiciones alineado a la derecha */}
        <div className="ml-auto flex items-end">
          <Button
            onClick={openModal}
            variant="default"
            className="text-white bg-blue-900 hover:bg-blue-800 py-2 px-6"
          >
            Planificador de Exposiciones
          </Button>
        </div>
      </div>

      {/* Mensaje de que no hay exposiciones */}
      <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
        No se han registrado exposiciones en el período.
      </div>

      <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) setModalStep(1); }} >
      
      <DialogContent >
        <DialogHeader>
          <DialogTitle>Planificador de Exposiciones</DialogTitle>
        </DialogHeader>

        {/* Paso 1 */}
        {modalStep === 1 && (
          <>
            <p className="text-gray-700 dark:text-gray-300">
              Antes de ingresar al planificador de exposiciones, ingrese el curso que desea planificar.
            </p>
            <div className="flex flex-col mt-4">
              <label className="text-sm mb-1">Curso</label>
              <select
                value={curso}
                onChange={(e) => setCurso(e.target.value)}
                className="border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
              >
                <option value="">Seleccione el curso</option>
                <option value="Proyecto de Fin de Carrera 1">Proyecto de Fin de Carrera 1</option>
                <option value="Proyecto de Fin de Carrera 2">Proyecto de Fin de Carrera 2</option>
              </select>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={nextStep}
                disabled={!curso}
                className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
              >
                Continuar
              </button>
            </div>
          </>
        )}

        {/* Paso 2 */}
        {modalStep === 2 && (
          <>
            <p className="text-gray-700 dark:text-gray-300">
              Antes de ingresar al planificador de exposiciones, ingrese el curso que desea planificar.
            </p>
            <div className="flex flex-col mt-4">
              <label className="text-sm mb-1">Curso</label>
              <input
                type="text"
                value={curso}
                disabled
                className="border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div className="flex flex-col mt-4">
              <label className="text-sm mb-1">Tipo de Exposición</label>
              <select
                value={tipoExposicion}
                onChange={(e) => setTipoExposicion(e.target.value)}
                className="border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
              >
                <option value="">Seleccione tipo</option>
                <option value="Final">Final</option>
                <option value="Parcial">Parcial</option>
              </select>
            </div>
            <div className="mt-6 flex justify-between">
              <button
                  onClick={prevStep}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                >
                Cancelar
              </button>
              <button
                onClick={nextStep}
                disabled={!tipoExposicion}
                className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
              >
                Continuar
              </button>
            </div>
          </>
        )}

        {/* Paso 3 */}
        {modalStep === 3 && (
  <>
    <p className="text-gray-700 dark:text-gray-300">
      Al ser la primera vez que se está planificando el curso en el periodo vigente, debe registrar las fechas y los rangos en que se realizarán las exposiciones.
    </p>

    {/* Curso y Tipo de Exposición */}
    <div className="flex flex-col mt-4">
      <label className="text-sm mb-1">Curso</label>
      <input
        type="text"
        value={curso}
        disabled
        className="border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
      />
    </div>
    <div className="flex flex-col mt-4">
      <label className="text-sm mb-1">Tipo de Exposición</label>
      <input
        type="text"
        value={tipoExposicion}
        disabled
        className="border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
      />
    </div>

   {/* Fechas dinámicas */}
{fechas.map((f, index) => (
  <div key={index} className="flex gap-4 mt-4">
    {/* Fecha de Exposición */}
    <div className="flex flex-col w-1/4">
      <label className="text-sm mb-1">Fecha de Exposición</label>
      <input
        type="date"
        value={f.fecha}
        onChange={(e) =>
          handleFechaChange(index, 'fecha', e.target.value)
        }
        className="border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
      />
    </div>

    {/* Hora Inicio */}
    <div className="flex flex-col w-1/4">
      <label className="text-sm mb-1">Hora Inicio</label>
      <input
        type="time"
        value={f.horaInicio}
        onChange={(e) =>
          handleFechaChange(index, 'horaInicio', e.target.value)
        }
        className="border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
      />
    </div>

    {/* Hora Fin */}
    <div className="flex flex-col w-1/4">
      <label className="text-sm mb-1">Hora Fin</label>
      <input
        type="time"
        value={f.horaFin}
        onChange={(e) =>
          handleFechaChange(index, 'horaFin', e.target.value)
        }
        className="border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
      />
    </div>

    {/* Salas Habilitadas */}
    <div className="flex flex-col w-1/4">
      <label className="text-sm mb-1">Salas Habilitadas</label>
      <select
        value={f.sala}
        onChange={(e) =>
          handleFechaChange(index, 'sala', e.target.value)
        }
        className="border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
      >
        <option value="">Seleccione sala</option>
        <option value="Sala A">Sala A</option>
        <option value="Sala B">Sala B</option>
      </select>
    </div>
  </div>
))}
    {/* Botón para agregar más filas */}
    <div className="mt-4">
      <button
        onClick={agregarFila}
        className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
      >
        + Agregar Fecha de Exposición
      </button>
    </div>

    {/* Botones finales */}
    <div className="mt-6 flex justify-between">
      <button
        onClick={prevStep}
        className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
      >
        Cancelar
      </button>
      <button
        onClick={handleAceptar}
        className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
      >
        Continuar
      </button>
    </div>
  </>
)}
      </DialogContent>
    </Dialog>
    </div>
  );
};

export default Page;
