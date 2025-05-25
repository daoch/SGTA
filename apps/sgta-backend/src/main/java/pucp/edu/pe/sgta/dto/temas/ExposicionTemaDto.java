package pucp.edu.pe.sgta.dto.temas;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExposicionTemaDto {

	private Integer id;

	private String nombre;

	private String estadoExposicion;

	private OffsetDateTime datetimeInicio;

	private OffsetDateTime datetimeFin;

	private String salaExposicion;

}
