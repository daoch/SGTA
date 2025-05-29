package pucp.edu.pe.sgta.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pucp.edu.pe.sgta.util.EstadoExposicion;
import pucp.edu.pe.sgta.util.EstadoExposicionConverter;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "exposicion_x_tema")
public class ExposicionXTema {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "exposicion_x_tema_id")
        private Integer id;

        @ManyToOne(fetch = FetchType.LAZY, optional = false)
        @JoinColumn(name = "exposicion_id", nullable = false, foreignKey = @ForeignKey(name = "fk_ext_exposicion"))
        private Exposicion exposicion;

        @ManyToOne(fetch = FetchType.LAZY, optional = false)
        @JoinColumn(name = "tema_id", nullable = false, foreignKey = @ForeignKey(name = "fk_ext_tema"))
        private Tema tema;

        //@OneToOne(fetch = FetchType.LAZY)
        //@JoinColumn(name = "bloque_horario_exposicion_id", foreignKey = @ForeignKey(name = "fk_ext_bloque_horario"))
        //private BloqueHorarioExposicion bloqueHorarioExposicion;

        @Column(name = "link_exposicion")
        private String linkExposicion;

        @Column(name = "link_grabacion")
        private String linkGrabacion;

        //@Enumerated(EnumType.STRING)
        @Column(name = "estado_exposicion", nullable = false)
        @Convert(converter = EstadoExposicionConverter.class)
        private EstadoExposicion estadoExposicion = EstadoExposicion.SIN_PROGRAMAR;

        @Column(name = "nota_final", precision = 6, scale = 2)
        private BigDecimal notaFinal;

        @Column(name = "activo", nullable = false)
        private Boolean activo = true;

        @Column(name = "fecha_creacion", nullable = false, insertable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
        private OffsetDateTime fechaCreacion;

        @Column(name = "fecha_modificacion", insertable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
        private OffsetDateTime fechaModificacion;
}
