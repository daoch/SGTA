package pucp.edu.pe.sgta.dto;

import lombok.*;
import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubAreaConocimientoDto {

	private Integer id;

	private String nombre;

	private String descripcion;

	private boolean activo = true;

	private OffsetDateTime fechaCreacion;

	private OffsetDateTime fechaModificacion;

	//private Integer idAreaConocimiento;

	AreaConocimientoDto areaConocimiento;
}
