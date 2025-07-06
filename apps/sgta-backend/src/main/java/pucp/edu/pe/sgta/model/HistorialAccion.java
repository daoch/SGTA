package pucp.edu.pe.sgta.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
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
@Table(name = "historial_acciones")
public class HistorialAccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "historial_id")
    private Long id;                               // BIGSERIAL → Long

    @Column(name = "id_cognito", nullable = false)
    private String idCognito;                      // usuario que ejecuta la acción

    @Column(
        name = "fecha_creacion",
        nullable = false,
        insertable = false,
        updatable = false,                         // la BD lo pone por DEFAULT
        columnDefinition = "TIMESTAMP WITH TIME ZONE"
    )
    private OffsetDateTime fechaCreacion;          // marca temporal

    @Column(columnDefinition = "TEXT", nullable = false)
    private String accion;                         // descripción de la acción
}
