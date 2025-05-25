package pucp.edu.pe.sgta.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pucp.edu.pe.sgta.util.EstadoExposicionUsuario;

import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ControlExposicionUsuarioTemaDto {

	private Integer id;

	private Integer exposicionXTemaId;

	private Integer usuarioId;

	private String observacionesFinalesExposicion;

	private boolean asistio;

	private boolean activo;

	private OffsetDateTime fechaCreacion;

	private OffsetDateTime fechaModificacion;

	private EstadoExposicionUsuario estadoExposicion;

}
