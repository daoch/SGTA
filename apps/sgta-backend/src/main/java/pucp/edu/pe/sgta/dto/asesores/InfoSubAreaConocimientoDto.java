package pucp.edu.pe.sgta.dto.asesores;

import lombok.Getter;
import lombok.Setter;

import java.util.Arrays;

@Getter @Setter
public class InfoSubAreaConocimientoDto {
    private Integer idTema;
    private String nombre;
    private InfoAreaConocimientoDto AreaTematica;

    public static InfoSubAreaConocimientoDto fromQuery(Object[] result){
        InfoSubAreaConocimientoDto dto = new InfoSubAreaConocimientoDto();
        dto.idTema = (Integer) result[0];
        dto.nombre = (String) result[1];
        Object[] subResult = Arrays.copyOfRange(result, 2, 3);
        InfoAreaConocimientoDto area = InfoAreaConocimientoDto.fromQuery(subResult);
        dto.AreaTematica = area;
        return dto;
    }
}
