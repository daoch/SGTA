package pucp.edu.pe.sgta.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CicloDto {

	private Integer id;

	private String semestre;

	private Integer anio;

	private LocalDate fechaInicio;

	private LocalDate fechaFin;

	private Boolean activo;

	private OffsetDateTime fechaCreacion;

	private OffsetDateTime fechaModificacion;

}