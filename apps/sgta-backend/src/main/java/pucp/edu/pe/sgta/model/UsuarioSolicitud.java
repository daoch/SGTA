// src/main/java/pucp/edu/pe/sgta/model/UsuarioSolicitud.java
package pucp.edu.pe.sgta.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
// ... otros imports si usas @NoArgsConstructor, @AllArgsConstructor ...

import java.time.OffsetDateTime;

@Entity
@Table(name = "usuario_solicitud")
@Getter
@Setter
// @NoArgsConstructor
// @AllArgsConstructor
public class UsuarioSolicitud {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "usuario_solicitud_id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false, foreignKey = @ForeignKey(name = "fk_usuario_us")) // Renombrado fk_usuario para evitar conflicto
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "solicitud_id", nullable = false, foreignKey = @ForeignKey(name = "fk_solicitud_us")) // Renombrado fk_solicitud para evitar conflicto
    private Solicitud solicitud;

    // Nuevos campos para rol y acción
    @ManyToOne(fetch = FetchType.LAZY) // Puede ser EAGER si siempre lo necesitas
    @JoinColumn(name = "rol_solicitud", foreignKey = @ForeignKey(name = "fk_us_rs"))
    private RolSolicitud rolSolicitud; // FK a la tabla rol_solicitud

    @ManyToOne(fetch = FetchType.LAZY) // Puede ser EAGER si siempre lo necesitas
    @JoinColumn(name = "accion_solicitud", foreignKey = @ForeignKey(name = "fk_us_as"))
    private AccionSolicitud accionSolicitud; // FK a la tabla accion_solicitud

    @Column(name = "fecha_accion", columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private OffsetDateTime fechaAccion;

    // Campos antiguos (revisa si aún los necesitas o si rol/accion los reemplazan)
    @Column(name = "solicitud_completada", nullable = false)
    private Boolean solicitudCompletada = false;

    @Column(name = "aprobado", nullable = false)
    private Boolean aprobado = false; // Este campo podría ser redundante si el estado está en la Solicitud principal

    @Column(name = "destinatario", nullable = false)
    private Boolean destinatario = false;


    @Column(name = "comentario", columnDefinition = "TEXT")
    private String comentario;

    @Column(name = "activo", nullable = false)
    private Boolean activo = true;

    @Column(name = "fecha_creacion", nullable = false, updatable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP")
    private OffsetDateTime fechaCreacion;

    @Column(name = "fecha_modificacion", nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP")
    private OffsetDateTime fechaModificacion;

    @PrePersist
    protected void onCreate() {
        fechaCreacion = OffsetDateTime.now();
        fechaModificacion = OffsetDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        fechaModificacion = OffsetDateTime.now();
    }

    // Constructores, Getters, Setters (Lombok o manuales)
}