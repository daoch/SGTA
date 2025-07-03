package pucp.edu.pe.sgta.dto;

import lombok.*;

import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RevisionDocumentoRevisorDto {
    private Integer id;
    private String titulo;
	private String entregable;
	private String estudiante;
	private String codigo;
	private String curso;
	private Double porcentajeSimilitud;
	private Double porcentajeGenIA;
	private OffsetDateTime fechaEntrega;
	private OffsetDateTime fechaLimiteEntrega;
	private OffsetDateTime fechaRevision;
	private OffsetDateTime fechaLimiteRevision;
	private String ultimoCiclo;
	private String estado; 
	private Boolean formatoValido;
	private Boolean citadoCorrecto;
	private String urlDescarga;
}
