package pucp.edu.pe.sgta.dto.asesores;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class InfoProyectoDto {
    Integer idProyecto;
    String nombre;
    Integer participantes;
    String anioInicio;
    String anioFin;
    String estado;

    public static InfoProyectoDto fromListarProyectosUsuarioInvolucrado(Object[] queryResult) {
        InfoProyectoDto dto = new InfoProyectoDto();
        dto.idProyecto = (int)queryResult[0];
        dto.nombre = (String)queryResult[1];
        dto.anioInicio = (String)queryResult[2];
        dto.estado = "en_proceso";
        //dto.estado = (String)queryResult[3];
        dto.participantes = (int)queryResult[4];
        dto.anioFin = null;
        return dto;
    }
}
