package pucp.edu.pe.sgta.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Duration;
import java.math.BigDecimal;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "etapa_formativa")
public class EtapaFormativa extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "etapa_formativa_id")
    private Integer id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String nombre;

    @Column(name = "creditaje_por_tema", precision = 6, scale = 2)
    private BigDecimal creditajePorTema;

    @Column(name = "duracion_exposicion")
    private Duration duracionExposicion;

}
