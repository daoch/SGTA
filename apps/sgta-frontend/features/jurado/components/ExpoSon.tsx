import { Exposicion } from "@/features/jurado/types/jurado.types";


interface Props{
    expoFind : Exposicion;
    removeExpo: (expo: Exposicion) => void; 
};

const ExpoSon: React.FC<Props> = ({ expoFind,removeExpo}: Props)=> {

    const handleClick = () => {
      
        if(expoFind){
          removeExpo(expoFind);
        }
       
    
      };

    return(
        <div           
            style={{ 
                backgroundColor: "#FFDFBD",
                height: "60px",
                border:"0px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
             }}
             onClick={handleClick}  
        >
        {expoFind.code}
        </div>
    );

};

export default ExpoSon;