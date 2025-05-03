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
  onSelect?: (tesis: Tesis) => void
  selected?: Tesis | null
}

export const ListaTesisJuradoCard: React.FC<ListaTesisJuradoCardProps> =({
  data,
  onSelect,
  selected
}) => {
  const isSelected = (tesis: Tesis) => {
    return selected?.codigo === tesis.codigo
  }


  return (
    <div className="space-y-4 mt-4">
      
      {data.map((tesis, index) => {
        const selectedCard = isSelected(tesis)
        
        return(
        <div
          key={index}
          onClick={() => onSelect?.(tesis)}
          className={`border rounded-lg p-4 shadow-sm space-y-2 cursor-pointer transition-all ${
            isSelected(tesis)
              ? 'bg-[#042354] border-[#042354] text-white'
              : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-bold text-sm ">
                ({tesis.codigo}) {tesis.titulo}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {tesis.codEstudiante} - {tesis.estudiante}
              </p>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full ${
                  selectedCard ? 'bg-white text-[#042354]' : 'bg-[#001F66] text-white'
                }`}
              >
              {tesis.rol}
            </span>
          </div>

          <p className="text-sm text-justify ">{tesis.resumen}</p>

          <div className="flex gap-2 flex-wrap mt-2">
            {tesis.especialidades.map((esp, idx) => (
              <span
                key={idx}
                className={`text-xs font-medium px-3 py-1 rounded-full ${
                  selectedCard
                    ? 'bg-white text-[#042354]'
                    : 'bg-[#E5F0FF] text-[#042354]'
                }`}
              >
                {esp}
              </span>
            ))}
          </div>
        </div>
        )
      })}
    </div>
  )
}