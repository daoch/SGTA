package pucp.edu.pe.sgta.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pucp.edu.pe.sgta.util.EstadoEntrega;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

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

    @Column(name = "fecha_envio")
    private LocalDate fechaEnvio;

    @Column(name = "comentario", columnDefinition = "TEXT")
    private String comentario;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    private EstadoEntrega estado = EstadoEntrega.no_enviado;

    @Column(name = "activo", nullable = false)
    private Boolean activo = true;

    @Column(name = "fecha_creacion", nullable = false, updatable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private OffsetDateTime fechaCreacion = OffsetDateTime.now();

    @Column(name = "fecha_modificacion", columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private OffsetDateTime fechaModificacion;
    
    @OneToMany(mappedBy = "entregableXTema", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RevisionCriterioEntregable> revisionesCriterio;
} 