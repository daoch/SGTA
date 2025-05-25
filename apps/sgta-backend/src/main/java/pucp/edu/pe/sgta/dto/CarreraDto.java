package pucp.edu.pe.sgta.dto;

import lombok.*;
import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CarreraDto {

	private Integer id;

	private Integer unidadAcademicaId;

	private String codigo;

	private String nombre;

	private String descripcion;

	private Boolean activo;

	private OffsetDateTime fechaCreacion;

	private OffsetDateTime fechaModificacion;

}
