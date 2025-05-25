package pucp.edu.pe.sgta.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RevisionDocumentoDto {

	private Integer id;

	private Integer usuarioId;

	private Integer versionDocumentoId;

	private LocalDate fechaLimiteRevision;

	private LocalDate fechaRevision;

	private String estadoRevision;

	private String linkArchivoRevision;

	private boolean activo;

	private OffsetDateTime fechaCreacion;

	private OffsetDateTime fechaModificacion;

}