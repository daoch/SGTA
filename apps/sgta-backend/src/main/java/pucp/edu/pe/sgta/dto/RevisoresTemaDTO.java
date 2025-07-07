package pucp.edu.pe.sgta.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RevisoresTemaDTO {
    private Integer usuarioId;
    private String nombres;
    private String primerApellido;
    private String segundoApellido;
    private Integer rolId;
    private Integer temaId;
}
