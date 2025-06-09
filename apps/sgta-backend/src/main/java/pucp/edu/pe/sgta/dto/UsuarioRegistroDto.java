package pucp.edu.pe.sgta.dto;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioRegistroDto {
    private String codigoPucp;
    private String nombres;
    private String primerApellido;
    private String segundoApellido;
    private String correoElectronico;
    private String tipoUsuarioNombre;
    private Integer tipoDedicacionId;
    private List<CarreraAsignadaDto> carreras;
    private List<Integer> rolesIds; //si es profesor, estos serán los roles que tendrá

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CarreraAsignadaDto {
        private Integer carreraId;
        private Boolean esCoordinador;
    }
}