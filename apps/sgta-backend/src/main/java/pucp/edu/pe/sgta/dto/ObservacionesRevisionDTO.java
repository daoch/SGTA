package pucp.edu.pe.sgta.dto;
import lombok.*;
import java.time.OffsetDateTime;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ObservacionesRevisionDTO {
    private Integer observacionId;
    private Integer revisionId;
    private Integer usuarioCreacionId;
    private Integer numeroPaginaInicio;
    private Integer numeroPaginaFin;
    private Integer tipoObservacionId;
    private String comentario;
    private Boolean esAutomatico;
    private Boolean activo;
    private Double boundingX1;
    private Double boundingY1;
    private Double boundingX2;
    private Double boundingY2;
    private Double boundingWidth;
    private Double boundingHeight;
    private Integer boundingPage;
    private String contenido;
    private OffsetDateTime fechaCreacion;
}
