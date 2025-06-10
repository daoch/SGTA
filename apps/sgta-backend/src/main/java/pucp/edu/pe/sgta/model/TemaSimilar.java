package pucp.edu.pe.sgta.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

/**
 * Entidad que representa relaciones de similitud entre temas,
 * con clave primaria surrogate y porcentaje de similitud.
 */
@Entity
@Table(name = "tema_similar")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TemaSimilar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tema_similar_id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "tema_id", nullable = false, foreignKey = @ForeignKey(name = "fk_ts_tema"))
    private Tema tema;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "tema_relacion_id", nullable = false, foreignKey = @ForeignKey(name = "fk_ts_tema_relacion"))
    private Tema temaRelacion;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false,
        foreignKey = @ForeignKey(name = "fk_ts_usuario"))
    private Usuario usuario;

    @Column(name = "porcentaje_similitud", precision = 5, scale = 2, nullable = false)
    private BigDecimal porcentajeSimilitud;

    @Column(nullable = false)
    private Boolean activo = true;

    @Column(name = "fecha_creacion", nullable = false, insertable = false,
            columnDefinition = "TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP")
    private OffsetDateTime fechaCreacion;

    @Column(name = "fecha_modificacion", insertable = false,
            columnDefinition = "TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP")
    private OffsetDateTime fechaModificacion;
}
