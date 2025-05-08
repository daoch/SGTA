const baseUrl = process.env.NEXT_PUBLIC_API_URL;


export  async function listarTemasCicloActulXEtapaFormativa(etapaFormativaId : number){
    try{
        const response = await fetch(`${baseUrl}/temas/listarTemasCicloActualXEtapaFormativa/${etapaFormativaId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }})
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            return data;
    }
    catch (error) {
        console.error('Error : fetching  data de temas por etapa formativa:', error);
        return [];
    }
  
        
}