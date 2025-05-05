export  interface Jurado{
    code: string;
    name: string;
  }


export interface Exposicion {
    code: string;
    name: string;
    advisor : string;
    jurys: Jurado[];
  }
  

export interface AreaEspecialidad {
    name: string;
    
  }

  export interface Espacio{
    code : string;
    busy : boolean;
   
  }



  export interface Dispo{
    code : number;
    date : Date;
    startTime : string;
    endTime : string;
    spaces : Espacio[];
  }