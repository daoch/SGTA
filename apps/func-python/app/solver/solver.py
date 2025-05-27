from pulp import LpProblem, LpMinimize, LpVariable, LpBinary, lpSum, PULP_CBC_CMD
from collections import defaultdict


def run_solver(bloques_unificados:list,temas:list,usuarios:list):

    prob = LpProblem("Asignaciones de temas  a bloques",LpMinimize)

    # 1. Variables binarias x[tema, bloque]
    x = {
        (tema['id'], bloque['id']): LpVariable(f"x_{tema['id']}_{bloque['id']}", cat=LpBinary)
        for tema in temas
        for bloque in bloques_unificados       
    } 
  
    #4 un tema solo puede estar en un bloque
    for tema in temas:
        prob += lpSum(x[tema['id'], bloque['id']] for bloque in bloques_unificados) == 1, f"Tema_{tema['id']}_una_vez"  
    
    #5 un bloque solo puede tener hasta el len salas
    for bloque in bloques_unificados:
        prob += lpSum(x[tema['id'], bloque['id']] for tema in temas) <= bloque['capacidad'], f"Bloque_{bloque['id']}_solo_uno"

    for bloque in bloques_unificados:
        for i, tema1 in enumerate(temas):
            for j, tema2 in enumerate(temas):
                if i >= j:
                    continue
                usuarios_comunes = set(tema1['usuarios']) & set(tema2['usuarios'])
                if usuarios_comunes:
                    # No pueden asignarse ambos temas en el mismo bloque (aunque sean salas diferentes)
                    prob += x[tema1['id'], bloque['id']] + x[tema2['id'], bloque['id']] <= 1, \
                        f"NoUsuarioEnDosSalas_{tema1['id']}_{tema2['id']}_{bloque['id']}"
                 

   
    #prob += lpSum(fin_usuario[u['id']] - inicio_usuario[u['id']] for u in usuarios), "MinimizarDuracionTotal" 


    #print(prob)  
    prob += 0
    # Resolver
    solver = PULP_CBC_CMD(msg=False,timeLimit=10)
    prob.solve(solver)
 
   
   
    resultado = []
    for (tema_id, bloque_id), var in x.items():
        if var.varValue == 1:
            resultado.append({
                "tema_id": tema_id,
                "bloque_id": bloque_id
            })
    
   
    bloques_a_temas = defaultdict(list)
    for asignacion in resultado:
        bloques_a_temas[asignacion['bloque_id']].append(asignacion['tema_id'])

   
  
    return bloques_a_temas
