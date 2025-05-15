package pucp.edu.pe.sgta.model;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pucp.edu.pe.sgta.util.TipoSalaExposicion;

import java.time.OffsetDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "sala_exposicion")
public class SalaExposicion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sala_exposicion_id")
    private Integer id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String nombre;

    @Column(nullable = false)
    private Boolean activo = true;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_sala_exposicion", nullable = false)
    private TipoSalaExposicion tipoSalaExposicion = TipoSalaExposicion.PRESENCIAL;

    @Column(name = "fecha_creacion", nullable = false, insertable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private OffsetDateTime fechaCreacion;

    @Column(name = "fecha_modificacion", insertable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private OffsetDateTime fechaModificacion;
}
