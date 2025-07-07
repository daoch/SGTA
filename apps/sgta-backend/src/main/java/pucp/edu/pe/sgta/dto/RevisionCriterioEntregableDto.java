package pucp.edu.pe.sgta.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RevisionCriterioEntregableDto {
    private Integer entregableXTemaId;
    private Integer criterioEntregableId;
    private Integer usuarioId;
    private String nombreCompletoUsuario;
    private Integer revisionDocumentoId;
    private Double nota;
    private String observacion;
    private Integer entregableId;
    private String nombreCriterio;
    private Double notaMaxima;
    private String descripcionCriterio;
}