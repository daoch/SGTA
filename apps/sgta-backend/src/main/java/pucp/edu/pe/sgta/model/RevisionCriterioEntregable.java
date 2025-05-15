package pucp.edu.pe.sgta.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
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
@Table(name = "revision_criterio_entregable")
public class RevisionCriterioEntregable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "revision_criterio_entregable_id")
    private Integer revisionCriterioEntregableId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entregable_x_tema_id", foreignKey = @ForeignKey(name = "fk_revision_criterio_entregable_x_tema"))
    private EntregableXTema entregableXTema;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "criterio_entregable_id", foreignKey = @ForeignKey(name = "fk_revision_criterio_criterio"))
    private CriterioEntregable criterioEntregable;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", foreignKey = @ForeignKey(name = "fk_revision_criterio_usuario"))
    private Usuario usuario;

    @DecimalMin(value = "0.0", message = "La nota no puede ser negativa")
    @Column(name = "nota", precision = 5, scale = 2)
    private BigDecimal nota;

    @Column(name = "observacion", columnDefinition = "TEXT")
    private String observacion;

    @Column(name = "activo", nullable = false)
    private Boolean activo = true;

    @Column(name = "fecha_creacion", nullable = false, updatable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private OffsetDateTime fechaCreacion = OffsetDateTime.now();

    @Column(name = "fecha_modificacion", columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private OffsetDateTime fechaModificacion;
} 