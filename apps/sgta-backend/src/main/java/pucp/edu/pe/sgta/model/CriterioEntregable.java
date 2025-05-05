package pucp.edu.pe.sgta.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "criterio_entregable")

public class CriterioEntregable extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "criterio_entregable_id")
    private Integer id;

    @Column(length = 100, nullable = false)
    private String nombre;

    @Column(name = "nota_maxima", precision = 6, scale = 2)
    private BigDecimal notaMaxima;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

}
