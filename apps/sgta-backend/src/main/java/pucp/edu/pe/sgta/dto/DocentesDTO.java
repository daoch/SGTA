package pucp.edu.pe.sgta.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
@Builder
public class DocentesDTO {
    private Integer id;
    private String nombres;
    private String primerApellido;
    private String segundoApellido;
    private String codigoPucp;
    private String correoElectronico;
    private String tipoDedicacion;
    private Long cantTemasAsignados;
    private List<Integer> areasConocimientoIds;
}
