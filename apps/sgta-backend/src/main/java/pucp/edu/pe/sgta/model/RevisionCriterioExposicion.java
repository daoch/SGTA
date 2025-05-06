package pucp.edu.pe.sgta.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "revision_criterio_x_exposicion")
public class RevisionCriterioExposicion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "revision_criterio_x_exposicion_id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "exposicion_x_tema_id", nullable = false, foreignKey = @ForeignKey(name = "fk_rcxe_exposicion_x_tema"))
    private ExposicionXTema exposicionXTema;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "criterio_exposicion_id", nullable = false, foreignKey = @ForeignKey(name = "fk_rcxe_criterio_exposicion"))
    private CriterioExposicion criterioExposicion;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false, foreignKey = @ForeignKey(name = "fk_rcxe_usuario"))
    private Usuario usuario;

    @Column(precision = 5, scale = 2)
    private BigDecimal nota;

    @Column(nullable = false)
    private boolean revisado = false;

    @Column(columnDefinition = "TEXT")
    private String observacion;

    @Column(nullable = false)
    private boolean activo = true;

    @Column(name = "fecha_creacion", nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private OffsetDateTime fechaCreacion;

    @Column(name = "fecha_modificacion", columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private OffsetDateTime fechaModificacion;
}
