package pucp.edu.pe.sgta.dto;

//import jakarta.persistence.*;
import lombok.*;
import pucp.edu.pe.sgta.model.AreaConocimiento;

import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubAreaConocimientoDto {

	private Integer id;

	private AreaConocimientoDto areaConocimiento;

	private String nombre;

	private String descripcion;

	private boolean activo;

	private OffsetDateTime fechaCreacion;

	private OffsetDateTime fechaModificacion;

}
