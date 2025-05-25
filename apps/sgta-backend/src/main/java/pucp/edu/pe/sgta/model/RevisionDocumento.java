package pucp.edu.pe.sgta.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pucp.edu.pe.sgta.util.EstadoRevision;

import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "revision_documento")
public class RevisionDocumento {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "revision_documento_id")
	private Integer id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "usuario_id", foreignKey = @ForeignKey(name = "fk_revision_documento_usuario"))
	private Usuario usuario;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "version_documento_id", nullable = false,
			foreignKey = @ForeignKey(name = "fk_revision_documento_version_documento"))
	private VersionDocumento versionDocumento;

	@Column(name = "fecha_limite_revision")
	private LocalDate fechaLimiteRevision;

	@Column(name = "fecha_revision", nullable = false)
	private LocalDate fechaRevision;

	@Column(name = "estado_revision", nullable = false)
	private String estadoRevisionStr = "pendiente";

	@Transient
	private EstadoRevision estadoRevision;

	@Column(name = "link_archivo_revision")
	private String linkArchivoRevision;

	@Column(nullable = false)
	private Boolean activo = true;

	@Column(name = "fecha_creacion", nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
	private OffsetDateTime fechaCreacion;

	@Column(name = "fecha_modificacion", columnDefinition = "TIMESTAMP WITH TIME ZONE")
	private OffsetDateTime fechaModificacion;

	@PostLoad
	void fillTransient() {
		if (estadoRevisionStr != null) {
			try {
				this.estadoRevision = EstadoRevision.valueOf(estadoRevisionStr.toUpperCase());
			}
			catch (IllegalArgumentException e) {
				// Manejar el caso donde el valor en la base de datos no coincide con la
				// enumeración
				this.estadoRevision = EstadoRevision.PENDIENTE;
			}
		}
	}

	@PrePersist
	@PreUpdate
	void fillPersistent() {
		if (estadoRevision != null) {
			this.estadoRevisionStr = estadoRevision.name().toLowerCase();
		}
	}

	public EstadoRevision getEstadoRevision() {
		return this.estadoRevision;
	}

	public void setEstadoRevision(EstadoRevision estadoRevision) {
		this.estadoRevision = estadoRevision;
		if (estadoRevision != null) {
			this.estadoRevisionStr = estadoRevision.name().toLowerCase();
		}
	}

}