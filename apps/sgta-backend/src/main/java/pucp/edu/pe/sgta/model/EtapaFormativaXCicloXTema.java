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
@Table(name = "etapa_formativa_x_ciclo_x_tema")
public class EtapaFormativaXCicloXTema {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "etapa_formativa_x_ciclo_x_tema_id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY,optional = false)
    @JoinColumn(name = "etapa_formativa_x_ciclo_id", nullable = false, foreignKey = @ForeignKey(name = "fk_efcxt_efc"))
    private EtapaFormativaXCiclo etapaFormativaXCiclo;

    @ManyToOne(fetch = FetchType.LAZY,optional = false)
    @JoinColumn(name = "tema_id", nullable = false, foreignKey = @ForeignKey(name = "fk_efcxt_tema"))
    private Tema tema;

    @Column(name = "aprobado")
    private Boolean aprobado;

    @Column(name = "activo", nullable = false)
    private Boolean activo=true;

    @Column(name = "fecha_creacion", nullable = false, insertable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private OffsetDateTime fechaCreacion;

    @Column(name = "fecha_modificacion", insertable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private OffsetDateTime fechaModificacion;
}
