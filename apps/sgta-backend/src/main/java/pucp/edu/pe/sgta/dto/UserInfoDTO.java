package pucp.edu.pe.sgta.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserInfoDTO {
    private Integer usuarioId;
    private String nombreCompleto;
    private String correoElectronico;
    private String tipoUsuario;
}
