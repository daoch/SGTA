package pucp.edu.pe.sgta.dto;

import lombok.*;

import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioDto {

	private Integer id;

	private TipoUsuarioDto tipoUsuario;

	private String codigoPucp;

	private String nombres;

	private String primerApellido;

	private String segundoApellido;

	private String correoElectronico;

	private String nivelEstudios;

	private String contrasena;

    private String biografia;

    private String enlaceRepositorio;

    private String enlaceLinkedin;

	private String disponibilidad;

	private String tipoDisponibilidad;

	private boolean activo;

	private OffsetDateTime fechaCreacion;

	private OffsetDateTime fechaModificacion;

}
