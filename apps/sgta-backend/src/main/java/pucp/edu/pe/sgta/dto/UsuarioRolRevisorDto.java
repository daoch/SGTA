package pucp.edu.pe.sgta.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioRolRevisorDto {
    private Integer id;
    private Integer usuarioId;
    private String codigoPucp;
    private String nombres;
    private String primerApellido;
    private String segundoApellido;
    private String correoElectronico;
    private Integer rolId;
    private String rolNombre;
    private Integer carreraId;
    private String carreraNombre;
    private Integer etapaFormativaXCicloId;
}
