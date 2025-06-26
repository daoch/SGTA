package pucp.edu.pe.sgta.dto;
import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private Integer id;
    private TipoUsuarioDto tipoUsuario;
    private String codigoPucp;
    private String nombres;
    private String primerApellido;
    private String segundoApellido;
    private String correoElectronico;
    private List<String> roles;
    private Boolean activo;
}
