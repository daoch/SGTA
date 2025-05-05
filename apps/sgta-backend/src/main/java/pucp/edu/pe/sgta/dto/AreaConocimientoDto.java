package pucp.edu.pe.sgta.dto;

import lombok.*;

import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AreaConocimientoDto {

	private Integer id;

	private String nombre;

	private String descripcion;

	private boolean activo;

	private OffsetDateTime fechaCreacion;

	private OffsetDateTime fechaModificacion;

}
