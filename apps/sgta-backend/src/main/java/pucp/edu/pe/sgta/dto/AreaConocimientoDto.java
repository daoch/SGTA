package pucp.edu.pe.sgta.dto;

import lombok.*;

import java.time.OffsetDateTime;

import pucp.edu.pe.sgta.model.Carrera;
import pucp.edu.pe.sgta.model.SubAreaConocimiento;

import java.util.List;



@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AreaConocimientoDto {

	private Integer id;

	private String nombre;

	private String descripcion;

	private boolean activo = true;

	private OffsetDateTime fechaCreacion;

	private OffsetDateTime fechaModificacion;

	private Integer idCarrera;


}
