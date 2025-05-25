package pucp.edu.pe.sgta.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "version_documento")
public class VersionXDocumento {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "version_documento_id")
	private Integer id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "documento_id", nullable = false)
	private Documento documento;

	@Column(name = "revision_documento_id")
	private Integer revisionDocumentoId;

	@Column(name = "fecha_ultima_subida", nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
	private OffsetDateTime fechaUltimaSubida;

	@Column(name = "numero_version")
	private Integer numeroVersion;

	@Column(name = "link_archivo_subido", columnDefinition = "TEXT", nullable = false)
	private String linkArchivoSubido;

	@Column(nullable = false)
	private boolean activo = true;

	@Column(name = "fecha_creacion", nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
	private OffsetDateTime fechaCreacion;

	@Column(name = "fecha_modificacion", columnDefinition = "TIMESTAMP WITH TIME ZONE")
	private OffsetDateTime fechaModificacion;

}