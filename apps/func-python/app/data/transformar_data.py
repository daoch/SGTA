from datetime import datetime,timedelta
from collections import defaultdict

def separar_temas_usuarios(temas :list):
    temas_resultado = []
    usuarios_set = set()

    for tema in temas:
        tema_usuarios_ids = []
        for u in tema["usuarios"]:
            id_usuario = u["idUsario"]
            tema_usuarios_ids.append(id_usuario)
            usuarios_set.add(id_usuario)
        temas_resultado.append({
            "id": tema["id"],
            "codigo": tema["codigo"],
            "usuarios": tema_usuarios_ids
        })

    usuarios_resultado = [{"idUsario": uid} for uid in usuarios_set]
    
    return temas_resultado,usuarios_resultado

def formatear_bloques(bloques:list):
    bloques_formateados = []

    for bloque in bloques:
        partes_key = bloque['key'].split('|')
        fecha_str = partes_key[0]
        sala = partes_key[2]

        hora_inicio, hora_fin = bloque['range'].split('-')
        fecha_ini = datetime.strptime(f"{fecha_str} {hora_inicio}", "%Y-%m-%d %H:%M")
        fecha_fin = datetime.strptime(f"{fecha_str} {hora_fin}", "%Y-%m-%d %H:%M")

        bloque_formateado = {
            'idBloque': bloque['idBloque'],
            'fecha_ini': fecha_ini,
            'fecha_fin': fecha_fin,
            'sala': sala,
            'esBloqueReservado': bloque['esBloqueReservado'],
            'esBloqueBloqueado': bloque['esBloqueBloqueado']
        }

        bloques_formateados.append(bloque_formateado)

    return bloques_formateados

def unificar_bloques(bloques:list):
    
    agrupados = defaultdict(lambda: {"salas": [], "ids": []})
    for bloque in bloques:
        if bloque.get("esBloqueBloqueado") or bloque.get("esBloqueReservado"):
            continue
        key = (bloque["fecha_ini"], bloque["fecha_fin"])
        agrupados[key]["salas"].append(bloque["sala"])
        agrupados[key]["ids"].append(bloque["idBloque"])  

    bloques_unificados = []
    for i, ((fecha_ini, fecha_fin), data) in enumerate(agrupados.items(), start=1):
        fecha_ini_ajustada = fecha_ini
        fecha_fin_ajustada = fecha_fin

        bloques_unificados.append({
            "id": f"B{i}",
            "fecha_ini": fecha_ini_ajustada.isoformat() if hasattr(fecha_ini_ajustada, 'isoformat') else fecha_ini_ajustada,
            "fecha_fin": fecha_fin_ajustada.isoformat() if hasattr(fecha_fin_ajustada, 'isoformat') else fecha_fin_ajustada,
            "capacidad": len(data["salas"]),
            "salas": data["salas"],
            "ids": data["ids"]  
        })

    return bloques_unificados

def generar_asignaciones_finales(asignaciones, bloques_unificados):
  
    mapa_bloques = {bloque["id"]: bloque["ids"] for bloque in bloques_unificados}
    
    resultado = []

    for bloque_id, temas in asignaciones.items():
        ids_bloques = mapa_bloques.get(bloque_id, [])
        
       
        if len(temas) > len(ids_bloques):
            raise ValueError(f"No hay suficientes bloques para asignar todos los temas en {bloque_id}")

        for tema, idBloque in zip(temas, ids_bloques):
            resultado.append({
                "idBloque": idBloque,
                "tema": tema
            })

    return resultado



    
  
