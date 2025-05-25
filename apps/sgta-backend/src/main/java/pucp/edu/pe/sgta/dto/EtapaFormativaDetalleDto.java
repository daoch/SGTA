package pucp.edu.pe.sgta.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.Duration;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EtapaFormativaDetalleDto {

	private Integer id;

	private String nombre;

	private String carreraNombre;

	private Integer carreraId;

	private BigDecimal creditajePorTema;

	private Duration duracionExposicion;

	private Boolean activo;

	private String cicloActual;

	private String estadoActual;

	// Historial de ciclos
	private List<CicloHistorialDto> historialCiclos;

	@Getter
	@Setter
	@NoArgsConstructor
	@AllArgsConstructor
	@Builder
	public static class CicloHistorialDto {

		private Integer id;

		private String ciclo;

		private String estado;

	}

}