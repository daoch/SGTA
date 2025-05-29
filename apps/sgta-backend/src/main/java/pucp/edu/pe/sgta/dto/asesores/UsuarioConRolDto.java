package pucp.edu.pe.sgta.dto.asesores;

import lombok.*;
import pucp.edu.pe.sgta.dto.UsuarioDto;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioConRolDto {
	private UsuarioDto usuario;   // Composición, no herencia
	private String rolesConcat;
	private Integer tesisCount;
}
