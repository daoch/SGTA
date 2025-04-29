'use client'

import React from 'react'
import { ArrowRight } from 'lucide-react'

interface Tesis {
  titulo: string
  codigo: string
  estudiante: string
  codEstudiante: string
  resumen: string
  especialidades: string[]
  rol: string
}

interface ListaTesisJuradoCardProps {
  data: Tesis[]
}

export const ListaTesisJuradoCard: React.FC<ListaTesisJuradoCardProps> = ({ data }) => {
  return (
    <div className="space-y-4 mt-4">
      {data.map((tesis, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white space-y-2"
        >
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-bold text-sm text-[#042354]">
                ({tesis.codigo}) {tesis.titulo}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {tesis.codEstudiante} - {tesis.estudiante}
              </p>
            </div>
            <span className="bg-[#001F66] text-white text-xs px-3 py-1 rounded-full">
              {tesis.rol}
            </span>
          </div>

          <p className="text-sm text-justify text-gray-700">{tesis.resumen}</p>

          <div className="flex gap-2 flex-wrap mt-2">
            {tesis.especialidades.map((esp, idx) => (
              <span
                key={idx}
                className="bg-[#E5F0FF] text-[#042354] text-xs font-medium px-3 py-1 rounded-full"
              >
                {esp}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}