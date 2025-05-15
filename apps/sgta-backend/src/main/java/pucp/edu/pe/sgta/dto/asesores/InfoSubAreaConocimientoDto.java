package pucp.edu.pe.sgta.dto.asesores;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class InfoSubAreaConocimientoDto {
    private Integer idTema;
    private String nombre;
    private InfoAreaConocimientoDto AreaTematica;
}
