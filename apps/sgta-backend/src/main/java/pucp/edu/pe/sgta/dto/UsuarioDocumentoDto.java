package pucp.edu.pe.sgta.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.ZonedDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioDocumentoDto {

	private Integer id;

	private Integer usuarioId;

	private Integer documentoId;

	private String permiso;

	private boolean activo;

	private ZonedDateTime fechaCreacion;

	private ZonedDateTime fechaModificacion;

}