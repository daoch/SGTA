package pucp.edu.pe.sgta.dto;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.List;

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

	@JsonIgnore
	private String contrasena;

	private String comentario;

    private String biografia;

	private String enlaceRepositorio;

	private String enlaceLinkedin;

	private String disponibilidad;

	private String tipoDisponibilidad;

	private TipoDedicacionDTO tipoDedicacion;

	private String rol;

	private Boolean activo;

	private Boolean rechazado; // we reject the application or proposal

	private Boolean creador; //he created the tema

	private OffsetDateTime fechaCreacion;

	private OffsetDateTime fechaModificacion;

	private Boolean asignado; // we need mapping on this for proposals and general tema management

	private Boolean esCoordinador; // if the user is a coordinator in the tema

	private List<SubAreaConocimientoDto> subareas;
}
