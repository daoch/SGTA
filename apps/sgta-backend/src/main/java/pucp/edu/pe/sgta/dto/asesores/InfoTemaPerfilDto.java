package pucp.edu.pe.sgta.dto.asesores;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class InfoTemaPerfilDto {
    private Integer idTesis;
    private String titulo;
    private String estudiantes;//Los estudiantes los saco aparte
    private String anio;//De finalizacion, puede ser null si está en progreso
    private String nivel;
    private String ciclo;
    private String estado;
    private Integer idProyecto;
    private String tituloProyecto;

    public static InfoTemaPerfilDto fromQuery(Object[] query){
        InfoTemaPerfilDto dto = new InfoTemaPerfilDto();
        dto.idTesis = (Integer) query[0];
        dto.titulo = (String) query[1];
        dto.anio = (String) query[2];
        dto.nivel = (String) query[3];
        dto.ciclo = (String) query[4];
        String estado = (String) query[5];
        estado = switch (estado) {
            case "EN_PROGRESO" -> "en_proceso";
            case "FINALIZADO" -> "finalizada";
            default -> null;
        };
        dto.estado = estado;
        dto.idProyecto = (Integer) query[6];
        dto.tituloProyecto = (String) query[7];
        return dto;
    }
}
