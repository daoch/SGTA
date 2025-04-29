"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import TableJurados from './tableJurados'

const page = () => {

  const juradosOriginal = [
    {
      user: { name: 'Juan Pérez', avatar: 'https://github.com/daoch.png' },
      code: '12345',
      email: 'juan.perez@mail.com',
      dedication: 'Tiempo Completo',
      assigned: '5',
      specialties: ['Desarrollo Web', 'Backend'],
      status: 'Activo'
    },
    {
      user: { name: 'Ana Gómez', avatar: 'https://github.com/daoch.png' },
      code: '67890',
      email: 'ana.gomez@mail.com',
      dedication: 'Medio Tiempo',
      assigned: '3',
      specialties: ['Front-End', 'UI/UX'],
      status: 'Inactivo'
    },
    // Agregar más jurados según sea necesario
  ]

  const [searchTerm, setSearchTerm] = useState('');
  const [juradosData, setJuradosData] = useState(juradosOriginal);

  const handleSearch = () => {
    const filtered = juradosOriginal.filter((jurado) =>
      jurado.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jurado.code.includes(searchTerm) ||
      jurado.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setJuradosData(filtered);
  };

  return (

    <div>
      <div className="flex h-[60px] pt-[15px] pr-[20px] pb-[10px] pl-[20px] items-center gap-[10px] self-stretch">
      <h1 className="text-[#042354] font-montserrat text-[24px] font-semibold leading-[32px] tracking-[-0.144px]">
        Miembros de Jurado
      </h1>
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        {/* Input de búsqueda */}
        <Input
          placeholder="Ingrese el nombre, código o correo electrónico del usuario"
          className="flex w-[447px] h-[44px] px-3 py-2 items-center gap-2 border border-[#E2E6F0] rounded-none bg-background resize-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch()
            }
          }}
        />


        <Button
          className="inline-flex h-11 px-4 justify-center items-center gap-2 flex-shrink-0 rounded-md bg-[#042354] text-white"
          onClick={handleSearch} // Llama a la función de búsqueda al hacer clic
        >
          Buscar
        </Button>
      

      {/* ComboBox 1 - Tipo de Dedicación */}
        <div className="flex flex-col w-[130px] h-[80px] items-start gap-[6px] flex-shrink-0">
          <label className="text-sm font-medium">Tipo de Dedicación</label>
          <Select>
            <SelectTrigger className="h-[80px] w-full border border-[#E2E6F0] rounded-md !important">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="tiempo-completo">Tiempo Completo</SelectItem>
              <SelectItem value="medio-tiempo">Medio Tiempo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ComboBox 2 - Área de Especialidad */}
        <div className="flex flex-col w-[148px] h-[80px] items-start gap-[6px] flex-shrink-0">
          <label className="text-sm font-medium">Área de Especialidad</label>
          <Select>
            <SelectTrigger className="h-[68px] w-full">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="ciencias-computacion">Ciencias de la Computacion</SelectItem>
              <SelectItem value="desarrollo-software">Desarrollo de Software</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ComboBox 3 - Estado */}
        <div className="flex flex-col w-[107px] h-[80px] items-start gap-[6px] flex-shrink-0">
          <label className="text-sm font-medium">Estado</label>
          <Select>
            <SelectTrigger className="h-[68px] w-full">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="activo">Activo</SelectItem>
              <SelectItem value="inactivo">Inactivo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Botón de Crear Jurado */}
        <Button
          className="inline-flex h-11 px-4 justify-center items-center gap-2 flex-shrink-0 rounded-md bg-[#042354] text-white"
        >
          + Nuevo Jurado
        </Button>
        </div>
      

        {/* Llamada al componente de Tabla */}
        <TableJurados juradosData={juradosData} />
        

    </div>
  )
}

export default page