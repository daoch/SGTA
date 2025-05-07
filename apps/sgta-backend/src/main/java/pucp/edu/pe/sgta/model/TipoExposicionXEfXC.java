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
@Table(name = "tipo_exposicion_x_ef_x_c")
public class TipoExposicionXEfXC {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tipo_exposicion_x_ef_x_c_id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "etapa_formativa_x_ciclo_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_texefc_ef_x_c")
    )
    private EtapaFormativaXCiclo etapaFormativaXCiclo;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "tipo_exposicion_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_texefc_tipo_exposicion")
    )
    private TipoExposicion tipoExposicion;

    @Column(nullable = false)
    private Boolean activo = true;

    @Column(name = "fecha_creacion", nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private OffsetDateTime fechaCreacion;

    @Column(name = "fecha_modificacion", columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private OffsetDateTime fechaModificacion;
}

