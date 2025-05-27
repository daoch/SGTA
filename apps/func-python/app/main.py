from fastapi import FastAPI
from .controller.asignacion_controller import asignar_temas_bloques
import uvicorn

app = FastAPI()

app.post("/asignar")(asignar_temas_bloques)


    #Para desarrollo
    #uvicorn.run(app, host="0.0.0.0", port=8000)
   
