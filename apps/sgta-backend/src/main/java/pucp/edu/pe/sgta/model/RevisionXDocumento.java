package pucp.edu.pe.sgta.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "revision_documento")
public class RevisionXDocumento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "revision_documento_id")
    private Integer id;

    @Column(name = "usuario_id")
    private Integer usuarioId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "version_documento_id", nullable = false)
    private VersionXDocumento versionDocumento;

    @Column(name = "fecha_limite_revision")
    private LocalDate fechaLimiteRevision;

    @Column(name = "fecha_revision", nullable = false)
    private LocalDate fechaRevision;

    @Column(name = "estado_revision", nullable = false,
            columnDefinition = "enum_estado_revision")
    private String estadoRevision;

    @Column(name = "link_archivo_revision", columnDefinition = "TEXT")
    private String linkArchivoRevision;

    @Column(nullable = false)
    private boolean activo = true;

    @Column(name = "fecha_creacion", nullable = false,
            columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private OffsetDateTime fechaCreacion;

    @Column(name = "fecha_modificacion",
            columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private OffsetDateTime fechaModificacion;
        @OneToMany(mappedBy = "revisionDocumento", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Observacion> observaciones = new ArrayList<>();
}