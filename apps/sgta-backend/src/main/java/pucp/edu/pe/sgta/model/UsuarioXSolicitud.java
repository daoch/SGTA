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
@Table(name = "usuario_solicitud")
public class UsuarioXSolicitud {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "usuario_solicitud_id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false,
                foreignKey = @ForeignKey(name = "fk_usuario"))
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "solicitud_id", nullable = false,
                foreignKey = @ForeignKey(name = "fk_solicitud"))
    private Solicitud solicitud;

    @Column(name = "solicitud_completada", nullable = false)
    private boolean solicitudCompletada = false;

    @Column(nullable = false)
    private boolean aprovado = false;

    @Column(columnDefinition = "TEXT")
    private String comentario;

    @Column(nullable = false)
    private boolean destinatario = false;

    @Column(nullable = false)
    private boolean activo = true;

    @Column(name = "fecha_creacion", nullable = false,
            columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private OffsetDateTime fechaCreacion;

    @Column(name = "fecha_modificacion",
            columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private OffsetDateTime fechaModificacion;
}
