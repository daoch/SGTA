from fastapi import Request
from ..service.asignacion_service import asignar_temas_bloques_service

async def asignar_temas_bloques(request: Request):
    data = await request.json()
    bloques = data.get('bloques')       
    temas = data.get('temas') 
    #print(temas)

    return asignar_temas_bloques_service(bloques,temas)
    
    
