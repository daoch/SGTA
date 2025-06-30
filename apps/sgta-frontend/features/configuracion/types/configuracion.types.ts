import { CarreraXParametroConfiguracionDto } from "./CarreraXParametroConfiguracion.type";

export interface BackStore {
    // Parámetros de back
    parametros: CarreraXParametroConfiguracionDto[]
    parametrosOriginales: CarreraXParametroConfiguracionDto[]
    cargando: boolean
    error: string | null
    etapaFormativaSeleccionada: number | null

    // Acciones
    setParametros: (parametros: CarreraXParametroConfiguracionDto[]) => void
    actualizarParametro: (id: number, valor: string | boolean | number | Date) => void
    setEtapaFormativaSeleccionada: (etapaFormativaId: number | null) => void

    // Funciones para llamadas al backend
    cargarParametros: (carreraId: number) => Promise<void>
    cargarParametrosPorEtapaFormativa: (etapaFormativaId: number | null) => Promise<void>
    guardarParametros: () => Promise<void>
}
