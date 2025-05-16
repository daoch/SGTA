import { Tema } from "../../types/jurado.types";

interface Props {
  expoFind: Tema;
  
}

export default function ToolTipoBloque({expoFind}:Props){

  
    console.log(expoFind);    
     const roles = expoFind?.usuarios?.filter(u => u.rol?.nombre === "Jurado");
     console.log({roles});    
    return(
        <div className="z-40 bg-gray-200 w-72 p-6 text-black  rounded-2xl border-gray-400 border-2 leading-7"  >

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
                    {expoFind?.usuarios
                    ?.filter(u => u.rol?.nombre === "Jurado")
                    .map(j => (
                        <li className="ml-4" key={j.idUsario}>
                         {j.nombres} {j.apellidos}
                        </li>
                        ))}
                    </ul>                    
                    <div className="flex flex-col">
                        <strong>Asesor</strong>
                        {expoFind?.usuarios
                        ?.filter(u => u.rol?.nombre === "Asesor")
                        .map(a => (
                            <p className="ml-4" key={a.idUsario}>
                            {a.nombres} {a.apellidos}
                            </p>
                        ))}
                    </div>
                </div>
            </div>
            
        </div>
    );
   
}