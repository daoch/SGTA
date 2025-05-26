from ..data.transformar_data import  separar_temas_usuarios,formatear_bloques,unificar_bloques,generar_asignaciones_finales
from ..solver.solver import run_solver
from pprint import pprint
def asignar_temas_bloques_service(bloques:list,temas:list):       
    
   
    temas,usuarios = separar_temas_usuarios(temas)
    bloques = formatear_bloques(bloques)        
    bloques_unificados = unificar_bloques(bloques)  
    #pprint(bloques_unificados)
    asignaciones = run_solver(bloques_unificados,temas,usuarios)
    #pprint(asignaciones)
    resultado = generar_asignaciones_finales(asignaciones,bloques_unificados)
    #pprint(resultado)
    
    
    return resultado
