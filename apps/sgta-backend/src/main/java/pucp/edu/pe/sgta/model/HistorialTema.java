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

	@Column(length = 255)
    private String codigo;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "tema_id", nullable = false, foreignKey = @ForeignKey(name = "fk_tema"))
	private Tema tema;

	@Column(length = 255, nullable = false)
	private String titulo;

	@Column(columnDefinition = "TEXT")
	private String resumen;

	@Column(columnDefinition = "TEXT")
    private String metodologia;

    @Column(columnDefinition = "TEXT")
    private String objetivos;

	@Column(name = "descripcion_cambio", columnDefinition = "TEXT")
	private String descripcionCambio;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "estado_tema_id", nullable = false,
				foreignKey = @ForeignKey(name = "fk_historial_tema_estado_tema"))
	private EstadoTema estadoTema;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "proyecto_id",
				foreignKey = @ForeignKey(name = "fk_historial_tema_proyecto"))
	private Proyecto proyecto;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "carrera_id",
				foreignKey = @ForeignKey(name = "fk_historial_tema_carrera"))
	private Carrera carrera;  
	
	@Column(name = "portafolio_url", length = 255)
    private String portafolioUrl;

	@Column(columnDefinition = "TEXT DEFAULT ''")
    private String subareasSnapshot;

    @Column(columnDefinition = "TEXT DEFAULT ''")
    private String asesoresSnapshot;

    @Column(columnDefinition = "TEXT DEFAULT ''")
    private String tesistasSnapshot;


	@Column(nullable = false)
	private Boolean activo = true;

	@Column(name = "fecha_limite", columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private OffsetDateTime fechaLimite;

    @Column(name = "fecha_finalizacion", columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private OffsetDateTime fechaFinalizacion;

	@Column(name = "fecha_creacion", nullable = false, insertable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
	private OffsetDateTime fechaCreacion;

	@Column(name = "fecha_modificacion", insertable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
	private OffsetDateTime fechaModificacion;


}
