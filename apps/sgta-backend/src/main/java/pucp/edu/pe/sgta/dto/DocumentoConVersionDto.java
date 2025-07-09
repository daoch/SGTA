package pucp.edu.pe.sgta.dto;

import lombok.*;

import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentoConVersionDto {
    private Integer documentoId;
    private String documentoNombre;
    private OffsetDateTime documentoFechaSubida;
    private String documentoLinkArchivo;
    private Integer entregableTemaId;
    private boolean documentoPrincipal;
}
