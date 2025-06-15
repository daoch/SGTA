package pucp.edu.pe.sgta.dto.asesores;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InfoAreaConocimientoDto {
    private Integer idArea;
    private String nombre;

    public static InfoAreaConocimientoDto fromQuery(Object[] result){
        InfoAreaConocimientoDto dto = new InfoAreaConocimientoDto();
        dto.idArea = (Integer) result[0];
        dto.nombre = (String) result[1];
        return dto;
    }
}
