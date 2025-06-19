package pucp.edu.pe.sgta.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pucp.edu.pe.sgta.util.EstadoEntrega;

import java.time.OffsetDateTime;
import java.util.List;
import java.math.BigDecimal;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "entregable_x_tema")
public class EntregableXTema {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "entregable_x_tema_id")
    private Integer entregableXTemaId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entregable_id", foreignKey = @ForeignKey(name = "fk_entregable_x_tema_entregable"))
    private Entregable entregable;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tema_id", foreignKey = @ForeignKey(name = "fk_entregable_x_tema_tema"))
    private Tema tema;

    @Column(name = "entregable_id", insertable = false, updatable = false)
    private Integer entregableId;

    @Column(name = "tema_id", insertable = false, updatable = false)
    private Integer temaId;

    @Column(name = "fecha_envio", columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private OffsetDateTime fechaEnvio;

    @Column(name = "comentario", columnDefinition = "TEXT")
    private String comentario;

    @Column(name = "estado", nullable = false)
    private String estadoStr = "no_enviado";

    @Transient
    private EstadoEntrega estado;

    @Column(name = "nota_entregable")
    private BigDecimal notaEntregable;

    @Column(name = "activo", nullable = false)
    private Boolean activo = true;

    @Column(name = "fecha_creacion", nullable = false, updatable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private OffsetDateTime fechaCreacion = OffsetDateTime.now();

    @Column(name = "fecha_modificacion", columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private OffsetDateTime fechaModificacion;

    @OneToMany(mappedBy = "entregableXTema", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RevisionCriterioEntregable> revisionesCriterio;

    @PostLoad
    void fillTransient() {
        if (estadoStr != null) {
            try {
                this.estado = EstadoEntrega.valueOf(estadoStr);
            } catch (IllegalArgumentException e) {
                // Manejar el caso donde el valor en la base de datos no coincide con la
                // enumeración
                this.estado = EstadoEntrega.no_enviado;
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

    public EstadoEntrega getEstado() {
        return this.estado;
    }

    public void setEstado(EstadoEntrega estado) {
        this.estado = estado;
        if (estado != null) {
            this.estadoStr = estado.name();
        }
    }
}