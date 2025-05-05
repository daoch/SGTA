package pucp.edu.pe.sgta.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "etregable")

public class Entregable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "entregable_id")
    private Integer id;

    @Column(length = 150)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "fecha_inicio", nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private OffsetDateTime fechaInicio;

    @Column(name = "fecha_fin", nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private OffsetDateTime fechaFin;

    @Column(name = "es_evaluable", nullable = false)
    private boolean esEvaluable = true;

}
