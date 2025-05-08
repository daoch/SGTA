export interface ParametroConfiguracion {
    id: number
    nombre: string
    descripcion: string
    moduloId: number
    activo: boolean
    tipoDato: "BOOLEANO" | "TEXTO" | "NUMERO" | "FECHA" | "LISTA"
}

export interface CarreraXParametroConfiguracionDto {
    id: number;
    valor: string | boolean | number | Date;
    carreraId: number;
    activo?: boolean;
    parametroConfiguracion: ParametroConfiguracion;
}

export interface CarreraXParametroConfiguracion {
    id: number;
    valor: string | boolean | number | Date;
    parametroConfiguracion: {
      id: number;
      nombre: string;
      descripcion: string;
      tipoDato: "BOOLEANO" | "TEXTO" | "NUMERO" | "FECHA" | "LISTA";
    };
  }