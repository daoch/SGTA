package pucp.edu.pe.sgta.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "criterio_exposicion")
public class CriterioExposicion {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "criterio_exposicion_id")
	private Integer id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "exposicion_id", nullable = false, foreignKey = @ForeignKey(name = "fk_ce_exposicion"))
	private Exposicion exposicion;

	@Column(nullable = false, columnDefinition = "TEXT")
	private String nombre;

	@Column(columnDefinition = "TEXT")
	private String descripcion;

	@Column(name = "nota_maxima", nullable = false, precision = 6, scale = 2)
	private BigDecimal notaMaxima;

	@Column(nullable = false)
	private boolean activo = true;

	@Column(name = "fecha_creacion", nullable = false, insertable = false,
			columnDefinition = "TIMESTAMP WITH TIME ZONE")
	private OffsetDateTime fechaCreacion;

	@Column(name = "fecha_modificacion", insertable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
	private OffsetDateTime fechaModificacion;

}
