package pucp.edu.pe.sgta.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "criterio_entregable")
public class CriterioEntregable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "criterio_entregable_id")
	private Integer id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "entregable_id", nullable = false,
			foreignKey = @ForeignKey(name = "fk_criterio_entregable_entregable"))
	private Entregable entregable;

	@NotBlank(message = "El nombre del criterio no puede estar vacío")
	@Size(max = 100, message = "El nombre del criterio no puede exceder los 100 caracteres")
	@Column(name = "nombre", length = 100, nullable = false)
	private String nombre;

	@DecimalMin(value = "0.01", message = "La nota máxima debe ser mayor a 0")
	@Column(name = "nota_maxima", precision = 5, scale = 2)
	private BigDecimal notaMaxima;

	@Column(name = "descripcion", columnDefinition = "TEXT")
	private String descripcion;

	@Column(name = "activo", nullable = false)
	private Boolean activo = true;

	@Column(name = "fecha_creacion", nullable = false, insertable = false,
			columnDefinition = "TIMESTAMP WITH TIME ZONE")
	private OffsetDateTime fechaCreacion;

	@Column(name = "fecha_modificacion", insertable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
	private OffsetDateTime fechaModificacion;

	@OneToMany(mappedBy = "criterioEntregable", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<RevisionCriterioEntregable> revisionesCriterio;

	@AssertTrue(message = "La nota máxima debe ser un valor positivo")
	private boolean esNotaMaximaValida() {
		return notaMaxima == null || notaMaxima.compareTo(BigDecimal.ZERO) > 0;
	}

}
