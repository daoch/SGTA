package pucp.edu.pe.sgta.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "observacion")
public class Observacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "observacion_id")
    private Integer observacionId;

    @ManyToOne
    @JoinColumn(name = "tipo_observacion_id", referencedColumnName = "tipo_observacion_id")
    private TipoObservacion tipoObservacion;

    @ManyToOne
    @JoinColumn(name = "revision_id", referencedColumnName = "revision_documento_id")
    private RevisionDocumento revisionDocumento;

    @ManyToOne
    @JoinColumn(name = "usuario_creacion_id", referencedColumnName = "usuario_id")
    private Usuario usuarioCreacion;

    @Min(value = 1, message = "El número de página inicial debe ser mayor a 0")
    @Column(name = "numero_pagina_inicio")
    private Integer numeroPaginaInicio;

    @Min(value = 1, message = "El número de página final debe ser mayor a 0")
    @Column(name = "numero_pagina_fin")
    private Integer numeroPaginaFin;

    @NotBlank(message = "El comentario no puede estar vacío")
    @Column(name = "comentario", nullable = false)
    private String comentario;
    @Column(name = "contenido", nullable = false)
    private String contenido;
    
    @Column(name = "es_automatico", nullable = false)
    private Boolean esAutomatico = false;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private ZonedDateTime fechaCreacion = ZonedDateTime.now();

    @Column(name = "fecha_modificacion")
    private ZonedDateTime fechaModificacion;

    @Column(name = "activo")
    private Boolean activo = true;

    
    @Embedded
    private BoundingRect boundingRect;

    @ElementCollection
    @CollectionTable(
      name = "observacion_rect",
      joinColumns = @JoinColumn(name = "observacion_id")
    )
    private List<Rect> rects = new ArrayList<>();
    /**
     * Valida si el rango de páginas es válido (página de inicio <= página de fin)
     */
    @AssertTrue(message = "La página inicial debe ser menor o igual a la página final")
    private boolean esRangoPaginasValido() {
        // Si ambos valores son nulos, no validar el rango
        if (numeroPaginaInicio == null || numeroPaginaFin == null) {
            return true;
        }
        return numeroPaginaInicio <= numeroPaginaFin;
    }
}