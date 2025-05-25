package pucp.edu.pe.sgta.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pucp.edu.pe.sgta.util.EstadoExposicion;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExposicionXTemaDto {

	private Integer id;

	private Integer exposicionId;

	private Integer temaId;

	private String linkExposicion;

	private String linkGrabacion;

	private EstadoExposicion estadoExposicion;

	private BigDecimal notaFinal;

	private Boolean activo;

	private OffsetDateTime fechaCreacion;

	private OffsetDateTime fechaModificacion;

}
