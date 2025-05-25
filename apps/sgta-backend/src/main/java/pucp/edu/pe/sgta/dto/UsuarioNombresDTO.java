package pucp.edu.pe.sgta.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioNombresDTO {

	private Integer id;

	private String nombres;

	private String primerApellido;

	private String segundoApellido;

}
