package pucp.edu.pe.sgta.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pucp.edu.pe.sgta.model.Documento;

import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VersionDocumentoDto {
    private Integer id;
    private Documento documento;
    private Integer revisionDocumentoId;
    private OffsetDateTime fechaUltimaSubida;
    private Integer numeroVersion;
    private String linkArchivoSubido;
    private boolean activo;
    private OffsetDateTime fechaCreacion;
    private OffsetDateTime fechaModificacion;
}