package pucp.edu.pe.sgta.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;
import pucp.edu.pe.sgta.model.EntregableXTema;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "version_documento")
public class VersionDocumento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "version_documento_id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "documento_id", foreignKey = @ForeignKey(name = "fk_version_documento_documento"))
    private Documento documento;

    // Falta RevisionDocumentoID

    @Column(name = "fecha_ultima_subida", nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private OffsetDateTime fechaUltimaSubida;

    @Column(name = "numero_version")
    private Integer numeroVersion;

    @Column(name = "link_archivo_subido", nullable = false)
    private String linkArchivoSubido;

    @Column(nullable = false)
    private Boolean activo = true;

    @Column(name = "fecha_creacion", nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private OffsetDateTime fechaCreacion;

    @Column(name = "fecha_modificacion", columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private OffsetDateTime fechaModificacion;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "entregable_x_tema_id", nullable = false, foreignKey = @ForeignKey(name = "fk_version_documento_entregable_x_tema"))
    private EntregableXTema entregableXTema;
    // agregare 3 columnas a version documento, porcentajeSimilitud , porcentajeIA , estadoProcesamiento
    @Column(name = "porcentaje_similitud")
    private Double porcentajeSimilitud = 0.0;
    @Column(name = "porcentaje_ia")
    private Double porcentajeIA = 0.0;
    @Column(name = "estado_procesamiento")
    private String estadoProcesamiento = "PENDING"; // PENDING, IN_PROGRESS, COMPLE
} 