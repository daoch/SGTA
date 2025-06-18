package pucp.edu.pe.sgta.dto.asesores;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class EnlaceUsuarioDto {
    private Integer id;
    private String plataforma;
    private String enlace;

    public static EnlaceUsuarioDto fromQuery(Object[] result) {
        EnlaceUsuarioDto dto = new EnlaceUsuarioDto();
        dto.id = (Integer) result[0];
        dto.plataforma = (String) result[1];
        dto.enlace = (String) result[2];
        return dto;
    }
}
