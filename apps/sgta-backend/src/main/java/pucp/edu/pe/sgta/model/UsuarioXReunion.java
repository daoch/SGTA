package pucp.edu.pe.sgta.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "usuario_reunion")
public class UsuarioXReunion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "usuario_reunion_id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "reunion_id", nullable = false, foreignKey = @ForeignKey(name = "fk_ur_reunion"))
    private Reunion reunion;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false, foreignKey = @ForeignKey(name = "fk_ur_usuario"))
    private Usuario usuario;

    @Column(name = "estado_asistencia", length = 50)
    private String estadoAsistencia;

    @Column(name = "estado_detalle", length = 50)
    private String estadoDetalle;

    @Column(name = "fecha_creacion", nullable = false, insertable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP")
    private OffsetDateTime fechaCreacion;

    @Column(name = "fecha_modificacion", nullable = false, insertable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP")
    private OffsetDateTime fechaModificacion;

    @Column(nullable = false)
    private Boolean activo = true;
}
