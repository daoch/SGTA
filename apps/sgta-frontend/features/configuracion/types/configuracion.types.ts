import { CarreraXParametroConfiguracionDto } from "./CarreraXParametroConfiguracion.type";

export interface BackStore {
    // Parámetros de back
    parametros: CarreraXParametroConfiguracionDto[]
    parametrosOriginales: CarreraXParametroConfiguracionDto[]
    cargando: boolean
    error: string | null


    // Acciones
    setParametros: (parametros: CarreraXParametroConfiguracionDto[]) => void
    actualizarParametro: (id: number, valor: string | boolean | number | Date) => void


    // Funciones para llamadas al backend
    cargarParametros: () => Promise<void>
    guardarParametros: () => Promise<void>
}
