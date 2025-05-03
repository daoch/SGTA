package pucp.edu.pe.sgta.model;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.OffsetDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "sub_area_conocimiento_tema")
@IdClass(SubAreaConocimientoXTema.SubAreaConocimientoXTemaId.class)
public class SubAreaConocimientoXTema {

	@Id
	@Column(name = "sub_area_conocimiento_id")
	private Integer subAreaConocimientoId;

	@Id
	@Column(name = "tema_id")
	private Integer temaId;

	@Column(nullable = false)
	private boolean activo = true;

	@Column(name = "fecha_creacion", nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
	private OffsetDateTime fechaCreacion;

	// Puedes agregar relaciones si quieres (opcional)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "sub_area_conocimiento_id", insertable = false, updatable = false)
	private SubAreaConocimiento subAreaConocimiento;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "tema_id", insertable = false, updatable = false)
	private Tema tema;

	// Clase estática interna que actúa como ID compuesto
	@Getter
	@Setter
	@NoArgsConstructor
	@AllArgsConstructor
	@EqualsAndHashCode
	public static class SubAreaConocimientoXTemaId implements Serializable {

		private Integer subAreaConocimientoId;

		private Integer temaId;

	}

}
