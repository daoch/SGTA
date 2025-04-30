package pucp.edu.pe.sgta.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "notificacion")
public class Notificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notificacion_id")
    private Integer id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String mensaje;

    @Column(length = 50, nullable = false)
    private String canal;

    @Column(name = "fecha_creacion", nullable = false,
            columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private OffsetDateTime fechaCreacion;

    @Column(name = "fecha_lectura",
            columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private OffsetDateTime fechaLectura;

    @Column(nullable = false)
    private boolean activo = true;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "modulo_id", nullable = false,
                foreignKey = @ForeignKey(name = "fk_not_modulo"))
    private Modulo modulo;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "tipo_notificacion_id", nullable = false,
                foreignKey = @ForeignKey(name = "fk_not_tipo_notificacion"))
    private TipoNotificacion tipoNotificacion;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false,
                foreignKey = @ForeignKey(name = "fk_not_usuario"))
    private Usuario usuario;

    @Column(name = "fecha_modificacion",
            columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private OffsetDateTime fechaModificacion;
}
