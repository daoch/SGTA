package pucp.edu.pe.sgta.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "historial_tema")
public class HistorialTema {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "historial_tema_id")
	private Integer id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "tema_id", nullable = false, foreignKey = @ForeignKey(name = "fk_tema"))
	private Tema tema;

	@Column(length = 255, nullable = false)
	private String titulo;

	@Column(columnDefinition = "TEXT")
	private String resumen;

	@Column(name = "descripcion_cambio", columnDefinition = "TEXT")
	private String descripcionCambio;

	@Column(name = "estado_tema_id", nullable = false) //new estado
	private Integer estadoTemaId;

	@Column(nullable = false)
	private Boolean activo = true;

	@Column(name = "fecha_creacion", nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
	private OffsetDateTime fechaCreacion;

	@Column(name = "fecha_modificacion", columnDefinition = "TIMESTAMP WITH TIME ZONE")
	private OffsetDateTime fechaModificacion;

}
