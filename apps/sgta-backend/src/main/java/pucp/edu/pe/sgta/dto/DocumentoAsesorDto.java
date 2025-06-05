package pucp.edu.pe.sgta.dto;

import lombok.*;

import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentoAsesorDto {
    private Integer id;
    private String titulo;
	private String entregable;
	private String estudiante;
	private String codigo;
	private String curso;
	private Integer porcentajeSimilitud;
	private Integer porcentajeGenIA;
	private OffsetDateTime fechaEntrega;
	private Boolean entregaATiempo;
    private OffsetDateTime fechaLimite;
	private String ultimoCiclo;
	private String estado; 
}
