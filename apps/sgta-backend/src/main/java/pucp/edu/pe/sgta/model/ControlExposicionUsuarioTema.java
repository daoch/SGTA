package pucp.edu.pe.sgta.model;

import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pucp.edu.pe.sgta.util.EstadoExposicionUsuario;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "control_exposicion_usuario")
public class ControlExposicionUsuarioTema {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "control_exposicion_usuario_id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "exposicion_x_tema_id", nullable = false, foreignKey = @ForeignKey(name = "fk_ceu_exposicion_x_tema"))
    private ExposicionXTema exposicionXTema;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_x_tema_id", nullable = false, foreignKey = @ForeignKey(name = "fk_ceu_usuario_x_tema"))
    private UsuarioXTema usuario;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String observacionesFinalesExposicion;

    @Column(nullable = false)
    private boolean asistio = true;

    @Column(nullable = false)
    private boolean activo = true;

    @Column(name = "fecha_creacion", nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private OffsetDateTime fechaCreacion;

    @Column(name = "fecha_modificacion", columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private OffsetDateTime fechaModificacion;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_exposicion_usuario", nullable = false)
    private EstadoExposicionUsuario estadoExposicion = EstadoExposicionUsuario.ESPERANDO_RESPUESTA;
}
