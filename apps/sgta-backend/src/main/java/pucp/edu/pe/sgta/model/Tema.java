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
@Table(name = "tema")
public class Tema {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "tema_id")
	private Integer id;

	@Column(unique = true, nullable = false)
	private String codigo;

	@Column(length = 255, nullable = false)
	private String titulo;

	@Column(columnDefinition = "TEXT")
	private String resumen;

	@Column(name = "portafolio_url", length = 255)
	private String portafolioUrl;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "estado_tema_id", nullable = false, foreignKey = @ForeignKey(name = "fk_estado_tema"))
	private EstadoTema estadoTema;

	@ManyToOne(fetch = FetchType.LAZY, optional = true)
	@JoinColumn(name = "proyecto_id", nullable = true, foreignKey = @ForeignKey(name = "fk_proyecto")) // there
																										// could
																										// be
																										// no
																										// relation
																										// with
																										// proyecto
	private Proyecto proyecto;

	@Column(nullable = false)
	private boolean activo = true;

	@Column(name = "fecha_creacion", nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
	private OffsetDateTime fechaCreacion;

	@Column(name = "fecha_modificacion", columnDefinition = "TIMESTAMP WITH TIME ZONE")
	private OffsetDateTime fechaModificacion;

}
