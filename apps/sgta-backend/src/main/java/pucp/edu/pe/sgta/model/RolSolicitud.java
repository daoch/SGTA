// src/main/java/pucp/edu/pe/sgta/model/RolSolicitud.java
package pucp.edu.pe.sgta.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
// ... otros imports si usas @NoArgsConstructor, @AllArgsConstructor ...

import java.time.OffsetDateTime;

@Entity
@Table(name = "rol_solicitud")
@Getter
@Setter
// @NoArgsConstructor
// @AllArgsConstructor
public class RolSolicitud {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rol_solicitud_id")
    private Integer id;

    @Column(name = "nombre", nullable = false, unique = true, length = 100)
    private String nombre;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

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
    // Constructores, Getters, Setters (Lombok los genera si está configurado)
}