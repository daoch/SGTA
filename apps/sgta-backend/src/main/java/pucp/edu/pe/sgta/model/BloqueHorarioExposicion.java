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
@Table(name = "bloque_horario_exposicion")
public class BloqueHorarioExposicion {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "bloque_horario_exposicion_id")
        private Integer id;

        @ManyToOne(fetch = FetchType.LAZY, optional = false)
        @JoinColumn(name = "jornada_exposicion_x_sala_id", nullable = false, foreignKey = @ForeignKey(name = "fk_bhe_jornada_exposicion_x_sala"))
        private JornadaExposicionXSalaExposicion jornadaExposicionXSala;

        @Column(name = "es_bloque_reservado", nullable = false)
        private boolean esBloqueReservado = false;

        @Column(name = "es_bloque_bloqueado", nullable = false)
        private boolean esBloqueBloqueado = false;

        @Column(name = "datetime_inicio", nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
        private OffsetDateTime datetimeInicio;

        @Column(name = "datetime_fin", nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
        private OffsetDateTime datetimeFin;

        @Column(nullable = false)
        private Boolean activo = true;

        @Column(name = "fecha_creacion", nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
        private OffsetDateTime fechaCreacion;

        @Column(name = "fecha_modificacion", columnDefinition = "TIMESTAMP WITH TIME ZONE")
        private OffsetDateTime fechaModificacion;
}
