import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import TableJurados from './tableJurados'

const page = () => {

  const juradosData = [
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


  return (

    <div className="p-4">

      <h1 className="text-[24px] leading-[32px] font-semibold text-[#042354] tracking-[-0.144px] mb-4">
        Miembros de Jurado
      </h1>

      <div className="flex flex-wrap gap-2 items-center">
        {/* Input de búsqueda */}
        <Input
          placeholder="Ingrese el nombre, código o correo electrónico del usuario"
          className="flex w-[447px] h-[44px] px-3 py-2 items-center gap-2 border border-[#E2E6F0] rounded-none bg-background resize-none"
        />


        <Button
          className="inline-flex h-11 px-4 justify-center items-center gap-2 flex-shrink-0 rounded-md bg-[#042354] text-white"
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