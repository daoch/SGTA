from fastapi import Request
from ..service.asignacion_service import asignar_temas_bloques_service
from pprint import pprint
from fastapi.responses import JSONResponse
async def asignar_temas_bloques(request: Request):
    try:
        data = await request.json()
        bloques = data.get("bloques")
        temas = data.get("temas")
       
        for tema in temas:
            tema.pop("areasConocimiento", None)



        # Llama al servicio
        resultado = asignar_temas_bloques_service(bloques, temas)

        #return resultado
        return resultado

    except Exception as e:
        print("❌ Error interno:", str(e))
        return JSONResponse(status_code=500, content={"detail": str(e)})
    
    
