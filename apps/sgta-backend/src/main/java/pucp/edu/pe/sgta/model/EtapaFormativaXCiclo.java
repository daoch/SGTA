package pucp.edu.pe.sgta.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "etapa_formativa_x_ciclo")
public class EtapaFormativaXCiclo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "etapa_formativa_x_ciclo_id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "etapa_formativa_id", nullable = false, foreignKey = @ForeignKey(name = "fk_efc_etapa_formativa"))
    private EtapaFormativa etapaFormativa;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ciclo_id", nullable = false, foreignKey = @ForeignKey(name = "fk_efc_ciclo"))
    private Ciclo ciclo;

    @Column(name = "estado", nullable = false)
    private String estado;

    @Column(nullable = false)
    private Boolean activo = true;

    @Column(name = "fecha_creacion", nullable = false, insertable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private OffsetDateTime fechaCreacion;

    @Column(name = "fecha_modificacion", insertable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private OffsetDateTime fechaModificacion;



}
