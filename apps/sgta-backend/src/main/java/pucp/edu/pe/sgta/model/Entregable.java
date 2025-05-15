package pucp.edu.pe.sgta.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pucp.edu.pe.sgta.util.EstadoActividad;

import java.time.OffsetDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "entregable")

public class Entregable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "entregable_id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "etapa_formativa_x_ciclo_id", nullable = false, foreignKey = @ForeignKey(name = "fk_entregable_ef_x_c"))
    private EtapaFormativaXCiclo etapaFormativaXCiclo;

    @Column(length = 150)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "fecha_inicio", nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private OffsetDateTime fechaInicio;

    @Column(name = "fecha_fin", nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private OffsetDateTime fechaFin;

    @Column(name = "estado", nullable = false)
    private String estadoStr = "no_iniciado";
    
    @Transient
    private EstadoActividad estado;

    @Column(name = "es_evaluable", nullable = false)
    private boolean esEvaluable = true;

    @Column(nullable = false)
    private boolean activo = true;

    @Column(name = "fecha_creacion", nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private OffsetDateTime fechaCreacion;

    @Column(name = "fecha_modificacion", columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private OffsetDateTime fechaModificacion;
    
    @PostLoad
    void fillTransient() {
        if (estadoStr != null) {
            try {
                this.estado = EstadoActividad.valueOf(estadoStr);
            } catch (IllegalArgumentException e) {
                // Manejar el caso donde el valor en la base de datos no coincide con la enumeración
                this.estado = EstadoActividad.no_iniciado;
            }
        }
    }
    
    @PrePersist
    @PreUpdate
    void fillPersistent() {
        if (estado != null) {
            this.estadoStr = estado.name();
        }
    }
    
    public EstadoActividad getEstado() {
        return this.estado;
    }
    
    public void setEstado(EstadoActividad estado) {
        this.estado = estado;
        if (estado != null) {
            this.estadoStr = estado.name();
        }
    }
}
