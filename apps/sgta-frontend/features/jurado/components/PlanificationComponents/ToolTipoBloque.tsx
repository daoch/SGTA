import { Tema } from "../../types/jurado.types";

interface Props {
  expoFind: Tema;
  
}

export default function ToolTipoBloque({expoFind}:Props){

  

    const asesor = {
        nombre : "Edwin Villanueva"
    };

 


    
    return(
        <div className="bg-gray-200 w-72 p-6 text-black  rounded-2xl border-gray-400 border-2 leading-7"  >

            <div>
                <section>
                    <strong> Estado planificacion: </strong>
                    <div className="flex flex-row ml-4">
                    <div
                        className={`w-3 h-3 rounded-full mt-1
                            ${"bg-green-300" }`}
                        >                            
                    </div>
                    <p className="ml-1">Programada</p>
                    </div>
                 
                </section>
                <div className="flex flex-col">
                    <strong>Codigo : </strong>
                    <p className="ml-4">{expoFind.codigo}</p>
                    <strong>Titulo : </strong>                    
                    <p className="ml-4 leading-6"> {expoFind.titulo}</p>
                </div>
                <div className="flex flex-col">
                   
                       <strong>Jurados</strong>
                   
                    <ul>
                        {expoFind?.jurados?.map(j=>(
                            <li className="ml-4" key={j?.name}>• {j?.name}</li>
                        ))}
                    </ul>                    
                    <div className="flex flex-col">
                        <strong>Asesor</strong>
                        <p className="ml-4">{asesor.nombre}</p>
                    </div>
                </div>
            </div>
            
        </div>
    );
   
}